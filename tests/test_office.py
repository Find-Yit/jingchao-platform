import copy,json,unittest
from pathlib import Path
import test_app
from app import app,db
import office


def completed(kind):
    l=next(l for l in office.LESSONS if l['kind']==kind);m=copy.deepcopy(l['initial'])
    if kind=='word':m.update(lineSpacing=1.5,afterSpacing=8);m['picture'].update(wrap='square',side='left')
    elif kind=='ppt':
        m['objects']=[copy.deepcopy(l['steps'][0]['value']),copy.deepcopy(l['steps'][1]['value'])]
        m['objects'][0].update(x=100,width=780);m['objects'][1]['shadow']=True
    else:
        m['cells'].update(B6='=SUM(B2:B5)',B4='40',**{'D'+str(r):f'=B{r}/C{r}' for r in range(2,6)})
        m['formats']={f'D{r}':'percent' for r in range(2,6)};m['chart']=copy.deepcopy(l['steps'][4]['value'])
    return l,m

class OfficeContractTests(unittest.TestCase):
    def test_completed_and_initial_works(self):
        for kind in ('word','excel','ppt'):
            l,m=completed(kind)
            self.assertTrue(office.assess(l,m)['completed'],kind)
            self.assertFalse(office.assess(l,l['initial'])['completed'],kind)
    def test_word_real_layout_parameters_and_no_deleted_content(self):
        l,m=completed('word')
        for key,value in [('lineSpacing',2),('afterSpacing',0),('paragraphs',[''])]:
            wrong=copy.deepcopy(m);wrong[key]=value;self.assertFalse(office.assess(l,wrong)['completed'],key)
        for key,value in [('wrap','inline'),('side','right')]:
            wrong=copy.deepcopy(m);wrong['picture'][key]=value;self.assertFalse(office.assess(l,wrong)['completed'],key)
    def test_ppt_geometry_type_style_and_complete_text(self):
        l,m=completed('ppt')
        for idx,key,value in [(0,'x',250),(0,'width',540),(0,'y',100),(1,'shadow',False),(1,'style','plain'),(1,'type','text'),(0,'text','观察')]:
            wrong=copy.deepcopy(m);wrong['objects'][idx][key]=value
            self.assertFalse(office.assess(l,wrong)['completed'],(idx,key))
        wrong=copy.deepcopy(m);wrong['objects'][0].update(height=40,size=56)
        self.assertFalse(office.assess(l,wrong)['completed'])
    def test_excel_server_recalculates_and_requires_formulas(self):
        l,m=completed('excel');self.assertEqual(office.calculate(m['cells'],'B6'),104)
        for key,value in [('B6','104'),('D3','=B2/C2'),('D4','1'),('B4','32'),('B6','=SUM(B2:B4)')]:
            wrong=copy.deepcopy(m);wrong['cells'][key]=value;wrong['computed']={'B6':104,'D4':1}
            self.assertFalse(office.assess(l,wrong)['completed'],key)
        wrong=copy.deepcopy(m);wrong['formats']['B6']='percent';self.assertFalse(office.assess(l,wrong)['completed'])
        wrong=copy.deepcopy(m);wrong['formats']['D4']='general';self.assertFalse(office.assess(l,wrong)['completed'])
        wrong=copy.deepcopy(m);wrong['chart']['range']='A1:B4';self.assertFalse(office.assess(l,wrong)['completed'])
    def test_formula_evaluation_ranges_cycles_division_and_payloads(self):
        cells={'A1':'18','A2':'25','A3':'32','A4':'21','A5':'=SUM(A1:A4)','B1':'=AVERAGE(A1:A4)','B2':'=($A$1+2)*3/4','B3':'标题','B4':'=SUM(B1:B3)'}
        self.assertEqual(office.calculate(cells,'A5'),96);self.assertEqual(office.calculate(cells,'B1'),24);self.assertEqual(office.calculate(cells,'B2'),15);self.assertEqual(office.calculate(cells,'B4'),39)
        cells['A3']='40';self.assertEqual(office.calculate(cells,'A5'),104)
        for raw in ('=A6','=1/0','=SUM(A1:L30)','=__import__("os")','=fetch(1)','=2**6','=1e999','=SUM(A1:A4);1','=SUM(A1:A4'):
            with self.assertRaises(ValueError,msg=raw):office.calculate({**cells,'A6':raw},'A6')
    def test_malformed_models_are_rejected(self):
        for kind in ('word','excel','ppt'):
            l,m=completed(kind)
            for value in (None,[],{},dict(version=1,kind=kind),{**m,'kind':'other'}):
                with self.assertRaises(ValueError):office.assess(l,value)
        for kind,path,value in [('word','lineSpacing',True),('word','lineSpacing',float('nan')),('excel','cells',{'A999':'1'}),('excel','formats',{'A1':'url()'}),('ppt','objects',[None])]:
            l,m=completed(kind);m[path]=value
            with self.assertRaises(ValueError):office.assess(l,m)

