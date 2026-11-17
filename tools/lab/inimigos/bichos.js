/* Inimigos articulados (Nível 1) — mesmo estilo do Cavaleiro novo: pixels sem contorno preto, luz do ato nas bordas.
   Cada bicho é desenhado virado para a DIREITA numa tela 48×48 (chão na linha 44); o motor espelha (eles olham para o herói).
   Precisa de lightPass (tools/lab/cavaleiro-novo/rig.js). */
(function(){
const W=64,H=48,GY=44,D=Math.PI/180,PI=Math.PI;
function tela(){const c=document.createElement('canvas');c.width=W;c.height=H;return c}
function pincel(x){
  const px=(a,b,col)=>{a=Math.round(a);b=Math.round(b);if(a<0||b<0||a>=W||b>=H)return;x.fillStyle=col;x.fillRect(a,b,1,1)};
  const line=(x0,y0,x1,y1,col,w=1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const t=i/n,X=x0+(x1-x0)*t,Y=y0+(y1-y0)*t;for(let a=0;a<w;a++)for(let b=0;b<w;b++)px(X+a-(w>1?Math.floor(w/2):0),Y+b-(w>1?Math.floor(w/2):0),col)}};
  const poly=(pts,col)=>{let minY=1e9,maxY=-1e9;pts.forEach(p=>{minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1])});
    for(let y=Math.floor(minY);y<=Math.ceil(maxY);y++){const xs=[];for(let i=0;i<pts.length;i++){const[a,b]=pts[i],[c,d]=pts[(i+1)%pts.length];if((b<=y+.5&&d>y+.5)||(d<=y+.5&&b>y+.5))xs.push(a+(y+.5-b)/(d-b)*(c-a))}xs.sort((p,q)=>p-q);for(let k=0;k<xs.length;k+=2)for(let X=Math.round(xs[k]);X<Math.round(xs[k+1]);X++)px(X,y,col)}};
  const ell=(cx,cy,rx,ry,col)=>{if(rx<=0||ry<=0)return;for(let y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++){const t=(y+.5-cy)/ry;if(Math.abs(t)>1)continue;const w=rx*Math.sqrt(1-t*t);for(let X=Math.round(cx-w);X<Math.round(cx+w);X++)px(X,y,col)}};
  /* bola com volume: escuro embaixo, meio, brilho em cima */
  const bola=(cx,cy,rx,ry,c)=>{ell(cx,cy,rx,ry,c[0]);ell(cx,cy-.6,rx-.7,ry-.9,c[1]);if(c[2])ell(cx-rx*.25,cy-ry*.45,rx*.45,ry*.35,c[2])};
  return{px,line,poly,ell,bola}}
const P=(o,a,l)=>[o[0]+Math.cos(a)*l,o[1]+Math.sin(a)*l]; // 0 = direita, positivo = gira para baixo
const lerp=(a,b,t)=>a+(b-a)*t;
/* perna de 2 ossos: joelho dobra para dir (+1 frente, -1 trás) */
function ik(h,f,L1,L2,dir=1){let dx=f[0]-h[0],dy=f[1]-h[1],d=Math.hypot(dx,dy);const mx=L1+L2-.05;if(d>mx){f=[h[0]+dx/d*mx,h[1]+dy/d*mx];dx=f[0]-h[0];dy=f[1]-h[1];d=mx}
  const a=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*Math.max(d,.01))))),k1=[h[0]+Math.cos(a-c)*L1,h[1]+Math.sin(a-c)*L1],k2=[h[0]+Math.cos(a+c)*L1,h[1]+Math.sin(a+c)*L1];
  return[(k1[0]>k2[0])===(dir>0)?k1:k2,f]}

/* ---------- quadros-chave ---------- */
const EZ={suave:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,rapido:t=>t*t*t,devagar:t=>1-Math.pow(1-t,3),segura:()=>0,linear:t=>t,
  volta:t=>{const c=1.7;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)}};
function kf(DEF,K){return f=>{f=Math.max(0,Math.min(K[K.length-1][0],f));let a=K[0],b=K[1]||K[0];for(let i=0;i<K.length-1;i++)if(f>=K[i][0]&&f<=K[i+1][0]){a=K[i];b=K[i+1]}
  const t=b[0]===a[0]?1:(f-a[0])/(b[0]-a[0]),e=EZ[b[1].e||'suave'](t),A={...DEF,...a[1]},B={...DEF,...b[1]},o={};
  for(const k in A){if(k==='e')continue;const va=A[k],vb=B[k];o[k]=typeof va==='number'&&typeof vb==='number'?va+(vb-va)*e:(e<.5?va:vb)}return o}}
const sw=(f,n,k=1,ph=0)=>Math.sin(f/n*2*PI*k+ph);

/* =====================================================================================
   Peças comuns
   ===================================================================================== */
function olhoX(pen,x,y,col){pen.px(x-1,y-1,col);pen.px(x+1,y+1,col);pen.px(x+1,y-1,col);pen.px(x-1,y+1,col);pen.px(x,y,col)}
function asaMorcego(pen,s,ang,len,col,osso){const tip=P(s,ang,len),b=[s[0]+(tip[0]>s[0]?1:-1),s[1]+5];
  const m1=[lerp(tip[0],b[0],.35),lerp(tip[1],b[1],.35)+2.2],m2=[lerp(tip[0],b[0],.7),lerp(tip[1],b[1],.7)+1.6],q1=[lerp(tip[0],b[0],.18),lerp(tip[1],b[1],.18)],q2=[lerp(tip[0],b[0],.52),lerp(tip[1],b[1],.52)];
  pen.poly([s,tip,m1,q2,m2,b],col);pen.line(s[0],s[1],tip[0],tip[1],osso);const mid=P(s,ang,len*.5);pen.line(mid[0],mid[1],m1[0],m1[1],osso);pen.px(tip[0],tip[1],osso);return tip}
