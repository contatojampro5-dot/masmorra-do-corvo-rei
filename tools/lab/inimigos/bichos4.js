/* Inimigos articulados — Nível 4 (elites): Bruxa do Pântano, Carrasco, Mímico, Orc Berserker e Cavaleiro Negro.
   Elites têm ENTRADA (chegam na luta) e dois ataques diferentes. Usa o motor de bichos.js. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,D,PI}=BICHO.util,GY=BICHO.GY;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

/* ---------- corpo humano grande (carrasco, orc, cavaleiro negro) ---------- */
function humano(pen,p,o){const hip=[p.hx+(p.sh||0),p.hy],lean=p.lean||0,neck=P(hip,-PI/2+lean,o.tronco),shF=[neck[0]+1.5,neck[1]+2],shB=[neck[0]-1.5,neck[1]+2];
  let fF=p.fF,fB=p.fB;if(p.andar>0){const a=Math.sin(p.passo),b=Math.cos(p.passo);fF=[hip[0]+2+a*3.5,GY-Math.max(0,b)*2];fB=[hip[0]-2-a*3.5,GY-Math.max(0,-b)*2]}
  const perna=(h,f,c,bota)=>{const[k,ft]=ik(h,f,o.perna,o.perna,1);pen.line(h[0],h[1],k[0],k[1],c,3);pen.line(k[0],k[1],ft[0],ft[1],c,2);pen.line(ft[0]-1.5,ft[1]-1,ft[0]+2.5,ft[1]-1,bota,2);return k};
  const braco=(sh,a1,a2,c1,c2,w=2)=>{const e=P(sh,a1,o.braco),h=P(e,a1+a2,o.braco);pen.line(sh[0],sh[1],e[0],e[1],c1,w+1);pen.line(e[0],e[1],h[0],h[1],c2,w);return{e,h}};
  return{hip,neck,shF,shB,fF,fB,perna,braco}}
function machado(pen,h,ang,cabo,lam,cor){const s=P(h,ang+PI,3),e=P(h,ang,cabo);pen.line(s[0],s[1],e[0],e[1],'#5c3a1e',2);
  const b0=P(e,ang+PI,lam*.55),lado=ang-PI/2;const pts=[b0,P(b0,lado,lam*.9),P(P(e,ang,1.5),lado,lam*1.1),P(e,ang,1.5)];pen.poly(pts,cor[0]);pen.line(pts[1][0],pts[1][1],pts[2][0],pts[2][1],cor[1]);pen.px(pts[2][0],pts[2][1],'#ffffff');return e}
function arco(pen,c,a0,a1,r0,r1,cor=['#ffffff','#c8d0e0','#8a96aa']){if(a0===a1)return;const st=Math.sign(a1-a0)*.05;for(let a=a0;Math.sign(a1-a)===Math.sign(st);a+=st){const t=(a-a0)/(a1-a0),w=Math.max(1,Math.round(t*2.5));for(let r=r1-w;r<=r1;r++){const q=P(c,a,r);pen.px(q[0],q[1],r===r1?(t>.6?cor[0]:cor[1]):cor[2])}}}
function poeira(pen,x,y,t,cor='#8a7a60'){if(t<=0||t>=1)return;for(let i=0;i<8;i++){const s=i<4?-1:1,dx=s*(2+i%4*2.5)*t*1.6,dy=-Math.sin(t*PI)*(1+i%3)*1.5;pen.px(x+dx,y+dy,cor);pen.px(x+dx+s,y+dy,cor)}}
function racha(pen,x,t){if(t<=0)return;for(let i=-6;i<=6;i++){pen.px(x+i,GY+((i*7)%3===0?-1:0),'#120a06')}pen.px(x-7,GY-1,'#120a06');pen.px(x+7,GY,'#120a06')}

/* =====================================================================================
   BRUXA DO PÂNTANO
   ===================================================================================== */
const BRU={nome:'Bruxa do Pântano',nivel:4,
  DEF:{hx:20,hy:34,lean:16*D,aF:50*D,aF2:-90*D,aB:80*D,aB2:-40*D,ht:0,mo:0,hat:0,orb:.5,gl:0,cur:0,al:1,fumo:0,derrete:0,dead:0,sw:0,ph:0,rot:0,px:20,py:GY,cajado:-88*D},
  molas:['hat'],
  draw(pen,p){const R=['#2a1438','#4a2460','#6a3a80'],PE=['#4a7a34','#6a9a4a','#8aba6a'],VER=['#2a6a2a','#6ad04a','#d0ffa0'],ROX=['#4a1a6a','#a050e0','#f0c0ff'];
    const d=p.derrete,hip=[p.hx,lerp(p.hy,GY-1,d)],neck=P(hip,-PI/2+p.lean,lerp(9,2,d));
    // fumaça (aparecer/derreter)
    if(p.fumo>0){for(let i=0;i<7;i++){const t=(p.fumo+i/7)%1,x=p.hx-6+i*2.2+Math.sin(t*6+i)*2,y=GY-2-t*20,r=(1.2+t*1.6)*(1-t*.5);pen.ell(x,y,r,r,i%2?'#3a5a2e':'#5a7a4a');pen.px(x-.5,y-.5,'#7a9a6a')}}
    // círculo de cura
    if(p.cur>0){for(let i=0;i<10;i++){const a=p.ph*.5+i*PI/5,r=8+Math.sin(p.ph+i)*1.5,x=p.hx+Math.cos(a)*r,y=GY-10+Math.sin(a)*r*.45-p.cur*4;pen.px(x,y,i%2?VER[1]:VER[2])}}
    // braço de trás
    const sb=[neck[0]-1.5,neck[1]+1.5],eb=P(sb,p.aB,4),hb=P(eb,p.aB+p.aB2,3.5);if(d<.6){pen.line(sb[0],sb[1],eb[0],eb[1],R[0],2);pen.line(eb[0],eb[1],hb[0],hb[1],PE[0])}
    // cabelo grisalho caindo atrás
    const h=[neck[0]+2+p.ht*.4,neck[1]-3.2+d*1.5];
    if(d<.8){for(let i=0;i<4;i++)pen.line(h[0]-2-i*.6,h[1]-1,h[0]-4-i*.9+Math.sin(p.ph*.5+i)*.4,h[1]+5+i*.4,i%2?'#9a9a8a':'#c8c8b8')}
    // manto
    const w1=6.5+p.sw*.4,pts=[[neck[0]-3,neck[1]],[neck[0]+3,neck[1]+.5],[hip[0]+4,hip[1]],[hip[0]+w1+p.sw,GY]];for(let i=0;i<=6;i++){const t=i/6;pts.push([lerp(hip[0]+w1+p.sw,hip[0]-w1-1,t),GY-(i%2?1.6:0)])}pts.push([hip[0]-4,hip[1]]);
    pen.poly(pts,R[1]);pen.line(neck[0]+3,neck[1]+.5,hip[0]+w1+p.sw,GY,R[2]);pen.line(hip[0]-3,hip[1]+1,hip[0]+4,hip[1]+1,'#1a0a20');pen.px(hip[0]+1,hip[1]+1,'#b8902e');
    // rosto verde: nariz curvo, queixo, verruga
    if(d<.85){pen.bola(h[0],h[1],3.2,3,PE);pen.poly([[h[0]+2,h[1]-1.4],[h[0]+6,h[1]+1.6],[h[0]+4.6,h[1]+2],[h[0]+2.2,h[1]+.8]],PE[1]);pen.px(h[0]+3.5,h[1]-.6,'#3a5a24');
      pen.poly([[h[0]+.5,h[1]+2],[h[0]+3.5,h[1]+4.4],[h[0]+1,h[1]+3.4]],PE[1]);
      if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.3),Math.round(h[1]-.6),'#1a2a10');else{pen.px(h[0]+1,h[1]-.6,'#ffe27a');pen.px(h[0]+2,h[1]-.6,'#1a1a10')}
      if(p.mo>.2){pen.line(h[0]+1,h[1]+2,h[0]+3.5,h[1]+2.4+p.mo,'#2a0a10');pen.px(h[0]+2,h[1]+2.4,'#f2ead8')}else pen.line(h[0]+1,h[1]+2,h[0]+3,h[1]+2.2,'#2a3a18')}
    // chapéu pontudo (aba larga + cone que dobra para trás)
    const hb0=[h[0]-.5,lerp(h[1]-2.6,GY-3,d*d)],inc=p.ht*.15-.08+p.hat*.05;
    const A=P(hb0,PI+inc,7),B=P(hb0,inc,7);pen.line(A[0],A[1],B[0],B[1],R[0],2);
    const c1=P(hb0,-PI/2+inc-.1,5),tip=P(c1,-PI/2+inc-.9-p.hat*.15,5.5);pen.poly([P(hb0,PI+inc,3.5),c1,tip,P(c1,inc,1.2),P(hb0,inc,3)],R[1]);pen.line(c1[0],c1[1],tip[0],tip[1],R[2]);
    pen.line(P(hb0,PI+inc,3.2)[0],P(hb0,PI+inc,3.2)[1]-1,P(hb0,inc,3)[0],P(hb0,inc,3)[1]-1,'#6a1a2a');
    // cajado retorcido com a esfera
    const sf=[neck[0]+1.5,neck[1]+1.5],ef=P(sf,p.aF,4),hf=P(ef,p.aF+p.aF2,3.5);
    if(d<.6){const ca=p.cajado,a0=P(hf,ca+PI,10),a1=P(hf,ca,11);pen.line(a0[0],a0[1],a1[0],a1[1],'#5c3a1e');pen.px(lerp(a0[0],a1[0],.3)+1,lerp(a0[1],a1[1],.3),'#7e5430');
      const orb=P(a1,ca,1.5),r=1.5+p.orb*1.2;pen.line(a1[0],a1[1],a1[0]-2,a1[1]-1.5,'#5c3a1e');pen.ell(orb[0],orb[1],r+.8,r+.8,p.gl>0?ROX[0]:VER[0]);pen.ell(orb[0],orb[1],r,r,p.gl>0?ROX[1]:VER[1]);pen.px(orb[0]-.5,orb[1]-.5,p.gl>0?ROX[2]:VER[2]);pen.info.boca=orb}
    else pen.line(hip[0]+2,GY,hip[0]+16,GY-1,'#5c3a1e');
    if(d<.6){pen.line(sf[0],sf[1],ef[0],ef[1],R[1],2);pen.line(ef[0],ef[1],hf[0],hf[1],PE[1]);pen.px(hf[0],hf[1],PE[2])}
    // runas da maldição flutuando
    if(p.gl>0){for(let i=0;i<4;i++){const a=p.ph*.4+i*PI/2,x=p.hx+10+Math.cos(a)*6*p.gl,y=neck[1]-6+Math.sin(a)*3*p.gl;pen.px(x,y,ROX[2]);pen.px(x+1,y,ROX[1]);pen.px(x,y+1,ROX[1]);pen.px(x-1,y-1,ROX[1])}}},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>({sw:sw(f,n,1),ph:f,hy:34+(sw(f,n,2)>.6?1:0),ht:sw(f,n,1,1)*.5,orb:.5+sw(f,n,2)*.4,mo:f>=10&&f<=12?.6:0,cajado:(-88+sw(f,n,1)*3)*D})},
   entrada:{nome:'Entrada',n:22,fps:12,f:null},
   ataque:{nome:'Feitiço Sangrento',n:18,fps:13,hits:[10],tiro:'sangue',f:null},
   especial:{nome:'Maldição',n:20,fps:12,f:null},
   buff:{nome:'Cura Sombria',n:20,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:22,fps:12,f:null}}};
