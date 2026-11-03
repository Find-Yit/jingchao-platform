"""Question contracts, portable imports and deterministic marking.

This module has no Flask or model dependencies so marking is independently testable.
"""
import csv
import io
import json
import math
import re
import unicodedata
import zipfile
from collections import Counter
from xml.etree import ElementTree

TYPES = {'choice': '单选题', 'multiple': '多选题', 'judge': '判断题', 'fill': '填空题', 'text': '简答题'}
TYPE_ALIASES = {'单选': 'choice', '单选题': 'choice', '单项选择': 'choice', '选择题': 'choice',
                '多选': 'multiple', '多选题': 'multiple', '判断': 'judge', '判断题': 'judge',
                '填空': 'fill', '填空题': 'fill', '简答': 'text', '简答题': 'text', '实践题': 'text'}


def required_text(data, key, maximum, optional=False):
    value = data.get(key, '')
    if not isinstance(value, str) or len(value) > maximum or (not optional and not value.strip()):
        raise ValueError(f'{key} 须为非空文本，最多 {maximum} 字')
    return value.strip()


def number(value, low=0, high=100, positive=False):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError('分值须为有效数字')
    if not low <= value <= high or positive and value == 0:
        raise ValueError(f'分值须大于 0 且不超过 {high}' if positive else f'分值须在 {low}–{high} 之间')
    return value


def normalize_answer(value, case_sensitive=False):
    value = unicodedata.normalize('NFKC', value).strip()
    value = re.sub(r'\s+', ' ', value)
    return value if case_sensitive else value.casefold()


def validate_questions(questions):
    if not isinstance(questions, list) or not 1 <= len(questions) <= 50:
        raise ValueError('作业须包含 1–50 道题')
    result = []
    for index, q in enumerate(questions, 1):
        try:
            if not isinstance(q, dict):
                raise ValueError('题目须为对象')
            if not isinstance(q.get('type'), str):
                raise ValueError('题型格式不正确')
            kind = TYPE_ALIASES.get(q.get('type'), q.get('type'))
            if kind not in TYPES:
                raise ValueError('请选择单选、多选、判断、填空或简答题型')
            item = dict(id=str(index), type=kind, prompt=required_text(q, 'prompt', 3000),
                        points=number(q.get('points'), positive=True), skill=required_text(q, 'skill', 60),
                        answer=required_text(q, 'answer', 5000), rubric=required_text(q, 'rubric', 5000, True),
                        explanation=required_text(q, 'explanation', 3000, True))
            if kind in ('choice', 'multiple'):
                options = q.get('options')
                if not isinstance(options, list) or not 2 <= len(options) <= 6 or any(not isinstance(x, str) or not x.strip() or len(x) > 1000 for x in options):
                    raise ValueError('选择题需要 2–6 个非空选项')
                item['options'] = [x.strip() for x in options]
                answer = re.sub(r'[\s,，、;；]+', '', item['answer'].upper())
                letters = set(chr(65+i) for i in range(len(options)))
                if not answer or not set(answer) <= letters or len(set(answer)) != len(answer):
                    raise ValueError('答案须为有效且不重复的选项字母')
                if kind == 'choice' and len(answer) != 1:
                    raise ValueError('单选题只能有一个正确答案')
                if kind == 'multiple' and len(answer) < 2:
                    raise ValueError('多选题至少有两个正确答案')
                item['answer'] = ''.join(sorted(answer))
            if kind == 'judge':
                value = normalize_answer(item['answer'])
                item['answer'] = {'对': '正确', '是': '正确', 'true': '正确', '√': '正确', '错': '错误', '否': '错误', 'false': '错误', '×': '错误'}.get(value, value)
                if item['answer'] not in ('正确', '错误'):
                    raise ValueError('判断题答案须为“正确”或“错误”')
            if kind == 'fill':
                accepted = q.get('accepted_answers', [])
                if not isinstance(accepted, list) or len(accepted) > 15 or any(not isinstance(x, str) or not x.strip() or len(x) > 500 for x in accepted):
                    raise ValueError('填空题可接受答案最多 15 个，每个不超过 500 字')
                if len(item['answer']) > 500:
                    raise ValueError('每道填空题设置一个空，答案不超过 500 字')
                item['accepted_answers'] = list(dict.fromkeys([item['answer']] + [x.strip() for x in accepted]))
                if len(item['accepted_answers']) > 15:
                    raise ValueError('填空题含标准答案在内最多设置 15 个可接受答案')
                item['case_sensitive'] = q.get('case_sensitive') is True
            result.append(item)
        except ValueError as error:
            raise ValueError(f'第 {index} 题：{error}') from error
    return result