function asaPena(pen,s,ang,len,c){const tip=P(s,ang,len),b=[s[0]+(tip[0]>s[0]?-1:1),s[1]+3.5],dx=tip[0]-b[0],dy=tip[1]-b[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,sg=ny>0?1:-1;
  const pts=[s,tip];for(let i=1;i<=5;i++){const t=i/6,q=[lerp(tip[0],b[0],t),lerp(tip[1],b[1],t)],o=(i%2?2.6:.8)*sg;pts.push([q[0]+nx*o,q[1]+ny*o])}pts.push(b);
  pen.poly(pts,c[1]);for(let i=1;i<=5;i+=2){const t=i/6,q=[lerp(tip[0],b[0],t),lerp(tip[1],b[1],t)];pen.line(lerp(s[0],q[0],.5),lerp(s[1],q[1],.5),q[0]+nx*2*sg,q[1]+ny*2*sg,c[0])}
  pen.line(s[0],s[1],tip[0],tip[1],c[2]);return tip}

/* bípede pequeno (goblin, kobold): quadril, pernas com IK, tronco, braços de 2 ossos */
function bipede(pen,p,c,L){const hip=[p.hx,p.hy],lean=p.lean||0,neck=P(hip,-PI/2+lean,L.tronco),shF=[neck[0]+1,neck[1]+1.5],shB=[neck[0]-1,neck[1]+1.5];
  const perna=(h,f,cor,pe)=>{const[k,ft]=ik(h,f,L.perna,L.perna,1);pen.line(h[0],h[1],k[0],k[1],cor,2);pen.line(k[0],k[1],ft[0],ft[1],cor,2);pen.line(ft[0]-1,ft[1]+.5,ft[0]+2,ft[1]+.5,pe)};
  const braco=(sh,a1,a2,cor)=>{const e=P(sh,a1,L.braco),h=P(e,a1+a2,L.braco);pen.line(sh[0],sh[1],e[0],e[1],cor,2);pen.line(e[0],e[1],h[0],h[1],cor);return h};
  return{hip,neck,shF,shB,perna,braco}}

/* =====================================================================================
   1. RATO GIGANTE
   ===================================================================================== */
const RATO={nome:'Rato Gigante',
  DEF:{bx:0,by:0,sq:0,hx:0,hy:0,mo:0,tl:0,lg:0,ear:0,dead:0,blink:0,rot:0,px:20,py:37},
  molas:['ear'],
  draw(pen,p){const cx=20+p.bx,cy=37+p.by,rx=10*(1+p.sq*.5),ry=5.5*(1-p.sq);
    const C=['#4a4450','#706a78','#948e9c'],rosa='#c98a8a';
    // rabo
    let q=[cx-rx+1,cy+1];for(let i=1;i<=11;i++){const n=[cx-rx+1-i*1.25,cy+1-i*.35+Math.sin(i*.55+p.tl)*1.6*(i/11)];pen.line(q[0],q[1],n[0],n[1],i<4?'#a87070':rosa);q=n}
    // patas (de trás mais escuras)
    const pata=(x0,ph,cor)=>{const s=Math.sin(p.lg+ph),up=Math.max(0,Math.cos(p.lg+ph))*1.4;const fx=x0+s*1.6,fy=GY-up;pen.line(x0,cy+ry-2,fx,fy,cor);pen.px(fx+1,fy,rosa)};
    pata(cx-6,PI,C[0]);pata(cx+4,0,C[0]);
    pen.bola(cx,cy,rx,ry,C);pen.ell(cx+2,cy+2.5,rx-4,1.6,'#a49aa4');
    pata(cx-4,0,C[1]);pata(cx+6,PI,C[1]);
    // cabeça
    const hx=cx+rx-2+p.hx,hy=cy-1.5+p.hy;
    pen.bola(hx,hy,4.6,3.6,C);
    pen.poly([[hx+2,hy-2.2],[hx+8.5,hy+.3+p.mo*.5],[hx+2,hy+2.2]],C[1]);pen.line(hx+2,hy-2.2,hx+8,hy,C[2]);
    if(p.mo>.15){pen.poly([[hx+2.5,hy+1.5],[hx+7.5,hy+.8+p.mo*.4],[hx+7,hy+1.6+p.mo*3],[hx+2.5,hy+2.5]],'#5a1e22');pen.px(hx+7,hy+1+p.mo*.4,'#f2ead8');pen.px(hx+6.5,hy+1+p.mo*3,'#f2ead8');pen.line(hx+2.5,hy+2.6,hx+7,hy+1.8+p.mo*3,C[1])}
    pen.px(hx+8.6,hy+.3+p.mo*.5,'#e08a9a');
    // bigode
    pen.line(hx+6,hy+1,hx+9,hy+2.5,'#b8b0bc');pen.line(hx+6,hy,hx+10,hy-.5,'#b8b0bc');
    // orelha com mola
    pen.ell(hx-1.5-p.ear*.4,hy-3.8-p.ear*.3,2.2,2.4,C[1]);pen.px(hx-1.5-p.ear*.4,hy-3.6,rosa);
    if(p.dead>.5)olhoX(pen,Math.round(hx+2),Math.round(hy-1),'#2a1a1a');else if(p.blink>.5)pen.line(hx+1,hy-1,hx+3,hy-1,'#2a1a1a');else{pen.px(hx+2,hy-1,'#ff3a2a');pen.px(hx+3,hy-1,'#ff3a2a');pen.px(hx+2,hy-2,'#ffd0c0')}},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({sq:.05*sw(f,n,2),by:sw(f,n,2)>.6?-.5:0,hx:sw(f,n,4)*.6,hy:sw(f,n,4,1)*.4,ear:sw(f,n,2,1)*1.5,tl:f/n*2*PI,blink:f===11?1:0})},
   ataque:{nome:'Morder',n:14,fps:14,hits:[7],f:null},
   especial:{nome:'Roer',n:18,fps:14,hits:[8,11],f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
RATO.A.ataque.f=kf(RATO.DEF,[[0,{}],[4,{e:'devagar',bx:-3,sq:.18,hx:-1,ear:-2,tl:2}],[5,{e:'segura',bx:-3,sq:.18,hx:-1,ear:-2,tl:2}],
  [6,{e:'rapido',bx:6,by:-3,sq:-.12,hx:2,mo:1,ear:2,lg:2,tl:3}],[7,{e:'rapido',bx:8,by:0,sq:.08,hx:2,mo:.1,lg:3}],[9,{e:'segura',bx:8,hx:2,mo:.1,lg:3}],[14,{e:'devagar',lg:6}]]);
RATO.A.especial.f=kf(RATO.DEF,[[0,{}],[4,{e:'devagar',bx:-2,sq:.12}],[6,{e:'rapido',bx:7,hx:2,mo:1,lg:2}],[8,{e:'rapido',bx:8,hx:3,mo:0,hy:1}],[9,{bx:8,hx:2,mo:1}],[11,{bx:8,hx:3,mo:0,hy:1}],[12,{bx:8,hx:2,mo:1}],[13,{bx:8,hx:2,mo:0}],[18,{e:'devagar',lg:5}]]);
RATO.A.ferido.f=kf(RATO.DEF,[[0,{}],[1,{e:'rapido',bx:-3,by:-2,sq:-.15,mo:.6,ear:-3,blink:1}],[3,{bx:-3,by:0,sq:.12,blink:1}],[8,{}]]);
RATO.A.morte.f=kf(RATO.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-4,mo:.7,ear:-3}],[7,{e:'suave',bx:-4,by:-7,rot:PI*.65,mo:.4}],[10,{e:'rapido',bx:-4,by:1,rot:PI,dead:1,mo:.3}],[12,{by:-.5,rot:PI,dead:1,lg:2}],[14,{by:1,rot:PI,dead:1,lg:4,sq:.08}],[18,{by:1,rot:PI,dead:1,lg:4,sq:.08,tl:2}]]);

/* =====================================================================================
   2. GOBLIN
   ===================================================================================== */
