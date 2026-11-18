/* O CORVO REI — chefe final (Nível 7). Segue docs/lore.md:
   - Aldric, o Rei Justo, preso no pacto de Morvane; a cada dia "mais pássaro".
   - A Coroa de Cinco Juramentos: 5 joias (Garrel/lealdade azul, Ysolda/visão verde, Bram/ferro prata, Elowen/nome branca, Morvane/pacto roxa).
   - Fase 2: vira mais pássaro (capa vira asas, mãos viram garras, bico cresce, olhos vermelhos).
   - Queda: ajoelha, a coroa cai, vira pó e penas — e o corvo branco (o pedaço de Aldric que ainda é humano) sobe livre.
   Usa o motor de bichos.js. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,D,PI}=BICHO.util,GY=BICHO.GY,W=BICHO.W;
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const JOIAS=['#4a8ae8','#4ad06a','#c8d0dc','#f2f2ff','#b050e0'];

/* asa de penas grandes: do ombro até a ponta, com penas recortadas descendo até "fim" */
function asaReal(pen,s,tip,fim,cor,osso){const pts=[s,tip];for(let i=1;i<=6;i++){const t=i/7,q=[lerp(tip[0],fim[0],t),lerp(tip[1],fim[1],t)];const dx=fim[0]-tip[0],dy=fim[1]-tip[1],L=Math.hypot(dx,dy)||1,nx=dy/L,ny=-dx/L;const o=(i%2?2.8:.6);pts.push([q[0]-nx*o,q[1]-ny*o])}pts.push(fim);
  pen.poly(pts,cor[1]);for(let i=1;i<=5;i+=2){const t=i/7,q=[lerp(tip[0],fim[0],t),lerp(tip[1],fim[1],t)];pen.line(lerp(s[0],q[0],.45),lerp(s[1],q[1],.45),q[0],q[1],cor[0])}pen.line(s[0],s[1],tip[0],tip[1],osso)}
function corvinho(pen,x,y,fl,cor='#14141e'){pen.ell(x,y,2,1.4,cor);pen.px(x+2,y-.5,cor);pen.px(x+3,y-.5,'#3a3a44');pen.px(x+1.5,y-1,'#c0201a');const a=fl>0?-2:1.5;pen.line(x-1,y-.5,x-3,y+a,cor);pen.line(x+.5,y-.5,x-1,y+a-.5,cor);pen.line(x-2,y+.5,x-4,y+1,cor)}

