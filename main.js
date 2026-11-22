import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {PARTS,BRANDS,SYMPTOMS} from './data.js';
const $=i=>document.getElementById(i);
const view=$('view'),R=new THREE.WebGLRenderer({antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.toneMapping=THREE.ACESFilmicToneMapping;view.appendChild(R.domElement);
const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,100);cam.position.set(7,5,21);
scene.environment=new THREE.PMREMGenerator(R).fromScene(new RoomEnvironment(),.04).texture;
const ctl=new OrbitControls(cam,R.domElement);ctl.enableDamping=true;ctl.minDistance=6;ctl.maxDistance=40;
const dl=new THREE.DirectionalLight(0xffffff,1.2);dl.position.set(6,10,14);scene.add(dl,new THREE.HemisphereLight(0xffffff,0x556677,.5));
let root,parts={},brand='iphone',hot=[],k=1,targetY=0,sel=null;
const edge=new THREE.LineBasicMaterial({color:0x000000,transparent:true,opacity:.3});
const W=7,H=15;
const rnd=(s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296})(7);
// مستطيل بزوايا مدورة
function rr(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2,P=Math.PI;
 s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.absarc(x+w-r,y+r,r,-P/2,0,false);s.lineTo(x+w,y+h-r);s.absarc(x+w-r,y+h-r,r,0,P/2,false);
 s.lineTo(x+r,y+h);s.absarc(x+r,y+h-r,r,P/2,P,false);s.lineTo(x,y+r);s.absarc(x+r,y+r,r,P,1.5*P,false);return s}
function ext(s,d,bev){const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:!!bev,bevelSize:.04,bevelThickness:.03,bevelSegments:2,curveSegments:10});g.translate(0,0,-d/2);return g}
const box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
const cyl=(r,d)=>{const g=new THREE.CylinderGeometry(r,r,d,32);g.rotateX(Math.PI/2);return g};
function add(id,geo,color,pos,o={}){
 const m=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color,map:o.map,metalness:o.m??.35,roughness:o.r??.5,transparent:!!o.o,opacity:o.o??1,emissive:o.e??0}));
 m.userData.c0=color;m.userData.e0=o.e??0;m.userData.z0=pos[2];m.position.set(...pos);
 if(!o.ne)m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo,25),edge));
 let g=parts[id];if(!g){g=parts[id]=new THREE.Group();g.userData.id=id;root.add(g)}g.add(m);return m}
const slab=(w,h,r,d)=>ext(rr(w,h,r),d,true);
const poly=(pts,d)=>{const s=new THREE.Shape();pts.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));return ext(s,d)};
function pcbTex(){let s=7;const r=()=>(s=s*16807%2147483647)/2147483647;
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
 g.fillStyle='#0c5a4e';g.fillRect(0,0,256,256);g.lineWidth=1.5;
 for(let i=0;i<110;i++){g.strokeStyle=r()>.3?'#d4af37':'#1b8a78';g.globalAlpha=.5;let x=r()*256,y=r()*256;g.beginPath();g.moveTo(x,y);
  for(let j=0;j<3;j++){const a=r();if(a<.4)x+=(r()-.5)*90;else if(a<.8)y+=(r()-.5)*90;else{x+=(r()-.5)*50;y+=(r()-.5)*50}g.lineTo(x,y)}g.stroke()}
 g.fillStyle='#d4af37';for(let i=0;i<120;i++){g.globalAlpha=.7;g.beginPath();g.arc(r()*256,r()*256,1.6,0,7);g.fill()}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(.25,.25);return t}