const GOB={nome:'Goblin',
  DEF:{hx:20,hy:37,lean:0,fF:[23,GY],fB:[17,GY],aF:-20*D,aF2:40*D,aB:110*D,aB2:-30*D,mo:0,ear:0,ht:0,rot:0,dead:0,coin:0,br:0,px:20,py:GY},
  molas:['ear'],
  draw(pen,p){const c={g:['#3e6626','#5e8a3a','#86b05a'],t:['#4a2e1a','#6a4428','#8a5a36'],pe:'#3a2414'};
    const B=bipede(pen,p,c,{tronco:7,perna:3.6,braco:3.4});
    B.braco(B.shB,p.aB,p.aB2,c.g[0]);
    B.perna([p.hx-1,p.hy],p.fB,c.g[0],c.pe);
    if(p.coin>.5){const h=P(P(B.shB,p.aB,3.4),p.aB+p.aB2,3.4);pen.ell(h[0],h[1],1.6,1.6,'#b8902e');pen.px(h[0]-.5,h[1]-.5,'#ffe27a')}
    // túnica de couro
    pen.poly([[B.neck[0]-3,B.neck[1]],[B.neck[0]+3,B.neck[1]],[p.hx+4,p.hy+1.5],[p.hx-4,p.hy+1.5]],c.t[1]);
    pen.line(B.neck[0]+3,B.neck[1],p.hx+4,p.hy+1.5,c.t[2]);pen.line(p.hx-4,p.hy+.5,p.hx+4,p.hy+.5,c.t[0]);pen.px(p.hx+1,p.hy+.5,'#b8902e');
    pen.px(p.hx-2,p.hy+2,c.t[0]);pen.px(p.hx+2,p.hy+2,c.t[0]);
    B.perna([p.hx+1,p.hy],p.fF,c.g[1],c.pe);
    // cabeça grande
    const ht=p.ht,h=[B.neck[0]+1.5+ht*.6,B.neck[1]-4.2+Math.abs(ht)*.4-p.br*.3];
    // orelha de longe (pontinha atrás da cabeça)
    pen.poly([[h[0]-1,h[1]-3],[h[0]-3-p.ear*.3,h[1]-7.5+ht],[h[0]+1.5,h[1]-3.5]],c.g[0]);
    pen.bola(h[0],h[1],5,4.4,c.g);
    // orelha grande para trás (larga na base, pontuda na ponta, com o lado de dentro rosado)
    const e0=[h[0]-2.5,h[1]-1.5],et=[h[0]-11-p.ear,h[1]-4.5+p.ear*.9+ht*1.5];
    pen.poly([[e0[0]+1,e0[1]-2.2],et,[e0[0]+1,e0[1]+2.4]],c.g[1]);pen.poly([[e0[0],e0[1]-.8],[lerp(e0[0],et[0],.75),lerp(e0[1],et[1],.75)],[e0[0],e0[1]+1.2]],'#b07a6a');pen.line(e0[0]+1,e0[1]-2.2,et[0],et[1],c.g[2]);
    // nariz pontudo
    pen.poly([[h[0]+3.5,h[1]-.5],[h[0]+7,h[1]+1.2],[h[0]+3.5,h[1]+2]],c.g[1]);
    // olhos e boca
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+2),Math.round(h[1]-1),'#1a2a10');else{pen.px(h[0]+1,h[1]-1+ht,'#ffcf3a');pen.px(h[0]+2,h[1]-1+ht,'#ff3a2a');pen.px(h[0]+2,h[1]-2+ht,'#2a1a10');}
    const my=h[1]+2.5;if(p.mo>.2){pen.poly([[h[0]-1,my-.5],[h[0]+4,my-.5],[h[0]+3,my+p.mo*2.2],[h[0],my+p.mo*2.2]],'#3a1010');pen.px(h[0],my,'#f2ead8');pen.px(h[0]+3,my,'#f2ead8')}else{pen.line(h[0]-1,my,h[0]+3,my,'#2a3a18');pen.px(h[0]+1,my,'#f2ead8')}
    // braço da adaga (na frente)
    const e=P(B.shF,p.aF,3.4),m=P(e,p.aF+p.aF2,3.4);pen.line(B.shF[0],B.shF[1],e[0],e[1],c.g[1],2);
    const da=p.aF+p.aF2,t=P(m,da,6);pen.line(m[0],m[1],t[0],t[1],'#a7b3c7');pen.px(t[0],t[1],'#e8eef6');const g1=P(m,da+PI/2,1.5),g2=P(m,da-PI/2,1.5);pen.line(g1[0],g1[1],g2[0],g2[1],c.t[2]);
    pen.line(e[0],e[1],m[0],m[1],c.g[1]);pen.px(m[0],m[1],c.g[2])},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,2)+1)/2;return{hy:37+(b>.6?1:0),br:b,ear:sw(f,n,2,1)*1.4,ht:f>=8&&f<12?.8:0,aF:(-20+sw(f,n,1)*6)*D,aB:(110+b*6)*D,lean:4*D}}},
   ataque:{nome:'Facada',n:14,fps:14,hits:[7],f:null},
   especial:{nome:'Afanar',n:16,fps:13,hits:[7],f:null},
   buff:{nome:'Grito de Guerra',n:16,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
GOB.A.ataque.f=kf(GOB.DEF,[[0,{}],[4,{e:'devagar',hx:17,hy:39,lean:-14*D,fF:[21,GY],fB:[13,GY],aF:-160*D,aF2:20*D,ear:-3}],[5,{e:'segura',hx:17,hy:39,lean:-14*D,fF:[21,GY],fB:[13,GY],aF:-160*D,aF2:20*D,ear:-3}],
  [6,{e:'rapido',hx:26,hy:34,lean:28*D,fF:[32,GY-3],fB:[20,GY-2],aF:-30*D,aF2:0,mo:1,ear:3}],[7,{e:'rapido',hx:28,hy:38,lean:30*D,fF:[33,GY],fB:[21,GY],aF:5*D,aF2:0,mo:.6}],[9,{e:'segura',hx:28,hy:38,lean:30*D,fF:[33,GY],fB:[21,GY],aF:5*D,aF2:0,mo:.6}],[14,{e:'devagar'}]]);
GOB.A.especial.f=kf(GOB.DEF,[[0,{}],[4,{e:'devagar',hx:23,hy:38,lean:20*D,fF:[27,GY],fB:[17,GY],aB:10*D,aB2:0,ht:.5}],[6,{e:'rapido',hx:27,hy:38,lean:30*D,fF:[31,GY],fB:[20,GY],aB:-5*D,aB2:0}],
  [7,{e:'rapido',hx:27,hy:38,lean:30*D,fF:[31,GY],fB:[20,GY],aB:-5*D,aB2:0,coin:1}],[10,{e:'rapido',hx:18,hy:37,lean:-8*D,aB:150*D,aB2:-40*D,coin:1,mo:.5}],[13,{e:'segura',hx:18,hy:37,lean:-8*D,aB:150*D,aB2:-40*D,coin:1,mo:.5,ht:1}],[16,{e:'devagar',coin:0}]]);
GOB.A.buff.f=kf(GOB.DEF,[[0,{}],[4,{e:'devagar',hy:39,lean:10*D,ht:1,ear:-2}],[7,{e:'rapido',hy:36,lean:-16*D,ht:-1,mo:1,aF:-110*D,aF2:-20*D,aB:-70*D,aB2:-10*D,ear:4}],[8,{hx:21,hy:36,lean:-16*D,ht:-1,mo:1,aF:-115*D,aF2:-20*D,aB:-65*D,aB2:-10*D,ear:-2}],[9,{hx:19,hy:36,lean:-16*D,ht:-1,mo:1,aF:-110*D,aF2:-20*D,aB:-70*D,aB2:-10*D,ear:4}],[10,{hx:21,hy:36,lean:-16*D,ht:-1,mo:1,aF:-115*D,aF2:-20*D,aB:-65*D,aB2:-10*D,ear:-2}],[12,{e:'segura',hy:36,lean:-16*D,ht:-1,mo:1,aF:-110*D,aF2:-20*D,aB:-70*D,aB2:-10*D}],[16,{e:'devagar'}]]);
GOB.A.ferido.f=kf(GOB.DEF,[[0,{}],[1,{e:'rapido',hx:16,hy:38,lean:-22*D,fF:[21,GY],fB:[13,GY],ht:-1,mo:.6,ear:-4,aF:-60*D,aB:150*D}],[3,{hx:16,hy:38,lean:-18*D,fF:[21,GY],fB:[13,GY],ht:-1,mo:.4}],[8,{}]]);
GOB.A.morte.f=kf(GOB.DEF,[[0,{}],[2,{e:'rapido',hx:16,hy:38,lean:-22*D,fF:[21,GY],fB:[13,GY],ht:-1,mo:.8,ear:-4,aF:-80*D,aB:160*D}],[5,{hx:17,hy:40,lean:-10*D,fF:[22,GY],fB:[14,GY],ht:1,mo:.4,aF:40*D,aB:120*D,px:11,py:GY-1}],
  [9,{e:'rapido',hx:17,hy:40,lean:-10*D,fF:[22,GY],fB:[14,GY],rot:-PI/2,px:11,py:GY-1,tx:17,ty:3,dead:1,aF:60*D,aB:140*D,ear:3}],[11,{hx:17,hy:40,lean:-10*D,fF:[22,GY],fB:[14,GY],rot:-PI/2*.93,px:11,py:GY-1,tx:17,ty:1,dead:1,aF:60*D,aB:140*D}],[13,{hx:17,hy:40,lean:-10*D,fF:[22,GY],fB:[14,GY],rot:-PI/2,px:11,py:GY-1,tx:17,ty:3,dead:1,aF:60*D,aB:140*D}],[18,{hx:17,hy:40,lean:-10*D,fF:[22,GY],fB:[14,GY],rot:-PI/2,px:11,py:GY-1,tx:17,ty:3,dead:1,aF:60*D,aB:140*D}]]);

/* =====================================================================================
   3. KOBOLD LANCEIRO
   ===================================================================================== */
const KOB={nome:'Kobold Lanceiro',
  DEF:{hx:19,hy:36,lean:4*D,fF:[22,GY],fB:[16,GY],aF:60*D,aF2:-60*D,aB:30*D,aB2:-40*D,sp:-80*D,spx:0,mo:0,tl:0,ht:0,rot:0,dead:0,trap:0,px:19,py:GY},
  molas:['tl'],
  draw(pen,p){const c={o:['#8a4418','#c0662a','#e8944a'],m:['#4a2e1a','#6a4428'],pe:'#5a2a10'};
    const B=bipede(pen,p,c,{tronco:7,perna:4,braco:3.4});
    // rabo
    let q=[p.hx-2,p.hy+1];for(let i=1;i<=8;i++){const n=[p.hx-2-i*1.1,p.hy+1+i*.55-Math.sin(i*.5+p.tl)*1.2*(i/8)];pen.line(q[0],q[1],n[0],n[1],i<5?c.o[0]:c.o[1],i<4?2:1);q=n}
    // lança (atrás do braço da frente quando em pé)
    const hF=P(P(B.shF,p.aF,3.4),p.aF+p.aF2,3.4),sa=p.sp,s0=P(hF,sa+PI,8+p.spx),s1=P(hF,sa,14-p.spx);
    pen.line(s0[0],s0[1],s1[0],s1[1],'#7e5430');const tp=P(s1,sa,4);pen.poly([P(s1,sa+PI/2,1.3),tp,P(s1,sa-PI/2,1.3)],'#a7b3c7');pen.px(tp[0],tp[1],'#e8eef6');pen.px(s1[0],s1[1],'#b0202a');
    B.braco(B.shB,p.aB,p.aB2,c.o[0]);
    B.perna([p.hx-1,p.hy],p.fB,c.o[0],c.pe);
    pen.poly([[B.neck[0]-3,B.neck[1]],[B.neck[0]+3,B.neck[1]],[p.hx+3,p.hy+2],[p.hx-3,p.hy+2]],c.o[1]);
    pen.line(p.hx-3,p.hy+.5,p.hx+3,p.hy+.5,c.m[1]);pen.poly([[p.hx-3,p.hy+1],[p.hx+3,p.hy+1],[p.hx+2,p.hy+4],[p.hx-2,p.hy+4]],c.m[1]);
    for(let i=0;i<3;i++)pen.px(B.neck[0]+1-i*.4,B.neck[1]+2+i*1.6,c.o[2]);
    B.perna([p.hx+1,p.hy],p.fF,c.o[1],c.pe);
    // cabeça de lagarto com focinho
    const ht=p.ht,h=[B.neck[0]+1+ht*.5,B.neck[1]-3.4];
    pen.bola(h[0],h[1],3.8,3.4,c.o);
    pen.poly([[h[0]+1,h[1]-2],[h[0]+7.5,h[1]+.2+ht],[h[0]+7,h[1]+1.6+ht+p.mo*1.5],[h[0]+1,h[1]+2.4]],c.o[1]);pen.line(h[0]+1,h[1]-2,h[0]+7.5,h[1]+.2+ht,c.o[2]);
    if(p.mo>.2){pen.line(h[0]+2,h[1]+1.4+ht*.5,h[0]+7,h[1]+1+ht+p.mo*.5,'#3a1010');pen.px(h[0]+6,h[1]+1+ht,'#f2ead8')}
    pen.px(h[0]+7.6,h[1]+.3+ht,'#3a1a10');
    // chifrinhos
    pen.poly([[h[0]-2,h[1]-2],[h[0]-6,h[1]-4.5],[h[0]-.5,h[1]-3.2]],'#d8c8a0');pen.poly([[h[0]-.5,h[1]-2.6],[h[0]-3,h[1]-6.5],[h[0]+1.2,h[1]-3]],'#f2ead8');
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+2),Math.round(h[1]-1),'#2a1a10');else{pen.px(h[0]+2,h[1]-1,'#ffcf3a');pen.px(h[0]+3,h[1]-1,'#1a1010')}
    // braço da frente por cima da lança
    const e=P(B.shF,p.aF,3.4);pen.line(B.shF[0],B.shF[1],e[0],e[1],c.o[1],2);pen.line(e[0],e[1],hF[0],hF[1],c.o[1]);pen.px(hF[0],hF[1],c.o[2]);
    // armadilha no chão
    if(p.trap>0){const tx=34,ty=GY;for(let i=-2;i<=2;i++){pen.px(tx+i*1.5,ty-1-(i%2?0:p.trap),'#a7b3c7')}pen.line(tx-4,ty,tx+4,ty,'#5c3a1e')}},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,2)+1)/2;return{hy:36+(b>.6?1:0),tl:f/n*2*PI,ht:sw(f,n,1)>.7?-.6:0,sp:(-82+b*3)*D,aB:(30+b*5)*D}}},
   ataque:{nome:'Lançada',n:14,fps:14,hits:[7],f:null},
   especial:{nome:'Estocada Dupla',n:18,fps:15,hits:[6,11],f:null},
   buff:{nome:'Armar Armadilha',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
const KLAN={aF:20*D,aF2:-20*D,sp:0,aB:-10*D,aB2:30*D};
KOB.A.ataque.f=kf(KOB.DEF,[[0,{}],[3,{e:'devagar',...KLAN,lean:0}],[5,{e:'devagar',hx:16,hy:38,lean:-10*D,fF:[21,GY],fB:[12,GY],...KLAN,spx:5,aF:60*D,aF2:-50*D}],
  [6,{e:'rapido',hx:24,hy:37,lean:20*D,fF:[30,GY],fB:[17,GY],...KLAN,spx:-6,aF:0,aF2:0,mo:1}],[7,{e:'rapido',hx:25,hy:37,lean:22*D,fF:[30,GY],fB:[17,GY],...KLAN,spx:-8,aF:-5*D,aF2:0,mo:.6}],[9,{e:'segura',hx:25,hy:37,lean:22*D,fF:[30,GY],fB:[17,GY],...KLAN,spx:-8,aF:-5*D,aF2:0}],[14,{e:'devagar'}]]);
KOB.A.especial.f=kf(KOB.DEF,[[0,{}],[3,{e:'devagar',hx:18,hy:37,fF:[24,GY],fB:[14,GY],...KLAN,spx:4,aF:50*D,aF2:-40*D}],
  [5,{e:'rapido',hx:23,hy:37,lean:16*D,fF:[28,GY],fB:[16,GY],...KLAN,spx:-7,aF:0,aF2:0,mo:1}],[6,{hx:23,hy:37,lean:16*D,fF:[28,GY],fB:[16,GY],...KLAN,spx:-8,aF:0,aF2:0}],
  [8,{e:'devagar',hx:21,hy:37,lean:6*D,fF:[27,GY],fB:[15,GY],...KLAN,spx:4,aF:50*D,aF2:-40*D}],[10,{e:'rapido',hx:25,hy:37,lean:20*D,fF:[30,GY],fB:[17,GY],...KLAN,spx:-8,aF:-5*D,aF2:0,mo:1}],[11,{hx:25,hy:37,lean:20*D,fF:[30,GY],fB:[17,GY],...KLAN,spx:-9,aF:-5*D,aF2:0}],[13,{e:'segura',hx:25,hy:37,lean:20*D,fF:[30,GY],fB:[17,GY],...KLAN,spx:-9,aF:-5*D}],[18,{e:'devagar'}]]);
KOB.A.buff.f=kf(KOB.DEF,[[0,{}],[4,{e:'devagar',hx:22,hy:39,lean:30*D,fF:[27,GY],fB:[15,GY],aB:70*D,aB2:0,ht:1}],[6,{hx:24,hy:40,lean:40*D,fF:[28,GY],fB:[15,GY],aB:75*D,aB2:10*D,ht:1,trap:.3}],[9,{hx:24,hy:40,lean:40*D,fF:[28,GY],fB:[15,GY],aB:60*D,aB2:20*D,ht:1,trap:1}],
  [12,{e:'segura',hx:24,hy:40,lean:40*D,fF:[28,GY],fB:[15,GY],aB:60*D,aB2:20*D,ht:1,trap:1}],[15,{e:'devagar',trap:1,mo:.6,ht:-.5}],[18,{trap:1}]]);
KOB.A.ferido.f=kf(KOB.DEF,[[0,{}],[1,{e:'rapido',hx:15,hy:37,lean:-20*D,fF:[20,GY],fB:[12,GY],mo:.8,ht:-1,sp:-100*D}],[3,{hx:15,hy:37,lean:-16*D,fF:[20,GY],fB:[12,GY],mo:.4}],[8,{}]]);
KOB.A.morte.f=kf(KOB.DEF,[[0,{}],[2,{e:'rapido',hx:15,hy:37,lean:-22*D,fF:[20,GY],fB:[12,GY],mo:.8,ht:-1,sp:-110*D}],[5,{hx:16,hy:39,lean:-8*D,fF:[21,GY],fB:[13,GY],sp:-140*D,aF:100*D,px:11,py:GY-1}],
  [9,{e:'rapido',hx:16,hy:39,lean:-8*D,fF:[21,GY],fB:[13,GY],rot:-PI/2,px:11,py:GY-1,tx:17,ty:3,dead:1,sp:-170*D,aF:110*D,tl:2}],[11,{hx:16,hy:39,lean:-8*D,fF:[21,GY],fB:[13,GY],rot:-PI/2*.93,px:11,py:GY-1,tx:17,ty:1,dead:1,sp:-170*D,aF:110*D}],[13,{hx:16,hy:39,lean:-8*D,fF:[21,GY],fB:[13,GY],rot:-PI/2,px:11,py:GY-1,tx:17,ty:3,dead:1,sp:-170*D,aF:110*D}],[18,{hx:16,hy:39,lean:-8*D,fF:[21,GY],fB:[13,GY],rot:-PI/2,px:11,py:GY-1,tx:17,ty:3,dead:1,sp:-170*D,aF:110*D,tl:-1}]]);

/* =====================================================================================
   4. MORCEGO VAMPIRO
   ===================================================================================== */
const MOR={nome:'Morcego Vampiro',voa:1,
  DEF:{bx:0,by:0,wa:-20*D,mo:0,ear:0,rot:0,dead:0,px:24,py:24,lean:0},
  molas:['ear'],
  draw(pen,p){const cx=24+p.bx,cy=24+p.by,C=['#3a2250','#5a3a78','#7e5aa0'],osso='#2a1638';
    // asa de trás (mais escura)
    asaMorcego(pen,[cx-1,cy-2],PI+(-p.wa)+p.lean,13,'#3a2250',osso);
    pen.bola(cx,cy,4,5,C);pen.ell(cx+.5,cy+1.5,2.2,2.6,'#8a6aa8');
    // pezinhos
    if(p.dead<.5){pen.px(cx-1,cy+5,osso);pen.px(cx+1,cy+5,osso)}
    // cabeça
    const h=[cx+2+p.lean*4,cy-5];pen.bola(h[0],h[1],3.2,2.8,C);
    pen.poly([[h[0]-3,h[1]-1],[h[0]-3.5-p.ear*.5,h[1]-6.5+p.ear*.3],[h[0]+.5,h[1]-2.5]],C[0]);pen.poly([[h[0]-.5,h[1]-2.2],[h[0]+1.5-p.ear*.4,h[1]-7+p.ear*.3],[h[0]+3,h[1]-1.2]],C[1]);pen.px(h[0]+1.2,h[1]-4,'#c88aa8');
    pen.px(h[0]+3,h[1],'#c88aa8');
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1),Math.round(h[1]-.5),'#1a0a20');else{pen.px(h[0],h[1]-.5,'#ff3a2a');pen.px(h[0]+2,h[1]-.5,'#ff3a2a')}
    const my=h[1]+1.8;if(p.mo>.2){pen.ell(h[0]+1,my+.5,1.8,p.mo*1.4,'#3a0a14');pen.px(h[0],my,'#f2ead8');pen.px(h[0]+2,my,'#f2ead8');pen.px(h[0],my+1,'#f2ead8');pen.px(h[0]+2,my+1,'#f2ead8')}else{pen.px(h[0],my,'#f2ead8');pen.px(h[0]+2,my,'#f2ead8')}
    // asa da frente
    asaMorcego(pen,[cx+1,cy-2],p.wa+p.lean,13,C[1],osso)},
  A:{
   parado:{n:12,fps:14,loop:1,f:(f,n)=>{const a=sw(f,n,1);return{wa:(a*40-5)*D,by:-a*1.6,ear:a*1.5,lean:sw(f,n,1,1)*.06}}},
   ataque:{nome:'Mordida Vampírica',n:16,fps:14,hits:[8],f:null},
   especial:{nome:'Rasante',n:20,fps:15,hits:[6,13],f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
MOR.A.ataque.f=kf(MOR.DEF,[[0,{wa:30*D}],[2,{wa:-40*D,by:-2}],[4,{wa:35*D,by:-5,bx:-2}],[6,{e:'devagar',wa:-50*D,by:-6,bx:-3,lean:-.2}],[7,{e:'rapido',wa:-70*D,by:2,bx:9,lean:.35,mo:1}],[8,{e:'rapido',wa:-60*D,by:3,bx:11,lean:.3,mo:.3}],[10,{e:'segura',wa:-60*D,by:3,bx:11,lean:.3,mo:.3}],[12,{wa:35*D,by:-2,bx:5}],[14,{wa:-30*D,by:0,bx:1}],[16,{wa:20*D}]]);
MOR.A.especial.f=kf(MOR.DEF,[[0,{wa:30*D}],[2,{wa:-40*D,by:-4,bx:-2}],[5,{e:'rapido',wa:-75*D,by:4,bx:10,lean:.4,mo:.8}],[6,{wa:-75*D,by:2,bx:13,lean:.3,mo:.4}],[8,{wa:40*D,by:-6,bx:6,lean:-.2}],[10,{wa:-40*D,by:-7,bx:0}],
  [12,{e:'rapido',wa:-75*D,by:4,bx:10,lean:.4,mo:.8}],[13,{wa:-75*D,by:2,bx:13,lean:.3,mo:.4}],[15,{wa:40*D,by:-4,bx:6}],[18,{wa:-30*D,by:0,bx:1}],[20,{wa:20*D}]]);
MOR.A.ferido.f=kf(MOR.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-3,rot:-.6,wa:50*D,mo:.6,ear:-3}],[3,{bx:-4,by:-1,rot:-.3,wa:-50*D}],[6,{bx:-1,wa:30*D}],[8,{}]]);
MOR.A.morte.f=kf(MOR.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-4,rot:-.8,wa:60*D,mo:.8}],[5,{bx:-4,by:2,rot:-2,wa:-60*D,dead:1}],[8,{e:'rapido',bx:-4,by:14,rot:-PI,wa:20*D,dead:1}],[10,{bx:-4,by:12.5,rot:-PI,wa:15*D,dead:1}],[12,{bx:-4,by:14,rot:-PI,wa:10*D,dead:1}],[18,{bx:-4,by:14,rot:-PI,wa:10*D,dead:1}]]);

