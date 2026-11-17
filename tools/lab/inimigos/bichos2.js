/* Inimigos articulados — Nível 2 (médios). Usa o motor de bichos.js (carregar antes).
   Cada um tem um movimento especial próprio: o esqueleto desmonta e se remonta, o fantasma some, a gosma derrete,
   o cão pega fogo, a gárgula vira pedra e esfarela. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,asaMorcego,D,PI}=BICHO.util,GY=BICHO.GY;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

/* ---------- peças soltas: desenha um corpo como lista de ossos que podem cair no chão (ruína) ---------- */
function Pecas(){const L=[];return{L,
  linha(a,b,col,w=1){L.push({k:'l',p:[a,b],col,w})},
  bola(c,rx,ry,cols){L.push({k:'b',p:[c],rx,ry,cols})},
  poly(arr,col){L.push({k:'pg',p:arr,col})},
  fn(arr,draw){L.push({k:'f',p:arr,draw})}}}
function desenhaPecas(pen,L,ruina,cx,trem=0){const n=L.length;
  L.forEach((q,i)=>{let pts=q.p;
    if(ruina>0){const t=cl(ruina*1.7-((i*7)%n)/n*.7),ty=t*t,tx=t,tcx=cx-8+((i*5)%17),stack=(i%3===0)?1:0;
      if(q.k==='l'){const[a,b]=pts,len=Math.hypot(b[0]-a[0],b[1]-a[1]),y=GY-1-stack;pts=[[lerp(a[0],tcx-len/2,tx),lerp(a[1],y,ty)],[lerp(b[0],tcx+len/2,tx),lerp(b[1],y,ty)]]}
      else if(q.k==='b'){const c=pts[0];pts=[[lerp(c[0],tcx,tx),lerp(c[1],GY-q.ry,ty)]]}
      else{const mx=pts.reduce((s,v)=>s+v[0],0)/pts.length,my=Math.max(...pts.map(v=>v[1]));const dx=(tcx-mx)*tx,dy=(GY-1-my)*ty;pts=pts.map(v=>[v[0]+dx,v[1]+dy])}}
    if(trem&&ruina>0&&ruina<1)pts=pts.map(v=>[v[0]+(((i*13)%3)-1)*trem,v[1]]);
    if(q.k==='l')pen.line(pts[0][0],pts[0][1],pts[1][0],pts[1][1],q.col,q.w);
    else if(q.k==='b')pen.bola(pts[0][0],pts[0][1],q.rx,q.ry,q.cols);
    else if(q.k==='pg')pen.poly(pts,q.col);
    else q.draw(pen,pts)})}

/* =====================================================================================
   ESQUELETOS (guerreiro e arqueiro)
   ===================================================================================== */
const OSSO=['#8a8270','#c8c0aa','#f2ead8'],ESC='#3a3428';
function esqueleto(pen,p,arma){const k=Pecas(),hip=[p.hx,p.hy],lean=p.lean||0,neck=P(hip,-PI/2+lean,9),shF=[neck[0]+1,neck[1]+1],shB=[neck[0]-1,neck[1]+1];
  const perna=(h,f,col)=>{const[kn,ft]=ik(h,f,4.5,4.5,1);k.linha(h,kn,col);k.linha(kn,ft,col);k.fn([ft],(pen,[a])=>{pen.line(a[0]-1,a[1],a[0]+2,a[1],col)})};
  // braço de trás (escudo ou mão da corda)
  let hB;if(arma==='arco'){hB=p._hB}else{const e=P(shB,p.aB,4),h=P(e,p.aB+p.aB2,4);k.linha(shB,e,OSSO[0]);k.linha(e,h,OSSO[0]);hB=h}
  perna([hip[0]-1,hip[1]],p.fB,OSSO[0]);
  // bacia, coluna e costelas
  k.fn([hip],(pen,[h])=>{pen.poly([[h[0]-3,h[1]-1],[h[0]+3,h[1]-1],[h[0]+2,h[1]+1.5],[h[0]-2,h[1]+1.5]],OSSO[1]);pen.px(h[0],h[1],ESC)});
  k.linha(hip,neck,OSSO[1]);
  for(let i=0;i<3;i++){const c=P(neck,PI/2+lean,2+i*1.8);k.fn([c],(pen,[q])=>{pen.line(q[0]-2,q[1]+.5,q[0]+3,q[1]-.3,OSSO[1]);pen.px(q[0],q[1],OSSO[2]);pen.px(q[0]-2,q[1]+1,OSSO[0])})}
  perna([hip[0]+1,hip[1]],p.fF,OSSO[1]);
  // escudo redondo (guerreiro), no braço de trás mas à frente do corpo
  if(arma==='espada')k.fn([hB],(pen,[h])=>{const c=[h[0]+1,h[1]];pen.ell(c[0],c[1],3.8,4.2,'#4a2e1a');pen.ell(c[0],c[1]-.4,3,3.4,'#6a4428');pen.line(c[0]-3,c[1],c[0]+3,c[1],'#4a2e1a');pen.ell(c[0],c[1],1.2,1.2,'#a7b3c7');pen.px(c[0]-.4,c[1]-.6,'#e8eef6')});
  // crânio e mandíbula
  const ht=p.ht||0,hd=[neck[0]+1.5+ht*.4,neck[1]-3.4];
  k.bola(hd,3.4,3,OSSO);
  k.fn([hd],(pen,[h])=>{pen.px(h[0]+1,h[1]-.5,ESC);pen.px(h[0]+2,h[1]-.5,ESC);pen.px(h[0]+1,h[1]+.5,ESC);if(p.eye>0)pen.px(h[0]+2,h[1]-.5,p.eye>1?'#ffe27a':'#ff4a2a');pen.px(h[0]+3,h[1]+1,ESC);
    const jy=h[1]+2+p.jaw*1.6;pen.line(h[0]-1,jy,h[0]+3,jy-.3,OSSO[1]);for(let i=0;i<3;i++)pen.px(h[0]+i,h[1]+2,OSSO[2]);if(p.jaw>.3)pen.line(h[0],h[1]+2.6,h[0]+2.5,h[1]+2.6,ESC)});
  // braço da frente
  if(arma==='espada'){const e=P(shF,p.aF,4),h=P(e,p.aF+p.aF2,4),sa=p.aF+p.aF2+(p.sw||0),t=P(h,sa,10);
    k.fn([h,t],(pen,[a,b])=>{pen.line(a[0],a[1],b[0],b[1],'#8a8a90');const m=[lerp(a[0],b[0],.5),lerp(a[1],b[1],.5)];pen.px(m[0],m[1],'#c8ccd4');pen.px(b[0],b[1],'#e8eef6');pen.px(lerp(a[0],b[0],.75),lerp(a[1],b[1],.75),'#8a5a3a')});
    k.fn([h],(pen,[a])=>{const g1=P(a,sa+PI/2,1.6),g2=P(a,sa-PI/2,1.6);pen.line(g1[0],g1[1],g2[0],g2[1],'#6a4428')});
    k.linha(shF,e,OSSO[2]);k.linha(e,h,OSSO[2]);
    if(p.trilho>0)k.fn([h],(pen,[a])=>{const a0=p.trilho,a1=sa;for(let t=0;t<=1;t+=.1){const ang=lerp(a0,a1,t);for(let r=6;r<=11;r++){const q=P(a,ang,r);pen.px(q[0],q[1],t>.6?'#f2f6ff':'#c8d4e4')}}})}
  else{ // arco: braço da frente segura o arco apontado, o de trás puxa a corda
    const dir=p.mira,hBow=P(shF,dir,7.5),corda=P(hBow,dir+PI,2+p.puxa*6.5);
    const eF=[lerp(shF[0],hBow[0],.5),lerp(shF[1],hBow[1],.5)+.6],eB=[lerp(shB[0],corda[0],.5),lerp(shB[1],corda[1],.5)+1.8];
    k.linha(shB,eB,OSSO[0]);k.linha(eB,corda,OSSO[0]);
    pen.info.boca=P(hBow,dir,1);
    const t1=P(P(hBow,dir-PI/2,6.5),dir+PI,1.6),t2=P(P(hBow,dir+PI/2,6.5),dir+PI,1.6);
    k.fn([hBow,t1,t2,corda],(pen,[b,a1,a2,c])=>{const q1=P(b,dir-PI/2,3.6),q2=P(b,dir+PI/2,3.6);pen.line(a1[0],a1[1],q1[0]+Math.cos(dir),q1[1]+Math.sin(dir),'#7e5430');pen.line(q1[0]+Math.cos(dir),q1[1]+Math.sin(dir),q2[0]+Math.cos(dir),q2[1]+Math.sin(dir),'#5c3a1e');pen.line(q2[0]+Math.cos(dir),q2[1]+Math.sin(dir),a2[0],a2[1],'#7e5430');
      pen.line(a1[0],a1[1],c[0],c[1],'#d8d0bc');pen.line(c[0],c[1],a2[0],a2[1],'#d8d0bc');
      if(p.flecha>.5){const tip=P(c,dir,11);pen.line(c[0],c[1],tip[0],tip[1],'#9a7a50');pen.px(tip[0],tip[1],p.ven>.5?'#8ad04a':'#c8ccd4');const t2=P(tip,dir+PI,1);pen.px(t2[0],t2[1],p.ven>.5?'#4a8a2a':'#8a8a90');const f1=P(c,dir,1);pen.px(f1[0],f1[1]-1,'#b03a2a');pen.px(f1[0],f1[1]+1,'#b03a2a');if(p.ven>.5){pen.px(tip[0]-1,tip[1]+1,'#6ab83a')}}});
    k.linha(shF,eF,OSSO[2]);k.linha(eF,hBow,OSSO[2])}
  desenhaPecas(pen,k.L,p.ruina||0,p.hx,p.trem||0)}

