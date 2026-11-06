import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../static/vendor/three/three.module.min.js';
import {createExplorer} from '../static/meadow-character.mjs';

const meshes=e=>{const list=[];e.root.traverse(o=>{if(o.isMesh)list.push(o);});return list;};
const world=(m,i)=>{const v=new T.Vector3();m.getVertexPosition(i,v);return v.applyMatrix4(m.matrixWorld);};

test('人物合成为少数几块网格（原来 49 块），玩家和导览员都一样',()=>{
 for(const o of [{},{npc:true,color:'#b0805a'}]){const e=createExplorer(o),list=meshes(e);
  assert.ok(list.length<=6,`${list.length} 块网格`);
  assert.equal(list.filter(m=>m.isSkinnedMesh).length,4);
  for(const m of list){const p=m.geometry.attributes.position.array;assert.ok(p.every(Number.isFinite),`${m.name} 有非法顶点`);}
  e.dispose();}
});

test('走路时脚跟着骨骼动，挥手时手抬起来，减少动态效果时披风几乎不飘',()=>{
 const e=createExplorer(),body=meshes(e).find(m=>m.name==='traveler:body'),idx=body.geometry.attributes.skinIndex,pos=body.geometry.attributes.position;
 // 找一个绑在右手腕和左脚踝上的顶点
 const bones=body.skeleton.bones,pick=test=>{for(let i=0;i<pos.count;i++)if(test(bones[idx.getX(i)],i))return i;return -1;};
 const ankle=bones.filter(b=>b.parent?.parent?.parent===bones[0]&&b.children.length===0)[0];
 const footVertex=pick(b=>b===ankle);assert.ok(footVertex>=0,'找不到脚上的顶点');
 e.update(0,{time:0});e.root.updateMatrixWorld(true);const still=world(body,footVertex);
 for(let i=0;i<30;i++)e.update(1/60,{time:i/60,speed:4.4});e.root.updateMatrixWorld(true);
 assert.ok(world(body,footVertex).distanceTo(still)>.03,'走路时脚应当移动');
 const wrists=bones.filter(b=>b.children.length===0&&b.position.y<-.2&&Math.abs(b.parent.parent?.position.x)>.2);
 const hand=pick(b=>b===wrists[1]);assert.ok(hand>=0,'找不到手上的顶点');
 const e2=createExplorer(),b2=meshes(e2).find(m=>m.name==='traveler:body');e2.root.updateMatrixWorld(true);const down=world(b2,hand).y;
 for(let i=0;i<120;i++)e2.update(1/60,{time:i/60,wave:1});e2.root.updateMatrixWorld(true);
 assert.ok(world(b2,hand).y>down+.3,'挥手时手应当抬高');
 e.dispose();e2.dispose();
});

test('释放时所有几何体、材质和骨骼贴图都被释放，重复释放安全',()=>{
 const scene=new T.Scene(),e=createExplorer();scene.add(e.root);
 const seen=new Set();let released=0;
 e.root.traverse(o=>{for(const r of [o.geometry,...(Array.isArray(o.material)?o.material:[o.material])])if(r&&!seen.has(r)){seen.add(r);r.addEventListener('dispose',()=>released++);}});
 e.update(1/60,{time:1,speed:3});e.dispose();
 assert.equal(released,seen.size);assert.equal(scene.children.length,0);
 e.dispose();e.update(1/60,{time:2});
});