/* =====================================================================================
   5. ARANHA DA CAVERNA
   ===================================================================================== */
const ARA={nome:'Aranha da Caverna',
  DEF:{bx:0,by:0,lg:0,fo:0,ab:0,rs:0,tilt:0,cu:0,rot:0,dead:0,blink:0,web:0,px:22,py:38},
  draw(pen,p){const cx=22+p.bx,cy=37+p.by,t=p.tilt;
    const C=['#2e1a12','#4a2e22','#6a4430'];
    const abd=[cx-5,cy-1-t*4],tho=[cx+4,cy+1+t*1.5];
    const perna=(i,perto)=>{const hip=[tho[0]-1+i*1.2,tho[1]+.5];const base=[cx-9,cx-3,cx+6,cx+13][i]+(perto?1:-1);
      const ph=p.lg+i*1.7+(perto?PI:0),s=Math.sin(ph),up=Math.max(0,Math.cos(ph))*1.5;
      let ft=[base+s*1.3,GY-up];if(i>=2&&p.rs>0){ft=[lerp(ft[0],base+3,p.rs),lerp(ft[1],cy-10-(i-2)*2,p.rs)]}
      if(p.cu>0){ft=[lerp(ft[0],tho[0]+(i-1.5)*2,p.cu),lerp(ft[1],tho[1]-1,p.cu)]}
      const mid=[(hip[0]+ft[0])/2,(hip[1]+ft[1])/2],kn=[mid[0]+(ft[0]-hip[0])*.1,Math.min(hip[1],ft[1])-5+p.cu*3];
      const col=perto?C[2]:C[0];pen.line(hip[0],hip[1],kn[0],kn[1],col);pen.line(kn[0],kn[1],ft[0],ft[1],col);pen.px(kn[0],kn[1],perto?'#8a5a40':C[1])};
    for(let i=0;i<4;i++)perna(i,false);
    // abdômen com manchas
    pen.bola(abd[0],abd[1],8*(1+p.ab*.06),6.2*(1+p.ab*.06),C);
    pen.px(abd[0]-2,abd[1]-2,'#c06a2a');pen.px(abd[0]+1,abd[1]-3,'#c06a2a');pen.px(abd[0]-4,abd[1],'#c06a2a');pen.px(abd[0]-1,abd[1],'#e08a3a');pen.px(abd[0]+2,abd[1]-1,'#a0501e');
    // fio de teia
    if(p.web>0){const s=[abd[0]-6,abd[1]+2];pen.line(s[0],s[1],s[0]-2,s[1]+3+p.web*3,'#e8eef6')}
    pen.bola(tho[0],tho[1],4.6,3.8,C);
    // olhos (vários)
    if(p.dead>.5)olhoX(pen,Math.round(tho[0]+2),Math.round(tho[1]-1),'#1a0a0a');else if(p.blink<.5){pen.px(tho[0]+2,tho[1]-2,'#ff3a2a');pen.px(tho[0]+3,tho[1]-1,'#ff3a2a');pen.px(tho[0]+1,tho[1]-1,'#c0201a');pen.px(tho[0]+3,tho[1]-2.5,'#ffb0a0')}
    // presas
    const fx=tho[0]+3.5,fy=tho[1]+1.5;pen.line(fx,fy,fx+1.5+p.fo,fy+2.5-p.fo*.5,'#d8c8b0');pen.line(fx-1,fy+.5,fx+.5-p.fo*.5,fy+3+p.fo,'#b8a890');
    for(let i=0;i<4;i++)perna(i,true)},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({ab:sw(f,n,2),lg:sw(f,n,1)*.6,fo:sw(f,n,4)>.8?.8:0,by:sw(f,n,2)>.5?-.5:0,blink:f===9?1:0})},
   ataque:{nome:'Picada',n:14,fps:13,hits:[8],f:null},
   especial:{nome:'Teia',n:16,fps:12,hits:[9],f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
ARA.A.ataque.f=kf(ARA.DEF,[[0,{}],[4,{e:'devagar',bx:-3,by:-2,tilt:-.5,rs:1,fo:1,lg:1}],[6,{e:'segura',bx:-3,by:-2,tilt:-.5,rs:1,fo:1,lg:1}],[7,{e:'rapido',bx:6,by:1,tilt:.4,rs:.2,fo:0,lg:2.5}],[8,{e:'rapido',bx:7,by:0,tilt:.3,rs:0,fo:0,lg:3}],[10,{e:'segura',bx:7,tilt:.3,lg:3}],[14,{e:'devagar',lg:6}]]);
ARA.A.especial.f=kf(ARA.DEF,[[0,{}],[4,{e:'devagar',bx:-1,tilt:.8,by:-1,ab:2}],[7,{e:'segura',bx:-1,tilt:.8,by:-1,ab:3}],[8,{e:'rapido',bx:1,tilt:1,by:-2,ab:-1,web:1}],[10,{bx:1,tilt:1,by:-2,ab:0,web:1}],[16,{e:'devagar',web:0}]]);
ARA.A.ferido.f=kf(ARA.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-3,tilt:-.4,cu:.5,blink:1}],[3,{bx:-4,by:0,tilt:-.1,cu:.2,blink:1}],[8,{}]]);
ARA.A.morte.f=kf(ARA.DEF,[[0,{}],[2,{e:'rapido',bx:-4,by:-4,tilt:-.5,cu:.4}],[6,{bx:-4,by:-6,rot:PI*.6,cu:.6}],[9,{e:'rapido',bx:-4,by:-2,rot:PI,cu:.9,dead:1}],[11,{bx:-4,by:-3,rot:PI,cu:1,dead:1}],[13,{bx:-4,by:-2,rot:PI,cu:.95,dead:1}],[18,{bx:-4,by:-2,rot:PI,cu:1,dead:1}]]);

