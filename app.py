import csv
import hashlib
import io
import ipaddress
import json
import math
import os
import re
import secrets
import socket
import sqlite3
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

from cryptography.fernet import Fernet
from flask import Flask, abort, g, jsonify, request, send_file, session
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.middleware.proxy_fix import ProxyFix
import assessment
import prompts
import meadow
import learning
import webstudio
import lessonkit
import eras
import pets

ROOT = Path(__file__).parent
DATA = Path(os.environ.get('DATA_DIR', ROOT / 'data'))
DATA.mkdir(parents=True, exist_ok=True, mode=0o700)


def private_file(name, factory):
    path = DATA / name
    try:
        fd = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, 'w') as f:
            f.write(factory())
    except FileExistsError:
        pass
    return path.read_text().strip()


app = Flask(__name__, static_folder='static')
app.config.update(SECRET_KEY=private_file('session.key', lambda: secrets.token_hex(32)),
                  MAX_CONTENT_LENGTH=12 * 1024 * 1024, SESSION_COOKIE_HTTPONLY=True,
                  SESSION_COOKIE_SAMESITE='Lax', SESSION_COOKIE_SECURE=os.environ.get('HTTPS') == '1',
                  PERMANENT_SESSION_LIFETIME=timedelta(hours=12))
if os.environ.get('BEHIND_PROXY') == '1':
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1)
cipher = Fernet(private_file('encryption.key', lambda: Fernet.generate_key().decode()).encode())
SCHEMA = '''
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
 password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('teacher','student')), demo INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS classes (id INTEGER PRIMARY KEY, teacher_id INTEGER NOT NULL REFERENCES users(id),
 name TEXT NOT NULL, subject TEXT NOT NULL, grade TEXT NOT NULL, code TEXT UNIQUE NOT NULL, demo INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS members (class_id INTEGER REFERENCES classes(id), user_id INTEGER REFERENCES users(id), PRIMARY KEY(class_id,user_id));
CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY, owner_id INTEGER REFERENCES users(id), kind TEXT NOT NULL,
 title TEXT NOT NULL, body TEXT NOT NULL, meta TEXT NOT NULL DEFAULT '{}', class_id INTEGER REFERENCES classes(id),
 published INTEGER DEFAULT 0, created TEXT NOT NULL, updated TEXT NOT NULL, demo INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS assignments (id INTEGER PRIMARY KEY, teacher_id INTEGER REFERENCES users(id), class_id INTEGER REFERENCES classes(id),
 title TEXT NOT NULL, description TEXT NOT NULL, questions TEXT NOT NULL, deadline TEXT NOT NULL DEFAULT '',
 published INTEGER DEFAULT 0, created TEXT NOT NULL, demo INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY, assignment_id INTEGER REFERENCES assignments(id), student_id INTEGER REFERENCES users(id),
 answers TEXT NOT NULL, grades TEXT NOT NULL, status TEXT NOT NULL, submitted TEXT NOT NULL, reviewed TEXT,
 UNIQUE(assignment_id,student_id));
CREATE TABLE IF NOT EXISTS imports (id INTEGER PRIMARY KEY, teacher_id INTEGER REFERENCES users(id), class_id INTEGER REFERENCES classes(id),
 name TEXT NOT NULL, score REAL NOT NULL, total REAL NOT NULL, skill TEXT NOT NULL, batch TEXT NOT NULL, created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS agents (id INTEGER PRIMARY KEY, owner_id INTEGER REFERENCES users(id), name TEXT NOT NULL, description TEXT NOT NULL,
 instructions TEXT NOT NULL, knowledge TEXT NOT NULL, class_id INTEGER REFERENCES classes(id), published INTEGER DEFAULT 0, demo INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id), agent_id INTEGER REFERENCES agents(id),
 role TEXT NOT NULL, content TEXT NOT NULL, created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, user_id INTEGER, action TEXT NOT NULL, created TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires REAL NOT NULL);
CREATE TABLE IF NOT EXISTS grading_drafts (submission_id INTEGER PRIMARY KEY REFERENCES submissions(id),
 submitted TEXT NOT NULL, grades TEXT NOT NULL, created TEXT NOT NULL, reviewed TEXT);
CREATE TABLE IF NOT EXISTS exploration_progress (user_id INTEGER REFERENCES users(id), station_id TEXT NOT NULL,
 visited_at TEXT NOT NULL, last_visit TEXT NOT NULL, completed_at TEXT, attempts INTEGER NOT NULL DEFAULT 0,
 last_correct INTEGER, PRIMARY KEY(user_id,station_id));
CREATE TABLE IF NOT EXISTS exploration_messages (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id),
 station_id TEXT NOT NULL, agent_id INTEGER REFERENCES agents(id), role TEXT NOT NULL, content TEXT NOT NULL, created TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS exploration_conversation ON exploration_messages(user_id,station_id,agent_id,id);
CREATE INDEX IF NOT EXISTS submission_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS message_conversation ON messages(user_id,agent_id,id);
'''

SCHEMA += learning.SCHEMA + webstudio.SCHEMA + lessonkit.SCHEMA + eras.SCHEMA + pets.SCHEMA

def now():
    return datetime.now(timezone.utc).isoformat(timespec='microseconds')


def db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATA / 'school.db', timeout=20)
        g.db.row_factory = sqlite3.Row
        g.db.execute('PRAGMA foreign_keys=ON')
    return g.db


@app.teardown_appcontext
def close_db(_):
    conn = g.pop('db', None)
    if conn:
        conn.close()


def rows(sql, params=()):
    return [dict(x) for x in db().execute(sql, params).fetchall()]


def one(sql, params=()):
    value = db().execute(sql, params).fetchone()
    return dict(value) if value else None


def execute(sql, params=()):
    cur = db().execute(sql, params)
    db().commit()
    return cur.lastrowid


def jdump(value):
    return json.dumps(value, ensure_ascii=False)


def fail(message, code=400):
    abort(code, description=message)


def payload():
    value = request.get_json(silent=True)
    if not isinstance(value, dict):
        fail('请求格式不正确')
    return value


def text_field(obj, name, limit=200, required=True):
    value = obj.get(name, '')
    if not isinstance(value, str) or len(value) > limit or (required and not value.strip()):
        fail(f'{name} 不能为空或超过 {limit} 字')
    return value.strip()


