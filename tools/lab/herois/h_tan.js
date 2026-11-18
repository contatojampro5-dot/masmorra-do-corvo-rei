/* GUARDIÃO DE FERRO — sangue de Bram (ferro): o ferreiro de Pedra Funda, com o martelo da família (lore).
   "Eu não preciso ganhar. Eu preciso ficar de pé." Armadura pesada, escudo evolutivo. */
(function(){
const {P,lerp,kf,sw,olhoX,D,PI}=BICHO.util;const {W,H,GY,ALVO,cl,dit,PELE,DEFB,corpo,pes,anima,poeira,racha,onda}=HB;
const ESC=[{n:'Escudo de Tábuas',f:['#8a5a30','#6a4220'],r:'#6a6e78',tab:1},{n:'Escudo de Ferro',f:['#7a8694','#5a6470'],r:'#3a3e48',ferro:1},
  {n:'Escudo Rúnico',f:['#6a7684','#4a5460'],r:'#2a2e38',runa:'#4ab0ff'},{n:'Escudo da Muralha Eterna',f:['#5a7a94','#3a5670'],r:'#cfefff',runa:'#aef0ff',gelo:1},
  {n:'Escudo Dourado',f:['#c89a30','#a07a20'],r:'#7a5a1a',sol:1},{n:'Escudo do Sol',f:['#e0b040','#b08020'],r:'#fff0a0',sol:2}];
const TAN={nome:'Guardião de Ferro',W,H,GY,semEspelho:1,armas:ESC.map(a=>a.n),
  DEF:{...DEFB,hx:20,hy:39,mt:-60*D,es:0,escX:0,brilho:0,muro:0,faisca:0,pz:0,rc:0,onda:0,rochas:0,quente:0,voa:0,suor:0},molas:['capa'],
  draw(pen,p){const S=['#2a2e36','#4a525e','#6a7482','#9aa4b2'],T=['#1e3458','#2e4c7a'],A=ESC[p.arma|0];const pp=pes(p,3);const q2=pp?{...p,...pp}:p;
    const B=corpo(pen,q2,{tronco:11,perna:6,gross:3});const{hip,neck,shF,shB,head}=B;
    const be=B.braco(shB,p.aB,p.aB2,[S[1],S[1]],null,4.5);
    B.perna([hip[0]-1.5,hip[1]+1],q2.fB,[S[1],S[1]],'#1a1c22');
    pen.poly([[neck[0]-5,neck[1]-.5],[neck[0]+5,neck[1]],[hip[0]+4.5,hip[1]+2],[hip[0]-4.5,hip[1]+2]],S[2]);pen.line(neck[0]+5,neck[1],hip[0]+4.5,hip[1]+2,S[3]);
    pen.poly([[neck[0]-1.5,neck[1]+2],[neck[0]+2.5,neck[1]+2],[hip[0]+2.5,hip[1]+6],[hip[0]-1.5,hip[1]+6]],T[1]);pen.line(hip[0]-1.5,hip[1]+6,hip[0]+2.5,hip[1]+6,T[0]);
    pen.line(hip[0]-4.5,hip[1],hip[0]+4.5,hip[1],'#3a2a14',2);pen.px(hip[0]+1,hip[1],'#c8a040');
    B.perna([hip[0]+1.5,hip[1]+1],q2.fF,[S[2],S[2],S[3]],'#1a1c22');
    pen.ell(neck[0]-3,neck[1]+1,3,2.2,S[1]);pen.ell(neck[0]+3.5,neck[1]+1,3,2.2,S[3]);pen.px(neck[0]+3,neck[1],'#c8d0dc');
    pen.poly([[head[0]-3.5,head[1]-3.5],[head[0]+3.5,head[1]-4],[head[0]+4,head[1]+3],[head[0]-3.5,head[1]+3.5]],S[2]);pen.line(head[0]-3.5,head[1]-3.5,head[0]+3.5,head[1]-4,S[3]);
    pen.line(head[0]+.5,head[1]-.5,head[0]+4,head[1]-.6,'#08080c');for(let i=0;i<3;i++)pen.px(head[0]+2.5,head[1]+1+i*.8,S[0]);
    if(p.mo>.3)pen.line(head[0]+1.5,head[1]+2,head[0]+4,head[1]+2,'#08080c');
    if(p.dead<.5)pen.px(head[0]+2.5,head[1]-.5,'#8ad8ff');
    // escudo: na mão de trás, ou voando como bumerangue
    let sc,ang=p.es;if(p.voa>0){const t=Math.sin(cl(p.voa)*PI);sc=[lerp(be.h[0]+2,ALVO[0],t),lerp(be.h[1]-1,ALVO[1],t)-Math.sin(t*PI)*5];ang=p.voa*PI*4}else sc=[be.h[0]+2+p.escX,be.h[1]-1];
    const rot=(x,y)=>[sc[0]+x*Math.cos(ang)-y*Math.sin(ang),sc[1]+x*Math.sin(ang)+y*Math.cos(ang)];
    const pts=[rot(-4.5,-8),rot(4.5,-8),rot(4.5,4),rot(0,9),rot(-4.5,4)];pen.poly(pts,A.r);pen.poly(pts.map(([x,y])=>[lerp(sc[0],x,.82),lerp(sc[1],y,.85)]),A.f[0]);
    if(A.tab)for(let i=-1;i<=1;i++){const a=rot(i*2.4,-7),b=rot(i*2.4,5);pen.line(a[0],a[1],b[0],b[1],A.f[1])}
    if(A.ferro){const c=rot(0,-1);pen.ell(c[0],c[1],1.6,1.6,'#a8b0bc');pen.line(rot(0,-7)[0],rot(0,-7)[1],rot(0,7)[0],rot(0,7)[1],'#5a6270')}
    for(const [x,y] of [[-3.5,-7],[3.5,-7],[-3.5,3],[3.5,3]]){const q=rot(x,y);pen.px(q[0],q[1],'#3a3e48')}
    pen.info.boca=rot(5,-1);
    // martelo da família de Bram (ou a mão enxugando o suor)
    let hf;if(p.suor>0){const tgt=[head[0]+2,head[1]-2],h=[lerp(shF[0]+4,tgt[0],p.suor),lerp(shF[1]+7,tgt[1],p.suor)],e=[lerp(shF[0],h[0],.5)+2,lerp(shF[1],h[1],.5)+2];pen.line(shF[0],shF[1],e[0],e[1],S[2],2);pen.line(e[0],e[1],h[0],h[1],S[3],2);hf=h;
      const m0=[hip[0]+7,GY],m1=[hip[0]+9,GY-10];pen.line(m0[0],m0[1],m1[0],m1[1],'#5c3a1e',2);pen.line(m1[0]-3,m1[1],m1[0]+3,m1[1]-1,S[1],4)}
    else{const fe=B.braco(shF,p.aF,p.aF2,[S[2],S[3]],null,4.5);hf=fe.h;const m0=P(hf,p.mt+PI,3),m1=P(hf,p.mt,10);pen.line(m0[0],m0[1],m1[0],m1[1],'#5c3a1e',2);
      const hd=[P(m1,p.mt+PI/2,3),P(m1,p.mt-PI/2,3)];pen.line(hd[0][0],hd[0][1],hd[1][0],hd[1][1],S[1],4);pen.line(hd[0][0],hd[0][1],hd[1][0],hd[1][1],S[3],1);pen.px(hd[1][0],hd[1][1],'#e8eef6');pen.px(m1[0],m1[1],'#c8a040')}
    pen.px(hf[0],hf[1],S[3]);
    const ph=p.ph,v=k=>p[k]||0;const brilho=v('brilho'),muro=v('muro'),fa=v('faisca'),pz=v('pz'),rc=v('rc'),on=v('onda'),roc=v('rochas'),quente=v('quente'),suor=v('suor');
    pen.depois(pn=>{
      if(A.runa){const c=rot(0,-1.5),liga=(.6+.4*Math.sin(ph*.6))>.7||brilho>0;[[0,-5],[0,3],[-3,-2],[3,-2],[-2,1],[2,1]].forEach(([x,y])=>{const q=rot(x,y);pn.px(q[0],q[1],liga?A.runa:'#3a5a7a')});pn.px(c[0],c[1],'#ffffff')}
      if(A.gelo)for(let i=0;i<4;i++){const k=((ph*.06+i/4)%1),q=rot(-5+((i*7)%10),-8+k*16);pn.px(q[0]-1,q[1],'#e8f6ff')}
      if(A.sol){const c=rot(0,-1.5),r=A.sol>1?4:2.4;pn.ell(c[0],c[1],r*.6,r*.6,'#fff6c0');if(A.sol>1)for(let k=0;k<8;k++){const a=k*PI/4+ph*.05,l=r+1.5+Math.sin(ph*.5+k);pn.line(c[0]+Math.cos(a)*r*.7,c[1]+Math.sin(a)*r*.7,c[0]+Math.cos(a)*l,c[1]+Math.sin(a)*l,'#ffe27a')}pn.px(c[0],c[1],'#ffffff')}
      if(quente>0){pts.forEach((q,i)=>{const n=pts[(i+1)%pts.length];for(let t=0;t<=1;t+=.15)if(dit(lerp(q[0],n[0],t),lerp(q[1],n[1],t),quente))pn.px(lerp(q[0],n[0],t),lerp(q[1],n[1],t),t>.5?'#ffb040':'#ff6a1a')});for(let i=0;i<4;i++){const k=((ph*.1+i/4)%1),q=rot(-3+i*2,-8);pn.px(q[0],q[1]-k*8,k<.5?'#ffe27a':'#ff6a1a')}}
      if(brilho>0){pn.px(pts[1][0],pts[1][1],'#ffffff');pn.px(pts[1][0]-1,pts[1][1]+1,'#bfe0ff');pn.px(pts[0][0]+1,pts[0][1],'#ffffff')}
      if(p.voa>0){for(let k=1;k<=3;k++){const q=rot(0,0);pn.px(q[0]-k*3*Math.cos(p.voa*PI*2),q[1],'#c8d0dc')}}
      if(muro>0){const c=[hip[0]+8,hip[1]-3],r=17*muro,cor=A.sol?'#ffe27a':A.gelo?'#cfefff':'#8ad8ff';for(let a=-PI/2;a<=PI/2;a+=.05){const x=c[0]+Math.cos(a)*r*.55,y=c[1]+Math.sin(a)*r*1.1;if(dit(x,y,.8))pn.px(x,y,cor)}for(let a=-PI/2;a<=PI/2;a+=.3)pn.px(c[0]+Math.cos(a)*r*.55,c[1]+Math.sin(a)*r*1.1,'#ffffff')}
      if(fa>0&&fa<1){const c=rot(0,-3);for(let i=0;i<12;i++){const a=i*PI/6,r=2+fa*9;pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r-fa*2,i%2?'#ffe9a8':'#ffffff')}}
      if(roc>0&&roc<1)for(let i=0;i<8;i++){const x=hip[0]+12+(i-3)*4*roc*1.6,y=GY-2-Math.sin(roc*PI)*(5+i%3*4);pn.ell(x,y,1+(i%2),1,i%2?'#6a5a48':'#8a7a60')}
      if(suor>.6&&p.dead<.5)for(let i=0;i<2;i++){const k=((ph*.15+i/2)%1);pn.px(head[0]-2-i,head[1]-3+k*6,'#a8d8ff')}
      poeira(pn,hip[0]+8,pz);racha(pn,hip[0]+14,rc,8);onda(pn,hip[0]+14,on,'#c8b090')})},
  A:{
   parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:39+(b>.6?1:0),br:b*1.2,mt:(-60+b*4)*D,es:sw(f,n,1,1)*.04,ph:f,lean:(3+b*1.5)*D}}},
   mania1:{nome:'Enxugar o suor',n:24,fps:10,mania:1,f:null},mania2:{nome:'Martelo no ombro',n:24,fps:11,mania:1,f:null},mania3:{nome:'Estalar o pescoço',n:20,fps:10,mania:1,f:null},
   entrada:{nome:'Entrada',n:22,fps:11,f:null},
   ataque:{nome:'Pancada',n:18,fps:13,hits:[9],f:null},
   especial:{nome:'Bater o Escudo',n:16,fps:14,hits:[7],f:null},
   investida:{nome:'Investida de Escudo',n:24,fps:14,hits:[10],f:null},
   terremoto:{nome:'Terremoto',n:28,fps:13,hits:[15],f:null},
   arremesso:{nome:'Escudo Bumerangue',n:26,fps:14,hits:[12],f:null},
   contra:{nome:'Contra-ataque',n:22,fps:14,hits:[14],f:null},
   defesa:{nome:'Muralha',n:20,fps:12,f:null},
   provocar:{nome:'Provocar',n:24,fps:13,f:null},
   buff:{nome:'Forja de Batalha',n:28,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},ferido2:{nome:'Derrubada',n:20,fps:12,f:null},
   vitoria:{nome:'Vitória',n:26,fps:11,f:null},morte:{nome:'"Eu preciso ficar de pé"',n:40,fps:11,f:null}}};
