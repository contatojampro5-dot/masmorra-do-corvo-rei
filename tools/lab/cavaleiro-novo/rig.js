/* Cavaleiro novo: boneco articulado desenhado em pixels (sem contorno preto, luz nas bordas) */
const PAL={
 aco:['#2b3140','#46506a','#6f7c96','#a7b3c7','#dfe6ef'],
 tab:['#3a0f14','#5e1820','#8a2430','#b23a3c'],
 ouro:['#6a4a12','#b0802a','#e8c25a'],
 malha:['#30343e','#4b5260','#6c7484'],
 couro:['#2a1a12','#4a2e1c','#6a4428'],
 capa:['#1e1220','#2e1a2c','#43243a'],
 madeira:['#3a2414','#5c3a1e','#7e5430'],
 pluma:['#7a1018','#b0202a','#e04a3a'],
 pele:['#5a3626','#8a5a40'],
};
/* ESPADAS do Cavaleiro (mesma ordem do jogo, wIdx): lâmina [base, fio, sombra], guarda, pomo, risco do golpe, faísca e efeito */
const ESPADAS=[
 {n:'Espada do Cavaleiro',lam:['#a7b3c7','#dfe6ef','#6f7c96'],gu:'#b0802a',pm:'#e8c25a',risco:'#dfe9ff',faisca:'#ffe9a8',fx:''},
 {n:'Lâmina Negra',lam:['#2a2634','#7a6a9a','#100c16'],gu:'#3a3644',pm:'#c0182a',risco:'#a890e0',faisca:'#c8b0ff',fx:'runas',cor:'#8a6aff'},
 {n:'Lâmina Negra Ardente',lam:['#221c24','#ff6a1a','#0c0a10'],gu:'#2a2630',pm:'#ff4a1a',risco:'#ffb060',faisca:'#ffb040',fx:'brasas'},
 {n:'Lâmina Negra em Chamas',lam:['#1a1418','#ff8a2a','#08060a'],gu:'#2a2630',pm:'#ff4a1a',risco:'#ff7a2a',faisca:'#ffd060',fx:'chamas'},
 {n:'Lâmina Sombria',lam:['#1e1628','#c08aff','#0c0814'],gu:'#2a2040',pm:'#a060ff',risco:'#c08aff',faisca:'#e0c0ff',fx:'sombria',cor:'#c08aff'},
 {n:'Lâmina do Vazio',lam:['#140c22','#b080ff','#06040c'],gu:'#2a2040',pm:'#a060ff',risco:'#7a4ae0',faisca:'#b080ff',fx:'vazio'}];