/* =====================================================================================
   6. SAPO VENENOSO
   ===================================================================================== */
const SAP={nome:'Sapo Venenoso',
  DEF:{bx:0,by:0,sq:0,sac:0,mo:0,tg:0,pf:0,blink:0,rot:0,dead:0,spit:0,leg:0,px:21,py:38},
  draw(pen,p){const cx=21+p.bx,cy=38+p.by,C=['#2e5a22','#4f8a3a','#7ab85a'];
    // perna de trás dobrada
    const kx=cx-5,ky=cy+1;pen.bola(kx,ky-p.leg*2,4,3.2,C);pen.line(kx+1,ky+2,kx+4+p.leg*3,GY,C[0],2);pen.line(kx+3+p.leg*3,GY,kx+6+p.leg*3,GY,'#2e5a22');
    // corpo
    pen.bola(cx,cy,8*(1+p.sq*.3),5.2*(1-p.sq*.4),C);pen.ell(cx+2,cy+2.6,5,2,'#d8c85a');
    pen.line(cx-6,cy-3,cx+1,cy-5,'#c0302a');pen.px(cx-3,cy-4,'#ff6a4a');
    // papo
    if(p.sac>0)pen.bola(cx+6,cy+2,2.4*p.sac+.5,2*p.sac+.3,['#c8b84a','#e8d870','#fff0a0']);
    // cabeça
    const h=[cx+5,cy-3-p.mo*.5],pr=4.6+p.pf*1.6;pen.bola(h[0],h[1],pr,3.8+p.pf*.6,C);
    // olho saltado
    pen.ell(h[0]-.5,h[1]-3.6,2.3,2.2,C[1]);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]-.5),Math.round(h[1]-3.8),'#1a2a10');else if(p.blink>.5)pen.line(h[0]-2,h[1]-3.6,h[0]+1,h[1]-3.6,C[0]);else{pen.ell(h[0]-.5,h[1]-3.8,1.6,1.5,'#f4cf4a');pen.px(h[0],h[1]-4,'#1a1a10');pen.px(h[0]-1,h[1]-4.5,'#fff')}
    // boca
    const my=h[1]+1.2;pen.line(h[0]-1,my,h[0]+pr,my-.5,C[0]);
    if(p.mo>.15){pen.poly([[h[0],my],[h[0]+pr+.5,my-.5-p.mo],[h[0]+pr+.5,my+p.mo*1.8],[h[0],my+1]],'#6a1a2a')}
    // língua
    if(p.tg>0){const L=p.tg*24,s=[h[0]+pr-1,my+.4],e=[s[0]+L,s[1]-Math.sin(p.tg*PI)*2];pen.line(s[0],s[1],e[0],e[1],'#e86a8a',2);pen.ell(e[0],e[1],1.8,1.6,'#ff8aa8')}
    if(p.spit>0)pen.bola(h[0]+pr+2+p.spit*4,my-1,1.6,1.4,['#4a8a2a','#8ad04a','#d0ff8a']);
    // braço da frente
    pen.line(cx+5,cy+3,cx+7,GY,C[1],2);pen.line(cx+6,GY,cx+9,GY,C[0])},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>{const s=(sw(f,n,2)+1)/2;return{sac:s>.5?s:0,sq:sw(f,n,1)*.04,blink:f===12?1:0}}},
   ataque:{nome:'Linguada',n:14,fps:14,hits:[7],f:null},
   especial:{nome:'Cuspe Venenoso',n:16,fps:12,hits:[9],f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
SAP.A.ataque.f=kf(SAP.DEF,[[0,{}],[4,{e:'devagar',sq:.2,by:1,leg:-.3}],[5,{e:'rapido',sq:-.05,mo:1,tg:.3}],[7,{e:'rapido',mo:1,tg:1,bx:1}],[9,{e:'segura',mo:1,tg:1,bx:1}],[11,{e:'rapido',mo:.8,tg:0}],[14,{e:'devagar'}]]);
SAP.A.especial.f=kf(SAP.DEF,[[0,{}],[3,{e:'devagar',pf:.5,sq:.05}],[6,{e:'devagar',pf:1,by:-1,sq:-.05,bx:-1}],[8,{e:'segura',pf:1,by:-1,bx:-1}],[9,{e:'rapido',pf:0,mo:1,bx:2,spit:.2}],[11,{mo:.6,spit:1,bx:1}],[16,{e:'devagar',spit:0}]]);
SAP.A.ferido.f=kf(SAP.DEF,[[0,{}],[1,{e:'rapido',bx:-3,by:-5,sq:-.2,mo:.6,leg:1,blink:1}],[4,{e:'rapido',bx:-3,by:0,sq:.25,leg:0,blink:1}],[8,{}]]);
SAP.A.morte.f=kf(SAP.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-6,sq:-.2,mo:.8,leg:1}],[6,{bx:-4,by:-8,rot:PI*.7,leg:1,mo:.5}],[9,{e:'rapido',bx:-4,by:0,rot:PI,dead:1,leg:1}],[11,{bx:-4,by:-1,rot:PI,dead:1,leg:.6}],[13,{bx:-4,by:0,rot:PI,dead:1,leg:1}],[18,{bx:-4,by:0,rot:PI,dead:1,leg:1}]]);