const K=TAN.DEF,A=TAN.A;
A.mania1.f=kf(K,[[0,{}],[5,{e:'devagar',suor:1,ht:-.4}],[9,{suor:1,ht:.4}],[13,{e:'segura',suor:1,ht:-.3,br:1.5}],[18,{e:'devagar',suor:0}],[24,{}]]);
A.mania2.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-130*D,aF2:-60*D,mt:-170*D}],[8,{aF:-120*D,aF2:-60*D,mt:-160*D}],[10,{aF:-130*D,aF2:-60*D,mt:-170*D}],[12,{aF:-120*D,aF2:-60*D,mt:-160*D}],[17,{e:'segura',aF:-130*D,aF2:-60*D,mt:-170*D,ht:-.4}],[24,{e:'devagar'}]]);
A.mania3.f=kf(K,[[0,{}],[4,{e:'devagar',ht:-1.2,hd:.6}],[7,{e:'rapido',ht:1.2,hd:.6}],[9,{ht:1.2,hd:.6,br:1.6}],[13,{e:'devagar',ht:-.2,hd:0,br:1.6}],[20,{e:'devagar'}]]);
A.entrada.f=kf(K,[[0,{hx:-10,andar:1,passo:0,lean:8*D}],[12,{e:'linear',hx:17,andar:1,passo:PI*4,lean:8*D}],[14,{hx:20,andar:0,hy:37,fF:[26,GY-4]}],[16,{e:'rapido',hx:20,hy:41,fF:[26,GY],pz:.1,rc:1,onda:.1,tremor:1}],[19,{e:'devagar',pz:.9,rc:1,onda:.9,mo:1,ht:-.6}],[22,{e:'devagar',rc:0}]]);
A.ataque.f=kf(K,[[0,{}],[5,{e:'devagar',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,mt:-200*D,fF:[24,GY],fB:[14,GY]}],[7,{e:'segura',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,mt:-200*D,fF:[24,GY],fB:[14,GY]}],
  [8,{e:'rapido',hx:24,lean:18*D,aF:-30*D,aF2:-10*D,mt:-50*D,fF:[30,GY],fB:[17,GY]}],[9,{e:'rapido',hx:25,hy:41,lean:24*D,aF:30*D,aF2:10*D,mt:40*D,fF:[30,GY],fB:[17,GY],pz:.1,rc:1,tremor:1}],[13,{e:'segura',hx:25,hy:41,lean:24*D,aF:30*D,aF2:10*D,mt:40*D,fF:[30,GY],fB:[17,GY],pz:.8,rc:1}],[18,{e:'devagar',rc:0}]]);