const bp=f=>o=>({...o,ph:f});
BRU.A.entrada.f=f=>bp(f)(kf(BRU.DEF,[[0,{al:0,fumo:.01,mo:0}],[5,{al:0,fumo:.3}],[10,{e:'devagar',al:1,fumo:.6,ht:-1,mo:1,hat:3}],[12,{al:1,fumo:.75,ht:-1,mo:.3,hat:-2}],[14,{al:1,fumo:.85,ht:-1,mo:1}],[16,{al:1,fumo:.95,ht:-1,mo:.3}],[22,{e:'devagar',fumo:0}]])(f));
BRU.A.ataque.f=f=>bp(f)(kf(BRU.DEF,[[0,{}],[5,{e:'devagar',hx:18,lean:4*D,aF:-60*D,aF2:-40*D,cajado:-130*D,orb:1.5,ht:-.5,mo:.6}],[8,{e:'segura',hx:18,lean:4*D,aF:-60*D,aF2:-40*D,cajado:-130*D,orb:2,mo:.8}],[10,{e:'rapido',hx:23,lean:26*D,aF:-10*D,aF2:-10*D,cajado:-20*D,orb:1,mo:1,sw:2}],[12,{e:'segura',hx:23,lean:26*D,aF:-10*D,aF2:-10*D,cajado:-20*D,orb:.6}],[18,{e:'devagar'}]])(f));
BRU.A.especial.f=f=>bp(f)(kf(BRU.DEF,[[0,{}],[5,{e:'devagar',lean:0,aB:-100*D,aB2:-30*D,aF:-60*D,aF2:-50*D,cajado:-100*D,ht:-1,mo:1,gl:.3}],[10,{lean:-4*D,aB:-110*D,aB2:-30*D,aF:-70*D,aF2:-50*D,cajado:-100*D,ht:-1,mo:.4,gl:1,hat:2}],[15,{e:'segura',lean:-4*D,aB:-110*D,aB2:-30*D,aF:-70*D,aF2:-50*D,cajado:-100*D,ht:-1,mo:1,gl:1.2}],[20,{e:'devagar',gl:0}]])(f));
BRU.A.buff.f=f=>bp(f)(kf(BRU.DEF,[[0,{}],[5,{e:'devagar',lean:6*D,aF:-80*D,aF2:-20*D,cajado:-95*D,orb:1.6,cur:.4,ht:-.6}],[12,{lean:6*D,aF:-85*D,aF2:-20*D,cajado:-95*D,orb:2,cur:1,ht:-.6,mo:.6}],[16,{e:'segura',lean:6*D,aF:-85*D,aF2:-20*D,cajado:-95*D,orb:2,cur:1,ht:-.6}],[20,{e:'devagar',cur:0}]])(f));
BRU.A.ferido.f=f=>bp(f)(kf(BRU.DEF,[[0,{}],[1,{e:'rapido',hx:17,lean:-10*D,ht:-1.2,mo:1,hat:-4,sw:-2,cajado:-60*D}],[3,{hx:17,lean:4*D,hat:2,sw:-1}],[8,{}]])(f));
BRU.A.morte.f=f=>bp(f)(kf(BRU.DEF,[[0,{}],[2,{e:'rapido',hx:17,lean:-10*D,ht:-1.2,mo:1.2,hat:-4,cajado:-60*D}],[6,{hx:18,lean:20*D,mo:1.2,ht:1,dead:1,fumo:.1}],[16,{e:'devagar',hx:18,lean:20*D,derrete:1,dead:1,fumo:.6}],[22,{e:'linear',hx:18,lean:20*D,derrete:1,dead:1,fumo:1}]])(f));

/* =====================================================================================
   CARRASCO
   ===================================================================================== */
