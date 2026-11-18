/* ===== Cenários vivos (v2.37) =====
   Os cenários das lutas são uma imagem pronta (320x180). Aqui uma "passada a seco" do desenho (VIS.sceneLive)
   descobre onde estão o fogo, as luzes, os cristais, os olhos e os vaga-lumes; e duas telas por cima da imagem
   (uma de pixels, uma de brilho) fazem tudo mexer: chamas tremendo, faíscas subindo, luz pulsando,
   vaga-lumes voando, e o clima de cada lugar (gotas, névoa, poeira, brasas, chuva, bolhas, aranha, morcegos, fumaça).
   Fica atrás dos personagens e da moldura. Respeita a Bateria (Máxima = parado) e "reduzir movimento".
   Desliga em Opções → "Cenários vivos". */
(function(){
const W=320,H=180,GW=160,GH=90;
const AMB={mina:['poeira','gotas','morcegos'],catacumbas:['gotas','nevoa'],salao:['roxo','brasasRoxas','corvos'],santuario:['brilhos','poeira'],
 goblins:['fumaca','brasas'],esgoto:['gotas','nevoaVerde','agua'],aranhas:['aranha','poeira'],carrasco:['poeira','brasas'],cripta:['nevoaVerde','roxo'],
 pantano:['nevoa','bolhas','agua'],forja:['brasas','fumaca','calor'],dragao:['brasas','fumaca','calor'],orc:['brasas','poeira'],labirinto:['poeira','nevoa'],
 olho:['roxo','brilhos'],capela:['poeira','luzAlta'],telhado:['chuva','corvos'],ruinas:['nevoa','gotas'],forjaHef:['brasas','fumaca'],taverna:['poeira','fumaca'],entrada:['nevoa','poeira']};
const ligado=()=>OPT.cenariosVivos!==false&&typeof G!=='undefined'&&G&&G.screen==='combat'&&G.combat;
const passo=()=>({normal:50,economia:90,maxima:0})[OPT.bateria]??90;
let reduz=false;try{reduz=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
const S={nome:'',px:null,gl:null,pts:[],sp:[],ff:[],amb:[],gotas:[],ond:[],bol:[],t0:0,last:0,aranha:null,voo:null};
const R=Math.random;
function quente(c){return /255,1[0-9]{2},[0-9]{1,2}|ff[89ab]|e0601c|ffa040|ffb35a/i.test(c)||/rgba\(255,(1[0-5]\d|[6-9]\d),/.test(c)}
/* ---------- montar ---------- */
function montar(){const f=document.getElementById('field');if(!ligado()||!f||!f.classList.contains('scened')){tirar();return}
  const nome=sceneFor(G.combat);if(!nome){tirar();return}const L=VIS.sceneLive&&VIS.sceneLive(nome);if(!L){tirar();return}
  let px=f.querySelector('canvas.cv-px'),gl=f.querySelector('canvas.cv-gl');
  if(!px){gl=document.createElement('canvas');gl.className='cv-gl';gl.width=GW;gl.height=GH;px=document.createElement('canvas');px.className='cv-px';px.width=W;px.height=H;
    for(const c of [px,gl])Object.assign(c.style,{position:'absolute',pointerEvents:'none',zIndex:0});px.style.imageRendering='pixelated';gl.style.mixBlendMode='screen';f.insertBefore(px,f.firstChild);f.insertBefore(gl,f.firstChild)}
  if(S.nome!==nome||S.px!==px){S.nome=nome;S.px=px;S.gl=gl;preparar(L,nome)}
  posicionar(f);ligar()}
function posicionar(f){if(!S.px)return;const fw=f.clientWidth,fh=f.clientHeight,s=Math.max(fw/W,fh/H),by=parseFloat(f.style.getPropertyValue('--by'))||0,bw=W*s;
  for(const c of [S.px,S.gl])Object.assign(c.style,{left:((fw-bw)/2)+'px',top:by+'px',width:bw+'px',height:H*s+'px'})}
function tirar(){document.querySelectorAll('canvas.cv-px,canvas.cv-gl').forEach(c=>c.remove());S.px=S.gl=null;S.nome=''}
function preparar(L,nome){S.pts=L.pts.map(p=>({...p,ph:R()*7,q:p.k==='l'?quente(p.c):0}));S.fl=L.fl;S.sp=[];S.ff=[];S.gotas=[];S.ond=[];S.bol=[];S.aranha=null;S.voo=null;S.amb=AMB[nome]||['poeira'];
  for(const p of S.pts)if(p.k==='ff')for(let i=0;i<Math.max(3,Math.round(p.n*.45));i++)S.ff.push({x:R()*W,y:p.y0+R()*(p.y1-p.y0),vx:0,vy:0,c:p.c,ph:R()*7,y0:p.y0,y1:p.y1});
  S.poe=Array.from({length:22},()=>({x:R()*W,y:R()*S.fl,ph:R()*7,v:.05+R()*.1}));
  S.nev=Array.from({length:5},(_,i)=>({x:R()*GW,y:GH*(.7+R()*.22),r:18+R()*22,v:(R()<.5?-1:1)*(.03+R()*.04)}))}
/* ---------- relógio ---------- */
let rodando=false;
function ligar(){if(rodando)return;rodando=true;S.last=performance.now();requestAnimationFrame(tick)}
function tick(t){if(!S.px||!S.px.isConnected||!ligado()){rodando=false;tirar();return}requestAnimationFrame(tick);const st=passo();
  if(document.hidden||(typeof CUT!=='undefined'&&CUT.on))return;if(!st||reduz){if(!S.parado){S.parado=1;desenha(t,0)}return}S.parado=0;
  if(t-S.last<st)return;const k=Math.min(3,(t-S.last)/50);S.last=t;desenha(t,k)}
/* ---------- desenho ---------- */
function P(x,c,X,Y,w=1,h=1){x.fillStyle=c;x.fillRect(Math.round(X),Math.round(Y),w,h)}
const GC={};function bola(x,X,Y,r,c,a){if(a<=0||r<=0)return;let g=GC[c];if(!g){g=document.createElement('canvas');g.width=g.height=64;const q=g.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,64,64);GC[c]=g}
  x.globalAlpha=Math.min(1,a);x.drawImage(g,X-r,Y-r,r*2,r*2);x.globalAlpha=1}
function flick(t,ph){return Math.sin(t*.011+ph)*.5+Math.sin(t*.027+ph*2.3)*.3+Math.sin(t*.061+ph*.7)*.2}
const COR=c=>{const m=/rgba?\(([^)]*)\)/.exec(c);if(m){const v=m[1].split(',').map(Number);return`rgb(${v[0]},${v[1]},${v[2]})`}return c};
function desenha(t,k){const x=S.px.getContext('2d'),g=S.gl.getContext('2d'),FL=S.fl,sx=GW/W;x.clearRect(0,0,W,H);g.clearRect(0,0,GW,GH);g.globalCompositeOperation='lighter';
  for(const p of S.pts){const f=flick(t,p.ph);
    if(p.k==='l'){const a=p.q?(.16+f*.1)*Math.min(1.2,p.i):(.08+Math.sin(t*.0016+p.ph)*.06)*Math.min(1.2,p.i);bola(g,p.x*sx,p.y*sx,p.r*.5*sx*(1+f*.06),COR(p.c),a)}
    else if(p.k==='f'){const cols=p.big?[-3,-2,-1,0,1,2,3]:[-1,0,1],top=p.big?15:7;
      for(const d of cols){const hh=Math.max(1,Math.round((top-Math.abs(d)*(p.big?3:2.4))*p.s*(.55+.45*(Math.sin(t*.023+d*1.9+p.ph)*.5+.5))));
        P(x,'#ff7a26',p.x+d,p.y-hh-1,1,Math.max(1,hh*.35));if(Math.abs(d)<=1)P(x,'#ffe7a0',p.x+d,p.y-Math.round(hh*.55),1,1)}
      if(k&&R()<(p.big?.9:.35)*k)S.sp.push({x:p.x+(R()*6-3)*p.s,y:p.y-(p.big?12:6)*p.s,vx:R()*.3-.15,vy:-(.25+R()*.45),l:1,c:R()<.3?'#fff1b8':'#ffa040'});
      if(p.big&&S.amb.includes('fumaca')&&k&&R()<.07*k)S.sp.push({x:p.x+R()*6-3,y:p.y-18*p.s,vx:R()*.1,vy:-.18,l:1,fum:1,r:2})}
    else if(p.k==='cr'){bola(g,p.x*sx,(p.y+p.h*.5)*sx,p.h*.9*sx,COR(p.c),.12+Math.sin(t*.002+p.ph)*.08);if(Math.sin(t*.0031+p.ph*3)>.96)P(x,'#ffffff',p.x+Math.round(Math.sin(p.ph)*2),p.y+1)}
    else if(p.k==='e'){const pis=Math.sin(t*.0009+p.ph*5)>.985;if(pis){P(x,'#06040a',p.x,p.y);P(x,'#06040a',p.x+3,p.y)}else bola(g,(p.x+1.5)*sx,p.y*sx,3*sx,COR(p.c),.25+f*.12)}}
  // vaga-lumes
  for(const v of S.ff){v.ph+=.05*k;v.vx+=(R()-.5)*.05*k;v.vy+=(R()-.5)*.05*k;v.vx*=.96;v.vy*=.96;v.x+=v.vx*k;v.y+=v.vy*k;if(v.x<0)v.x=W;if(v.x>W)v.x=0;if(v.y<v.y0||v.y>v.y1)v.vy*=-1;
    const a=.5+.5*Math.sin(v.ph);if(a>.15){P(x,v.c,v.x,v.y);bola(g,v.x*sx,v.y*sx,3.5,COR(v.c),a*.5)}}
  // faíscas e fumaça
  for(let i=S.sp.length-1;i>=0;i--){const e=S.sp[i];e.x+=(e.vx+Math.sin((t+i*70)*.004)*.12)*k;e.y+=e.vy*k;e.l-=(e.fum?.006:.02)*k;if(e.l<=0||e.y<0){S.sp.splice(i,1);continue}
    if(e.fum){e.r+=.06*k;bola(g,e.x*sx,e.y*sx,e.r*sx*2.2,'rgb(70,60,60)',e.l*.25)}else if(R()<e.l+.2)P(x,e.c,e.x,e.y)}
  if(S.sp.length>260)S.sp.splice(0,S.sp.length-260);
  for(const a of S.amb)(AMBF[a]||(()=>0))(x,g,t,k,FL,sx);
  g.globalCompositeOperation='source-over'}
/* ---------- clima de cada lugar ---------- */
const AMBF={
 poeira(x,g,t,k){for(const p of S.poe){p.ph+=.01*k;p.x+=(Math.sin(p.ph)*.08+p.v*.3)*k;p.y+=Math.cos(p.ph*.7)*.05*k;if(p.x>W)p.x=0;const a=.35+.35*Math.sin(p.ph*2);if(a>.3)P(x,`rgba(255,236,200,${a*.55})`,p.x,p.y)}},
 brilhos(x,g,t,k){for(const p of S.poe){p.ph+=.03*k;p.y-=p.v*.6*k;if(p.y<0){p.y=S.fl;p.x=R()*W}const a=Math.sin(p.ph);if(a>.6){P(x,'#e8f4ff',p.x,p.y);bola(g,p.x/2,p.y/2,2.5,'rgb(150,200,255)',.4)}}},
 gotas(x,g,t,k,FL){if(k&&R()<.05*k)S.gotas.push({x:20+R()*(W-40),y:0,v:0});for(let i=S.gotas.length-1;i>=0;i--){const d=S.gotas[i];d.v+=.12*k;d.y+=d.v*k;if(d.y>=FL+2){S.ond.push({x:d.x,y:FL+2+R()*8,r:0});S.gotas.splice(i,1);continue}P(x,'rgba(170,200,230,.8)',d.x,d.y,1,2)}
  for(let i=S.ond.length-1;i>=0;i--){const o=S.ond[i];o.r+=.25*k;if(o.r>6){S.ond.splice(i,1);continue}const a=1-o.r/6;x.fillStyle=`rgba(170,200,230,${a*.7})`;x.fillRect(Math.round(o.x-o.r),Math.round(o.y),1,1);x.fillRect(Math.round(o.x+o.r),Math.round(o.y),1,1);if(o.r<2)x.fillRect(Math.round(o.x),Math.round(o.y-1-o.r),1,1)}},
 agua(x,g,t,k,FL){for(let i=0;i<14;i++){const xx=((i*37+t*.01*(1+i%3))%W),yy=FL+6+(i*13)%30;if(Math.sin(t*.003+i)>.3)P(x,'rgba(160,200,220,.35)',xx,yy,3,1)}},
 nevoa(x,g,t,k){for(const n of S.nev){n.x+=n.v*k;if(n.x<-40)n.x=GW+40;if(n.x>GW+40)n.x=-40;bola(g,n.x,n.y,n.r,'rgb(120,130,160)',.16)}},
 nevoaVerde(x,g,t,k){for(const n of S.nev){n.x+=n.v*k;if(n.x<-40)n.x=GW+40;if(n.x>GW+40)n.x=-40;bola(g,n.x,n.y,n.r,'rgb(90,170,110)',.14)}},
 roxo(x,g,t,k){for(let i=0;i<6;i++){const a=t*.0004+i*1.1,xx=GW*(.15+.7*((i*.37+Math.sin(a)*.08+t*.00002*(i+1))%1)),yy=GH*(.35+.3*Math.sin(a*1.3+i));bola(g,xx,yy,10+4*Math.sin(a*2),'rgb(140,80,220)',.12)}},
 brasas(x,g,t,k,FL){if(k&&R()<.25*k)S.sp.push({x:R()*W,y:FL+R()*20,vx:R()*.2-.1,vy:-(.2+R()*.35),l:1,c:R()<.5?'#ff7a26':'#ffb35a'})},
 brasasRoxas(x,g,t,k,FL){if(k&&R()<.2*k)S.sp.push({x:R()*W,y:FL+R()*20,vx:R()*.2-.1,vy:-(.2+R()*.3),l:1,c:R()<.5?'#b07aff':'#e0c0ff'})},
 fumaca(){},
 calor(x,g,t,k,FL){bola(g,GW/2,FL/2,70,'rgb(255,90,30)',.05+.03*Math.sin(t*.002))},
 luzAlta(x,g,t){for(let i=0;i<3;i++){const xx=GW*(.3+i*.2),a=.07+.04*Math.sin(t*.0013+i*2);g.fillStyle=`rgba(255,230,180,${a})`;g.beginPath();g.moveTo(xx-4,0);g.lineTo(xx+4,0);g.lineTo(xx+16,GH*.8);g.lineTo(xx-4,GH*.8);g.fill()}},
 chuva(x,g,t,k){for(let i=0;i<70;i++){const xx=(i*53+t*.09)%(W+40)-20,yy=(i*29+t*.32)%H;P(x,'rgba(170,190,230,.45)',xx-yy*.15,yy,1,3)}if(Math.sin(t*.00037)>.997)bola(g,GW/2,GH*.3,120,'rgb(200,210,255)',.35)},
 bolhas(x,g,t,k,FL){if(k&&R()<.06*k)S.bol.push({x:R()*W,y:FL+4+R()*24,r:0});for(let i=S.bol.length-1;i>=0;i--){const b=S.bol[i];b.r+=.06*k;if(b.r>2.2){S.bol.splice(i,1);continue}x.fillStyle='rgba(150,190,120,.7)';x.fillRect(Math.round(b.x-b.r),Math.round(b.y-b.r),Math.max(1,Math.round(b.r*2)),1);x.fillRect(Math.round(b.x),Math.round(b.y-b.r*1.6),1,1)}},
 aranha(x,g,t,k){if(!S.aranha&&k&&R()<.004*k)S.aranha={x:30+R()*(W-60),y:0,f:0};const a=S.aranha;if(!a)return;a.f+=.01*k;const y=Math.sin(Math.min(1,a.f)*Math.PI)*60;
  for(let j=0;j<y;j+=2)P(x,'rgba(220,220,235,.4)',a.x,j);P(x,'#1a1420',a.x-1,y,3,2);P(x,'#1a1420',a.x-2,y+1);P(x,'#1a1420',a.x+2,y+1);P(x,'#ff4a3a',a.x,y);if(a.f>=1)S.aranha=null},
 morcegos(x,g,t,k){voo(x,k,'#0a0810',2)},corvos(x,g,t,k){voo(x,k,'#06050a',3)}};
function voo(x,k,c,n){if(!S.voo&&k&&R()<.003*k)S.voo=Array.from({length:n},(_,i)=>({x:-10-i*14,y:20+R()*40,ph:R()*6,v:1+R()*.5}));if(!S.voo)return;let vivo=0;
  for(const b of S.voo){b.x+=b.v*k;b.ph+=.5*k;b.y+=Math.sin(b.ph*.3)*.3*k;if(b.x<W+10)vivo=1;const asa=Math.sin(b.ph)>0?-1:1;P(x,c,b.x,b.y,2,1);P(x,c,b.x-2,b.y+asa);P(x,c,b.x+3,b.y+asa);P(x,c,b.x-3,b.y+asa*2);P(x,c,b.x+4,b.y+asa*2)}if(!vivo)S.voo=null}
/* ---------- ligação com o jogo ---------- */
const _ff=fitField;fitField=function(){const r=_ff.apply(this,arguments);try{montar()}catch(e){console.error(e)}return r};
const _render=render;render=function(){const r=_render.apply(this,arguments);try{if(!ligado())tirar();else montar()}catch(e){console.error(e)}return r};
const _patch=typeof patchCombat==='function'?patchCombat:null;if(_patch)patchCombat=function(){const r=_patch.apply(this,arguments);try{montar()}catch(e){console.error(e)}return r};
if(OPT.cenariosVivos===undefined)OPT.cenariosVivos=true;
const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
  if(pan&&!pan.querySelector('[data-k="cenariosVivos"]')){const d=document.createElement('div');d.className='optrow';const b=(v,t)=>`<button class="optb ${String(OPT.cenariosVivos)===v?'on':''}" data-act="optset" data-k="cenariosVivos" data-v="${v}">${t}</button>`;
    d.innerHTML=`<b>Cenários vivos</b><span>Fogo tremendo, faíscas, névoa, gotas, vaga-lumes e bichos nos cenários das lutas. Desligue para gastar menos bateria.</span><div>${b('true','Ligado')}${b('false','Desligado')}</div>`;pan.insertBefore(d,pan.children[6]||null)}return r};
window.CV=S;
})();