A.especial.f=kf(K,[[0,{}],[4,{e:'devagar',hx:17,lean:-6*D,escX:-2,fF:[23,GY],fB:[13,GY]}],[6,{e:'rapido',hx:26,lean:20*D,escX:4,es:-.1,fF:[31,GY],fB:[19,GY]}],[7,{hx:27,lean:22*D,escX:5,es:-.12,fF:[31,GY],fB:[19,GY],faisca:.2,brilho:1}],[10,{e:'segura',hx:27,lean:22*D,escX:5,fF:[31,GY],fB:[19,GY],faisca:.9,brilho:1}],[16,{e:'devagar',brilho:0}]]);
A.investida.f=kf(K,[[0,{}],[4,{e:'devagar',hx:16,hy:42,lean:22*D,escX:2}],[9,{e:'rapido',hx:42,hy:41,lean:26*D,escX:4,andar:1,passo:PI*4,rastro:.8,rdx:-5}],[10,{hx:44,hy:41,lean:22*D,escX:5,es:-.15,faisca:.2,brilho:1,tremor:1,flash:.4,rastro:.3}],[13,{e:'segura',hx:44,lean:20*D,escX:4,faisca:.9,brilho:1}],[20,{e:'linear',hx:24,andar:1,passo:PI*4,lean:0}],[24,{e:'devagar',hx:20}]]);
A.terremoto.f=kf(K,[[0,{}],[5,{e:'devagar',hy:43,lean:10*D,aF:-150*D,aF2:-20*D,mt:-190*D}],[10,{e:'devagar',hx:24,hy:24,lean:-6*D,aF:-160*D,aF2:-20*D,mt:-200*D,fF:[28,GY-14],fB:[20,GY-13]}],[12,{e:'segura',hx:25,hy:24,aF:-160*D,mt:-200*D,fF:[29,GY-14],fB:[21,GY-13]}],
  [14,{e:'rapido',hx:28,hy:44,lean:32*D,aF:40*D,aF2:10*D,mt:70*D,fF:[33,GY],fB:[21,GY]}],[15,{hx:28,hy:44,lean:34*D,aF:45*D,mt:75*D,fF:[33,GY],fB:[21,GY],pz:.1,rc:1,onda:.1,rochas:.1,flash:.8,tremor:1}],[22,{e:'segura',hx:28,hy:44,lean:32*D,aF:45*D,mt:75*D,fF:[33,GY],fB:[21,GY],pz:.9,rc:1,onda:.95,rochas:.95,tremor:.5}],[28,{e:'devagar',rc:0}]]);
