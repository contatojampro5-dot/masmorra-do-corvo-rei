/* Inimigos articulados — Nível 3 (fortes): Zumbi, Cultista Encapuzado e Elemental de Fogo. Usa o motor de bichos.js. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,D,PI}=BICHO.util,GY=BICHO.GY;
const hx2=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));
const mixc=(a,b,t)=>{const A=hx2(a),B=hx2(b);return'#'+A.map((v,i)=>Math.round(lerp(v,B[i],Math.max(0,Math.min(1,t)))).toString(16).padStart(2,'0')).join('')};

/* =====================================================================================
   ZUMBI — anda mancando, braços para a frente
   ===================================================================================== */
const ZUM={nome:'Zumbi',nivel:3,
  DEF:{hx:19,hy:35,lean:10*D,fF:[24,GY],fB:[15,GY],aF:-4*D,aF2:0,aB:6*D,aB2:0,ht:.4,jaw:0,dead:0,rot:0,px:24,py:GY-1,fedor:0,sh:0},
  draw(pen,p){const S=['#4e6a40','#6f8a5c','#94ac7e'],R=['#22385e','#335488','#4a72aa'],CA='#4a3a2a';const hx=p.hx+p.sh;
    const hip=[hx,p.hy],neck=P(hip,-PI/2+p.lean,9),shF=[neck[0]+1,neck[1]+1.5],shB=[neck[0]-1,neck[1]+1.5];
    const perna=(h,f,col,pe)=>{const[k,ft]=ik(h,f,4.8,4.8,1);pen.line(h[0],h[1],k[0],k[1],col,2);pen.line(k[0],k[1],ft[0],ft[1],col,2);pen.line(ft[0]-1,ft[1]+.4,ft[0]+2,ft[1]+.4,pe)};
    const braco=(sh,a1,a2,manga,pele)=>{const e=P(sh,a1,4.5),h=P(e,a1+a2,4.5);pen.line(sh[0],sh[1],e[0],e[1],manga,2);pen.line(e[0],e[1],h[0],h[1],pele,2);pen.px(h[0]+Math.cos(a1+a2)*1.5,h[1]+Math.sin(a1+a2)*1.5,pele);return h};
    braco(shB,p.aB,p.aB2,R[0],S[0]);
    perna([hx-1,hip[1]],p.fB,CA,'#2a2018');
    // camisa rasgada
    pen.poly([[neck[0]-3.5,neck[1]],[neck[0]+3,neck[1]+.5],[hip[0]+3.5,hip[1]+1],[hip[0]+2,hip[1]+2.5],[hip[0]+.5,hip[1]+1],[hip[0]-1,hip[1]+3],[hip[0]-3.5,hip[1]+1]],R[1]);
    pen.line(neck[0]+3,neck[1]+.5,hip[0]+3.5,hip[1]+1,R[2]);const r=P(neck,PI/2+p.lean,4);pen.px(r[0]+1,r[1],S[1]);pen.px(r[0]+2,r[1]+1,S[1]);pen.px(r[0]+1,r[1]+1,S[0]);
    perna([hx+1,hip[1]],p.fF,'#5a4a36','#2a2018');
    // cabeça caída de lado
    const h=P(neck,-PI/2+p.lean+.25+p.ht*.35,3.8);
    pen.bola(h[0],h[1],3.6,3.4,S);pen.line(h[0]-3,h[1]-3,h[0]+1,h[1]-3.4,'#2a2a1e');pen.px(h[0]-2,h[1]-2.5,'#2a2a1e');pen.px(h[0]+1.5,h[1]-3.5,'#2a2a1e');
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.5),Math.round(h[1]-.5),'#1a2a10');else{pen.px(h[0]+1,h[1]-.6,'#f2ead8');pen.px(h[0]+2.6,h[1],'#d8d0a0');pen.px(h[0]+1.4,h[1]-.6,'#c0201a')}
    const jy=h[1]+2+p.jaw*2;pen.poly([[h[0],h[1]+1.4],[h[0]+3.5,h[1]+1.2],[h[0]+3,jy],[h[0]+.5,jy]],p.jaw>.2?'#2a1010':S[0]);pen.px(h[0]+1,h[1]+1.6,'#d8d0b0');pen.px(h[0]+2.5,h[1]+1.5,'#d8d0b0');
    braco(shF,p.aF,p.aF2,R[1],S[1]);
    // fedor (ondinhas verdes subindo)
    if(p.fedor>0){for(let i=0;i<3;i++){const x0=hx-4+i*4,y0=neck[1]-6-p.fedor*5-i;for(let k=0;k<5;k++)pen.px(x0+Math.sin(k*1.2+i)*1.2,y0-k,k%2?'#8ab84a':'#b8e07a')}}},
  A:{
   parado:{n:20,fps:8,loop:1,f:(f,n)=>{const a=sw(f,n,1),b=sw(f,n,2);return{lean:(10+a*4)*D,hx:19+a*.8,hy:35+(b>.6?1:0),ht:.4+a*.5,aF:(-4+b*6)*D,aB:(6-b*5)*D,jaw:(f>=12&&f<=14)?.7:0,fB:[15,GY-(a>.7?1:0)]}}},
   ataque:{nome:'Golpe Pútrido',n:18,fps:13,hits:[9],f:null},
   especial:{nome:'Mordida Infectada',n:18,fps:13,hits:[8],f:null},
   buff:{nome:'Gemido',n:18,fps:11,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
ZUM.A.ataque.f=kf(ZUM.DEF,[[0,{}],[5,{e:'devagar',hx:17,lean:-12*D,aF:-120*D,aF2:-10*D,aB:-105*D,aB2:-10*D,ht:-.6,jaw:.6,fF:[22,GY],fB:[13,GY]}],[7,{e:'segura',hx:17,lean:-12*D,aF:-120*D,aF2:-10*D,aB:-105*D,aB2:-10*D,ht:-.6,jaw:.6,fF:[22,GY],fB:[13,GY]}],
  [8,{e:'rapido',hx:23,lean:28*D,aF:20*D,aF2:20*D,aB:30*D,aB2:20*D,ht:.6,jaw:1,fF:[29,GY],fB:[16,GY]}],[9,{e:'rapido',hx:24,hy:36,lean:34*D,aF:50*D,aF2:20*D,aB:60*D,aB2:20*D,ht:.8,fF:[29,GY],fB:[16,GY]}],[12,{e:'segura',hx:24,hy:36,lean:34*D,aF:50*D,aF2:20*D,aB:60*D,aB2:20*D,ht:.8,fF:[29,GY],fB:[16,GY]}],[18,{e:'devagar'}]]);
ZUM.A.especial.f=kf(ZUM.DEF,[[0,{}],[4,{e:'devagar',hx:18,lean:4*D,aF:-20*D,aB:-15*D,jaw:.4}],[7,{e:'rapido',hx:26,hy:36,lean:30*D,aF:-25*D,aF2:15*D,aB:-15*D,aB2:15*D,jaw:1.2,ht:-.3,fF:[31,GY],fB:[18,GY]}],[8,{e:'rapido',hx:27,hy:36,lean:34*D,aF:-10*D,aF2:40*D,aB:0,aB2:40*D,jaw:0,fF:[31,GY],fB:[18,GY]}],
  [9,{hx:27,hy:36,lean:34*D,aF:-10*D,aF2:40*D,aB:0,aB2:40*D,jaw:.5,sh:1,fF:[31,GY],fB:[18,GY]}],[10,{hx:27,hy:36,lean:34*D,aF:-10*D,aF2:40*D,aB:0,aB2:40*D,jaw:0,sh:-1,fF:[31,GY],fB:[18,GY]}],[11,{hx:27,hy:36,lean:34*D,aF:-10*D,aF2:40*D,aB:0,aB2:40*D,jaw:.5,sh:0,fF:[31,GY],fB:[18,GY]}],[18,{e:'devagar'}]]);
ZUM.A.buff.f=kf(ZUM.DEF,[[0,{}],[4,{e:'devagar',lean:-8*D,ht:-1.4,jaw:1.3,aF:70*D,aB:80*D,fedor:.2}],[8,{lean:-12*D,ht:-1.6,jaw:1.5,aF:75*D,aB:85*D,fedor:.6,sh:1}],[10,{lean:-12*D,ht:-1.6,jaw:1.5,aF:75*D,aB:85*D,fedor:.8,sh:-1}],[12,{lean:-12*D,ht:-1.6,jaw:1.3,aF:75*D,aB:85*D,fedor:1,sh:0}],[18,{e:'devagar',fedor:0}]]);
ZUM.A.ferido.f=kf(ZUM.DEF,[[0,{}],[1,{e:'rapido',hx:16,lean:-14*D,ht:-1.6,jaw:1,aF:-40*D,aB:-30*D,fF:[21,GY],fB:[13,GY]}],[3,{hx:16,lean:-6*D,ht:-.8,jaw:.4,fF:[21,GY],fB:[13,GY]}],[8,{}]]);
ZUM.A.morte.f=kf(ZUM.DEF,[[0,{}],[2,{e:'rapido',hx:16,lean:-14*D,ht:-1.6,jaw:1,aF:-40*D,aB:-30*D,fF:[21,GY],fB:[13,GY]}],[6,{e:'devagar',hx:19,hy:39,lean:6*D,ht:1,jaw:.6,aF:80*D,aB:85*D,fF:[23,GY],fB:[15,GY]}],
  [11,{e:'rapido',hx:19,hy:39,lean:6*D,ht:1,aF:80*D,aB:85*D,fF:[23,GY],fB:[15,GY],rot:PI/2,dead:1}],[13,{hx:19,hy:39,lean:6*D,ht:1,aF:80*D,aB:85*D,fF:[23,GY],fB:[15,GY],rot:PI/2*.94,ty:-1,dead:1}],[15,{hx:19,hy:39,lean:6*D,ht:1,aF:80*D,aB:85*D,fF:[23,GY],fB:[15,GY],rot:PI/2,dead:1}],[20,{hx:19,hy:39,lean:6*D,ht:1,aF:80*D,aB:85*D,fF:[23,GY],fB:[15,GY],rot:PI/2,dead:1}]]);

/* =====================================================================================
   CULTISTA ENCAPUZADO — açoite com física, chama sombria e o círculo do ritual
   ===================================================================================== */
const CUL={nome:'Cultista Encapuzado',nivel:3,
  DEF:{hx:20,hy:34,lean:0,sw:0,aF:70*D,aF2:-30*D,aB:80*D,aB2:-30*D,ht:0,wh:100*D,lag:0,crack:0,sb:0,circ:0,ph:0,ajoe:0,colap:0,olho:1,dead:0,rot:0,px:20,py:GY},
  draw(pen,p){const R=['#4a1014','#7a1c22','#a8302e'],O='#b8902e',PE='#c8a890',ROXO=['#3a1250','#7a3ab0','#d0a0ff'];
    const col=p.colap,hipY=lerp(p.hy+p.ajoe*4,GY-2,col),hip=[p.hx+col*2,hipY],neck=P(hip,-PI/2+p.lean,lerp(9,1.5,col)),hem=GY;
    // círculo do ritual no chão
    if(p.circ>0){const cx=p.hx+1,r=10*p.circ;for(let a=0;a<PI*2;a+=.1){const x=cx+Math.cos(a)*r,y=GY+.5+Math.sin(a)*r*.22;pen.px(x,y,ROXO[1])}for(let i=0;i<6;i++){const a=p.ph*.6+i*PI/3,x=cx+Math.cos(a)*r*.7,y=GY+.5+Math.sin(a)*r*.15;pen.px(x,y,ROXO[2])}
      for(let i=0;i<5;i++){const t=(p.ph*.15+i/5)%1;pen.px(cx-6+i*3,GY-2-t*14*p.circ,t>.6?ROXO[1]:ROXO[2])}}
    // braço de trás (manga) com a chama sombria
    const sb=[neck[0]-1.5,neck[1]+1.5],eb=P(sb,p.aB,4),hb=P(eb,p.aB+p.aB2,3.5);pen.line(sb[0],sb[1],eb[0],eb[1],R[0],2);pen.line(eb[0],eb[1],hb[0],hb[1],R[0],2);pen.px(hb[0],hb[1],PE);
    // manto: do pescoço até a barra, abre embaixo, barra rasgada
    const w0=3,w1=6.5+p.sw*.5;const pts=[[neck[0]-w0,neck[1]],[neck[0]+w0,neck[1]+.5],[hip[0]+4.5,hip[1]],[hip[0]+w1+p.sw,hem]];
    for(let i=0;i<=6;i++){const t=i/6;pts.push([lerp(hip[0]+w1+p.sw,hip[0]-w1-1+p.sw*.6,t),hem-(i%2?1.5:0)])}pts.push([hip[0]-w1-1+p.sw*.6,hem]);pts.push([hip[0]-4.5,hip[1]]);
    pen.poly(pts,R[1]);pen.line(neck[0]+w0,neck[1]+.5,hip[0]+w1+p.sw,hem,R[2]);pen.line(neck[0]-w0,neck[1],hip[0]-w1+p.sw*.6,hem,R[0]);
    pen.line(neck[0]+.5,neck[1]+1,lerp(neck[0],hip[0],1)+1+p.sw*.5,hem-1,O);pen.line(hip[0]-4,hip[1]+1,hip[0]+4.5,hip[1]+1,'#2a0a0c');
    // capuz pontudo com rosto escuro e olhos acesos
    const h=[neck[0]+1+p.ht*.3,neck[1]-3.6+col*1.5];
    pen.poly([[h[0]-4,h[1]+3.5],[h[0]-4.5,h[1]-1],[h[0]-2,h[1]-5],[h[0]-4,h[1]-7.5],[h[0]+1,h[1]-5],[h[0]+4,h[1]-2],[h[0]+4.5,h[1]+3.5]],R[1]);
    pen.line(h[0]-2,h[1]-5,h[0]+4,h[1]-2,R[2]);pen.ell(h[0]+1.6,h[1]+.4,2.4,2.8,'#120408');
    if(p.olho>0&&p.dead<.5){const c=p.circ>.3?'#d0a0ff':'#ff3a2a';pen.px(h[0]+1,h[1]-.2,c);pen.px(h[0]+2.6,h[1]-.2,c)}
    // braço da frente com o açoite
    const sf=[neck[0]+1.5,neck[1]+1.5],ef=P(sf,p.aF,4),hf=P(ef,p.aF+p.aF2,3.5);
    if(col<.8){let q=hf;for(let i=1;i<=11;i++){const t=i/11,a=p.wh+p.lag*Math.pow(t,1.4)+Math.sin(t*5-p.ph*.9)*.12*(1-p.crack),n=P(q,a,2.1);pen.line(q[0],q[1],n[0],n[1],i<3?'#3a2414':'#5c3a1e');q=n}
      if(p.crack>0){pen.px(q[0]+1,q[1],'#fff');pen.px(q[0]-1,q[1],'#ffe9a8');pen.px(q[0],q[1]-1,'#ffe9a8');pen.px(q[0],q[1]+1,'#ffe9a8')}}
    else{pen.line(hip[0]+3,GY,hip[0]+14,GY,'#5c3a1e')}
    pen.line(sf[0],sf[1],ef[0],ef[1],R[1],2);pen.line(ef[0],ef[1],hf[0],hf[1],R[1],2);pen.px(hf[0],hf[1],PE);
    // chama sombria na mão de trás (por cima de tudo para aparecer)
    if(p.sb>0){const r=1+p.sb*2.6,c=[hb[0],hb[1]-r*.6];pen.ell(c[0],c[1],r+1,r+1,ROXO[0]);pen.ell(c[0],c[1],r,r,ROXO[1]);pen.ell(c[0]-.3,c[1]-.3,r*.45,r*.45,ROXO[2]);pen.px(c[0]+Math.sin(p.ph)*1,c[1]-r-1.5,ROXO[1]);pen.info.boca=c}else pen.info.boca=hb},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>({sw:sw(f,n,1)*1.2,hy:34+(sw(f,n,2)>.6?1:0),ph:f,ht:sw(f,n,1,2)>.85?.8:0,olho:f===10?0:1,lag:sw(f,n,1)*.3})},
   ataque:{nome:'Açoite',n:16,fps:14,hits:[8],f:null},
   especial:{nome:'Chama Sombria',n:24,fps:14,hits:[10,18],tiro:'sombra',f:null},
   buff:{nome:'Prece Profana',n:22,fps:11,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
const cp=f=>o=>({...o,ph:f});
CUL.A.ataque.f=f=>cp(f)(kf(CUL.DEF,[[0,{}],[4,{e:'devagar',hx:18,lean:-10*D,aF:-130*D,aF2:-20*D,wh:-150*D,lag:60*D,sw:-1}],[6,{e:'segura',hx:18,lean:-10*D,aF:-130*D,aF2:-20*D,wh:-150*D,lag:60*D,sw:-1}],
  [7,{e:'rapido',hx:22,lean:14*D,aF:-20*D,aF2:0,wh:-60*D,lag:90*D,sw:2}],[8,{e:'rapido',hx:23,lean:16*D,aF:10*D,aF2:0,wh:5*D,lag:-30*D,crack:1,sw:2}],[10,{e:'segura',hx:23,lean:16*D,aF:20*D,aF2:0,wh:25*D,lag:-10*D,sw:1}],[16,{e:'devagar'}]])(f));
CUL.A.especial.f=f=>cp(f)(kf(CUL.DEF,[[0,{}],[4,{e:'devagar',lean:-8*D,aB:-100*D,aB2:-20*D,sb:.6,ht:-.5}],[8,{e:'segura',lean:-8*D,aB:-110*D,aB2:-20*D,sb:1,ht:-.5}],[10,{e:'rapido',hx:22,lean:12*D,aB:-10*D,aB2:0,sb:0,sw:2}],
  [12,{e:'devagar',lean:-8*D,aB:-100*D,aB2:-20*D,sb:.6}],[16,{e:'segura',lean:-8*D,aB:-110*D,aB2:-20*D,sb:1}],[18,{e:'rapido',hx:22,lean:12*D,aB:-10*D,aB2:0,sb:0,sw:2}],[24,{e:'devagar'}]])(f));
CUL.A.buff.f=f=>cp(f)(kf(CUL.DEF,[[0,{}],[5,{e:'devagar',ajoe:1,lean:8*D,aF:-80*D,aF2:-40*D,aB:-70*D,aB2:-40*D,ht:-1,wh:80*D,circ:.3}],[10,{e:'devagar',ajoe:1,lean:4*D,aF:-95*D,aF2:-30*D,aB:-85*D,aB2:-30*D,ht:-1.2,wh:80*D,circ:1}],[17,{e:'segura',ajoe:1,lean:4*D,aF:-95*D,aF2:-30*D,aB:-85*D,aB2:-30*D,ht:-1.2,wh:80*D,circ:1}],[22,{e:'devagar',circ:0}]])(f));
CUL.A.ferido.f=f=>cp(f)(kf(CUL.DEF,[[0,{}],[1,{e:'rapido',hx:17,lean:-16*D,ht:-1.4,aF:-50*D,aB:-40*D,sw:-2,lag:40*D,olho:0}],[3,{hx:17,lean:-8*D,ht:-.6,sw:-1}],[8,{}]])(f));
CUL.A.morte.f=f=>cp(f)(kf(CUL.DEF,[[0,{}],[2,{e:'rapido',hx:17,lean:-16*D,ht:-1.4,aF:-50*D,aB:-40*D,sw:-2,olho:.5}],[6,{e:'devagar',hx:18,lean:10*D,ht:1,aF:90*D,aB:90*D,olho:.3,colap:.2}],[13,{e:'rapido',hx:18,lean:20*D,ht:1,aF:110*D,aB:110*D,olho:0,colap:1,dead:1}],[15,{hx:18,lean:20*D,ht:1,aF:110*D,aB:110*D,olho:0,colap:.94,dead:1}],[20,{hx:18,lean:20*D,ht:1,aF:110*D,aB:110*D,olho:0,colap:1,dead:1}]])(f));

/* =====================================================================================
   ELEMENTAL DE FOGO — corpo de chamas que tremulam sempre
   ===================================================================================== */
function labareda(pen,cx,base,w,h,ph,col,k=0){
  // contorno: base pontuda, lados bojudos, três línguas no topo
  const L=[];L.push([cx-.5,base+h*.12]);L.push([cx-w*.75,base-h*.18]);L.push([cx-w,base-h*.45]);
  const lin=[[-.65,.92],[-.1,1.12],[.5,.98]];L.push([cx-w*.85,base-h*.7]);
  for(let i=0;i<3;i++){const[ox,hh]=lin[i],fl=Math.sin(ph*3.1+i*2.2+k)*.12;L.push([cx+ox*w-w*.18,base-h*(.72+fl*.3)]);L.push([cx+ox*w+Math.sin(ph*2+i+k)*.8,base-h*(hh+fl)]);L.push([cx+ox*w+w*.2,base-h*(.74+fl*.3)])}
  L.push([cx+w*.9,base-h*.62]);L.push([cx+w,base-h*.4]);L.push([cx+w*.7,base-h*.15]);
  pen.poly(L,col);return L}
const ELE={nome:'Elemental de Fogo',nivel:3,voa:1,
  DEF:{bx:0,by:0,es:1,ph:0,olho:1,mo:.3,aF:0,aB:0,nuc:0,quente:0,anel:0,fb:0,dead:0,apaga:0,sh:0,rot:0,px:24,py:30},
  draw(pen,p){const q=p.quente,es=p.es,cx=24+p.bx+p.sh,base=34+p.by;
    const C=[mixc('#a8281a','#ff7a3a',q),mixc('#e8601e','#ffc070',q),mixc('#ffb43a','#fff0c0',q),mixc('#fff0b0','#ffffff',q)];
    // anel da explosão
    if(p.anel>0){const r=6+p.anel*20;for(let a=0;a<PI*2;a+=.07){const x=cx+Math.cos(a)*r,y=base-8+Math.sin(a)*r*.75;pen.px(x,y,p.anel<.5?'#fff0b0':'#ff8a2a');if(p.anel<.6)pen.px(x+Math.cos(a),y+Math.sin(a),'#ffb43a')}}
    if(es<=.05)return;
    // braço de trás (labareda)
    const bB=[cx-5*es,base-7*es],tB=[bB[0]-3-p.aB*6,bB[1]+1-p.aB*3];pen.line(bB[0],bB[1],tB[0],tB[1],C[0],2);pen.px(tB[0]-1,tB[1],C[1]);
    labareda(pen,cx,base,8*es,17*es,p.ph,C[0],0);
    labareda(pen,cx+.5,base-1*es,6*es,13*es,p.ph+1.3,C[1],1);
    labareda(pen,cx+1,base-2.5*es,3.8*es,8.5*es,p.ph+2.6,C[2],2);
    if(p.nuc>0)pen.ell(cx+1,base-6*es,2.5*es*p.nuc+.5,3*es*p.nuc+.5,C[3]);
    // rosto
    const fy=base-9*es;
    if(p.dead>.5){olhoX(pen,Math.round(cx),Math.round(fy),'#5a1a08');olhoX(pen,Math.round(cx+4),Math.round(fy),'#5a1a08')}
    else if(p.olho>0){pen.poly([[cx-1.5,fy-1],[cx+1.5,fy],[cx-1.2,fy+1]],'#4a1006');pen.poly([[cx+2.5,fy],[cx+5.5,fy-1],[cx+5.2,fy+1]],'#4a1006')}
    if(p.mo>0)pen.ell(cx+2,fy+3.5,1.4+p.mo,.6+p.mo*1.4,'#4a1006');
    // braço da frente (labareda) com bola de fogo
    const bF=[cx+5*es,base-7*es],tF=[bF[0]+3+p.aF*7,bF[1]+1-p.aF*2];pen.line(bF[0],bF[1],tF[0],tF[1],C[1],2);pen.px(tF[0]+1,tF[1],C[2]);
    pen.info.boca=tF;
    if(p.fb>0){const r=1+p.fb*2.8,c=[tF[0]+1,tF[1]-r*.4];pen.ell(c[0],c[1],r+1,r+1,C[0]);pen.ell(c[0],c[1],r,r,C[1]);pen.ell(c[0],c[1],r*.5,r*.5,C[3]);pen.info.boca=c}
    // faíscas e fumaça
    for(let i=0;i<3;i++){const t=((p.ph*.13+i/3)%1);pen.px(cx-3+i*3+Math.sin(p.ph+i)*1.5,base-17*es-t*8,t>.5?C[1]:C[2])}
    if(p.apaga>0){pen.st.a=.7;for(let i=0;i<5;i++){const t=(p.apaga+i/5)%1;pen.ell(cx+Math.sin(t*7+i)*2,base-4-t*16,1+t*1.8,1+t*1.8,'#5a5050')}pen.st.a=1}},
  A:{
   parado:{n:12,fps:12,loop:1,f:(f,n)=>({ph:f/n*2*PI*2,by:-sw(f,n,1)*1.5,es:1+sw(f,n,2)*.03,aF:sw(f,n,1)*.2,aB:sw(f,n,1,1)*.2,mo:.3+sw(f,n,3)*.2})},
   ataque:{nome:'Chama',n:16,fps:13,hits:[9],tiro:'fogo',f:null},
   especial:{nome:'Explosão',n:24,fps:13,hits:[14],f:null},
   buff:{nome:'Inflamar',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:22,fps:12,f:null}}};
const ep=f=>o=>({...o,ph:f*.9});
ELE.A.ataque.f=f=>ep(f)(kf(ELE.DEF,[[0,{}],[4,{e:'devagar',bx:-2,aF:-.6,fb:.6,mo:.6}],[7,{e:'segura',bx:-2,aF:-.7,fb:1,mo:.8}],[9,{e:'rapido',bx:3,aF:1.2,fb:0,mo:1}],[11,{e:'segura',bx:3,aF:1.1,mo:.8}],[16,{e:'devagar'}]])(f));
ELE.A.especial.f=f=>ep(f)(kf(ELE.DEF,[[0,{}],[4,{e:'devagar',es:1.1,nuc:.4,mo:.8}],[8,{e:'devagar',es:1.28,nuc:1,mo:1,olho:.5,sh:1}],[10,{es:1.3,nuc:1,mo:1,sh:-1}],[12,{es:1.32,nuc:1,mo:1.2,sh:1}],[13,{e:'segura',es:1.32,nuc:1,mo:1.2,sh:0}],
  [14,{e:'rapido',es:.85,nuc:0,mo:1.4,anel:.1,aF:1,aB:1}],[18,{e:'devagar',es:.9,anel:1,aF:.4,aB:.4}],[19,{es:.9,anel:0}],[24,{e:'devagar'}]])(f));
ELE.A.buff.f=f=>ep(f)(kf(ELE.DEF,[[0,{}],[4,{e:'devagar',es:.9,mo:.2}],[8,{e:'rapido',es:1.3,quente:1,mo:1,by:-2,aF:-.5,aB:-.5}],[14,{e:'segura',es:1.3,quente:1,mo:1,by:-2,aF:-.5,aB:-.5}],[18,{e:'devagar',es:1.12,quente:.6}]])(f));
ELE.A.ferido.f=f=>ep(f)(kf(ELE.DEF,[[0,{}],[1,{e:'rapido',bx:-4,es:.78,olho:0,mo:1,sh:1}],[3,{bx:-4,es:.9,sh:-1}],[8,{}]])(f));
ELE.A.morte.f=f=>ep(f)(kf(ELE.DEF,[[0,{}],[2,{e:'rapido',bx:-3,es:.8,olho:0,mo:1.2,sh:1}],[6,{bx:-3,es:1.1,mo:1.4,dead:1,sh:-1}],[13,{e:'devagar',bx:-3,by:6,es:.25,mo:0,dead:1,apaga:.2}],[16,{bx:-3,by:7,es:0,dead:1,apaga:.5}],[22,{e:'linear',bx:-3,by:7,es:0,dead:1,apaga:1}]])(f));

Object.assign(BICHOS,{zumbi:ZUM,cultista:CUL,elemental:ELE});
})();
