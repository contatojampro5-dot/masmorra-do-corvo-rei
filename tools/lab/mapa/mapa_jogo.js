/* ===== Mapa novo: corte da masmorra deitado (v2.51, aprovado pelo Theo) =====
   Atos 1 e 2: a masmorra vista em corte. Superfície com o poço de mina, escada e saídas laterais para o Andar 1;
   cada andar é uma coluna e o caminho vai para a direita descendo; túneis escorados com tochas; cada lugar é diferente
   (formato da entrada + cena do tipo); escuridão com a lanterna do herói; rio, cristais e o portão do chefe com lava.
   Toque num lugar marcado: o herói anda até lá pelo túnel e o lugar começa. Arraste para olhar em volta;
   "Ver mapa inteiro" mostra tudo aceso. O Ato 3 (a torre) continua com o mapa antigo. Opções → "Mapa novo". */
(function(){
const PI=Math.PI,R=Math.random;
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const GC={};function bola(x,X,Y,r,c,a){if(a<=0)return;let g=GC[c];if(!g){g=cv(64,64);const q=g.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,64,64);GC[c]=g}x.globalAlpha=Math.min(1,a);x.drawImage(g,X-r,Y-r,r*2,r*2);x.globalAlpha=1}
function texto(x,t,X,Y,cor='#f2d17e',tam=9){x.font=`${tam}px "IM Fell English SC",serif`;x.textAlign='center';x.fillStyle='#000';x.fillText(t,X+1,Y+1);x.fillStyle=cor;x.fillText(t,X,Y)}
/* ---------- desenho de cada lugar: formato da entrada + cena do tipo, com variação por lugar ---------- */
const sr=n=>{let v=(n.r*977+n.c*131+7)>>>0;return()=>(v=(Math.imul(v,1664525)+1013904223)>>>0)/4294967296};
const PX=(x,c,X,Y,w=1,h=1)=>{x.fillStyle=c;x.fillRect(Math.round(X),Math.round(Y),w,h)};
function boca(x,forma,X,Y,w,h){x.fillStyle='#090605';
  if(forma===0){x.beginPath();x.ellipse(X,Y-h*.45,w*.55,h*.55,0,PI,0);x.lineTo(X+w*.55,Y);x.lineTo(X-w*.55,Y);x.fill()}// boca redonda
  else if(forma===1){x.fillRect(X-w/2,Y-h,w,h);PX(x,'#5a3a1e',X-w/2-2,Y-h-2,w+4,3);PX(x,'#4a2e16',X-w/2-2,Y-h,3,h);PX(x,'#4a2e16',X+w/2-1,Y-h,3,h);PX(x,'#6a4828',X-w/2-2,Y-h-2,w+4,1)}// moldura de mina
  else if(forma===2){x.beginPath();x.moveTo(X-w/2,Y);x.lineTo(X-w/2,Y-h*.55);x.arc(X,Y-h*.55,w/2,PI,0);x.lineTo(X+w/2,Y);x.fill();for(let k=0;k<9;k++){const a=PI+k*PI/8;PX(x,k===4?'#8a8070':'#5a5248',X+Math.cos(a)*(w/2+1)-1,Y-h*.55+Math.sin(a)*(w/2+1)-1,3,3)}}// arco de pedra
  else if(forma===3){x.beginPath();x.moveTo(X-w*.4,Y);x.lineTo(X-w*.3,Y-h*.5);x.lineTo(X-w*.1,Y-h*.6);x.lineTo(X-w*.05,Y-h);x.lineTo(X+w*.15,Y-h*.7);x.lineTo(X+w*.35,Y-h*.4);x.lineTo(X+w*.45,Y);x.fill()}// fenda
  else{x.beginPath();x.moveTo(X-w/2,Y);x.lineTo(X-w/2,Y-h*.6);x.arc(X,Y-h*.6,w/2,PI,0);x.lineTo(X+w/2,Y);x.fill();for(let k=-w/2+2;k<w/2;k+=3)PX(x,'#4a4650',X+k,Y-h*.9,1,h*.9);PX(x,'#4a4650',X-w/2,Y-h*.45,w,1)}}// grade de ferro
function sala(x,g,n,X,Y,t,vis){const r=sr(n),tp=n.type,w=18+Math.round(r()*4),h=16+Math.round(r()*4);let forma=Math.floor(r()*5);if(tp==='elite')forma=4;if(tp==='loja')forma=1;if(tp==='evento'&&forma===4)forma=0;
  boca(x,forma,X,Y,w,h);PX(x,'#2a2018',X-w/2-3,Y,w+6,2);if(!vis)return;
  const f=Math.sin(t*.01+X)*.5+.5,v=Math.floor(r()*4),rgb=c=>`rgb(${c})`;
  if(tp==='fogueira'){// acampamento: barraca, fogo, saco de dormir
    x.fillStyle='#6a3a2a';x.beginPath();x.moveTo(X-w/2+2,Y);x.lineTo(X-w/2+8,Y-11);x.lineTo(X-w/2+14,Y);x.fill();PX(x,'#3a1e14',X-w/2+7,Y-6,2,6);
    for(let d=-2;d<=2;d++){const hh=3+Math.round((4-Math.abs(d))*(0.6+f*.5));PX(x,'#ff7a26',X+4+d,Y-hh,1,hh)}PX(x,'#ffe07a',X+4,Y-3,1,2);PX(x,'#5a3a1e',X+1,Y-1,7,1);
    if(v%2)PX(x,'#7a2a22',X+8,Y-2,7,2);bola(g,(X+4)/2,(Y-5)/2,16,'rgb(255,140,50)',.55)}
  else if(tp==='loja'){// carroça do mercador com toldo listrado
    for(let k=0;k<5;k++)PX(x,k%2?'#e8d8b0':'#a83a2a',X-9+k*4,Y-14,4,3);PX(x,'#5a3a1e',X-9,Y-11,20,7);PX(x,'#7a5228',X-9,Y-11,20,1);PX(x,'#1a120a',X-6,Y-3,3,3);PX(x,'#1a120a',X+6,Y-3,3,3);
    PX(x,'#3a2a1a',X+12,Y-18,1,10);PX(x,'#ffd27a',X+11,Y-9,3,3);bola(g,(X+12)/2,(Y-8)/2,10,'rgb(255,200,90)',.5);PX(x,'#ffd24a',X-4,Y-9,2,2);PX(x,'#ffd24a',X+1,Y-8,2,2)}
  else if(tp==='elite'){// porta de ferro com chifres/caveira, tochas e olhos grandes
    PX(x,'#d8d0b8',X-3,Y-h-5,7,4);PX(x,'#000',X-2,Y-h-4,1,1);PX(x,'#000',X+2,Y-h-4,1,1);PX(x,'#c8c0a8',X-6,Y-h-7,2,3);PX(x,'#c8c0a8',X+5,Y-h-7,2,3);
    for(const sx of [-w/2-4,w/2+3]){PX(x,'#3a2410',X+sx,Y-12,2,6);PX(x,'#ff7a26',X+sx,Y-15+(f>.5?0:1),2,3);bola(g,(X+sx)/2,(Y-14)/2,8,'rgb(255,130,50)',.4)}
    if(Math.sin(t*.003+X)>-.6){PX(x,'#ff3a2a',X-4,Y-h*.55,2,1);PX(x,'#ff3a2a',X+3,Y-h*.55,2,1);bola(g,X/2,(Y-h*.55)/2,8,'rgb(255,60,40)',.6)}}
  else if(tp==='evento'){const opc=[// poço brilhando, estátua com velas, cogumelos, círculo de runas
     ()=>{PX(x,'#5a5250',X-6,Y-6,12,6);PX(x,'#7a706a',X-6,Y-6,12,1);PX(x,'#5aa8ff',X-4,Y-5,8,1);bola(g,X/2,(Y-6)/2,12,'rgb(110,170,255)',.4+f*.2);PX(x,'#3a2a1a',X-5,Y-14,1,8);PX(x,'#3a2a1a',X+4,Y-14,1,8);PX(x,'#3a2a1a',X-5,Y-14,10,1)},
     ()=>{PX(x,'#6a6a72',X-2,Y-14,5,14);PX(x,'#8a8a92',X-3,Y-17,7,4);for(const sx of [-6,6]){PX(x,'#e8e0c8',X+sx,Y-3,1,3);PX(x,'#ffb050',X+sx,Y-4-(f>.5?1:0),1,1);bola(g,(X+sx)/2,(Y-4)/2,5,'rgb(255,180,90)',.5)}},
     ()=>{for(const[dx,hh,c]of [[-6,5,'#ff7ad0'],[-1,8,'#7affe0'],[5,6,'#ff7ad0']]){PX(x,'#c8c0b0',X+dx,Y-hh,1,hh);PX(x,c,X+dx-2,Y-hh-1,5,2);bola(g,(X+dx)/2,(Y-hh)/2,7,c==='#7affe0'?'rgb(120,255,220)':'rgb(255,120,210)',.4+f*.15)}},
     ()=>{x.strokeStyle=`rgba(200,150,255,${.5+f*.4})`;x.lineWidth=1;x.beginPath();x.ellipse(X,Y-2,9,3,0,0,PI*2);x.stroke();for(let k=0;k<5;k++){const a=t*.002+k*PI*2/5;PX(x,'#e0c8ff',X+Math.cos(a)*9,Y-2+Math.sin(a)*3)}bola(g,X/2,(Y-3)/2,12,'rgb(170,120,255)',.35)}];
    opc[v](); if(f>.6)texto(x,'?',X,Y-h*.65,'#d8c8ff',8)}
  else if(tp==='tesouro'){// baú com moedas, às vezes num pedestal
    if(v%2){PX(x,'#5a5250',X-6,Y-3,12,3);PX(x,'#7a706a',X-6,Y-3,12,1)}const by=Y-(v%2?3:0);PX(x,'#6a4a1e',X-5,by-6,10,6);PX(x,'#8a6428',X-5,by-7,10,2);PX(x,'#ffd24a',X-5,by-5,10,1);PX(x,'#ffd24a',X-1,by-4,2,2);
    for(let k=0;k<6;k++)PX(x,'#ffd24a',X-8+r()*16,Y-1-r()*2);if(Math.sin(t*.005+X)>.7)PX(x,'#ffffff',X+3,by-6);bola(g,X/2,(by-4)/2,11,'rgb(255,210,80)',.4)}
  else if(tp==='forja'){// fornalha com chaminé, bigorna, faíscas
    PX(x,'#3a3230',X+3,Y-18,7,18);PX(x,'#5a4a40',X+3,Y-18,7,1);PX(x,'#ff6a1a',X+4,Y-7,5,4);PX(x,'#ffd24a',X+5,Y-6,3,2);bola(g,(X+6)/2,(Y-6)/2,10,'rgb(255,110,40)',.5);
    PX(x,'#5a5250',X-8,Y-5,9,2);PX(x,'#5a5250',X-6,Y-3,5,3);PX(x,'#7a706a',X-8,Y-5,9,1);if(Math.sin(t*.02+X)>.6)for(let k=0;k<3;k++)PX(x,'#fff0a0',X-4+r()*6,Y-8-r()*4);
    const fy=((t*.02)%10);PX(x,`rgba(120,110,110,${.5-fy/20})`,X+5,Y-20-fy,3,2)}
  else{// luta: goblin com lança / pilha de ossos / caixas e barris / teia com aranha
    if(v===0){PX(x,'#1a2a14',X-2,Y-8,4,8);PX(x,'#1a2a14',X-3,Y-11,5,3);PX(x,'#ffd24a',X-1,Y-10,1,1);PX(x,'#5a4a3a',X+3,Y-14,1,12);PX(x,'#a8a8a8',X+3,Y-15,1,2)}
    else if(v===1){for(let k=0;k<5;k++){PX(x,'#d8d0b8',X-6+k*3,Y-1-(k%2),3,1)}PX(x,'#e8e0c8',X-1,Y-6,4,3);PX(x,'#000',X,Y-5,1,1);PX(x,'#000',X+2,Y-5,1,1)}
    else if(v===2){PX(x,'#5a3a1e',X-8,Y-6,6,6);PX(x,'#7a5228',X-8,Y-6,6,1);PX(x,'#4a3018',X,Y-8,5,8);PX(x,'#6a4424',X,Y-6,5,1);PX(x,'#6a4424',X,Y-3,5,1)}
    else{x.strokeStyle='rgba(220,220,235,.45)';x.lineWidth=1;for(let k=1;k<4;k++){x.beginPath();x.arc(X-w/2+2,Y-h,k*3,0,PI/2);x.stroke()}PX(x,'#1a1420',X-3,Y-7,3,2);PX(x,'#ff3a2a',X-2,Y-7,1,1)}
    if(Math.sin(t*.002+X*3)>.8){PX(x,'#ffd24a',X-w/2+3,Y-h*.4);PX(x,'#ffd24a',X-w/2+5,Y-h*.4)}}}

const CSS=`.page.mn{position:relative;padding:0;width:100%;height:100%;overflow:hidden;display:block;touch-action:none}
.page.mn canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}.page.mn canvas.g{mix-blend-mode:screen;pointer-events:none}
.mn-ui{position:absolute;left:0;right:0;top:6px;display:flex;justify-content:center;pointer-events:none}
.mn-t{text-align:center;font:400 clamp(20px,4.6vh,30px)/1 var(--f-disp);color:#f2d17e;text-shadow:0 2px 0 #2a1a08,0 0 10px #000}.mn-t small{display:block;margin-top:2px;font:600 10px var(--f-num);letter-spacing:.3em;text-transform:uppercase;color:#c8b088}
.mn-b{position:absolute;right:max(8px,env(safe-area-inset-right,0px));bottom:max(8px,env(safe-area-inset-bottom,0px));display:flex;gap:6px}
.mn-b button{border:1px solid #5a4528;background:#0b0806d0;color:#e8d9b8;border-radius:18px;padding:7px 13px;font:400 14px var(--f-sc);cursor:pointer}.mn-b button.on{background:linear-gradient(#5a4220,#3a2a14);color:#fff3d6;border-color:#a88a4a}
.mn-dica{position:absolute;left:0;right:0;bottom:max(46px,calc(env(safe-area-inset-bottom,0px) + 46px));text-align:center;font:italic 14px var(--f-body);color:#c8b088;text-shadow:0 1px 3px #000;pointer-events:none}`;
const st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
const on=()=>OPT.mapaNovo!==false&&typeof G!=='undefined'&&G&&G.screen==='map'&&G.map&&G.act<3;
const NOME={luta:'Luta',elite:'Elite',evento:'Evento',fogueira:'Fogueira',loja:'Mercador',tesouro:'Tesouro',forja:'Forja',chefe:'Chefe'};
const S={on:false,mundo:null,key:'',cam:[0,0],camT:null,hero:null,anda:false,tudo:false,drag:null,last:0,LUZ:[],CRIS:[],AGUA:[],hf:0};window.MAPN=S;
const RW=64,DROP=24,CS=30,TOP=78,LEFT=58,ROWSn=()=>G.map.rows.length;
const pos=n=>n.type==='chefe'?[LEFT+ROWSn()*RW+60,TOP+ROWSn()*DROP+3*CS+30]:[LEFT+n.r*RW+(n.jx||0)*.3,TOP+n.r*DROP+n.c*CS+(n.jy||0)*.25];
/* ---------- mundo desenhado uma vez por ato ---------- */
function monta(){const M=G.map.rows,rows=M.length,cols=7,WW=LEFT+rows*RW+130,WHt=TOP+rows*DROP+cols*CS+90,rr=sr({r:G.act*13,c:(G.seed|0)%97}),SKY=TOP-34,a2=G.act===2;
  const mundo=cv(WW,WHt),m=mundo.getContext('2d'),P2=(c,X,Y,w=1,h=1)=>{m.fillStyle=c;m.fillRect(Math.round(X),Math.round(Y),w,h)};S.LUZ=[];S.CRIS=[];S.AGUA=[];S.WW=WW;S.WH=WHt;S.SKY=SKY;
  const prof=(X,Y)=>Math.max(0,Math.min(1,((Y-TOP)/(WHt-TOP))*.6+(X/WW)*.5));
  const cor=(X,Y,k=1)=>{const p=prof(X,Y);let c;if(a2){c=[46-p*14,50-p*14,58-p*10]}else if(p<.45){const t=p/.45;c=[96-t*40,70-t*22,48-t*6]}else if(p<.8){const t=(p-.45)/.35;c=[56-t*6,48-t*10,42+t*4]}else{const t=(p-.8)/.2;c=[50+t*30,38-t*8,46-t*14]}return`rgb(${c[0]*k|0},${c[1]*k|0},${c[2]*k|0})`};
  const sg=m.createLinearGradient(0,0,0,SKY);sg.addColorStop(0,'#0a0a24');sg.addColorStop(1,a2?'#1a2438':'#2a2448');m.fillStyle=sg;m.fillRect(0,0,WW,SKY);
  for(let i=0;i<160;i++)P2(`rgba(230,235,255,${.3+rr()*.6})`,rr()*WW,rr()*SKY*.9);m.fillStyle='#efe6cf';m.beginPath();m.arc(WW*.18,18,9,0,7);m.fill();
  m.fillStyle='#120f20';m.beginPath();m.moveTo(0,SKY);for(let X=0;X<=WW;X+=6)m.lineTo(X,SKY-8-Math.sin(X*.03)*5-rr()*3);m.lineTo(WW,SKY);m.fill();
  for(let i=0;i<26;i++){const X=rr()*WW,h=10+rr()*14;m.fillStyle='#0c0a16';m.fillRect(X,SKY-h,2,h);m.beginPath();m.ellipse(X+1,SKY-h,5+rr()*3,6+rr()*4,0,0,7);m.fill()}
  if(a2)for(let i=0;i<10;i++){const X=WW*(.3+rr()*.65);m.fillStyle='#0c0a16';m.fillRect(X,SKY-14,1,14);m.fillRect(X-3,SKY-11,7,1)}// cruzes do cemitério
  for(let Y=SKY;Y<WHt;Y+=2)for(let X=0;X<WW;X+=4){const onda=Math.sin(X*.02+Y*.05)+Math.sin(X*.007-Y*.03)*1.4,k=.82+((Math.floor((Y+onda*6)/9))%3)*.09+(rr()-.5)*.06;m.fillStyle=cor(X,Y,k);m.fillRect(X,Y,4,2)}
  m.fillStyle=a2?'#2a3a2a':'#3a5a22';m.fillRect(0,SKY,WW,2);for(let X=0;X<WW;X+=2)if(rr()<.6)P2(a2?'#3a4a32':'#4a7a2a',X,SKY-1-(rr()*2|0),1,2);
  for(let i=0;i<40;i++){let X=rr()*WW,Y=SKY+2;m.strokeStyle='rgba(40,26,14,.8)';m.lineWidth=1;m.beginPath();m.moveTo(X,Y);for(let k=0;k<7;k++){X+=rr()*6-3;Y+=2+rr()*3;m.lineTo(X,Y)}m.stroke()}
  for(let i=0;i<900;i++){const X=rr()*WW,Y=SKY+4+rr()*(WHt-SKY);P2(rr()<.55?'rgba(0,0,0,.22)':'rgba(255,230,200,.06)',X,Y,1+(rr()*3|0),1)}
  for(let i=0;i<(a2?24:10);i++){const X=WW*(.1+rr()*.8),Y=SKY+30+rr()*(WHt-SKY-60);for(let k=0;k<5;k++)P2('rgba(210,200,180,.45)',X+k*2,Y+(k%2),2,1);P2('rgba(210,200,180,.45)',X-2,Y-1,2,3)}
  for(let i=0;i<9;i++){const X=WW*(.1+rr()*.85),Y=SKY+40+rr()*(WHt-SKY-80),rw=18+rr()*26,rh=8+rr()*10;m.fillStyle='rgba(10,7,6,.55)';m.beginPath();m.ellipse(X,Y,rw,rh,0,0,7);m.fill();for(let k=-rw+3;k<rw-3;k+=4)if(rr()<.7){const h=2+rr()*5;m.beginPath();m.moveTo(X+k-1.5,Y-rh*.7);m.lineTo(X+k+1.5,Y-rh*.7);m.lineTo(X+k,Y-rh*.7+h);m.fill()}}
  for(let i=0;i<22;i++){const X=WW*(.15+rr()*.85),Y=SKY+30+rr()*(WHt-SKY-50),c=(a2?['#5ad0ff','#7affe0','#b07aff']:['#5ad0ff','#ff6ad8','#7aff8a','#b07aff'])[i%(a2?3:4)];for(let k=0;k<3;k++){const h=3+rr()*5;m.fillStyle=c;m.beginPath();m.moveTo(X+k*2-1,Y);m.lineTo(X+k*2+1,Y);m.lineTo(X+k*2,Y-h);m.fill()}P2('#ffffff',X+2,Y-3);S.CRIS.push([X+2,Y-3,c])}
  const rioY=TOP+rows*DROP*.55+cols*CS+30;m.fillStyle='rgba(8,6,6,.7)';m.beginPath();m.ellipse(WW*.48,rioY+2,WW*.26,12,0,PI,0);m.fill();const rg=m.createLinearGradient(0,rioY,0,rioY+9);rg.addColorStop(0,'#1a4a6a');rg.addColorStop(1,'#08182a');m.fillStyle=rg;m.fillRect(WW*.24,rioY,WW*.48,9);m.fillStyle='#4a3a2c';m.fillRect(WW*.24,rioY+9,WW*.48,2);S.AGUA.push([WW*.24,WW*.72,rioY]);S.LUZ.push([WW*.48,rioY+3,'rgb(80,170,230)',50,.25]);
  const[bxx,byy]=pos(G.map.boss);S.bxx=bxx;S.byy=byy;m.fillStyle='#3a0a06';m.fillRect(bxx-70,byy+4,140,14);for(let X=bxx-70;X<bxx+70;X+=3)P2(rr()<.5?'#ff6a1a':'#ffb03a',X,byy+4+rr()*3,2,1);S.LUZ.push([bxx,byy+8,'rgb(255,90,30)',40,.4]);
  m.fillStyle='#08060a';m.beginPath();m.ellipse(bxx,byy,34,32,0,PI,0);m.lineTo(bxx+34,byy+4);m.lineTo(bxx-34,byy+4);m.fill();for(let k=0;k<11;k++){const a=PI+k*PI/10;P2(k%2?'#3a3438':'#4a4448',bxx+Math.cos(a)*36-2,byy+Math.sin(a)*34-2,4,4)}
  ['.###.','#####','#.#.#','#####','.#.#.'].forEach((ln,j)=>[...ln].forEach((ch,i)=>{if(ch==='#')P2('#d8d0b8',bxx-5+i*2,byy-44+j*2,2,2)}));S.LUZ.push([bxx,byy-12,'rgb(255,40,30)',16,.35]);
  m.lineCap='round';S.tun={};const tunel=(a,b,e,f,key)=>{const pts=[];for(let k=0;k<=24;k++){const t=k/24,u=t*t*(3-2*t);pts.push([a+(e-a)*t,b+(f-b)*u])}if(key)S.tun[key]=pts;
    m.strokeStyle='rgba(0,0,0,.35)';m.lineWidth=12;m.beginPath();pts.forEach(([X,Y],k)=>k?m.lineTo(X,Y-5):m.moveTo(X,Y-5));m.stroke();m.strokeStyle='#140d09';m.lineWidth=11;m.stroke();m.strokeStyle='#1e140d';m.lineWidth=7;m.stroke();
    for(let k=6;k<pts.length-4;k+=9){const[X,Y]=pts[k];P2('#4a3018',X-5,Y-11,1,10);P2('#4a3018',X+4,Y-11,1,10);P2('#5a3a1e',X-5,Y-11,10,1)}
    pts.forEach(([X,Y],k)=>{if(k%2===0)P2('#3a2a1a',X-1,Y-1,3,1)});if(rr()<.45){const[X,Y]=pts[12];P2('#3a2410',X,Y-12,1,3);S.LUZ.push([X,Y-14,'rgb(255,150,60)',22,.55,1])}};
  for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);if(n.r===rows-1){const[e,f]=pos(G.map.boss);tunel(a+10,b,e-30,f,n.r+','+n.c+'>B');continue}for(const c of n.next){const o=M[n.r+1]&&M[n.r+1][c];if(o){const[e,f]=pos(o);tunel(a+10,b,e-10,f,n.r+','+n.c+'>'+o.r+','+o.c)}}}
  const SHX=LEFT-30,prim=M[0].filter(Boolean),fundo=Math.max(...prim.map(n=>pos(n)[1]))+4;S.SHX=SHX;
  m.fillStyle='#0c0806';m.fillRect(SHX-7,SKY,14,fundo-SKY+4);m.fillStyle='#160f0a';m.fillRect(SHX-5,SKY,10,fundo-SKY+4);for(let Y=SKY;Y<fundo;Y+=4)P2('#6a4a28',SHX-4,Y,8,1);P2('#5a3a1e',SHX-5,SKY,1,fundo-SKY);P2('#5a3a1e',SHX+4,SKY,1,fundo-SKY);for(let Y=SKY+10;Y<fundo;Y+=22)P2('#4a3018',SHX-8,Y,16,2);
  for(const n of prim){const[a,b]=pos(n);m.fillStyle='#140d09';m.fillRect(SHX,b-11,a-10-SHX,12);m.fillStyle='#1e140d';m.fillRect(SHX,b-9,a-10-SHX,8);P2('#3a2a1a',SHX,b,a-10-SHX,1);P2('#5a3a1e',SHX+6,b-12,1,12);P2('#5a3a1e',SHX+6,b-12,a-20-SHX,1);P2('#3a2410',SHX+9,b-10,1,3);S.LUZ.push([SHX+9,b-11,'rgb(255,150,60)',18,.5,1])}
  m.fillStyle='#4a3018';m.beginPath();m.moveTo(SHX-14,SKY);m.lineTo(SHX-2,SKY-26);m.lineTo(SHX-1,SKY-26);m.lineTo(SHX-11,SKY);m.fill();m.beginPath();m.moveTo(SHX+14,SKY);m.lineTo(SHX+2,SKY-26);m.lineTo(SHX+1,SKY-26);m.lineTo(SHX+11,SKY);m.fill();
  P2('#5a3a1e',SHX-9,SKY-27,18,3);m.fillStyle='#2a2018';m.beginPath();m.arc(SHX,SKY-24,3.5,0,7);m.fill();P2('#8a7a60',SHX-1,SKY-21,1,21);P2('#3a2a1a',SHX+10,SKY-14,1,6);P2('#ffd27a',SHX+9,SKY-9,3,3);S.LUZ.push([SHX+10,SKY-8,'rgb(255,190,90)',26,.55]);P2('#3a2a1a',SHX-24,SKY-8,10,8);P2('#5a3a1e',SHX-24,SKY-8,10,1);
  for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);P2('#2a2018',a-15,b+1,30,3);P2('#5a4a3a',a-15,b+1,30,1);P2('rgba(0,0,0,.4)',a-14,b+4,28,2)}
  S.mundo=mundo}
