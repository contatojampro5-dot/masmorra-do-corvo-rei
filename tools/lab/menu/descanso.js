/* ===== Fogueira (descanso) refeita (v2.46) =====
   Cena viva em tela cheia: caverna de pedra, estalactites, fogueira de pixel com brasas e fumaça, luz que treme
   e ilumina só perto do fogo, saco de dormir e mochila; o herói animado de verdade (Caçadora, Mago, Guardião,
   Necromante; o Cavaleiro usa o desenho dele). O texto e as escolhas ficam num painel embaixo (em pé) ou do lado (deitado). */
(function(){
const CSS=`
#rsc{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;image-rendering:pixelated}#rsg{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;mix-blend-mode:screen}
.page.rs{position:relative;z-index:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:stretch;padding:0;height:100%;width:100%}
.rs-p{position:relative;align-self:center;width:min(560px,100%);display:flex;flex-direction:column;gap:10px;align-items:stretch;padding:18px 18px max(16px,env(safe-area-inset-bottom,0px));margin-bottom:4px;
  background:linear-gradient(180deg,#0b080600,#0b0806e6 22%,#0b0806f4);border-radius:12px 12px 0 0;animation:fadeUp .5s ease-out both}
.rs-p h2{margin:0;text-align:center;font:400 clamp(30px,6vh,44px)/1 var(--f-disp);color:#f2d17e;text-shadow:0 3px 0 #2a1a08,0 0 18px #ff8a3a55}
.rs-p .lead{margin:0 0 4px;text-align:center;color:#c8b088;font-style:italic;font-size:17px}
.rs-p .choice{width:100%}.rs-p .btn{align-self:center}
@media (orientation:landscape){.page.rs{justify-content:center;align-items:flex-end;padding-right:max(3vw,env(safe-area-inset-right,0px))}
  .rs-p{align-self:auto;width:min(420px,46vw);border-radius:12px;padding:16px;background:linear-gradient(90deg,#0b0806c0,#0b0806ee);border:1px solid #3d3020}}`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const R={on:false,px:null,gl:null,W:0,H:0,L:null,sp:[],fm:[],hf:0,ht:0,anim:'parado',prox:6000,last:0};window.RST=R;
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const rnd=s=>{s=s>>>0;return()=>(s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296};
const GC={};function bola(x,X,Y,r,c,a){if(a<=0)return;let g=GC[c];if(!g){g=cv(64,64);const q=g.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,64,64);GC[c]=g}x.globalAlpha=Math.min(1,a);x.drawImage(g,X-r,Y-r,r*2,r*2);x.globalAlpha=1}
const HID={cac:'h_cac',mag:'h_mag',tan:'h_tan',nec:'h_nec'};
function tam(){const ret=innerWidth>=innerHeight,W=ret?320:132;return{W,H:Math.round(W*innerHeight/innerWidth),ret}}
function cena(){const{W,H,ret}=tam();R.W=W;R.H=H;R.px.width=W;R.px.height=H;R.gl.width=Math.ceil(W/2);R.gl.height=Math.ceil(H/2);const r=rnd(5),GY=ret?H-22:Math.round(H*.5),fx=Math.round(ret?W*.36:W*.66),hx=Math.round(ret?W*.2:W*.3);
  const c=cv(W,H),x=c.getContext('2d'),P=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h))};
  // parede do fundo de pedra
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0808');g.addColorStop(.6,'#1a1310');g.addColorStop(1,'#0c0907');x.fillStyle=g;x.fillRect(0,0,W,H);
  for(let y=0;y<GY;y+=9)for(let i=-(y/9%2)*9;i<W;i+=18){const j=.7+r()*.5;P(i+1,y+1,17,8,`rgb(${42*j|0},${33*j|0},${28*j|0})`);P(i+1,y+1,17,1,'rgba(255,220,180,.06)');P(i+1,y+8,17,1,'rgba(0,0,0,.35)')}
  // paredes de rocha nos lados e estalactites
  for(const lado of [0,1]){x.fillStyle='#0d0a08';x.beginPath();const e=lado?W:0,d=lado?-1:1;x.moveTo(e,0);let yy=0,xx=W*.16;while(yy<H){x.lineTo(e+d*xx,yy);yy+=6+r()*8;xx=W*(.08+r()*.12)}x.lineTo(e,H);x.fill()}
  for(let i=0;i<W;i+=7+r()*10){const h=6+r()*(ret?22:30);x.fillStyle='#0d0a08';x.beginPath();x.moveTo(i-4,0);x.lineTo(i+4,0);x.lineTo(i,h);x.fill();P(i,h-3,1,2,'#3a2e26')}
  // chão
  P(0,GY,W,H-GY,'#140f0c');for(let i=0;i<W;i+=3)P(i,GY,3,1+(r()*2|0),'#2a1f18');for(let i=0;i<90;i++)P(r()*W,GY+3+r()*(H-GY-3),2+r()*4,1,r()<.5?'#1e1712':'#0e0b09');
  // saco de dormir, mochila e tronco para sentar
  const bx=Math.max(2,hx-(ret?40:36));P(bx,GY-3,26,4,'#6a1e1a');P(bx,GY-3,26,1,'#8a2a22');P(bx,GY-5,7,6,'#d8c8a8');P(bx,GY-5,7,1,'#f0e0c0');
  P(fx+22,GY-9,9,10,'#5a3a1e');P(fx+22,GY-9,9,1,'#7a5228');P(fx+24,GY-12,5,3,'#4a2e16');P(fx+23,GY-5,7,1,'#3a2410');
  P(fx-34,GY-4,16,5,'#4a2e16');P(fx-34,GY-4,16,1,'#6a4424');P(fx-34,GY-3,2,3,'#7a5a3a');
  // círculo de pedras e lenha da fogueira
  for(let i=0;i<9;i++){const a=Math.PI+i*Math.PI/8,sx=fx+Math.cos(a)*10,sy=GY+1+Math.sin(a)*-1;P(sx-2,sy-2,4,3,i%2?'#5a5250':'#4a4442');P(sx-2,sy-2,4,1,'#7a706a')}
  for(const[a,b]of[[-7,6],[-6,7]]){x.strokeStyle='#5a3a1e';x.lineWidth=2;x.beginPath();x.moveTo(fx+a,GY);x.lineTo(fx+b,GY-4);x.stroke()}
  R.L={c,GY,fx,hx,ret}}
