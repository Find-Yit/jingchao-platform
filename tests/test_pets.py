import concurrent.futures
import json
import threading
import unittest
from unittest.mock import patch
import test_app
from app import app, db
from werkzeug.security import generate_password_hash
import pets

class PetPureTests(unittest.TestCase):
    def test_hunger_and_growth_are_gentle_and_bounded(self):
        p={'fullness':85,'fullness_at':'2026-10-29T00:00:00+00:00'}
        self.assertEqual(pets.energy(p,'2026-10-29T00:00:00+00:00'),85)
        self.assertEqual(pets.energy(p,'2026-10-30T00:00:00+00:00'),73)
        self.assertEqual(pets.energy(p,'2027-10-30T00:00:00+00:00'),30)
        self.assertEqual(pets.energy(p,'2026-10-20T00:00:00+00:00'),85)
        self.assertEqual(pets.school_day('2026-10-29T20:00:00+00:00'),'2026-10-30')
        self.assertEqual(pets.growth(59)['level'],1)
        self.assertEqual(pets.growth(60)['level'],2)
        self.assertEqual(pets.growth(10000)['progress'],1)
        self.assertEqual(pets.growth(10000)['stage_id'],'shining')

class PetWorkflowTests(unittest.TestCase):
    login=test_app.WorkflowTests.login
    write=test_app.WorkflowTests.write
    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass();cls.accounts=test_app.WorkflowTests.accounts
        with app.app_context():
            c=db(); cls.sid=c.execute("SELECT id FROM users WHERE username='student.demo'").fetchone()[0]
            other=c.execute("SELECT id FROM users WHERE username='pet_other'").fetchone()
            if other:cls.other_tid=other[0]
            else:cls.other_tid=c.execute("INSERT INTO users(username,name,password,role) VALUES('pet_other','另一位教师',?,'teacher')",(generate_password_hash('other-pet-password'),)).lastrowid
            other=c.execute("SELECT id FROM users WHERE username='pet_second'").fetchone()
            if other:cls.second=other[0]
            else:cls.second=c.execute("INSERT INTO users(username,name,password,role) VALUES('pet_second','另一位学生',?,'student')",(generate_password_hash('second-pet-password'),)).lastrowid
            c.execute('INSERT OR IGNORE INTO members(class_id,user_id) VALUES(1,?)',(cls.second,));c.commit()
    def setUp(self):
        test_app.WorkflowTests.setUp(self)
        with app.app_context():
            c=db()
            for table in ('pet_actions','pet_rewards','pets'):c.execute('DELETE FROM '+table)
            c.commit()
    def adopt(self,species='dragon',name='星星'):
        r=self.write('/api/pets/adopt',{'species':species,'name':name},student=True)
        self.assertEqual(r.status_code,200,r.json);return r.json['pet']
    def set_pet(self,**data):
        with app.app_context():
            c=db();c.execute('UPDATE pets SET '+','.join(k+'=?' for k in data)+' WHERE user_id=?',(*data.values(),self.sid));c.commit()
    def test_student_choice_validation_and_style_change_preserves_growth(self):
        for obj in ({'species':[],'name':'x'},{'species':'tiger','name':'x'},{'species':'cat','name':'<b>'},{'species':'cat','name':'x'*17}):
            self.assertEqual(self.write('/api/pets/adopt',obj,student=True).status_code,400)
        self.adopt();self.set_pet(xp=187,food=9)
        for species in pets.SPECIES:
            r=self.write('/api/pets',{'species':species,'name':'新名字'},'put',True)
            self.assertEqual(r.status_code,200,r.json);self.assertEqual(r.json['pet']['xp'],187);self.assertEqual(r.json['pet']['food'],9)
            self.assertEqual(r.json['pet']['species'],species)
        self.assertEqual(self.write('/api/pets/adopt',{'species':'cat','name':'重复'},student=True).status_code,409)
    def test_roles_csrf_and_student_isolation(self):
        self.assertEqual(app.test_client().get('/api/pets').status_code,401)
        self.assertEqual(self.t.post('/api/pets/adopt',json={},headers={'X-CSRF-Token':self.tc}).status_code,403)
        self.assertEqual(self.s.post('/api/pets/adopt',json={'species':'cat','name':'名字'}).status_code,403)
        self.assertEqual(self.write('/api/pets/reward',{},student=True).status_code,403)
        self.adopt()
        other=app.test_client();self.login(other,'pet_second','second-pet-password')
        self.assertIsNone(other.get('/api/pets').json['pet'])
        other_teacher=app.test_client();self.login(other_teacher,'pet_other','other-pet-password')
        self.assertEqual(other_teacher.get('/api/pets').json['classes'],[])
        csrf=other_teacher.get('/api/me').json['csrf']
        r=other_teacher.post('/api/pets/reward',json={'student_id':self.sid,'class_id':1,'reason':'未经授权的鼓励','request_id':'outside-owner'},headers={'X-CSRF-Token':csrf})
        self.assertEqual(r.status_code,403)
    def test_feed_idempotence_stock_and_fullness(self):
        self.adopt();self.set_pet(fullness=31,food=1,fullness_at='2099-01-01T00:00:00+00:00')
        first=self.write('/api/pets/feed',{'request_id':'feed-once-123'},student=True)
        self.assertEqual(first.status_code,200,first.json);self.assertEqual(first.json['pet']['food'],0);self.assertEqual(first.json['pet']['fullness'],61)
        second=self.write('/api/pets/feed',{'request_id':'feed-once-123'},student=True)
        self.assertTrue(second.json['duplicate']);self.assertEqual(second.json['pet']['food'],0);self.assertEqual(second.json['pet']['fullness'],61)
        self.assertEqual(self.write('/api/pets/feed',{'request_id':'feed-more-123'},student=True).status_code,409)
        self.set_pet(food=3,fullness=100)
        self.assertEqual(self.write('/api/pets/feed',{'request_id':'feed-full-123'},student=True).status_code,409)
    def test_free_daily_care_uses_server_date_and_never_xp(self):
        self.adopt();a=self.write('/api/pets/care',{'day':'2099-01-01','xp':99999},student=True)
        b=self.write('/api/pets/care',{},student=True)
        self.assertTrue(a.json['added']);self.assertFalse(b.json['added'])
        self.assertEqual(b.json['pet']['food'],5);self.assertEqual(b.json['pet']['xp'],0)
        self.assertFalse(b.json['pet']['care_available'])
    def test_sync_derives_records_once_and_ignores_client_xp(self):
        self.adopt();first=self.write('/api/pets/sync',{'xp':1000000,'completed':True},student=True)
        self.assertEqual(first.status_code,200,first.json);baseline=first.json['pet']['xp']
        repeat=self.write('/api/pets/sync',{},student=True)
        self.assertEqual(repeat.json['earned']['count'],0);self.assertEqual(repeat.json['pet']['xp'],baseline)
        with app.app_context():
            c=db();stamp='2026-10-30T00:00:00+00:00'
            c.execute("INSERT INTO practice_records(user_id,lesson_id,completed,result,updated) VALUES(?,'pet-unit-verified',1,'{}',?) ON CONFLICT(user_id,lesson_id) DO UPDATE SET completed=1",(self.sid,stamp))
            c.execute("INSERT INTO era_progress(user_id,era_id,station_id,completed_at,attempts,last_correct) VALUES(?,'pet-era','pet-station',?,1,1) ON CONFLICT(user_id,era_id,station_id) DO UPDATE SET completed_at=excluded.completed_at",(self.sid,stamp));c.commit()
        after=self.write('/api/pets/sync',{},student=True)
        self.assertEqual(after.json['earned'],{'count':2,'xp':30,'food':3})
        again=self.write('/api/pets/sync',{},student=True);self.assertEqual(again.json['earned']['count'],0)
        with app.app_context():
            c=db();c.execute("DELETE FROM practice_records WHERE lesson_id='pet-unit-verified'");c.execute("DELETE FROM era_progress WHERE era_id='pet-era'");c.commit()
    def test_review_quality_requires_confirmed_valid_grade_and_published_membership(self):
        self.adopt();self.write('/api/pets/sync',{},student=True)
        with app.app_context():
            c=db();stamp='2026-10-30T00:00:00+00:00'
            aid=c.execute("INSERT INTO assignments(teacher_id,class_id,title,description,questions,published,created) VALUES(1,1,'Pet learning','test',?,1,?)",(json.dumps([{'id':'1','points':10}]),stamp)).lastrowid
            sid=c.execute("INSERT INTO submissions(assignment_id,student_id,answers,grades,status,submitted) VALUES(?,?,'{}',?,'submitted',?)",(aid,self.sid,json.dumps([{'id':'1','score':10}]),stamp)).lastrowid;c.commit()
        initial=self.write('/api/pets/sync',{},student=True);self.assertEqual(initial.json['earned']['xp'],24)
        with app.app_context():db().execute("UPDATE submissions SET status='reviewed' WHERE id=?",(sid,));db().commit()
        reviewed=self.write('/api/pets/sync',{},student=True);self.assertEqual(reviewed.json['earned']['xp'],20)
        again=self.write('/api/pets/sync',{},student=True);self.assertEqual(again.json['earned']['count'],0)
        with app.app_context():
            c=db();c.execute('DELETE FROM submissions WHERE id=?',(sid,));c.execute('DELETE FROM assignments WHERE id=?',(aid,));c.commit()
    def test_teacher_reward_owner_idempotence_limit_and_audit(self):
        self.adopt();data={'class_id':1,'student_id':self.sid,'reason':'主动解释了图表的选择理由','request_id':'teacher-reward-001'}
        a=self.write('/api/pets/reward',data);self.assertEqual(a.status_code,200,a.json);self.assertEqual(a.json['pet']['xp'],20)
        b=self.write('/api/pets/reward',data);self.assertEqual(b.status_code,200,b.json);self.assertTrue(b.json['duplicate']);self.assertEqual(b.json['pet']['xp'],20)
        second=self.write('/api/pets/reward',{**data,'request_id':'teacher-reward-002'});self.assertEqual(second.status_code,409)
        self.assertTrue(next(s for s in self.t.get('/api/pets').json['classes'][0]['students'] if s['id']==self.sid)['rewarded_today'])
        with app.app_context():self.assertTrue(db().execute("SELECT 1 FROM events WHERE action LIKE '课堂宠物鼓励：%' AND action LIKE '%图表%' ").fetchone())
    def test_daily_global_teacher_limit_and_nonmember_rejection(self):
        self.adopt()
        with app.app_context():
            c=db();stamp=__import__('app').now();day=pets.school_day(stamp)
            for i in range(3):c.execute("INSERT INTO pet_rewards(user_id,reward_key,kind,label,xp,food,created) VALUES(?,?,'teacher','已有课堂鼓励',20,2,?)",(self.sid,f'teacher:{900+i}:{day}',stamp))
            c.commit()
        data={'class_id':1,'student_id':self.sid,'reason':'积极分享课堂发现','request_id':'daily-global-test'}
        limited=self.write('/api/pets/reward',data)
        self.assertEqual(limited.status_code,409);self.assertIn('三份',limited.json['error'])
        invalid=self.write('/api/pets/reward',{**data,'student_id':999999})
        self.assertEqual(invalid.status_code,403)
        self.assertEqual(self.s.get('/api/pets').json['pet']['xp'],0)

    def test_failed_feed_rolls_back_and_concurrent_requests_cannot_overspend(self):
        self.adopt();self.set_pet(food=1,fullness=30,fullness_at='2099-01-01T00:00:00+00:00')
        with app.app_context():
            c=db();c.execute("CREATE TRIGGER pet_test_failure BEFORE INSERT ON pet_actions WHEN NEW.action_key='feed:rollback-test' BEGIN SELECT RAISE(ABORT,'test failure'); END");c.commit()
        try:
            with self.assertRaises(Exception):self.write('/api/pets/feed',{'request_id':'rollback-test'},student=True)
            unchanged=self.s.get('/api/pets').json['pet'];self.assertEqual(unchanged['food'],1);self.assertEqual(unchanged['fullness'],30)
        finally:
            with app.app_context():db().execute('DROP TRIGGER pet_test_failure');db().commit()
        clients=[]
        for _ in range(2):
            client=app.test_client();self.login(client,'student.demo',self.accounts['student_password']);clients.append((client,client.get('/api/me').json['csrf']))
        gate=threading.Barrier(2)
        def feed(pair):
            index,(client,csrf)=pair;gate.wait()
            return client.post('/api/pets/feed',json={'request_id':'parallel-feed-'+str(index)},headers={'X-CSRF-Token':csrf}).status_code
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:statuses=list(pool.map(feed,enumerate(clients)))
        self.assertEqual(sorted(statuses),[200,409]);self.assertEqual(self.s.get('/api/pets').json['pet']['food'],0)

if __name__=='__main__':unittest.main()
