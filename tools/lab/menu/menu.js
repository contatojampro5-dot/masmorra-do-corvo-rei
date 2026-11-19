/* ===== Tela de início e Opções no estilo de jogo grande (v2.39) =====
   - Cena viva em tela cheia: céu com estrelas, lua enorme, nuvens, montanhas, o castelo da torre com janelas acesas,
     corvos rodeando a torre, relâmpagos, névoa e cinzas; o Corvo Rei animado de verdade na sacada de pedra.
     As camadas mexem um pouco com o dedo/mouse (profundidade), sem tremer a tela.
   - "Toque para começar" e depois o menu entra com o logo dourado brilhando.
   - Opções em abas (Som, Jogo, Visual, Sobre) com chaves liga/desliga, botões em grupo e barras de volume novas.
   Monta por cima do jogo no fim do carregamento (tools/lab/montar_menu.py). */
(function(){
const CSS=`
#tsc{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;image-rendering:pixelated;opacity:0;transition:opacity .9s}
#tsc.on{opacity:1}#tsg{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;mix-blend-mode:screen;opacity:0;transition:opacity .9s}#tsg.on{opacity:1}
.page.tx{position:relative;z-index:1;width:100%;height:100%;padding:0;display:block;overflow:hidden}
#tsv{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0;transition:opacity .9s;background:linear-gradient(90deg,#05040be0 0%,#05040b99 30%,transparent 58%)}#tsv.on{opacity:1}
.tx-left{position:absolute;left:max(4vw,env(safe-area-inset-left,0px) + 18px);top:0;bottom:0;width:min(44vw,440px);display:flex;flex-direction:column;justify-content:center;gap:clamp(8px,2.2vh,22px)}
.tx-logo{position:relative;animation:txIn 1.1s cubic-bezier(.2,.8,.2,1) both}
.tx-crown{display:block;width:clamp(38px,6vh,58px);margin:0 0 4px;filter:drop-shadow(0 0 10px #e8c25a88)}
.tx-kick{margin:0;font:600 clamp(9px,1.6vh,12px) var(--f-num);letter-spacing:.42em;text-transform:uppercase;color:#b9a67e;display:flex;align-items:center;gap:10px}
.tx-kick::after{content:"";flex:1;max-width:90px;height:1px;background:linear-gradient(90deg,#e8c25a,transparent)}
.tx-name{position:relative;margin:2px 0 0;font-family:var(--f-disp);font-weight:400;font-size:clamp(38px,9.4vh,92px);line-height:.86;letter-spacing:.005em;
  background:linear-gradient(180deg,#fff6d6 0%,#f2d17e 30%,#b07a24 55%,#f6dc96 74%,#7a5216 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 3px 0 #2a1a08) drop-shadow(0 10px 22px #000)}
.tx-name em{font-style:normal;font-size:.5em;vertical-align:.28em;margin-right:.08em}
.tx-name::after{content:attr(data-t);position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,#ffffffcc 50%,transparent 60%);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:txShine 6s ease-in-out 1.4s infinite;white-space:pre-line}
@keyframes txShine{0%,70%{background-position:120% 0}100%{background-position:-60% 0}}
@keyframes txIn{0%{opacity:0;transform:translateY(14px);filter:blur(6px)}100%{opacity:1;transform:none;filter:none}}
.tx-menu{display:flex;flex-direction:column;gap:clamp(2px,.6vh,6px);margin-top:clamp(4px,1vh,10px)}
.tx-item{--d:0s;position:relative;display:flex;align-items:center;gap:14px;width:100%;padding:clamp(5px,1.3vh,11px) 16px clamp(5px,1.3vh,11px) 14px;border:0;background:none;color:#d8c8a8;text-align:left;cursor:pointer;
  font:400 clamp(16px,3.6vh,24px)/1.05 var(--f-sc);letter-spacing:.04em;opacity:0;animation:txItem .6s cubic-bezier(.2,.8,.2,1) var(--d) forwards;transition:color .2s,transform .25s cubic-bezier(.2,.8,.2,1)}
.tx-item::before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#e8c25a2e,#e8c25a10 60%,transparent);clip-path:inset(0 100% 0 0);transition:clip-path .35s cubic-bezier(.2,.8,.2,1)}
.tx-item::after{content:"";position:absolute;left:0;top:18%;bottom:18%;width:2px;background:#f2d17e;box-shadow:0 0 10px #f2d17e;transform:scaleY(0);transition:transform .25s}
.tx-item i{flex:none;width:clamp(18px,3.4vh,24px);height:clamp(18px,3.4vh,24px);color:#8a7650;transition:color .2s,filter .2s}
.tx-item i svg{width:100%;height:100%;display:block}
.tx-item span{display:flex;flex-direction:column;gap:2px;position:relative}
.tx-item small{font:italic 400 clamp(11px,2vh,14px)/1.1 var(--f-body);letter-spacing:0;color:#8a7c66;max-height:0;opacity:0;overflow:hidden;transition:max-height .3s,opacity .3s}
.tx-item:hover,.tx-item:focus-visible,.tx-item.sel{color:#fff3d6;transform:translateX(8px);outline:none}
.tx-item:hover::before,.tx-item:focus-visible::before,.tx-item.sel::before{clip-path:inset(0 0 0 0)}
.tx-item:hover::after,.tx-item:focus-visible::after,.tx-item.sel::after{transform:scaleY(1)}
.tx-item:hover i,.tx-item:focus-visible i,.tx-item.sel i{color:#f2d17e;filter:drop-shadow(0 0 6px #f2d17e)}
.tx-item:hover small,.tx-item:focus-visible small,.tx-item.sel small{max-height:20px;opacity:1}
.tx-item.primary{color:#ffe7b0;font-size:clamp(19px,4.4vh,30px)}
.tx-item.primary i{color:#e05a3a}
.tx-item.dim{font-size:clamp(12px,2.2vh,15px);color:#6d8a5e}
@keyframes txItem{0%{opacity:0;transform:translateX(-18px)}100%{opacity:1;transform:none}}
.tx-foot{position:absolute;left:0;right:0;bottom:max(10px,env(safe-area-inset-bottom,0px));padding:0 max(4vw,24px);display:flex;justify-content:space-between;align-items:center;font:600 clamp(9px,1.5vh,11px) var(--f-num);letter-spacing:.28em;text-transform:uppercase;color:#7a6e5a;opacity:0;animation:fadeUp .8s ease-out 1.6s forwards;pointer-events:none}
.tx-foot b{color:#b9a67e;font-weight:600}
.tx-press{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:16vh;gap:18px;cursor:pointer;z-index:3;border:0;background:radial-gradient(ellipse at 50% 60%,transparent 30%,#000a 100%);color:#e8d9b8}
.tx-press .tx-name{font-size:clamp(46px,13vh,120px);text-align:center}
.tx-press>p{margin:0;font:600 clamp(11px,2vh,14px) var(--f-num);letter-spacing:.5em;text-transform:uppercase;color:#f2d17e;animation:txPulse 2.2s ease-in-out infinite;text-shadow:0 0 12px #f2d17e88}
.tx-press .tx-logo{text-align:center}.tx-press .tx-crown{margin:0 auto 6px}.tx-press .tx-kick{justify-content:center}.tx-press .tx-kick::before{content:"";flex:1;max-width:90px;height:1px;background:linear-gradient(270deg,#e8c25a,transparent)}
.tx-press.sai{animation:txOut .6s ease-in forwards}
@keyframes txPulse{0%,100%{opacity:.35}50%{opacity:1}}@keyframes txOut{100%{opacity:0;visibility:hidden}}
@media (orientation:portrait){#tsv{background:linear-gradient(0deg,#05040bf0 0%,#05040bb0 40%,transparent 66%),linear-gradient(180deg,#05040bc0,transparent 30%)}.tx-left{left:0;right:0;width:auto;padding:0 22px;justify-content:flex-end;padding-bottom:9vh}
  .tx-logo{position:absolute;top:max(5vh,env(safe-area-inset-top,0px));left:22px;right:22px;text-align:center}.tx-logo .tx-crown{margin:0 auto 4px}.tx-logo .tx-kick{justify-content:center}.tx-name{font-size:clamp(40px,12vw,70px)}.tx-item{font-size:clamp(17px,5vw,22px);padding-top:clamp(4px,1vh,9px);padding-bottom:clamp(4px,1vh,9px)}.tx-menu{gap:0}.tx-foot span+span{display:none}.tx-press .tx-logo{position:relative;top:auto;left:auto;right:auto}.tx-press .tx-name{font-size:clamp(40px,13vw,72px)}.tx-kick{letter-spacing:.22em;font-size:clamp(9px,2.6vw,12px);white-space:nowrap}.tx-kick::after,.tx-press .tx-kick::before{max-width:28px}.tx-item.primary{font-size:clamp(20px,6vw,27px)}}
/* ---- Opções ---- */
#modal .mbox.oa{width:min(980px,100%);max-width:none!important;height:min(92vh,720px);display:grid;grid-template-columns:minmax(150px,210px) 1fr;grid-template-rows:auto 1fr auto;gap:0;align-items:stretch;
  background:linear-gradient(160deg,#1d1610f2,#0d0a08f7);border:1px solid #5a4528;box-shadow:0 0 0 1px #000,0 30px 80px #000d,inset 0 1px 0 #ffffff12;border-radius:6px;overflow:hidden;animation:oaIn .35s cubic-bezier(.2,.8,.2,1)}
@keyframes oaIn{0%{opacity:0;transform:scale(.97) translateY(8px)}100%{opacity:1;transform:none}}
.oa-h{grid-column:1/3;display:flex;align-items:center;gap:14px;padding:clamp(10px,2.2vh,18px) 22px;border-bottom:1px solid #3d3020;background:linear-gradient(90deg,#2a1f14,transparent)}
.oa-h h2{margin:0;font:400 clamp(24px,4.6vh,34px)/1 var(--f-disp);color:#f2d17e;text-shadow:0 2px 0 #2a1a08}.oa-h small{font:600 11px var(--f-num);letter-spacing:.3em;text-transform:uppercase;color:#7a6e5a;margin-left:auto}
.oa-tabs{min-width:0;display:flex;flex-direction:column;gap:2px;padding:12px 0;border-right:1px solid #3d3020;background:#0a0806aa;overflow:auto}
.oa-tab{display:flex;align-items:center;gap:12px;padding:clamp(8px,1.8vh,13px) 18px;border:0;background:none;color:#a89878;font:400 clamp(15px,2.8vh,19px) var(--f-sc);text-align:left;cursor:pointer;position:relative;transition:color .2s,background .2s}
.oa-tab svg{width:20px;height:20px;flex:none;opacity:.8}
.oa-tab::before{content:"";position:absolute;left:0;top:20%;bottom:20%;width:3px;background:#f2d17e;box-shadow:0 0 10px #f2d17e;transform:scaleY(0);transition:transform .25s}
.oa-tab:hover{color:#f0e0c0;background:#ffffff08}.oa-tab.on{color:#fff3d6;background:linear-gradient(90deg,#e8c25a22,transparent)}.oa-tab.on::before{transform:scaleY(1)}.oa-tab.on svg{opacity:1;color:#f2d17e}
.oa-body{min-width:0;overflow:auto;padding:6px clamp(14px,3vw,30px) 16px;scrollbar-width:thin;scrollbar-color:#5a4528 transparent}
.oa-body .optpanel{background:none!important;border:0!important;box-shadow:none!important;padding:0!important}
.oa-body .optrow{display:grid!important;grid-template-columns:1fr auto;grid-template-areas:"b c" "s c";column-gap:20px;row-gap:2px;align-items:center;padding:clamp(10px,2vh,16px) 0!important;border-bottom:1px solid #2e2418!important}
.oa-body .optrow>b{grid-area:b;font:400 clamp(16px,2.8vh,19px) var(--f-sc);color:#f0e0c0}
.oa-body .optrow>span{grid-area:s;font-size:clamp(12px,2.1vh,14px);color:#8a7c66;line-height:1.35}
.oa-body .optrow>div{grid-area:c;display:flex;gap:0;justify-content:flex-end;flex-wrap:wrap}
.oa-body .optrow.vol{grid-template-columns:1fr minmax(160px,42%)}
.oa-body .optrow.vol>div{gap:10px;align-items:center;flex-wrap:nowrap}
.oa-body .optb{margin:0!important;border-radius:0!important;border:1px solid #4a3a26!important;background:#15100b!important;color:#a89878!important;padding:7px 13px!important;font:400 clamp(13px,2.2vh,15px) var(--f-sc)!important;box-shadow:none!important;transition:background .2s,color .2s}
.oa-body .optrow>div>.optb:first-child{border-radius:4px 0 0 4px!important}.oa-body .optrow>div>.optb:last-child{border-radius:0 4px 4px 0!important}.oa-body .optrow>div>.optb:only-child{border-radius:4px!important}
.oa-body .optrow>div>.optb+.optb{border-left:0!important}
.oa-body .optb.on{background:linear-gradient(#5a4220,#3a2a14)!important;color:#fff3d6!important;border-color:#a88a4a!important;box-shadow:inset 0 0 12px #e8c25a33!important}
.oa-body .optb:hover{color:#f0e0c0!important}.oa-body .optb.danger{color:#ff9a8a!important;border-color:#7a2a20!important}
.oa-sw{position:relative;width:54px;height:28px;border-radius:14px;border:1px solid #5a4528;background:#15100b;cursor:pointer;transition:background .25s,border-color .25s;flex:none}
.oa-sw::after{content:"";position:absolute;left:3px;top:3px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#d8c8a8,#7a6a50);box-shadow:0 2px 4px #000a;transition:transform .25s cubic-bezier(.2,.8,.2,1),background .25s}
.oa-sw.on{background:linear-gradient(#6a4a1a,#3a2810);border-color:#c8a050;box-shadow:0 0 12px #e8c25a44}.oa-sw.on::after{transform:translateX(26px);background:radial-gradient(circle at 35% 30%,#fff3c0,#e0a830)}
.oa-body input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;border-radius:3px;background:linear-gradient(90deg,#e0a830 var(--p,50%),#2a2016 var(--p,50%));outline:none;border:1px solid #000}
.oa-body input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3c0,#c88a20);border:2px solid #2a1a08;box-shadow:0 0 10px #e8c25a88;cursor:pointer}
.oa-body input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3c0,#c88a20);border:2px solid #2a1a08}
.oa-body .oa-hide{display:none!important}
.oa-dev{align-self:flex-start;margin-top:18px;border:0;background:none;color:#5a5040;font:600 10px var(--f-num);letter-spacing:.28em;text-transform:uppercase;cursor:pointer;padding:6px 0}.oa-dev:hover{color:#a89878}
#modal .mbox.ds{width:min(380px,100%);padding:22px 24px;gap:12px;background:linear-gradient(160deg,#1d1610f5,#0d0a08f8);border:1px solid #5a4528;border-radius:6px;box-shadow:0 30px 80px #000d;animation:oaIn .3s}
.ds h2{margin:0;font:400 28px var(--f-disp);color:#f2d17e}.ds p{margin:0;color:#a89878;text-align:center}.ds .dserr{color:#ff8a7a}
.ds input{width:150px;text-align:center;font:600 28px var(--f-num);letter-spacing:.5em;padding:8px 0 8px .5em;background:#0a0806;border:1px solid #5a4528;border-radius:4px;color:#f2d17e;outline:none}.ds input:focus{border-color:#e8c25a;box-shadow:0 0 12px #e8c25a44}
.ds .dsb{display:flex;gap:10px}
.oa-sec{margin:14px 0 2px;font:600 10px var(--f-num);letter-spacing:.32em;text-transform:uppercase;color:#7a6e5a}
.oa-f{grid-column:1/3;display:flex;justify-content:space-between;align-items:center;padding:10px 20px;border-top:1px solid #3d3020;background:#0a0806cc;font:600 10px var(--f-num);letter-spacing:.24em;text-transform:uppercase;color:#6a5e4a}
.oa-f .btn{margin:0}
.oa-sobre{display:flex;flex-direction:column;gap:10px;padding:16px 0;color:#a89878;font-size:15px;line-height:1.5}.oa-sobre h3{margin:0;font:400 28px var(--f-disp);color:#f2d17e}.oa-sobre p{margin:0}
@media (orientation:portrait),(max-width:620px){#modal .mbox.oa{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto 1fr auto;height:min(94vh,900px)}.oa-tabs{flex-direction:row;border-right:0;border-bottom:1px solid #3d3020;padding:0 6px;overflow-x:auto}.oa-tab{padding:10px 12px;font-size:15px}.oa-tab::before{left:20%;right:20%;top:auto;bottom:0;width:auto;height:3px;transform:scaleX(0)}.oa-tab.on::before{transform:scaleX(1)}.oa-h,.oa-f{grid-column:1}
  .oa-body .optrow,.oa-body .optrow.vol{grid-template-columns:1fr;grid-template-areas:"b" "s" "c"}.oa-body .optrow>div{justify-content:flex-start;margin-top:6px}}
`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);

/* ---------------- ícones ---------------- */
const IC={
 new:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 19L17 7M14 4l6 0 0 6M4 15l5 5M3 21l3-3"/></svg>',
 cont:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l13 8-13 8z"/></svg>',
 howto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h7a2 2 0 012 2v13a2 2 0 00-2-2H4zM20 5h-7a2 2 0 00-2 2v13a2 2 0 012-2h7z"/></svg>',
 herois:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M12 8v6M9 11h6"/></svg>',
 cenas:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="13" rx="1"/><path d="M3 10h18M7 6l2 4M12 6l2 4M17 6l2 4"/></svg>',
 opcoes:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>',
 dev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/></svg>',
 som:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13"/></svg>',
 jogo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="11" height="16" rx="1.5" transform="rotate(-8 9 11)"/><rect x="10" y="5" width="10" height="15" rx="1.5" transform="rotate(8 15 12)"/></svg>',
 visual:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 sobre:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>'};
const COROA='<svg class="tx-crown" viewBox="0 0 64 40"><defs><linearGradient id="txg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c0"/><stop offset=".5" stop-color="#e0a830"/><stop offset="1" stop-color="#7a5216"/></linearGradient></defs><path d="M6 34L2 8l15 12L32 2l15 18L62 8l-4 26z" fill="url(#txg)" stroke="#2a1a08" stroke-width="2"/><circle cx="32" cy="22" r="4" fill="#b03a3a"/><circle cx="17" cy="26" r="2.6" fill="#3a6ab0"/><circle cx="47" cy="26" r="2.6" fill="#3a9a5a"/><path d="M8 30h48" stroke="#2a1a08" stroke-width="2"/></svg>';
const VER='v2.53';
const logo=()=>`<div class="tx-logo">${COROA}<p class="tx-kick">A Coroa de Cinco Juramentos</p><h1 class="tx-name" data-t="Masmorra&#10;do Corvo Rei">Masmorra<br><em>do</em> Corvo Rei</h1></div>`;

/* ---------------- tela de início ---------------- */
const _th=titleHTML;
function novoTitulo(){if(UI.choose||OPT.menuNovo===false)return _th.apply(this,arguments);
  const sv=loadSave(),cont=sv&&sv.screen!=='end';
  const it=(act,ic,t,s,cls='')=>`<button class="tx-item ${cls}" data-act="${act}"><i>${IC[ic]}</i><span>${t}<small>${s}</small></span></button>`;
  const items=[cont?it('cont','cont','Continuar',`${CHARS[sv.char]?CHARS[sv.char].n:'Jornada salva'} · Ato ${sv.act||1}`,'primary'):'',
    it('new','new','Nova jornada','Escolha um herói e desça à masmorra',cont?'':'primary'),
    it('herois','herois','Heróis','Os cinco que juraram tomar a coroa'),
    it('compendio','howto','Compêndio','Cartas, relíquias, bestiário e trilha'),
    it('cenas','cenas','Cenas','Reveja a história do reino'),
    it('howto','howto','Como jogar','Cartas, energia e intenções'),
    it('opcoes','opcoes','Opções','Som, jogo e visual'),
    it('creditos','sobre','Créditos','Quem fez a masmorra','dim'),
    ''].filter(Boolean);
  const press=!UI.txOk?`<button class="tx-press" data-act="txpress" aria-label="Começar">${logo()}<p>Toque para começar</p></button>`:'';
  return`<div class="page tx">${press}${UI.txOk?`<div class="tx-left">${logo()}<nav class="tx-menu" aria-label="Menu">${items.map((h,i)=>h.replace('class="tx-item',`style="--d:${(.35+i*.08).toFixed(2)}s" class="tx-item`)).join('')}</nav></div>`:''}
   <div class="tx-foot"><span><b>${VER}</b> · 5 heróis · 3 atos · 1 coroa</span><span>${UI.txOk?'Feito com cuidado no Olimpo':''}</span></div></div>`}
ACT.txpress=()=>{const p=document.querySelector('.tx-press');UI.txOk=true;try{sfx('botao',{vol:.8})}catch(e){}try{MUS.unlocked=true;musApply&&musApply()}catch(e){}if(p){p.classList.add('sai');setTimeout(render,380)}else render();CEN.raio=1};
addEventListener('keydown',e=>{if(!G&&!UI.txOk&&document.querySelector('.tx-press')&&(e.key==='Enter'||e.key===' ')){e.preventDefault();ACT.txpress()}
  if(!G&&UI.txOk&&!UI.choose&&document.querySelector('.tx-menu')&&$('#modal').hidden&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();const b=[...document.querySelectorAll('.tx-item')],i=b.indexOf(document.activeElement);b[(i+(e.key==='ArrowDown'?1:-1)+b.length)%b.length].focus()}});
document.addEventListener('pointerover',e=>{const b=e.target.closest&&e.target.closest('.tx-item,.oa-tab');if(b&&b!==CEN.ultHover){CEN.ultHover=b;try{sfx('botao',{vol:.25,rate:1.3})}catch(_){}}});

/* ---------------- a cena viva ---------------- */
const CEN={on:false,px:null,gl:null,W:320,H:180,t0:0,last:0,mx:0,my:0,tx:0,ty:0,raio:0,raioPts:null,camadas:null,corvos:[],cinzas:[],rv:{anim:'parado',f:0,t:0,prox:7000},ultHover:null};window.CEN=CEN;
const rnd=s=>{s=s>>>0;return()=>(s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296};
function cv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function ligarCena(){let px=document.getElementById('tsc'),gl=document.getElementById('tsg');
  if(!px){px=cv(320,180);px.id='tsc';gl=cv(160,90);gl.id='tsg';const vg=document.createElement('div');vg.id='tsv';const bg=document.getElementById('bg');if(bg)bg.after(px,gl,vg);else document.body.prepend(px,gl,vg);
    addEventListener('resize',()=>{CEN.camadas=null});addEventListener('pointermove',e=>{CEN.tx=(e.clientX/innerWidth-.5)*2;CEN.ty=(e.clientY/innerHeight-.5)*2},{passive:true})}
  CEN.px=px;CEN.gl=gl;px.classList.add('on');gl.classList.add('on');document.getElementById('tsv')?.classList.add('on');if(!CEN.on){CEN.on=true;CEN.last=performance.now();requestAnimationFrame(tick)}}
function desligarCena(){CEN.on=false;document.getElementById('tsc')?.classList.remove('on');document.getElementById('tsg')?.classList.remove('on');document.getElementById('tsv')?.classList.remove('on')}
function tamanho(){const ret=innerWidth>=innerHeight,W=ret?320:200,H=Math.round(W*innerHeight/innerWidth);return{W,H}}
/* camadas paradas (desenhadas uma vez) */
function montarCamadas(){const{W,H}=tamanho();CEN.W=W;CEN.H=H;CEN.px.width=W;CEN.px.height=H;CEN.gl.width=Math.ceil(W/2);CEN.gl.height=Math.ceil(H/2);const ret=W>H*1.1,r=rnd(11),GY=ret?H-26:Math.round(H*.5);
  const L={};
  // céu
  const ceu=cv(W,H),c=ceu.getContext('2d'),g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#04030a');g.addColorStop(.45,'#0f0c26');g.addColorStop(.78,'#2a1a40');g.addColorStop(1,'#4a2a48');c.fillStyle=g;c.fillRect(0,0,W,H);
  L.estrelas=Array.from({length:Math.round(W*H/220)},()=>[r()*W,r()*H*.7,r()]);L.ceu=ceu;
  // lua
  const lx=ret?W*.64:W*.72,ly=ret?H*.22:GY-92,lr=ret?24:20;L.lua={x:lx,y:ly,r:lr};const lu=cv(lr*2+4,lr*2+4),q=lu.getContext('2d');q.fillStyle='#efe6cf';q.beginPath();q.arc(lr+2,lr+2,lr,0,7);q.fill();
  q.fillStyle='#d8ccae';for(let i=0;i<9;i++){q.beginPath();q.arc(lr+2+(r()-.5)*lr*1.3,lr+2+(r()-.5)*lr*1.3,2+r()*lr*.22,0,7);q.fill()}q.fillStyle='#fff8e6';q.beginPath();q.arc(lr-4,lr-6,lr*.5,0,7);q.globalAlpha=.25;q.fill();L.luaC=lu;
  // montanhas (duas camadas)
  const mont=(cor,alt,amp,seed)=>{const m=cv(W+20,H),x=m.getContext('2d'),rr=rnd(seed),b=GY-alt;x.fillStyle=cor;x.beginPath();x.moveTo(0,H);let y=b;for(let i=0;i<=W+20;i+=4){y+=(rr()-.5)*amp;y=Math.max(b-amp*3,Math.min(b+amp*2,y));x.lineTo(i,y)}x.lineTo(W+20,H);x.fill();return m};
  L.m1=mont('#140f2a',36,7,3);L.m2=mont('#0b0918',18,5,5);
  // castelo da torre (v2.46): morro de pedra, muralha com ameias, portão em arco, torres redondas com telhado cônico,
  // torre de menagem e a torre alta do Corvo Rei com a janela roxa; luz da lua no lado direito de cada parte
  const cas=cv(W,H),k=cas.getContext('2d'),cx=Math.round(ret?W*.5:W*.3),base=GY-16,jan=[],flags=[],SC=ret?Math.min(1,(base-8)/150):Math.min(1,(base-H*.24)/150),X=v=>cx+(v-cx)*SC,Y=v=>base+(v-base)*SC;
  const C0='#0f0c1e',C1='#15122a',RIM='#3c3874',RIM2='#5c58a8',TETO='#0b0918',TRIM='#2e2a5a';
  const R=(x,y,w,h,c)=>{k.fillStyle=c;k.fillRect(Math.round(X(x)),Math.round(Y(y)),Math.max(1,Math.round(w*SC)),Math.max(1,Math.round(h*SC)))};
  const ameias=(x,y,w,c=C0)=>{for(let i=0;i<w-1;i+=4)R(x+i,y-3,2,3,c)};
  const cone=(x,y,w,h)=>{for(let j=0;j<h;j++){const ww=Math.max(1,Math.round((w+2)*(1-j/h)));R(x+w/2-ww/2,y-j,ww,1,TETO);R(x+w/2+ww/2-1,y-j,1,1,TRIM)}R(x-1,y,w+2,1,TRIM);flags.push([X(x+w/2),Y(y-h)])};
  const torre=(x,y0,w,h,o={})=>{R(x,y0-h,w,h,o.c||C0);R(x+w-1,y0-h,1,h,RIM);if(o.lado)R(x+w-2,y0-h,1,h,C1);
    if(o.ameia)ameias(x,y0-h,w,o.c||C0);if(o.cone)cone(x,y0-h,w,o.cone);
    for(let jy=y0-h+6;jy<y0-6;jy+=o.dj||10)if(r()<(o.pj||.6))jan.push([Math.round(X(x+w/2-1)),Math.round(Y(jy)),r()])};
  // morro de pedra com bordas quebradas
  k.fillStyle=C0;k.beginPath();k.moveTo(X(cx-96),H);let hy=base+20;for(let x=-96;x<=96;x+=4){const t=Math.abs(x)/96;hy=base+2+t*t*26+(r()-.5)*4;k.lineTo(X(cx+x),Math.round(Y(hy)))}k.lineTo(X(cx+96),H);k.fill();
  for(let x=-70;x<=80;x+=3){const t=Math.abs(x)/96,yy=Math.round(base+2+t*t*26);if(x>0&&r()<.6)R(cx+x,yy,2,1,RIM)}
  for(let i=0;i<14;i++){const x=cx-60+r()*130,y=base+6+r()*18;R(x,y,3+r()*5,1,C1)}
  // muralha
  const mx=cx-50,mw=100,mh=20;R(mx,base-mh,mw,mh+4,C0);ameias(mx,base-mh,mw);R(mx,base-mh,mw,1,TRIM);R(mx+mw-1,base-mh,1,mh,RIM);
  for(let i=0;i<5;i++)R(mx+8+i*20,base-mh+8,1,3,'#06050c');
  // portão com arco, grade e luz dentro
  const gx=cx-6;torre(gx-10,base,8,30,{ameia:1,cone:10,pj:0});torre(gx+14,base,8,30,{ameia:1,cone:10,pj:0});R(gx-2,base-26,16,26,C0);ameias(gx-2,base-26,16);
  for(let j=0;j<14;j++){const ww=j<4?Math.round(10*Math.sqrt(1-((4-j)/4)**2)):10;R(gx+6-ww/2,base-14+j,ww,1,'#2a1408')}
  for(let j=0;j<12;j++)R(gx+1,base-12+j,10,1,j%3?'#5a2a10':'#3a1a08');for(let i=0;i<5;i++)R(gx+2+i*2,base-13,1,13,'#120806');
  L.portao=[X(gx+6),Y(base-6)];
  // torre de menagem atrás
  torre(cx-30,base-mh+4,40,46,{ameia:1,pj:0});R(cx-31,base-mh-42,42,1,TRIM);
  for(const[wx,wy]of[[cx-24,base-mh-30],[cx-14,base-mh-30],[cx-4,base-mh-30],[cx-24,base-mh-16],[cx-4,base-mh-16]]){R(wx,wy,3,5,'#06050c');R(wx,wy,3,1,C1);jan.push([Math.round(X(wx)),Math.round(Y(wy+1)),r()])}
  torre(cx-36,base-mh-20,8,22,{cone:14,pj:0});torre(cx+6,base-mh-20,8,24,{cone:16,pj:0});
  // torres redondas dos cantos (com faixas de luz da lua)
  for(const[tx,th,tc]of[[mx-8,44,20],[mx+mw-6,50,22]]){torre(tx,base,14,th,{lado:1,cone:tc,dj:9,pj:.7});for(let jy=base-th+4;jy<base;jy+=12)R(tx,jy,14,1,C1)}
  // a torre alta do Corvo Rei
  const ax=cx+16,ah=104;torre(ax,base-mh+4,12,ah,{lado:1,ameia:1,dj:12,pj:.55});cone(ax,base-mh+4-ah,12,26);
  R(ax-2,base-mh+4-ah+10,16,2,C0);R(ax-2,base-mh+4-ah+10,16,1,TRIM);
  L.cas=cas;L.jan=jan;L.flags=flags;L.topo=[X(ax+6),Y(base-mh+4-ah-26)];L.janTopo=[Math.round(X(ax+4)),Math.round(Y(base-mh+4-ah+16))];
  // sacada de pedra do Corvo Rei (frente)
  const fr=cv(W,H),f=fr.getContext('2d'),rx=ret?W*.79:W*.68,ry=ret?GY-6:GY-2;L.rei=[rx,ry];f.fillStyle='#08070d';
  f.beginPath();f.moveTo(0,H);f.lineTo(0,GY+8);for(let i=0;i<=W;i+=6)f.lineTo(i,GY+8+Math.sin(i*.09)*3+r()*3);f.lineTo(W,H);f.fill();
  f.beginPath();f.moveTo(rx-44,H);f.lineTo(rx-40,ry+2);f.lineTo(rx+44,ry);f.lineTo(rx+50,H);f.fill();f.fillStyle='#1a1830';f.fillRect(rx-40,ry,84,1);
  for(const px of [rx-38,rx+36]){f.fillStyle='#0c0b14';f.fillRect(px,ry-16,6,16);f.fillRect(px-1,ry-18,8,3);f.fillStyle='#1c1a30';f.fillRect(px,ry-16,1,16)}
  // grama alta e um estandarte rasgado
  f.fillStyle='#06050a';for(let i=0;i<W;i+=2){const h=3+r()*7;f.fillRect(i,GY+6-h,1,h)}
  L.frente=fr;L.GY=GY;L.ret=ret;
  CEN.camadas=L;CEN.corvos=Array.from({length:7},(_,i)=>({a:r()*6.28,r:14+r()*18,v:.006+r()*.006,y:r()*10,ph:r()*6}));CEN.cinzas=[]}
const LUZ={dir:1,col:[170,160,255],amb:[50,36,80]};
const RQ=new Map();function quadroRei(an,f){const k=an+'|'+f;let q=RQ.get(k);if(!q){try{q=BICHO.quadro('reicorvo',BICHO.seq('reicorvo',an)[f],LUZ)}catch(e){q=null}if(RQ.size>300)RQ.clear();RQ.set(k,q)}return q}
const GC={};function bola(x,X,Y,r,c,a){if(a<=0)return;let g=GC[c];if(!g){g=cv(64,64);const q=g.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,64,64);GC[c]=g}x.globalAlpha=Math.min(1,a);x.drawImage(g,X-r,Y-r,r*2,r*2);x.globalAlpha=1}
function tick(t){if(!CEN.on)return;requestAnimationFrame(tick);if(document.hidden)return;const passo=OPT.bateria==='maxima'?400:OPT.bateria==='economia'?66:40;if(t-CEN.last<passo)return;const k=Math.min(3,(t-CEN.last)/40);CEN.last=t;
  try{desenha(t,k)}catch(e){console.error(e);CEN.on=false}}
function desenha(t,k){if(!CEN.camadas||CEN.px.width!==tamanho().W)montarCamadas();const L=CEN.camadas,W=CEN.W,H=CEN.H,x=CEN.px.getContext('2d'),g=CEN.gl.getContext('2d');x.imageSmoothingEnabled=false;
  CEN.mx+=(CEN.tx-CEN.mx)*.05*k;CEN.my+=(CEN.ty-CEN.my)*.05*k;const pr=d=>[Math.round(-CEN.mx*d),Math.round(-CEN.my*d*.5)];
  x.drawImage(L.ceu,0,0);
  for(const[sx,sy,s]of L.estrelas){const a=.25+.6*Math.abs(Math.sin(t*.0011*(1+s)+sx));x.fillStyle=`rgba(230,235,255,${a*s})`;x.fillRect(Math.round(sx+pr(1)[0]),Math.round(sy),1,1)}
  // estrela cadente
  if(!CEN.cad&&Math.random()<.004*k)CEN.cad={x:Math.random()*W,y:Math.random()*H*.3,l:1};if(CEN.cad){const c=CEN.cad;c.x+=3*k;c.y+=1.2*k;c.l-=.04*k;for(let i=0;i<8;i++){x.fillStyle=`rgba(255,250,230,${c.l*(1-i/8)})`;x.fillRect(Math.round(c.x-i*2.5),Math.round(c.y-i),1,1)}if(c.l<=0)CEN.cad=null}
  const lu=L.lua,[lx,ly]=pr(2);g.clearRect(0,0,g.canvas.width,g.canvas.height);g.globalCompositeOperation='lighter';bola(g,(lu.x+lx)/2,(lu.y+ly)/2,lu.r*2.2,'rgb(150,160,255)',.35);bola(g,(lu.x+lx)/2,(lu.y+ly)/2,lu.r*.9,'rgb(255,250,230)',.25);
  x.drawImage(L.luaC,Math.round(lu.x-lu.r-2+lx),Math.round(lu.y-lu.r-2+ly));
  // nuvens passando na lua
  for(let i=0;i<5;i++){const v=.004+i*.002,cx=((t*v+i*97)%(W+160))-80,cy=H*(.14+i*.06);x.fillStyle=i%2?'rgba(14,12,30,.78)':'rgba(24,20,44,.6)';for(let j=0;j<5;j++){x.beginPath();x.ellipse(cx+j*12-24,cy+Math.sin(j*1.7)*2,16-j%2*4,3+j%3,0,0,7);x.fill()}}
  const[m1x]=pr(3),[m2x]=pr(5);x.drawImage(L.m1,m1x-10,0);x.drawImage(L.m2,m2x-10,0);
  // relâmpago
  if(!CEN.raio&&Math.random()<.0025*k)CEN.raio=1;if(CEN.raio>0){if(!CEN.raioPts){let rx=L.topo[0]+(Math.random()-.5)*120,ry=0;CEN.raioPts=[];while(ry<H*.55){CEN.raioPts.push([rx,ry]);rx+=(Math.random()-.5)*12;ry+=5+Math.random()*7}}
    g.fillStyle=`rgba(200,210,255,${CEN.raio*.5})`;g.fillRect(0,0,g.canvas.width,g.canvas.height);if(CEN.raio>.5){x.strokeStyle='#f4f6ff';x.lineWidth=1;x.beginPath();CEN.raioPts.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke()}
    CEN.raio-=.07*k;if(CEN.raio<=0){CEN.raio=Math.random()<.35?.6:0;CEN.raioPts=null}}
  const[cx2,cy2]=pr(7);x.drawImage(L.cas,cx2,cy2);
  for(const[jx,jy,s]of L.jan){const a=.55+.45*Math.sin(t*.004*(1+s)+jx);x.fillStyle=s>.85?`rgba(190,120,255,${a})`:`rgba(255,${150+a*60|0},70,${a})`;x.fillRect(jx+cx2,jy+cy2,2,3);bola(g,(jx+cx2+1)/2,(jy+cy2)/2,4,s>.85?'rgb(170,110,255)':'rgb(255,160,70)',a*.45)}
  const[tx0,ty0]=L.janTopo;const pul=.6+.4*Math.sin(t*.002);x.fillStyle=`rgba(200,140,255,${pul})`;x.fillRect(tx0+cx2,ty0+cy2,3,5);bola(g,(tx0+cx2+1)/2,(ty0+cy2+2)/2,12,'rgb(170,100,255)',pul*.6);
  for(const[fx0,fy0]of L.flags||[]){x.fillStyle='#0b0918';x.fillRect(Math.round(fx0+cx2),Math.round(fy0+cy2-5),1,5);for(let i=1;i<=6;i++){const o=Math.round(Math.sin(t*.006+i*.7+fx0)*1.2*i/6);x.fillStyle=i<5?'#6a1a2a':'#4a1020';x.fillRect(Math.round(fx0+cx2+i),Math.round(fy0+cy2-5+o),1,i<5?2:1)}}
  if(L.portao){const[px0,py0]=L.portao;bola(g,(px0+cx2)/2,(py0+cy2)/2,10,'rgb(255,140,50)',.35+.12*Math.sin(t*.01))}
  // corvos rodeando a torre
  for(const c of CEN.corvos){c.a+=c.v*k;c.ph+=.5*k;const X=L.topo[0]+cx2+Math.cos(c.a)*c.r*1.6,Y=L.topo[1]+cy2+8+Math.sin(c.a)*c.r*.4+c.y,asa=Math.sin(c.ph)>0?-1:1;x.fillStyle='#05040a';x.fillRect(Math.round(X),Math.round(Y),2,1);x.fillRect(Math.round(X-2),Math.round(Y+asa),2,1);x.fillRect(Math.round(X+2),Math.round(Y+asa),2,1)}
  // névoa
  g.globalCompositeOperation='lighter';for(let i=0;i<7;i++){const fx=((t*.004*(1+i%3)+i*70)%(W+120))-60,fy=L.GY-6+i%3*6;bola(g,fx/2,fy/2,26+i%3*8,'rgb(110,90,160)',.16)}
  const[fx2,fy2]=pr(11);x.drawImage(L.frente,fx2,fy2);
  // o Corvo Rei
  const rv=CEN.rv,B=BICHOS&&BICHOS.reicorvo;if(B){const A=B.A[rv.anim],n=BICHO.seq('reicorvo',rv.anim).length;rv.t+=40*k;while(rv.t>=1000/A.fps){rv.t-=1000/A.fps;rv.f++;if(rv.f>=n){rv.f=0;if(rv.anim!=='parado')rv.anim='parado'}}
    rv.prox-=40*k;if(rv.prox<=0&&rv.anim==='parado'){rv.prox=9000+Math.random()*6000;const op=['buff','defesa','especial'].filter(a=>B.A[a]);rv.anim=op[Math.floor(Math.random()*op.length)];rv.f=0}
    const q=quadroRei(rv.anim,rv.f);if(q){const s=L.ret?1:1.1,gy=B.GY||70,[rx,ry]=L.rei;x.drawImage(q,Math.round(rx-q.width*s/2+fx2),Math.round(ry-gy*s+fy2),Math.round(q.width*s),Math.round(q.height*s));
      bola(g,(rx+fx2)/2,(ry-40*s)/2,30,'rgb(140,80,255)',.22+.1*Math.sin(t*.003));if(q.flash>0){g.fillStyle=`rgba(230,220,255,${q.flash*.4})`;g.fillRect(0,0,g.canvas.width,g.canvas.height)}}}
  // cinzas e brasas roxas subindo
  if(Math.random()<.6*k)CEN.cinzas.push({x:Math.random()*W,y:H+2,vx:(Math.random()-.5)*.3,vy:-(.2+Math.random()*.4),l:1,c:Math.random()<.3?'#c8a0ff':'#8a7aa0'});
  for(let i=CEN.cinzas.length-1;i>=0;i--){const p=CEN.cinzas[i];p.x+=(p.vx+Math.sin((t+i*90)*.002)*.15)*k;p.y+=p.vy*k;p.l-=.004*k;if(p.l<=0||p.y<0){CEN.cinzas.splice(i,1);continue}x.fillStyle=p.c;x.globalAlpha=p.l;x.fillRect(Math.round(p.x),Math.round(p.y),1,1);x.globalAlpha=1}
  if(CEN.cinzas.length>220)CEN.cinzas.splice(0,CEN.cinzas.length-220);
  // vinheta
  g.globalCompositeOperation='source-over'}
/* ---------------- Opções em abas ---------------- */
const ABAS=[['som','Som'],['jogo','Jogo'],['visual','Visual'],['sobre','Sobre']];
function abaDe(row){if(row.querySelector('input[data-vol]'))return'som';const k=row.querySelector('[data-k]')?.dataset.k||'',a=row.querySelector('[data-act]')?.dataset.act||'',h=row.querySelector('a[href]');
  if(h)return'sobre';if(['cenas','fala','falasLuta','vib'].includes(k)||['optreset','tutreset','abandonar','prreset'].includes(a))return'jogo';return'visual'}
function opcoesAbas(){const m=$('#modal'),box=m.querySelector('.mbox'),pan=m.querySelector('.optpanel');if(!box||!pan||box.classList.contains('oa'))return;
  const aba=UI.optAba||'som',rows=[...pan.querySelectorAll(':scope>.optrow')];
  rows.forEach(r=>{r.dataset.aba=abaDe(r);if(r.querySelector('input[type=range]'))r.classList.add('vol');
    // pares Ligado/Desligado viram uma chave
    const bs=[...r.querySelectorAll(':scope>div>.optb[data-v]')];if(bs.length===2&&bs.every(b=>b.dataset.v==='true'||b.dataset.v==='false')){const on=bs.find(b=>b.dataset.v==='true').classList.contains('on'),sw=document.createElement('button');sw.className='oa-sw'+(on?' on':'');sw.setAttribute('role','switch');sw.setAttribute('aria-checked',on);sw.setAttribute('aria-label',r.querySelector('b')?.textContent||'');
      sw.onclick=()=>{sw.classList.toggle('on');setTimeout(()=>bs.find(b=>b.dataset.v===(on?'false':'true')).click(),160)};bs.forEach(b=>b.style.display='none');bs[0].parentNode.appendChild(sw)}
    r.querySelectorAll('input[type=range]').forEach(inp=>{const f=()=>inp.style.setProperty('--p',((inp.value-(inp.min||0))/((inp.max||100)-(inp.min||0))*100)+'%');f();inp.addEventListener('input',f)})});
  const foot=box.querySelector('.mfoot');
  box.className='mbox oa';box.removeAttribute('style');
  const h=document.createElement('div');h.className='oa-h';h.innerHTML=`<h2>Opções</h2><small>${G?'Jornada em andamento':'Menu principal'}</small>`;
  const tabs=document.createElement('nav');tabs.className='oa-tabs';tabs.innerHTML=ABAS.map(([k,n])=>`<button class="oa-tab ${k===aba?'on':''}" data-aba="${k}">${IC[k]}${n}</button>`).join('');
  const body=document.createElement('div');body.className='oa-body';body.appendChild(pan);
  const sobre=document.createElement('div');sobre.className='oa-sobre';sobre.dataset.aba='sobre';sobre.innerHTML=`<h3>Masmorra do Corvo Rei</h3><p>Um roguelike de cartas em pixel art. Cinco heróis, três atos e uma coroa para derrubar.</p><p style="color:#7a6e5a">Versão ${VER} · feito pelo Theo com o Olimpo.</p>`+(DEVOK?`<div class="optrow" style="border:0!important"><b>Modo desenvolvedor</b><span>Ferramentas de teste (painel DEV, semente, atalhos). F2 abre e fecha o painel.</span><div><button class="optb ${UI.dev?'on':''}" data-act="dev">${UI.dev?'Ligado':'Desligado'}</button><button class="optb" data-act="devsair">Sair do DEV</button></div></div>`:`<button class="oa-dev" data-act="devsenha">Acesso de desenvolvedor</button>`);pan.appendChild(sobre);
  const f=document.createElement('div');f.className='oa-f';f.innerHTML=`<span>Esc para fechar</span>`;if(foot){foot.querySelectorAll('button').forEach(b=>f.appendChild(b));foot.remove()}
  box.innerHTML='';box.append(h,tabs,body,f);h.querySelector('h2');box.querySelector('.h2')?.remove();
  const mostra=a=>{UI.optAba=a;tabs.querySelectorAll('.oa-tab').forEach(b=>b.classList.toggle('on',b.dataset.aba===a));pan.querySelectorAll(':scope>[data-aba]').forEach(r=>r.classList.toggle('oa-hide',r.dataset.aba!==a));body.scrollTop=0};
  tabs.querySelectorAll('.oa-tab').forEach(b=>b.onclick=()=>{try{sfx('botao',{vol:.5})}catch(e){}mostra(b.dataset.aba)});mostra(aba)}
addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('#modal .mbox.oa')&&!$('#modal').hidden){try{closeModal()}catch(_){} }});
/* ---------------- DEV só com senha ---------------- */
ACT.devsenha=()=>{const m=$('#modal');m.innerHTML=`<div class="mbox ds"><h2>Acesso de desenvolvedor</h2><p>Digite a senha para abrir as ferramentas de teste.</p>
  <input id="dsin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" aria-label="Senha"><p class="dserr" hidden>Senha errada.</p>
  <div class="dsb"><button class="btn small" data-act="mclose">Cancelar</button><button class="btn primary" id="dsok">Entrar</button></div></div>`;m.hidden=false;
  const i=m.querySelector('#dsin'),ok=()=>{if(i.value==='000'){DEVOK=true;try{sessionStorage.setItem('trc-devok','1')}catch(e){}UI.optAba='sobre';try{sfx('moedas')}catch(e){}closeModal();toast('Modo DEV liberado. Ligue em Opções → Sobre ou com F2.');render()}else{m.querySelector('.dserr').hidden=false;i.value='';i.focus();m.querySelector('.mbox').animate([{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'none'}],{duration:240})}};
  m.querySelector('#dsok').onclick=ok;i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();ok()}};setTimeout(()=>i.focus(),50)};
ACT.devsair=()=>{DEVOK=false;UI.dev=false;UI.devOpen=false;try{sessionStorage.removeItem('trc-devok');localStorage.setItem('trc-dev','0')}catch(e){}ACT.opcoes();render()};
const _dev=ACT.dev;ACT.dev=function(){if(!DEVOK)return ACT.devsenha();const r=_dev.apply(this,arguments);if(document.querySelector('#modal .mbox.oa'))ACT.opcoes();return r};
/* ---------------- ligar tudo depois que o jogo inteiro carregou ---------------- */
function instalar(){titleHTML=novoTitulo;
  const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);if(OPT.menuNovo!==false)try{opcoesAbas()}catch(e){console.error(e)}return r};
  const _r=render;render=function(){const r=_r.apply(this,arguments);try{const naTela=!G&&!UI.choose&&OPT.menuNovo!==false&&document.querySelector('.page.tx');if(naTela)ligarCena();else desligarCena()}catch(e){console.error(e)}return r};
  if(OPT.menuNovo===undefined)OPT.menuNovo=true;
  try{if(!G)render()}catch(e){}}
if(document.readyState==='complete')setTimeout(instalar,0);else addEventListener('load',()=>setTimeout(instalar,0));
})();
