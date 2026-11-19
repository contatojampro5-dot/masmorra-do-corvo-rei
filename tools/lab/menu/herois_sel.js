/* ===== Escolha do herói no estilo de jogo grande (v2.49) =====
   Salão de pedra em tela cheia com o herói animado de verdade num pedestal, feixe de luz e estandarte na cor da família,
   tochas, poeira e névoa. Painel com nome, título, frase, vida, relíquia, estilo, nível e o que ele guardou.
   Embaixo, os 5 heróis para trocar (toque, setas do teclado ou arrastar o dedo). Trancados mostram o Pacote das Trevas. */
(function(){
const CSS=`
#hsc{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;image-rendering:pixelated;display:none}#hsg{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;mix-blend-mode:screen;display:none}
.page.hs{position:relative;z-index:1;width:100%;height:100%;padding:0;display:block;overflow:hidden;touch-action:pan-y}
.hs-back{position:absolute;left:max(4px,env(safe-area-inset-left,0px));top:8px;z-index:3;border:1px solid #4a3a26;background:#0b0806cc;color:#d8c8a8;border-radius:20px;padding:6px 14px;font:400 15px var(--f-sc);cursor:pointer}
.hs-kick{position:absolute;left:0;right:0;top:12px;text-align:center;font:600 11px var(--f-num);letter-spacing:.42em;text-transform:uppercase;color:#a89878;pointer-events:none}
.hs-p{position:absolute;right:max(2vw,env(safe-area-inset-right,0px));top:46px;bottom:96px;width:min(44vw,440px);display:flex;flex-direction:column;gap:8px;justify-content:center;padding:14px 18px;
  background:linear-gradient(90deg,#0b080600,#0b0806d8 18%,#0b0806ee);border-radius:10px;animation:hsIn .45s cubic-bezier(.2,.8,.2,1) both}
@keyframes hsIn{0%{opacity:0;transform:translateX(16px)}100%{opacity:1;transform:none}}
.hs-p .ep{margin:0;font:600 11px var(--f-num);letter-spacing:.3em;text-transform:uppercase;color:var(--hc,#e8c25a)}
.hs-p h1{margin:0;font:400 clamp(30px,7vh,54px)/.95 var(--f-disp);background:linear-gradient(180deg,#fff6d6,#f2d17e 35%,#b07a24 60%,#f6dc96 80%,#7a5216);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #2a1a08)}
.hs-p .q{margin:0;font:italic 15px/1.35 var(--f-body);color:#c8b088}
.hs-p .d{margin:0;font-size:14px;line-height:1.35;color:#a89878}
.hs-st{display:flex;flex-wrap:wrap;gap:6px}
.hs-st span{display:flex;align-items:center;gap:6px;padding:4px 10px;border:1px solid #3d3020;border-radius:20px;background:#0d0a08;font:600 13px var(--f-num);color:#e8d9b8}.hs-st svg{width:15px;height:15px}.hs-st .seal{transform:scale(.8);margin:-4px -2px}
.hs-go{margin-top:4px;align-self:stretch;border:0;border-radius:6px;padding:12px 16px;font:400 clamp(18px,3.6vh,22px) var(--f-sc);color:#fff3d6;cursor:pointer;background:linear-gradient(#b8452e,#6a1e14);box-shadow:0 0 0 1px #000,0 6px 18px #0008,inset 0 1px 0 #ffffff30;letter-spacing:.04em}
.hs-go:hover{background:linear-gradient(#cc5238,#7a2418)}.hs-go.lock{background:linear-gradient(#3a2e20,#1c150e);color:#e8c25a}.hs-go.lock svg{width:15px;height:15px;fill:#e8c25a;vertical-align:-2px;margin-right:6px}
.hs-bar{position:absolute;left:0;right:0;bottom:max(8px,env(safe-area-inset-bottom,0px));display:flex;justify-content:center;align-items:center;gap:6px;padding:0 10px;z-index:2}
.hs-t{position:relative;width:clamp(58px,9vw,84px);aspect-ratio:1;border-radius:8px;border:1px solid #3d3020;background:radial-gradient(ellipse at 50% 85%,#2a2018,#0b0806);cursor:pointer;padding:0;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s}
.hs-t canvas{width:100%;height:100%;image-rendering:pixelated}.hs-t b{position:absolute;left:0;right:0;bottom:2px;font:400 10px var(--f-sc);color:#d8c8a8;text-align:center;text-shadow:0 1px 2px #000}
.hs-t.on{border-color:var(--hc,#e8c25a);transform:translateY(-4px);box-shadow:0 0 16px color-mix(in srgb,var(--hc,#e8c25a) 60%,transparent)}
.hs-t .lk{position:absolute;top:3px;right:3px;width:14px;height:14px;fill:#e8c25a}.hs-t.lock canvas{filter:grayscale(.8) brightness(.6)}
.hs-arr{border:0;background:none;color:#f2d17e;font:400 28px var(--f-disp);cursor:pointer;padding:0 6px;opacity:.8}
.hs-seed{position:absolute;left:12px;bottom:100px;z-index:3}
@media (orientation:portrait){.hs-p{left:12px;right:12px;width:auto;top:auto;bottom:96px;justify-content:flex-start;background:linear-gradient(180deg,#0b080600,#0b0806e6 14%,#0b0806f4);padding-top:26px}
  .hs-p h1{font-size:clamp(30px,9vw,44px)}.hs-p .q{font-size:14px}.hs-p .d{display:none}.hs-kick{display:none}}`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const COR={cav:'#d0402a',cac:'#5aaa4a',mag:'#4a82d0',tan:'#c88a3a',nec:'#9a4ad0'};
const ORD=()=>Object.keys(CHARS);
const S={on:false,i:0,px:null,gl:null,last:0,bg:null,bgk:'',an:'parado',f:0,ft:0,prox:5000,dust:[],emb:[],thumbs:[]};window.HSEL=S;
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const rnd=s=>{s=s>>>0;return()=>(s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296};
const GC={};function bola(x,X,Y,r,c,a){if(a<=0)return;let g=GC[c];if(!g){g=cv(64,64);const q=g.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,64,64);GC[c]=g}x.globalAlpha=Math.min(1,a);x.drawImage(g,X-r,Y-r,r*2,r*2);x.globalAlpha=1}
const rgb=h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]};const cs=(h,a)=>{const[r,g,b]=rgb(h);return`rgba(${r},${g},${b},${a})`};
const LUZ=null;
/* quadro do herói: heróis novos pelo motor; Cavaleiro pela vitrine dele; se faltar, o desenho antigo */
const QC=new Map();
function heroi(ch,an,f){const id='h_'+ch;
  if(ch==='cav'&&window.KN&&KN.vitrine){let nm=an==='entrada'?'olhar':an;let r;try{r=KN.vitrine(nm,f,LUZ)}catch(e){nm='parado';try{r=KN.vitrine(nm,f,LUZ)}catch(_){}}if(r)return{c:r.cv,n:r.n,fx:20,fy:60,fps:nm==='parado'?8:11}}
  if(typeof BICHOS!=='undefined'&&BICHOS[id]){const A=BICHOS[id].A[an]||BICHOS[id].A.parado,nm=BICHOS[id].A[an]?an:'parado',sq=BICHO.seq(id,nm),k=id+'|'+nm+'|'+(f%sq.length);let q=QC.get(k);if(!q){q=BICHO.quadro(id,{...sq[f%sq.length],arma:0},LUZ);if(QC.size>500)QC.clear();QC.set(k,q)}return{c:q,n:sq.length,fx:21,fy:58,fps:A.fps}}
  return null}
