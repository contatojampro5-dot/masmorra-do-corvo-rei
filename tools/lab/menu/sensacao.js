/* ===== Sensação de luta (v2.50) =====
   - Carta jogada: sobe, brilha na cor do tipo e voa em curva até o alvo; ao chegar vira faíscas. A energia pulsa.
   - Impacto: pausa curta no golpe (os bonecos congelam ~70 ms), alvo pisca em branco e é empurrado, faíscas na cor do golpe,
     número de dano maior conforme a força (dourado e pulsando nos golpes grandes).
   - Bloqueio: escudo aparece no herói; "Bloqueado" vira escudo se quebrando. Status com efeito próprio (veneno, gelo, queima...).
   - Comprar e descartar: cartas voando do monte de Compra até a mão e da mão até o Descarte.
   - Sons feitos na hora (WebAudio): vush, 3 forças de impacto, clang do escudo, vidro quebrando, embaralhar, energia,
     com variação de tom; a música abaixa um instante nos golpes grandes; vibração conforme a força.
   - Opções → Visual → "Efeitos de luta"; com Bateria "Fundo parado" os efeitos ficam mais simples. */
(function(){
const CSS=`
#sxl{position:fixed;inset:0;z-index:290;pointer-events:none;overflow:hidden}
#sxc{position:fixed;inset:0;width:100%;height:100%;z-index:291;pointer-events:none}
.sx-card{position:fixed!important;bottom:auto!important;right:auto!important;margin:0!important;pointer-events:none;z-index:292;will-change:transform,opacity}
.sx-back{position:fixed;width:42px;height:60px;border-radius:5px;background:linear-gradient(135deg,#3a2a18,#1a120a);border:1px solid #a88a4a;box-shadow:0 0 8px #000a;pointer-events:none;z-index:292}
.sx-back::after{content:"";position:absolute;inset:6px;border:1px solid #6a5430;border-radius:3px}
.energy.sx-pulse{animation:sxPulse .45s ease-out}@keyframes sxPulse{0%{transform:scale(1)}30%{transform:scale(1.22);box-shadow:0 0 22px #ffc35a}100%{transform:scale(1)}}
.fig.sx-hit{animation:sxHit .22s ease-out}@keyframes sxHit{0%{filter:brightness(3) saturate(0)}40%{filter:brightness(1.8) saturate(.4)}100%{filter:none}}
.float.sx-m{font-size:34px}.float.sx-g{font-size:44px;color:#ffd24a!important;text-shadow:0 2px 0 #000,0 0 14px #ff8a2a,0 0 4px #000;animation:floatUp 1.15s ease-out forwards,sxBig .5s ease-out}
@keyframes sxBig{0%{scale:2.2}35%{scale:.9}60%{scale:1.1}100%{scale:1}}`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const on=()=>OPT.efeitosLuta!==false&&typeof G!=='undefined'&&G&&G.screen==='combat'&&G.combat;
const leve=()=>OPT.bateria==='maxima';
/* ---------- partículas ---------- */
const PT=[];let cvx=null,ctx=null,rod=false;
function tela(){if(!cvx){cvx=document.createElement('canvas');cvx.id='sxc';document.body.appendChild(cvx);ctx=cvx.getContext('2d')}const d=Math.min(2,devicePixelRatio||1);if(cvx.width!==innerWidth*d){cvx.width=innerWidth*d;cvx.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0)}}
function solta(x,y,n,cores,{vel=4,vida=26,grav=.12,tam=3,forma='q'}={}){if(leve())n=Math.ceil(n/3);tela();for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=vel*(.3+Math.random()*.9);PT.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-vel*.25,l:vida*(.6+Math.random()*.6),l0:vida,c:cores[i%cores.length],g:grav,s:tam*(.6+Math.random()*.8),f:forma})}if(!rod){rod=true;requestAnimationFrame(passo)}}
function anel(x,y,cor,r0=10,r1=46,vida=16){tela();PT.push({anel:1,x,y,r0,r1,l:vida,l0:vida,c:cor});if(!rod){rod=true;requestAnimationFrame(passo)}}
function passo(){ctx.clearRect(0,0,innerWidth,innerHeight);for(let i=PT.length-1;i>=0;i--){const p=PT[i];p.l--;if(p.l<=0){PT.splice(i,1);continue}const a=Math.min(1,p.l/p.l0*1.4);ctx.globalAlpha=a;
    if(p.anel){const r=p.r0+(p.r1-p.r0)*(1-p.l/p.l0);ctx.strokeStyle=p.c;ctx.lineWidth=3*a;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.stroke();continue}
    p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.vx*=.96;ctx.fillStyle=p.c;
    if(p.f==='caco'){ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.l*.3);ctx.fillRect(-p.s,-p.s*.4,p.s*2,p.s*.8);ctx.restore()}else ctx.fillRect(Math.round(p.x-p.s/2),Math.round(p.y-p.s/2),Math.ceil(p.s),Math.ceil(p.s))}
  ctx.globalAlpha=1;if(PT.length)requestAnimationFrame(passo);else rod=false}
