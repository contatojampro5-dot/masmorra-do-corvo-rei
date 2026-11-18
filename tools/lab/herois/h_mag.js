/* MAGO ARCANO — escolhido de Morvane (pacto): o melhor aluno da Academia, expulso por abrir o diário de Morvane (lore).
   Manto azul, chapéu pontudo, cajado evolutivo, e o diário que flutua com ele. */
(function(){
const {P,lerp,kf,sw,olhoX,D,PI}=BICHO.util;const {W,H,GY,ALVO,cl,dit,PELE,DEFB,corpo,anima,estrelas}=HB;
const CAJ=[{n:'Cajado de Freixo',m:['#8a6038','#5a3a1a'],mg:['#2a6ab0','#4ab0ff','#cfefff']},{n:'Cajado Rúnico',m:['#5a4a6a','#2a2234'],mg:['#2a6ab0','#4ab0ff','#cfefff'],runa:1},
  {n:'Cajado de Gelo',m:['#8aa8c0','#4a6880'],mg:['#6ac8f0','#a8e8ff','#ffffff'],gelo:1},{n:'Cajado do Inverno Eterno',m:['#c8e0f0','#6a90b0'],mg:['#6ac8f0','#a8e8ff','#ffffff'],gelo:2},
  {n:'Cajado de Ametista',m:['#3a2a4a','#1c1424'],mg:['#7a3ab0','#b06aff','#f0d8ff'],ame:1},{n:'Cajado da Tempestade',m:['#4a3a5a','#241a30'],mg:['#a050e0','#d0a0ff','#fff6a0'],raio:1}];
const FOGO=['#c03a1a','#ff8a2a','#ffe27a'],GELO=['#4a9ac8','#a8e8ff','#ffffff'],RAIO=['#a050e0','#f0d0ff','#fff6a0'];
const MAG={nome:'Mago Arcano',W,H,GY,semEspelho:1,armas:CAJ.map(a=>a.n),
  DEF:{...DEFB,aF:55*D,aF2:-145*D,cj:-84*D,carga:0,orb:0,fogo:0,expl:0,gelo:0,crist:0,raio:0,met:0,dome:0,runas:0,levita:0,chapeu:0,circ:0,livro:0,paginas:0,roxo:0,malab:0,ajeita:0,fogos:0,cjGira:0},molas:['capa','chapeu'],
  draw(pen,p){const R=['#162c54','#24467e','#3a64a8','#5a84c8'],O=['#8a6a1a','#c8a040'],A=CAJ[p.arma|0];
    const hy0=p.hy-p.levita*4;const B=corpo(pen,{...p,hy:hy0},{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    // braço de trás: segura o diário ou ajeita o chapéu
    const chap=[head[0]-.5,head[1]-3];const maoB=p.ajeita>0?null:B.braco(shB,p.aB,p.aB2,[R[0],R[0]],PELE[0]);
    if(p.ajeita>0){const h=[lerp(shB[0]+3,chap[0]+3,p.ajeita),lerp(shB[1]+6,chap[1],p.ajeita)],e=[lerp(shB[0],h[0],.5)-1,lerp(shB[1],h[1],.5)+1.5];pen.line(shB[0],shB[1],e[0],e[1],R[0],2);pen.line(e[0],e[1],h[0],h[1],R[0],2);pen.px(h[0],h[1],PELE[0])}
    const hem=GY-p.levita*4,w1=6.5+p.capa*.3;pen.poly([[neck[0]-3.5,neck[1]],[neck[0]+3.5,neck[1]+.5],[hip[0]+w1,hem],[hip[0]-w1-1,hem]],R[1]);pen.line(neck[0]+3.5,neck[1]+.5,hip[0]+w1,hem,R[2]);pen.line(hip[0]-w1-1,hem-1,hip[0]+w1,hem-1,O[1]);
    pen.line(neck[0]+.5,neck[1]+1,hip[0]+1,hem-1,R[0]);pen.line(hip[0]-3.5,hip[1],hip[0]+4,hip[1],'#3a2a14',2);pen.px(hip[0]+1,hip[1],O[1]);
    pen.bola(head[0]+.4,head[1]+.4,3.2,3.4,PELE);pen.line(head[0]-3,head[1]-1,head[0]-3,head[1]+2,'#5a3a1a',2);
    const olho=[head[0]+1.6,head[1]-.2];
    if(p.dead>.5)olhoX(pen,Math.round(head[0]+1.6),Math.round(head[1]),'#1a1a2a');else{pen.px(olho[0],olho[1],'#1a2a4a');pen.px(olho[0]+.8,olho[1],'#ffffff')}
    if(p.mo>.3)pen.px(head[0]+2,head[1]+2,'#8a3a2a');
    const hb=[head[0]-.5,head[1]-2.8],inc=-.08+p.ht*.12+p.chapeu*.05-p.ajeita*.15;pen.line(P(hb,PI+inc,6)[0],P(hb,PI+inc,6)[1],P(hb,inc,6)[0],P(hb,inc,6)[1],R[0],2);
    const c1=P(hb,-PI/2+inc-.05,5),tip=P(c1,-PI/2+inc-.9-p.chapeu*.15,5);pen.poly([P(hb,PI+inc,3.4),c1,tip,P(c1,inc,1),P(hb,inc,3.2)],R[1]);pen.line(c1[0],c1[1],tip[0],tip[1],R[3]);
    pen.line(P(hb,PI+inc,3)[0],P(hb,PI+inc,3)[1]-1,P(hb,inc,3)[0],P(hb,inc,3)[1]-1,O[1]);pen.px(hb[0]+.5,hb[1]-1.2,'#ffe27a');
    // cajado (pode girar na mão)
    const ef=P(shF,p.aF,4.5),hf=P(ef,p.aF+p.aF2,4.5),cj=p.cj+p.cjGira*p.ph*.9,s0=P(hf,cj+PI,10),s1=P(hf,cj,13);
    pen.line(s0[0],s0[1],s1[0],s1[1],A.m[0],2);pen.line(s0[0],s0[1],s1[0],s1[1],A.m[1]);const top=P(s1,cj,2.5);
    if(A.ame){for(const [da,l] of [[-.4,4],[0,5.5],[.4,4.2]]){const t=P(s1,cj+da,l);pen.line(s1[0],s1[1],t[0],t[1],A.mg[1],2);pen.px(t[0],t[1],A.mg[2])}}
    else if(A.gelo){const big=A.gelo>1;for(const [da,l] of [[-.5,big?5:3],[0,big?8:5],[.5,big?5:3]]){const t=P(s1,cj+da,l);pen.line(s1[0],s1[1],t[0],t[1],A.mg[1],big?2:1);pen.px(t[0],t[1],'#ffffff')}}
    else{pen.line(s1[0]-1.5,s1[1],top[0]-1.5,top[1]-1,A.m[0]);pen.line(s1[0]+1.5,s1[1],top[0]+1.5,top[1]-1,A.m[0]);pen.ell(top[0],top[1],1.7,1.7,A.mg[0]);pen.px(top[0],top[1]-.4,A.mg[2])}
    pen.line(shF[0],shF[1],ef[0],ef[1],R[2],2);pen.line(ef[0],ef[1],hf[0],hf[1],PELE[1],2);
    pen.info.boca=top;
    const ph=p.ph,v=k=>p[k]||0;const carga=v('carga'),orb=v('orb'),fogo=v('fogo'),expl=v('expl'),gelo=v('gelo'),crist=v('crist'),raio=v('raio'),met=v('met'),dome=v('dome'),runas=v('runas'),circ=v('circ'),livro=v('livro'),paginas=v('paginas'),roxo=v('roxo'),malab=v('malab'),fogos=v('fogos');
    const livroC=[(maoB?maoB.h[0]:shB[0])+3,(maoB?maoB.h[1]:shB[1])-3-livro*2];
    pen.depois(pn=>{
      const g=.6+.4*Math.sin(ph*.7)+carga;pn.px(top[0],top[1],A.mg[2]);if(g>.8){pn.px(top[0]-1,top[1],A.mg[1]);pn.px(top[0]+1,top[1],A.mg[1]);pn.px(top[0],top[1]-1,A.mg[1])}
      if(A.runa)for(let i=0;i<4;i++){const q=P(hf,cj,-6+i*4);pn.px(q[0],q[1],(ph+i)%4<2?'#8ad8ff':'#4a90d0')}
      if(A.gelo>1)for(let i=0;i<7;i++){const k=((ph*.04+i/7)%1);pn.px(hip[0]-12+((i*9)%26)+Math.sin(k*6+i)*2,k*GY,'#e8f6ff')}
      if(A.raio){for(let k=0;k<2;k++){if((ph+k)%3===0)continue;let a=top;for(let i=0;i<3;i++){const n=[a[0]+(Math.sin(ph*2+i+k)*2.5),a[1]-2-i];pn.line(a[0],a[1],n[0],n[1],'#fff6a0');a=n}}pn.ell(top[0],top[1],2.2,2.2,'#d0a0ff');pn.px(top[0],top[1],'#ffffff')}
      if(roxo>0&&p.dead<.5){pn.px(olho[0],olho[1],'#d090ff');pn.px(olho[0]+.8,olho[1],'#ffffff');pn.px(olho[0]-1,olho[1]+.3,'#9a5ae0')}
      if(carga>0){for(let i=0;i<8;i++){const a=ph*.6+i*PI/4,r=(1-carga)*8+2;pn.px(top[0]+Math.cos(a)*r,top[1]+Math.sin(a)*r,i%2?A.mg[1]:A.mg[2])}}
      if(orb>0){const r=1+orb*3.4,c=[top[0]+2,top[1]];pn.ell(c[0],c[1],r+1,r+1,FOGO[0]);pn.ell(c[0],c[1],r,r,FOGO[1]);pn.ell(c[0]-.5,c[1]-.5,r*.5,r*.5,FOGO[2]);for(let i=0;i<3;i++)pn.px(c[0]+Math.sin(ph+i*2)*r,c[1]-r-1-i,FOGO[1])}
      if(fogo>0&&fogo<1){const x=lerp(top[0]+2,ALVO[0],fogo),y=lerp(top[1],ALVO[1],fogo)-Math.sin(fogo*PI)*4;for(let k=1;k<=5;k++)pn.ell(x-k*2.2,y,3.5-k*.5,3-k*.45,k<2?FOGO[1]:FOGO[0]);pn.ell(x,y,3.6,3.2,FOGO[1]);pn.ell(x,y,2,1.8,FOGO[2])}
      if(expl>0&&expl<1){const r=3+expl*12;for(let a=0;a<PI*2;a+=.15){pn.px(ALVO[0]+Math.cos(a)*r,ALVO[1]+Math.sin(a)*r*.8,expl<.5?FOGO[2]:FOGO[1])}pn.ell(ALVO[0],ALVO[1],(1-expl)*6,(1-expl)*5,FOGO[2])}
      if(gelo>0){const o=[top[0]+1,top[1]],x1=lerp(o[0],ALVO[0],cl(gelo*1.5));pn.line(o[0],o[1]-1,x1,ALVO[1]-1,GELO[0]);pn.line(o[0],o[1]+1,x1,ALVO[1]+1,GELO[0]);pn.line(o[0],o[1],x1,ALVO[1],GELO[2]);for(let i=0;i<6;i++){const t=(i+.5)/6;if(t*1.5<gelo*1.5)pn.px(lerp(o[0],x1,t),lerp(o[1],ALVO[1],t)+Math.sin(ph*2+i)*2.5,GELO[1])}}
      if(crist>0){for(const [dx,h,s] of [[-4,6,-.3],[0,9,0],[4,7,.3],[-7,4,-.5],[7,5,.5]]){const hh=h*crist;const b=[ALVO[0]+dx,GY];const t=[b[0]+s*hh,b[1]-hh];pn.line(b[0]-1,b[1],t[0],t[1],GELO[0],2);pn.line(b[0],b[1],t[0],t[1],GELO[1]);pn.px(t[0],t[1],'#ffffff')}}
      if(raio>0){for(let k=0;k<3;k++){const on=((ph+k*2)%4)<2&&raio>k*.25;if(!on)continue;let q=[ALVO[0]-6+k*6,0];while(q[1]<GY){const n=[q[0]+Math.sin(q[1]*1.3+ph*3+k)*3,q[1]+4];pn.line(q[0],q[1],n[0],n[1],RAIO[1]);pn.px(n[0]+1,n[1],RAIO[0]);q=n}pn.ell(q[0],GY-1,3,1.2,RAIO[2])}}
      if(met>0&&met<1){const x=lerp(ALVO[0]+18,ALVO[0],met),y=lerp(-12,ALVO[1]+6,met);for(let k=1;k<=6;k++)pn.ell(x+k*2.2,y-k*3,4-k*.5,4-k*.5,k<3?FOGO[1]:FOGO[0]);pn.ell(x,y,4.5,4.5,'#5a2a1a');pn.ell(x-1,y-1,3,3,'#8a4a2a');pn.px(x-1.5,y-1.5,FOGO[2])}
      if(circ>0){const c=[hip[0]+1,GY+.5],r=11*circ;for(let a=0;a<PI*2;a+=.1)pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*.25,A.mg[1]);for(let i=0;i<6;i++){const a=ph*.3+i*PI/3;pn.px(c[0]+Math.cos(a)*r*.7,c[1]+Math.sin(a)*r*.17,A.mg[2])}}
      if(runas>0)for(let i=0;i<6;i++){const a=ph*.35+i*PI/3,x=hip[0]+Math.cos(a)*12*runas,y=hip[1]-6+Math.sin(a)*4*runas;pn.px(x,y,roxo>0?'#d090ff':A.mg[2]);pn.px(x+1,y,roxo>0?'#9a5ae0':A.mg[1]);pn.px(x,y+1,roxo>0?'#9a5ae0':A.mg[1])}
      if(dome>0){const c=[hip[0]+1,hip[1]-2],r=18*dome;for(let a=PI;a<=PI*2;a+=.05){const x=c[0]+Math.cos(a)*r,y=c[1]+Math.sin(a)*r*1.15;if(dit(x,y,.75))pn.px(x,y,'#8ad8ff')}for(let a=PI;a<=PI*2;a+=.3)pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*1.15,'#ffffff');for(let x=c[0]-r;x<=c[0]+r;x+=2)pn.px(x,GY,'#8ad8ff')}
      // o diário de Morvane
      if(livro>0){const c=livroC,ab=cl(livro*1.6-.4),w=2.5+ab*2.5;pn.poly([[c[0]-w,c[1]-2],[c[0]+w,c[1]-2-ab],[c[0]+w,c[1]+2-ab],[c[0]-w,c[1]+2]],'#3a1a2a');if(ab>.2){pn.poly([[c[0]-w+.6,c[1]-1.6],[c[0]-.3,c[1]-1.6-ab*.5],[c[0]-.3,c[1]+1.4],[c[0]-w+.6,c[1]+1.6]],'#e8dcc0');pn.poly([[c[0]+.3,c[1]-1.6-ab*.5],[c[0]+w-.6,c[1]-1.6-ab],[c[0]+w-.6,c[1]+1.6-ab],[c[0]+.3,c[1]+1.4]],'#f4ead0');for(let i=0;i<3;i++){pn.px(c[0]-w+1.5+i,c[1]-.5+i*.6,'#7a3ab0');pn.px(c[0]+1.5+i,c[1]-.5+i*.6-ab*.5,'#7a3ab0')}}else{pn.line(c[0]-w,c[1],c[0]+w,c[1]-ab,'#c8a040')}
        if(ab>.5)for(let i=0;i<3;i++){const k=((ph*.08+i/3)%1);pn.px(c[0]+Math.sin(ph*.4+i)*3,c[1]-3-k*8,'#d090ff')}}
      if(paginas>0)for(let i=0;i<8;i++){const a=ph*.3+i*PI/4,r=10+Math.sin(ph*.5+i)*2,x=hip[0]+2+Math.cos(a)*r*paginas,y=hip[1]-10+Math.sin(a)*r*.5*paginas;pn.poly([[x-1.2,y-1],[x+1.2,y-1.4],[x+1.2,y+1],[x-1.2,y+1.3]],'#f0e6cc');pn.px(x,y,'#7a3ab0')}
      // malabarismo com três elementos
      if(malab>0){const c=[hf[0]+2,hf[1]-8];[FOGO,GELO,RAIO].forEach((cor,i)=>{const a=ph*.45+i*PI*2/3,q=[c[0]+Math.cos(a)*4,c[1]+Math.sin(a)*5*malab];pn.ell(q[0],q[1],1.5,1.5,cor[1]);pn.px(q[0],q[1],cor[2])})}
      if(fogos>0){[[ALVO[0]-14,10,FOGO],[ALVO[0]-2,6,GELO],[ALVO[0]+6,14,RAIO]].forEach(([x,y,cor],i)=>{const t=cl(fogos*1.5-i*.2);if(t<=0||t>=1)return;if(t<.4){pn.px(x,lerp(GY,y,t/.4),cor[1])}else{const r=(t-.4)/.6*7;for(let a=0;a<PI*2;a+=.5){pn.px(x+Math.cos(a)*r,y+Math.sin(a)*r+r*.3,t>.8?cor[0]:cor[1])}pn.px(x,y,cor[2])}})}})},
  A:{
   parado:{n:20,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:sw(f,n,1,1)*1.5,chapeu:sw(f,n,1,.5)*1.5,cj:(-84+b*3)*D,ht:sw(f,n,1,2)>.85?.5:0,ph:f}}},
   mania1:{nome:'Ler o diário',n:28,fps:10,mania:1,f:null},mania2:{nome:'Malabarismo',n:26,fps:12,mania:1,f:null},mania3:{nome:'Ajeitar o chapéu',n:18,fps:11,mania:1,f:null},
   entrada:{nome:'Entrada (teleporte)',n:20,fps:13,f:null},
   ataque:{nome:'Faísca',n:16,fps:14,hits:[9],tiro:'faisca',f:null},
   fogo:{nome:'Bola de Fogo',n:28,fps:14,hits:[22],f:null},
   gelo:{nome:'Raio de Gelo',n:26,fps:13,hits:[14],f:null},
   raio:{nome:'Tempestade',n:28,fps:13,hits:[13],f:null},
   meteoro:{nome:'Meteoro',n:34,fps:13,hits:[25],f:null},
   defesa:{nome:'Barreira',n:18,fps:12,f:null},
   teleporte:{nome:'Teleporte',n:16,fps:14,f:null},
   espelho:{nome:'Imagens Espelhadas',n:22,fps:12,f:null},
   buff:{nome:'Diário de Morvane',n:32,fps:11,f:null},
   ferido:{n:8,fps:14,f:null},ferido2:{nome:'Derrubada',n:18,fps:13,f:null},
   vitoria:{nome:'Vitória (fogos)',n:34,fps:12,f:null},morte:{n:22,fps:11,f:null}}};
