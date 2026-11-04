/* 竞潮小学 v10: management basics that were missing from the UI.
   - 班级：改名、更换邀请码、重置学生密码、移出班级
   - 删除作业 / 智能体 / 主题备课包
   Loaded after the feature scripts; it only adds actions and wraps existing renderers. */
(() => {
  const suggestPassword = () => {
    const words = ['sun', 'leaf', 'star', 'wind', 'tree', 'cloud', 'river', 'bird'];
    const w = words[Math.floor(Math.random() * words.length)];
    let digits = ''; while ((w + digits).length < 10) digits += Math.floor(Math.random() * 10);
    return w + digits;
  };
  const sure = message => window.confirm(message);
  const run = async (fn, okMessage) => { try { await fn(); if (okMessage) toast(okMessage); return true; } catch (e) { toast(e.message, true); return false; } };

  /* ---------- 班级与学生 ---------- */
  actions['class-students'] = async el => {
    const cid = Number(el.dataset.id); state.manageClass = cid;
    const students = await api('/classes/' + cid + '/students');
    state.classes = await api('/classes');
    const c = state.classes.find(c => c.id === cid);
    openModal(c.name + ' · 班级与学生', `
      <section class="m-class-head">
        <form data-form="rename-class" class="m-rename">${field('班级名称', 'name', c.name, 'text', 'required maxlength="60"')}<button class="btn small" type="submit">保存名称</button></form>
        <div class="m-code"><small>学生邀请码</small><strong>${esc(c.code)}</strong>${button('复制', 'copy-code', 'small', `data-code="${esc(c.code)}"`)}${button('更换邀请码', 'regen-code', 'small')}</div>
      </section>
      <p class="muted m-hint">${icon('info')} 邀请码泄露或学期结束后可以更换，旧码立即失效；已加入的学生不受影响。</p>
      <div class="table-wrap section-gap"><table class="m-roster"><thead><tr><th>显示名称</th><th>登录账号</th><th>类型</th><th class="m-ops">操作</th></tr></thead><tbody>${students.map(s => `<tr><td>${esc(s.name)}</td><td><code>${esc(s.username)}</code></td><td>${badge(s.demo ? '示例' : '学生', s.demo ? 'gray' : '')}</td><td class="m-ops">${button('重置密码', 'reset-student', 'small', `data-uid="${s.id}" data-name="${esc(s.name)}" data-username="${esc(s.username)}"`)}${button('移出班级', 'remove-student', 'small danger', `data-uid="${s.id}" data-name="${esc(s.name)}"`)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">还没有学生。把邀请码交给学生，或在下方创建账号。</td></tr>'}</tbody></table></div>
      <div class="subtle-divider"></div><h3>添加学生账号</h3>
      <form data-form="add-student"><div class="form-grid">${field('显示名称 / 学习代号', 'name', '', 'text', 'required maxlength="40"')}${field('登录账号', 'username', '', 'text', 'required pattern="[A-Za-z0-9_.-]{3,40}" placeholder="例如：student001"')}</div>${field('初始密码（至少 10 位，可直接告诉学生）', 'password', suggestPassword(), 'text', 'required minlength="10" autocomplete="off"')}<div class="modal-actions"><button class="btn primary" type="submit">创建并加入班级</button></div></form>`, true);
  };
  const reopen = () => actions['class-students']({ dataset: { id: state.manageClass } });
  forms['rename-class'] = async f => { if (await run(() => api('/classes/' + state.manageClass, 'PUT', Object.fromEntries(new FormData(f))), '班级名称已更新')) { state.classes = await api('/classes'); await reopen(); } };
  actions['regen-code'] = async () => {
    if (!sure('更换后旧邀请码立即失效，确定更换吗？')) return;
    if (await run(() => api('/classes/' + state.manageClass + '/code', 'POST', {}), '已生成新的邀请码')) await reopen();
  };
  actions['reset-student'] = el => {
    const pw = suggestPassword();
    openModal('重置密码 · ' + el.dataset.name, `<form data-form="reset-student" data-uid="${el.dataset.uid}">
      <p class="muted">学生账号 <code>${esc(el.dataset.username)}</code>。设置后请把新密码当面告诉学生，学生登录后可在“账号设置”里自己修改。</p>
      ${field('新密码（至少 10 位）', 'password', pw, 'text', 'required minlength="10" autocomplete="off"')}
      <div class="modal-actions">${button('返回', 'back-to-roster')}<button class="btn primary" type="submit">确认重置</button></div></form>`);
  };
  actions['back-to-roster'] = () => reopen();
  forms['reset-student'] = async f => {
    const pw = new FormData(f).get('password');
    if (await run(() => api('/classes/' + state.manageClass + '/students/' + Number(f.dataset.uid) + '/password', 'POST', { password: pw }))) {
      openModal('密码已重置', `<p>新密码：</p><p class="m-newpw"><code>${esc(pw)}</code></p><p class="muted">这个窗口关闭后不会再显示，请现在记下或告诉学生。</p><div class="modal-actions">${button('返回学生名单', 'back-to-roster', 'primary')}</div>`);
    }
  };
  actions['remove-student'] = async el => {
    if (!sure(`确定把「${el.dataset.name}」移出这个班级吗？\n学生账号和已提交的作业会保留，之后可用邀请码重新加入。`)) return;
    if (await run(() => api('/classes/' + state.manageClass + '/students/' + Number(el.dataset.uid), 'DELETE'), '已移出班级')) { state.classes = await api('/classes'); await reopen(); }
  };

  /* ---------- 删除作业 ---------- */
  if (typeof openTask === 'function') {
    const originalOpenTask = openTask;
    openTask = function (id) {
      const result = originalOpenTask.apply(this, arguments);
      if (teacher()) {
        const bar = document.querySelector('#modal-root .sticky-actions');
        if (bar && !bar.querySelector('[data-action="delete-task"]')) bar.insertAdjacentHTML('afterbegin', button('删除作业', 'delete-task', 'text-button m-danger-text'));
      }
      return result;
    };
  }
  actions['delete-task'] = async () => {
    const t = state.currentTask; if (!t) return;
    if (!sure(`确定删除作业「${t.title}」吗？删除后不能恢复。`)) return;
    try { await api('/assignments/' + t.id, 'DELETE'); }
    catch (e) {
      if (!/已有 \d+ 份学生提交/.test(e.message)) { toast(e.message, true); return; }
      if (!sure(e.message + '。\n仍然删除吗？')) return;
      if (!await run(() => api('/assignments/' + t.id + '?force=1', 'DELETE'))) return;
    }
    toast('作业已删除'); closeModal(); state.currentTask = null; await route();
  };

  /* ---------- 删除智能体 ---------- */
  if (typeof agentEditor === 'function') {
    const originalAgentEditor = agentEditor;
    agentEditor = function (a) {
      const result = originalAgentEditor.apply(this, arguments);
      if (a && a.id) {
        const actionsRow = document.querySelector('#modal-root form[data-form="save-agent"] .modal-actions');
        if (actionsRow && !actionsRow.querySelector('[data-action="delete-agent"]')) actionsRow.insertAdjacentHTML('afterbegin', button('删除智能体', 'delete-agent', 'text-button m-danger-text', `data-id="${a.id}" data-name="${esc(a.name)}"`));
      }
      return result;
    };
  }
  actions['delete-agent'] = async el => {
    if (!sure(`确定删除智能体「${el.dataset.name}」吗？学生与它的对话记录也会一起删除。`)) return;
    if (await run(() => api('/agents/' + Number(el.dataset.id), 'DELETE'), '智能体已删除')) { closeModal(); state.agentId = null; await route(); }
  };

  /* ---------- 删除主题备课包 ---------- */
  if (typeof kitShelf === 'function') {
    const originalShelf = kitShelf;
    kitShelf = function () {
      const html = originalShelf.apply(this, arguments);
      return html.replace(/<button class="kit-shelf-card" data-action="kit-open" data-id="(\d+)">([\s\S]*?)<\/button>/g,
        (m, id, inner) => `<div class="m-kit-wrap"><button class="kit-shelf-card" data-action="kit-open" data-id="${id}">${inner}</button><button type="button" class="m-kit-delete" data-action="kit-delete" data-id="${id}" aria-label="删除这个备课包" title="删除这个备课包">${icon('close')}</button></div>`);
    };
  }
  actions['kit-delete'] = async el => {
    if (!sure('确定删除这个备课包吗？\n已经生成并保存的教案和作业会保留在“备课”和“作业中心”。')) return;
    if (await run(() => api('/lesson-kits/' + Number(el.dataset.id), 'DELETE'), '备课包已删除')) {
      if (typeof lessonKit !== 'undefined') { lessonKit.items = lessonKit.items.filter(k => k.id !== Number(el.dataset.id)); if (lessonKit.current?.id === Number(el.dataset.id)) lessonKit.current = null; }
      if (typeof kitRender === 'function') kitRender(); else await route();
    }
  };
})();
