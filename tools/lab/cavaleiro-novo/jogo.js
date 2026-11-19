/* ===== Cavaleiro novo dentro do jogo (tela de luta) =====
   Usa o boneco articulado (rig.js + poses.js). Otimizado: cada pose é desenhada e iluminada UMA vez e guardada;
   o desenho só acontece quando o quadro muda e para fora da luta ou com o app em segundo plano.
   Desliga em Opções → "Cavaleiro novo". */
(function(){
const KN={cv:null,ctx:null,k:4,anim:'parado',f:0,ov:null,rx:0,ry:0,tok:0,busy:false,last:0,maniaT:0,dead:false,hold:false};
window.KN=KN;
const on=()=>OPT.cavNovo!==false&&typeof G!=='undefined'&&G&&G.char==='cav'&&G.screen==='combat'&&G.combat;
KN.on=on;
const LUZ={1:{dir:-1,col:[255,160,70],amb:[60,40,40]},2:{dir:1,col:[140,210,255],amb:[40,60,60]},3:{dir:-1,col:[255,90,50],amb:[90,40,120]}};
const R=makeRig();
const espAtual=()=>{try{return G&&G.char==='cav'&&typeof wIdx==='function'?wIdx():0}catch(_){return 0}};const riscoBase=()=>ESPADAS[espAtual()].risco;KN.esp=espAtual;const SEQ={};const seq=n=>SEQ[n]=SEQ[n]||vivo(n);
/* ---------- estados vindos do jogo ---------- */
function estados(){const c=G.combat,p=c&&c.p,st=(p&&p.st)||{},r=G.hp/Math.max(1,G.maxHp);
  return{forca:(st.forca||0)>0,bloqueio:(p&&p.block||0)>0,fraco:(st.fraco||0)>0,espinhos:(st.espinhos||0)>0||(st.retaliar||0)>0,
    pouca:r<=.3,wear:r>.75?0:r>.5?1:r>.25?2:3}}
/* ---------- quadros guardados (desenha e ilumina uma vez só) ---------- */
const CACHE=new Map();
function quadro(pose,key){const Lz=(window.LUZCENA&&LUZCENA('p'))||LUZ[G.act]||LUZ[1];if(key)key+='|'+(Lz.key||'');let e=key&&CACHE.get(key);if(e)return e;
  const cv=document.createElement('canvas');cv.width=40;cv.height=64;
  const lit=lightPass(R.draw(pose),Lz);cv.getContext('2d').drawImage(lit,0,0);
  e={cv,tip:R.info.tip.slice(),hand:R.info.hand.slice(),shield:R.info.shield?R.info.shield.slice():null,red:null};
  if(key){if(CACHE.size>900)CACHE.clear();CACHE.set(key,e)}return e}
function vermelho(e){if(e.red)return e.red;const c=document.createElement('canvas');c.width=40;c.height=64;const q=c.getContext('2d');q.drawImage(e.cv,0,0);q.globalCompositeOperation='source-in';q.fillStyle='#ff3a24';q.fillRect(0,0,40,64);return e.red=c}
function poseAtual(S){let nome=KN.anim;if(!KN.busy&&!KN.hold&&nome==='parado'&&S.pouca)nome='cansado';
  if(KN.ov)return{pose:{...KN.ov(KN.f),wear:S.wear,spikes:S.espinhos,esp:espAtual()},key:null};
  const sq=seq(nome),f=KN.hold?Math.min(KN.f,sq.length-1):KN.f%sq.length;let p={...sq[f],wear:S.wear,spikes:S.espinhos};
  if(S.fraco){p.hd=Math.min(1,(p.hd||0)+1);p.ht=Math.max(p.ht||0,.6);p.lean=(p.lean||0)+6*D;p.aF1=(p.aF1||0)-8*D;p.br=(p.br||0)*.5;p.hy=(p.hy||30)+1}
  if(S.forca&&!S.fraco){p.lean=(p.lean||0)+3*D;p.br=(p.br||0)+.5}
  const esp=espAtual();p.esp=esp;
  return{pose:p,key:[nome,f,G.act,S.wear,S.espinhos?1:0,S.fraco?1:0,S.forca?1:0,esp].join('|')}}
/* ---------- montagem na tela de luta ---------- */
function desmontar(){document.querySelectorAll('canvas.kn').forEach(c=>{const s=c.parentNode&&c.parentNode.querySelector('.spr');if(s)s.style.visibility='';c.remove()});KN.hold=false;KN.dead=false;KN.busy=false}
function montar(){if(!on()){desmontar();return}
  const fig=document.querySelector('[data-uid="p"] .fig');if(!fig)return;
  let cv=fig.querySelector('canvas.kn');const spr=fig.querySelector('.spr');if(spr)spr.style.visibility='hidden';
  if(!cv){cv=document.createElement('canvas');cv.className='kn';cv.width=40;cv.height=64;fig.appendChild(cv)}
  const w=fig.clientWidth||100,k=w/30;KN.k=k;Object.assign(cv.style,{position:'absolute',left:(w/2-19*k)+'px',bottom:(-3*k)+'px',width:40*k+'px',height:64*k+'px',imageRendering:'pixelated',pointerEvents:'none',zIndex:2});
  KN.cv=cv;KN.ctx=cv.getContext('2d');KN.ctx.imageSmoothingEnabled=false;desenha(true);ligar()}
KN.montar=montar;
/* ---------- desenho ---------- */
let lastKey='';
function desenha(force){if(!KN.cv||!KN.cv.isConnected)return;const S=estados(),{pose,key}=poseAtual(S);
  const k2=key+'|'+(espAtual()?Math.floor(performance.now()/70):0)+'|'+(S.bloqueio?1:0)+'|'+(S.forca?Math.floor(performance.now()/180)%4:0)+'|'+(S.bloqueio?Math.floor(performance.now()/90)%12:0);
  if(!force&&key&&k2===lastKey)return;lastKey=k2;
  const e=quadro(pose,key),x=KN.ctx;x.clearRect(0,0,40,64);
  if(S.forca){x.globalAlpha=.3+.15*Math.sin(performance.now()/220);const r=vermelho(e);for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])x.drawImage(r,dx,dy);x.globalAlpha=1}
  x.drawImage(e.cv,0,0);
  if(espAtual())brilhoEspada(x,e,espAtual(),performance.now());
  if(S.bloqueio&&e.shield){const sx=e.shield[0]-3,sy=e.shield[1],t=Math.floor(performance.now()/90),pts=[[0,-6],[3,-6],[6,-6],[6,-3],[6,0],[6,2],[4,4],[3,6],[1,4],[0,2],[0,0],[0,-3]];
    pts.forEach((q,i)=>{const d=((i-t)%pts.length+pts.length)%pts.length;if(d<4){x.globalAlpha=1-d*.25;x.fillStyle=d===0?'#fff':'#9fd8ff';x.fillRect(sx+q[0],sy+q[1],1,1)}});x.globalAlpha=1}
  KN.e=e;
  if(S.forca&&Math.random()<.2)part(e,'#ff5a3a',-.4);if(S.fraco&&Math.random()<.15)part(e,'#8a6ab0',.3)}
