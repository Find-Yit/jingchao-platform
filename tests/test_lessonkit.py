import copy
import io
import json
import time
import unittest
import zipfile
from unittest.mock import patch
from pptx import Presentation
import test_app
from app import app, db
import lessonkit
from lessonkit_ppt import validate_slides, build_presentation
from werkzeug.security import generate_password_hash

class KitContractTests(unittest.TestCase):
    def test_config_and_slide_bounds(self):
        c,body,slides,a=lessonkit.example_materials()
        for patchdata in ({'duration':True},{'slide_count':100},{'topic':''},{'plan':{'choice':{'count':99,'points':10}}}):
            with self.assertRaises(ValueError):lessonkit.clean_config({**c,**patchdata})
        for index,key,value in [(0,'title','字'*33),(0,'bullets',['一','二','三']),(3,'kind','script'),(2,'note','\x00')]:
            wrong=copy.deepcopy(slides);wrong[index][key]=value
            with self.assertRaises(ValueError):validate_slides(wrong,6)
        with self.assertRaises(ValueError):validate_slides(slides,7)
        self.assertIn('模拟数据',body)

    def test_presentation_is_editable_and_bounded(self):
        c,body,slides,a=lessonkit.example_materials();data=build_presentation(c['topic'],slides,c,True)
        presentation=Presentation(io.BytesIO(data))
        self.assertEqual(len(presentation.slides),6)
        self.assertAlmostEqual(presentation.slide_width/presentation.slide_height,16/9,places=4)
        for slide,model in zip(presentation.slides,slides):
            text='\n'.join(shape.text for shape in slide.shapes if shape.has_text_frame)
            self.assertIn(model['title'],text)
            for bullet in model['bullets']:self.assertIn(bullet,text)
            self.assertIn(model['note'],slide.notes_slide.notes_text_frame.text)
            for shape in slide.shapes:
                self.assertGreaterEqual(shape.left,0);self.assertGreaterEqual(shape.top,0)
                self.assertLessEqual(shape.left+shape.width,presentation.slide_width+10000)
                self.assertLessEqual(shape.top+shape.height,presentation.slide_height+10000)
        with zipfile.ZipFile(io.BytesIO(data)) as z:
            self.assertFalse(any('vba' in name.lower() for name in z.namelist()))
            self.assertFalse(any(b'TargetMode="External"' in z.read(n) for n in z.namelist() if n.endswith('.rels')))