const ESQ_DEF={hx:20,hy:35,lean:0,fF:[23,GY],fB:[16,GY],aF:40*D,aF2:-90*D,aB:70*D,aB2:-70*D,sw:0,ht:0,jaw:0,eye:1,ruina:0,trem:0,trilho:0,rot:0,px:20,py:GY};
const GUE={nome:'Esqueleto Guerreiro',nivel:2,DEF:{...ESQ_DEF},
  draw(pen,p){esqueleto(pen,p,'espada')},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:35+(b>.6?1:0),jaw:f===6||f===7?1:0,ht:sw(f,n,1,2)>.85?.8:0,aF:(40+b*4)*D,eye:f%8<6?1:.5}}},
   ataque:{nome:'Espadada',n:16,fps:14,hits:[8],f:null},
   especial:{nome:'Erguer Escudo',n:16,fps:13,hits:[6],f:null},
   remontar:{nome:'Remontar',n:20,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
GUE.A.ataque.f=kf(GUE.DEF,[[0,{}],[4,{e:'devagar',hx:17,hy:36,lean:-12*D,fF:[22,GY],fB:[13,GY],aF:-150*D,aF2:-30*D,jaw:.6}],[6,{e:'segura',hx:17,hy:36,lean:-12*D,fF:[22,GY],fB:[13,GY],aF:-150*D,aF2:-30*D,jaw:.6}],
  [7,{e:'rapido',hx:24,hy:36,lean:20*D,fF:[30,GY],fB:[17,GY],aF:-40*D,aF2:-20*D,trilho:-180*D}],[8,{e:'rapido',hx:25,hy:37,lean:24*D,fF:[30,GY],fB:[17,GY],aF:30*D,aF2:10*D,trilho:-100*D,jaw:1}],[10,{e:'segura',hx:25,hy:37,lean:24*D,fF:[30,GY],fB:[17,GY],aF:30*D,aF2:10*D}],[16,{e:'devagar'}]]);
GUE.A.especial.f=kf(GUE.DEF,[[0,{}],[3,{e:'devagar',hx:18,hy:36,lean:-6*D,aB:0,aB2:-20*D,fF:[23,GY],fB:[14,GY]}],[5,{e:'rapido',hx:24,hy:36,lean:16*D,aB:-10*D,aB2:0,fF:[29,GY],fB:[17,GY],jaw:1}],[6,{hx:25,hy:36,lean:18*D,aB:-10*D,aB2:0,fF:[29,GY],fB:[17,GY],jaw:1}],
  [9,{e:'devagar',hx:21,hy:36,lean:2*D,aB:10*D,aB2:-30*D,fF:[25,GY],fB:[15,GY]}],[13,{e:'segura',hx:21,hy:36,lean:2*D,aB:10*D,aB2:-30*D,fF:[25,GY],fB:[15,GY]}],[16,{e:'devagar'}]]);
GUE.A.ferido.f=kf(GUE.DEF,[[0,{}],[1,{e:'rapido',hx:16,hy:35,lean:-18*D,ht:-1,jaw:1,trem:1,ruina:.08,fF:[21,GY],fB:[12,GY]}],[3,{hx:16,hy:36,lean:-12*D,jaw:.4,ruina:.03,fF:[21,GY],fB:[12,GY]}],[8,{}]]);
GUE.A.morte.f=kf(GUE.DEF,[[0,{}],[2,{e:'rapido',hx:16,hy:35,lean:-18*D,ht:-1,jaw:1,trem:1}],[4,{e:'suave',hx:16,hy:35,lean:-18*D,jaw:1,trem:1,ruina:.05,eye:0}],[12,{e:'rapido',hx:16,hy:35,lean:-18*D,jaw:1,ruina:1,eye:0}],[14,{hx:16,hy:35,lean:-18*D,ruina:.97,eye:0}],[18,{hx:16,hy:35,lean:-18*D,ruina:1,eye:0}]]);
GUE.A.remontar.f=kf(GUE.DEF,[[0,{hx:16,hy:35,lean:-18*D,ruina:1,eye:0}],[3,{hx:16,hy:35,lean:-18*D,ruina:1,eye:2,trem:1}],[6,{hx:16,hy:35,lean:-18*D,ruina:.97,eye:2,trem:1}],[13,{e:'devagar',hx:18,hy:35,lean:-4*D,ruina:0,eye:2,jaw:1,trem:1}],[16,{e:'segura',hx:18,hy:35,lean:-4*D,eye:2,jaw:1}],[20,{e:'devagar'}]]);

const ARQ={nome:'Esqueleto Arqueiro',nivel:2,DEF:{...ESQ_DEF,mira:-10*D,puxa:0,flecha:0,ven:0},
  draw(pen,p){esqueleto(pen,p,'arco')},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:35+(b>.6?1:0),mira:(55+b*6)*D,jaw:f===10?1:0,ht:sw(f,n,1,1)>.85?-.6:0}}},
   ataque:{nome:'Rajada',n:22,fps:15,hits:[8,16],tiro:'flecha',f:null},
   especial:{nome:'Flecha Imunda',n:20,fps:13,hits:[14],tiro:'flecha verde',f:null},
   defesa:{nome:'Recuar',n:14,fps:13,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
const MIRA={mira:-6*D,lean:2*D,fF:[24,GY],fB:[14,GY]};
ARQ.A.ataque.f=kf(ARQ.DEF,[[0,{}],[3,{e:'devagar',...MIRA,flecha:1}],[6,{e:'devagar',...MIRA,flecha:1,puxa:1,lean:-4*D}],[7,{e:'segura',...MIRA,flecha:1,puxa:1,lean:-4*D}],[8,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-8*D,hx:19,jaw:.6}],
  [11,{e:'devagar',...MIRA,flecha:1,puxa:.2}],[14,{e:'devagar',...MIRA,flecha:1,puxa:1,lean:-4*D}],[15,{e:'segura',...MIRA,flecha:1,puxa:1,lean:-4*D}],[16,{e:'rapido',...MIRA,flecha:0,puxa:0,lean:-8*D,hx:19,jaw:.6}],[22,{e:'devagar'}]]);
