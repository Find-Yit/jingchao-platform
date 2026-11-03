import io
import json
import unittest
import zipfile
from unittest.mock import patch

import test_app
from app import app, db
import assessment


class QuestionContractTests(unittest.TestCase):
    def question(self, kind='fill', **extra):
        return dict(type=kind, prompt='重复执行的一组步骤叫____。', points=10, skill='算法', answer='循环', **extra)

    def test_fill_equivalent_answers_and_case(self):
        q=assessment.validate_questions([self.question(accepted_answers=['循环结构'])])[0]
        self.assertEqual(assessment.rule_grade(q, '  循环结构  ')['score'], 10)
        q.update(answer='Python', accepted_answers=['Python'], case_sensitive=False)
        self.assertEqual(assessment.rule_grade(q, 'ＰＹＴＨＯＮ')['score'], 10)
        q['case_sensitive']=True
        self.assertEqual(assessment.rule_grade(q, 'python')['score'], 0)
        self.assertEqual(assessment.rule_grade(q, 'Py thon')['score'], 0)

    def test_multiple_is_all_or_nothing(self):
        q=assessment.validate_questions([dict(type='multiple', prompt='Q', options=['One','Two','Three'], answer='C,A', points=10, skill='X')])[0]
        self.assertEqual(q['answer'],'AC')
        self.assertEqual(assessment.clean_student_answer(q,['C','A']),'AC')
        self.assertEqual(assessment.rule_grade(q,'AC')['score'],10)
        self.assertEqual(assessment.rule_grade(q,'A')['score'],0)

    def test_invalid_types_and_numbers(self):
        for changes in ({'type':[]},{'points':True},{'points':float('nan')},{'points':0},{'accepted_answers':['']},{'answer':''}):
            q=self.question();q.update(changes)
            with self.assertRaises(ValueError):assessment.validate_questions([q])

    def test_templates_import_roundtrip(self):
        qs=assessment.validate_questions(assessment.parse_text(assessment.TEXT_TEMPLATE))
        self.assertEqual([q['type'] for q in qs],['choice','fill','text'])
        value=assessment.parse_import('questions.json',json.dumps({'questions':qs}).encode())
        self.assertEqual(value,qs)
        csv='题型,题干,选项A,选项B,答案,分值,知识点,可接受答案\n单选题,题目,一,二,B,10,算法,\n填空题,____,同义一,,循环,5,算法,循环结构\n'
        self.assertEqual(len(assessment.parse_import('q.csv',csv.encode('gb18030'))),2)

    def test_docx_paragraphs_without_external_dependencies(self):
        buf=io.BytesIO()
        text='1. [判断题] 循环结构可以重复执行。\n答案：正确\n分值：5\n知识点：算法'
        xml='<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+''.join('<w:p><w:r><w:t>'+x+'</w:t></w:r></w:p>' for x in text.splitlines())+'</w:body></w:document>'
        with zipfile.ZipFile(buf,'w') as z:z.writestr('word/document.xml',xml)
        qs=assessment.parse_import('q.docx',buf.getvalue())
        self.assertEqual(qs[0]['type'],'judge')
        self.assertEqual(qs[0]['answer'],'正确')

    def test_malformed_import_has_no_silent_drop(self):
        with self.assertRaises(ValueError):assessment.parse_import('q.txt',b'not a question')
        with self.assertRaises(ValueError):assessment.parse_import('q.csv','题型,题干,答案\n填空题,缺少答案,\n'.encode())
        with self.assertRaises(ValueError):assessment.parse_import('q.docx',b'invalid zip')
        with self.assertRaises(ValueError):assessment.parse_import('q.csv',b'x'*(2*1024*1024+1))

    def test_generation_plan_exact_counts(self):
        plan=assessment.generation_plan({'fill':{'count':2,'points':5}})
        q=self.question()
        self.assertEqual(assessment.validate_generated({'title':'Practice','questions':[q,q]},plan)['questions'][0]['points'],5)
        with self.assertRaises(ValueError):assessment.validate_generated({'title':'Practice','questions':[q]},plan)
        for value in ({},{'fill':{'count':-1,'points':10}},{'text':{'count':31,'points':5}},{'fill':{'count':True,'points':10}}):
            with self.assertRaises(ValueError):assessment.generation_plan(value)