/* brilho próprio da espada, por cima da luz (runas, brasas, chamas, vazio). x = contexto 2D do quadro do cavaleiro, t = tempo em ms */
function brilhoEspada(x,info,esp,t){const E=ESPADAS[esp||0];if(!E||!E.fx||!info.hand||!info.tip)return;const h=info.hand,tp=info.tip,L=Math.hypot(tp[0]-h[0],tp[1]-h[1])||1,ux=(tp[0]-h[0])/L,uy=(tp[1]-h[1])/L,nx=-uy,ny=ux;
  const at=r=>[h[0]+ux*r,h[1]+uy*r],px=(a,b,c,al=1)=>{if(al<=0)return;x.globalAlpha=Math.min(1,al);x.fillStyle=c;x.fillRect(Math.round(a),Math.round(b),1,1)},s=t/1000;
  const halo=(cor,al,raio=1)=>{for(let r=1;r<=L;r++){const q=at(r);for(let d=1;d<=raio;d++){px(q[0]+nx*d,q[1]+ny*d,cor,al/d);px(q[0]-nx*d,q[1]-ny*d,cor,al/d)}}};
  // lâmina escura redesenhada por cima da luz (a tocha não clareia o aço negro)
  for(let r=1;r<=L;r++){const q=at(r);px(q[0],q[1],E.lam[0])}for(let r=3;r<=L-1;r+=2){const q=at(r);px(q[0]+nx*.8,q[1]+ny*.8,E.lam[1],.9)}
  if(E.fx==='runas'||E.fx==='sombria'){const fort=E.fx==='sombria';if(fort)halo('#7a3ab0',.35,2);
    [3.5,6,8.5,11].forEach((r,i)=>{const q=at(r),a=.55+.45*Math.sin(s*4+i*1.7);px(q[0],q[1],E.cor,a);px(q[0]+nx,q[1]+ny,E.cor,a*.45);px(q[0]-nx,q[1]-ny,E.cor,a*.45);if(fort)px(q[0],q[1],'#f8e8ff',a*.6)});
    const n=fort?6:2;for(let i=0;i<n;i++){const k=((s*.8+i/n)%1),q=at(2+i*(L-2)/n),y=q[1]-1-k*(fort?11:6);px(q[0]+Math.sin(s*3+i)*1.6,y,i%2?E.cor:'#5a2a9a',1-k)}
    if(fort){const q=at(L);px(q[0],q[1],'#ffffff');px(q[0]+1,q[1],E.cor,.7);px(q[0]-1,q[1],E.cor,.7);px(q[0],q[1]-1,E.cor,.7)}}
  if(E.fx==='brasas'){halo('#c03a1a',.35,1);for(let r=2;r<=L;r++){const q=at(r);if(Math.sin(r*2.7+s*9)>-.2)px(q[0]+nx*.8,q[1]+ny*.8,Math.sin(r+s*6)>.4?'#ffe27a':'#ff6a1a')}
    for(let i=0;i<6;i++){const k=((s*.75+i/6)%1),q=at(2+i*2.2);px(q[0]+Math.sin(s*5+i*1.3)*2,q[1]-1-k*12,k<.4?'#ffe27a':k<.7?'#ff8a2a':'#c03a1a',1-k)}}
  if(E.fx==='chamas'){for(let r=1;r<=L+1.5;r+=.9){const q=at(r),fl=Math.sin(s*12+r*1.7)+.5*Math.sin(s*7.3+r*3.1),meio=Math.sin(Math.min(1,r/L)*Math.PI),hh=2.5+meio*4.2+fl*1.4;
      for(let k=0;k<hh;k++){const c=k>hh-1.5?'#fff2a8':k>hh*.55?'#ffd060':k>hh*.25?'#ff8a2a':'#c03a1a',w=Math.sin(s*8+r+k*.6)*(k/hh)*1.6;px(q[0]+w,q[1]-1-k,c,1-k/(hh+2)*.4);if(k<hh*.5)px(q[0]+w+1,q[1]-1-k,'#e0501a',.6)}}
    for(let r=1;r<=L;r++){const q=at(r);px(q[0],q[1],'#0a080c')}for(let r=3;r<=L-1;r+=3){const q=at(r);px(q[0]+nx*.8,q[1]+ny*.8,'#ffb040')}
    for(let i=0;i<8;i++){const k=((s*1.05+i/8)%1),q=at(2+i*1.6);px(q[0]+Math.sin(s*6+i*1.9)*3,q[1]-6-k*14,k<.5?'#ffe27a':'#ff6a1a',1-k)}}
  if(E.fx==='vazio'){for(let r=0;r<=L+2;r++){const q=at(r);for(let d=1;d<=3;d++){const a=(.75-d*.18)*(.75+.25*Math.sin(s*5+r*.7));px(q[0]+nx*d,q[1]+ny*d,'#05020a',a);px(q[0]-nx*d,q[1]-ny*d,'#05020a',a)}
      if((r+Math.floor(s*10))%3===0){px(q[0]+nx*4,q[1]+ny*4,'#7a4ae0',.8);px(q[0]-nx*4,q[1]-ny*4,'#7a4ae0',.6)}}
    for(let r=1;r<=L;r++){const q=at(r);px(q[0],q[1],'#020104')}for(let r=2;r<=L;r+=2){const q=at(r);px(q[0]+nx*.8,q[1]+ny*.8,'#b080ff',.9)}
    for(let i=0;i<9;i++){const k=((s*.6+i/9)%1),r=2+i*1.4,q=at(r),ang=i*2.3+s*.5,d=(1-k)*12;px(q[0]+Math.cos(ang)*d,q[1]+Math.sin(ang)*d,i%3?'#b080ff':'#e8d8ff',k*1.2)}
    const q=at(L);px(q[0],q[1],'#ffffff');for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]])px(q[0]+a,q[1]+b,'#c8a8ff',.8);for(const [a,b] of [[2,0],[-2,0],[0,2],[0,-2]])px(q[0]+a,q[1]+b,'#7a4ae0',.5)}
  x.globalAlpha=1}