const CR={nome:'O Corvo Rei',nivel:7,
  DEF:{hx:24,hy:32,lean:2*D,fF:[28,GY],fB:[20,GY],aF:60*D,aF2:-110*D,aB:80*D,aB2:-30*D,ht:0,bico:0,olho:1,asa:0,wa:0,f2:0,coroa:0,joias:.3,revoada:0,aura:0,po:0,branco:0,aj:0,voo:0,cs:-85*D,tr:0,trB:0,sh:0,ph:0,dead:0,rot:0,px:24,py:GY,al:1,tremor:0},
  draw(pen,p){const f2=p.f2,pena=f2,R=['#100c18','#1e1830','#30284a','#463c64'],O=['#7a5a1a','#b8902e','#ffe27a'],BK=['#0c0c14','#1a1a26','#2e2e40'];
    const hy=p.hy+p.aj*5-p.voo*16,hip=[p.hx+p.sh,hy],neck=P(hip,-PI/2+p.lean,12),shF=[neck[0]+2,neck[1]+2],shB=[neck[0]-2.5,neck[1]+2];
    // asa de trás / capa: dobrada vira capa até o chão; aberta vira asa enorme
    const ab=p.asa,tipB=[lerp(hip[0]-9,neck[0]-21,ab),lerp(GY-1,neck[1]-9+p.wa*10,ab)],fimB=[lerp(hip[0]-4,hip[0]-6,ab),lerp(GY-1,hip[1]+2,ab)];
    asaReal(pen,shB,tipB,fimB,R,BK[0]);
    // braço de trás (garras sombrias)
    const eb=P(shB,p.aB,5),hb=P(eb,p.aB+p.aB2,5);pen.line(shB[0],shB[1],eb[0],eb[1],R[1],3);pen.line(eb[0],eb[1],hb[0],hb[1],pena>.5?'#3a3a44':'#2a2a36',2);
    for(let i=-1;i<=1;i++){const t=P(hb,p.aB+p.aB2+i*.45,2.5+pena);pen.line(hb[0],hb[1],t[0],t[1],'#c8c0aa')}
    // pés: botas reais, ou garras de pássaro na fase 2
    const pe=(f,c)=>{if(pena>.5){pen.line(f[0],f[1]-3,f[0],f[1],'#3a3a44',2);for(let i=-1;i<=2;i++)pen.line(f[0],f[1],f[0]+i*1.4,f[1]+.3,'#c8c0aa');pen.px(f[0]-1.5,f[1]-.5,'#c8c0aa')}else{pen.line(f[0]-1,f[1]-1,f[0]+2.5,f[1]-1,c,2)}};
    // manto real até o chão
    const hem=GY-(p.voo>0?p.voo*14:0),w1=8+p.aj*2;const pts=[[neck[0]-4.5,neck[1]],[neck[0]+4.5,neck[1]+.5],[hip[0]+w1,hem]];
    for(let i=0;i<=8;i++){const t=i/8;pts.push([lerp(hip[0]+w1,hip[0]-w1-1,t),hem-((i%2)?(pena>.5?3:1.4):0)])}pts.push([hip[0]-w1-1,hem]);
    pen.poly(pts,R[2]);pen.line(neck[0]+4.5,neck[1]+.5,hip[0]+w1,hem,R[3]);pen.line(neck[0]-4.5,neck[1],hip[0]-w1-1,hem,R[1]);
    pen.line(neck[0]+1,neck[1]+1,hip[0]+1.5,hem-1,O[1]);pen.line(hip[0]-5,hip[1]+1,hip[0]+6,hip[1]+1.5,O[0],2);pen.px(hip[0]+1,hip[1]+1,JOIAS[4]);
    if(pena>.3){for(let i=0;i<8;i++){const x=hip[0]-6+(i*5)%13,y=neck[1]+5+((i*7)%16);pen.line(x,y,x-1,y+2,R[1]);pen.px(x+1,y+1,R[3])}}
    if(p.voo<.2){pe([p.fF[0],GY],BK[1]);pe([p.fB[0],GY],BK[0])}
    // gola de penas
    for(let i=0;i<7;i++){const a=PI+i/6*PI,q=P([neck[0],neck[1]+1],a,4.5+(i%2)*1.2);pen.line(neck[0],neck[1]+1,q[0],q[1],i%2?BK[1]:BK[2],2)}
    // cabeça de corvo
    const ht=p.ht,h=[neck[0]+1.5+ht*.5,neck[1]-4.2];
    pen.bola(h[0],h[1],4.2,3.8,BK);pen.line(h[0]-3,h[1]-2.5,h[0]+1,h[1]-3.6,'#4a4a78');pen.px(h[0]-1,h[1]-2,'#5a5a90');pen.px(h[0]+2,h[1]+1.5,'#2e2e48');
    const bl=7+pena*3,ba=.12+ht*.18,b0=[h[0]+3,h[1]-.2];const bt=P(b0,ba,bl);
    pen.poly([[b0[0],b0[1]-1.8],bt,[b0[0],b0[1]+.4]],'#5a5a68');pen.line(b0[0],b0[1]-1.8,bt[0],bt[1],'#9a9aac');pen.px(bt[0],bt[1],'#c8c8d8');
    const ja=ba+p.bico*.5,jt=P([b0[0],b0[1]+.8],ja,bl-1);pen.poly([[b0[0],b0[1]+.5],jt,[b0[0],b0[1]+1.8]],'#2a2a32');
    if(p.bico>.2)pen.poly([[b0[0]+.5,b0[1]+.4],bt,jt],'#3a0814');
    pen.info.boca=P(b0,ba,bl*.7);
    if(p.dead>.5)olhoX(pen,Math.round(h[0]+1),Math.round(h[1]-1),'#5a5a6a');
    // coroa de cinco juramentos (cai quando ele cai)
    const c0=[lerp(h[0]-1,h[0]-13,p.coroa),lerp(h[1]-5.5,GY-3,p.coroa)-(f2>.5&&p.coroa===0?2+Math.sin(p.ph*.5):0)],inc=p.coroa*-.4;
    const cr=(dx,dy)=>[c0[0]+dx*Math.cos(inc)-dy*Math.sin(inc),c0[1]+dx*Math.sin(inc)+dy*Math.cos(inc)];
    const jp=[cr(-4,.2),cr(-2,.2),cr(0,.2),cr(2,.2),cr(4,.2)];
    const coroa=pn=>{pn.poly([cr(-5,1.8),cr(-5,-2.5),cr(-3.2,-.6),cr(-1.6,-3.6),cr(0,-.8),cr(1.6,-3.6),cr(3.2,-.6),cr(5,-2.5),cr(5,1.8)],O[1]);pn.line(cr(-5,1.8)[0],cr(-5,1.8)[1],cr(5,1.8)[0],cr(5,1.8)[1],O[0]);pn.line(cr(-5,-2.5)[0],cr(-5,-2.5)[1],cr(-3.2,-.6)[0],cr(-3.2,-.6)[1],O[2]);jp.forEach((q,i)=>pn.px(q[0],q[1],JOIAS[i]))};
    // a coroa caída fica no chão mesmo quando ele vira pó
    if(p.coroa>.9&&p.al<1)pen.depois(coroa);else coroa(pen);
    // cetro na mão da frente
    const ef=P(shF,p.aF,5),hf=P(ef,p.aF+p.aF2,5);
    if(p.dead<.5||p.po<.3){const s0=P(hf,p.cs+PI,12),s1=P(hf,p.cs,12);pen.line(s0[0],s0[1],s1[0],s1[1],O[1],2);pen.line(s0[0],s0[1],s1[0],s1[1],O[2]);
      pen.poly([P(s1,p.cs-PI/2,3.5),P(s1,p.cs,1),P(s1,p.cs+PI/2,3.5),P(s1,p.cs+PI,1.5)],BK[2]);const orb=P(s1,p.cs,2.5);pen.ell(orb[0],orb[1],2,2,'#4a1a6a');pen.ell(orb[0],orb[1],1.3,1.3,'#b050e0');pen.px(orb[0]-.4,orb[1]-.5,'#f0c0ff');pen.info.boca=orb}
    pen.line(shF[0],shF[1],ef[0],ef[1],R[2],3);pen.line(ef[0],ef[1],hf[0],hf[1],pena>.5?'#3a3a44':'#2a2a36',2);if(pena>.5){for(let i=-1;i<=1;i++){const t=P(hf,p.aF+p.aF2+i*.5,2.2);pen.line(hf[0],hf[1],t[0],t[1],'#c8c0aa')}}
    // asa da frente (só quando abre)
    if(ab>.15){const tipF=[lerp(neck[0]+2,neck[0]+13,ab),lerp(hip[1],neck[1]-11+p.wa*10,ab)];asaReal(pen,[neck[0]+1,neck[1]+2.5],tipF,[lerp(hip[0]-1,hip[0]+4,ab),hip[1]+1],[R[1],R[3]],BK[0])}
    // tudo que brilha por conta própria
    const olho=p.olho,dead=p.dead,joias=p.joias,aura=p.aura,rev=p.revoada,ph=p.ph,branco=p.branco,po=p.po,tr=p.tr,trB=p.trB;
    pen.depois(pn=>{
      if(aura>0){for(let i=0;i<10;i++){const x=hip[0]-9+i*2,b=GY-1,hh=(3+Math.sin(ph*1.6+i*1.9)*1.6)*aura*(1+(i>2&&i<8?.6:0));pn.line(x,b,x+Math.sin(ph+i)*.7,b-hh,'#3a1250');pn.px(x,b-hh-1,'#a050e0')}}
      if(dead<.5&&olho>0){pn.px(h[0]+1,h[1]-1,f2>.5?'#ff2a1a':'#c070ff');pn.px(h[0]+1.8,h[1]-1.2,f2>.5?'#ffb0a0':'#f0c0ff');if(f2>.5)pn.px(h[0]+2.6,h[1]-1.6,'#ff2a1a')}
      if(joias>.5){jp.forEach((q,i)=>{pn.px(q[0],q[1]-1,'#ffffff');if(joias>.9){pn.px(q[0]-1,q[1],JOIAS[i]);pn.px(q[0]+1,q[1],JOIAS[i])}})}
      if(tr){for(let a=tr;a<=tr+1.6;a+=.06){const q=P(hb,a,7+((a*10)|0)%2);pn.px(q[0],q[1],'#8a4ab0')}}
      if(rev>0){for(let i=0;i<5;i++){const a=ph*.5+i*PI*2/5,r=lerp(40,10+i%2*4,cl(rev*1.4-i*.1));corvinho(pn,hip[0]+Math.cos(a)*r,neck[1]-4+Math.sin(a)*r*.45,(ph+i)%2)}}
      if(branco>0){const y=lerp(neck[1],-6,branco),x=h[0]+Math.sin(branco*9)*3,fl=Math.sin(ph*1.8)>0?-2.5:1.5;
        pn.ell(x,y,2.4,1.6,'#f2f2ff');pn.px(x+2.5,y-.6,'#f2f2ff');pn.px(x+3.4,y-.6,'#e8c25a');pn.px(x+1.8,y-1,'#2a2a3a');pn.line(x-1,y-.5,x-4,y+fl,'#ffffff');pn.line(x+.5,y-.5,x-2,y+fl-.6,'#e8e8f8');pn.line(x-2.5,y+.5,x-5,y+1,'#f2f2ff');
        for(let i=0;i<3;i++)pn.px(x-3-i*2,y+2+i*2,i%2?'#ffffff':'#c8d8ff')}
      if(po>0&&po<1){for(let i=0;i<12;i++){const t=(po*1.3+i/12)%1,x=hip[0]-8+((i*7)%17)+Math.sin(t*6+i)*2,y=neck[1]+((i*5)%20)-t*16;pn.line(x,y,x+1,y+1.5,i%3?'#1a1a26':'#3e3e5a')}}})},
  A:{
   parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{ph:f,hy:32+(b>.6?1:0),lean:(2+b*2)*D,cs:(-85+b*3)*D,ht:sw(f,n,1,1)>.85?-.5:sw(f,n,1,1)<-.85?.5:0,joias:.3+b*.3,olho:f===14?0:1,aura:.15}}},
   entrada:{nome:'Entrada (abre as asas)',n:30,fps:12,f:null},
   ataque:{nome:'Garras Sombrias',n:24,fps:15,hits:[7,13,19],f:null},
   especial:{nome:'Maldição Real',n:20,fps:13,hits:[12],tiro:'sombra',f:null},
   fase2:{nome:'Fase 2 (mais pássaro)',n:26,fps:12,f:null},
   especial2:{nome:'Mergulho Real',n:30,fps:14,hits:[19],f:null},
   buff:{nome:'Chamar a Revoada',n:24,fps:12,f:null},
   defesa:{nome:'Coroa Negra',n:20,fps:12,f:null},
   ferido:{n:8,fps:14,f:null},
   morte:{nome:'“Aldric... era esse... o meu nome...”',n:44,fps:10,f:null}}};