const SZ={s:.92,m:1,l:1.07};
function build(){
 if(root)scene.remove(root);parts={};root=new THREE.Group();scene.add(root);
 const b=BRANDS[brand],ip=brand=='iphone',T=pcbTex(),pb={m:.1,r:.7,map:T};
 const md=b.models.find(x=>x[0]==$('model').value)||b.models[0],[,sz,ck,nt]=md,cm=b.cams[ck];
 root.scale.setScalar(SZ[sz]);
 const bat=ip?[[3.6,7.6,1.1,-1.6]]:[[4.6,7,.5,-1.4]];
 // الهيكل والأزرار
 const fs=rr(7.2,15.2,.9);fs.holes.push(rr(6.76,14.76,.7));
 add('frame',ext(fs,.8),b.frame,[0,0,0],{m:.95,r:.3});
 [[3.6,6.4],[3.6,-6],[-3.6,6.4],[-3.6,-6]].forEach(([x,y])=>add('frame',box(.1,.14,.82),0xe8e8e8,[x,y,0],{m:.1,r:.8,ne:1}));
 add('btn',box(.12,1.8,.4),b.frame,[3.66,2.6,0],{m:.9,r:.3});
 add('btn',box(.12,2.2,.4),b.frame,[ip?-3.66:3.66,5.6,0],{m:.9,r:.3});
 add('back',slab(6.9,14.7,.8,.08),b.color,[0,0,.4],{o:.93,m:.6,r:.22});
 add('screen',slab(6.9,14.7,.8,.08),0x0b0f14,[0,0,-.4],{o:.93,m:.7,r:.12});
 if(nt=='island')add('screen',box(1.7,.45,.02),0,[0,6.75,-.45],{ne:1});
 else if(nt=='punch')add('screen',cyl(.16,.02),0,[0,6.85,-.45],{ne:1});
 else if(nt=='notch')add('screen',box(2.8,.5,.02),0,[0,6.9,-.45],{ne:1});
 else if(nt=='home')add('screen',cyl(.45,.02),0x1a1d22,[0,-6.8,-.45],{ne:1});
 add('sensor',box(1.6,.3,.06),0x5577aa,[0,6.7,-.33]);
 add('ear',box(1.3,.12,.06),0x999999,[0,7.1,-.33]);
 // اللوحة الأم PCB
 add('board',poly(ip?[[-3,6.9],[3,6.9],[3,2.4],[-1.4,2.4],[-1.4,-5.4],[-3,-5.4]]:[[-3,6.9],[3,6.9],[3,2.4],[-3,2.4]],.12),0xffffff,[0,0,0],pb);
 add('board',poly([[-2.6,-5.6],[2.6,-5.6],[2.6,-7.2],[-2.6,-7.2]],.12),0xffffff,[0,0,0],pb);
 add('flex',ip?box(1.6,.3,.03):box(.3,8,.03),0xc97a2b,ip?[-2,-5.5,.05]:[-3.15,-1.6,.05],{m:0,r:.8,ne:1});
 [[-2.7,6.5],[2.7,6.5],[2.7,2.8],[-2.7,2.8],[0,-6.8]].forEach(([x,y])=>add('screw',cyl(.12,.1),0xc0c0c0,[x,y,.1],{m:.9}));
 [['cpu',1.4,1.4,-1.3,5.7,0x1b1f26,.1],['ram',1.1,.9,-1.5,4.2,0x2c333c,.09],['pmic',1,1,1.5,5.8,0x3a3f48,.09],['rf',1,.8,1.6,4.5,0x2f3640,.08],['wifi',1.1,.8,1.8,3.3,0x2f3640,.08],['audio',.9,.9,-2.2,3.2,0x3a3f48,.08],['nfc',.7,.6,-.6,3.2,0x3a3f48,.07],['chgic',.9,.7,.9,-6.3,0x3a3f48,.08],['bcon',1.2,.35,-1,2.55,0xd4af37,.08],['dcon',1.4,.35,1.8,2.55,0xd4af37,.08],['ccon',1,.3,-2.2,6.6,0xd4af37,.08]]
  .forEach(([id,w,h,x,y,c,t])=>add(id,box(w,h,t),c,[x,y,.06+t/2],{m:.5,r:.4}));
 add('cpu',box(1.1,1.1,.03),0xb5bcc4,[-1.3,5.7,.2],{m:.9,r:.3});
 add('port',box(1.1,.6,.3),0xb8c0c8,[0,-7.3,0],{m:.9,r:.3});
 add('mic',cyl(.25,.15),0x222222,[-2.6,-7,.05]);
 add('spk',box(1.4,.9,.3),0x30343a,[2.4,-6.9,0]);
 add('sim',box(.3,2,.18),0xc0c0c0,[3.3,.2,0],{m:.8});
 add('vib',box(.8,1.5,.25),0x777777,[-2.4,-3.7,.02]);
 bat.forEach(([w,h,x,y])=>{add('battery',box(w,h,.28),0x8d99a6,[x,y,.02],{m:.2,r:.6});add('battery',box(w*.8,h*.3,.01),0xf2f2f2,[x,y+h*.2,.165],{r:.9,ne:1});add('battery',box(.5,.5,.03),0xd4af37,[x,y+h/2+.15,.1],{m:.6})});
 add('shield',box(3,4,.04),0xb4bcc4,[-1.4,4.9,.24],{m:.9,r:.35});
 add('shield',box(2.6,4,.04),0xb4bcc4,[1.7,4.9,.24],{m:.9,r:.35});
 const bx=bat[0][2],by=bat[0][3];
 add('coil',cyl(2.3,.03),0x2a2a2a,[bx,by,.3],{m:.3,ne:1});
 [[1,1.15],[1.5,1.65],[2,2.15]].forEach(([a,c])=>add('coil',new THREE.RingGeometry(a,c,48),0xb87333,[bx,by,.32],{m:.8,r:.4,ne:1}));
 // الكاميرا حسب الموديل
 const cb=cm.b;
 if(cb)add('cam',cb[0]=='rr'?ext(rr(cb[3],cb[4],cb[5]),.18):cyl(cb[3],.18),0x16191e,[cb[1],cb[2],.5],{r:.3});
 cm.l.forEach(([x,y,r])=>{if(!cb)add('cam',cyl(r*1.2,.1),0x16191e,[x,y,.46],{r:.3});
  add('cam',cyl(r,.2),0x8899aa,[x,y,.6],{m:.9,r:.2});add('cam',cyl(r*.6,.22),0x05070a,[x,y,.62],{m:.5,r:.1});add('cam',new THREE.TorusGeometry(r,.05,8,32),0xcfd6dc,[x,y,.7],{m:.9,r:.2,ne:1})});
 cm.f.forEach(([x,y,r,c])=>add('cam',cyl(r,.06),c,[x,y,.58],{ne:1}));
 root.rotation.y=Math.PI*(targetY>1?1:0);setHot();explode();partsUI();
}
function setHot(){for(const id in parts)parts[id].traverse(o=>{if(o.isMesh){o.material.color.set(hot.includes(id)?0xe5322d:o.userData.c0);o.material.emissive.set(hot.includes(id)?0x000000:o.userData.e0)}})}
function explode(){for(const id in parts)parts[id].children.forEach(m=>m.position.z=m.userData.z0*k)}
function hide(id,h){parts[id].visible=!h;partsUI()}
function partsUI(){$('parts').innerHTML=Object.keys(PARTS).filter(id=>parts[id]).map(id=>`<button class="chip${parts[id].visible?'':' gone'}${hot.includes(id)?' hot':''}" aria-pressed="${parts[id].visible}" data-id="${id}">${PARTS[id]}</button>`).join('')}
$('parts').onclick=e=>{const id=e.target.dataset.id;if(id)hide(id,parts[id].visible)};
const UNDER=['cpu','pmic','audio','wifi','chgic','ram','rf','nfc','ccon'],FRONT=['screen','sensor','ear'];
function reveal(){
 for(const id in parts)parts[id].visible=true;
 const front=hot.every(h=>FRONT.includes(h));targetY=front?Math.PI:0;
 if(!front){parts.back.visible=hot.every(h=>h=='cam');parts.cam.visible=hot.includes('cam');
  if(hot.some(h=>UNDER.includes(h)))parts.shield.visible=false;
  if(hot.includes('battery')||hot.includes('bcon'))parts.coil.visible=false}
 k=front?1:2;$('exp').value=k;explode();partsUI()}