/* =====================================================================================
   7. DIABRETE
   ===================================================================================== */
const DIA={nome:'Diabrete',voa:1,
  DEF:{bx:0,by:0,wa:-20*D,aF:60*D,aB:70*D,mo:0,tl:0,ht:0,fb:0,rot:0,dead:0,lean:0,px:22,py:26,sh:0},
  molas:['tl'],
  draw(pen,p){const cx=22+p.bx+p.sh,cy=26+p.by,C=['#7a1a14','#b8322a','#e05a3a'],osso='#4a0e0a';
    asaMorcego(pen,[cx-2,cy-3],PI+(-p.wa)-.3,9,'#5a120e',osso);
    // rabo
    let q=[cx-2,cy+4];for(let i=1;i<=9;i++){const n=[cx-2-i*.9,cy+4+i*.8-Math.sin(i*.55+p.tl)*1.5*(i/9)];pen.line(q[0],q[1],n[0],n[1],C[0]);q=n}pen.poly([[q[0]-2,q[1]],[q[0]+1,q[1]-1.5],[q[0]+.5,q[1]+2]],C[1]);
    // perninhas
    pen.line(cx-1,cy+4,cx-2,cy+8,C[0]);pen.line(cx+1,cy+4,cx+2,cy+8,C[1]);
    // braço de trás
    const sb=[cx-1,cy-2],hb=P(P(sb,p.aB,3),p.aB+.6,3);pen.line(sb[0],sb[1],P(sb,p.aB,3)[0],P(sb,p.aB,3)[1],C[0]);pen.line(P(sb,p.aB,3)[0],P(sb,p.aB,3)[1],hb[0],hb[1],C[0]);
    pen.bola(cx,cy,3.8,4.8,C);pen.ell(cx+.8,cy+1.2,2,2.4,'#e8a060');
    // cabeça com chifres
    const h=[cx+1.5+p.lean*3+p.ht*.6,cy-6.2+Math.abs(p.ht)*.3];
    pen.line(h[0]-2,h[1]-2,h[0]-4,h[1]-6,'#e8d8b0');pen.line(h[0]+1,h[1]-2.5,h[0]+1.5,h[1]-6.5,'#f2ead8');
    pen.bola(h[0],h[1],3.6,3.2,C);
    pen.poly([[h[0]-2.5,h[1]-.5],[h[0]-6,h[1]-2+p.ht],[h[0]-2.5,h[1]+1]],C[1]);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.5),Math.round(h[1]-.5),'#2a0a0a');else{pen.px(h[0]+1,h[1]-.5+p.ht,'#ffe27a');pen.px(h[0]+2.5,h[1]-.5+p.ht,'#ffe27a')}
    const my=h[1]+1.6;if(p.mo>.2){pen.ell(h[0]+1.5,my+.6,2.2,p.mo*1.6,'#3a0808');pen.px(h[0]+.5,my,'#f2ead8');pen.px(h[0]+2.5,my,'#f2ead8')}else{pen.line(h[0],my,h[0]+3,my-.5,'#3a0808');pen.px(h[0]+2,my,'#f2ead8')}
    // asa da frente
    asaMorcego(pen,[cx+.5,cy-3],p.wa-.15,9,'#8a2018',osso);
    // braço da frente com garras e bola de fogo
    const sf=[cx+2,cy-2],ef=P(sf,p.aF,3),hf=P(ef,p.aF+.6,3);pen.line(sf[0],sf[1],ef[0],ef[1],C[1]);pen.line(ef[0],ef[1],hf[0],hf[1],C[1]);pen.px(hf[0]+1,hf[1],'#f2ead8');pen.px(hf[0],hf[1]+1,'#f2ead8');
    if(p.fb>0){const r=1+p.fb*3.2,fy=hf[1]-r*.8;pen.ell(hf[0],fy,r+1,r+1,'#c03a1a');pen.ell(hf[0],fy,r,r,'#ff8a2a');pen.ell(hf[0]-.3,fy-.3,r*.55,r*.55,'#ffe27a');pen.px(hf[0],fy-r-1.5,'#ff8a2a')}},
  A:{
   parado:{n:12,fps:14,loop:1,f:(f,n)=>{const a=sw(f,n,2);return{wa:(a*35-5)*D,by:-sw(f,n,1)*1.5,tl:f/n*2*PI,fb:.15+.08*sw(f,n,3),aF:(-40+sw(f,n,1)*8)*D,ht:sw(f,n,1,1)>.8?-.6:0}}},
   ataque:{nome:'Arranhar',n:18,fps:15,hits:[6,11],f:null},
   especial:{nome:'Bola de Fogo',n:20,fps:13,hits:[13],f:null},
   buff:{nome:'Risada Maligna',n:18,fps:14,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
DIA.A.ataque.f=kf(DIA.DEF,[[0,{}],[3,{e:'devagar',bx:-2,by:-3,aF:-120*D,wa:30*D,lean:-.2}],[5,{e:'rapido',bx:9,by:1,aF:60*D,wa:-50*D,lean:.4,mo:1}],[6,{bx:10,by:1,aF:80*D,wa:-40*D,lean:.4,mo:.8}],
  [8,{e:'devagar',bx:8,by:-1,aF:-110*D,aB:-60*D,wa:30*D,lean:.1}],[10,{e:'rapido',bx:11,by:1,aF:30*D,aB:80*D,wa:-50*D,lean:.4,mo:1}],[11,{bx:11,by:1,aF:60*D,aB:90*D,wa:-40*D,lean:.4,mo:.8}],[13,{e:'segura',bx:11,by:1,aF:60*D,wa:20*D,lean:.4}],[18,{e:'devagar'}]]);
DIA.A.especial.f=kf(DIA.DEF,[[0,{}],[4,{e:'devagar',bx:-2,by:-2,aF:-100*D,lean:-.25,fb:.5,ht:-1}],[9,{e:'devagar',bx:-3,by:-3,aF:-120*D,lean:-.3,fb:1,ht:-1,mo:.6}],[11,{e:'segura',bx:-3,by:-3,aF:-120*D,lean:-.3,fb:1,ht:-1,mo:.6}],
  [12,{e:'rapido',bx:3,by:0,aF:10*D,lean:.35,fb:1,mo:1}],[13,{e:'rapido',bx:4,by:0,aF:20*D,lean:.35,fb:0,mo:1}],[15,{e:'segura',bx:4,aF:20*D,lean:.35,fb:0,mo:.6}],[20,{e:'devagar',fb:0}]]);
DIA.A.buff.f=kf(DIA.DEF,[[0,{}],[3,{e:'devagar',ht:-1,lean:-.3,mo:1,aF:80*D,aB:80*D}],[4,{sh:1,ht:-1,lean:-.3,mo:.6,aF:80*D,aB:80*D,by:-1}],[5,{sh:-1,ht:-1,lean:-.3,mo:1,aF:80*D,aB:80*D}],[6,{sh:1,ht:-1,lean:-.3,mo:.6,aF:80*D,aB:80*D,by:-1}],[7,{sh:-1,ht:-1,lean:-.3,mo:1,aF:80*D,aB:80*D}],
  [8,{sh:1,ht:-1,lean:-.3,mo:.6,aF:80*D,aB:80*D,by:-1}],[9,{sh:-1,ht:-1,lean:-.3,mo:1,aF:80*D,aB:80*D}],[10,{sh:1,ht:-1,lean:-.3,mo:.6,aF:80*D,aB:80*D,by:-1}],[11,{sh:0,ht:-1,lean:-.3,mo:1,aF:80*D,aB:80*D}],[13,{e:'segura',ht:-1,lean:-.3,mo:1,aF:80*D,aB:80*D}],[18,{e:'devagar'}]]);
DIA.A.ferido.f=kf(DIA.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-3,rot:-.5,wa:50*D,mo:.6,ht:-1,aF:-60*D}],[3,{bx:-4,by:-1,rot:-.2,wa:-40*D}],[8,{}]]);
DIA.A.morte.f=kf(DIA.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-4,rot:-.6,wa:60*D,mo:.8,aF:-90*D}],[6,{bx:-4,by:0,rot:-2.2,wa:-60*D,dead:1}],[9,{e:'rapido',bx:-4,by:14,rot:-PI/2,wa:40*D,dead:1}],[11,{bx:-4,by:12.5,rot:-PI/2*.9,wa:30*D,dead:1}],[13,{bx:-4,by:14,rot:-PI/2,wa:30*D,dead:1}],[20,{bx:-4,by:14,rot:-PI/2,wa:30*D,dead:1,tl:3}]]);

