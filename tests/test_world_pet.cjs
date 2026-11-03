const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/../static/world-pet.js','utf8');
function fixture(){let resolve;const badge={isConnected:true,dataset:{}},journal={append(){}},host={isConnected:true,closest:()=>({querySelector:()=>journal})},world={calls:[],setPet(p){this.calls.push(p)}};const context={state:{user:{id:3}},routeSequence:7,teacher:()=>false,document:{createElement:()=>badge},api:()=>new Promise(r=>resolve=r)};vm.createContext(context);vm.runInContext(source,context);return {context,badge,host,world,done(data){resolve(data)},start(){return context.mountWorldPet(world,host,7)}};}
(async()=>{
 let f=fixture(),pending=f.start();f.done({pet:{user_id:3,species:'dragon',name:'星芽',stage_id:'growing'}});await pending;assert.equal(f.world.calls.length,1);assert.equal(f.badge.textContent,'星芽 · 结伴探索');
 for(const type of ['route','user','host']){f=fixture();pending=f.start();if(type==='route')f.context.routeSequence=8;if(type==='user')f.context.state.user.id=9;if(type==='host')f.host.isConnected=false;f.done({pet:{user_id:3,species:'cat',name:'团团'}});await pending;assert.equal(f.world.calls.length,0);}
 f=fixture();pending=f.start();f.done({pet:null});await pending;assert.match(f.badge.textContent,/领养/);assert.equal(f.world.calls.length,0);
 f=fixture();pending=f.start();f.done({pet:{user_id:9,species:'cat',name:'别人的伙伴'}});await pending;assert.equal(f.world.calls.length,0);assert.ok(!f.badge.textContent.includes('别人'));
 f=fixture();f.context.teacher=()=>true;await f.start();assert.equal(f.world.calls.length,0);
 console.log('7 world pet integration checks passed: owned pet, stale route/user/host, no pet, owner isolation, teacher.');
})();