/* luz do ambiente sobre o personagem: o=[{lado:-1|1|0(cima), cor:[r,g,b], k}] + escuro (0..1) + tinta geral */
const LCACHE=new Map();
window.LUZAMB=function(src,o,chave){if(chave){const c=LCACHE.get(chave);if(c)return c}const W=src.width,H=src.height,s=src.getContext('2d').getImageData(0,0,W,H),d=s.data;
  const A=(i,j)=>i<0||j<0||i>=W||j>=H?0:d[(j*W+i)*4+3];let y0=H,y1=0;for(let j=0;j<H;j++)for(let i=0;i<W;i++)if(d[(j*W+i)*4+3]){if(j<y0)y0=j;if(j>y1)y1=j}
  const out=new ImageData(W,H),q=out.data,esc=o.escuro||0,ti=o.tinta;
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const p=(j*W+i)*4;if(!d[p+3])continue;let r=d[p],g=d[p+1],b=d[p+2];
    r*=1-esc;g*=1-esc;b*=1-esc;if(ti){r+=(ti[0]-r)*ti[3];g+=(ti[1]-g)*ti[3];b+=(ti[2]-b)*ti[3]}
    const alt=y1>y0?1-(j-y0)/(y1-y0):0;
    for(const L of o.luzes){let w=0;if(L.lado===0){w=(!A(i,j-1)?.9:!A(i,j-2)?.35:0)+alt*(L.alt||0)}else{w=!A(i+L.lado,j)?1:!A(i+L.lado*2,j)?.45:0;w*=.55+.45*alt}
      w=Math.min(1,w*L.k);if(w>0){r+=(L.cor[0]-r)*w*.75;g+=(L.cor[1]-g)*w*.75;b+=(L.cor[2]-b)*w*.75}}
    q[p]=r;q[p+1]=g;q[p+2]=b;q[p+3]=d[p+3]}
  const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').putImageData(out,0,0);if(chave){if(LCACHE.size>1500)LCACHE.clear();LCACHE.set(chave,c)}return c};
