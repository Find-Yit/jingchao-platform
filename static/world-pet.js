'use strict';
// Fetch each visit under the current session; a late response never attaches to another route/user.
async function mountWorldPet(world,host,seq){
 if(teacher())return;
 const uid=state.user.id,journal=host.closest('.meadow-shell')?.querySelector('.meadow-journal');
 if(!journal)return;
 const badge=document.createElement('a');badge.className='world-pet-badge';badge.href='#pets';badge.textContent='正在等我的伙伴…';journal.append(badge);
 try{
  const result=await api('/pets');
  if(seq!==routeSequence||state.user?.id!==uid||!host.isConnected||!badge.isConnected)return;
  if(!result.pet){badge.textContent='领养伙伴，一起探索 ↗';badge.title='选择自己的小龙、小兔、小狗或小猫';return;}
  const pet=result.pet;
  if(pet.user_id!==uid||!['dragon','rabbit','dog','cat'].includes(pet.species))throw new Error('invalid companion');
  world.setPet(pet);badge.textContent=pet.name+' · 结伴探索';badge.title='会跟着你走、跑跳和飞行。点击照顾伙伴。';badge.dataset.species=pet.species;
 }catch(error){if(seq===routeSequence&&state.user?.id===uid&&badge.isConnected){badge.textContent='看看我的伙伴 ↗';badge.title='暂时没有连接到伙伴，返回成长伙伴后可再试。';}}
}