const CAR_O={tronco:11,perna:5.5,braco:5};
const CRR={nome:'Carrasco',nivel:4,
  DEF:{hx:20,hy:33,lean:4*D,fF:[25,GY],fB:[15,GY],aF:75*D,aF2:-30*D,aB:95*D,aB2:-10*D,ax:-80*D,wh:95*D,lag:0,ph:0,ht:0,tr:0,brilho:0,andar:0,passo:0,pz:0,rc:0,dead:0,rot:0,px:20,py:GY,sh:0},
  draw(pen,p){const S=['#8a5a3a','#b07a50','#d09a6a'],H=['#141418','#24242c','#3a3a46'],CA=['#2a2018','#4a3828'],FE=['#6a7080','#c8d0dc'];
    const B=humano(pen,p,CAR_O);
    // corrente no braço de trás
    const bb=B.braco(B.shB,p.aB,p.aB2,S[0],S[0]);let q=bb.h;for(let i=1;i<=9;i++){const t=i/9,a=p.wh+p.lag*Math.pow(t,1.3)+Math.sin(t*4-p.ph*.8)*.1,n=P(q,a,2);pen.px(n[0],n[1],i%2?FE[0]:FE[1]);pen.px((q[0]+n[0])/2,(q[1]+n[1])/2,FE[0]);q=n}
    B.perna([B.hip[0]-1.5,B.hip[1]],B.fB,CA[0],'#140e0a');
    // tronco forte, barriga, cinto e calça
    const n=B.neck,h0=B.hip;pen.poly([[n[0]-5,n[1]],[n[0]+4.5,n[1]+.5],[h0[0]+4,h0[1]],[h0[0]-4,h0[1]]],S[1]);pen.ell(h0[0]+1.5,h0[1]-3,3.5,3,S[1]);pen.line(n[0]+4.5,n[1]+.5,h0[0]+4.5,h0[1]-2,S[2]);
    const m=P(n,PI/2+p.lean,3);pen.ell(m[0]+1.5,m[1]-.5,2.6,1.6,S[2]);pen.line(m[0]-3,m[1]+1,m[0]+4,m[1]+1.5,S[0]);for(let i=0;i<2;i++){pen.px(m[0]+1,m[1]+3+i*2,S[0]);pen.px(m[0]+2.5,m[1]+3+i*2,S[0])}pen.line(n[0]-5,n[1],h0[0]-4,h0[1],S[0]);
    pen.poly([[h0[0]-4.5,h0[1]-1],[h0[0]+4.5,h0[1]-1],[h0[0]+4.5,h0[1]+3],[h0[0]-4.5,h0[1]+3]],CA[1]);pen.line(h0[0]-4.5,h0[1]-1,h0[0]+4.5,h0[1]-1,'#1a120c',2);pen.px(h0[0]+1,h0[1]-1,'#b8902e');
    B.perna([B.hip[0]+1.5,B.hip[1]],B.fF,CA[1],'#140e0a');
    // capuz pontudo preto
    const h=[n[0]+1.5+p.ht*.4,n[1]-3.5];pen.bola(h[0],h[1],3.8,3.6,H);pen.poly([[h[0]-3,h[1]-2],[h[0]-2,h[1]-8],[h[0]+1.5,h[1]-3]],H[1]);pen.line(h[0]-3.8,h[1]+3,h[0]+3.8,h[1]+3,H[0],2);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.5),Math.round(h[1]-.4),'#5a5a66');else{pen.px(h[0]+1,h[1]-.5,'#e8e0c8');pen.px(h[0]+2.5,h[1]-.5,'#e8e0c8');pen.px(h[0]+2.5,h[1]-.5,p.brilho>0?'#ff3a2a':'#e8e0c8')}
    // machado na mão da frente
    const fb=B.braco(B.shF,p.aF,p.aF2,S[1],S[1]);if(p.tr)arco(pen,fb.h,p.tr,p.ax,8,15);
    const lam=machado(pen,fb.h,p.ax,13,6,['#8a92a0','#e8eef6']);
    if(p.brilho>0){pen.px(lam[0]+1,lam[1]-2,'#ffffff');pen.px(lam[0],lam[1]-3,'#ffffff');pen.px(lam[0]+2,lam[1]-3,'#ffffff');pen.px(lam[0]+1,lam[1]-4,'#ffffff')}
    pen.px(fb.h[0],fb.h[1],S[2]);
    poeira(pen,p.hx+8,GY,p.pz);racha(pen,p.hx+12,p.rc)},
  A:{
   parado:{n:16,fps:8,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:33+(b>.6?1:0),ph:f,lean:(4+b*2)*D,ax:(-80+b*4)*D,ht:sw(f,n,1,1)>.8?.6:0}}},
   entrada:{nome:'Entrada',n:24,fps:12,f:null},
   ataque:{nome:'Machadada',n:18,fps:13,hits:[9],f:null},
   especial:{nome:'Corrente',n:20,fps:14,hits:[7,13],f:null},
   defesa:{nome:'Erguer o Machado',n:16,fps:11,f:null},
   especial2:{nome:'Decapitar',n:26,fps:14,hits:[15],f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:22,fps:12,f:null}}};
const rp=f=>o=>({...o,ph:f});
CRR.A.entrada.f=f=>rp(f)(kf(CRR.DEF,[[0,{hx:-6,andar:1,passo:0,ax:160*D,aF:110*D,aF2:0,lean:10*D}],[10,{e:'linear',hx:18,andar:1,passo:PI*4,ax:160*D,aF:110*D,aF2:0,lean:10*D}],[11,{hx:19,andar:0,ax:150*D,aF:100*D,aF2:0}],
  [14,{e:'devagar',hx:19,lean:-8*D,ax:-170*D,aF:-150*D,aF2:-10*D,fF:[24,GY],fB:[14,GY]}],[15,{e:'segura',hx:19,lean:-8*D,ax:-170*D,aF:-150*D,aF2:-10*D,fF:[24,GY],fB:[14,GY]}],[16,{e:'rapido',hx:21,lean:22*D,ax:60*D,aF:40*D,aF2:10*D,tr:-170*D,fF:[26,GY],fB:[15,GY]}],
  [17,{hx:21,lean:22*D,ax:70*D,aF:45*D,aF2:10*D,pz:.2,rc:1,fF:[26,GY],fB:[15,GY]}],[20,{e:'segura',hx:21,lean:22*D,ax:70*D,aF:45*D,aF2:10*D,pz:.9,rc:1,fF:[26,GY],fB:[15,GY]}],[24,{e:'devagar',rc:0}]])(f));
CRR.A.ataque.f=f=>rp(f)(kf(CRR.DEF,[[0,{}],[5,{e:'devagar',hx:18,lean:-10*D,ax:-190*D,aF:-150*D,aF2:-15*D,fF:[24,GY],fB:[13,GY],ht:-.6}],[7,{e:'segura',hx:18,lean:-10*D,ax:-190*D,aF:-150*D,aF2:-15*D,fF:[24,GY],fB:[13,GY]}],
  [8,{e:'rapido',hx:24,lean:20*D,ax:-60*D,aF:-50*D,aF2:-10*D,tr:-190*D,fF:[31,GY],fB:[17,GY]}],[9,{e:'rapido',hx:25,hy:34,lean:26*D,ax:40*D,aF:30*D,aF2:10*D,tr:-120*D,fF:[31,GY],fB:[17,GY],pz:.15}],[12,{e:'segura',hx:25,hy:34,lean:26*D,ax:40*D,aF:30*D,aF2:10*D,fF:[31,GY],fB:[17,GY],pz:.8}],[18,{e:'devagar'}]])(f));
CRR.A.especial.f=f=>rp(f)(kf(CRR.DEF,[[0,{}],[4,{e:'devagar',aB:-130*D,aB2:-20*D,wh:-160*D,lag:70*D,lean:-6*D}],[6,{e:'rapido',aB:-40*D,aB2:0,wh:-60*D,lag:90*D,lean:10*D}],[7,{e:'rapido',aB:10*D,aB2:0,wh:0,lag:-20*D,lean:14*D}],[9,{aB:30*D,wh:30*D,lag:-10*D}],
  [11,{e:'devagar',aB:-130*D,aB2:-20*D,wh:-160*D,lag:70*D,lean:-6*D}],[12,{e:'rapido',aB:-40*D,aB2:0,wh:-60*D,lag:90*D,lean:10*D}],[13,{e:'rapido',aB:10*D,aB2:0,wh:0,lag:-20*D,lean:14*D}],[15,{aB:30*D,wh:30*D,lag:-10*D}],[20,{e:'devagar'}]])(f));
