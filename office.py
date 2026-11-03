"""Office-style practice: bounded work models and server-authoritative checks.
No submitted formula is executed as code. Formula cells are recomputed here.
"""
import copy
import json
import math
import re
from pathlib import Path

LESSONS = json.loads((Path(__file__).with_name('office_lessons.json')).read_text())
CELL = re.compile(r'\$?([A-L])\$?([1-9]|[12][0-9]|30)\Z')
TOKEN = re.compile(r'\s*(\d+(?:\.\d+)?|\$?[A-L]\$?(?:[1-9]|[12][0-9]|30)(?!\d)|SUM\b|AVERAGE\b|[+*/():,\-])', re.I)


def address(value):
    if not isinstance(value,str) or not CELL.fullmatch(value.upper()):
        raise ValueError('单元格超出 A1:L30')
    return value.upper().replace('$','')


def cell_range(value):
    if not isinstance(value,str): raise ValueError('区域格式不正确')
    parts=value.upper().split(':')
    if not 1 <= len(parts) <= 2: raise ValueError('区域格式不正确')
    start,end=address(parts[0]),address(parts[-1])
    c1,c2=ord(start[0]),ord(end[0]);r1,r2=int(start[1:]),int(end[1:])
    if c2<c1 or r2<r1 or (c2-c1+1)*(r2-r1+1)>120: raise ValueError('区域大小或方向不正确')
    return [chr(c)+str(r) for r in range(r1,r2+1) for c in range(c1,c2+1)]


class FormulaError(ValueError): pass


def calculate(cells, ref, visiting=None):
    ref=address(ref);visiting=set() if visiting is None else visiting
    if ref in visiting or len(visiting)>40: raise FormulaError('循环引用')
    raw=cells.get(ref,'')
    if not isinstance(raw,str): raise FormulaError('单元格不是文本')
    raw=raw.strip()
    if not raw: return 0.0
    if not raw.startswith('='):
        try: value=float(raw)
        except ValueError: raise FormulaError('引用了非数字内容')
    else:
        source=raw[1:].strip().upper();tokens=[];offset=0
        while offset<len(source):
            token=TOKEN.match(source,offset)
            if not token: raise FormulaError('暂不支持该公式')
            tokens.append(token.group(1));offset=token.end()
        if not tokens or len(tokens)>120: raise FormulaError('公式过长或为空')
        index=0
        def peek(): return tokens[index] if index<len(tokens) else None
        def take(wanted=None):
            nonlocal index
            token=peek()
            if token is None or wanted is not None and token!=wanted: raise FormulaError('公式括号或参数不完整')
            index+=1;return token
        def atom():
            token=take()
            if token in ('+','-'): return atom()*(1 if token=='+' else -1)
            if token=='(':
                val=expr();take(')');return val
            if token in ('SUM','AVERAGE'):
                take('(');values=[]
                while True:
                    if peek() and CELL.fullmatch(peek()) and index+1<len(tokens) and tokens[index+1]==':':
                        start=take();take(':');end=take()
                        for target in cell_range(start+':'+end):
                            raw_value=cells.get(target,'').strip()
                            # Spreadsheet aggregate functions ignore text and blank cells in ranges.
                            if not raw_value: continue
                            if not raw_value.startswith('='):
                                try: float(raw_value)
                                except ValueError: continue
                            values.append(calculate(cells,target,visiting|{ref}))
                    else: values.append(expr())
                    if peek()!=',': break
                    take(',')
                take(')')
                if token=='AVERAGE' and not values: raise FormulaError('没有可计算的数字')
                return sum(values)/(len(values) if token=='AVERAGE' else 1)
            if CELL.fullmatch(token): return calculate(cells,token,visiting|{ref})
            try:return float(token)
            except ValueError:raise FormulaError('公式不正确')
        def term():
            value=atom()
            while peek() in ('*','/'):
                op=take();right=atom()
                if op=='/' and right==0:raise FormulaError('除数为零')
                value=value*right if op=='*' else value/right
            return value
        def expr():
            value=term()
            while peek() in ('+','-'):
                op=take();right=term();value=value+right if op=='+' else value-right
            return value
        try:value=expr()
        except (RecursionError,OverflowError):raise FormulaError('公式过于复杂')
        if index!=len(tokens):raise FormulaError('公式包含多余内容')
    if not math.isfinite(value) or abs(value)>1e12:raise FormulaError('数值超出范围')
    return value


