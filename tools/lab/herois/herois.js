/* Heróis articulados: Caçadora das Brumas, Mago Arcano, Guardião de Ferro e Necromante.
   Mesmo estilo do Cavaleiro novo (pixels sem contorno preto, luz do ato nas bordas). Olham para a DIREITA (não espelha).
   Cada um tem as 6 armas da forja (parâmetro "arma", mesma ordem do jogo: wIdx 0..5) e 8 movimentos.
   Usa o motor de tools/lab/inimigos/bichos.js. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,D,PI}=BICHO.util;
const W=48,H=64,GY=58;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],dit=(x,y,a)=>(BAY[((y|0)&3)*4+((x|0)&3)]+.5)/16<a;
const PELE=['#c88a6a','#e8b890','#f4d0b0'];
const DEFB={hx:21,hy:40,lean:3*D,fF:[25,GY],fB:[18,GY],aF:60*D,aF2:-40*D,aB:70*D,aB2:-30*D,ht:0,mo:0,capa:0,ph:0,arma:0,dead:0,rot:0,px:21,py:GY,tx:0,ty:0,al:1,sh:0,br:0};

/* corpo comum: pernas com IK, tronco, cabeça; devolve os pontos para cada herói vestir */
function corpo(pen,p,o){const hip=[p.hx+p.sh,p.hy],lean=p.lean,neck=P(hip,-PI/2+lean,o.tronco||10),br=p.br||0;neck[1]-=br*.6;
  const shF=[neck[0]+1.5,neck[1]+1.5],shB=[neck[0]-1.5,neck[1]+1.5],head=[neck[0]+1.2+p.ht*.6,neck[1]-4.2+Math.abs(p.ht)*.3];
  const perna=(h,f,c,bota)=>{const[k,ft]=ik(h,f,o.perna||6,o.perna||6,1);pen.line(h[0],h[1],k[0],k[1],c[0],o.gross||2);pen.line(k[0],k[1],ft[0],ft[1],c[1],2);pen.px(k[0]+1,k[1],c[2]||c[1]);pen.line(ft[0]-1,ft[1]-.5,ft[0]+2.5,ft[1]-.5,bota,2);return k};
  const braco=(sh,a1,a2,c,mao,L=4.5)=>{const e=P(sh,a1,L),h=P(e,a1+a2,L);pen.line(sh[0],sh[1],e[0],e[1],c[0],2);pen.line(e[0],e[1],h[0],h[1],c[1],2);if(mao)pen.px(h[0],h[1],mao);return{e,h}};
  return{hip,neck,shF,shB,head,perna,braco}}
function anima(B){for(const k in B.A){const A=B.A[k];if(A.loop||!A.f)continue;const g=A.f;A.f=f=>({...g(f),ph:f})}}

/* =====================================================================================
   CAÇADORA DAS BRUMAS — capuz verde, arco evolutivo, aljava nas costas
   ===================================================================================== */
const ARCOS=[{n:'Arco de Freixo',m:['#8a5a30','#5a3a1a'],c:'#e8e0d0'},{n:'Arco Longo de Teixo',m:['#4a2a1a','#2a160c'],c:'#e8e0d0',ponta:'#c8d2dc'},
  {n:'Arco de Espinhos',m:['#2a4a22','#14260f'],c:'#b8ffb0',esp:1},{n:'Arco da Floresta Viva',m:['#3a7a2a','#1e4a16'],c:'#d8ffb0',folha:1,flor:1},
  {n:'Arco de Prata',m:['#a8b4c4','#6a7686'],c:'#ffffff',prata:1},{n:'Arco da Lua',m:['#c8d8f0','#7a8ab0'],c:'#ffffff',lua:1}];
