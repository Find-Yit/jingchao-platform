import io
import json
import os
import sys
import tempfile
import unittest
from unittest.mock import patch
import zipfile
from pathlib import Path

TEST_DATA=tempfile.TemporaryDirectory(prefix='zhixu-test-')
os.environ['DATA_DIR']=TEST_DATA.name
sys.path.insert(0,str(Path(__file__).parents[1]))
from app import app, db
from werkzeug.security import generate_password_hash


class WorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        app.config.update(TESTING=True)
        cls.accounts=json.loads((Path(TEST_DATA.name)/'initial-accounts.json').read_text())

    def setUp(self):
        with app.app_context():
            db().execute('DELETE FROM limits')
            db().commit()
        self.t=app.test_client()
        self.s=app.test_client()
        self.login(self.t,'teacher',self.accounts['teacher_password'])
        self.login(self.s,'student.demo',self.accounts['student_password'])
        self.tc=self.t.get('/api/me').json['csrf']
        self.sc=self.s.get('/api/me').json['csrf']

    def login(self,client,username,password):
        response=client.post('/api/login',json=dict(username=username,password=password))
        self.assertEqual(response.status_code,200,response.json)

    def write(self,path,data,method='post',student=False):
        client,csrf=(self.s,self.sc) if student else (self.t,self.tc)
        return getattr(client,method)(path,json=data,headers={'X-CSRF-Token':csrf})

    def test_01_role_csrf_and_private_content(self):
        self.assertEqual(app.test_client().get('/api/classes').status_code,401)
        self.assertEqual(self.s.get('/api/settings').status_code,403)
        self.assertEqual(self.s.get('/api/analytics/1').status_code,403)
        self.assertEqual(self.t.post('/api/classes',json={}).status_code,403)
        self.assertEqual(self.t.post('/api/logout',json={},headers={'X-CSRF-Token':self.tc,'Origin':'https://attacker.invalid'}).status_code,403)
        tasks=self.s.get('/api/assignments').json
        self.assertNotIn('answer',tasks[0]['questions'][0])
        self.assertNotIn('rubric',tasks[0]['questions'][0])
        docs=self.s.get('/api/documents').json
        self.assertTrue(all(x['published'] for x in docs))
        agents=self.s.get('/api/agents').json
        self.assertNotIn('knowledge',agents[0])
        self.assertEqual(self.write('/api/documents/1',{},'delete',True).status_code,403)

    def test_02_full_assignment_workflow(self):
        questions=[dict(type='choice',prompt='Which structure selects a branch?',options=['choice','loop'],answer='A',rubric='Exact choice',skill='algorithm',points=40),dict(type='text',prompt='Explain verification',answer='Check sources',rubric='A source and date',skill='AI literacy',points=60)]
        response=self.write('/api/assignments',dict(class_id=1,title='Workflow test',description='Test',questions=questions,published=True))
        self.assertEqual(response.status_code,200,response.json)
        aid=response.json['id']
        response=self.write(f'/api/assignments/{aid}/submit',dict(answers={'1':'A','2':'Check official source and date.'}),student=True)
        self.assertEqual(response.status_code,200,response.json)
        task=next(t for t in self.s.get('/api/assignments').json if t['id']==aid)
        self.assertEqual(task['submission']['grades'],[])
        submission=self.t.get(f'/api/assignments/{aid}/submissions').json[0]
        self.assertEqual(submission['grades'][0]['score'],40)
        self.assertIsNone(submission['grades'][1]['score'])
        data=dict(submitted=submission['submitted'],grades=[dict(id='1',score=40,feedback='Correct'),dict(id='2',score=101,feedback='No')])
        self.assertEqual(self.write(f"/api/submissions/{submission['id']}/review",data,'put').status_code,400)
        data['grades'][1]['score']=55
        self.assertEqual(self.write(f"/api/submissions/{submission['id']}/review",data,'put').status_code,200)
        task=next(t for t in self.s.get('/api/assignments').json if t['id']==aid)
        self.assertEqual(task['submission']['status'],'reviewed')
        self.assertEqual(sum(g['score'] for g in task['submission']['grades']),95)
        self.assertEqual(self.write(f'/api/assignments/{aid}/submit',dict(answers={'1':'B','2':'new'}),student=True).status_code,409)
        analytics=self.t.get('/api/analytics/1').json
        self.assertGreater(analytics['reviewed'],6)

    def test_03_class_isolation(self):
        with app.app_context():
            tid=db().execute('INSERT INTO users(username,name,password,role) VALUES(?,?,?,?)',('isolation_teacher','Other',generate_password_hash('test-pass-123456'),'teacher')).lastrowid
            cid=db().execute('INSERT INTO classes(teacher_id,name,subject,grade,code) VALUES(?,?,?,?,?)',(tid,'Other class','IT','6','OTHER123')).lastrowid
            db().commit()
        self.assertEqual(self.t.get(f'/api/analytics/{cid}').status_code,403)
        self.assertEqual(self.write('/api/documents',dict(kind='resource',title='X',body='Y',class_id=cid,published=True)).status_code,403)
        self.assertEqual(self.write('/api/agents',dict(name='X',description='Y',instructions='Z',class_id=cid,published=True)).status_code,403)

    def test_04_import_validation_and_csv_injection(self):
        before=len(self.t.get('/api/analytics/1').json['imported'])
        bad='姓名,成绩,满分,知识点\nTest,80,100,Data\nBroken,nan,100,Data\n'.encode()
        response=self.t.post('/api/analytics/1/import',data={'file':(io.BytesIO(bad),'test.csv')},headers={'X-CSRF-Token':self.tc})
        self.assertEqual(response.status_code,400)
        self.assertEqual(len(self.t.get('/api/analytics/1').json['imported']),before)
        good='姓名,成绩,满分,知识点\n匿名01,80,100,数据\n'.encode('utf-8-sig')
        response=self.t.post('/api/analytics/1/import',data={'file':(io.BytesIO(good),'test.csv')},headers={'X-CSRF-Token':self.tc})
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.json['count'],1)
        self.assertEqual(self.write('/api/analytics/1/imports/'+response.json['batch'],{},'delete').status_code,200)
        self.assertEqual(self.t.get('/api/analytics/1/export').status_code,200)

    def test_05_ai_unconfigured_and_private_export(self):
        self.assertEqual(self.write('/api/ai/generate',dict(kind='lesson',prompt='Test')).status_code,503)
        self.assertEqual(self.write('/api/agents/1/chat',dict(message='Test'),student=True).status_code,503)
        response=self.t.get('/api/export')
        self.assertEqual(response.status_code,200)
        archive=zipfile.ZipFile(io.BytesIO(response.data))
        combined='\n'.join(archive.read(n).decode() for n in archive.namelist())
        self.assertNotIn('小禾',combined)
        self.assertNotIn(self.accounts['teacher_password'],combined)
        self.assertGreater(len(archive.namelist()),5)

    def test_06_invite_registration_and_new_class(self):
        c=app.test_client()
        self.assertEqual(c.post('/api/register',json=dict(username='newlearner',name='Test',password='safe-test-pass-123',code='INVALID')).status_code,400)
        response=c.post('/api/register',json=dict(username='newlearner',name='Test',password='safe-test-pass-123',code=self.accounts['demo_class_code']))
        self.assertEqual(response.status_code,200,response.json)
        me=c.get('/api/me').json
        self.assertEqual(me['user']['role'],'student')
        self.assertEqual(len(me['classes']),1)
        self.assertNotIn('code',me['classes'][0])

    def test_07_invalid_assignment_and_stale_review(self):
        qs=[dict(type='choice',prompt='Q',options=['A','B'],answer='Z',points=10,skill='X',rubric='')]
        self.assertEqual(self.write('/api/assignments',dict(title='Bad',class_id=1,description='',questions=qs)).status_code,400)
        self.assertEqual(self.write('/api/submissions/1/review',dict(submitted='stale',grades=[]),'put').status_code,409)
        self.assertEqual(self.s.get('/api/assignments/1/submissions').status_code,403)

    def test_08_document_publish_and_update(self):
        data=dict(kind='resource',title='Editable resource',body='# Test\nA real resource',meta={},class_id=1,published=False)
        rid=self.write('/api/documents',data).json['id']
        self.assertNotIn(rid,[x['id'] for x in self.s.get('/api/documents').json])
        data['published']=True
        self.assertEqual(self.write('/api/documents/'+str(rid),data,'put').status_code,200)
        self.assertIn(rid,[x['id'] for x in self.s.get('/api/documents').json])
        self.assertEqual(self.write('/api/documents/'+str(rid),{},'delete').status_code,200)

    def test_09_ai_adapter_contract_and_teacher_review(self):
        with patch('app.ai', return_value='# 教案\n这是受控测试返回的草稿。'):
            result=self.write('/api/ai/generate',dict(kind='lesson',prompt='六年级信息科技'))
            self.assertEqual(result.status_code,200)
            self.assertTrue(result.json['body'].startswith('# 教案'))
        before=self.t.get('/api/assignments/1/submissions').json
        pending=next(s for s in before if s['status']=='submitted')
        with patch('app.ai',return_value=json.dumps([dict(id='4',score=30,feedback='受控测试的评分建议')])):
            result=self.write('/api/ai/grade/'+str(pending['id']),{})
            self.assertEqual(result.status_code,200,result.json)
            self.assertEqual(result.json['grades'][3]['source'],'ai_suggestion')
        after=self.t.get('/api/assignments/1/submissions').json
        unchanged=next(s for s in after if s['id']==pending['id'])
        self.assertEqual(unchanged['grades'],pending['grades'])
        self.assertEqual(unchanged['status'],'submitted')
        with patch('app.ai',return_value='invalid JSON'):
            self.assertEqual(self.write('/api/ai/grade/'+str(pending['id']),{}).status_code,502)

    def test_10_ai_endpoint_validation_and_key_encryption(self):
        for endpoint in ['http://public.example/v1','https://127.0.0.1/v1','https://example.com:abc/v1']:
            response=self.write('/api/settings',dict(base_url=endpoint,model='test',api_key='secret-for-test'),'put')
            self.assertEqual(response.status_code,400,response.json)
        with patch('app.socket.getaddrinfo',return_value=[(2,1,6,'',('8.8.8.8',443))]):
            response=self.write('/api/settings',dict(base_url='https://example.com/v1',model='test',api_key='secret-for-test'),'put')
        self.assertEqual(response.status_code,200,response.json)
        self.assertNotIn('secret-for-test',response.get_data(as_text=True))
        with app.app_context():
            stored=db().execute('SELECT value FROM settings WHERE key=?',('api_key',)).fetchone()[0]
            self.assertNotEqual(stored,'secret-for-test')
            db().execute('DELETE FROM settings')
            db().commit()


if __name__=='__main__':
    unittest.main(verbosity=2)
