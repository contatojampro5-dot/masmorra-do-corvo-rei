/* CAÇADORA DAS BRUMAS — sangue de Ysolda (visão). Só os olhos da família dela veem o corvo branco (lore).
   Capuz verde, rabo de cavalo ruivo, aljava, arco evolutivo. */
(function(){
const {P,lerp,kf,sw,olhoX,D,PI}=BICHO.util;const {W,H,GY,ALVO,cl,dit,PELE,DEFB,corpo,pes,anima,estrelas,poeira}=HB;
const ARCOS=[{n:'Arco de Freixo',m:['#8a5a30','#5a3a1a'],c:'#e8e0d0',luz:'#ffe9a8'},{n:'Arco Longo de Teixo',m:['#4a2a1a','#2a160c'],c:'#e8e0d0',ponta:'#c8d2dc',luz:'#ffe9a8'},
  {n:'Arco de Espinhos',m:['#2a4a22','#14260f'],c:'#b8ffb0',esp:1,luz:'#b8ffb0'},{n:'Arco da Floresta Viva',m:['#3a7a2a','#1e4a16'],c:'#d8ffb0',folha:1,flor:1,luz:'#d8ffb0'},
  {n:'Arco de Prata',m:['#a8b4c4','#6a7686'],c:'#ffffff',prata:1,luz:'#e8f0ff'},{n:'Arco da Lua',m:['#c8d8f0','#7a8ab0'],c:'#ffffff',lua:1,luz:'#c8e0ff'}];
function corvoBranco(pn,x,y,fl){pn.ell(x,y,2.4,1.5,'#f4f6ff');pn.px(x+2.6,y-.6,'#f4f6ff');pn.px(x+3.6,y-.5,'#e8c25a');pn.px(x+2,y-1,'#2a2a3a');const a=fl?-3:2;pn.line(x-1,y-.5,x-4,y+a,'#ffffff');pn.line(x+.4,y-.5,x-2.5,y+a-.8,'#e8ecff');pn.line(x-2.5,y+.5,x-5,y+1.2,'#f4f6ff')}
const CAC={nome:'Caçadora das Brumas',W,H,GY,semEspelho:1,armas:ARCOS.map(a=>a.n),
  DEF:{...DEFB,mira:55*D,puxa:0,flecha:0,marca:0,cabelo:0,orelha:0,gira:0,armad:0,corvo:0,pousa:0,chuva:0,feixe:0,carga:0,nevoa:0},molas:['capa','cabelo'],
  draw(pen,p){const V=['#1e3616','#33521f','#4e7a32'],C=['#3a2414','#5c3a1e','#7e5430'],A=ARCOS[p.arma|0];const pp=pes(p);const q2=pp?{...p,...pp}:p;
    const B=corpo(pen,q2,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    // capa verde atrás
    const cw=p.capa;pen.poly([[neck[0]-3,neck[1]-1],[neck[0]+1,neck[1]],[hip[0]-2,hip[1]+6],[hip[0]-7-cw,Math.min(GY-2,hip[1]+16)+Math.abs(cw)*.3],[hip[0]-9-cw*1.3,hip[1]+4]],V[1]);pen.line(neck[0]-3,neck[1]-1,hip[0]-9-cw*1.3,hip[1]+4,V[2]);
    const aq=P(neck,PI/2+p.lean,3);pen.line(aq[0]-4,aq[1]+5,aq[0]-1,aq[1]-4,C[0],3);for(let i=0;i<3;i++){pen.line(aq[0]-1.5+i,aq[1]-4,aq[0]-.5+i,aq[1]-7,'#e8e0d0');pen.px(aq[0]-.5+i,aq[1]-7.5,'#c0302a')}
    B.perna([hip[0]-1,hip[1]+1],q2.fB,[C[0],C[0]],'#2a1a10');
    pen.poly([[neck[0]-3,neck[1]],[neck[0]+3,neck[1]+.5],[hip[0]+3.5,hip[1]+3],[hip[0]-3.5,hip[1]+3]],V[1]);pen.line(neck[0]+3,neck[1]+.5,hip[0]+3.5,hip[1]+3,V[2]);
    pen.line(hip[0]-3.5,hip[1],hip[0]+3.5,hip[1],C[1],2);pen.px(hip[0]+1,hip[1],'#c8a040');
    B.perna([hip[0]+1,hip[1]+1],q2.fF,[C[1],C[2],C[2]],'#3a2414');
    // cabeça
    pen.line(head[0]-2.5,head[1]-1,head[0]-6-p.cabelo,head[1]+3+p.cabelo*.3,'#8a3a1a',2);pen.px(head[0]-6.5-p.cabelo,head[1]+4,'#a04a20');
    pen.bola(head[0]+.5,head[1]+.3,3.2,3.4,PELE);
    pen.poly([[head[0]-3.8,head[1]+2],[head[0]-3.6,head[1]-2.5],[head[0]-1,head[1]-4.6],[head[0]+2.8,head[1]-3.8],[head[0]+3.6,head[1]-1.5],[head[0]+1,head[1]-2.2],[head[0]-1.5,head[1]+.5],[head[0]-2.4,head[1]+3]],V[1]);pen.line(head[0]-1,head[1]-4.6,head[0]+2.8,head[1]-3.8,V[2]);
    const olhoE=[head[0]+1.6,head[1]-.2];
    if(p.dead>.5)olhoX(pen,Math.round(head[0]+1.6),Math.round(head[1]),'#3a2a1a');else{pen.px(olhoE[0],olhoE[1],'#2a6a3a');pen.px(olhoE[0]+.8,olhoE[1],'#ffffff')}
    pen.px(head[0]+1.8,head[1]+1.8,p.mo>.3?'#8a3a2a':'#c87a60');
    // arco
    const dir=p.mira,hBow=P(shB,dir,8),cordaN=P(hBow,dir+PI,2+p.puxa*7.5);
    const eB=[lerp(shB[0],hBow[0],.5),lerp(shB[1],hBow[1],.5)+.8];pen.line(shB[0],shB[1],eB[0],eB[1],V[0],2);pen.line(eB[0],eB[1],hBow[0],hBow[1],PELE[0],2);
    const t1=P(P(hBow,dir-PI/2,8),dir+PI,2.2),t2=P(P(hBow,dir+PI/2,8),dir+PI,2.2),q1=P(hBow,dir-PI/2,4.2),q2b=P(hBow,dir+PI/2,4.2),fwd=P([0,0],dir,1.1);
    const curva=[t1,[q1[0]+fwd[0],q1[1]+fwd[1]],[hBow[0]+fwd[0]*1.3,hBow[1]+fwd[1]*1.3],[q2b[0]+fwd[0],q2b[1]+fwd[1]],t2];
    for(let i=0;i<curva.length-1;i++)pen.line(curva[i][0],curva[i][1],curva[i+1][0],curva[i+1][1],i%2?A.m[1]:A.m[0],2);
    if(A.ponta||A.prata||A.lua){pen.px(t1[0],t1[1],A.lua?'#ffffff':'#c8d2dc');pen.px(t2[0],t2[1],A.lua?'#ffffff':'#c8d2dc')}
    if(A.esp)for(const q of [q1,q2b,curva[2]]){pen.px(q[0]-1,q[1]-1,'#a8d890');pen.px(q[0]+.5,q[1]+1.5,'#c0201a')}
    if(A.folha)for(const [q,s] of [[q1,-1],[q2b,1],[t1,-1]])pen.ell(q[0]-1,q[1]+s,1.2,.8,'#5ac04a');
    if(A.flor){pen.px(q1[0]-1.5,q1[1],'#ff9ad0');pen.px(q2b[0]-1.5,q2b[1],'#ffffff');pen.px(curva[2][0]-1,curva[2][1]-1.2,'#ffd0f0')}
    if(A.lua){const m=curva[2];pen.ell(m[0]-.5,m[1],1.6,1.6,'#e8f0ff');pen.ell(m[0]+.3,m[1]-.3,1.2,1.2,A.m[1])}
    // mão da frente: na corda, na orelha (escutar) ou girando a flecha
    const orelha=[head[0]-.5,head[1]+.5],mao=p.orelha>0?[lerp(cordaN[0],orelha[0],p.orelha),lerp(cordaN[1],orelha[1],p.orelha)]:cordaN;
    pen.line(t1[0],t1[1],cordaN[0],cordaN[1],A.c);pen.line(cordaN[0],cordaN[1],t2[0],t2[1],A.c);
    pen.info.boca=P(hBow,dir,2);
    if(p.flecha>.5){const tip=P(cordaN,dir,12);pen.line(cordaN[0],cordaN[1],tip[0],tip[1],A.lua||A.prata?'#d8e8ff':'#9a7a50');pen.px(tip[0],tip[1],'#e8eef6');pen.px(cordaN[0],cordaN[1]-1,'#c0302a');pen.px(cordaN[0],cordaN[1]+1,'#c0302a')}
    if(p.gira>0){const a=p.ph*.9,c=[mao[0]+1,mao[1]-1],e1=P(c,a,5),e2=P(c,a+PI,4);pen.line(e2[0],e2[1],e1[0],e1[1],'#9a7a50');pen.px(e1[0],e1[1],'#e8eef6');pen.px(e2[0],e2[1],'#c0302a')}
    const eF=[lerp(shF[0],mao[0],.5),lerp(shF[1],mao[1],.5)+1.5];pen.line(shF[0],shF[1],eF[0],eF[1],V[2],2);pen.line(eF[0],eF[1],mao[0],mao[1],PELE[1],2);
    // armadilha no chão
    if(p.armad>0){const x=hip[0]+13,a=p.armad;pen.line(x-4,GY,x+4,GY,'#5a5a62');for(let i=-3;i<=3;i+=2){pen.px(x+i,GY-1-a*1.5,'#a8b0bc');pen.px(x+i+.5,GY-.5-a,'#7a8290')}pen.px(x,GY-1,'#c0302a')}
    const ph=p.ph,marca=p.marca,corvo=p.corvo,pousa=p.pousa,chuva=p.chuva,feixe=p.feixe,carga=p.carga,nevoa=p.nevoa,lua=A.lua||A.prata,flecha=p.flecha,dead=p.dead;
    pen.depois(pn=>{
      if(lua&&flecha>.5){for(let r=0;r<=12;r+=2){const q=P(cordaN,dir,r);pn.px(q[0],q[1]-1,'#a8c8ff')}}
      if(A.lua||A.prata){const m=curva[2];for(let i=0;i<3;i++){const k=((ph*.06+i/3)%1);pn.px(m[0]+Math.sin(ph*.3+i)*3,m[1]-2-k*7,A.lua?'#d8e8ff':'#e8eef6')}}
      // névoa das brumas
      if(nevoa>0){for(let i=0;i<26;i++){const a=ph*.12+i*.5,r=8+(i%5)*3,x=hip[0]+Math.cos(a)*r*1.3,y=hip[1]-2+Math.sin(a)*r*.5+(i%3);if(dit(x,y,nevoa*.7))pn.px(x,y,i%2?'#a8b8c8':'#c8d4e0')}}
      // olho da família de Ysolda brilha quando ela "vê"
      if((marca>0||corvo>0||nevoa>.4)&&dead<.5){pn.px(olhoE[0],olhoE[1],'#c8fff0');pn.px(olhoE[0]+1,olhoE[1],'#ffffff');pn.px(olhoE[0]-1,olhoE[1]+.3,'#7affd0')}
      if(marca>0){const c=[ALVO[0],ALVO[1]-6];for(let a=0;a<PI*2;a+=.2)pn.px(c[0]+Math.cos(a)*5*marca,c[1]+Math.sin(a)*5*marca,'#ff6a4a');pn.line(c[0]-3,c[1],c[0]+3,c[1],'#ff8a6a');pn.line(c[0],c[1]-3,c[0],c[1]+3,'#ff8a6a');pn.px(c[0],c[1],'#ffffff')}
      // flecha carregada: luz se juntando e o feixe
      if(carga>0){const tip=P(cordaN,dir,12);for(let i=0;i<8;i++){const a=ph*.7+i*PI/4,r=(1-carga)*9+1.5;pn.px(tip[0]+Math.cos(a)*r,tip[1]+Math.sin(a)*r,i%2?A.luz:'#ffffff')}pn.ell(tip[0],tip[1],carga*1.5+.5,carga*1.5+.5,A.luz)}
      if(feixe>0){const o=P(hBow,dir,2),w=feixe>.5?2:1;pn.line(o[0],o[1]-w,W,o[1]-w-1,A.luz);pn.line(o[0],o[1]+w,W,o[1]+w-1,A.luz);pn.line(o[0],o[1],W,o[1]-1,'#ffffff',w);for(let i=0;i<6;i++)pn.px(lerp(o[0],W,(i+.5)/6),o[1]+Math.sin(ph*2+i)*3,A.luz)}
      // chuva de flechas caindo no alvo
      if(chuva>0){for(let i=0;i<9;i++){const t=cl(chuva*1.7-i*.09);if(t<=0||t>=1)continue;const x=52+((i*7)%17),y=lerp(-8,GY-5,t*t);pn.line(x,y,x,y+6,lua?'#d8e8ff':'#9a7a50');pn.px(x,y+6,'#ffffff');pn.px(x-1,y,'#c0302a');pn.px(x+1,y,'#c0302a')}}
      // o corvo branco: vem do alto e mergulha no alvo; na vitória pousa no arco
      if(corvo>0&&corvo<1){const t=corvo,x=lerp(hip[0]-4,ALVO[0],t),y=lerp(4,ALVO[1]-4,t*t)-Math.sin(t*PI)*6;for(let k=1;k<=4;k++)if(dit(x-k*2,y-k*.6,1-k*.22))pn.px(x-k*2,y-k*.6,'#d8e4ff');corvoBranco(pn,x,y,Math.floor(ph/2)%2)}
      if(pousa>0){const top=t1,x=lerp(top[0]-10,top[0],pousa),y=lerp(top[1]-14,top[1]-2,pousa);corvoBranco(pn,x,y,pousa<1&&Math.floor(ph/2)%2)}})},
  A:{
   parado:{n:20,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:1+sw(f,n,1,1)*1.4,cabelo:sw(f,n,1,.6)*1.2,mira:(55+b*5)*D,ht:sw(f,n,1,2)>.85?-.5:0,lean:(3+b*2)*D,ph:f}}},
   mania1:{nome:'Checar a corda',n:22,fps:11,mania:1,f:null},mania2:{nome:'Escutar a floresta',n:24,fps:10,mania:1,f:null},mania3:{nome:'Girar a flecha',n:22,fps:12,mania:1,f:null},
   entrada:{nome:'Entrada',n:20,fps:14,f:null},
   ataque:{nome:'Disparo',n:16,fps:14,hits:[9],tiro:'flecha',f:null},
   especial:{nome:'Rajada',n:22,fps:16,hits:[7,12,17],tiro:'flecha',f:null},
   chuva:{nome:'Chuva de Flechas',n:28,fps:14,hits:[19],f:null},
   carregado:{nome:'Flecha Carregada',n:30,fps:14,hits:[21],f:null},
   corvo:{nome:'Corvo Branco',n:32,fps:13,hits:[23],f:null},
   buff:{nome:'Tiro Marcado',n:20,fps:12,f:null},
   armadilha:{nome:'Armadilha',n:20,fps:12,f:null},
   defesa:{nome:'Esquivar (mortal)',n:16,fps:15,f:null},
   rolar:{nome:'Rolamento',n:18,fps:15,f:null},
   ferido:{n:8,fps:14,f:null},ferido2:{nome:'Derrubada',n:20,fps:13,f:null},
   vitoria:{nome:'Vitória',n:34,fps:12,f:null},morte:{n:26,fps:11,f:null}}};
const MIRA={mira:-4*D,lean:-2*D,fF:[26,GY],fB:[16,GY]};
const K=CAC.DEF,A=CAC.A;
A.mania1.f=kf(K,[[0,{}],[4,{e:'devagar',mira:-75*D,lean:0,ht:.6}],[7,{mira:-78*D,puxa:.35,ht:.8}],[8,{mira:-78*D,puxa:0}],[10,{mira:-78*D,puxa:.35,ht:.4}],[11,{mira:-78*D,puxa:0}],[15,{e:'segura',mira:-78*D,ht:-.4}],[22,{e:'devagar'}]]);
A.mania2.f=kf(K,[[0,{}],[5,{e:'devagar',orelha:1,ht:-.8,lean:-2*D}],[10,{e:'segura',orelha:1,ht:-.8}],[13,{e:'rapido',orelha:1,ht:.9}],[18,{e:'segura',orelha:1,ht:.9,nevoa:.2}],[24,{e:'devagar'}]]);
A.mania3.f=kf(K,[[0,{}],[3,{e:'devagar',orelha:.4,gira:1}],[18,{e:'linear',orelha:.4,gira:1}],[22,{e:'devagar',gira:0}]]);
A.entrada.f=kf(K,[[0,{hx:-10,andar:1,passo:0,lean:20*D,capa:5,cabelo:3}],[11,{e:'linear',hx:16,andar:1,passo:PI*5,lean:22*D,capa:5,cabelo:3}],[14,{e:'devagar',hx:22,hy:44,lean:-14*D,fF:[29,GY],fB:[15,GY],capa:6,cabelo:4}],[16,{hx:22,hy:42,lean:-8*D,capa:3}],[20,{e:'devagar'}]]);
A.ataque.f=kf(K,[[0,{}],[4,{e:'devagar',...MIRA,flecha:1}],[7,{e:'devagar',...MIRA,flecha:1,puxa:1,lean:-5*D,ht:.2}],[8,{e:'segura',...MIRA,flecha:1,puxa:1,lean:-5*D}],[9,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-9*D,hx:20,capa:3,cabelo:2}],[11,{e:'segura',...MIRA,lean:-7*D,hx:20}],[16,{e:'devagar'}]]);
A.especial.f=kf(K,[[0,{}],[3,{e:'devagar',...MIRA,flecha:1}],[6,{e:'rapido',...MIRA,flecha:1,puxa:1}],[7,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-8*D,capa:3}],[9,{e:'rapido',...MIRA,flecha:1,puxa:.2,mira:-8*D}],[11,{e:'rapido',...MIRA,flecha:1,puxa:1,mira:-8*D}],[12,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-8*D,mira:-8*D,capa:3}],
  [14,{e:'rapido',...MIRA,flecha:1,puxa:.2,mira:0}],[16,{e:'rapido',...MIRA,flecha:1,puxa:1,mira:0}],[17,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-10*D,capa:4,cabelo:2}],[22,{e:'devagar'}]]);
