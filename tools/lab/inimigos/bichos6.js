/* Inimigos articulados — Nível 6 (chefes): Rei Goblin, Golem Ancestral, Rainha Aranha e O Lich.
   Chefes têm ENTRADA em cena, FASE 2 (a aparência muda e fica até cair: parâmetro f2) e morte caprichada. Usa o motor de bichos.js. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,D,PI}=BICHO.util,GY=BICHO.GY,W=BICHO.W;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function poeira(pen,x,y,t,cor='#8a7a60'){if(t<=0||t>=1)return;for(let i=0;i<12;i++){const s=i<6?-1:1,dx=s*(2+i%6*2.4)*t*1.8,dy=-Math.sin(t*PI)*(1+i%3)*1.7;pen.px(x+dx,y+dy,cor);pen.px(x+dx+s,y+dy,cor)}}
function racha(pen,x,t,larg=9){if(t<=0)return;for(let i=-larg;i<=larg;i++)pen.px(x+i,GY+((i*7)%3===0?-1:0),'#120a06');pen.px(x-larg-1,GY-1,'#120a06');pen.px(x+larg+1,GY,'#120a06')}
function onda(pen,x,t,cor){if(t<=0||t>=1)return;const r=4+t*22;for(let a=0;a<PI;a+=.07)pen.px(x+Math.cos(a)*r,GY-Math.sin(a)*r*.35,cor)}
const ani=(B,ph=1)=>{for(const k in B.A){const A=B.A[k];if(!A.f||A.loop)continue;const g=A.f;A.f=f=>({...g(f),ph:f*ph})}};

/* =====================================================================================
   REI GOBLIN — gordo, coroa, capa de arminho e cetro
   ===================================================================================== */
const RG={nome:'Rei Goblin',nivel:6,
  DEF:{hx:22,hy:35,lean:0,fF:[26,GY],fB:[18,GY],aF:40*D,aF2:-80*D,aB:70*D,aB2:-40*D,ht:0,mo:0,bar:0,coroa:0,cs:-80*D,horda:0,moedas:0,coxa:0,capa:0,ph:0,f2:0,vapor:0,dead:0,rot:0,px:22,py:GY,sh:0,olho:1,andar:0,passo:0},
  molas:['capa'],
  draw(pen,p){const f2=p.f2,G=['#3e6626','#5e8a3a','#86b05a'],R=['#4a0e14','#7a1c22','#a8302e'],O=['#7a5a1a','#b8902e','#ffe27a'];
    const hip=[p.hx+p.sh,p.hy];let fF=p.fF,fB=p.fB;if(p.andar>0){const a=Math.sin(p.passo),b=Math.cos(p.passo);fF=[hip[0]+2+a*3,GY-Math.max(0,b)*1.6];fB=[hip[0]-2-a*3,GY-Math.max(0,-b)*1.6]}
    const neck=P(hip,-PI/2+p.lean,11),shF=[neck[0]+2.5,neck[1]+2],shB=[neck[0]-2.5,neck[1]+2];
    // horda chegando (goblins pequenos correndo por trás)
    if(p.horda>0){for(let i=0;i<2;i++){const x=lerp(-6,p.hx-12+i*5,cl(p.horda*1.4-i*.3)),y=GY-6;if(x<-4)continue;pen.ell(x,y+2,2.5,3,'#6a4428');pen.ell(x+.5,y-2,3,2.6,G[1]);pen.poly([[x-1,y-3],[x-6,y-5],[x-1,y-1]],G[0]);pen.px(x+2,y-2.5,'#ff3a2a');pen.line(x-1,y+5,x-2,GY,G[0]);pen.line(x+1,y+5,x+2,GY,G[0])}}
    // capa de arminho atrás
    const cw=p.capa;const capa=[[neck[0]-4,neck[1]],[neck[0]+2,neck[1]],[hip[0]-3,hip[1]+3],[hip[0]-9-cw,GY-1],[hip[0]-12-cw*1.3,GY-1]];
    pen.poly(capa,R[1]);pen.line(neck[0]-4,neck[1],hip[0]-12-cw*1.3,GY-1,R[2]);
    if(f2>.5){pen.poly([[hip[0]-9-cw,GY-1],[hip[0]-10.5-cw,GY-5],[hip[0]-12-cw*1.3,GY-1]],'#2a1410')}
    for(let i=0;i<6;i++){const t=i/5,x=lerp(neck[0]-4,neck[0]+3,t),y=neck[1]-.5+Math.sin(t*PI)*-1;pen.ell(x,y,1.3,1.2,'#f2ead8');if(i%2)pen.px(x,y,'#1a1410')}
    // braço de trás (comida)
    const eb=P(shB,p.aB,4.5),hb=P(eb,p.aB+p.aB2,4);pen.line(shB[0],shB[1],eb[0],eb[1],R[0],3);pen.line(eb[0],eb[1],hb[0],hb[1],G[0],2);
    if(p.coxa>0){pen.ell(hb[0]+1,hb[1]-2.5,2.4,2.8,'#8a4a1e');pen.ell(hb[0]+.5,hb[1]-3.2,1.4,1.6,'#b06a2e');pen.line(hb[0]+1,hb[1],hb[0]+2,hb[1]+3,'#f2ead8',2)}
    // pernas curtas
    const perna=(h,f,c)=>{const[k,ft]=ik(h,f,4.2,4.2,1);pen.line(h[0],h[1],k[0],k[1],c,3);pen.line(k[0],k[1],ft[0],ft[1],c,2);pen.line(ft[0]-1.5,ft[1]-.5,ft[0]+2.5,ft[1]-.5,'#3a2414',2)};
    perna([hip[0]-2,hip[1]],fB,G[0]);
    // barrigão com túnica real
    const bc=P(hip,-PI/2+p.lean,4.5),br=7.5*(1+p.bar*.25);
    pen.bola(bc[0]+1,bc[1],br,6.5*(1+p.bar*.18),R);pen.ell(bc[0]+2.5,bc[1]+1,br*.55,4.5,'#9aba7a');pen.ell(bc[0]+2.5,bc[1]+1.5,br*.4,3.2,G[2]);
    pen.line(bc[0]-br+1,bc[1]+4,bc[0]+br,bc[1]+4.5,O[1],2);pen.ell(bc[0]+2,bc[1]+4.5,1.4,1.2,O[2]);
    pen.line(neck[0]+1,neck[1]+1,bc[0]+1,bc[1]-5,O[1]);
    perna([hip[0]+2,hip[1]],fF,G[1]);
    // cabeça grande, orelhas, coroa
    const h=[neck[0]+2+p.ht*.6,neck[1]-4.5];
    pen.poly([[h[0]-3,h[1]-1],[h[0]-12,h[1]-4+p.ht*1.5],[h[0]-3,h[1]+2]],G[1]);pen.poly([[h[0]-4,h[1]],[h[0]-9,h[1]-2.5+p.ht],[h[0]-4,h[1]+1]],'#b07a6a');
    pen.bola(h[0],h[1],5.6,5,G);
    pen.poly([[h[0]+3.5,h[1]-.5],[h[0]+8,h[1]+1.6],[h[0]+3.5,h[1]+2.6]],G[1]);
    pen.ell(h[0]-1,h[1]+3.5,4,1.6,G[1]);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+2),Math.round(h[1]-1),'#1a2a10');
    else{const ey=h[1]-1;pen.px(h[0]+1,ey,f2>.5?'#ff2a1a':'#ffcf3a');pen.px(h[0]+2,ey,f2>.5?'#ff2a1a':'#ff3a2a');pen.px(h[0]+2.5,ey-.8,'#1a2a10');if(f2>.5){pen.line(h[0]+.5,ey-2,h[0]+3.5,ey-1,'#1a2a10');pen.px(h[0]-2,h[1]-3,'#c03a2a');pen.px(h[0]-1,h[1]-3.5,'#c03a2a')}}
    const my=h[1]+2.6;if(p.mo>.2){pen.poly([[h[0]-.5,my],[h[0]+4.5,my-.3],[h[0]+3.5,my+p.mo*2.5],[h[0]+.5,my+p.mo*2.5]],'#3a1010');pen.px(h[0]+.5,my,'#f2ead8');pen.px(h[0]+3.5,my,'#f2ead8')}else{pen.line(h[0],my,h[0]+4,my-.4,'#2a3a18');pen.px(h[0]+3,my-.4,'#f2ead8')}
    // coroa (cai e rola quando ele cai)
    const c0=[lerp(h[0]-.5,h[0]-12,p.coroa),lerp(h[1]-5.5,GY-3,p.coroa)],inc=f2>.5&&p.coroa===0?-.25:0;
    const cr=(dx,dy)=>[c0[0]+dx*Math.cos(inc)-dy*Math.sin(inc),c0[1]+dx*Math.sin(inc)+dy*Math.cos(inc)];
    pen.poly([cr(-4,1.5),cr(-4,-2),cr(-2.5,-.5),cr(-1,-3.5),cr(.5,-.5),cr(2,-3),cr(3.5,-.5),cr(4,-2),cr(4,1.5)],O[1]);pen.line(cr(-4,1.5)[0],cr(-4,1.5)[1],cr(4,1.5)[0],cr(4,1.5)[1],O[0]);pen.px(cr(0,0)[0],cr(0,0)[1],'#c0201a');pen.px(cr(-1,-3.5)[0],cr(-1,-3.5)[1],O[2]);pen.px(cr(2,-3)[0],cr(2,-3)[1],O[2]);
    // cetro na mão da frente
    const ef=P(shF,p.aF,4.5),hf=P(ef,p.aF+p.aF2,4);const s0=P(hf,p.cs+PI,3),s1=P(hf,p.cs,11);pen.line(s0[0],s0[1],s1[0],s1[1],O[1],2);pen.line(s0[0],s0[1],s1[0],s1[1],O[2]);
    const orb=P(s1,p.cs,1.5);pen.ell(orb[0],orb[1],2.2,2.2,'#4a1a6a');pen.ell(orb[0],orb[1],1.5,1.5,'#a050e0');pen.px(orb[0]-.5,orb[1]-.5,'#f0c0ff');
    pen.line(shF[0],shF[1],ef[0],ef[1],R[1],3);pen.line(ef[0],ef[1],hf[0],hf[1],G[1],2);pen.px(hf[0],hf[1],G[2]);
    // moedas voando do herói para o rei
    if(p.moedas>0&&p.moedas<1){for(let i=0;i<5;i++){const t=cl(p.moedas*1.6-i*.15);if(t<=0||t>=1)continue;const x=lerp(W-2,hb[0]+1,t),y=lerp(30,hb[1]-2,t)-Math.sin(t*PI)*10;pen.ell(x,y,1.3,1.3,O[1]);pen.px(x-.4,y-.4,O[2])}}
    if(p.vapor>0||f2>.5){const v=(p.vapor||0)+(f2>.5?p.ph*.07:0);for(let i=0;i<3;i++){const t=(v+i/3)%1;pen.ell(h[0]-2+i*3,h[1]-8-t*7,.8+t,.8+t,'#d8d0c8')}}},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{ph:f,hy:35+(b>.6?1:0),bar:sw(f,n,1)*.06,capa:sw(f,n,1,1)*1.2,cs:(-80+b*4)*D,ht:sw(f,n,1,2)>.85?-.5:0,mo:f>=12&&f<=13?.5:0}}},
   entrada:{nome:'Entrada',n:26,fps:12,f:null},
   ataque:{nome:'Cetrada Real',n:18,fps:13,hits:[9],f:null},
   fase2:{nome:'Fase 2 (fúria)',n:20,fps:12,f:null},
   especial:{nome:'Chamar a Horda',n:22,fps:12,f:null},
   especial2:{nome:'Cobrar Impostos',n:22,fps:13,hits:[8],f:null},
   buff:{nome:'Banquete',n:22,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:26,fps:11,f:null}}};