/* ---------- herói ---------- */
const QC=new Map();function heroiQ(andando){const ch=G.char;S.hf++;
  if(ch==='cav'&&window.KN&&KN.vitrine){try{return{c:KN.vitrine(andando?'andar':'parado',Math.floor(S.hf/3),{dir:-1,col:[255,200,140],amb:[60,50,60]}).cv,fx:20,fy:60}}catch(e){}}
  const id='h_'+ch;if(typeof BICHOS!=='undefined'&&BICHOS[id]){const an=andando&&BICHOS[id].A.entrada?'entrada':'parado',sq=BICHO.seq(id,an),f=andando?(4+Math.floor(S.hf/3)%8):Math.floor(S.hf/4)%sq.length,k=id+'|'+an+'|'+f;let q=QC.get(k);if(!q){q=BICHO.quadro(id,{...sq[Math.min(f,sq.length-1)],hx:21,andar:andando?1:0},{dir:-1,col:[255,200,140],amb:[60,50,60]});QC.set(k,q)}return{c:q,fx:21,fy:58}}
  return null}
/* ---------- desenho ---------- */
function onde(){if(!G.pos)return[S.SHX,S.SKY-2];if(G.pos.r===ROWSn())return pos(G.map.boss);return pos(G.map.rows[G.pos.r][G.pos.c])}
function desenha(t,k){const c=S.c,g=S.g;if(!c||!c.isConnected)return false;const r=c.getBoundingClientRect();const W=Math.round(Math.max(160,r.width/(r.width>r.height?2.8:2.4))),H=Math.round(W*r.height/r.width);
  if(c.width!==W||c.height!==H){c.width=W;c.height=H;g.width=Math.ceil(W/2);g.height=Math.ceil(H/2)}const x=c.getContext('2d'),gg=g.getContext('2d');x.imageSmoothingEnabled=false;
  const key=G.act+'|'+G.seed;if(S.key!==key){S.key=key;monta();S.hero=null}if(!S.hero){S.hero=onde();S.cam=[Math.max(0,S.hero[0]-W*.4),Math.max(0,S.hero[1]-H*.5)]}
  const z=S.tudo?Math.max(S.WW/W,S.WH/H,1):1,VW=W*z,VH=H*z;let[hx,hy]=S.hero;
  if(!S.drag&&!S.tudo){const tx=Math.max(0,Math.min(S.WW-VW,hx-VW*.4)),ty=Math.max(0,Math.min(S.WH-VH,hy-VH*.5));S.cam[0]+=(tx-S.cam[0])*.1*k;S.cam[1]+=(ty-S.cam[1])*.1*k}
  if(S.tudo){S.cam=[(S.WW-VW)/2,(S.WH-VH)/2]}
  const[cx,cy]=S.cam;x.clearRect(0,0,W,H);gg.clearRect(0,0,g.width,g.height);x.save();x.scale(1/z,1/z);x.translate(-Math.round(cx),-Math.round(cy));gg.save();gg.globalCompositeOperation='lighter';gg.scale(1/z,1/z);gg.translate(-Math.round(cx)/2,-Math.round(cy)/2);
  x.drawImage(S.mundo,0,0);
  // caminho já andado em dourado
  x.fillStyle='rgba(242,209,126,.7)';for(let i=1;i<G.path.length;i++){const a=G.path[i-1],b=G.path[i],pts=S.tun[a.r+','+a.c+'>'+(b.r===ROWSn()?'B':b.r+','+b.c)];if(pts)pts.forEach(([X,Y],j)=>{if(j%2)x.fillRect(Math.round(X),Math.round(Y-4),1,1)})}
  for(const[x0,x1,yy]of S.AGUA)for(let X=x0;X<x1;X+=2){const k2=((X+t*.03)%14+14)%14;if(k2<2){x.fillStyle='rgba(150,200,230,.6)';x.fillRect(X,Math.round(yy+2+Math.sin(X*.1+t*.004)),1,1)}}
  for(let X=S.bxx-70;X<S.bxx+70;X+=2)if(Math.sin(X*.3+t*.006)>.6){x.fillStyle='#ffd24a';x.fillRect(X,S.byy+5,1,1)}
  for(const[X,Y,c2]of S.CRIS)bola(gg,X/2,Y/2,6,c2==='#5ad0ff'?'rgb(90,200,255)':c2==='#ff6ad8'?'rgb(255,110,210)':c2==='#7aff8a'||c2==='#7affe0'?'rgb(120,255,160)':'rgb(170,120,255)',.35+Math.sin(t*.002+X)*.15);
  for(const[X,Y,c2,r2,a2,toch]of S.LUZ){const f=Math.sin(t*.013+X)*.5+.5;if(toch){x.fillStyle='#ff7a26';x.fillRect(X,Y,1,2);if(f>.5){x.fillStyle='#ffe07a';x.fillRect(X,Y,1,1)}}bola(gg,X/2,Y/2,r2/2*(1+f*.08),c2,a2*(.85+f*.15))}
  const av=new Set(S.anda?[]:availNodes()),curR=G.pos?G.pos.r:-1;
  for(const row of G.map.rows)for(const n of row){if(!n)continue;const[a,b]=pos(n);if(a<cx-40||a>cx+VW+40||b<cy-40||b>cy+VH+40)continue;sala(x,gg,n,a,b,t,S.tudo||n.done||n.r<=curR+2);if(n.done&&!(G.pos&&G.pos.r===n.r&&G.pos.c===n.c)){x.fillStyle='rgba(8,6,4,.45)';x.fillRect(a-15,b-20,30,21)}}
  S.alvos=[];for(const n of av){const[a,b]=n.type==='chefe'?[S.bxx,S.byy]:pos(n),rx=n.type==='chefe'?40:17,ry=n.type==='chefe'?36:14;x.strokeStyle=`rgba(242,209,126,${.55+.45*Math.sin(t*.008)})`;x.lineWidth=1;x.beginPath();x.ellipse(a,b-(n.type==='chefe'?16:9),rx,ry,0,0,PI*2);x.stroke();
    texto(x,NOME[n.type]||'',a,b+(n.type==='chefe'?16:11),'#f2d17e',7);S.alvos.push([n,a,b-(n.type==='chefe'?16:9),rx+4,ry+6])}
  const q=heroiQ(S.andando);if(q){const s=.62;x.save();x.translate(Math.round(hx),Math.round(hy+1));if(S.flip)x.scale(-1,1);x.drawImage(q.c,Math.round(-q.fx*s),Math.round(-q.fy*s),Math.round(q.c.width*s),Math.round(q.c.height*s));x.restore()}
  x.restore();gg.restore();
  if(!S.tudo){const dk=S.dk||(S.dk=cv(1,1));if(dk.width!==W||dk.height!==H){dk.width=W;dk.height=H}const qd=dk.getContext('2d');qd.globalCompositeOperation='source-over';qd.clearRect(0,0,W,H);qd.fillStyle='rgba(4,3,8,.62)';qd.fillRect(0,0,W,H);qd.globalCompositeOperation='destination-out';
    const fl=1+Math.sin(t*.013)*.04,lx=hx-cx,ly=hy-cy-10,gr=qd.createRadialGradient(lx,ly,0,lx,ly,95*fl);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.5,'rgba(0,0,0,.8)');gr.addColorStop(1,'rgba(0,0,0,0)');qd.fillStyle=gr;qd.fillRect(0,0,W,H);
    for(const[X,Y,,r2]of S.LUZ.concat(S.CRIS.map(([X,Y])=>[X,Y,0,14])).concat(S.alvos.map(([,a,b])=>[a,b,0,26]))){const X2=X-cx,Y2=Y-cy;if(X2<-40||X2>W+40||Y2<-40||Y2>H+40)continue;const g2=qd.createRadialGradient(X2,Y2,0,X2,Y2,r2);g2.addColorStop(0,'rgba(0,0,0,.75)');g2.addColorStop(1,'rgba(0,0,0,0)');qd.fillStyle=g2;qd.fillRect(X2-r2,Y2-r2,r2*2,r2*2)}
    if(cy<S.SKY){qd.fillStyle='rgba(0,0,0,1)';qd.fillRect(0,0,W,S.SKY-cy)}x.drawImage(dk,0,0);bola(gg,lx/2,ly/2,40,'rgb(255,170,80)',.25)}
  const vg=x.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.65);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');x.fillStyle=vg;x.fillRect(0,0,W,H);S.W=W;S.H=H;S.z=z;return true}
