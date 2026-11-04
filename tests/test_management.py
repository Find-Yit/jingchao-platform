import unittest
import test_app
from app import app, db


class ManagementTests(unittest.TestCase):
    """v10 management basics and the classroom-friendly login limit."""
    setUp = test_app.WorkflowTests.setUp
    login = test_app.WorkflowTests.login
    write = test_app.WorkflowTests.write

    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass(); cls.accounts = test_app.WorkflowTests.accounts

    def demo_class(self):
        return self.t.get('/api/classes').json[0]

    def student_id(self, cid, username):
        return next(s['id'] for s in self.t.get(f'/api/classes/{cid}/students').json if s['username'] == username)

    def test_a_class_of_students_can_log_in_from_one_school_ip(self):
        cid = self.demo_class()['id']
        for i in range(20):
            r = self.write(f'/api/classes/{cid}/students', dict(name=f'同学{i}', username=f'mgmt.kid{i}', password='class-pass-2026'))
            self.assertEqual(r.status_code, 200, r.json)
        with app.app_context():
            db().execute('DELETE FROM limits'); db().commit()
        for i in range(20):
            self.login(app.test_client(), f'mgmt.kid{i}', 'class-pass-2026')

    def test_b_wrong_passwords_lock_one_account_and_teacher_reset_unlocks(self):
        cid = self.demo_class()['id']
        self.write(f'/api/classes/{cid}/students', dict(name='小测', username='mgmt.lock', password='first-pass-123'))
        c = app.test_client()
        codes = [c.post('/api/login', json=dict(username='mgmt.lock', password='wrong-pass-000')).status_code for _ in range(9)]
        self.assertEqual(codes[:8], [401] * 8); self.assertEqual(codes[8], 429)
        self.assertEqual(c.post('/api/login', json=dict(username='mgmt.lock', password='first-pass-123')).status_code, 429)
        self.login(app.test_client(), 'teacher', self.accounts['teacher_password'])  # other accounts unaffected
        uid = self.student_id(cid, 'mgmt.lock')
        self.assertEqual(self.write(f'/api/classes/{cid}/students/{uid}/password', {'password': 'short'}).status_code, 400)
        self.assertEqual(self.write(f'/api/classes/{cid}/students/{uid}/password', {'password': 'reset-pass-456'}).status_code, 200)
        self.login(app.test_client(), 'mgmt.lock', 'reset-pass-456')
        self.assertEqual(self.write(f'/api/classes/{cid}/students/{uid}/password', {'password': 'reset-pass-789'}, student=True).status_code, 403)

    def test_c_rename_code_and_remove_student(self):
        c = self.demo_class(); cid = c['id']
        self.assertEqual(self.write(f'/api/classes/{cid}', {'name': '六年级 1 班'}, 'put').status_code, 200)
        self.assertEqual(self.demo_class()['name'], '六年级 1 班')
        new = self.write(f'/api/classes/{cid}/code', {}).json['code']
        self.assertNotEqual(new, c['code']); self.assertEqual(self.demo_class()['code'], new)
        self.write(f'/api/classes/{cid}/students', dict(name='小移', username='mgmt.move', password='move-pass-123'))
        uid = self.student_id(cid, 'mgmt.move')
        self.assertEqual(self.write(f'/api/classes/{cid}/students/{uid}', {}, 'delete').status_code, 200)
        self.assertNotIn('mgmt.move', [s['username'] for s in self.t.get(f'/api/classes/{cid}/students').json])
        self.login(app.test_client(), 'mgmt.move', 'move-pass-123')  # account kept
        self.assertEqual(self.write(f'/api/classes/{cid}/students/{uid}', {}, 'delete').status_code, 404)
        self.assertEqual(self.write(f'/api/classes/{cid}', {'name': 'x'}, 'put', student=True).status_code, 403)

    def test_d_delete_assignment_agent_and_kit(self):
        tasks = self.t.get('/api/assignments').json
        submitted = next(t for t in tasks if t['submitted_count'])
        r = self.write(f"/api/assignments/{submitted['id']}", {}, 'delete')
        self.assertEqual(r.status_code, 409); self.assertIn('份学生提交', r.json['error'])
        self.assertEqual(self.write(f"/api/assignments/{submitted['id']}?force=1", {}, 'delete').status_code, 200)
        self.assertNotIn(submitted['id'], [t['id'] for t in self.t.get('/api/assignments').json])
        agents = self.t.get('/api/agents').json
        self.assertEqual(self.write(f"/api/agents/{agents[0]['id']}", {}, 'delete', student=True).status_code, 403)
        self.assertEqual(self.write(f"/api/agents/{agents[0]['id']}", {}, 'delete').status_code, 200)
        cid = self.demo_class()['id']
        kit = self.write('/api/lesson-kits/example', {'class_id': cid}).json
        self.assertEqual(self.write(f"/api/lesson-kits/{kit['id']}", {}, 'delete').status_code, 200)
        self.assertEqual(self.t.get(f"/api/lesson-kits/{kit['id']}").status_code, 404)

    def test_e_example_kit_recovers_after_its_lesson_is_deleted(self):
        cid = self.demo_class()['id']
        kit = self.write('/api/lesson-kits/example', {'class_id': cid}).json
        self.assertEqual(self.write(f"/api/documents/{kit['lesson_id']}", {}, 'delete').status_code, 200)
        again = self.write('/api/lesson-kits/example', {'class_id': cid}).json
        self.assertNotEqual(again['id'], kit['id']); self.assertTrue(again['lesson_id'])

    def test_f_json_errors_and_clearing_the_key(self):
        r = self.t.patch('/api/classes', headers={'X-CSRF-Token': self.tc})
        self.assertEqual(r.status_code, 405); self.assertTrue(r.is_json)
        r = self.write('/api/settings', {'clear_key': True, 'base_url': 'https://no-such-host.invalid/v1'}, 'put')
        self.assertEqual(r.status_code, 200); self.assertFalse(r.json['configured'])


if __name__ == '__main__':
    unittest.main()