RG.A.entrada.f=kf(RG.DEF,[[0,{hx:-8,andar:1,passo:0,capa:3}],[12,{e:'linear',hx:21,andar:1,passo:PI*4,capa:3}],[13,{hx:22,andar:0,capa:2}],[16,{e:'devagar',aF:-40*D,aF2:-80*D,cs:-100*D,ht:-.8,coroa:0,mo:.6}],[18,{e:'rapido',bar:.3,hy:36,mo:1.2,ht:-1}],[20,{bar:-.05,hy:34,mo:1.2,ht:-1}],[22,{bar:.2,hy:35,mo:1}],[26,{e:'devagar'}]]);
RG.A.ataque.f=kf(RG.DEF,[[0,{}],[5,{e:'devagar',hx:20,lean:-12*D,aF:-160*D,aF2:-20*D,cs:-200*D,ht:-.6,mo:.6}],[7,{e:'segura',hx:20,lean:-12*D,aF:-160*D,aF2:-20*D,cs:-200*D}],[8,{e:'rapido',hx:26,lean:18*D,aF:-20*D,aF2:0,cs:-30*D,mo:1}],[9,{e:'rapido',hx:27,lean:22*D,aF:30*D,aF2:0,cs:30*D,bar:.2,mo:1}],[12,{e:'segura',hx:27,lean:22*D,aF:30*D,aF2:0,cs:30*D}],[18,{e:'devagar'}]]);
RG.A.fase2.f=kf(RG.DEF,[[0,{}],[4,{e:'devagar',lean:14*D,ht:1,hy:37,mo:0}],[8,{e:'rapido',lean:-14*D,ht:-1.6,mo:1.6,hy:33,aF:-60*D,aB:-60*D,aB2:-60*D,f2:1,vapor:.1,sh:1}],[10,{lean:-14*D,ht:-1.6,mo:1.6,hy:33,aF:-60*D,aB:-60*D,aB2:-60*D,f2:1,vapor:.4,sh:-1}],[12,{lean:-14*D,ht:-1.6,mo:1.6,hy:33,aF:-60*D,aB:-60*D,aB2:-60*D,f2:1,vapor:.7,sh:1}],[15,{e:'segura',lean:-14*D,ht:-1.6,mo:1.4,hy:33,aF:-60*D,aB:-60*D,aB2:-60*D,f2:1,vapor:.95,sh:0}],[20,{e:'devagar',f2:1}]]);
RG.A.especial.f=kf(RG.DEF,[[0,{}],[4,{e:'devagar',aF:-100*D,aF2:-60*D,cs:-110*D,ht:-1,mo:1}],[6,{aF:-110*D,aF2:-50*D,cs:-100*D,ht:-1,mo:1.4,sh:1}],[8,{aF:-100*D,aF2:-60*D,cs:-110*D,ht:-1,mo:1.4,sh:-1,horda:.2}],[16,{e:'linear',aF:-100*D,aF2:-60*D,cs:-110*D,ht:-1,mo:.6,horda:1}],[19,{e:'segura',horda:1,ht:-.5,mo:.6}],[22,{e:'devagar',horda:0}]]);
RG.A.especial2.f=kf(RG.DEF,[[0,{}],[4,{e:'devagar',aB:0,aB2:-20*D,lean:10*D,mo:.6,ht:.4}],[6,{e:'segura',aB:-5*D,aB2:-30*D,lean:14*D,mo:.8}],[8,{e:'rapido',aB:-10*D,aB2:-40*D,lean:12*D,moedas:.15}],[15,{e:'linear',aB:60*D,aB2:-80*D,lean:0,moedas:.99,mo:1,ht:-.5}],[18,{e:'segura',aB:60*D,aB2:-80*D,mo:1,bar:.12,ht:-.5}],[22,{e:'devagar'}]]);
RG.A.buff.f=kf(RG.DEF,[[0,{}],[3,{e:'devagar',coxa:1,aB:0,aB2:-90*D}],[6,{coxa:1,aB:-20*D,aB2:-110*D,mo:1.2,ht:.3}],[7,{coxa:1,aB:-10*D,aB2:-95*D,mo:0}],[9,{coxa:1,aB:-20*D,aB2:-110*D,mo:1.2,bar:.15}],[10,{coxa:1,aB:-10*D,aB2:-95*D,mo:0,bar:.2}],[12,{coxa:1,aB:-20*D,aB2:-110*D,mo:1.2,bar:.3}],[13,{coxa:1,aB:-10*D,aB2:-95*D,mo:0,bar:.35}],[17,{e:'devagar',coxa:0,bar:.45,lean:-8*D,ht:-1,mo:.8}],[22,{e:'devagar',bar:.1}]]);
RG.A.ferido.f=kf(RG.DEF,[[0,{}],[1,{e:'rapido',hx:19,lean:-14*D,ht:-1.2,mo:1,bar:.2,capa:-3}],[3,{hx:19,lean:-6*D,bar:-.05}],[8,{}]]);
RG.A.morte.f=kf(RG.DEF,[[0,{}],[2,{e:'rapido',hx:19,lean:-16*D,ht:-1.4,mo:1.2,bar:.2}],[6,{hx:20,lean:6*D,ht:1,mo:.8,coroa:.15}],[9,{e:'devagar',hx:20,hy:38,lean:10*D,ht:1,coroa:.4,px:12,py:GY-1}],
  [13,{e:'rapido',hx:20,hy:38,lean:10*D,ht:1,coroa:1,rot:-PI/2,px:12,py:GY-1,tx:20,ty:-3,dead:1,bar:.3}],[15,{hx:20,hy:38,lean:10*D,coroa:1,rot:-PI/2*.94,px:12,py:GY-1,tx:20,ty:-5,dead:1,bar:.1}],[17,{hx:20,hy:38,lean:10*D,coroa:1,rot:-PI/2,px:12,py:GY-1,tx:20,ty:-3,dead:1,bar:.25}],[26,{hx:20,hy:38,lean:10*D,coroa:1,rot:-PI/2,px:12,py:GY-1,tx:20,ty:-3,dead:1,bar:.2}]]);
