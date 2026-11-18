/* ALIADOS do caminho (docs/lore.md): Sir Aldo, Mira, Bruna, Frei Tobias, Kael e Irmã Celeste.
   Mesmo estilo e tamanho dos heróis (olham para a DIREITA; na cena do encontro a tela vira para olhar o herói).
   Cada um: parado, 2 manias, entrada, ataque (rápido, para o fim do turno), especial, apoio, lutando (cercado), vitória e despedida. */
(function(){
const {P,lerp,kf,sw,olhoX,D,PI}=BICHO.util;const {W,H,GY,ALVO,cl,dit,PELE,DEFB,corpo,pes,anima,poeira}=HB;
const PELE2=['#a87050','#c8906a','#e0b088'];
const def=o=>({...DEFB,...o});
/* animações comuns a todos */
function comuns(B,K,extra){const A=B.A;
  A.entrada.f=kf(K,[[0,{hx:-10,andar:1,passo:0,lean:10*D}],[12,{e:'linear',hx:18,andar:1,passo:PI*4,lean:10*D}],[14,{hx:21,andar:0,...(extra.chega||{})}],[18,{e:'devagar'}]]);
  A.despedida.f=kf(K,[[0,{}],[5,{e:'devagar',...extra.adeus}],[12,{e:'segura',...extra.adeus}],[14,{e:'devagar',lean:6*D}],[28,{e:'linear',hx:-14,andar:1,passo:-PI*5,lean:8*D}]]);
  A.lutando.f=(f)=>{const n=A.lutando.n,s=sw(f,n,1),c=Math.floor(f/(n/4))%4;return{...K,...extra.guarda,hx:K.hx+s*1.5,lean:((extra.guarda.lean||0)/D+s*4)*D,ht:c===1?-.8:c===3?.8:0,ph:f,
    ...(f%(n/2)>=n/2-4?extra.golpeRapido:{})}};}
/* ===================== SIR ALDO — o Velho Cavaleiro (Garrel) ===================== */
const ALDO={nome:'Sir Aldo',W,H,GY,semEspelho:1,DEF:def({hx:21,hy:40,lean:6*D,aF:70*D,aF2:-60*D,aB:80*D,aB2:-30*D,es:-80*D,brilho:0,afia:0,costas:0,luz:0}),molas:['capa'],
  draw(pen,p){const S=['#3a3e46','#5a626e','#7a8490','#a0a8b2'],T=['#4a2020','#6a2a2a'];const pp=pes(p);const q=pp?{...p,...pp}:p;const B=corpo(pen,q,{tronco:10,perna:6,gross:2});const{hip,neck,shF,shB,head}=B;
    // escudo velho nas costas
    pen.ell(neck[0]-5,neck[1]+5,4,5,'#5a3a1e');pen.ell(neck[0]-5,neck[1]+5,3,4,'#7a5a30');pen.px(neck[0]-5,neck[1]+5,S[2]);
    const bb=p.costas>0?null:B.braco(shB,p.aB,p.aB2,[S[1],S[1]],null);if(p.costas>0){const h=[hip[0]-3,hip[1]-2];pen.line(shB[0],shB[1],h[0]-1,h[1]-3,S[1],2);pen.line(h[0]-1,h[1]-3,h[0],h[1],S[1],2)}
    B.perna([hip[0]-1,hip[1]+1],q.fB,[S[1],S[1]],'#1a1a1e');
    pen.poly([[neck[0]-4,neck[1]],[neck[0]+4,neck[1]+.5],[hip[0]+4,hip[1]+2],[hip[0]-4,hip[1]+2]],S[2]);pen.line(neck[0]+4,neck[1]+.5,hip[0]+4,hip[1]+2,S[3]);
    pen.poly([[neck[0]-2,neck[1]+2],[neck[0]+2.5,neck[1]+2],[hip[0]+2.5,hip[1]+6],[hip[0]-2,hip[1]+6]],T[1]);pen.px(neck[0]+.5,neck[1]+5,'#a8a8a8');pen.px(neck[0]-.5,neck[1]+6,'#a8a8a8');pen.px(neck[0]+1.5,neck[1]+6,'#a8a8a8');
    pen.px(neck[0]-1,neck[1]+3,S[0]);pen.px(neck[0]+3,neck[1]+8,S[0]);// amassados
    B.perna([hip[0]+1,hip[1]+1],q.fF,[S[2],S[2],S[3]],'#1a1a1e');
    // cabeça: elmo aberto, barba grisalha
    pen.bola(head[0]+.4,head[1]+.4,3.2,3.4,PELE2);pen.poly([[head[0]-3.6,head[1]-1],[head[0]-3.2,head[1]-4],[head[0]+3,head[1]-4.3],[head[0]+3.6,head[1]-1.5],[head[0]+.8,head[1]-1.8]],S[2]);pen.line(head[0]-3.2,head[1]-4,head[0]+3,head[1]-4.3,S[3]);
    pen.poly([[head[0]-1,head[1]+1.2],[head[0]+3.4,head[1]+1.4],[head[0]+2.6,head[1]+4.4],[head[0]+.2,head[1]+4.6]],'#c8c8c0');pen.px(head[0]+2.5,head[1]+.6,'#e0e0d8');
    if(p.mo>.3)pen.px(head[0]+2.6,head[1]+2,'#4a2a1a');pen.px(head[0]+1.8,head[1]-.4,'#2a2a3a');pen.line(head[0]+1,head[1]-1.4,head[0]+2.8,head[1]-1.4,'#c8c8c0');
    // espada velha
    const fe=B.braco(shF,p.aF,p.aF2,[S[2],S[3]],null),hf=fe.h,t=P(hf,p.es,13),g1=P(hf,p.es+PI/2,2),g2=P(hf,p.es-PI/2,2);pen.line(hf[0],hf[1],t[0],t[1],'#a8b0bc');pen.px(lerp(hf[0],t[0],.6),lerp(hf[1],t[1],.6),'#7a828e');pen.line(g1[0],g1[1],g2[0],g2[1],'#8a6a2a');pen.px(hf[0],hf[1],S[3]);
    pen.info.boca=t;const ph=p.ph,v=k=>p[k]||0;const afia=v('afia'),luz=v('luz'),brilho=v('brilho');
    pen.depois(pn=>{if(afia>0&&ph%3<2){const q2=P(hf,p.es,4+(ph%4)*2);for(let i=0;i<3;i++)pn.px(q2[0]+i-1,q2[1]-1-i%2,'#ffe9a8')}
      if(luz>0){for(let r=0;r<14*luz;r++){const q2=P(hf,p.es,r);pn.px(q2[0],q2[1],'#fff0b0')}for(let i=0;i<8;i++){const a=ph*.3+i*PI/4;pn.px(t[0]+Math.cos(a)*4*luz,t[1]+Math.sin(a)*4*luz,'#ffe27a')}}
      if(brilho>0){pn.px(t[0],t[1],'#ffffff');pn.px(t[0]-1,t[1],'#e8eef6');pn.px(t[0]+1,t[1],'#e8eef6')}})},
  A:{parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b*1.4,lean:(6+b*3)*D,es:(-80+b*3)*D,ph:f}}},
   mania1:{nome:'Afiar a espada',n:26,fps:11,mania:1,f:null},mania2:{nome:'Ai, as costas',n:22,fps:10,mania:1,f:null},
   entrada:{nome:'Entrada',n:18,fps:12,f:null},ataque:{nome:'Golpe Veterano',n:12,fps:16,hits:[3],f:null},especial:{nome:'Velha Guarda',n:20,fps:14,hits:[11],f:null},
   buff:{nome:'Juramento de Garrel',n:22,fps:11,f:null},lutando:{nome:'Lutando cercado',n:24,fps:12,loop:1,f:null},vitoria:{nome:'Vitória',n:22,fps:11,f:null},despedida:{nome:'Despedida',n:28,fps:12,f:null}}};
{const K=ALDO.DEF,A=ALDO.A;
 A.mania1.f=kf(K,[[0,{}],[4,{e:'devagar',aF:30*D,aF2:-80*D,es:-10*D,aB:20*D,aB2:-60*D,ht:.6}],[8,{aF:30*D,aF2:-80*D,es:-10*D,aB:-10*D,aB2:-50*D,afia:1,ht:.6}],[11,{aF:30*D,aF2:-80*D,es:-10*D,aB:20*D,aB2:-60*D,afia:1}],[14,{aF:30*D,aF2:-80*D,es:-10*D,aB:-10*D,aB2:-50*D,afia:1}],[17,{aF:30*D,aF2:-80*D,es:-10*D,aB:20*D,aB2:-60*D,afia:1,ht:.8}],[21,{e:'segura',aF:30*D,aF2:-80*D,es:-12*D,afia:0,ht:-.4,brilho:1}],[26,{e:'devagar'}]]);
 A.mania2.f=kf(K,[[0,{}],[5,{e:'devagar',costas:1,lean:-16*D,hx:20,ht:-1.2,mo:1}],[12,{e:'segura',costas:1,lean:-18*D,hx:20,ht:-1.4,mo:1}],[16,{e:'devagar',costas:1,lean:2*D,ht:.4}],[22,{e:'devagar'}]]);
 A.ataque.f=kf(K,[[0,{}],[2,{e:'rapido',hx:19,lean:-6*D,aF:-30*D,aF2:-40*D,es:-50*D}],[3,{e:'rapido',hx:25,lean:18*D,aF:-5*D,aF2:0,es:-5*D,fF:[30,GY],brilho:1}],[6,{e:'segura',hx:25,lean:18*D,aF:-5*D,aF2:0,es:-5*D,fF:[30,GY]}],[12,{e:'devagar'}]]);
 A.especial.f=kf(K,[[0,{}],[4,{e:'devagar',hy:42,lean:-4*D,aF:-80*D,aF2:-40*D,es:-130*D}],[7,{e:'segura',hy:42,lean:-6*D,aF:-80*D,aF2:-40*D,es:-130*D,brilho:1,tremor:.6}],[10,{e:'rapido',hx:26,lean:20*D,aF:-10*D,aF2:0,es:0,fF:[31,GY]}],[11,{hx:27,lean:22*D,aF:0,es:5*D,fF:[31,GY],brilho:1}],[15,{e:'segura',hx:27,lean:22*D,aF:0,es:5*D,fF:[31,GY]}],[20,{e:'devagar'}]]);
 A.buff.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-120*D,aF2:-40*D,es:-90*D,lean:-4*D,ht:-1}],[10,{aF:-125*D,aF2:-40*D,es:-90*D,lean:-4*D,ht:-1,luz:1}],[17,{e:'segura',aF:-125*D,aF2:-40*D,es:-90*D,ht:-1,luz:1}],[22,{e:'devagar',luz:0}]]);
 A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',aF:60*D,aF2:20*D,es:90*D,lean:12*D,ht:-.4,mo:1}],[12,{aF:60*D,aF2:20*D,es:90*D,lean:14*D,ht:-1,mo:1,br:1.6}],[22,{e:'segura',aF:60*D,aF2:20*D,es:90*D,lean:10*D,ht:-.6,mo:.6}]]);
 comuns(ALDO,K,{adeus:{aF:-80*D,aF2:-90*D,es:-150*D,ht:-.4},guarda:{lean:12*D,aF:20*D,aF2:-50*D,es:-30*D,fF:[26,GY],fB:[15,GY]},golpeRapido:{hx:24,lean:22*D,aF:-5*D,aF2:0,es:-5*D,brilho:1}});anima(ALDO)}