function tick(t){if(!S.on)return;requestAnimationFrame(tick);if(document.hidden)return;const passo=OPT.bateria==='maxima'?120:OPT.bateria==='economia'?60:33;if(t-S.last<passo)return;const k=Math.min(3,(t-S.last)/33);S.last=t;try{if(!desenha(t,k))S.on=false}catch(e){console.error(e);S.on=false}}
/* ---------- andar até o lugar ---------- */
const mov=(a,b,dur)=>{const[x0,y0]=S.hero,t0=performance.now();S.andando=true;S.flip=a<x0-1;return new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/dur);S.hero=[x0+(a-x0)*p,y0+(b-y0)*p];if(p<1)requestAnimationFrame(f);else ok()};f()})};
async function vai(n){if(S.anda)return;S.anda=true;UI.moving=true;try{sfx('botao',{vol:.6})}catch(e){}
  try{const de=G.pos,[a,b]=n.type==='chefe'?[S.bxx,S.byy]:pos(n);
    if(!de){await mov(S.SHX,b,Math.max(500,(b-S.hero[1])*16));await mov(a-12,b,700)}
    else{const pts=S.tun[de.r+','+de.c+'>'+(n.type==='chefe'?'B':n.r+','+n.c)];if(pts){for(let i=0;i<pts.length;i+=3)await mov(pts[i][0],pts[i][1],70)}}
    await mov(a,b,250)}catch(e){console.error(e)}
  S.andando=false;S.anda=false;UI.moving=false;const r=n.type==='chefe'?ROWSn():n.r,c=n.type==='chefe'?3:n.c;enterNode(r,c)}