const CEU={mira:-68*D,lean:-14*D,ht:-1,fF:[26,GY],fB:[15,GY]};
A.chuva.f=kf(K,[[0,{}],[3,{e:'devagar',...CEU,flecha:1}],[5,{...CEU,flecha:1,puxa:1}],[6,{e:'rapido',...CEU,flecha:0,puxa:0,capa:3}],[7,{...CEU,flecha:1,puxa:.2}],[8,{e:'rapido',...CEU,flecha:1,puxa:1}],[9,{e:'rapido',...CEU,flecha:0,puxa:0,capa:3}],[10,{...CEU,flecha:1,puxa:.2}],[11,{e:'rapido',...CEU,flecha:1,puxa:1}],[12,{e:'rapido',...CEU,flecha:0,puxa:0,capa:4}],
  [14,{e:'devagar',...MIRA,mira:20*D,ht:0}],[24,{e:'linear',...MIRA,mira:20*D,chuva:.95,marca:.6}],[25,{chuva:0,marca:0}],[28,{e:'devagar'}]]);
const AJ={hy:46,fF:[28,GY],fB:[13,GY-1],lean:-4*D};
A.carregado.f=kf(K,[[0,{}],[4,{e:'devagar',...AJ,mira:-2*D,flecha:1}],[8,{...AJ,mira:-2*D,flecha:1,puxa:1,carga:.2}],[18,{e:'linear',...AJ,mira:-2*D,flecha:1,puxa:1,carga:1,tremor:.6,capa:2}],[20,{e:'segura',...AJ,mira:-2*D,flecha:1,puxa:1,carga:1}],
  [21,{e:'rapido',...AJ,mira:-2*D,flecha:0,puxa:0,carga:0,feixe:1,hx:17,lean:-14*D,capa:5,cabelo:4,flash:1}],[25,{e:'segura',...AJ,mira:-2*D,feixe:1,hx:17,lean:-12*D}],[26,{feixe:0,hx:17}],[30,{e:'devagar'}]]);