/* ===================== MIRA — a Arqueira Cega (Ysolda) ===================== */
const MIRA={nome:'Mira',W,H,GY,semEspelho:1,DEF:def({mira:60*D,puxa:0,flecha:0,som:0,ouve:0,conta:0,cabelo:0}),molas:['capa','cabelo'],
  draw(pen,p){const V=['#2a3a34','#3e5448','#5a7466'],C=['#3a2a1a','#5a4228'];const pp=pes(p);const q=pp?{...p,...pp}:p;const B=corpo(pen,q,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    const cw=p.capa;pen.poly([[neck[0]-3,neck[1]-1],[neck[0]+1,neck[1]],[hip[0]-2,hip[1]+5],[hip[0]-6-cw,hip[1]+14],[hip[0]-8-cw*1.2,hip[1]+3]],V[1]);
    const aq=P(neck,PI/2+p.lean,3);pen.line(aq[0]-4,aq[1]+5,aq[0]-1,aq[1]-4,C[0],3);for(let i=0;i<3;i++){pen.line(aq[0]-1.5+i,aq[1]-4,aq[0]-.5+i,aq[1]-7,'#e8e0d0');pen.px(aq[0]-.5+i,aq[1]-7.5,'#e8e0d0')}
    B.perna([hip[0]-1,hip[1]+1],q.fB,[C[0],C[0]],'#1a1410');
    pen.poly([[neck[0]-3,neck[1]],[neck[0]+3,neck[1]+.5],[hip[0]+3.5,hip[1]+3],[hip[0]-3.5,hip[1]+3]],V[2]);pen.line(hip[0]-3.5,hip[1],hip[0]+3.5,hip[1],C[1],2);
    B.perna([hip[0]+1,hip[1]+1],q.fF,[C[1],C[1]],'#1a1410');
    // cabelo curto escuro e a venda branca com pontas soltas
    pen.bola(head[0]+.4,head[1]+.4,3.1,3.3,PELE);pen.poly([[head[0]-3.4,head[1]+1.5],[head[0]-3,head[1]-3],[head[0]+2.5,head[1]-3.8],[head[0]+3.4,head[1]-2],[head[0]-1,head[1]-2]],'#2a1a14');
    pen.line(head[0]-3,head[1]-.8,head[0]+3.4,head[1]-1,'#e8e4dc',2);pen.line(head[0]-3,head[1]-.5,head[0]-6-p.cabelo,head[1]+2+p.cabelo*.3,'#d8d4cc');pen.line(head[0]-3,head[1],head[0]-5.5-p.cabelo,head[1]+3.5,'#c8c4bc');
    pen.px(head[0]+1.8,head[1]+1.8,'#c87a60');
    const dir=p.mira,hB=P(shB,dir,8),corda=P(hB,dir+PI,2+p.puxa*7.5),eB=[lerp(shB[0],hB[0],.5),lerp(shB[1],hB[1],.5)+.8];pen.line(shB[0],shB[1],eB[0],eB[1],V[0],2);pen.line(eB[0],eB[1],hB[0],hB[1],PELE[0],2);
    const t1=P(P(hB,dir-PI/2,8.5),dir+PI,2),t2=P(P(hB,dir+PI/2,8.5),dir+PI,2),m=P(hB,dir,1.3);pen.line(t1[0],t1[1],m[0],m[1],'#c8b088',2);pen.line(m[0],m[1],t2[0],t2[1],'#a89068',2);pen.line(t1[0],t1[1],corda[0],corda[1],'#e8e0d0');pen.line(corda[0],corda[1],t2[0],t2[1],'#e8e0d0');
    if(p.flecha>.5){const tip=P(corda,dir,12);pen.line(corda[0],corda[1],tip[0],tip[1],'#9a7a50');pen.px(tip[0],tip[1],'#e8eef6')}
    const mao=p.conta>0?[lerp(corda[0],aq[0]-1,p.conta),lerp(corda[1],aq[1]-5,p.conta)]:corda,eF=[lerp(shF[0],mao[0],.5),lerp(shF[1],mao[1],.5)+1.5];pen.line(shF[0],shF[1],eF[0],eF[1],V[2],2);pen.line(eF[0],eF[1],mao[0],mao[1],PELE[1],2);
    pen.info.boca=P(hB,dir,2);const ph=p.ph,som=p.som||0,ouve=p.ouve||0;
    pen.depois(pn=>{if(ouve>0)for(let k=0;k<3;k++){const r=(4+k*3+((ph*.6)%3))*ouve;for(let a=-PI*.9;a<=-PI*.1;a+=.15)pn.px(head[0]-1+Math.cos(a)*r,head[1]+Math.sin(a)*r,k?'#a8c8d8':'#e8f4ff')}
      if(som>0)for(let k=0;k<4;k++){const x=lerp(head[0]+6,ALVO[0],cl(som*1.5-k*.18));if(x<=head[0]+6)continue;for(let a=-.7;a<=.7;a+=.12)pn.px(x+Math.cos(a)*3,ALVO[1]-4+Math.sin(a)*5,k%2?'#a8c8d8':'#ffffff')}})},
  A:{parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:sw(f,n,1,1)*1.2,cabelo:sw(f,n,1,.5)*1.4,mira:(60+b*4)*D,ht:sw(f,n,1,2)>.8?-.7:0,ph:f}}},
   mania1:{nome:'Contar as flechas',n:24,fps:11,mania:1,f:null},mania2:{nome:'Escutar os passos',n:22,fps:10,mania:1,f:null},
   entrada:{nome:'Entrada',n:18,fps:12,f:null},ataque:{nome:'Tiro às Cegas',n:12,fps:16,hits:[4],tiro:'flecha',f:null},especial:{nome:'Flecha do Som',n:24,fps:13,hits:[17],tiro:'flecha',f:null},
   buff:{nome:'Ouvir o inimigo',n:20,fps:11,f:null},lutando:{nome:'Lutando cercada',n:24,fps:12,loop:1,f:null},vitoria:{nome:'Vitória',n:22,fps:11,f:null},despedida:{nome:'Despedida',n:28,fps:12,f:null}}};
{const K=MIRA.DEF,A=MIRA.A,MI={mira:-4*D,lean:-2*D,fF:[26,GY],fB:[16,GY]};
 A.mania1.f=kf(K,[[0,{}],[4,{e:'devagar',conta:1,ht:.8}],[8,{conta:.85,ht:.8}],[10,{conta:1,ht:.8}],[12,{conta:.85,ht:.9}],[14,{conta:1,ht:.9}],[19,{e:'segura',conta:1,ht:-.3,mo:1}],[24,{e:'devagar',conta:0}]]);
 A.mania2.f=kf(K,[[0,{}],[5,{e:'devagar',ht:-1.2,ouve:.6}],[11,{e:'rapido',ht:1.2,ouve:1}],[17,{e:'segura',ht:1.2,ouve:1}],[22,{e:'devagar',ouve:0}]]);
 A.ataque.f=kf(K,[[0,{}],[2,{e:'rapido',...MI,flecha:1,puxa:.8,ht:-.6}],[3,{...MI,flecha:1,puxa:1,ht:-.6}],[4,{e:'rapido',...MI,flecha:0,puxa:0,lean:-8*D,capa:3}],[7,{e:'segura',...MI,lean:-6*D}],[12,{e:'devagar'}]]);
 A.especial.f=kf(K,[[0,{}],[4,{e:'devagar',...MI,ht:-1,ouve:1}],[10,{...MI,ht:-1,ouve:1,som:.5,flecha:1,puxa:.6}],[16,{e:'linear',...MI,ht:-.4,ouve:.6,som:1,flecha:1,puxa:1}],[17,{e:'rapido',...MI,flecha:0,puxa:0,som:0,ouve:0,lean:-10*D,capa:4}],[20,{e:'segura',...MI,lean:-8*D}],[24,{e:'devagar'}]]);
 A.buff.f=kf(K,[[0,{}],[5,{e:'devagar',ht:-1,ouve:1}],[15,{e:'segura',ht:-1,ouve:1.3}],[20,{e:'devagar',ouve:0}]]);
 A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',mira:-80*D,lean:-4*D,ht:-1,mo:1,capa:2}],[22,{e:'segura',mira:-82*D,ht:-1,mo:.6,ouve:.6}]]);
 comuns(MIRA,K,{adeus:{mira:80*D,lean:20*D,ht:1},guarda:{...MI,mira:0},golpeRapido:{...MI,flecha:0,puxa:0,lean:-8*D}});anima(MIRA)}