const CAC={nome:'Caçadora das Brumas',W,H,GY,semEspelho:1,armas:ARCOS.map(a=>a.n),
  DEF:{...DEFB,mira:55*D,puxa:0,flecha:0,marca:0,cabelo:0},molas:['capa','cabelo'],
  draw(pen,p){const V=['#1e3616','#33521f','#4e7a32'],C=['#3a2414','#5c3a1e','#7e5430'],A=ARCOS[p.arma|0];
    const B=corpo(pen,p,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    // capa verde atrás, com névoa na barra
    const cw=p.capa;pen.poly([[neck[0]-3,neck[1]-1],[neck[0]+1,neck[1]],[hip[0]-2,hip[1]+6],[hip[0]-7-cw,GY-4+Math.abs(cw)*.3],[hip[0]-9-cw*1.3,hip[1]+4]],V[1]);pen.line(neck[0]-3,neck[1]-1,hip[0]-9-cw*1.3,hip[1]+4,V[2]);
    for(let i=0;i<4;i++){const x=hip[0]-8-cw+i*1.5;pen.px(x,GY-4+i%2+Math.abs(cw)*.3,V[0])}
    // aljava com flechas
    const aq=P(neck,PI/2+p.lean,3);pen.line(aq[0]-4,aq[1]+5,aq[0]-1,aq[1]-4,C[0],3);for(let i=0;i<3;i++){pen.line(aq[0]-1.5+i,aq[1]-4,aq[0]-.5+i,aq[1]-7,'#e8e0d0');pen.px(aq[0]-.5+i,aq[1]-7.5,'#c0302a')}
    B.perna([hip[0]-1,hip[1]+1],p.fB,[C[0],C[0]],'#2a1a10');
    // túnica de couro e cinto
    pen.poly([[neck[0]-3,neck[1]],[neck[0]+3,neck[1]+.5],[hip[0]+3.5,hip[1]+3],[hip[0]-3.5,hip[1]+3]],V[1]);pen.line(neck[0]+3,neck[1]+.5,hip[0]+3.5,hip[1]+3,V[2]);
    pen.line(hip[0]-3.5,hip[1],hip[0]+3.5,hip[1],C[1],2);pen.px(hip[0]+1,hip[1],'#c8a040');
    B.perna([hip[0]+1,hip[1]+1],p.fF,[C[1],C[2],C[2]],'#3a2414');
    // cabeça: rosto, rabo de cavalo ruivo, capuz
    pen.line(head[0]-2.5,head[1]-1,head[0]-6-p.cabelo,head[1]+3+p.cabelo*.3,'#8a3a1a',2);pen.px(head[0]-6.5-p.cabelo,head[1]+4,'#a04a20');
    pen.bola(head[0]+.5,head[1]+.3,3.2,3.4,PELE);
    pen.poly([[head[0]-3.8,head[1]+2],[head[0]-3.6,head[1]-2.5],[head[0]-1,head[1]-4.6],[head[0]+2.8,head[1]-3.8],[head[0]+3.6,head[1]-1.5],[head[0]+1,head[1]-2.2],[head[0]-1.5,head[1]+.5],[head[0]-2.4,head[1]+3]],V[1]);pen.line(head[0]-1,head[1]-4.6,head[0]+2.8,head[1]-3.8,V[2]);
    if(p.dead>.5)olhoX(pen,Math.round(head[0]+1.6),Math.round(head[1]),'#3a2a1a');else{pen.px(head[0]+1.6,head[1]-.2,'#2a6a3a');pen.px(head[0]+2.4,head[1]-.2,'#ffffff')}
    pen.px(head[0]+1.8,head[1]+1.8,p.mo>.3?'#8a3a2a':'#c87a60');
    // arco na mão de trás, apontado; a mão da frente puxa a corda
    const dir=p.mira,hBow=P(shB,dir,8),corda=P(hBow,dir+PI,2+p.puxa*7.5);
    const eB=[lerp(shB[0],hBow[0],.5),lerp(shB[1],hBow[1],.5)+.8];pen.line(shB[0],shB[1],eB[0],eB[1],V[0],2);pen.line(eB[0],eB[1],hBow[0],hBow[1],PELE[0],2);
    const t1=P(P(hBow,dir-PI/2,8),dir+PI,2.2),t2=P(P(hBow,dir+PI/2,8),dir+PI,2.2),q1=P(hBow,dir-PI/2,4.2),q2=P(hBow,dir+PI/2,4.2),fwd=P([0,0],dir,1.1);
    const curva=[t1,[q1[0]+fwd[0],q1[1]+fwd[1]],[hBow[0]+fwd[0]*1.3,hBow[1]+fwd[1]*1.3],[q2[0]+fwd[0],q2[1]+fwd[1]],t2];
    for(let i=0;i<curva.length-1;i++)pen.line(curva[i][0],curva[i][1],curva[i+1][0],curva[i+1][1],i%2?A.m[1]:A.m[0],2);
    if(A.ponta||A.prata||A.lua){pen.px(t1[0],t1[1],A.lua?'#ffffff':'#c8d2dc');pen.px(t2[0],t2[1],A.lua?'#ffffff':'#c8d2dc')}
    if(A.esp)for(const q of [q1,q2,curva[2]]){pen.px(q[0]-1,q[1]-1,'#a8d890');pen.px(q[0]+.5,q[1]+1.5,'#c0201a')}
    if(A.folha)for(const [q,s] of [[q1,-1],[q2,1],[t1,-1]]){pen.ell(q[0]-1,q[1]+s,1.2,.8,'#5ac04a')}
    if(A.flor){pen.px(q1[0]-1.5,q1[1],'#ff9ad0');pen.px(q2[0]-1.5,q2[1],'#ffffff');pen.px(curva[2][0]-1,curva[2][1]-1.2,'#ffd0f0')}
    if(A.lua){const m=curva[2];pen.ell(m[0]-.5,m[1],1.6,1.6,'#e8f0ff');pen.ell(m[0]+.3,m[1]-.3,1.2,1.2,A.m[1])}
    pen.line(t1[0],t1[1],corda[0],corda[1],A.c);pen.line(corda[0],corda[1],t2[0],t2[1],A.c);
    pen.info.boca=P(hBow,dir,2);
    const flecha=p.flecha,lua=A.lua||A.prata,ph=p.ph;
    if(flecha>.5){const tip=P(corda,dir,12);pen.line(corda[0],corda[1],tip[0],tip[1],lua?'#d8e8ff':'#9a7a50');pen.px(tip[0],tip[1],'#e8eef6');pen.px(corda[0],corda[1]-1,'#c0302a');pen.px(corda[0],corda[1]+1,'#c0302a')}
    // braço da frente na corda
    const eF=[lerp(shF[0],corda[0],.5),lerp(shF[1],corda[1],.5)+1.5];pen.line(shF[0],shF[1],eF[0],eF[1],V[2],2);pen.line(eF[0],eF[1],corda[0],corda[1],PELE[1],2);
    const marca=p.marca;
    pen.depois(pn=>{if(lua&&flecha>.5){const tip=P(corda,dir,12);for(let r=0;r<=12;r+=2){const q=P(corda,dir,r);pn.px(q[0],q[1]-1,'#a8c8ff')}pn.px(tip[0],tip[1],'#ffffff')}
      if(A.lua||A.prata){const m=curva[2];for(let i=0;i<3;i++){const k=((ph*.06+i/3)%1);pn.px(m[0]+Math.sin(ph*.3+i)*3,m[1]-2-k*7,A.lua?'#d8e8ff':'#e8eef6')}}
      if(A.flor&&ph%8<4)pn.px(q1[0]-2,q1[1]-1.5,'#ffe0f0');
      if(marca>0){const c=[W-6,26];for(let a=0;a<PI*2;a+=.25){if(dit(c[0]+Math.cos(a)*4,c[1]+Math.sin(a)*4,marca))pn.px(c[0]+Math.cos(a)*4*marca,c[1]+Math.sin(a)*4*marca,'#ff6a4a')}pn.line(c[0]-2,c[1],c[0]+2,c[1],'#ff8a6a');pn.line(c[0],c[1]-2,c[0],c[1]+2,'#ff8a6a');pn.px(head[0]+2.4,head[1]-.2,'#ffd0a0')}})},
  A:{
   parado:{n:20,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:1+sw(f,n,1,1)*1.4,cabelo:sw(f,n,1,.6)*1.2,mira:(55+b*5)*D,ht:sw(f,n,1,2)>.85?-.5:0,lean:(3+b*2)*D,ph:f}}},
   ataque:{nome:'Disparo',n:16,fps:14,hits:[9],tiro:'flecha',f:null},
   especial:{nome:'Rajada',n:22,fps:16,hits:[7,12,17],tiro:'flecha',f:null},
   defesa:{nome:'Esquivar',n:14,fps:14,f:null},
   buff:{nome:'Tiro Marcado',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},vitoria:{nome:'Vitória',n:18,fps:12,f:null},morte:{n:20,fps:12,f:null}}};
const MIRA={mira:-4*D,lean:-2*D,fF:[26,GY],fB:[16,GY]};
CAC.A.ataque.f=kf(CAC.DEF,[[0,{}],[4,{e:'devagar',...MIRA,flecha:1}],[7,{e:'devagar',...MIRA,flecha:1,puxa:1,lean:-5*D,ht:.2}],[8,{e:'segura',...MIRA,flecha:1,puxa:1,lean:-5*D}],[9,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-9*D,hx:20,capa:3,cabelo:2}],[11,{e:'segura',...MIRA,lean:-7*D,hx:20}],[16,{e:'devagar'}]]);
CAC.A.especial.f=kf(CAC.DEF,[[0,{}],[3,{e:'devagar',...MIRA,flecha:1}],[6,{e:'rapido',...MIRA,flecha:1,puxa:1}],[7,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-8*D,capa:3}],[9,{e:'rapido',...MIRA,flecha:1,puxa:.2,mira:-8*D}],[11,{e:'rapido',...MIRA,flecha:1,puxa:1,mira:-8*D}],[12,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-8*D,mira:-8*D,capa:3}],
  [14,{e:'rapido',...MIRA,flecha:1,puxa:.2,mira:0}],[16,{e:'rapido',...MIRA,flecha:1,puxa:1,mira:0}],[17,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-10*D,capa:4,cabelo:2}],[22,{e:'devagar'}]]);