def clean_student_answer(q, answer):
    if q['type'] == 'multiple' and isinstance(answer, list):
        if any(not isinstance(x, str) for x in answer):
            raise ValueError('多选答案格式不正确')
        answer = ''.join(sorted(set(answer)))
    if not isinstance(answer, str) or not answer.strip() or len(answer) > 6000:
        raise ValueError('请完成全部题目，每题答案不超过 6000 字')
    answer = answer.strip()
    if q['type'] in ('choice', 'multiple'):
        allowed = {chr(65+i) for i in range(len(q['options']))}
        if not set(answer) <= allowed or len(set(answer)) != len(answer) or q['type'] == 'choice' and len(answer) != 1:
            raise ValueError('选择题答案无效')
        answer = ''.join(sorted(answer))
    if q['type'] == 'judge' and answer not in ('正确', '错误'):
        raise ValueError('判断题答案无效')
    return answer


def rule_grade(q, answer):
    if q['type'] == 'text':
        return dict(id=q['id'], score=None, feedback='', source='pending')
    if q['type'] == 'fill':
        sensitive = q.get('case_sensitive', False)
        correct = normalize_answer(answer, sensitive) in {normalize_answer(v, sensitive) for v in q.get('accepted_answers', [q['answer']])}
    else:
        correct = answer == q['answer']
    return dict(id=q['id'], score=q['points'] if correct else 0, feedback='', source='rule', correct=correct)


def generation_plan(value):
    if value is None:
        value = {'choice': {'count': 3, 'points': 10}, 'fill': {'count': 2, 'points': 10}, 'text': {'count': 2, 'points': 25}}
    if not isinstance(value, dict) or set(value) - set(TYPES):
        raise ValueError('题型配置不正确')
    result = {}
    for kind in TYPES:
        settings = value.get(kind, {'count': 0, 'points': 10})
        if not isinstance(settings, dict):
            raise ValueError('题型配置不正确')
        count = settings.get('count', 0)
        if isinstance(count, bool) or not isinstance(count, int) or not 0 <= count <= 30:
            raise ValueError('各题型数量须为 0–30 的整数')
        points = number(settings.get('points', 10), positive=True)
        if count:
            result[kind] = dict(count=count, points=points)
    if not 1 <= sum(x['count'] for x in result.values()) <= 30:
        raise ValueError('每次 AI 生成合计 1–30 题；较长作业可分批追加')
    return result


def validate_generated(value, plan):
    if not isinstance(value, dict):
        raise ValueError('模型须返回题目对象')
    questions = validate_questions(value.get('questions'))
    if Counter(q['type'] for q in questions) != Counter({k: v['count'] for k, v in plan.items()}):
        raise ValueError('模型返回的各题型数量与设置不一致，请重新生成')
    for q in questions:
        q['points'] = plan[q['type']]['points']
    return dict(title=required_text(value, 'title', 160), description=required_text(value, 'description', 5000, True), questions=questions)


def decode_text(content):
    for encoding in ('utf-8-sig', 'gb18030'):
        try:
            return content.decode(encoding)
        except UnicodeError:
            pass
    raise ValueError('文件编码无法识别，请保存为 UTF-8 文本或 CSV')


def parse_csv(source):
    records = []
    reader = csv.DictReader(io.StringIO(source))
    if not reader.fieldnames or not ({'题干', 'prompt'} & set(reader.fieldnames)):
        raise ValueError('CSV 缺少“题干”列，请下载模板填写')
    for line, row in enumerate(reader, 2):
        if not any(row.values()):
            continue
        if None in row or any(isinstance(v, list) for v in row.values()):
            raise ValueError(f'CSV 第 {line} 行列数不一致，请用双引号包裹含逗号的内容')
        def get(chinese, english, default=''):
            return (row.get(chinese) or row.get(english) or default).strip()
        try:
            points = float(get('分值', 'points', '10'))
        except ValueError as error:
            raise ValueError(f'CSV 第 {line} 行分值不是数字') from error
        options = [get('选项'+c, 'option_'+c.lower()) for c in 'ABCDEF']
        while options and not options[-1]:
            options.pop()
        records.append(dict(type=get('题型', 'type', 'choice'), prompt=get('题干', 'prompt'), options=options,
                            answer=get('答案', 'answer'), points=points, skill=get('知识点', 'skill', '综合'),
                            rubric=get('评分要点', 'rubric'), explanation=get('解析', 'explanation'),
                            accepted_answers=[x.strip() for x in get('可接受答案', 'accepted_answers').split('|') if x.strip()]))
        if len(records) > 50:
            raise ValueError('一次最多导入 50 道题')
    return records