/* ===================== BRUNA — a Ferreira de Batalha (Bram) ===================== */
const BRU={nome:'Bruna',W,H,GY,semEspelho:1,DEF:def({hx:21,hy:40,mt:-70*D,ferro:0,fuligem:0,quente:0,vapor:0,giro:0,pz:0}),molas:['capa'],
  draw(pen,p){const A=['#4a2e1a','#6a4428'],R=['#5a3a2a','#8a5a3a'];const pp=pes(p);const q=pp?{...p,...pp}:p;const B=corpo(pen,q,{tronco:10,perna:6,gross:3});const{hip,neck,shF,shB,head}=B;
    const bb=B.braco(shB,p.aB,p.aB2,[PELE2[1],PELE2[0]],PELE2[1]);
    B.perna([hip[0]-1.5,hip[1]+1],q.fB,[R[0],R[0]],'#1a120c');
    pen.poly([[neck[0]-4.5,neck[1]],[neck[0]+4.5,neck[1]+.5],[hip[0]+4.5,hip[1]+2],[hip[0]-4.5,hip[1]+2]],'#7a3a2a');
    pen.poly([[neck[0]-2.5,neck[1]+1],[neck[0]+3.5,neck[1]+1.5],[hip[0]+4,hip[1]+8],[hip[0]-3,hip[1]+8]],A[1]);pen.line(neck[0]+3.5,neck[1]+1.5,hip[0]+4,hip[1]+8,'#8a5a36');pen.line(neck[0]-2.5,neck[1]+1,neck[0]-4,neck[1]-1,A[0]);
    pen.px(hip[0]+1,hip[1]-2,'#3a2a1a');pen.px(hip[0]-1,hip[1]+2,'#3a2a1a');
    B.perna([hip[0]+1.5,hip[1]+1],q.fF,[R[1],R[1]],'#1a120c');
    // cabeça: coque ruivo, fuligem no rosto
    pen.ell(head[0]-3,head[1]-3,2.2,2,'#8a3a1a');pen.bola(head[0]+.4,head[1]+.4,3.2,3.4,PELE2);pen.poly([[head[0]-3.4,head[1]],[head[0]-3,head[1]-3],[head[0]+2.8,head[1]-3.6],[head[0]+3.4,head[1]-2],[head[0],head[1]-2.4]],'#9a4a20');
    pen.px(head[0]+1.8,head[1]-.3,'#2a1a10');pen.px(head[0]+2.6,head[1]+1,'#3a2a20');pen.px(head[0]+.6,head[1]+1.6,'#3a2a20');pen.px(head[0]+2,head[1]+2,p.mo>.3?'#5a2a1a':'#a86a50');
    if(p.ferro>0){const c=[bb.h[0]+2,bb.h[1]-2];pen.line(c[0]-1.5,c[1],c[0]+1.5,c[1]-1,'#8a929c',2);pen.px(c[0],c[1]-1,'#c8d0dc')}
    // martelo de forja
    const fe=B.braco(shF,p.aF,p.aF2,[PELE2[1],PELE2[2]],null),hf=fe.h,mt=p.mt+p.giro*p.ph*1.1,m0=P(hf,mt+PI,3),m1=P(hf,mt,11);pen.line(m0[0],m0[1],m1[0],m1[1],'#5c3a1e',2);
    const hd=[P(m1,mt+PI/2,3.5),P(m1,mt-PI/2,3)];pen.line(hd[0][0],hd[0][1],hd[1][0],hd[1][1],'#3a3e48',4);pen.line(hd[0][0],hd[0][1],hd[1][0],hd[1][1],'#7a828e',1);
    pen.info.boca=m1;const ph=p.ph,v=k=>p[k]||0;const quente=v('quente'),vapor=v('vapor'),fuligem=v('fuligem'),giro=v('giro'),pz=v('pz');
    pen.depois(pn=>{if(quente>0){pn.line(hd[0][0],hd[0][1],hd[1][0],hd[1][1],quente>.6?'#ffb040':'#ff6a1a',2);for(let i=0;i<3;i++){const k2=((ph*.12+i/3)%1);pn.px(m1[0]+i-1,m1[1]-2-k2*6,'#ffe27a')}}
      if(vapor>0)for(let i=0;i<5;i++){const k2=((ph*.08+i/5)%1);if(dit(m1[0]+i,m1[1]-k2*14,1-k2))pn.ell(m1[0]-2+i*1.2+Math.sin(k2*6)*2,m1[1]-2-k2*12,1+k2,1+k2,'#d8d8d8')}
      if(fuligem>0)for(let i=0;i<6;i++){const a=i*1.1+ph*.2,r=3+fuligem*4;pn.px(head[0]+Math.cos(a)*r,head[1]+Math.sin(a)*r,'#3a3a3a')}
      if(giro>0)for(let a=0;a<PI*2;a+=.15){const q2=P(hf,mt+a,11);if(dit(q2[0],q2[1],.6))pn.px(q2[0],q2[1],(a*10|0)%3?'#ffb040':'#ffffff')}
      poeira(pn,hip[0]+12,pz)})},
  A:{parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b*1.2,mt:(-70+b*4)*D,ph:f}}},
   mania1:{nome:'Avaliar o ferro',n:24,fps:11,mania:1,f:null},mania2:{nome:'Limpar a fuligem',n:20,fps:11,mania:1,f:null},
   entrada:{nome:'Entrada',n:18,fps:12,f:null},ataque:{nome:'Marretada',n:12,fps:16,hits:[4],f:null},especial:{nome:'Faísca de Forja',n:22,fps:14,hits:[12],f:null},
   buff:{nome:'Têmpera',n:24,fps:12,f:null},lutando:{nome:'Lutando cercada',n:24,fps:12,loop:1,f:null},vitoria:{nome:'Vitória',n:22,fps:11,f:null},despedida:{nome:'Despedida',n:28,fps:12,f:null}}};
{const K=BRU.DEF,A=BRU.A;
 A.mania1.f=kf(K,[[0,{}],[4,{e:'devagar',ferro:1,aB:-40*D,aB2:-80*D,ht:.6,hd:.3}],[8,{ferro:1,aB:-50*D,aB2:-90*D,ht:.8}],[12,{ferro:1,aB:-40*D,aB2:-80*D,ht:-.4,mo:1}],[16,{e:'segura',ferro:1,aB:-40*D,aB2:-80*D,ht:-.4,mo:.6}],[24,{e:'devagar',ferro:0}]]);
 A.mania2.f=kf(K,[[0,{}],[5,{e:'devagar',aB:-60*D,aB2:-100*D,ht:.6}],[8,{aB:-50*D,aB2:-110*D,ht:-.4,fuligem:.5}],[11,{aB:-60*D,aB2:-100*D,ht:.6,fuligem:1}],[14,{e:'segura',aB:-50*D,aB2:-110*D,fuligem:.6}],[20,{e:'devagar',fuligem:0}]]);
 A.ataque.f=kf(K,[[0,{}],[2,{e:'rapido',hx:19,lean:-10*D,aF:-150*D,aF2:-20*D,mt:-200*D}],[4,{e:'rapido',hx:25,hy:41,lean:22*D,aF:30*D,aF2:10*D,mt:40*D,fF:[30,GY],pz:.1}],[8,{e:'segura',hx:25,hy:41,lean:22*D,aF:30*D,mt:40*D,fF:[30,GY],pz:.8}],[12,{e:'devagar'}]]);
 A.especial.f=kf(K,[[0,{}],[3,{e:'devagar',lean:6*D,aF:0,aF2:-20*D}],[11,{e:'linear',hx:24,lean:10*D,aF:0,aF2:-20*D,giro:1,fF:[28,GY]}],[12,{e:'rapido',hx:26,hy:41,lean:24*D,aF:30*D,aF2:10*D,mt:40*D,giro:0,fF:[31,GY],pz:.1,quente:1}],[17,{e:'segura',hx:26,hy:41,lean:22*D,aF:30*D,mt:40*D,fF:[31,GY],pz:.8,quente:.6}],[22,{e:'devagar',quente:0}]]);
 A.buff.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-20*D,aF2:-60*D,mt:-40*D,quente:.6}],[10,{aF:-20*D,aF2:-60*D,mt:-40*D,quente:1,ht:.4}],[13,{e:'rapido',aF:60*D,aF2:-20*D,mt:80*D,quente:.3,vapor:.2}],[20,{e:'segura',aF:60*D,aF2:-20*D,mt:80*D,quente:0,vapor:1}],[24,{e:'devagar',vapor:0}]]);
 A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-100*D,aF2:-20*D,mt:-95*D,ht:-.8,mo:1}],[9,{aF:-105*D,aF2:-20*D,mt:-95*D,ht:-.8,mo:1,quente:.7}],[22,{e:'segura',aF:-100*D,aF2:-20*D,mt:-95*D,ht:-.6,mo:.6,br:1.6,quente:.4}]]);
 comuns(BRU,K,{adeus:{aB:-110*D,aB2:-40*D,ht:-.4,mo:1},guarda:{lean:12*D,aF:-40*D,aF2:-40*D,mt:-120*D,fF:[26,GY],fB:[15,GY]},golpeRapido:{hx:24,lean:22*D,aF:30*D,aF2:10*D,mt:40*D}});anima(BRU)}