CAC.A.defesa.f=kf(CAC.DEF,[[0,{}],[2,{e:'devagar',hy:42,lean:10*D}],[5,{e:'rapido',hx:15,hy:30,lean:-20*D,fF:[20,GY-9],fB:[13,GY-8],capa:5,cabelo:3,mira:20*D}],[7,{hx:13,hy:31,lean:-26*D,fF:[18,GY-8],fB:[11,GY-7],capa:5}],[10,{e:'rapido',hx:13,hy:42,lean:-4*D,fF:[17,GY],fB:[9,GY],capa:2}],[14,{e:'devagar'}]]);
CAC.A.buff.f=kf(CAC.DEF,[[0,{}],[4,{e:'devagar',mira:-10*D,lean:-2*D,ht:-.3,fF:[26,GY]}],[8,{e:'segura',mira:-12*D,ht:-.4,marca:.3,fF:[26,GY]}],[12,{e:'devagar',mira:-12*D,ht:-.4,marca:1,fF:[26,GY]}],[15,{e:'segura',mira:-12*D,marca:1,fF:[26,GY]}],[18,{e:'devagar',marca:0}]]);
CAC.A.ferido.f=kf(CAC.DEF,[[0,{}],[1,{e:'rapido',hx:18,lean:-16*D,ht:-1,mo:1,capa:-3,cabelo:-3,fF:[23,GY],fB:[15,GY]}],[3,{hx:18,lean:-8*D,fF:[23,GY],fB:[15,GY]}],[8,{}]]);
CAC.A.vitoria.f=kf(CAC.DEF,[[0,{}],[5,{e:'devagar',mira:-80*D,lean:-6*D,ht:-1,mo:1,capa:3,hy:39}],[14,{e:'segura',mira:-82*D,lean:-6*D,ht:-1,mo:.6,capa:2,hy:39}],[18,{mira:-82*D,lean:-6*D,ht:-1,capa:2,hy:39}]]);
CAC.A.morte.f=kf(CAC.DEF,[[0,{}],[2,{e:'rapido',hx:18,lean:-18*D,ht:-1,mo:1,capa:-3,fF:[23,GY],fB:[15,GY]}],[7,{e:'devagar',hx:20,hy:46,lean:16*D,ht:1,fF:[27,GY],fB:[15,GY-.5],mira:80*D}],[12,{e:'rapido',hx:20,hy:46,lean:16*D,ht:1,fF:[27,GY],fB:[15,GY],mira:90*D,rot:PI/2,px:30,py:GY-1,tx:-2,ty:-3,dead:1}],[14,{hx:20,hy:46,lean:16*D,fF:[27,GY],fB:[15,GY],mira:90*D,rot:PI/2*.95,px:30,py:GY-1,tx:-2,ty:-4,dead:1}],[20,{hx:20,hy:46,lean:16*D,fF:[27,GY],fB:[15,GY],mira:90*D,rot:PI/2,px:30,py:GY-1,tx:-2,ty:-3,dead:1}]]);
anima(CAC);

/* =====================================================================================
   MAGO ARCANO — manto azul, chapéu pontudo, cajado evolutivo
   ===================================================================================== */
const CAJ=[{n:'Cajado de Freixo',m:['#8a6038','#5a3a1a'],mg:['#2a6ab0','#4ab0ff','#cfefff']},{n:'Cajado Rúnico',m:['#5a4a6a','#2a2234'],mg:['#2a6ab0','#4ab0ff','#cfefff'],runa:1},
  {n:'Cajado de Gelo',m:['#8aa8c0','#4a6880'],mg:['#6ac8f0','#a8e8ff','#ffffff'],gelo:1},{n:'Cajado do Inverno Eterno',m:['#c8e0f0','#6a90b0'],mg:['#6ac8f0','#a8e8ff','#ffffff'],gelo:2},
  {n:'Cajado de Ametista',m:['#3a2a4a','#1c1424'],mg:['#7a3ab0','#b06aff','#f0d8ff'],ame:1},{n:'Cajado da Tempestade',m:['#4a3a5a','#241a30'],mg:['#a050e0','#d0a0ff','#fff6a0'],raio:1}];
