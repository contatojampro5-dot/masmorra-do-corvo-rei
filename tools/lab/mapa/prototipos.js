/* Protótipos do jeito de descer a masmorra (só para mostrar ao Theo em vídeo; não entra no jogo).
   PROTO.run('corte'|'portas'|'atos') abre uma tela por cima do jogo e anda sozinho pelo mapa de verdade (G.map). */
(function(){
const R=Math.random,PI=Math.PI;
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const GC={};function bola(x,X,Y,r,c,a){if(a<=0)return;let g=GC[c];if(!g){g=cv(64,64);const q=g.getContext('2d'),gr=q.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,64,64);GC[c]=g}x.globalAlpha=Math.min(1,a);x.drawImage(g,X-r,Y-r,r*2,r*2);x.globalAlpha=1}
let hf=0;function heroi(x,X,Y,andando,flip,sc=1){const nm=andando?'andar':'parado';let q;try{q=KN.vitrine(nm,hf,{dir:-1,col:[255,200,140],amb:[60,50,60]}).cv}catch(e){return}x.save();x.translate(Math.round(X),Math.round(Y));if(flip)x.scale(-1,1);x.drawImage(q,Math.round(-20*sc),Math.round(-60*sc),Math.round(40*sc),Math.round(64*sc));x.restore()}
const ICO={luta:'#d8c8a8',elite:'#ff5a4a',evento:'#c8a8ff',fogueira:'#ff9a3a',loja:'#ffd24a',tesouro:'#ffd24a',forja:'#ff7a2a'};
function caminho(){const M=G.map.rows,rows=M.length;let n=M[0].filter(Boolean).sort((a,b)=>b.next.length-a.next.length)[0];const p=[n];for(let r=0;r<rows-1;r++){const nx=n.next.map(c=>M[r+1][c]).filter(Boolean).sort((a,b)=>(b.next.length-a.next.length));n=nx[0];p.push(n)}return p}
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
/* ---------- infra comum ---------- */
let D=null;
function abre(W,H){fecha();const box=document.createElement('div');box.id='proto';box.style.cssText='position:fixed;inset:0;z-index:900;background:#000';const a=cv(W,H),b=cv(W/2,H/2);for(const c of [a,b]){c.style.cssText='position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated'}b.style.mixBlendMode='screen';
  const cap=document.createElement('div');cap.style.cssText='position:absolute;left:0;right:0;top:12px;text-align:center;font:400 20px "IM Fell English SC",serif;color:#f2d17e;text-shadow:0 2px 4px #000';box.append(a,b,cap);document.body.appendChild(box);D={a,b,x:a.getContext('2d'),g:b.getContext('2d'),cap,W,H,on:true};D.x.imageSmoothingEnabled=false;return D}
function fecha(){const e=document.getElementById('proto');if(e)e.remove();if(D)D.on=false;D=null}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
function loop(fn){const d=D;let last=performance.now();const f=t=>{if(!d.on)return;requestAnimationFrame(f);const k=Math.min(3,(t-last)/33);last=t;hf++;d.x.clearRect(0,0,d.W,d.H);d.g.clearRect(0,0,d.W/2,d.H/2);d.g.globalCompositeOperation='lighter';fn(d,t,k);d.g.globalCompositeOperation='source-over'};requestAnimationFrame(f)}
/* ===================== 1. CORTE DA MASMORRA COM LANTERNA ===================== */
async function corte(){const W=200,H=Math.round(200*innerHeight/innerWidth),d=abre(W,H),M=G.map.rows,rows=M.length,cols=7,RH=54,TOP=46;d.cap.textContent='1 · Corte da masmorra';
  const pos=n=>[22+n.c*(W-44)/(cols-1)+(n.jx||0)*.25,TOP+n.r*RH+(n.jy||0)*.2];
  // terra
  const mundo=cv(W,TOP+rows*RH+60),m=mundo.getContext('2d');for(let y=0;y<mundo.height;y+=2){const p=y/mundo.height;m.fillStyle=`rgb(${(58-p*34)|0},${(42-p*26)|0},${(30-p*16)|0})`;m.fillRect(0,y,W,2)}
  for(let i=0;i<700;i++){const y=R()*mundo.height,p=y/mundo.height;m.fillStyle=R()<.5?`rgba(0,0,0,${.2+p*.2})`:`rgba(255,220,180,${.05})`;m.fillRect(R()*W,y,1+R()*3,1)}
  for(let i=0;i<40;i++){const y=R()*mundo.height*.5;m.strokeStyle='rgba(20,14,8,.7)';m.beginPath();let x0=R()*W;m.moveTo(x0,y);for(let k=0;k<6;k++){x0+=R()*6-3;m.lineTo(x0,y+k*3)}m.stroke()}
  for(let i=0;i<14;i++){const y=mundo.height*(.5+R()*.5),X=R()*W;m.fillStyle=['#5ad0ff','#ff6ad8','#7aff8a'][i%3];m.fillRect(X,y,2,3)}
  // túneis
  m.lineCap='round';for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);for(const c of n.next){const o=M[n.r+1]&&M[n.r+1][c];if(!o)continue;const[e,f]=pos(o);m.strokeStyle='#120c08';m.lineWidth=7;m.beginPath();m.moveTo(a,b);m.quadraticCurveTo(a,(b+f)/2,e,f-4);m.stroke();m.strokeStyle='#1e150e';m.lineWidth=4;m.stroke()}}
  m.fillStyle='#0c0907';m.fillRect(W/2-30,0,60,TOP-10);texto(m,'ENTRADA',W/2,TOP-16,'#a89878',7);
  // portão do chefe
  const by=TOP+rows*RH+10;m.fillStyle='#08060a';m.beginPath();m.ellipse(W/2,by+20,34,26,0,PI,0);m.fill();
  const P=caminho();let cam=0,hx=pos(P[0])[0],hy=TOP-12,i=-1,andando=false,vis=new Set(),opc=[],tudo=0,camT=null;
  loop((d,t,k)=>{const{x,g}=d;const alvo=camT!=null?camT:Math.max(0,Math.min(mundo.height-H,hy-H*.45));cam+=(alvo-cam)*(camT!=null?.2:.08)*k;x.drawImage(mundo,0,-Math.round(cam));
    for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);const v=tudo||vis.has(n)||n.r<=i+2;sala(x,g,n,a,b-cam,t,v)}
    for(const o of opc){const[a,b]=pos(o);x.strokeStyle=`rgba(242,209,126,${.5+.5*Math.sin(t*.008)})`;x.lineWidth=1;x.beginPath();x.ellipse(a,b-cam-9,17,14,0,0,PI*2);x.stroke()}
    heroi(x,hx,hy-cam+2,andando,false,.65);
    // escuridão com a luz da lanterna
    const dk=d.dk||(d.dk=cv(W,H)),q=dk.getContext('2d');q.globalCompositeOperation='source-over';q.clearRect(0,0,W,H);q.fillStyle='rgba(3,2,5,.7)';q.fillRect(0,0,W,H);q.globalCompositeOperation='destination-out';
    const fl=1+Math.sin(t*.013)*.04,gr=q.createRadialGradient(hx,hy-cam-8,0,hx,hy-cam-8,80*fl);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,W,H);
    for(const n of vis){const[a,b]=pos(n);const g2=q.createRadialGradient(a,b-cam,0,a,b-cam,22);g2.addColorStop(0,'rgba(0,0,0,.6)');g2.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g2;q.fillRect(a-22,b-cam-22,44,44)}
    if(!tudo)x.drawImage(dk,0,0);else{x.fillStyle='rgba(3,2,5,.25)';x.fillRect(0,0,W,H)}bola(g,hx/2,(hy-cam-14)/2,30,'rgb(255,170,80)',.25);
    x.fillStyle='rgba(10,8,6,.8)';x.fillRect(0,H-16,W,16);texto(x,i<0?'Entrada':'Andar '+(i+1),W/2,H-5,'#f2d17e',9)});
  const anda=async(n)=>{const[a,b]=pos(n),x0=hx,y0=hy,dur=1300,t0=performance.now();andando=true;await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/dur);hx=x0+(a-x0)*p;hy=y0+(b-y0)*p;if(p<1)requestAnimationFrame(f);else ok()};f()});andando=false;vis.add(n)};
  await espera(900);for(let s=0;s<5;s++){const n=P[s];opc=s===0?M[0].filter(Boolean):M[s-1+0]?P[s-1].next.map(c=>M[s][c]).filter(Boolean):[];await espera(900);opc=[];await anda(n);i=s;await espera(600)}
  d.cap.textContent='"Ver mapa inteiro"';tudo=1;const ini=performance.now(),c0=cam,c1=mundo.height-H;await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-ini)/7000);camT=c0+(c1-c0)*p;if(p<1)requestAnimationFrame(f);else ok()};f()});await espera(900)}
