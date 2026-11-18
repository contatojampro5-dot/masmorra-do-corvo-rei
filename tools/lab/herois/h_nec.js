/* NECROMANTE — sangue de Elowen (nome): a família perde um pouco do nome a cada geração; ele não lembra o dele (lore).
   Ergue Servos com as criaturas que derrotou. O parâmetro "ergue" (0..1) diz quando a criatura derrotada levanta:
   quem desenha a criatura é a arena/jogo (com a queda dela tocando ao contrário, verde e com olhos acesos). */
(function(){
const {P,lerp,kf,sw,olhoX,D,PI}=BICHO.util;const {W,H,GY,ALVO,cl,dit,PELE,DEFB,corpo,anima}=HB;
const FOI=[{n:'Foice de Osso',s:['#d8d0bc','#9a927c'],b:['#e8e0cc','#a8a08a'],cor:'#7aff9a'},{n:'Foice Sombria',s:['#2a2430','#141018'],b:['#3a3444','#1c1822'],cor:'#7aff9a'},
  {n:'Foice das Almas',s:['#2a2430','#141018'],b:['#3a3444','#1c1822'],cor:'#7aff9a',almas:1},{n:'Foice do Lich',s:['#1a1020','#0c0810'],b:['#4a1a6a','#2a0a3a'],cor:'#7aff9a',caveira:1,fogo:1},
  {n:'Foice de Sangue',s:['#2a1418','#14080a'],b:['#5a1018','#2a060a'],cor:'#ff4a5a',sangue:1},{n:'Foice do Vampiro',s:['#1a0a0e','#0a0406'],b:['#8a0a1a','#4a0410'],cor:'#ff4a5a',asas:1}];
const SERVO_X=48;
function miniEsq(pn,x,t,cor){if(t<=0)return;const y0=GY-2+(1-Math.min(1,t))*11,px=(a,b,c)=>{if(b<=GY)pn.px(a,b,c)},ln=(a,b,c2,d,c)=>{const n=Math.max(Math.abs(c2-a),Math.abs(d-b),1);for(let i=0;i<=n;i++)px(a+(c2-a)*i/n,b+(d-b)*i/n,c)};
  for(let dy=-2;dy<=1;dy++)for(let dx=-2;dx<=2;dx++)if(dx*dx/4+dy*dy/2.6<=1)px(x+dx,y0-6+dy,'#e8e0c8');px(x+.6,y0-6.2,cor);px(x+1.6,y0-6.2,cor);
  ln(x,y0-4.5,x,y0-1,'#c8c0aa');ln(x-1.5,y0-3.5,x+1.5,y0-3.5,'#c8c0aa');ln(x-1.5,y0-2.5,x+1.5,y0-2.5,'#c8c0aa');ln(x,y0-1,x-1.5,y0+2,'#c8c0aa');ln(x,y0-1,x+1.5,y0+2,'#c8c0aa');ln(x+1,y0-4,x+3,y0-6.5,'#c8c0aa');ln(x-1,y0-4,x-2.5,y0-1.5,'#c8c0aa')}
const NEC={nome:'Necromante',W,H,GY,semEspelho:1,armas:FOI.map(a=>a.n),servoX:SERVO_X,
  DEF:{...DEFB,fz:-70*D,maos:0,veu:0,aura:0,tr:0,almaV:0,ergue:0,circulo:0,nome:0,afiar:0,caveira:0,cavBoca:0,exerc:0,expl:0,sigilo:0,girar:0,nevoa:0},molas:['capa'],
  draw(pen,p){const R=['#160a20','#2a1440','#44245e','#5e3a7e'],A=FOI[p.arma|0];
    const B=corpo(pen,p,{tronco:10,perna:6});const{hip,neck,shF,shB,head}=B;
    const bB=B.braco(shB,p.aB,p.aB2,[R[0],R[0]],'#b8b8c8');
    const hem=GY,w1=7+p.capa*.3,pts=[[neck[0]-4,neck[1]],[neck[0]+4,neck[1]+.5],[hip[0]+w1,hem-1]];for(let i=0;i<=7;i++){const t=i/7;pts.push([lerp(hip[0]+w1,hip[0]-w1-2,t),hem-1-((i%2)?2.2+Math.sin(p.ph*.6+i)*.8:0)])}pts.push([hip[0]-w1-2,hem-3]);
    pen.poly(pts,R[1]);pen.line(neck[0]+4,neck[1]+.5,hip[0]+w1,hem-1,R[2]);pen.line(neck[0]+.5,neck[1]+1,hip[0]+1,hem-2,R[0]);pen.line(hip[0]-4,hip[1],hip[0]+4.5,hip[1],'#1a0a14',2);pen.px(hip[0]+1,hip[1],A.cor);
    pen.poly([[head[0]-4.5,head[1]+3.5],[head[0]-4.5,head[1]-1.5],[head[0]-2,head[1]-5],[head[0]-4,head[1]-7],[head[0]+1.5,head[1]-5.2],[head[0]+4,head[1]-2],[head[0]+4.5,head[1]+3.5]],R[1]);pen.line(head[0]-2,head[1]-5,head[0]+4,head[1]-2,R[3]);
    pen.ell(head[0]+1.6,head[1]+.5,2.6,3,'#a8a8b8');pen.ell(head[0]+1.8,head[1],1.8,2.2,'#c8c8d4');pen.px(head[0]+2,head[1]+2.2,'#6a6a7a');
    if(p.dead>.5)olhoX(pen,Math.round(head[0]+2),Math.round(head[1]-.4),'#3a3a4a');
    // na mão de trás: o pergaminho do nome, a pedra de afiar ou a caveira
    if(p.nome>0){const c=[bB.h[0]+3,bB.h[1]-2],w=1+p.nome*4;pen.poly([[c[0]-w,c[1]-3],[c[0]+w,c[1]-3],[c[0]+w,c[1]+3],[c[0]-w,c[1]+3]],'#e8dcc0');pen.line(c[0]-w,c[1]-3,c[0]-w,c[1]+3,'#a8986a',2);pen.line(c[0]+w,c[1]-3,c[0]+w,c[1]+3,'#a8986a',2)}
    if(p.caveira>0){const c=[bB.h[0]+2,bB.h[1]-3];pen.ell(c[0],c[1],2.4,2.2,'#e8e0c8');pen.px(c[0]+.6,c[1]-.3,'#1a1a1a');pen.px(c[0]+1.8,c[1]-.3,'#1a1a1a');pen.line(c[0]-.5,c[1]+2+p.cavBoca,c[0]+2,c[1]+2+p.cavBoca,'#c8c0aa')}
    // foice (pode girar: ceifar)
    const ef=P(shF,p.aF,4.5),hf=P(ef,p.aF+p.aF2,4.5),fz=p.fz+p.girar*PI*2,s0=P(hf,fz+PI,9),s1=P(hf,fz,14);
    pen.line(s0[0],s0[1],s1[0],s1[1],A.s[0],2);pen.line(s0[0],s0[1],s1[0],s1[1],A.s[1]);
    const lam=[];for(let i=0;i<=8;i++){const t=i/8,a=fz+PI/2+t*1.9,r=2+t*9,q=P(s1,a-.2,r);q[1]+=Math.sin(t*PI)*-2;lam.push(q)}
    for(let i=0;i<lam.length-1;i++)pen.line(lam[i][0],lam[i][1],lam[i+1][0],lam[i+1][1],A.b[0],i<6?2:1);pen.line(lam[0][0],lam[0][1],lam[8][0],lam[8][1],A.b[1]);
    if(A.caveira){pen.ell(s1[0],s1[1]-1.5,2,1.8,'#e8e0c8');pen.px(s1[0]-.6,s1[1]-1.6,'#1a1a1a');pen.px(s1[0]+.8,s1[1]-1.6,'#1a1a1a')}
    if(A.asas)for(const sd of [-1,1]){const b=P(s1,fz+PI,1),t=P(b,fz+PI+sd*1.2,5);pen.line(b[0],b[1],t[0],t[1],'#3a0a14',2);pen.px(t[0],t[1],'#5a1420')}
    pen.line(shF[0],shF[1],ef[0],ef[1],R[2],2);pen.line(ef[0],ef[1],hf[0],hf[1],'#b8b8c8',2);
    pen.info.boca=hf;
    const ph=p.ph,v=k=>p[k]||0,dead=p.dead;const maos=v('maos'),veu=v('veu'),aura=v('aura'),tr=v('tr'),almaV=v('almaV'),circulo=v('circulo'),nome=v('nome'),afiar=v('afiar'),exerc=v('exerc'),expl=v('expl'),sigilo=v('sigilo'),girar=v('girar'),nevoa=v('nevoa'),ergue=v('ergue');
    pen.depois(pn=>{
      if(dead<.5){pn.px(head[0]+1.4,head[1]-.4,A.cor);pn.px(head[0]+2.6,head[1]-.4,A.cor);if(aura>.6||ergue>0){pn.px(head[0]+3.4,head[1]-.8,A.cor);pn.px(head[0]+4.2,head[1]-1.2,A.cor)}}
      const na=2+Math.round(aura*4);for(let i=0;i<na;i++){const a=ph*.25+i*PI*2/na,r=9+aura*3,x=hip[0]+Math.cos(a)*r,y=hip[1]-6+Math.sin(a)*r*.4;pn.px(x,y,A.cor);if(aura>.3)pn.px(x,y-1,'#ffffff')}
      if(A.almas||A.fogo)lam.forEach((q,i)=>{if(i%2===0)pn.px(q[0],q[1],A.fogo&&(ph+i)%3===0?'#d8ffe0':A.cor)});
      if(A.fogo)for(let i=0;i<5;i++){const q=lam[i+2],k=((ph*.08+i/5)%1);pn.px(q[0],q[1]-1-k*4,k<.5?'#5aff7a':'#2aa04a')}
      if(A.caveira){pn.px(s1[0]-.6,s1[1]-1.6,'#5aff8a');pn.px(s1[0]+.8,s1[1]-1.6,'#5aff8a')}
      if(A.sangue){lam.forEach((q,i)=>{if(i%2)pn.px(q[0],q[1],'#ff3a4a')});for(let i=0;i<2;i++){const q=lam[3+i*3],k=((ph*.07+i/2)%1);pn.px(q[0],q[1]+1+k*6,'#c0101a')}}
      if(A.asas){const e=P(s1,fz+PI,1);pn.px(e[0],e[1],'#ff2a3a')}
      // pergaminho do nome: as letras somem uma a uma (ele não lembra o próprio nome)
      if(nome>.3){const c=[bB.h[0]+3,bB.h[1]-2];for(let i=0;i<5;i++){const fade=cl((nome-.4)*2.5-i*.3);if(fade<1)pn.px(c[0]-2+i,c[1]-1+(i%2),'#3a2a1a');}for(let i=0;i<4;i++)pn.px(c[0]-2+i,c[1]+1.5,'#5a4a2a')}
      if(afiar>0&&(ph%3)<2){const q=lam[5];for(let i=0;i<4;i++)pn.px(q[0]+(i-1.5)*1.2,q[1]-1-Math.random()*2,i%2?'#ffffff':A.cor)}
      if(tr){for(let a=tr;Math.abs(a-tr)<Math.abs(fz-tr);a+=Math.sign(fz-tr)*.06){for(let r=10;r<=15;r+=2){const q=P(hf,a+.6,r);pn.px(q[0],q[1],A.cor)}}}
      if(girar>0&&girar<1){for(let a=0;a<PI*2*girar;a+=.08){const q=P(hf,p.fz+a+.6,14);pn.px(q[0],q[1],A.cor);pn.px(q[0],q[1]+1,'#ffffff')}}
      if(maos>0){for(let i=0;i<3;i++){const x=ALVO[0]-8+i*6,h2=maos*(5+i%2*2);pn.line(x,GY,x,GY-h2,'#c8c0aa');for(let k=-1;k<=1;k++)pn.line(x,GY-h2,x+k*1.2,GY-h2-2,'#e8e0c8');pn.px(x-1,GY-1,A.cor);pn.px(x+1,GY,A.cor)}}
      // círculo do ritual onde a criatura derrotada levanta
      if(circulo>0){const c=[SERVO_X,GY+.5],r=14*circulo;for(let a=0;a<PI*2;a+=.07)pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*.22,A.cor);for(let i=0;i<8;i++){const a=ph*.25+i*PI/4;pn.px(c[0]+Math.cos(a)*r*.7,c[1]+Math.sin(a)*r*.15,'#ffffff')}
        for(let i=0;i<8;i++){const k=((ph*.06+i/8)%1);if(dit(c[0]-12+i*3.4,GY-k*24,1-k))pn.px(c[0]-12+i*3.4+Math.sin(k*6+i)*1.5,GY-1-k*24*circulo,A.cor)}
        if(ergue>0&&ergue<1){const hh=ergue*26;for(let x=c[0]-10;x<=c[0]+10;x+=2)if(dit(x,GY-hh,.6))pn.px(x,GY-hh+Math.sin(x+ph)*2,'#ffffff')}}
      if(exerc>0)for(let i=0;i<4;i++){const t=cl(exerc*1.6-i*.15);miniEsq(pn,40+i*7,t,A.cor);if(t>0&&t<1)for(let k=0;k<3;k++)pn.px(40+i*7+(k-1)*2,GY-1,'#3a2a1e')}
      if(expl>0&&expl<1){const r=3+expl*12;for(let a=0;a<PI*2;a+=.12){pn.px(ALVO[0]+Math.cos(a)*r,ALVO[1]+Math.sin(a)*r*.85,expl<.5?'#d8ffe0':A.cor)}for(let i=0;i<10;i++){const a=i*PI/5,rr=r*.6;pn.line(ALVO[0],ALVO[1],ALVO[0]+Math.cos(a)*rr,ALVO[1]+Math.sin(a)*rr,A.cor)}pn.ell(ALVO[0],ALVO[1],(1-expl)*5,(1-expl)*5,'#ffffff')}
      if(sigilo>0){const c=[ALVO[0],ALVO[1]-4],r=7*sigilo;for(let a=0;a<PI*2;a+=.12)pn.px(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,A.cor);for(let i=0;i<5;i++){const a=-PI/2+ph*.1+i*PI*4/5,b=-PI/2+ph*.1+(i+1)*PI*4/5;pn.line(c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,c[0]+Math.cos(b)*r,c[1]+Math.sin(b)*r,'#c8ffd8')}}
      if(veu>0){for(let y=hip[1]-22;y<=GY;y++)for(let x=hip[0]-10;x<=hip[0]+10;x++){const d=Math.hypot((x-hip[0])/10,(y-(hip[1]-6))/16);if(d<1&&dit(x+ph,y,veu*.45*(1-d*.6)))pn.px(x,y,'#1a0a2a')}for(let a=0;a<PI*2;a+=.2)pn.px(hip[0]+Math.cos(a)*10*veu,hip[1]-6+Math.sin(a)*16*veu,A.cor)}
      if(nevoa>0)for(let i=0;i<30;i++){const a=ph*.2+i*.7,r=(4+(i%6)*2)*(.5+nevoa),x=hip[0]+Math.cos(a)*r,y=hip[1]-4+Math.sin(a)*r*.8-(i%4)*2;if(dit(x,y,nevoa*.8))pn.px(x,y,i%3?'#3a1a4a':A.cor)}
      if(almaV>0){const x=lerp(ALVO[0],hip[0],almaV),y=lerp(ALVO[1],hip[1]-6,almaV)+Math.sin(almaV*9)*3;pn.ell(x,y,1.6,1.6,A.cor);pn.px(x,y,'#ffffff');for(let k=1;k<4;k++)pn.px(x+k*2,y+Math.sin(almaV*9+k)*1.5,A.cor)}})},
  A:{
   parado:{n:20,fps:10,loop:1,f:(f,n)=>{const b=(sw(f,n,1)+1)/2;return{hy:40+(b>.6?1:0),br:b,capa:sw(f,n,1,1)*1.3,fz:(-70+b*4)*D,ht:sw(f,n,1,2)>.85?.6:0,ph:f,aura:.2}}},
   mania1:{nome:'O meu nome',n:32,fps:10,mania:1,f:null},mania2:{nome:'Afiar a foice',n:24,fps:12,mania:1,f:null},mania3:{nome:'Conversar com a caveira',n:28,fps:11,mania:1,f:null},
   entrada:{nome:'Entrada (sobe da névoa)',n:22,fps:12,f:null},
   ataque:{nome:'Toque Sombrio',n:18,fps:14,hits:[9],f:null},
   ceifar:{nome:'Ceifar',n:22,fps:15,hits:[10],f:null},
   erguer:{nome:'Erguer Morto',n:40,fps:12,ergue:1,f:null},
   exercito:{nome:'Exército de Ossos',n:30,fps:12,f:null},
   drenar:{nome:'Drenar Alma',n:22,fps:12,hits:[8],f:null},
   explosao:{nome:'Explosão Sombria',n:24,fps:13,hits:[14],f:null},
   maldicao:{nome:'Maldição',n:22,fps:12,f:null},
   defesa:{nome:'Véu',n:18,fps:12,f:null},
   nevoa:{nome:'Passo de Névoa',n:18,fps:13,f:null},
   ferido:{n:8,fps:14,f:null},ferido2:{nome:'Derrubada',n:18,fps:13,f:null},
   vitoria:{nome:'Vitória: o vencido se ergue',n:44,fps:12,ergue:1,f:null},morte:{n:26,fps:11,f:null}}};
const K=NEC.DEF,A=NEC.A,ERG={aB:-100*D,aB2:-30*D,aF:-80*D,aF2:-40*D,fz:-100*D,ht:-1};
A.mania1.f=kf(K,[[0,{}],[4,{e:'devagar',aB:10*D,aB2:-70*D,nome:.3,ht:.7,hd:.5}],[8,{aB:10*D,aB2:-70*D,nome:1,ht:.8,hd:.6}],[24,{e:'linear',aB:10*D,aB2:-70*D,nome:1.8,ht:.9,hd:.6}],[27,{e:'segura',aB:10*D,aB2:-70*D,nome:1.8,ht:-.4,aura:.6}],[32,{e:'devagar',nome:0}]]);
A.mania2.f=kf(K,[[0,{}],[4,{e:'devagar',aF:30*D,aF2:-60*D,fz:-10*D,aB:10*D,aB2:-30*D}],[6,{aF:30*D,aF2:-60*D,fz:-10*D,aB:-10*D,aB2:-20*D,afiar:1}],[8,{aF:30*D,aF2:-60*D,fz:-10*D,aB:20*D,aB2:-30*D,afiar:1}],[10,{aF:30*D,aF2:-60*D,fz:-10*D,aB:-10*D,aB2:-20*D,afiar:1}],[12,{aF:30*D,aF2:-60*D,fz:-10*D,aB:20*D,aB2:-30*D,afiar:1}],[14,{aF:30*D,aF2:-60*D,fz:-10*D,aB:-10*D,aB2:-20*D,afiar:1}],[18,{e:'devagar',afiar:0,ht:-.5}],[24,{e:'devagar'}]]);
A.mania3.f=kf(K,[[0,{}],[4,{e:'devagar',aB:-10*D,aB2:-80*D,caveira:1,ht:.5}],[8,{aB:-10*D,aB2:-80*D,caveira:1,cavBoca:1,ht:.6}],[9,{aB:-10*D,aB2:-80*D,caveira:1,cavBoca:0}],[10,{aB:-10*D,aB2:-80*D,caveira:1,cavBoca:1}],[11,{aB:-10*D,aB2:-80*D,caveira:1,cavBoca:0,ht:.2}],[16,{aB:-10*D,aB2:-80*D,caveira:1,ht:.9,hd:.6}],[18,{aB:-10*D,aB2:-80*D,caveira:1,ht:.9,hd:.2}],[20,{aB:-10*D,aB2:-80*D,caveira:1,ht:.9,hd:.6}],[24,{e:'segura',aB:-10*D,aB2:-80*D,caveira:1,ht:.4}],[28,{e:'devagar',caveira:0}]]);
A.entrada.f=kf(K,[[0,{al:0,nevoa:1.2,hy:52}],[8,{e:'devagar',al:.4,nevoa:1.2,hy:48}],[16,{e:'devagar',al:1,nevoa:.6,hy:40,ht:-1,aura:1}],[22,{e:'devagar',nevoa:0,aura:.2}]]);
A.ataque.f=kf(K,[[0,{}],[5,{e:'devagar',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,fz:-190*D,aura:.6}],[7,{e:'segura',hx:18,lean:-10*D,aF:-150*D,aF2:-20*D,fz:-190*D,aura:.8}],
  [8,{e:'rapido',hx:25,lean:20*D,aF:-30*D,aF2:0,fz:-60*D,tr:-190*D,fF:[30,GY],fB:[17,GY],capa:4}],[9,{e:'rapido',hx:26,lean:24*D,aF:30*D,aF2:10*D,fz:20*D,tr:-120*D,fF:[30,GY],fB:[17,GY],capa:5}],[12,{e:'segura',hx:26,lean:24*D,aF:30*D,aF2:10*D,fz:20*D,fF:[30,GY],fB:[17,GY]}],[18,{e:'devagar'}]]);
A.ceifar.f=kf(K,[[0,{}],[4,{e:'devagar',hx:24,lean:12*D,aF:0,aF2:-20*D,fF:[29,GY],fB:[18,GY]}],[12,{e:'linear',hx:30,lean:14*D,aF:0,aF2:-20*D,girar:.99,fF:[34,GY],fB:[23,GY],capa:5,aura:1,flash:.3}],[13,{hx:30,girar:0,aF:20*D,fz:10*D}],[18,{e:'segura',hx:30,aF:20*D,fz:10*D,fF:[34,GY],fB:[23,GY]}],[22,{e:'devagar'}]]);
A.erguer.f=kf(K,[[0,{}],[5,{e:'devagar',...ERG,aura:.8,lean:-6*D}],[9,{...ERG,aura:1,circulo:1}],[12,{...ERG,aura:1,circulo:1,ergue:.02,tremor:.4}],[30,{e:'devagar',...ERG,aura:1.2,circulo:1,ergue:1,ht:-1.2,mo:1,tremor:.4}],[34,{e:'segura',...ERG,circulo:.6,ergue:1}],[40,{e:'devagar',circulo:0,ergue:1,aura:.4}]]);
A.exercito.f=kf(K,[[0,{}],[5,{e:'devagar',...ERG,aura:1}],[8,{...ERG,aura:1,maos:.5}],[22,{e:'devagar',...ERG,aura:1.2,maos:0,exerc:1,mo:1}],[26,{e:'segura',...ERG,exerc:1}],[30,{e:'devagar',exerc:0}]]);
A.drenar.f=kf(K,[[0,{}],[4,{e:'devagar',aB:-10*D,aB2:-20*D,lean:6*D,aura:.6}],[6,{aB:-15*D,aB2:-20*D,lean:8*D,almaV:.05,aura:.8}],[14,{e:'linear',aB:-15*D,aB2:-20*D,lean:8*D,almaV:.99,aura:1,ht:-.6}],[16,{almaV:0,aura:1.2,ht:-1}],[22,{e:'devagar'}]]);
A.explosao.f=kf(K,[[0,{}],[5,{e:'devagar',aB:-30*D,aB2:-40*D,aura:1,sigilo:.3}],[11,{e:'segura',aB:-30*D,aB2:-40*D,aura:1.2,sigilo:1}],[13,{e:'rapido',aB:-5*D,aB2:0,lean:12*D,sigilo:0,expl:.05,flash:.6}],[20,{e:'linear',aB:-5*D,expl:.95,tremor:.6}],[21,{expl:0}],[24,{e:'devagar'}]]);
A.maldicao.f=kf(K,[[0,{}],[5,{e:'devagar',aB:-60*D,aB2:-40*D,ht:-.6,aura:.8,sigilo:.3}],[12,{e:'devagar',aB:-60*D,aB2:-40*D,ht:-.6,aura:1,sigilo:1,mo:1}],[18,{e:'segura',aB:-60*D,aB2:-40*D,sigilo:1}],[22,{e:'devagar',sigilo:0}]]);
A.defesa.f=kf(K,[[0,{}],[5,{e:'devagar',aB:-40*D,aB2:-90*D,veu:.4,al:.8,lean:-4*D}],[9,{aB:-40*D,aB2:-90*D,veu:1,al:.55}],[14,{e:'segura',aB:-40*D,aB2:-90*D,veu:1,al:.55}],[18,{e:'devagar',veu:0,al:1}]]);
A.nevoa.f=kf(K,[[0,{}],[3,{e:'devagar',nevoa:.8}],[5,{e:'rapido',nevoa:1.2,al:0}],[10,{nevoa:1.2,al:0,hx:12}],[12,{e:'rapido',nevoa:.8,al:1,hx:12}],[18,{e:'devagar',nevoa:0,hx:21}]]);
A.ferido.f=kf(K,[[0,{}],[1,{e:'rapido',hx:18,lean:-16*D,ht:-1,capa:-3,fz:-40*D,al:.8}],[3,{hx:18,lean:-8*D,al:1}],[8,{}]]);
A.ferido2.f=kf(K,[[0,{}],[2,{e:'rapido',hx:15,lean:-30*D,ht:-1,capa:-4,al:.6,nevoa:.6}],[8,{e:'segura',hx:15,lean:-26*D,al:.6,nevoa:.8}],[12,{e:'rapido',hx:20,lean:4*D,al:1,nevoa:.3}],[18,{e:'devagar',nevoa:0}]]);
A.vitoria.f=kf(K,[[0,{}],[5,{e:'devagar',...ERG,aura:.8,lean:-6*D}],[9,{...ERG,aura:1,circulo:1}],[12,{...ERG,aura:1,circulo:1,ergue:.02,tremor:.4}],[30,{e:'devagar',...ERG,aura:1.2,circulo:1,ergue:1,ht:-1.2,mo:1,tremor:.4}],[36,{e:'devagar',aF:10*D,aF2:-60*D,fz:-80*D,aB:60*D,ht:.6,circulo:.4,ergue:1,aura:.8}],[44,{e:'segura',aF:10*D,aF2:-60*D,fz:-80*D,aB:60*D,ht:.4,circulo:0,ergue:1,aura:.6}]]);
A.morte.f=kf(K,[[0,{}],[2,{e:'rapido',hx:18,lean:-18*D,ht:-1,fz:-40*D,aura:1}],[8,{e:'devagar',hx:20,hy:48,lean:30*D,ht:1.4,fF:[26,GY],fB:[15,GY-.5],fz:20*D,aF:80*D,aura:1.2}],[14,{e:'rapido',hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],fz:40*D,aF:100*D,dead:1,aura:1,al:.7,nevoa:.6}],[26,{e:'devagar',hx:21,hy:52,lean:55*D,ht:1.6,fF:[27,GY],fB:[14,GY],fz:40*D,aF:100*D,dead:1,aura:.4,al:.35,nevoa:.8}]]);
anima(NEC);
HEROIS.nec=NEC;BICHOS.h_nec=NEC;
})();
