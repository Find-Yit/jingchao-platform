"""Personal learning companions. Rewards are derived and committed on the server."""
import json
import math
import re
import office
import learning
import meadow
import eras
from datetime import datetime, timezone, timedelta
from flask import g, jsonify

SCHEMA = '''
CREATE TABLE IF NOT EXISTS pets (
 user_id INTEGER PRIMARY KEY REFERENCES users(id), species TEXT NOT NULL,
 name TEXT NOT NULL, xp INTEGER NOT NULL DEFAULT 0 CHECK(xp>=0),
 food INTEGER NOT NULL DEFAULT 3 CHECK(food>=0), fullness REAL NOT NULL DEFAULT 85,
 fullness_at TEXT NOT NULL, created TEXT NOT NULL, updated TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS pet_rewards (
 id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
 reward_key TEXT NOT NULL, kind TEXT NOT NULL, label TEXT NOT NULL,
 xp INTEGER NOT NULL CHECK(xp>=0), food INTEGER NOT NULL CHECK(food>=0),
 teacher_id INTEGER REFERENCES users(id), class_id INTEGER REFERENCES classes(id),
 created TEXT NOT NULL, UNIQUE(user_id,reward_key));
CREATE TABLE IF NOT EXISTS pet_actions (
 id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
 action_key TEXT NOT NULL, kind TEXT NOT NULL, label TEXT NOT NULL,
 created TEXT NOT NULL, UNIQUE(user_id,action_key));
CREATE INDEX IF NOT EXISTS pet_reward_owner ON pet_rewards(user_id,id);
'''
SPECIES = {'dragon':'小龙','rabbit':'小兔','dog':'小狗','cat':'小猫'}
THRESHOLDS = (0,60,160,320,600,1000)
RULES = [
    {'title':'认真完成作业','detail':'每份已提交作业一次','xp':24,'food':2,'route':'assignments'},
    {'title':'收到高质量反馈','detail':'老师确认达到 80%，每份作业一次','xp':20,'food':2,'route':'insights'},
    {'title':'操作课堂过关','detail':'每个练习第一次检查通过','xp':18,'food':2,'route':'practice'},
    {'title':'发现知识印记','detail':'草原、时空每个学习点第一次答对','xp':12,'food':1,'route':'portals'},
    {'title':'课堂表现鼓励','detail':'老师根据实际表现赠送，每位老师每天一次','xp':20,'food':2,'route':None},
]

def parse_time(value):
    try:
        result=datetime.fromisoformat(value.replace('Z','+00:00'))
        return result.replace(tzinfo=timezone.utc) if result.tzinfo is None else result
    except (TypeError,ValueError,AttributeError):
        return datetime.now(timezone.utc)

def school_day(stamp):
    return parse_time(stamp).astimezone(timezone(timedelta(hours=8))).date().isoformat()

def energy(pet, stamp):
    """Gentle hunger; a holiday never removes progress or harms a companion."""
    elapsed=max(0,(parse_time(stamp)-parse_time(pet['fullness_at'])).total_seconds())
    return max(30,min(100,float(pet['fullness'])-elapsed/86400*12))

def growth(xp):
    level=max(i for i,t in enumerate(THRESHOLDS) if xp>=t)
    lower=THRESHOLDS[level]; upper=THRESHOLDS[level+1] if level+1<len(THRESHOLDS) else None
    return {'level':level+1,'stage':'幼年' if level==0 else '成长' if level<3 else '闪耀',
            'stage_id':'baby' if level==0 else 'growing' if level<3 else 'shining',
            'next_xp':upper,'level_xp':lower,'progress':1 if upper is None else round((xp-lower)/(upper-lower),4)}