const LUZ=null;const QC=new Map();
function quadroH(id,an,f){const k=id+'|'+an+'|'+f;let q=QC.get(k);if(!q){try{const s=BICHO.seq(id,an);q=BICHO.quadro(id,{...s[f%s.length],arma:typeof wIdx==='function'?wIdx():0},LUZ)}catch(e){q=null}if(QC.size>300)QC.clear();QC.set(k,q)}return q}
let sprImg=null,sprKey='';
function tick(t){if(!R.on)return;requestAnimationFrame(tick);if(document.hidden)return;const passo=OPT.bateria==='maxima'?400:OPT.bateria==='economia'?70:45;if(t-R.last<passo)return;const k=Math.min(3,(t-R.last)/45);R.last=t;try{desenha(t,k)}catch(e){console.error(e);R.on=false}}
function desenha(t,k){if(!R.L||R.px.width!==tam().W||R.px.height!==tam().H)cena();const L=R.L,W=R.W,H=R.H,x=R.px.getContext('2d'),g=R.gl.getContext('2d'),{GY,fx,hx}=L;x.imageSmoothingEnabled=false;
  x.drawImage(L.c,0,0);g.clearRect(0,0,g.canvas.width,g.canvas.height);g.globalCompositeOperation='lighter';
  const fl=Math.sin(t*.011)*.5+Math.sin(t*.027)*.3+Math.sin(t*.061)*.2;
  // herói
  const id=HID[G.char];if(id&&typeof BICHOS!=='undefined'&&BICHOS[id]){const B=BICHOS[id],A=B.A[R.anim]||B.A.parado,n=BICHO.seq(id,R.anim).length;R.ht+=45*k;while(R.ht>=1000/A.fps){R.ht-=1000/A.fps;R.hf++;if(R.hf>=n){R.hf=0;if(R.anim!=='parado')R.anim='parado'}}
    R.prox-=45*k;if(R.prox<=0&&R.anim==='parado'){R.prox=7000+Math.random()*5000;const m=['mania1','mania2','mania3'].filter(a=>B.A[a]);if(m.length){R.anim=m[Math.floor(Math.random()*m.length)];R.hf=0}}
    const q0=quadroH(id,R.anim,R.hf),bk=Math.round((fl+1)*2),q=q0&&LUZAMB(q0,{escuro:.35,tinta:[60,30,20,.12],luzes:[{lado:1,cor:[255,170,80],k:.75+bk*.12},{lado:0,cor:[255,150,70],k:.35}]},'f|'+id+'|'+R.anim+'|'+R.hf+'|'+bk);if(q){const s=1;x.drawImage(q,Math.round(hx-21*s),Math.round(GY-58*s+1),Math.round(q.width*s),Math.round(q.height*s))}}
  else if(G.char==='cav'&&window.KN&&KN.vitrine){const ms=KN.MANIAS||[];let nm=R.anim==='parado'||R.anim==='buff'?'parado':R.anim;if(!R.kn){R.kn={a:'parado',f:0,t:0}}const K2=R.kn;K2.t+=45*k;if(K2.t>=1000/9){K2.t=0;K2.f++}
    let r0;try{r0=KN.vitrine(K2.a,K2.f,null)}catch(e){K2.a='parado';r0=KN.vitrine('parado',K2.f,null)}if(K2.a!=='parado'&&K2.f>=r0.n){K2.a='parado';K2.f=0}if(K2.a==='parado'&&Math.random()<.003*k&&ms.length){K2.a=ms[Math.floor(Math.random()*ms.length)];K2.f=0}
    const bk=Math.round((fl+1)*2),q=LUZAMB(r0.cv,{escuro:.35,tinta:[60,30,20,.12],luzes:[{lado:1,cor:[255,170,80],k:.75+bk*.12},{lado:0,cor:[255,150,70],k:.35}]},'fc|'+K2.a+'|'+(K2.f%r0.n)+'|'+bk);x.drawImage(q,Math.round(hx-20),Math.round(GY-61))}
  else{const key=CHARS[G.char].spr;if(sprKey!==key){sprKey=key;sprImg=new Image();sprImg.src=sprite(key,1)}if(sprImg&&sprImg.complete&&sprImg.naturalWidth){const h=L.ret?30:34,w=sprImg.naturalWidth*h/sprImg.naturalHeight;x.drawImage(sprImg,Math.round(hx-w/2),Math.round(GY-h+1),Math.round(w),h)}}
  // chamas
  for(let d=-5;d<=5;d++){const hh=Math.round((15-Math.abs(d)*2.4)*(.65+.35*(Math.sin(t*.021+d*1.7)*.5+.5))+Math.sin(t*.05+d)*1);if(hh<=0)continue;const sw=Math.round(Math.sin(t*.006+d*.4));
    x.fillStyle='#c8401a';x.fillRect(fx+d+sw,GY-2-hh,1,hh);if(Math.abs(d)<4){x.fillStyle='#f5902a';x.fillRect(fx+d+sw,GY-2-Math.round(hh*.75),1,Math.round(hh*.75))}if(Math.abs(d)<2){x.fillStyle='#ffe07a';x.fillRect(fx+d+sw,GY-2-Math.round(hh*.42),1,Math.round(hh*.42))}}
  // brasas e fumaça
  if(Math.random()<.5*k)R.sp.push({x:fx+(Math.random()-.5)*8,y:GY-10,vx:(Math.random()-.5)*.3,vy:-(.3+Math.random()*.4),l:1});
  if(Math.random()<.12*k)R.fm.push({x:fx+(Math.random()-.5)*4,y:GY-18,r:2,l:1});
  for(let i=R.sp.length-1;i>=0;i--){const p=R.sp[i];p.x+=(p.vx+Math.sin((t+i*70)*.004)*.15)*k;p.y+=p.vy*k;p.l-=.025*k;if(p.l<=0){R.sp.splice(i,1);continue}x.fillStyle=p.l>.6?'#ffe07a':'#ff7a26';x.fillRect(Math.round(p.x),Math.round(p.y),1,1)}
  for(let i=R.fm.length-1;i>=0;i--){const p=R.fm[i];p.y-=.25*k;p.x+=Math.sin((t+i*90)*.002)*.12*k;p.r+=.05*k;p.l-=.006*k;if(p.l<=0){R.fm.splice(i,1);continue}bola(g,p.x/2,p.y/2,p.r,'rgb(80,70,70)',p.l*.25)}
  // escuridão: só perto do fogo fica claro (a luz treme)
  const dk=R.dk||(R.dk=cv(W,H));if(dk.width!==W||dk.height!==H){dk.width=W;dk.height=H}const d=dk.getContext('2d');d.globalCompositeOperation='source-over';d.clearRect(0,0,W,H);d.fillStyle='rgba(4,3,6,.78)';d.fillRect(0,0,W,H);
  d.globalCompositeOperation='destination-out';const rr=(L.ret?Math.min(W,H)*.62:W*.62)*(1+fl*.05),gr=d.createRadialGradient(fx,GY-8,0,fx,GY-8,rr);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.45,'rgba(0,0,0,.8)');gr.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=gr;d.fillRect(0,0,W,H);
  x.drawImage(dk,0,0);
  bola(g,fx/2,(GY-8)/2,rr*.55,'rgb(255,130,50)',.3+fl*.06);bola(g,fx/2,(GY-8)/2,10,'rgb(255,220,140)',.5);
  if(R.cura>0){bola(g,hx/2,(GY-20)/2,26,'rgb(120,255,150)',R.cura*.5);R.cura-=.015*k}
  g.globalCompositeOperation='source-over'}