ARQ.A.especial.f=kf(ARQ.DEF,[[0,{}],[3,{e:'devagar',mira:70*D,lean:20*D,hx:22,hy:37,flecha:1,ht:1}],[7,{e:'segura',mira:75*D,lean:24*D,hx:22,hy:37,flecha:1,ven:1,ht:1}],[9,{e:'devagar',mira:75*D,lean:24*D,hx:22,hy:37,flecha:1,ven:1,ht:1}],
  [11,{e:'devagar',...MIRA,flecha:1,ven:1,puxa:.6}],[13,{e:'segura',...MIRA,flecha:1,ven:1,puxa:1,lean:-4*D}],[14,{e:'rapido',...MIRA,flecha:0,ven:1,puxa:0,lean:-8*D,hx:19,jaw:1}],[20,{e:'devagar'}]]);
ARQ.A.defesa.f=kf(ARQ.DEF,[[0,{}],[2,{e:'devagar',hy:37,lean:6*D}],[5,{e:'rapido',hx:14,hy:31,lean:-12*D,fF:[18,GY-4],fB:[11,GY-3],mira:-40*D}],[8,{e:'rapido',hx:12,hy:37,lean:-4*D,fF:[16,GY],fB:[8,GY],mira:20*D}],[11,{e:'segura',hx:12,hy:37,lean:-4*D,fF:[16,GY],fB:[8,GY],mira:20*D}],[14,{e:'devagar'}]]);
ARQ.A.ferido.f=GUE.A.ferido.f;
ARQ.A.morte.f=GUE.A.morte.f;

/* =====================================================================================
   FANTASMA
   ===================================================================================== */
const FAN={nome:'Fantasma',nivel:2,voa:1,
  DEF:{bx:0,by:0,wv:0,mo:0,al:1,sy:1,braco:0,lam:0,sh:0,dead:0,rot:0,px:24,py:26,olho:1,gelo:0},
  draw(pen,p){const cx=24+p.bx+p.sh,cy=24+p.by,C=['#7a90b0','#b8cce4','#eef6ff'];
    const top=cy-9*p.sy,w=6.5;
    // corpo de lençol: cúpula, laterais que abrem um pouco e barra ondulada puxada para trás
    const pts=[];for(let i=0;i<=12;i++){const a=PI+i/12*PI;pts.push([cx+Math.cos(a)*w,cy+Math.sin(a)*(cy-top)])}
    pts.push([cx+w+1,cy+6]);for(let i=0;i<=10;i++){const t=i/10,x=lerp(cx+w+1,cx-w-5,t),y=cy+7+t*2.5+Math.sin(t*PI*3+p.wv)*1.4*(.4+t);pts.push([x,y])}pts.push([cx-w-1,cy+4]);
    pen.poly(pts,C[0]);pen.poly(pts.map(([x,y])=>[lerp(cx-1,x,.86),lerp(cy+1,y,.9)]),C[1]);pen.ell(cx-2,top+3,2.4,2,C[2]);pen.line(cx-w+1,cy-2,cx-w+1,cy+4,C[2]);
    // bracinhos
    const bx=cx+5+p.braco*9,by=cy+2-p.braco*1.5;pen.line(cx+4,cy+1,bx,by,C[1],2);if(p.braco>.3){pen.px(bx+1,by,C[2]);pen.px(bx+1,by-1,C[2]);pen.px(bx+1,by+1,C[2])}
    pen.line(cx-5,cy+1,cx-8,cy+3,C[0],2);
    // gelo na mão
    if(p.gelo>0){for(let i=0;i<5;i++){const a=i*1.3+p.wv,r=1.5+p.gelo*2.5;pen.px(bx+2+Math.cos(a)*r,by+Math.sin(a)*r,i%2?'#bfe0ff':'#ffffff')}}
    // rosto
    if(p.dead>.5){olhoX(pen,Math.round(cx+1.5),Math.round(top+4.5),'#2a3448');olhoX(pen,Math.round(cx+5),Math.round(top+4.5),'#2a3448')}
    else{for(const ox of [1,4.5]){const h=Math.max(1,Math.round(3*p.olho));for(let y=0;y<h;y++){pen.px(cx+ox,top+3+y+(3-h)/2,'#1a2030');pen.px(cx+ox+1,top+3+y+(3-h)/2,'#1a2030')}}}
    pen.ell(cx+3.5,top+8+p.mo*.8,.9+p.mo*1.2,.6+p.mo*1.8,'#1a2030');
    // ondas do lamento
    if(p.lam>0){for(let r=0;r<3;r++){const R=4+r*4+p.lam*3,c=r===0?'#eef6ff':'#b8cce4';pen.st.a=Math.max(0,.9-r*.3);for(let a=-.9;a<=.9;a+=.12)pen.px(cx+6+Math.cos(a)*R,top+9+Math.sin(a)*R*1.1,c)}pen.st.a=1}},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({wv:f/n*2*PI*2,by:-sw(f,n,1)*2,sy:1+sw(f,n,2)*.04,olho:f===12?.3:1,braco:sw(f,n,1,2)*.06})},
   ataque:{nome:'Toque Gélido',n:16,fps:13,hits:[8],f:null},
   especial:{nome:'Lamento',n:18,fps:13,hits:[9],f:null},
   buff:{nome:'Desvanecer',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
const fw=(f,o)=>({...o,wv:f*.8});
FAN.A.ataque.f=f=>fw(f,kf(FAN.DEF,[[0,{}],[4,{e:'devagar',bx:-2,by:-3,sy:1.1,braco:-.2,olho:.6}],[7,{e:'rapido',bx:8,by:1,braco:1,mo:.6,gelo:.4}],[8,{bx:9,by:1,braco:1,mo:1,gelo:1}],[11,{e:'segura',bx:9,by:1,braco:1,mo:.6,gelo:1}],[16,{e:'devagar',gelo:0}]])(f));
FAN.A.especial.f=f=>fw(f,kf(FAN.DEF,[[0,{}],[4,{e:'devagar',by:2,sy:.9,mo:.4}],[7,{e:'rapido',by:-3,sy:1.25,mo:2,olho:.4}],[9,{sh:1,by:-3,sy:1.25,mo:2,lam:.3,olho:.4}],[10,{sh:-1,by:-3,sy:1.25,mo:2,lam:.6,olho:.4}],[11,{sh:1,by:-3,sy:1.25,mo:2,lam:.9,olho:.4}],[12,{sh:-1,by:-3,sy:1.25,mo:2,lam:1.2,olho:.4}],[13,{sh:0,by:-3,sy:1.2,mo:1.6,lam:1.5}],[18,{e:'devagar',lam:0}]])(f));
FAN.A.buff.f=f=>fw(f,kf(FAN.DEF,[[0,{}],[4,{e:'devagar',by:-2,sy:1.1}],[10,{e:'devagar',by:-4,sy:1.2,al:.25,olho:.5}],[13,{e:'segura',by:-4,sy:1.2,al:.25,olho:.5}],[18,{e:'devagar',al:.5,by:-1}]])(f));
FAN.A.ferido.f=f=>fw(f,kf(FAN.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-2,sy:.85,mo:1,olho:.3,al:.6}],[3,{bx:-4,by:0,sy:1.05,al:.85}],[8,{}]])(f));
FAN.A.morte.f=f=>fw(f*1.6,kf(FAN.DEF,[[0,{}],[2,{e:'rapido',bx:-3,by:-2,sy:.85,mo:1.4,olho:.3}],[6,{bx:-3,by:-6,sy:1.3,mo:1.6,dead:1,al:.7}],[14,{e:'devagar',bx:-3,by:-16,sy:1.6,mo:1.6,dead:1,al:.1}],[20,{bx:-3,by:-20,sy:1.8,dead:1,al:0}]])(f));