ani(RG);

/* =====================================================================================
   GOLEM ANCESTRAL — blocos de pedra com runas e um cristal no peito; monta e desmonta
   ===================================================================================== */
const GOL={nome:'Golem Ancestral',nivel:6,
  DEF:{hx:22,hy:30,lean:4*D,fF:[27,GY],fB:[16,GY],aF:80*D,aF2:-20*D,aB:90*D,aB2:-10*D,ht:0,rn:.3,monta:0,pz:0,rc:0,onda:0,rocha:0,f2:0,brilho:0,dead:0,rot:0,px:22,py:GY,sh:0,ph:0},
  draw(pen,p){const f2=p.f2,S=['#3e444c','#5e666f','#808a94','#a0aab4'],RN=f2>.5?'#ffb050':'#5ad0e0',RN2=f2>.5?'#fff0c0':'#d0ffff';
    const hip=[p.hx+p.sh,p.hy],neck=P(hip,-PI/2+p.lean,10),shF=[neck[0]+4,neck[1]+2],shB=[neck[0]-3,neck[1]+2];
    const B=[];// blocos: centro, largura, altura, ângulo, tom
    const bloco=(a,b,h,t)=>{B.push({c:[(a[0]+b[0])/2,(a[1]+b[1])/2],w:Math.hypot(b[0]-a[0],b[1]-a[1])+2,h,a:Math.atan2(b[1]-a[1],b[0]-a[0]),t})};
    const perna=(h0,f,t)=>{const[k,ft]=ik(h0,f,7,7,1);bloco(h0,k,6,t);bloco(k,[ft[0],ft[1]-1.5],5.5,t);B.push({c:[ft[0]+.5,ft[1]-1.2],w:7,h:3,a:0,t})};
    const braco=(sh,a1,a2,t)=>{const e=P(sh,a1,6.5),h=P(e,a1+a2,6.5);bloco(sh,e,6,t);bloco(e,h,5.5,t);B.push({c:P(h,a1+a2,1.5),w:7,h:7,a:a1+a2,t,mao:1});return h};
    braco(shB,p.aB,p.aB2,0);perna([hip[0]-3,hip[1]],p.fB,0);
    B.push({c:hip,w:12,h:6,a:p.lean,t:1});
    B.push({c:P(hip,-PI/2+p.lean,5.5),w:17,h:13,a:p.lean,t:2,peito:1});
    perna([hip[0]+3,hip[1]],p.fF,1);
    B.push({c:P(neck,-PI/2+p.lean+p.ht*.3,3.5),w:8,h:7,a:p.lean+p.ht*.2,t:2,cab:1});
    braco(shF,p.aF,p.aF2,1);
    const m=p.monta,n=B.length;
    B.forEach((b,i)=>{let c=b.c,a=b.a;if(m>0){const t=cl(m*1.6-((i*5)%n)/n*.6),tx=p.hx-12+((i*7)%25),ty=GY-b.h*.4-((i%3)?0:2);c=[lerp(c[0],tx,t),lerp(c[1],ty,t*t)];a=lerp(a,(i%2?.15:-.1),t)}
      const ca=Math.cos(a),sa=Math.sin(a),pt=(x,y)=>[c[0]+x*ca-y*sa,c[1]+x*sa+y*ca],w=b.w/2,h=b.h/2;
      pen.poly([pt(-w,-h),pt(w,-h),pt(w,h),pt(-w,h)],S[b.t]);pen.line(pt(-w,-h)[0],pt(-w,-h)[1],pt(w,-h)[0],pt(w,-h)[1],S[b.t+1]);pen.line(pt(-w,h)[0],pt(-w,h)[1],pt(w,h)[0],pt(w,h)[1],S[0]);
      if(i%3===0){const q=pt(-w*.4,-h*.3);pen.px(q[0],q[1],'#5a7a3a');pen.px(q[0]+1,q[1],'#7a9a4a')}
      // runas
      if(m<.5&&(b.peito||i%2===0)){const q=pt(w*.2,h*.1),on=p.rn>.15;pen.px(q[0],q[1],on?RN:S[0]);pen.px(q[0]+1,q[1]+1,on?RN:S[0]);pen.px(q[0]-1,q[1]+1,on?RN:S[0])}
      if(b.peito&&m<.6){const q=pt(w*.15,-h*.05),r=1.8+p.rn*1.2;pen.poly([[q[0],q[1]-r-1],[q[0]+r,q[1]],[q[0],q[1]+r+1],[q[0]-r,q[1]]],f2>.5?'#c06a2a':'#2a8aa0');pen.poly([[q[0],q[1]-r],[q[0]+r*.6,q[1]],[q[0],q[1]+r*.8],[q[0]-r*.6,q[1]]],RN);if(p.rn>.5)pen.px(q[0]-.5,q[1]-1,RN2);pen.info.boca=q}
      if(b.cab&&m<.5){const q=pt(w*.45,-h*.1);if(p.dead>.5){pen.px(q[0],q[1],S[0])}else{pen.px(q[0],q[1],RN);pen.px(q[0]-1.5,q[1],RN);if(p.rn>.6)pen.px(q[0]+1,q[1]-1,RN2)}}
      if(f2>.5&&m<.5&&i%2===1){const q=pt(-w*.3,h*.2);pen.line(q[0],q[1],q[0]+2,q[1]-2,'#ff8a2a');pen.px(q[0]+2.5,q[1]-2.5,'#ffe27a')}});
    // pedras voando
    if(p.rocha>0&&p.rocha<1){for(let i=0;i<7;i++){const t=p.rocha,x=p.hx+10+(i-3)*4*t*1.5,y=GY-2-Math.sin(t*PI)*(6+i%3*4);pen.ell(x,y,1.2+(i%2),1+(i%2),S[1+(i%2)])}}
    if(p.brilho>0){for(let k=0;k<14;k++){const a=k*PI/7+p.ph*.25;pen.px(hip[0]+Math.cos(a)*14,hip[1]-6+Math.sin(a)*14,'#a8f0ff')}}
    poeira(pen,p.hx+8,GY,p.pz);racha(pen,p.hx+14,p.rc,12);onda(pen,p.hx+14,p.onda,'#c8b090')},
  A:{
   parado:{n:16,fps:7,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{ph:f,hy:30+(b>.6?1:0),rn:.3+b*.4,ht:sw(f,n,1,2)>.8?.5:0}}},
   entrada:{nome:'Entrada (se monta)',n:26,fps:11,f:null},
   ataque:{nome:'Soco de Pedra',n:18,fps:12,hits:[9],f:null},
   fase2:{nome:'Fase 2 (núcleo exposto)',n:20,fps:11,f:null},
   especial:{nome:'Esmagar',n:22,fps:12,hits:[8,14],f:null},
   defesa:{nome:'Acumular Energia',n:20,fps:11,f:null},
   especial2:{nome:'Terremoto',n:26,fps:12,hits:[14],f:null},
   ferido:{n:8,fps:13,f:null},morte:{n:26,fps:11,f:null}}};