async function deitado(){const W=300,H=Math.round(300*innerHeight/innerWidth),d=abre(W,H),M=G.map.rows,rows=M.length,cols=7,RW=62,DROP=26,CS=30,TOP=40,LEFT=46;d.cap.textContent='Corte deitado · para a direita e descendo';
  const pos=n=>[LEFT+n.r*RW+(n.jx||0)*.3,TOP+n.r*DROP+n.c*CS+(n.jy||0)*.25];const WW=LEFT+rows*RW+90,WHt=TOP+rows*DROP+cols*CS+60;
  // terra
  const mundo=cv(WW,WHt),m=mundo.getContext('2d');for(let y=0;y<mundo.height;y+=2)for(let xx=0;xx<WW;xx+=8){const p=Math.min(1,(y/mundo.height)*.5+(xx/WW)*.6);m.fillStyle=`rgb(${(58-p*34)|0},${(42-p*26)|0},${(30-p*16)|0})`;m.fillRect(xx,y,8,2)}
  for(let i=0;i<700;i++){const y=R()*mundo.height,p=y/mundo.height;m.fillStyle=R()<.5?`rgba(0,0,0,${.2+p*.2})`:`rgba(255,220,180,${.05})`;m.fillRect(R()*WW,y,1+R()*3,1)}
  for(let i=0;i<40;i++){const y=R()*mundo.height*.5;m.strokeStyle='rgba(20,14,8,.7)';m.beginPath();let x0=R()*WW;m.moveTo(x0,y);for(let k=0;k<6;k++){x0+=R()*6-3;m.lineTo(x0,y+k*3)}m.stroke()}
  for(let i=0;i<14;i++){const y=mundo.height*(.3+R()*.7),X=WW*(.3+R()*.7);m.fillStyle=['#5ad0ff','#ff6ad8','#7aff8a'][i%3];m.fillRect(X,y,2,3)}
  // túneis
  m.lineCap='round';for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);for(const c of n.next){const o=M[n.r+1]&&M[n.r+1][c];if(!o)continue;const[e,f]=pos(o);m.strokeStyle='#120c08';m.lineWidth=7;m.beginPath();m.moveTo(a+8,b-3);m.bezierCurveTo((a+e)/2,b-3,(a+e)/2,f-3,e-8,f-3);m.stroke();m.strokeStyle='#1e150e';m.lineWidth=4;m.stroke()}}
  m.fillStyle='#120c08';m.fillRect(0,TOP-12,LEFT-6,20);texto(m,'ENTRADA',22,TOP-16,'#a89878',7);
  // portão do chefe
  const bxx=LEFT+rows*RW+30,byy=TOP+rows*DROP+3*CS+20;m.fillStyle='#08060a';m.beginPath();m.ellipse(bxx,byy,30,26,0,PI,0);m.lineTo(bxx+30,byy+4);m.lineTo(bxx-30,byy+4);m.fill();
  const P=caminho();let camX=0,cam=0,camx=0,hx=12,hy=TOP+6,i=-1,andando=false,vis=new Set(),opc=[],tudo=0,camT=null;
  loop((d,t,k)=>{const{x,g}=d;const alvo=camT!=null?camT:Math.max(0,Math.min(mundo.height-H,hy-H*.5));cam+=(alvo-cam)*(camT!=null?.2:.08)*k;const ax=camT!=null?camX:Math.max(0,Math.min(WW-W,hx-W*.4));camx+=(ax-camx)*(camT!=null?.2:.08)*k;x.save();x.translate(-Math.round(camx),0);g.save();g.translate(-Math.round(camx)/2,0);x.drawImage(mundo,0,-Math.round(cam));
    for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);const v=tudo||vis.has(n)||n.r<=i+2;sala(x,g,n,a,b-cam,t,v)}
    for(const o of opc){const[a,b]=pos(o);x.strokeStyle=`rgba(242,209,126,${.5+.5*Math.sin(t*.008)})`;x.lineWidth=1;x.beginPath();x.ellipse(a,b-cam-9,17,14,0,0,PI*2);x.stroke()}
    heroi(x,hx,hy-cam+2,andando,false,.65);x.restore();g.restore();
    // escuridão com a luz da lanterna
    const dk=d.dk||(d.dk=cv(W,H)),q=dk.getContext('2d');q.globalCompositeOperation='source-over';q.clearRect(0,0,W,H);q.fillStyle='rgba(3,2,5,.7)';q.fillRect(0,0,W,H);q.globalCompositeOperation='destination-out';
    const fl=1+Math.sin(t*.013)*.04,gr=q.createRadialGradient(hx-camx,hy-cam-8,0,hx-camx,hy-cam-8,90*fl);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,W,H);
    for(const n of vis){const[a,b]=pos(n);const g2=q.createRadialGradient(a-camx,b-cam,0,a-camx,b-cam,22);g2.addColorStop(0,'rgba(0,0,0,.6)');g2.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g2;q.fillRect(a-camx-22,b-cam-22,44,44)}
    if(!tudo)x.drawImage(dk,0,0);else{x.fillStyle='rgba(3,2,5,.25)';x.fillRect(0,0,W,H)}bola(g,(hx-camx)/2,(hy-cam-14)/2,34,'rgb(255,170,80)',.25);
    x.fillStyle='rgba(10,8,6,.8)';x.fillRect(0,H-16,W,16);texto(x,i<0?'Entrada':'Andar '+(i+1),W/2,H-5,'#f2d17e',9)});
  const anda=async(n)=>{const[a,b]=pos(n),x0=hx,y0=hy,dur=1300,t0=performance.now();andando=true;await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/dur);hx=x0+(a-x0)*p;hy=y0+(b-y0)*p;if(p<1)requestAnimationFrame(f);else ok()};f()});andando=false;vis.add(n)};
  await espera(900);for(let s=0;s<5;s++){const n=P[s];opc=s===0?M[0].filter(Boolean):M[s-1+0]?P[s-1].next.map(c=>M[s][c]).filter(Boolean):[];await espera(900);opc=[];await anda(n);i=s;await espera(600)}
  d.cap.textContent='"Ver mapa inteiro"';tudo=1;const ini=performance.now(),c0=cam,c1=Math.max(0,Math.min(mundo.height-H,TOP+rows*DROP+3*CS-H*.55)),x0=camx,x1=WW-W;await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-ini)/7000);camT=c0+(c1-c0)*p;camX=x0+(x1-x0)*p;if(p<1)requestAnimationFrame(f);else ok()};f()});await espera(900)}