/* ===================== FREI TOBIAS — o Monge Andarilho (Elowen) ===================== */
const TOB={nome:'Frei Tobias',W,H,GY,semEspelho:1,DEF:def({cj:-82*D,livro:0,oculos:0,pagina:0,letras:0,luz:0,giro:0}),molas:['capa'],
  draw(pen,p){const R=['#3a2a1a','#5a4228','#7a5a38'];const B=corpo(pen,p,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    const bb=p.oculos>0?null:B.braco(shB,p.aB,p.aB2,[R[0],R[0]],PELE2[1]);
    const hem=GY,w1=6.5+p.capa*.3;pen.poly([[neck[0]-3.5,neck[1]],[neck[0]+3.5,neck[1]+.5],[hip[0]+w1,hem],[hip[0]-w1-1,hem]],R[1]);pen.line(neck[0]+3.5,neck[1]+.5,hip[0]+w1,hem,R[2]);
    pen.line(hip[0]-3.5,hip[1],hip[0]+4,hip[1],'#c8b088');pen.line(hip[0]+2,hip[1],hip[0]+2.5,hip[1]+6,'#c8b088');pen.px(hip[0]+2.5,hip[1]+6.5,'#a88a5a');
    // capuz baixo, careca com coroa grisalha, óculos redondos
    pen.ell(neck[0]-1,neck[1]+.5,4,1.8,R[2]);pen.bola(head[0]+.4,head[1]+.4,3.2,3.4,PELE2);pen.line(head[0]-3,head[1]-.5,head[0]-1,head[1]-2.5,'#c8c8c0');pen.px(head[0]-3,head[1]+.5,'#c8c8c0');
    pen.px(head[0]+1.4,head[1]-.3,'#2a2a3a');pen.ell(head[0]+1.6,head[1]-.3,1.3,1.1,'#8a8a90');pen.px(head[0]+1.6,head[1]-.3,'#2a2a3a');pen.px(head[0]+2.8,head[1]-.6,'#8a8a90');
    if(p.oculos>0){const h=[head[0]+2.5,head[1]-.2],e=[shB[0]+3,shB[1]+3];pen.line(shB[0],shB[1],e[0],e[1],R[0],2);pen.line(e[0],e[1],h[0],h[1],R[0],2);pen.px(h[0],h[1],PELE2[1])}
    pen.px(head[0]+2,head[1]+2,p.mo>.3?'#6a3a2a':'#b07a5a');
    // livro na mão de trás
    const lc=bb?[bb.h[0]+2.5,bb.h[1]-1]:null;if(lc){const ab=p.livro;pen.poly([[lc[0]-2-ab*2,lc[1]-2],[lc[0]+2+ab*2,lc[1]-2-ab],[lc[0]+2+ab*2,lc[1]+2-ab],[lc[0]-2-ab*2,lc[1]+2]],'#6a1a1a');if(ab>.3){pen.poly([[lc[0]-2-ab*1.6,lc[1]-1.6],[lc[0],lc[1]-1.6-ab*.5],[lc[0],lc[1]+1.4],[lc[0]-2-ab*1.6,lc[1]+1.6]],'#f0e6cc');pen.poly([[lc[0],lc[1]-1.6-ab*.5],[lc[0]+2+ab*1.6,lc[1]-1.6-ab],[lc[0]+2+ab*1.6,lc[1]+1.6-ab],[lc[0],lc[1]+1.4]],'#f8f0dc')}}
    // cajado de madeira
    const ef=P(shF,p.aF,4.5),hf=P(ef,p.aF+p.aF2,4.5),cj=p.cj+p.giro*p.ph*1.2,s0=P(hf,cj+PI,11),s1=P(hf,cj,13);pen.line(s0[0],s0[1],s1[0],s1[1],'#7a5430',2);pen.line(s1[0],s1[1],s1[0]+1,s1[1]-1.5,'#7a5430');
    pen.line(shF[0],shF[1],ef[0],ef[1],R[2],2);pen.line(ef[0],ef[1],hf[0],hf[1],PELE2[1],2);
    pen.info.boca=lc||hf;const ph=p.ph,v=k=>p[k]||0;const pagina=v('pagina'),letras=v('letras'),luz=v('luz');
    pen.depois(pn=>{if(lc&&p.livro>.5){pn.px(lc[0],lc[1]-2.5,'#fff6c0');for(let i=0;i<2;i++){const k2=((ph*.08+i/2)%1);pn.px(lc[0]+Math.sin(ph*.3+i)*2,lc[1]-3-k2*6,'#ffe9a8')}}
      if(luz>0&&lc){for(let i=0;i<10;i++){const a=i*PI/5+ph*.05,r=3+luz*5;pn.px(lc[0]+Math.cos(a)*r,lc[1]+Math.sin(a)*r,'#fff0b0')}}
      if(pagina>0&&pagina<1&&lc){const x=lerp(lc[0],ALVO[0],pagina),y=lerp(lc[1],ALVO[1]-4,pagina)-Math.sin(pagina*PI)*8,w=1.6;pn.poly([[x-w,y-1.2],[x+w,y-1.6],[x+w,y+1.2],[x-w,y+1.4]],'#fff6dc');pn.px(x,y,'#c89a3a');for(let k=1;k<4;k++)pn.px(x-k*2,y+Math.sin(k+ph)*1,'#ffe9a8')}
      if(letras>0)for(let i=0;i<7;i++){const a=ph*.3+i*PI*2/7,x=hip[0]+Math.cos(a)*11*letras,y=hip[1]-6+Math.sin(a)*4*letras;pn.px(x,y,'#ffe9a8');pn.px(x+1,y,'#c89a3a')}})},
  A:{parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:sw(f,n,1,1)*1.2,cj:(-82+b*3)*D,ht:sw(f,n,1,2)>.85?.6:0,ph:f,aF:55*D,aF2:-145*D}}},
   mania1:{nome:'Ler os livros de Elowen',n:26,fps:10,mania:1,f:null},mania2:{nome:'Ajeitar os óculos',n:18,fps:11,mania:1,f:null},
   entrada:{nome:'Entrada',n:18,fps:12,f:null},ataque:{nome:'Luz das Páginas',n:12,fps:16,hits:[4],tiro:'faisca',f:null},especial:{nome:'A Página Arrancada',n:24,fps:13,hits:[18],f:null},
   buff:{nome:'Sabedoria Antiga',n:22,fps:11,f:null},lutando:{nome:'Lutando cercado',n:24,fps:12,loop:1,f:null},vitoria:{nome:'Vitória',n:22,fps:11,f:null},despedida:{nome:'Despedida',n:28,fps:12,f:null}}};
