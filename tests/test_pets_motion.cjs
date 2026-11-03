/* Lifecycle checks for lightweight SVG interaction; no browser, network or animation snapshots. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const pending=new Map(),docListeners=new Map(),mediaListeners=new Map();let next=0,apiCalls=0;
const names=new Set(),garden={classList:{remove(...xs){xs.forEach(x=>names.delete(x));},toggle(x,on){on?names.add(x):names.delete(x);}},dataset:{}},mood={textContent:''},sleep={innerHTML:''},touch={attributes:{},setAttribute(k,v){this.attributes[k]=v;}};
const media={matches:false,addEventListener(t,fn){mediaListeners.set(fn,t);},removeEventListener(t,fn){mediaListeners.delete(fn);}};
const nodes={'#pet-garden':garden,'#pet-mood':mood,'#pet-sleep-button':sleep,'.pet-touch':touch};
const context=vm.createContext({console,actions:{},forms:{},state:{route:'pets',user:{id:1,role:'student'}},teacher:()=>false,document:{hidden:false,addEventListener(t,fn){docListeners.set(fn,t);},removeEventListener(t,fn){docListeners.delete(fn);}},matchMedia:()=>media,$:s=>nodes[s]||null,$$:()=>[],setTimeout(fn,ms){const id=++next;pending.set(id,{fn,ms});return id;},clearTimeout:id=>pending.delete(id),esc:x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),api:()=>{apiCalls++;throw Error('interaction must not request rewards');},icon:()=>'',toast:()=>{},crypto:{},Date,Math});
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../static/pets.js'),'utf8'),context);
vm.runInContext("petState.user=1;petState.data={pet:{species:'dragon',stage_id:'growing',name:'小星',hungry:false}}",context);
const mode=()=>garden.dataset.motion;
const advance=()=>{assert.ok(pending.size);const [id,timer]=[...pending][0];pending.delete(id);timer.fn();};
context.mountPets();assert.equal(mode(),'idle');assert.equal(pending.size,1);
for(let i=0;i<30;i++)context.actions['pet-play']();assert.equal(mode(),'run');assert.equal(pending.size,1);
advance();assert.equal(mode(),'jump');assert.equal(pending.size,1);advance();assert.equal(mode(),'idle');assert.equal(pending.size,1);
context.actions['pet-sleep']();assert.equal(mode(),'sleep');assert.equal(pending.size,0);assert.ok(names.has('is-sleeping'));assert.match(mood.textContent,/呼噜噜/);assert.match(touch.attributes['aria-label'],/叫醒/);
context.actions['pet-touch']();assert.equal(mode(),'idle');assert.equal(pending.size,1);context.actions['pet-touch']();assert.equal(mode(),'jump');assert.equal(pending.size,1);
context.stopPetMotion();assert.equal(pending.size,0);assert.equal(mediaListeners.size,0);assert.equal([...docListeners.values()].filter(t=>t==='visibilitychange').length,0);
context.actions['pet-play']();assert.equal(pending.size,0);
media.matches=true;context.mountPets();assert.equal(mode(),'idle');assert.equal(pending.size,0);context.actions['pet-sleep']();assert.equal(mode(),'sleep');assert.equal(pending.size,0);context.stopPetMotion();
media.matches=false;vm.runInContext('petState.sleeping=false',context);context.mountPets();context.document.hidden=true;for(const [fn,t] of docListeners)if(t==='visibilitychange')fn();assert.equal(pending.size,0);context.document.hidden=false;for(const [fn,t] of docListeners)if(t==='visibilitychange')fn();assert.equal(pending.size,1);
context.state.route='assignments';advance();assert.equal(pending.size,0);context.stopPetMotion();
for(const kind of ['dragon','rabbit','dog','cat']){const svg=context.petArt(kind,'shining','<script>',false);assert.match(svg,/pet-foot left/);assert.match(svg,/pet-sleep-eyes/);assert.match(svg,/pet-sleep-hat/);assert.doesNotMatch(svg,/<script>/);assert.match(svg,/&lt;script&gt;/);}
assert.equal(apiCalls,0);console.log('Pet motion: run→jump→idle, touch, sleep/wake, single timer, route cleanup, hidden-tab pause, reduced motion, SVG safety passed.');