CRR.A.defesa.f=f=>rp(f)(kf(CRR.DEF,[[0,{}],[6,{e:'devagar',hx:19,lean:-6*D,ax:-120*D,aF:-140*D,aF2:-30*D,ht:-.8,fF:[25,GY],fB:[13,GY]}],[8,{hx:19,lean:-6*D,ax:-120*D,aF:-140*D,aF2:-30*D,ht:-.8,fF:[25,GY],fB:[13,GY],brilho:1}],[13,{e:'segura',hx:19,lean:-6*D,ax:-120*D,aF:-140*D,aF2:-30*D,ht:-.8,fF:[25,GY],fB:[13,GY],brilho:1}],[16,{e:'devagar',brilho:0}]])(f));
CRR.A.especial2.f=f=>rp(f)(kf(CRR.DEF,[[0,{}],[5,{e:'devagar',hx:17,hy:36,lean:-16*D,ax:-200*D,aF:-160*D,aF2:-10*D,fF:[23,GY],fB:[12,GY],ht:-1,brilho:1}],[9,{e:'segura',hx:17,hy:36,lean:-16*D,ax:-210*D,aF:-165*D,aF2:-10*D,fF:[23,GY],fB:[12,GY],ht:-1,brilho:1}],
  [12,{e:'devagar',hx:22,hy:26,lean:-6*D,ax:-220*D,aF:-170*D,aF2:-10*D,fF:[26,GY-8],fB:[17,GY-7],brilho:1}],[14,{e:'rapido',hx:26,hy:30,lean:20*D,ax:-90*D,aF:-60*D,aF2:0,tr:-220*D,fF:[30,GY-4],fB:[21,GY-3]}],
  [15,{e:'rapido',hx:27,hy:35,lean:34*D,ax:60*D,aF:40*D,aF2:10*D,tr:-140*D,fF:[33,GY],fB:[19,GY],pz:.1,rc:1}],[19,{e:'segura',hx:27,hy:35,lean:34*D,ax:60*D,aF:40*D,aF2:10*D,fF:[33,GY],fB:[19,GY],pz:.8,rc:1}],[26,{e:'devagar',rc:0}]])(f));
CRR.A.ferido.f=f=>rp(f)(kf(CRR.DEF,[[0,{}],[1,{e:'rapido',hx:17,lean:-12*D,ht:-1,ax:-50*D,fF:[23,GY],fB:[13,GY]}],[3,{hx:17,lean:-4*D,ht:-.5,fF:[23,GY],fB:[13,GY]}],[8,{}]])(f));
CRR.A.morte.f=f=>rp(f)(kf(CRR.DEF,[[0,{}],[2,{e:'rapido',hx:17,lean:-12*D,ht:-1,ax:-40*D,fF:[23,GY],fB:[13,GY]}],[7,{e:'devagar',hx:19,hy:39,lean:10*D,ht:1,ax:20*D,aF:80*D,fF:[26,GY],fB:[13,GY],px:31,py:GY-1}],
  [12,{e:'rapido',hx:19,hy:39,lean:10*D,ht:1,ax:10*D,aF:90*D,fF:[26,GY],fB:[13,GY],rot:PI/2,px:31,py:GY-1,dead:1,pz:.1}],[14,{hx:19,hy:39,lean:10*D,ax:10*D,aF:90*D,fF:[26,GY],fB:[13,GY],rot:PI/2*.95,px:31,py:GY-1,dead:1,pz:.6}],[16,{hx:19,hy:39,lean:10*D,ax:10*D,aF:90*D,fF:[26,GY],fB:[13,GY],rot:PI/2,px:31,py:GY-1,dead:1,pz:.95}],[22,{hx:19,hy:39,lean:10*D,ax:10*D,aF:90*D,fF:[26,GY],fB:[13,GY],rot:PI/2,px:31,py:GY-1,dead:1}]])(f));

/* =====================================================================================
   MÍMICO — começa como um baú normal
   ===================================================================================== */
