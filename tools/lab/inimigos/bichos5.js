/* Inimigos articulados — Nível 5 (elites do topo): Olho Flutuante, Minotauro e Dragão Jovem. Usa o motor de bichos.js. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,asaMorcego,D,PI}=BICHO.util,GY=BICHO.GY,W=BICHO.W;
function asaGrande(pen,s,ang,len,fim,col,osso){const tip=P(s,ang,len),m=P(s,ang,len*.5),ctr=[(s[0]+tip[0]+fim[0])/3,(s[1]+tip[1]+fim[1])/3];const pts=[s,m,tip];
  for(let i=1;i<=3;i++){const t=i/4,q=[lerp(tip[0],fim[0],t),lerp(tip[1],fim[1],t)];pts.push([lerp(q[0],ctr[0],.25),lerp(q[1],ctr[1],.25)]);if(i<3){const t2=(i+.5)/4;pts.push([lerp(tip[0],fim[0],t2),lerp(tip[1],fim[1],t2)])}}pts.push(fim);
  pen.poly(pts,col);pen.line(s[0],s[1],m[0],m[1],osso,2);pen.line(m[0],m[1],tip[0],tip[1],osso);for(let i=1;i<=2;i++){const t=i/3,q=[lerp(tip[0],fim[0],t),lerp(tip[1],fim[1],t)];pen.line(m[0],m[1],q[0],q[1],osso)}pen.px(tip[0],tip[1],'#e8dcc0')}
function poeira(pen,x,y,t,cor='#8a7a60'){if(t<=0||t>=1)return;for(let i=0;i<10;i++){const s=i<5?-1:1,dx=s*(2+i%5*2.5)*t*1.8,dy=-Math.sin(t*PI)*(1+i%3)*1.6;pen.px(x+dx,y+dy,cor);pen.px(x+dx+s,y+dy,cor)}}
function racha(pen,x,t){if(t<=0)return;for(let i=-8;i<=8;i++)pen.px(x+i,GY+((i*7)%3===0?-1:0),'#120a06');pen.px(x-9,GY-1,'#120a06');pen.px(x+9,GY,'#120a06')}
function onda(pen,x,t,cor){if(t<=0||t>=1)return;const r=4+t*18;for(let a=0;a<PI;a+=.08){pen.px(x+Math.cos(a)*r,GY-Math.sin(a)*r*.35,cor)}}

/* =====================================================================================
   OLHO FLUTUANTE — um olho gigante com olhinhos nas hastes e tentáculos embaixo
   ===================================================================================== */