/* ===================== 2. PORTAS, UMA DE CADA VEZ ===================== */
async function portas(){const W=180,H=Math.round(180*innerHeight/innerWidth),d=abre(W,H),M=G.map.rows;d.cap.textContent='2 · Portas, uma de cada vez';
  const P=caminho();let s=0,esc=0,hx=W/2,andando=false,porta=-1,fade=0;
  const pista={luta:['rosnados','#d8c8a8'],elite:['olhos vermelhos','#ff5a4a'],evento:['névoa estranha','#c8a8ff'],fogueira:['calor de fogo','#ff9a3a'],loja:['moedas tilintando','#ffd24a'],tesouro:['brilho dourado','#ffd24a'],forja:['martelo na bigorna','#ff7a2a']};
  loop((d,t,k)=>{const{x,g}=d,GY=Math.round(H*.62),opc=s===0?M[0].filter(Boolean).slice(0,3):P[s-1].next.map(c=>M[s][c]).filter(Boolean),esc2=Math.min(.6,s*.08);
    // corredor
    for(let y=0;y<GY;y+=8)for(let i=-(y/8%2)*8;i<W;i+=16){const j=.6+((i*7+y*3)%10)/20;x.fillStyle=`rgb(${(44*j*(1-esc2))|0},${(34*j*(1-esc2))|0},${(28*j*(1-esc2))|0})`;x.fillRect(i+1,y+1,15,7)}
    x.fillStyle='#120d0a';x.fillRect(0,GY,W,H-GY);for(let i=0;i<W;i+=12){x.fillStyle='#1e1612';x.fillRect(i,GY,11,3)}
    const n=opc.length,dw=Math.min(46,(W-20)/n-8);
    opc.forEach((o,j)=>{const X=Math.round(W/2+(j-(n-1)/2)*(dw+10)),top=GY-78,[nome,cor]=pista[o.type]||pista.luta,sel=j===porta;
      x.fillStyle='#0a0705';x.fillRect(X-dw/2-3,top-3,dw+6,81);x.fillStyle=sel?'#3a2a1a':'#2a1d12';x.beginPath();x.moveTo(X-dw/2,GY);x.lineTo(X-dw/2,top+dw/2);x.arc(X,top+dw/2,dw/2,PI,0);x.lineTo(X+dw/2,GY);x.fill();
      x.fillStyle='#1a120a';for(let k2=1;k2<4;k2++)x.fillRect(X-dw/2+k2*dw/4,top+6,1,GY-top-6);x.fillStyle='#8a6a3a';x.fillRect(X+dw/2-6,GY-24,2,2);
      const fl=.5+.5*Math.sin(t*.01+j*2);x.fillStyle=cor;x.globalAlpha=.6+fl*.4;x.fillRect(X-dw/2+2,GY-1,dw-4,1);x.globalAlpha=1;bola(g,X/2,(GY-2)/2,14,cor.replace(/#(..)(..)(..)/,(m,a,b,c)=>`rgb(${parseInt(a,16)},${parseInt(b,16)},${parseInt(c,16)})`),.25+fl*.2);
      if(o.type==='elite'&&Math.sin(t*.004+j)>-.5){x.fillStyle='#ff3a2a';x.fillRect(X-3,top+20,1,1);x.fillRect(X+2,top+20,1,1)}
      if(o.type==='evento'){bola(g,X/2,(top+30)/2,10,'rgb(170,130,255)',.25)}
      texto(x,nome,X,GY+12,cor,6);if(sel){x.strokeStyle=`rgba(242,209,126,${.6+.4*Math.sin(t*.01)})`;x.strokeRect(X-dw/2-4,top-4,dw+8,83)}});
    heroi(x,hx,H*.86,andando,false,.75);x.fillStyle=`rgba(0,0,0,${fade})`;x.fillRect(0,0,W,H);texto(x,'Andar '+(s+1),W/2,24,'#f2d17e',11)});
  for(s=0;s<4;s++){porta=-1;hx=W/2;fade=0;await espera(1200);const opc=s===0?M[0].filter(Boolean).slice(0,3):P[s-1].next.map(c=>M[s][c]).filter(Boolean);let j=opc.indexOf(P[s]);if(j<0)j=0;porta=j;await espera(800);
    const n=opc.length,dw=Math.min(46,(W-20)/n-8),X=W/2+(j-(n-1)/2)*(dw+10);andando=true;const t0=performance.now();await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/900);hx=W/2+(X-W/2)*p;fade=Math.max(0,(p-.5)*2);if(p<1)requestAnimationFrame(f);else ok()};f()});andando=false;await espera(250)}}
