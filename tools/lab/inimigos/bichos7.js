/* O CORVO REI — chefe final, versão grande (tela própria 96×80). Segue docs/lore.md:
   - Aldric, o Rei Justo, preso no pacto de Morvane; a cada dia "mais pássaro".
   - A Coroa de Cinco Juramentos: 5 joias (Garrel/lealdade azul, Ysolda/visão verde, Bram/ferro prata, Elowen/nome branca, Morvane/pacto roxa).
   - Fase 2: o pacto toma conta (penas arrebentam o manto, garras, crânio aparecendo, olhos vermelhos, raios).
   - Queda: as 5 joias estouram uma a uma (os juramentos se quebram), as penas se soltam, por um instante aparece Aldric
     (um rei velho de luz, ajoelhado), a coroa cai, tudo vira pó e o corvo branco sobe livre.
   Usa o motor de bichos.js (camadas antes/depois da luz, rastro de sombras, clarão). */
(function(){
const {P,lerp,kf,sw,olhoX,D,PI}=BICHO.util;
const W=96,H=80,GY=74;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const JOIAS=['#4a8ae8','#4ad06a','#c8d0dc','#f2f2ff','#b050e0'],JOIAS_C=['#a8d0ff','#b0ffc0','#ffffff','#ffffff','#f0c0ff'];
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],dit=(x,y,a)=>(BAY[((y|0)&3)*4+((x|0)&3)]+.5)/16<a;
const R=['#0c0914','#181228','#261e3c','#382c56','#4c3e72'],BK=['#08080e','#12121c','#1e1e2e','#2e2e46','#46466e'],O=['#5a3e10','#9a7020','#d0a440','#ffe27a'];

/* uma pena: base, ângulo, comprimento, largura e tons */
function pena(pen,b,a,len,w,c0,c1,brilho){const t=P(b,a,len),m=P(b,a,len*.55),pa=a+PI/2;
  pen.poly([P(b,pa,w*.5),P(m,pa,w*.6),t,P(m,pa,-w*.5),P(b,pa,-w*.45)],c0);pen.line(P(b,pa,w*.3)[0],P(b,pa,w*.3)[1],t[0],t[1],c1);if(brilho)pen.px(m[0],m[1],brilho);return t}
/* asa com penas uma por uma: ombro, ângulo do braço, abertura (0 dobrada/capa, 1 aberta), leque, lado (+1 direita/frente, -1 trás) */
function asa(pen,s,p,lado,cores){const ab=p.asa,arm=lado<0?lerp(100*D,-138*D,ab)+p.wa*.35:lerp(80*D,-42*D,ab)-p.wa*.35,L=lerp(12,17,ab);
  const pulso=P(s,arm,L),cot=P(s,arm,L*.5);pen.line(s[0],s[1],cot[0],cot[1],cores[1],4);pen.line(cot[0],cot[1],pulso[0],pulso[1],cores[1],3);
  const N=11;for(let i=0;i<N;i++){const t=i/(N-1),b=[lerp(pulso[0],s[0],t*.92),lerp(pulso[1],s[1],t*.92)];
    let a=arm-lado*ab*(.1+t*1.45)*(.65+.35*p.leque)+Math.sin(p.ph*.7+i)*.04*(1-ab*.5);
    let len=(lerp(26,20,t))*(lerp(1.05,1,ab));if(Math.sin(a)>.05){const lim=(GY-b[1])/Math.sin(a);len=Math.min(len,lim)}
    pena(pen,b,a,len,lerp(4,5,t),i%2?cores[1]:cores[2],cores[3],i%3===0?cores[4]:null)}
  // coberteiras (penas curtas por cima da base)
  for(let i=0;i<7;i++){const t=i/6,b=[lerp(pulso[0],s[0],t),lerp(pulso[1],s[1],t)];pena(pen,b,arm-lado*ab*(.4+t*1.2)+(1-ab)*.05,7-t*1.5,3.5,cores[2],cores[4])}
  return pulso}
function corvinho(pen,x,y,fl,ang=0){const c='#0e0e18';pen.ell(x,y,2.6,1.6,c);pen.px(x+2.6,y-.6,c);pen.px(x+3.6,y-.4,'#5a5a68');pen.px(x+2,y-1,'#ff3a2a');const a=fl?-3:2;pen.line(x-1,y-.5,x-4,y+a,c);pen.line(x+.5,y-.5,x-2,y+a-.8,'#1c1c2c');pen.line(x-2.5,y+.5,x-5.5,y+1.2,c)}

const CR={nome:'O Corvo Rei',nivel:7,W,H,GY,
  DEF:{hx:44,hy:52,lean:3*D,fF:[50,GY],fB:[38,GY],aF:55*D,aF2:-115*D,aB:85*D,aB2:-35*D,ht:0,hy2:0,bico:0,olho:1,asa:0,wa:0,leque:0,f2:0,coroa:0,joias:1,quebra:0,
       aura:.3,selo:.5,revoada:0,cupula:0,garra:0,gn:0,mald:0,voo:0,rastro:0,rdx:0,rdy:0,po:0,branco:0,humano:0,al:1,nevoa:.6,raio:0,aj:0,penas:0,grito:0,cs:-88*D,tremor:0,sh:0,ph:0,dead:0,rot:0,px:44,py:GY},
  draw(pen,p){const f2=p.f2,ph=p.ph;
    const hy=p.hy+p.aj*7-p.voo*20,hip=[p.hx+p.sh,hy],neck=P(hip,-PI/2+p.lean,17),sB=[neck[0]-3.5,neck[1]+3],sF=[neck[0]+3,neck[1]+3];
    const hem=p.voo>.05?hip[1]+16:GY;
    /* ---- camada de baixo (sem luz): névoa, selo atrás da cabeça, sombra no chão ---- */
    const sel=p.selo,neb=p.nevoa,vo=p.voo,hx0=p.hx;
    pen.antes(pn=>{
      // sombra que cresce quando ele está no alto
      const sr=10+vo*4;for(let x=-sr;x<=sr;x++)if(dit(x+hx0,GY,.6))pn.px(hx0+x,GY,'#050308');
      if(sel>0){const c=[neck[0]+1,neck[1]-9],r=12+sel*2,cor=f2>.5?['#5a0e1a','#c02a3a','#ff8a9a']:['#2a1048','#7a3ab0','#d0a0ff'];
        for(let a=0;a<PI*2;a+=.05)if(dit(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,sel))pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,cor[1]);
        for(let a=0;a<PI*2;a+=.08)if(dit(c[0]+Math.cos(a)*(r-3),c[1]+Math.sin(a)*(r-3),sel*.7))pn.px(c[0]+Math.cos(a)*(r-3),c[1]+Math.sin(a)*(r-3),cor[0]);
        for(let i=0;i<8;i++){const a=ph*.08+i*PI/4,q=[c[0]+Math.cos(a)*(r-1.5),c[1]+Math.sin(a)*(r-1.5)];pn.px(q[0],q[1],cor[2]);pn.px(q[0]+1,q[1],cor[1]);pn.px(q[0],q[1]+1,cor[1])}
        for(let i=0;i<5;i++){const a=-ph*.12+i*PI*2/5,q=P(c,a,r*.55);pn.line(c[0],c[1],q[0],q[1],cor[0])}}
      if(neb>0){for(let x=0;x<W;x++){const y=GY-1-Math.round((Math.sin(x*.21+ph*.3)+Math.sin(x*.09-ph*.2))*1.4+neb*2);for(let k=0;k<=GY-y;k++)if(dit(x,y+k,neb*.55))pn.px(x,y+k,k%2?'#1a1028':'#2a1a40')}}});
    /* ---- asa de trás ---- */
    asa(pen,sB,p,-1,BK);
    /* ---- braço de trás (garras) ---- */
    const eb=P(sB,p.aB,7),hb=P(eb,p.aB+p.aB2,6.5);pen.line(sB[0],sB[1],eb[0],eb[1],R[1],5);pen.line(eb[0],eb[1],hb[0],hb[1],f2>.5?BK[2]:R[2],3);
    for(let i=-1;i<=2;i++){const t=P(hb,p.aB+p.aB2+i*.38,3.5+f2*1.5);pen.line(hb[0],hb[1],t[0],t[1],f2>.5?'#d8d0b8':'#b8902e')}
    /* ---- manto real ---- */
    const w1=13+p.aj*3,pts=[[neck[0]-6,neck[1]+1],[neck[0]+6,neck[1]+1.5],[hip[0]+w1,hem]];
    for(let i=0;i<=12;i++){const t=i/12;pts.push([lerp(hip[0]+w1,hip[0]-w1-2,t),hem-((i%2)?(f2>.5?5:2):0)-(f2>.5&&i%3===0?2:0)])}pts.push([hip[0]-w1-2,hem]);
    pen.poly(pts,R[2]);pen.poly(pts.map(([x,y])=>[lerp(hip[0]-1,x,.8),lerp(neck[1]+2,y,.97)]),R[3]);
    for(let i=0;i<5;i++){const x=lerp(hip[0]-w1+3,hip[0]+w1-3,i/4);pen.line(x,hip[1]+2,x+(i-2)*.8,hem-2,R[1])}
    pen.line(neck[0]+6,neck[1]+1.5,hip[0]+w1,hem,R[4]);
    // barra dourada e bordado
    pen.line(hip[0]+1.5,neck[1]+4,hip[0]+3,hem-2,O[1],2);for(let y=neck[1]+8;y<hem-2;y+=5)pen.px(hip[0]+2+(y-neck[1])*.05,y,O[3]);
    // garras de pássaro (fase 2) aparecendo embaixo
    if(f2>.5&&p.voo<.3){for(const fx of [p.fF[0],p.fB[0]]){pen.line(fx,GY-5,fx,GY,BK[3],2);for(let i=-1;i<=2;i++)pen.line(fx,GY,fx+i*2,GY,'#d8d0b8');pen.px(fx-2,GY-1,'#d8d0b8')}}
    /* ---- peitoral com filigrana ---- */
    const pc=P(neck,PI/2+p.lean,7);pen.poly([[pc[0]-6,pc[1]-6],[pc[0]+6,pc[1]-5],[pc[0]+5,pc[1]+4],[pc[0],pc[1]+7],[pc[0]-5,pc[1]+4]],BK[2]);
    pen.line(pc[0]-6,pc[1]-6,pc[0]+6,pc[1]-5,O[2]);pen.line(pc[0]+5,pc[1]+4,pc[0],pc[1]+7,O[1]);pen.line(pc[0]-5,pc[1]+4,pc[0],pc[1]+7,O[1]);
    for(let i=0;i<4;i++){pen.px(pc[0]-3+i*2,pc[1]-2+(i%2),O[2]);pen.px(pc[0]-2+i*2,pc[1]+1,O[1])}
    pen.ell(pc[0],pc[1]+1.5,1.8,2,'#3a1060');pen.px(pc[0],pc[1]+1,'#c070ff');
    /* ---- manto de penas nos ombros (escamas) ---- */
    for(let r=0;r<3;r++)for(let i=0;i<6-r;i++){const x=neck[0]-6+i*2.6+r*1.3,y=neck[1]+1+r*2.4;pen.ell(x,y,1.8,1.5,r%2?BK[2]:BK[3]);pen.px(x,y+1,BK[1])}
    /* ---- gola de penas longas (com mola) ---- */
    for(let i=0;i<12;i++){const a=PI*1.02+i/11*PI*1.05,len=7+(i%3)*2.5+(f2>.5?2:0)+p.grito*2,w=Math.sin(ph*.9+i)*.12;pena(pen,[neck[0]+.5,neck[1]+.5],a+w,len,2.6,i%2?BK[2]:BK[3],BK[4])}
    /* ---- cabeça de corvo ---- */
    const ht=p.ht,h=[neck[0]+2.5+ht*.8,neck[1]-6.5+Math.abs(ht)*.4+p.hy2];
    pen.bola(h[0],h[1],6,5.4,[BK[1],BK[2],BK[3]]);
    for(let i=0;i<4;i++)pen.line(h[0]-5+i*2,h[1]-3.5+i*.3,h[0]-3+i*2,h[1]-4.5+i*.3,BK[4]);pen.px(h[0]-1,h[1]-3,'#6a6aa8');
    // crânio aparecendo (fase 2)
    if(f2>.5){pen.ell(h[0]+2.5,h[1]-.8,3,2.6,'#b8b0a0');pen.ell(h[0]+2.3,h[1]-.6,2.2,1.8,'#d8d0c0');pen.px(h[0]+1,h[1]+1.2,'#6a6458')}
    // bico longo de duas cores com ponta dourada
    const ba=.1+ht*.22,bl=12+f2*3,b0=[h[0]+4.5,h[1]-.2],bt=P(b0,ba,bl);
    pen.poly([[b0[0]-.5,b0[1]-2.3],P(b0,ba,bl*.6),bt,[b0[0],b0[1]+.6]],'#54546a');pen.line(b0[0]-.5,b0[1]-2.3,bt[0],bt[1],'#9a9ab4');
    const tipo=P(b0,ba,bl-2);pen.line(tipo[0],tipo[1],bt[0],bt[1],O[3],1);
    const ja=ba+p.bico*.45,jt=P([b0[0],b0[1]+1],ja,bl-2);pen.poly([[b0[0],b0[1]+.5],jt,[b0[0],b0[1]+2.4]],'#3a3a4c');
    if(p.bico>.15){pen.poly([[b0[0]+.5,b0[1]+.6],P(b0,ba,bl*.85),P([b0[0],b0[1]+1],ja,(bl-2)*.85)],'#2a0610');pen.px(lerp(b0[0],bt[0],.5),lerp(b0[1],bt[1],.5)+1.2,'#ff6a8a')}
    pen.info.boca=P(b0,ba,bl*.75);
    const eye=[h[0]+2.2,h[1]-1.2];pen.ell(eye[0],eye[1],1.6,1.4,'#000000');
    if(f2>.5){pen.line(eye[0]-3,eye[1]-2,eye[0]-1,eye[1]-.5,'#4a0a10');pen.line(eye[0]+1,eye[1]+1.5,eye[0]+2.5,eye[1]+3,'#4a0a10')}
    /* ---- coroa de cinco juramentos ---- */
    const c0=[lerp(h[0]-1,h[0]-18,p.coroa),lerp(h[1]-6.5,GY-3,p.coroa)-(f2>.5&&p.coroa<.05?3+Math.sin(ph*.4):0)],inc=p.coroa*-.5+(f2>.5&&p.coroa<.05?-.12:0);
    const cr=(dx,dy)=>[c0[0]+dx*Math.cos(inc)-dy*Math.sin(inc),c0[1]+dx*Math.sin(inc)+dy*Math.cos(inc)];
    const alt=[5.5,7.5,9.5,7.5,5.5],xs=[-6,-3,0,3,6],jp=xs.map((x,i)=>cr(x,-alt[i]-.5));
    const coroa=pn=>{pn.poly([cr(-7.5,2),cr(-7.5,-1),cr(7.5,-1),cr(7.5,2)],O[1]);pn.line(cr(-7.5,-1)[0],cr(-7.5,-1)[1],cr(7.5,-1)[0],cr(7.5,-1)[1],O[3]);
      for(let i=0;i<5;i++){const b=cr(xs[i],-1),t=cr(xs[i],-alt[i]);pn.poly([cr(xs[i]-1.3,-1),t,cr(xs[i]+1.3,-1)],O[2]);pn.line(b[0],b[1],t[0],t[1],O[3]);
        const q=jp[i],ok=p.quebra<=i;pn.poly([[q[0],q[1]-2],[q[0]+1.4,q[1]],[q[0],q[1]+1.6],[q[0]-1.4,q[1]]],ok?JOIAS[i]:'#2a2a2a');if(ok)pn.px(q[0]-.4,q[1]-.6,JOIAS_C[i]);else{pn.px(q[0]+.5,q[1]-.5,'#5a5a5a')}}
      for(let i=0;i<6;i++)pn.px(cr(-6+i*2.4,.6)[0],cr(-6+i*2.4,.6)[1],i%2?O[0]:O[3])};
    if(p.coroa>.9&&p.al<1)pen.depois(coroa);else coroa(pen);
    /* ---- cetro alto com asas e esfera ---- */
    const ef=P(sF,p.aF,7),hf=P(ef,p.aF+p.aF2,6.5);
    if(p.po<.4){const s0=P(hf,p.cs+PI,12),s1=P(hf,p.cs,21);pen.line(s0[0],s0[1],s1[0],s1[1],O[1],2);pen.line(s0[0],s0[1],s1[0],s1[1],O[2]);for(let k=4;k<20;k+=5){const q=P(hf,p.cs,k);pen.px(q[0],q[1],O[3])}
      for(const sd of [-1,1]){const q=P(s1,p.cs+PI,1.5);pena(pen,q,p.cs+PI+sd*.9,6,2.2,BK[3],O[2])}
      const orb=P(s1,p.cs,3);pen.ell(orb[0],orb[1],3.2,3.2,'#2a0a40');pen.ell(orb[0],orb[1],2.4,2.4,'#7a2ab0');pen.info.boca=orb;pen.info.orb=orb}
    pen.line(sF[0],sF[1],ef[0],ef[1],R[3],5);pen.line(ef[0],ef[1],hf[0],hf[1],f2>.5?BK[2]:R[2],3);pen.ell(ef[0],ef[1],2,1.6,O[1]);
    if(f2>.5){for(let i=-1;i<=1;i++){const t=P(hf,p.aF+p.aF2+i*.5,3.5);pen.line(hf[0],hf[1],t[0],t[1],'#d8d0b8')}}else pen.ell(hf[0],hf[1],1.6,1.6,O[1]);
    /* ---- asa da frente (abre por cima do corpo) ---- */
    if(p.asa>.18)asa(pen,sF,p,1,[BK[0],BK[2],BK[3],BK[4],'#6a6ab0']);
    /* ---- tudo que brilha por conta própria ---- */
    const vivo=p.al>.05,orb=vivo?pen.info.orb:null,olho=p.olho,dead=p.dead,joias=p.joias,quebra=p.quebra,aura=p.aura,rev=p.revoada,cup=p.cupula,garra=p.garra,gn=p.gn,mald=p.mald,raio=p.raio,po=p.po,branco=p.branco,humano=p.humano,penas=p.penas;
    pen.depois(pn=>{
      // aura de chamas escuras subindo do chão e das bordas do manto
      if(aura>0&&vivo){const cA=f2>.5?['#4a0a18','#c0203a','#ff8a9a']:['#2a0a40','#7a2ab0','#d0a0ff'];for(let i=0;i<16;i++){const x=hip[0]-w1-1+i*((w1*2+2)/15),b=hem-1,hh=(4+Math.sin(ph*1.5+i*2.3)*2.5)*aura*(1+(i>3&&i<12?.5:0));
        pn.line(x,b,x+Math.sin(ph*.9+i)*1.2,b-hh,cA[0]);pn.line(x,b-hh*.3,x+Math.sin(ph*.9+i)*1.2,b-hh*.8,cA[1]);if((i+ph|0)%4===0)pn.px(x,b-hh-1.5,cA[2])}}
      // olho brilhando com rastro de luz
      if(dead<.5&&olho>0){const c=f2>.5?['#ff2a1a','#ffd0c0']:['#c070ff','#ffffff'];pn.px(eye[0],eye[1],c[0]);pn.px(eye[0]+.8,eye[1]-.4,c[1]);pn.px(eye[0]-.8,eye[1],c[0]);for(let k=1;k<=4;k++)if(dit(eye[0]-k,eye[1],1-k*.22))pn.px(eye[0]-1-k,eye[1]+k*.15,c[0])}
      else if(dead>.5&&vivo)olhoX(pn,Math.round(eye[0]),Math.round(eye[1]),'#6a6a7a');
      // joias acesas
      if(joias>0&&p.coroa<.5)jp.forEach((q,i)=>{if(quebra>i||joias<=i*.2)return;pn.px(q[0],q[1]-1,JOIAS_C[i]);if(joias>.95){pn.px(q[0],q[1]-3,JOIAS[i]);pn.px(q[0]-2,q[1],JOIAS[i]);pn.px(q[0]+2,q[1],JOIAS[i])}});
      // estouro de cada joia (quebra fracionária = joia estourando agora)
      if(quebra>0&&quebra<5){const i=Math.floor(quebra),t=quebra-i,q=jp[Math.max(0,i-(t<.05?1:0))];if(q&&t<.6){const r=1+t*10;for(let a=0;a<PI*2;a+=.35)pn.px(q[0]+Math.cos(a)*r,q[1]+Math.sin(a)*r,JOIAS[Math.max(0,i-(t<.05?1:0))])}}
      // esfera do cetro
      if(orb){const r=2+Math.sin(ph*1.3)*.4+mald*1.5;pn.ell(orb[0],orb[1],r,r,'#b050e0');pn.ell(orb[0]-.4,orb[1]-.4,r*.45,r*.45,'#f8e0ff');pn.px(orb[0]+Math.sin(ph)*2,orb[1]-r-2,'#c070ff')}
      // selo da maldição na frente do cetro
      if(mald>0&&orb){const c=[orb[0]+8,orb[1]],r=3+mald*6;for(let a=0;a<PI*2;a+=.12)pn.px(c[0]+Math.cos(a)*r*.45,c[1]+Math.sin(a)*r,'#a050e0');for(let i=0;i<5;i++){const a=ph*.5+i*PI*2/5,q=[c[0]+Math.cos(a)*r*.3,c[1]+Math.sin(a)*r*.75];pn.px(q[0],q[1],'#f0c0ff')}}
      // marcas de garra gigantes (3 riscos paralelos)
      if(garra>0&&garra<1){const x0=hip[0]+10,y0=neck[1]-8+gn*6;for(let k=0;k<3;k++){for(let t=0;t<=Math.min(1,garra*1.6);t+=.025){const x=x0+t*34+k*2.5,y=y0+k*4+Math.sin(t*PI)*-6+t*14;const fade=garra>.6?(1-garra)/.4:1;if(dit(x,y,fade)){pn.px(x,y,t>.75?'#ffffff':'#d0a0ff');pn.px(x,y+1,'#6a2aa0')}}}}
      // revoada: tempestade de corvos em espiral
      if(rev>0){for(let i=0;i<14;i++){const a=ph*.45+i*PI*2/14+i*.3,r=lerp(60,10+(i%4)*5,cl(rev*1.5-i*.05)),y=neck[1]-4+Math.sin(a)*r*.42+(i%3-1)*4;corvinho(pn,hip[0]+Math.cos(a)*r,y,((ph|0)+i)%2)}}
      // cúpula da Coroa Negra (feixes das 5 joias)
      if(cup>0){jp.forEach((q,i)=>{for(let y=q[1]-2;y>q[1]-2-cup*10;y--)if(dit(q[0],y,.8))pn.px(q[0],y,JOIAS[i])});const c=[hip[0],hip[1]-4],r=30*cup;for(let a=PI;a<=PI*2;a+=.03){const x=c[0]+Math.cos(a)*r,y=c[1]+Math.sin(a)*r*1.05;if(dit(x,y,.7))pn.px(x,y,'#9a7ae0')}for(let a=PI;a<=PI*2;a+=.2)pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*1.05,'#f0e0ff')}
      // raios (fase 2)
      if(raio>0){const xs=[hip[0]-24,hip[0]+26];xs.forEach((x0,k)=>{if(((ph|0)+k)%3===0)return;let q=[x0,0];while(q[1]<GY){const n=[q[0]+Math.sin(q[1]*1.7+ph*3+k)*3,q[1]+4];pn.line(q[0],q[1],n[0],n[1],'#f0d0ff');pn.px(n[0]+1,n[1],'#a050e0');q=n}})}
      // penas se soltando e voando
      if(penas>0){for(let i=0;i<18;i++){const t=cl(penas*1.4-i*.03),x=hip[0]-8+(i*7)%18+t*(-20-(i%5)*6),y=neck[1]+((i*5)%26)-t*(14+(i%4)*5);if(t>0&&t<1){const a=t*6+i;pn.line(x,y,x+Math.cos(a)*2.5,y+Math.sin(a)*2.5,i%2?'#1e1e2e':'#46466e')}}}
      // Aldric de verdade, por um instante: um rei velho de luz, ajoelhado
      if(humano>0){const hc=[hip[0]+1,hip[1]-14],cor=['#ffe8a8','#fff6d8','#ffd060'],S=GY-hc[1];
        const corpo=[[-5,1],[5,1],[6,7],[5,14],[11,S*.6],[12,S],[8,S],[8,S*.7],[1,S*.66],[-1,S],[-11,S],[-6,S*.62],[-7,9]].map(([x,y])=>[hc[0]+x,hc[1]+y]);
        const dentro=(x,y)=>{let c=false;for(let a=0,b=corpo.length-1;a<corpo.length;b=a++){const[xa,ya]=corpo[a],[xb,yb]=corpo[b];if((ya>y)!==(yb>y)&&x<(xb-xa)*(y-ya)/(yb-ya)+xa)c=!c}return c||Math.hypot(x-hc[0],(y-(hc[1]-3))*1.05)<3.6};
        for(let y=hc[1]-8;y<=GY;y++)for(let x=hc[0]-13;x<=hc[0]+14;x++){if(!dentro(x+.5,y+.5))continue;const borda=!dentro(x-.5,y+.5)||!dentro(x+1.5,y+.5)||!dentro(x+.5,y-.5);
          if(borda?dit(x,y,humano):dit(x,y,humano*.7))pn.px(x,y,borda?cor[1]:cor[0])}
        if(humano>.3){for(let i=0;i<5;i++)pn.px(hc[0]-2.5+i*1.3,hc[1]-7-(i%2),cor[2]);pn.line(hc[0]-3,hc[1]-6,hc[0]+3,hc[1]-6,cor[2]);pn.px(hc[0]+2,hc[1]-3,'#a08040');pn.line(hc[0]+1,hc[1]+.5,hc[0]+3,hc[1]+.5,'#e8d090')}
        for(let k=0;k<10;k++){const a=k*PI/5+ph*.1,r=16+Math.sin(ph*.5+k)*2;if(dit(hc[0]+Math.cos(a)*r,hc[1]+8+Math.sin(a)*r,humano*.5))pn.px(hc[0]+Math.cos(a)*r,hc[1]+8+Math.sin(a)*r,cor[1])}}
      // pó subindo
      if(po>0&&po<1){for(let i=0;i<26;i++){const t=(po*1.2+i/26)%1,x=hip[0]-12+((i*7)%25)+Math.sin(t*5+i)*3,y=hem-((i*3)%40)-t*22;if(dit(x,y,1-t*.6))pn.px(x,y,i%3?'#2e2e46':'#6a5a8a')}}
      // o corvo branco, livre
      if(branco>0){const y=lerp(neck[1]-6,-8,branco),x=h[0]+Math.sin(branco*8)*5,fl=Math.sin(ph*1.6)>0?-4:2.5;
        for(let k=1;k<=5;k++)if(dit(x-k*1.5,y+k*2.4,1-k*.18))pn.px(x-k*1.5,y+k*2.4,'#d8e4ff');
        pn.ell(x,y,3.4,2.2,'#f4f6ff');pn.px(x+3.5,y-.8,'#f4f6ff');pn.px(x+4.8,y-.6,'#e8c25a');pn.px(x+2.6,y-1.3,'#2a2a3a');
        pn.line(x-1.5,y-.5,x-6,y+fl,'#ffffff');pn.line(x+.5,y-.5,x-3.5,y+fl-1,'#e8ecff');pn.line(x-3.5,y+.6,x-7,y+1.6,'#f4f6ff')}});
    // penas soltas caindo pelo ar (ambiente), também sem luz
    pen.depois(pn=>{for(let i=0;i<6;i++){const t=((ph*.012)+i/6)%1,x=8+((i*37)%80)+Math.sin(t*9+i)*4,y=t*GY;const a=Math.sin(t*12+i)*.8;pn.line(x,y,x+Math.cos(a)*2.4,y+Math.sin(a)*1.2+1.2,i%2?'#2e2e46':'#1a1a28')}})},
  A:{
   parado:{n:32,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2,jit=[0,0,0,.6,.6,.6,.6,-.4,-.4,0,0,0,0,0,.9,.9,.9,0,0,0,-.5,-.5,-.5,-.5,0,0,0,.4,.4,0,0,0][f];
     return{ph:f,hy:52+(b>.6?1:0),lean:(3+b*2.5)*D,ht:jit,cs:(-88+b*3)*D,leque:.15+b*.1,asa:.04*b,aura:.3+b*.15,joias:1,olho:f===19?0:1,bico:f>=25&&f<=26?.4:0,selo:.55,nevoa:.6}}},
   entrada:{nome:'Entrada',n:48,fps:12,f:null},
   ataque:{nome:'Garras Sombrias',n:30,fps:15,hits:[9,16,23],f:null},
   especial:{nome:'Maldição Real',n:28,fps:13,hits:[18],tiro:'sombra',f:null},
   fase2:{nome:'Fase 2 · o pacto toma conta',n:48,fps:12,f:null},
   especial2:{nome:'Mergulho Real',n:40,fps:14,hits:[27],f:null},
   buff:{nome:'Chamar a Revoada',n:32,fps:12,f:null},
   defesa:{nome:'Coroa Negra',n:28,fps:12,f:null},
   ferido:{n:10,fps:14,f:null},
   morte:{nome:'“Aldric... era esse... o meu nome...”',n:84,fps:10,f:null}}};