def numeric(v,low,high):return type(v) in (int,float) and math.isfinite(v) and low<=v<=high


def validate(model,kind):
    if not isinstance(model,dict) or model.get('version')!=2 or model.get('kind')!=kind: raise ValueError('作品类型不正确')
    if len(json.dumps(model,ensure_ascii=False))>50000:raise ValueError('作品过大')
    if kind=='word':
        p=model.get('picture');paras=model.get('paragraphs')
        if not isinstance(p,dict) or p.get('wrap') not in ('inline','square','topbottom') or p.get('side') not in ('left','right') or not numeric(p.get('width'),120,340):raise ValueError('图片参数不正确')
        if not isinstance(model.get('title'),str) or len(model['title'])>100 or not isinstance(paras,list) or not 1<=len(paras)<=8 or any(not isinstance(x,str) or len(x)>1500 for x in paras):raise ValueError('文档内容不正确')
        if not numeric(model.get('lineSpacing'),1,3) or not numeric(model.get('afterSpacing'),0,36):raise ValueError('段落参数不正确')
    elif kind=='ppt':
        obs=model.get('objects')
        if not isinstance(obs,list) or len(obs)>12:raise ValueError('对象数量不正确')
        seen=set()
        for o in obs:
            if not isinstance(o,dict) or not isinstance(o.get('id'),str) or not re.fullmatch(r'[a-z]+[0-9]+',o['id']) or o['id'] in seen:raise ValueError('对象编号不正确')
            seen.add(o['id'])
            if o.get('type') not in ('text','wordart') or o.get('style') not in ('plain','ocean','sunset','ink') or type(o.get('shadow')) is not bool or not isinstance(o.get('text'),str) or len(o['text'])>500:raise ValueError('对象格式不正确')
            if not all(numeric(o.get(k),*bounds) for k,bounds in {'x':(0,950),'y':(0,520),'width':(80,1000),'height':(40,560),'size':(16,72)}.items()):raise ValueError('对象位置或尺寸不正确')
    elif kind=='excel':
        cells=model.get('cells');formats=model.get('formats');chart=model.get('chart')
        if not isinstance(cells,dict) or len(cells)>360 or not isinstance(formats,dict) or len(formats)>360:raise ValueError('表格大小不正确')
        for k,v in cells.items():
            address(k)
            if k!=address(k) or not isinstance(v,str) or len(v)>200:raise ValueError('单元格内容不正确')
        for k,v in formats.items():
            address(k)
            if k!=address(k) or v not in ('general','percent','number'):raise ValueError('数字格式不正确')
        if chart is not None:
            if not isinstance(chart,dict) or chart.get('type')!='column' or not isinstance(chart.get('title'),str) or len(chart['title'])>80 or type(chart.get('labels')) is not bool:raise ValueError('图表格式不正确')
            cells_in_range=cell_range(chart.get('range'))
            if ':' not in chart['range'] or len({c[0] for c in cells_in_range})!=2:raise ValueError('柱形图需要两列数据')
    else:raise ValueError('课程类型不正确')
    return model


def norm(value):return re.sub(r'\s+','',value) if isinstance(value,str) else value