GOL.A.entrada.f=kf(GOL.DEF,[[0,{monta:1,rn:0}],[6,{monta:1,rn:.5,sh:1}],[16,{e:'devagar',monta:0,rn:.6,sh:0}],[19,{e:'rapido',rn:1,ht:-1,aF:-40*D,aB:-30*D,hy:28,brilho:1}],[22,{e:'segura',rn:1,ht:-1,aF:-40*D,aB:-30*D,hy:28,brilho:1}],[26,{e:'devagar',brilho:0}]]);
GOL.A.ataque.f=kf(GOL.DEF,[[0,{}],[5,{e:'devagar',hx:20,lean:-8*D,aF:150*D,aF2:-60*D,ht:-.5}],[7,{e:'segura',hx:20,lean:-8*D,aF:150*D,aF2:-60*D}],[8,{e:'rapido',hx:26,lean:18*D,aF:0,aF2:0,fF:[32,GY]}],[9,{hx:27,lean:20*D,aF:-5*D,aF2:0,fF:[32,GY],rn:.8}],[12,{e:'segura',hx:27,lean:20*D,aF:-5*D,aF2:0,fF:[32,GY]}],[18,{e:'devagar'}]]);
GOL.A.fase2.f=kf(GOL.DEF,[[0,{}],[4,{e:'devagar',lean:16*D,ht:1,hy:32}],[8,{e:'rapido',lean:-10*D,ht:-1,hy:29,aF:-60*D,aB:-50*D,f2:1,rn:1,rocha:.1,sh:1}],[10,{lean:-10*D,ht:-1,aF:-60*D,aB:-50*D,f2:1,rn:1,rocha:.4,sh:-1}],[13,{e:'segura',lean:-10*D,ht:-1,aF:-60*D,aB:-50*D,f2:1,rn:1,rocha:.9,sh:0}],[20,{e:'devagar',f2:1}]]);
GOL.A.especial.f=kf(GOL.DEF,[[0,{}],[4,{e:'devagar',aF:-130*D,aF2:-30*D,aB:-120*D,aB2:-30*D,lean:-6*D}],[7,{e:'rapido',aF:30*D,aF2:20*D,aB:40*D,aB2:20*D,lean:26*D,hx:25,fF:[31,GY]}],[8,{aF:40*D,aF2:20*D,aB:50*D,aB2:20*D,lean:28*D,hx:25,fF:[31,GY],pz:.1,rc:1}],
  [11,{e:'devagar',aF:-130*D,aF2:-30*D,aB:-120*D,aB2:-30*D,lean:-6*D,hx:24,fF:[31,GY],pz:.6,rc:1}],[13,{e:'rapido',aF:30*D,aF2:20*D,aB:40*D,aB2:20*D,lean:26*D,hx:26,fF:[32,GY],rc:1}],[14,{aF:40*D,aF2:20*D,aB:50*D,aB2:20*D,lean:28*D,hx:26,fF:[32,GY],pz:.1,rc:1}],[18,{e:'segura',aF:40*D,aB:50*D,lean:28*D,hx:26,fF:[32,GY],pz:.8,rc:1}],[22,{e:'devagar',rc:0}]]);