CR.A.entrada.f=kf(CR.DEF,[[0,{aj:1,lean:30*D,ht:1.5,asa:.35,wa:1.2,olho:0,joias:0,aura:.6}],[8,{aj:1,lean:30*D,ht:1.5,asa:.35,wa:1.2,olho:0,joias:0,aura:.8,tremor:1}],[11,{e:'rapido',aj:.6,lean:10*D,ht:0,asa:.5,olho:1,joias:.5,aura:1}],
  [15,{e:'rapido',aj:0,lean:-8*D,ht:-1,asa:1,wa:-.6,bico:1,olho:1,joias:1,aura:1,revoada:.3}],[20,{asa:1,wa:-.4,lean:-8*D,ht:-1,bico:1,joias:1,aura:1,revoada:1}],[24,{e:'segura',asa:1,wa:-.5,lean:-6*D,ht:-.5,bico:.4,joias:1,aura:.6,revoada:1}],[30,{e:'devagar',revoada:0}]]);
CR.A.ataque.f=kf(CR.DEF,[[0,{}],[4,{e:'devagar',hx:21,lean:-8*D,aB:-140*D,aB2:-20*D,bico:.6,asa:.3}],[6,{e:'rapido',hx:28,lean:22*D,aB:40*D,aB2:10*D,tr:-140*D,fF:[33,GY],fB:[22,GY],bico:1}],[7,{hx:29,lean:24*D,aB:60*D,aB2:10*D,fF:[33,GY],fB:[22,GY]}],
  [10,{e:'devagar',hx:27,lean:6*D,aB:-140*D,aB2:-20*D,fF:[32,GY],fB:[22,GY]}],[12,{e:'rapido',hx:30,lean:24*D,aB:40*D,aB2:10*D,tr:-140*D,fF:[35,GY],fB:[24,GY],bico:1}],[13,{hx:31,lean:26*D,aB:60*D,aB2:10*D,fF:[35,GY],fB:[24,GY]}],
  [16,{e:'devagar',hx:29,lean:6*D,aB:-140*D,aB2:-20*D,fF:[34,GY],fB:[23,GY]}],[18,{e:'rapido',hx:32,lean:26*D,aB:40*D,aB2:10*D,tr:-140*D,fF:[36,GY],fB:[25,GY],bico:1}],[19,{hx:33,lean:28*D,aB:60*D,aB2:10*D,fF:[36,GY],fB:[25,GY]}],[21,{e:'segura',hx:33,lean:28*D,aB:60*D,fF:[36,GY],fB:[25,GY]}],[24,{e:'devagar'}]]);