/* ---------- tela ---------- */
function tela(){return`<div class="page mn"><canvas class="p"></canvas><canvas class="g"></canvas><div class="mn-ui"><div class="mn-t">${ACTS[G.act].n}<small>Ato ${G.act} de 3 · desça até o fundo</small></div></div>
  <div class="mn-dica">${S.tudo?'Toque em "Voltar" para seguir':'Toque num lugar marcado para ir até ele'}</div><div class="mn-b"><button data-act="mntudo" class="${S.tudo?'on':''}">${S.tudo?'Voltar':'Ver mapa inteiro'}</button></div></div>`}
ACT.mntudo=()=>{S.tudo=!S.tudo;const p=document.querySelector('.page.mn');if(p){p.querySelector('.mn-b button').textContent=S.tudo?'Voltar':'Ver mapa inteiro';p.querySelector('.mn-b button').classList.toggle('on',S.tudo);p.querySelector('.mn-dica').textContent=S.tudo?'Toque em "Voltar" para seguir':'Toque num lugar marcado para ir até ele'}};
function liga(){const p=document.querySelector('.page.mn');if(!p)return;S.c=p.querySelector('canvas.p');S.g=p.querySelector('canvas.g');S.hero=null;S.drag=null;
  S.c.addEventListener('pointerdown',e=>{S.drag={x:e.clientX,y:e.clientY,cam:S.cam.slice(),mov:0};S.c.setPointerCapture(e.pointerId)});
  S.c.addEventListener('pointermove',e=>{if(!S.drag||S.tudo)return;const r=S.c.getBoundingClientRect(),k=S.W/r.width,dx=(e.clientX-S.drag.x)*k,dy=(e.clientY-S.drag.y)*k;S.drag.mov=Math.max(S.drag.mov,Math.abs(dx)+Math.abs(dy));if(S.drag.mov>3)S.cam=[Math.max(0,Math.min(S.WW-S.W,S.drag.cam[0]-dx)),Math.max(0,Math.min(S.WH-S.H,S.drag.cam[1]-dy))]});
  S.c.addEventListener('pointerup',e=>{const d=S.drag;S.drag=null;if(!d||d.mov>3||S.tudo||S.anda)return;const r=S.c.getBoundingClientRect(),X=(e.clientX-r.left)/r.width*S.W*S.z+S.cam[0],Y=(e.clientY-r.top)/r.height*S.H*S.z+S.cam[1];
    for(const[n,a,b,rx,ry]of S.alvos||[]){if(((X-a)/rx)**2+((Y-b)/ry)**2<=1){vai(n);return}}});
  if(!S.on){S.on=true;S.last=performance.now();requestAnimationFrame(tick)}}