GOL.A.defesa.f=kf(GOL.DEF,[[0,{}],[5,{e:'devagar',aF:-90*D,aF2:-90*D,aB:-80*D,aB2:-90*D,hy:32,rn:.8}],[10,{aF:-95*D,aF2:-90*D,aB:-85*D,aB2:-90*D,hy:32,rn:1,brilho:1}],[16,{e:'segura',aF:-95*D,aF2:-90*D,aB:-85*D,aB2:-90*D,hy:32,rn:1,brilho:1}],[20,{e:'devagar',brilho:0}]]);
GOL.A.especial2.f=kf(GOL.DEF,[[0,{}],[5,{e:'devagar',hy:33,aF:-150*D,aF2:-10*D,aB:-140*D,aB2:-10*D,rn:.7,ht:-1}],[9,{e:'devagar',hy:22,fF:[27,GY-8],fB:[16,GY-7],aF:-160*D,aF2:-10*D,aB:-150*D,aB2:-10*D,rn:1,ht:-1}],[11,{e:'segura',hy:22,fF:[27,GY-8],fB:[16,GY-7],aF:-160*D,aB:-150*D,rn:1}],
  [13,{e:'rapido',hx:24,hy:34,lean:30*D,fF:[30,GY],fB:[16,GY],aF:60*D,aF2:0,aB:70*D,aB2:0,rn:1}],[14,{hx:24,hy:34,lean:30*D,fF:[30,GY],fB:[16,GY],aF:70*D,aF2:0,aB:80*D,aB2:0,pz:.1,rc:1,onda:.1,rocha:.1,rn:1}],[20,{e:'segura',hx:24,hy:34,lean:30*D,fF:[30,GY],fB:[16,GY],aF:70*D,aB:80*D,pz:.9,rc:1,onda:.95,rocha:.95}],[26,{e:'devagar',rc:0}]]);
GOL.A.ferido.f=kf(GOL.DEF,[[0,{}],[1,{e:'rapido',hx:20,lean:-8*D,ht:-1,rn:0,monta:.06}],[3,{hx:20,lean:0,monta:.02}],[8,{}]]);
GOL.A.morte.f=kf(GOL.DEF,[[0,{}],[2,{e:'rapido',hx:20,lean:-10*D,ht:-1,rn:1,sh:1}],[5,{hx:20,lean:-6*D,rn:1,sh:-1,brilho:1}],[8,{hx:20,lean:-6*D,rn:0,sh:0,brilho:0,dead:1}],[18,{e:'rapido',hx:20,lean:-6*D,monta:1,dead:1,pz:.2}],[22,{hx:20,monta:1,dead:1,pz:.95}],[26,{hx:20,monta:1,dead:1}]]);
ani(GOL);

/* =====================================================================================
   RAINHA ARANHA — enorme, de coroa, desce do teto num fio
   ===================================================================================== */
const RA={nome:'Rainha Aranha',nivel:6,
  DEF:{bx:0,by:0,lg:0,fo:0,ab:0,rs:0,tilt:0,cu:0,fio:0,ovos:0,filhotes:0,carap:0,f2:0,veneno:0,blink:0,dead:0,rot:0,px:24,py:36,ph:0},
  draw(pen,p){const f2=p.f2,C=['#1a0e1e','#34183a','#54285a'],MK=f2>.5?'#ff3a2a':'#c050e0',cx=24+p.bx,cy=34+p.by,t=p.tilt;
    const abd=[cx-7,cy-2-t*5],tho=[cx+5,cy+1+t*2];
    if(p.fio>0)pen.line(abd[0],0,abd[0],abd[1]-6,'#d8d8e0');
    const perna=(i,perto)=>{const hip=[tho[0]-2+i*1.4,tho[1]+.5];const base=[cx-14,cx-6,cx+8,cx+17][i]+(perto?1.5:-1.5);
      const ph=p.lg+i*1.7+(perto?PI:0),s=Math.sin(ph),up=Math.max(0,Math.cos(ph))*2;
      let ft=[base+s*1.8,GY-up];if(i>=2&&p.rs>0)ft=[lerp(ft[0],base+4,p.rs),lerp(ft[1],cy-15-(i-2)*3,p.rs)];
      if(p.cu>0)ft=[lerp(ft[0],tho[0]+(i-1.5)*3,p.cu),lerp(ft[1],tho[1]-2,p.cu)];
      const mid=[(hip[0]+ft[0])/2,(hip[1]+ft[1])/2],kn=[mid[0]+(ft[0]-hip[0])*.12,Math.min(hip[1],ft[1])-8+p.cu*4];
      const col=perto?C[2]:C[0];pen.line(hip[0],hip[1],kn[0],kn[1],col,2);pen.line(kn[0],kn[1],ft[0],ft[1],col);pen.px(kn[0],kn[1],perto?'#7a4a80':C[1]);if(f2>.5&&perto){pen.px(kn[0],kn[1]-1,'#e8dcc0')}};
    for(let i=0;i<4;i++)perna(i,false);
    // saco de ovos e filhotes
    if(p.ovos>0){for(let i=0;i<4;i++){const tt=cl(p.ovos*1.5-i*.15),y=lerp(abd[1]+5,GY-1.5,tt*tt);pen.ell(abd[0]-3+i*2.5,y,1.5,1.4,'#e8e0c8');pen.px(abd[0]-3.5+i*2.5,y-.5,'#ffffff')}}
    if(p.filhotes>0){for(let i=0;i<3;i++){const x=lerp(abd[0]-2+i*3,cx+18+i*6,cl(p.filhotes*1.3-i*.12)),y=GY-1.5;pen.ell(x,y,1.8,1.2,'#5a3a2a');for(let k=-1;k<=1;k+=2){pen.px(x+k*2,y+1,'#3a2418');pen.px(x+k*2.5,y,'#3a2418')}pen.px(x+1.5,y-.5,'#ff3a2a')}}
    // abdômen com marcas
    const ar=11*(1+p.ab*.05);pen.bola(abd[0],abd[1],ar,8*(1+p.ab*.05),C);
    pen.poly([[abd[0]-1,abd[1]-4],[abd[0]+2,abd[1]-4],[abd[0]+.5,abd[1]-1],[abd[0]+2,abd[1]+2],[abd[0]-1,abd[1]+2],[abd[0]+.5,abd[1]-1]],MK);
    for(const [dx,dy] of [[-6,-3],[-5,2],[4,-4],[-8,0]])pen.px(abd[0]+dx,abd[1]+dy,MK);
    if(p.carap>0){for(let a=-PI;a<0;a+=.15)pen.px(abd[0]+Math.cos(a)*(ar+1),abd[1]+Math.sin(a)*(8.5),'#a8d8ff')}
    pen.bola(tho[0],tho[1],6,5,C);
    // coroa
    const cr=[tho[0]-.5,tho[1]-5];pen.poly([[cr[0]-3.5,cr[1]+1.5],[cr[0]-3.5,cr[1]-2],[cr[0]-1.8,cr[1]],[cr[0],cr[1]-3],[cr[0]+1.8,cr[1]],[cr[0]+3.5,cr[1]-2],[cr[0]+3.5,cr[1]+1.5]],'#b8902e');pen.px(cr[0],cr[1]-.2,f2>.5?'#ff3a2a':'#c050e0');if(f2>.5)pen.line(cr[0]-1,cr[1]-2,cr[0]+.5,cr[1]+1,'#3a2a10');
    // olhos (muitos)
    if(p.dead>.5)olhoX(pen,Math.round(tho[0]+3),Math.round(tho[1]-1),'#2a1a2a');else if(p.blink<.5){const e=f2>.5?'#ff3a2a':'#ff6ad0';for(const [dx,dy] of [[2,-2],[3.5,-1],[1,-1],[2.5,0],[4,-2.5]])pen.px(tho[0]+dx,tho[1]+dy,e);pen.px(tho[0]+3.5,tho[1]-2.5,'#ffffff')}
    // presas
    const fx=tho[0]+5,fy=tho[1]+2;pen.line(fx,fy,fx+2+p.fo*1.5,fy+3.5-p.fo,'#d8c8b0',2);pen.line(fx-1.5,fy+.5,fx+.5-p.fo,fy+4+p.fo,'#b8a890');
    if(p.veneno>0){pen.px(fx+2+p.fo*1.5,fy+4.5,'#8ad04a');pen.px(fx+2+p.fo*1.5,fy+5.5+p.veneno,'#6ab83a')}
    pen.info.boca=[fx+2,fy+2];
    for(let i=0;i<4;i++)perna(i,true)},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({ph:f,ab:sw(f,n,2),lg:sw(f,n,1)*.7,fo:sw(f,n,4)>.8?.8:0,by:sw(f,n,2)>.5?-.5:0,blink:f===9?1:0})},
   entrada:{nome:'Entrada (desce do teto)',n:26,fps:12,f:null},
   ataque:{nome:'Presas Venenosas',n:16,fps:13,hits:[9],f:null},
   fase2:{nome:'Fase 2 (fúria)',n:20,fps:12,f:null},
   especial:{nome:'Chocar Ninhada',n:24,fps:12,f:null},
   especial2:{nome:'Casulo de Teia',n:18,fps:12,hits:[10],tiro:'teia',f:null},
   ataque2:{nome:'Investida',n:22,fps:15,hits:[6,11,16],f:null},
   defesa:{nome:'Carapaça',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:22,fps:12,f:null}}};