/* =====================================================================================
   8. CORVO
   ===================================================================================== */
const COR={nome:'Corvo',voa:1,
  DEF:{bx:0,by:0,wa:-20*D,mo:0,hx:0,pf:0,rot:0,dead:0,lean:0,tl:0,px:24,py:24},
  molas:['tl'],
  draw(pen,p){const cx=24+p.bx,cy=24+p.by,C=['#14141e','#262636','#3e3e58'],br='#5a5a8a';
    asaPena(pen,[cx-1,cy-2],PI+(-p.wa)+p.lean,12,['#0e0e16','#1c1c28','#2e2e44']);
    // cauda em leque
    const tb=[cx-4,cy+1];pen.poly([tb,[tb[0]-6,tb[1]+2+p.tl],[tb[0]-6,tb[1]+5+p.tl],[tb[0]-1,tb[1]+3]],C[0]);pen.line(tb[0],tb[1]+1,tb[0]-6,tb[1]+3.5+p.tl,C[2]);
    pen.bola(cx,cy,5*(1+p.pf*.25),3.8*(1+p.pf*.35),C);pen.line(cx-3,cy-2.5,cx+2,cy-3.5,br);
    // patas
    if(p.dead<.5){pen.line(cx,cy+3,cx-1,cy+6,'#5a5050');pen.line(cx+2,cy+3,cx+2,cy+6,'#5a5050')}
    // cabeça
    const h=[cx+4.5+p.hx+p.lean*3,cy-3.5-p.pf];pen.bola(h[0],h[1],3,2.8,C);
    // bico
    const b0=[h[0]+2.2,h[1]-.5];pen.poly([[b0[0],b0[1]-1.2],[b0[0]+4.5,b0[1]+.2-p.mo*.6],[b0[0],b0[1]+.4]],'#4a4a52');pen.line(b0[0],b0[1]-1.2,b0[0]+4,b0[1]-.1-p.mo*.6,'#7a7a86');
    pen.poly([[b0[0],b0[1]+.6],[b0[0]+3.8,b0[1]+.8+p.mo*1.6],[b0[0],b0[1]+1.6]],'#3a3a42');
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+.5),Math.round(h[1]-1),'#8a8aa0');else{pen.px(h[0]+1,h[1]-1,'#ffe8c8');pen.px(h[0]+1,h[1]-.2,'#c0201a')}
    // penas arrepiadas
    if(p.pf>0){for(let i=0;i<4;i++)pen.px(cx-3+i*2,cy-4.5-p.pf*1.5-(i%2),C[2])}
    asaPena(pen,[cx+1,cy-2],p.wa+p.lean,12,C)},
  A:{
   parado:{n:12,fps:13,loop:1,f:(f,n)=>{const a=sw(f,n,1);return{wa:(a*38-8)*D,by:-a*1.5,tl:sw(f,n,1,1)*.8,hx:f===7||f===8?.8:0}}},
   ataque:{nome:'Bicadas',n:18,fps:15,hits:[7,12],f:null},
   buff:{nome:'Grasnar',n:16,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
COR.A.ataque.f=kf(COR.DEF,[[0,{}],[3,{e:'devagar',bx:-2,by:-4,wa:-50*D,lean:-.2}],[6,{e:'rapido',bx:9,by:2,wa:-70*D,lean:.4,hx:2,mo:.3}],[7,{bx:10,by:2,wa:-60*D,lean:.4,hx:-1,mo:0}],[9,{bx:8,by:0,wa:30*D,lean:.2}],
  [11,{e:'rapido',bx:10,by:2,wa:-60*D,lean:.4,hx:2,mo:.3}],[12,{bx:11,by:2,wa:-50*D,lean:.4,hx:-1,mo:0}],[14,{wa:30*D,bx:5,by:-1}],[18,{e:'devagar'}]]);
COR.A.buff.f=kf(COR.DEF,[[0,{}],[4,{e:'devagar',lean:-.3,wa:-80*D,pf:1,by:-2}],[6,{e:'rapido',lean:-.35,wa:-85*D,pf:1,mo:1,by:-3}],[11,{e:'segura',lean:-.35,wa:-85*D,pf:1,mo:1,by:-3}],[16,{e:'devagar'}]]);
COR.A.ferido.f=kf(COR.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-3,rot:-.6,wa:50*D,mo:.6,pf:.8}],[3,{bx:-4,by:-1,rot:-.3,wa:-50*D,pf:.4}],[8,{}]]);
COR.A.morte.f=kf(COR.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-4,rot:-.8,wa:60*D,mo:.8,pf:1}],[5,{bx:-4,by:2,rot:-2,wa:-60*D,dead:1}],[8,{e:'rapido',bx:-4,by:15,rot:-PI,wa:15*D,dead:1}],[10,{bx:-4,by:13.5,rot:-PI,wa:10*D,dead:1}],[12,{bx:-4,by:15,rot:-PI,wa:8*D,dead:1}],[18,{bx:-4,by:15,rot:-PI,wa:8*D,dead:1}]]);

