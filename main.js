import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {PARTS,BRANDS,SYMPTOMS} from './data.js';
const $=i=>document.getElementById(i);
const view=$('view'),R=new THREE.WebGLRenderer({antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));view.appendChild(R.domElement);
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,100);cam.position.set(7,5,20);
const ctl=new OrbitControls(cam,R.domElement);ctl.enableDamping=true;ctl.minDistance=8;ctl.maxDistance=40;
scene.add(new THREE.HemisphereLight(0xffffff,0x556677,1.3));
const dl=new THREE.DirectionalLight(0xffffff,1.6);dl.position.set(6,10,14);scene.add(dl);
let root,parts={},brand='iphone',hot=[],k=1,targetY=0,sel=null;
const edge=new THREE.LineBasicMaterial({color:0x000000,transparent:true,opacity:.35});
function add(id,geo,color,pos,o={}){
 const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,metalness:o.m??.35,roughness:o.r??.5,transparent:!!o.o,opacity:o.o??1}));
 m.userData.c0=color;m.userData.z0=pos[2];m.position.set(...pos);
 m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo),edge));
 let g=parts[id];if(!g){g=parts[id]=new THREE.Group();g.userData.id=id;root.add(g)}g.add(m);return m}
const box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const cyl=(r,d)=>{const g=new THREE.CylinderGeometry(r,r,d,28);g.rotateX(Math.PI/2);return g};
function build(){
 if(root)scene.remove(root);parts={};root=new THREE.Group();scene.add(root);
 const b=BRANDS[brand];
 add('back',box(7,15,.08),b.color,[0,0,.4],{o:.92,m:.6,r:.25});
 add('screen',box(7,15,.08),0x0b0f14,[0,0,-.4],{o:.92,m:.7,r:.15});
 add('sensor',box(1.6,.3,.06),0x5577aa,[0,6.7,-.33]);
 add('ear',box(1.3,.12,.06),0x999999,[0,7.1,-.33]);
 // لوحة أم
 add('board',box(6,4.6,.12),0x0f6b5f,[0,4.6,0],{m:.1,r:.7});
 add('board',box(5.6,1.6,.12),0x0f6b5f,[0,-6.4,0],{m:.1,r:.7});
 add('cpu',box(1.5,1.5,.1),0x222831,[-1,5.4,.11]);
 add('pmic',box(1,1,.1),0x333a45,[1.4,5.6,.11]);
 add('audio',box(.9,.9,.1),0x333a45,[-1.9,3.3,.11]);
 add('wifi',box(1.2,.8,.1),0x333a45,[1.7,3.4,.11]);
 add('chgic',box(.9,.7,.1),0x333a45,[.9,-6.3,.11]);
 add('port',box(1.1,.6,.3),0xb8c0c8,[0,-7.3,0],{m:.9,r:.3});
 add('mic',cyl(.25,.15),0x222222,[-2.6,-7,.05]);
 add('spk',box(1.4,.9,.3),0x30343a,[2.4,-6.9,0]);
 add('sim',box(.3,2,.18),0xc0c0c0,[3.2,2.2,0],{m:.8});
 add('vib',box(.8,1.5,.25),0x777777,[-2.4,-3.7,0]);
 b.bat.forEach(([w,h,x,y])=>add('battery',box(w,h,.28),0x8d99a6,[x,y,.02],{m:.2,r:.6}));
 add('shield',box(5.6,4,.04),0xb4bcc4,[0,4.8,.24],{m:.9,r:.35});
 add('coil',cyl(2.3,.04),0xb87333,[0,-1.4,.3],{m:.8,r:.4});
 const c=b.cam;
 if(c.shape=='box')add('cam',box(c.s,c.s,.18),0x16191e,[c.x,c.y,.5],{r:.3});
 if(c.shape=='circle')add('cam',cyl(c.s,.18),0x16191e,[c.x,c.y,.5],{r:.3});
 c.l.forEach(([x,y,r])=>{add('cam',cyl(r,.2),0x8899aa,[x,y,.6],{m:.9,r:.2});add('cam',cyl(r*.6,.22),0x05070a,[x,y,.62],{m:.5,r:.1})});
 add('cam',cyl(.18,.1),0xffe9a8,[c.l[0][0]+.9,c.l[0][1]+.1,.58]);
 root.rotation.y=Math.PI*(targetY>1?1:0);setHot();explode();partsUI();
}
function setHot(){for(const id in parts)parts[id].traverse(o=>{if(o.isMesh){o.material.color.set(hot.includes(id)?0xe5322d:o.userData.c0);o.material.emissive.set(0)}})}
function explode(){for(const id in parts)parts[id].children.forEach(m=>m.position.z=m.userData.z0*k*(id=='screen'||id=='sensor'||id=='ear'?1:1))}
function hide(id,h){parts[id].visible=!h;partsUI()}
function partsUI(){
 $('parts').innerHTML=Object.keys(PARTS).map(id=>`<button class="chip${parts[id].visible?'':' gone'}${hot.includes(id)?' hot':''}" aria-pressed="${parts[id].visible}" data-id="${id}">${PARTS[id]}</button>`).join('');
}
$('parts').onclick=e=>{const id=e.target.dataset.id;if(id)hide(id,parts[id].visible)};
function reveal(){
 for(const id in parts)parts[id].visible=true;
 const front=hot.some(h=>h=='screen'||h=='sensor'||h=='ear');targetY=front?Math.PI:0;
 if(!front){if(!hot.includes('cam'))hide('back',true);parts.back.visible=hot.includes('cam');
  if(!hot.includes('cam'))parts.cam.visible=false;
  const under=['cpu','pmic','audio','wifi','chgic'];
  if(hot.some(h=>under.includes(h)))parts.shield.visible=false;
  if(hot.includes('battery')){parts.coil.visible=false;parts.shield.visible=true}
  if(hot.some(h=>['cpu','pmic','audio','wifi','chgic'].includes(h)))parts.coil.visible=false}
 k=hot.some(h=>['cpu','pmic','audio','wifi','chgic','battery'].includes(h))?2:1;$('exp').value=k;explode();partsUI()}