RA.A.entrada.f=kf(RA.DEF,[[0,{by:-44,fio:1,cu:.7}],[10,{e:'devagar',by:-6,fio:1,cu:.7}],[12,{by:-8,fio:1,cu:.5}],[15,{e:'rapido',by:0,fio:0,cu:0,lg:1}],[18,{e:'devagar',rs:1,tilt:-.5,fo:1}],[22,{e:'segura',rs:1,tilt:-.5,fo:1}],[26,{e:'devagar'}]]);
RA.A.ataque.f=kf(RA.DEF,[[0,{}],[4,{e:'devagar',bx:-3,by:-2,tilt:-.5,rs:1,fo:1,lg:1}],[7,{e:'segura',bx:-3,by:-2,tilt:-.5,rs:1,fo:1,lg:1,veneno:.5}],[8,{e:'rapido',bx:7,by:1,tilt:.4,rs:.2,fo:0,lg:2.5}],[9,{e:'rapido',bx:8,tilt:.3,rs:0,lg:3,veneno:1}],[11,{e:'segura',bx:8,tilt:.3,lg:3,veneno:1}],[16,{e:'devagar',lg:6}]]);
RA.A.fase2.f=kf(RA.DEF,[[0,{}],[4,{e:'devagar',tilt:-.6,rs:1,by:-3,fo:1}],[8,{e:'rapido',tilt:-.7,rs:1,by:-4,fo:1.4,f2:1,ab:3,carap:1}],[10,{tilt:-.7,rs:.7,by:-4,fo:1.4,f2:1,ab:-1,carap:0}],[12,{tilt:-.7,rs:1,by:-4,fo:1.4,f2:1,ab:3,carap:1}],[15,{e:'segura',tilt:-.7,rs:1,by:-4,fo:1,f2:1}],[20,{e:'devagar',f2:1}]]);
RA.A.especial.f=kf(RA.DEF,[[0,{}],[5,{e:'devagar',tilt:.6,ab:3,by:-1}],[8,{tilt:.7,ab:-1,ovos:.2}],[12,{tilt:.7,ab:3,ovos:.7}],[15,{tilt:.4,ab:0,ovos:1}],[17,{tilt:.2,ovos:1,filhotes:.1}],[23,{e:'linear',ovos:1,filhotes:1}],[24,{ovos:0,filhotes:0}]]);
RA.A.especial2.f=kf(RA.DEF,[[0,{}],[5,{e:'devagar',tilt:.9,by:-2,ab:3}],[9,{e:'segura',tilt:1,by:-3,ab:3}],[10,{e:'rapido',tilt:1.1,by:-3,ab:-1}],[13,{e:'segura',tilt:1,by:-3}],[18,{e:'devagar'}]]);
RA.A.ataque2.f=kf(RA.DEF,[[0,{}],[3,{e:'devagar',bx:-3,fo:1}],[5,{e:'rapido',bx:8,fo:0,lg:2}],[6,{bx:9,lg:2.5}],[8,{e:'devagar',bx:4,fo:1,lg:3}],[10,{e:'rapido',bx:10,fo:0,lg:4.5}],[11,{bx:11,lg:5}],[13,{e:'devagar',bx:5,fo:1,lg:5.5}],[15,{e:'rapido',bx:12,fo:0,lg:7}],[16,{bx:13,lg:7.5}],[18,{e:'segura',bx:13}],[22,{e:'devagar',lg:10}]]);
RA.A.defesa.f=kf(RA.DEF,[[0,{}],[5,{e:'devagar',cu:.45,by:2,carap:.3}],[9,{cu:.5,by:2,carap:1}],[14,{e:'segura',cu:.5,by:2,carap:1}],[18,{e:'devagar',carap:0}]]);
RA.A.ferido.f=kf(RA.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-3,tilt:-.4,cu:.5,blink:1}],[3,{bx:-4,by:0,tilt:-.1,cu:.2,blink:1}],[8,{}]]);
RA.A.morte.f=kf(RA.DEF,[[0,{}],[2,{e:'rapido',bx:-4,by:-5,tilt:-.6,cu:.4,rs:1}],[5,{bx:-4,by:-4,tilt:-.6,cu:.4,rs:1,fo:1.4}],[9,{bx:-4,by:-8,rot:PI*.6,cu:.6}],[12,{e:'rapido',bx:-4,by:-3,rot:PI,ty:-7,cu:.9,dead:1}],[14,{bx:-4,by:-4,rot:PI,ty:-7,cu:1,dead:1}],[16,{bx:-4,by:-3,rot:PI,ty:-7,cu:.95,dead:1}],[22,{bx:-4,by:-3,rot:PI,ty:-7,cu:1,dead:1}]]);
ani(RA);

/* =====================================================================================
   O LICH — rei-mago esqueleto, flutua, cajado de chama verde
   ===================================================================================== */