def learning_label(conn,key,fallback='完成一项学习任务'):
    if key.startswith('practice:'):
        lid=key[len('practice:'):]
        known={x['id']:x['title'] for x in office.LESSONS+learning.BUILTINS}
        title=known.get(lid)
        if title is None and lid.startswith('custom-') and lid[7:].isdigit():
            row=conn.execute('SELECT title FROM practice_lessons WHERE id=?',(int(lid[7:]),)).fetchone()
            title=row[0] if row else None
        return '通过操作练习 · '+(title or '操作课堂练习')[:100]
    if key.startswith('meadow:'):
        station=meadow.BY_ID.get(key[len('meadow:'):],{})
        return '点亮原野 · '+station.get('title','知识营地')
    if key.startswith('era:'):
        parts=key.split(':',2)
        if len(parts)==3:
            try:
                definition=eras.definitions().get(parts[1],{})
                station=next((s for s in definition.get('stations',[]) if s['id']==parts[2]),{})
                return '点亮时空 · '+definition.get('title','时空之门')+' · '+station.get('title','知识学习点')
            except (OSError,ValueError):pass
        return '点亮时空知识印记'
    return fallback

def achievement_candidates(conn,uid):
    """Only persisted, authorized learning records can create achievement rewards."""
    rewards=[]
    for s in conn.execute('SELECT s.*,a.title,a.questions FROM submissions s JOIN assignments a ON a.id=s.assignment_id JOIN members m ON m.class_id=a.class_id AND m.user_id=s.student_id WHERE s.student_id=? AND a.published=1 AND s.status IN (\'submitted\',\'reviewed\')',(uid,)):
        rewards.append((f"submission:{s['assignment_id']}",'assignment','完成作业 · '+s['title'][:100],24,2))
        if s['status']!='reviewed':continue
        try:
            questions=json.loads(s['questions']); grades=json.loads(s['grades'])
            scores={str(x['id']):x['score'] for x in grades}
            total=0; earned=0
            for q in questions:
                points=q['points'];score=scores[str(q['id'])]
                if isinstance(score,bool) or not isinstance(score,(int,float)) or not math.isfinite(score) or not 0<=score<=points:raise ValueError()
                total+=points;earned+=score
            if total>0 and earned/total>=.8:rewards.append((f"quality:{s['assignment_id']}",'quality','高质量作业 · '+s['title'][:100],20,2))
        except (TypeError,ValueError,KeyError,OverflowError):pass
    for s in conn.execute('SELECT lesson_id FROM practice_records WHERE user_id=? AND completed=1',(uid,)):
        rewards.append(('practice:'+s['lesson_id'],'practice',learning_label(conn,'practice:'+s['lesson_id']),18,2))
    for s in conn.execute('SELECT station_id FROM exploration_progress WHERE user_id=? AND completed_at IS NOT NULL',(uid,)):
        rewards.append(('meadow:'+s['station_id'],'explore',learning_label(conn,'meadow:'+s['station_id']),12,1))
    if conn.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='era_progress'").fetchone():
        for s in conn.execute('SELECT era_id,station_id FROM era_progress WHERE user_id=? AND completed_at IS NOT NULL',(uid,)):
            rewards.append(('era:'+s['era_id']+':'+s['station_id'],'explore',learning_label(conn,'era:'+s['era_id']+':'+s['station_id']),12,1))
    return rewards