const MAG={nome:'Mago Arcano',W,H,GY,semEspelho:1,armas:CAJ.map(a=>a.n),
  DEF:{...DEFB,cj:-84*D,carga:0,orb:0,dome:0,runas:0,levita:0,chapeu:0,circ:0},molas:['capa','chapeu'],
  draw(pen,p){const R=['#162c54','#24467e','#3a64a8','#5a84c8'],O=['#8a6a1a','#c8a040'],A=CAJ[p.arma|0];
    const hy0=p.hy-p.levita*4;const q={...p,hy:hy0};const B=corpo(pen,q,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    // braço de trás
    B.braco(shB,p.aB,p.aB2,[R[0],R[0]],PELE[0]);
    // manto até o chão (abre um pouco), barra dourada
    const hem=GY-p.levita*4,w1=6.5+p.capa*.3;pen.poly([[neck[0]-3.5,neck[1]],[neck[0]+3.5,neck[1]+.5],[hip[0]+w1,hem],[hip[0]-w1-1,hem]],R[1]);pen.line(neck[0]+3.5,neck[1]+.5,hip[0]+w1,hem,R[2]);pen.line(hip[0]-w1-1,hem-1,hip[0]+w1,hem-1,O[1]);
    pen.line(neck[0]+.5,neck[1]+1,hip[0]+1,hem-1,R[0]);pen.line(hip[0]-3.5,hip[1],hip[0]+4,hip[1],'#3a2a14',2);pen.px(hip[0]+1,hip[1],O[1]);
    if(p.levita>0)for(let i=0;i<3;i++)pen.px(hip[0]-3+i*3,GY-1,'#4ab0ff');
    // cabeça jovem, cabelo castanho, chapéu pontudo azul com faixa dourada
    pen.bola(head[0]+.4,head[1]+.4,3.2,3.4,PELE);pen.line(head[0]-3,head[1]-1,head[0]-3,head[1]+2,'#5a3a1a',2);
    if(p.dead>.5)olhoX(pen,Math.round(head[0]+1.6),Math.round(head[1]),'#1a1a2a');else{pen.px(head[0]+1.6,head[1]-.2,'#1a2a4a');pen.px(head[0]+2.4,head[1]-.2,'#ffffff')}
    if(p.mo>.3)pen.px(head[0]+2,head[1]+2,'#8a3a2a');
    const hb=[head[0]-.5,head[1]-2.8],inc=-.08+p.ht*.12+p.chapeu*.05;pen.line(P(hb,PI+inc,6)[0],P(hb,PI+inc,6)[1],P(hb,inc,6)[0],P(hb,inc,6)[1],R[0],2);
    const c1=P(hb,-PI/2+inc-.05,5),tip=P(c1,-PI/2+inc-.9-p.chapeu*.15,5);pen.poly([P(hb,PI+inc,3.4),c1,tip,P(c1,inc,1),P(hb,inc,3.2)],R[1]);pen.line(c1[0],c1[1],tip[0],tip[1],R[3]);
    pen.line(P(hb,PI+inc,3)[0],P(hb,PI+inc,3)[1]-1,P(hb,inc,3)[0],P(hb,inc,3)[1]-1,O[1]);pen.px(hb[0]+.5,hb[1]-1.2,'#ffe27a');
    // cajado na mão da frente
    const ef=P(shF,p.aF,4.5),hf=P(ef,p.aF+p.aF2,4.5),s0=P(hf,p.cj+PI,10),s1=P(hf,p.cj,13);
    pen.line(s0[0],s0[1],s1[0],s1[1],A.m[0],2);pen.line(s0[0],s0[1],s1[0],s1[1],A.m[1]);const top=P(s1,p.cj,2.5);
    if(A.ame){for(const [da,l] of [[-.4,4],[0,5.5],[.4,4.2]]){const t=P(s1,p.cj+da,l);pen.line(s1[0],s1[1],t[0],t[1],A.mg[1],2);pen.px(t[0],t[1],A.mg[2])}}
    else if(A.gelo){const big=A.gelo>1;for(const [da,l] of [[-.5,big?5:3],[0,big?8:5],[.5,big?5:3]]){const t=P(s1,p.cj+da,l);pen.line(s1[0],s1[1],t[0],t[1],A.mg[1],big?2:1);pen.px(t[0],t[1],'#ffffff')}}
    else{pen.line(s1[0]-1.5,s1[1],top[0]-1.5,top[1]-1,A.m[0]);pen.line(s1[0]+1.5,s1[1],top[0]+1.5,top[1]-1,A.m[0]);pen.ell(top[0],top[1],1.7,1.7,A.mg[0]);pen.px(top[0],top[1]-.4,A.mg[2])}
    pen.line(shF[0],shF[1],ef[0],ef[1],R[2],2);pen.line(ef[0],ef[1],hf[0],hf[1],PELE[1],2);
    pen.info.boca=top;
    const ph=p.ph,carga=p.carga,orb=p.orb,dome=p.dome,runas=p.runas,circ=p.circ;
    pen.depois(pn=>{
      const g=.6+.4*Math.sin(ph*.7)+carga;pn.px(top[0],top[1],A.mg[2]);if(g>.8){pn.px(top[0]-1,top[1],A.mg[1]);pn.px(top[0]+1,top[1],A.mg[1]);pn.px(top[0],top[1]-1,A.mg[1])}
      if(A.runa)for(let i=0;i<4;i++){const q2=P(hf,p.cj,-6+i*4);pn.px(q2[0],q2[1],(ph+i)%4<2?'#8ad8ff':'#4a90d0')}
      if(A.gelo>1)for(let i=0;i<7;i++){const k=((ph*.04+i/7)%1);pn.px(hip[0]-12+((i*9)%26)+Math.sin(k*6+i)*2,k*GY,'#e8f6ff')}
      if(A.raio){for(let k=0;k<2;k++){if((ph+k)%3===0)continue;let a=top;for(let i=0;i<3;i++){const n=[a[0]+(Math.sin(ph*2+i+k)*2.5),a[1]-2-i];pn.line(a[0],a[1],n[0],n[1],'#fff6a0');a=n}}pn.ell(top[0],top[1],2.2,2.2,'#d0a0ff');pn.px(top[0],top[1],'#ffffff')}
      if(carga>0){for(let i=0;i<8;i++){const a=ph*.6+i*PI/4,r=(1-carga)*8+2;pn.px(top[0]+Math.cos(a)*r,top[1]+Math.sin(a)*r,i%2?A.mg[1]:A.mg[2])}}
      if(orb>0){const r=1+orb*3.2;pn.ell(top[0]+2,top[1],r+1,r+1,A.mg[0]);pn.ell(top[0]+2,top[1],r,r,A.mg[1]);pn.ell(top[0]+1.5,top[1]-.5,r*.45,r*.45,A.mg[2])}
      if(circ>0){const c=[hip[0]+1,GY+.5],r=10*circ;for(let a=0;a<PI*2;a+=.12)pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*.25,A.mg[1]);for(let i=0;i<5;i++){const a=ph*.3+i*PI*2/5;pn.px(c[0]+Math.cos(a)*r*.7,c[1]+Math.sin(a)*r*.17,A.mg[2])}}
      if(runas>0)for(let i=0;i<6;i++){const a=ph*.35+i*PI/3,x=hip[0]+Math.cos(a)*11*runas,y=hip[1]-6+Math.sin(a)*4*runas;pn.px(x,y,A.mg[2]);pn.px(x+1,y,A.mg[1]);pn.px(x,y+1,A.mg[1])}
      if(dome>0){const c=[hip[0]+1,hip[1]-2],r=17*dome;for(let a=PI;a<=PI*2;a+=.05){const x=c[0]+Math.cos(a)*r,y=c[1]+Math.sin(a)*r*1.15;if(dit(x,y,.75))pn.px(x,y,'#8ad8ff')}for(let a=PI;a<=PI*2;a+=.3)pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*1.15,'#ffffff');for(let x=c[0]-r;x<=c[0]+r;x+=2)pn.px(x,GY,'#8ad8ff')}})},
  A:{
   parado:{n:20,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:sw(f,n,1,1)*1.5,chapeu:sw(f,n,1,.5)*1.5,cj:(-84+b*3)*D,ht:sw(f,n,1,2)>.85?.5:0,ph:f,aF:(55+b*4)*D,aF2:-145*D}}},
   ataque:{nome:'Faísca',n:16,fps:14,hits:[9],tiro:'faisca',f:null},
   especial:{nome:'Feitiço Forte',n:24,fps:13,hits:[16],tiro:'grande',f:null},
   defesa:{nome:'Barreira',n:18,fps:12,f:null},
   buff:{nome:'Concentrar',n:20,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},vitoria:{nome:'Vitória',n:18,fps:12,f:null},morte:{n:20,fps:12,f:null}}};
MAG.DEF.aF=55*D;MAG.DEF.aF2=-145*D;
MAG.A.ataque.f=kf(MAG.DEF,[[0,{}],[5,{e:'devagar',lean:-6*D,aF:-40*D,aF2:-60*D,cj:-120*D,carga:.6,ht:-.3}],[8,{e:'segura',lean:-6*D,aF:-40*D,aF2:-60*D,cj:-120*D,carga:1}],[9,{e:'rapido',lean:12*D,aF:-5*D,aF2:-10*D,cj:-15*D,carga:0,hx:23,mo:1,capa:3,chapeu:3}],[11,{e:'segura',lean:12*D,aF:-5*D,aF2:-10*D,cj:-15*D,hx:23}],[16,{e:'devagar'}]]);
MAG.A.especial.f=kf(MAG.DEF,[[0,{}],[5,{e:'devagar',aF:-90*D,aF2:-50*D,cj:-95*D,circ:.4,ht:-1,carga:.3}],[12,{e:'devagar',aF:-100*D,aF2:-40*D,cj:-95*D,circ:1,levita:1,ht:-1,carga:1,orb:.6,capa:3,chapeu:-2}],[14,{e:'segura',aF:-100*D,aF2:-40*D,cj:-95*D,circ:1,levita:1,ht:-1,carga:1,orb:1}],
  [16,{e:'rapido',lean:16*D,aF:-10*D,aF2:-10*D,cj:-10*D,circ:.6,levita:.5,orb:0,carga:0,mo:1,hx:24,capa:4,chapeu:4}],[19,{e:'segura',lean:14*D,aF:-10*D,aF2:-10*D,cj:-10*D,circ:.3,hx:24}],[24,{e:'devagar',circ:0}]]);
