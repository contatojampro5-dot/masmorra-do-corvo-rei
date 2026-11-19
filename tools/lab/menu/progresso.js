/* ===== Progressão do herói (v2.46, pedido do Theo) =====
   - Quando a jornada acaba (tombando ou vencendo o Corvo Rei), o BARALHO TODO (com as melhorias) e o NÍVEL DA ARMA da forja
     ficam guardados naquele herói. A próxima jornada dele começa com esse baralho e essa arma.
   - XP por inimigo vencido (comum 5, elite 15, chefe 40, lacaio 2) e por andar descido (3). O nível só mostra a evolução (sem bônus).
   - Mostra o nível na escolha do herói, no topo da jornada e na tela final (com a barra subindo).
   - Opções → Jogo → "Recomeçar herói do zero" apaga o que um herói guardou.
   Guardado em localStorage 'trc-heroi'. */
(function(){
const CSS=`
.pr-badge{display:flex;flex-direction:column;gap:3px;width:100%;margin:2px 0 4px}
.pr-badge .l{display:flex;justify-content:space-between;align-items:baseline;font:600 11px var(--f-num);letter-spacing:.16em;text-transform:uppercase;color:#a89878}.pr-badge .l b{font:700 16px var(--f-num);letter-spacing:.02em;color:#f2d17e}
.pr-bar{height:6px;border-radius:3px;background:#2a2016;overflow:hidden;border:1px solid #000}.pr-bar i{display:block;height:100%;background:linear-gradient(90deg,#a8731f,#f2d17e);box-shadow:0 0 8px #f2d17e88;transition:width 1.2s cubic-bezier(.2,.8,.2,1)}
.pr-badge small{font:italic 12px var(--f-body);color:#8a7c66;text-transform:none;letter-spacing:0}
.top .hero .nv{margin-left:6px;font:600 11px var(--f-num);letter-spacing:.1em;color:#1a1208;background:linear-gradient(#f2d17e,#b07a24);border-radius:9px;padding:1px 6px;vertical-align:4px}
.pr-end{width:min(460px,100%);padding:14px 16px;border:1px solid #5a4528;border-radius:8px;background:linear-gradient(160deg,#1d1610,#0d0a08);display:flex;flex-direction:column;gap:8px;animation:fadeUp .6s .3s both}
.pr-end h3{margin:0;font:400 22px var(--f-disp);color:#f2d17e}.pr-end .pr-bar{height:9px}.pr-end p{margin:0;color:#c8b088;font-size:15px}.pr-end .up{color:#9fd18a;font:400 18px var(--f-sc)}
.pr-toast{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:500;padding:10px 22px;border-radius:30px;background:linear-gradient(#3a2810,#1a1208);border:1px solid #c8a050;color:#f2d17e;font:400 20px var(--f-sc);box-shadow:0 0 30px #e8c25a66;animation:prUp 2.6s ease-out forwards;pointer-events:none}
@keyframes prUp{0%{opacity:0;transform:translate(-50%,10px) scale(.9)}12%{opacity:1;transform:translate(-50%,0) scale(1.05)}20%{transform:translate(-50%,0) scale(1)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-14px)}}`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const K='trc-heroi';let PR={};try{PR=JSON.parse(localStorage.getItem(K)||'{}')||{}}catch(e){}
const salva=()=>{try{localStorage.setItem(K,JSON.stringify(PR))}catch(e){}};
const H=ch=>PR[ch]||(PR[ch]={xp:0,jornadas:0,tombos:0,vitorias:0});
/* nível: para sair do nível n precisa de 40+20·(n−1) XP */
const prox=n=>40+20*(n-1);
function nivel(xp){let n=1,r=xp;while(r>=prox(n)){r-=prox(n);n++}return{n,r,falta:prox(n),p:r/prox(n)}}
window.PROG={nivel,dados:ch=>H(ch),PR};
function ganha(xp){if(typeof G==='undefined'||!G||!G.char||xp<=0)return;const h=H(G.char),a=nivel(h.xp).n;h.xp+=xp;G._xp=(G._xp||0)+xp;salva();const b=nivel(h.xp).n;
  if(b>a){const d=document.createElement('div');d.className='pr-toast';d.textContent=`${CHARS[G.char].n} subiu para o nível ${b}!`;document.body.appendChild(d);setTimeout(()=>d.remove(),2700);try{sfx('moedas',{vol:.8})}catch(e){}}}
/* ---------- ligações ---------- */
const _nr=newRun;newRun=function(seed,char='cav'){const r=_nr.apply(this,arguments);try{const h=H(G.char);h.jornadas++;
    if(h.deck&&h.deck.length){G.deck=h.deck.map(([id,up])=>CARDS[id]?mk(id,up?1:0):null).filter(Boolean)}
    if(h.arma)G.weapon={lv:h.arma.lv||0,path:h.arma.path||null};G._xp=0;G._xp0=h.xp;G._floors=0;salva();render()}catch(e){console.error(e)}return r};
const _ed=onEnemyDeath;onEnemyDeath=function(e){const ja=e&&e.dead;const r=_ed.apply(this,arguments);try{if(!ja&&e){const E=ENEMIES[e.id]||{};ganha(e.minion?2:E.boss?40:E.elite?15:5)}}catch(x){}return r};
function guardar(){if(!G||G._prSalvo)return;G._prSalvo=1;const h=H(G.char);h.deck=G.deck.map(k=>[k.id,k.up?1:0]);h.arma={lv:G.weapon?G.weapon.lv:0,path:G.weapon?G.weapon.path:null};if(G.won)h.vitorias++;else h.tombos++;salva()}
function badge(ch){const h=H(ch),v=nivel(h.xp),tem=h.deck&&h.deck.length;
  return`<div class="pr-badge"><div class="l"><span>Nível</span><b>${v.n}</b></div><div class="pr-bar"><i style="width:${(v.p*100).toFixed(0)}%"></i></div>
   <small>${h.jornadas?`${h.jornadas} jornada${h.jornadas>1?'s':''} · tombou ${h.tombos}×${h.vitorias?` · venceu ${h.vitorias}×`:''}`:'Ainda não desceu à masmorra'}${tem?` · baralho guardado: ${h.deck.length} cartas`:''}</small></div>`}
function telaFinal(){const box=document.querySelector('#screen .stats');if(!box||document.querySelector('.pr-end'))return;const h=H(G.char),antes=nivel(G._xp0||0),agora=nivel(h.xp),ganhou=G._xp||0;
  const d=document.createElement('div');d.className='pr-end';
  d.innerHTML=`<h3>Evolução de ${CHARS[G.char].n}</h3><div class="pr-badge" style="margin:0"><div class="l"><span>Nível</span><b>${agora.n}</b></div><div class="pr-bar"><i style="width:${agora.n>antes.n?0:(antes.p*100).toFixed(0)}%"></i></div><small>+${ganhou} de XP nesta jornada · faltam ${agora.falta-agora.r} para o nível ${agora.n+1}</small></div>
   ${agora.n>antes.n?`<p class="up">Subiu do nível ${antes.n} para o ${agora.n}!</p>`:''}<p>O baralho (${G.deck.length} cartas, com as melhorias) e a arma no nível ${['I','II','III','IV'][G.weapon?G.weapon.lv:0]} ficam com ${CHARS[G.char].n} na próxima jornada.</p>`;
  box.after(d);requestAnimationFrame(()=>requestAnimationFrame(()=>{const i=d.querySelector('.pr-bar i');if(i)i.style.width=(agora.p*100).toFixed(0)+'%'}))}
const _r=render;render=function(){const out=_r.apply(this,arguments);try{
  if(G&&G.stats){const f=G.stats.floors||0;if(G._floors==null)G._floors=f;if(f>G._floors){ganha(3*(f-G._floors));G._floors=f}}
  if(G&&G.screen==='end'){guardar();telaFinal()}
  if(G&&G.char){const hn=document.querySelector('#top .hero');if(hn&&!hn.querySelector('.nv')){const s=document.createElement('span');s.className='nv';s.textContent='Nv '+nivel(H(G.char).xp).n;hn.appendChild(s)}}
  if(!G||UI.choose)document.querySelectorAll('.charc[data-ch]').forEach(b=>{if(!b.querySelector('.pr-badge')){const h3=b.querySelector('h3');if(h3)h3.insertAdjacentHTML('afterend',badge(b.dataset.ch))}});
 }catch(e){console.error(e)}return out};
/* Opções: recomeçar um herói do zero */
const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
  if(pan&&!pan.querySelector('[data-act=prreset]')){const d=document.createElement('div');d.className='optrow';d.innerHTML=`<b>Progresso dos heróis</b><span>Cada herói guarda o baralho, a arma e o nível entre as jornadas. Aqui você apaga o que um herói guardou e ele recomeça do zero.</span><div>${Object.keys(CHARS).map(k=>`<button class="optb" data-act="prreset" data-ch="${k}">${CHARS[k].n}</button>`).join('')}</div>`;
    const ab=pan.querySelector('[data-act=abandonar]');const row=ab&&ab.closest('.optrow');if(row)pan.insertBefore(d,row);else pan.appendChild(d)}return r};
ACT.prreset=el=>{const ch=el.dataset.ch,m=$('#modal');m.innerHTML=`<div class="mbox ds"><h2>Recomeçar ${CHARS[ch].n}?</h2><p>O baralho guardado, a arma e o nível ${nivel(H(ch).xp).n} de ${CHARS[ch].n} serão apagados. Não dá para desfazer.</p><div class="dsb"><button class="btn small" data-act="opcoes">Cancelar</button><button class="btn primary" data-act="prreset2" data-ch="${ch}">Sim, recomeçar</button></div></div>`;m.hidden=false};
ACT.prreset2=el=>{delete PR[el.dataset.ch];salva();toast('Herói recomeçado do zero.');ACT.opcoes()};
})();