def register(app,h):
    auth=h['auth'];fail=h['fail'];payload=h['payload'];db=h['db'];one=h['one'];rows=h['rows'];now=h['now']
    def clean_identity(data):
        species=data.get('species');name=data.get('name','')
        if not isinstance(species,str) or species not in SPECIES:fail('请选择小龙、小兔、小狗或小猫')
        if not isinstance(name,str) or not 1<=len(name.strip())<=16 or re.search(r'[\x00-\x1f\x7f<>]',name):fail('伙伴名字需要 1–16 个字，不含控制符或尖括号')
        return species,name.strip()
    def request_id(data):
        key=data.get('request_id','')
        if not isinstance(key,str) or not re.fullmatch(r'[A-Za-z0-9_-]{8,80}',key):fail('操作编号不正确，请刷新重试')
        return key
    def owned(uid=None):
        p=one('SELECT * FROM pets WHERE user_id=?',(uid or g.user['id'],))
        if not p:fail('先选择一位学习伙伴吧',409)
        return p
    def present(p,stamp):
        if not p:return None
        out={k:p[k] for k in ('user_id','species','name','xp','food','created')}
        value=energy(p,stamp)
        out.update(growth(p['xp']),fullness=round(value),hungry=value<50,can_feed=value<95)
        out['care_available']=not one('SELECT 1 FROM pet_rewards WHERE user_id=? AND reward_key=?',(p['user_id'],'care:'+school_day(stamp)))
        return out
    def response(extra=None):
        uid=g.user['id'];stamp=now();p=one('SELECT * FROM pets WHERE user_id=?',(uid,))
        history=rows('SELECT reward_key,kind,label,xp,food,created FROM pet_rewards WHERE user_id=? ORDER BY id DESC LIMIT 24',(uid,))
        for entry in history:entry['label']=learning_label(db(),entry.pop('reward_key'),entry['label'])
        history+=rows("SELECT kind,label,0 xp,-1 food,created FROM pet_actions WHERE user_id=? AND kind='feed' ORDER BY id DESC LIMIT 12",(uid,))
        history.sort(key=lambda x:x['created'],reverse=True)
        return jsonify({'pet':present(p,stamp),'history':history[:24],'rules':RULES,'species':SPECIES,**(extra or {})})
    def grant(conn,uid,key,kind,label,xp,food,stamp,teacher=None,cid=None):
        cur=conn.execute('INSERT OR IGNORE INTO pet_rewards(user_id,reward_key,kind,label,xp,food,teacher_id,class_id,created) VALUES(?,?,?,?,?,?,?,?,?)',(uid,key,kind,label,xp,food,teacher,cid,stamp))
        if cur.rowcount:
            conn.execute('UPDATE pets SET xp=xp+?,food=food+?,updated=? WHERE user_id=?',(xp,food,stamp,uid))
            return True
        return False
    @app.get('/api/pets')
    @auth()
    def pets_get():
        if g.user['role']=='student':return response()
        result=[];stamp=now();day=school_day(stamp)
        for c in rows('SELECT id,name FROM classes WHERE teacher_id=? ORDER BY id',(g.user['id'],)):
            students=rows("SELECT u.id,u.name FROM members m JOIN users u ON u.id=m.user_id WHERE m.class_id=? AND u.role='student' ORDER BY u.id",(c['id'],))
            for s in students:
                s['pet']=present(one('SELECT * FROM pets WHERE user_id=?',(s['id'],)),stamp)
                s['rewarded_today']=bool(one('SELECT 1 FROM pet_rewards WHERE user_id=? AND reward_key=?',(s['id'],f"teacher:{g.user['id']}:{day}")))
            c['students']=students;result.append(c)
        return jsonify(classes=result,species=SPECIES,rules=RULES)
    @app.post('/api/pets/adopt')
    @auth('student')
    def pet_adopt():
        species,name=clean_identity(payload());uid=g.user['id'];stamp=now();conn=db();conn.execute('BEGIN IMMEDIATE')
        with conn:
            if conn.execute('SELECT 1 FROM pets WHERE user_id=?',(uid,)).fetchone():fail('已经有学习伙伴了，可以改名或换造型',409)
            conn.execute('INSERT INTO pets(user_id,species,name,fullness_at,created,updated) VALUES(?,?,?,?,?,?)',(uid,species,name,stamp,stamp,stamp))
        return response()
    @app.put('/api/pets')
    @auth('student')
    def pet_update():
        species,name=clean_identity(payload());owned();conn=db()
        with conn:conn.execute('UPDATE pets SET species=?,name=?,updated=? WHERE user_id=?',(species,name,now(),g.user['id']))
        return response()
    @app.post('/api/pets/sync')
    @auth('student')
    def pet_sync():
        uid=g.user['id'];stamp=now();conn=db();conn.execute('BEGIN IMMEDIATE');count=xp=food=0
        with conn:
            owned()
            for key,kind,label,x,f in achievement_candidates(conn,uid):
                if grant(conn,uid,key,kind,label,x,f,stamp):count+=1;xp+=x;food+=f
        return response({'earned':{'count':count,'xp':xp,'food':food}})
    @app.post('/api/pets/care')
    @auth('student')
    def pet_care():
        uid=g.user['id'];stamp=now();conn=db();conn.execute('BEGIN IMMEDIATE')
        with conn:
            owned();added=grant(conn,uid,'care:'+school_day(stamp),'care','每日免费照料补给',0,2,stamp)
        return response({'added':added})
    @app.post('/api/pets/feed')
    @auth('student')
    def pet_feed():
        key='feed:'+request_id(payload());uid=g.user['id'];stamp=now();conn=db();conn.execute('BEGIN IMMEDIATE');duplicate=False
        with conn:
            p=owned()
            if conn.execute('SELECT 1 FROM pet_actions WHERE user_id=? AND action_key=?',(uid,key)).fetchone():duplicate=True
            else:
                value=energy(p,stamp)
                if value>=95:fail('伙伴已经吃饱啦，晚一点再来照料吧',409)
                if p['food']<1:fail('口粮暂时用完了，可以领取每日补给，或完成一项学习任务',409)
                conn.execute('UPDATE pets SET food=food-1,fullness=?,fullness_at=?,updated=? WHERE user_id=?',(min(100,value+30),stamp,stamp,uid))
                conn.execute("INSERT INTO pet_actions(user_id,action_key,kind,label,created) VALUES(?,?,'feed','分享一份口粮',?)",(uid,key,stamp))
        return response({'duplicate':duplicate})
    @app.post('/api/pets/reward')
    @auth('teacher')
    def pet_teacher_reward():
        data=payload();cid=data.get('class_id');uid=data.get('student_id');rid=request_id(data);reason=data.get('reason','')
        if type(cid) is not int or type(uid) is not int:fail('请选择班级和学生')
        if not isinstance(reason,str) or not 4<=len(reason.strip())<=160 or re.search(r'[\x00-\x1f\x7f<>]',reason):fail('请写下 4–160 字的具体课堂表现')
        h['my_class'](cid,True)
        if not one("SELECT 1 FROM members m JOIN users u ON u.id=m.user_id WHERE m.class_id=? AND m.user_id=? AND u.role='student'",(cid,uid)):fail('只能鼓励自己班级的学生',403)
        stamp=now();day=school_day(stamp);tid=g.user['id'];key=f'teacher:{tid}:{day}';action=f'teacher:{tid}:{rid}';conn=db();conn.execute('BEGIN IMMEDIATE');duplicate=False
        with conn:
            # Recheck current class authority after acquiring the write lock.
            h['my_class'](cid,True)
            if not one("SELECT 1 FROM members m JOIN users u ON u.id=m.user_id WHERE m.class_id=? AND m.user_id=? AND u.role='student'",(cid,uid)):fail('只能鼓励自己班级的学生',403)
            owned(uid)
            if conn.execute('SELECT 1 FROM pet_actions WHERE user_id=? AND action_key=?',(uid,action)).fetchone():duplicate=True
            else:
                if conn.execute('SELECT 1 FROM pet_rewards WHERE user_id=? AND reward_key=?',(uid,key)).fetchone():fail('今天已经送过鼓励，明天再记录新的进步吧',409)
                # Shared-class or multi-teacher membership must not multiply rewards without a bound.
                n=conn.execute("SELECT count(*) FROM pet_rewards WHERE user_id=? AND kind='teacher' AND reward_key LIKE ?",(uid,'teacher:%:'+day)).fetchone()[0]
                if n>=3:fail('这位同学今天已收到三份课堂鼓励，明天继续发现新的进步',409)
                grant(conn,uid,key,'teacher',reason.strip(),20,2,stamp,tid,cid)
                conn.execute("INSERT INTO pet_actions(user_id,action_key,kind,label,created) VALUES(?,?,'teacher',?,?)",(uid,action,reason.strip(),stamp))
                conn.execute('INSERT INTO events(user_id,action,created) VALUES(?,?,?)',(tid,f'课堂宠物鼓励：班级{cid} 学生{uid}；{reason.strip()}',stamp))
        return jsonify(ok=True,duplicate=duplicate,pet=present(owned(uid),stamp))