MAG.A.defesa.f=kf(MAG.DEF,[[0,{}],[5,{e:'devagar',aF:-60*D,aF2:-70*D,cj:-100*D,dome:.3,ht:-.5}],[9,{e:'rapido',aF:-70*D,aF2:-70*D,cj:-100*D,dome:1,carga:.5}],[14,{e:'segura',aF:-70*D,aF2:-70*D,cj:-100*D,dome:1}],[18,{e:'devagar',dome:0}]]);
MAG.A.buff.f=kf(MAG.DEF,[[0,{}],[6,{e:'devagar',levita:1,runas:.5,ht:-1,aB:20*D,aB2:-60*D,capa:2}],[13,{e:'segura',levita:1.2,runas:1.2,ht:-1,aB:20*D,aB2:-60*D,carga:.6,capa:3}],[20,{e:'devagar',runas:0,levita:0}]]);
MAG.A.ferido.f=kf(MAG.DEF,[[0,{}],[1,{e:'rapido',hx:18,lean:-16*D,ht:-1,mo:1,capa:-3,chapeu:-4,cj:-60*D}],[3,{hx:18,lean:-8*D,chapeu:2}],[8,{}]]);
MAG.A.vitoria.f=kf(MAG.DEF,[[0,{}],[5,{e:'devagar',aF:-110*D,aF2:-30*D,cj:-92*D,ht:-1,mo:1,carga:1,runas:.6}],[14,{e:'segura',aF:-112*D,aF2:-30*D,cj:-92*D,ht:-1,mo:.6,carga:1,runas:1}],[18,{aF:-112*D,aF2:-30*D,cj:-92*D,ht:-1,runas:1,carga:1}]]);
MAG.A.morte.f=kf(MAG.DEF,[[0,{}],[2,{e:'rapido',hx:18,lean:-18*D,ht:-1,mo:1,chapeu:-4,cj:-50*D}],[8,{e:'devagar',hx:20,hy:48,lean:30*D,ht:1.4,fF:[26,GY],fB:[15,GY-.5],cj:-20*D,aF:80*D,aF2:-20*D}],[13,{e:'rapido',hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],cj:5*D,aF:100*D,aF2:0,dead:1,chapeu:4}],[15,{hx:21,hy:51,lean:52*D,ht:1.6,fF:[27,GY],fB:[14,GY],cj:5*D,aF:100*D,aF2:0,dead:1}],[20,{hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],cj:5*D,aF:100*D,aF2:0,dead:1}]]);
anima(MAG);

/* =====================================================================================
   GUARDIÃO DE FERRO — armadura pesada, martelo da família de Bram, escudo evolutivo
   ===================================================================================== */
const ESC=[{n:'Escudo de Tábuas',f:['#8a5a30','#6a4220'],r:'#6a6e78',tab:1},{n:'Escudo de Ferro',f:['#7a8694','#5a6470'],r:'#3a3e48',ferro:1},
  {n:'Escudo Rúnico',f:['#6a7684','#4a5460'],r:'#2a2e38',runa:'#4ab0ff'},{n:'Escudo da Muralha Eterna',f:['#5a7a94','#3a5670'],r:'#cfefff',runa:'#aef0ff',gelo:1},
  {n:'Escudo Dourado',f:['#c89a30','#a07a20'],r:'#7a5a1a',sol:1},{n:'Escudo do Sol',f:['#e0b040','#b08020'],r:'#fff0a0',sol:2}];
const TAN={nome:'Guardião de Ferro',W,H,GY,semEspelho:1,armas:ESC.map(a=>a.n),
  DEF:{...DEFB,hx:20,hy:39,mt:-60*D,es:0,escX:0,brilho:0,muro:0,faisca:0,pz:0,rc:0},molas:['capa'],
  draw(pen,p){const S=['#2a2e36','#4a525e','#6a7482','#9aa4b2'],T=['#1e3458','#2e4c7a'],A=ESC[p.arma|0];
    const B=corpo(pen,p,{tronco:11,perna:6,gross:3});const{hip,neck,shF,shB,head}=B;
    // braço de trás (segura o escudo) + escudo grande à frente do corpo
    const be=B.braco(shB,p.aB,p.aB2,[S[1],S[1]],null,4.5);
    B.perna([hip[0]-1.5,hip[1]+1],p.fB,[S[1],S[1]],'#1a1c22');
    // tronco largo de ferro + tabardo azul
    pen.poly([[neck[0]-5,neck[1]-.5],[neck[0]+5,neck[1]],[hip[0]+4.5,hip[1]+2],[hip[0]-4.5,hip[1]+2]],S[2]);pen.line(neck[0]+5,neck[1],hip[0]+4.5,hip[1]+2,S[3]);
    pen.poly([[neck[0]-1.5,neck[1]+2],[neck[0]+2.5,neck[1]+2],[hip[0]+2.5,hip[1]+6],[hip[0]-1.5,hip[1]+6]],T[1]);pen.line(hip[0]-1.5,hip[1]+6,hip[0]+2.5,hip[1]+6,T[0]);
    pen.line(hip[0]-4.5,hip[1],hip[0]+4.5,hip[1],'#3a2a14',2);pen.px(hip[0]+1,hip[1],'#c8a040');
    B.perna([hip[0]+1.5,hip[1]+1],p.fF,[S[2],S[2],S[3]],'#1a1c22');
    // ombreiras
    pen.ell(neck[0]-3,neck[1]+1,3,2.2,S[1]);pen.ell(neck[0]+3.5,neck[1]+1,3,2.2,S[3]);pen.px(neck[0]+3,neck[1],'#c8d0dc');
    // elmo de balde com fresta
    pen.poly([[head[0]-3.5,head[1]-3.5],[head[0]+3.5,head[1]-4],[head[0]+4,head[1]+3],[head[0]-3.5,head[1]+3.5]],S[2]);pen.line(head[0]-3.5,head[1]-3.5,head[0]+3.5,head[1]-4,S[3]);
    pen.line(head[0]+.5,head[1]-.5,head[0]+4,head[1]-.6,'#08080c');for(let i=0;i<3;i++)pen.px(head[0]+2.5,head[1]+1+i*.8,S[0]);
    if(p.dead<.5)pen.px(head[0]+2.5,head[1]-.5,'#8ad8ff');
    // escudo (pela mão de trás, à frente do corpo)
    const sc=[be.h[0]+2+p.escX,be.h[1]-1],ang=p.es,rot=(x,y)=>[sc[0]+x*Math.cos(ang)-y*Math.sin(ang),sc[1]+x*Math.sin(ang)+y*Math.cos(ang)];
    const pts=[rot(-4.5,-8),rot(4.5,-8),rot(4.5,4),rot(0,9),rot(-4.5,4)];pen.poly(pts,A.r);pen.poly(pts.map(([x,y])=>[lerp(sc[0],x,.82),lerp(sc[1],y,.85)]),A.f[0]);
    if(A.tab)for(let i=-1;i<=1;i++){const a=rot(i*2.4,-7),b=rot(i*2.4,5);pen.line(a[0],a[1],b[0],b[1],A.f[1])}
    if(A.ferro){const c=rot(0,-1);pen.ell(c[0],c[1],1.6,1.6,'#a8b0bc');pen.line(rot(0,-7)[0],rot(0,-7)[1],rot(0,7)[0],rot(0,7)[1],'#5a6270')}
    for(const [x,y] of [[-3.5,-7],[3.5,-7],[-3.5,3],[3.5,3]]){const q=rot(x,y);pen.px(q[0],q[1],'#3a3e48')}
    pen.info.boca=rot(5,-1);
    // martelo na mão da frente
    const fe=B.braco(shF,p.aF,p.aF2,[S[2],S[3]],null,4.5),hf=fe.h,m0=P(hf,p.mt+PI,3),m1=P(hf,p.mt,10);pen.line(m0[0],m0[1],m1[0],m1[1],'#5c3a1e',2);
    const hd=[P(m1,p.mt+PI/2,3),P(m1,p.mt-PI/2,3)];pen.line(hd[0][0],hd[0][1],hd[1][0],hd[1][1],S[1],4);pen.line(hd[0][0],hd[0][1],hd[1][0],hd[1][1],S[3],1);pen.px(hd[1][0],hd[1][1],'#e8eef6');
    pen.px(hf[0],hf[1],S[3]);
    const ph=p.ph,brilho=p.brilho,muro=p.muro,fa=p.faisca,pz=p.pz,rc=p.rc;
    pen.depois(pn=>{
      if(A.runa){const c=rot(0,-1.5),on=(.6+.4*Math.sin(ph*.6))>.7||brilho>0;const L2=[[0,-5],[0,3],[-3,-2],[3,-2],[-2,1],[2,1]];L2.forEach(([x,y])=>{const q=rot(x,y);pn.px(q[0],q[1],on?A.runa:'#3a5a7a')});pn.px(c[0],c[1],'#ffffff')}
      if(A.gelo)for(let i=0;i<4;i++){const k=((ph*.06+i/4)%1),q=rot(-5+((i*7)%10),-8+k*16);pn.px(q[0]-1,q[1],'#e8f6ff')}
      if(A.sol){const c=rot(0,-1.5),r=A.sol>1?4:2.4;pn.ell(c[0],c[1],r*.6,r*.6,'#fff6c0');if(A.sol>1){for(let k=0;k<8;k++){const a=k*PI/4+ph*.05,l=r+1.5+Math.sin(ph*.5+k);pn.line(c[0]+Math.cos(a)*r*.7,c[1]+Math.sin(a)*r*.7,c[0]+Math.cos(a)*l,c[1]+Math.sin(a)*l,'#ffe27a')}}pn.px(c[0],c[1],'#ffffff')}
      if(brilho>0){pn.px(pts[1][0],pts[1][1],'#ffffff');pn.px(pts[1][0]-1,pts[1][1]+1,'#bfe0ff');pn.px(pts[0][0]+1,pts[0][1],'#ffffff')}
      if(muro>0){const c=[hip[0]+8,hip[1]-3],r=16*muro,cor=A.sol?'#ffe27a':A.gelo?'#cfefff':'#8ad8ff';for(let a=-PI/2;a<=PI/2;a+=.06){const x=c[0]+Math.cos(a)*r*.55,y=c[1]+Math.sin(a)*r*1.1;if(dit(x,y,.8))pn.px(x,y,cor)}for(let a=-PI/2;a<=PI/2;a+=.35)pn.px(c[0]+Math.cos(a)*r*.55,c[1]+Math.sin(a)*r*1.1,'#ffffff')}
      if(fa>0&&fa<1){const c=rot(0,-3);for(let i=0;i<10;i++){const a=i*PI/5,r=2+fa*8;pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r-fa*2,i%2?'#ffe9a8':'#ffffff')}}
      if(pz>0&&pz<1)for(let i=0;i<10;i++){const s2=i<5?-1:1;pn.px(hip[0]+8+s2*(2+i%5*2.2)*pz*1.8,GY-Math.sin(pz*PI)*(1+i%3)*1.6,'#8a7a60')}
      if(rc>0)for(let i=-6;i<=6;i++)pn.px(hip[0]+14+i,GY+((i*7)%3===0?-1:0),'#120a06')})},
  A:{
   parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:39+(b>.6?1:0),br:b*1.2,mt:(-60+b*4)*D,es:sw(f,n,1,1)*.04,ph:f,lean:(3+b*1.5)*D}}},
   ataque:{nome:'Pancada',n:18,fps:13,hits:[9],f:null},
   especial:{nome:'Bater o Escudo',n:16,fps:14,hits:[7],f:null},
   defesa:{nome:'Muralha',n:20,fps:12,f:null},
   buff:{nome:'Forjar Coragem',n:18,fps:13,f:null},
   ferido:{n:8,fps:14,f:null},vitoria:{nome:'Vitória',n:18,fps:12,f:null},morte:{n:22,fps:11,f:null}}};