const MIM={nome:'Mímico',nivel:4,
  DEF:{bx:0,by:0,tampa:.25,pernas:1,lingua:0,olho:1,ouro:0,sq:0,dentes:1,brilho:0,dead:0,rot:0,px:22,py:GY,tr:0,ph:0,inch:0},
  draw(pen,p){const M=['#4a2e1a','#6a4428','#8a5a36'],F=['#6a7080','#a7b3c7','#e8eef6'],O=['#7a5a1a','#b8902e','#ffe27a'];
    const w=16*(1+p.inch*.12),h=8*(1-p.sq*.3)*(1+p.inch*.15),x0=22+p.bx-w/2,lift=p.pernas*3,base=GY-lift+p.by,top=base-h;
    // perninhas com garras
    if(p.pernas>0)for(const [ox,c] of [[2,M[0]],[w-4,M[0]],[4,M[1]],[w-2,M[1]]]){const k=Math.sin(p.ph*1.3+ox)*.8;pen.line(x0+ox,base,x0+ox-1+k,GY,c,2);pen.px(x0+ox+1+k,GY,'#e8e0c8')}
    // tampa (gira na dobradiça de trás)
    const ang=-p.tampa*1.6,hg=[x0,top];const tp=(dx,dy)=>[hg[0]+dx*Math.cos(ang)-dy*Math.sin(ang),hg[1]+dx*Math.sin(ang)+dy*Math.cos(ang)];
    // boca por dentro
    if(p.tampa>.05){pen.poly([hg,tp(w,0),[x0+w,top+1],[x0,top+1]],'#3a0a10');pen.poly([tp(2,0),tp(w-1,0),[x0+w-1,top+1.5],[x0+2,top+1.5]],'#5a1420');
      if(p.olho>0&&p.dead<.5){const e1=[lerp(hg[0],tp(w,0)[0],.55),lerp(top,tp(w,0)[1],.45)+.5];pen.px(e1[0],e1[1],'#ffe27a');pen.px(e1[0]+3,e1[1]+.6,'#ffe27a');pen.px(e1[0]+.5,e1[1],'#1a0a00')}
      if(p.dead>.5){const e1=[lerp(hg[0],tp(w,0)[0],.55),lerp(top,tp(w,0)[1],.45)+.5];olhoX(pen,Math.round(e1[0]),Math.round(e1[1]),'#ffe27a')}
      if(p.ouro>0){for(let i=0;i<3;i++)pen.ell(x0+5+i*3,top-.5,1.2,.8,O[1])}}
    // língua
    if(p.lingua>0){const s=[x0+w-2,top+.5],L=p.lingua*26,e=[s[0]+L,s[1]-Math.sin(p.lingua*PI)*4+p.lingua*3];let q=s;for(let i=1;i<=10;i++){const t=i/10,n=[lerp(s[0],e[0],t),lerp(s[1],e[1],t)-Math.sin(t*PI)*2];pen.line(q[0],q[1],n[0],n[1],'#c04a6a',2);q=n}pen.ell(e[0],e[1],2,1.6,'#e06a8a');pen.px(e[0],e[1]-1,'#ffb0c0')}
    // caixa
    pen.poly([[x0,top],[x0+w,top],[x0+w,base],[x0,base]],M[1]);pen.line(x0+w,top,x0+w,base,M[2]);pen.line(x0,base,x0+w,base,M[0]);
    for(const t of [.22,.78])pen.line(x0+w*t,top,x0+w*t,base,F[1]);pen.line(x0,top,x0+w,top,F[0]);
    if(p.dentes>0&&p.tampa>.05)for(let i=1;i<w-1;i+=2.4){pen.px(x0+i,top-1,F[2]);pen.px(x0+i+.6,top-2,'#f2ead8')}
    // tampa por cima
    const lid=[tp(0,0),tp(w,0),tp(w,-4),tp(w*.5,-5),tp(0,-4)];pen.poly(lid,M[2]);pen.line(lid[0][0],lid[0][1],lid[4][0],lid[4][1],M[1]);
    const b1=tp(w*.22,0),b2=tp(w*.22,-4.6),b3=tp(w*.78,0),b4=tp(w*.78,-4.6);pen.line(b1[0],b1[1],b2[0],b2[1],F[1]);pen.line(b3[0],b3[1],b4[0],b4[1],F[1]);
    if(p.dentes>0&&p.tampa>.05)for(let i=1;i<w-1;i+=2.4){const t=tp(i,0),t2=tp(i+.6,1.4);pen.px(t[0],t[1]+.5,F[2]);pen.px(t2[0],t2[1],'#f2ead8')}
    // fechadura dourada
    const lk=tp(w*.5,.5);pen.ell(lk[0],lk[1]+1.5,1.5,1.6,O[1]);pen.px(lk[0],lk[1]+1.6,'#2a1a0a');
    if(p.brilho>0){const s=Math.floor(p.ph)%4;pen.px(x0+3+s*3,top-6,O[2]);pen.px(x0+3+s*3,top-7,'#fff');pen.px(x0+2+s*3,top-6,O[2]);pen.px(x0+4+s*3,top-6,O[2])}
    if(p.ouro<0){for(let i=0;i<6;i++){const t=-p.ouro;pen.ell(x0+w+2+i*2.2*t,GY-1-Math.sin(i)*t,1.1,.8,O[1])}}
    pen.info.boca=[x0+w+2,top]},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({ph:f,tampa:.25+sw(f,n,2)*.08,by:sw(f,n,2)>.5?-.5:0,olho:f===11?0:1,inch:sw(f,n,1)*.08})},
   entrada:{nome:'Entrada (disfarce)',n:28,fps:12,f:null},
   ataque:{nome:'Mordida Voraz',n:18,fps:14,hits:[9],f:null},
   especial:{nome:'Língua Pegajosa',n:20,fps:14,hits:[8],f:null},
   buff:{nome:'Engolir Ouro',n:22,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
const mp=f=>o=>({...o,ph:f});
MIM.A.entrada.f=f=>mp(f)(kf(MIM.DEF,[[0,{tampa:0,pernas:0,dentes:0,olho:0,brilho:1}],[12,{e:'linear',tampa:0,pernas:0,dentes:0,olho:0,brilho:1}],[14,{tampa:.06,pernas:0,dentes:0,olho:0,bx:.5}],[15,{tampa:0,pernas:0,dentes:0,bx:-.5}],[16,{tampa:.06,pernas:0,dentes:0,bx:.5}],[17,{tampa:0,pernas:0,dentes:0,bx:0}],
  [20,{e:'rapido',tampa:1,pernas:1,dentes:1,olho:1,by:-3,sq:-.1}],[22,{tampa:.9,pernas:1,by:0,sq:.15}],[25,{e:'segura',tampa:.85,pernas:1}],[28,{e:'devagar'}]])(f));
MIM.A.ataque.f=f=>mp(f)(kf(MIM.DEF,[[0,{}],[4,{e:'devagar',bx:-2,sq:.25,tampa:.4}],[7,{e:'rapido',bx:8,by:-6,tampa:1.1,sq:-.15}],[9,{e:'rapido',bx:11,by:0,tampa:0,sq:.2}],[10,{bx:11,tampa:.3}],[11,{bx:11,tampa:0}],[13,{e:'segura',bx:11,tampa:.2}],[18,{e:'devagar'}]])(f));
MIM.A.especial.f=f=>mp(f)(kf(MIM.DEF,[[0,{}],[4,{e:'devagar',tampa:.9,sq:-.1}],[7,{e:'rapido',tampa:1,lingua:.8}],[8,{tampa:1,lingua:1}],[12,{e:'segura',tampa:1,lingua:1,bx:2}],[15,{e:'rapido',tampa:.8,lingua:0,bx:2}],[17,{tampa:0,bx:1}],[20,{e:'devagar'}]])(f));
MIM.A.buff.f=f=>mp(f)(kf(MIM.DEF,[[0,{}],[4,{e:'devagar',tampa:1.1,ouro:.01}],[8,{tampa:1.1,ouro:1}],[10,{e:'rapido',tampa:0,ouro:0,sq:.2}],[12,{tampa:0,inch:1,sq:-.1,by:-1}],[14,{tampa:0,inch:.8,sq:.1}],[16,{tampa:0,inch:1,brilho:1}],[19,{e:'segura',tampa:.2,inch:1,brilho:1}],[22,{e:'devagar',inch:.4,brilho:0}]])(f));
MIM.A.ferido.f=f=>mp(f)(kf(MIM.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-3,tampa:0,sq:-.1,olho:0}],[2,{bx:-4,by:0,tampa:.6,sq:.2}],[3,{bx:-3,tampa:0}],[5,{bx:-2,tampa:.4}],[8,{}]])(f));
MIM.A.morte.f=f=>mp(f)(kf(MIM.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-4,tampa:0,olho:0}],[5,{bx:-3,by:0,tampa:1.4,lingua:.2,sq:.2}],[9,{e:'devagar',bx:-3,pernas:0,tampa:1.9,lingua:.35,dead:1,ouro:-.3}],[14,{bx:-3,pernas:0,tampa:2,lingua:.35,dead:1,ouro:-1}],[20,{bx:-3,pernas:0,tampa:2,lingua:.35,dead:1,ouro:-1}]])(f));

/* =====================================================================================
   ORC BERSERKER — dois machados, entra pulando
   ===================================================================================== */
