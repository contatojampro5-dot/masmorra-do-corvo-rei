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
/* ---------- desenho de cada lugar (pequena cena) ---------- */
function sala(x,g,n,X,Y,t,vis){const tp=n.type;x.fillStyle='#0c0907';x.beginPath();x.ellipse(X,Y-6,13,10,0,PI,0);x.lineTo(X+13,Y+2);x.lineTo(X-13,Y+2);x.fill();x.fillStyle='#2a2018';x.fillRect(X-14,Y+1,28,2);
  if(!vis)return;const f=Math.sin(t*.01+X)*.5+.5;
  if(tp==='fogueira'){for(let d=-2;d<=2;d++){const h=2+Math.round((4-Math.abs(d))*(0.6+f*.4));x.fillStyle='#ff7a26';x.fillRect(X+d,Y-h,1,h)}x.fillStyle='#ffe07a';x.fillRect(X,Y-3,1,2);bola(g,X/2,(Y-4)/2,14,'rgb(255,140,50)',.5)}
  else if(tp==='loja'){x.fillStyle='#3a2a1a';x.fillRect(X-1,Y-14,1,8);x.fillStyle='#ffd27a';x.fillRect(X-2,Y-7,3,4);bola(g,X/2,(Y-5)/2,10,'rgb(255,200,90)',.45);x.fillStyle='#ffd24a';x.fillRect(X+4,Y-2,2,2)}
  else if(tp==='elite'){if(Math.sin(t*.003+X)>-.7){x.fillStyle='#ff3a2a';x.fillRect(X-3,Y-8,1,1);x.fillRect(X+2,Y-8,1,1);bola(g,X/2,(Y-8)/2,5,'rgb(255,60,40)',.6)}}
  else if(tp==='evento'){bola(g,X/2,(Y-6)/2,10,'rgb(170,130,255)',.3+f*.2);texto(x,'?',X,Y-2,'#d8c8ff',10)}
  else if(tp==='tesouro'){x.fillStyle='#6a4a1e';x.fillRect(X-4,Y-5,8,5);x.fillStyle='#ffd24a';x.fillRect(X-4,Y-5,8,1);x.fillRect(X-1,Y-4,2,2);bola(g,X/2,(Y-3)/2,8,'rgb(255,210,80)',.35)}
  else if(tp==='forja'){x.fillStyle='#5a5250';x.fillRect(X-4,Y-4,8,2);x.fillRect(X-2,Y-2,4,2);if(Math.sin(t*.02)>.7){x.fillStyle='#fff0a0';x.fillRect(X+R()*6-3,Y-6-R()*3,1,1)}bola(g,X/2,(Y-3)/2,9,'rgb(255,110,40)',.35)}
  else{x.fillStyle='#8a7a60';x.fillRect(X-4,Y-8,1,6);x.fillRect(X+3,Y-8,1,6);x.fillRect(X-5,Y-4,3,1);x.fillRect(X+2,Y-4,3,1)}}
/* ---------- infra comum ---------- */
let D=null;
function abre(W,H){fecha();const box=document.createElement('div');box.id='proto';box.style.cssText='position:fixed;inset:0;z-index:900;background:#000';const a=cv(W,H),b=cv(W/2,H/2);for(const c of [a,b]){c.style.cssText='position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated'}b.style.mixBlendMode='screen';
  const cap=document.createElement('div');cap.style.cssText='position:absolute;left:0;right:0;top:12px;text-align:center;font:400 20px "IM Fell English SC",serif;color:#f2d17e;text-shadow:0 2px 4px #000';box.append(a,b,cap);document.body.appendChild(box);D={a,b,x:a.getContext('2d'),g:b.getContext('2d'),cap,W,H,on:true};D.x.imageSmoothingEnabled=false;return D}