TAN.A.ataque.f=kf(TAN.DEF,[[0,{}],[5,{e:'devagar',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,mt:-200*D,fF:[24,GY],fB:[14,GY]}],[7,{e:'segura',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,mt:-200*D,fF:[24,GY],fB:[14,GY]}],
  [8,{e:'rapido',hx:24,lean:18*D,aF:-30*D,aF2:-10*D,mt:-50*D,fF:[30,GY],fB:[17,GY]}],[9,{e:'rapido',hx:25,hy:41,lean:24*D,aF:30*D,aF2:10*D,mt:40*D,fF:[30,GY],fB:[17,GY],pz:.1,rc:1}],[13,{e:'segura',hx:25,hy:41,lean:24*D,aF:30*D,aF2:10*D,mt:40*D,fF:[30,GY],fB:[17,GY],pz:.8,rc:1}],[18,{e:'devagar',rc:0}]]);
TAN.A.especial.f=kf(TAN.DEF,[[0,{}],[4,{e:'devagar',hx:17,lean:-6*D,escX:-2,fF:[23,GY],fB:[13,GY]}],[6,{e:'rapido',hx:26,lean:20*D,escX:4,es:-.1,fF:[31,GY],fB:[19,GY]}],[7,{hx:27,lean:22*D,escX:5,es:-.12,fF:[31,GY],fB:[19,GY],faisca:.2,brilho:1}],[10,{e:'segura',hx:27,lean:22*D,escX:5,fF:[31,GY],fB:[19,GY],faisca:.9,brilho:1}],[16,{e:'devagar',brilho:0}]]);
TAN.A.defesa.f=kf(TAN.DEF,[[0,{}],[5,{e:'devagar',hy:43,lean:10*D,escX:2,fF:[26,GY],fB:[13,GY],muro:.3}],[9,{e:'rapido',hy:44,lean:12*D,escX:3,fF:[26,GY],fB:[12,GY],muro:1,brilho:1,pz:.1}],[16,{e:'segura',hy:44,lean:12*D,escX:3,fF:[26,GY],fB:[12,GY],muro:1,brilho:1,pz:.8}],[20,{e:'devagar',muro:0,brilho:0}]]);
TAN.A.buff.f=kf(TAN.DEF,[[0,{}],[4,{e:'devagar',aF:-120*D,aF2:-30*D,mt:-160*D}],[6,{e:'rapido',aF:10*D,aF2:-60*D,mt:-30*D,faisca:.1,brilho:1}],[8,{aF:10*D,aF2:-60*D,mt:-30*D,faisca:.7,brilho:1}],[10,{e:'devagar',aF:-120*D,aF2:-30*D,mt:-160*D}],[12,{e:'rapido',aF:10*D,aF2:-60*D,mt:-30*D,faisca:.1,brilho:1}],[14,{aF:10*D,aF2:-60*D,mt:-30*D,faisca:.7,brilho:1}],[18,{e:'devagar',brilho:0}]]);
TAN.A.ferido.f=kf(TAN.DEF,[[0,{}],[1,{e:'rapido',hx:18,lean:-10*D,ht:-1,es:-.2,fF:[23,GY],fB:[14,GY]}],[3,{hx:18,lean:-4*D,fF:[23,GY],fB:[14,GY]}],[8,{}]]);
TAN.A.vitoria.f=kf(TAN.DEF,[[0,{}],[5,{e:'devagar',aF:-110*D,aF2:-40*D,mt:-95*D,ht:-1,brilho:1}],[14,{e:'segura',aF:-112*D,aF2:-40*D,mt:-95*D,ht:-1,brilho:1}],[18,{aF:-112*D,aF2:-40*D,mt:-95*D,ht:-1}]]);
TAN.A.morte.f=kf(TAN.DEF,[[0,{}],[2,{e:'rapido',hx:18,lean:-12*D,ht:-1,fF:[23,GY],fB:[14,GY]}],[8,{e:'devagar',hx:20,hy:46,lean:12*D,ht:1,fF:[27,GY],fB:[15,GY-.5],mt:60*D}],[14,{e:'rapido',hx:20,hy:46,lean:14*D,ht:1,fF:[27,GY],fB:[15,GY],mt:70*D,rot:PI/2,px:31,py:GY-1,tx:-3,ty:-4,dead:1,pz:.1}],[16,{hx:20,hy:46,lean:14*D,fF:[27,GY],fB:[15,GY],mt:70*D,rot:PI/2*.95,px:31,py:GY-1,tx:-3,ty:-5,dead:1,pz:.6}],[22,{hx:20,hy:46,lean:14*D,fF:[27,GY],fB:[15,GY],mt:70*D,rot:PI/2,px:31,py:GY-1,tx:-3,ty:-4,dead:1}]]);
anima(TAN);