/* =====================================================================================
   GOSMA ÁCIDA
   ===================================================================================== */
const GOS={nome:'Gosma Ácida',nivel:2,
  DEF:{bx:0,by:0,sq:0,jg:0,mo:0,dead:0,olho:1,spl:0,fur:0,rot:0,px:22,py:GY,bo:0,cus:0},
  draw(pen,p){const cx=22+p.bx,base=GY+p.by,rw=10*(1+p.sq*.55),rh=Math.max(1.5,9.5*(1-p.sq*.7)),C=['#2e6a1e','#5aa83a','#9ad86a'];
    const top=base-rh,j=p.jg;
    // corpo: domo com balanço
    const pts=[];for(let i=0;i<=16;i++){const a=PI+i/16*PI,x=cx+Math.cos(a)*rw+Math.sin(a)*j*1.2,y=base-1+Math.sin(a)*rh;pts.push([x,y])}pts.push([cx+rw+1,base]);pts.push([cx-rw-1,base]);
    pen.poly(pts,C[0]);pen.poly(pts.map(([x,y])=>[lerp(cx,x,.86),lerp(base,y,.9)-.4]),C[1]);
    pen.ell(cx-rw*.35+j*.5,top+rh*.32,rw*.28,rh*.18,C[2]);pen.px(cx-rw*.45+j*.5,top+rh*.25,'#e8ffd0');
    // bolhas subindo
    for(let i=0;i<3;i++){const t=((p.bo+i/3)%1),bx=cx-4+i*4,by=base-2-t*rh*.8;if(by>top+2)pen.ell(bx,by,.8+i*.3,.8+i*.3,C[2])}
    // pocinha
    pen.line(cx-rw-2,base,cx+rw+2,base,C[0]);
    // olhos e boca
    const ey=top+rh*.38;
    if(p.dead>.5){olhoX(pen,Math.round(cx+2+j),Math.round(ey),'#1a3a10');olhoX(pen,Math.round(cx+6+j),Math.round(ey),'#1a3a10')}
    else{for(const ox of [2,6]){pen.ell(cx+ox+j,ey,1.6,1.8*p.olho,'#f2ffe8');if(p.olho>.5)pen.px(cx+ox+j+.6,ey,'#102a08')}}
    const my=ey+3;if(p.mo>.2)pen.ell(cx+4.5+j,my+.5,1.5+p.mo,.7+p.mo*1.2,'#1a4010');else pen.line(cx+3+j,my,cx+6+j,my,'#1a4010');
    // gotas espalhadas
    if(p.spl>0){for(let i=0;i<8;i++){const a=PI+(i+.5)/8*PI,r=rw+2+p.spl*8,x=cx+Math.cos(a)*r,y=base-1+Math.sin(a)*(rh*.6+p.spl*6)+p.spl*p.spl*5;pen.ell(x,y,1,1.2,C[1]);pen.px(x,y-1,C[2])}}
    // cuspe saindo
    pen.info.boca=[cx+rw+2,my-1];
    if(p.cus>0)pen.bola(cx+rw+2+p.cus*6,my-1,1.8,1.6,['#2e6a1e','#8ad04a','#d0ff8a'])},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>({sq:sw(f,n,2)*.06,jg:sw(f,n,1)*.6,bo:f/n,olho:f===13?.3:1})},
   ataque:{nome:'Esmagar',n:18,fps:13,hits:[11],f:null},
   especial:{nome:'Cuspe Ácido',n:16,fps:12,hits:[9],tiro:'gosma',f:null},
   buff:{nome:'Espalhar',n:16,fps:12,f:null},
   ferido:{n:10,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
const gb=(f,o)=>({...o,bo:f/16});
GOS.A.ataque.f=f=>gb(f,kf(GOS.DEF,[[0,{}],[4,{e:'devagar',sq:.45,jg:0}],[5,{e:'segura',sq:.45}],[7,{e:'rapido',sq:-.35,by:-12,bx:4,mo:1}],[9,{e:'devagar',sq:-.2,by:-15,bx:8,mo:1}],[11,{e:'rapido',sq:.6,by:0,bx:10,mo:.3,spl:.2}],[12,{sq:.4,bx:10,jg:2,spl:.6}],[13,{sq:-.1,bx:10,jg:-1.5,spl:1}],[15,{sq:.1,bx:10,jg:1}],[18,{e:'devagar'}]])(f));
GOS.A.especial.f=f=>gb(f,kf(GOS.DEF,[[0,{}],[3,{e:'devagar',sq:-.15,by:0}],[7,{e:'devagar',sq:-.3,jg:-1,mo:.4}],[8,{e:'segura',sq:-.3,jg:-1,mo:.4}],[9,{e:'rapido',sq:.25,jg:2,mo:1.2,cus:.3}],[11,{sq:0,jg:-1,mo:.8,cus:1}],[16,{e:'devagar',cus:0}]])(f));
GOS.A.buff.f=f=>gb(f,kf(GOS.DEF,[[0,{}],[4,{e:'devagar',sq:-.25}],[6,{e:'rapido',sq:.7,spl:.1}],[9,{sq:.75,spl:1,olho:.4}],[12,{e:'segura',sq:.6,spl:1.2}],[16,{e:'devagar',spl:0}]])(f));
GOS.A.ferido.f=f=>gb(f,kf(GOS.DEF,[[0,{}],[1,{e:'rapido',bx:-3,sq:.4,jg:-3,mo:.8,olho:.3}],[3,{bx:-3,sq:-.2,jg:2}],[5,{bx:-2,sq:.15,jg:-1.2}],[7,{sq:-.05,jg:.6}],[10,{}]])(f));
GOS.A.morte.f=f=>gb(f,kf(GOS.DEF,[[0,{}],[2,{e:'rapido',bx:-2,sq:.4,jg:-3,mo:1.2,olho:.3}],[5,{bx:-2,sq:-.25,jg:2,mo:1.2,dead:1}],[14,{e:'devagar',bx:-2,sq:1.25,jg:0,mo:0,dead:1}],[20,{bx:-2,sq:1.3,dead:1}]])(f));

/* =====================================================================================
   CARNIÇAL
   ===================================================================================== */
const CAR={nome:'Carniçal',nivel:2,
  DEF:{hx:20,hy:36,lean:38*D,fF:[25,GY],fB:[15,GY],aF:70*D,aF2:20*D,aB:80*D,aB2:30*D,jaw:0,ht:0,dead:0,rot:0,px:20,py:GY,cura:0,sh:0},
  draw(pen,p){const C=['#5a6a4a','#8a9a7a','#b0c09a'],R='#4a3a2a';const hx=p.hx+p.sh;
    const hip=[hx,p.hy],neck=P(hip,-PI/2+p.lean,9),shF=[neck[0],neck[1]+1],shB=[neck[0]-1,neck[1]+1];
    const perna=(h,f,col)=>{const[kn,ft]=ik(h,f,4.6,4.6,1);pen.line(h[0],h[1],kn[0],kn[1],col,2);pen.line(kn[0],kn[1],ft[0],ft[1],col);pen.line(ft[0]-1,ft[1],ft[0]+2,ft[1],col)};
    const braco=(sh,a1,a2,col)=>{const e=P(sh,a1,5),h=P(e,a1+a2,5);pen.line(sh[0],sh[1],e[0],e[1],col,2);pen.line(e[0],e[1],h[0],h[1],col);for(let i=-1;i<=1;i++){const t=P(h,a1+a2+i*.45,2.4);pen.line(h[0],h[1],t[0],t[1],'#e8e0c8')}return h};
    braco(shB,p.aB,p.aB2,C[0]);perna([hx-1,p.hy],p.fB,C[0]);
    // tronco magro curvado com costelas
    pen.poly([[neck[0]-3,neck[1]-.5],[neck[0]+2.5,neck[1]+1],[hip[0]+2.5,hip[1]],[hip[0]-2.5,hip[1]-.5]],C[1]);
    for(let i=0;i<3;i++){const q=P(neck,PI/2+p.lean,2.4+i*1.8);pen.line(q[0]-1.5,q[1],q[0]+2,q[1]+.6,C[0])}
    // trapo
    pen.poly([[hip[0]-3,hip[1]-1],[hip[0]+3,hip[1]-.5],[hip[0]+2.5,hip[1]+3],[hip[0]+.5,hip[1]+2],[hip[0]-1,hip[1]+3.5],[hip[0]-3,hip[1]+2]],R);
    perna([hx+1,p.hy],p.fF,C[1]);
    // cabeça careca com mandíbula grande
    const h=P(neck,-PI/2+p.lean+.5+p.ht*.5,3.5);
    pen.bola(h[0],h[1],3.6,3.2,C);pen.poly([[h[0]-3.5,h[1]-1],[h[0]-6,h[1]-2.5],[h[0]-3,h[1]+.5]],C[0]);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.5),Math.round(h[1]-.5),'#1a2010');else{pen.px(h[0]+1,h[1]-.6,'#ffe27a');pen.px(h[0]+2,h[1]-.6,'#ffe27a');pen.px(h[0]+1.5,h[1]-1.6,'#3a4a2a')}
    const jy=h[1]+2+p.jaw*2.2;pen.poly([[h[0]-1,h[1]+1.4],[h[0]+4.5,h[1]+1.2],[h[0]+4,jy],[h[0],jy]],p.jaw>.2?'#3a1010':C[0]);
    for(let i=0;i<4;i++){pen.px(h[0]+i,h[1]+1.6,'#f2ead8');if(p.jaw>.2)pen.px(h[0]+i+.5,jy-.5,'#f2ead8')}
    braco(shF,p.aF,p.aF2,C[1]);
    if(p.cura>0)for(let i=0;i<4;i++){const y=neck[1]-4-p.cura*6-i*2;pen.px(hx-2+i*2,y,'#7aff8a');pen.px(hx-2+i*2,y+1,'#3ad04a')}},
  A:{
   parado:{n:16,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,2)+1)/2;return{hy:36+(b>.6?1:0),lean:(38+sw(f,n,1)*4)*D,ht:sw(f,n,1,1)*.6,jaw:f===4||f===5?.7:0,aF:(70+sw(f,n,1)*10)*D,aB:(80+sw(f,n,1,1)*10)*D}}},
   ataque:{nome:'Garras',n:18,fps:15,hits:[6,11],f:null},
   especial:{nome:'Devorar',n:20,fps:13,hits:[8],f:null},
   buff:{nome:'Uivo Faminto',n:16,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:18,fps:12,f:null}}};