const OLH={nome:'Olho Flutuante',nivel:5,voa:1,
  DEF:{bx:0,by:0,pal:0,dil:1,lx:1,ly:0,carga:0,raio:0,hastes:1,hr:-1,esc:0,esp:0,ph:0,dead:0,rot:0,px:24,py:24,sh:0,murcha:0},
  draw(pen,p){const cx=24+p.bx+p.sh,cy=22+p.by,R=8*(1-p.murcha*.35),C=['#3a1448','#6a2e7e','#9a5aae'],ph=p.ph;
    // tentáculos embaixo
    for(let i=0;i<4;i++){let q=[cx-4+i*2.6,cy+R-2];for(let k=1;k<=6;k++){const n=[q[0]+Math.sin(ph*.7+i*1.3+k*.8)*.9,q[1]+1.3*(1-p.murcha*.5)];pen.line(q[0],q[1],n[0],n[1],k<3?C[0]:C[1]);q=n}pen.px(q[0],q[1]+.5,C[2])}
    // hastes com olhinhos (atrás do corpo)
    const tips=[];for(let i=0;i<5;i++){const a=-PI/2+(i-2)*.42,base=P([cx,cy],a,R-1.5);let q=base;const L=6*p.hastes;for(let k=1;k<=4;k++){const n=P(q,a+Math.sin(ph*.9+i*1.7+k)*.3,L/4);pen.line(q[0],q[1],n[0],n[1],C[1]);q=n}tips.push(q);
      if(p.hastes>.3){pen.ell(q[0],q[1],1.3,1.3,'#e8e0d0');pen.px(q[0]+.6,q[1],p.dead>.5?'#3a3a3a':'#c0201a')}}
    pen.bola(cx,cy,R,R*.92,C);
    for(let i=0;i<3;i++){const a=PI*.7+i*.5;const q=P([cx,cy],a,R*.7);pen.px(q[0],q[1],C[0]);pen.px(q[0]+1,q[1],C[0])}
    // o olho grande
    const ex=cx+2.2,ey=cy+.3,erx=R*.62,ery=R*.58;
    pen.ell(ex,ey,erx+.8,ery+.8,'#2a0a30');pen.ell(ex,ey,erx,ery,'#f2eadc');pen.ell(ex-1,ey-1,erx*.5,ery*.4,'#ffffff');
    const ix=ex+p.lx*1.6,iy=ey+p.ly*1.4;
    if(p.dead>.5)olhoX(pen,Math.round(ex),Math.round(ey),'#3a0a2a');
    else{pen.ell(ix,iy,2.8,2.8,p.carga>.2?'#e050c0':'#3a8ad0');pen.ell(ix,iy,1.9,1.9,p.carga>.2?'#ff8af0':'#5ab0f0');pen.ell(ix,iy,Math.max(.6,1.3*p.dil),Math.max(.8,1.6*p.dil),'#0a0610');pen.px(ix-1,iy-1.2,'#ffffff')}
    // veias
    pen.px(ex-erx+1,ey+1,'#d07070');pen.px(ex-erx+2,ey+2,'#d07070');pen.px(ex+erx-2,ey+2.5,'#d07070');
    // pálpebra
    if(p.pal>0){const ly=ey-ery-1+(ery*2+2)*p.pal;for(let y=Math.floor(ey-ery-1);y<=ly;y++){const t=(y+.5-ey)/(ery+.8);if(Math.abs(t)>1)continue;const w=(erx+.8)*Math.sqrt(1-t*t);pen.line(ex-w,y,ex+w,y,C[1])}pen.line(ex-erx,ly,ex+erx,ly,C[0])}
    pen.info.boca=[ix+1,iy];
    // carga e raio desintegrador (brilho próprio, por cima da luz)
    const carga=p.carga,raio=p.raio,esp=p.esp,esc=p.esc,hr=p.hr;
    pen.depois(pn=>{
      if(carga>0){for(let i=0;i<8;i++){const a=ph*.8+i*PI/4,r=(1-carga)*9+3;pn.px(ix+Math.cos(a)*r,iy+Math.sin(a)*r,i%2?'#ff8af0':'#ffffff')}}
      if(raio>0){const x0=ix+2,x1=lerp(x0,W,Math.min(1,raio*1.4));const w=raio>.15?1:0;pn.line(x0,iy-1-w,x1,iy-1-w,'#c040b0');pn.line(x0,iy+1+w,x1,iy+1+w,'#c040b0');pn.line(x0,iy,x1,iy,'#ffffff',w?2:1);
        for(let i=0;i<5;i++)pn.px(lerp(x0,x1,(i+.5)/5)+Math.sin(ph*3+i)*2,iy+Math.cos(ph*2.3+i)*2.5,'#ffb0f0')}
      if(hr>=0&&hr<5){const t=tips[Math.floor(hr)];if(t){pn.line(t[0]+1,t[1],W,t[1]+3,'#ff6a5a');pn.line(t[0]+1,t[1]+1,W,t[1]+4,'#ffd0c0')}}
      if(esp>0){for(let k=0;k<3;k++){const r=4+k*4+esp*4;for(let a=-.8;a<=.8;a+=.1)pn.px(ix+2+Math.cos(a)*r,iy+Math.sin(a)*r,k===0?'#f0c0ff':'#a050e0')}}
      if(esc>0){const r=12*esc;for(let a=0;a<PI*2;a+=.09){const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(((a*10)|0)%3)pn.px(x,y,'#a8d8ff')}for(let i=0;i<6;i++){const a=ph*.4+i*PI/3;pn.px(cx+Math.cos(a)*r*.7,cy+Math.sin(a)*r*.7,'#e8f6ff')}}})},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({ph:f,by:-sw(f,n,1)*2,lx:.8+sw(f,n,1,1)*.5,ly:sw(f,n,2)*.4,pal:f===11?.85:f===10||f===12?.4:0,dil:1+sw(f,n,2)*.15})},
   entrada:{nome:'Entrada',n:22,fps:11,f:null},
   ataque:{nome:'Raio Desintegrador',n:24,fps:13,hits:[14],f:null},
   especial:{nome:'Raios Oculares',n:22,fps:14,hits:[6,9,12,15],f:null},
   buff:{nome:'Olhar Paralisante',n:18,fps:12,f:null},
   defesa:{nome:'Escudo Mental',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
const ol=f=>o=>({...o,ph:f});
OLH.A.entrada.f=f=>ol(f)(kf(OLH.DEF,[[0,{by:-14,pal:1,hastes:0}],[8,{e:'devagar',by:0,pal:1,hastes:.3}],[12,{pal:1,hastes:1}],[15,{e:'devagar',pal:0,dil:.4,hastes:1}],[18,{pal:0,dil:1.4,lx:1.2}],[22,{e:'devagar'}]])(f));
OLH.A.ataque.f=f=>ol(f)(kf(OLH.DEF,[[0,{}],[4,{e:'devagar',bx:-2,lx:1.3,dil:.5,carga:.3}],[12,{e:'devagar',bx:-3,lx:1.3,dil:.4,carga:1,sh:0}],[13,{bx:-3,carga:1,sh:1,lx:1.3}],[14,{e:'rapido',bx:-1,carga:0,raio:1,lx:1.4,dil:1.6,sh:0}],[19,{e:'segura',bx:-1,raio:1,lx:1.4,dil:1.6}],[20,{bx:-2,raio:0}],[24,{e:'devagar'}]])(f));
OLH.A.especial.f=f=>ol(f)(kf(OLH.DEF,[[0,{}],[4,{e:'devagar',hastes:1.25,by:-2}],[6,{hastes:1.25,by:-2,hr:0}],[7,{hastes:1.25,by:-2,hr:-1}],[9,{hastes:1.25,by:-2,hr:1}],[10,{hastes:1.25,by:-2,hr:-1}],[12,{hastes:1.25,by:-2,hr:2}],[13,{hastes:1.25,by:-2,hr:-1}],[15,{hastes:1.25,by:-2,hr:4}],[16,{hastes:1.25,by:-2,hr:-1}],[22,{e:'devagar'}]])(f));
OLH.A.buff.f=f=>ol(f)(kf(OLH.DEF,[[0,{}],[4,{e:'devagar',pal:.6,lx:1}],[7,{e:'rapido',pal:0,dil:.25,lx:1.4,esp:.1}],[14,{e:'linear',pal:0,dil:.25,lx:1.4,esp:1}],[18,{e:'devagar',esp:0}]])(f));
OLH.A.defesa.f=f=>ol(f)(kf(OLH.DEF,[[0,{}],[4,{e:'devagar',pal:.7,esc:.3}],[9,{e:'rapido',pal:.2,esc:1,dil:.6}],[14,{e:'segura',pal:.2,esc:1}],[18,{e:'devagar',esc:0}]])(f));
OLH.A.ferido.f=f=>ol(f)(kf(OLH.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-2,pal:1,sh:1,hastes:.7}],[3,{bx:-4,pal:.8,sh:-1}],[8,{}]])(f));
OLH.A.morte.f=f=>ol(f)(kf(OLH.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-3,pal:1,hastes:.6,sh:1}],[6,{bx:-3,by:-2,pal:0,dead:1,dil:2,hastes:.5}],[12,{e:'rapido',bx:-3,by:15,dead:1,hastes:.2,murcha:.3}],[14,{bx:-3,by:13.5,dead:1,hastes:.1,murcha:.4}],[16,{bx:-3,by:15,dead:1,hastes:0,murcha:.5}],[20,{bx:-3,by:15,dead:1,hastes:0,murcha:.5}]])(f));