/* ===================== 3. CADA ATO COM O SEU JEITO ===================== */
async function atos(){const W=180,H=Math.round(180*innerHeight/innerWidth),d=abre(W,H);let fase=0,p=0;
  loop((d,t,k)=>{const{x,g}=d;
    if(fase===0){// poço de mina descendo com elevador
      const prof=p*260;for(let y=0;y<H;y+=4){const yy=y+prof,q=yy/600;x.fillStyle=`rgb(${(56-q*30)|0},${(42-q*24)|0},${(30-q*14)|0})`;x.fillRect(0,y,W,4)}
      x.fillStyle='#0c0907';x.fillRect(W/2-28,0,56,H);for(let k2=0;k2<12;k2++){const y=((k2*60-prof)%720+720)%720-60;x.fillStyle='#3a2614';x.fillRect(W/2-30,y,60,3);x.fillRect(W/2-30,y,3,40);x.fillRect(W/2+27,y,3,40);
        x.fillStyle='#1a1208';x.fillRect(W/2+30,y+18,40,14);x.fillStyle=['#ffd24a','#ff9a3a','#d8c8a8','#c8a8ff'][k2%4];x.fillRect(W/2+44,y+22,4,4);bola(g,(W/2+46)/2,(y+24)/2,8,'rgb(255,180,90)',.3)}
      const ey=H*.5;x.strokeStyle='#8a7a60';x.beginPath();x.moveTo(W/2-10,0);x.lineTo(W/2-10,ey);x.moveTo(W/2+10,0);x.lineTo(W/2+10,ey);x.stroke();x.fillStyle='#5a3a1e';x.fillRect(W/2-16,ey,32,4);heroi(x,W/2,ey,false,false,.6);
      bola(g,W/2/2,(ey-14)/2,26,'rgb(255,170,80)',.3);texto(x,'Ato 1 · O poço da mina (desce)',W/2,H-10,'#f2d17e',8)}
    else if(fase===1){// catacumbas: pontes sobre a água
      const px=p*220;x.fillStyle='#0a1218';x.fillRect(0,0,W,H);for(let y=0;y<H*.55;y+=8)for(let i=-(y/8%2)*8;i<W+16;i+=16){x.fillStyle='#1a2228';x.fillRect(i+1-(px*.4%16),y+1,15,7)}
      const wy=H*.62;for(let y=wy;y<H;y+=2){x.fillStyle=`rgb(10,${24+((y*3+t*.05)|0)%8},${40+((y+t*.03)|0)%10})`;x.fillRect(0,y,W,2)}
      for(let k2=0;k2<6;k2++){const X=k2*70-px+30;x.fillStyle='#3a3028';x.fillRect(X,wy-4,60,4);for(let q=0;q<60;q+=6){x.fillStyle='#2a2018';x.fillRect(X+q,wy,2,10)}x.fillStyle='#1a120a';x.fillRect(X+26,wy-30,12,26);x.fillStyle=['#d8c8a8','#c8a8ff','#ff9a3a','#ff5a4a','#ffd24a','#d8c8a8'][k2];x.fillRect(X+30,wy-22,4,4);bola(g,(X+32)/2,(wy-20)/2,9,'rgb(150,200,255)',.25)}
      heroi(x,W*.4,wy-3,true,false,.6);for(let i=0;i<20;i++){const xx=(i*37+t*.02)%W,yy=wy+6+(i*13)%40;if(Math.sin(t*.003+i)>.3){x.fillStyle='rgba(160,200,230,.35)';x.fillRect(xx,yy,3,1)}}texto(x,'Ato 2 · Pontes das catacumbas (atravessa)',W/2,H-10,'#9ad8ff',8)}
    else{// torre: escada em espiral subindo
      const sub=p*300;x.fillStyle='#08060c';x.fillRect(0,0,W,H);const cx=W/2;for(let y=0;y<H;y+=6)for(let i=-(y/6%2)*6;i<W;i+=12){const yy=y+(sub%12);x.fillStyle='#16121e';x.fillRect(cx-40+((i)%80),yy,11,5)}
      x.fillStyle='#1e1828';x.fillRect(cx-40,0,80,H);for(let k2=0;k2<40;k2++){const a=k2*.5,yy=H*.75-(k2*14-sub),xx=cx+Math.cos(a)*34,frente=Math.sin(a)>0;if(yy<-10||yy>H+10)continue;x.fillStyle=frente?'#5a4a6a':'#2a2234';x.fillRect(xx-8,yy,16,3)}
      for(let k2=0;k2<6;k2++){const yy=H*.75-(k2*70-sub);x.fillStyle='#ffd27a';x.fillRect(cx-2,yy-30,4,6);bola(g,cx/2,(yy-27)/2,10,'rgb(255,180,90)',.3)}
      const a=sub/14*.5,hy=H*.72;heroi(x,cx+Math.cos(a)*30,hy,true,Math.sin(a)<0,.6);
      if(p>.7){bola(g,cx/2,10,40,'rgb(150,80,255)',(p-.7)*1.5);texto(x,'O Corvo Rei',cx,26,'#c8a8ff',9)}texto(x,'Ato 3 · A torre (sobe)',W/2,H-10,'#c8a8ff',8)}});
  for(fase=0;fase<3;fase++){d.cap.textContent='3 · Cada ato com o seu jeito';const t0=performance.now();await new Promise(ok=>{const f=()=>{p=Math.min(1,(performance.now()-t0)/5200);if(p<1)requestAnimationFrame(f);else ok()};f()})}}