function makeRig(W=40,H=64){const OY=16;
  const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const px=(a,b,col)=>{a=Math.round(a);b=Math.round(b);if(a<0||b<0||a>=W||b>=H)return;x.fillStyle=col;x.fillRect(a,b,1,1)};
  const line=(x0,y0,x1,y1,col,w=1)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let i=0;i<=n;i++){const t=i/n,X=x0+(x1-x0)*t,Y=y0+(y1-y0)*t;for(let a=0;a<w;a++)for(let b=0;b<w;b++)px(X+a-(w>1?Math.floor(w/2):0),Y+b-(w>1?Math.floor(w/2):0),col)}};
  const poly=(pts,col)=>{x.fillStyle=col;let minY=1e9,maxY=-1e9;pts.forEach(p=>{minY=Math.min(minY,p[1]);maxY=Math.max(maxY,p[1])});
    for(let y=Math.floor(minY);y<=Math.ceil(maxY);y++){const xs=[];for(let i=0;i<pts.length;i++){const[a,b]=pts[i],[c2,d]=pts[(i+1)%pts.length];if((b<=y+.5&&d>y+.5)||(d<=y+.5&&b>y+.5)){xs.push(a+(y+.5-b)/(d-b)*(c2-a))}}xs.sort((p,q)=>p-q);for(let k=0;k<xs.length;k+=2)for(let X=Math.round(xs[k]);X<Math.round(xs[k+1]);X++)px(X,y,col)}};
  const P=(o,a,l)=>[o[0]+Math.sin(a)*l,o[1]+Math.cos(a)*l]; // ângulo 0 = para baixo
  function limb(o,a1,l1,a2,l2){const k=P(o,a1,l1);return[k,P(k,a2,l2)]}
  /* perna com IK: dado o quadril e o pé, o joelho dobra sempre para a frente (+x) */
  function ik(h,f,L1=6,L2=6){let dx=f[0]-h[0],dy=f[1]-h[1],d=Math.hypot(dx,dy);const mx=L1+L2-.05;if(d>mx){f=[h[0]+dx/d*mx,h[1]+dy/d*mx];dx=f[0]-h[0];dy=f[1]-h[1];d=mx}
    const a=Math.atan2(dy,dx),c=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d)))),k1=[h[0]+Math.cos(a-c)*L1,h[1]+Math.sin(a-c)*L1],k2=[h[0]+Math.cos(a+c)*L1,h[1]+Math.sin(a+c)*L1];
    return[k1[0]>k2[0]?k1:k2,f]}
  function leg(h,f,cols){const[k,ft]=ik(h,f);const Q=(a,b,col)=>{line(a[0],a[1],b[0],b[1],col,2)};Q(h,k,cols[0]);Q(k,ft,cols[1]);
    px(k[0]+1,k[1],cols[2]);const fx=Math.round(ft[0]),fy=Math.round(ft[1]);line(fx-1,fy+1,fx+2,fy+1,cols[3]);px(fx+2,fy,cols[3]);return k}
  const info={};
  function draw(p){
    x.clearRect(0,0,W,H);p={...p,hy:p.hy+OY,fF:[p.fF[0],p.fF[1]+OY],fB:[p.fB[0],p.fB[1]+OY]};
    const hip=[p.hx,p.hy],lean=p.lean||0,br=p.br||0,neck0=P(hip,Math.PI-lean,10),neck=[neck0[0],neck0[1]-br],ht=Math.max(-1,Math.min(1,p.ht||0)),hd=Math.max(-1,Math.min(1,p.hd||0)),head=[neck[0]+Math.sin(lean)*2+1+ht*.5,neck[1]-4-Math.abs(ht)*.3+hd*.6];
    const shN=[neck[0]+1,neck[1]+2],shF=[neck[0]-1,neck[1]+2];
    // capa (atrás)
    const cw=p.cape||0;poly([[neck[0]-2,neck[1]+1],[neck[0]+1,neck[1]+1],[hip[0]-1,hip[1]+4],[hip[0]-5-cw,hip[1]+7+Math.abs(cw)*.2],[hip[0]-7-cw*1.3,hip[1]+3]],PAL.capa[1]);
    line(hip[0]-5-cw,hip[1]+7,hip[0]-7-cw*1.3,hip[1]+3,PAL.capa[0]);
    // ESCUDO no braço ESQUERDO (o de longe): segurado à frente, por isso vemos só a madeira de dentro e as correias
    const [eS,hS]=limb(shF,p.aB1,3,p.aB2,3);
    { const s=p.shR||5,sx=Math.round(hS[0]+1),sy=Math.round(hS[1]-1);info.shield=[sx+3,sy];
      const sh=[[sx-3,sy-s],[sx+3,sy-s],[sx+3,sy+1],[sx,sy+s+1],[sx-3,sy+1]];poly(sh,PAL.madeira[1]);
      for(let X=sx-2;X<=sx+2;X+=2)line(X,sy-s+1,X,sy+(X===sx?s:1),PAL.madeira[0]);
      line(sx-3,sy-s,sx+3,sy-s,PAL.aco[1]);line(sx+3,sy-s,sx+3,sy+1,PAL.aco[2]);line(sx+3,sy+1,sx,sy+s+1,PAL.aco[1]);line(sx-3,sy-s,sx-3,sy+1,PAL.aco[0]);line(sx-3,sy+1,sx,sy+s+1,PAL.aco[0]);
      if(p.spikes){for(const [a,b] of [[sx+4,sy-s+1],[sx+4,sy-1],[sx+2,sy+3],[sx-4,sy-s+1],[sx-4,sy-1]]){px(a,b,PAL.aco[4]);px(a+(a>sx?1:-1),b,PAL.aco[3])}}
      line(sx-2,sy-2,sx+2,sy-2,PAL.couro[1]);line(sx-2,sy+1,sx+2,sy+1,PAL.couro[1]);px(sx-2,sy-2,PAL.ouro[1]);px(sx+2,sy-2,PAL.ouro[1]);px(sx-2,sy+1,PAL.ouro[1]);px(sx+2,sy+1,PAL.ouro[1]); }
    // braço esquerdo segurando o escudo: braço por trás, antebraço com braçadeira passando pelas correias, mão de ferro na alça
    { const sx=Math.round(hS[0]+1),sy=Math.round(hS[1]-1),ex=sx-3,ey=sy+1;
      line(shF[0],shF[1],eS[0],eS[1],PAL.malha[1],2);line(eS[0],eS[1],ex,ey,PAL.malha[1],2);
      line(ex,ey,sx+1,sy-1,PAL.aco[2],2);px(ex+1,ey-1,PAL.aco[3]);px(sx-1,sy,PAL.aco[1]);
      px(sx+1,sy-2,PAL.aco[3]);px(sx+2,sy-2,PAL.aco[3]);px(sx+1,sy-1,PAL.aco[2]);px(sx+2,sy-1,PAL.aco[2]);px(sx+3,sy-2,PAL.aco[1]); }
    // perna de trás (mais escura)
    leg([hip[0]-1,hip[1]+2],p.fB,[PAL.aco[0],PAL.aco[0],PAL.aco[1],PAL.couro[0]]);
    // tronco: malha por baixo, tabardo vermelho por cima
    poly([[neck[0]-3,neck[1]],[neck[0]+3,neck[1]],[hip[0]+3,hip[1]+2],[hip[0]-3,hip[1]+2]],PAL.malha[1]);
    poly([[neck[0]-2,neck[1]+1],[neck[0]+3+(br>.6?1:0),neck[1]+1],[hip[0]+3,hip[1]+6],[hip[0]-3,hip[1]+6]],PAL.tab[2]);
    line(neck[0]+3,neck[1]+1,hip[0]+3,hip[1]+6,PAL.tab[3]);line(neck[0]-2,neck[1]+1,hip[0]-3,hip[1]+6,PAL.tab[1]);
    const cx=Math.round((neck[0]+hip[0])/2+.5),cy=Math.round((neck[1]+hip[1])/2+1);line(cx,cy-2,cx,cy+3,PAL.ouro[2]);line(cx-1,cy-1,cx+1,cy-1,PAL.ouro[2]);
    line(hip[0]-3,hip[1]+1,hip[0]+3,hip[1]+1,PAL.couro[1]);px(hip[0]+1,hip[1]+1,PAL.ouro[1]);
    // desgaste: riscos no aço, amassados e tabardo rasgado (sem sangue)
    const wr=p.wear||0,nk=[Math.round(neck[0]),Math.round(neck[1])],hp2=[Math.round(hip[0]),Math.round(hip[1])];
    if(wr>=1){line(nk[0]-1,nk[1]+3,nk[0]+2,nk[1]+6,'#d8c8b0');line(nk[0]+2,nk[1]+2,nk[0]+3,nk[1]+4,'#d8c8b0');px(hp2[0]-2,hp2[1]+4,PAL.tab[0]);px(hp2[0]+2,hp2[1]+5,PAL.tab[0])}
    if(wr>=2){px(nk[0]+1,nk[1]+4,'#2a1010');px(nk[0]+2,nk[1]+4,'#2a1010');px(nk[0]+1,nk[1]+5,'#2a1010');px(nk[0]+3,nk[1]+5,'#e8d8c0');
      for(const dx of [-3,-1,1,3])px(hp2[0]+dx,hp2[1]+6,'#140808');px(hp2[0]-2,hp2[1]+5,'#140808');px(hp2[0]+2,hp2[1]+5,'#140808')}
    if(wr>=3){for(const [dx,dy] of [[-3,5],[-3,4],[0,6],[0,5],[0,4],[3,5],[3,4],[2,3],[-2,3]])px(hp2[0]+dx,hp2[1]+dy,'#100606');
      line(nk[0]-2,nk[1]+2,nk[0],nk[1]+8,'#e8d8c0');px(nk[0]-2,nk[1]+1,PAL.malha[0]);px(nk[0]-3,nk[1]+2,PAL.malha[0]);px(nk[0]+3,nk[1]+1,PAL.malha[0])}
    // perna da frente
    leg([hip[0]+1,hip[1]+2],p.fF,[PAL.aco[2],PAL.aco[2],PAL.aco[3],PAL.couro[1]]);
    // gola: malha e aço ligando o elmo aos ombros (a cabeça nunca descola)
    { const nx=Math.round(neck[0]),ny=Math.round(neck[1]),hx2=Math.round(head[0]),hy2=Math.round(head[1])+3;
      line(nx-2,ny+1,hx2-2,hy2,PAL.malha[1],2);line(nx,ny+1,hx2,hy2,PAL.malha[2],2);line(nx+2,ny+1,hx2+2,hy2,PAL.malha[1],2);
      line(nx-3,ny+1,nx+3,ny+1,PAL.aco[2]);px(nx+2,ny,PAL.aco[3]);px(nx-2,ny,PAL.aco[1]); }
    // elmo
    const hx=Math.round(head[0]),hy=Math.round(head[1]);
    poly([[hx-3,hy-3],[hx+2,hy-4],[hx+4,hy-1],[hx+4,hy+3],[hx-3,hy+3]],PAL.aco[2]);line(hx-3,hy-3,hx+2,hy-4,PAL.aco[3]);
    line(hx+1,hy+(ht<-.5?-1:0),hx+4,hy+(ht<-.5?-2:ht>.5?1:0),PAL.aco[0]);px(hx+3,hy+2,PAL.aco[1]);px(hx+4,hy-1,PAL.aco[3]);px(hx-1,hy-3,PAL.aco[4]);
    if(wr>=1){line(hx-2,hy-2,hx,hy+1,'#c8d0dc')}
    if(wr>=2){px(hx+2,hy-3,'#1a1e28');px(hx+3,hy-3,'#1a1e28');px(hx+2,hy-2,PAL.aco[0]);px(hx+4,hy+2,'#1a1e28')}
    if(wr>=3){px(hx-2,hy+1,'#1a1e28');px(hx-1,hy+2,'#1a1e28');px(hx+1,hy-4,'#1a1e28');px(hx+4,hy+1,PAL.aco[0])}
    // penacho para trás
    const pl=p.plume||0;if((p.wear||0)>=3){line(hx-1,hy-4,hx-3-pl*.3,hy-6,PAL.pluma[1],2);px(hx-4,hy-4,PAL.pluma[0]);px(hx-5,hy-3,PAL.pluma[0])}else{line(hx-1,hy-4,hx-4-pl*.5,hy-6,PAL.pluma[1],2);line(hx-4-pl*.5,hy-6,hx-8-pl,hy-4+pl*.3,PAL.pluma[0],2)}px(hx,hy-5,PAL.pluma[2]);px(hx-3,hy-6,PAL.pluma[2]);
    // ESPADA na mão DIREITA (o braço de perto): desenhada por cima de tudo, todo golpe passa na frente do corpo
    const [eF,hF]=limb(shN,p.aF1,4,p.aF2,4);
    const ES=ESPADAS[p.esp||0];
    if(p.smear){const[a0,a1]=p.smear,st=Math.sign(a1-a0)*.06;for(let a=a0;Math.sign(a1-a)===Math.sign(st);a+=st)for(let r=7;r<=14;r++){const q=P(hF,a,r),t=(a-a0)/(a1-a0);px(q[0],q[1],t>.7?(p.esp?ES.lam[1]:PAL.aco[4]):t>.35?(p.esp?ES.risco:'#c8d4e4'):(p.esp?ES.lam[0]:'#8a96aa'))}}
    const sa=p.sw,tip=P(hF,sa,13),g1=P(hF,sa+Math.PI/2,2),g2=P(hF,sa-Math.PI/2,2),pm=P(hF,sa+Math.PI,2);
    info.hand=[hF[0],hF[1]];info.tip=[tip[0],tip[1]];info.hip=[hip[0],hip[1]];
    line(hF[0],hF[1],tip[0],tip[1],p.esp?ES.lam[0]:PAL.aco[3]);if(p.esp){const f1=P(hF,sa-Math.PI/2,.7);for(let r=4;r<=12;r+=2){const q=P(f1,sa,r);px(q[0],q[1],ES.lam[1])}}line(g1[0],g1[1],g2[0],g2[1],p.esp?ES.gu:PAL.ouro[1]);px(pm[0],pm[1],p.esp?ES.pm:PAL.ouro[2]);const m1=P(hF,sa,7);px(m1[0],m1[1],p.esp?ES.lam[1]:PAL.aco[4]);px(tip[0],tip[1],p.esp?ES.lam[1]:PAL.aco[4]);
    line(shN[0],shN[1],eF[0],eF[1],PAL.malha[2],2);line(eF[0],eF[1],hF[0],hF[1],PAL.malha[2],2);px(hF[0],hF[1],PAL.couro[1]);px(shN[0],shN[1],PAL.aco[3]);
    return c}
  return{canvas:c,draw,W,H,info}}
