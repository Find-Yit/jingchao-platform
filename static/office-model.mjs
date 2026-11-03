// Pure, bounded spreadsheet/document operations shared by the practice UI and tests.
export const clone = value => structuredClone(value);
export function address(raw){if(typeof raw!=='string'||!/^\$?[A-L]\$?([1-9]|[12][0-9]|30)$/i.test(raw))throw Error('单元格超出 A1:L30');return raw.toUpperCase().replaceAll('$','');}
export function range(raw){const parts=String(raw).toUpperCase().split(':');if(parts.length>2)throw Error('区域格式不正确');const a=address(parts[0]),b=address(parts.at(-1)),r1=+a.slice(1),r2=+b.slice(1),c1=a.charCodeAt(0),c2=b.charCodeAt(0);if(r2<r1||c2<c1||(r2-r1+1)*(c2-c1+1)>120)throw Error('区域大小或方向不正确');return Array.from({length:r2-r1+1},(_,r)=>Array.from({length:c2-c1+1},(_,c)=>String.fromCharCode(c1+c)+(r1+r))).flat();}
export function shiftFormula(raw,rows=0,cols=0){if(!raw.startsWith('='))return raw;return raw.replace(/(\$?)([A-L])(\$?)([1-9]|[12][0-9]|30)(?!\d)/gi,(_,ac,c,ar,r)=>{const col=c.toUpperCase().charCodeAt(0)+(ac?0:cols),row=+r+(ar?0:rows);return ac+address(String.fromCharCode(col)+row).replace(/\d+$/, '')+ar+row;});}
export function calculate(cells,ref,visiting=new Set()){
 ref=address(ref);if(visiting.has(ref)||visiting.size>40)throw Error('循环引用');const raw=(cells[ref]??'').trim();if(!raw)return 0;
 if(!raw.startsWith('=')){if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw))throw Error('引用了非数字内容');const n=Number(raw);if(!Number.isFinite(n)||Math.abs(n)>1e12)throw Error('数值超出范围');return n;}
 const source=raw.slice(1).trim().toUpperCase(),rx=/\s*(\d+(?:\.\d+)?|\$?[A-L]\$?(?:[1-9]|[12][0-9]|30)(?!\d)|SUM\b|AVERAGE\b|[+*/():,\-])/gy,tokens=[];let offset=0,match;
 while(offset<source.length){rx.lastIndex=offset;match=rx.exec(source);if(!match)throw Error('暂不支持该公式');tokens.push(match[1]);offset=rx.lastIndex;}
 if(!tokens.length||tokens.length>120)throw Error('公式过长或为空');let index=0;const peek=()=>tokens[index],take=wanted=>{const t=tokens[index++];if(t===undefined||wanted!==undefined&&wanted!==t)throw Error('公式括号或参数不完整');return t;},isCell=t=>/^\$?[A-L]\$?([1-9]|[12][0-9]|30)$/.test(t||'');
 const get=key=>calculate(cells,key,new Set([...visiting,ref]));
 function atom(){const t=take();if(t==='+'||t==='-')return atom()*(t==='+'?1:-1);if(t==='('){const n=expr();take(')');return n;}if(t==='SUM'||t==='AVERAGE'){take('(');const values=[];while(true){if(isCell(peek())&&tokens[index+1]===':'){const a=take();take(':');const b=take();for(const key of range(a+':'+b)){const val=(cells[key]??'').trim();if(!val||!val.startsWith('=')&&!Number.isFinite(Number(val)))continue;values.push(get(key));}}else values.push(expr());if(peek()!==',')break;take(',');}take(')');if(t==='AVERAGE'&&!values.length)throw Error('没有可计算的数字');return values.reduce((a,b)=>a+b,0)/(t==='AVERAGE'?values.length:1);}if(isCell(t))return get(t);if(!/^\d+(\.\d+)?$/.test(t))throw Error('公式不正确');return Number(t);}
 function term(){let n=atom();while(peek()==='*'||peek()==='/'){const t=take(),b=atom();if(t==='/'&&b===0)throw Error('除数为零');n=t==='*'?n*b:n/b;}return n;}
 function expr(){let n=term();while(peek()==='+'||peek()==='-'){const t=take(),b=term();n=t==='+'?n+b:n-b;}return n;}
 const result=expr();if(index!==tokens.length)throw Error('公式包含多余内容');if(!Number.isFinite(result)||Math.abs(result)>1e12)throw Error('数值超出范围');return result;
}
export function displayCell(m,key){const raw=m.cells[key]||'';if(!raw.startsWith('=')&&(raw.trim()===''||!Number.isFinite(Number(raw))))return raw;try{const n=calculate(m.cells,key);return m.formats[key]==='percent'?Math.round(n*100)+'%':m.formats[key]==='number'?n.toFixed(2):String(Math.round(n*1e6)/1e6);}catch(e){return '#错误';}}
export function apply(model,step){const m=clone(model),a=step.action,v=step.value,t=step.target;
 if(m.kind==='word'){if(['wrap','side','width'].includes(a))m.picture[a]=v;else if(['lineSpacing','afterSpacing','title','paragraphs'].includes(a))m[a]=clone(v);}
 if(m.kind==='ppt'){
  if(['addText','addArt'].includes(a)){if(m.objects.length>=12)throw Error('最多 12 个对象');m.objects.push(clone(v));}
  else if(a==='alignLeft'){const selected=m.objects.filter(o=>t==='all'||t.includes(o.id));if(selected.length>1){const x=Math.min(...selected.map(o=>o.x));selected.forEach(o=>o.x=x);}}
  else if(a==='delete')m.objects=m.objects.filter(o=>!t.includes(o.id));
  else{const o=m.objects.find(o=>o.id===t);if(o){if(a==='position')Object.assign(o,v);else if(['text','style','shadow','width','height','size','x','y'].includes(a))o[a]=v;}}
 }
 if(m.kind==='excel'){
  if(a==='cell')m.cells[address(t)]=String(v);
  if(a==='fill'){const cells=range(t);if(new Set(cells.map(c=>c[0])).size!==1||cells.length<2)throw Error('向下填充请选择一列至少两个单元格');const source=cells[0],value=m.cells[source]||'';if(!value)throw Error('先在区域首格输入内容或公式');for(const cell of cells.slice(1))m.cells[cell]=shiftFormula(value,+cell.slice(1)-+source.slice(1));}
  if(a==='format')for(const cell of range(t))m.formats[cell]=v;
  if(a==='chart'){range(v.range);m.chart=clone(v);}
 }
 return m;
}
export function modelAt(lesson,count){return lesson.steps.slice(0,count).reduce((m,s)=>apply(m,s),clone(lesson.initial));}