/* ---------- cores por tipo/elemento da carta ---------- */
let ultimo={cores:['#ffffff','#ffd27a'],t:0,el:''};
function estilo(id){const d=CARDS[id]||{},tx=((d.x&&(()=>{try{return d.x(vals({id,up:0}))}catch(e){return''}})())||'').toLowerCase(),cl=d.cl||'cav';
  if(/queima|fogo|chama|labareda|meteoro/.test(tx+d.n.toLowerCase()))return{el:'fogo',cores:['#ffd24a','#ff7a1a','#ff3a10']};
  if(/gelo|congel|neve/.test(tx+d.n.toLowerCase()))return{el:'gelo',cores:['#e8f8ff','#8ad8ff','#4aa8e8']};
  if(/veneno|toxina/.test(tx))return{el:'veneno',cores:['#c8ff6a','#6ac83a','#3a8a2a']};
  if(cl==='nec')return{el:'sombra',cores:['#d8a8ff','#9a5ae8','#5a2a9a']};
  if(cl==='cac'&&d.t==='atk')return{el:'flecha',cores:['#ffffff','#e8dcc0','#a8d870']};
  if(cl==='mag')return{el:'magia',cores:['#ffffff','#9ad8ff','#c89aff']};
  if(d.t==='atk')return{el:'aco',cores:['#ffffff','#ffe9a8','#ff8a5a']};
  if(/bloqueio|armadura|esquiva/.test(tx))return{el:'escudo',cores:['#e8f4ff','#8ac8ff','#5a8ad0']};
  if(/cure|cura/.test(tx))return{el:'cura',cores:['#e8ffe0','#8ae86a','#4ab83a']};
  return{el:'magia',cores:['#fff0c0','#ffc35a','#c89aff']}}
const TIPO_COR={atk:'#ff6a3a',skl:'#5aa8ff',pwr:'#b07aff'};
const centro=uid=>{const el=document.querySelector(`[data-uid="${uid}"] .fig`);if(!el)return null;const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height*.5,el]};
/* ---------- sons feitos na hora ---------- */
function ac(){try{if(typeof SFX!=='undefined'&&SFX.ctx)return SFX.ctx}catch(e){}return null}
const vol=()=>{try{return sfxVol()}catch(e){return .7}};
function ruido(c,dur){const b=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;return s}
function env(c,g,t0,a,dur,pico){g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(pico,t0+a);g.gain.exponentialRampToValueAtTime(.0001,t0+dur)}
const SOM={
 vush(){const c=ac();if(!c||!vol())return;const t=c.currentTime,s=ruido(c,.3),f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.Q.value=1.2;f.frequency.setValueAtTime(400,t);f.frequency.exponentialRampToValueAtTime(2600*(.85+Math.random()*.3),t+.22);s.connect(f);f.connect(g);g.connect(c.destination);env(c,g,t,.05,.28,.22*vol());s.start(t);s.stop(t+.3)},
 impacto(forca){const c=ac();if(!c||!vol())return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain(),tom=(forca>2?55:forca>1?75:100)*(.9+Math.random()*.2);o.type='sine';o.frequency.setValueAtTime(tom*2.2,t);o.frequency.exponentialRampToValueAtTime(tom,t+.12);o.connect(g);g.connect(c.destination);env(c,g,t,.005,.22+forca*.06,(.35+forca*.15)*vol());o.start(t);o.stop(t+.5);
   const s=ruido(c,.12),f=c.createBiquadFilter(),g2=c.createGain();f.type='highpass';f.frequency.value=1400;s.connect(f);f.connect(g2);g2.connect(c.destination);env(c,g2,t,.002,.09,(.18+forca*.06)*vol());s.start(t);s.stop(t+.12)},
 clang(){const c=ac();if(!c||!vol())return;const t=c.currentTime,base=520*(.9+Math.random()*.2);for(const[m,a]of[[1,.2],[2.76,.12],[5.4,.06]]){const o=c.createOscillator(),g=c.createGain();o.type='triangle';o.frequency.value=base*m;o.connect(g);g.connect(c.destination);env(c,g,t,.003,.45,a*vol());o.start(t);o.stop(t+.5)}},
 vidro(){const c=ac();if(!c||!vol())return;const t=c.currentTime;for(let i=0;i<5;i++){const s=ruido(c,.06),f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.frequency.value=3000+Math.random()*4000;f.Q.value=8;s.connect(f);f.connect(g);g.connect(c.destination);const ti=t+i*.025;env(c,g,ti,.002,.06,.25*vol());s.start(ti);s.stop(ti+.07)}},
 embaralha(n){const c=ac();if(!c||!vol())return;const t=c.currentTime;for(let i=0;i<Math.min(6,n);i++){const s=ruido(c,.04),f=c.createBiquadFilter(),g=c.createGain();f.type='bandpass';f.frequency.value=1800+Math.random()*800;s.connect(f);f.connect(g);g.connect(c.destination);const ti=t+i*.06;env(c,g,ti,.002,.04,.12*vol());s.start(ti);s.stop(ti+.05)}},
 energia(){const c=ac();if(!c||!vol())return;const t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(880,t+.12);o.connect(g);g.connect(c.destination);env(c,g,t,.01,.18,.1*vol());o.start(t);o.stop(t+.2)}};