/* =====================================================================================
   MINOTAURO
   ===================================================================================== */
const MIN={nome:'Minotauro',nivel:5,
  DEF:{hx:20,hy:31,lean:10*D,fF:[26,GY],fB:[14,GY],aF:60*D,aF2:-150*D,aB:80*D,aB2:-30*D,ax:-125*D,ht:0,mo:0,vapor:0,pz:0,rc:0,onda:0,andar:0,passo:0,tr:0,dead:0,rot:0,px:20,py:GY,sh:0,ph:0,olho:1},
  draw(pen,p){const F=['#3a2214','#5c3820','#7e5030'],CH=['#b8aa88','#e8dcc0'],CO='#2a1a10';
    const hip=[p.hx+p.sh,p.hy],neck=P(hip,-PI/2+p.lean,12),shF=[neck[0]+2,neck[1]+2],shB=[neck[0]-2,neck[1]+2];
    let fF=p.fF,fB=p.fB;if(p.andar>0){const a=Math.sin(p.passo),b=Math.cos(p.passo);fF=[hip[0]+3+a*4,GY-Math.max(0,b)*2.4];fB=[hip[0]-3-a*4,GY-Math.max(0,-b)*2.4]}
    const perna=(h,f,c)=>{const[k,ft]=ik(h,f,6.5,6.5,1);pen.line(h[0],h[1],k[0],k[1],c,4);pen.line(k[0],k[1],ft[0],ft[1],c,3);pen.line(ft[0]-1,ft[1]-1,ft[0]+2.5,ft[1]-1,'#1a120c',2);pen.px(ft[0]+1,ft[1]-2,'#1a120c')};
    const braco=(sh,a1,a2,c)=>{const e=P(sh,a1,5.5),h=P(e,a1+a2,5.5);pen.line(sh[0],sh[1],e[0],e[1],c,4);pen.line(e[0],e[1],h[0],h[1],c,3);return h};
    braco(shB,p.aB,p.aB2,F[0]);
    perna([hip[0]-2,hip[1]],fB,F[0]);
    // tronco enorme e peludo
    pen.poly([[neck[0]-7,neck[1]-1],[neck[0]+6,neck[1]],[hip[0]+5,hip[1]],[hip[0]-5,hip[1]]],F[1]);pen.line(neck[0]+6,neck[1],hip[0]+5,hip[1],F[2]);
    const m=P(neck,PI/2+p.lean,3);pen.ell(m[0]+1.5,m[1],3.5,2,F[2]);pen.line(m[0]-3,m[1]+2,m[0]+4,m[1]+2.5,F[0]);for(let i=0;i<2;i++){pen.px(m[0]+1,m[1]+4.5+i*2,F[0]);pen.px(m[0]+3,m[1]+4.5+i*2,F[0])}
    for(let i=0;i<5;i++)pen.px(neck[0]-5+i*2,neck[1]-1-(i%2),F[0]);
    pen.poly([[hip[0]-5,hip[1]-1],[hip[0]+5,hip[1]-1],[hip[0]+4,hip[1]+5],[hip[0],hip[1]+3.5],[hip[0]-4,hip[1]+5]],'#6a2018');pen.line(hip[0]-5,hip[1]-1,hip[0]+5,hip[1]-1,CO,2);pen.px(hip[0]+1,hip[1]-1,'#b8902e');
    perna([hip[0]+2,hip[1]],fF,F[1]);
    // machado na mão da frente
    const fh=braco(shF,p.aF,p.aF2,F[1]);
    const s0=P(fh,p.ax+PI,3),e0=P(fh,p.ax,15);pen.line(s0[0],s0[1],e0[0],e0[1],'#5c3a1e',2);
    for(const sd of [-1,1]){const b0=P(e0,p.ax+PI,4.5),lado=p.ax+sd*PI/2;pen.poly([b0,P(b0,lado,5),P(P(e0,p.ax,1.5),lado,6),P(e0,p.ax,1.5)],sd<0?'#a8b0c0':'#6a7080')}pen.px(e0[0],e0[1],'#e8eef6');
    pen.line(fh[0]-1,fh[1],fh[0]+1,fh[1],F[2]);
    // cabeça de touro com chifres e argola
    const ht=p.ht,h=P(neck,-PI/2+p.lean+.5+ht*.5,4.2);
    pen.poly([[h[0]-2,h[1]-2],[h[0]-5,h[1]-6],[h[0]-6,h[1]-10],[h[0]-4,h[1]-6.5],[h[0]-1,h[1]-3.5]],CH[0]);
    pen.bola(h[0],h[1],4.8,4.4,F);
    pen.poly([[h[0]+1,h[1]-1.5],[h[0]+7,h[1]+.5+ht],[h[0]+6.5,h[1]+4+ht],[h[0]+1.5,h[1]+3.5]],F[1]);pen.ell(h[0]+6,h[1]+2.4+ht,1.6,1.4,'#c8a080');pen.px(h[0]+6.6,h[1]+2+ht,'#3a1a10');
    pen.ell(h[0]+6.4,h[1]+4.2+ht,1.4,1.2,'#e8c25a');pen.px(h[0]+6.4,h[1]+4.2+ht,F[1]);
    pen.poly([[h[0]-.5,h[1]-3],[h[0]+2,h[1]-7],[h[0]+5,h[1]-9.5],[h[0]+6.5,h[1]-9],[h[0]+4,h[1]-6.5],[h[0]+2.5,h[1]-2.2]],CH[1]);pen.line(h[0]+2,h[1]-7,h[0]+5,h[1]-9.5,'#fffaf0');pen.px(h[0]+6.5,h[1]-9,'#fffaf0');
    pen.poly([[h[0]-2,h[1]-2],[h[0]-3.5,h[1]-4.5],[h[0]-1,h[1]-3.5]],F[0]);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+2),Math.round(h[1]-.6),'#1a0a06');else{pen.px(h[0]+2,h[1]-.6,p.olho>1?'#ff2a1a':'#ff8a2a');pen.px(h[0]+3,h[1]-.6,'#1a0a06')}
    if(p.mo>.2)pen.line(h[0]+2.5,h[1]+3.6+ht,h[0]+6,h[1]+4+ht+p.mo*1.2,'#2a0808');
    if(p.vapor>0){for(let i=0;i<4;i++){const t=(p.vapor+i/4)%1;pen.ell(h[0]+8+t*5,h[1]+2.5+ht+t*2-t*t*4,.8+t*1.2,.8+t*1.2,t<.5?'#e8e0d8':'#a8a098')}}
    poeira(pen,p.hx+3,GY,p.pz);racha(pen,p.hx+12,p.rc);onda(pen,p.hx+12,p.onda,'#c8b090')},
  A:{
   parado:{n:16,fps:8,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{ph:f,hy:31+(b>.6?1:0),lean:(10+b*2)*D,ax:(-125+b*3)*D,vapor:f>=6&&f<=10?(f-6)/5:0,ht:sw(f,n,1,1)>.85?.4:0}}},
   entrada:{nome:'Entrada',n:26,fps:12,f:null},
   ataque:{nome:'Chifrada',n:20,fps:14,hits:[7,13],f:null},
   especial:{nome:'Pisotear',n:20,fps:13,hits:[11],f:null},
   buff:{nome:'Bufar',n:18,fps:12,f:null},
   especial2:{nome:'Investida Brutal',n:24,fps:14,hits:[12],f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:22,fps:11,f:null}}};
