import json
import os
import secrets
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash


def seed(db, data):
    timestamp=datetime.now(timezone.utc).isoformat(timespec='seconds')
    dump=lambda x:json.dumps(x,ensure_ascii=False)
    teacher_password=secrets.token_urlsafe(15)
    student_password=secrets.token_urlsafe(15)
    teacher=db.execute('INSERT INTO users(username,name,password,role) VALUES(?,?,?,?)',('teacher','信息科技老师',generate_password_hash(teacher_password),'teacher')).lastrowid
    code=secrets.token_hex(4).upper()
    cid=db.execute('INSERT INTO classes(teacher_id,name,subject,grade,code,demo) VALUES(?,?,?,?,?,1)',(teacher,'六年级 1 班 · 示例','信息科技','小学六年级',code)).lastrowid
    students=[]
    for i,name in enumerate(['小禾','小宇','小溪','小满','小星','小林','小舟','小雨']):
        uid=db.execute('INSERT INTO users(username,name,password,role,demo) VALUES(?,?,?,?,1)',('student.demo' if i==0 else 'demo.student'+str(i+1),name+'（示例）',generate_password_hash(student_password if i==0 else secrets.token_urlsafe(24)),'student')).lastrowid
        db.execute('INSERT INTO members VALUES(?,?)',(cid,uid))
        students.append(uid)
    questions=[
        dict(id='1',type='choice',prompt='班级用电子表格记录一周的校园气温。为了比较每天气温的变化，最适合使用哪一种图表？',options=['饼图','折线图','仅按姓名排序的表格','文件夹目录'],answer='B',rubric='选择 B 得满分。',skill='数据表达',points=20),
        dict(id='2',type='choice',prompt='编写“如果光线太暗，就打开台灯”的程序，主要使用了哪一种控制结构？',options=['顺序结构','选择结构','仅重复结构','文件压缩'],answer='B',rubric='选择 B 得满分。',skill='算法与控制',points=20),
        dict(id='3',type='choice',prompt='你想让 AI 帮忙分析班级同学的运动习惯，哪一种做法更合适？',options=['上传每个人的身份证号','上传家庭住址和联系电话','先去掉姓名等信息，只使用匿名汇总数据','公开全班的健康档案'],answer='C',rubric='选择 C 得满分。',skill='数字公民',points=20),
        dict(id='4',type='text',prompt='某 AI 告诉你：“学校明天放假。”请写出至少两种核实这个消息的做法，并说明为什么不能直接转发。',answer='核对学校官方通知；向班主任或学校确认；核查消息时间与来源。AI 可能生成错误信息，未经确认转发可能误导同学。',rubric='写出两种有效核实方式各得 12 分；说明 AI 输出可能不准确且未经核实转发有风险得 16 分。',skill='人工智能素养',points=40)
    ]
    aid=db.execute('INSERT INTO assignments(teacher_id,class_id,title,description,questions,published,created,demo) VALUES(?,?,?,?,?,1,?,1)',(teacher,cid,'数据与智能生活 · 单元诊断','4 道题，预计 15 分钟。结合生活情境解释你的想法。',dump(questions),timestamp)).lastrowid
    profiles=[(20,20,20,36),(20,20,20,30),(20,0,20,28),(0,20,20,24),(20,20,20,40),(20,0,20,20),(20,20,20,None)]
    for uid,profile in zip(students,profiles):
        answers={'1':'B' if profile[0] else 'A','2':'B' if profile[1] else 'A','3':'C','4':'查看学校正式通知，再向班主任确认。AI 的信息可能出错，不能未经核实就转发。'}
        grades=[dict(id=q['id'],score=score,feedback='示例批注：请结合消息来源和发布时间说明核实过程。' if q['type']=='text' else ('回答正确' if score else '请结合实际情境重新判断。'),source='teacher' if score is not None else 'pending') for q,score in zip(questions,profile)]
        status='submitted' if profile[-1] is None else 'reviewed'
        db.execute('INSERT INTO submissions(assignment_id,student_id,answers,grades,status,submitted,reviewed) VALUES(?,?,?,?,?,?,?)',(aid,uid,dump(answers),dump(grades),status,timestamp,timestamp if status=='reviewed' else None))
    next_questions=[
        dict(id='1',type='choice',prompt='设计校园节水提醒器时，“检测到水龙头持续流水超过 30 秒就发出提醒”中的判断条件是什么？',options=['发出提醒','持续流水超过 30 秒','安装外壳','关闭程序'],answer='B',rubric='选择 B 得 20 分。',skill='算法与控制',points=20),
        dict(id='2',type='choice',prompt='为了验证节水提醒器是否有效，哪一组数据最有帮助？',options=['外壳的颜色','设备的品牌名称','使用前后在相同条件下的平均流水时长','教室的门牌号'],answer='C',rubric='选择 C 得 20 分。',skill='数据分析',points=20),
        dict(id='3',type='text',prompt='请用自然语言或伪代码描述节水提醒器的工作步骤，至少包含一次条件判断。',answer='重复读取传感器；若持续流水时间超过阈值，发出提醒；水流停止后重置计时；继续检测。',rubric='输入/检测描述 15 分；条件判断与阈值 15 分；提醒动作 15 分；循环与复位 15 分。',skill='算法与控制',points=60)
    ]
    db.execute('INSERT INTO assignments(teacher_id,class_id,title,description,questions,published,created,demo) VALUES(?,?,?,?,?,1,?,1)',(teacher,cid,'设计校园节水提醒器','把算法用在生活中。请先独立思考，再向学习智能体提问。',dump(next_questions),timestamp))
    documents=[
        ('lesson','让数据说话：校园节水小调查', '''# 让数据说话：校园节水小调查

六年级信息科技 · 1 课时 / 40 分钟 · 可编辑示例教案

## 教学目标
1. 区分原始记录和整理后的数据，能识别缺失值与明显异常值。
2. 使用电子表格整理匿名调查数据，选择合适的图表表达发现。
3. 能说明 AI 分析建议需要人工核验，避免以偏概全。

## 学情与材料
本教案以学生掌握基本表格输入为假设，需教师课前核实。准备虚构用水记录、电子表格软件、投影设备。无需收集学生个人信息。

## 重点与难点
重点：从问题出发选择数据与图表。难点：区分数据支持的结论与未经证实的推测。

## 教学过程
### 01 情境导入 · 5 分钟
展示“洗手时水龙头开多久”这一问题。学生先提出猜想，教师追问需要什么证据。
### 02 清洗数据 · 10 分钟
小组检查 12 条虚构记录，标记空白值、重复值与异常值，记录修改理由，不直接删除不符合预期的数据。
### 03 可视化表达 · 12 分钟
计算不同情境的平均流水时长，选择条形图进行比较，补充标题、单位和数据来源。
### 04 人机协同核验 · 8 分钟
将匿名汇总交给 AI 请求解释。学生逐句检查建议，标记“数据支持”“尚需证据”。教师核验结论。
### 05 退出卡 · 5 分钟
用一句话描述发现，并列出一项数据局限。

## 分层支持
基础组使用带表头的数据模板；进阶组比较均值与极端值的影响；挑战组设计后续验证方案。

## 评价标准
数据整理正确 30%；图表表达清晰 30%；结论有证据 25%；隐私与合作 15%。

## 教师审核
示例内容不对应指定教材页码。使用前请依据本校教材与学情调整。'''),
        ('resource','AI 信息核验学习单', '''# AI 信息核验学习单

姓名可填写学习代号。请先独立判断，再与同伴讨论。

## 情境一
AI 声称“只要每天玩编程游戏，就一定能成为程序员”。
- 这句话中哪些词让你产生疑问？
- 你需要什么证据来判断？
- 你会怎样修改这句话，让它更准确？

## 情境二
AI 提供了一段学校放假通知，但没有说明来源。
- 找到原始发布渠道。
- 核对发布时间与适用对象。
- 请老师协助确认。

## 自我检查
- 我能区分事实与意见。
- 我会查看来源和时间。
- 我知道 AI 可能出错。
- 我不会上传自己或他人的敏感信息。

## 课堂讨论
为什么“回答很流畅”不能证明“回答一定正确”？'''),
        ('design','人机协同：校园节水提醒器', '''# 人机协同：校园节水提醒器

## 驱动问题
怎样用简单算法提醒同学合理用水？

## 可见学习证据
每组提交一张流程图、一段伪代码、两组测试记录和一次修改说明。

## 三方分工
- 教师：确定目标、检查数据与安全边界、设计评价量规、确认最终结论。
- 学生：观察问题、编写规则、亲自测试、解释取舍。
- AI：对流程提出追问、帮助发现遗漏条件、提供表达建议。

## 40 分钟活动安排
提出问题 5 分钟；小组设计 12 分钟；模拟测试 10 分钟；比较 AI 建议 8 分钟；展示反思 5 分钟。

## 关键提问
如果有人短暂停止用水，计时器应该怎样处理？为什么设置 30 秒而不是 10 秒？你需要什么实验来决定？

## 评价量规
算法逻辑 40%；测试覆盖 25%；解释与改进 25%；合作与隐私 10%。

## 无网络方案
使用纸质条件卡、计时器和角色扮演模拟设备运行。

## 教师复核记录
待补充：教材依据、班级差异、设备条件和课堂实施后的证据。'''),
        ('reflection','教学反思记录模板', '''# 教学反思记录

本模板尚未包含真实课堂结果，请据实填写。

## 本次教学目标
待补充。

## 可核验的观察事实
记录作品、课堂发言、完成时长或退出卡数据，避免仅凭印象。

## 学生困难与可能原因
将观察事实与解释假设分开，列出尚缺的证据。

## AI 建议及教师取舍
记录采纳、修改或拒绝的建议，并说明理由。

## 下一课改进
每项措施对应一个可观察的验证指标。

## 幼教专项可选模板
如用于幼儿园，请改为游戏观察、活动材料与教师支持记录，不使用能力排名和诊断标签。'''),
        ('media','一分钟微课：AI 的回答一定正确吗', '''# 一分钟微课：AI 的回答一定正确吗

## 分镜 1 · 0–12 秒
画面：一个没有来源的“明天放假”消息框。
旁白：当 AI 给出一个听起来很确定的消息，你会直接相信吗？
字幕：流畅的回答 ≠ 可靠的事实。

## 分镜 2 · 12–30 秒
画面：来源、时间、证据三张卡片依次出现。
旁白：先找到原始来源，再核对时间，最后用可靠证据交叉验证。
字幕：查来源 / 核时间 / 找证据。

## 分镜 3 · 30–48 秒
画面：学生与老师共同核对学校正式通知。
旁白：重要消息，向老师或官方渠道确认。不要转发未经核实的信息。

## 分镜 4 · 48–60 秒
画面：提出问题“你会怎样验证一条 AI 回答？”
旁白：把 AI 当成帮助思考的伙伴，保留自己的判断。

## 素材说明
请使用自制图形、授权素材或系统内海报工具，发布前检查肖像与版权。''')
    ]
    for kind,title,body in documents:
        db.execute('INSERT INTO documents(owner_id,kind,title,body,meta,class_id,published,created,updated,demo) VALUES(?,?,?,?,?,?,?,?,?,1)',(teacher,kind,title,body,dump(dict(grade='小学六年级',subject='信息科技')),cid,1 if kind=='resource' else 0,timestamp,timestamp))
    for name,desc,instructions,knowledge in [
        ('小知 · 信息科技学习伙伴','用追问启发思考，陪你理解数据、算法与人工智能。','用适合六年级学生的语言。先问学生已有思路，每次给一个线索；不直接替学生完成整份作业。','数据需要核验来源；算法包含顺序、选择和循环等结构；AI 输出可能出现错误；网络交流应保护隐私。'),
        ('算法实验室','把生活问题拆成步骤，检查条件与循环。','引导学生用自然语言或伪代码描述输入、条件、处理、输出。用小例子检查遗漏情况。','选择结构根据条件执行不同分支。循环结构重复执行步骤。测试需覆盖正常情况与边界情况。'),
        ('数字公民向导','一起判断信息是否可信，学习安全与负责任地使用 AI。','面对消息先追问来源和证据；提醒匿名化。不要索要任何个人敏感信息。','信息核验包括来源、时间与交叉验证。AI 输出不是事实保证。未经许可不要分享他人个人信息。')
    ]:
        db.execute('INSERT INTO agents(owner_id,name,description,instructions,knowledge,class_id,published,demo) VALUES(?,?,?,?,?,?,1,1)',(teacher,name,desc,instructions,knowledge,cid))
    credentials={'teacher_username':'teacher','teacher_password':teacher_password,'student_username':'student.demo','student_password':student_password,'demo_class_code':code}
    path=data/'initial-accounts.json'
    fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
    with os.fdopen(fd,'w') as f:
        f.write(dump(credentials))