A.corvo.f=kf(K,[[0,{}],[5,{e:'devagar',nevoa:.6,ht:-1,aB:-80*D,mira:-60*D}],[10,{e:'devagar',nevoa:1,ht:-1.2,mira:-75*D,corvo:.01}],[23,{e:'devagar',nevoa:1,ht:-.4,mira:-10*D,corvo:.99,marca:.6}],[24,{nevoa:.8,corvo:0,marca:.8}],[32,{e:'devagar',nevoa:0,marca:0}]]);
A.buff.f=kf(K,[[0,{}],[4,{e:'devagar',mira:-10*D,lean:-2*D,ht:-.3,fF:[26,GY]}],[8,{e:'segura',mira:-12*D,ht:-.4,marca:.3,fF:[26,GY]}],[13,{e:'devagar',mira:-12*D,ht:-.4,marca:1,fF:[26,GY]}],[17,{e:'segura',mira:-12*D,marca:1,fF:[26,GY]}],[20,{e:'devagar',marca:0}]]);
A.armadilha.f=kf(K,[[0,{}],[4,{e:'devagar',hx:24,hy:47,lean:30*D,fF:[30,GY],fB:[17,GY-1],mira:80*D,orelha:.2}],[8,{hx:25,hy:48,lean:36*D,fF:[30,GY],fB:[17,GY-1],mira:85*D,armad:.4}],[12,{e:'segura',hx:25,hy:48,lean:36*D,fF:[30,GY],fB:[17,GY-1],mira:85*D,armad:1}],[16,{e:'devagar',armad:1,ht:.5}],[20,{armad:1}]]);
A.defesa.f=kf(K,[[0,{}],[2,{e:'devagar',hy:44,lean:10*D}],[4,{e:'rapido',hx:17,hy:30,lean:-10*D,fF:[21,GY-12],fB:[14,GY-12],capa:5,cabelo:3,px:17,py:34,rot:-1.2}],[7,{hx:13,hy:26,fF:[16,GY-14],fB:[11,GY-14],capa:5,px:13,py:30,rot:-3.6}],[9,{e:'rapido',hx:12,hy:42,lean:-8*D,fF:[15,GY],fB:[7,GY],px:12,py:40,rot:-6.28}],[10,{hx:12,hy:43,lean:-6*D,fF:[15,GY],fB:[7,GY],rot:0}],[16,{e:'devagar'}]]);
A.rolar.f=kf(K,[[0,{}],[2,{e:'devagar',hy:45,lean:30*D,px:21,py:46}],[8,{e:'linear',hx:32,hy:48,lean:40*D,fF:[36,GY-6],fB:[30,GY-6],px:32,py:48,rot:6.28,capa:4}],[9,{hx:33,hy:45,lean:10*D,fF:[37,GY],fB:[29,GY],rot:0,...MIRA,flecha:1}],[11,{e:'rapido',hx:33,...MIRA,flecha:0,puxa:0,lean:-8*D}],[14,{e:'devagar',hx:28,andar:1,passo:PI*2}],[18,{e:'devagar',hx:21,andar:1,passo:PI*4}]]);
A.ferido.f=kf(K,[[0,{}],[1,{e:'rapido',hx:18,lean:-16*D,ht:-1,mo:1,capa:-3,cabelo:-3,fF:[23,GY],fB:[15,GY]}],[3,{hx:18,lean:-8*D,fF:[23,GY],fB:[15,GY]}],[8,{}]]);
A.ferido2.f=kf(K,[[0,{}],[2,{e:'rapido',hx:14,hy:44,lean:-40*D,ht:-1,mo:1,capa:-4,px:14,py:GY,rot:-1.3,ty:-4,tx:18}],[8,{e:'segura',hx:14,hy:44,lean:-40*D,rot:-1.4,px:14,py:GY,ty:-4,tx:18}],[12,{e:'rapido',hx:18,hy:36,lean:10*D,rot:0,fF:[22,GY-3],fB:[15,GY-3]}],[14,{hx:20,hy:42,lean:4*D}],[20,{e:'devagar'}]]);
A.vitoria.f=kf(K,[[0,{}],[3,{e:'devagar',mira:55*D,ht:-.5}],[10,{e:'linear',mira:(55-360)*D,ht:-.6,capa:3}],[13,{e:'devagar',mira:-80*D,lean:-6*D,ht:-1,mo:1,capa:3,hy:39}],[16,{mira:-80*D,lean:-6*D,ht:-1,mo:1,hy:39,pousa:.01}],[26,{e:'devagar',mira:-82*D,lean:-6*D,ht:-1,mo:.6,hy:39,pousa:1}],[34,{e:'segura',mira:-82*D,lean:-6*D,ht:-.6,hy:39,pousa:1}]]);
A.morte.f=kf(K,[[0,{}],[2,{e:'rapido',hx:18,lean:-18*D,ht:-1,mo:1,capa:-3,fF:[23,GY],fB:[15,GY]}],[8,{e:'devagar',hx:20,hy:47,lean:20*D,ht:1.4,fF:[27,GY],fB:[14,GY-1],mira:80*D,nevoa:.3}],[14,{e:'devagar',hx:20,hy:47,lean:30*D,ht:1.6,fF:[27,GY],fB:[14,GY-1],mira:95*D,nevoa:.7}],[19,{e:'rapido',hx:20,hy:47,lean:30*D,fF:[27,GY],fB:[14,GY],mira:95*D,rot:PI/2,px:30,py:GY-1,tx:-2,ty:-3,dead:1,nevoa:1}],[26,{hx:20,hy:47,lean:30*D,fF:[27,GY],fB:[14,GY],mira:95*D,rot:PI/2,px:30,py:GY-1,tx:-2,ty:-3,dead:1,nevoa:.8}]]);
anima(CAC);
HEROIS.cac=CAC;BICHOS.h_cac=CAC;
})();