CR.A.entrada.f=kf(CR.DEF,[[0,{al:0,olho:0,nevoa:1.2,aura:0,selo:0,joias:0,asa:.3,leque:0,aj:1,lean:30*D,ht:1.2}],[6,{al:0,olho:0,nevoa:1.2,aura:0,selo:0,joias:0,asa:.3,aj:1,lean:30*D,ht:1.2}],[9,{e:'rapido',al:0,olho:1,nevoa:1.2,aura:0,selo:0,joias:0,asa:.3,aj:1,lean:30*D,ht:1.2}],
  [12,{al:0,olho:1,nevoa:1.2,revoada:.2,selo:0,joias:0,asa:.3,aj:1,lean:30*D,ht:1.2}],[22,{e:'devagar',al:1,olho:1,nevoa:1,revoada:1,aura:.6,selo:0,joias:0,asa:.3,aj:.7,lean:20*D,ht:.6}],
  [26,{e:'rapido',al:1,revoada:.4,asa:1,leque:1,wa:-.8,aj:0,lean:-10*D,ht:-1.4,bico:1.5,grito:1,aura:1,selo:.3,joias:0,tremor:1}],[30,{asa:1,leque:1,wa:-.3,lean:-10*D,ht:-1.4,bico:1.5,grito:1,aura:1,selo:.6,joias:.2,revoada:0,tremor:1}],
  [33,{asa:1,leque:1,wa:-.5,lean:-8*D,ht:-1,bico:.6,aura:.9,selo:.8,joias:.4}],[36,{asa:1,leque:1,wa:-.5,lean:-8*D,ht:-1,aura:.9,selo:.9,joias:.6}],[39,{asa:1,leque:1,wa:-.5,lean:-8*D,ht:-1,aura:.9,selo:1,joias:.8}],[42,{e:'segura',asa:1,leque:1,wa:-.5,lean:-8*D,ht:-1,aura:.9,selo:1,joias:1}],[48,{e:'devagar'}]]);
