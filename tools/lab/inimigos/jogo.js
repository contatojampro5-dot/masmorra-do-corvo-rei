/* ===== Inimigos novos dentro do jogo (tela de luta) =====
   Usa os bonecos de bichos.js … bichos7.js. Cada golpe do jogo toca a animação de mesmo nome (ex.: "Facada"),
   o dano aparece no impacto, chefes entram em Fase 2 com metade da vida, e a morte é a do boneco.
   Leve: quadros desenhados uma vez e guardados; o relógio só roda na luta. Desliga em Opções → "Inimigos novos". */
(function(){
const NV={ST:{},CACHE:new Map()};window.NV=NV;
const ativo=()=>OPT.inimigosNovos!==false&&typeof G!=='undefined'&&G&&G.screen==='combat'&&G.combat;
NV.ativo=ativo;
const LUZ={1:{dir:-1,col:[255,160,70],amb:[60,40,40]},2:{dir:1,col:[140,210,255],amb:[40,60,60]},3:{dir:-1,col:[255,90,50],amb:[90,40,120]}};
const FASE2={reigoblin:'O Rei Goblin se enfurece!',golem:'O núcleo do Golem se abre!',rainha:'A Rainha Aranha enlouquece!',lich:'O Lich arde em fogo verde!',reicorvo:'O pacto toma conta!'};
const ST=NV.ST,CACHE=NV.CACHE,MED={};
/* estilo: esconde o desenho antigo e tira a queda antiga (o boneco cai sozinho) */
{const s=document.createElement('style');s.textContent='.fig.bnfig .spr{visibility:hidden}.unit.dead .fig.bnfig{animation:none!important}.fig.bnfig canvas.bn{position:absolute;pointer-events:none;image-rendering:pixelated;z-index:2}';document.head.appendChild(s)}
/* medida do boneco parado (para o tamanho e o lugar na tela) */
function medir(id){if(MED[id])return MED[id];const q=BICHO.quadro(id,BICHO.seq(id,'parado')[0],null),w=q.width,h=q.height,d=q.getContext('2d').getImageData(0,0,w,h).data;
  let x0=w,x1=0,y0=h,y1=0;for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(d[(y*w+x)*4+3]>0){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  return MED[id]={w,h,x0,x1,y0,y1,cx:(x0+x1+1)/2,cy:(y0+y1+1)/2,bw:x1-x0+1,bh:y1-y0+1}}
function quadro(st){const f2=st.f2&&st.anim!=='fase2'?1:0,act=G.act||1,key=st.id+'|'+st.anim+'|'+st.f+'|'+f2+'|'+act;let q=CACHE.get(key);
  if(!q){let ps=BICHO.seq(st.id,st.anim)[st.f];if(f2)ps={...ps,f2:1};q=BICHO.quadro(st.id,ps,LUZ[act]||LUZ[1]);if(CACHE.size>2500)CACHE.clear();CACHE.set(key,q)}return{q,key}}
function inimigo(uid){return G.combat&&G.combat.enemies.find(x=>x.uid===uid)}
function estado(uid,id){let st=ST[uid];if(!st||st.id!==id)st=ST[uid]={uid,id,anim:'parado',f:0,t:0,f2:0,fila:[],cv:null,ultimo:'',morto:0,morteEm:0};return st}
function toca(st,nome){const A=BICHOS[st.id].A[nome];if(!A)return false;st.anim=nome;st.f=0;st.t=0;return true}
const ocupado=st=>st.anim!=='parado'&&!BICHOS[st.id].A[st.anim].loop;
/* ---------- montagem nas unidades inimigas ---------- */
function desmontar(){document.querySelectorAll('.fig.bnfig').forEach(f=>{f.classList.remove('bnfig');f.querySelectorAll('canvas.bn').forEach(c=>c.remove())})}
function montar(){if(!ativo()){desmontar();return}
  document.querySelectorAll('.unit.enemy[data-uid]').forEach(u=>{const uid=u.dataset.uid,e=inimigo(uid);if(!e||!BICHOS[e.id])return;const st=estado(uid,e.id),fig=u.querySelector('.fig');if(!fig)return;
    fig.classList.add('bnfig');let cv=fig.querySelector('canvas.bn');if(!cv){cv=document.createElement('canvas');cv.className='bn';fig.appendChild(cv)}
    const B=BICHOS[e.id],m=medir(e.id),fw=fig.clientWidth||80,fh=fig.clientHeight||fw,k=Math.min(fh*(B.voa?.8:.92)/m.bh,fw*1.2/m.bw);
    if(cv.width!==m.w){cv.width=m.w;cv.height=m.h;st.ultimo=''}
    const left=fw/2-m.cx*k,top=B.voa?fh*.52-m.cy*k:fh-(m.y1+1)*k;
    Object.assign(cv.style,{left:left+'px',top:top+'px',width:m.w*k+'px',height:m.h*k+'px',opacity:st.morto>1?0:1});
    if(st.cv!==cv){st.cv=cv;st.ultimo=''}
    if(e.hp<=0&&!st.morto&&!st.morteEm)st.morteEm=performance.now()+1300;
    desenha(st)});
  ligar()}
NV.montar=montar;
function desenha(st){if(!st.cv||!st.cv.isConnected)return;const{q,key}=quadro(st);if(key===st.ultimo)return;st.ultimo=key;const x=st.cv.getContext('2d');x.clearRect(0,0,st.cv.width,st.cv.height);x.drawImage(q,0,0);
  if(q.flash>.5&&BICHOS[st.id].W)clarao(q.flash)}
function clarao(a){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#f4e8ff;pointer-events:none;z-index:302';document.body.appendChild(d);d.animate([{opacity:a*.45},{opacity:0}],{duration:260}).onfinish=()=>d.remove()}
function morrer(st){if(st.morto)return;st.morto=1;st.fila=[];toca(st,'morte')}
/* ---------- relógio (só na luta) ---------- */
let rodando=false,last=0;
function ligar(){if(rodando)return;rodando=true;last=performance.now();requestAnimationFrame(tick)}
function tick(t){const vivos=Object.values(ST).filter(s=>s.cv&&s.cv.isConnected);if(!ativo()||!vivos.length){rodando=false;return}requestAnimationFrame(tick);
  const dt=Math.min(100,t-last);last=t;if(document.hidden)return;
  for(const st of vivos){const B=BICHOS[st.id],e=inimigo(st.uid);
    if(e&&e.hp<=0&&!st.morto&&st.morteEm&&t>=st.morteEm)morrer(st);
    if(e&&e.hp>0&&B.A.fase2&&!st.f2&&!st.f2fila&&ENEMIES[e.id]&&ENEMIES[e.id].boss&&e.hp<=e.maxHp/2){st.f2fila=1;st.fila.push('fase2');try{banner(FASE2[st.id]||'Fase 2!',true)}catch(_){}}
    if(st.anim==='parado'&&st.fila.length&&!st.morto)toca(st,st.fila.shift());
    const A=B.A[st.anim],n=BICHO.seq(st.id,st.anim).length,step=1000/A.fps;st.t+=dt;
    while(st.t>=step){st.t-=step;st.f++;
      if(st.f>=n){if(A.loop)st.f=0;else if(st.anim==='morte'){st.f=n-1;if(st.morto===1){st.morto=2;const cv=st.cv;setTimeout(()=>{if(cv&&cv.isConnected){cv.style.transition='opacity .7s';cv.style.opacity=0}},900)}break}
        else{if(st.anim==='fase2')st.f2=1;const prox=st.fila.shift();if(!(prox&&toca(st,prox)))toca(st,'parado');break}}}
    desenha(st)}}
/* ---------- ligação com o jogo ---------- */
// reações: o jogo pede uma animação (mv-…) e o boneco faz a dele no lugar
const _rf=runFx;
runFx=function(f){if(f.k==='a'&&ativo()){const st=ST[f.uid];if(st&&st.cv&&st.cv.isConnected){reagir(st,f.cls);return}}return _rf(f)};
function reagir(st,cls){const B=BICHOS[st.id],e=inimigo(st.uid);
  if(cls==='mv-summon'){if(st.morto){st.morto=0;st.morteEm=0;if(st.cv){st.cv.style.transition='';st.cv.style.opacity=1}toca(st,B.A.remontar?'remontar':B.A.entrada?'entrada':'parado')}return}
  if(st.morto)return;
  if(cls==='mv-hit'){if(e&&e.hp<=0){morrer(st);return}const c=st.cv;if(c)c.animate([{filter:'brightness(3)'},{filter:'none'}],{duration:220});if(!ocupado(st)||st.anim==='ferido')toca(st,'ferido');return}
  if(cls==='mv-enter'){if(B.A.entrada)toca(st,'entrada');return}
  if(cls==='mv-freeze'){const fig=st.cv&&st.cv.parentNode;if(fig){fig.classList.remove(...MVS);void fig.offsetWidth;fig.classList.add('mv-freeze')}return}
  if(cls==='mv-block'&&!st.prox){if(B.A.defesa)toca(st,'defesa');return}
  const nome=st.prox||({'mv-lunge':'ataque','mv-shoot':'ataque','mv-cast':B.A.especial?'especial':'ataque','mv-buff':B.A.buff?'buff':B.A.defesa?'defesa':null}[cls]);st.prox=null;
  if(nome&&B.A[nome])toca(st,nome)}
// golpe do inimigo: escolhe a animação pelo nome do golpe e marca o dano no impacto
function animDoGolpe(B,mv){let nome=Object.keys(B.A).find(k=>B.A[k].nome===mv.n);if(nome)return nome;
  if(mv.d)return mv.pj&&B.A.especial?'especial':'ataque';if(mv.i==='def')return B.A.defesa?'defesa':B.A.buff?'buff':null;
  if(mv.i&&mv.i.includes('buff'))return B.A.buff?'buff':B.A.defesa?'defesa':'especial';return B.A.especial?'especial':B.A.buff?'buff':'ataque'}
let extra=0;
const _dm=doMove;
doMove=function(e,mv){const st=ST[e.uid];if(!ativo()||!st||!st.cv||!st.cv.isConnected||st.morto)return _dm(e,mv);
  const B=BICHOS[st.id],nome=animDoGolpe(B,mv);st.prox=nome;const A=nome&&B.A[nome],hit=A&&A.hits?Math.round(A.hits[0]*1000/A.fps):320;
  const dur=A?Math.round(BICHO.seq(st.id,nome).length*1000/A.fps):600;
  if(mv.d){talkFoe(e,'atk',.3);
    if(mv.pj){anim(e.uid,'mv-cast');proj(e.uid,'p',mv.pj,hit);FXB=hit+270}else{anim(e.uid,'mv-lunge');FXB=hit}
    for(let i=0;i<(mv.h||1);i++)enemyHit(e,mv.d,i)}
  else if(mv.i==='debuff'){anim(e.uid,'mv-cast');proj(e.uid,'p',mv.pj||'hex',hit);FXB=hit+270}
  else if(mv.i==='sum')anim(e.uid,'mv-cast');
  else if(mv.i.includes('buff'))anim(e.uid,'mv-buff');
  else if(mv.i==='def')anim(e.uid,'mv-block');
  else anim(e.uid,'mv-cast');
  if(mv.b){e.block+=mv.b;fx(e.uid,'+'+mv.b,'blk')}
  if(mv.f)mv.f(e);
  const base=mv.d?700+(mv.h||1)*90:560,precisa=Math.max(FXB+(mv.h||1)*170+250,Math.min(dur,2600)*.8);extra=Math.max(0,precisa-base);
  FXB=0};
// turno inimigo: igual ao do jogo, mas espera o golpe do boneco terminar antes de seguir
const _ep=enemyPhase;
enemyPhase=async function(c){if(!ativo())return _ep(c);
  UI.lock=true;
  await sleep(550);banner('Turno inimigo',true);await sleep(400);
  for(const e of[...c.enemies]){
    if(G.combat!==c)return;
    if(e.hp<=0&&e.revive){revive(e);render();await sleep(ST[e.uid]&&BICHOS[ST[e.uid].id].A.remontar?1700:600);continue}
    if(e.hp<=0)continue;
    e.block=0;delete e.st.intangivel;tickDots(e);
    if(e.hp<=0){render();await sleep(350);continue}
    if(e.st.congelado){delete e.st.congelado;fx(e.uid,'Congelado!','blk');anim(e.uid,'mv-freeze');render();await sleep(500);continue}
    const mv=ENEMIES[e.id].moves[e.mv];
    extra=0;doMove(e,mv);
    render();await sleep((mv.d?700+(mv.h||1)*90:560)+extra);extra=0;
    if(G.hp<=0&&checkEnd())return;
  }
  if(G.combat!==c)return;
  c.enemies=c.enemies.filter(e=>e.hp>0||e.revive);
  for(const e of alive()){dec(e,'fraco');dec(e,'vuln');if(e.st.ritual)apply(e,'forca',e.st.ritual);if(e.st.pedra)e.block+=e.st.pedra;pickMove(e)}
  if(checkEnd())return;
  startPlayerTurn();UI.lock=false;render();
  if(!checkEnd())banner('Seu turno',true)};
// vitória: espera a queda dos bonecos terminar (no Corvo Rei, a cena inteira) antes da tela de vitória
const _ce=checkEnd;
checkEnd=function(){const c=G.combat;if(!ativo()||!c||c.over||G.hp<=0)return _ce();
  if(!alive().length&&!c.enemies.some(e=>e.revive)){const ag=performance.now();let fim=0;
    for(const e of c.enemies){const st=ST[e.uid];if(!st||!st.cv||!st.cv.isConnected||!BICHOS[st.id].A.morte)continue;const A=BICHOS[st.id].A.morte,n=BICHO.seq(st.id,'morte').length,d=n*1000/A.fps;
      fim=Math.max(fim,st.morto===2?0:st.morto===1?(n-st.f)*1000/A.fps:Math.max(800,(st.morteEm||ag+900)-ag)+d)}
    const extra=Math.min(9500,Math.max(0,fim+500-1300));
    c.over=true;UI.lock=true;anim('p','mv-victory',500+extra);talkHero('win',.85,{prio:2,delay:650+extra});render();setTimeout(()=>{UI.lock=false;winCombat()},1300+extra);return true}
  return _ce()};
// monta depois de cada atualização da tela
const _render=render;render=function(){const r=_render.apply(this,arguments);try{montar()}catch(err){console.error(err)}return r};
const _patch=typeof patchCombat==='function'?patchCombat:null;if(_patch)patchCombat=function(){const r=_patch.apply(this,arguments);try{montar()}catch(err){console.error(err)}return r};
const _sc=startCombat;startCombat=function(){for(const k in ST)delete ST[k];return _sc.apply(this,arguments)};
addEventListener('resize',()=>{if(ativo())setTimeout(montar,80)});
/* opção nas Opções */
if(OPT.inimigosNovos===undefined)OPT.inimigosNovos=true;
const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
  if(pan&&!pan.querySelector('[data-k="inimigosNovos"]')){const d=document.createElement('div');d.className='optrow';const b=(v,t)=>`<button class="optb ${String(OPT.inimigosNovos)===v?'on':''}" data-act="optset" data-k="inimigosNovos" data-v="${v}">${t}</button>`;
    d.innerHTML=`<b>Inimigos novos</b><span>Inimigos e chefes com movimentos de verdade nas lutas. Desligue para voltar aos desenhos antigos.</span><div>${b('true','Ligado')}${b('false','Desligado')}</div>`;pan.insertBefore(d,pan.children[4]||null)}return r};
})();
