import unittest
from unittest.mock import patch
import test_app
from app import app, db
import meadow


class MeadowWorkflowTests(unittest.TestCase):
    setUp = test_app.WorkflowTests.setUp
    login = test_app.WorkflowTests.login
    write = test_app.WorkflowTests.write

    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass()
        cls.accounts = test_app.WorkflowTests.accounts

    def test_authentication_validation_and_answer_privacy(self):
        self.assertEqual(app.test_client().get('/api/explore').status_code, 401)
        result = self.s.get('/api/explore').json
        self.assertEqual(len(result['stations']), 5)
        for s in result['stations']:
            self.assertEqual(set(s['challenge']), {'prompt', 'options'})
        self.assertEqual(self.s.post('/api/explore/data/visit', json={}).status_code, 403)
        self.assertEqual(self.write('/api/explore/unknown/visit', {}, student=True).status_code, 404)
        for value in (True, -1, 3, None, '1', 1.5, []):
            self.assertEqual(self.write('/api/explore/data/answer', {'choice': value}, student=True).status_code, 400)

    def test_progress_is_per_user_and_does_not_change_grades(self):
        with app.app_context():
            before = [tuple(r) for r in db().execute('SELECT * FROM submissions ORDER BY id')]
        self.assertEqual(self.write('/api/explore/algorithm/visit', {}, student=True).status_code, 200)
        wrong = self.write('/api/explore/algorithm/answer', {'choice': 0}, student=True).json
        self.assertFalse(wrong['correct'])
        right = self.write('/api/explore/algorithm/answer', {'choice': 1}, student=True).json
        self.assertTrue(right['correct'])
        self.assertIsNotNone(right['progress']['completed_at'])
        retry = self.write('/api/explore/algorithm/answer', {'choice': 0}, student=True).json
        self.assertEqual(retry['progress']['completed_at'], right['progress']['completed_at'])
        self.assertEqual(retry['progress']['attempts'], right['progress']['attempts']+1)
        self.assertFalse(any(p['station_id']=='algorithm' for p in self.t.get('/api/explore').json['progress']))
        self.assertTrue(any(p['station_id']=='algorithm' for p in self.s.get('/api/explore').json['progress']))
        with app.app_context():
            self.assertEqual(before, [tuple(r) for r in db().execute('SELECT * FROM submissions ORDER BY id')])

    def test_all_stations_have_valid_authored_challenges(self):
        for s in meadow.STATIONS:
            result = self.write('/api/explore/'+s['id']+'/answer', {'choice': s['challenge']['answer']}, student=True)
            self.assertTrue(result.json['correct'])
            self.assertTrue(result.json['explanation'])

    def test_chat_isolation_permission_and_context(self):
        agents = self.s.get('/api/agents').json
        aid = agents[0]['id']
        path = f'/api/explore/network/chat/{aid}'
        with patch('app.ai', return_value='这是测试回答：先画出仍然连通的路线。') as mocked:
            r = self.write(path, {'message':'我想试试另一条路线。'}, student=True)
            self.assertEqual(r.status_code, 200)
            system = mocked.call_args.args[0][0]['content']
            self.assertIn('网络信使林', system)
            self.assertIn('不冒充真实教师', system)
            self.assertIn('不声称能操作场景', system)
        self.assertEqual(len(self.s.get(path).json), 2)
        self.assertEqual(self.t.get(path).json, [])
        self.assertEqual(self.s.get(f'/api/explore/data/chat/{aid}').json, [])
        private = self.write('/api/agents',dict(name='Private meadow test',description='Only teacher',instructions='Test',knowledge='',published=False)).json['id']
        self.assertEqual(self.write(f'/api/explore/network/chat/{private}', {'message':'x'}, student=True).status_code, 403)
        self.assertEqual(self.write(path, {'message':'x'*3001}, student=True).status_code, 400)

    def test_unconfigured_ai_is_explicit_and_does_not_save_fake_message(self):
        aid = self.s.get('/api/agents').json[0]['id']
        path = f'/api/explore/citizen/chat/{aid}'
        before = self.s.get(path).json
        with patch('app.setting', return_value=''):
            result = self.write(path, {'message':'怎么保护隐私？'}, student=True)
        self.assertEqual(result.status_code, 503)
        self.assertEqual(before, self.s.get(path).json)