/* =====================================================================================
   motor: sequência com molas, quadro desenhado, espelhado e iluminado
   ===================================================================================== */
const BICHOS={rato:RATO,goblin:GOB,kobold:KOB,morcego:MOR,aranha:ARA,sapo:SAP,diabrete:DIA,corvo:COR};
function molas(seq,keys,loop){const out=[],S={};const passes=loop?2:1;let pb=null;
  for(let r=0;r<passes;r++)for(const s of seq){const p={...s};const vx=pb?(p.bx||p.hx||0)-pb[0]:0,vy=pb?(p.by||p.hy||0)-pb[1]:0;pb=[p.bx||p.hx||0,p.by||p.hy||0];
    for(const k of keys||[]){const t=(p[k]||0)-vx*.5-vy*.4,m=S[k]||(S[k]={x:t,v:0});m.v+=(t-m.x)*.32;m.v*=.68;m.x+=m.v;p[k]=m.x}if(r===passes-1)out.push(p)}return out}
const SEQ={};
function seq(id,nome){const k=id+'|'+nome;if(SEQ[k])return SEQ[k];const B=BICHOS[id],A=B.A[nome];if(!A)return null;
  const raw=[...Array(A.n)].map((_,f)=>({...B.DEF,...A.f(f,A.n)}));return SEQ[k]=molas(raw,B.molas,A.loop)}
/* desenha um quadro: virado para a esquerda (para o herói), com a luz do ato */
function quadro(id,pose,luz){const B=BICHOS[id],c=tela(),x=c.getContext('2d');B.draw(pincel(x),pose);
  let out=c;if(pose.rot){const r=tela(),q=r.getContext('2d');q.imageSmoothingEnabled=false;q.translate(pose.px+(pose.tx||0),pose.py+(pose.ty||0));q.rotate(pose.rot);q.drawImage(c,-pose.px,-pose.py);out=r}
  const m=tela(),mx=m.getContext('2d');mx.translate(W,0);mx.scale(-1,1);mx.drawImage(out,0,0);
  return luz&&typeof lightPass==='function'?lightPass(m,luz):m}
window.BICHOS=BICHOS;window.BICHO={seq,quadro,W,H,GY};
})();