function abaixaMusica(){try{const a=MUS.el[MUS.cur];if(!a)return;const v=a.volume;a.volume=v*.45;setTimeout(()=>{try{fadeTo(a,v,350)}catch(e){a.volume=v}},260)}catch(e){}}
/* ---------- carta voando ---------- */
function voa(el,de,para,cor){if(!el||!de)return;const c=el.cloneNode(true);c.classList.add('sx-card');c.classList.remove('sel');c.removeAttribute('data-tip');c.removeAttribute('data-cuid');
  Object.assign(c.style,{zIndex:'292',left:de.left+'px',top:de.top+'px',width:de.width+'px',height:de.height+'px',transform:'none','--x':'0','--y':'0','--r':'0deg'});document.body.appendChild(c);
  const dx=para[0]-(de.left+de.width/2),dy=para[1]-(de.top+de.height/2),meio=`translate(${dx*.45}px,${dy*.45-80}px) rotate(${dx>0?12:-12}deg) scale(.75)`;
  c.style.boxShadow=`0 0 24px ${cor},0 0 6px ${cor}`;
  const an=c.animate([{transform:'translateY(0) scale(1)',filter:'brightness(1)'},{transform:'translateY(-40px) scale(1.12)',filter:'brightness(1.4)',offset:.25},{transform:meio,offset:.6},{transform:`translate(${dx}px,${dy}px) rotate(${dx>0?24:-24}deg) scale(.25)`,opacity:.2}],{duration:leve()?160:300,easing:'cubic-bezier(.4,0,.6,1)'});
  an.onfinish=()=>c.remove()}
function voaVerso(de,para,atraso){const b=document.createElement('div');b.className='sx-back';b.style.left=(de[0]-21)+'px';b.style.top=(de[1]-30)+'px';b.style.opacity='0';document.body.appendChild(b);
  const an=b.animate([{transform:'translate(0,0) scale(.6) rotate(-10deg)',opacity:0},{opacity:1,offset:.15},{transform:`translate(${para[0]-de[0]}px,${para[1]-de[1]}px) scale(1) rotate(6deg)`,opacity:.9}],{duration:300,delay:atraso,easing:'cubic-bezier(.3,.7,.3,1)'});an.onfinish=()=>b.remove()}
const rc=sel=>{const e=document.querySelector(sel);if(!e)return null;const r=e.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};
/* ---------- ligações ---------- */
const _pc=playCard;playCard=function(uid,tUid){if(!on())return _pc.apply(this,arguments);const c=G.combat,k=c.hand.find(x=>x.uid===uid),el=document.querySelector(`#hand .card[data-cuid="${uid}"]`),de=el&&el.getBoundingClientRect(),e0=c.energy,mao=c.hand.length;
  const r=_pc.apply(this,arguments);
  try{if(k&&c.hand.length<mao){const d=CARDS[k.id],est=estilo(k.id);ultimo={...est,t:performance.now()};let alvo=null;
      if(d.tg==='e'&&tUid)alvo=centro(tUid);else if(d.t==='atk'){const fs=[...document.querySelectorAll('.unit.enemy .fig')];if(fs.length){const r1=fs[0].getBoundingClientRect(),r2=fs[fs.length-1].getBoundingClientRect();alvo=[(r1.left+r2.right)/2,r1.top+r1.height/2]}}
      if(!alvo)alvo=centro('p');
      if(alvo){voa(el,de,alvo,TIPO_COR[d.t]||'#ffd27a');SOM.vush();setTimeout(()=>{solta(alvo[0],alvo[1],18,est.cores,{vel:3.5,vida:22});if(d.t!=='atk')anel(alvo[0],alvo[1],est.cores[1],8,40)},leve()?150:280)}
      if(c.energy<e0){const en=document.querySelector('.energy');if(en){en.classList.remove('sx-pulse');void en.offsetWidth;en.classList.add('sx-pulse')}SOM.energia()}}}catch(e){console.error(e)}
  return r};
