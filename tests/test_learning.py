import json
import unittest
from unittest.mock import patch
import test_app
from app import app, db
import learning


class LearningTests(unittest.TestCase):
    setUp=test_app.WorkflowTests.setUp
    login=test_app.WorkflowTests.login
    write=test_app.WorkflowTests.write
    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass();cls.accounts=test_app.WorkflowTests.accounts
    def test_auth_and_csrf(self):
        for path in ('/api/companion','/api/practice/lessons','/api/lab'):
            self.assertEqual(app.test_client().get(path).status_code,401)
        self.assertEqual(self.s.post('/api/lab',json={}).status_code,403)
        self.assertEqual(self.write('/api/practice/lessons',{},student=True).status_code,403)
        self.assertEqual(self.s.get('/api/practice/class/1').status_code,403)
    def test_office_all_authored_lessons_are_checkable(self):
        for l in learning.BUILTINS:
            learning.validate_steps(l['steps'],l['kind'])
            model,_=learning.expected(l)
            r=self.write('/api/practice/'+l['id']+'/check',dict(model=model),student=True)
            self.assertEqual(r.status_code,200,r.json);self.assertTrue(r.json['completed'])
            model['pages'][0]['title']['text']='incorrect'
            self.assertFalse(self.write('/api/practice/'+l['id']+'/check',dict(model=model),student=True).json['completed'])
        records=self.s.get('/api/practice/lessons').json['records']
        self.assertTrue(all(r['completed'] for r in records))
        self.assertEqual(self.t.get('/api/practice/lessons').json['records'],[])
        for model in (None,[],dict(pages=[]),dict(pages=[[]]),dict(pages=[{'title':123}])):
            r=self.write('/api/practice/word-poster/check',dict(model=model),student=True)
            self.assertIn(r.status_code,(200,400))
            if r.status_code==200:self.assertFalse(r.json['completed'])
    def test_custom_lesson_permissions_validation_and_no_executable_ops(self):
        d=dict(title='Test operation class',kind='word',class_id=1,published=False,steps=learning.BUILTINS[0]['steps'])
        r=self.write('/api/practice/lessons',d);lid=r.json['id']
        self.assertNotIn(lid,[l['id'] for l in self.s.get('/api/practice/lessons').json['lessons']])
        self.assertEqual(self.write('/api/practice/'+lid+'/check',dict(model={}),student=True).status_code,403)
        d['published']=True;lid=self.write('/api/practice/lessons',d).json['id']
        self.assertIn(lid,[l['id'] for l in self.s.get('/api/practice/lessons').json['lessons']])
        for step in (dict(action='shell',target='title',value='rm',caption='no'),dict(action='text',target='__proto__',value='x',caption='no'),dict(action='size',value=True,caption='no'),dict(action='addSlide',value=True,caption='no')):
            self.assertEqual(self.write('/api/practice/lessons',{**d,'steps':[step]}).status_code,400)
    def test_companion_role_context_isolation_and_unconfigured_ai(self):
        with app.app_context():db().execute('DELETE FROM companion_messages');db().commit()
        r=self.s.get('/api/companion').json
        self.assertTrue(r['help']);self.assertEqual(r['history'],[])
        with patch('app.ai',return_value='先选择标题，再点击居中。') as ai:
            r=self.write('/api/companion',dict(message='怎么居中？',page='practice'),student=True)
            self.assertEqual(r.status_code,200)
            context=ai.call_args.args[0][0]['content']
            self.assertIn('当前角色：student',context);self.assertIn('仿真',context);self.assertIn('不能操控学生电脑',context)
        self.assertEqual(len(self.s.get('/api/companion').json['history']),2)
        self.assertEqual(self.t.get('/api/companion').json['history'],[])
        with patch('app.setting',return_value=''):
            r=self.write('/api/companion',dict(message='test'),student=True)
            self.assertEqual(r.status_code,503)
        self.assertEqual(len(self.s.get('/api/companion').json['history']),2)
    def test_teacher_can_publish_and_retract_without_losing_practice(self):
        d=dict(title='Publish after rehearsal',kind='word',class_id=1,published=False,steps=learning.BUILTINS[0]['steps'])
        lid=self.write('/api/practice/lessons',d).json['id']
        path='/api/practice/lessons/'+lid[7:]+'/publish'
        self.assertEqual(self.write(path,dict(class_id=1,published=True),method='put',student=True).status_code,403)
        self.assertEqual(self.t.put(path,json=dict(class_id=1,published=True)).status_code,403)
        self.assertEqual(self.write(path,dict(published=True),method='put').status_code,400)
        self.assertEqual(self.write(path,dict(class_id=999999,published=True),method='put').status_code,404)
        self.assertEqual(self.write(path,dict(class_id=1,published=True),method='put').status_code,200)
        self.assertIn(lid,[l['id'] for l in self.s.get('/api/practice/lessons').json['lessons']])
        model,_=learning.expected(d)
        self.assertTrue(self.write('/api/practice/'+lid+'/check',dict(model=model),student=True).json['completed'])
        self.assertEqual(self.write(path,dict(class_id=1,published=False),method='put').status_code,200)
        self.assertNotIn(lid,[l['id'] for l in self.s.get('/api/practice/lessons').json['lessons']])
        self.assertEqual(self.write('/api/practice/'+lid+'/check',dict(model=model),student=True).status_code,403)
        self.assertTrue(next(r for r in self.s.get('/api/practice/lessons').json['records'] if r['lesson_id']==lid)['completed'])
    def test_generation_is_validated_and_never_auto_published(self):
        self.assertEqual(self.write('/api/practice/generate',dict(kind='word',topic='x'),student=True).status_code,403)
        with patch('app.ai',return_value=json.dumps(dict(title='test',steps=learning.BUILTINS[0]['steps']))):
            r=self.write('/api/practice/generate',dict(kind='word',topic='标题居中'))
            self.assertEqual(r.status_code,200);self.assertNotIn('id',r.json)
        for result in ('[]','{"title":"a","steps":[{"action":"shell","caption":"x","value":"a"}]}'):
            with patch('app.ai',return_value=result):self.assertEqual(self.write('/api/practice/generate',dict(kind='word',topic='x')).status_code,502)
    def test_lab_actual_bfs_results_and_user_isolation(self):
        r=self.write('/api/lab',dict(walls=[],prediction=14),student=True)
        self.assertTrue(r.json['correct']);self.assertEqual(r.json['distance'],14)
        r=self.write('/api/lab',dict(walls=[1,8],prediction=-1),student=True)
        self.assertTrue(r.json['correct']);self.assertEqual(r.json['distance'],-1)
        for walls in ([0],[63],[True],[64],['1']):self.assertEqual(self.write('/api/lab',dict(walls=walls,prediction=14),student=True).status_code,400)
        self.assertEqual(self.write('/api/lab',dict(walls=[],prediction=True),student=True).status_code,400)
        self.assertGreaterEqual(len(self.s.get('/api/lab').json),2);self.assertEqual(self.t.get('/api/lab').json,[])