CAR.A.ataque.f=kf(CAR.DEF,[[0,{}],[3,{e:'devagar',hx:18,lean:20*D,aF:-120*D,aF2:-20*D,jaw:.6}],[5,{e:'rapido',hx:25,lean:45*D,fF:[29,GY],aF:60*D,aF2:10*D,jaw:1}],[6,{hx:26,lean:45*D,fF:[29,GY],aF:80*D,aF2:10*D}],
  [8,{e:'devagar',hx:24,lean:30*D,fF:[29,GY],aB:-110*D,aB2:-20*D,aF:60*D}],[10,{e:'rapido',hx:27,lean:48*D,fF:[30,GY],aB:50*D,aB2:10*D,aF:60*D,jaw:1}],[11,{hx:27,lean:48*D,fF:[30,GY],aB:70*D,aB2:10*D,aF:60*D}],[13,{e:'segura',hx:27,lean:48*D,fF:[30,GY],aB:70*D,aF:60*D}],[18,{e:'devagar'}]]);
CAR.A.especial.f=kf(CAR.DEF,[[0,{}],[4,{e:'devagar',hx:17,hy:38,lean:30*D,fB:[12,GY],jaw:.5}],[6,{e:'rapido',hx:27,hy:34,lean:55*D,fF:[32,GY-2],fB:[20,GY-1],aF:20*D,aB:30*D,jaw:1.2}],[8,{e:'rapido',hx:28,hy:37,lean:58*D,fF:[33,GY],fB:[21,GY],aF:50*D,aB:60*D,jaw:0}],
  [9,{hx:28,hy:37,lean:58*D,fF:[33,GY],fB:[21,GY],jaw:.8}],[10,{hx:28,hy:37,lean:58*D,fF:[33,GY],fB:[21,GY],jaw:0}],[11,{hx:28,hy:37,lean:58*D,fF:[33,GY],fB:[21,GY],jaw:.8}],[12,{hx:28,hy:37,lean:58*D,fF:[33,GY],fB:[21,GY],jaw:0}],
  [15,{e:'devagar',hx:22,lean:30*D,ht:-1,cura:.5}],[18,{e:'devagar',lean:30*D,ht:-1,cura:1}],[20,{e:'devagar',cura:0}]]);