const mn=f=>o=>({...o,ph:f});
MIN.A.entrada.f=f=>mn(f)(kf(MIN.DEF,[[0,{hx:-8,andar:1,passo:0}],[12,{e:'linear',hx:19,andar:1,passo:PI*5}],[13,{hx:20,andar:0}],[15,{e:'devagar',hx:20,hy:30,fF:[28,GY-6],aB:40*D,lean:2*D}],[16,{e:'rapido',hx:21,hy:32,fF:[28,GY],pz:.1,rc:1,onda:.1}],
  [19,{e:'devagar',hx:21,hy:31,lean:-14*D,ht:-1.4,mo:1.4,vapor:.2,rc:1,pz:.7,onda:.9,olho:2}],[23,{e:'segura',hx:21,hy:31,lean:-14*D,ht:-1.4,mo:1.4,vapor:.9,rc:1,olho:2}],[26,{e:'devagar',rc:0}]])(f));
MIN.A.ataque.f=f=>mn(f)(kf(MIN.DEF,[[0,{}],[4,{e:'devagar',hx:18,lean:-4*D,ht:-1,olho:2}],[6,{e:'rapido',hx:26,lean:34*D,ht:2,fF:[32,GY],fB:[18,GY]}],[7,{hx:27,lean:36*D,ht:1.2,fF:[32,GY],fB:[18,GY],mo:1}],[9,{e:'devagar',hx:22,lean:6*D,ht:-.8}],
  [12,{e:'rapido',hx:27,lean:36*D,ht:2,fF:[33,GY],fB:[19,GY]}],[13,{hx:28,lean:38*D,ht:1.2,fF:[33,GY],fB:[19,GY],mo:1}],[15,{e:'segura',hx:28,lean:38*D,ht:1.2,fF:[33,GY],fB:[19,GY]}],[20,{e:'devagar'}]])(f));
