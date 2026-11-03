import unittest
from unittest.mock import patch
import test_app
from app import app, db
import eras

class EraWorkflowTests(unittest.TestCase):
    setUp=test_app.WorkflowTests.setUp
    login=test_app.WorkflowTests.login
    write=test_app.WorkflowTests.write
    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass();cls.accounts=test_app.WorkflowTests.accounts
    def first(self):
        d=eras.definitions();e=next(iter(d));s=d[e]['stations'][0];return e,s,f"/api/eras/{e}/{s['id']}"
    def test_auth_csrf_and_invalid_answers(self):
        e,s,path=self.first()
        self.assertEqual(app.test_client().get('/api/eras/progress').status_code,401)
        self.assertEqual(self.s.post(path+'/answer',json={'choice':0}).status_code,403)
        for c in [True,-1,999,'0',None,[],1.5]:self.assertEqual(self.write(path+'/answer',{'choice':c},student=True).status_code,400)
        self.assertEqual(self.write('/api/eras/no/unknown/answer',{'choice':0},student=True).status_code,404)
    def test_completion_persists_without_changing_grades_or_other_users(self):
        e,s,path=self.first();answer=s['challenge']['answer']
        with app.app_context():before=[tuple(r) for r in db().execute('SELECT * FROM submissions ORDER BY id')]
        r=self.write(path+'/answer',{'choice':answer},student=True).json
        self.assertTrue(r['correct']);self.assertTrue(r['progress']['completed_at'])
        r2=self.write(path+'/answer',{'choice':(answer+1)%len(s['challenge']['options'])},student=True).json
        self.assertFalse(r2['correct']);self.assertEqual(r['progress']['completed_at'],r2['progress']['completed_at'])
        self.assertEqual(self.t.get('/api/eras/progress').json,[])
        with app.app_context():self.assertEqual(before,[tuple(r) for r in db().execute('SELECT * FROM submissions ORDER BY id')])
    def test_all_authored_learning_stops_are_answerable(self):
        for e,d in eras.definitions().items():
            self.assertGreaterEqual(len(d['stations']),3)
            for s in d['stations']:
                self.assertTrue(s['sources'])
                r=self.write(f"/api/eras/{e}/{s['id']}/answer",{'choice':s['challenge']['answer']},student=True)
                self.assertEqual(r.status_code,200);self.assertTrue(r.json['correct']);self.assertTrue(r.json['explanation'])
    def test_chat_context_history_isolation_and_failure(self):
        e,s,path=self.first()
        with patch('app.ai',return_value='测试：试着比较两个来源。') as ai:
            self.assertEqual(self.write(path+'/chat',{'message':'这里是真的吗？'},student=True).status_code,200)
            content=ai.call_args.args[0][0]['content'];self.assertIn('不是精确考古复原',content);self.assertIn(s['title'],content)
            self.write(path+'/chat',{'message':'老师也试一次'})
            self.assertEqual(len(ai.call_args.args[0]),2)
        with app.app_context():before=db().execute('SELECT count(*) FROM era_messages').fetchone()[0]
        with patch('app.setting',return_value=''):
            self.assertEqual(self.write(path+'/chat',{'message':'继续'},student=True).status_code,503)
        with app.app_context():self.assertEqual(before,db().execute('SELECT count(*) FROM era_messages').fetchone()[0])
        self.assertEqual(self.write(path+'/chat',{'message':'x'*2001},student=True).status_code,400)