/* =====================================================================================
   NECROMANTE — capuz roxo, rosto pálido, foice evolutiva, almas e servos
   ===================================================================================== */
const FOI=[{n:'Foice de Osso',s:['#d8d0bc','#9a927c'],b:['#e8e0cc','#a8a08a'],cor:'#7aff9a'},{n:'Foice Sombria',s:['#2a2430','#141018'],b:['#3a3444','#1c1822'],cor:'#7aff9a'},
  {n:'Foice das Almas',s:['#2a2430','#141018'],b:['#3a3444','#1c1822'],cor:'#7aff9a',almas:1},{n:'Foice do Lich',s:['#1a1020','#0c0810'],b:['#4a1a6a','#2a0a3a'],cor:'#7aff9a',caveira:1,fogo:1},
  {n:'Foice de Sangue',s:['#2a1418','#14080a'],b:['#5a1018','#2a060a'],cor:'#ff4a5a',sangue:1},{n:'Foice do Vampiro',s:['#1a0a0e','#0a0406'],b:['#8a0a1a','#4a0410'],cor:'#ff4a5a',asas:1}];
const NEC={nome:'Necromante',W,H,GY,semEspelho:1,armas:FOI.map(a=>a.n),
  DEF:{...DEFB,fz:-70*D,maos:0,veu:0,aura:0,tr:0,almaV:0},molas:['capa'],
  draw(pen,p){const R=['#160a20','#2a1440','#44245e','#5e3a7e'],A=FOI[p.arma|0];
    const B=corpo(pen,p,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    B.braco(shB,p.aB,p.aB2,[R[0],R[0]],'#b8b8c8');
    // manto que flutua, barra em tiras
    const hem=GY,w1=7+p.capa*.3,pts=[[neck[0]-4,neck[1]],[neck[0]+4,neck[1]+.5],[hip[0]+w1,hem-1]];for(let i=0;i<=7;i++){const t=i/7;pts.push([lerp(hip[0]+w1,hip[0]-w1-2,t),hem-1-((i%2)?2.2+Math.sin(p.ph*.6+i)*.8:0)])}pts.push([hip[0]-w1-2,hem-3]);
    pen.poly(pts,R[1]);pen.line(neck[0]+4,neck[1]+.5,hip[0]+w1,hem-1,R[2]);pen.line(neck[0]+.5,neck[1]+1,hip[0]+1,hem-2,R[0]);pen.line(hip[0]-4,hip[1],hip[0]+4.5,hip[1],'#1a0a14',2);pen.px(hip[0]+1,hip[1],A.cor);
    // capuz e rosto pálido
    pen.poly([[head[0]-4.5,head[1]+3.5],[head[0]-4.5,head[1]-1.5],[head[0]-2,head[1]-5],[head[0]-4,head[1]-7],[head[0]+1.5,head[1]-5.2],[head[0]+4,head[1]-2],[head[0]+4.5,head[1]+3.5]],R[1]);pen.line(head[0]-2,head[1]-5,head[0]+4,head[1]-2,R[3]);
    pen.ell(head[0]+1.6,head[1]+.5,2.6,3,'#a8a8b8');pen.ell(head[0]+1.8,head[1],1.8,2.2,'#c8c8d4');pen.px(head[0]+2,head[1]+2.2,'#6a6a7a');
    if(p.dead>.5)olhoX(pen,Math.round(head[0]+2),Math.round(head[1]-.4),'#3a3a4a');
    // foice na mão da frente
    const ef=P(shF,p.aF,4.5),hf=P(ef,p.aF+p.aF2,4.5),s0=P(hf,p.fz+PI,9),s1=P(hf,p.fz,14);
    pen.line(s0[0],s0[1],s1[0],s1[1],A.s[0],2);pen.line(s0[0],s0[1],s1[0],s1[1],A.s[1]);
    const lam=[];for(let i=0;i<=8;i++){const t=i/8,a=p.fz+PI/2+t*1.9,r=2+t*9,q=P(s1,a-.2,r);q[1]+=Math.sin(t*PI)*-2;lam.push(q)}
    for(let i=0;i<lam.length-1;i++){const th=i<6?2:1;pen.line(lam[i][0],lam[i][1],lam[i+1][0],lam[i+1][1],A.b[0],th)}pen.line(lam[0][0],lam[0][1],lam[8][0],lam[8][1],A.b[1]);
    if(A.caveira){pen.ell(s1[0],s1[1]-1.5,2,1.8,'#e8e0c8');pen.px(s1[0]-.6,s1[1]-1.6,'#1a1a1a');pen.px(s1[0]+.8,s1[1]-1.6,'#1a1a1a')}
    if(A.asas)for(const sd of [-1,1]){const b=P(s1,p.fz+PI,1),t=P(b,p.fz+PI+sd*1.2,5);pen.line(b[0],b[1],t[0],t[1],'#3a0a14',2);pen.px(t[0],t[1],'#5a1420')}
    pen.line(shF[0],shF[1],ef[0],ef[1],R[2],2);pen.line(ef[0],ef[1],hf[0],hf[1],'#b8b8c8',2);
    pen.info.boca=hf;
    const ph=p.ph,maos=p.maos,veu=p.veu,aura=p.aura,tr=p.tr,fz=p.fz,dead=p.dead,almaV=p.almaV;
    pen.depois(pn=>{
      if(dead<.5){pn.px(head[0]+1.4,head[1]-.4,A.cor);pn.px(head[0]+2.6,head[1]-.4,A.cor)}
      // almas girando (sempre um pouquinho; mais com aura)
      const na=2+Math.round(aura*4);for(let i=0;i<na;i++){const a=ph*.25+i*PI*2/na,r=9+aura*3,x=hip[0]+Math.cos(a)*r,y=hip[1]-6+Math.sin(a)*r*.4;pn.px(x,y,A.cor);if(aura>.3)pn.px(x,y-1,'#ffffff')}
      if(A.almas||A.fogo)lam.forEach((q,i)=>{if(i%2===0)pn.px(q[0],q[1],A.fogo&&(ph+i)%3===0?'#d8ffe0':A.cor)});
      if(A.fogo)for(let i=0;i<5;i++){const q=lam[i+2],k=((ph*.08+i/5)%1);pn.px(q[0],q[1]-1-k*4,k<.5?'#5aff7a':'#2aa04a')}
      if(A.caveira){pn.px(s1[0]-.6,s1[1]-1.6,'#5aff8a');pn.px(s1[0]+.8,s1[1]-1.6,'#5aff8a')}
      if(A.sangue){lam.forEach((q,i)=>{if(i%2)pn.px(q[0],q[1],'#ff3a4a')});for(let i=0;i<2;i++){const q=lam[3+i*3],k=((ph*.07+i/2)%1);pn.px(q[0],q[1]+1+k*6,'#c0101a')}}
      if(A.asas){const e=P(s1,fz+PI,1);pn.px(e[0],e[1],'#ff2a3a')}
      if(tr){for(let a=tr;Math.abs(a-tr)<Math.abs(fz-tr);a+=Math.sign(fz-tr)*.06){for(let r=10;r<=15;r+=2){const q=P(hf,a+.6,r);pn.px(q[0],q[1],A.cor)}}}
      if(maos>0){for(let i=0;i<3;i++){const x=W-14+i*5,h2=maos*(5+i%2*2);pn.line(x,GY,x,GY-h2,'#c8c0aa');for(let k=-1;k<=1;k++)pn.line(x,GY-h2,x+k*1.2,GY-h2-2,'#e8e0c8');pn.px(x-1,GY-1,A.cor);pn.px(x+1,GY,A.cor)}
        for(let i=0;i<5;i++){const k=((ph*.07+i/5)%1);pn.px(W-16+i*3,GY-2-k*14*maos,A.cor)}}
      if(veu>0){for(let y=hip[1]-22;y<=GY;y++)for(let x=hip[0]-10;x<=hip[0]+10;x++){const d=Math.hypot((x-hip[0])/10,(y-(hip[1]-6))/16);if(d<1&&dit(x+ph,y,veu*.45*(1-d*.6)))pn.px(x,y,'#1a0a2a')}for(let a=0;a<PI*2;a+=.2)pn.px(hip[0]+Math.cos(a)*10*veu,hip[1]-6+Math.sin(a)*16*veu,A.cor)}
      if(almaV>0){const x=lerp(W-2,hip[0],almaV),y=lerp(28,hip[1]-6,almaV)+Math.sin(almaV*9)*3;pn.ell(x,y,1.5,1.5,A.cor);pn.px(x,y,'#ffffff')}})},
  A:{
   parado:{n:20,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:sw(f,n,1,1)*1.3,fz:(-70+b*4)*D,ht:sw(f,n,1,2)>.85?.6:0,ph:f,aura:.2}}},
   ataque:{nome:'Toque Sombrio',n:18,fps:14,hits:[9],f:null},
   especial:{nome:'Erguer Morto',n:22,fps:12,f:null},
   defesa:{nome:'Véu',n:18,fps:12,f:null},
   buff:{nome:'Drenar',n:20,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},vitoria:{nome:'Vitória',n:18,fps:12,f:null},morte:{n:22,fps:11,f:null}}};