const _run=runFx;runFx=function(f){const r=_run.apply(this,arguments);if(f.k!=='t'||!on())return r;try{
    const P0=centro(f.uid);if(!P0)return r;const[x,y,fig]=P0,fl=[...document.querySelectorAll('#fxlayer .float')].pop();
    if(f.cls==='dmg'){const n=parseInt(String(f.text).replace(/\D/g,''))||0,forca=n>=25?3:n>=12?2:1,cores=performance.now()-ultimo.t<1500&&f.uid!=='p'?ultimo.cores:['#ffffff','#ff8a6a','#c8301a'];
      if(fl)fl.classList.add(forca===3?'sx-g':forca===2?'sx-m':'sx-n');
      fig.classList.remove('sx-hit');void fig.offsetWidth;fig.classList.add('sx-hit');
      const dir=f.uid==='p'||f.uid==='ally'?-1:1;fig.animate([{translate:'0 0'},{translate:`${dir*(4+forca*4)}px 0`,offset:.25},{translate:'0 0'}],{duration:260,easing:'ease-out'});
      solta(x,y,8+forca*8,cores,{vel:2.5+forca*1.5,vida:20+forca*5});if(forca>=2)anel(x,y,cores[0],10,30+forca*14,14);
      window.HITSTOP=performance.now()+(leve()?0:forca===3?120:forca===2?85:55);SOM.impacto(forca);if(forca>=2)abaixaMusica();try{vib(forca===3?45:forca===2?25:12)}catch(e){}}
    else if(f.cls==='blk'){if(f.text==='Bloqueado'){solta(x,y,16,['#e8f4ff','#8ac8ff','#5a8ad0'],{vel:4,vida:24,forma:'caco',tam:4});anel(x,y,'#8ac8ff',14,50,14);SOM.vidro()}else{anel(x,y,'#8ac8ff',30,12,16);anel(x,y,'#e8f4ff',40,18,12);SOM.clang()}}
    else if(f.cls==='st'||f.cls==='bad'){const t=String(f.text).toLowerCase(),cor=/veneno/.test(t)?['#c8ff6a','#6ac83a']:/gelo|congel/.test(t)?['#e8f8ff','#8ad8ff']:/queima/.test(t)?['#ffd24a','#ff5a1a']:/força/.test(t)?['#ff8a6a','#ff3a2a']:/fraco|vuln/.test(t)?['#c8a8b8','#8a6a7a']:['#fff0c0','#ffc35a'];
      solta(x,y-10,10,cor,{vel:1.8,vida:30,grav:/gelo|veneno/.test(t)?.08:-.05})}
    else if(f.cls==='heal'){solta(x,y,14,['#e8ffe0','#8ae86a'],{vel:1.5,vida:34,grav:-.08})}
  }catch(e){console.error(e)}return r};
const _dr=draw;draw=function(n){const antes=on()&&G.combat.hand.length;const r=_dr.apply(this,arguments);try{if(on()){const novos=G.combat.hand.length-antes;if(novos>0)requestAnimationFrame(()=>{const de=rc('.pile[data-p="draw"]'),para=rc('#hand');if(de&&para){for(let i=0;i<novos;i++)voaVerso(de,[para[0]+(i-(novos-1)/2)*30,para[1]],i*70);SOM.embaralha(novos)}})}}catch(e){}return r};
const _et=endTurn;endTurn=async function(){let ems=[];try{if(on()&&!UI.lock)ems=[...document.querySelectorAll('#hand .card')].map(c=>{const r=c.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]})}catch(e){}
  const r=_et.apply(this,arguments);try{if(ems.length){const para=rc('.pile[data-p="discard"]');if(para){ems.forEach((de,i)=>voaVerso(de,para,i*50));SOM.embaralha(ems.length)}}}catch(e){}return r};
if(OPT.efeitosLuta===undefined)OPT.efeitosLuta=true;
const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
  if(pan&&!pan.querySelector('[data-k="efeitosLuta"]')){const d=document.createElement('div');d.className='optrow';const b=(v,t)=>`<button class="optb ${String(OPT.efeitosLuta)===v?'on':''}" data-act="optset" data-k="efeitosLuta" data-v="${v}">${t}</button>`;
    d.innerHTML=`<b>Efeitos de luta</b><span>Carta voando até o alvo, impacto com pausa, faíscas, escudo quebrando e sons de golpe. Desligue para gastar menos bateria.</span><div>${b('true','Ligado')}${b('false','Desligado')}</div>`;pan.appendChild(d)}return r};
})();