CR.A.ataque.f=kf(CR.DEF,[[0,{}],[5,{e:'devagar',hx:40,lean:-10*D,aB:-150*D,aB2:-25*D,bico:.8,asa:.4,leque:.6,wa:.4}],[8,{e:'rapido',hx:52,lean:22*D,aB:30*D,aB2:15*D,bico:1.2,asa:.5,garra:.3,gn:0,rastro:.5,rdx:-4}],[9,{hx:54,lean:26*D,aB:55*D,aB2:15*D,garra:.55,gn:0,rastro:0}],[11,{e:'devagar',hx:53,lean:6*D,aB:-150*D,aB2:-25*D,garra:.95,gn:0}],
  [14,{e:'rapido',hx:58,lean:24*D,aB:30*D,aB2:15*D,bico:1.2,garra:.3,gn:1,rastro:.5,rdx:-4}],[16,{hx:60,lean:28*D,aB:55*D,aB2:15*D,garra:.6,gn:1,rastro:0}],[18,{e:'devagar',hx:58,lean:6*D,aB:-150*D,aB2:-25*D,garra:.95,gn:1}],
  [21,{e:'rapido',hx:62,lean:28*D,aB:30*D,aB2:15*D,bico:1.4,garra:.3,gn:2,rastro:.5,rdx:-4,asa:.7,wa:.6}],[23,{hx:64,lean:32*D,aB:60*D,aB2:15*D,garra:.6,gn:2,rastro:0,tremor:1}],[26,{e:'segura',hx:64,lean:32*D,aB:60*D,garra:.95,gn:2}],[30,{e:'devagar',garra:0}]]);
