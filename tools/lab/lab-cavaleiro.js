/* ===== Laboratório do Cavaleiro (personagem isolado) =====
   Página de teste: só o Cavaleiro e um alvo, com botões para cada movimento.
   Não salva nada: a partida e as opções do jogo de verdade ficam intactas. */
(function(){
save=function(){};clearSave=function(){};saveOpt=function(){};tutWanted=function(){return false};tipOnce=function(){};
try{addPedra=function(){}}catch(e){}
const LIGHT_ACT={1:{w:[255,160,70],c:[120,150,255]},2:{w:[140,210,255],c:[120,255,200]},3:{w:[255,90,50],c:[190,110,255]}};
const LITC={};
function hsl(c){const v=parseInt(c.slice(1,7),16),r=(v>>16)/255,g=(v>>8&255)/255,b=(v&255)/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b);return{l:(mx+mn)/2,s:mx===mn?0:(mx-mn)/(1-Math.abs(mx+mn-1))}}
function lightSheets(key,act){const id=key+'|'+act+'|'+heroWK(key);if(LITC[id])return LITC[id];
  const g=VIS.grid(key,heroWK(key)),n=g.length,L=LIGHT_ACT[act]||LIGHT_ACT[1];
  const mk=fn=>{const cv=document.createElement('canvas');cv.width=n*2;cv.height=n;const x=cv.getContext('2d');
    for(const [ox,sh] of [[0,false],[n,true]]){const F=[...Array(n)].map(()=>Array(n).fill(null));for(let y=n-1;y>=0;y--){const dy=sh&&y<n*.56?y+1:y;for(let i=0;i<n;i++)if(g[y][i])F[dy][i]=g[y][i]}
      for(let y=0;y<n;y++)for(let i=0;i<n;i++){const c=F[y][i];if(!c)continue;const r=fn(F,i,y,c,n);if(r){x.fillStyle=r;x.fillRect(ox+i,y,1,1)}}}
    return cv.toDataURL()};
  const at=(F,i,y,n)=>i<0||y<0||i>=n||y>=n?null:F[y][i],out=(F,i,y,n)=>{const q=at(F,i,y,n);return!q||hsl(q).l<.15};
  return LITC[id]={
    lit:mk((F,i,y,c,n)=>{const h=hsl(c);if(h.l<.15)return null;const metal=h.s<.28&&h.l>.3,le=out(F,i-1,y,n),re=out(F,i+1,y,n),te=out(F,i,y-1,n);
      if(le||(te&&i<n*.6))return`rgba(${L.w},${metal?.75:.5})`;if(re)return`rgba(${L.c},.45)`;if(metal&&i<n*.55)return`rgba(${L.w},.22)`;return null}),
    gl:mk((F,i,y,c)=>{const h=hsl(c);return h.s<.28&&h.l>.35?'rgba(255,255,255,.95)':null})}}
const $$=s=>document.querySelector(s),FX=()=>$$('#fxlayer');
const hero=()=>$$('[data-uid="p"] .fig'),foe=()=>$$('#field .unit:not(.hero) .fig');
function decorate(){const h=hero();if(!h||h.querySelector('.litw'))return;const spr=h.querySelector('.spr');if(spr)spr.style.animationDelay='0s';
  const L=lightSheets(CHARS.cav.spr,G.act||1);h.insertAdjacentHTML('beforeend',`<div class="litw"><div class="spr" style="background-image:url(${L.lit});animation-delay:0s"></div></div><div class="glw"><div class="spr" style="background-image:url(${L.gl});animation-delay:0s"></div></div><div class="dome"></div>`)}
const _render=render;render=function(){_render.apply(this,arguments);if(G&&G.screen==='combat')decorate()};
/* ---------- efeitos ---------- */
function el(cls,css){const d=document.createElement('div');d.className=cls;if(css)d.style.cssText=css;FX().appendChild(d);return d}
function arc(r,{size=130,col='#fff',glow='#ffe2a0',w=8,flip=false,ms=200}={}){const d=el('arc',`left:${r.left+r.width*.4}px;top:${r.top+r.height*.5}px;width:${size}px;height:${size}px;--ac:${col};--ag:${glow};--aw:${w};--am:${ms}ms;${flip?'transform:translate(-50%,-50%) scaleY(-1)':''}`);
  d.innerHTML='<svg viewBox="-50 -50 100 100"><path d="M-30 -40 Q 40 -38 34 30"/></svg>';setTimeout(()=>d.remove(),ms+40)}
function stab(r){const d=el('stab',`left:${r.left-10}px;top:${r.top+r.height*.52}px`);setTimeout(()=>d.remove(),220)}
function sparks(x,y,n,col='#ffe9a8',spread=1.8,up=20){for(let i=0;i<n;i++){const p=el('spark',`left:${x}px;top:${y}px;background:${col}`);const a=-spread/2+Math.random()*spread+(Math.random()<.5?0:Math.PI),v=40+Math.random()*80;
  p.animate([{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.cos(a)*v}px,${Math.sin(a)*v-up}px)`,opacity:0}],{duration:300+Math.random()*250,easing:'cubic-bezier(.1,.7,.3,1)'}).onfinish=()=>p.remove()}}
function dust(r,n=6,big=1){for(let i=0;i<n;i++){const p=el('puff',`left:${r.left+r.width*(.3+Math.random()*.4)}px;top:${r.bottom-6}px`);const dir=i<n/2?-1:1;
  p.animate([{transform:'translate(0,0) scale(.6)',opacity:.6},{transform:`translate(${dir*(14+Math.random()*20)*big}px,${-6-Math.random()*10}px) scale(${1.6*big})`,opacity:0}],{duration:450,easing:'ease-out'}).onfinish=()=>p.remove()}}
function ring(x,y,{col='#ffd27a',size=220,ms=500}={}){const d=el('ring',`left:${x}px;top:${y}px;--rc:${col}`);d.animate([{width:'10px',height:'4px',opacity:1},{width:size+'px',height:size*.28+'px',opacity:0}],{duration:ms,easing:'ease-out'}).onfinish=()=>d.remove()}
function crack(r){const d=el('crack',`left:${r.left+r.width*.5}px;top:${r.bottom-4}px`);d.innerHTML='<svg viewBox="-60 -10 120 20"><path d="M-55 2 L-30 -2 L-14 4 L0 -1 L14 5 L32 -1 L56 3"/><path d="M-14 4 L-20 9 M14 5 L20 10 M0 -1 L3 -7"/></svg>';d.animate([{opacity:1},{opacity:1,offset:.6},{opacity:0}],{duration:900}).onfinish=()=>d.remove()}
function flashScreen(col='#fff',ms=180){const d=el('flash',`background:${col}`);d.animate([{opacity:.55},{opacity:0}],{duration:ms}).onfinish=()=>d.remove()}
function num(r,t,col='#ffd0c0'){const d=el('labnum',`left:${r.left+r.width*.5}px;top:${r.top}px;color:${col}`);d.textContent=t;d.animate([{transform:'translate(-50%,0) scale(.6)',opacity:0},{transform:'translate(-50%,-14px) scale(1.15)',opacity:1,offset:.2},{transform:'translate(-50%,-40px) scale(1)',opacity:0}],{duration:900,easing:'ease-out'}).onfinish=()=>d.remove()}
function ghosts(h,D,qs){const spr=h.querySelector('.spr');qs.forEach((q,i)=>setTimeout(()=>{if(!spr||!spr.isConnected)return;const r=spr.getBoundingClientRect(),cs=getComputedStyle(spr);
  const g=el('spr',`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background-image:${cs.backgroundImage};background-position:${cs.backgroundPosition};animation:none;filter:brightness(1.8) sepia(1) hue-rotate(-15deg) saturate(2.5);z-index:28`);
  g.animate([{opacity:.5-i*.12},{opacity:0}],{duration:260}).onfinish=()=>g.remove()},D*q))}
function glint(h){const gl=h.querySelector('.glw');if(!gl)return;gl.classList.remove('on','idle');void gl.offsetWidth;gl.classList.add('on');setTimeout(()=>gl.classList.remove('on'),600)}
function hitFoe(f,{push=15,ms=380,txt}={}){f.animate([{transform:'none',filter:'none'},{transform:'none',filter:'brightness(3.2)',offset:.12},{transform:`translateX(${push}px) rotate(${push/3}deg)`,filter:'brightness(1.4)',offset:.42},{transform:'none',filter:'none'}],{duration:ms,easing:'ease-out'});if(txt)num(f.getBoundingClientRect(),txt)}
const sfxS=(k,o)=>{try{sfx(k,o)}catch(e){}};
let busy=false;const lock=ms=>{busy=true;setTimeout(()=>busy=false,ms)};
function geo(){const h=hero(),f=foe();if(!h||!f)return null;const hr=h.getBoundingClientRect(),fr=f.getBoundingClientRect(),fd=document.querySelector('#field'),top=fd?fd.getBoundingClientRect().top:0,room=Math.max(40,hr.top-top);return{h,f,hr,fr,room,dx:Math.max(10,(fr.left+fr.width*.12)-(hr.left+hr.width*.72))}}
function front(h){const u=h.closest('.unit');if(u){u.style.zIndex=6;return()=>{u.style.zIndex=''}}return()=>{}}
/* ---------- os movimentos ---------- */
const MOVES={
 rapido(){const g=geo();if(!g)return;const{h,f,dx}=g,D=460,s=Math.min(dx*.35,60),back=front(h);lock(D);glint(h);
  h.animate([{transform:'none'},{transform:'translate(-4px,0) scale(1.04,.94)',offset:.18},{transform:`translate(${s}px,0) skewX(-6deg)`,offset:.4,easing:'ease-out'},{transform:`translate(${s+10}px,0) rotate(4deg)`,offset:.5},{transform:`translate(${s*.3}px,0)`,offset:.78},{transform:'none'}],{duration:D});
  setTimeout(()=>{const r=f.getBoundingClientRect();stab(r);sparks(r.left+r.width*.25,r.top+r.height*.5,5);hitFoe(f,{push:8,ms:300,txt:'-4'});sfxS('golpe-espada',{rate:1.15})},D*.45);setTimeout(back,D)},
 golpe(){const g=geo();if(!g)return;const{h,f,dx}=g,D=720,back=front(h);lock(D);glint(h);ghosts(h,D,[.22,.28,.34]);
  h.animate([{transform:'none'},{transform:'translate(-9px,0) scale(1.07,.88)',offset:.17,easing:'cubic-bezier(.2,.8,.2,1)'},{transform:`translate(${dx}px,-5px) skewX(-10deg) scale(1.05,.95)`,offset:.38,easing:'ease-out'},
   {transform:`translate(${dx+6}px,0) rotate(7deg)`,offset:.45},{transform:`translate(${dx+6}px,0) rotate(7deg)`,offset:.64,easing:'cubic-bezier(.3,0,.4,1)'},{transform:`translate(${dx*.45}px,-26px) rotate(-8deg)`,offset:.83,easing:'cubic-bezier(.5,0,.8,.6)'},{transform:'translate(0,0) scale(1.1,.86)',offset:.94},{transform:'none'}],{duration:D});
  setTimeout(()=>{const r=f.getBoundingClientRect();arc(r);sparks(r.left+r.width*.3,r.top+r.height*.45,9);hitFoe(f,{txt:'-6'});sfxS('golpe-espada')},D*.44);setTimeout(()=>dust(h.getBoundingClientRect()),D*.93);setTimeout(back,D)},
 pesado(){const g=geo();if(!g)return;const{h,f,dx,room}=g,J=Math.min(95,room*.85),D=1050,back=front(h);lock(D);glint(h);
  h.animate([{transform:'none'},{transform:'translate(-10px,0) scale(1.12,.8)',offset:.2,easing:'cubic-bezier(.2,.8,.2,1)'},{transform:`translate(${dx*.6}px,${-J}px) rotate(-14deg) scale(.96,1.06)`,offset:.42,easing:'cubic-bezier(.2,.7,.4,1)'},
   {transform:`translate(${dx*.85}px,${-J*1.1}px) rotate(-22deg)`,offset:.5},{transform:`translate(${dx+4}px,0) rotate(14deg) scale(1.12,.86)`,offset:.58,easing:'cubic-bezier(.7,0,1,.6)'},{transform:`translate(${dx+4}px,0) rotate(12deg) scale(1.08,.9)`,offset:.72},
   {transform:`translate(${dx*.4}px,-30px) rotate(-8deg)`,offset:.88,easing:'cubic-bezier(.5,0,.8,.6)'},{transform:'translate(0,0) scale(1.1,.86)',offset:.96},{transform:'none'}],{duration:D});
  setTimeout(()=>{const r=f.getBoundingClientRect();arc(r,{size:170,w:12,flip:true,ms:220});crack(r);ring(r.left+r.width*.45,r.bottom-4,{size:240});dust(r,10,1.5);sparks(r.left+r.width*.4,r.top+r.height*.5,14);hitFoe(f,{push:22,ms:480,txt:'-14'});sfxS('golpe-pesado')},D*.58);
  setTimeout(()=>dust(h.getBoundingClientRect()),D*.96);setTimeout(back,D)},
 epico(){const g=geo();if(!g)return;const{h,f,dx,room}=g,J=Math.min(150,room*.95),D=1700,back=front(h);lock(D);
  const halo=el('halo',`left:${g.hr.left+g.hr.width*.7}px;top:${g.hr.top+g.hr.height*.1}px`);halo.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.4)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.5},{opacity:0,transform:'translate(-50%,-50%) scale(1.4)'}],{duration:D*.32}).onfinish=()=>halo.remove();
  setTimeout(()=>glint(h),D*.1);
  h.animate([{transform:'none'},{transform:'translate(-6px,0) scale(1.1,.84)',offset:.12},{transform:'translate(-8px,0) scale(1.14,.78)',offset:.3},{transform:`translate(${dx*.5}px,${-J}px) rotate(-10deg) scale(.95,1.08)`,offset:.48,easing:'cubic-bezier(.2,.7,.4,1)'},
   {transform:`translate(${dx*.75}px,${-J*1.06}px) rotate(-28deg)`,offset:.6},{transform:`translate(${dx+4}px,0) rotate(18deg) scale(1.16,.82)`,offset:.68,easing:'cubic-bezier(.8,0,1,.5)'},{transform:`translate(${dx+4}px,0) rotate(16deg) scale(1.1,.88)`,offset:.82},
   {transform:`translate(${dx*.4}px,-34px) rotate(-8deg)`,offset:.93,easing:'cubic-bezier(.5,0,.8,.6)'},{transform:'none'}],{duration:D});
  setTimeout(()=>{const r=f.getBoundingClientRect();flashScreen('#fff3d0',220);arc(r,{size:220,w:14,col:'#fff6d8',glow:'#ffcf5a',flip:true,ms:260});crack(r);ring(r.left+r.width*.45,r.bottom-4,{size:420,ms:700});ring(r.left+r.width*.45,r.bottom-4,{size:260,ms:500,col:'#fff'});
   dust(r,14,2);sparks(r.left+r.width*.4,r.top+r.height*.5,26,'#fff1b8',3.2,40);hitFoe(f,{push:30,ms:600,txt:'-32'});sfxS('golpe-pesado',{rate:.8});sfxS('forjar',{vol:.5,delay:60})},D*.68);
  setTimeout(()=>dust(h.getBoundingClientRect(),8),D*.98);setTimeout(back,D)},
 escudo(){const h=hero();if(!h)return;const D=650;lock(D);const dm=h.querySelector('.dome');
  h.animate([{transform:'none'},{transform:'translate(-6px,0) scale(1.04,.94)',offset:.3},{transform:'translate(-3px,0) rotate(-3deg)',offset:.6},{transform:'none'}],{duration:D});
  if(dm){dm.classList.add('on');dm.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.5)'},{opacity:1,transform:'translate(-50%,-50%) scale(1.08)',offset:.5},{opacity:.85,transform:'translate(-50%,-50%) scale(1)'}],{duration:420,easing:'ease-out'})}
  const r=h.getBoundingClientRect();ring(r.left+r.width*.55,r.top+r.height*.55,{col:'#bfe0ff',size:140,ms:450});num(r,'+5 Bloqueio','#bfe0ff');glint(h);sfxS('bloqueio')},
 bateEscudo(){const g=geo();if(!g)return;const{h,f,dx}=g,D=760;lock(D+300);const dm=h.querySelector('.dome');if(!dm||!dm.classList.contains('on'))MOVES.escudo();
  setTimeout(()=>{f.animate([{transform:'none'},{transform:'translate(8px,0) scale(1.06,.92)',offset:.2},{transform:`translate(${-dx-10}px,-6px) skewX(8deg)`,offset:.42,easing:'ease-in'},{transform:`translate(${-dx+6}px,0)`,offset:.6},{transform:'none'}],{duration:D});
   setTimeout(()=>{const r=h.getBoundingClientRect();sparks(r.left+r.width*.85,r.top+r.height*.5,14,'#e8f4ff',2.4);if(dm)dm.animate([{filter:'brightness(2.5)'},{filter:'none'}],{duration:300});
    h.animate([{transform:'none'},{transform:'translate(-16px,0) rotate(-4deg)',offset:.3},{transform:'translate(-12px,0)',offset:.6},{transform:'none'}],{duration:420,easing:'ease-out'});dust(r,4,.8);num(r,'Bloqueado','#bfe0ff');sfxS('bloqueio');sfxS('golpe-espada',{vol:.5,rate:1.4})},D*.42)},280)},
 bateSem(){const g=geo();if(!g)return;const{h,f,dx}=g,D=760;lock(D);const dm=h.querySelector('.dome');if(dm)dm.classList.remove('on');
  f.animate([{transform:'none'},{transform:'translate(8px,0) scale(1.06,.92)',offset:.2},{transform:`translate(${-dx-10}px,-6px) skewX(8deg)`,offset:.42,easing:'ease-in'},{transform:`translate(${-dx+6}px,0)`,offset:.6},{transform:'none'}],{duration:D});
  setTimeout(()=>{const r=h.getBoundingClientRect();h.animate([{transform:'none',filter:'none'},{transform:'translate(-20px,-4px) rotate(-9deg)',filter:'brightness(2) sepia(1) hue-rotate(-40deg) saturate(4)',offset:.25},{transform:'translate(-14px,0) rotate(-4deg)',filter:'none',offset:.6},{transform:'none',filter:'none'}],{duration:520,easing:'ease-out'});
   sparks(r.left+r.width*.6,r.top+r.height*.45,6,'#ff8a7a');num(r,'-8','#ff9a8a');sfxS('dano-heroi')},D*.42)}
};
window.LAB=MOVES;
/* ---------- tela ---------- */
const css=document.createElement('style');css.textContent=`
body.lab #coach,body.lab .tipcard,body.lab .u-int,body.lab .devstrip{display:none!important}
body.lab .dock{visibility:hidden}body.lab .top{visibility:hidden}
.fig .litw,.fig .glw{position:absolute;left:0;top:0;width:100%;pointer-events:none}
.fig .litw{animation:litFlick 2.6s ease-in-out infinite}
.fig .glw{opacity:0;-webkit-mask-image:linear-gradient(110deg,transparent 42%,#000 50%,transparent 58%);mask-image:linear-gradient(110deg,transparent 42%,#000 50%,transparent 58%);-webkit-mask-size:300% 100%;mask-size:300% 100%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-position:110% 0;mask-position:110% 0}
.fig .glw.on{animation:glintA .5s ease-out}.fig .glw.idle{animation:glintB 1.3s ease-in-out}
@keyframes litFlick{0%,100%{opacity:.95}30%{opacity:.7}55%{opacity:1}80%{opacity:.78}}
@keyframes glintA{0%{opacity:1;-webkit-mask-position:110% 0;mask-position:110% 0}100%{opacity:1;-webkit-mask-position:-10% 0;mask-position:-10% 0}}
@keyframes glintB{0%{opacity:.55;-webkit-mask-position:110% 0;mask-position:110% 0}100%{opacity:.55;-webkit-mask-position:-10% 0;mask-position:-10% 0}}
.fig .dome{position:absolute;left:58%;top:52%;width:118%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;opacity:0;
 background:radial-gradient(circle,transparent 56%,#bfe0ff22 64%,#cfe8ff88 70%,transparent 73%);box-shadow:0 0 18px #9fd0ff55}
.fig .dome.on{opacity:.85;animation:domeP 2s ease-in-out infinite}
@keyframes domeP{50%{opacity:.6}}
.arc{position:fixed;transform:translate(-50%,-50%);pointer-events:none;z-index:40}.arc svg{width:100%;height:100%;overflow:visible}
.arc path{fill:none;stroke:var(--ac);stroke-width:var(--aw);stroke-linecap:round;stroke-dasharray:150;stroke-dashoffset:150;animation:arcA var(--am) ease-out forwards;filter:drop-shadow(0 0 6px var(--ag)) drop-shadow(0 0 2px #fff)}
@keyframes arcA{0%{stroke-dashoffset:150;opacity:1}55%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:-70;opacity:0;stroke-width:2}}
.stab{position:fixed;width:70px;height:3px;background:linear-gradient(90deg,transparent,#fff,#ffe9b8);box-shadow:0 0 8px #fff;pointer-events:none;z-index:40;animation:stabA .2s ease-out forwards}
@keyframes stabA{0%{transform:scaleX(0);transform-origin:left;opacity:1}60%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1) translateX(20px);opacity:0}}
.spark{position:fixed;width:4px;height:4px;box-shadow:0 0 6px #ffb34a;pointer-events:none;z-index:41}
.puff{position:fixed;width:10px;height:10px;border-radius:50%;background:#8a7a64;opacity:.55;pointer-events:none;z-index:29}
.ring{position:fixed;transform:translate(-50%,-50%);border:3px solid var(--rc);border-radius:50%;pointer-events:none;z-index:39;box-shadow:0 0 10px var(--rc)}
.crack{position:fixed;width:150px;transform:translate(-50%,-50%);pointer-events:none;z-index:30}.crack svg{width:100%;overflow:visible}.crack path{fill:none;stroke:#120a05;stroke-width:3;stroke-linecap:round}
.flash{position:fixed;inset:0;pointer-events:none;z-index:60}
.halo{position:fixed;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,#fff8 0,#ffd27a66 35%,transparent 70%);pointer-events:none;z-index:31}
.labnum{position:fixed;font:800 22px var(--f-num),sans-serif;text-shadow:0 2px 0 #000,0 0 8px #000;pointer-events:none;z-index:45;white-space:nowrap}
.labbar{position:fixed;left:0;right:0;bottom:0;z-index:200;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;padding:8px max(10px,env(safe-area-inset-left)) calc(8px + env(safe-area-inset-bottom));background:linear-gradient(transparent,#0b0907f0 30%)}
.labbar button{font:600 13px var(--f-sc,serif);letter-spacing:.04em;color:#f3e6cc;background:#2a1d12;border:1px solid #8a6a3a;border-radius:8px;padding:8px 10px;min-height:40px}
.labbar button.atk{border-color:#c0503a;background:#3a1812}.labbar button.def{border-color:#3f8fe0;background:#12203a}.labbar button.act{border-color:#555;background:#1a1612;color:#c9b48a}
.labbar button.on{outline:2px solid #ffd76a}
.labtitle{position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:200;font:700 15px var(--f-sc,serif);letter-spacing:.12em;color:#e8c27a;text-shadow:0 2px 6px #000;white-space:nowrap}`;
document.head.appendChild(css);
function bar(){const b=document.createElement('div');b.className='labbar';const B=[['rapido','atk','Rápido (até 5)'],['golpe','atk','Golpe (6 a 9)'],['pesado','atk','Pesado (10 a 19)'],['epico','atk','Épico (20+)'],['escudo','def','Erguer escudo'],['bateEscudo','def','Inimigo bate no escudo'],['bateSem','def','Inimigo bate sem escudo']];
  b.innerHTML=B.map(([k,c,t])=>`<button class="${c}" data-lab="${k}">${t}</button>`).join('')+[1,2,3].map(a=>`<button class="act" data-ato="${a}">Ato ${a}</button>`).join('');
  b.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;e.stopPropagation();if(t.dataset.lab){if(!busy)MOVES[t.dataset.lab]()}else if(t.dataset.ato)setAct(+t.dataset.ato)},true);document.body.appendChild(b);
  const tt=document.createElement('div');tt.className='labtitle';tt.textContent='Laboratório do Cavaleiro';document.body.appendChild(tt)}
const FOES={1:'orc',2:'cavaleiro',3:'gargula'};
function setAct(a){G.act=a;G.combat=null;startCombat([ENEMIES[FOES[a]]?FOES[a]:'goblin'],'normal',true);G.combat.enemies.forEach(e=>{e.hp=e.maxHp=999});render();
  document.querySelectorAll('.labbar [data-ato]').forEach(b=>b.classList.toggle('on',+b.dataset.ato===a))}
function boot(){document.querySelector('#abert')?.remove();document.body.classList.add('lab','rotok');OPT.cenas='nunca';
  G=null;UI.choose=true;render();const c=document.querySelector('[data-ch=cav]');if(c)c.click();setTimeout(()=>{const n=document.querySelector('[data-act=namego]');if(n)n.click();setTimeout(()=>{bar();setAct(1)},150)},150)}
setInterval(()=>{if(document.hidden||busy)return;const gl=document.querySelector('[data-uid="p"] .glw');if(gl&&!gl.classList.contains('on')&&Math.random()<.35){gl.classList.remove('idle');void gl.offsetWidth;gl.classList.add('idle');setTimeout(()=>gl.classList.remove('idle'),1400)}},3000);
if(document.readyState==='complete')setTimeout(boot,300);else addEventListener('load',()=>setTimeout(boot,300));
})();