TOB.DEF.aF=55*D;TOB.DEF.aF2=-145*D;
{const K=TOB.DEF,A=TOB.A;
 A.mania1.f=kf(K,[[0,{}],[4,{e:'devagar',livro:1,aB:20*D,aB2:-70*D,ht:.8,hd:.6}],[20,{e:'linear',livro:1,aB:20*D,aB2:-70*D,ht:.9,hd:.6}],[22,{livro:1,aB:20*D,aB2:-70*D,ht:-.2,mo:1}],[26,{e:'devagar',livro:0}]]);
 A.mania2.f=kf(K,[[0,{}],[4,{e:'devagar',oculos:1,ht:.3}],[7,{oculos:1,ht:-.3}],[10,{e:'segura',oculos:1,ht:.2}],[18,{e:'devagar',oculos:0}]]);
 A.ataque.f=kf(K,[[0,{}],[2,{e:'rapido',livro:1,aB:-10*D,aB2:-30*D,lean:-4*D}],[4,{e:'rapido',livro:1,aB:-20*D,aB2:-10*D,lean:10*D,luz:.6}],[8,{e:'segura',livro:1,aB:-20*D,aB2:-10*D,lean:8*D}],[12,{e:'devagar',livro:0}]]);
 A.especial.f=kf(K,[[0,{}],[5,{e:'devagar',livro:1,aB:-10*D,aB2:-40*D,ht:-.6,luz:.5}],[10,{livro:1,aB:-20*D,aB2:-40*D,luz:1,ht:-.8,tremor:.4}],[12,{e:'rapido',livro:1,aB:-20*D,aB2:-10*D,lean:10*D,pagina:.05,luz:.4}],[18,{e:'linear',livro:1,aB:-20*D,aB2:-10*D,lean:8*D,pagina:.99}],[19,{pagina:0}],[24,{e:'devagar',livro:0}]]);
 A.buff.f=kf(K,[[0,{}],[5,{e:'devagar',livro:1,aB:20*D,aB2:-70*D,letras:.4}],[16,{e:'segura',livro:1,aB:20*D,aB2:-70*D,letras:1,ht:-.6,luz:.6}],[22,{e:'devagar',livro:0,letras:0,luz:0}]]);
 A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-100*D,aF2:-40*D,cj:-95*D,ht:-1,mo:1,livro:1,luz:.5}],[22,{e:'segura',aF:-100*D,aF2:-40*D,cj:-95*D,ht:-.8,mo:.5,livro:1,luz:.5}]]);
 comuns(TOB,K,{adeus:{ht:1,hd:.6,lean:16*D,aF:20*D,aF2:-60*D},guarda:{lean:6*D,aF:0,aF2:-30*D,cj:-30*D,giro:0},golpeRapido:{livro:1,luz:.6,lean:10*D}});anima(TOB)}