CR.A.especial.f=kf(CR.DEF,[[0,{}],[5,{e:'devagar',lean:-6*D,aF:-80*D,aF2:-50*D,cs:-130*D,joias:.8,aura:.5,bico:.6}],[10,{e:'segura',lean:-6*D,aF:-90*D,aF2:-50*D,cs:-135*D,joias:1,aura:.8,bico:.8}],[12,{e:'rapido',lean:16*D,aF:-10*D,aF2:-20*D,cs:-20*D,bico:1,aura:.6}],[14,{e:'segura',lean:16*D,aF:-10*D,aF2:-20*D,cs:-20*D,bico:.6}],[20,{e:'devagar'}]]);
CR.A.fase2.f=kf(CR.DEF,[[0,{}],[5,{e:'devagar',lean:24*D,ht:1.4,aj:.4,asa:.2,aura:.6}],[9,{lean:26*D,ht:1.5,aj:.5,asa:.2,aura:.8,sh:1,f2:.4}],[11,{lean:26*D,ht:1.5,aj:.5,asa:.25,aura:.9,sh:-1,f2:.7}],[13,{e:'rapido',lean:-14*D,ht:-1.6,aj:0,asa:1,wa:-.8,bico:1.4,f2:1,aura:1,joias:1,sh:0,revoada:.4}],
  [17,{lean:-14*D,ht:-1.6,asa:1,wa:-.2,bico:1.4,f2:1,aura:1,joias:1,revoada:.8}],[21,{e:'segura',lean:-12*D,ht:-1.4,asa:1,wa:-.5,bico:1.2,f2:1,aura:1,joias:1,revoada:1}],[26,{e:'devagar',f2:1,revoada:0}]]);