CAR.A.buff.f=kf(CAR.DEF,[[0,{}],[4,{e:'devagar',hy:38,lean:45*D,ht:1}],[7,{e:'rapido',hy:35,lean:5*D,ht:-1.6,jaw:1.4,aF:120*D,aB:130*D}],[8,{sh:1,hy:35,lean:5*D,ht:-1.6,jaw:1.4,aF:120*D,aB:130*D}],[9,{sh:-1,hy:35,lean:5*D,ht:-1.6,jaw:1.4,aF:120*D,aB:130*D}],[10,{sh:1,hy:35,lean:5*D,ht:-1.6,jaw:1.4,aF:120*D,aB:130*D}],[11,{sh:0,hy:35,lean:5*D,ht:-1.6,jaw:1.2,aF:120*D,aB:130*D}],[16,{e:'devagar'}]]);
CAR.A.ferido.f=kf(CAR.DEF,[[0,{}],[1,{e:'rapido',hx:16,lean:10*D,fF:[22,GY],fB:[12,GY],ht:-1,jaw:1,aF:-40*D,aB:-20*D}],[3,{hx:16,lean:16*D,fF:[22,GY],fB:[12,GY],jaw:.4}],[8,{}]]);
CAR.A.morte.f=kf(CAR.DEF,[[0,{}],[2,{e:'rapido',hx:16,lean:10*D,fF:[22,GY],fB:[12,GY],ht:-1,jaw:1,aF:-40*D,aB:-20*D}],[5,{hx:20,hy:39,lean:50*D,fF:[24,GY],fB:[15,GY],jaw:.6,aF:100*D,aB:110*D,px:34,py:GY-1}],
  [9,{e:'rapido',hx:20,hy:39,lean:50*D,fF:[24,GY],fB:[15,GY],jaw:.6,aF:100*D,aB:110*D,rot:PI/2,px:34,py:GY-1,tx:-18,ty:3,dead:1}],[11,{hx:20,hy:39,lean:50*D,fF:[24,GY],fB:[15,GY],aF:100*D,aB:110*D,rot:PI/2*.93,px:34,py:GY-1,tx:-18,ty:1,dead:1}],[13,{hx:20,hy:39,lean:50*D,fF:[24,GY],fB:[15,GY],aF:100*D,aB:110*D,rot:PI/2,px:34,py:GY-1,tx:-18,ty:3,dead:1}],[18,{hx:20,hy:39,lean:50*D,fF:[24,GY],fB:[15,GY],aF:100*D,aB:110*D,rot:PI/2,px:34,py:GY-1,tx:-18,ty:3,dead:1}]]);

/* =====================================================================================
   CÃO INFERNAL
   ===================================================================================== */
const CAO={nome:'Cão Infernal',nivel:2,
  DEF:{bx:0,by:0,lean:0,lg:0,hx:0,hy:0,ht:0,mo:0,fl:1,ph:0,dead:0,rot:0,px:22,py:36,sentar:0,estica:0,bafo:0,fumo:0,tl:0},
  draw(pen,p){const cx=21+p.bx,cy=34+p.by,C=['#2a1210','#5a2016','#8a3420'],F=['#c03a1a','#ff8a2a','#ffe27a'];
    const lean=p.lean,hipP=[cx-6,cy+1+p.sentar*4],shP=P(hipP,-lean,13);shP[1]-=p.sentar*2;
    // chamas (crina e rabo) desenhadas atrás
    const chama=(x,y,h,i)=>{if(p.fl<=0)return;const hh=h*p.fl*(.75+.35*Math.sin(p.ph*2.1+i*1.7));pen.poly([[x-1.5,y],[x+Math.sin(p.ph*1.3+i)*1.2-1,y-hh],[x+1.5,y]],F[0]);pen.poly([[x-.8,y],[x+Math.sin(p.ph*1.3+i)*.8-.6,y-hh*.65],[x+.8,y]],F[1]);pen.px(x,y-1,F[2])};
    for(let i=0;i<6;i++){const t=i/5,q=[lerp(hipP[0]+1,shP[0]+1,t),lerp(hipP[1],shP[1],t)-3];chama(q[0],q[1],3+t*3,i)}
    // rabo
    let q=[hipP[0]-2,hipP[1]-1];for(let i=1;i<=5;i++){const n=[q[0]-1.2,q[1]-.9+Math.sin(i*.8+p.tl)*.5];pen.line(q[0],q[1],n[0],n[1],C[1]);q=n}chama(q[0],q[1]+1,4,9);
    // pernas (de trás escuras)
    const lgF=(ph)=>{const s=Math.sin(p.lg+ph),up=Math.max(0,Math.cos(p.lg+ph))*2;return[s*2.2*(1-p.sentar),up*(1-p.sentar)]};
    const traseira=(x0,ph,col)=>{const[s,up]=lgF(ph),h=[x0,hipP[1]+1],ft=[x0-1+s-p.estica*4,GY-up];const kn=[h[0]+2.5,lerp(h[1],ft[1],.45)];const hk=[ft[0]-1,ft[1]-3.5];pen.line(h[0],h[1],kn[0],kn[1],col,2);pen.line(kn[0],kn[1],hk[0],hk[1],col);pen.line(hk[0],hk[1],ft[0],ft[1],col);pen.line(ft[0],ft[1],ft[0]+2,ft[1],col)};
    const dianteira=(x0,ph,col)=>{const[s,up]=lgF(ph),h=[x0,shP[1]+2],ft=[x0+1+s+p.estica*4,GY-up-p.sentar*0];pen.line(h[0],h[1],ft[0],ft[1],col,2);pen.line(ft[0],ft[1],ft[0]+2,ft[1],col)};
    traseira(hipP[0]+1,PI,C[0]);dianteira(shP[0]-1,0,C[0]);
    // corpo
    const mid=[(hipP[0]+shP[0])/2,(hipP[1]+shP[1])/2];pen.poly([[hipP[0]-3,hipP[1]-3],[shP[0]+1,shP[1]-4],[shP[0]+3,shP[1]+3],[hipP[0]+1,hipP[1]+3.5],[hipP[0]-3.5,hipP[1]+1]],C[1]);
    pen.line(hipP[0]-2,hipP[1]-3,shP[0],shP[1]-4,C[2]);for(let i=0;i<3;i++){const r=[lerp(mid[0],shP[0],.2+i*.25),mid[1]];pen.line(r[0],r[1]-1,r[0]-1,r[1]+2,C[0])}
    traseira(hipP[0]+3,0,C[1]);dianteira(shP[0]+1,PI,C[1]);
    // cabeça
    const h=[shP[0]+3+p.hx,shP[1]-3+p.hy-p.ht*2],ht=p.ht;
    pen.bola(h[0],h[1],3.4,3,C);
    const fx=-ht*.25;pen.poly([[h[0]+1.5,h[1]-1.6],[h[0]+7.5,h[1]+.4+fx*4],[h[0]+7,h[1]+1.8+fx*4],[h[0]+1.5,h[1]+1.8]],C[1]);pen.line(h[0]+1.5,h[1]-1.6,h[0]+7.5,h[1]+.4+fx*4,C[2]);
    if(p.mo>.15){pen.poly([[h[0]+2,h[1]+1.6],[h[0]+7,h[1]+1.6+fx*4],[h[0]+6,h[1]+1.6+p.mo*3+fx*4],[h[0]+2,h[1]+2.4]],'#3a0808');pen.px(h[0]+6.5,h[1]+2+fx*4,'#f2ead8');pen.px(h[0]+5,h[1]+1.4+p.mo*3+fx*4,'#f2ead8');pen.line(h[0]+2,h[1]+2.5,h[0]+6,h[1]+2+p.mo*3+fx*4,C[1])}
    pen.px(h[0]+7.6,h[1]+.4+fx*4,'#120808');
    pen.poly([[h[0]-1.5,h[1]-2],[h[0]-2.5,h[1]-6.5+ht],[h[0]+1,h[1]-2.5]],C[0]);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.5),Math.round(h[1]-.6),'#1a0808');else{pen.px(h[0]+1.5,h[1]-.6,'#ffe27a');pen.px(h[0]+2.5,h[1]-.6,'#ff8a2a')}
    // bafo de fogo
    if(p.bafo>0){for(let i=0;i<7;i++){const t=i/6,x=h[0]+8+t*9*p.bafo,y=h[1]+1.5+Math.sin(i*1.9+p.ph*3)*1.5*t;pen.ell(x,y,1+t*1.6*p.bafo,1+t*1.2*p.bafo,i<2?F[2]:i<5?F[1]:F[0])}}
    // fumaça quando apaga
    if(p.fumo>0){pen.st.a=.6;for(let i=0;i<6;i++){const t=(p.fumo+i/6)%1,x=mid[0]-6+i*3+Math.sin(t*6+i)*1.5,y=mid[1]-5-t*12;pen.ell(x,y,1.2+t*1.5,1.2+t*1.5,'#5a5050')}pen.st.a=1}},
  A:{
   parado:{n:12,fps:10,loop:1,f:(f,n)=>({ph:f/n*2*PI*2,by:sw(f,n,1)>.5?-.5:0,mo:.25+sw(f,n,2)*.2,tl:f/n*2*PI,ht:sw(f,n,1,1)>.8?.6:0})},
   ataque:{nome:'Mordida Flamejante',n:18,fps:14,hits:[9],f:null},
   especial:{nome:'Dilacerar',n:18,fps:14,hits:[7,12],f:null},
   buff:{nome:'Uivo Infernal',n:18,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:20,fps:12,f:null}}};
