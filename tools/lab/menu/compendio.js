/* ===== Compêndio, Trilha sonora e Créditos (v2.41) =====
   - O jogo anota o que você já viu (cartas, relíquias, criaturas, eventos) em localStorage 'trc-comp'.
   - Compêndio: abas Cartas / Relíquias / Bestiário / Eventos; o que falta aparece como "?" (no DEV aparece tudo).
     O Bestiário mostra as criaturas animadas de verdade (motor dos inimigos) e, ao tocar, todos os golpes delas.
   - Trilha sonora: as 15 músicas, com tocar/pausar, anterior/próxima e barra de tempo (dentro de Cenas e no Compêndio).
   - Créditos: rolando por cima da cena da tela de início. */
(function(){
const CSS=`
#modal .mbox.cp{width:min(1100px,100%);max-width:none!important;height:min(94vh,820px);display:grid;grid-template-columns:minmax(150px,200px) 1fr;grid-template-rows:auto 1fr;gap:0;align-items:stretch;
  background:linear-gradient(160deg,#1d1610f4,#0b0907f8);border:1px solid #5a4528;box-shadow:0 0 0 1px #000,0 30px 80px #000d;border-radius:6px;overflow:hidden;animation:oaIn .35s cubic-bezier(.2,.8,.2,1)}
.cp .oa-h{grid-column:1/3}.cp .cp-x{margin-left:auto}
.cp-prog{display:flex;align-items:center;gap:10px;font:600 11px var(--f-num);letter-spacing:.2em;text-transform:uppercase;color:#a89878;margin-left:auto}
.cp-bar{width:120px;height:5px;border-radius:3px;background:#2a2016;overflow:hidden}.cp-bar i{display:block;height:100%;background:linear-gradient(90deg,#a8731f,#f2d17e)}
.cp-body{overflow:auto;padding:10px clamp(12px,2.4vw,26px) 24px;scrollbar-width:thin;scrollbar-color:#5a4528 transparent}
.cp-chips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 12px;position:sticky;top:-10px;z-index:2;padding:8px 0;background:linear-gradient(#14100cf0 70%,transparent)}
.cp-chip{border:1px solid #4a3a26;background:#15100b;color:#a89878;border-radius:20px;padding:5px 12px;font:400 14px var(--f-sc);cursor:pointer}.cp-chip.on{background:linear-gradient(#5a4220,#3a2a14);color:#fff3d6;border-color:#a88a4a}
.cp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:12px 10px}
.cp-cell{position:relative;display:flex;justify-content:center}
.cp-cell .card{zoom:1.12;pointer-events:auto;cursor:default;margin:0!important;transform:none!important}
.cp-q{width:100%;aspect-ratio:5/7;border-radius:8px;border:1px dashed #4a3a26;background:repeating-linear-gradient(45deg,#120e0a 0 8px,#16110c 8px 16px);display:flex;align-items:center;justify-content:center;font:400 46px var(--f-disp);color:#3a3020}
.cp-rel{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}
.cp-ri{display:flex;gap:12px;align-items:flex-start;padding:10px 12px;border:1px solid #2e2418;border-radius:6px;background:#100c09}
.cp-ri .seal{flex:none;transform:scale(1.3);margin:6px 6px 0 4px}.cp-ri b{display:block;font:400 17px var(--f-sc);color:#f0e0c0}.cp-ri span{font-size:14px;color:#8a7c66;line-height:1.35}
.cp-ri.nao b,.cp-ri.nao span{color:#4a4030}.cp-ri.nao .seal{filter:brightness(0) opacity(.5)}
.cp-best{display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,36%);gap:16px;align-items:start}
.cp-ato{margin:14px 0 8px;font:600 11px var(--f-num);letter-spacing:.3em;text-transform:uppercase;color:#7a6e5a;display:flex;align-items:center;gap:10px}.cp-ato::after{content:"";flex:1;height:1px;background:#2e2418}
.cp-bg{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}
.cp-bi{position:relative;border:1px solid #2e2418;border-radius:6px;background:radial-gradient(ellipse at 50% 80%,#2a2018,#0d0a08);padding:4px 4px 6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px;transition:border-color .2s,transform .2s}
.cp-bi:hover,.cp-bi.on{border-color:#a88a4a;transform:translateY(-2px)}.cp-bi.on{box-shadow:0 0 14px #e8c25a33}
.cp-bi canvas{width:100%;aspect-ratio:1;image-rendering:pixelated}
.cp-bi b{font:400 12px var(--f-sc);color:#d8c8a8;text-align:center;line-height:1.05}.cp-bi.nao b{color:#4a4030}
.cp-bi .tag{position:absolute;top:4px;right:4px;font:700 8px var(--f-num);letter-spacing:.12em;padding:1px 4px;border-radius:3px;background:#7a2a1a;color:#ffd8c0}.cp-bi .tag.boss{background:#5a2a7a;color:#f0d8ff}
.cp-det{position:sticky;top:0;border:1px solid #3d3020;border-radius:8px;background:radial-gradient(ellipse at 50% 70%,#2a2018,#0a0806);padding:12px;display:flex;flex-direction:column;gap:8px}
.cp-det canvas{width:100%;aspect-ratio:4/3;image-rendering:pixelated;border-radius:6px;background:linear-gradient(#0e0b14,#1a1410)}
.cp-det h3{margin:0;font:400 26px var(--f-disp);color:#f2d17e}.cp-det .an{font:italic 14px var(--f-body);color:#c8b088;min-height:18px}
.cp-det dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:3px 10px;font-size:14px}.cp-det dt{color:#7a6e5a;font:600 10px var(--f-num);letter-spacing:.2em;text-transform:uppercase;padding-top:3px}.cp-det dd{margin:0;color:#d8c8a8}
.cp-lock{display:flex;flex-direction:column;align-items:center;gap:8px;padding:50px 20px;border:1px dashed #4a3a26;border-radius:8px;color:#8a7c66;text-align:center}.cp-lock svg{width:40px;height:40px;fill:#c8a050;color:#c8a050}.cp-chip svg{width:13px;height:13px;fill:#c8a050;vertical-align:-1px;margin-right:4px}.cp-lock b{font:400 22px var(--f-sc);color:#f0e0c0}.cp-lock p{margin:0}
.cp-ev{display:flex;flex-direction:column;gap:8px}.cp-ei{padding:10px 14px;border:1px solid #2e2418;border-radius:6px;background:#100c09}.cp-ei b{font:400 18px var(--f-sc);color:#f0e0c0}.cp-ei p{margin:4px 0 0;color:#8a7c66;font-size:14px;line-height:1.4}.cp-ei.nao b,.cp-ei.nao p{color:#4a4030}
/* trilha */
.ts{display:grid;grid-template-columns:minmax(220px,36%) 1fr;gap:18px;align-items:start}
.ts-now{position:sticky;top:0;border:1px solid #3d3020;border-radius:8px;padding:16px;background:radial-gradient(ellipse at 50% 30%,#3a2a16,#0a0806);display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.ts-disc{width:min(150px,60%);aspect-ratio:1;border-radius:50%;background:repeating-radial-gradient(circle,#111 0 2px,#1a1a1a 2px 4px);border:2px solid #2a2016;position:relative;box-shadow:0 10px 30px #000}
.ts-disc::after{content:"";position:absolute;inset:36%;border-radius:50%;background:radial-gradient(circle,#f2d17e 0 18%,#a8731f 19% 60%,#5a3a10 61%)}.ts-disc.tocando{animation:tsGira 3.2s linear infinite}@keyframes tsGira{to{transform:rotate(360deg)}}
.ts-now h3{margin:0;font:400 24px var(--f-disp);color:#f2d17e}.ts-now p{margin:0;color:#8a7c66;font-style:italic}
.ts-ctl{display:flex;gap:10px;align-items:center}.ts-ctl button{width:42px;height:42px;border-radius:50%;border:1px solid #5a4528;background:#15100b;color:#f2d17e;cursor:pointer;font-size:16px}.ts-ctl button.pp{width:54px;height:54px;background:linear-gradient(#6a4a1a,#3a2810);font-size:20px}
.ts-tempo{width:100%;display:flex;gap:8px;align-items:center;font:600 11px var(--f-num);color:#a89878}.ts-tempo input{flex:1}
.ts-list{display:flex;flex-direction:column;gap:2px}.ts-it{display:flex;gap:12px;align-items:center;padding:8px 10px;border:0;border-radius:4px;background:none;color:#d8c8a8;text-align:left;cursor:pointer}.ts-it:hover{background:#ffffff08}.ts-it.on{background:linear-gradient(90deg,#e8c25a22,transparent);color:#fff3d6}
.ts-it i{width:24px;font:600 12px var(--f-num);color:#7a6e5a;font-style:normal}.ts-it b{font:400 17px var(--f-sc);display:block}.ts-it small{color:#7a6e5a;font-style:italic}
/* créditos */
.cr{position:fixed;inset:0;z-index:400;overflow:hidden;cursor:pointer;background:#05040bf4;-webkit-mask-image:linear-gradient(transparent 0,#000 14%,#000 86%,transparent 100%);mask-image:linear-gradient(transparent 0,#000 14%,#000 86%,transparent 100%);animation:fadeUp .6s}
.cr-in{position:absolute;left:0;right:0;top:100%;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding:0 20px 40vh;animation:crSobe var(--dur,60s) linear forwards}
@keyframes crSobe{to{transform:translateY(calc(-100% - 100vh))}}
.cr h1{margin:0 0 10px;font:400 clamp(44px,9vh,80px)/.9 var(--f-disp);background:linear-gradient(180deg,#fff6d6,#f2d17e 30%,#b07a24 55%,#f6dc96 74%,#7a5216);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 12px #000)}
.cr h2{margin:34px 0 6px;font:600 12px var(--f-num);letter-spacing:.4em;text-transform:uppercase;color:#a8731f}
.cr p{margin:0;font:400 clamp(17px,3vh,22px) var(--f-sc);color:#e8d9b8}.cr p small{display:block;font:italic 15px var(--f-body);color:#8a7c66}
.cr .fim{margin-top:60px;font:400 clamp(30px,6vh,48px) var(--f-disp);color:#f2d17e}
.cr-x{position:fixed;right:16px;bottom:14px;z-index:401;font:600 10px var(--f-num);letter-spacing:.28em;text-transform:uppercase;color:#7a6e5a;pointer-events:none}
@media (orientation:portrait),(max-width:620px){#modal .mbox.cp{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto 1fr}.cp .oa-h{flex-wrap:wrap;gap:6px 12px}.cp-prog{order:3;width:100%;margin-left:0}.cp .oa-tabs{min-width:0}.cp-body{min-width:0}.cp .oa-h{grid-column:1}.cp .oa-tabs{flex-direction:row;border-right:0;border-bottom:1px solid #3d3020;padding:0 6px;overflow-x:auto}
  .cp .oa-tab::before{left:20%;right:20%;top:auto;bottom:0;width:auto;height:3px;transform:scaleX(0)}.cp .oa-tab.on::before{transform:scaleX(1)}.cp-best,.ts{grid-template-columns:1fr}.cp-det{position:relative}.cp-grid{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))}.cp-cell .card{zoom:.66}.cp-prog .cp-bar{display:none}}
`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
/* ---------- o que já foi visto ---------- */
const VK='trc-comp';let V={c:{},r:{},e:{},v:{}};try{V=Object.assign(V,JSON.parse(localStorage.getItem(VK)||'{}'))}catch(e){}
let sujo=false;const marca=(t,id)=>{if(id&&!V[t][id]){V[t][id]=1;sujo=true}};
function anotar(){if(typeof G==='undefined'||!G)return;try{(G.deck||[]).forEach(k=>marca('c',k.id));if(G.combat){['hand','draw','discard','exhaust'].forEach(p=>(G.combat[p]||[]).forEach(k=>marca('c',k.id)));(G.combat.enemies||[]).forEach(e=>marca('e',e.id))}
  (G.relics||[]).forEach(r=>marca('r',r));if(G.event)marca('v',G.event.id);const rw=G.reward;if(rw){(rw.cards||[]).forEach(k=>marca('c',k.id||k));if(rw.relic)marca('r',rw.relic)}}catch(e){}
  if(sujo){sujo=false;try{localStorage.setItem(VK,JSON.stringify(V))}catch(e){}}}
document.addEventListener('click',e=>{const c=e.target.closest&&e.target.closest('[data-cid]');if(c)marca('c',c.dataset.cid)},true);
const visto=(t,id)=>DEVOK||!!V[t][id];
/* cartas de herói ainda trancado (Pacote das Trevas) não aparecem, mesmo vistas */
const trancado=cl=>{try{return typeof heroLocked==='function'&&!!CHARS[cl]&&heroLocked(cl)}catch(e){return false}};
const cartaLiberada=id=>{const d=CARDS[id];if(!d)return false;const cl=d.cl||(d.r==='lend'?'any':'cav');return !trancado(cl)&&visto('c',id)};
/* ---------- dados ---------- */
const CL_N={cav:'Cavaleiro',cac:'Caçadora',mag:'Mago',tan:'Guardião',nec:'Necromante',any:'Aliados'};
const R_N={basic:'Ferro',common:'Bronze',unc:'Prata',rare:'Ouro',ouro:'Super Carta Dourada',arma:'Arma',lend:'Aliado',special:'Maldição/Status',none:'Status'};
function cartas(){return Object.keys(CARDS).filter(id=>!['special','none'].includes(CARDS[id].r)).map(id=>({id,cl:CARDS[id].cl||(CARDS[id].r==='lend'?'any':'cav')}))}
const outras=()=>Object.keys(CARDS).filter(id=>['special','none'].includes(CARDS[id].r));
function atoDe(){const m={};for(const a of [1,2,3]){const A=ACTS[a];if(!A)continue;[...(A.easy||[]),...(A.hard||[]),...(A.elite||[])].flat().concat(A.boss||[]).forEach(id=>{if(!m[id])m[id]=a})}return m}
/* ---------- desenho das criaturas ---------- */
const LUZ={dir:-1,col:[255,190,120],amb:[70,55,50]};const FC=new Map();
function quadro(id,an,f,sil){const k=id+'|'+an+'|'+f+'|'+(sil?1:0);let q=FC.get(k);if(q)return q;try{const s=BICHO.seq(id,an);q=BICHO.quadro(id,s[f%s.length],LUZ);if(sil){const c=document.createElement('canvas');c.width=q.width;c.height=q.height;const x=c.getContext('2d');x.drawImage(q,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='#07060a';x.fillRect(0,0,c.width,c.height);q=c}}catch(e){q=null}
  if(FC.size>1500)FC.clear();FC.set(k,q);return q}
const temB=id=>typeof BICHOS!=='undefined'&&BICHOS[id]&&typeof BICHO!=='undefined';
function pinta(cv,id,an,f,sil,zoom=1){const q=temB(id)&&quadro(id,an,f,sil);const x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);x.imageSmoothingEnabled=false;if(!q)return;
  const s=Math.min(cv.width/q.width,cv.height/q.height)*zoom;x.drawImage(q,(cv.width-q.width*s)/2,cv.height-q.height*s-2,q.width*s,q.height*s)}
/* ---------- Compêndio ---------- */
const ABAS=[['cartas','Cartas','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="11" height="16" rx="1.5" transform="rotate(-8 9 11)"/><rect x="10" y="5" width="10" height="15" rx="1.5" transform="rotate(8 15 12)"/></svg>'],
 ['reliquias','Relíquias','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="7"/><path d="M9 4h6l-1 3h-4z"/></svg>'],
 ['bestiario','Bestiário','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 18c2-6 5-9 8-9s6 3 8 9"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M7 7l2 3M17 7l-2 3"/></svg>'],
 ['eventos','Eventos','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h8M8 18h5"/></svg>'],
 ['musica','Trilha sonora','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>']];
const S={aba:'cartas',cl:'cav',up:false,sel:null,raf:0,t:0};
function contagem(){const cs=cartas().filter(c=>!trancado(c.cl)),ce=cs.filter(c=>cartaLiberada(c.id)).length,rs=Object.keys(RELICS),re=rs.filter(r=>visto('r',r)).length,es=Object.keys(ENEMIES),ee=es.filter(e=>visto('e',e)).length,vs=Object.keys(EVENTS),ve=vs.filter(v=>visto('v',v)).length;
  return{n:ce+re+ee+ve,t:cs.length+rs.length+es.length+vs.length}}
ACT.compendio=(aba)=>{anotar();if(typeof aba==='string')S.aba=aba;const m=$('#modal'),c=contagem();
  m.innerHTML=`<div class="mbox cp"><div class="oa-h"><h2>Compêndio</h2><div class="cp-prog">${c.n} de ${c.t} descobertos<span class="cp-bar"><i style="width:${(c.n/c.t*100).toFixed(1)}%"></i></span></div><button class="btn small" data-act="cpfechar">Fechar</button></div>
   <nav class="oa-tabs">${ABAS.map(([k,n,ic])=>`<button class="oa-tab ${k===S.aba?'on':''}" data-act="cpaba" data-aba="${k}">${ic}${n}</button>`).join('')}</nav><div class="cp-body" id="cpb">${corpo()}</div></div>`;m.hidden=false;m.scrollTop=0;depois()};
ACT.cpaba=el=>{S.aba=el.dataset.aba;try{sfx('botao',{vol:.5})}catch(e){}ACT.compendio()};
ACT.cpcl=el=>{S.cl=el.dataset.cl;ACT.compendio()};ACT.cpup=()=>{S.up=!S.up;ACT.compendio()};
ACT.cpsel=el=>{S.sel=el.dataset.id;S.selAn=0;S.selF=0;document.querySelectorAll('.cp-bi').forEach(b=>b.classList.toggle('on',b.dataset.id===S.sel));detalhe()};
ACT.cpfechar=()=>{pararTrilha(true);cancelAnimationFrame(S.raf);closeModal()};
function corpo(){
  if(S.aba==='cartas'){const cs=cartas().filter(c=>S.cl==='outras'?false:c.cl===S.cl),lista=S.cl==='outras'?outras().map(id=>({id})):cs,ach=lista.filter(c=>cartaLiberada(c.id)).length;
    if(trancado(S.cl))return chips()+`<div class="cp-lock">${typeof LOCK_SVG!=='undefined'?LOCK_SVG:''}<b>Pacote das Trevas</b><p>As cartas do ${CL_N[S.cl]} aparecem aqui quando o herói for liberado.</p></div>`;
    return chips(ach,lista.length)+`<div class="cp-grid">${lista.map(c=>`<div class="cp-cell">${cartaLiberada(c.id)?safeCard(c.id):'<div class="cp-q">?</div>'}</div>`).join('')}</div>`}
  if(S.aba==='reliquias')return`<div class="cp-rel">${Object.keys(RELICS).map(k=>visto('r',k)?`<div class="cp-ri">${sealHTML(k)}<div><b>${RELICS[k].n}</b><span>${RELICS[k].d}</span></div></div>`:`<div class="cp-ri nao">${sealHTML(k).replace(/data-tip="[^"]*"/,'')}<div><b>???</b><span>Ainda não encontrada.</span></div></div>`).join('')}</div>`;
  if(S.aba==='bestiario'){const A=atoDe(),grupos={1:[],2:[],3:[],0:[]};Object.keys(ENEMIES).forEach(id=>grupos[A[id]||0].push(id));const nomes={1:'Ato 1 · A Masmorra',2:'Ato 2 · As Catacumbas',3:'Ato 3 · A Torre',0:'Outras criaturas'};
    if(!S.sel)S.sel=Object.keys(ENEMIES).find(id=>visto('e',id))||Object.keys(ENEMIES)[0];
    return`<div class="cp-best"><div>${[1,2,3,0].filter(a=>grupos[a].length).map(a=>`<div class="cp-ato">${nomes[a]}</div><div class="cp-bg">${grupos[a].map(id=>{const E=ENEMIES[id],v=visto('e',id);
      return`<button class="cp-bi ${v?'':'nao'} ${id===S.sel?'on':''}" data-act="cpsel" data-id="${id}">${E.boss?'<span class="tag boss">CHEFE</span>':E.elite?'<span class="tag">ELITE</span>':''}<canvas width="72" height="72" data-b="${id}" data-sil="${v?0:1}"></canvas><b>${v?E.n:'???'}</b></button>`}).join('')}</div>`).join('')}</div>
      <div class="cp-det" id="cpdet"></div></div>`}
  if(S.aba==='eventos')return`<div class="cp-ev">${Object.keys(EVENTS).map(k=>visto('v',k)?`<div class="cp-ei"><b>${EVENTS[k].t}</b><p>${EVENTS[k].txt}</p></div>`:`<div class="cp-ei nao"><b>???</b><p>Um acontecimento que você ainda não viveu no caminho.</p></div>`).join('')}</div>`;
  if(S.aba==='musica')return trilhaHTML();return''}
function chips(ach,tot){return`<div class="cp-chips">${Object.keys(CL_N).map(k=>`<button class="cp-chip ${S.cl===k?'on':''}" data-act="cpcl" data-cl="${k}">${trancado(k)&&typeof LOCK_SVG!=='undefined'?LOCK_SVG:''}${CL_N[k]}</button>`).join('')}<button class="cp-chip ${S.cl==='outras'?'on':''}" data-act="cpcl" data-cl="outras">Maldições</button>
      ${tot!=null?`<button class="cp-chip ${S.up?'on':''}" data-act="cpup" style="margin-left:auto">${S.up?'Vendo melhoradas +':'Ver melhoradas'}</button><span class="cp-chip" style="cursor:default">${ach}/${tot}</span>`:''}</div>`}
function safeCard(id){try{return cardHTML({id,uid:'cp_'+id,up:S.up})}catch(e){return`<div class="cp-q" style="font-size:16px;font-family:var(--f-sc);color:#a89878;padding:8px;text-align:center">${CARDS[id].n}</div>`}}
function depois(){cancelAnimationFrame(S.raf);if(S.aba==='bestiario'){detalhe();let last=0;const loop=t=>{if(!document.querySelector('.mbox.cp')||S.aba!=='bestiario')return;S.raf=requestAnimationFrame(loop);if(t-last<100)return;last=t;S.t++;
    document.querySelectorAll('.cp-bi canvas').forEach(cv=>{const id=cv.dataset.b;if(!temB(id))return;const n=BICHO.seq(id,'parado').length;pinta(cv,id,'parado',(S.t+id.length*3)%n,cv.dataset.sil==='1')});
    const dc=document.querySelector('#cpdet canvas');if(dc&&S.sel&&temB(S.sel)){const v=visto('e',S.sel),an=v?S.anims[S.selAn%S.anims.length]:'parado',n=BICHO.seq(S.sel,an).length;S.selF++;if(S.selF>=n){S.selF=0;if(v){S.selAn++;const nx=S.anims[S.selAn%S.anims.length];const la=document.querySelector('#cpdet .an');if(la)la.textContent=nomeAn(S.sel,nx)}}
      pinta(dc,S.sel,v?S.anims[S.selAn%S.anims.length]:'parado',S.selF,!v,.92)}};S.raf=requestAnimationFrame(loop)}
  if(S.aba==='musica')ligarTrilha()}
function nomeAn(id,an){const A=BICHOS[id]&&BICHOS[id].A[an];return A&&A.nome?A.nome:({parado:'Parado',ataque:'Ataque',especial:'Especial',buff:'Fortalecer',defesa:'Defesa',entrada:'Entrada',ferido:'Ferido',morte:'Queda'}[an]||an)}
function detalhe(){const d=document.getElementById('cpdet');if(!d||!S.sel)return;const id=S.sel,E=ENEMIES[id],v=visto('e',id);
  S.anims=temB(id)?Object.keys(BICHOS[id].A).filter(a=>!/^mania|^fase2$|^ferido2$/.test(a)):['parado'];S.selAn=0;S.selF=0;
  const mv=E.moves?Object.values(E.moves).map(m=>m.n).join(' · '):'';const A=atoDe()[id];
  d.innerHTML=`<canvas width="192" height="144"></canvas>${v?`<h3>${E.n}</h3><div class="an">${nomeAn(id,S.anims[0])}</div><dl><dt>Vida</dt><dd>${Array.isArray(E.hp)?E.hp.join(' a '):E.hp}</dd><dt>Onde</dt><dd>${A?ACTS[A].n:'Aparece com outras criaturas'}</dd><dt>Tipo</dt><dd>${E.boss?'Chefe':E.elite?'Elite':'Comum'}</dd>${mv?`<dt>Golpes</dt><dd>${mv}</dd>`:''}</dl>`:`<h3>???</h3><p style="margin:0;color:#7a6e5a">Encontre esta criatura na masmorra para conhecê-la.</p>`}`}
/* ---------- Trilha sonora ---------- */
const FAIXAS=[['menu','Tema principal','A masmorra chama'],['taverna','A Taverna','Onde toda jornada começa'],['a1','Luta na Masmorra','Ato 1'],['a2','Luta nas Catacumbas','Ato 2'],['a3','Luta na Torre','Ato 3'],
 ['chefe','O Chefe','Quando a porta grande se abre'],['corvo','O Corvo Rei','O último juramento'],['forja','A Forja de Hefesto','Martelo e brasa'],['cav','Tema do Cavaleiro','Garrel'],['cac','Tema da Caçadora','Ysolda'],
 ['mag','Tema do Mago','Morvane'],['tan','Tema do Guardião','Bram'],['nec','Tema do Necromante','Elowen'],['vitoria','Vitória: Classe S','A coroa no balcão'],['tombou','Você tombou','Ainda me restam pedras']];
const T={i:0,a:null,tocando:false};
function trilhaHTML(){const f=FAIXAS[T.i];return`<div class="ts"><div class="ts-now"><div class="ts-disc ${T.tocando?'tocando':''}"></div><h3>${f[1]}</h3><p>${f[2]}</p>
  <div class="ts-ctl"><button data-act="tsprev" aria-label="Anterior">⏮</button><button class="pp" data-act="tspp" aria-label="Tocar ou pausar">${T.tocando?'❚❚':'▶'}</button><button data-act="tsnext" aria-label="Próxima">⏭</button></div>
  <div class="ts-tempo oa-body" style="padding:0;overflow:visible"><span id="tsa">0:00</span><input type="range" id="tsr" min="0" max="1000" value="0"><span id="tsd">0:00</span></div></div>
  <div class="ts-list">${FAIXAS.map((x,i)=>`<button class="ts-it ${i===T.i?'on':''}" data-act="tsir" data-i="${i}"><i>${String(i+1).padStart(2,'0')}</i><span><b>${x[1]}</b><small>${x[2]}</small></span></button>`).join('')}</div></div>`}
const mmss=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
function audio(){const k=FAIXAS[T.i][0];if(!T.a||T.a._k!==k){if(T.a){T.a.pause()}T.a=new Audio('musica/'+TRK[k]+'.mp3');T.a._k=k;T.a.volume=Math.max(.15,(typeof musVol==='function'?musVol():.6)||.6);T.a.onended=()=>{T.i=(T.i+1)%FAIXAS.length;tocar()}}return T.a}
function tocar(){MUS.hold=true;try{musApply()}catch(e){}const a=audio();a.play().then(()=>{T.tocando=true;atualiza()}).catch(()=>{T.tocando=false;atualiza()})}
function pararTrilha(sair){if(T.a)T.a.pause();T.tocando=false;if(sair){MUS.hold=false;try{musApply()}catch(e){}}}
function atualiza(){if(S.aba!=='musica'||!document.getElementById('cpb'))return;document.getElementById('cpb').innerHTML=trilhaHTML();ligarTrilha()}
function ligarTrilha(){const r=document.getElementById('tsr');if(!r)return;const a=T.a;const up=()=>{if(!document.getElementById('tsr'))return;if(a&&a.duration){r.value=a.currentTime/a.duration*1000;r.style.setProperty('--p',(r.value/10)+'%');document.getElementById('tsa').textContent=mmss(a.currentTime);document.getElementById('tsd').textContent=mmss(a.duration)}requestAnimationFrame(up)};up();
  r.oninput=()=>{if(T.a&&T.a.duration)T.a.currentTime=r.value/1000*T.a.duration}}
ACT.tspp=()=>{if(T.tocando){pararTrilha();atualiza()}else tocar()};ACT.tsnext=()=>{T.i=(T.i+1)%FAIXAS.length;tocar()};ACT.tsprev=()=>{T.i=(T.i-1+FAIXAS.length)%FAIXAS.length;tocar()};ACT.tsir=el=>{T.i=+el.dataset.i;tocar()};
ACT.trilha=()=>{S.aba='musica';ACT.compendio()};
/* ---------- Créditos ---------- */
ACT.creditos=()=>{if(document.querySelector('.cr'))return;const d=document.createElement('div');d.className='cr';const L=(t,s)=>`<p>${t}${s?`<small>${s}</small>`:''}</p>`;
  d.innerHTML=`<div class="cr-in" style="--dur:${innerHeight>700?70:58}s"><h1>Masmorra<br>do Corvo Rei</h1><p><small>A Coroa de Cinco Juramentos</small></p>
   <h2>Criação, direção e história</h2>${L('Theo')}
   <h2>Desenvolvido com</h2>${L('Zeus','Claude, da Anthropic')}
   <h2>O Olimpo</h2>${L('Hefesto','engenharia')}${L('Hera','testes')}${L('Afrodite','arte e personagens')}${L('Apolo','música, sons, falas e cenas')}${L('Atena','regras e equilíbrio')}${L('Hermes','celular e loja')}${L('Deméter','cenários')}${L('Hélio','luz e efeitos')}
   <h2>Heróis</h2>${L('Cavaleiro Errante','sangue de Garrel')}${L('Caçadora das Brumas','sangue de Ysolda')}${L('Mago Arcano','escolhido de Morvane')}${L('Guardião de Ferro','sangue de Bram')}${L('Necromante','sangue de Elowen')}
   <h2>Música e efeitos sonoros</h2>${L('Compostos e sintetizados para o jogo','15 músicas e 18 efeitos, sem gravações de terceiros')}
   <h2>Fontes</h2>${L('UnifrakturMaguntia · IM Fell English · Alegreya Sans SC','licença SIL Open Font')}
   <h2>Agradecimentos</h2>${L('A todos que desceram à masmorra','e a quem jogou de novo depois de tombar')}
   <p class="fim">Obrigado por jogar</p></div>`;
  const x=document.createElement('div');x.className='cr-x';x.textContent='Toque para fechar';const fim=()=>{d.remove();x.remove()};d.onclick=fim;d.querySelector('.cr-in').addEventListener('animationend',fim);document.body.append(d,x);
  const k=e=>{if(e.key==='Escape'){fim();removeEventListener('keydown',k)}};addEventListener('keydown',k)};
/* ---------- ligar ---------- */
function instalar(){try{const sv=typeof loadSave==='function'&&loadSave();if(sv){(sv.deck||[]).forEach(k=>marca('c',k.id));(sv.relics||[]).forEach(r=>marca('r',r));if(sv.combat)(sv.combat.enemies||[]).forEach(e=>marca('e',e.id));if(sujo){sujo=false;localStorage.setItem(VK,JSON.stringify(V))}}}catch(e){}
  const _r=render;render=function(){const r=_r.apply(this,arguments);anotar();return r};
  const _c=ACT.cenas;ACT.cenas=function(){const r=_c.apply(this,arguments);const p=document.querySelector('#modal .panel');if(p&&!p.querySelector('[data-act=trilha]')){const b=document.createElement('button');b.className='choice';b.dataset.act='trilha';b.innerHTML='<b>Trilha sonora</b><span>Ouça as 15 músicas do jogo.</span>';p.insertBefore(b,p.firstChild)}return r};
  const _cm=closeModal;closeModal=function(){if(document.querySelector('#modal .mbox.cp')){pararTrilha(true);cancelAnimationFrame(S.raf)}return _cm.apply(this,arguments)}}
if(document.readyState==='complete')setTimeout(instalar,0);else addEventListener('load',()=>setTimeout(instalar,0));
window.CP={V,anotar};
})();