const K=MAG.DEF,A=MAG.A,ERGUE={aF:-100*D,aF2:-40*D,cj:-95*D};
A.mania1.f=kf(K,[[0,{}],[4,{e:'devagar',livro:.6,aB:20*D,aB2:-70*D,ht:.7,hd:.6}],[8,{livro:1,aB:20*D,aB2:-70*D,ht:.7,hd:.6}],[16,{e:'segura',livro:1,aB:20*D,aB2:-70*D,ht:.8,hd:.7}],[18,{livro:.9,aB:20*D,aB2:-70*D,ht:.8,hd:.7,roxo:1}],[22,{e:'segura',livro:1,aB:20*D,aB2:-70*D,ht:.2,roxo:0}],[28,{e:'devagar',livro:0}]]);
A.mania2.f=kf(K,[[0,{}],[4,{e:'devagar',aF:10*D,aF2:-100*D,cj:-60*D,malab:1,ht:-.6}],[22,{e:'linear',aF:10*D,aF2:-100*D,cj:-60*D,malab:1,ht:-.6}],[26,{e:'devagar',malab:0}]]);
A.mania3.f=kf(K,[[0,{}],[5,{e:'devagar',ajeita:1,ht:.3}],[9,{ajeita:1,ht:.3,chapeu:-3}],[12,{e:'segura',ajeita:1,ht:-.3}],[18,{e:'devagar',ajeita:0}]]);
A.entrada.f=kf(K,[[0,{al:0,circ:0}],[3,{al:0,circ:.5,carga:.3}],[8,{e:'devagar',al:.6,circ:1,carga:1,levita:1}],[11,{e:'rapido',al:1,circ:.6,carga:0,levita:.5,flash:1}],[14,{circ:.2,levita:0}],[20,{e:'devagar',circ:0}]]);
A.ataque.f=kf(K,[[0,{}],[5,{e:'devagar',lean:-6*D,aF:-40*D,aF2:-60*D,cj:-120*D,carga:.6,ht:-.3}],[8,{e:'segura',lean:-6*D,aF:-40*D,aF2:-60*D,cj:-120*D,carga:1}],[9,{e:'rapido',lean:12*D,aF:-5*D,aF2:-10*D,cj:-15*D,carga:0,hx:23,mo:1,capa:3,chapeu:3}],[11,{e:'segura',lean:12*D,aF:-5*D,aF2:-10*D,cj:-15*D,hx:23}],[16,{e:'devagar'}]]);
A.fogo.f=kf(K,[[0,{}],[3,{e:'devagar',aF:-20*D,aF2:-70*D,cjGira:1}],[12,{e:'linear',aF:-20*D,aF2:-70*D,cjGira:1,orb:.5,carga:.5}],[15,{aF:-60*D,aF2:-60*D,cj:-110*D,cjGira:0,orb:1,carga:1,lean:-8*D,capa:2}],[18,{e:'segura',aF:-60*D,aF2:-60*D,cj:-110*D,orb:1.1,carga:1,lean:-10*D,tremor:.5}],
  [19,{e:'rapido',aF:-5*D,aF2:-10*D,cj:-15*D,orb:0,carga:0,fogo:.05,lean:14*D,hx:24,mo:1,capa:4,chapeu:4}],[22,{e:'rapido',aF:-5*D,aF2:-10*D,cj:-15*D,fogo:.99,lean:14*D,hx:24}],[23,{fogo:0,expl:.1,flash:.7}],[26,{e:'linear',expl:.95}],[27,{expl:0}],[28,{e:'devagar'}]]);