class OfficeWorkflowTests(unittest.TestCase):
    setUp=test_app.WorkflowTests.setUp
    login=test_app.WorkflowTests.login
    write=test_app.WorkflowTests.write
    @classmethod
    def setUpClass(cls):test_app.WorkflowTests.setUpClass();cls.accounts=test_app.WorkflowTests.accounts
    def test_three_lessons_drafts_reload_checks_and_teacher_details(self):
        lessons=self.s.get('/api/practice/lessons').json['lessons'];self.assertEqual(sum(l.get('engine')=='office-v2' for l in lessons),3)
        for kind in ('word','excel','ppt'):
            l,m=completed(kind);path='/api/practice/'+l['id']+'/draft'
            old=self.s.get(path).json
            response=self.write(path,dict(model=m,revision=old['revision']),method='put',student=True)
            self.assertEqual(response.status_code,200,response.json)
            recovered=self.s.get(path).json;self.assertEqual(recovered['model'],m)
            self.assertEqual(self.t.get(path).json['model'],None)
            self.assertEqual(self.write(path,dict(model=l['initial'],revision=old['revision']),method='put',student=True).status_code,409)
            self.assertEqual(self.s.get(path).json['model'],m)
            r=self.write('/api/practice/'+l['id']+'/check',dict(model=m),student=True)
            self.assertEqual(r.status_code,200,r.json);self.assertTrue(r.json['completed'])
            self.assertTrue(all('hint' in c for c in r.json['checks']))
        records=self.t.get('/api/practice/class/1').json
        self.assertTrue(any(r['lesson_id']=='excel-data' and json.loads(r['result'])['rubric_version']==2 for r in records))
    def test_draft_auth_csrf_invalid_data_and_other_class(self):
        l,m=completed('word');path='/api/practice/word-layout/draft'
        self.assertEqual(app.test_client().get(path).status_code,401)
        self.assertEqual(self.s.put(path,json=dict(model=m,revision=0)).status_code,403)
        self.assertEqual(self.s.get('/api/practice/class/1').status_code,403)
        self.assertIn(self.t.get('/api/practice/class/999999').status_code,(403,404))
        for model in ({},[],{**m,'picture':{'wrap':'javascript'}}):self.assertEqual(self.write(path,dict(model=model,revision=0),method='put',student=True).status_code,400)
        self.assertEqual(self.write('/api/practice/does-not-exist/check',dict(model=m),student=True).status_code,404)
    def test_failed_retry_retains_ever_completed_but_reports_latest_errors(self):
        l,m=completed('word');path='/api/practice/'+l['id']+'/check'
        self.assertTrue(self.write(path,dict(model=m),student=True).json['completed'])
        m['lineSpacing']=2
        r=self.write(path,dict(model=m),student=True).json;self.assertFalse(r['completed'])
        self.assertTrue(any(not c['ok'] and '1.5' in c['hint'] for c in r['checks']))
        rec=next(r for r in self.s.get('/api/practice/lessons').json['records'] if r['lesson_id']==l['id'])
        self.assertTrue(rec['completed']);self.assertFalse(json.loads(rec['result'])['completed'])