CR.A.especial2.f=kf(CR.DEF,[[0,{}],[5,{e:'devagar',aj:.6,lean:20*D,asa:.8,wa:.6,ht:.5}],[8,{e:'segura',aj:.7,lean:22*D,asa:.9,wa:.7}],[11,{e:'rapido',voo:2.2,asa:1,wa:-.9,lean:-10*D,ht:-1}],[14,{voo:2.4,asa:1,wa:.6,lean:0,hx:28}],[16,{e:'segura',voo:2.4,asa:1,wa:-.6,hx:30,bico:1,ht:1}],
  [18,{e:'rapido',voo:.5,hx:38,asa:.6,wa:-1,lean:50*D,ht:1.6,aB:20*D,aF:20*D,bico:1.2,aura:1}],[19,{voo:0,hx:39,asa:.5,wa:-1,lean:46*D,ht:1.4,aB:40*D,fF:[44,GY],fB:[33,GY],aura:1,tremor:1}],[23,{e:'segura',voo:0,hx:39,asa:.5,lean:40*D,fF:[44,GY],fB:[33,GY],aura:.6}],[30,{e:'devagar'}]]);
CR.A.buff.f=kf(CR.DEF,[[0,{}],[5,{e:'devagar',aF:-100*D,aF2:-40*D,cs:-100*D,ht:-1,bico:1,asa:.5,wa:-.4}],[8,{aF:-105*D,aF2:-40*D,cs:-100*D,ht:-1,bico:1.3,asa:.6,wa:-.6,revoada:.2}],[18,{e:'linear',aF:-105*D,aF2:-40*D,cs:-100*D,ht:-1,bico:.6,asa:.6,wa:-.5,revoada:1}],[24,{e:'devagar',revoada:0}]]);
CR.A.defesa.f=kf(CR.DEF,[[0,{}],[5,{e:'devagar',ht:-1,joias:1,aura:.6,asa:.4,wa:.4,lean:-4*D}],[10,{ht:-1,joias:1,aura:1.4,asa:.6,wa:.2,lean:-4*D}],[16,{e:'segura',ht:-1,joias:1,aura:1.4,asa:.6,wa:.2}],[20,{e:'devagar'}]]);
CR.A.ferido.f=kf(CR.DEF,[[0,{}],[1,{e:'rapido',hx:21,lean:-14*D,ht:-1.4,bico:1,asa:.4,wa:.8,olho:0}],[3,{hx:21,lean:-6*D,ht:-.6,asa:.2}],[8,{}]]);
CR.A.morte.f=kf(CR.DEF,[[0,{}],[2,{e:'rapido',hx:21,lean:-16*D,ht:-1.6,bico:1.4,asa:.6,wa:.8,aura:1}],[6,{hx:21,lean:-16*D,ht:-1.6,bico:1.4,asa:.6,wa:.8,aura:1,sh:1}],[8,{hx:21,lean:-14*D,ht:-1.6,bico:1.4,asa:.6,aura:1,sh:-1}],
  [13,{e:'devagar',hx:22,aj:1,lean:28*D,ht:1.6,bico:.2,asa:.25,wa:1,aura:.4,joias:1,olho:.5,sh:0,cs:10*D,aF:80*D}],[17,{e:'devagar',hx:22,aj:1,lean:26*D,ht:1.2,asa:.25,wa:1,aura:.2,olho:.3,coroa:1,joias:0,cs:10*D,aF:80*D}],
  [24,{e:'segura',hx:22,aj:1,lean:20*D,ht:-.4,asa:.25,wa:1,coroa:1,olho:0,dead:1,cs:10*D,aF:80*D}],[32,{e:'devagar',hx:22,aj:1,lean:20*D,ht:-.4,asa:.25,wa:1,coroa:1,dead:1,al:.15,po:.9,branco:.25,cs:10*D,aF:80*D}],
  [40,{e:'linear',hx:22,aj:1,lean:20*D,asa:.25,coroa:1,dead:1,al:0,po:.99,branco:.95,cs:10*D,aF:80*D}],[44,{hx:22,aj:1,coroa:1,dead:1,al:0,po:0,branco:1}]]);
for(const k in CR.A){const A=CR.A[k];if(A.loop)continue;const g=A.f;A.f=f=>{const o={...g(f),ph:f};if(o.tremor)o.sh=(f%2?1:-1)*o.tremor;return o}}

Object.assign(BICHOS,{reicorvo:CR});
})();
