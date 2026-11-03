import json
import unittest
from unittest.mock import patch
import test_app
from app import app, db
import webstudio

HTML='<!doctype html><html lang="zh-CN"><head><title>测试动画</title><style>body{color:green}</style></head><body><button id="b">运行</button><script>document.querySelector("#b").onclick=()=>document.querySelector("#b").textContent="完成";</script></body></html>'
RESULT=dict(title='测试动画',summary='点击按钮查看状态变化。',html=HTML)

class WebStudioTests(unittest.TestCase):
    login=test_app.WorkflowTests.login
    write=test_app.WorkflowTests.write
    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass();cls.accounts=test_app.WorkflowTests.accounts
    def setUp(self):
        test_app.WorkflowTests.setUp(self)
        with app.app_context():
            db().execute('DELETE FROM web_projects');db().execute('DELETE FROM web_build_locks');db().execute("INSERT INTO settings(key,value) VALUES('api_key','test-placeholder') ON CONFLICT(key) DO UPDATE SET value='test-placeholder'");db().commit()
    def tearDown(self):
        with app.app_context():
            db().execute("DELETE FROM settings WHERE key='api_key' AND value='test-placeholder'");db().commit()
    def create(self,student=True):
        with patch('app.ai',return_value=json.dumps(RESULT)):
            r=self.write('/api/web-projects/generate',dict(kind='animation',instruction='解释二进制'),student=student)
        self.assertEqual(r.status_code,200,r.json);return r.json
    def test_permissions_csrf_and_no_cross_user_access(self):
        self.assertEqual(app.test_client().get('/api/web-projects').status_code,401)
        self.assertEqual(self.s.post('/api/web-projects/generate',json={}).status_code,403)
        p=self.create();self.assertEqual(len(self.s.get('/api/web-projects').json['projects']),1)
        self.assertEqual(self.t.get('/api/web-projects').json['projects'],[])
        for suffix in ('','/preview','/download'):
            self.assertEqual(self.t.get('/api/web-projects/'+str(p['id'])+suffix).status_code,404)
        self.assertEqual(self.write('/api/web-projects/'+str(p['id']),{},method='delete').status_code,404)
        self.assertEqual(self.write('/api/web-projects/'+str(p['id'])+'/link',dict(action='renew')).status_code,404)
        self.assertEqual(self.write('/api/web-projects/generate',dict(project_id=p['id'],version=1,instruction='test')).status_code,404)
    def test_generated_html_is_opaque_and_has_no_network_or_platform_privileges(self):
        p=self.create();client=app.test_client()
        for r in (client.get(p['url']+'/content'),self.s.get(p['preview_url'])):
            self.assertEqual(r.status_code,200)
            policy=r.headers['Content-Security-Policy']
            self.assertIn('sandbox allow-scripts;',policy);self.assertNotIn('allow-same-origin',policy)
            for part in ("connect-src 'none'","form-action 'none'","frame-src 'none'","worker-src 'none'","base-uri 'none'"):self.assertIn(part,policy)
            self.assertEqual(r.headers['X-Frame-Options'],'SAMEORIGIN');self.assertEqual(r.headers['Cache-Control'],'no-store')
        self.assertIn("script-src 'self'",self.s.get('/').headers['Content-Security-Policy'])
        self.assertNotIn("'unsafe-inline'",self.s.get('/').headers['Content-Security-Policy'].split('script-src')[1].split(';')[0])
        meta=client.get(p['url']+'/meta').json
        for secret in ('owner_id','html','instruction','token'):self.assertNotIn(secret,meta)
        self.assertIn('noindex',client.get(p['url']).headers['X-Robots-Tag'])
    def test_revision_restore_stale_version_and_model_failure_preserve_content(self):
        p=self.create();path='/api/web-projects/'+str(p['id'])
        with patch('app.ai',return_value=json.dumps({**RESULT,'title':'新标题'})):
            r=self.write('/api/web-projects/generate',dict(project_id=p['id'],version=1,instruction='修改标题'),student=True)
            self.assertEqual(r.status_code,200,r.json);self.assertEqual(r.json['version'],2)
            self.assertEqual(self.write('/api/web-projects/generate',dict(project_id=p['id'],version=1,instruction='过期请求'),student=True).status_code,409)
        for raw in ('invalid','[]',json.dumps({**RESULT,'html':'<!doctype html><html><head><title>x</title></head><body>'}),json.dumps({**RESULT,'html':HTML.replace('<script>','<script src="https://evil.invalid/a.js">')})):
            with patch('app.ai',return_value=raw):self.assertEqual(self.write('/api/web-projects/generate',dict(project_id=p['id'],version=2,instruction='调整'),student=True).status_code,502)
            self.assertEqual(self.s.get(path).json['version'],2)
        r=self.write(path+'/restore',dict(version=1,current_version=2),student=True)
        self.assertEqual(r.status_code,200);self.assertEqual(r.json['version'],3);self.assertEqual(r.json['title'],RESULT['title'])
        self.assertEqual(len(self.s.get(path).json['versions']),3)
    def test_expiry_disable_renew_new_token_and_delete(self):
        p=self.create();path='/api/web-projects/'+str(p['id']);anon=app.test_client()
        with app.app_context():db().execute('UPDATE web_projects SET expires=? WHERE id=?',('2000-01-01',p['id']));db().commit()
        for suffix in ('','/content','/meta'):self.assertEqual(anon.get(p['url']+suffix).status_code,410)
        self.assertEqual(self.s.get(p['preview_url']).status_code,200)
        self.assertEqual(self.write(path+'/link',dict(action='renew'),student=True).status_code,200)
        self.assertEqual(anon.get(p['url']+'/content').status_code,200)
        self.write(path+'/link',dict(action='disable'),student=True);self.assertEqual(anon.get(p['url']+'/content').status_code,410)
        new=self.write(path+'/link',dict(action='enable'),student=True).json
        self.assertNotEqual(new['url'],p['url']);self.assertEqual(anon.get(p['url']+'/content').status_code,410)
        self.assertEqual(anon.get(new['url']+'/content').status_code,200)
        self.assertEqual(self.write(path,{},method='delete',student=True).status_code,200)
        self.assertEqual(anon.get(new['url']+'/content').status_code,410)
        with app.app_context():self.assertEqual(db().execute('SELECT count(*) FROM web_versions WHERE project_id=?',(p['id'],)).fetchone()[0],0)
    def test_unconfigured_model_has_no_fake_generated_result(self):
        with patch('app.setting',return_value=''):r=self.write('/api/web-projects/generate',dict(kind='app',instruction='test'),student=True)
        self.assertEqual(r.status_code,503);self.assertEqual(self.s.get('/api/web-projects').json['projects'],[])
        with app.app_context():self.assertEqual(db().execute('SELECT count(*) FROM web_build_locks').fetchone()[0],0)
        r=self.write('/api/web-projects/demo',{},student=True);self.assertEqual(r.status_code,200)
        self.assertEqual(r.json['source'],'builtin');self.assertIn('内置示例',r.json['summary'])
    def test_generation_is_bounded_and_leases_released(self):
        with app.app_context():
            uid=db().execute("SELECT id FROM users WHERE username='student.demo'").fetchone()[0]
            import time
            db().execute('INSERT INTO web_build_locks VALUES(?,?,?)',(uid,'busy',time.time()+30));db().commit()
        with patch('app.ai') as model:
            self.assertEqual(self.write('/api/web-projects/generate',dict(kind='page',instruction='hello'),student=True).status_code,409);model.assert_not_called()
        with app.app_context():db().execute('DELETE FROM web_build_locks');db().commit()
        p=self.create();path='/api/web-projects/'+str(p['id']);r=self.s.get(path+'/download');self.assertEqual(r.status_code,200)
        self.assertIn('attachment',r.headers['Content-Disposition']);self.assertIn('Content-Security-Policy',r.text);r.close()
        with app.app_context():
            for n in range(11):db().execute('INSERT INTO web_projects(owner_id,token,title,kind,summary,html,source,created,updated,expires) SELECT owner_id,?,title,kind,summary,html,source,created,updated,expires FROM web_projects WHERE id=?',('capacity-'+str(n),p['id']))
            db().commit()
        with patch('app.ai') as model:
            self.assertEqual(self.write('/api/web-projects/generate',dict(kind='page',instruction='hello'),student=True).status_code,409);model.assert_not_called()
    def test_model_prompt_teaches_and_requests_a_complete_working_artifact(self):
        with patch('app.ai',return_value=json.dumps(RESULT)) as model:r=self.write('/api/web-projects/generate',dict(kind='animation',instruction='为什么分数要通分？'),student=True)
        self.assertEqual(r.status_code,200)
        prompt=model.call_args.args[0][0]['content'];self.assertIn('分步解释',prompt);self.assertIn('播放/暂停',prompt);self.assertIn('不要宣称永久保存',prompt)
        self.assertIn('为什么分数要通分',model.call_args.args[0][1]['content'])

if __name__=='__main__':unittest.main()