const ORC_O={tronco:11,perna:5.5,braco:5};
const ORC={nome:'Orc Berserker',nivel:4,
  DEF:{hx:20,hy:33,lean:8*D,fF:[25,GY],fB:[15,GY],aF:60*D,aF2:-50*D,aB:70*D,aB2:-60*D,axF:-70*D,axB:-80*D,mo:0,ht:0,raiva:0,vapor:0,pz:0,rc:0,trF:0,trB:0,dead:0,rot:0,px:20,py:GY,sh:0,ph:0},
  draw(pen,p){const r=p.raiva,G=['#2e5a1e','#4e7e32','#72a050'],CO=['#3a2414','#5c3a1e'];
    const B=humano(pen,p,ORC_O);
    const bb=B.braco(B.shB,p.aB,p.aB2,G[0],G[0]);if(p.trB)arco(pen,bb.h,p.trB,p.axB,6,11);machado(pen,bb.h,p.axB,9,4,['#6a7080','#c8d0dc']);
    B.perna([B.hip[0]-1.5,B.hip[1]],B.fB,G[0],'#2a1a0e');
    const n=B.neck,h0=B.hip;pen.poly([[n[0]-5.5,n[1]],[n[0]+5,n[1]+.5],[h0[0]+4,h0[1]],[h0[0]-4,h0[1]]],G[1]);pen.line(n[0]+5,n[1]+.5,h0[0]+4,h0[1],G[2]);
    const m=P(n,PI/2+p.lean,3.5);pen.line(m[0]-3,m[1],m[0]+3.5,m[1]+.5,G[0]);pen.line(m[0],m[1]+1,m[0],m[1]+4,G[0]);
    // tanga e cinto com ombreira
    pen.poly([[h0[0]-4.5,h0[1]-1],[h0[0]+4.5,h0[1]-1],[h0[0]+3.5,h0[1]+4],[h0[0]+.5,h0[1]+2.5],[h0[0]-2,h0[1]+4],[h0[0]-4.5,h0[1]+2]],CO[1]);pen.line(h0[0]-4.5,h0[1]-1,h0[0]+4.5,h0[1]-1,CO[0],2);pen.px(h0[0],h0[1]-1,'#a7b3c7');
    if(r>.3){for(let i=0;i<3;i++){const q=P(n,PI/2+p.lean,2+i*2.5);pen.px(q[0]-2+i,q[1],'#c03a2a');pen.px(q[0]-1+i,q[1]+1,'#c03a2a')}}
    pen.ell(n[0]-3.5,n[1]+1.5,2.5,2,'#6a7080');pen.px(n[0]-4,n[1]+.5,'#c8d0dc');pen.px(n[0]-3,n[1]-1,'#c8d0dc');
    B.perna([B.hip[0]+1.5,B.hip[1]],B.fF,G[1],'#2a1a0e');
    // cabeça: moicano, presas, olhos
    const h=[n[0]+1.8+p.ht*.4,n[1]-3.6];pen.bola(h[0],h[1],4,3.6,G);
    for(let i=0;i<5;i++)pen.line(h[0]-3+i*1.3,h[1]-3,h[0]-4+i*1.3-p.ht*.3,h[1]-6-(i===2?1:0),'#1a1210');
    pen.poly([[h[0]+2,h[1]-.6],[h[0]+5,h[1]+.8],[h[0]+2.5,h[1]+1.6]],G[1]);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.5),Math.round(h[1]-1),'#1a1a0a');else{pen.px(h[0]+1,h[1]-1,r>.3?'#ff2a1a':'#ffcf3a');pen.px(h[0]+2,h[1]-1,r>.3?'#ff2a1a':'#ffcf3a');pen.line(h[0]+.5,h[1]-2,h[0]+2.5,h[1]-1.5,'#1a1210')}
    const my=h[1]+2.2;if(p.mo>.2)pen.ell(h[0]+2,my+.5,1.8,.6+p.mo*1.4,'#2a0808');pen.line(h[0]+.5,my+.8,h[0]+.5,my-1.2,'#f2ead8');pen.line(h[0]+3.2,my+.8,h[0]+3.2,my-1.2,'#f2ead8');
    if(p.vapor>0){pen.st.a=.8;for(let i=0;i<3;i++){const t=(p.vapor+i/3)%1;pen.ell(h[0]+5+t*4,h[1]+.5-t*4,.8+t,.8+t,'#d8d0c8')}pen.st.a=1}
    const fb=B.braco(B.shF,p.aF,p.aF2,G[1],G[1]);if(p.trF)arco(pen,fb.h,p.trF,p.axF,6,11);machado(pen,fb.h,p.axF,9,4,['#8a92a0','#e8eef6']);pen.px(fb.h[0],fb.h[1],G[2]);
    poeira(pen,p.hx+2,GY,p.pz);racha(pen,p.hx+9,p.rc)},
  A:{
   parado:{n:12,fps:10,loop:1,f:(f,n)=>{const b=Math.abs(sw(f,n,1));return{hy:33+Math.round(b),ph:f,lean:(8+b*3)*D,axF:(-70+b*6)*D,axB:(-80+b*6)*D,mo:.3+b*.3}}},
   entrada:{nome:'Entrada',n:22,fps:13,f:null},
   ataque:{nome:'Machado Duplo',n:18,fps:14,hits:[6,11],f:null},
   especial:{nome:'Esmagar',n:20,fps:13,hits:[11],f:null},
   buff:{nome:'Urro',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
const op=f=>o=>({...o,ph:f});
ORC.A.entrada.f=f=>op(f)(kf(ORC.DEF,[[0,{hx:-6,hy:14,lean:-4*D,fF:[-2,GY-28],fB:[-9,GY-27],aF:-120*D,aB:-110*D,axF:-160*D,axB:-170*D}],[6,{e:'rapido',hx:19,hy:38,lean:24*D,fF:[25,GY],fB:[13,GY],aF:30*D,aB:40*D,axF:20*D,axB:10*D,pz:.1}],[7,{hx:19,hy:39,lean:26*D,fF:[25,GY],fB:[13,GY],aF:30*D,aB:40*D,axF:20*D,axB:10*D,pz:.4,rc:1}],
  [10,{e:'devagar',hx:19,hy:35,lean:-10*D,ht:-1.5,mo:1.5,aF:-110*D,aB:-100*D,axF:-150*D,axB:-160*D,pz:.95,rc:1,raiva:1}],[11,{sh:1,hx:19,hy:35,lean:-10*D,ht:-1.5,mo:1.5,aF:-110*D,aB:-100*D,axF:-150*D,axB:-160*D,raiva:1,rc:1}],[12,{sh:-1,hx:19,hy:35,lean:-10*D,ht:-1.5,mo:1.5,aF:-110*D,aB:-100*D,axF:-150*D,axB:-160*D,raiva:1,rc:1}],[13,{sh:1,hx:19,hy:35,lean:-10*D,ht:-1.5,mo:1.5,aF:-110*D,aB:-100*D,axF:-150*D,axB:-160*D,raiva:1,rc:1}],[16,{e:'segura',sh:0,hx:19,hy:35,lean:-10*D,ht:-1.5,mo:1.4,aF:-110*D,aB:-100*D,axF:-150*D,axB:-160*D,raiva:1,rc:1}],[22,{e:'devagar',rc:0}]])(f));
ORC.A.ataque.f=f=>op(f)(kf(ORC.DEF,[[0,{}],[3,{e:'devagar',hx:18,lean:-6*D,aF:-140*D,aF2:-20*D,axF:-190*D,mo:.6}],[5,{e:'rapido',hx:24,lean:22*D,aF:30*D,aF2:0,axF:30*D,trF:-190*D,fF:[30,GY],fB:[16,GY],mo:1}],[6,{hx:25,lean:24*D,aF:40*D,aF2:0,axF:50*D,fF:[30,GY],fB:[16,GY]}],
  [8,{e:'devagar',hx:24,lean:10*D,aF:40*D,axF:50*D,aB:-140*D,aB2:-20*D,axB:-190*D,fF:[30,GY],fB:[16,GY]}],[10,{e:'rapido',hx:26,lean:26*D,aF:40*D,axF:50*D,aB:30*D,aB2:0,axB:30*D,trB:-190*D,fF:[31,GY],fB:[17,GY],mo:1}],[11,{hx:26,lean:28*D,aF:40*D,axF:50*D,aB:40*D,aB2:0,axB:50*D,fF:[31,GY],fB:[17,GY]}],[13,{e:'segura',hx:26,lean:28*D,aF:40*D,axF:50*D,aB:40*D,axB:50*D,fF:[31,GY],fB:[17,GY]}],[18,{e:'devagar'}]])(f));
ORC.A.especial.f=f=>op(f)(kf(ORC.DEF,[[0,{}],[4,{e:'devagar',hy:37,lean:14*D,fF:[25,GY],fB:[14,GY],aF:40*D,aB:50*D}],[8,{e:'devagar',hx:24,hy:22,lean:-8*D,fF:[28,GY-14],fB:[21,GY-13],aF:-150*D,aB:-140*D,axF:-200*D,axB:-205*D,mo:1}],[9,{e:'segura',hx:25,hy:22,lean:-8*D,fF:[29,GY-14],fB:[22,GY-13],aF:-150*D,aB:-140*D,axF:-200*D,axB:-205*D,mo:1}],
  [11,{e:'rapido',hx:28,hy:37,lean:32*D,fF:[33,GY],fB:[21,GY],aF:40*D,aB:50*D,axF:60*D,axB:55*D,trF:-200*D,trB:-205*D,pz:.1,rc:1,mo:1.2}],[15,{e:'segura',hx:28,hy:37,lean:32*D,fF:[33,GY],fB:[21,GY],aF:40*D,aB:50*D,axF:60*D,axB:55*D,pz:.9,rc:1}],[20,{e:'devagar',rc:0}]])(f));
ORC.A.buff.f=f=>op(f)(kf(ORC.DEF,[[0,{}],[4,{e:'devagar',hy:35,lean:20*D,ht:1,mo:.2}],[7,{e:'rapido',hy:32,lean:-12*D,ht:-1.6,mo:1.6,aF:-40*D,aF2:-80*D,aB:-30*D,aB2:-80*D,axF:-150*D,axB:-140*D,raiva:1,vapor:.1}],[9,{sh:1,hy:32,lean:-12*D,ht:-1.6,mo:1.6,aF:-40*D,aF2:-80*D,aB:-30*D,aB2:-80*D,axF:-150*D,axB:-140*D,raiva:1,vapor:.4}],
  [11,{sh:-1,hy:32,lean:-12*D,ht:-1.6,mo:1.6,aF:-40*D,aF2:-80*D,aB:-30*D,aB2:-80*D,axF:-150*D,axB:-140*D,raiva:1,vapor:.7}],[13,{e:'segura',sh:0,hy:32,lean:-12*D,ht:-1.6,mo:1.4,aF:-40*D,aF2:-80*D,aB:-30*D,aB2:-80*D,axF:-150*D,axB:-140*D,raiva:1,vapor:.95}],[18,{e:'devagar',raiva:.6,vapor:0}]])(f));
ORC.A.ferido.f=f=>op(f)(kf(ORC.DEF,[[0,{}],[1,{e:'rapido',hx:17,lean:-12*D,ht:-1.2,mo:1,fF:[23,GY],fB:[13,GY],axF:-30*D}],[3,{hx:17,lean:-2*D,fF:[23,GY],fB:[13,GY]}],[8,{}]])(f));
ORC.A.morte.f=f=>op(f)(kf(ORC.DEF,[[0,{}],[2,{e:'rapido',hx:17,lean:-14*D,ht:-1.2,mo:1.2,fF:[23,GY],fB:[13,GY],axF:-30*D}],[5,{hx:17,hy:37,lean:-10*D,ht:1,fF:[22,GY],fB:[13,GY],aF:60*D,aB:80*D,axF:80*D,axB:100*D,px:11,py:GY-1}],
  [9,{e:'rapido',hx:17,hy:37,lean:-10*D,fF:[22,GY],fB:[13,GY],aF:60*D,aB:80*D,axF:80*D,axB:100*D,rot:-PI/2,px:11,py:GY-1,tx:20,ty:4,dead:1,pz:.1}],[11,{hx:17,hy:37,lean:-10*D,fF:[22,GY],fB:[13,GY],aF:60*D,aB:80*D,axF:80*D,axB:100*D,rot:-PI/2*.94,px:11,py:GY-1,tx:20,ty:2,dead:1,pz:.5}],[13,{hx:17,hy:37,lean:-10*D,fF:[22,GY],fB:[13,GY],aF:60*D,aB:80*D,axF:80*D,axB:100*D,rot:-PI/2,px:11,py:GY-1,tx:20,ty:4,dead:1,pz:.9}],[20,{hx:17,hy:37,lean:-10*D,fF:[22,GY],fB:[13,GY],aF:60*D,aB:80*D,axF:80*D,axB:100*D,rot:-PI/2,px:11,py:GY-1,tx:20,ty:4,dead:1}]])(f));

/* =====================================================================================
   CAVALEIRO NEGRO — armadura escura, capa e penacho vermelhos, escudo com o corvo
   ===================================================================================== */
const CN_O={tronco:11,perna:5.5,braco:5};
const CNE={nome:'Cavaleiro Negro',nivel:4,
  DEF:{hx:20,hy:33,lean:4*D,fF:[25,GY],fB:[15,GY],aF:70*D,aF2:-60*D,aB:60*D,aB2:-80*D,es:-30*D,ht:0,olho:1,capa:0,pena:0,tr:0,andar:0,passo:0,pz:0,rc:0,brilho:0,dead:0,rot:0,px:20,py:GY,sh:0,ph:0,crava:0},
  molas:['capa','pena'],
  draw(pen,p){const A=['#1a1a22','#2e2e3a','#4a4a5c','#6a6a80'],V=['#4a0a10','#7a1418','#a82024'];
    const B=humano(pen,p,CN_O),n=B.neck,h0=B.hip;
    // capa vermelha atrás
    const cw=p.capa;pen.poly([[n[0]-3,n[1]],[n[0]+1,n[1]],[h0[0]-2,h0[1]+5],[h0[0]-7-cw,GY-2+Math.abs(cw)*.2],[h0[0]-9-cw*1.3,h0[1]+3]],V[1]);pen.line(h0[0]-7-cw,GY-2,h0[0]-9-cw*1.3,h0[1]+3,V[0]);
    // braço do escudo (de trás) — escudo à frente do corpo
    const bb=B.braco(B.shB,p.aB,p.aB2,A[1],A[1]);
    B.perna([h0[0]-1.5,h0[1]],B.fB,A[1],A[0]);
    pen.poly([[n[0]-4.5,n[1]],[n[0]+4.5,n[1]+.5],[h0[0]+4,h0[1]+1],[h0[0]-4,h0[1]+1]],A[2]);pen.line(n[0]+4.5,n[1]+.5,h0[0]+4,h0[1]+1,A[3]);
    const m=P(n,PI/2+p.lean,4);pen.line(m[0]-3.5,m[1],m[0]+3.5,m[1]+.5,A[1]);pen.line(h0[0]-4,h0[1],h0[0]+4,h0[1],A[0],2);pen.px(h0[0]+1,h0[1],V[2]);
    pen.poly([[h0[0]-4,h0[1]+1],[h0[0]+4,h0[1]+1],[h0[0]+3,h0[1]+5],[h0[0]-3,h0[1]+5]],A[1]);
    B.perna([h0[0]+1.5,h0[1]],B.fF,A[2],A[0]);
    // ombreira
    pen.ell(n[0]+2.5,n[1]+1.5,2.6,2,A[3]);pen.px(n[0]+2,n[1]+.5,'#9a9ab0');
    // elmo fechado com fresta vermelha e penacho
    const h=[n[0]+1.6+p.ht*.4,n[1]-3.8];pen.poly([[h[0]-3.5,h[1]-3],[h[0]+2.5,h[1]-4],[h[0]+4.5,h[1]-1],[h[0]+4.5,h[1]+3.5],[h[0]-3.5,h[1]+3.5]],A[2]);pen.line(h[0]-3.5,h[1]-3,h[0]+2.5,h[1]-4,A[3]);
    pen.line(h[0]+1,h[1],h[0]+4.5,h[1]-.3,'#08080c');if(p.olho>0&&p.dead<.5){pen.px(h[0]+2.5,h[1]-.2,p.brilho>0?'#ffffff':'#ff2a1a');pen.px(h[0]+3.5,h[1]-.3,'#ff2a1a')}
    pen.px(h[0]+3.5,h[1]+2,A[1]);pen.px(h[0]+3.5,h[1]+1,A[1]);
    const pl=p.pena;pen.line(h[0]-1,h[1]-4,h[0]-4-pl*.5,h[1]-7,V[2],2);pen.line(h[0]-4-pl*.5,h[1]-7,h[0]-9-pl,h[1]-5+pl*.3,V[1],2);
    // escudo pontudo com o corvo
    const sc=[bb.h[0]+1.5,bb.h[1]],ea=p.es;const sp=[[-3.5,-5],[3.5,-5],[3.5,1],[0,6],[-3.5,1]].map(([x,y])=>[sc[0]+x*Math.cos(ea*.15)-y*Math.sin(ea*.15),sc[1]+x*Math.sin(ea*.15)+y*Math.cos(ea*.15)]);
    pen.poly(sp,A[1]);pen.poly(sp.map(([x,y])=>[lerp(sc[0],x,.78),lerp(sc[1],y,.78)]),V[0]);pen.line(sp[0][0],sp[0][1],sp[1][0],sp[1][1],A[3]);
    pen.poly([[sc[0]-2.4,sc[1]-1],[sc[0]+2.4,sc[1]-2],[sc[0]+.4,sc[1]],[sc[0]+1.4,sc[1]+2.5],[sc[0]-.6,sc[1]+.6]],V[2]);pen.px(sc[0]+1.6,sc[1]-1.6,'#e8c25a');
    if(p.brilho>0){pen.px(sp[1][0],sp[1][1],'#fff');pen.px(sp[1][0]-1,sp[1][1]+1,'#bfe0ff')}
    // espada na mão da frente (por cima)
    const fb=B.braco(B.shF,p.aF,p.aF2,A[2],A[2]),sa=p.aF+p.aF2+(p.crava?0:0);const swa=p.crava>0?lerp(sa,PI/2,p.crava):sa;
    if(p.tr){const a0=p.tr,h=fb.h;pen.depois(pn=>arco(pn,h,a0,swa,9,16,['#c070ff','#4a1a6a','#140810']))}
    // ESPADA NEGRA envolta em fogo negro (pedido do Theo): lâmina escura, fio roxo, labaredas pretas com borda roxa e brasas vermelhas
    const t=P(fb.h,swa,15),g1=P(fb.h,swa+PI/2,2.4),g2=P(fb.h,swa-PI/2,2.4),pm=P(fb.h,swa+PI,2.5),up=-PI/2;
    const ph=p.ph;pen.depois(pn=>{
      for(let i=0;i<8;i++){const r=2.5+i*1.75,q=P(fb.h,swa,r),fl=Math.sin(ph*1.7+i*2.1),hh=3+fl*1.4+(i>1&&i<6?1.5:0),dx=Math.sin(ph*1.1+i)*.8;
        const b=[q[0]+dx,q[1]-hh],o=[q[0]+dx*1.3,q[1]-hh-1.2];pn.line(q[0]-.5,q[1],o[0],o[1],'#5a2a7a');pn.line(q[0]+.5,q[1],o[0]+.6,o[1]+.4,'#5a2a7a');pn.line(q[0],q[1],b[0],b[1],'#060408',2);
        if(((ph|0)+i)%5===0)pn.px(o[0]+.5,o[1]-1.8,'#d0303a');else if(((ph|0)+i)%5===2)pn.px(o[0],o[1]-1.5,'#9a5ad0')}
      pn.line(fb.h[0],fb.h[1],t[0],t[1],'#060408',2);const fio=P(fb.h,swa+PI/2,.6);pn.line(fio[0],fio[1],t[0],t[1],'#7a4aa0');pn.px(t[0],t[1],'#d090ff');
      for(let i=0;i<3;i++){const e=P(t,-PI/2+Math.sin(ph*1.3+i)*.4,1.5+i*1.3);pn.px(e[0],e[1],i===2?'#d0303a':'#2a0a30')}});
    pen.line(g1[0],g1[1],g2[0],g2[1],A[0],2);pen.px(g1[0],g1[1],'#6a3a8a');pen.px(g2[0],g2[1],'#6a3a8a');pen.px(pm[0],pm[1],'#c0302a');pen.px(fb.h[0],fb.h[1],A[3]);
    poeira(pen,p.hx+4,GY,p.pz);racha(pen,p.hx+10,p.rc)},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{ph:f*1.6,hy:33+(b>.6?1:0),lean:(4+b*1.5)*D,capa:1+sw(f,n,1,1)*1.2,pena:sw(f,n,1,.5)*1.5,olho:f===12?.4:1,aF2:(-60+b*4)*D}}},
   entrada:{nome:'Entrada',n:24,fps:11,f:null},
   ataque:{nome:'Golpe Brutal',n:18,fps:13,hits:[9],f:null},
   especial:{nome:'Investida Blindada',n:18,fps:14,hits:[8],f:null},
   buff:{nome:'Desafio',n:20,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:24,fps:11,f:null}}};