/* ===================== KAEL — o Mercenário (pago pelo rei do Mundo de Cima) ===================== */
const KAE={nome:'Kael',W,H,GY,semEspelho:1,DEF:def({hx:21,hy:40,lean:2*D,aF:60*D,aF2:-70*D,aB:70*D,aB2:-50*D,dF:-60*D,dB:-60*D,moeda:0,bocejo:0,brilho:0}),molas:['capa'],
  draw(pen,p){const C=['#1e1a20','#2e2830','#46404a'],M='#4a2e1a';const pp=pes(p);const q=pp?{...p,...pp}:p;const B=corpo(pen,q,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    const adaga=(h,a,c)=>{const t=P(h,a,6);pen.line(h[0],h[1],t[0],t[1],c);pen.px(t[0],t[1],'#ffffff');const g1=P(h,a+PI/2,1.2),g2=P(h,a-PI/2,1.2);pen.line(g1[0],g1[1],g2[0],g2[1],'#5c3a1e');return t};
    // capuz abaixado nas costas
    pen.poly([[neck[0]-4,neck[1]-1],[neck[0]+1,neck[1]],[hip[0]-3,hip[1]+3],[hip[0]-6-p.capa,hip[1]+6]],C[1]);
    const bb=B.braco(shB,p.aB,p.aB2,[C[1],PELE[0]],PELE[0]);if(p.bocejo<.5)adaga(bb.h,p.dB,'#8a929e');
    B.perna([hip[0]-1,hip[1]+1],q.fB,[C[0],C[0]],'#100c0a');
    pen.poly([[neck[0]-3.5,neck[1]],[neck[0]+3.5,neck[1]+.5],[hip[0]+3.5,hip[1]+3],[hip[0]-3.5,hip[1]+3]],C[2]);pen.line(neck[0]-3,neck[1]+1,hip[0]+3,hip[1]+1,M,2);pen.line(hip[0]-3.5,hip[1],hip[0]+3.5,hip[1],M,2);pen.px(hip[0]+2,hip[1]+1,'#c8a040');
    B.perna([hip[0]+1,hip[1]+1],q.fF,[C[1],C[2]],'#100c0a');
    pen.bola(head[0]+.4,head[1]+.4,3.2,3.4,PELE);pen.poly([[head[0]-3.6,head[1]+1],[head[0]-3,head[1]-3.4],[head[0]+1,head[1]-4.4],[head[0]+3.4,head[1]-2.6],[head[0]+2,head[1]-2],[head[0]+3,head[1]-1.2],[head[0]-.5,head[1]-1.8],[head[0]-2,head[1]+1.5]],'#3a2a20');
    pen.line(head[0]+.5,head[1]+.5,head[0]+1.5,head[1]+2,'#b06a5a');// cicatriz
    if(p.bocejo>.5)pen.ell(head[0]+2.2,head[1]+2,1,1.2,'#3a1a1a');else pen.line(head[0]+1.2,head[1]+2.2,head[0]+3,head[1]+1.8,'#8a4a3a');
    pen.px(head[0]+1.8,head[1]-.4,p.bocejo>.5?'#3a2a20':'#2a2a3a');
    const fe=B.braco(shF,p.aF,p.aF2,[C[2],PELE[1]],PELE[1]);const tF=adaga(fe.h,p.dF,'#a8b0bc');
    pen.info.boca=tF;const ph=p.ph,moeda=p.moeda||0,brilho=p.brilho||0,hf=fe.h;
    pen.depois(pn=>{if(moeda>0){const y=hf[1]-2-Math.sin(cl(moeda)*PI)*14,lado=Math.floor(ph/2)%2;pn.ell(hf[0]+1,y,lado?1.6:.6,1.6,brilho?'#ffe27a':'#c8a040');pn.px(hf[0]+1,y,brilho?'#ffffff':'#8a6a20')}
      if(brilho>0){pn.px(tF[0],tF[1],'#ffffff');pn.px(tF[0]+1,tF[1]-1,'#ffffff')}})},
  A:{parado:{n:20,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,lean:(2-b*3)*D,ht:sw(f,n,1,2)>.8?.6:0,ph:f,dF:(-60+sw(f,n,1)*8)*D}}},
   mania1:{nome:'Jogar a moeda',n:20,fps:12,mania:1,f:null},mania2:{nome:'Bocejar',n:22,fps:10,mania:1,f:null},
   entrada:{nome:'Entrada',n:18,fps:12,f:null},ataque:{nome:'Golpe Sujo',n:12,fps:16,hits:[4],f:null},especial:{nome:'Lâminas Gêmeas',n:22,fps:15,hits:[9],f:null},
   buff:{nome:'Preço Justo',n:20,fps:12,f:null},lutando:{nome:'Lutando cercado',n:24,fps:13,loop:1,f:null},vitoria:{nome:'Vitória',n:22,fps:11,f:null},despedida:{nome:'Despedida',n:28,fps:12,f:null}}};
{const K=KAE.DEF,A=KAE.A;
 A.mania1.f=kf(K,[[0,{}],[3,{e:'devagar',aF:10*D,aF2:-80*D,dF:-90*D}],[4,{aF:-10*D,aF2:-80*D,dF:-90*D,moeda:.05}],[13,{e:'linear',aF:-10*D,aF2:-80*D,dF:-90*D,moeda:.99,ht:-.8}],[14,{aF:10*D,aF2:-80*D,moeda:0,ht:0,mo:1}],[20,{e:'devagar'}]]);
 A.mania2.f=kf(K,[[0,{}],[5,{e:'devagar',bocejo:1,aB:-150*D,aB2:-20*D,aF:-140*D,aF2:-30*D,lean:-8*D,ht:-.8,br:1.6}],[13,{e:'segura',bocejo:1,aB:-150*D,aB2:-20*D,aF:-140*D,aF2:-30*D,lean:-8*D,ht:-.8,br:1.6}],[22,{e:'devagar',bocejo:0}]]);
 A.ataque.f=kf(K,[[0,{}],[2,{e:'rapido',hx:23,lean:10*D,aB:-20*D,aB2:-40*D,dB:-30*D}],[3,{e:'rapido',hx:20,lean:-4*D,aF:-80*D,aF2:-30*D}],[4,{e:'rapido',hx:27,lean:22*D,aF:-5*D,aF2:0,dF:0,fF:[32,GY],brilho:1}],[7,{e:'segura',hx:27,lean:22*D,aF:-5*D,aF2:0,dF:0,fF:[32,GY]}],[12,{e:'devagar'}]]);
 A.especial.f=kf(K,[[0,{}],[4,{e:'devagar',hy:44,lean:20*D}],[8,{e:'rapido',hx:46,hy:42,lean:30*D,aF:-5*D,aF2:0,dF:0,aB:10*D,aB2:0,dB:10*D,rastro:.9,rdx:-6,andar:1,passo:PI*3}],[9,{hx:48,lean:26*D,aF:20*D,aB:30*D,brilho:1,rastro:.4}],[13,{e:'segura',hx:48,lean:10*D,brilho:1}],[20,{e:'linear',hx:24,andar:1,passo:-PI*3,lean:-4*D}],[22,{e:'devagar',hx:21}]]);
 A.buff.f=kf(K,[[0,{}],[3,{e:'devagar',aF:10*D,aF2:-80*D,dF:-90*D}],[4,{aF:-10*D,aF2:-80*D,moeda:.05,brilho:1}],[12,{e:'linear',aF:-10*D,aF2:-80*D,moeda:.99,brilho:1,ht:-.6}],[13,{aF:10*D,aF2:-80*D,moeda:0,brilho:1,mo:1}],[20,{e:'devagar',brilho:0}]]);
 A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-100*D,aF2:-60*D,dF:-150*D,aB:60*D,ht:-.6,mo:1}],[10,{e:'rapido',aF:40*D,aF2:-60*D,dF:-90*D,aB:70*D,ht:.4}],[22,{e:'segura',aF:40*D,aF2:-60*D,dF:-90*D,lean:-6*D,ht:-.4,mo:1}]]);
 comuns(KAE,K,{adeus:{aF:-90*D,aF2:-100*D,dF:-140*D,ht:.4,mo:1,lean:-6*D},guarda:{lean:14*D,aF:-10*D,aF2:-30*D,dF:-20*D,aB:20*D,aB2:-30*D,dB:-10*D,fF:[27,GY],fB:[15,GY]},golpeRapido:{hx:25,lean:24*D,aF:-5*D,aF2:0,dF:0,brilho:1}});anima(KAE)}

