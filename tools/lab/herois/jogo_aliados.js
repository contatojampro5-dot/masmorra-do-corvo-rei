/* ===== Aliados novos dentro do jogo: Sir Aldo, Mira, Bruna, Frei Tobias, Kael e Irmã Celeste =====
   Usa o motor dos inimigos (window.BICHO) + base.js + aliados.js.
   - Na luta: o aliado entra, fica parado fazendo manias e, no fim do turno, ataca (golpe ou especial, sorteado) no tempo do dano.
   - Na vitória ele comemora.
   - Na cena do encontro (fogueira / depois da luta): o aliado animado olhando para o herói.
   Desliga em Opções → "Aliados novos". */
(function(){
const LUZ={1:{dir:-1,col:[255,160,70],amb:[60,40,40]},2:{dir:1,col:[140,210,255],amb:[40,60,60]},3:{dir:-1,col:[255,90,50],amb:[90,40,120]}};
const ligado=()=>OPT.aliadosNovos!==false&&typeof G!=='undefined'&&G;
const bid=id=>'a_'+id;
const MED={};function medir(b){if(MED[b])return MED[b];const q=BICHO.quadro(b,BICHO.seq(b,'parado')[0],null),w=q.width,h=q.height,d=q.getContext('2d').getImageData(0,0,w,h).data;
  let x0=w,x1=0,y0=h,y1=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>0){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  return MED[b]={w,h,cx:(x0+x1+1)/2,bh:y1-y0+1,y1}}
const CACHE=new Map();function quadro(b,an,f){const act=(G&&G.act)||1,k=b+'|'+an+'|'+f+'|'+act;let q=CACHE.get(k);if(!q){q=BICHO.quadro(b,BICHO.seq(b,an)[f],LUZ[act]||LUZ[1]);if(CACHE.size>1200)CACHE.clear();CACHE.set(k,q)}return q}
/* um "ator": canvas + animação atual */
function ator(cont,b,escala){let cv=cont.querySelector('canvas.na');const m=medir(b);
  if(!cv){cv=document.createElement('canvas');cv.className='na';cv.width=m.w;cv.height=m.h;cont.appendChild(cv)}
  const fw=cont.clientWidth||90,fh=cont.clientHeight||fw,k=fw*escala/m.bh;
  Object.assign(cv.style,{position:'absolute',left:(fw/2-m.cx*k)+'px',top:(fh-(m.y1+1)*k+2*k)+'px',width:m.w*k+'px',height:m.h*k+'px',imageRendering:'pixelated',pointerEvents:'none',zIndex:2});
  if(!cv._s)cv._s={b,anim:'parado',f:0,t:0,hold:0,mania:3000+Math.random()*4000,ult:''};cv._s.b=b;return cv}
function toca(cv,nome,hold){const s=cv._s,A=BICHOS[s.b].A[nome];if(!A)return 0;s.anim=nome;s.f=0;s.t=0;s.hold=hold?1:0;s.ult='';return 1}
const NAL={toca:(n,h)=>{const cv=document.querySelector('[data-uid="ally"] canvas.na');return cv?toca(cv,n,h):0}};window.NAL=NAL;
function passo(cv,dt){const s=cv._s,B=BICHOS[s.b],A=B.A[s.anim],n=BICHO.seq(s.b,s.anim).length,step=1000/A.fps;s.t+=dt;
  if(s.anim==='parado'){s.mania-=dt;if(s.mania<=0){s.mania=7000+Math.random()*6000;toca(cv,'mania'+(1+Math.floor(Math.random()*2)))}}
  while(s.t>=step){s.t-=step;s.f++;if(s.f>=n){if(A.loop)s.f=0;else if(s.hold){s.f=n-1;break}else{toca(cv,'parado');break}}}
  const key=s.anim+'|'+s.f+'|'+((G&&G.act)||1);if(key===s.ult)return;s.ult=key;const x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);x.drawImage(quadro(s.b,s.anim,s.f),0,0)}
/* ---------- montagem: luta ---------- */
function montarLuta(){const c=G.combat,fig=document.querySelector('[data-uid="ally"] .fig');if(!fig||!c||!c.ally||!BICHOS[bid(c.ally)])return;
  const spr=fig.querySelector('.spr');if(spr)spr.style.visibility='hidden';fig.style.position=fig.style.position||'relative';
  const novo=!fig.querySelector('canvas.na'),cv=ator(fig,bid(c.ally),1.34);
  if(novo&&c._alEntrou!==c.ally){c._alEntrou=c.ally;toca(cv,'entrada')}}
/* ---------- montagem: cena do encontro ---------- */
function montarCena(){const sc=document.querySelector('.wscene');if(!sc||!G.war||!BICHOS[bid(G.war.id)])return;const sp=sc.querySelectorAll(':scope > .spr'),el=sp[sp.length-1];if(!el||sp.length<2)return;
  if(!el.dataset.bg){el.dataset.bg=el.style.backgroundImage||'x';el.style.backgroundImage='none';el.style.position='relative'}
  const novo=!el.querySelector('canvas.na'),cv=ator(el,bid(G.war.id),1.05);
  if(novo){const w=G.war,chave=w.id+'|'+w.mode+'|'+w.phase;if(cena!==chave){cena=chave;toca(cv,w.mode==='fight'&&w.phase==='after'?'vitoria':'entrada')}}
  if(G.war.learned&&!cv._tchau){cv._tchau=1;toca(cv,'despedida',1)}}
let cena='';
function desmontar(){document.querySelectorAll('canvas.na').forEach(cv=>{const p=cv.parentNode;if(p.classList.contains('spr')){p.style.backgroundImage=p.dataset.bg&&p.dataset.bg!=='x'?p.dataset.bg:'';delete p.dataset.bg}else{const s=p.querySelector('.spr');if(s)s.style.visibility=''}cv.remove()})}
function montar(){if(!ligado()){desmontar();return}try{if(G.screen==='combat'&&G.combat)montarLuta();if(G.screen==='warrior')montarCena()}catch(e){console.error(e)}
  if(document.querySelector('canvas.na'))ligar()}
/* ---------- relógio (só enquanto há aliado na tela) ---------- */
let rodando=false,last=0;
function ligar(){if(rodando)return;rodando=true;last=performance.now();requestAnimationFrame(tick)}
function tick(t){const cvs=document.querySelectorAll('canvas.na');if(!cvs.length||!ligado()){rodando=false;return}requestAnimationFrame(tick);const dt=Math.min(100,t-last);last=t;if(document.hidden)return;cvs.forEach(cv=>passo(cv,dt))}
/* ---------- ataque do fim do turno: o jogo chama anim('ally',...) e depois slash/proj ---------- */
function hitMs(b,n){const A=BICHOS[b].A[n];return A&&A.hits?Math.round(A.hits[0]*1000/A.fps):200}
const _anim=anim;anim=function(uid,cls,d=0){if(uid!=='ally'||!ligado()||!G.combat||!G.combat.ally||!BICHOS[bid(G.combat.ally)])return _anim(uid,cls,d);
  const b=bid(G.combat.ally),W=WARR[G.combat.ally],nome=Math.random()<.35?'especial':'ataque',hit=hitMs(b,nome);
  // golpe: o corte do jogo cai em FXB+150 depois deste anim; tiro: o projétil sai em FXB+d
  const quando=Math.max(0,FXB+d+(W.atk==='melee'?150:0)-hit);
  FXQ.push({k:'al',nome,delay:quando})};
const _run=runFx;runFx=function(f){if(f.k==='al'){montar();NAL.toca(f.nome);return}return _run(f)};
/* vitória do herói: o aliado comemora junto */
const _hp=heroPose;heroPose=function(fig,cls){const r=_hp.apply(this,arguments);if(cls==='mv-victory'&&ligado())NAL.toca('vitoria',1);return r};
const _render=render;render=function(){const r=_render.apply(this,arguments);try{montar()}catch(e){console.error(e)}return r};
const _patch=typeof patchCombat==='function'?patchCombat:null;if(_patch)patchCombat=function(){const r=_patch.apply(this,arguments);try{montar()}catch(e){console.error(e)}return r};
addEventListener('resize',()=>setTimeout(montar,80));
if(OPT.aliadosNovos===undefined)OPT.aliadosNovos=true;
const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
  if(pan&&!pan.querySelector('[data-k="aliadosNovos"]')){const d=document.createElement('div');d.className='optrow';const b=(v,t)=>`<button class="optb ${String(OPT.aliadosNovos)===v?'on':''}" data-act="optset" data-k="aliadosNovos" data-v="${v}">${t}</button>`;
    d.innerHTML=`<b>Aliados novos</b><span>Sir Aldo, Mira, Bruna, Frei Tobias, Kael e Irmã Celeste com movimentos de verdade. Desligue para voltar aos desenhos antigos.</span><div>${b('true','Ligado')}${b('false','Desligado')}</div>`;pan.insertBefore(d,pan.children[5]||null)}return r};
})();