MIN.A.especial.f=f=>mn(f)(kf(MIN.DEF,[[0,{}],[5,{e:'devagar',hx:19,hy:30,lean:-6*D,fF:[27,GY-9],aB:20*D,aB2:-60*D,ht:-.5}],[9,{e:'segura',hx:19,hy:30,lean:-6*D,fF:[27,GY-10],aB:20*D,aB2:-60*D,ht:-.5}],[11,{e:'rapido',hx:22,hy:33,lean:16*D,fF:[29,GY],ht:1,mo:1,pz:.1,rc:1,onda:.1}],
  [16,{e:'segura',hx:22,hy:33,lean:16*D,fF:[29,GY],ht:1,pz:.8,rc:1,onda:.95}],[20,{e:'devagar',rc:0}]])(f));
MIN.A.buff.f=f=>mn(f)(kf(MIN.DEF,[[0,{}],[4,{e:'devagar',lean:24*D,ht:1.4,fB:[12,GY]}],[6,{lean:24*D,ht:1.4,fB:[10,GY-2],vapor:.1,olho:2}],[8,{lean:24*D,ht:1.4,fB:[12,GY],vapor:.4,olho:2,pz:.1}],[10,{lean:24*D,ht:1.4,fB:[10,GY-2],vapor:.7,olho:2,pz:.5}],[12,{lean:24*D,ht:1.4,fB:[12,GY],vapor:.95,olho:2,pz:.9}],[18,{e:'devagar',olho:2}]])(f));
MIN.A.especial2.f=f=>mn(f)(kf(MIN.DEF,[[0,{}],[5,{e:'devagar',hx:15,hy:33,lean:30*D,ht:2,fF:[21,GY],fB:[9,GY],olho:2,vapor:.3}],[8,{e:'segura',hx:15,hy:33,lean:30*D,ht:2,fF:[21,GY],fB:[9,GY],olho:2,vapor:.8,pz:.3}],
  [11,{e:'rapido',hx:32,hy:32,lean:44*D,ht:2.4,andar:1,passo:PI*3,olho:2}],[12,{hx:34,hy:33,lean:46*D,ht:2.4,fF:[39,GY],fB:[26,GY],olho:2,mo:1,pz:.1}],[16,{e:'segura',hx:34,hy:33,lean:46*D,ht:2.4,fF:[39,GY],fB:[26,GY],olho:2,pz:.8}],[24,{e:'devagar'}]])(f));
MIN.A.ferido.f=f=>mn(f)(kf(MIN.DEF,[[0,{}],[1,{e:'rapido',hx:17,lean:-8*D,ht:-1.4,mo:1,fF:[24,GY],fB:[12,GY],ax:-40*D}],[3,{hx:17,lean:2*D,fF:[24,GY],fB:[12,GY]}],[8,{}]])(f));
MIN.A.morte.f=f=>mn(f)(kf(MIN.DEF,[[0,{}],[2,{e:'rapido',hx:17,lean:-10*D,ht:-1.4,mo:1.2,fF:[24,GY],fB:[12,GY],ax:-30*D}],[7,{e:'devagar',hx:20,hy:37,lean:14*D,ht:1.5,fF:[28,GY],fB:[13,GY-.5],ax:40*D,aF:80*D,px:34,py:GY-1}],
  [13,{e:'rapido',hx:20,hy:37,lean:14*D,ht:1.5,fF:[28,GY],fB:[13,GY],ax:40*D,aF:80*D,rot:PI/2,px:34,py:GY-1,tx:-2,ty:-5,dead:1,pz:.1}],[15,{hx:20,hy:37,lean:14*D,ht:1.5,fF:[28,GY],fB:[13,GY],ax:40*D,aF:80*D,rot:PI/2*.95,px:34,py:GY-1,tx:-2,ty:-6,dead:1,pz:.5}],[17,{hx:20,hy:37,lean:14*D,ht:1.5,fF:[28,GY],fB:[13,GY],ax:40*D,aF:80*D,rot:PI/2,px:34,py:GY-1,tx:-2,ty:-5,dead:1,pz:.9}],[22,{hx:20,hy:37,lean:14*D,ht:1.5,fF:[28,GY],fB:[13,GY],ax:40*D,aF:80*D,rot:PI/2,px:34,py:GY-1,tx:-2,ty:-5,dead:1}]])(f));