const MAN=ch=>ch==='cav'?((window.KN&&KN.MANIAS)||[]):['mania1','mania2','mania3'].filter(a=>BICHOS['h_'+ch]&&BICHOS['h_'+ch].A[a]);
function tam(){const ret=innerWidth>=innerHeight,W=ret?190:112;return{W,H:Math.round(W*innerHeight/innerWidth),ret}}
function fundo(ch){const{W,H,ret}=tam(),key=ch+'|'+W+'|'+H;if(S.bgk===key)return S.bg;S.bgk=key;const c=cv(W,H),x=c.getContext('2d'),r=rnd(3),P=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h))};
  const hc=COR[ch]||'#e8c25a',GY=ret?H-18:Math.round(H*.5),px=Math.round(ret?W*.3:W*.5);S.GY=GY;S.hx=px;S.ret=ret;
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#07060a');g.addColorStop(.7,'#15110e');g.addColorStop(1,'#0a0807');x.fillStyle=g;x.fillRect(0,0,W,H);
  // pedras da parede
  for(let y=0;y<GY;y+=8)for(let i=-(y/8%2)*8;i<W;i+=16){const j=.6+r()*.5;P(i+1,y+1,15,7,`rgb(${36*j|0},${30*j|0},${30*j|0})`);P(i+1,y+1,15,1,'rgba(255,230,200,.05)')}
  // arcos do salão
  for(const ax of [px-46,px+46,px+110,px-110]){P(ax-10,0,4,GY,'#0c0a0c');P(ax+6,0,4,GY,'#0c0a0c');for(let k=0;k<12;k++){const a=Math.PI*k/11;P(ax+Math.cos(a)*-8-1,22-Math.sin(a)*10,3,3,'#1c1818')}P(ax-6,22,12,GY-22,'#050406')}
  // estandarte da família atrás do herói
  const bw=18,bx=px-bw/2,by=6;P(bx-2,by-2,bw+4,2,'#5a4a3a');const[br,bg2,bb]=rgb(hc),esc=`rgb(${br*.42|0},${bg2*.42|0},${bb*.42|0})`,esc2=`rgb(${br*.36|0},${bg2*.36|0},${bb*.36|0})`;for(let j=0;j<46;j++){const ww=j<40?bw:Math.round(bw*(46-j)/6);P(px-ww/2,by+j,ww,1,j%2?esc:esc2)}P(px-bw/2,by,1,40,cs(hc,.6));
  // símbolo de cada família (sem cruz): espada, flecha, estrela, martelo, caveira
  const EMB={cav:['......#','.....#.','....#..','#..#...','.##....','.##....','#..#...'],cac:['....###','.....##','....#.#','...#...','..#....','##.....','#......'],mag:['..#..','..#..','#####','.###.','.#.#.','#...#','.....'],tan:['#####','#####','..#..','..#..','..#..','..#..','..#..'],nec:['.###.','#####','#.#.#','#####','.###.','.#.#.','.....']};
  (EMB[ch]||EMB.cav).forEach((ln,j)=>[...ln].forEach((c2,i)=>{if(c2==='#')P(px-ln.length+i*2,by+12+j*2,2,2,'#e8c25a')}));
  // chão e pedestal
  P(0,GY,W,H-GY,'#120e0c');for(let i=0;i<W;i+=12){P(i,GY,11,4,'#1e1814');P(i,GY,11,1,'#2e2620')}
  P(px-18,GY-6,36,6,'#2a2420');P(px-18,GY-6,36,1,'#4a4038');P(px-22,GY,44,3,'#1e1a18');P(px-14,GY-9,28,3,'#3a322c');P(px-14,GY-9,28,1,'#5a5048');
  // tochas
  S.toch=[[ret?px-58:8,GY-34],[ret?px+58:W-8,GY-34]];for(const[tx,ty]of S.toch){P(tx-1,ty,3,9,'#2a1a10');P(tx-2,ty-1,5,2,'#5a3a20')}
  S.bg=c;return c}
