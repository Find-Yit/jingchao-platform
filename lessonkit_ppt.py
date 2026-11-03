"""Editable, bounded PowerPoint layouts. No remote images or executable content."""
import io
import re
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import MSO_ANCHOR
from pptx.oxml.xmlchemy import OxmlElement

KINDS={'cover','concept','activity','question','summary'}
LABELS={'cover':'从一个问题开始','concept':'看清一个概念','activity':'现在，动手试一试','question':'停一停，想一想','summary':'把发现带走'}

def _text(v, limit, name, empty=False):
    if not isinstance(v,str) or len(v)>limit or (not empty and not v.strip()) or re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f]',v):
        raise ValueError(f'{name}须为不超过{limit}字的文字')
    return v.strip()


def validate_slides(slides, count=None):
    if not isinstance(slides,list) or not 4<=len(slides)<=12 or count is not None and len(slides)!=count:
        raise ValueError('课件页数与设置不一致（允许4–12页）')
    result=[]
    for i,s in enumerate(slides):
        if not isinstance(s,dict) or s.get('kind') not in KINDS:raise ValueError(f'第{i+1}页类型无效')
        title=_text(s.get('title'),32,f'第{i+1}页标题')
        bullets=s.get('bullets');limit=2 if s['kind']=='cover' else 4
        if not isinstance(bullets,list) or not 1<=len(bullets)<=limit:raise ValueError(f'第{i+1}页需1–{limit}条要点')
        bullets=[_text(x,55,f'第{i+1}页要点') for x in bullets]
        if '\n' in title or any('\n' in x for x in bullets):raise ValueError('标题和每条要点请各占一行')
        result.append(dict(kind=s['kind'],title=title,bullets=bullets,note=_text(s.get('note',''),600,f'第{i+1}页讲稿',True)))
    if result[0]['kind']!='cover' or result[-1]['kind']!='summary':raise ValueError('首尾页须为封面与总结')
    if not {'activity','question'}<=set(s['kind'] for s in result):raise ValueError('请包含动手活动与课堂提问')
    return result


def build_presentation(topic, slides, config, example=False):
    slides=validate_slides(slides,config.get('slide_count'))
    prs=Presentation();prs.slide_width=Inches(13.333333);prs.slide_height=Inches(7.5)
    prs.core_properties.title=topic;prs.core_properties.author='竞潮小学 · 章沂婷老师作品'
    prs.core_properties.subject='内置人工教学示例' if example else '主题备课包 · 待教师审核'
    prs.core_properties.keywords='教学,课件,可编辑'
    def rgb(v):return RGBColor.from_string(v)
    def shape(slide,x,y,w,h,fill,rounded=True,line=None):
        s=slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE if rounded else MSO_SHAPE.RECTANGLE,Inches(x),Inches(y),Inches(w),Inches(h));s.fill.solid();s.fill.fore_color.rgb=rgb(fill)
        if line:s.line.color.rgb=rgb(line)
        else:s.line.fill.background()
        if rounded:s.adjustments[0]=.12
        return s
    def text(slide,x,y,w,h,value,size=20,color='24485A',bold=False):
        s=slide.shapes.add_textbox(Inches(x),Inches(y),Inches(w),Inches(h));tf=s.text_frame
        tf.clear();tf.word_wrap=True;tf.margin_left=tf.margin_right=0;tf.margin_top=tf.margin_bottom=0;tf.vertical_anchor=MSO_ANCHOR.MIDDLE
        for i,line in enumerate(value.split('\n')):
            p=tf.paragraphs[0] if i==0 else tf.add_paragraph();p.text=line;p.font.name='Microsoft YaHei';p.font.size=Pt(size);p.font.bold=bold;p.font.color.rgb=rgb(color);p.space_before=p.space_after=Pt(0)
            for run in p.runs:
                pr=run._r.get_or_add_rPr();ea=OxmlElement('a:ea');ea.set('typeface','Microsoft YaHei');pr.append(ea)
        return s
    for i,item in enumerate(slides):
        s=prs.slides.add_slide(prs.slide_layouts[6]);dark=item['kind']=='question';bg='173F50' if dark else 'F0F6F4';ink='F2F7F7' if dark else '24485A';muted='B4D1D6' if dark else '617D88';accent='B4D9C8' if dark else '357B72'
        s.background.fill.solid();s.background.fill.fore_color.rgb=rgb(bg)
        edge=shape(s,12.92,0,.42,7.5,'B2D7C8',False)
        edge.width=prs.slide_width-edge.left
        header_grade=str(config.get('grade','小学六年级'));header_subject=str(config.get('subject','信息科技'))
        header_grade=header_grade if len(header_grade)<=16 else header_grade[:15]+'…'
        header_subject=header_subject if len(header_subject)<=16 else header_subject[:15]+'…'
        text(s,.65,.42,10,.4,f'{header_grade} · {header_subject}  /  {LABELS[item["kind"]]}',12,muted)
        text(s,11.45,.42,.8,.4,f'{i+1:02} / {len(slides):02}',12,muted)
        if item['kind']=='cover':
            text(s,.75,1.45,11.25,1.6,item['title'],44,ink,True)
            for j,b in enumerate(item['bullets']):text(s,.8,3.45+j*1.05,10.9,.95,b,24,muted)
            for j,label in enumerate(['提出问题','动手验证','交流发现']):
                shape(s,.8+j*3.65,6.02,3.35,.55,'DCEAE4');text(s,1.02+j*3.65,6.08,2.95,.4,f'{j+1:02}  {label}',14,'3D716B')
        else:
            text(s,.72,1.05,11.4,1.25,item['title'],33,ink,True)
            start=2.55
            for j,b in enumerate(item['bullets']):
                y=start+j*.96;fill='245566' if dark else 'FFFFFF'
                shape(s,.72,y,11.55,.82,fill,line=None if dark else 'DCE9E4')
                shape(s,.94,y+.19,.43,.43,accent)
                text(s,1.035,y+.2,.25,.32,str(j+1),13,'173F50' if dark else 'FFFFFF',True)
                text(s,1.6,y+.06,10.25,.70,b,20,ink)
        text(s,.75,7.03,10,.25,'竞潮小学 · 章沂婷老师作品' + ('  ·  内置人工示例' if example else '  ·  教师审核后使用'),10,muted)
        s.notes_slide.notes_text_frame.text=('内置人工教学示例。\n' if example else '')+item['note']
    out=io.BytesIO();prs.save(out);return out.getvalue()