function result(){
 const s=SYMPTOMS[+$('sym').value],b=BRANDS[brand];hot=s.h;setHot();reveal();
 $('res').innerHTML=`<h2>${s.t} — ${b.n} ${$('model').value}</h2>
 <div>الأجزاء المشتبه بها (بالأحمر): ${s.h.map(h=>`<span class="tag">${PARTS[h]}</span>`).join('')}</div>
 <h3>الأسباب المحتملة</h3><ul>${s.c.map(x=>`<li>${x}</li>`).join('')}</ul>
 <h3>خطوات الفحص والحل</h3><ol>${s.s.map(x=>`<li>${x}</li>`).join('')}</ol>
 ${s.h.some(h=>['port','chgic','pmic'].includes(h))?`<p class="note">دوائر الطاقة في ${b.n}: ${b.ic}</p>`:''}
 <p class="note">إرشادات عامة، وتختلف الدوائر حسب الموديل. راجع المخطط (Schematic) قبل اللحام.</p>`}
function brandsUI(){$('brands').innerHTML=Object.keys(BRANDS).map(x=>`<button class="chip" aria-pressed="${x==brand}" data-k="${x}">${BRANDS[x].n}</button>`).join('');
 $('model').innerHTML=BRANDS[brand].m.map(m=>`<option>${m}</option>`).join('')}
$('brands').onclick=e=>{const x=e.target.dataset.k;if(!x)return;brand=x;brandsUI();build();result()};
$('model').onchange=result;$('sym').onchange=result;
$('sym').innerHTML=SYMPTOMS.map((s,i)=>`<option value="${i}">${s.t}</option>`).join('');
$('exp').oninput=e=>{k=+e.target.value;explode()};
$('front').onclick=()=>targetY=Math.abs(targetY-Math.PI)<.1?0:Math.PI;
$('reset').onclick=()=>{for(const id in parts)parts[id].visible=true;k=1;$('exp').value=1;explode();partsUI()};
// لمس جزء
const ray=new THREE.Raycaster();let d0;
R.domElement.addEventListener('pointerdown',e=>d0=[e.clientX,e.clientY]);
R.domElement.addEventListener('pointerup',e=>{
 if(!d0||Math.hypot(e.clientX-d0[0],e.clientY-d0[1])>6)return;
 const r=R.domElement.getBoundingClientRect();
 ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),cam);
 const ms=[];for(const id in parts)if(parts[id].visible)parts[id].traverse(o=>o.isMesh&&ms.push(o));
 const h=ray.intersectObjects(ms,false)[0];if(!h)return;
 let g=h.object;while(!g.userData.id)g=g.parent;sel=g.userData.id;
 $('sel').hidden=false;$('selName').textContent=PARTS[sel]+(hot.includes(sel)?' ⚠ مشتبه به':'');});
$('selBtn').onclick=()=>{if(sel){hide(sel,true);$('sel').hidden=true}};
function size(){const w=view.clientWidth,h=view.clientHeight;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
R.setAnimationLoop(t=>{
 if(root)root.rotation.y+=(targetY-root.rotation.y)*.08;
 const p=reduce?.6:.5+.5*Math.sin(t/260);
 hot.forEach(id=>parts[id]&&parts[id].traverse(o=>o.isMesh&&o.material.emissive.setRGB(p*.9,0,0)));
 ctl.update();R.render(scene,cam)});
brandsUI();build();result();
