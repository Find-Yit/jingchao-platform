/* Hand-authored examples. No model call, analytics, cookies or server state. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const lab = $('creation-lab');
  if (!lab) return;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const pairs = [[2, 3], [4, 2], [3, 6]];
  let pairIndex = 0, fractionStep = 0, fractionTime = 0, fractionFrame = 0;
  let fractionPlaying = false, fractionPrevious = 0, fractionGoal = 8.8, fractionSplit = null;
  let fractionBlue = null, fractionGold = null, fractionUIKey = '';
  let fractionGeometry = { blueY:0, goldY:0, goldX:0 };
  const fractionReduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fractionStops = [0, 2.5, 4.8, 7.1, 8.8];
  let binaryValue = 7, binaryTimer = null;
  let layoutMode = 'inline';
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  // The cargo is the original colored area; the destination never creates a copy.
  const fractionPose = t => {
    const ease = n => { const x = Math.max(0, Math.min(1,n)); return x*x*(3-2*x); };
    return { blue:ease((t-2.5)/1.9), gold:ease((t-4.8)/1.9), join:ease((t-7.1)/1.3), phase:t<=1.3?0:t<=2.5?1:t<=4.8?2:t<=7.1?3:4 };
  }; // fractionPose:end
  function feedback(id, text, correct) {
    $(id).textContent = text;
    $(id).dataset.correct = String(correct);
  }
  function fractionButton() {
    const label=fractionPlaying ? '暂停动画' : fractionTime>=8.8 ? '重新播放' : fractionReduced.matches ? '下一步演示' : fractionTime>0 ? '继续动画' : '播放动画';
    if($('fraction-play').textContent!==label)$('fraction-play').textContent=label;
  }
  function stopFraction() {
    cancelAnimationFrame(fractionFrame); fractionFrame=0; fractionPlaying=false; fractionButton();
  }
  function stopBinary() {
    clearTimeout(binaryTimer); binaryTimer = null;
    $('binary-play').textContent = '自动数数';
  }
  function pauseAll() { stopFraction(); stopBinary(); }
  function fractionNumbers() {
    const [a,b]=pairs[pairIndex], common=a*b/gcd(a,b), first=common/a, second=common/b;
    return {a,b,common,first,second,sum:first+second,factor:gcd(first+second,common)};
  }
  function fractionGrid(bar, parts) {
    bar.style.setProperty('--parts',parts);
    const grid=bar.querySelector('.fraction-cell-grid');
    grid.replaceChildren(...Array.from({length:parts},()=>{const cell=document.createElement('span');cell.className='fraction-piece';cell.setAttribute('aria-hidden','true');return cell;}));
  }
  function buildFraction() {
    const n=fractionNumbers(); fractionSplit=null; fractionUIKey='';
    ['a','b','sum'].forEach(key=>{
      const bar=$('fraction-bar-'+key), grid=document.createElement('div');grid.className='fraction-cell-grid';grid.setAttribute('aria-hidden','true');bar.replaceChildren(grid);
      if(key==='sum'){const hint=document.createElement('span');hint.className='fraction-slot-hint';hint.textContent='先放蓝色，再放黄色';hint.setAttribute('aria-hidden','true');bar.append(hint);}
    });
    function cargo(key,color,pieces){
      const block=document.createElement('i');block.className='fraction-cargo '+color;block.style.width=(pieces/n.common*100)+'%';block.style.setProperty('--cargo-parts',pieces);block.setAttribute('aria-hidden','true');
      const outline=document.createElement('i');outline.className='fraction-origin '+color;outline.style.width=block.style.width;outline.setAttribute('aria-hidden','true');
      $('fraction-bar-'+key).append(outline,block);return block;
    }
    fractionBlue=cargo('a','blue',n.first);fractionGold=cargo('b','gold',n.second);
    measureFraction(); drawFraction();
  }
  function measureFraction() {
    if(!fractionBlue)return;
    const a=$('fraction-bar-a').getBoundingClientRect(), b=$('fraction-bar-b').getBoundingClientRect(), total=$('fraction-bar-sum').getBoundingClientRect(), n=fractionNumbers();
    fractionGeometry={blueY:total.top-a.top,goldY:total.top-b.top,goldX:total.left-b.left+$('fraction-bar-sum').clientWidth*n.first/n.common,gap:Math.min(14,$('fraction-bar-sum').clientWidth/n.common*.22)};
    drawFraction();
  }
  function drawFraction() {
    if(!fractionBlue)return;
    const n=fractionNumbers(), pose=fractionPose(fractionTime), split=pose.phase>0;
    fractionStep=pose.phase;
    if(fractionSplit!==split){
      fractionSplit=split;fractionGrid($('fraction-bar-a'),split?n.common:n.a);fractionGrid($('fraction-bar-b'),split?n.common:n.b);fractionGrid($('fraction-bar-sum'),n.common);
    }
    fractionBlue.style.transform=`translate3d(0,${pose.blue*fractionGeometry.blueY}px,0)`;
    fractionGold.style.transform=`translate3d(${pose.gold*(fractionGeometry.goldX+fractionGeometry.gap*(1-pose.join))}px,${pose.gold*fractionGeometry.goldY}px,0)`;
    const uiKey=`${pairIndex}:${pose.phase}:${pose.blue===1}:${pose.gold===1}:${fractionTime>=8.8}`;
    if(fractionUIKey===uiKey){fractionButton();return;}
    fractionUIKey=uiKey;
    $('fraction-stage').dataset.step=String(pose.phase);
    $('fraction-stage').classList.toggle('is-split',split);
    $('fraction-label-a').textContent=split?`${n.first}/${n.common}`:`1/${n.a}`;
    $('fraction-label-b').textContent=split?`${n.second}/${n.common}`:`1/${n.b}`;
    $('fraction-label-sum').textContent=pose.phase===4?`${n.sum}/${n.common}`:pose.phase===3?'再放黄块':pose.phase===2?'先放蓝块':'结果槽';
    const simplified=n.factor>1?` = ${n.sum/n.factor}/${n.common/n.factor}`:'';
    $('fraction-equation').textContent=pose.phase===0?`1/${n.a} + 1/${n.b} = ?`:pose.phase===4?`${n.first}/${n.common} + ${n.second}/${n.common} = ${n.sum}/${n.common}${simplified}`:`${n.first}/${n.common} + ${n.second}/${n.common} = ?`;
    $('fraction-explanation').textContent=[
      `蓝色是 1/${n.a}，黄色是 1/${n.b}。每条完整纸带都表示同样长的 1，先比较每份的大小。`,
      `把两个整体都平均分成 ${n.common} 份。蓝色占 ${n.first} 份，黄色占 ${n.second} 份；颜色的长度没有改变。`,
      `先把蓝色的 ${n.first} 小份搬到下方虚线槽的左端。黄色仍留在原位，蓝色原来的位置只留下虚线轮廓。`,
      `蓝色先停好，再让黄色的 ${n.second} 小份落到它的右侧，暂时留一条小缝。下一步再把两段靠拢。`,
      `两段靠拢，每份仍是 1/${n.common}。${n.first} 份加 ${n.second} 份，共 ${n.sum} 份，结果是 ${n.sum}/${n.common}${n.factor>1?`，约分后是 ${n.sum/n.factor}/${n.common/n.factor}`:''}。下方还留着 ${n.common-n.sum} 个空格，整个纸带仍表示 1。`
    ][pose.phase];
    $('fraction-question').textContent=`想一想：1/${n.a} 变成 ${n.first}/${n.common}，表示的量改变了吗？`;
    $('fraction-bar-a').setAttribute('aria-label',`蓝色原位置：${split?n.first:1}/${split?n.common:n.a}${pose.blue===1?'，色块已移入结果槽':''}`);
    $('fraction-bar-b').setAttribute('aria-label',`黄色原位置：${split?n.second:1}/${split?n.common:n.b}${pose.gold===1?'，色块已移入结果槽':''}`);
    $('fraction-bar-sum').setAttribute('aria-label',pose.phase===4?`结果槽：${n.common} 小份中，蓝色 ${n.first} 份，黄色 ${n.second} 份，空白 ${n.common-n.sum} 份`:'虚线结果槽，等待蓝色先到位，再移入黄色');
    lab.querySelectorAll('[data-fraction-step]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.fractionStep)===pose.phase)));
    $('fraction-next').disabled=fractionTime>=8.8;
    fractionButton();
  }
  function fractionTick(now) {
    fractionFrame=0;if(!fractionPlaying)return;
    fractionTime=Math.min(fractionGoal,fractionTime+Math.min(.08,Math.max(0,(now-fractionPrevious)/1000)));fractionPrevious=now;drawFraction();
    if(fractionTime>=fractionGoal){stopFraction();return;}
    fractionFrame=requestAnimationFrame(fractionTick);
  }
  function playFractionTo(goal) {
    stopFraction();fractionGoal=goal;
    if(fractionReduced.matches){fractionTime=goal;drawFraction();return;}
    fractionPlaying=true;fractionPrevious=performance.now();fractionButton();fractionFrame=requestAnimationFrame(fractionTick);
  }
  function nextFraction() {
    stopFraction();const next=fractionStops.find(t=>t>fractionTime+.001);
    if(next!==undefined)playFractionTo(next);
  }
  $('fraction-play').addEventListener('click',()=>{
    if(fractionPlaying){stopFraction();return;}
    if(fractionTime>=8.8){fractionTime=0;drawFraction();}
    if(fractionReduced.matches)nextFraction();else playFractionTo(8.8);
  });
  $('fraction-next').addEventListener('click',nextFraction);
  $('fraction-reset').addEventListener('click',()=>{stopFraction();fractionTime=0;$('fraction-answer').value='';$('fraction-feedback').textContent='';buildFraction();});
  $('fraction-pair').addEventListener('change',event=>{stopFraction();pairIndex=Number(event.target.value);fractionTime=0;$('fraction-answer').value='';$('fraction-feedback').textContent='';buildFraction();});
  lab.querySelectorAll('[data-fraction-step]').forEach(button=>button.addEventListener('click',()=>{
    stopFraction();const step=Number(button.dataset.fractionStep);
    if(step<=1){fractionTime=fractionStops[step];drawFraction();return;}
    fractionTime=fractionStops[step-1];drawFraction();playFractionTo(fractionStops[step]);
  }));
  $('fraction-check').addEventListener('click',()=>{
    const answer=$('fraction-answer').value;
    feedback('fraction-feedback',!answer?'先选一个判断，再来验证。':answer==='same'?'答对了！切分只改变分法，移动只改变位置；蓝色和黄色的长度都没有变化。':'再看前两步：切分前后，色带涂色部分的长度有没有变？',answer==='same');
  });
  if('ResizeObserver' in window)new ResizeObserver(measureFraction).observe($('fraction-stage'));
  window.addEventListener('resize',measureFraction,{passive:true});
  fractionReduced.addEventListener('change',()=>{stopFraction();drawFraction();});

  weights.forEach(weight => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'binary-lamp'; button.dataset.weight = weight;
    button.innerHTML = `<span class="binary-weight">${weight}</span><span class="binary-bulb" aria-hidden="true"></span><b aria-hidden="true">0</b>`;
    button.addEventListener('click', () => { stopBinary(); setBinary(binaryValue ^ weight); });
    $('binary-lamps').append(button);
  });
  function setBinary(value, message) {
    const previous = binaryValue;
    binaryValue = Math.max(0, Math.min(255, Number(value)));
    $('binary-decimal').textContent = binaryValue;
    $('binary-string').textContent = binaryValue.toString(2).padStart(8, '0');
    $('binary-slider').value = binaryValue;
    const active = weights.filter(weight => (binaryValue & weight) !== 0);
    $('binary-sum').textContent = `${active.length ? active.join(' + ') : '所有灯都熄灭'} = ${binaryValue}`;
    $('binary-lamps').querySelectorAll('button').forEach(button => {
      const on = Boolean(binaryValue & Number(button.dataset.weight));
      button.setAttribute('aria-pressed', String(on));
      button.setAttribute('aria-label', `权值 ${button.dataset.weight} 的灯，${on ? '已亮，点击熄灭' : '已灭，点击点亮'}`);
      button.querySelector('b').textContent = on ? '1' : '0';
    });
    $('binary-next').disabled = binaryValue === 255;
    $('binary-explanation').textContent = message || (binaryValue === 255 ? '8 盏灯全部点亮，最大可以表示 255。这个例子只表示 0—255；继续加 1 需要第 9 位。' : previous === 7 && binaryValue === 8 ? '看见进位了吗？4、2、1 三盏灯熄灭，8 那盏灯点亮：00000111 → 00001000。' : '亮表示 1，灭表示 0。把亮灯对应的权值加起来，就是左侧的十进制数。');
  }
  function countBinary() {
    setBinary(binaryValue + 1);
    if (binaryValue < 255) binaryTimer = setTimeout(countBinary, 1100);
    else stopBinary();
  }
  $('binary-slider').addEventListener('input', event => { stopBinary(); setBinary(event.target.value); });
  $('binary-next').addEventListener('click', () => { stopBinary(); setBinary(binaryValue + 1); });
  $('binary-play').addEventListener('click', () => {
    if (binaryTimer) { stopBinary(); return; }
    if (binaryValue === 255) setBinary(0);
    $('binary-play').textContent = '暂停数数'; binaryTimer = setTimeout(countBinary, 1100);
  });
  $('binary-carry').addEventListener('click', () => {
    stopBinary(); setBinary(7, '现在是 7 = 4 + 2 + 1。准备加 1，观察低位的三盏灯如何进位。');
    $('binary-play').textContent = '暂停数数';
    binaryTimer = setTimeout(() => { setBinary(8); stopBinary(); }, 1600);
  });
  $('binary-reset').addEventListener('click', () => {
    stopBinary(); setBinary(7, '点亮一盏灯，就加上它上方的数。点击「加 1」，观察 7 变成 8 时哪些灯变化。');
    $('binary-answer').value = ''; $('binary-feedback').textContent = '';
  });
  $('binary-check').addEventListener('click', () => {
    const raw = $('binary-answer').value.trim(), correct = raw !== '' && Number(raw) === 21;
    feedback('binary-feedback', !raw ? '先写下你的预测，再验证。' : correct ? '答对了！16 + 4 + 1 = 21，对应 00010101。可以点击这三盏灯再验证一次。' : '把题目中三盏灯的权值加起来：16 + 4 + 1。你也可以亲手点亮它们再试。', correct);
  });

  function renderLayout() {
    const side = $('layout-position').value, size = $('layout-size').value;
    $('layout-paper').dataset.mode = layoutMode;
    $('layout-paper').dataset.side = side;
    $('layout-paper').style.setProperty('--picture-width', `${size}%`);
    $('layout-size-value').textContent = `${size}%`;
    $('layout-position').disabled = layoutMode !== 'wrap';
    lab.querySelectorAll('[data-layout-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.layoutMode === layoutMode)));
    $('layout-explanation').textContent = layoutMode === 'inline' ? '嵌入型：图片像一个大字符，参与这一行的排列。这一行会被图片撑高。试试切换「四周型」。' : `四周型：图片靠${side === 'left' ? '左' : '右'}，文字沿图片矩形边缘排列。调整图片大小，观察文字如何重新换行。这里用浏览器模拟排版关系，并非真实 Office。`;
    $('layout-feedback').textContent = '';
  }
  lab.querySelectorAll('[data-layout-mode]').forEach(button => button.addEventListener('click', () => { layoutMode = button.dataset.layoutMode; renderLayout(); }));
  $('layout-position').addEventListener('change', renderLayout);
  $('layout-size').addEventListener('input', renderLayout);
  $('layout-reset').addEventListener('click', () => { layoutMode = 'inline'; $('layout-position').value = 'left'; $('layout-size').value = '32'; renderLayout(); });
  $('layout-check').addEventListener('click', () => {
    const correct = layoutMode === 'wrap' && $('layout-position').value === 'right';
    feedback('layout-feedback', correct ? '完成了！图片靠右，文字沿它的左边排列。继续改变图片大小，看看文字如何跟着调整。' : layoutMode !== 'wrap' ? '图片现在仍像一个大字符。先选「四周型」，让文字可以沿图片边缘排列。' : '已经选对环绕方式了，再把「图片靠哪边」改成右侧。', correct);
  });

  lab.querySelectorAll('[data-copy-prompt]').forEach(button => button.addEventListener('click', async () => {
    const textarea = $(button.dataset.copyPrompt), status = button.nextElementSibling;
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(textarea.value); copied = true; } catch { /* Fall back on HTTP or denied clipboard access. */ }
    }
    if (!copied) {
      textarea.focus(); textarea.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      if (copied) button.focus({ preventScroll: true });
    }
    status.textContent = copied ? '已复制。进入网页创作，粘贴后即可生成。' : '已选中指令，请按 Ctrl/Cmd + C 或长按文字复制。';
  }));
  const anchor = document.createComment('interactive examples home');
  lab.before(anchor);
  const theater = $('creation-theater');
  $('demo-expand').addEventListener('click', () => {
    pauseAll(); $('creation-theater-content').append(lab); theater.showModal();
    document.documentElement.classList.add('no-scroll');
  });
  $('demo-collapse').addEventListener('click', () => theater.close());
  theater.addEventListener('close', () => {
    pauseAll(); anchor.after(lab); document.documentElement.classList.remove('no-scroll');
    $('demo-expand').focus({ preventScroll: true });
  });
  lab.querySelectorAll('.creation-tabs [role=tab]').forEach(button => {
    button.addEventListener('click', pauseAll);
    button.addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) pauseAll(); });
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseAll(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) pauseAll(); }).observe(lab);
  window.addEventListener('pagehide', pauseAll);
  buildFraction(); setBinary(7); renderLayout();
})();