/* ===================== 4. DE LADO: DESCENDO DE VERDADE ===================== */
async function lado(){const VW=150,VH=Math.round(150*innerHeight/innerWidth),d=abre(VW,VH),M=G.map.rows,rows=M.length,CX=78,RH=74,TOP=60;d.cap.textContent='De lado · descendo de verdade';
  const pos=n=>[40+n.c*CX+(n.jx||0)*.6,TOP+n.r*RH];const WW=40+6*CX+60,WH=TOP+rows*RH+80;
  const mundo=cv(WW,WH),m=mundo.getContext('2d'),r0=sr({r:3,c:5});
  // rocha
  for(let y=0;y<WH;y+=2){const p=y/WH;m.fillStyle=`rgb(${(64-p*36)|0},${(48-p*28)|0},${(36-p*18)|0})`;m.fillRect(0,y,WW,2)}
  for(let i=0;i<2600;i++){const y=r0()*WH,p=y/WH;m.fillStyle=r0()<.55?`rgba(0,0,0,${.22+p*.2})`:'rgba(255,225,190,.05)';m.fillRect(r0()*WW,y,1+r0()*4,1+(r0()<.2?1:0))}
  for(let i=0;i<60;i++){const y=WH*(.3+r0()*.7),X=r0()*WW;m.fillStyle=['#5ad0ff','#ff6ad8','#7aff8a','#ffd24a'][i%4];m.fillRect(X,y,2,3);m.fillStyle='rgba(255,255,255,.4)';m.fillRect(X,y,1,1)}
  // céu/entrada lá em cima
  m.fillStyle='#1a1430';m.fillRect(0,0,WW,TOP-30);for(let i=0;i<60;i++){m.fillStyle='rgba(230,235,255,.6)';m.fillRect(r0()*WW,r0()*(TOP-34),1,1)}m.fillStyle='#2a2018';m.fillRect(0,TOP-30,WW,3);
  // túneis: rampa com degraus, ou poço com escada de corda quando quase reto
  const cava=(x0,y0,x1,y1)=>{m.fillStyle='#120c08';m.strokeStyle='#120c08';m.lineCap='round';
    if(Math.abs(x1-x0)<26){const xm=(x0+x1)/2;m.fillRect(xm-7,y0-14,14,y1-y0+14);m.fillStyle='#6a4a28';m.fillRect(xm-5,y0-12,1,y1-y0+12);m.fillRect(xm+4,y0-12,1,y1-y0+12);for(let y=y0-10;y<y1;y+=5)m.fillRect(xm-5,y,10,1)}
    else{const dir=Math.sign(x1-x0),ax=x0+dir*14,bx=x1-dir*14;m.lineWidth=20;m.beginPath();m.moveTo(x0,y0-9);m.lineTo(ax,y0-9);m.lineTo(bx,y1-9);m.lineTo(x1,y1-9);m.stroke();
      m.fillStyle='#3a2a1c';const n=Math.max(4,Math.round(Math.abs(bx-ax)/6));for(let k=0;k<=n;k++){const t=k/n,x=ax+(bx-ax)*t,y=y0+(y1-y0)*t;m.fillRect(x-3,Math.round(y),6,2)}m.fillRect(Math.min(x0,ax)-2,y0,Math.abs(ax-x0)+4,2);m.fillRect(Math.min(x1,bx)-2,y1,Math.abs(bx-x1)+4,2)}};
  for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);for(const c of n.next){const o=M[n.r+1]&&M[n.r+1][c];if(o){const[e,f]=pos(o);cava(a,b,e,f)}}}
  // poço de entrada e salas (chão de pedra onde o herói pisa)
  const P=caminho(),[ex]=pos(P[0]);cava(ex,TOP-30,ex,TOP);for(const n of M[0])if(n){const[a]=pos(n);if(a!==ex){m.lineWidth=18;m.strokeStyle='#120c08';m.beginPath();m.moveTo(ex,TOP-9);m.lineTo(a,TOP-9);m.stroke()}}
  for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);m.fillStyle='#0e0906';m.beginPath();m.ellipse(a,b-14,22,17,0,PI,0);m.lineTo(a+22,b+1);m.lineTo(a-22,b+1);m.fill();m.fillStyle='#4a3a2c';m.fillRect(a-24,b,48,3);m.fillStyle='#6a5640';m.fillRect(a-24,b,48,1)}
  const by=TOP+rows*RH,bxx=WW/2;m.fillStyle='#08060a';m.beginPath();m.ellipse(bxx,by+30,46,38,0,PI,0);m.lineTo(bxx+46,by+40);m.lineTo(bxx-46,by+40);m.fill();
  let hx=ex,hy=TOP-30,cx=hx,cy=hy,i=-1,andando=false,opc=[],flip=false,vis=new Set(),tudo=0,zoom=1;
  loop((d,t,k)=>{const{x,g}=d;const VWz=VW*zoom,VHz=VH*zoom;const tx=Math.max(0,Math.min(WW-VWz,hx-VWz/2)),ty=VHz>WH?-(VHz-WH)/2:Math.max(0,Math.min(WH-VHz,hy-VHz*.55));cx+=(tx-cx)*.1*k;cy+=(ty-cy)*.1*k;
    x.save();x.scale(1/zoom,1/zoom);x.drawImage(mundo,-Math.round(cx),-Math.round(cy));
    for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);if(Math.abs(a-hx)>VWz||Math.abs(b-hy)>VHz)continue;sala(x,g,n,a-cx,b-cy,t,tudo||vis.has(n)||n.r<=i+2)}
    for(const o of opc){const[a,b]=pos(o);x.strokeStyle=`rgba(242,209,126,${.5+.5*Math.sin(t*.008)})`;x.lineWidth=1;x.beginPath();x.ellipse(a-cx,b-cy-12,24,19,0,0,PI*2);x.stroke()}
    heroi(x,hx-cx,hy-cy+1,andando,flip,.8);x.restore();if(zoom>1.01){g.clearRect(0,0,d.W/2,d.H/2)}
    if(!tudo){const dk=d.dk||(d.dk=cv(VW,VH)),q=dk.getContext('2d');q.globalCompositeOperation='source-over';q.clearRect(0,0,VW,VH);q.fillStyle='rgba(3,2,5,.82)';q.fillRect(0,0,VW,VH);q.globalCompositeOperation='destination-out';
      const fl=1+Math.sin(t*.013)*.04,lx=(hx-cx)/zoom,ly=(hy-cy-20)/zoom,gr=q.createRadialGradient(lx,ly,0,lx,ly,70*fl/zoom);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.5,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,VW,VH);
      for(const o of opc){const[a,b]=pos(o),ox=(a-cx)/zoom,oy=(b-cy-12)/zoom,g2=q.createRadialGradient(ox,oy,0,ox,oy,26);g2.addColorStop(0,'rgba(0,0,0,.7)');g2.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g2;q.fillRect(ox-26,oy-26,52,52)}
      x.drawImage(dk,0,0);bola(g,lx/2,ly/2,30,'rgb(255,170,80)',.28)}
    x.fillStyle='rgba(10,8,6,.8)';x.fillRect(0,VH-16,VW,16);texto(x,i<0?'Entrada':'Andar '+(i+1),VW/2,VH-5,'#f2d17e',9)});
  const segue=async pts=>{andando=true;for(let j=1;j<pts.length;j++){const[x0,y0]=pts[j-1],[x1,y1]=pts[j],L=Math.hypot(x1-x0,y1-y0),dur=Math.max(250,L*26),t0=performance.now();if(x1!==x0)flip=x1<x0;
      await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/dur);hx=x0+(x1-x0)*p;hy=y0+(y1-y0)*p;if(p<1)requestAnimationFrame(f);else ok()};f()})}andando=false};
  const rota=(a,b)=>{const[x0,y0]=a,[x1,y1]=b;if(Math.abs(x1-x0)<26){const xm=(x0+x1)/2;return[[x0,y0],[xm,y0],[xm,y1],[x1,y1]]}const dir=Math.sign(x1-x0);return[[x0,y0],[x0+dir*14,y0],[x1-dir*14,y1],[x1,y1]]};
  await espera(700);await segue([[ex,TOP-30],[ex,TOP]]);
  for(let s=0;s<5;s++){opc=s===0?M[0].filter(Boolean):P[s-1].next.map(c=>M[s][c]).filter(Boolean);if(s===0)opc=opc.filter(o=>Math.abs(pos(o)[0]-ex)<CX*2.2);await espera(1100);opc=[];
    const de=s===0?[ex,TOP]:pos(P[s-1]),para=pos(P[s]);await segue(s===0?[de,[para[0],para[1]]]:rota(de,para));vis.add(P[s]);i=s;await espera(500)}
  d.cap.textContent='"Ver mapa inteiro"';tudo=1;const z0=performance.now();await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-z0)/2500);zoom=1+p*(Math.max(WW/VW,1)*1.02-1);if(p<1)requestAnimationFrame(f);else ok()};f()});
  const y0=hy,t1=performance.now();await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t1)/6000);hy=y0+(WH-VH*zoom*.45-y0)*p;hx=WW/2;if(p<1)requestAnimationFrame(f);else ok()};f()});await espera(600)}