function part(e,col,vy){const r=KN.cv.getBoundingClientRect(),k=KN.k;FX.push({k:'p',x:r.left+(14+Math.random()*12)*k,y:r.top+(30+Math.random()*20)*k,vx:0,vy:vy*k,g:0,life:24,col});fxLigar()}
/* ---------- relógio (só roda na luta) ---------- */
let rodando=false;
function ligar(){if(rodando)return;rodando=true;requestAnimationFrame(tick)}
let lastTr='',lastD=0;
function tick(t){if(!KN.cv||!KN.cv.isConnected||!on()){rodando=false;return}requestAnimationFrame(tick);if(document.hidden)return;
  const tr=`translate(${KN.rx}px,${KN.ry}px)`;if(tr!==lastTr){KN.cv.style.transform=tr;lastTr=tr}
  let passo=false;if(!KN.busy&&!KN.hold&&t-KN.last>1000/12){KN.last=t;KN.f++;maniaTalvez(t);passo=true}
  /* parado: só redesenha no passo do quadro (12/s) ou a cada 90 ms; em golpe, todo quadro */
  if(KN.busy||passo||t-lastD>90){lastD=t;desenha(false)}}
/* ---------- efeitos em pixel por cima da tela ---------- */
let suja=null;function sj(X,Y){if(!suja)suja=[X,Y,X,Y];else{if(X<suja[0])suja[0]=X;if(Y<suja[1])suja[1]=Y;if(X>suja[2])suja[2]=X;if(Y>suja[3])suja[3]=Y}}
let FX=[],trail=[],trailOn=false,trailCol=riscoBase(),fxc=null,fxx=null,fxRod=false;
function fxCanvas(){if(fxc&&fxc.isConnected)return;fxc=document.createElement('canvas');fxc.className='knfx';Object.assign(fxc.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',pointerEvents:'none',zIndex:301,imageRendering:'pixelated'});document.body.appendChild(fxc);fxx=fxc.getContext('2d')}
function fxLigar(){fxCanvas();if(fxRod)return;fxRod=true;requestAnimationFrame(fxTick)}
function fxTick(){if(fxc.width!==innerWidth||fxc.height!==innerHeight){fxc.width=innerWidth;fxc.height=innerHeight}
  const x=fxx,k=Math.max(2,Math.round(KN.k));if(suja){x.clearRect(suja[0]-k*3,suja[1]-k*3,suja[2]-suja[0]+k*7,suja[3]-suja[1]+k*7)}suja=null;
  if(trailOn&&KN.e&&KN.cv){const r=KN.cv.getBoundingClientRect(),s=r.width/40;trail.push({t:[r.left+KN.e.tip[0]*s,r.top+KN.e.tip[1]*s],h:[r.left+KN.e.hand[0]*s,r.top+KN.e.hand[1]*s],a:1})}
  if(trailOn&&KN.e&&KN.cv){const fx=ESPADAS[espAtual()].fx;if(fx==='chamas'||fx==='brasas'||fx==='vazio'){const r=KN.cv.getBoundingClientRect(),sc=r.width/40,tx=r.left+KN.e.tip[0]*sc,ty=r.top+KN.e.tip[1]*sc,kk=KN.k;
    for(let i=0;i<(fx==='chamas'?3:2);i++)FX.push(fx==='vazio'?{k:'p',x:tx+(Math.random()-.5)*14*kk,y:ty+(Math.random()-.5)*14*kk,vx:0,vy:0,g:0,life:10,col:Math.random()<.5?'#7a4ae0':'#1a0a30'}:{k:'p',x:tx,y:ty,vx:(Math.random()-.5)*kk*.5,vy:-(.3+Math.random()*.7)*kk,g:-kk*.01,life:14+Math.random()*8,col:Math.random()<.5?'#ffd060':'#ff6a1a'})}}
  trail.forEach(q=>q.a-=.1);trail=trail.filter(q=>q.a>0);
  for(let i=1;i<trail.length;i++){const a=trail[i-1],b=trail[i];for(let u=0;u<=1;u+=.25){const ex=a.t[0]+(b.t[0]-a.t[0])*u,ey=a.t[1]+(b.t[1]-a.t[1])*u,ix=a.h[0]+(a.t[0]-a.h[0])*.45+((b.h[0]+(b.t[0]-b.h[0])*.45)-(a.h[0]+(a.t[0]-a.h[0])*.45))*u,iy=a.h[1]+(a.t[1]-a.h[1])*.45+((b.h[1]+(b.t[1]-b.h[1])*.45)-(a.h[1]+(a.t[1]-a.h[1])*.45))*u;
    for(let v=0;v<=1;v+=.2){x.globalAlpha=b.a*(v>.7?.95:.45);const vz=ESPADAS[espAtual()].fx==='vazio';x.fillStyle=v>.75?(vz?'#e8d8ff':'#fff'):(vz&&v<.6?'#12061e':trailCol);{const X=Math.round((ix+(ex-ix)*v)/k)*k,Y=Math.round((iy+(ey-iy)*v)/k)*k;x.fillRect(X,Y,k,k);sj(X,Y)}}}}
  for(const f of FX){f.life--;if(f.k==='p'){f.x+=f.vx;f.y+=f.vy;f.vy+=f.g||0;x.globalAlpha=Math.min(1,f.life/8);x.fillStyle=f.col;x.fillRect(Math.round(f.x/k)*k,Math.round(f.y/k)*k,k,k);sj(f.x,f.y)}
    else if(f.k==='d'){f.x+=f.vx;f.y+=f.vy;f.vx*=.94;x.globalAlpha=Math.min(.6,f.life/20);x.fillStyle='#7a6a54';x.fillRect(Math.round(f.x/k)*k,Math.round(f.y/k)*k,k*2,k);sj(f.x,f.y)}
    else if(f.k==='r'){const t=1-f.life/f.max,rr=f.r0+(f.r1-f.r0)*t;x.globalAlpha=1-t;x.strokeStyle=f.col;x.lineWidth=k;x.beginPath();x.ellipse(f.x,f.y,rr,rr*.28,0,0,7);x.stroke();sj(f.x-rr,f.y-rr*.3);sj(f.x+rr,f.y+rr*.3)}
    else if(f.k==='c'){x.globalAlpha=Math.min(1,f.life/20);x.fillStyle='#050302';sj(f.x-13*k,f.y-3*k);sj(f.x+13*k,f.y+3*k);for(let i=0;i<24;i++)x.fillRect(Math.round((f.x+(i-12)*k)/k)*k,Math.round((f.y+((Math.sin(i*1.7+f.s)*1.6)|0)*k)/k)*k,k,k)}}
  x.globalAlpha=1;FX=FX.filter(f=>f.life>0);
  if(FX.length||trail.length||trailOn)requestAnimationFrame(fxTick);else{fxRod=false;x.clearRect(0,0,fxc.width,fxc.height);suja=null}}
function faiscas(x,y,n,col,sp=2.2){col=col||ESPADAS[espAtual()].faisca;const k=KN.k;for(let i=0;i<n;i++){const a=(Math.random()-.5)*sp+(Math.random()<.5?0:Math.PI),v=(1+Math.random()*2.6)*k*.5;FX.push({k:'p',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-k*.4,g:k*.07,life:16+Math.random()*12,col})}fxLigar()}
function poeira(x,y,n=8,big=1){const k=KN.k;for(let i=0;i<n;i++){const s=i<n/2?-1:1;FX.push({k:'d',x:x+(Math.random()-.5)*6*k,y,vx:s*(.4+Math.random()*1.1)*big*k*.5,vy:-(.2+Math.random()*.5)*k*.5,life:22+Math.random()*10})}fxLigar()}
function onda(x,y,r,col='#ffd27a',life=18){FX.push({k:'r',x,y,r0:2,r1:r,life,max:life,col});fxLigar()}
function racha(x,y){FX.push({k:'c',x,y,life:60,s:Math.random()*99});fxLigar()}
/* ---------- tempo e movimento ---------- */
const espera=ms=>new Promise(r=>setTimeout(r,ms));
async function toca(nome,a,b,fps,tok){KN.anim=nome;KN.ov=null;for(let f=a;f<=b;f++){if(tok!==KN.tok)return;KN.f=f;await espera(1000/fps)}}
async function corta(nome,fa,fb,steps,ms,tok){const A=seq(nome)[fa],B=seq(nome)[fb];KN.anim=nome;KN.ov=t=>{const o=mix(A,B,t/steps);o.smear=undefined;return o};for(let i=0;i<=steps;i++){if(tok!==KN.tok)break;KN.f=i;await espera(ms/steps)}KN.ov=null;KN.f=fb}
function vai(x,ms,{pulo=0,ease='suave'}={},tok){const x0=KN.rx,t0=performance.now();return new Promise(r=>{const f=()=>{if(tok!==KN.tok){r();return}const t=Math.min(1,(performance.now()-t0)/ms),e=ease==='rapido'?t*t:ease==='devagar'?1-(1-t)*(1-t):t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  KN.rx=x0+(x-x0)*e;KN.ry=-pulo*4*t*(1-t);if(t<1)requestAnimationFrame(f);else{KN.ry=0;r()}};f()})}
function alvo(uid){const h=document.querySelector('[data-uid="p"] .fig'),t=document.querySelector(`[data-uid="${uid}"] .fig`);if(!h||!t)return null;const hr=h.getBoundingClientRect(),tr=t.getBoundingClientRect();
  return{el:t,dx:Math.max(10,(tr.left+tr.width*.15)-(hr.left+hr.width*.7))+KN.rx,x:tr.left+tr.width*.35,y:tr.top+tr.height*.45,chao:tr.bottom-2}}
function frente(on){const u=document.querySelector('[data-uid="p"]');if(u)u.style.zIndex=on?6:''}
function pancada(T,{push=10,flash=true}={}){if(!T||!T.el.isConnected)return;T.el.animate([{transform:'none',filter:'none'},{transform:'none',filter:flash?'brightness(3)':'none',offset:.12},{transform:`translateX(${push}px) rotate(${push/3}deg)`,filter:'brightness(1.3)',offset:.42},{transform:'none',filter:'none'}],{duration:380,easing:'ease-out'})}
async function volta(tok){KN.anim='golpe';KN.f=12;await vai(0,380,{pulo:16*KN.k*.35,ease:'devagar'},tok);const r=KN.cv&&KN.cv.getBoundingClientRect();if(r)poeira(r.left+r.width*.47,r.bottom-4*KN.k,6);KN.anim='parado';KN.f=0}
/* ---------- os poderes (cada carta chama o seu) ---------- */
const PODER={
 async rapido(T,tok){await toca('rapido',0,3,16,tok);await vai(KN.rx+Math.min(T.dx*.3,16*KN.k),90,{ease:'rapido'},tok);KN.f=4;faiscas(T.x,T.y,6);pancada(T,{push:6});som('golpe-espada');await espera(160);await toca('rapido',6,9,14,tok);await vai(0,200,{},tok);KN.anim='parado'},
 async golpe(T,tok){await toca('golpe',0,5,14,tok);await vai(T.dx,160,{ease:'rapido'},tok);trailOn=true;fxLigar();await corta('golpe',6,7,9,110,tok);trailOn=false;faiscas(T.x,T.y,10);pancada(T);som('golpe-espada');await espera(90);await toca('golpe',8,9,12,tok);await volta(tok)},
 async talho(T,tok){await toca('golpe',0,5,16,tok);await vai(T.dx,150,{ease:'rapido'},tok);trailOn=true;fxLigar();await corta('golpe',6,7,8,95,tok);trailOn=false;faiscas(T.x,T.y,7);pancada(T,{push:5});som('golpe-espada');
   const base=seq('golpe')[7];trailCol='#ffd9a8';trailOn=true;KN.ov=f=>({...base,sw:(235-(f/6)*150)*D,aF1:(180-f/6*130)*D,aF2:(190-f/6*120)*D,lean:26*D});for(let f=0;f<=6;f++){KN.f=f;await espera(28)}KN.ov=null;trailOn=false;trailCol=riscoBase();
   faiscas(T.x,T.y,7,'#ffd9a8');pancada(T,{push:8});som('golpe-espada',{rate:1.1});await volta(tok)},
 async pesado(T,tok){await toca('pesado',0,3,12,tok);const go=vai(T.dx-4*KN.k,420,{pulo:30*KN.k*.45},tok);await toca('pesado',4,8,13,tok);await go;trailOn=true;fxLigar();await corta('pesado',8,9,8,100,tok);trailOn=false;
   racha(T.x-6*KN.k,T.chao);onda(T.x-6*KN.k,T.chao,34*KN.k*.5);poeira(T.x-6*KN.k,T.chao,12,1.6);faiscas(T.x,T.y,14);pancada(T,{push:16});som('golpe-pesado');await espera(120);await toca('pesado',10,12,12,tok);await volta(tok)},
 async epico(T,tok){KN.brilho=true;await toca('epico',0,8,10,tok);await espera(150);const go=vai(T.dx-4*KN.k,560,{pulo:52*KN.k*.45},tok);await toca('epico',9,13,11,tok);await go;KN.brilho=false;trailOn=true;trailCol='#fff3c0';fxLigar();await corta('epico',13,14,9,120,tok);trailOn=false;trailCol=riscoBase();
   const fl=document.createElement('div');fl.style.cssText='position:fixed;inset:0;background:#fff3d0;pointer-events:none;z-index:302';document.body.appendChild(fl);fl.animate([{opacity:.55},{opacity:0}],{duration:240}).onfinish=()=>fl.remove();
   racha(T.x-6*KN.k,T.chao);onda(T.x-6*KN.k,T.chao,60*KN.k*.5,'#fff1b8',24);onda(T.x-6*KN.k,T.chao,38*KN.k*.5,'#fff',16);poeira(T.x-6*KN.k,T.chao,18,2.2);faiscas(T.x,T.y,28,'#fff1b8',3.2);pancada(T,{push:24});som('golpe-pesado',{rate:.8});await espera(160);await toca('epico',15,18,10,tok);await volta(tok)},
 async empurrao(T,tok){await toca('escudo',0,3,14,tok);await vai(T.dx-2*KN.k,170,{ease:'rapido'},tok);faiscas(T.x-4*KN.k,T.y,12,'#cfe6ff');onda(T.x,T.y,14*KN.k*.5,'#bfe0ff',12);pancada(T,{push:20});som('bloqueio');await espera(160);await vai(0,260,{pulo:8*KN.k*.4,ease:'devagar'},tok);KN.anim='parado';KN.f=0},
 async giratorio(T,tok){await toca('golpe',0,4,14,tok);await vai(T.dx,150,{ease:'rapido'},tok);trailOn=true;trailCol='#e9d8ff';fxLigar();const base=seq('golpe')[7];
   for(let v=0;v<2;v++){KN.ov=f=>{const a=(200-f*30)*D;return{...base,sw:a,aF1:a-30*D,aF2:a-10*D,lean:(18+Math.sin(f)*6)*D}};for(let f=0;f<12;f++){if(tok!==KN.tok)break;KN.f=f;await espera(22);if(f===6){faiscas(T.x,T.y,6,'#e9d8ff');pancada(T,{push:6});som('golpe-espada',{rate:1.2})}}}
   KN.ov=null;trailOn=false;trailCol=riscoBase();await volta(tok)},
 async investida(T,tok){await toca('golpe',0,3,16,tok);KN.anim='andar';const run=vai(T.dx+30*KN.k*.5,340,{ease:'rapido'},tok);for(let i=0;i<5;i++){KN.f=(i*2)%8;await espera(46);if(i===3){trailOn=true;fxLigar();await corta('golpe',6,7,6,70,tok);faiscas(T.x,T.y,12);pancada(T,{push:12});som('golpe-espada')}}
   await run;trailOn=false;const r=KN.cv.getBoundingClientRect();poeira(r.left+r.width*.47,r.bottom-4*KN.k,8);await espera(140);await volta(tok)},
};
function som(k,o){try{sfx(k,o)}catch(e){}}
/* tempo até o impacto de cada poder (para o dano aparecer junto) */
const IMPACTO={rapido:330,golpe:700,talho:640,pesado:870,epico:1760,empurrao:390,giratorio:600,investida:500};
function poderDaCarta(d,v,t){const id=Object.keys(CARDS).find(k=>CARDS[k]===d)||'';
  if(/talho/.test(id))return'talho';if(/giratorio|varrida|tempestade/.test(id))return'giratorio';if(/investida|carga/.test(id))return'investida';if(/empurrao|arremesso/.test(id))return'empurrao';
  let dano=v&&typeof v.d==='number'?v.d:6;try{if(t)dano=calcDmg(dano,P(),t)}catch(e){}
  return dano>=20?'epico':dano>=10?'pesado':dano>=6?'golpe':'rapido'}
async function agir(fn){const tok=++KN.tok;KN.busy=true;KN.hold=false;KN.ov=null;frente(true);try{await fn(tok)}finally{if(tok===KN.tok){KN.busy=false;KN.rx=0;KN.ry=0;frente(false);KN.ov=null;if(!KN.hold){KN.anim='parado';KN.f=0}}}}
/* ---------- ligação com o jogo ---------- */
const _paf=playerAttackFx;
playerAttackFx=function(d,v,t){if(!on())return _paf(d,v,t);montar();
  sfx('carta-jogar',{vol:.7});trailCol=riscoBase();
  if(d.t==='atk'){const tg=d.tg==='e'&&t?t:alive()[0];const nome=poderDaCarta(d,v,t);
    if(d.fxk==='fire')trailCol='#ffb060';else if(d.fxk==='dark')trailCol='#c08aff';
    const T=tg&&alvo(tg.uid);if(T){agir(tok=>PODER[nome](T,tok).finally(()=>{trailCol=riscoBase()}))}
    if(d.tg!=='e')alive().forEach(x=>{if(x!==tg)slash(x.uid,IMPACTO[nome])});
    FXB=IMPACTO[nome];return}
  const txt=d.x?d.x(v):'';const id=Object.keys(CARDS).find(k=>CARDS[k]===d)||'';
  let nome=/Bloqueio|Armadura|Esquiva/.test(txt)?'escudo':/provocar/.test(id)?'chamar':/brado|furia|estandarte|ira|esgrima/.test(id)?'girarEspada':/bandagem|hidromel|cure|prece/.test(id+txt.toLowerCase())?'alongar':'apontar';
  if(d.t==='pwr'&&nome==='apontar')nome='girarEspada';
  agir(async tok=>{const sq=seq(nome).length;await toca(nome,0,Math.min(sq-1,nome==='escudo'?5:sq-1),nome==='escudo'?14:14,tok);if(nome==='escudo'){const r=KN.cv.getBoundingClientRect();onda(r.left+r.width*.62,r.top+r.height*.55,16*KN.k*.5,'#bfe0ff',14)}});
  if(t){proj('p',t.uid,d.fxk||'hex');FXB=260}};
const REACAO={'mv-block':'bateEscudo','mv-hit':'ferido','mv-dodge':'esquiva','mv-victory':'vitoria','mv-buff':'girarEspada','mv-heal':'alongar','mv-cast':'apontar','mv-summon':'apontar'};
const _hp=heroPose;
heroPose=function(fig,cls){if(!on()||!fig||!fig.closest('[data-uid="p"]'))return _hp(fig,cls);montar();fig.classList.remove(...MVS);
  if(cls==='dead'){agir(async tok=>{KN.hold=true;await toca('caindo',0,15,12,tok);KN.f=15});return}
  const nome=REACAO[cls];if(!nome)return;
  if(cls==='mv-victory'){agir(async tok=>{KN.hold=true;await toca('vitoria',0,13,12,tok);KN.f=13});return}
  agir(async tok=>{const n=seq(nome).length;
    if(nome==='bateEscudo'){const r=KN.cv.getBoundingClientRect(),e=KN.e,s=r.width/40;if(e&&e.shield){faiscas(r.left+(e.shield[0]+1)*s,r.top+e.shield[1]*s,12,'#e8f4ff');onda(r.left+(e.shield[0]+1)*s,r.top+e.shield[1]*s,10*KN.k*.5,'#bfe0ff',10)}
      await toca(nome,0,2,22,tok);await vai(-8*KN.k*.5,120,{ease:'devagar'},tok);await toca(nome,3,n-1,14,tok);await vai(0,200,{},tok);return}
    if(nome==='ferido'){const r=KN.cv.getBoundingClientRect();faiscas(r.left+r.width*.55,r.top+r.height*.55,6,'#ff8a7a');const mv=vai(-12*KN.k*.5,220,{ease:'devagar'},tok);await toca(nome,0,n-1,12,tok);await mv;await vai(0,240,{},tok);return}
    if(nome==='esquiva'){const mv=vai(-26*KN.k*.5,260,{pulo:10*KN.k*.4,ease:'devagar'},tok);await toca(nome,1,6,20,tok);await mv;await toca(nome,7,9,14,tok);await vai(0,240,{},tok);return}
    await toca(nome,0,n-1,14,tok)})};
/* manias quando parado na luta (de vez em quando) */
const MANIAS=['girarEspada','chamar','alongar','apontar','guarda'];let ult='';
function maniaTalvez(t){if(KN.busy||KN.hold||UI.lock||!G.combat||G.combat.over)return;if(!KN.maniaT)KN.maniaT=t+6000;if(t<KN.maniaT)return;
  KN.maniaT=t+7000+Math.random()*7000;let m;do{m=MANIAS[Math.floor(Math.random()*MANIAS.length)]}while(m===ult);ult=m;
  agir(async tok=>{const n=seq(m).length,reps=m==='guarda'?3:1;for(let r=0;r<reps;r++)await toca(m,0,n-1,m==='guarda'?10:12,tok)})}
/* monta depois de cada atualização da tela */
const _render=render;render=function(){const r=_render.apply(this,arguments);if(on())montar();else desmontar();return r};
const _patch=typeof patchCombat==='function'?patchCombat:null;if(_patch)patchCombat=function(){const r=_patch.apply(this,arguments);if(on())montar();return r};
/* nova luta: volta ao normal */
const _sc=startCombat;startCombat=function(){KN.tok++;KN.busy=false;KN.hold=false;KN.rx=0;KN.ry=0;KN.anim='parado';KN.f=0;KN.maniaT=0;CACHE.clear();return _sc.apply(this,arguments)};
addEventListener('resize',()=>{if(on())setTimeout(montar,60)});
/* opção nas Opções */
/* vitrine (v2.49): quadros do Cavaleiro para outras telas (escolha do herói, fogueira) */
const VIT=new Map();KN.MANIAS=MANIAS;
KN.vitrine=function(nome,f,luz){const sq=seq(nome),i=((f%sq.length)+sq.length)%sq.length,k=nome+'|'+i+'|'+JSON.stringify(luz||0);let c=VIT.get(k);if(c)return{cv:c,n:sq.length};
  const p={...sq[i],wear:0,spikes:0,esp:0};c=document.createElement('canvas');c.width=40;c.height=64;c.getContext('2d').drawImage(luz===null?R.draw(p):lightPass(R.draw(p),luz||LUZ[1]),0,0);if(VIT.size>400)VIT.clear();VIT.set(k,c);return{cv:c,n:sq.length}};
if(OPT.cavNovo===undefined)OPT.cavNovo=true;
const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
  if(pan&&!pan.querySelector('[data-k="cavNovo"]')){const d=document.createElement('div');d.className='optrow';const b=(v,t)=>`<button class="optb ${String(OPT.cavNovo)===v?'on':''}" data-act="optset" data-k="cavNovo" data-v="${v}">${t}</button>`;
    d.innerHTML=`<b>Cavaleiro novo</b><span>O Cavaleiro com movimentos de verdade nas lutas (teste). Desligue para voltar ao antigo.</span><div>${b('true','Ligado')}${b('false','Desligado')}</div>`;pan.insertBefore(d,pan.children[3]||null)}return r};
})();