CR.A.especial.f=kf(CR.DEF,[[0,{}],[6,{e:'devagar',lean:-8*D,aF:-70*D,aF2:-60*D,cs:-125*D,joias:1,aura:.7,bico:.8,mald:.3,selo:.9}],[14,{e:'devagar',lean:-10*D,aF:-80*D,aF2:-60*D,cs:-130*D,aura:1,bico:1,mald:1,selo:1,asa:.3,leque:.4}],[16,{e:'segura',lean:-10*D,aF:-80*D,aF2:-60*D,cs:-130*D,aura:1,bico:1,mald:1,selo:1}],
  [18,{e:'rapido',lean:20*D,aF:-10*D,aF2:-15*D,cs:-15*D,bico:1.4,mald:.4,aura:.8,tremor:1}],[21,{e:'segura',lean:20*D,aF:-10*D,aF2:-15*D,cs:-15*D,bico:.6,mald:0}],[28,{e:'devagar'}]]);
CR.A.fase2.f=kf(CR.DEF,[[0,{}],[6,{e:'devagar',lean:32*D,ht:1.6,aj:.6,asa:.15,aura:.8,penas:0}],[12,{lean:34*D,ht:1.6,aj:.7,asa:.2,aura:1,tremor:1,penas:.15,f2:0}],[18,{lean:34*D,ht:1.6,aj:.7,asa:.25,aura:1,tremor:1,penas:.35,f2:.45,raio:1}],
  [22,{e:'rapido',lean:-14*D,ht:-1.8,aj:0,asa:1,leque:1,wa:-.9,bico:1.8,grito:1.5,f2:1,aura:1.4,selo:1,raio:1,penas:.6,tremor:1,revoada:.5}],[28,{lean:-14*D,ht:-1.8,asa:1,leque:1,wa:-.2,bico:1.8,grito:1.5,f2:1,aura:1.4,selo:1,raio:1,penas:.95,tremor:1,revoada:1}],
  [36,{e:'segura',lean:-10*D,ht:-1.2,asa:1,leque:1,wa:-.5,bico:1,grito:.6,f2:1,aura:1.2,selo:1,raio:1,revoada:1}],[42,{e:'devagar',lean:-6*D,asa:.5,leque:.6,wa:-.2,f2:1,aura:1,selo:.8,raio:0,revoada:0}],[48,{e:'devagar',f2:1}]]);
