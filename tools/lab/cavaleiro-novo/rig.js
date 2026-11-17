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
    const hip=[p.hx,p.hy],lean=p.lean||0,br=p.br||0,neck0=P(hip,Math.PI-lean,10),neck=[neck0[0],neck0[1]-br],ht=p.ht||0,head=[neck[0]+Math.sin(lean)*2+1+ht*.6,neck[1]-4-Math.abs(ht)*.4+(p.hd||0)];
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
    // perna da frente
    leg([hip[0]+1,hip[1]+2],p.fF,[PAL.aco[2],PAL.aco[2],PAL.aco[3],PAL.couro[1]]);
    // elmo
    const hx=Math.round(head[0]),hy=Math.round(head[1]);
    poly([[hx-3,hy-3],[hx+2,hy-4],[hx+4,hy-1],[hx+4,hy+3],[hx-3,hy+3]],PAL.aco[2]);line(hx-3,hy-3,hx+2,hy-4,PAL.aco[3]);
    line(hx+1,hy+(ht<-.5?-1:0),hx+4,hy+(ht<-.5?-2:ht>.5?1:0),PAL.aco[0]);px(hx+3,hy+2,PAL.aco[1]);px(hx+4,hy-1,PAL.aco[3]);px(hx-1,hy-3,PAL.aco[4]);
    // penacho para trás
    const pl=p.plume||0;line(hx-1,hy-4,hx-4-pl*.5,hy-6,PAL.pluma[1],2);line(hx-4-pl*.5,hy-6,hx-8-pl,hy-4+pl*.3,PAL.pluma[0],2);px(hx,hy-5,PAL.pluma[2]);px(hx-3,hy-6,PAL.pluma[2]);
    // ESPADA na mão DIREITA (o braço de perto): desenhada por cima de tudo, todo golpe passa na frente do corpo
    const [eF,hF]=limb(shN,p.aF1,4,p.aF2,4);
    if(p.smear){const[a0,a1]=p.smear,st=Math.sign(a1-a0)*.06;for(let a=a0;Math.sign(a1-a)===Math.sign(st);a+=st)for(let r=7;r<=14;r++){const q=P(hF,a,r),t=(a-a0)/(a1-a0);px(q[0],q[1],t>.7?PAL.aco[4]:t>.35?'#c8d4e4':'#8a96aa')}}
    const sa=p.sw,tip=P(hF,sa,13),g1=P(hF,sa+Math.PI/2,2),g2=P(hF,sa-Math.PI/2,2),pm=P(hF,sa+Math.PI,2);
    info.hand=[hF[0],hF[1]];info.tip=[tip[0],tip[1]];info.hip=[hip[0],hip[1]];
    line(hF[0],hF[1],tip[0],tip[1],PAL.aco[3]);line(g1[0],g1[1],g2[0],g2[1],PAL.ouro[1]);px(pm[0],pm[1],PAL.ouro[2]);const m1=P(hF,sa,7);px(m1[0],m1[1],PAL.aco[4]);px(tip[0],tip[1],PAL.aco[4]);
    line(shN[0],shN[1],eF[0],eF[1],PAL.malha[2],2);line(eF[0],eF[1],hF[0],hF[1],PAL.malha[2],2);px(hF[0],hF[1],PAL.couro[1]);px(shN[0],shN[1],PAL.aco[3]);
    return c}
  return{canvas:c,draw,W,H,info}}
/* luz do ambiente: borda virada para a luz ganha a cor dela, o lado oposto escurece */
function lightPass(src,{dir=-1,col=[255,160,70],amb=[70,60,90],k=.75}={}){
  const W=src.width,H=src.height,s=src.getContext('2d').getImageData(0,0,W,H),o=new ImageData(W,H);
  const A=(i,j)=>i<0||j<0||i>=W||j>=H?0:s.data[(j*W+i)*4+3];
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const q=(j*W+i)*4;if(!s.data[q+3])continue;let r=s.data[q],g=s.data[q+1],b=s.data[q+2];
    const edge=!A(i+dir,j)?1:!A(i+dir*2,j)?.45:0,top=!A(i,j-1)?.5:0,far=!A(i-dir,j)?1:0;
    const L=Math.min(1,edge+top*.6)*k;r=r+(col[0]-r)*L*.7;g=g+(col[1]-g)*L*.7;b=b+(col[2]-b)*L*.7;
    if(far&&!edge){r=r*.75+amb[0]*.25;g=g*.75+amb[1]*.25;b=b*.75+amb[2]*.25}
    o.data[q]=r;o.data[q+1]=g;o.data[q+2]=b;o.data[q+3]=255}
  const c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').putImageData(o,0,0);return c}