function instalar(){const _m=mapHTML;mapHTML=function(){return on()?tela():_m.apply(this,arguments)};
  const _r=render;render=function(){const out=_r.apply(this,arguments);try{if(on()&&document.querySelector('.page.mn'))liga();else S.on=false}catch(e){console.error(e)}return out};
  if(OPT.mapaNovo===undefined)OPT.mapaNovo=true;
  const _op=ACT.opcoes;ACT.opcoes=function(){const r=_op.apply(this,arguments);const pan=document.querySelector('#modal .optpanel');
    if(pan&&!pan.querySelector('[data-k="mapaNovo"]')){const d=document.createElement('div');d.className='optrow';const b=(v,t)=>`<button class="optb ${String(OPT.mapaNovo)===v?'on':''}" data-act="optset" data-k="mapaNovo" data-v="${v}">${t}</button>`;
      d.innerHTML=`<b>Mapa novo</b><span>A masmorra em corte, com o herói descendo pelos túneis (Atos 1 e 2). Desligue para voltar ao mapa antigo.</span><div>${b('true','Ligado')}${b('false','Desligado')}</div>`;pan.appendChild(d)}return r}}
if(document.readyState==='complete')setTimeout(instalar,0);else addEventListener('load',()=>setTimeout(instalar,0));
})();