def assess(lesson,model):
    validate(model,lesson['kind']);checks=[]
    def add(key,label,ok,hint):checks.append(dict(key=key,label=label,ok=bool(ok),hint='已达成' if ok else hint))
    if lesson['kind']=='word':
        p=model['picture'];initial=lesson['initial']
        add('content','保留完整标题与观察正文',norm(model['title'])==norm(initial['title']) and len(model['paragraphs'])==len(initial['paragraphs']) and all(norm(a)==norm(b) for a,b in zip(model['paragraphs'],initial['paragraphs'])),'恢复报告的完整内容，不能删去正文来腾位置。')
        add('wrap','图片采用四周型文字环绕',p['wrap']=='square','选中图片 → 图片格式 → 环绕文字 → 四周型。')
        add('side','图片放在正文左侧',p['side']=='left','将图片拖到左半边，或用“图片位置”选择左侧。')
        add('line','正文为 1.5 倍行距',model['lineSpacing']==1.5,'选择正文 → 开始 → 段落设置，行距设为 1.5 倍。')
        add('after','正文段后间距为 8 磅',model['afterSpacing']==8,'打开段落设置，将段后间距设为 8 磅。')
    elif lesson['kind']=='ppt':
        art=next((o for o in model['objects'] if o['type']=='wordart' and norm(o['text'])=='让校园，更有绿意'),None)
        sub=next((o for o in model['objects'] if o['type']=='text' and norm(o['text'])=='观察校园植物的变化，用图片和数据讲述我们的发现。'),None)
        add('text','创建文本框并输入完整副标题',sub is not None,'插入文本框，输入右侧任务中的完整副标题。')
        add('art','创建艺术字并输入标题',art is not None,'插入艺术字，标题输入“让校园，更有绿意”。')
        add('style','标题使用海蓝渐变及阴影',art and art['style']=='ocean' and art['shadow'],'选中艺术字，使用海蓝渐变并开启文本阴影。')
        add('align','标题与副标题左边线对齐',art and sub and abs(art['x']-sub['x'])<=3,'多选两个对象 → 形状格式 → 左对齐。')
        add('width','副标题宽度为 760–820',sub and 760<=sub['width']<=820,'选中文本框，把宽度设为 780，或拖动右下角手柄调整。')
        valid_layout=art and sub and art['y']+art['height']+12<=sub['y'] and all(o['x']+o['width']<=1000 and o['y']+o['height']<=562 and o['height']>=o['size']*1.4*math.ceil(len(o['text'])*o['size']/o['width']) for o in (art,sub))
        add('layout','对象完整可读、标题在上且不重叠',valid_layout,'把标题放在副标题上方，留出间隔，避免超出画布；必要时增高文本框。')
    else:
        cells=model['cells'];formats=model['formats'];chart=model['chart'] or {}
        def value(ref):
            try:return calculate(cells,ref)
            except ValueError:return None
        originals=lesson['initial']['cells']
        add('data','保留组名与目标，第三组更新为 40',all(norm(cells.get(k,''))==norm(v) for k,v in originals.items() if k not in ('B4','C6')) and value('B4')==40,'保持其他数据不变，将 B4 从 32 改为 40。')
        total_raw=norm(cells.get('B6','')).upper()
        add('sum','B6 使用 SUM 汇总，结果为 104',total_raw=='=SUM(B2:B5)' and value('B6')==104 and formats.get('B6','general')!='percent','在 B6 输入 =SUM(B2:B5)，确认范围包含四个小组，并使用常规或数值格式。')
        for r in range(2,6):
            raw=norm(cells.get('D'+str(r),'' )).upper();correct=raw=='=B'+str(r)+'/C'+str(r)
            target=[.6,25/30,1,.7][r-2];actual=value('D'+str(r))
            add('formula'+str(r),f'D{r} 使用本行相对引用公式',correct and actual is not None and abs(actual-target)<1e-8,f'D{r} 应为 =B{r}/C{r}。先写 D2，再选 D2:D5 向下填充，不要只填结果。')
        add('percent','D2:D5 显示为百分比',all(formats.get('D'+str(r))=='percent' for r in range(2,6)),'选择 D2:D5，将数字格式切换为百分比。')
        add('chart','图表引用 A1:B5，标题与数据标签完整',chart.get('range')=='A1:B5' and norm(chart.get('title',''))=='各组回收纸张数量' and chart.get('labels') is True,'选择 A1:B5 插入柱形图，填写“各组回收纸张数量”，并开启数据标签。')
    return dict(checks=checks,completed=all(c['ok'] for c in checks),passed=sum(c['ok'] for c in checks),total=len(checks),rubric_version=2)