const cf=(f,o)=>({...o,ph:f*1.1+(o.ph||0)});
CAO.A.ataque.f=f=>cf(f,kf(CAO.DEF,[[0,{}],[4,{e:'devagar',bx:-3,by:2,lean:-6*D,ht:-.3,mo:.6,fl:1.3}],[6,{e:'segura',bx:-3,by:2,lean:-6*D,ht:-.3,mo:.6,fl:1.3}],[7,{e:'rapido',bx:6,by:-6,lean:12*D,estica:1,mo:1.2,lg:1,bafo:.4,fl:1.5}],[9,{e:'rapido',bx:11,by:0,lean:4*D,estica:.2,mo:0,bafo:1,fl:1.5}],[11,{e:'segura',bx:11,lean:4*D,bafo:.6}],[18,{e:'devagar',bafo:0,lg:4}]])(f));
CAO.A.especial.f=f=>cf(f,kf(CAO.DEF,[[0,{}],[3,{e:'devagar',bx:-2,by:1,mo:.6}],[5,{e:'rapido',bx:9,lean:6*D,mo:1.2,lg:1}],[7,{bx:10,lean:6*D,mo:0,hx:1,hy:1,ht:.5}],[8,{bx:10,lean:6*D,mo:0,hx:-1,hy:-1,ht:-.5}],[9,{bx:10,lean:6*D,mo:0,hx:1,hy:1,ht:.5}],
  [10,{bx:9,lean:4*D,mo:1.2}],[12,{bx:11,lean:6*D,mo:0,hx:1,hy:1,ht:.5}],[13,{bx:11,lean:6*D,mo:0,hx:-1,hy:-1,ht:-.5}],[14,{bx:11,lean:6*D,mo:0,hx:1,hy:1}],[18,{e:'devagar',lg:4}]])(f));
CAO.A.buff.f=f=>cf(f,kf(CAO.DEF,[[0,{}],[4,{e:'devagar',sentar:1,lean:28*D,ht:1}],[8,{e:'rapido',sentar:1,lean:34*D,ht:2.5,mo:1.4,fl:2.2}],[13,{e:'segura',sentar:1,lean:34*D,ht:2.5,mo:1.4,fl:2.4}],[18,{e:'devagar',fl:1.2}]])(f));
CAO.A.ferido.f=f=>cf(f,kf(CAO.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-2,lean:12*D,ht:1.2,mo:1,fl:.5}],[3,{bx:-4,by:0,lean:4*D,fl:.7}],[8,{}]])(f));
CAO.A.morte.f=f=>cf(f,kf(CAO.DEF,[[0,{}],[2,{e:'rapido',bx:-4,by:-2,lean:14*D,ht:1.2,mo:1,fl:.6}],[6,{bx:-4,by:2,lean:-4*D,ht:-.4,fl:.4,rot:.4,px:22,py:GY}],[9,{e:'rapido',bx:-4,by:4,lean:-4*D,fl:.1,rot:0,dead:1,sentar:.5,estica:-.6,fumo:.1}],[20,{e:'linear',bx:-4,by:4,lean:-4*D,fl:0,dead:1,sentar:.5,estica:-.6,fumo:1}]])(f));

/* =====================================================================================
   GÁRGULA
   ===================================================================================== */
function asaGar(pen,s,ang,len,fim,col,osso){const tip=P(s,ang,len),m=P(s,ang,len*.55);const pts=[s,m,tip];for(let i=1;i<=3;i++){const t=i/4,q=[lerp(tip[0],fim[0],t),lerp(tip[1],fim[1],t)];const ctr=[(s[0]+tip[0]+fim[0])/3,(s[1]+tip[1]+fim[1])/3];pts.push([lerp(q[0],ctr[0],.22),lerp(q[1],ctr[1],.22)]);if(i<3){const t2=(i+.5)/4;pts.push([lerp(tip[0],fim[0],t2),lerp(tip[1],fim[1],t2)])}}pts.push(fim);
  pen.poly(pts,col);pen.line(s[0],s[1],m[0],m[1],osso,2);pen.line(m[0],m[1],tip[0],tip[1],osso);for(let i=1;i<=2;i++){const t=i/3,q=[lerp(tip[0],fim[0],t),lerp(tip[1],fim[1],t)];pen.line(m[0],m[1],q[0],q[1],osso)}pen.px(tip[0],tip[1],'#e8e0c8')}
