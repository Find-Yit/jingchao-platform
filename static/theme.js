/* 竞潮小学 v10 theme layer: login page. Loaded after platform.js and wraps the
   existing loginPage (which in turn wraps app.js), keeping the same form fields,
   data-form names, #login-error and the switch-login action. */
(() => {
  if (typeof loginPage !== 'function') return;
  const worlds = [
    ['changan', '盛唐长安', '长街、城门与坊市'],
    ['egypt', '古埃及金字塔', '石层里的几何'],
    ['dinosaurs', '恐龙时代', '蕨林里的巨兽']
  ];
  const features = [
    ['book', '备课与作业', '教案、课件、作业一处完成'],
    ['code', '操作课堂', 'Word · Excel · PPT 真实练习'],
    ['spark', '三维探索', '在时空之门里边走边学']
  ];
  const render = () => {
    const reg = state.register;
    const fields = (reg
      ? field('班级邀请码', 'code', '', 'text', 'required maxlength="20" autocomplete="off" placeholder="向老师要 8 位邀请码"') +
        field('显示名称或学习代号', 'name', '', 'text', 'required maxlength="40" placeholder="同学们会看到这个名字"')
      : '') +
      field('账号', 'username', '', 'text', 'required autocomplete="username" placeholder="' + (reg ? '设置英文或数字账号' : '教师或学生账号') + '"') +
      field('密码', 'password', '', 'password', 'required autocomplete="' + (reg ? 'new-password' : 'current-password') + '" placeholder="' + (reg ? '至少 10 位' : '输入你的密码') + '" ' + (reg ? 'minlength="10"' : ''));
    $('#app').innerHTML = `<div class="login-page t-login">
      <section class="t-login-hero" aria-label="竞潮小学信息科技课堂">
        <header class="t-brand"><span class="t-mark">${typeof glassMark==='function'?glassMark():'<img src="/static/favicon.svg" alt="">'}</span><div><strong>竞潮小学</strong><small>信息科技课堂 · 章沂婷老师作品</small></div></header>
        <div class="t-hero-copy">
          <span class="t-eyebrow">小学信息科技 · 六年级</span>
          <h1>学习，可以是一次<br><em>奇妙的发现。</em></h1>
          <p>老师在这里备课、布置作业、看懂每一道题；同学们在三维世界里探索，在操作课堂里动手做。</p>
        </div>
        <div class="t-worlds">${worlds.map(([id, name, note], i) => `<figure class="t-world t-world-${i}"><img src="/static/brand/login-${id}.jpg" alt="${name}三维学习场景" loading="${i ? 'lazy' : 'eager'}"><figcaption><strong>${name}</strong><small>${note}</small></figcaption></figure>`).join('')}</div>
        <ul class="t-features">${features.map(([ic, t, d]) => `<li><span>${icon(ic)}</span><div><strong>${t}</strong><small>${d}</small></div></li>`).join('')}</ul>
      </section>
      <section class="t-login-panel">
        <form class="login-form t-form" data-form="${reg ? 'register' : 'login'}">
          <div class="t-form-head">
            <span class="t-eyebrow">${reg ? '加入班级' : '欢迎回来'}</span>
            <h2>${reg ? '和好奇心一起出发' : '登录竞潮小学'}</h2>
            <p>${reg ? '填写老师给你的邀请码，创建自己的学习账号。' : '老师和同学都用自己的账号登录。'}</p>
          </div>
          ${fields}
          <div class="error-text" id="login-error" role="alert"></div>
          <button class="btn primary login-submit" type="submit">${reg ? '加入班级' : '进入我的空间'} ${icon('arrow')}</button>
          <button type="button" class="login-switch" data-action="switch-login">${reg ? '已有账号？返回登录' : '新同学？用班级邀请码加入'}</button>
          <footer class="t-form-foot"><span>${icon('shield')} 账号由老师管理，忘记密码请找老师重置</span><a href="/intro/" target="_blank" rel="noopener">了解这个平台 ↗</a></footer>
        </form>
      </section>
    </div>`;
    $('.t-form input')?.focus({ preventScroll: true });
  };
  const previous = loginPage;
  loginPage = function () {
    previous();
    document.body.classList.add('t-login-body');
    render();
  };
  const leave = () => document.body.classList.remove('t-login-body');
  const previousShell = typeof shell === 'function' ? shell : null;
  if (previousShell) shell = function () { leave(); return previousShell.apply(this, arguments); };
  if (document.querySelector('.login-page')) loginPage();
})();