/* luz do ambiente: borda virada para a luz ganha a cor dela, o lado oposto escurece */
function lightPass(src,{dir=-1,col=[255,160,70],amb=[70,60,90],k=.75,tint=0,back=0}={}){
  const W=src.width,H=src.height,s=src.getContext('2d').getImageData(0,0,W,H),o=new ImageData(W,H);
  const A=(i,j)=>i<0||j<0||i>=W||j>=H?0:s.data[(j*W+i)*4+3];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const q=(j*W+i)*4;if(!s.data[q+3])continue;let r=s.data[q],g=s.data[q+1],b=s.data[q+2];
    const edge=!A(i+dir,j)?1:!A(i+dir*2,j)?.45:0,top=!A(i,j-1)?.5:0,far=!A(i-dir,j)?1:0;
    const L=Math.min(1,edge+top*.6)*k;r=r+(col[0]-r)*L*.7;g=g+(col[1]-g)*L*.7;b=b+(col[2]-b)*L*.7;
    if(far&&!edge){if(back){const bw=back;r+=(col[0]-r)*bw*.5;g+=(col[1]-g)*bw*.5;b+=(col[2]-b)*bw*.5}else{r=r*.75+amb[0]*.25;g=g*.75+amb[1]*.25;b=b*.75+amb[2]*.25}}
    if(tint){r+=(col[0]-r)*tint;g+=(col[1]-g)*tint;b+=(col[2]-b)*tint}
    o.data[q]=r;o.data[q+1]=g;o.data[q+2]=b;o.data[q+3]=255}
  const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').putImageData(o,0,0);return c}