function tick(t){if(!S.on)return;requestAnimationFrame(tick);if(document.hidden)return;const passo=OPT.bateria==='maxima'?400:OPT.bateria==='economia'?70:45;if(t-S.last<passo)return;const k=Math.min(3,(t-S.last)/45);S.last=t;try{desenha(t,k)}catch(e){console.error(e);S.on=false}}
function desenha(t,k){const ch=ORD()[S.i],{W,H}=tam();if(S.px.width!==W||S.px.height!==H){S.px.width=W;S.px.height=H;S.gl.width=Math.ceil(W/2);S.gl.height=Math.ceil(H/2)}
  const x=S.px.getContext('2d'),g=S.gl.getContext('2d'),hc=COR[ch]||'#e8c25a';x.imageSmoothingEnabled=false;x.drawImage(fundo(ch),0,0);g.clearRect(0,0,g.canvas.width,g.canvas.height);g.globalCompositeOperation='lighter';
  const GY=S.GY,px=S.hx,fl=Math.sin(t*.011)*.5+Math.sin(t*.027)*.3;
  // feixe de luz de cima na cor da família, com poeira
  g.fillStyle=cs(hc,.13+Math.sin(t*.0013)*.03);g.beginPath();g.moveTo((px-8)/2,0);g.lineTo((px+8)/2,0);g.lineTo((px+26)/2,GY/2);g.lineTo((px-26)/2,GY/2);g.fill();
  if(S.dust.length<40)S.dust.push({u:Math.random(),v:Math.random(),ph:Math.random()*7});for(const d of S.dust){d.v+=.002*k;d.ph+=.03*k;if(d.v>1)d.v=0;const y=d.v*GY,w=8+18*d.v,xx=px+(d.u-.5)*2*w+Math.sin(d.ph)*1.5;if(Math.sin(d.ph*1.3)>-.2){x.fillStyle='rgba(255,240,220,.7)';x.fillRect(Math.round(xx),Math.round(y),1,1)}}
  bola(g,px/2,(GY-20)/2,26,cs(hc,1),.28);
  // tochas
  for(const[tx,ty]of S.toch){for(let d=-1;d<=1;d++){const hh=Math.max(1,Math.round((5-Math.abs(d)*2)*(.7+.3*Math.sin(t*.03+d+tx))));x.fillStyle='#e0601c';x.fillRect(tx+d,ty-1-hh,1,hh);x.fillStyle='#ffd06a';x.fillRect(tx+d,ty-1-Math.ceil(hh/2),1,1)}bola(g,tx/2,(ty-4)/2,16,'rgb(255,150,60)',.35+fl*.08);if(Math.random()<.2*k)S.emb.push({x:tx,y:ty-6,vy:-.3-Math.random()*.3,l:1})}
  for(let i=S.emb.length-1;i>=0;i--){const e=S.emb[i];e.y+=e.vy*k;e.x+=Math.sin((t+i*50)*.004)*.15*k;e.l-=.03*k;if(e.l<=0){S.emb.splice(i,1);continue}x.fillStyle='#ffb050';x.fillRect(Math.round(e.x),Math.round(e.y),1,1)}
  // herói
  const ms=MAN(ch);const q0=heroi(ch,S.an,S.f);if(q0){S.ft+=45*k;const step=1000/(q0.fps||9);while(S.ft>=step){S.ft-=step;S.f++;if(S.f>=q0.n&&S.an!=='parado'){S.an='parado';S.f=0}}
    S.prox-=45*k;if(S.prox<=0&&S.an==='parado'&&ms.length){S.prox=6000+Math.random()*5000;S.an=ms[Math.floor(Math.random()*ms.length)];S.f=0}
    const q=heroi(ch,S.an,S.f);if(q){const bk=Math.round((fl+1)*2),[r1,g1,b1]=rgb(hc);q.c=LUZAMB(q.c,{escuro:.18,tinta:[r1,g1,b1,.05],luzes:[{lado:0,cor:[Math.min(255,r1+90),Math.min(255,g1+90),Math.min(255,b1+90)],k:.85,alt:.08},{lado:-1,cor:[255,160,70],k:.45+bk*.08},{lado:1,cor:[255,160,70],k:.45+bk*.08}]},'h|'+ch+'|'+S.an+'|'+S.f+'|'+bk);const sc=S.ret?1:1;x.drawImage(q.c,Math.round(px-q.fx*sc),Math.round(GY-9-q.fy*sc),Math.round(q.c.width*sc),Math.round(q.c.height*sc))}}
  // névoa no chão
  for(let i=0;i<5;i++){const fx=((t*.004*(1+i%3)+i*60)%(W+80))-40;bola(g,fx/2,(GY+2)/2,16+i%2*6,'rgb(120,110,140)',.12)}
  if(heroLocked(ch)){x.fillStyle='rgba(5,4,8,.45)';x.fillRect(0,0,W,H)}
  g.globalCompositeOperation='source-over';
  // miniaturas embaixo (parado)
  if(!S.tl||t-S.tl>120){S.tl=t;S.tf=(S.tf||0)+1;document.querySelectorAll('.hs-t canvas').forEach(c=>{const q=heroi(c.dataset.ch,'parado',S.tf);if(!q)return;const cx=c.getContext('2d');cx.imageSmoothingEnabled=false;cx.clearRect(0,0,c.width,c.height);const s=1.15;cx.drawImage(q.c,Math.round(24-q.fx*s),Math.round(52-q.fy*s),Math.round(q.c.width*s),Math.round(q.c.height*s))})}}