class AssessmentWorkflowTests(unittest.TestCase):
    setUp=test_app.WorkflowTests.setUp
    login=test_app.WorkflowTests.login
    write=test_app.WorkflowTests.write

    @classmethod
    def setUpClass(cls):
        test_app.WorkflowTests.setUpClass()
        cls.accounts=test_app.WorkflowTests.accounts

    def make_task(self, questions=None):
        questions=questions or [dict(type='choice',prompt='选择结构的条件是什么？',options=['条件','动作'],answer='A',skill='算法',points=10,explanation='解析不可提前出现'),dict(type='fill',prompt='重复执行叫____。',answer='循环',accepted_answers=['循环结构'],skill='算法',points=10),dict(type='text',prompt='说明测试方法',answer='边界和普通情况',rubric='各5分',skill='测试',points=10)]
        r=self.write('/api/assignments',dict(title='v3 test',class_id=1,description='Only a test',questions=questions,published=True))
        self.assertEqual(r.status_code,200,r.json)
        return r.json['id']

    def submit_task(self,aid):
        r=self.write(f'/api/assignments/{aid}/submit',{'answers':{'1':'B','2':'循环结构','3':'测试普通输入'}},student=True)
        self.assertEqual(r.status_code,200,r.json)
        return self.t.get(f'/api/assignments/{aid}/submissions').json[0]

    def test_01_all_types_and_answer_privacy(self):
        aid=self.make_task()
        t=next(x for x in self.s.get('/api/assignments').json if x['id']==aid)
        for q in t['questions']:
            for key in ('answer','rubric','explanation','accepted_answers','reference_answer'):self.assertNotIn(key,q)
        sub=self.submit_task(aid)
        self.assertEqual([g['score'] for g in sub['grades']],[0,10,None])
        self.assertEqual(sub['grades'][0]['feedback'],'')
        self.assertEqual(self.s.get(f'/api/assignments/{aid}/analytics').status_code,403)

    def test_02_review_cannot_change_objective_answers(self):
        aid=self.make_task();s=self.submit_task(aid)
        grades=[dict(id='1',score=10,feedback='incorrect override'),dict(id='2',score=10),dict(id='3',score=5,feedback='再补一个边界测试')]
        r=self.write(f"/api/submissions/{s['id']}/review",dict(submitted=s['submitted'],reviewed=None,grades=grades),'put')
        self.assertEqual(r.status_code,200,r.json)
        task=next(x for x in self.s.get('/api/assignments').json if x['id']==aid)
        self.assertEqual(task['submission']['grades'][0]['score'],0)
        self.assertEqual(task['submission']['grades'][0]['feedback'],'')
        self.assertEqual(task['questions'][0]['reference_answer'],'A')
        self.assertIn('explanation',task['questions'][0])
        self.assertNotIn('accepted_answers',task['questions'][1])

    def test_03_analysis_scoped_denominator(self):
        aid=self.make_task();s=self.submit_task(aid)
        before=self.t.get(f'/api/assignments/{aid}/analytics').json
        self.assertEqual(before['reviewed'],0)
        self.assertIsNone(before['questions'][0]['correct_rate'])
        self.assertEqual(before['questions'][0]['wrong'],0)
        r=self.write(f"/api/submissions/{s['id']}/review",dict(submitted=s['submitted'],grades=[dict(id='1',score=0),dict(id='2',score=10),dict(id='3',score=5)]),'put')
        self.assertEqual(r.status_code,200,r.json)
        a=self.t.get(f'/api/assignments/{aid}/analytics').json
        self.assertEqual(a['submitted'],1);self.assertEqual(a['reviewed'],1)
        self.assertEqual(a['missing'],a['roster_count']-1)
        self.assertEqual(a['questions'][0]['wrong'],1)
        self.assertEqual(a['questions'][1]['correct_rate'],100)
        self.assertEqual(a['questions'][2]['partial'],1)
        self.assertEqual(a['questions'][2]['correct_rate'],0)
        self.assertEqual(a['questions'][2]['score_rate'],50)
        self.assertEqual(a['average_score'],15)
        self.assertEqual(a['questions'][0]['option_counts'],{'B':1})

    def test_04_ai_draft_saved_separately_and_resubmission_invalidates(self):
        aid=self.make_task();s=self.submit_task(aid)
        with patch('app.ai',return_value=json.dumps([dict(id='3',score=5,evidence='覆盖普通情况',issue='缺少边界',next_step='试一组等于阈值的输入',feedback='补充边界测试')])):
            r=self.write(f"/api/ai/grade/{s['id']}",{'submitted':s['submitted']})
        self.assertEqual(r.status_code,200,r.json)
        after=self.t.get(f'/api/assignments/{aid}/submissions').json[0]
        self.assertEqual(after['status'],'submitted');self.assertEqual(after['grades'],s['grades'])
        self.assertEqual(after['draft']['grades'][2]['score'],5)
        student=next(t for t in self.s.get('/api/assignments').json if t['id']==aid)
        self.assertEqual(student['submission']['grades'],[])
        self.assertNotIn('draft',student['submission'])
        updated=self.submit_task(aid)
        self.assertIsNone(updated['draft'])
        self.assertEqual(self.write(f"/api/submissions/{s['id']}/review",dict(submitted=s['submitted'],grades=r.json['grades']),'put').status_code,409)

    def test_05_invalid_ai_grade_is_atomic(self):
        aid=self.make_task();s=self.submit_task(aid)
        bad_outputs=[[],[dict(id='3',score=True)],[dict(id='3',score=11)],[dict(id='3',score='5')],[dict(id='unknown',score=5)],[dict(id='3',score=5),dict(id='3',score=5)],{'id':'3'}]
        for value in bad_outputs:
            with patch('app.ai',return_value=json.dumps(value)):
                self.assertEqual(self.write(f"/api/ai/grade/{s['id']}",{}).status_code,502)
        after=self.t.get(f'/api/assignments/{aid}/submissions').json[0]
        self.assertIsNone(after['draft']);self.assertEqual(after['grades'],s['grades'])

    def test_06_ai_summary_has_one_assignment_and_no_identities(self):
        aid=self.make_task();s=self.submit_task(aid)
        self.assertEqual(self.write('/api/ai/summary/1',{'assignment_id':aid}).status_code,400)
        self.write(f"/api/submissions/{s['id']}/review",dict(submitted=s['submitted'],grades=[dict(id='1',score=0),dict(id='2',score=10),dict(id='3',score=5)]),'put')
        with patch('app.ai',return_value='# 本次教学调整') as model:
            r=self.write('/api/ai/summary/1',{'assignment_id':aid})
            self.assertEqual(r.status_code,200,r.json)
            sent=model.call_args.args[0][1]['content']
            self.assertNotIn('小禾',sent);self.assertNotIn('student_id',sent)
            self.assertNotIn('测试普通输入',sent)
            self.assertIn('option_counts',sent);self.assertIn('reviewed',sent)
        self.assertEqual(self.write('/api/ai/summary/1',{}).status_code,400)

    def test_07_import_preview_no_database_mutation(self):
        before=len(self.t.get('/api/assignments').json)
        template=self.t.get('/api/questions/template/csv')
        self.assertEqual(template.status_code,200)
        response=self.t.post('/api/questions/import',data={'file':(io.BytesIO(template.data),'q.csv')},headers={'X-CSRF-Token':self.tc})
        self.assertEqual(response.status_code,200,response.json);self.assertEqual(response.json['count'],2)
        self.assertEqual(len(self.t.get('/api/assignments').json),before)
        self.assertEqual(self.s.get('/api/questions/template/csv').status_code,403)
        self.assertEqual(self.write('/api/questions/import',{'text':'not a valid question'}).status_code,400)

    def test_08_edit_protects_existing_submissions_and_versions(self):
        aid=self.make_task();task=next(t for t in self.t.get('/api/assignments').json if t['id']==aid)
        task['title']='Edited title'
        self.assertEqual(self.write(f'/api/assignments/{aid}',task,'put').status_code,200)
        self.assertEqual(self.write(f'/api/assignments/{aid}',task,'put').status_code,409)
        task=next(t for t in self.t.get('/api/assignments').json if t['id']==aid)
        self.submit_task(aid)
        self.assertEqual(self.write(f'/api/assignments/{aid}',task,'put').status_code,409)

    def test_09_generation_plan_and_revision_context(self):
        plan={'fill':{'count':1,'points':7}}
        output=dict(title='Practice',description='one blank',questions=[dict(type='fill',prompt='____',answer='循环',skill='算法',points=20)])
        with patch('app.ai',return_value=json.dumps(output)) as model:
            result=self.write('/api/ai/generate',dict(kind='assignment',prompt='六年级',plan=plan))
            self.assertEqual(result.status_code,200,result.json)
            self.assertEqual(result.json['assignment']['questions'][0]['points'],7)
            self.assertIn('"count": 1',model.call_args.args[0][1]['content'])
        with patch('app.ai',return_value='# 修订') as model:
            result=self.write('/api/ai/generate',dict(kind='lesson',prompt='补充测试',operation='revise',draft='已有正文',context={'duration':40,'prior':'不会边界测试'}))
            self.assertEqual(result.status_code,200)
            text=model.call_args.args[0][1]['content']
            self.assertIn('已有正文',text);self.assertIn('不会边界测试',text)
        with patch('app.ai',return_value=json.dumps(output)):
            self.assertEqual(self.write('/api/ai/generate',dict(kind='assignment',prompt='Test',plan={'fill':{'count':2,'points':10}})).status_code,502)

    def test_10_analysis_export_and_public_intro(self):
        aid=self.make_task()
        self.assertEqual(self.t.get(f'/api/assignments/{aid}/analytics/export').status_code,200)
        response=self.t.get(f'/api/assignments/{aid}/analytics/export?view=questions')
        self.assertIn('满分人数',response.data.decode('utf-8-sig'))
        self.assertEqual(self.s.get(f'/api/assignments/{aid}/analytics/export').status_code,403)
        response=app.test_client().get('/intro/')
        self.assertEqual(response.status_code,200)
        response.close()


if __name__=='__main__':unittest.main(verbosity=2)