function fecha(){const e=document.getElementById('proto');if(e)e.remove();if(D)D.on=false;D=null}
const espera=ms=>new Promise(r=>setTimeout(r,ms));
function loop(fn){const d=D;let last=performance.now();const f=t=>{if(!d.on)return;requestAnimationFrame(f);const k=Math.min(3,(t-last)/33);last=t;hf++;d.x.clearRect(0,0,d.W,d.H);d.g.clearRect(0,0,d.W/2,d.H/2);d.g.globalCompositeOperation='lighter';fn(d,t,k);d.g.globalCompositeOperation='source-over'};requestAnimationFrame(f)}
/* ===================== 1. CORTE DA MASMORRA COM LANTERNA ===================== */
async function corte(){const W=180,H=Math.round(180*innerHeight/innerWidth),d=abre(W,H),M=G.map.rows,rows=M.length,cols=7,RH=46,TOP=40;d.cap.textContent='1 · Corte da masmorra';
  const pos=n=>[18+n.c*(W-36)/(cols-1)+(n.jx||0)*.3,TOP+n.r*RH+(n.jy||0)*.2];
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
  const P=caminho();let cam=0,hx=pos(P[0])[0],hy=TOP-12,i=-1,andando=false,vis=new Set(),opc=[];
  loop((d,t,k)=>{const{x,g}=d;const alvo=Math.max(0,Math.min(mundo.height-H,hy-H*.45));cam+=(alvo-cam)*.08*k;x.drawImage(mundo,0,-Math.round(cam));
    for(const row of M)for(const n of row){if(!n)continue;const[a,b]=pos(n);const v=vis.has(n)||n.r<=i+1;sala(x,g,n,a,b-cam,t,v)}
    for(const o of opc){const[a,b]=pos(o);x.strokeStyle=`rgba(242,209,126,${.5+.5*Math.sin(t*.008)})`;x.lineWidth=1;x.beginPath();x.ellipse(a,b-cam-6,15,12,0,0,PI*2);x.stroke()}
    heroi(x,hx,hy-cam+2,andando,false,.5);
    // escuridão com a luz da lanterna
    const dk=d.dk||(d.dk=cv(W,H)),q=dk.getContext('2d');q.globalCompositeOperation='source-over';q.clearRect(0,0,W,H);q.fillStyle='rgba(3,2,5,.8)';q.fillRect(0,0,W,H);q.globalCompositeOperation='destination-out';
    const fl=1+Math.sin(t*.013)*.04,gr=q.createRadialGradient(hx,hy-cam-8,0,hx,hy-cam-8,70*fl);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.55,'rgba(0,0,0,.85)');gr.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=gr;q.fillRect(0,0,W,H);
    for(const n of vis){const[a,b]=pos(n);const g2=q.createRadialGradient(a,b-cam,0,a,b-cam,22);g2.addColorStop(0,'rgba(0,0,0,.6)');g2.addColorStop(1,'rgba(0,0,0,0)');q.fillStyle=g2;q.fillRect(a-22,b-cam-22,44,44)}
    x.drawImage(dk,0,0);bola(g,hx/2,(hy-cam-14)/2,30,'rgb(255,170,80)',.25);
    x.fillStyle='rgba(10,8,6,.8)';x.fillRect(0,H-16,W,16);texto(x,i<0?'Entrada':'Andar '+(i+1),W/2,H-5,'#f2d17e',9)});
  const anda=async(n)=>{const[a,b]=pos(n),x0=hx,y0=hy,dur=1300,t0=performance.now();andando=true;await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-t0)/dur);hx=x0+(a-x0)*p;hy=y0+(b-y0)*p;if(p<1)requestAnimationFrame(f);else ok()};f()});andando=false;vis.add(n)};
  await espera(900);for(let s=0;s<5;s++){const n=P[s];opc=s===0?M[0].filter(Boolean):M[s-1+0]?P[s-1].next.map(c=>M[s][c]).filter(Boolean):[];await espera(900);opc=[];await anda(n);i=s;await espera(600)}
  d.cap.textContent='1 · Corte da masmorra · "Ver mapa inteiro"';const ini=performance.now();await new Promise(ok=>{const f=()=>{const p=Math.min(1,(performance.now()-ini)/1800);hy=hy;if(p<1)requestAnimationFrame(f);else ok()};f()});await espera(500)}
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
window.PROTO={run:async m=>{if(!G||!G.map)return;if(m==='corte')await corte();else if(m==='portas')await portas();else await atos();fecha()}};
})();