NEC.A.ataque.f=kf(NEC.DEF,[[0,{}],[5,{e:'devagar',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,fz:-190*D,aura:.6}],[7,{e:'segura',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,fz:-190*D,aura:.8}],
  [8,{e:'rapido',hx:25,lean:20*D,aF:-30*D,aF2:0,fz:-60*D,tr:-190*D,fF:[30,GY],fB:[17,GY],capa:4}],[9,{e:'rapido',hx:26,lean:24*D,aF:30*D,aF2:10*D,fz:20*D,tr:-120*D,fF:[30,GY],fB:[17,GY],capa:5}],[12,{e:'segura',hx:26,lean:24*D,aF:30*D,aF2:10*D,fz:20*D,fF:[30,GY],fB:[17,GY]}],[18,{e:'devagar'}]]);
NEC.A.especial.f=kf(NEC.DEF,[[0,{}],[5,{e:'devagar',aB:-90*D,aB2:-40*D,ht:-1,aura:.8,lean:-4*D}],[9,{aB:-100*D,aB2:-30*D,ht:-1,aura:1,maos:.3}],[17,{e:'devagar',aB:-100*D,aB2:-30*D,ht:-1,aura:1,maos:1}],[22,{e:'devagar',maos:0}]]);
NEC.A.defesa.f=kf(NEC.DEF,[[0,{}],[5,{e:'devagar',aB:-40*D,aB2:-90*D,veu:.4,al:.8,lean:-4*D}],[9,{aB:-40*D,aB2:-90*D,veu:1,al:.55}],[14,{e:'segura',aB:-40*D,aB2:-90*D,veu:1,al:.55}],[18,{e:'devagar',veu:0,al:1}]]);
NEC.A.buff.f=kf(NEC.DEF,[[0,{}],[4,{e:'devagar',aB:-10*D,aB2:-20*D,lean:6*D,aura:.6}],[6,{aB:-15*D,aB2:-20*D,lean:8*D,almaV:.05,aura:.8}],[14,{e:'linear',aB:-15*D,aB2:-20*D,lean:8*D,almaV:.99,aura:1,ht:-.6}],[16,{almaV:0,aura:1.2,ht:-1}],[20,{e:'devagar'}]]);
NEC.A.ferido.f=kf(NEC.DEF,[[0,{}],[1,{e:'rapido',hx:18,lean:-16*D,ht:-1,capa:-3,fz:-40*D,al:.8}],[3,{hx:18,lean:-8*D,al:1}],[8,{}]]);
NEC.A.vitoria.f=kf(NEC.DEF,[[0,{}],[5,{e:'devagar',aF:-110*D,aF2:-30*D,fz:-90*D,ht:-1,aura:1}],[14,{e:'segura',aF:-112*D,aF2:-30*D,fz:-90*D,ht:-1,aura:1.2}],[18,{aF:-112*D,aF2:-30*D,fz:-90*D,ht:-1,aura:1.2}]]);
NEC.A.morte.f=kf(NEC.DEF,[[0,{}],[2,{e:'rapido',hx:18,lean:-18*D,ht:-1,fz:-40*D,aura:1}],[8,{e:'devagar',hx:20,hy:48,lean:30*D,ht:1.4,fF:[26,GY],fB:[15,GY-.5],fz:20*D,aF:80*D,aura:1.2}],[14,{e:'rapido',hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],fz:40*D,aF:100*D,dead:1,aura:1,al:.7,veu:.4}],[22,{e:'devagar',hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],fz:40*D,aF:100*D,dead:1,aura:.4,al:.35,veu:.2}]]);
anima(NEC);

window.HEROIS={cac:CAC,mag:MAG,tan:TAN,nec:NEC};
Object.assign(BICHOS,{h_cac:CAC,h_mag:MAG,h_tan:TAN,h_nec:NEC});
})();