function ligar(){let px=document.getElementById('rsc'),gl=document.getElementById('rsg');if(!px){px=cv(10,10);px.id='rsc';gl=cv(10,10);gl.id='rsg';const bg=document.getElementById('bg');if(bg)bg.after(px,gl);else document.body.prepend(px,gl);addEventListener('resize',()=>{R.L=null})}
  R.px=px;R.gl=gl;px.style.display=gl.style.display='';if(!R.on){R.on=true;R.L=null;R.last=performance.now();requestAnimationFrame(tick)}}
function desligar(){R.on=false;for(const id of ['rsc','rsg']){const e=document.getElementById(id);if(e)e.style.display='none'}}
function novoRest(){const cura=Math.floor(G.maxHp*.3);
  return`<div class="page rs"><div class="rs-p"><h2>Fogueira</h2><p class="lead">${G.restDone?'O fogo baixa. Hora de seguir.':'Um momento de descanso entre as pedras frias.'}</p>
   ${G.restDone?`<button class="btn primary" data-act="proceed">Seguir para o mapa</button>`:`<button class="choice" data-act="rest"><b>Descansar</b><span>Cure ${cura} de vida (30% da vida máxima).</span></button>
     <button class="choice" data-act="forge" ${G.deck.some(canUp)?'':'disabled'}><b>Afiar</b><span>Melhore uma carta do baralho.</span></button>`}</div></div>`}
function instalar(){const _rh=restHTML;restHTML=function(){return OPT.menuNovo===false?_rh.apply(this,arguments):novoRest()};
  const _r=render;render=function(){const out=_r.apply(this,arguments);try{if(G&&G.screen==='rest'&&OPT.menuNovo!==false&&document.querySelector('.page.rs'))ligar();else desligar()}catch(e){console.error(e)}return out};
  const _rest=ACT.rest;ACT.rest=function(){R.cura=1;const id=HID[G&&G.char];if(id&&BICHOS[id]&&BICHOS[id].A.buff){R.anim='buff';R.hf=0}return _rest.apply(this,arguments)}}
if(document.readyState==='complete')setTimeout(instalar,0);else addEventListener('load',()=>setTimeout(instalar,0));
})();