def integer(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        fail('编号格式不正确')


def audit(action):
    execute('INSERT INTO events(user_id,action,created) VALUES(?,?,?)', (session.get('uid'), action, now()))


def auth(role=None):
    def decorator(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            g.user = one('SELECT id,username,name,role,demo FROM users WHERE id=?', (session.get('uid'),))
            if not g.user:
                fail('请先登录', 401)
            if role and g.user['role'] != role:
                fail('当前账号没有此操作权限', 403)
            if request.method not in ('GET', 'HEAD', 'OPTIONS'):
                if not secrets.compare_digest(request.headers.get('X-CSRF-Token', ''), session.get('csrf', '-') ):
                    fail('登录状态已更新，请刷新页面重试', 403)
            return fn(*args, **kwargs)
        return wrapped
    return decorator


def bump_limit(key, seconds):
    current = time.time()
    db().execute('DELETE FROM limits WHERE expires<?', (current,))
    db().execute('INSERT INTO limits(bucket,count,expires) VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1', (key, current+seconds))
    db().commit()
    return one('SELECT count FROM limits WHERE bucket=?', (key,))['count']


def limit_count(key):
    row = one('SELECT count FROM limits WHERE bucket=? AND expires>=?', (key, time.time()))
    return row['count'] if row else 0


def throttle(bucket, maximum=10, seconds=60):
    key = bucket + ':' + str(session.get('uid') or request.remote_addr)
    if bump_limit(key, seconds) > maximum:
        fail('操作较频繁，请稍后再试', 429)


def my_class(cid, teacher=False):
    c = one('SELECT * FROM classes WHERE id=?', (integer(cid),))
    if not c:
        fail('班级不存在', 404)
    if g.user['role'] == 'teacher':
        allowed = c['teacher_id'] == g.user['id']
    else:
        allowed = not teacher and one('SELECT 1 FROM members WHERE class_id=? AND user_id=?', (c['id'], g.user['id']))
    if not allowed:
        fail('无权访问此班级', 403)
    return c


def class_ids():
    if g.user['role'] == 'teacher':
        return [x['id'] for x in rows('SELECT id FROM classes WHERE teacher_id=?', (g.user['id'],))]
    return [x['class_id'] for x in rows('SELECT class_id FROM members WHERE user_id=?', (g.user['id'],))]


def owned(table, rid):
    if table not in ('documents', 'agents'):
        raise ValueError('invalid table')
    result = one(f'SELECT * FROM {table} WHERE id=?', (rid,))
    if not result:
        fail('内容不存在', 404)
    if result['owner_id'] != g.user['id']:
        fail('无权修改此内容', 403)
    return result


@app.before_request
def same_origin():
    if request.method not in ('GET', 'HEAD', 'OPTIONS'):
        origin = request.headers.get('Origin')
        if origin and urllib.parse.urlparse(origin).netloc != request.host:
            fail('不允许跨站请求', 403)


@app.after_request
def security_headers(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'same-origin'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    response.headers['Content-Security-Policy'] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; media-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
    if getattr(g, 'webstudio_content', False):
        response.headers['Content-Security-Policy'] = webstudio.CONTENT_POLICY
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['Referrer-Policy'] = 'no-referrer'
    if request.path.startswith('/web/'):
        response.headers['Referrer-Policy'] = 'no-referrer'
        response.headers['X-Robots-Tag'] = 'noindex, nofollow, noarchive'
        response.headers['Cache-Control'] = 'no-store'
    if request.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response


@app.errorhandler(400)
@app.errorhandler(401)
@app.errorhandler(403)
@app.errorhandler(404)
@app.errorhandler(405)
@app.errorhandler(409)
@app.errorhandler(413)
@app.errorhandler(429)
@app.errorhandler(502)
@app.errorhandler(503)
def api_error(error):
    return jsonify(error=str(error.description)), error.code


@app.errorhandler(500)
def internal_error(error):
    app.logger.error('Request failed: %s', error)
    return jsonify(error='服务器处理失败，请稍后重试'), 500


@app.get('/')
def index():
    return app.send_static_file('index.html')


@app.get('/intro')
@app.get('/intro/')
def introduction():
    return app.send_static_file('intro/index.html')


@app.get('/api/health')
def health():
    db().execute('SELECT 1').fetchone()
    return jsonify(status='ok', version='9.2.0')


@app.post('/api/login')
def login():
    # A whole class often shares one school IP, so the IP cap is generous and
    # wrong passwords are limited per account instead.
    throttle('login-ip', 300, 300)
    data = payload()
    username = text_field(data, 'username', 60)
    failures = 'login-fail:' + username.lower()
    if limit_count(failures) >= 8:
        fail('这个账号尝试次数过多，请 10 分钟后再试，或请老师重置密码', 429)
    user = one('SELECT * FROM users WHERE username=?', (username,))
    password = text_field(data, 'password', 200)
    if not user or not check_password_hash(user['password'], password):
        bump_limit(failures, 600)
        fail('账号或密码不正确', 401)
    session.clear()
    session.update(uid=user['id'], csrf=secrets.token_urlsafe(24))
    session.permanent = True
    audit('登录')
    return jsonify(ok=True)


@app.post('/api/register')
def register():
    throttle('register', 60, 3600)
    data = payload()
    c = one('SELECT * FROM classes WHERE code=?', (text_field(data, 'code', 20).upper(),))
    if not c:
        fail('班级邀请码不正确')
    name = text_field(data, 'name', 40)
    username = text_field(data, 'username', 40)
    password = text_field(data, 'password', 200)
    if not re.fullmatch(r'[A-Za-z0-9_.-]{3,40}', username) or len(password) < 10:
        fail('账号需为 3–40 位字母、数字或下划线，密码至少 10 位')
    try:
        uid = db().execute('INSERT INTO users(username,name,password,role) VALUES(?,?,?,?)', (username, name, generate_password_hash(password), 'student')).lastrowid
        db().execute('INSERT INTO members VALUES(?,?)', (c['id'], uid))
        db().commit()
    except sqlite3.IntegrityError:
        db().rollback()
        fail('账号已存在', 409)
    session.clear()
    session.update(uid=uid, csrf=secrets.token_urlsafe(24))
    session.permanent = True
    return jsonify(ok=True)


@app.get('/api/me')
@auth()
def me():
    return jsonify(user=g.user, csrf=session['csrf'], ai_configured=bool(setting('api_key')), classes=accessible_classes())


@app.post('/api/logout')
@auth()
def logout():
    session.clear()
    return jsonify(ok=True)


@app.post('/api/password')
@auth()
def password():
    data = payload()
    record = one('SELECT password FROM users WHERE id=?', (g.user['id'],))
    if not check_password_hash(record['password'], text_field(data, 'old', 200)):
        fail('原密码不正确')
    new = text_field(data, 'password', 200)
    if len(new) < 10:
        fail('密码至少 10 位')
    execute('UPDATE users SET password=? WHERE id=?', (generate_password_hash(new), g.user['id']))
    session['csrf'] = secrets.token_urlsafe(24)
    audit('修改密码')
    return jsonify(ok=True, csrf=session['csrf'])


def accessible_classes():
    if g.user['role'] == 'teacher':
        return rows('SELECT c.*,(SELECT count(*) FROM members m WHERE m.class_id=c.id) students FROM classes c WHERE teacher_id=?', (g.user['id'],))
    return rows('SELECT c.id,c.name,c.subject,c.grade,c.demo FROM classes c JOIN members m ON m.class_id=c.id WHERE m.user_id=?', (g.user['id'],))


@app.get('/api/classes')
@auth()
def get_classes():
    return jsonify(accessible_classes())


@app.post('/api/classes')
@auth('teacher')
def create_class():
    data = payload()
    cid = execute('INSERT INTO classes(teacher_id,name,subject,grade,code) VALUES(?,?,?,?,?)', (g.user['id'], text_field(data, 'name', 60), text_field(data, 'subject', 40), text_field(data, 'grade', 40), secrets.token_hex(4).upper()))
    audit('创建班级')
    return jsonify(id=cid)


@app.post('/api/classes/join')
@auth('student')
def join_class():
    throttle('join', 10, 300)
    c = one('SELECT id FROM classes WHERE code=?', (text_field(payload(), 'code', 20).upper(),))
    if not c:
        fail('邀请码不正确')
    execute('INSERT OR IGNORE INTO members VALUES(?,?)', (c['id'], g.user['id']))
    return jsonify(ok=True)


@app.get('/api/classes/<int:cid>/students')
@auth('teacher')
def roster(cid):
    my_class(cid, True)
    return jsonify(rows('SELECT u.id,u.name,u.username,u.demo FROM users u JOIN members m ON m.user_id=u.id WHERE m.class_id=? ORDER BY u.id', (cid,)))


@app.post('/api/classes/<int:cid>/students')
@auth('teacher')
def add_student(cid):
    my_class(cid, True)
    data = payload()
    username = text_field(data, 'username', 40)
    password = text_field(data, 'password', 200)
    if not re.fullmatch(r'[A-Za-z0-9_.-]{3,40}', username) or len(password) < 10:
        fail('账号格式不正确，或密码少于 10 位')
    try:
        uid = db().execute('INSERT INTO users(username,name,password,role) VALUES(?,?,?,?)', (username, text_field(data, 'name', 40), generate_password_hash(password), 'student')).lastrowid
        db().execute('INSERT INTO members VALUES(?,?)', (cid, uid))
        db().commit()
    except sqlite3.IntegrityError:
        db().rollback()
        fail('账号已存在；请学生登录后使用班级邀请码加入', 409)
    return jsonify(id=uid)


@app.put('/api/classes/<int:cid>')
@auth('teacher')
def update_class(cid):
    my_class(cid, True)
    data = payload()
    name = text_field(data, 'name', 60)
    execute('UPDATE classes SET name=?,grade=COALESCE(NULLIF(?,""),grade),subject=COALESCE(NULLIF(?,""),subject) WHERE id=?',
            (name, text_field(data, 'grade', 40, False), text_field(data, 'subject', 40, False), cid))
    audit('修改班级信息')
    return jsonify(ok=True)


@app.post('/api/classes/<int:cid>/code')
@auth('teacher')
def regenerate_code(cid):
    my_class(cid, True)
    for _ in range(5):
        code = secrets.token_hex(4).upper()
        if not one('SELECT 1 FROM classes WHERE code=?', (code,)):
            break
    execute('UPDATE classes SET code=? WHERE id=?', (code, cid))
    audit('更换班级邀请码')
    return jsonify(code=code)


def class_student(cid, uid):
    my_class(cid, True)
    student = one('SELECT u.id,u.name,u.username FROM users u JOIN members m ON m.user_id=u.id WHERE m.class_id=? AND u.id=? AND u.role=?', (cid, uid, 'student'))
    if not student:
        fail('这个学生不在班级里', 404)
    return student


@app.post('/api/classes/<int:cid>/students/<int:uid>/password')
@auth('teacher')
def reset_student_password(cid, uid):
    student = class_student(cid, uid)
    password = text_field(payload(), 'password', 200)
    if len(password) < 10:
        fail('新密码至少 10 位')
    execute('UPDATE users SET password=? WHERE id=?', (generate_password_hash(password), student['id']))
    db().execute('DELETE FROM limits WHERE bucket=?', ('login-fail:' + student['username'].lower(),))
    db().commit()
    audit('重置学生密码')
    return jsonify(ok=True)


@app.delete('/api/classes/<int:cid>/students/<int:uid>')
@auth('teacher')
def remove_student(cid, uid):
    class_student(cid, uid)
    execute('DELETE FROM members WHERE class_id=? AND user_id=?', (cid, uid))
    audit('将学生移出班级')
    return jsonify(ok=True)


@app.get('/api/documents')
@auth()
def get_documents():
    if g.user['role'] == 'teacher':
        result = rows('SELECT * FROM documents WHERE owner_id=? ORDER BY updated DESC', (g.user['id'],))
    else:
        result = rows('SELECT d.* FROM documents d JOIN members m ON m.class_id=d.class_id WHERE m.user_id=? AND d.published=1 ORDER BY updated DESC', (g.user['id'],))
    for d in result:
        d['meta'] = json.loads(d['meta'])
    return jsonify(result)


def save_document(data, rid=None):
    kind = text_field(data, 'kind', 20)
    if kind not in ('lesson', 'resource', 'design', 'reflection', 'media'):
        fail('未知内容类型')
    cid = data.get('class_id') or None
    if cid:
        my_class(cid, True)
    published = bool(data.get('published'))
    if published and not cid:
        fail('发布给学生前请选择班级')
    meta = data.get('meta', {})
    if not isinstance(meta, dict) or len(jdump(meta)) > 10000:
        fail('附加信息过长')
    args = (kind, text_field(data, 'title', 160), text_field(data, 'body', 60000), jdump(meta), cid, int(published), now())
    if rid:
        owned('documents', rid)
        execute('UPDATE documents SET kind=?,title=?,body=?,meta=?,class_id=?,published=?,updated=? WHERE id=?', args + (rid,))
    else:
        rid = execute('INSERT INTO documents(kind,title,body,meta,class_id,published,updated,created,owner_id) VALUES(?,?,?,?,?,?,?,?,?)', args + (now(), g.user['id']))
    audit('保存教学内容')
    return rid


@app.post('/api/documents')
@auth('teacher')
def create_document():
    return jsonify(id=save_document(payload()))


@app.put('/api/documents/<int:rid>')
@auth('teacher')
def update_document(rid):
    return jsonify(id=save_document(payload(), rid))


@app.delete('/api/documents/<int:rid>')
@auth('teacher')
def delete_document(rid):
    owned('documents', rid)
    execute('DELETE FROM documents WHERE id=?', (rid,))
    return jsonify(ok=True)


@app.delete('/api/assignments/<int:rid>')
@auth('teacher')
def delete_assignment(rid):
    a = assignment(rid)
    my_class(a['class_id'], True)
    submitted = one('SELECT count(*) n FROM submissions WHERE assignment_id=?', (rid,))['n']
    if submitted and request.args.get('force') != '1':
        fail(f'已有 {submitted} 份学生提交，删除会一并清除这些作答和批改', 409)
    c = db()
    c.execute('DELETE FROM grading_drafts WHERE submission_id IN (SELECT id FROM submissions WHERE assignment_id=?)', (rid,))
    c.execute('DELETE FROM submissions WHERE assignment_id=?', (rid,))
    c.execute('DELETE FROM assignments WHERE id=?', (rid,))
    c.commit()
    audit('删除作业')
    return jsonify(ok=True)


def validate_questions(qs):
    try:
        return assessment.validate_questions(qs)
    except ValueError as error:
        fail(str(error))


def assignment_version(value):
    fields = [value[k] for k in ('title', 'description', 'questions', 'deadline', 'class_id')]
    return hashlib.sha256(jdump(fields).encode()).hexdigest()[:24]


def assignment(rid):
    value = one('SELECT * FROM assignments WHERE id=?', (rid,))
    if not value:
        fail('作业不存在', 404)
    my_class(value['class_id'])
    if g.user['role'] == 'student' and not value['published']:
        fail('作业尚未发布', 404)
    value['questions'] = json.loads(value['questions'])
    return value


@app.get('/api/assignments')
@auth()
def assignments():
    if g.user['role'] == 'teacher':
        result = rows('SELECT a.*,c.name class_name,(SELECT count(*) FROM submissions s WHERE s.assignment_id=a.id) submitted_count,(SELECT count(*) FROM submissions s WHERE s.assignment_id=a.id AND s.status!=\'reviewed\') pending_count,(SELECT count(*) FROM members m WHERE m.class_id=a.class_id) student_count FROM assignments a JOIN classes c ON c.id=a.class_id WHERE a.teacher_id=? ORDER BY a.id DESC', (g.user['id'],))
    else:
        result = rows('SELECT a.*,c.name class_name FROM assignments a JOIN classes c ON c.id=a.class_id JOIN members m ON m.class_id=c.id WHERE m.user_id=? AND a.published=1 ORDER BY a.id DESC', (g.user['id'],))
    for a in result:
        if g.user['role'] == 'teacher':
            a['version'] = assignment_version(a)
        a['questions'] = json.loads(a['questions'])
        a['total'] = sum(q['points'] for q in a['questions'])
        if g.user['role'] == 'student':
            a['submission'] = one('SELECT * FROM submissions WHERE assignment_id=? AND student_id=?', (a['id'], g.user['id']))
            if a['submission']:
                for key in ('answers', 'grades'):
                    a['submission'][key] = json.loads(a['submission'][key])
                if a['submission']['status'] != 'reviewed':
                    a['submission']['grades'] = []
            for q in a['questions']:
                reviewed = a['submission'] and a['submission']['status'] == 'reviewed'
                if reviewed:
                    q['reference_answer'] = q.get('answer', '')
                for key in ('answer', 'rubric', 'accepted_answers', 'case_sensitive'):
                    q.pop(key, None)
                if not reviewed:
                    q.pop('explanation', None)
    return jsonify(result)


@app.post('/api/assignments')
@auth('teacher')
def create_assignment():
    data = payload()
    cid = integer(data.get('class_id'))
    my_class(cid, True)
    deadline = text_field(data, 'deadline', 60, False)
    if deadline:
        try:
            parsed = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
            if parsed.tzinfo is None:
                fail('截止时间须包含时区')
        except ValueError:
            fail('截止时间格式不正确')
    rid = execute('INSERT INTO assignments(teacher_id,class_id,title,description,questions,deadline,published,created) VALUES(?,?,?,?,?,?,?,?)',
                  (g.user['id'], cid, text_field(data, 'title', 160), text_field(data, 'description', 5000, False), jdump(validate_questions(data.get('questions'))), deadline, int(bool(data.get('published'))), now()))
    audit('创建作业')
    return jsonify(id=rid)


@app.put('/api/assignments/<int:rid>')
@auth('teacher')
def update_assignment(rid):
    a = assignment(rid)
    data = payload()
    raw = one('SELECT * FROM assignments WHERE id=?', (rid,))
    if data.get('version') != assignment_version(raw):
        fail('作业已在其他窗口修改，请重新打开', 409)
    if one('SELECT 1 FROM submissions WHERE assignment_id=?', (rid,)):
        fail('已有学生提交，题目不可改写；请复制后修改以保留原始作答', 409)
    cid = integer(data.get('class_id'))
    my_class(cid, True)
    deadline = text_field(data, 'deadline', 60, False)
    if deadline:
        try:
            parsed = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
            if parsed.tzinfo is None:
                fail('截止时间须包含时区')
        except ValueError:
            fail('截止时间格式不正确')
    questions = jdump(validate_questions(data.get('questions')))
    updated = db().execute('UPDATE assignments SET title=?,description=?,questions=?,deadline=?,class_id=?,published=? WHERE id=? AND questions=? AND title=? AND description=? AND deadline=? AND class_id=? AND NOT EXISTS(SELECT 1 FROM submissions WHERE assignment_id=?)',
                          (text_field(data, 'title', 160), text_field(data, 'description', 5000, False), questions, deadline, cid, int(bool(data.get('published'))), rid, raw['questions'], raw['title'], raw['description'], raw['deadline'], raw['class_id'], rid))
    db().commit()
    if not updated.rowcount:
        fail('作业已更新或已有学生提交，请重新打开', 409)
    audit('修改作业草稿')
    return jsonify(id=rid)


@app.post('/api/questions/import')
@auth('teacher')
def import_questions():
    f = request.files.get('file')
    try:
        if f:
            qs = assessment.parse_import(f.filename or '', f.read(2*1024*1024+1))
        else:
            data = payload()
            source = text_field(data, 'text', 100000)
            qs = assessment.validate_questions(assessment.parse_text(source))
    except (ValueError, csv.Error) as error:
        fail(str(error))
    return jsonify(questions=qs, count=len(qs), total=sum(q['points'] for q in qs))


@app.get('/api/questions/template/<kind>')
@auth('teacher')
def question_template(kind):
    if kind == 'txt':
        content = assessment.TEXT_TEMPLATE
        mime = 'text/plain'
    elif kind == 'csv':
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(['题型', '题干', '选项A', '选项B', '选项C', '选项D', '答案', '分值', '知识点', '评分要点', '解析', '可接受答案'])
        writer.writerow(['单选题', '哪一种结构根据条件选择执行分支？', '顺序结构', '选择结构', '循环结构', '数据结构', 'B', 10, '算法与控制', '', '选择结构根据条件结果执行不同分支。', ''])
        writer.writerow(['填空题', '重复执行一组指令的结构叫作____结构。', '', '', '', '', '循环', 10, '算法与控制', '', '', '循环|循环结构'])
        content = buf.getvalue()
        mime = 'text/csv'
    elif kind == 'json':
        content = jdump(dict(title='导入示例', questions=assessment.validate_questions(assessment.parse_text(assessment.TEXT_TEMPLATE))))
        mime = 'application/json'
    else:
        fail('模板不存在', 404)
    return send_file(io.BytesIO(content.encode('utf-8-sig' if kind == 'csv' else 'utf-8')), mimetype=mime, as_attachment=True, download_name='竞潮小学题目模板.'+kind)


@app.put('/api/assignments/<int:rid>/publish')
@auth('teacher')
def publish_assignment(rid):
    assignment(rid)
    execute('UPDATE assignments SET published=? WHERE id=?', (int(bool(payload().get('published'))), rid))
    audit('更新作业发布状态')
    return jsonify(ok=True)


@app.post('/api/assignments/<int:rid>/submit')
@auth('student')
def submit(rid):
    a = assignment(rid)
    if a['deadline'] and datetime.now(timezone.utc) > datetime.fromisoformat(a['deadline'].replace('Z','+00:00')):
        fail('作业已截止，请联系老师')
    old = one('SELECT id,status FROM submissions WHERE assignment_id=? AND student_id=?', (rid, g.user['id']))
    if old and old['status'] == 'reviewed':
        fail('老师已确认批改，不能再次提交', 409)
    answers = payload().get('answers')
    if not isinstance(answers, dict):
        fail('答案格式不正确')
    clean, grades = {}, []
    for q in a['questions']:
        answer = answers.get(q['id'], '')
        try:
            clean[q['id']] = assessment.clean_student_answer(q, answer)
        except ValueError as error:
            fail(f'第 {q["id"]} 题：{error}')
        grades.append(assessment.rule_grade(q, clean[q['id']]))
    db().execute('BEGIN IMMEDIATE')
    current = one('SELECT questions,published,class_id,deadline FROM assignments WHERE id=?', (rid,))
    if not current or not current['published'] or current['class_id'] != a['class_id'] or json.loads(current['questions']) != a['questions'] or current['deadline'] != a['deadline']:
        db().rollback()
        fail('作业内容或发布状态已更新，请重新打开后提交', 409)
    updated = db().execute('INSERT INTO submissions(assignment_id,student_id,answers,grades,status,submitted) VALUES(?,?,?,?,?,?) ON CONFLICT(assignment_id,student_id) DO UPDATE SET answers=excluded.answers,grades=excluded.grades,status=excluded.status,submitted=excluded.submitted WHERE submissions.status != ?', (rid, g.user['id'], jdump(clean), jdump(grades), 'submitted', now(), 'reviewed'))
    if not updated.rowcount:
        db().rollback()
        fail('老师已确认批改，不能再次提交', 409)
    db().execute('DELETE FROM grading_drafts WHERE submission_id IN (SELECT id FROM submissions WHERE assignment_id=? AND student_id=?)', (rid, g.user['id']))
    db().commit()
    audit('提交作业')
    return jsonify(ok=True)


@app.get('/api/assignments/<int:rid>/submissions')
@auth('teacher')
def get_submissions(rid):
    assignment(rid)
    result = rows('SELECT s.*,u.name,u.username FROM submissions s JOIN users u ON u.id=s.student_id WHERE assignment_id=? ORDER BY s.id', (rid,))
    for s in result:
        s['answers'], s['grades'] = json.loads(s['answers']), json.loads(s['grades'])
        draft = one('SELECT grades,created FROM grading_drafts WHERE submission_id=? AND submitted=? AND reviewed IS ?', (s['id'], s['submitted'], s['reviewed']))
        s['draft'] = dict(grades=json.loads(draft['grades']), created=draft['created']) if draft else None
    return jsonify(result)


@app.put('/api/submissions/<int:sid>/review')
@auth('teacher')
def review(sid):
    s = one('SELECT * FROM submissions WHERE id=?', (sid,))
    if not s:
        fail('提交记录不存在', 404)
    a = assignment(s['assignment_id'])
    data = payload()
    if data.get('submitted') != s['submitted']:
        fail('学生已更新答案，请重新打开批改', 409)
    if 'reviewed' in data and data['reviewed'] != s['reviewed']:
        fail('批改已在其他窗口更新，请重新打开', 409)
    grades = data.get('grades')
    if not isinstance(grades, list) or len(grades) != len(a['questions']):
        fail('请完成每题评分')
    clean = []
    for q, grade in zip(a['questions'], grades):
        if not isinstance(grade, dict) or str(grade.get('id')) != q['id']:
            fail('题目编号不匹配')
        score = grade.get('score')
        if isinstance(score, bool) or not isinstance(score, (float, int)) or not math.isfinite(score) or not 0 <= score <= q['points']:
            fail('分数必须在题目分值范围内')
        if q['type'] in ('choice', 'multiple', 'judge'):
            clean.append(assessment.rule_grade(q, json.loads(s['answers'])[q['id']]))
            continue
        if q['type'] == 'fill' and score not in (0, q['points']):
            fail('单空填空题按对错评分，请选择 0 分或满分')
        item = dict(id=q['id'], score=score, feedback=text_field(grade,'feedback',5000,False), source='teacher')
        for key in ('evidence', 'issue', 'next_step'):
            item[key] = text_field(grade, key, 1000, False)
        clean.append(item)
    updated = db().execute('UPDATE submissions SET grades=?,status=?,reviewed=? WHERE id=? AND submitted=? AND reviewed IS ?', (jdump(clean), 'reviewed', now(), sid, data['submitted'], s['reviewed']))
    db().commit()
    if not updated.rowcount:
        fail('学生答案或批改记录已更新，请重新打开', 409)
    execute('DELETE FROM grading_drafts WHERE submission_id=?', (sid,))
    audit('教师确认并发布评分')
    return jsonify(ok=True)


def analytics(cid):
    c = my_class(cid, True)
    roster = rows('SELECT u.id,u.name FROM users u JOIN members m ON m.user_id=u.id WHERE m.class_id=?', (cid,))
    tasks = rows('SELECT * FROM assignments WHERE class_id=? AND published=1', (cid,))
    student_map = {x['id']:dict(**x, scores=[], submitted=0, reviewed=0) for x in roster}
    skills, tasks_out, all_percent = {}, [], []
    total_submitted = 0
    for a in tasks:
        qs = json.loads(a['questions'])
        points = sum(q['points'] for q in qs)
        subs = rows('SELECT * FROM submissions WHERE assignment_id=?', (a['id'],))
        percents = []
        for s in subs:
            total_submitted += 1
            if s['student_id'] in student_map:
                student_map[s['student_id']]['submitted'] += 1
            if s['status'] != 'reviewed':
                continue
            grades = {x['id']:x for x in json.loads(s['grades'])}
            percent = round(sum(v['score'] for v in grades.values()) / points * 100, 1)
            percents.append(percent)
            all_percent.append(percent)
            if s['student_id'] in student_map:
                student_map[s['student_id']]['scores'].append(percent)
                student_map[s['student_id']]['reviewed'] += 1
            for q in qs:
                skill = skills.setdefault(q['skill'], dict(name=q['skill'], earned=0, total=0, count=0))
                skill['earned'] += grades[q['id']]['score']
                skill['total'] += q['points']
                skill['count'] += 1
        tasks_out.append(dict(id=a['id'], title=a['title'], submitted=len(subs), reviewed=len(percents), total=len(roster), average=round(sum(percents)/len(percents),1) if percents else None))
    for s in student_map.values():
        s['average'] = round(sum(s['scores'])/len(s['scores']),1) if s['scores'] else None
        s['missing'] = len(tasks)-s['submitted']
    for sk in skills.values():
        sk['percent'] = round(sk['earned']/sk['total']*100, 1)
    imported = rows('SELECT * FROM imports WHERE class_id=? ORDER BY id DESC LIMIT 5000', (cid,))
    return dict(classroom=c, students=list(student_map.values()), tasks=tasks_out, skills=sorted(skills.values(),key=lambda s:s['percent']),
                average=round(sum(all_percent)/len(all_percent),1) if all_percent else None,
                submission_rate=round(total_submitted/(len(tasks)*len(roster))*100,1) if tasks and roster else 0,
                reviewed=len(all_percent), pending=total_submitted-len(all_percent), imported=imported,
                distribution=[sum(1 for p in all_percent if low<=p<high) for low,high in ((0,60),(60,80),(80,90),(90,101))])


@app.get('/api/analytics/<int:cid>')
@auth('teacher')
def get_analytics(cid):
    return jsonify(analytics(cid))


def assignment_analysis(rid):
    a = assignment(rid)
    c = my_class(a['class_id'], True)
    roster = rows('SELECT u.id,u.name FROM users u JOIN members m ON m.user_id=u.id WHERE m.class_id=? ORDER BY u.id', (a['class_id'],))
    submissions = {s['student_id']: s for s in rows('SELECT * FROM submissions WHERE assignment_id=?', (rid,))}
    total = sum(q['points'] for q in a['questions'])
    stats = [dict(id=q['id'], type=q['type'], prompt=q['prompt'], skill=q['skill'], points=q['points'],
                  answer=q['answer'], options=q.get('options', []), explanation=q.get('explanation', ''), rubric=q.get('rubric', ''),
                  correct=0, partial=0, wrong=0, earned=0, reviewed=0, option_counts={}, wrong_answers={}) for q in a['questions']]
    students, percentages, submitted_count, pending = [], [], 0, 0
    for person in roster:
        sub = submissions.get(person['id'])
        item = dict(id=person['id'], name=person['name'], status=sub['status'] if sub else 'missing', score=None, percent=None, cells=[], submission_id=sub['id'] if sub else None)
        if sub:
            submitted_count += 1
            if sub['status'] == 'reviewed':
                grades = {g['id']: g for g in json.loads(sub['grades'])}
                answers = json.loads(sub['answers'])
                earned = sum(g['score'] for g in grades.values())
                item.update(score=round(earned, 2), percent=round(earned/total*100, 1))
                percentages.append(item['percent'])
                for q in stats:
                    score = grades[q['id']]['score']
                    status = 'correct' if score == q['points'] else 'wrong' if score == 0 else 'partial'
                    q[status] += 1
                    q['earned'] += score
                    q['reviewed'] += 1
                    answer = answers.get(q['id'], '')
                    if q['type'] in ('choice', 'multiple', 'judge'):
                        q['option_counts'][answer] = q['option_counts'].get(answer, 0)+1
                    if status != 'correct' and q['type'] == 'fill':
                        key = answer[:120]
                        q['wrong_answers'][key] = q['wrong_answers'].get(key, 0)+1
                    item['cells'].append(dict(id=q['id'], score=score, result=status))
            else:
                pending += 1
        students.append(item)
    for q in stats:
        q['correct_rate'] = round(q['correct']/q['reviewed']*100, 1) if q['reviewed'] else None
        q['score_rate'] = round(q['earned']/(q['reviewed']*q['points'])*100, 1) if q['reviewed'] else None
        q['wrong_answers'] = sorted([dict(answer=k, count=v) for k, v in q['wrong_answers'].items()], key=lambda x: -x['count'])[:6]
        q['unreviewed'] = pending
    return dict(assignment=dict(id=a['id'], title=a['title'], description=a['description'], total=total, question_count=len(stats), published=a['published'], demo=a['demo']),
                classroom=dict(id=c['id'], name=c['name'], grade=c['grade'], subject=c['subject'], demo=c['demo']),
                roster_count=len(roster), submitted=submitted_count, reviewed=len(percentages), pending=pending, missing=len(roster)-submitted_count,
                average=round(sum(percentages)/len(percentages), 1) if percentages else None,
                average_score=round(sum(s['score'] for s in students if s['score'] is not None)/len(percentages), 2) if percentages else None,
                submission_rate=round(submitted_count/len(roster)*100, 1) if roster else 0,
                questions=stats, students=students,
                distribution=[sum(1 for p in percentages if low <= p < high) for low, high in ((0, 60), (60, 80), (80, 90), (90, 101))])


@app.get('/api/assignments/<int:rid>/analytics')
@auth('teacher')
def get_assignment_analytics(rid):
    return jsonify(assignment_analysis(rid))


def csv_safe(value):
    text = str(value if value is not None else '')
    return "'"+text if text.lstrip().startswith(('=', '+', '-', '@', '\t', '\r')) else text


@app.get('/api/assignments/<int:rid>/analytics/export')
@auth('teacher')
def export_assignment_analysis(rid):
    data = assignment_analysis(rid)
    buf = io.StringIO()
    writer = csv.writer(buf)
    if request.args.get('view') == 'questions':
        writer.writerow(['题号', '题型', '知识点', '题干', '满分人数', '部分得分人数', '零分人数', '已确认人数', '正确率%', '得分率%'])
        for q in data['questions']:
            writer.writerow([q['id'], assessment.TYPES[q['type']], csv_safe(q['skill']), csv_safe(q['prompt']), q['correct'], q['partial'], q['wrong'], q['reviewed'], q['correct_rate'], q['score_rate']])
        filename = '逐题分析.csv'
    else:
        writer.writerow(['学生', '状态', '得分', '满分', '得分率%']+['第'+q['id']+'题' for q in data['questions']])
        for s in data['students']:
            writer.writerow([csv_safe(s['name']), {'reviewed': '已确认', 'submitted': '待批改', 'missing': '未提交'}[s['status']], s['score'], data['assignment']['total'], s['percent']]+[v['score'] for v in s['cells']])
        filename = '本次作业成绩.csv'
    return send_file(io.BytesIO(buf.getvalue().encode('utf-8-sig')), mimetype='text/csv', as_attachment=True, download_name=filename)


@app.post('/api/analytics/<int:cid>/import')
@auth('teacher')
def import_scores(cid):
    my_class(cid, True)
    f = request.files.get('file')
    if not f:
        fail('请选择 CSV 文件')
    content = f.read(2*1024*1024+1)
    if len(content)>2*1024*1024:
        fail('CSV 文件不得超过 2 MB')
    try:
        try:
            source = content.decode('utf-8-sig')
        except UnicodeDecodeError:
            source = content.decode('gb18030')
        reader = csv.DictReader(io.StringIO(source))
        parsed = []
        for n, row in enumerate(reader,2):
            if len(parsed)>=5000:
                fail('每次最多导入 5000 行')
            name = (row.get('姓名') or row.get('name') or '').strip()
            score = float(row.get('成绩', row.get('score', '')))
            total = float(row.get('满分', row.get('total', '100')) or 100)
            skill = (row.get('知识点') or row.get('skill') or '综合').strip()
            if not name or len(name)>60 or len(skill)>100 or not math.isfinite(score) or not math.isfinite(total) or not 0<=score<=total or total<=0:
                fail(f'第 {n} 行姓名或分数无效')
            parsed.append((g.user['id'], cid, name, score, total, skill))
    except (UnicodeError, ValueError, csv.Error, AttributeError):
        fail('导入失败，请检查编码和成绩列；必须有“姓名”和“成绩”列')
    if not parsed:
        fail('文件中没有成绩记录')
    batch = secrets.token_hex(5)
    db().executemany('INSERT INTO imports(teacher_id,class_id,name,score,total,skill,batch,created) VALUES(?,?,?,?,?,?,?,?)', [p+(batch,now()) for p in parsed])
    db().commit()
    audit('导入成绩 CSV')
    return jsonify(count=len(parsed), batch=batch)


@app.delete('/api/analytics/<int:cid>/imports/<batch>')
@auth('teacher')
def delete_import(cid,batch):
    my_class(cid,True)
    execute('DELETE FROM imports WHERE class_id=? AND batch=?', (cid,batch))
    return jsonify(ok=True)


@app.get('/api/analytics/<int:cid>/export')
@auth('teacher')
def export_scores(cid):
    a = analytics(cid)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(['姓名','已交作业','已确认批改','平均得分率','未交作业'])
    for s in a['students']:
        safe = "'"+s['name'] if s['name'].startswith(('=','+','-','@','\t','\r')) else s['name']
        writer.writerow([safe,s['submitted'],s['reviewed'],s['average'] if s['average'] is not None else '',s['missing']])
    return send_file(io.BytesIO(buf.getvalue().encode('utf-8-sig')), mimetype='text/csv', as_attachment=True, download_name='学情成绩.csv')


def setting(key, default=''):
    r = one('SELECT value FROM settings WHERE key=?', (key,))
    return r['value'] if r else default


def set_setting(key,value):
    execute('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value', (key,value))


def validate_endpoint(url):
    try:
        p = urllib.parse.urlparse(url)
        port = p.port
    except ValueError:
        fail('API 地址格式不正确')
    if p.scheme != 'https' or not p.hostname or p.username or p.password or p.query or p.fragment or port not in (None,443):
        fail('API 地址须为 HTTPS 公网地址，不包含凭据、查询参数或非标准端口')
    try:
        addrs = socket.getaddrinfo(p.hostname,443,type=socket.SOCK_STREAM)
        if not addrs or any(not ipaddress.ip_address(x[4][0]).is_global for x in addrs):
            fail('API 地址不能指向本机或内网')
    except socket.gaierror:
        fail('API 域名无法解析，请检查地址')
    return url.rstrip('/')


@app.route('/api/settings', methods=['GET','PUT'])
@auth('teacher')
def settings_api():
    if request.method == 'PUT':
        data = payload()
        if data.get('clear_key') and not text_field(data,'api_key',1000,False):
            set_setting('api_key','')
            audit('清除 AI 服务密钥')
            return jsonify(base_url=setting('base_url','https://api.openai.com/v1'), model=setting('model',''), configured=False,
                           events=rows('SELECT action,created FROM events WHERE user_id=? ORDER BY id DESC LIMIT 15', (g.user['id'],)))
        endpoint = validate_endpoint(text_field(data,'base_url',500))
        model = text_field(data,'model',120)
        key = text_field(data,'api_key',1000,False)
        if key:
            set_setting('api_key',cipher.encrypt(key.encode()).decode())
        if data.get('clear_key'):
            set_setting('api_key','')
        set_setting('base_url',endpoint)
        set_setting('model',model)
        audit('更新 AI 服务设置')
    return jsonify(base_url=setting('base_url','https://api.openai.com/v1'), model=setting('model',''), configured=bool(setting('api_key')),
                   events=rows('SELECT action,created FROM events WHERE user_id=? ORDER BY id DESC LIMIT 15', (g.user['id'],)))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def ai(messages, max_tokens=3500):
    encrypted = setting('api_key')
    if not encrypted:
        fail('尚未配置 AI 服务，请在教师端“系统设置”中填写接口地址、模型和 API 密钥', 503)
    throttle('ai', 120 if g.user['role'] == 'teacher' else 40, 3600)
    endpoint = validate_endpoint(setting('base_url'))
    model = setting('model')
    try:
        key = cipher.decrypt(encrypted.encode()).decode()
        body = jdump(dict(model=model,messages=messages,temperature=0.5,max_tokens=max_tokens)).encode()
        req = urllib.request.Request(endpoint+'/chat/completions',data=body,headers={'Content-Type':'application/json','Authorization':'Bearer '+key})
        with urllib.request.build_opener(NoRedirect()).open(req,timeout=65) as response:
            result = json.loads(response.read(2*1024*1024))
        content = result['choices'][0]['message']['content']
        if not isinstance(content,str) or not content.strip():
            raise ValueError('empty response')
        return content.strip()
    except urllib.error.HTTPError as error:
        fail(f'AI 服务返回错误（HTTP {error.code}），请检查密钥、模型名称和账户额度',502)
    except Exception:
        fail('AI 服务连接或响应异常，请检查配置后重试',502)


@app.post('/api/settings/test')
@auth('teacher')
def test_ai():
    content=ai([dict(role='user',content='请用中文回复“连接成功”。')],60)
    return jsonify(message=content[:200])


AI_SYSTEM = prompts.SYSTEM


def parse_model_json(content):
    try:
        return json.loads(re.sub(r'^```(?:json)?\s*|\s*```$', '', content.strip()))
    except (ValueError, TypeError):
        fail('模型返回的格式不完整，请重新生成；现有内容未改变', 502)


@app.post('/api/ai/generate')
@auth('teacher')
def generate():
    data = payload()
    kind = text_field(data, 'kind', 30)
    prompt = text_field(data, 'prompt', 16000)
    context = data.get('context', {})
    try:
        if kind == 'assignment':
            plan = assessment.generation_plan(data.get('plan'))
            messages = prompts.assignment_messages(prompt, plan, context)
            result = ai(messages, min(12000, 1200+sum(x['count'] for x in plan.values())*420))
            value = parse_model_json(result)
            try:
                value = assessment.validate_generated(value, plan)
            except ValueError as error:
                fail('题目草稿未通过检查：'+str(error), 502)
            audit('AI 生成作业草稿，待教师审核')
            return jsonify(assignment=value, prompt_version=prompts.PROMPT_VERSION)
        if kind not in prompts.TASKS:
            fail('未知生成任务')
        operation = data.get('operation', 'create')
        if operation not in ('create', 'revise'):
            fail('请选择生成或修订')
        draft = text_field(data, 'draft', 40000, False)
        if operation == 'revise' and not draft:
            fail('请先填写要修订的正文')
        result = ai(prompts.document_messages(kind, prompt, context, draft, operation), 6500 if kind not in ('poster', 'agent') else 3000)
    except ValueError as error:
        fail(str(error))
    if kind == 'poster':
        value = parse_model_json(result)
        if not isinstance(value, dict) or not isinstance(value.get('lines'), list) or not 3 <= len(value['lines']) <= 4 or any(not isinstance(s, str) or not s.strip() or len(s) > 44 for s in value['lines']):
            fail('海报内容格式不完整，请重新生成', 502)
        for key, limit in (('label', 40), ('title', 50), ('footer', 50)):
            if not isinstance(value.get(key), str) or not value[key].strip() or len(value[key]) > limit:
                fail('海报文字长度不合适，请重新生成', 502)
        return jsonify(poster=value)
    if kind == 'agent':
        value = parse_model_json(result)
        if not isinstance(value, dict):
            fail('智能体配置格式不完整', 502)
        clean = {}
        for key, limit in (('name', 80), ('description', 1000), ('instructions', 12000), ('knowledge', 40000)):
            if not isinstance(value.get(key, ''), str) or len(value.get(key, '')) > limit or key != 'knowledge' and not value.get(key, '').strip():
                fail('智能体配置格式不完整', 502)
            clean[key] = value.get(key, '')
        return jsonify(agent=clean)
    audit('AI '+('修订' if operation == 'revise' else '生成')+' '+kind+'，待教师审核')
    return jsonify(body=result, prompt_version=prompts.PROMPT_VERSION)


@app.post('/api/ai/import-questions')
@auth('teacher')
def ai_import_questions():
    source = text_field(payload(), 'text', 24000)
    value = parse_model_json(ai([dict(role='system', content=AI_SYSTEM+'\n'+prompts.IMPORT), dict(role='user', content='<题目材料>\n'+source+'\n</题目材料>')], 10000))
    if isinstance(value, dict) and value.get('error'):
        fail(str(value['error'])[:500], 400)
    try:
        if not isinstance(value, dict):
            raise ValueError('返回格式不是对象')
        questions = assessment.validate_questions(value.get('questions'))
    except ValueError as error:
        fail('整理结果未通过检查：'+str(error), 502)
    return jsonify(questions=questions, count=len(questions), total=sum(q['points'] for q in questions), description=str(value.get('description', ''))[:1000])


@app.post('/api/ai/summary/<int:cid>')
@auth('teacher')
def ai_summary(cid):
    my_class(cid, True)
    aid = payload().get('assignment_id')
    if not aid:
        fail('请先选择要分析的一份作业')
    a = assignment_analysis(integer(aid))
    if a['classroom']['id'] != cid:
        fail('所选作业不属于当前班级', 400)
    if not a['reviewed']:
        fail('这份作业还没有已确认成绩，请先完成批改再生成分析')
    aggregate = {key: a[key] for key in ('assignment', 'roster_count', 'submitted', 'reviewed', 'pending', 'missing', 'average', 'average_score', 'distribution')}
    aggregate['subject'] = a['classroom']['subject']
    aggregate['grade'] = a['classroom']['grade']
    aggregate['questions'] = [{k: v for k, v in q.items() if k != 'wrong_answers'} for q in a['questions']]
    content = ai([dict(role='system', content=AI_SYSTEM+'\n'+prompts.SUMMARY), dict(role='user', content='以下统计仅针对一份作业。没有学生姓名和原始简答作答：\n'+jdump(aggregate))], 6000)
    audit('生成单份作业教学分析')
    return jsonify(body=content, assignment_id=aid, title=a['assignment']['title']+' · 教学分析', prompt_version=prompts.PROMPT_VERSION)


@app.post('/api/ai/grade/<int:sid>')
@auth('teacher')
def ai_grade(sid):
    s = one('SELECT * FROM submissions WHERE id=?', (sid,))
    if not s:
        fail('提交记录不存在', 404)
    data = payload()
    if data.get('submitted') and data['submitted'] != s['submitted']:
        fail('学生已更新答案，请重新打开批改', 409)
    a = assignment(s['assignment_id'])
    answers = json.loads(s['answers'])
    questions = [dict(**q, student_answer=answers[q['id']]) for q in a['questions'] if q['type'] == 'text']
    grades = [assessment.rule_grade(q, answers[q['id']]) for q in a['questions']]
    if questions:
        result = ai([dict(role='system', content=AI_SYSTEM+'\n'+prompts.GRADE), dict(role='user', content=jdump(questions))], min(7000, 600+len(questions)*350))
        parsed = parse_model_json(result)
        try:
            if not isinstance(parsed, list) or len(parsed) != len(questions) or any(not isinstance(x, dict) for x in parsed):
                raise ValueError('题目数量不一致')
            mapping = {str(x['id']): x for x in parsed}
            if len(mapping) != len(parsed) or set(mapping) != {q['id'] for q in questions}:
                raise ValueError('题号重复或缺失')
            for q, grade in zip(a['questions'], grades):
                if q['type'] != 'text':
                    continue
                value = mapping[q['id']]
                score = assessment.number(value.get('score'), high=q['points'])
                for key in ('feedback', 'evidence', 'issue', 'next_step'):
                    if not isinstance(value.get(key, ''), str) or len(value.get(key, '')) > 5000:
                        raise ValueError('反馈格式不正确')
                feedback = value.get('feedback', '') or '；'.join(value.get(k, '') for k in ('evidence', 'issue', 'next_step') if value.get(k))
                if not feedback.strip():
                    raise ValueError('简答题缺少评分依据或反馈')
                grade.update(score=score, feedback=feedback[:1000], evidence=value.get('evidence', '')[:1000], issue=value.get('issue', '')[:1000], next_step=value.get('next_step', '')[:1000], needs_review=value.get('needs_review', False) is True, source='ai_suggestion')
        except (ValueError, KeyError, TypeError) as error:
            fail('AI 评分未通过检查：'+str(error)+'。请重试或手动批改', 502)
    # Save suggestions separately. Formal grades and student-visible status stay unchanged.
    db().execute('BEGIN IMMEDIATE')
    current = one('SELECT submitted,reviewed FROM submissions WHERE id=?', (sid,))
    if current['submitted'] != s['submitted'] or current['reviewed'] != s['reviewed']:
        db().rollback()
        fail('生成期间答案或评分已更新，请重新打开', 409)
    db().execute('INSERT INTO grading_drafts(submission_id,submitted,grades,created,reviewed) VALUES(?,?,?,?,?) ON CONFLICT(submission_id) DO UPDATE SET submitted=excluded.submitted,grades=excluded.grades,created=excluded.created,reviewed=excluded.reviewed', (sid, s['submitted'], jdump(grades), now(), s['reviewed']))
    db().commit()
    audit('保存待复核评分建议')
    return jsonify(grades=grades, submitted=s['submitted'], reviewed=s['reviewed'], prompt_version=prompts.PROMPT_VERSION)


@app.get('/api/agents')
@auth()
def get_agents():
    if g.user['role']=='teacher':
        result=rows('SELECT * FROM agents WHERE owner_id=? ORDER BY id',(g.user['id'],))
    else:
        result=rows('SELECT a.id,a.name,a.description,a.class_id,a.published FROM agents a JOIN members m ON m.class_id=a.class_id WHERE m.user_id=? AND a.published=1',(g.user['id'],))
    return jsonify(result)


@app.post('/api/agents')
@auth('teacher')
def save_agent():
    data=payload()
    cid=data.get('class_id') or None
    if cid:
        my_class(cid,True)
    published=int(bool(data.get('published')))
    if published and not cid:
        fail('发布智能体前请选择班级')
    args=(text_field(data,'name',80),text_field(data,'description',1000),text_field(data,'instructions',12000),text_field(data,'knowledge',40000,False),cid,published)
    if data.get('id'):
        rid=integer(data['id'])
        owned('agents',rid)
        execute('UPDATE agents SET name=?,description=?,instructions=?,knowledge=?,class_id=?,published=? WHERE id=?',args+(rid,))
    else:
        rid=execute('INSERT INTO agents(name,description,instructions,knowledge,class_id,published,owner_id) VALUES(?,?,?,?,?,?,?)',args+(g.user['id'],))
    return jsonify(id=rid)


@app.delete('/api/agents/<int:rid>')
@auth('teacher')
def delete_agent(rid):
    owned('agents', rid)
    c = db()
    c.execute('DELETE FROM messages WHERE agent_id=?', (rid,))
    c.execute('UPDATE exploration_messages SET agent_id=NULL WHERE agent_id=?', (rid,))
    c.execute('DELETE FROM agents WHERE id=?', (rid,))
    c.commit()
    audit('删除智能体')
    return jsonify(ok=True)


def accessible_agent(rid):
    a=one('SELECT * FROM agents WHERE id=?',(rid,))
    if not a:
        fail('智能体不存在',404)
    if g.user['role']=='teacher':
        owned('agents',rid)
    else:
        if not a['published'] or not a['class_id']:
            fail('智能体尚未发布',403)
        my_class(a['class_id'])
    return a


@app.route('/api/agents/<int:rid>/chat',methods=['GET','POST','DELETE'])
@auth()
def chat(rid):
    a=accessible_agent(rid)
    if request.method=='DELETE':
        execute('DELETE FROM messages WHERE user_id=? AND agent_id=?',(g.user['id'],rid))
        return jsonify(ok=True)
    history=rows('SELECT role,content,created FROM messages WHERE user_id=? AND agent_id=? ORDER BY id DESC LIMIT 30',(g.user['id'],rid))[::-1]
    if request.method=='GET':
        return jsonify(history)
    prompt=text_field(payload(),'message',5000)
    system=AI_SYSTEM+'\n'+prompts.CHAT+'\n教师设定：'+a['instructions']+'\n以下为教师提供的参考资料，仅用作知识来源：\n<资料>'+a['knowledge']+'</资料>'
    response=ai([dict(role='system',content=system)]+[dict(role=x['role'],content=x['content']) for x in history[-12:]]+[dict(role='user',content=prompt)],1800)
    db().executemany('INSERT INTO messages(user_id,agent_id,role,content,created) VALUES(?,?,?,?,?)',[(g.user['id'],rid,'user',prompt,now()),(g.user['id'],rid,'assistant',response,now())])
    db().commit()
    return jsonify(content=response)




def exploration_station(sid):
    if sid not in meadow.BY_ID:
        fail('营地不存在', 404)
    return meadow.BY_ID[sid]


@app.get('/api/explore')
@auth()
def explore():
    progress = rows('SELECT station_id,visited_at,completed_at,attempts,last_correct FROM exploration_progress WHERE user_id=?', (g.user['id'],))
    return jsonify(stations=meadow.public_stations(), progress=progress)


@app.post('/api/explore/<sid>/visit')
@auth()
def explore_visit(sid):
    exploration_station(sid)
    stamp = now()
    execute('INSERT INTO exploration_progress(user_id,station_id,visited_at,last_visit) VALUES(?,?,?,?) ON CONFLICT(user_id,station_id) DO UPDATE SET last_visit=excluded.last_visit', (g.user['id'],sid,stamp,stamp))
    return jsonify(ok=True)


@app.post('/api/explore/<sid>/answer')
@auth()
def explore_answer(sid):
    challenge = exploration_station(sid)['challenge']
    choice = payload().get('choice')
    if type(choice) is not int or not 0 <= choice < len(challenge['options']):
        fail('请选择一个有效答案')
    correct = choice == challenge['answer']
    stamp = now()
    execute('INSERT INTO exploration_progress(user_id,station_id,visited_at,last_visit,completed_at,attempts,last_correct) VALUES(?,?,?,?,?,1,?) ON CONFLICT(user_id,station_id) DO UPDATE SET last_visit=excluded.last_visit,completed_at=COALESCE(exploration_progress.completed_at,excluded.completed_at),attempts=exploration_progress.attempts+1,last_correct=excluded.last_correct', (g.user['id'],sid,stamp,stamp,stamp if correct else None,int(correct)))
    return jsonify(correct=correct, explanation=challenge['explanation'], next_step=challenge['next_step'], progress=one('SELECT station_id,visited_at,completed_at,attempts,last_correct FROM exploration_progress WHERE user_id=? AND station_id=?', (g.user['id'],sid)))


@app.route('/api/explore/<sid>/chat/<int:aid>', methods=['GET','POST','DELETE'])
@auth()
def explore_chat(sid, aid):
    station = exploration_station(sid)
    agent = accessible_agent(aid)
    params = (g.user['id'],sid,aid)
    if request.method == 'DELETE':
        execute('DELETE FROM exploration_messages WHERE user_id=? AND station_id=? AND agent_id=?', params)
        return jsonify(ok=True)
    history = rows('SELECT role,content,created FROM exploration_messages WHERE user_id=? AND station_id=? AND agent_id=? ORDER BY id DESC LIMIT 24', params)[::-1]
    if request.method == 'GET':
        return jsonify(history)
    message = text_field(payload(), 'message', 3000)
    context = {k:station[k] for k in ('title','teacher','topic','lesson','challenge')}
    system = AI_SYSTEM+'\n'+meadow.EXPLORATION_PROMPT+'\n<营地资料>'+jdump(context)+'</营地资料>\n<教师设定>'+agent['instructions']+'</教师设定>\n<教师资料>'+agent['knowledge']+'</教师资料>'
    answer = ai([dict(role='system',content=system)]+[dict(role=h['role'],content=h['content']) for h in history[-12:]]+[dict(role='user',content=message)], 1500)
    db().executemany('INSERT INTO exploration_messages(user_id,station_id,agent_id,role,content,created) VALUES(?,?,?,?,?,?)', [params+('user',message,now()),params+('assistant',answer,now())])
    db().commit()
    return jsonify(content=answer)


@app.get('/api/export')
@auth('teacher')
def export_pack():
    docs=rows('SELECT * FROM documents WHERE owner_id=?',(g.user['id'],))
    tasks=rows('SELECT * FROM assignments WHERE teacher_id=?',(g.user['id'],))
    agents=rows('SELECT name,description,instructions,knowledge FROM agents WHERE owner_id=?',(g.user['id'],))
    buffer=io.BytesIO()
    names={'lesson':'备课','resource':'资源','design':'教学设计','reflection':'评价反思','media':'多媒体'}
    with zipfile.ZipFile(buffer,'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('作品说明.md','# 萧山教师 AI 教学工作台\n\n包含可编辑教案、教学资源、人机协同设计、反思、多媒体脚本、作业及智能体配置。\n不包含学生个人信息、学生答案、聊天记录和 API 密钥。AI 内容需教师核验。\n通知列举六类能力方向，现场实际五项任务尚未公布；本系统按能力方向准备，不代表官方赛题或已提交作品。\n')
        for d in docs:
            title=re.sub(r'[^\w\u4e00-\u9fff-]','_',d['title'])[:70]
            z.writestr(f"{names[d['kind']]}/{d['id']}_{title}.md",d['body'])
        z.writestr('作业/题目与参考答案.json',jdump([dict(title=a['title'],description=a['description'],questions=json.loads(a['questions'])) for a in tasks]))
        z.writestr('智能体/智能体配置.json',jdump(agents))
    buffer.seek(0)
    audit('导出教学作品包')
    return send_file(buffer,mimetype='application/zip',as_attachment=True,download_name='萧山AI教学作品包.zip')


def initialize():
    with app.app_context():
        db().execute('PRAGMA journal_mode=WAL')
        db().executescript(SCHEMA)
        if not one('SELECT id FROM users LIMIT 1'):
            from seed import seed
            seed(db(), DATA)
        db().commit()
    os.chmod(DATA/'school.db',0o600)


learning.register(app, globals())
webstudio.register(app, globals())
lessonkit.register(app, globals())
eras.register(app, globals())
pets.register(app, globals())

initialize()

if __name__=='__main__':
    app.run(host='127.0.0.1',port=int(os.environ.get('PORT',8088)),debug=False)