const LI={nome:'O Lich',nivel:6,voa:1,
  DEF:{hx:22,by:0,lean:0,aF:50*D,aF2:-100*D,aB:70*D,aB2:-60*D,ht:0,mo:0,olho:1,maos:0,dreno:0,runas:0,fil:0,al:1,po:0,alma:0,coroa:0,cj:-88*D,chama:.4,f2:0,raio:0,ph:0,dead:0,rot:0,px:22,py:GY,sh:0},
  draw(pen,p){const f2=p.f2,R=['#1e0e2a','#3a1a50','#5a2e74'],O=['#7a5a1a','#b8902e','#ffe27a'],OS=['#8a8270','#c8c0aa','#f2ead8'],V=f2>.5?['#2a8a3a','#7aff8a','#e0ffe0']:['#1a6a2a','#5ad06a','#c0ffc8'];
    const po=p.po,hx=p.hx+p.sh,hem=GY-4+p.by,top=hem-24+po*18,neck=[hx+p.lean*10,top+5];
    // mãos de esqueleto saindo do chão
    if(p.maos>0){for(let i=0;i<3;i++){const x=hx+10+i*6,h=p.maos*(5+i%2*2);pen.line(x,GY,x,GY-h,OS[1]);for(let k=-1;k<=1;k++)pen.line(x,GY-h,x+k*1.2,GY-h-2,OS[2]);pen.px(x-1,GY-1,V[1]);pen.px(x+1,GY,V[0])}}
    // braço de trás
    const sb=[neck[0]-2,neck[1]+2],eb=P(sb,p.aB,4.5),hb=P(eb,p.aB+p.aB2,4);if(po<.5){pen.line(sb[0],sb[1],eb[0],eb[1],R[0],3);pen.line(eb[0],eb[1],hb[0],hb[1],OS[0])}
    if(p.fil>0&&po<.5){pen.poly([[hb[0],hb[1]-4.5],[hb[0]+2,hb[1]-2],[hb[0],hb[1]+.5],[hb[0]-2,hb[1]-2]],'#2a6a7a');pen.poly([[hb[0],hb[1]-3.5],[hb[0]+1.2,hb[1]-2],[hb[0],hb[1]-.5],[hb[0]-1.2,hb[1]-2]],'#7ae8ff');pen.px(hb[0]-.5,hb[1]-3,'#ffffff')}
    // manto flutuante com barra rasgada
    const w1=8,pts=[[neck[0]-4,neck[1]],[neck[0]+4,neck[1]+.5],[hx+w1,hem]];for(let i=0;i<=7;i++){const t=i/7;pts.push([lerp(hx+w1,hx-w1-2,t),hem+(i%2?-2:0)+Math.sin(p.ph*.5+i)*.8])}pts.push([hx-w1-2,hem-3]);
    pen.poly(pts,R[1]);pen.line(neck[0]+4,neck[1]+.5,hx+w1,hem,R[2]);pen.line(neck[0]+.5,neck[1]+1,hx+1,hem-1,O[1]);pen.line(neck[0]-4,neck[1]+.5,neck[0]+4,neck[1]+1,O[1]);
    // fogo verde no manto (fase 2) — brilho próprio
    const chama=f2>.5?1:p.chama*.3,ph=p.ph;
    // gola alta
    pen.poly([[neck[0]-5,neck[1]+1],[neck[0]-4.5,neck[1]-5],[neck[0]-2,neck[1]-1]],R[2]);
    // crânio e coroa
    const h=[neck[0]+1.5+p.ht*.4,neck[1]-3.5];
    if(po<.7){pen.bola(h[0],h[1],3.4,3.2,OS);pen.px(h[0]+3,h[1]+.5,'#3a3428');
      const jy=h[1]+2.2+p.mo*1.5;pen.line(h[0]-.5,jy,h[0]+3,jy-.3,OS[1]);for(let i=0;i<3;i++)pen.px(h[0]+i,h[1]+2,OS[2]);
      if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.5),Math.round(h[1]-.5),'#3a3428');else{pen.px(h[0]+1,h[1]-.5,'#0a0a0a');pen.px(h[0]+2.2,h[1]-.5,'#0a0a0a')}}
    const c0=[lerp(h[0]-.5,h[0]-8,p.coroa),lerp(h[1]-4,GY-2.5,p.coroa)-(f2>.5&&p.coroa===0?1.5+Math.sin(ph*.5)*.5:0)];
    pen.poly([[c0[0]-3.5,c0[1]+1.5],[c0[0]-3.5,c0[1]-2.5],[c0[0]-1.5,c0[1]-.5],[c0[0],c0[1]-3.5],[c0[0]+1.5,c0[1]-.5],[c0[0]+3.5,c0[1]-2.5],[c0[0]+3.5,c0[1]+1.5]],O[1]);pen.px(c0[0],c0[1],V[1]);pen.px(c0[0],c0[1]-3.5,O[2]);
    // cajado com chama verde
    const sf=[neck[0]+2.5,neck[1]+2],ef=P(sf,p.aF,4.5),hf=P(ef,p.aF+p.aF2,4);let orb=null;
    if(po<.5){const s0=P(hf,p.cj+PI,12),s1=P(hf,p.cj,12);pen.line(s0[0],s0[1],s1[0],s1[1],'#2a1a14',2);pen.line(s1[0],s1[1],s1[0]-2,s1[1]-2,'#2a1a14');pen.line(s1[0],s1[1],s1[0]+2,s1[1]-2,'#2a1a14');orb=P(s1,p.cj,2);
      pen.line(sf[0],sf[1],ef[0],ef[1],R[1],3);pen.line(ef[0],ef[1],hf[0],hf[1],OS[1]);pen.px(hf[0],hf[1],OS[2]);pen.info.boca=orb}
    else pen.line(hx-2,GY,hx+14,GY-1,'#2a1a14');
    // pó (quando morre)
    if(po>0){for(let i=0;i<12;i++){const x=hx-8+((i*7)%17),y=GY-1-((i*3)%3)*po;pen.px(x,y,i%2?OS[0]:OS[1])}}
    const olho=p.olho,dead=p.dead,runas=p.runas,dreno=p.dreno,alma=p.alma,raio=p.raio;
    pen.depois(pn=>{
      if(chama>0&&po<.6){for(let i=0;i<7;i++){const x=hx-8+i*2.6,b=hem-1+(i%2?-2:0),hh=(2+Math.sin(ph*1.9+i*2)*1.4+2)*chama;pn.line(x,b,x+Math.sin(ph+i)*.6,b-hh,V[0]);pn.px(x,b-hh*.5,V[1]);if(i%3===0)pn.px(x,b-hh-1,V[2])}}
      if(orb){const r=1.8+Math.sin(ph*1.7)*.4+(raio>0?1.5*raio:0);pn.ell(orb[0],orb[1],r+1,r+1.6,V[0]);pn.ell(orb[0],orb[1]-.4,r,r+.6,V[1]);pn.px(orb[0],orb[1]-.5,V[2]);pn.px(orb[0]+Math.sin(ph)*.8,orb[1]-r-2,V[1])}
      if(po<.7&&dead<.5&&olho>0){pn.px(h[0]+1,h[1]-.5,V[1]);pn.px(h[0]+2.2,h[1]-.5,V[1]);if(f2>.5){pn.px(h[0]+3,h[1]-1,V[2]);pn.px(h[0]+3.8,h[1]-1.5,V[1])}}
      if(runas>0){for(let i=0;i<6;i++){const a=ph*.35+i*PI/3,x=hx+Math.cos(a)*12*runas,y=hem-10+Math.sin(a)*4*runas;pn.px(x,y,V[2]);pn.px(x+1,y,V[1]);pn.px(x,y+1,V[1])}}
      if(dreno>0&&dreno<1){for(let i=0;i<4;i++){const t=cl(dreno*1.5-i*.15);if(t<=0||t>=1)continue;const x=lerp(W-2,h[0]+3,t),y=lerp(28,h[1]+1,t)+Math.sin(t*PI*3+i)*3;pn.px(x,y,V[2]);pn.px(x+1,y,V[1]);pn.px(x+2,y+.5,V[0])}}
      if(alma>0){const y=lerp(h[1],-4,alma),x=h[0]+Math.sin(alma*12)*2;pn.ell(x,y,2,2.4,V[1]);pn.px(x,y-1,V[2]);pn.line(x,y+2,x-Math.sin(alma*12),y+5,V[0])}})},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({ph:f,by:-sw(f,n,1)*2,ht:sw(f,n,1,1)*.4,cj:(-88+sw(f,n,1)*3)*D,mo:f>=11&&f<=12?.6:0})},
   entrada:{nome:'Entrada (sobe do chão)',n:26,fps:12,f:null},
   ataque:{nome:'Raio da Morte',n:18,fps:13,hits:[10],tiro:'sombra',f:null},
   fase2:{nome:'Fase 2 (fogo verde)',n:20,fps:12,f:null},
   especial:{nome:'Erguer os Mortos',n:22,fps:12,f:null},
   especial2:{nome:'Drenar Alma',n:22,fps:13,hits:[8,15],f:null},
   buff:{nome:'Maldição Antiga',n:18,fps:12,f:null},
   defesa:{nome:'Filactério',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:28,fps:11,f:null}}};