const GAR={nome:'Gárgula',nivel:2,voa:1,
  DEF:{bx:0,by:0,lean:16*D,wa:-125*D,aF:60*D,aB:70*D,ht:0,mo:0,pd:0,ck:0,dead:0,rot:0,px:22,py:GY,voo:0,al:1,rb:0},
  draw(pen,p){const pd=p.pd,mixc=(a,b)=>{const h=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const A=h(a),B=h(b);return'#'+A.map((v,i)=>Math.round(lerp(v,B[i],pd)).toString(16).padStart(2,'0')).join('')};
    const C=[mixc('#33383f','#6a6a66'),mixc('#4e5560','#9a9890'),mixc('#6f7884','#c8c4b8')],osso=mixc('#22262c','#4a4844');
    const cx=21+p.bx,base=GY+p.by-p.voo*10,hip=[cx,base-6],neck=P(hip,-PI/2+p.lean,8);
    // entulho
    if(p.rb>0){for(let i=0;i<9;i++){const x=cx-8+((i*7)%17),h=1+((i*3)%3)*p.rb;pen.ell(x,GY-h*.5,1.6,h,i%2?'#6a6a66':'#4e5560')}}
    // asa de trás
    asaGar(pen,[neck[0]-1,neck[1]+1],p.wa+.25,14,[hip[0]-7,hip[1]+1],C[0],osso);
    // pernas agachadas (garras)
    const perna=(x0,col)=>{const h=[x0,hip[1]],ft=[x0+3,base];const kn=[x0+4,hip[1]+1];pen.line(h[0],h[1],kn[0],kn[1],col,2);pen.line(kn[0],kn[1],ft[0]-1,ft[1]-1,col,2);pen.line(ft[0]-2,ft[1],ft[0]+2,ft[1],col);pen.px(ft[0]+2,ft[1],'#e8e0c8')};
    perna(cx-2,C[0]);
    // braço de trás
    const sb=[neck[0]-1,neck[1]+1.5],eb=P(sb,p.aB,4),hb=P(eb,p.aB+.5,4);pen.line(sb[0],sb[1],eb[0],eb[1],C[0],2);pen.line(eb[0],eb[1],hb[0],hb[1],C[0]);
    // corpo
    pen.poly([[neck[0]-3.5,neck[1]],[neck[0]+3,neck[1]+.5],[hip[0]+3.5,hip[1]+1],[hip[0]-3.5,hip[1]+1]],C[1]);pen.line(neck[0]+3,neck[1]+.5,hip[0]+3.5,hip[1]+1,C[2]);
    for(let i=0;i<2;i++){const q=P(neck,PI/2+p.lean,2.5+i*2.4);pen.line(q[0]-1,q[1],q[0]+2.5,q[1],C[0])}
    // rabo de pedra
    let q=[hip[0]-3,hip[1]+1];for(let i=1;i<=5;i++){const n=[q[0]-1.3,q[1]+.6+Math.sin(i)*.4];pen.line(q[0],q[1],n[0],n[1],C[0],i<3?2:1);q=n}pen.poly([[q[0]-2,q[1]],[q[0],q[1]-1.5],[q[0]+.5,q[1]+1.5]],C[1]);
    perna(cx+1,C[1]);
    // cabeça com chifres
    const h=[neck[0]+1.6+p.ht*.4,neck[1]-3.4];pen.line(h[0]-1,h[1]-2.5,h[0]-4,h[1]-6,C[2]);pen.line(h[0]-2,h[1]-2,h[0]-6,h[1]-3.5,C[1]);
    pen.bola(h[0],h[1],3.6,3.2,C);pen.poly([[h[0]+1,h[1]-1],[h[0]+5.5,h[1]+.5],[h[0]+4.5,h[1]+2.4+p.mo*1.5],[h[0]+1,h[1]+2.2]],C[1]);
    if(p.mo>.2){pen.line(h[0]+1.5,h[1]+2,h[0]+4.5,h[1]+2+p.mo*1.2,'#1a1010');pen.px(h[0]+4,h[1]+1.8,'#e8e0c8')}
    const brilho=p.dead>.5?0:1-pd*.85;if(p.dead>.5)olhoX(pen,Math.round(h[0]+1.6),Math.round(h[1]-.8),'#1a1a1a');else{pen.px(h[0]+1.4,h[1]-.8,brilho>.5?'#ff9a2a':'#6a5a40');pen.px(h[0]+2.4,h[1]-.8,brilho>.5?'#ffe27a':'#6a5a40')}
    // asa da frente
    asaGar(pen,[neck[0]+.5,neck[1]+1.5],p.wa,13,[hip[0]-4,hip[1]],C[1],osso);
    // braço da frente com garras
    const sf=[neck[0]+1,neck[1]+1.5],ef=P(sf,p.aF,4),hf=P(ef,p.aF+.5,4);pen.line(sf[0],sf[1],ef[0],ef[1],C[1],2);pen.line(ef[0],ef[1],hf[0],hf[1],C[1]);for(let i=-1;i<=1;i++){const t=P(hf,p.aF+.5+i*.5,2.2);pen.line(hf[0],hf[1],t[0],t[1],'#e8e0c8')}
    // rachaduras
    if(p.ck>0){const n=Math.round(p.ck*8);for(let i=0;i<n;i++){const x=cx-4+((i*5)%9),y=base-14+((i*7)%13);pen.line(x,y,x+1.5,y+2,'#14161a');pen.px(x+2,y+3,'#14161a')}}
    if(pd>.3){for(let i=0;i<4;i++)pen.px(cx-3+i*2.5,base-9-i*2,'#e8e4d8')}},
  A:{
   parado:{n:16,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{by:b>.6?-.5:0,wa:(-125+sw(f,n,1)*5)*D,ht:sw(f,n,1,1.5)>.8?.8:0,mo:f===9?.6:0}}},
   ataque:{nome:'Garras de Pedra',n:16,fps:14,hits:[8],f:null},
   especial:{nome:'Mergulho',n:24,fps:15,hits:[10,17],f:null},
   buff:{nome:'Petrificar',n:20,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},morte:{n:22,fps:12,f:null}}};
GAR.A.ataque.f=kf(GAR.DEF,[[0,{}],[4,{e:'devagar',bx:-1,by:-2,lean:-6*D,aF:-130*D,wa:-95*D,mo:.6}],[6,{e:'segura',bx:-1,by:-2,lean:-6*D,aF:-130*D,wa:-95*D,mo:.6}],[7,{e:'rapido',bx:8,by:0,lean:30*D,aF:30*D,wa:-140*D,mo:1}],[8,{e:'rapido',bx:9,lean:34*D,aF:60*D,wa:-145*D,mo:.8}],[10,{e:'segura',bx:9,lean:34*D,aF:60*D,wa:-145*D}],[16,{e:'devagar'}]]);
GAR.A.especial.f=kf(GAR.DEF,[[0,{}],[3,{e:'devagar',by:2,wa:-150*D,lean:6*D}],[5,{e:'rapido',voo:1,by:-2,wa:-70*D,lean:-6*D}],[7,{voo:1.3,by:-2,wa:-175*D,lean:-6*D}],[8,{voo:1.3,by:-2,wa:-70*D,lean:0}],
  [10,{e:'rapido',voo:.2,bx:10,by:0,wa:-150*D,lean:50*D,aF:30*D,mo:1}],[12,{voo:.9,bx:6,by:-2,wa:-175*D,lean:0}],[14,{voo:1.3,bx:2,by:-2,wa:-70*D,lean:-6*D}],
  [17,{e:'rapido',voo:.2,bx:10,by:0,wa:-150*D,lean:50*D,aF:30*D,mo:1}],[19,{voo:.6,bx:5,wa:-170*D,lean:10*D}],[24,{e:'devagar'}]]);
GAR.A.buff.f=kf(GAR.DEF,[[0,{}],[4,{e:'devagar',by:1,lean:-4*D,ht:-1,mo:.6,wa:-70*D}],[8,{e:'devagar',by:2,lean:30*D,ht:1,wa:-160*D,aF:100*D,aB:100*D,pd:.5}],[12,{e:'devagar',by:2,lean:34*D,ht:1,wa:-165*D,aF:110*D,aB:110*D,pd:1}],[20,{e:'segura',by:2,lean:34*D,ht:1,wa:-165*D,aF:110*D,aB:110*D,pd:1}]]);
GAR.A.ferido.f=kf(GAR.DEF,[[0,{}],[1,{e:'rapido',bx:-4,by:-1,lean:-14*D,ht:-1,mo:1,ck:.3,wa:-80*D}],[3,{bx:-4,lean:-6*D,ck:.2}],[8,{ck:0}]]);
GAR.A.morte.f=kf(GAR.DEF,[[0,{}],[2,{e:'rapido',bx:-4,by:-1,lean:-14*D,ht:-1,mo:1,ck:.4,wa:-80*D}],[6,{bx:-3,by:2,lean:30*D,ht:1,ck:.8,pd:.6,wa:-160*D,dead:1}],[10,{bx:-3,by:2,lean:30*D,ht:1,ck:1,pd:1,wa:-160*D,dead:1}],[16,{e:'devagar',bx:-3,by:2,lean:30*D,ck:1,pd:1,dead:1,al:.2,rb:.6}],[22,{bx:-3,by:2,lean:30*D,ck:1,pd:1,dead:1,al:0,rb:1}]]);

Object.assign(BICHOS,{arqueiro:ARQ,esqueleto:GUE,fantasma:FAN,limo:GOS,carnical:CAR,cao:CAO,gargula:GAR});
})();