def docx_text(content):
    try:
        with zipfile.ZipFile(io.BytesIO(content)) as archive:
            info = archive.getinfo('word/document.xml')
            if info.file_size > 4*1024*1024 or len(archive.infolist()) > 1000:
                raise ValueError('Word 文档内容过大，请只保留要导入的题目')
            source = archive.read(info)
            if b'<!DOCTYPE' in source or b'<!ENTITY' in source:
                raise ValueError('不支持此 Word 文档结构')
            root = ElementTree.fromstring(source)
            ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
            return '\n'.join(''.join(p.itertext()) if not list(p.iter(ns+'t')) else ''.join(t.text or '' for t in p.iter(ns+'t')) for p in root.iter(ns+'p'))
    except (zipfile.BadZipFile, KeyError, ElementTree.ParseError) as error:
        raise ValueError('Word 文件无法读取，请使用 .docx 或复制题目文本') from error


TEXT_TEMPLATE = '''1. [单选题] 算法根据条件选择不同的执行路径，这种结构叫作什么？
A. 顺序结构
B. 选择结构
C. 循环结构
D. 数据结构
答案：B
分值：10
知识点：算法与控制
解析：选择结构会根据条件结果执行不同分支。

2. [填空题] 程序反复执行一组指令，这种结构叫作____结构。
答案：循环
可接受答案：循环|循环结构
分值：10
知识点：算法与控制

3. [简答题] 为校园节水提醒器设计两个测试，并说明预期结果。
答案：超过阈值时提醒；未超过阈值时不提醒。每个测试说明输入与预期输出。
分值：20
知识点：测试与验证
评分要点：两种分支各10分；每种包含输入5分、预期输出5分。
'''


def parse_text(source):
    records, current, field = [], None, None
    for raw in source.splitlines():
        line = raw.strip()
        if not line:
            continue
        head = re.match(r'^(?:第\s*)?\d+\s*[.、．)）题]\s*[\[【](单选题?|单项选择|选择题|多选题?|判断题?|填空题?|简答题?|实践题|choice|multiple|judge|fill|text)[\]】]\s*(.*)$', line)
        if head:
            if current:
                records.append(current)
            current = dict(type=TYPE_ALIASES.get(head[1], head[1]), prompt=head[2], answer='', options=[], points=10, skill='综合', rubric='', explanation='', accepted_answers=[])
            field = 'prompt'
            continue
        if current is None:
            raise ValueError('无法识别题目。请使用“1. [单选题] 题干”格式，或选择“AI 整理文本”')
        option = re.match(r'^([A-F])[.、．)）]\s*(.*)$', line)
        label = re.match(r'^(答案|参考答案|分值|知识点|评分要点|评分标准|解析|可接受答案)[：:]\s*(.*)$', line)
        if option:
            if ord(option[1])-65 != len(current['options']):
                raise ValueError('选项须从 A 起连续排列')
            current['options'].append(option[2]); field = 'option'
        elif label:
            field = {'答案': 'answer', '参考答案': 'answer', '分值': 'points', '知识点': 'skill', '评分要点': 'rubric', '评分标准': 'rubric', '解析': 'explanation', '可接受答案': 'accepted_answers'}[label[1]]
            if field == 'points':
                try:
                    current[field] = float(label[2].removesuffix('分'))
                except ValueError as error:
                    raise ValueError('分值不是有效数字') from error
            elif field == 'accepted_answers':
                current[field] = [x.strip() for x in label[2].split('|') if x.strip()]
            else:
                current[field] = label[2]
        elif field == 'option':
            current['options'][-1] += '\n'+line
        elif field in ('prompt', 'answer', 'rubric', 'explanation', 'skill'):
            current[field] += '\n'+line
        else:
            raise ValueError('无法识别内容，请按模板逐行填写')
    if current:
        records.append(current)
    return records


def parse_import(filename, content):
    if len(content) > 2*1024*1024:
        raise ValueError('题目文件不得超过 2 MB')
    suffix = filename.lower().rsplit('.', 1)[-1]
    source = docx_text(content) if suffix == 'docx' else decode_text(content)
    if suffix == 'json':
        try:
            value = json.loads(source)
        except ValueError as error:
            raise ValueError('JSON 格式不正确') from error
        records = value.get('questions') if isinstance(value, dict) else value
    elif suffix == 'csv':
        records = parse_csv(source)
    elif suffix in ('txt', 'md', 'docx'):
        records = parse_text(source)
    else:
        raise ValueError('支持 CSV、JSON、TXT、Markdown 和 DOCX 文件')
    return validate_questions(records)