A.gelo.f=kf(K,[[0,{}],[5,{e:'devagar',lean:-4*D,aF:-30*D,aF2:-50*D,cj:-60*D,carga:.8,ht:-.3}],[9,{e:'segura',lean:-4*D,aF:-30*D,aF2:-50*D,cj:-60*D,carga:1}],[10,{e:'rapido',lean:10*D,aF:-8*D,aF2:-12*D,cj:-12*D,carga:0,gelo:.2,hx:23}],[14,{e:'linear',lean:10*D,aF:-8*D,aF2:-12*D,cj:-12*D,gelo:1,crist:.6,hx:23,tremor:.5}],
  [19,{e:'segura',lean:10*D,aF:-8*D,aF2:-12*D,cj:-12*D,gelo:1,crist:1,hx:23}],[21,{gelo:0,crist:1}],[26,{e:'devagar',crist:0}]]);
A.raio.f=kf(K,[[0,{}],[5,{e:'devagar',...ERGUE,ht:-1.2,carga:1,capa:3,chapeu:-3}],[9,{e:'segura',...ERGUE,ht:-1.2,carga:1,levita:.6}],[10,{e:'rapido',...ERGUE,ht:-1.2,raio:.3,levita:.8,flash:.8}],[20,{e:'linear',...ERGUE,ht:-1.2,raio:1,levita:.8,capa:4,tremor:.6}],[22,{raio:0,levita:.3}],[28,{e:'devagar'}]]);
A.meteoro.f=kf(K,[[0,{}],[6,{e:'devagar',...ERGUE,circ:1,levita:1,ht:-1.2,carga:.6,roxo:.5}],[14,{e:'segura',...ERGUE,circ:1,levita:1.4,ht:-1.4,carga:1,runas:1,capa:4,tremor:.4}],[16,{...ERGUE,circ:1,levita:1.4,met:.05,carga:1,runas:1}],[25,{e:'rapido',aF:-10*D,aF2:-10*D,cj:-30*D,circ:.6,levita:.8,met:.99,lean:10*D}],[26,{met:0,expl:.1,flash:1,tremor:1,circ:.4,levita:.4}],[31,{e:'linear',expl:.95,circ:0,levita:0}],[32,{expl:0}],[34,{e:'devagar'}]]);
A.defesa.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-60*D,aF2:-70*D,cj:-100*D,dome:.3,ht:-.5}],[9,{e:'rapido',aF:-70*D,aF2:-70*D,cj:-100*D,dome:1,carga:.5}],[14,{e:'segura',aF:-70*D,aF2:-70*D,cj:-100*D,dome:1}],[18,{e:'devagar',dome:0}]]);
A.teleporte.f=kf(K,[[0,{}],[3,{e:'devagar',carga:1,lean:-4*D}],[5,{e:'rapido',al:0,carga:0}],[9,{al:0,hx:12}],[11,{e:'rapido',al:1,hx:12,carga:1}],[16,{e:'devagar',hx:21,carga:0}]]);
A.espelho.f=kf(K,[[0,{}],[4,{e:'devagar',...ERGUE,carga:1,ht:-.6}],[8,{e:'rapido',rastro:1,rdx:6,rdy:0,carga:0}],[17,{e:'segura',rastro:1,rdx:6}],[22,{e:'devagar',rastro:0}]]);
A.buff.f=kf(K,[[0,{}],[5,{e:'devagar',livro:1,aB:10*D,aB2:-60*D,ht:.5}],[10,{livro:1.6,aB:-20*D,aB2:-60*D,ht:-.6,levita:.6,roxo:1}],[14,{livro:1.6,paginas:.6,runas:.6,levita:1,roxo:1,ht:-1,capa:4,chapeu:-3}],[24,{e:'segura',livro:1.6,paginas:1,runas:1,levita:1.2,roxo:1,ht:-1,mo:1,capa:4}],[28,{e:'devagar',livro:.6,paginas:0,runas:0,levita:.2,roxo:0}],[32,{livro:0}]]);
A.ferido.f=kf(K,[[0,{}],[1,{e:'rapido',hx:18,lean:-16*D,ht:-1,mo:1,capa:-3,chapeu:-4,cj:-60*D}],[3,{hx:18,lean:-8*D,chapeu:2}],[8,{}]]);
A.ferido2.f=kf(K,[[0,{}],[2,{e:'rapido',hx:15,hy:44,lean:-40*D,ht:-1,mo:1,capa:-4,chapeu:-5,px:15,py:GY,rot:-1.2,ty:-4,tx:18}],[8,{e:'segura',hx:15,lean:-40*D,rot:-1.3,px:15,py:GY,ty:-4,tx:18}],[11,{e:'rapido',hx:19,hy:38,rot:0,levita:1,carga:.6}],[18,{e:'devagar',levita:0}]]);
A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',...ERGUE,ht:-1,mo:1,carga:1}],[7,{...ERGUE,ht:-1,mo:1,fogos:.05,levita:.4}],[28,{e:'linear',...ERGUE,ht:-1,mo:.6,fogos:.99,levita:.6,runas:.6}],[34,{e:'segura',...ERGUE,ht:-1,runas:.6,levita:.4}]]);
A.morte.f=kf(K,[[0,{}],[2,{e:'rapido',hx:18,lean:-18*D,ht:-1,mo:1,chapeu:-4,cj:-50*D}],[8,{e:'devagar',hx:20,hy:48,lean:30*D,ht:1.4,fF:[26,GY],fB:[15,GY-.5],cj:-20*D,aF:80*D,aF2:-20*D}],[13,{e:'rapido',hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],cj:5*D,aF:100*D,aF2:0,dead:1,chapeu:4}],[22,{hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],cj:5*D,aF:100*D,aF2:0,dead:1}]]);
anima(MAG);
HEROIS.mag=MAG;BICHOS.h_mag=MAG;
})();
