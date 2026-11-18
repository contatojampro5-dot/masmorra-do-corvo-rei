/* ===== Heróis novos dentro do jogo: Caçadora, Mago, Guardião e Necromante =====
   Usa o motor dos inimigos (window.BICHO, já montado no jogo) + base.js + h_*.js.
   - Cada carta toca o golpe que combina (tabela GOLPE); o dano aparece no impacto.
   - Efeitos que caem no alvo (chuva de flechas, raios, meteoro, corvo branco…) são desenhados em cima do inimigo de verdade.
   - Servos do Necromante viram as criaturas que ele derrotou (verdes), e a carta Erguer Morto mostra a criatura levantando.
   - Na vitória, o Necromante ergue o último inimigo vencido.
   Desliga em Opções → "Heróis novos". */
(function(){
const NH={};window.NH=NH;
const HERO_IDS={cac:'h_cac',mag:'h_mag',tan:'h_tan',nec:'h_nec'};
const ativo=()=>OPT.heroisNovos!==false&&typeof G!=='undefined'&&G&&HERO_IDS[G.char]&&G.screen==='combat'&&G.combat;
NH.ativo=ativo;
const LUZ={1:{dir:-1,col:[255,160,70],amb:[60,40,40]},2:{dir:1,col:[140,210,255],amb:[40,60,60]},3:{dir:-1,col:[255,90,50],amb:[90,40,120]}};
const CORTE=50; // da coluna 50 para a direita é a "área do alvo" do quadro
const GOLPE={
 cac:{disparo:'ataque',flecha:'ataque',envenenada:'ataque',tiroDuplo:'especial',rajada:'especial',tempFlechas:'chuva',chuva:'chuva',explosiva:'carregado',perfurante:'carregado',certeiro:'carregado',jugular:'carregado',flechaLua:'carregado',flechaFloresta:'carregado',
   falcao:'corvo',falcaoYsolda:'corvo',tiroMarcado:'buff',presa:'buff',rastrear:'buff',olhoAguia:'buff',instinto:'buff',implacavel:'buff',armadilha:'armadilha',emboscada:'rolar',danca:'rolar',esquivar:'defesa',passoAtras:'defesa',acrobacia:'defesa',reflexos:'defesa',leves:'defesa',sombras:'defesa',encher:'mania3'},
 mag:{faisca:'ataque',seta:'ataque',misseis:'ataque',eco:'ataque',labareda:'fogo',ignicao:'fogo',combustao:'fogo',inferno:'fogo',raioGelo:'gelo',estilhaco:'gelo',nevasca:'gelo',congelamento:'gelo',eraGelo:'gelo',nevascaEterna:'gelo',estase:'gelo',
   relampago:'raio',cadeiaRaios:'raio',meteoro:'meteoro',meteoroMorvane:'meteoro',barreira:'defesa',escudoGelo:'defesa',runas:'defesa',espelho:'espelho',meditar:'buff',foco:'buff',canalizar:'buff',sabedoria:'buff',transmutar:'buff'},
 tan:{pancada:'ataque',martelada:'ataque',rebite:'ataque',pesoMorto:'ataque',baterEscudo:'especial',ombro:'especial',claraoSol:'especial',avanco:'investida',juggernaut:'investida',tremor:'terremoto',sismo:'terremoto',avalanche:'terremoto',
   muralha:'defesa',placas:'defesa',ferro:'defesa',reforcar:'defesa',bastilha:'defesa',muralhaViva:'defesa',muralhaEterna:'defesa',segundaPele:'defesa',armViva:'defesa',desafiar:'provocar',retaliar:'contra',colosso:'buff',colossoBram:'buff'},
 nec:{toque:'ataque',toqueMorte:'ataque',ossosAfiados:'ataque',lancaOssos:'ataque',raioNecro:'drenar',colheita:'ceifar',colheitaAlmas:'ceifar',ceifador:'ceifar',ceifadorElowen:'ceifar',erguerMorto:'erguer',comandar:'erguer',exercito:'exercito',marcha:'exercito',
   drenar:'drenar',sifao:'drenar',mordidaVampiro:'drenar',cadaver:'explosao',praga:'maldicao',maldicaoN:'maldicao',lichI:'maldicao',pactoSombrio:'maldicao',ritualSangue:'maldicao',veu:'defesa',barreiraOssos:'defesa',mortalha:'defesa',ossada:'defesa'}};
/* golpes cujo efeito já cai no alvo (não precisa do tiro do jogo voando) */
const NO_ALVO={chuva:1,carregado:1,corvo:1,fogo:1,gelo:1,raio:1,meteoro:1,explosao:1,maldicao:1,drenar:1};
const TIRO={cac:'arrow',mag:'bolt',nec:'dark'};
const S={anim:'parado',f:0,t:0,hold:0,cv:null,fx:null,alvo:null,servo:null,ergue:null,cache:new Map(),ultimo:'',mania:0};NH.S=S;
const hid=()=>HERO_IDS[G.char];
const arma=()=>{try{return typeof wIdx==='function'?wIdx():0}catch(_){return 0}};
const MED={};function medir(id){const k=id+'|'+arma();if(MED[k])return MED[k];const q=BICHO.quadro(id,{...BICHO.seq(id,'parado')[0],arma:arma()},null),w=q.width,h=q.height,d=q.getContext('2d').getImageData(0,0,CORTE,h).data;
  let x0=w,x1=0,y0=h,y1=0;for(let y=0;y<h;y++)for(let x=0;x<CORTE;x++)if(d[(y*CORTE+x)*4+3]>0){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
  return MED[k]={w,h,cx:(x0+x1+1)/2,bh:y1-y0+1,y1}}
function quadro(){const id=hid(),act=G.act||1,a=arma(),key=S.anim+'|'+S.f+'|'+a+'|'+act;let q=S.cache.get(key);
  if(!q){const ps={...BICHO.seq(id,S.anim)[S.f],arma:a};q=BICHO.quadro(id,ps,LUZ[act]||LUZ[1]);q.pose=ps;if(S.cache.size>1500)S.cache.clear();S.cache.set(key,q)}return{q,key}}
function toca(nome,hold){const A=BICHOS[hid()].A[nome];if(!A)return false;S.anim=nome;S.f=0;S.t=0;S.hold=hold?1:0;return true}
/* ---------- montagem ---------- */
function desmontar(){document.querySelectorAll('canvas.nh').forEach(c=>{const s=c.parentNode&&c.parentNode.querySelector('.spr');if(s)s.style.visibility='';c.remove()});if(S.fx)S.fx.style.display='none';
  document.querySelectorAll('.servo canvas.nhs').forEach(c=>{c.parentNode.style.backgroundImage=c.parentNode.dataset.bg||'';c.remove()})}
function montar(){if(!ativo()){desmontar();return}
  const fig=document.querySelector('[data-uid="p"] .fig');if(!fig)return;const id=hid(),m=medir(id);
  const spr=fig.querySelector('.spr');if(spr)spr.style.visibility='hidden';
  let cv=fig.querySelector('canvas.nh');if(!cv){cv=document.createElement('canvas');cv.className='nh';cv.width=m.w;cv.height=m.h;fig.appendChild(cv);S.ultimo=''}
  const fw=fig.clientWidth||100,fh=fig.clientHeight||fw,k=fw*1.34/m.bh;S.k=k;
  Object.assign(cv.style,{position:'absolute',left:(fw/2-m.cx*k)+'px',top:(fh-(m.y1+1)*k+2*k)+'px',width:m.w*k+'px',height:m.h*k+'px',imageRendering:'pixelated',pointerEvents:'none',zIndex:2});
  if(S.cv!==cv){S.cv=cv;S.ultimo=''}
  if(!S.fx||!S.fx.isConnected){S.fx=document.createElement('canvas');S.fx.className='nhfx';S.fx.width=72-CORTE;S.fx.height=64;Object.assign(S.fx.style,{position:'fixed',pointerEvents:'none',zIndex:300,imageRendering:'pixelated',display:'none'});document.body.appendChild(S.fx)}
  montarServos();desenha();ligar()}
NH.montar=montar;
/* servos: a criatura derrotada, verde, de frente para o lado do herói */
function verde(id,pose){const q=BICHO.quadro(id,pose,LUZ[G.act]||LUZ[1]),c=document.createElement('canvas');c.width=q.width;c.height=q.height;const x=c.getContext('2d');x.translate(q.width,0);x.scale(-1,1);x.drawImage(q,0,0);x.setTransform(1,0,0,1,0,0);
  x.globalCompositeOperation='source-atop';x.fillStyle='rgba(60,220,120,.38)';x.fillRect(0,0,c.width,c.height);return c}
const VCACHE=new Map();function verdeC(id,an,f){const k=id+'|'+an+'|'+f+'|'+(G.act||1);let c=VCACHE.get(k);if(!c){c=verde(id,BICHO.seq(id,an)[f]);if(VCACHE.size>800)VCACHE.clear();VCACHE.set(k,c)}return c}
function montarServos(){if(G.char!=='nec')return;const sk=(P().sk||[]);document.querySelectorAll('[data-uid="p"] .servo').forEach((el,i)=>{const id=sk[i]&&BICHOS[sk[i]]?sk[i]:'esqueleto';
  if(!el.dataset.bg)el.dataset.bg=el.style.backgroundImage;el.style.backgroundImage='none';let c=el.querySelector('canvas.nhs');if(!c){c=document.createElement('canvas');c.className='nhs';Object.assign(c.style,{position:'absolute',left:'-40%',bottom:'0',width:'180%',imageRendering:'pixelated',pointerEvents:'none'});el.style.position='relative';el.appendChild(c)}c.dataset.id=id;
  const escondido=S.ergue&&i===sk.length-1;c.style.visibility=escondido?'hidden':''})}
function desenhaServos(t){if(G.char!=='nec')return;document.querySelectorAll('canvas.nhs').forEach((c,i)=>{const id=c.dataset.id;if(!BICHOS[id])return;const n=BICHO.seq(id,'parado').length,f=Math.floor(t/100+i*3)%n,img=verdeC(id,'parado',f);
  if(c.width!==img.width){c.width=img.width;c.height=img.height}const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.drawImage(img,0,0)})}
/* desenho do herói (+ a criatura sendo erguida) e da área do alvo em cima do inimigo */
function desenha(){if(!S.cv||!S.cv.isConnected)return;const{q,key}=quadro(),pose=q.pose,erg=S.ergue&&(pose.ergue||0)>0?pose.ergue:0;const k2=key+'|'+(S.alvo||'')+'|'+(erg?S.ergue+erg:'');
  if(k2===S.ultimo)return;S.ultimo=k2;const x=S.cv.getContext('2d');x.clearRect(0,0,S.cv.width,S.cv.height);x.imageSmoothingEnabled=false;
  if(erg){const id=S.ergue,m=BICHO.seq(id,'morte'),img=erg<1?verdeC(id,'morte',Math.max(0,Math.round((1-erg)*(m.length-1)))):verdeC(id,'parado',(S.f)%BICHO.seq(id,'parado').length),B=BICHOS[id],s=(B.W||64)>64?.55:.8,gy=B.GY||44;
    x.drawImage(img,(BICHOS[hid()].servoX||48)-img.width*s/2,58-gy*s,img.width*s,img.height*s)}
  if(S.alvo)x.drawImage(q,0,0,CORTE,q.height,0,0,CORTE,q.height);else x.drawImage(q,0,0);
  if(q.flash>.5)clarao(q.flash*.5);
  const fx=S.fx;if(!fx)return;const T=S.alvo&&document.querySelector(`[data-uid="${S.alvo}"] .fig`);
  if(!T){fx.style.display='none';return}const r=T.getBoundingClientRect(),k=S.k,A=HB.ALVO,GYh=HB.GY;
  Object.assign(fx.style,{display:'block',left:(r.left+r.width/2-(A[0]-CORTE)*k)+'px',top:(r.bottom-GYh*k)+'px',width:(72-CORTE)*k+'px',height:64*k+'px'});
  const fxx=fx.getContext('2d');fxx.clearRect(0,0,fx.width,fx.height);fxx.drawImage(q,CORTE,0,72-CORTE,q.height,0,0,72-CORTE,q.height)}
function clarao(a){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;background:#fff4e0;pointer-events:none;z-index:302';document.body.appendChild(d);d.animate([{opacity:a},{opacity:0}],{duration:220}).onfinish=()=>d.remove()}
/* ---------- relógio (só na luta) ---------- */
let rodando=false,last=0;
function ligar(){if(rodando)return;rodando=true;last=performance.now();requestAnimationFrame(tick)}
function tick(t){if(!ativo()||!S.cv||!S.cv.isConnected){rodando=false;if(S.fx)S.fx.style.display='none';return}requestAnimationFrame(tick);const dt=Math.min(100,t-last);last=t;if(document.hidden)return;
  const B=BICHOS[hid()],A=B.A[S.anim],n=BICHO.seq(hid(),S.anim).length,step=1000/A.fps;S.t+=dt;
  if(S.anim==='parado'&&!UI.lock){S.mania-=dt;if(S.mania<=0){S.mania=8000+Math.random()*6000;toca('mania'+(1+Math.floor(Math.random()*3)))}}
  while(S.t>=step){S.t-=step;S.f++;if(S.f>=n){if(A.loop)S.f=0;else if(S.hold){S.f=n-1;break}else{const er=S.ergue;S.alvo=null;S.ergue=null;toca('parado');if(er)montarServos();break}}}
  desenha();desenhaServos(t)}
/* ---------- ligação com o jogo ---------- */
function idDaCarta(d){return Object.keys(CARDS).find(k=>CARDS[k]===d)||''}
function hitMs(nome){const A=BICHOS[hid()].A[nome];return A&&A.hits?Math.round(A.hits[0]*1000/A.fps):300}
const _paf=playerAttackFx;
playerAttackFx=function(d,v,t){if(!ativo())return _paf(d,v,t);montar();
  const id=idDaCarta(d),B=BICHOS[hid()];let nome=GOLPE[G.char][id];
  if(!nome||!B.A[nome]){const txt=d.x?d.x(v):'';nome=d.t==='atk'?'ataque':/Bloqueio|Esquiva|Armadura/.test(txt)?'defesa':d.t==='pwr'?(B.A.buff?'buff':'maldicao'):(B.A.buff?'buff':'ataque')}
  const style=CHARS[G.char].atk;sfx('carta-jogar',{vol:.7});
  const alvo=t||(d.t==='atk'?alive()[0]:null),hit=hitMs(nome);
  S.alvo=alvo&&(d.t==='atk'||NO_ALVO[nome])?alvo.uid:null;S.ergue=null;
  if(nome==='erguer'){const sk=P().sk||[],G2=G.kills||[];S.ergue=sk.length?sk[sk.length-1]:(G2[G2.length-1]||'esqueleto');setTimeout(()=>{if(S.anim==='erguer'){const novo=(P().sk||[]).slice(-1)[0];if(novo&&BICHOS[novo])S.ergue=novo;montarServos()}},30)}
  toca(nome);
  if(d.t==='atk'){sfx(style==='arrow'?'flecha':style==='melee'?'golpe-pesado':'magia',{delay:Math.max(60,hit-60),gap:40});const tg=d.tg==='e'?[t]:alive();
    if(style==='melee'){tg.forEach(x=>slash(x.uid,hit));FXB=hit}
    else if(NO_ALVO[nome]){FXB=hit+80;if(d.tg!=='e')tg.forEach((x,j)=>proj('p',x.uid,d.fxk||TIRO[G.char],hit+j*40))}
    else{tg.forEach((x,j)=>proj('p',x.uid,d.fxk||TIRO[G.char],hit+j*40));FXB=hit+270}}
  else if(t){if(!NO_ALVO[nome])proj('p',t.uid,d.fxk||'hex',hit);FXB=hit+(NO_ALVO[nome]?80:260)}
  else{FXB=Math.min(hit,400)}};
const REACAO={'mv-hit':'ferido','mv-block':'defesa','mv-dodge':{cac:'defesa',mag:'teleporte',tan:'defesa',nec:'nevoa'},'mv-enter':'entrada','mv-summon':'entrada','mv-buff':'buff','mv-heal':'buff'};
const _hp=heroPose;
heroPose=function(fig,cls){if(!ativo()||!fig||!fig.closest('[data-uid="p"]'))return _hp(fig,cls);montar();fig.classList.remove(...MVS);
  if(cls==='dead'){S.alvo=null;toca('morte',1);return}
  if(cls==='mv-victory'){S.alvo=null;if(G.char==='nec'){const K=G.kills||[];S.ergue=K[K.length-1]||null}toca('vitoria',1);return}
  if(cls==='mv-lunge'||cls==='mv-shoot'||cls==='mv-cast')return; // o golpe já foi escolhido pela carta
  let nome=REACAO[cls];if(nome&&typeof nome==='object')nome=nome[G.char];if(!nome)return;
  if(cls==='mv-hit'){if(S.anim!=='parado'&&!S.anim.startsWith('mania')&&S.anim!=='ferido')return;const ult=G.combat&&G.combat.ultDano;nome=ult>=12&&BICHOS[hid()].A.ferido2?'ferido2':'ferido'}
  if((cls==='mv-buff'||cls==='mv-heal')&&S.anim!=='parado'&&!S.anim.startsWith('mania'))return;
  if(!BICHOS[hid()].A[nome])nome=cls==='mv-buff'||cls==='mv-heal'?'maldicao':nome;toca(nome)};
/* a tela de vitória espera o herói terminar de comemorar (o Necromante erguendo o vencido) */
const _wc=winCombat;winCombat=function(){const a=arguments,self=this;if(ativo()&&S.anim==='vitoria'){const A=BICHOS[hid()].A.vitoria,n=BICHO.seq(hid(),'vitoria').length,falta=Math.round((n-1-S.f)*1000/A.fps)+500;
  if(falta>200){UI.lock=true;setTimeout(()=>{UI.lock=false;_wc.apply(self,a)},falta);return}}return _wc.apply(self,a)};
const _render=render;render=function(){const r=_render.apply(this,arguments);try{if(ativo())montar();else desmontar()}catch(e){console.error(e)}return r};
const _patch=typeof patchCombat==='function'?patchCombat:null;if(_patch)patchCombat=function(){const r=_patch.apply(this,arguments);try{if(ativo())montar()}catch(e){console.error(e)}return r};
const _sc=startCombat;startCombat=function(){S.anim='parado';S.f=0;S.hold=0;S.alvo=null;S.ergue=null;S.mania=6000;return _sc.apply(this,arguments)};
addEventListener('resize',()=>{if(ativo())setTimeout(montar,80)});
if(OPT.heroisNovos===undefined)OPT.heroisNovos=true;
const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
  if(pan&&!pan.querySelector('[data-k="heroisNovos"]')){const d=document.createElement('div');d.className='optrow';const b=(v,t)=>`<button class="optb ${String(OPT.heroisNovos)===v?'on':''}" data-act="optset" data-k="heroisNovos" data-v="${v}">${t}</button>`;
    d.innerHTML=`<b>Heróis novos</b><span>Caçadora, Mago, Guardião e Necromante com movimentos de verdade nas lutas. Desligue para voltar aos desenhos antigos.</span><div>${b('true','Ligado')}${b('false','Desligado')}</div>`;pan.insertBefore(d,pan.children[4]||null)}return r};
})();