function result(){
 const s=SYMPTOMS[+$('sym').value],b=BRANDS[brand];hot=s.h.filter(h=>parts[h]);setHot();reveal();
 $('res').innerHTML=`<h2>${s.t} — ${b.n} ${$('model').value}</h2>
 <div>الأجزاء المشتبه بها (بالأحمر): ${hot.map(h=>`<span class="tag">${PARTS[h]}</span>`).join('')}</div>
 <h3>الأسباب المحتملة</h3><ul>${s.c.map(x=>`<li>${x}</li>`).join('')}</ul>
 <h3>خطوات الفحص والحل</h3><ol>${s.s.map(x=>`<li>${x}</li>`).join('')}</ol>
 ${hot.some(h=>['port','chgic','pmic'].includes(h))?`<p class="note">دوائر الطاقة في ${b.n}: ${b.ic}</p>`:''}
 <p class="note">المجسم تقريبي واقعي وليس مخطط الموديل الدقيق. راجع المخطط (Schematic/Boardview) قبل اللحام.</p>`}
function brandsUI(){$('brands').innerHTML=Object.keys(BRANDS).map(x=>`<button class="chip" aria-pressed="${x==brand}" data-k="${x}">${BRANDS[x].n}</button>`).join('');
 $('model').innerHTML=BRANDS[brand].models.map(m=>`<option>${m[0]}</option>`).join('')}
$('brands').onclick=e=>{const x=e.target.dataset.k;if(!x)return;brand=x;brandsUI();build();result()};
$('model').onchange=()=>{build();result()};$('sym').onchange=result;
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
// علامة حمراء متوهجة فوق الجزء المعطوب
const cv=document.createElement('canvas');cv.width=cv.height=64;
{const x=cv.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,32);g.addColorStop(0,'rgba(255,60,50,.9)');g.addColorStop(1,'rgba(255,60,50,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}
const mk=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),depthTest:false,transparent:true}),marks={};
const bb=new THREE.Box3(),v=new THREE.Vector3();
function size(){const w=view.clientWidth,h=view.clientHeight;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
R.setAnimationLoop(t=>{
 if(root)root.rotation.y+=(targetY-root.rotation.y)*.08;
 const p=reduce?.6:.5+.5*Math.sin(t/260);
 hot.forEach(id=>{const g=parts[id];if(!g)return;
  g.traverse(o=>o.isMesh&&o.material.emissive.setRGB(p*.9,0,0));
  let s=marks[id];if(!s||s.parent!==scene){s=marks[id]=new THREE.Sprite(mk);scene.add(s)}
  s.visible=g.visible;bb.setFromObject(g);bb.getCenter(v);s.position.copy(v);s.scale.setScalar(1.2+p*.8)});
 for(const id in marks)if(!hot.includes(id)){scene.remove(marks[id]);delete marks[id]}
 ctl.update();R.render(scene,cam)});
brandsUI();build();result();