CNE.A.entrada.f=kf(CNE.DEF,[[0,{hx:-6,andar:1,passo:0,capa:3}],[10,{e:'linear',hx:18,andar:1,passo:PI*4,capa:3}],[11,{hx:19,andar:0,capa:2,pz:.1}],[13,{e:'devagar',hx:19,aF:-60*D,aF2:-40*D,lean:-4*D,olho:.4}],[15,{e:'rapido',hx:20,hy:35,aF:60*D,aF2:30*D,crava:1,lean:14*D,rc:1,pz:.2}],
  [17,{hx:20,hy:35,aF:60*D,aF2:30*D,crava:1,lean:14*D,rc:1,pz:.7,olho:1,brilho:1}],[21,{e:'segura',hx:20,hy:35,aF:60*D,aF2:30*D,crava:1,lean:14*D,rc:1,brilho:1}],[24,{e:'devagar',rc:0,brilho:0}]]);
CNE.A.ataque.f=kf(CNE.DEF,[[0,{}],[5,{e:'devagar',hx:18,lean:-10*D,aF:-150*D,aF2:-30*D,fF:[24,GY],fB:[13,GY],aB:20*D,es:0}],[7,{e:'segura',hx:18,lean:-10*D,aF:-150*D,aF2:-30*D,fF:[24,GY],fB:[13,GY],aB:20*D}],
  [8,{e:'rapido',hx:24,lean:20*D,aF:-40*D,aF2:-20*D,tr:-180*D,fF:[31,GY],fB:[17,GY],capa:5,pena:4}],[9,{e:'rapido',hx:25,hy:34,lean:26*D,aF:40*D,aF2:10*D,tr:-110*D,fF:[31,GY],fB:[17,GY],capa:6,pena:5,pz:.1}],[12,{e:'segura',hx:25,hy:34,lean:26*D,aF:40*D,aF2:10*D,fF:[31,GY],fB:[17,GY],pz:.8}],[18,{e:'devagar'}]]);