/* ===================== 5. CORTE DEITADO BONITO ===================== */
async function bonito(){const W=300,H=Math.round(300*innerHeight/innerWidth),d=abre(W,H),M=G.map.rows,rows=M.length,cols=7,RW=64,DROP=24,CS=30,TOP=78,LEFT=58;d.cap.textContent='';
  const pos=n=>[LEFT+n.r*RW+(n.jx||0)*.3,TOP+n.r*DROP+n.c*CS+(n.jy||0)*.25];const WW=LEFT+rows*RW+130,WHt=TOP+rows*DROP+cols*CS+90,rr=sr({r:11,c:3});
  const mundo=cv(WW,WHt),m=mundo.getContext('2d'),LUZES=[],CRIS=[],AGUA=[],P2=(c,X,Y,w=1,h=1)=>{m.fillStyle=c;m.fillRect(Math.round(X),Math.round(Y),w,h)};
  const prof=(X,Y)=>Math.max(0,Math.min(1,((Y-TOP)/(WHt-TOP))*.6+(X/WW)*.5));
  const cor=(X,Y,k=1)=>{const p=prof(X,Y);let c;if(p<.45){const t=p/.45;c=[96-t*40,70-t*22,48-t*6]}else if(p<.8){const t=(p-.45)/.35;c=[56-t*6,48-t*10,42+t*4]}else{const t=(p-.8)/.2;c=[50+t*30,38-t*8,46-t*14]}return`rgb(${c[0]*k|0},${c[1]*k|0},${c[2]*k|0})`};
  // céu, lua, árvores e grama
  const SKY=TOP-34,sg=m.createLinearGradient(0,0,0,SKY);sg.addColorStop(0,'#0a0a24');sg.addColorStop(1,'#2a2448');m.fillStyle=sg;m.fillRect(0,0,WW,SKY);
  for(let i=0;i<160;i++)P2(`rgba(230,235,255,${.3+rr()*.6})`,rr()*WW,rr()*SKY*.9);m.fillStyle='#efe6cf';m.beginPath();m.arc(WW*.18,18,9,0,7);m.fill();m.fillStyle='rgba(150,140,120,.4)';m.beginPath();m.arc(WW*.18-3,16,2.5,0,7);m.fill();
  m.fillStyle='#120f20';m.beginPath();m.moveTo(0,SKY);for(let X=0;X<=WW;X+=6)m.lineTo(X,SKY-8-Math.sin(X*.03)*5-rr()*3);m.lineTo(WW,SKY);m.fill();
  for(let i=0;i<26;i++){const X=rr()*WW,h=10+rr()*14;m.fillStyle='#0c0a16';m.fillRect(X,SKY-h,2,h);m.beginPath();m.ellipse(X+1,SKY-h,5+rr()*3,6+rr()*4,0,0,7);m.fill()}
  // rocha com camadas onduladas
  for(let Y=SKY;Y<WHt;Y+=2)for(let X=0;X<WW;X+=4){const onda=Math.sin(X*.02+Y*.05)+Math.sin(X*.007-Y*.03)*1.4,k=.82+((Math.floor((Y+onda*6)/9))%3)*.09+(rr()-.5)*.06;m.fillStyle=cor(X,Y,k);m.fillRect(X,Y,4,2)}
  m.fillStyle='#3a5a22';m.fillRect(0,SKY,WW,2);for(let X=0;X<WW;X+=2)if(rr()<.6)P2('#4a7a2a',X,SKY-1-(rr()*2|0),1,2);
  // raízes perto da superfície
  for(let i=0;i<40;i++){let X=rr()*WW,Y=SKY+2;m.strokeStyle='rgba(40,26,14,.8)';m.lineWidth=1;m.beginPath();m.moveTo(X,Y);for(let k=0;k<7;k++){X+=rr()*6-3;Y+=2+rr()*3;m.lineTo(X,Y)}m.stroke()}
  // pedrinhas, rachaduras, fósseis
  for(let i=0;i<900;i++){const X=rr()*WW,Y=SKY+4+rr()*(WHt-SKY);P2(rr()<.55?'rgba(0,0,0,.22)':'rgba(255,230,200,.06)',X,Y,1+(rr()*3|0),1)}
  for(let i=0;i<10;i++){const X=WW*(.1+rr()*.8),Y=SKY+30+rr()*(WHt-SKY-60);for(let k=0;k<5;k++)P2('rgba(210,200,180,.45)',X+k*2,Y+(k%2),2,1);P2('rgba(210,200,180,.45)',X-2,Y-1,2,3)}
  // grutas ao fundo com estalactites
  for(let i=0;i<9;i++){const X=WW*(.1+rr()*.85),Y=SKY+40+rr()*(WHt-SKY-80),rw=18+rr()*26,rh=8+rr()*10;m.fillStyle='rgba(10,7,6,.55)';m.beginPath();m.ellipse(X,Y,rw,rh,0,0,7);m.fill();for(let k=-rw+3;k<rw-3;k+=4)if(rr()<.7){const h=2+rr()*5;m.beginPath();m.moveTo(X+k-1.5,Y-rh*.7);m.lineTo(X+k+1.5,Y-rh*.7);m.lineTo(X+k,Y-rh*.7+h);m.fill()}}
  // cristais e cogumelos (brilham)
  for(let i=0;i<22;i++){const X=WW*(.15+rr()*.85),Y=SKY+30+rr()*(WHt-SKY-50),c=['#5ad0ff','#ff6ad8','#7aff8a','#b07aff'][i%4];for(let k=0;k<3;k++){const h=3+rr()*5;m.fillStyle=c;m.beginPath();m.moveTo(X+k*2-1,Y);m.lineTo(X+k*2+1,Y);m.lineTo(X+k*2,Y-h);m.fill()}P2('#ffffff',X+2,Y-3);CRIS.push([X+2,Y-3,c])}
  // rio subterrâneo e lava perto do chefe
  const rioY=TOP+rows*DROP*.55+cols*CS+30;m.fillStyle='rgba(8,6,6,.7)';m.beginPath();m.ellipse(WW*.48,rioY+2,WW*.26,12,0,PI,0);m.fill();const rg=m.createLinearGradient(0,rioY,0,rioY+9);rg.addColorStop(0,'#1a4a6a');rg.addColorStop(1,'#08182a');m.fillStyle=rg;m.fillRect(WW*.24,rioY,WW*.48,9);m.fillStyle='#4a3a2c';m.fillRect(WW*.24,rioY+9,WW*.48,2);AGUA.push([WW*.24,WW*.72,rioY]);LUZES.push([WW*.48,rioY+3,'rgb(80,170,230)',50,.25])
  const bxx=LEFT+rows*RW+60,byy=TOP+rows*DROP+3*CS+30;m.fillStyle='#3a0a06';m.fillRect(bxx-70,byy+4,140,14);for(let X=bxx-70;X<bxx+70;X+=3)P2(rr()<.5?'#ff6a1a':'#ffb03a',X,byy+4+rr()*3,2,1);LUZES.push([bxx,byy+8,'rgb(255,90,30)',40,.4]);
  // portão do chefe com caveira
  m.fillStyle='#08060a';m.beginPath();m.ellipse(bxx,byy,34,32,0,PI,0);m.lineTo(bxx+34,byy+4);m.lineTo(bxx-34,byy+4);m.fill();for(let k=0;k<11;k++){const a2=PI+k*PI/10;P2(k%2?'#3a3438':'#4a4448',bxx+Math.cos(a2)*36-2,byy+Math.sin(a2)*34-2,4,4)}
  ['.###.','#####','#.#.#','#####','.#.#.'].forEach((ln,j)=>[...ln].forEach((ch,i)=>{if(ch==='#')P2('#d8d0b8',bxx-5+i*2,byy-44+j*2,2,2)}));LUZES.push([bxx,byy-12,'rgb(255,40,30)',16,.35]);
  // túneis escorados com vigas e tochas
  m.lineCap='round';const tunel=(a,b,e,f)=>{const pts=[];for(let k=0;k<=24;k++){const t=k/24,u=t*t*(3-2*t);pts.push([a+(e-a)*t,b+(f-b)*u])}
    m.strokeStyle='rgba(0,0,0,.35)';m.lineWidth=12;m.beginPath();pts.forEach(([X,Y],k)=>k?m.lineTo(X,Y-5):m.moveTo(X,Y-5));m.stroke();
    m.strokeStyle='#140d09';m.lineWidth=11;m.stroke();m.strokeStyle='#1e140d';m.lineWidth=7;m.stroke();
    for(let k=6;k<pts.length-4;k+=9){const[X,Y]=pts[k];P2('#4a3018',X-5,Y-11,1,10);P2('#4a3018',X+4,Y-11,1,10);P2('#5a3a1e',X-5,Y-11,10,1)}
    pts.forEach(([X,Y],k)=>{if(k%2===0)P2('#3a2a1a',X-1,Y-1,3,1)});if(rr()<.45){const[X,Y]=pts[12];P2('#3a2410',X,Y-12,1,3);LUZES.push([X,Y-14,'rgb(255,150,60)',22,.55,1])}};
  for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);for(const c of n.next){const o=M[n.r+1]&&M[n.r+1][c];if(o){const[e,f]=pos(o);tunel(a+10,b,e-10,f)}}}
  // poço de mina: estrutura de madeira com roldana na superfície, escada descendo e saídas laterais para o Andar 1
  const P=caminho(),SHX=LEFT-30,prim=M[0].filter(Boolean),fundo=Math.max(...prim.map(n=>pos(n)[1]))+4;
  m.fillStyle='#0c0806';m.fillRect(SHX-7,SKY,14,fundo-SKY+4);m.fillStyle='#160f0a';m.fillRect(SHX-5,SKY,10,fundo-SKY+4);
  for(let Y=SKY;Y<fundo;Y+=4){P2('#6a4a28',SHX-4,Y,8,1)}P2('#5a3a1e',SHX-5,SKY,1,fundo-SKY);P2('#5a3a1e',SHX+4,SKY,1,fundo-SKY);
  for(let Y=SKY+10;Y<fundo;Y+=22){P2('#4a3018',SHX-8,Y,16,2)}
  for(const n of prim){const[a,b]=pos(n);m.fillStyle='#140d09';m.fillRect(SHX,b-11,a-10-SHX,12);m.fillStyle='#1e140d';m.fillRect(SHX,b-9,a-10-SHX,8);P2('#3a2a1a',SHX,b,a-10-SHX,1);P2('#5a3a1e',SHX+6,b-12,1,12);P2('#5a3a1e',SHX+6,b-12,a-20-SHX,1);
    P2('#3a2410',SHX+9,b-10,1,3);LUZES.push([SHX+9,b-11,'rgb(255,150,60)',18,.5,1])}
  // cabeça do poço na superfície
  m.fillStyle='#4a3018';m.beginPath();m.moveTo(SHX-14,SKY);m.lineTo(SHX-2,SKY-26);m.lineTo(SHX-1,SKY-26);m.lineTo(SHX-11,SKY);m.fill();m.beginPath();m.moveTo(SHX+14,SKY);m.lineTo(SHX+2,SKY-26);m.lineTo(SHX+1,SKY-26);m.lineTo(SHX+11,SKY);m.fill();
  P2('#5a3a1e',SHX-9,SKY-27,18,3);m.fillStyle='#2a2018';m.beginPath();m.arc(SHX,SKY-24,3.5,0,7);m.fill();P2('#8a7a60',SHX-1,SKY-21,1,SKY-SKY+21);
  P2('#3a2a1a',SHX+10,SKY-14,1,6);P2('#ffd27a',SHX+9,SKY-9,3,3);LUZES.push([SHX+10,SKY-8,'rgb(255,190,90)',26,.55]);
  P2('#3a2a1a',SHX-24,SKY-8,10,8);P2('#5a3a1e',SHX-24,SKY-8,10,1);texto(m,'A MASMORRA',SHX+6,SKY-34,'#c8b088',7);
  // patamares de pedra das salas
  for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);P2('#2a2018',a-15,b+1,30,3);P2('#5a4a3a',a-15,b+1,30,1);P2('rgba(0,0,0,.4)',a-14,b+4,28,2)}
  let camX=0,cam=0,camx=0,hx=SHX,hy=SKY-2,i=-1,andando=false,vis=new Set(),opc=[],tudo=0,camT=null;
  loop((d,t,k)=>{const{x,g}=d;const alvo=camT!=null?camT:Math.max(0,Math.min(WHt-H,hy-H*.5));cam+=(alvo-cam)*(camT!=null?.2:.08)*k;const ax=camT!=null?camX:Math.max(0,Math.min(WW-W,hx-W*.4));camx+=(ax-camx)*(camT!=null?.2:.08)*k;
    x.save();x.translate(-Math.round(camx),-Math.round(cam));g.save();g.translate(-Math.round(camx)/2,-Math.round(cam)/2);x.drawImage(mundo,0,0);
    // água e lava mexendo
    for(const[x0,x1,yy]of AGUA)for(let X=x0;X<x1;X+=2){const k2=((X+t*.03)%14+14)%14;if(k2<2)P2c(x,'rgba(150,200,230,.6)',X,yy+2+Math.sin(X*.1+t*.004))}
    for(let X=bxx-70;X<bxx+70;X+=2){if(Math.sin(X*.3+t*.006)>.6)P2c(x,'#ffd24a',X,byy+5)}
    for(const[X,Y,c]of CRIS)bola(g,X/2,Y/2,6,c==='#5ad0ff'?'rgb(90,200,255)':c==='#ff6ad8'?'rgb(255,110,210)':c==='#7aff8a'?'rgb(120,255,140)':'rgb(170,120,255)',.35+Math.sin(t*.002+X)*.15);
    for(const[X,Y,c,r2,a2,toch]of LUZES){const f=Math.sin(t*.013+X)*.5+.5;if(toch){P2c(x,'#ff7a26',X,Y,1,2);if(f>.5)P2c(x,'#ffe07a',X,Y)}bola(g,X/2,Y/2,r2/2*(1+f*.08),c,a2*(.85+f*.15))}
    for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);sala(x,g,n,a,b,t,tudo||vis.has(n)||n.r<=i+2)}
    for(const o of opc){const[a,b]=pos(o);x.strokeStyle=`rgba(242,209,126,${.5+.5*Math.sin(t*.008)})`;x.lineWidth=1;x.beginPath();x.ellipse(a,b-9,17,14,0,0,PI*2);x.stroke()}
    heroi(x,hx,hy+1,andando,false,.62);x.restore();g.restore();
    if(!tudo){const dk=d.dk||(d.dk=cv(W,H)),q=dk.getContext('2d');q.globalCompositeOperation='source-over';q.clearRect(0,0,W,H);q.fillStyle='rgba(4,3,8,.62)';q.fillRect(0,0,W,H);q.globalCompositeOperation='destination-out';
      const fl=1+Math.sin(t*.013)*.04,lx=hx-camx,ly=hy-cam-10,gr=q.createRadialGradient(lx,ly,0,lx,ly,95*fl);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.5,'rgba(0,0,0,.8)');gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,W,H);
      for(const[X,Y,c,r2]of LUZES.concat(CRIS.map(([X,Y])=>[X,Y,0,14]))){const X2=X-camx,Y2=Y-cam;if(X2<-40||X2>W+40||Y2<-40||Y2>H+40)continue;const g2=q.createRadialGradient(X2,Y2,0,X2,Y2,r2);g2.addColorStop(0,'rgba(0,0,0,.75)');g2.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g2;q.fillRect(X2-r2,Y2-r2,r2*2,r2*2)}
      if(cam<SKY){q.fillStyle='rgba(0,0,0,1)';q.fillRect(0,0,W,SKY-cam)}
      x.drawImage(dk,0,0);bola(g,lx/2,ly/2,40,'rgb(255,170,80)',.25)}
    // vinheta e nome do andar
    const vg=x.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.65);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=vg;x.fillRect(0,0,W,H);
    texto(x,tudo?'Ver mapa inteiro':i<0?'A Masmorra · Entrada':'A Masmorra · Andar '+(i+1),W/2,14,'#f2d17e',9)});
  const mov=(a,b,dur)=>{const x0=hx,y0=hy,t0=performance.now();andando=true;return new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/dur);hx=x0+(a-x0)*p;hy=y0+(b-y0)*p;if(p<1)requestAnimationFrame(f);else ok()};f()})};
  const anda=async(n)=>{const[a,b]=pos(n),x0=hx,y0=hy,dur=1500,t0=performance.now();andando=true;await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/dur),u=p*p*(3-2*p);hx=x0+(a-x0)*p;hy=y0+(b-y0)*u;if(p<1)requestAnimationFrame(f);else ok()};f()});andando=false;vis.add(n)};
  await espera(1000);for(let s2=0;s2<5;s2++){const n=P[s2];opc=s2===0?M[0].filter(Boolean):P[s2-1].next.map(c=>M[s2][c]).filter(Boolean);await espera(1000);opc=[];if(s2===0){const[a,b]=pos(n);await mov(SHX,b,Math.max(600,(b-hy)*22));await mov(a-12,b,900);andando=false}await anda(n);i=s2;await espera(600)}
  tudo=1;const ini=performance.now(),c0=cam,c1=Math.max(0,Math.min(WHt-H,byy-H*.6)),x0=camx,x1=WW-W;await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-ini)/7500),u=p*p*(3-2*p);camT=c0+(c1-c0)*u;camX=x0+(x1-x0)*u;if(p<1)requestAnimationFrame(f);else ok()};f()});await espera(1000)}
const P2c=(x,c,X,Y,w=1,h=1)=>{x.fillStyle=c;x.fillRect(Math.round(X),Math.round(Y),w,h)};
window.PROTO={run:async m=>{if(!G||!G.map)return;if(m==='corte')await corte();else if(m==='portas')await portas();else if(m==='lado')await lado();else if(m==='deitado')await deitado();else if(m==='bonito')await bonito();else await atos();fecha()}};
})();