/* =====================================================================================
   DRAGÃO JOVEM
   ===================================================================================== */
const DRA={nome:'Dragão Jovem',nivel:5,
  DEF:{bx:0,by:0,lean:0,nk:-55*D,hd:10*D,mo:0,wa:-125*D,tl:0,tg:0,lg:0,garra:0,fogo:0,voo:0,ph:0,dead:0,rot:0,px:22,py:GY,pz:0,brilho:0,sh:0},
  molas:['tl'],
  draw(pen,p){const C=['#5a1410','#9a2a1c','#c8462a'],B=['#c89a3a','#e8c25a'],CH='#e8dcc0',ph=p.ph;
    const cx=25+p.bx+p.sh,cy=34+p.by-p.voo*14,lean=p.lean;
    const rot=(dx,dy)=>[cx+dx*Math.cos(lean)-dy*Math.sin(lean),cy+dx*Math.sin(lean)+dy*Math.cos(lean)];
    const ombro=rot(7,-3),anca=rot(-7,0),rabo0=rot(-9,0);
    // asa de trás
    asaGrande(pen,rot(1,-4),p.wa+lean+.3,17,rot(-9,-3),'#4a0e0a','#2a0606');
    // rabo (com ponta de flecha); tg>0 varre o rabo para a frente por baixo
    let q=rabo0,ang=PI+.25-p.tg*2.6;for(let i=1;i<=10;i++){const t=i/10;ang+=.06+Math.sin(ph*.6+i*.7+p.tl)*.08+(p.tg>0?-.16*p.tg:0);const n=P(q,ang,1.75);pen.line(q[0],q[1],n[0],n[1],i<4?C[1]:i<8?C[0]:C[1],i<4?3:i<7?2:1);q=n}
    pen.poly([P(q,ang+PI/2,2),P(q,ang,3.5),P(q,ang-PI/2,2)],C[2]);
    // pernas de trás e da frente (longe)
    const pata=(h,f,c,grossa)=>{const[k,ft]=ik(h,f,5,5,-1);pen.line(h[0],h[1],k[0],k[1],c,grossa?4:2);pen.line(k[0],k[1],ft[0],ft[1],c,2);for(let i=0;i<3;i++)pen.px(ft[0]+i,ft[1],CH)};
    const passo=(ph2)=>[Math.sin(p.lg+ph2)*2,Math.max(0,Math.cos(p.lg+ph2))*2];
    const s1=passo(PI),s2=passo(0);
    const voo=p.voo>0;const pe=(x,s)=>voo?[x+2,cy+8]:[x+s[0],GY-s[1]];
    pata(rot(-6,2),pe(anca[0]-2,s1),C[0],1);pata(rot(5,2),pe(ombro[0]+1,s2),C[0],0);
    // corpo com placas da barriga
    pen.poly([rot(-10,-2),rot(-2,-5.5),rot(8,-5),rot(10,1),rot(4,5),rot(-6,4.5)],C[1]);
    for(let i=0;i<5;i++){const a=rot(-5+i*3,4.2);pen.line(a[0]-1,a[1],a[0]+1,a[1],i%2?B[0]:B[1])}
    pen.line(rot(-8,-2.5)[0],rot(-8,-2.5)[1],rot(6,-5)[0],rot(6,-5)[1],C[2]);
    for(let i=0;i<5;i++){const a=rot(-8+i*3.5,-5);pen.poly([[a[0]-1,a[1]+.5],[a[0],a[1]-2],[a[0]+1,a[1]+.5]],CH)}
    // pernas da frente (perto)
    pata(rot(-4,3),pe(anca[0]+1,s2),C[1],1);
    if(p.garra>0){const sh=rot(6,2),a=-PI/4-p.garra*.9,e=P(sh,a+.6,4),hh=P(e,a,4);pen.line(sh[0],sh[1],e[0],e[1],C[1],2);pen.line(e[0],e[1],hh[0],hh[1],C[1],2);for(let i=-1;i<=1;i++){const t=P(hh,a+i*.5,2.5);pen.line(hh[0],hh[1],t[0],t[1],CH)}}
    else pata(rot(6,2),pe(ombro[0]+3,s1),C[1],0);
    // pescoço em gomos
    let nq=ombro,na=p.nk+lean;const gomos=[];for(let i=0;i<5;i++){const n=P(nq,na,2.3);gomos.push(n);nq=n;na+=.12}
    gomos.forEach((g,i)=>{pen.ell(g[0],g[1],2.6-i*.15,2.4-i*.15,C[1]);pen.px(g[0]+1,g[1]+1.5,B[0])});
    // cabeça com chifres e mandíbula
    const hb=nq,ha=p.hd+lean,fw=P(hb,ha,7.5),top=P(hb,ha-PI/2,2.2),bot=P(hb,ha+PI/2,1.2);
    pen.poly([P(top,ha+PI,1.5),top,P(fw,ha-PI/2,.8),fw,P(fw,ha+PI/2,.6),bot],C[1]);pen.line(top[0],top[1],P(fw,ha-PI/2,.8)[0],P(fw,ha-PI/2,.8)[1],C[2]);
    const ja=ha+p.mo*.55,jf=P(bot,ja,6.5);pen.poly([bot,P(bot,ja+PI/2,1.4),P(jf,ja+PI/2,.4),jf],C[0]);
    if(p.mo>.15){pen.poly([bot,P(fw,ha+PI/2,.6),jf],'#3a0808');for(let i=1;i<4;i++){const t=P(P(bot,ha,i*1.8),ha+PI/2,.6);pen.px(t[0],t[1],CH)}}
    const c1=P(top,ha+PI,1),c2=P(c1,ha+PI+.45,5.5),c3=P(P(top,ha,1.5),ha+PI+.25,5);pen.line(c1[0],c1[1],c2[0],c2[1],CH,2);pen.line(P(top,ha,1.5)[0],P(top,ha,1.5)[1],c3[0],c3[1],'#b8aa88');
    const ey=P(P(hb,ha,2.5),ha-PI/2,.8);if(p.dead>.5)olhoX(pen,Math.round(ey[0]),Math.round(ey[1]),'#1a0606');else{pen.px(ey[0],ey[1],'#ffe27a');pen.px(ey[0]+.6,ey[1],'#1a0606')}
    const nar=P(fw,ha-PI/2,.2);pen.px(nar[0]-.5,nar[1],'#1a0606');
    pen.info.boca=P(fw,ha+.25,1);
    // asa da frente
    asaGrande(pen,rot(3,-4.5),p.wa+lean,18,rot(-6,-2),C[1],C[0]);
    // sopro de fogo (brilho próprio)
    const fogo=p.fogo,bo=pen.info.boca,dir=ha+.15;
    pen.depois(pn=>{if(fogo>0){const L=fogo*34;for(let i=0;i<16;i++){const t=i/15;if(t*34>L)break;const c=P(bo,dir+Math.sin(ph*2.7+i)*.06,t*L),r=.8+t*4.5;pn.ell(c[0],c[1]+Math.sin(ph*3+i)*t*1.5,r+.8,r*.8+.6,'#c03a1a');pn.ell(c[0],c[1],r,r*.75,'#ff8a2a');if(t<.6)pn.ell(c[0],c[1],r*.45,r*.35,'#ffe27a')}}})
    if(p.pz>0&&p.pz<1){for(let i=0;i<10;i++){const s=i<5?-1:1,dx=s*(2+i%5*2.5)*p.pz*1.8;pen.px(cx+dx,GY-Math.sin(p.pz*PI)*(1+i%3)*1.5,'#8a7a60')}}
    if(p.brilho>0){const a=rot(0,-1);for(let k=0;k<12;k++){const ang=k*PI/6+ph*.3;pen.px(a[0]+Math.cos(ang)*13,a[1]+Math.sin(ang)*8,'#bfe0ff')}}},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>({ph:f,by:sw(f,n,2)>.6?-.5:0,nk:(-55+sw(f,n,1)*4)*D,hd:(10+sw(f,n,1,1)*6)*D,wa:(-125+sw(f,n,1)*5)*D,mo:f>=11&&f<=13?.4:0})},
   entrada:{nome:'Entrada',n:26,fps:13,f:null},
   ataque:{nome:'Sopro de Fogo',n:24,fps:13,hits:[11],f:null},
   especial:{nome:'Garras',n:20,fps:14,hits:[7,13],f:null},
   especial2:{nome:'Rabada',n:20,fps:13,hits:[10],f:null},
   buff:{nome:'Rugido',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:22,fps:11,f:null}}};