A.arremesso.f=kf(K,[[0,{}],[5,{e:'devagar',lean:-14*D,aB:-160*D,aB2:-20*D,es:-.6}],[7,{e:'segura',lean:-14*D,aB:-160*D,aB2:-20*D,es:-.6}],[8,{e:'rapido',lean:16*D,aB:-10*D,aB2:0,voa:.05}],[12,{e:'linear',lean:16*D,aB:-10*D,voa:.5,faisca:.1,brilho:1}],[19,{e:'linear',lean:4*D,aB:0,voa:.97,faisca:.9}],[20,{voa:0,aB:20*D,hx:18,tremor:.6}],[26,{e:'devagar'}]]);
A.contra.f=kf(K,[[0,{}],[4,{e:'devagar',hy:42,lean:10*D,escX:3,es:-.1,muro:.4}],[10,{e:'segura',hy:42,lean:10*D,escX:3,es:-.1,muro:.6,brilho:1,tremor:.5}],[12,{e:'devagar',hx:18,lean:-12*D,aF:-150*D,aF2:-20*D,mt:-200*D,muro:0}],[13,{e:'rapido',hx:26,lean:22*D,aF:20*D,aF2:10*D,mt:30*D,fF:[31,GY],fB:[18,GY]}],[14,{hx:27,lean:24*D,aF:30*D,mt:40*D,fF:[31,GY],fB:[18,GY],pz:.1,rc:1,flash:.4}],[18,{e:'segura',hx:27,lean:24*D,aF:30*D,mt:40*D,fF:[31,GY],fB:[18,GY],pz:.8,rc:1}],[22,{e:'devagar',rc:0}]]);
A.defesa.f=kf(K,[[0,{}],[5,{e:'devagar',hy:43,lean:10*D,escX:2,fF:[26,GY],fB:[13,GY],muro:.3}],[9,{e:'rapido',hy:44,lean:12*D,escX:3,fF:[26,GY],fB:[12,GY],muro:1,brilho:1,pz:.1}],[16,{e:'segura',hy:44,lean:12*D,escX:3,fF:[26,GY],fB:[12,GY],muro:1,brilho:1,pz:.8}],[20,{e:'devagar',muro:0,brilho:0}]]);
const BATE=[{aF:-120*D,aF2:-30*D,mt:-170*D,lean:-4*D},{aF:10*D,aF2:-70*D,mt:-40*D,faisca:.1,brilho:1,lean:2*D}];
A.provocar.f=kf(K,[[0,{}],[3,{e:'devagar',...BATE[0]}],[4,{e:'rapido',...BATE[1]}],[6,{...BATE[1],faisca:.6}],[7,{e:'devagar',...BATE[0]}],[8,{e:'rapido',...BATE[1]}],[10,{...BATE[1],faisca:.6}],[11,{e:'devagar',...BATE[0]}],[12,{e:'rapido',...BATE[1]}],[14,{...BATE[1],faisca:.6}],
  [16,{e:'rapido',aF:-60*D,aF2:-60*D,mt:-100*D,ht:-1.4,mo:1,lean:-10*D,tremor:1,pz:.1}],[21,{e:'segura',aF:-60*D,aF2:-60*D,mt:-100*D,ht:-1.4,mo:1,lean:-10*D,pz:.9}],[24,{e:'devagar'}]]);