/* ===================== IRMÃ CELESTE — a Templária (descendente de Aldric) ===================== */
const CEL={nome:'Irmã Celeste',W,H,GY,semEspelho:1,DEF:def({hx:21,hy:40,ma:-70*D,es:0,luz:0,sol:0,polir:0,ajoe:0}),molas:['capa'],
  draw(pen,p){const S=['#8a8a94','#b8bcc8','#dce0e8','#ffffff'],O=['#8a6a1a','#c8a040','#ffe27a'];const pp=pes(p);const q=pp?{...p,...pp}:p;const B=corpo(pen,q,{tronco:10,perna:6,gross:2});const{hip,neck,shF,shB,head}=B;
    // capa branca
    pen.poly([[neck[0]-3,neck[1]-1],[neck[0]+1,neck[1]],[hip[0]-2,hip[1]+5],[hip[0]-6-p.capa,GY-1],[hip[0]-9-p.capa*1.2,hip[1]+4]],'#e8e4dc');pen.line(neck[0]-3,neck[1]-1,hip[0]-9-p.capa*1.2,hip[1]+4,'#c8c4bc');
    const bb=B.braco(shB,p.aB,p.aB2,[S[1],S[1]],null);
    B.perna([hip[0]-1,hip[1]+1],q.fB,[S[0],S[0]],'#5a5a64');
    pen.poly([[neck[0]-4,neck[1]],[neck[0]+4,neck[1]+.5],[hip[0]+4,hip[1]+2],[hip[0]-4,hip[1]+2]],S[1]);pen.line(neck[0]+4,neck[1]+.5,hip[0]+4,hip[1]+2,S[3]);
    pen.poly([[neck[0]-1.5,neck[1]+2],[neck[0]+2.5,neck[1]+2],[hip[0]+2.5,hip[1]+7],[hip[0]-1.5,hip[1]+7]],'#f0ece4');pen.ell(neck[0]+.6,neck[1]+5,1.4,1.4,O[1]);pen.px(neck[0]+.6,neck[1]+5,O[2]);
    B.perna([hip[0]+1,hip[1]+1],q.fF,[S[1],S[2]],'#5a5a64');
    // véu branco, rosto sereno
    pen.bola(head[0]+.4,head[1]+.6,3,3.2,PELE);pen.poly([[head[0]-4,head[1]+4],[head[0]-3.6,head[1]-2.6],[head[0]-.5,head[1]-4.6],[head[0]+3,head[1]-3.8],[head[0]+3.4,head[1]-2],[head[0]+.5,head[1]-2.4],[head[0]-1.2,head[1]+.5],[head[0]-2,head[1]+4.6]],'#f4f0e8');pen.line(head[0]-.5,head[1]-4.6,head[0]+3,head[1]-3.8,O[1]);
    if(p.ajoe>.5)pen.line(head[0]+1,head[1]-.2,head[0]+2.4,head[1]-.2,'#8a6a5a');else{pen.px(head[0]+1.6,head[1]-.2,'#3a4a6a');pen.px(head[0]+2.4,head[1]-.2,'#ffffff')}pen.px(head[0]+2,head[1]+1.8,'#c87a70');
    // escudo com o sol do rei (mão de trás)
    const sc=[bb.h[0]+2,bb.h[1]-1],a=p.es,rot=(x,y)=>[sc[0]+x*Math.cos(a)-y*Math.sin(a),sc[1]+x*Math.sin(a)+y*Math.cos(a)];
    const sp=[rot(-4,-6),rot(4,-6),rot(4,3),rot(0,7),rot(-4,3)];pen.poly(sp,O[1]);pen.poly(sp.map(([x,y])=>[lerp(sc[0],x,.8),lerp(sc[1],y,.82)]),'#f0ece4');const sl=rot(0,-1);pen.ell(sl[0],sl[1],1.8,1.8,O[2]);
    // maça
    const fe=B.braco(shF,p.aF,p.aF2,[S[1],S[2]],null),hf=fe.h,m1=P(hf,p.ma,9);pen.line(hf[0],hf[1],m1[0],m1[1],'#8a6a3a',2);pen.ell(m1[0],m1[1],2.4,2.4,S[1]);pen.px(m1[0]-.6,m1[1]-.6,S[3]);for(let k=0;k<4;k++){const t=P(m1,k*PI/2+p.ma,3);pen.px(t[0],t[1],S[0])}
    pen.info.boca=m1;const ph=p.ph,v=k=>p[k]||0;const luz=v('luz'),sol=v('sol'),polir=v('polir');
    pen.depois(pn=>{if(luz>0){for(let i=0;i<12;i++){const k2=((ph*.05+i/12)%1),x=hip[0]-10+((i*7)%22);if(dit(x,GY-k2*30,luz*(1-k2)))pn.px(x+Math.sin(k2*5+i),GY-2-k2*30,i%2?'#fff0b0':'#ffe27a')}for(let a2=0;a2<PI*2;a2+=.2)pn.px(head[0]+Math.cos(a2)*6*luz,head[1]-2+Math.sin(a2)*2*luz,'#ffe27a')}
      if(sol>0){const c=rot(0,-1);for(let k=0;k<10;k++){const a2=k*PI/5+ph*.04,l=4+sol*8+Math.sin(ph*.5+k)*1.5;pn.line(c[0]+Math.cos(a2)*2.5,c[1]+Math.sin(a2)*2.5,c[0]+Math.cos(a2)*l,c[1]+Math.sin(a2)*l,'#ffe27a')}pn.ell(c[0],c[1],2,2,'#ffffff')}
      if(polir>0&&ph%4<2){pn.px(sp[1][0],sp[1][1]+1,'#ffffff');pn.px(sp[0][0]+1,sp[0][1],'#ffffff')}
      if(p.brilhoM){pn.ell(m1[0],m1[1],3,3,'#fff0b0')}})},
  A:{parado:{n:20,fps:9,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:sw(f,n,1,1)*1.2,ma:(-70+b*3)*D,ph:f}}},
   mania1:{nome:'Oração pelo rei',n:30,fps:10,mania:1,f:null},mania2:{nome:'Polir o escudo',n:22,fps:11,mania:1,f:null},
   entrada:{nome:'Entrada',n:18,fps:12,f:null},ataque:{nome:'Golpe da Luz',n:12,fps:16,hits:[4],f:null},especial:{nome:'Escudo do Sol',n:22,fps:12,hits:[10],f:null},
   buff:{nome:'Luz de Aldric',n:24,fps:11,f:null},lutando:{nome:'Lutando cercada',n:24,fps:12,loop:1,f:null},vitoria:{nome:'Vitória',n:22,fps:11,f:null},despedida:{nome:'Despedida',n:28,fps:12,f:null}}};
{const K=CEL.DEF,A=CEL.A,AJ={ajoe:1,hy:47,fF:[27,GY],fB:[14,GY-1],lean:6*D,ht:.8,hd:.4,aF:-40*D,aF2:-100*D,aB:50*D,aB2:-40*D,ma:60*D};
 A.mania1.f=kf(K,[[0,{}],[6,{e:'devagar',...AJ}],[10,{...AJ,luz:.4}],[22,{e:'segura',...AJ,luz:.6}],[26,{e:'devagar',luz:0}],[30,{}]]);
 A.mania2.f=kf(K,[[0,{}],[4,{e:'devagar',aF:-20*D,aF2:-90*D,ma:30*D,es:.4,ht:.6}],[8,{aF:-10*D,aF2:-80*D,ma:30*D,es:.4,polir:1}],[11,{aF:-20*D,aF2:-90*D,ma:30*D,es:.4,polir:1}],[14,{aF:-10*D,aF2:-80*D,ma:30*D,es:.4,polir:1}],[18,{e:'segura',es:.2,polir:1,ht:-.3}],[22,{e:'devagar',polir:0}]]);
 A.ataque.f=kf(K,[[0,{}],[2,{e:'rapido',hx:19,lean:-8*D,aF:-150*D,aF2:-20*D,ma:-190*D}],[4,{e:'rapido',hx:25,lean:20*D,aF:30*D,aF2:10*D,ma:40*D,fF:[30,GY],brilhoM:1,flash:.3}],[8,{e:'segura',hx:25,lean:20*D,aF:30*D,ma:40*D,fF:[30,GY]}],[12,{e:'devagar'}]]);
 A.especial.f=kf(K,[[0,{}],[5,{e:'devagar',aB:-30*D,aB2:-40*D,es:-.2,ht:-.6}],[10,{e:'rapido',aB:-40*D,aB2:-30*D,es:-.3,sol:1,flash:.5}],[17,{e:'segura',aB:-40*D,aB2:-30*D,es:-.3,sol:1}],[22,{e:'devagar',sol:0}]]);
 A.buff.f=kf(K,[[0,{}],[5,{e:'devagar',ht:-1,aF:-110*D,aF2:-40*D,ma:-95*D,luz:.4}],[14,{e:'segura',ht:-1,aF:-110*D,aF2:-40*D,ma:-95*D,luz:1,brilhoM:1}],[24,{e:'devagar',luz:0}]]);
 A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',aF:-120*D,aF2:-40*D,ma:-95*D,ht:-1,luz:.6}],[22,{e:'segura',aF:-120*D,aF2:-40*D,ma:-95*D,ht:-.8,luz:.6}]]);
 comuns(CEL,K,{adeus:{ht:1,hd:.6,lean:14*D,aF:-80*D,aF2:-90*D,ma:-150*D},guarda:{lean:8*D,aF:-30*D,aF2:-50*D,ma:-100*D,es:-.15,fF:[26,GY],fB:[15,GY]},golpeRapido:{hx:24,lean:20*D,aF:30*D,aF2:10*D,ma:40*D,brilhoM:1}});anima(CEL)}

window.ALIADOS={aldo:ALDO,mira:MIRA,bruna:BRU,tobias:TOB,kael:KAE,celeste:CEL};
for(const k in ALIADOS)BICHOS['a_'+k]=ALIADOS[k];
})();