LI.A.entrada.f=kf(LI.DEF,[[0,{by:26,al:0,chama:2,maos:0}],[4,{by:24,al:.4,chama:2}],[14,{e:'devagar',by:0,al:1,chama:2,ht:-1,mo:.4}],[18,{e:'rapido',aF:-60*D,aF2:-60*D,cj:-110*D,ht:-1,mo:1,runas:.6}],[22,{e:'segura',aF:-60*D,aF2:-60*D,cj:-110*D,ht:-1,mo:.6,runas:1}],[26,{e:'devagar',runas:0}]]);
LI.A.ataque.f=kf(LI.DEF,[[0,{}],[5,{e:'devagar',lean:-.15,aF:-80*D,aF2:-50*D,cj:-120*D,raio:.5}],[8,{e:'segura',lean:-.15,aF:-80*D,aF2:-50*D,cj:-120*D,raio:1}],[10,{e:'rapido',lean:.2,aF:0,aF2:-20*D,cj:-20*D,raio:0,mo:1}],[12,{e:'segura',lean:.2,aF:0,aF2:-20*D,cj:-20*D,mo:.6}],[18,{e:'devagar'}]]);
LI.A.fase2.f=kf(LI.DEF,[[0,{}],[4,{e:'devagar',by:2,ht:1,lean:.1}],[9,{e:'rapido',by:-3,ht:-1.4,mo:1.4,aF:-60*D,aF2:-60*D,cj:-110*D,aB:-40*D,aB2:-60*D,f2:1,runas:.5,sh:1}],[11,{by:-3,ht:-1.4,mo:1.4,aF:-60*D,aF2:-60*D,cj:-110*D,aB:-40*D,aB2:-60*D,f2:1,runas:1,sh:-1}],[15,{e:'segura',by:-3,ht:-1.4,mo:1,aF:-60*D,aF2:-60*D,cj:-110*D,aB:-40*D,aB2:-60*D,f2:1,runas:1,sh:0}],[20,{e:'devagar',f2:1,runas:0}]]);
LI.A.especial.f=kf(LI.DEF,[[0,{}],[5,{e:'devagar',aF:-100*D,aF2:-40*D,cj:-100*D,aB:-80*D,aB2:-40*D,ht:-1,mo:1}],[9,{aF:-105*D,aF2:-40*D,cj:-100*D,aB:-85*D,aB2:-40*D,ht:-1,mo:1,maos:.3}],[17,{e:'devagar',aF:-105*D,aF2:-40*D,cj:-100*D,aB:-85*D,aB2:-40*D,ht:-1,mo:.6,maos:1}],[22,{e:'devagar',maos:0}]]);
LI.A.especial2.f=kf(LI.DEF,[[0,{}],[4,{e:'devagar',aB:-10*D,aB2:-30*D,lean:.1}],[6,{aB:-15*D,aB2:-40*D,lean:.12,dreno:.05}],[11,{e:'linear',aB:-15*D,aB2:-40*D,lean:.12,dreno:.99,mo:1}],[12,{aB:-15*D,aB2:-40*D,dreno:0,mo:.4}],[13,{aB:-15*D,aB2:-40*D,dreno:.05}],[18,{e:'linear',aB:-15*D,aB2:-40*D,dreno:.99,mo:1}],[22,{e:'devagar',dreno:0}]]);
LI.A.buff.f=kf(LI.DEF,[[0,{}],[5,{e:'devagar',aF:-70*D,aF2:-60*D,cj:-110*D,runas:.4,ht:-.5}],[11,{aF:-75*D,aF2:-60*D,cj:-110*D,runas:1.2,mo:1,ht:-.5}],[15,{e:'segura',aF:-75*D,aF2:-60*D,cj:-110*D,runas:1.2,mo:.6}],[18,{e:'devagar',runas:0}]]);
LI.A.defesa.f=kf(LI.DEF,[[0,{}],[5,{e:'devagar',aB:-60*D,aB2:-50*D,fil:1,ht:-.5}],[13,{e:'segura',aB:-65*D,aB2:-50*D,fil:1,ht:-.5,chama:1.2}],[18,{e:'devagar',fil:0}]]);
LI.A.ferido.f=kf(LI.DEF,[[0,{}],[1,{e:'rapido',hx:19,lean:-.2,ht:-1.2,mo:1,olho:0}],[3,{hx:19,lean:-.1,ht:-.6}],[8,{}]]);
LI.A.morte.f=kf(LI.DEF,[[0,{}],[2,{e:'rapido',hx:19,lean:-.2,ht:-1.2,mo:1.4}],[6,{hx:19,lean:-.15,ht:-1.4,mo:1.6,sh:1,chama:2}],[8,{hx:19,lean:-.15,ht:-1.4,mo:1.6,sh:-1,chama:2,dead:1}],[16,{e:'devagar',hx:19,by:4,po:1,coroa:1,chama:0,dead:1,alma:.05}],[26,{e:'devagar',hx:19,by:4,po:1,coroa:1,dead:1,alma:1}],[28,{hx:19,by:4,po:1,coroa:1,dead:1,alma:0}]]);
ani(LI);

Object.assign(BICHOS,{reigoblin:RG,golem:GOL,rainha:RA,lich:LI});
})();