const KN={hx:22,hy:47,lean:24*D,fF:[29,GY],fB:[15,GY-1],escX:3,es:.6};
A.buff.f=kf(K,[[0,{}],[4,{e:'devagar',...KN,aF:-100*D,aF2:-40*D,mt:-150*D}],[6,{e:'rapido',...KN,aF:30*D,aF2:-30*D,mt:30*D,faisca:.1,quente:.2}],[8,{...KN,aF:30*D,mt:30*D,faisca:.7,quente:.3}],[10,{e:'devagar',...KN,aF:-100*D,aF2:-40*D,mt:-150*D,quente:.35}],[12,{e:'rapido',...KN,aF:30*D,aF2:-30*D,mt:30*D,faisca:.1,quente:.55}],[14,{...KN,aF:30*D,mt:30*D,faisca:.7,quente:.6}],[16,{e:'devagar',...KN,aF:-100*D,aF2:-40*D,mt:-150*D,quente:.65}],[18,{e:'rapido',...KN,aF:30*D,aF2:-30*D,mt:30*D,faisca:.1,quente:.9,flash:.3}],[20,{...KN,aF:30*D,mt:30*D,faisca:.7,quente:1}],[25,{e:'devagar',quente:1,ht:-.6}],[28,{quente:1}]]);
A.ferido.f=kf(K,[[0,{}],[1,{e:'rapido',hx:18,lean:-10*D,ht:-1,es:-.2,fF:[23,GY],fB:[14,GY]}],[3,{hx:18,lean:-4*D,fF:[23,GY],fB:[14,GY]}],[8,{}]]);
A.ferido2.f=kf(K,[[0,{}],[2,{e:'rapido',hx:15,hy:46,lean:-30*D,ht:-1,mo:1,fF:[20,GY],fB:[10,GY],pz:.1}],[8,{e:'segura',hx:15,hy:46,lean:-26*D,fF:[20,GY],fB:[10,GY],pz:.7}],[13,{e:'devagar',hx:18,hy:42,lean:6*D,mo:1,ht:-.5}],[20,{e:'devagar'}]]);
A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-110*D,aF2:-40*D,mt:-95*D,ht:-1,mo:1,brilho:1,aB:-60*D,aB2:-40*D}],[9,{e:'rapido',aF:10*D,aF2:-40*D,mt:80*D,ht:-.6,pz:.1}],[12,{aF:10*D,aF2:-40*D,mt:80*D,pz:.7,suor:0}],[16,{e:'devagar',suor:1,ht:-.6}],[22,{e:'segura',suor:1,ht:-.8,br:1.4}],[26,{suor:.6,ht:-.8}]]);
A.morte.f=kf(K,[[0,{}],[2,{e:'rapido',hx:18,lean:-12*D,ht:-1,fF:[23,GY],fB:[14,GY]}],[8,{e:'devagar',...KN,ht:1.2,aF:60*D,mt:60*D}],[14,{e:'devagar',...KN,hy:43,lean:12*D,ht:-.4,aF:40*D,mt:50*D,tremor:.6,mo:1}],[20,{e:'segura',...KN,hy:42,lean:8*D,ht:-.6,aF:40*D,mt:50*D,tremor:.8,mo:1}],[26,{e:'devagar',...KN,hy:46,lean:20*D,ht:1.4,aF:70*D,mt:70*D}],
  [32,{e:'rapido',...KN,hy:46,lean:20*D,ht:1.4,aF:70*D,mt:70*D,rot:PI/2,px:31,py:GY-1,tx:-3,ty:-4,dead:1,pz:.1}],[40,{...KN,hy:46,lean:20*D,aF:70*D,mt:70*D,rot:PI/2,px:31,py:GY-1,tx:-3,ty:-4,dead:1,pz:.95}]]);
anima(TAN);
HEROIS.tan=TAN;BICHOS.h_tan=TAN;
})();