function ligar(){let px=document.getElementById('hsc'),gl=document.getElementById('hsg');if(!px){px=cv(10,10);px.id='hsc';gl=cv(10,10);gl.id='hsg';const bg=document.getElementById('bg');if(bg)bg.after(px,gl);else document.body.prepend(px,gl);addEventListener('resize',()=>{S.bgk=''})}
  S.px=px;S.gl=gl;px.style.display=gl.style.display='block';if(!S.on){S.on=true;S.last=performance.now();requestAnimationFrame(tick)}}
function desligar(){S.on=false;for(const id of ['hsc','hsg']){const e=document.getElementById(id);if(e)e.style.display='none'}}
function painel(ch){const C=CHARS[ch],L=LORE[ch]||{},tr=heroLocked(ch),pr=window.PROG?PROG.dados(ch):null,nv=pr?PROG.nivel(pr.xp):null;
  return`<div class="hs-p" style="--hc:${COR[ch]}" data-ch="${ch}"><p class="ep">${L.ep||''}</p><h1>${C.n}</h1>${L.q?`<p class="q">“${L.q}”</p>`:''}<p class="d">${C.d}</p>
   <div class="hs-st"><span>${SVG.heart}${C.hp} de vida</span><span>${sealHTML(C.relic)} ${RELICS[C.relic].n}</span>${nv?`<span>Nível ${nv.n}</span>`:''}${pr&&pr.deck&&pr.deck.length?`<span>Baralho guardado: ${pr.deck.length}</span>`:''}</div>
   ${nv?`<div class="pr-bar"><i style="width:${(nv.p*100).toFixed(0)}%"></i></div>`:''}
   ${tr?`<button class="hs-go lock" data-act="lockedhero" data-ch="${ch}">${LOCK_SVG}Pacote das Trevas</button>`:`<button class="hs-go" data-act="start" data-ch="${ch}">Descer à masmorra</button>`}</div>`}