CR.A.especial2.f=kf(CR.DEF,[[0,{}],[6,{e:'devagar',aj:.8,lean:26*D,asa:.9,leque:.8,wa:.8,ht:.6}],[9,{e:'segura',aj:.9,lean:28*D,asa:1,leque:1,wa:.9,ht:.6,tremor:1}],[11,{e:'rapido',voo:1.2,asa:1,leque:1,wa:-1,lean:-14*D,ht:-1,rastro:.6,rdy:4,rdx:0}],
  [14,{e:'rapido',voo:3.6,asa:1,leque:1,wa:.8,lean:-10*D,rastro:.6,rdy:5}],[22,{e:'segura',voo:3.6,asa:1,wa:.2,hx:56,lean:0,rastro:0}],
  [25,{e:'rapido',voo:1.2,hx:62,asa:.6,leque:.4,wa:-1,lean:52*D,ht:1.8,bico:1.4,aB:20*D,aF:20*D,aura:1.2,rastro:1,rdx:-6,rdy:-6}],[27,{voo:0,hx:64,asa:.55,wa:-1,lean:48*D,ht:1.5,bico:1.4,aB:40*D,fF:[70,GY],fB:[56,GY],aura:1.4,rastro:.5,rdx:-6,rdy:-6,tremor:1,nevoa:2}],
  [31,{e:'segura',voo:0,hx:64,asa:.5,lean:44*D,fF:[70,GY],fB:[56,GY],aura:1,nevoa:1.4}],[40,{e:'devagar',nevoa:.6}]]);