CNE.A.especial.f=kf(CNE.DEF,[[0,{}],[4,{e:'devagar',hx:17,hy:35,lean:16*D,aB:-10*D,aB2:-20*D,es:0,fF:[23,GY],fB:[12,GY]}],[7,{e:'rapido',hx:28,hy:34,lean:22*D,aB:-20*D,aB2:0,es:0,fF:[33,GY],fB:[22,GY],capa:6,pena:5}],[8,{hx:29,hy:34,lean:20*D,aB:-20*D,aB2:0,fF:[33,GY],fB:[22,GY],brilho:1,pz:.1}],
  [11,{e:'segura',hx:29,hy:34,lean:20*D,aB:-20*D,aB2:0,fF:[33,GY],fB:[22,GY],brilho:1,pz:.7}],[18,{e:'devagar',brilho:0}]]);
CNE.A.buff.f=kf(CNE.DEF,[[0,{}],[4,{e:'devagar',lean:-2*D,aF:-10*D,aF2:0,ht:-.5}],[9,{e:'segura',lean:-2*D,aF:-10*D,aF2:0,ht:-.5,olho:1,brilho:1}],[11,{e:'rapido',aF:-60*D,aF2:-60*D,aB:30*D,aB2:-60*D}],[12,{aF:-40*D,aF2:-90*D,aB:30*D,aB2:-60*D,brilho:1}],[14,{aF:-60*D,aF2:-60*D,aB:30*D,aB2:-60*D}],[15,{aF:-40*D,aF2:-90*D,aB:30*D,aB2:-60*D,brilho:1}],[20,{e:'devagar',brilho:0}]]);
CNE.A.ferido.f=kf(CNE.DEF,[[0,{}],[1,{e:'rapido',hx:17,lean:-12*D,ht:-1,fF:[23,GY],fB:[13,GY],capa:-3,pena:-4,es:-60*D}],[3,{hx:17,lean:-4*D,fF:[23,GY],fB:[13,GY]}],[8,{}]]);
CNE.A.morte.f=kf(CNE.DEF,[[0,{}],[2,{e:'rapido',hx:17,lean:-12*D,ht:-1,fF:[23,GY],fB:[13,GY],capa:-3,pena:-4}],[7,{e:'devagar',hx:19,hy:39,lean:8*D,ht:1,fF:[26,GY],fB:[14,GY-.5],aF:70*D,aF2:20*D,crava:1,olho:.5}],
  [13,{e:'segura',hx:19,hy:39,lean:12*D,ht:1.5,fF:[26,GY],fB:[14,GY-.5],aF:70*D,aF2:20*D,crava:1,olho:0}],[17,{e:'rapido',hx:19,hy:39,lean:12*D,ht:1.5,fF:[26,GY],fB:[14,GY],aF:70*D,aF2:20*D,crava:1,rot:PI/2,px:31,py:GY-1,dead:1,pz:.1}],
  [19,{hx:19,hy:39,lean:12*D,ht:1.5,fF:[26,GY],fB:[14,GY],aF:70*D,aF2:20*D,crava:1,rot:PI/2*.95,px:31,py:GY-1,dead:1,pz:.6}],[24,{hx:19,hy:39,lean:12*D,ht:1.5,fF:[26,GY],fB:[14,GY],aF:70*D,aF2:20*D,crava:1,rot:PI/2,px:31,py:GY-1,dead:1}]]);

for(const k of ['entrada','ataque','especial','buff','ferido','morte']){const g=CNE.A[k].f;CNE.A[k].f=f=>({...g(f),ph:f*1.6})}
Object.assign(BICHOS,{bruxa:BRU,carrasco:CRR,mimico:MIM,orc:ORC,cavaleiro:CNE});
})();