function novaEscolha(){const ks=ORD();if(S.i>=ks.length)S.i=0;const ch=ks[S.i];
  return`<div class="page hs"><button class="hs-back" data-act="back">‹ Voltar</button><p class="hs-kick">Quem desce à masmorra?</p>${painel(ch)}
   <div class="hs-bar"><button class="hs-arr" data-act="hsprev" aria-label="Anterior">‹</button>${ks.map((k,i)=>`<button class="hs-t ${i===S.i?'on':''} ${heroLocked(k)?'lock':''}" style="--hc:${COR[k]}" data-act="hssel" data-i="${i}" aria-label="${CHARS[k].n}"><canvas width="48" height="56" data-ch="${k}"></canvas>${heroLocked(k)?LOCK_SVG.replace('<svg','<svg class="lk"'):''}<b>${CHARS[k].n.split(' ')[0]}</b></button>`).join('')}<button class="hs-arr" data-act="hsnext" aria-label="Próximo">›</button></div>
   ${UI.dev?`<div class="hs-seed"><input id="seed" class="seedin" placeholder="semente" inputmode="numeric"></div>`:''}</div>`}
function troca(i){const n=ORD().length;S.i=(i+n)%n;S.an='entrada';S.f=0;S.ft=0;S.prox=5000;S.bgk='';try{sfx('botao',{vol:.6})}catch(e){}
  const pg=document.querySelector('.page.hs');if(pg){const p=pg.querySelector('.hs-p');p.outerHTML=painel(ORD()[S.i]);pg.querySelectorAll('.hs-t').forEach((b,j)=>b.classList.toggle('on',j===S.i))}else render()}
ACT.hssel=el=>troca(+el.dataset.i);ACT.hsnext=()=>troca(S.i+1);ACT.hsprev=()=>troca(S.i-1);
addEventListener('keydown',e=>{if(!document.querySelector('.page.hs')||!$('#modal').hidden)return;if(e.key==='ArrowRight'){e.preventDefault();troca(S.i+1)}else if(e.key==='ArrowLeft'){e.preventDefault();troca(S.i-1)}else if(e.key==='Enter'){const b=document.querySelector('.hs-go');if(b){e.preventDefault();b.click()}}});
let tx0=null;addEventListener('touchstart',e=>{if(document.querySelector('.page.hs')&&!e.target.closest('.hs-p'))tx0=e.touches[0].clientX},{passive:true});
addEventListener('touchend',e=>{if(tx0==null)return;const dx=e.changedTouches[0].clientX-tx0;tx0=null;if(Math.abs(dx)>50)troca(S.i+(dx<0?1:-1))},{passive:true});
function instalar(){const _t=titleHTML;titleHTML=function(){if(UI.choose&&OPT.menuNovo!==false){if(S.ini==null){S.ini=1;try{const sv=loadSave();const k=ORD();let i=sv&&sv.char?k.indexOf(sv.char):-1;if(i<0)i=k.findIndex(c=>!heroLocked(c));S.i=Math.max(0,i)}catch(e){}}return novaEscolha()}return _t.apply(this,arguments)};
  const _r=render;render=function(){const out=_r.apply(this,arguments);try{if(!G&&UI.choose&&document.querySelector('.page.hs'))ligar();else desligar()}catch(e){console.error(e)}return out};
  try{if(!G&&UI.choose)render()}catch(e){}}
if(document.readyState==='complete')setTimeout(instalar,0);else addEventListener('load',()=>setTimeout(instalar,0));
})();