CR.A.buff.f=kf(CR.DEF,[[0,{}],[6,{e:'devagar',aF:-100*D,aF2:-40*D,cs:-100*D,ht:-1.2,asa:1,leque:1,wa:-.3,lean:-6*D}],[9,{e:'rapido',aF:-110*D,aF2:-40*D,cs:-100*D,ht:-1.6,bico:1.6,grito:1,asa:1,leque:1,wa:-.8,revoada:.2,tremor:1}],
  [24,{e:'linear',aF:-110*D,aF2:-40*D,cs:-100*D,ht:-1.2,bico:.8,asa:1,leque:1,wa:-.4,revoada:1}],[28,{e:'segura',asa:1,leque:1,wa:-.4,revoada:1}],[32,{e:'devagar',revoada:0}]]);
CR.A.defesa.f=kf(CR.DEF,[[0,{}],[6,{e:'devagar',ht:-1,joias:1,aura:.8,asa:.6,leque:.8,wa:.6,aF:-80*D,aF2:-60*D,cs:-110*D,cupula:.2}],[12,{e:'rapido',ht:-1,aura:1.2,asa:.7,leque:1,wa:.5,aF:-90*D,aF2:-60*D,cs:-110*D,cupula:1}],[22,{e:'segura',ht:-1,aura:1.2,asa:.7,leque:1,wa:.5,aF:-90*D,aF2:-60*D,cs:-110*D,cupula:1}],[28,{e:'devagar',cupula:0}]]);
CR.A.ferido.f=kf(CR.DEF,[[0,{}],[1,{e:'rapido',hx:40,lean:-16*D,ht:-1.6,bico:1.2,asa:.4,leque:.7,wa:.9,olho:0,penas:.15}],[4,{hx:40,lean:-8*D,ht:-.6,asa:.15,penas:.3}],[10,{penas:0}]]);
CR.A.morte.f=kf(CR.DEF,[[0,{}],[3,{e:'rapido',hx:40,lean:-18*D,ht:-1.8,bico:1.8,grito:1.5,asa:.8,leque:1,wa:.9,aura:1.4,tremor:1}],[8,{hx:40,lean:-18*D,ht:-1.8,bico:1.8,grito:1.5,asa:.8,leque:1,wa:.9,aura:1.4,tremor:1}],
  [12,{hx:41,lean:-12*D,ht:-1.4,bico:1,asa:.6,aura:1.2,quebra:1}],[18,{hx:41,lean:-6*D,ht:-1,asa:.5,aura:1,quebra:2}],[24,{hx:42,lean:4*D,ht:0,asa:.4,aura:.8,quebra:3,aj:.4}],[30,{hx:42,lean:14*D,ht:1,asa:.3,aura:.6,quebra:4,aj:.8}],
  [36,{e:'devagar',hx:42,lean:26*D,ht:1.6,bico:0,asa:.2,aura:.3,quebra:5,aj:1,olho:.5,joias:0,cs:15*D,aF:80*D}],[44,{e:'devagar',hx:42,lean:26*D,ht:1.6,asa:.2,aura:.1,quebra:5,aj:1,olho:0,penas:.5,humano:.4,cs:15*D,aF:80*D,selo:0}],
  [52,{e:'devagar',hx:42,lean:24*D,ht:.8,asa:.2,quebra:5,aj:1,penas:1,humano:1,coroa:.5,al:.6,dead:1,cs:15*D,aF:80*D,selo:0}],[58,{e:'rapido',hx:42,lean:24*D,quebra:5,aj:1,humano:1,coroa:1,al:.3,po:.3,dead:1,cs:15*D,aF:80*D,selo:0}],
  [70,{e:'devagar',hx:42,lean:24*D,quebra:5,aj:1,humano:.2,coroa:1,al:0,po:.9,branco:.5,dead:1,cs:15*D,aF:80*D,selo:0,nevoa:.3}],[80,{e:'linear',hx:42,quebra:5,aj:1,humano:0,coroa:1,al:0,po:0,branco:1,dead:1,selo:0,nevoa:.2}],[84,{hx:42,quebra:5,aj:1,coroa:1,al:0,branco:1,dead:1,selo:0,nevoa:.2}]]);
const CLARAO={entrada:[26],ataque:[9,16,23],especial:[18],fase2:[22,30],especial2:[27],buff:[9],defesa:[12],morte:[3,12,18,24,30,36]};
for(const k in CR.A){const A=CR.A[k];if(A.loop)continue;const g=A.f,cl2=CLARAO[k]||[];A.f=f=>{const o={...g(f),ph:f};if(o.tremor)o.sh=(f%2?1:-1)*o.tremor;o.flash=cl2.includes(f)?.8:cl2.includes(f-1)?.3:0;return o}}

Object.assign(BICHOS,{reicorvo:CR});
})();