class KitWorkflowTests(unittest.TestCase):
    setUp=test_app.WorkflowTests.setUp
    login=test_app.WorkflowTests.login
    write=test_app.WorkflowTests.write
    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass();cls.accounts=test_app.WorkflowTests.accounts
    def create(self):
        c,_,_,_=lessonkit.example_materials();r=self.write('/api/lesson-kits',{**c,'class_id':1})
        self.assertEqual(r.status_code,200,r.json);return r.json
    def stage(self,kid,stage,value):
        with patch('app.ai',return_value=value) as model:
            r=self.write(f'/api/lesson-kits/{kid}/generate/{stage}',{})
        return r,model
    def test_sequential_generation_retry_and_no_publication(self):
        c,body,slides,a=lessonkit.example_materials();k=self.create();kid=k['id']
        self.assertEqual(self.write(f'/api/lesson-kits/{kid}/generate/slides',{}).status_code,409)
        r,model=self.stage(kid,'lesson',body);self.assertEqual(r.status_code,200,r.json);lid=r.json['lesson_id']
        r,model=self.stage(kid,'slides','bad json');self.assertEqual(r.status_code,502)
        saved=self.t.get(f'/api/lesson-kits/{kid}').json;self.assertEqual(saved['lesson_id'],lid);self.assertEqual(saved['completed'],['lesson']);self.assertFalse(saved['active_stage'])
        r,model=self.stage(kid,'slides',json.dumps({'slides':slides},ensure_ascii=False));self.assertEqual(r.status_code,200,r.json)
        self.assertIn(body,model.call_args.args[0][1]['content'])
        r,model=self.stage(kid,'assignment',json.dumps(a,ensure_ascii=False));self.assertEqual(r.status_code,200,r.json);aid=r.json['assignment_id']
        self.assertEqual(r.json['completed'],['lesson','slides','assignment'])
        with patch('app.ai') as model:
            r=self.write(f'/api/lesson-kits/{kid}/generate/assignment',{});self.assertEqual(r.json['assignment_id'],aid);model.assert_not_called()
        with app.app_context():
            self.assertEqual(db().execute('SELECT published FROM documents WHERE id=?',(lid,)).fetchone()[0],0)
            self.assertEqual(db().execute('SELECT published FROM assignments WHERE id=?',(aid,)).fetchone()[0],0)
        file=self.t.get(f'/api/lesson-kits/{kid}/pptx');self.assertEqual(file.status_code,200)
        self.assertEqual(len(Presentation(io.BytesIO(file.data)).slides),6)
    def test_no_configuration_has_no_fake_success(self):
        k=self.create()
        with patch('app.setting',return_value=''):
            r=self.write(f"/api/lesson-kits/{k['id']}/generate/lesson",{})
        self.assertEqual(r.status_code,503)
        k=self.t.get(f"/api/lesson-kits/{k['id']}").json
        self.assertEqual(k['completed'],[]);self.assertIsNone(k['lesson']);self.assertIn('尚未配置',k['error']);self.assertEqual(k['active_stage'],'')
    def test_role_csrf_ownership_and_private_download(self):
        self.assertEqual(app.test_client().get('/api/lesson-kits').status_code,401)
        self.assertEqual(self.s.get('/api/lesson-kits').status_code,403)
        self.assertEqual(self.t.post('/api/lesson-kits',json={}).status_code,403)
        k=self.write('/api/lesson-kits/example',{'class_id':1}).json;kid=k['id']
        self.assertEqual(self.s.get(f'/api/lesson-kits/{kid}/pptx').status_code,403)
        with app.app_context():
            other=db().execute("SELECT id FROM users WHERE username='kit_other'").fetchone()
            if not other:
                tid=db().execute("INSERT INTO users(username,name,password,role) VALUES('kit_other','Other',?,'teacher')",(generate_password_hash('kit-other-password'),)).lastrowid;db().commit()
            else:tid=other[0]
        client=app.test_client();self.login(client,'kit_other','kit-other-password')
        self.assertEqual(client.get(f'/api/lesson-kits/{kid}').status_code,403)
        self.assertEqual(client.get(f'/api/lesson-kits/{kid}/pptx').status_code,403)
        self.assertNotIn(kid,[x['id'] for x in client.get('/api/lesson-kits').json])
    def test_busy_stage_is_not_duplicated_and_expired_lock_recovers(self):
        k=self.create();kid=k['id'];_,body,_,_=lessonkit.example_materials()
        with app.app_context():
            db().execute("UPDATE lesson_kits SET lock_token='active',lock_expires=?,active_stage='lesson' WHERE id=?",(time.time()+100,kid));db().commit()
        with patch('app.ai') as model:
            self.assertEqual(self.write(f'/api/lesson-kits/{kid}/generate/lesson',{}).status_code,409);model.assert_not_called()
        with app.app_context():db().execute('UPDATE lesson_kits SET lock_expires=0 WHERE id=?',(kid,));db().commit()
        r,_=self.stage(kid,'lesson',body);self.assertEqual(r.status_code,200,r.json)
    def test_example_idempotence_and_slide_revision(self):
        with patch('app.ai') as model:
            a=self.write('/api/lesson-kits/example',{'class_id':1});b=self.write('/api/lesson-kits/example',{'class_id':1});model.assert_not_called()
        self.assertEqual(a.status_code,200,a.json);self.assertEqual(a.json['id'],b.json['id']);self.assertEqual(a.json['source'],'builtin')
        k=a.json;slides=k['slides'];slides[1]['title']='先观察，再判断'
        r=self.write(f"/api/lesson-kits/{k['id']}/slides",{'slides':slides,'revision':k['revision']},'put');self.assertEqual(r.status_code,200,r.json)
        self.assertEqual(self.write(f"/api/lesson-kits/{k['id']}/slides",{'slides':slides,'revision':k['revision']},'put').status_code,409)
        downloaded=Presentation(io.BytesIO(self.t.get(f"/api/lesson-kits/{k['id']}/pptx").data))
        text='\n'.join(x.text for x in downloaded.slides[1].shapes if x.has_text_frame);self.assertIn('先观察，再判断',text)
    def test_invalid_generated_questions_preserve_other_materials(self):
        k=self.create();kid=k['id'];_,body,_,_=lessonkit.example_materials();self.stage(kid,'lesson',body)
        r,_=self.stage(kid,'assignment',json.dumps({'title':'题','description':'','questions':[]}));self.assertEqual(r.status_code,502)
        k=self.t.get(f'/api/lesson-kits/{kid}').json;self.assertIsNotNone(k['lesson']);self.assertIsNone(k['assignment_id'])

if __name__=='__main__':unittest.main()