const dr=f=>o=>({...o,ph:f});
DRA.A.entrada.f=f=>dr(f)(kf(DRA.DEF,[[0,{voo:0.99,bx:-14,wa:-75*D,nk:-30*D,hd:20*D}],[2,{voo:0.93,bx:-12,wa:-175*D}],[4,{voo:0.84,bx:-9,wa:-75*D}],[6,{voo:0.71,bx:-6,wa:-175*D}],[8,{voo:0.56,bx:-4,wa:-75*D}],[10,{voo:0.37,bx:-2,wa:-175*D}],[12,{voo:0.19,bx:-1,wa:-75*D}],
  [14,{e:'rapido',voo:0,bx:0,wa:-150*D,by:2,pz:.1}],[16,{by:0,wa:-110*D,pz:.5}],[19,{e:'devagar',nk:-80*D,hd:-30*D,mo:1.2,wa:-70*D,pz:.9}],[23,{e:'segura',nk:-80*D,hd:-30*D,mo:1.2,wa:-70*D}],[26,{e:'devagar'}]])(f));
DRA.A.ataque.f=f=>dr(f)(kf(DRA.DEF,[[0,{}],[5,{e:'devagar',nk:-85*D,hd:-30*D,mo:.4,lean:-8*D,bx:-2}],[9,{e:'segura',nk:-85*D,hd:-30*D,mo:.4,lean:-8*D,bx:-2}],[11,{e:'rapido',nk:-25*D,hd:15*D,mo:1.3,lean:6*D,bx:2,fogo:.4}],[13,{nk:-25*D,hd:15*D,mo:1.3,lean:6*D,bx:2,fogo:1}],
  [18,{e:'segura',nk:-28*D,hd:12*D,mo:1.3,lean:6*D,bx:2,fogo:1}],[20,{nk:-35*D,hd:10*D,mo:.6,fogo:0}],[24,{e:'devagar'}]])(f));
DRA.A.especial.f=f=>dr(f)(kf(DRA.DEF,[[0,{}],[4,{e:'devagar',lean:-18*D,bx:-1,garra:1,nk:-70*D,mo:.6,wa:-80*D}],[6,{e:'rapido',lean:4*D,bx:5,garra:.1,nk:-40*D,mo:1}],[7,{lean:6*D,bx:6,garra:0,nk:-40*D}],[9,{e:'devagar',lean:-18*D,bx:4,garra:1,nk:-70*D,wa:-80*D}],
  [12,{e:'rapido',lean:4*D,bx:8,garra:.1,nk:-40*D,mo:1}],[13,{lean:6*D,bx:8,garra:0,nk:-40*D}],[15,{e:'segura',lean:6*D,bx:8,nk:-40*D}],[20,{e:'devagar'}]])(f));
DRA.A.especial2.f=f=>dr(f)(kf(DRA.DEF,[[0,{}],[5,{e:'devagar',lean:6*D,bx:-2,tg:-.15,nk:-60*D}],[8,{e:'rapido',lean:2*D,bx:2,tg:.7}],[10,{e:'rapido',lean:-2*D,bx:3,tg:1,brilho:1,pz:.1}],[14,{e:'segura',lean:-2*D,bx:3,tg:1,brilho:1,pz:.7}],[20,{e:'devagar',tg:0,brilho:0}]])(f));
DRA.A.buff.f=f=>dr(f)(kf(DRA.DEF,[[0,{}],[4,{e:'devagar',lean:-12*D,nk:-90*D,hd:-40*D,wa:-60*D,mo:.4}],[7,{e:'rapido',lean:-16*D,nk:-95*D,hd:-50*D,wa:-45*D,mo:1.4,sh:1}],[9,{lean:-16*D,nk:-95*D,hd:-50*D,wa:-50*D,mo:1.4,sh:-1}],[11,{lean:-16*D,nk:-95*D,hd:-50*D,wa:-45*D,mo:1.4,sh:1}],[13,{e:'segura',lean:-16*D,nk:-95*D,hd:-50*D,wa:-50*D,mo:1.3,sh:0}],[18,{e:'devagar'}]])(f));
DRA.A.ferido.f=f=>dr(f)(kf(DRA.DEF,[[0,{}],[1,{e:'rapido',bx:-4,lean:-10*D,nk:-90*D,hd:-40*D,mo:1,wa:-175*D}],[3,{bx:-4,lean:-4*D,nk:-70*D}],[8,{}]])(f));
DRA.A.morte.f=f=>dr(f)(kf(DRA.DEF,[[0,{}],[2,{e:'rapido',bx:-4,lean:-14*D,nk:-95*D,hd:-50*D,mo:1.3,wa:-75*D}],[7,{e:'devagar',bx:-3,by:3,lean:6*D,nk:-10*D,hd:30*D,mo:.6,wa:-150*D}],[11,{e:'rapido',bx:-3,by:3,lean:4*D,nk:20*D,hd:40*D,mo:.4,wa:-175*D,dead:1,pz:.1}],[13,{bx:-3,by:2.5,nk:22*D,hd:42*D,wa:-178*D,dead:1,pz:.5}],[16,{bx:-3,by:3,nk:22*D,hd:42*D,wa:-180*D,dead:1,pz:.9}],[22,{bx:-3,by:3,nk:22*D,hd:42*D,wa:-180*D,dead:1}]])(f));

Object.assign(BICHOS,{olho:OLH,minotauro:MIN,dragao:DRA});
})();
