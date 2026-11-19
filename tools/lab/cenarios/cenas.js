/* ===== Cenários vivos: a cena própria de cada lugar (v2.38) =====
   Coordenadas no tamanho do cenário (320x180, chão em y=142). Cada função recebe U (ajudantes) e desenha
   por cima da imagem pronta, a cada quadro: bandeiras balançando, lanternas no vento, cascatas, rios correndo,
   círculos mágicos girando, olhos que se abrem no escuro, relâmpagos, bichos passando... */
(function(){
const PI=Math.PI,sin=Math.sin,cos=Math.cos;
/* ---- peças que várias cenas usam ---- */
function bandeira(U,X,Y,w,h,c1,c2,fase,emb){const{P,t}=U;for(let i=0;i<w;i++){const o=sin(t*.0035+fase-i*.42)*(i+1)/w*2.6,d=cos(t*.0035+fase-i*.42);const c=d>.35?c2:d<-.35?U.sh(c1,.7):c1;
  P(c,X+i,Y+o*.4,1,h+o);if((i+Math.round(t*.002))%3===0)P(U.sh(c1,.55),X+i,Y+h+o*1.2,1,2)}
  if(emb){const o=sin(t*.0035+fase-w*.21)*1.3;emb(X+w/2,Y+h*.42+o*.4)}}
function lanterna(U,X,Y,L,fase,cor='#ffd27a',luz='rgb(255,170,80)',forte=1){const{P,t,B}=U,a=sin(t*.0016+fase)*.32+sin(t*.0041+fase)*.06,ex=X+sin(a)*L,ey=Y+cos(a)*L;
  U.linha('#3a3440',X,Y,ex,ey);P('#2a2228',ex-2,ey,5,6);P(cor,ex-1,ey+1,3,4);P('#fff6d8',ex,ey+2);B(ex,ey+3,30*forte,luz,.32*forte+U.fl(fase)*.08);B(ex,ey+3,8,luz,.6)}
function cascata(U,X,Y0,Y1,w,cs,vel=.09){const{P,t}=U;for(let y=Y0;y<Y1;y++)for(let j=0;j<w;j++){const k=((y-t*vel+j*5+sin(y*.3+j)*2)%9+9)%9;P(k<2?cs[2]:k<5?cs[1]:cs[0],X+j+Math.round(sin(y*.2+t*.004)*.6),y)}
  for(let j=-2;j<w+2;j+=2)if(sin(t*.02+j)>.2)P(cs[2],X+j,Y1-1-Math.abs(sin(t*.013+j))*3)}
function rio(U,Y0,Y1,cs,vel=.03,x0=0,x1=320){const{P,t}=U;for(let y=Y0;y<Y1;y+=2){const v=vel*(1+(y-Y0)/(Y1-Y0)),fase=(y*13)%40;for(let x=x0;x<x1;x+=1){const k=((x-t*v+fase+sin(y*.7+x*.05)*6)%34+34)%34;if(k<3)P(cs[k<1?2:1],x,y+Math.round(sin(x*.08+t*.003)*.6))}}}
function circulo(U,cx,cy,rx,ry,cor,fase=0,n=28){const{P,t,B}=U,gi=t*.0006+fase;for(let i=0;i<n;i++){const a=gi+i*PI*2/n,x=cx+cos(a)*rx,y=cy+sin(a)*ry,on=sin(t*.004-i*.6)>-.2;if(on){P(cor,x,y,i%4?1:2,1)}}
  for(let i=0;i<6;i++){const a=-gi*1.6+i*PI/3,x=cx+cos(a)*rx*.62,y=cy+sin(a)*ry*.62;P(cor,x-1,y,3,1);P(cor,x,y-1)}B(cx,cy,rx*.9,U.rgb(cor),.12+sin(t*.003)*.06)}
function feixe(U,x0,x1,xb0,xb1,y0,y1,cor,fase=0){const{g,t,sx}=U,o=sin(t*.0008+fase)*6;g.fillStyle=cor;g.globalAlpha=.11+sin(t*.0013+fase)*.04;g.beginPath();g.moveTo(x0*sx,y0*sx);g.lineTo(x1*sx,y0*sx);g.lineTo((xb1+o)*sx,y1*sx);g.lineTo((xb0+o)*sx,y1*sx);g.fill();g.globalAlpha=1;
  const st=U.st('feixe'+fase,()=>Array.from({length:26},()=>({u:Math.random(),v:Math.random(),ph:Math.random()*7})));for(const m of st){m.v+=.0012*U.k;m.ph+=.03*U.k;if(m.v>1)m.v=0;const yy=y0+m.v*(y1-y0),a=x0+(xb0+o-x0)*m.v,b=x1+(xb1+o-x1)*m.v,xx=a+(b-a)*(m.u+sin(m.ph)*.04);if(sin(m.ph*1.7)>-.3)U.P('rgba(255,245,220,.75)',xx,yy)}}
function olhoGrande(U,cx,cy,r,cor,fase,abre){const{P,B}=U;if(abre<=.05)return;const h=Math.max(1,Math.round(r*.55*abre));for(let dx=-r;dx<=r;dx++){const hh=Math.round(h*Math.sqrt(1-(dx/r)**2));P(cor,cx+dx,cy-hh,1,hh*2+1)}
  P('#000000',cx-1,cy-h+1,2,Math.max(1,h*2-1));P('#fff6c0',cx-r*.5,cy-h*.5);B(cx,cy,r*3,U.rgb(cor),.25*abre)}
function revoada(U,nome,cor,n,chance,yMax=60){yMax=Math.min(yMax,40);const{P,k}=U;const s=U.st(nome,()=>({b:null}));if(!s.b&&Math.random()<chance*k){const dir=Math.random()<.5?1:-1;s.b=Array.from({length:n},(_,i)=>({x:dir>0?-10-i*9-Math.random()*8:330+i*9+Math.random()*8,y:U.y0+6+Math.random()*yMax,ph:Math.random()*6,v:(1.2+Math.random()*.7)*dir}))}
  if(!s.b)return;let vivo=0;for(const b of s.b){b.x+=b.v*k;b.ph+=.55*k;b.y+=sin(b.ph*.25)*.35*k;if(b.x>-20&&b.x<340)vivo=1;const a=sin(b.ph)>0?-1:1;P(cor,b.x,b.y,2,1);P(cor,b.x-2,b.y+a);P(cor,b.x+3,b.y+a);P(cor,b.x-3,b.y+a*2);P(cor,b.x+4,b.y+a*2)}if(!vivo&&(s.b[0].x>340||s.b[0].x<-20))s.b=null}
function particulas(U,nome,fonte,n,cor,vida=.012,vy=-.3,brilho){const{P,k,B}=U;const s=U.st(nome,()=>[]);for(let i=0;i<n*k;i++)if(Math.random()<.5){const f=fonte();s.push({x:f[0],y:f[1],vx:(Math.random()-.5)*.25,vy:vy*(.6+Math.random()*.8),l:1})}
  for(let i=s.length-1;i>=0;i--){const p=s[i];p.x+=(p.vx+sin((U.t+i*60)*.003)*.1)*k;p.y+=p.vy*k;p.l-=vida*k;if(p.l<=0){s.splice(i,1);continue}if(Math.random()<p.l+.3){P(typeof cor==='function'?cor(p):cor,p.x,p.y);if(brilho)B(p.x,p.y,3,brilho,p.l*.35)}}if(s.length>400)s.splice(0,s.length-400)}
function relampago(U,chance=.002){const{g,P,k,t}=U;const s=U.st('raio',()=>({f:0,pts:null}));if(!s.f&&Math.random()<chance*k){s.f=1;let x=60+Math.random()*200,y=0;s.pts=[];while(y<110){s.pts.push([x,y]);x+=(Math.random()-.5)*14;y+=6+Math.random()*8}}
  if(s.f>0){const a=s.f;g.fillStyle=`rgba(210,220,255,${a*.55})`;g.fillRect(0,0,160,90);if(s.f>.6)for(let i=1;i<s.pts.length;i++)U.linha('#f4f6ff',s.pts[i-1][0],s.pts[i-1][1],s.pts[i][0],s.pts[i][1]);s.f-=.09*k;if(s.f<=0){s.f=0;if(Math.random()<.4)s.f=.7}}}
function chuva(U,n=120,ang=.22){const{P,t}=U;for(let i=0;i<n;i++){const sp=.35+(i%5)*.06,yy=((i*29+t*sp)%200)-10,xx=((i*53+t*sp*ang)%360)-20;P(i%3?'rgba(160,180,225,.5)':'rgba(220,230,255,.7)',xx-yy*ang,yy,1,3+(i%3))}
  for(let i=0;i<18;i++){const xx=(i*41+Math.floor(t/180)*17)%320,f=(t/180)%1;if(f<.5)P('rgba(200,215,255,.6)',xx-1-f*4,141,1,1),P('rgba(200,215,255,.6)',xx+1+f*4,141,1,1)}}
function nevoa(U,cor,a=.2,y=.82,n=6,nome='nev'){const{B,k}=U;const s=U.st(nome,()=>Array.from({length:n},()=>({x:Math.random()*320,y:180*(y+Math.random()*.12),r:30+Math.random()*40,v:(Math.random()<.5?-1:1)*(.06+Math.random()*.1)})));
  for(const n2 of s){n2.x+=n2.v*k;if(n2.x<-60)n2.x=380;if(n2.x>380)n2.x=-60;B(n2.x,n2.y,n2.r,cor,a)}}
function gotas(U,xs,yTop,FL,cor='rgba(170,200,230,.85)',chance=.08){const{P,k}=U;const s=U.st('gotas',()=>({d:[],o:[]}));if(Math.random()<chance*k){const x=xs[Math.floor(Math.random()*xs.length)]+Math.round((Math.random()-.5)*4);s.d.push({x,y:yTop,v:0})}
  for(let i=s.d.length-1;i>=0;i--){const d=s.d[i];d.v+=.1*k;d.y+=d.v*k;if(d.y>=FL+2){s.o.push({x:d.x,y:FL+3+Math.random()*10,r:0});s.d.splice(i,1);continue}P(cor,d.x,d.y,1,2)}
  for(let i=s.o.length-1;i>=0;i--){const o=s.o[i];o.r+=.3*k;if(o.r>8){s.o.splice(i,1);continue}const a=1-o.r/8;U.P(`rgba(190,215,240,${a*.8})`,o.x-o.r,o.y,Math.max(1,o.r*.6),1);U.P(`rgba(190,215,240,${a*.8})`,o.x+o.r*.4,o.y,Math.max(1,o.r*.6),1);if(o.r<2.5)U.P(cor,o.x,o.y-2-o.r*1.5)}}
function vela(U,X,Y,fase,cor='rgb(255,190,110)'){const{P,t,B}=U,h=2+Math.round((sin(t*.03+fase)*.5+.5)*2);P('#ff9a3a',X,Y-h,1,h);P('#fff1b8',X,Y-1);B(X,Y-2,10,cor,.35+U.fl(fase)*.12)}
function fogueira(U,X,Y,esc=1){const{P,t,B}=U;for(let d=-5;d<=5;d++){const hh=Math.round((16-Math.abs(d)*2.6)*esc*(.65+.35*(sin(t*.021+d*1.7)*.5+.5)+sin(t*.05+d)*.08));if(hh<=0)continue;const sw=Math.round(sin(t*.006+d*.4)*1.2);
  P('#c8401a',X+d+sw,Y-hh,1,hh);if(Math.abs(d)<4)P('#f5902a',X+d+sw,Y-Math.round(hh*.75),1,Math.round(hh*.75));if(Math.abs(d)<2)P('#ffe07a',X+d+sw,Y-Math.round(hh*.42),1,Math.round(hh*.42))}
  B(X,Y-8,70*esc,'rgb(255,140,50)',.22+U.fl(1)*.1);particulas(U,'brasa'+X,()=>[X+(Math.random()-.5)*8*esc,Y-12*esc],.45,p=>p.l>.6?'#ffe07a':'#ff7a26',.03,-.5,'rgb(255,150,60)');
  particulas(U,'fumo'+X,()=>[X+(Math.random()-.5)*4,Y-20*esc],.12,p=>`rgba(90,80,80,${p.l*.4})`,.004,-.22)}
/* ---- as cenas ---- */
const C={};
C.mina=U=>{const{P,t,B,k}=U;
  for(const[x,f]of[[37,0],[100,1],[152,2],[215,3],[268,4]]){lanterna(U,x,0,Math.max(10,U.y0+8+(f%2)*6),f,'#ffd27a','rgb(255,170,80)',1.3)}
  // carrinho de mina passando no fundo
  const s=U.st('cart',()=>({x:-30,v:0}));if(s.v===0&&Math.random()<.004*k)s.v=.55;if(s.v){s.x+=s.v*k;if(s.x>350){s.x=-30;s.v=0}const y=124+Math.round(sin(s.x*.5)*.4);P('#2a2230',0,y+7,320,1);P('#4a3a2a',s.x,y,16,6);P('#6a5038',s.x,y,16,1);P('#ffd04a',s.x+2,y-2,4,2);P('#cfd8e0',s.x+8,y-2,4,2);P('#ff7ad0',s.x+12,y-1,2,1);P('#111',s.x+2,y+6,3,2);P('#111',s.x+11,y+6,3,2)}
  // cogumelos soltando esporos
  const cog=[[15,130,'#7affe0'],[60,132,'#ff7ad0'],[78,133,'#7affe0'],[125,128,'#7affe0'],[190,130,'#ff9af0'],[215,131,'#7affe0'],[300,129,'#ff7ad0']];
  for(const[x,y,c]of cog)B(x,y,9,U.rgb(c),.22+sin(t*.003+x)*.12);
  particulas(U,'esporo',()=>{const c=cog[Math.floor(Math.random()*cog.length)];return[c[0]+(Math.random()-.5)*4,c[1]-3]},.5,p=>p.l>.5?'#c8fff0':'#ff9af0',.008,-.25,'rgb(150,255,230)');
  gotas(U,[20,58,96,140,182,222,250,300],8,142);revoada(U,'morc','#07060c',6,.004,50);
  particulas(U,'pedrinha',()=>[Math.random()*320,4],.03,'#6a6080',.006,1.1)};
C.catacumbas=U=>{const{P,t,B}=U;feixe(U,148,172,120,200,0,142,'rgb(170,210,255)');
  for(const[x0,x1]of[[28,93],[128,193],[229,293]]){for(let i=0;i<3;i++){const xx=x0+12+i*20,yy=40+((i*17+x0)%60);if(sin(t*.002+xx)>.6){P('#ff6a3a',xx,yy);P('#ff6a3a',xx+2,yy)}}
    const s=U.st('alma'+x0,()=>({y:120,a:0}));s.y-=.12*U.k;s.a=sin((120-s.y)/100*PI);if(s.y<25)s.y=125;const xx=(x0+x1)/2+sin(t*.002+x0)*12;B(xx,s.y,10,'rgb(170,220,255)',.25*s.a);P(`rgba(220,240,255,${.6*s.a})`,xx,s.y);P(`rgba(220,240,255,${.4*s.a})`,xx-1,s.y+2,3,1)}
  for(const x of [60,160,262])vela(U,x,128,x);
  rio(U,144,180,['#0a1a2a','#3a6a8a','#a8d0f0'],.02);gotas(U,[60,150,170,262],10,142);nevoa(U,'rgb(120,140,170)',.16,.86)};
C.salao=U=>{const{P,t,B,g}=U;
  const corvo=(x,y)=>{P('#0a0a10',x-2,y,5,2);P('#0a0a10',x-1,y-1,3,1);P('#d03030',x,y)};
  const bY=Math.max(12,U.y0-6);bandeira(U,32,bY,25,44,'#8a1a1a','#c03030',0,corvo);bandeira(U,249,bY,25,44,'#8a1a1a','#c03030',2,corvo);bandeira(U,70,bY+6,14,30,'#4a1a5a','#7a3a9a',1,corvo);bandeira(U,236,bY+6,14,30,'#4a1a5a','#7a3a9a',3,corvo);
  // vitral pulsando e o selo girando
  B(160,60,60,'rgb(200,60,140)',.18+sin(t*.0017)*.1);circulo(U,160,52,12,12,'#ffd27a',0,20);
  for(const[x,f]of[[100,0],[220,2]])fogueira(U,x,106,.45);
  particulas(U,'roxo',()=>[Math.random()*320,150],.35,p=>p.l>.5?'#e0c0ff':'#9a6aff',.008,-.35,'rgb(160,100,255)');
  revoada(U,'corv','#05050a',5,.005,40);particulas(U,'pena',()=>[40+Math.random()*240,0],.02,'#141420',.003,.25);
  nevoa(U,'rgb(90,40,120)',.16,.84)};
C.santuario=U=>{const{P,t,B}=U;
  B(160,90,80,'rgb(140,200,255)',.2+sin(t*.002)*.12);for(let i=0;i<12;i++){const a=t*.0004+i*PI/6,l=40+sin(t*.003+i*2)*12;U.linha(i%2?'rgba(180,230,255,.35)':'rgba(255,200,255,.3)',160+cos(a)*8,88+sin(a)*8,160+cos(a)*l,88+sin(a)*l)}
  for(let i=0;i<5;i++){const a=t*.0012+i*PI*2/5,x=160+cos(a)*34,y=92+sin(a)*10;P(i%2?'#9af0ff':'#ff9af0',x,y-1,1,3);P('#ffffff',x,y)}
  cascata(U,294,0,142,8,['#1a4a7a','#4a9ad0','#d0f0ff'],.12);rio(U,144,150,['#1a4a7a','#6ab0e0','#e0f8ff'],.04,280,320);
  for(const[x,h]of[[20,30],[60,22],[110,38],[200,26],[240,34],[270,20]]){const o=Math.round(sin(t*.0015+x)*2);for(let j=0;j<h;j+=2)P('#2a5a3a',x+Math.round(sin(j*.2+t*.0015+x)*1.5*j/h),j)}
  particulas(U,'brilho',()=>[Math.random()*320,145],.4,p=>p.l>.5?'#ffffff':'#9af0ff',.01,-.3,'rgb(150,220,255)')};
C.goblins=U=>{const{P,t,B}=U;fogueira(U,160,138,1.25);
  const cs=['#ffcf5a','#ff8a5a','#7aff8a','#ff5a5a','#5ad0ff'];
  for(const px of [70,114,206,230]){const top=Math.max(34,U.y0+8)-4;P('#2a1a10',px-1,top,3,142-top);P('#4a3018',px-1,top,1,142-top);P('#3a2414',px-3,top-2,7,3)}
  const bY=Math.max(34,U.y0+8);for(let i=0;i<9;i++){const x0=70+i*20,y0=bY+sin(i*.7)*6,o=sin(t*.002+i*.8)*2;if(i<8){const x1=x0+20,y1=bY+sin((i+1)*.7)*6;for(let s2=0;s2<=10;s2++){const u=s2/10;P('#2a2018',x0+(x1-x0)*u,y0+(y1-y0)*u+sin(u*PI)*5+o*sin(u*PI))}}
    {const ly=Math.round(y0+o),c=cs[i%5],br=.55+.45*(sin(t*.006+i*1.7)*.5+.5);U.linha('#2a2018',x0,y0+(i<8?0:0),x0,ly);P('#1a1410',x0-2,ly,5,1);P('#3a2a1a',x0-1,ly-1,3,1);P('#2a2018',x0-2,ly+1,1,5);P('#2a2018',x0+2,ly+1,1,5);P(c,x0-1,ly+1,3,5);P('#fff6d8',x0,ly+2+(br>.8?0:1),1,2);P('#1a1410',x0-2,ly+6,5,1);P('#2a2018',x0,ly+7);B(x0,ly+3,10,U.rgb(c),.3+br*.25)}}
  for(const[x,f]of[[40,0],[250,3]])B(x,FL_(U)-8,16,'rgb(255,150,60)',.25+U.fl(f)*.15);
  for(let i=0;i<6;i++){if(sin(t*.004+i*2.1)>.85)P('#ffffff',204+i*5,FL_(U)-22-(i%3)*2)}};
const FL_=U=>142;
C.esgoto=U=>{const{P,t,B}=U;
  // cano grande despejando água verde
  cascata(U,154,96,142,12,['#1a3a1a','#2a7a2a','#8aea6a'],.14);B(160,142,24,'rgb(120,255,100)',.25);
  particulas(U,'resp',()=>[154+Math.random()*12,141],1.2,p=>p.l>.5?'#c8ffb0':'#5aca5a',.05,-.7);
  rio(U,144,180,['#0a2a0a','#3a8a3a','#b0ff90'],.035);feixe(U,140,180,110,210,0,142,'rgb(170,255,170)');
  const s=U.st('rato',()=>({x:-10,v:0}));if(!s.v&&Math.random()<.006*U.k)s.v=Math.random()<.5?1.4:-1.4,s.x=s.v>0?-10:330;if(s.v){s.x+=s.v*U.k;const y=139,d=s.v>0?1:-1,p2=(t/60|0)%2;P('#5a5060',s.x,y,5,2);P('#5a5060',s.x+(d>0?5:-2),y,2,1);P('#ff4a3a',s.x+(d>0?6:-2),y);U.linha('#8a7a80',s.x+(d>0?0:5),y+1,s.x+(d>0?-4:9),y+p2);if(s.x>340||s.x<-20)s.v=0}
  const bar=U.st('barril',()=>({x:-20}));bar.x+=.25*U.k;if(bar.x>340)bar.x=-20-Math.random()*200;const by=158+Math.round(sin(t*.003)*1.5);P('#5a3a1a',bar.x,by,8,5);P('#3a2410',bar.x,by+1,8,1);P('#3a2410',bar.x,by+3,8,1);
  particulas(U,'bolha',()=>[Math.random()*320,150+Math.random()*25],.08,'#a8ff8a',.03,-.05);gotas(U,[40,80,240,290],0,142,'rgba(150,255,150,.8)');nevoa(U,'rgb(70,150,70)',.15,.8)};
C.aranhas=U=>{const{P,t,B,k}=U;
  for(const[x,y,r]of[[40,20,30],[280,16,34],[160,8,24]])for(let i=0;i<6;i++){const a=i*PI/3+t*.0003,yy=y+sin(a)*r*.6,xx=x+cos(a)*r;if(sin(t*.003+i*2+x)>.75){P('#ffffff',xx,yy);B(xx,yy,3,'rgb(200,220,255)',.5)}}
  for(const[x,y]of[[60,138],[235,138],[285,134]]){B(x,y,12,'rgb(220,200,255)',.18+sin(t*.004+x)*.12);if(sin(t*.0021+x)>.9){P('#f0e8ff',x+((t/90|0)%3)-1,y-3)}}
  // casulo balançando
  const L2=Math.max(52,U.y0+12),a=sin(t*.0012)*.15,cx=200+sin(a)*L2,cy=cos(a)*L2;U.linha('rgba(220,220,235,.5)',200,0,cx,cy);P('#cfc8d8',cx-3,cy,6,14);P('#9a90a8',cx-3,cy+4,6,1);P('#9a90a8',cx-3,cy+9,6,1);if(sin(t*.004)>.8)P('#cfc8d8',cx-4+((t/80|0)%2)*8,cy+6);
  const s=U.st('ar',()=>[0,1,2].map(i=>({x:50+i*100+Math.random()*30,f:Math.random(),v:.003+Math.random()*.003})));
  for(const a2 of s){a2.f+=a2.v*k;if(a2.f>2){a2.f=0;a2.x=30+Math.random()*260}const y=Math.sin(Math.min(1,a2.f/2)*PI)*(U.y0+40);for(let j=0;j<y;j+=2)P('rgba(220,220,235,.35)',a2.x,j);const p2=(t/100|0)%2;P('#1a1420',a2.x-2,y,5,3);P('#1a1420',a2.x-1,y-2,3,2);for(let l=0;l<3;l++){P('#1a1420',a2.x-3-l%2,y+l+p2);P('#1a1420',a2.x+3+l%2,y+l+1-p2)}P('#ff3a2a',a2.x-1,y+1);P('#ff3a2a',a2.x+1,y+1)}
  nevoa(U,'rgb(120,90,160)',.14,.84)};
C.carrasco=U=>{const{P,t,g,sx}=U,L2=Math.max(24,U.y0+10),a=sin(t*.0011)*.3,ex=135+sin(a)*L2,ey=2+cos(a)*L2;U.linha('#3a3440',135,0,ex,ey);P('#2a2228',ex-3,ey,7,7);P('#ffd27a',ex-2,ey+1,5,5);
  g.fillStyle='rgb(255,190,110)';g.globalAlpha=.13;g.beginPath();g.moveTo(ex*sx,ey*sx);g.lineTo((ex-60+a*80)*sx,142*sx);g.lineTo((ex+60+a*80)*sx,142*sx);g.fill();g.globalAlpha=1;U.B(ex,ey+3,40,'rgb(255,170,90)',.35);
  feixe(U,222,236,228,262,0,142,'rgb(170,190,255)',1);
  for(const x of [40,70,290]){const o=sin(t*.0014+x)*2;for(let y=0;y<60;y+=3){const xx=x+o*y/60;P('#4a4650',xx,y,2,2);P('#2a2830',xx,y+2)}P('#6a6470',x+o-1,60,4,3)}
  particulas(U,'poe',()=>[ex+(Math.random()-.5)*80,ey+Math.random()*130],.25,'rgba(255,230,190,.7)',.008,-.05)};
C.cripta=U=>{const{P,t,B}=U;B(160,72,40,'rgb(90,255,150)',.3+sin(t*.003)*.15);for(let i=0;i<8;i++){const a=t*.0015+i*PI/4,x=160+cos(a)*16,y=72+sin(a)*16*.5;P('#a8ffc8',x,y,2,1)}
  circulo(U,160,155,60,7,'#5aff9a',0,40);for(const x of [40,88,150,170,230,278])vela(U,x,132,x,'rgb(110,255,150)');
  particulas(U,'alma',()=>[100+Math.random()*120,150],.15,p=>`rgba(150,255,190,${p.l*.8})`,.006,-.4,'rgb(110,255,150)');nevoa(U,'rgb(70,170,110)',.2,.82);
  const s=U.st('fant',()=>({x:-20}));s.x+=.35*U.k;if(s.x>360)s.x=-40-Math.random()*300;const fy=60+sin(t*.002)*6;for(let j=0;j<10;j++)P(`rgba(200,255,220,${.35-j*.03})`,s.x-j*2,fy+sin(t*.006+j)*1,3,5+j%3)};
C.pantano=U=>{const{P,t,B}=U;
  for(let i=0;i<4;i++){const y=150+i*7,w=10+i*4;if(sin(t*.003+i)>-.4)P('rgba(230,230,210,.35)',268-w/2+sin(t*.002+i)*3,y,w,1)}
  B(208,92,14,'rgb(255,200,90)',.3+U.fl(2)*.15);for(let i=0;i<6;i++){const x=155+i*12,y=Math.max(50,U.y0+6)+sin(i*.9)*3+sin(t*.002+i)*1.5;B(x,y,6,U.rgb(['#ff6a6a','#ffd04a','#6aff8a','#6ad0ff','#ff9a4a','#ff6ad8'][i]),.35)}
  const s=U.st('fogo',()=>({x:120,y:115}));s.x=120+sin(t*.0009)*40;s.y=112+sin(t*.0023)*6;B(s.x,s.y,14,'rgb(120,255,120)',.45);P('#c8ffb0',s.x,s.y,2,2);particulas(U,'fogoF',()=>[s.x,s.y],.4,'#8aff7a',.03,-.3);
  particulas(U,'vagal',()=>[Math.random()*320,60+Math.random()*80],.12,'#d8ff8a',.006,-.02,'rgb(200,255,120)');
  const sapo=U.st('sapo',()=>({f:-1,x:0}));if(sapo.f<0&&Math.random()<.004*U.k){sapo.f=0;sapo.x=30+Math.random()*250}if(sapo.f>=0){sapo.f+=.03*U.k;const y=150-sin(Math.min(1,sapo.f)*PI)*14,x=sapo.x+sapo.f*20;P('#3a6a2a',x,y,4,3);P('#ffd04a',x+3,y);if(sapo.f>1){sapo.f=-1}}
  particulas(U,'bolha',()=>[Math.random()*320,148+Math.random()*28],.12,'rgba(170,210,140,.8)',.025,-.04);nevoa(U,'rgb(110,130,140)',.24,.78,8)};
C.forja=U=>{const{P,t,B}=U;for(const x of [58,250])cascata(U,x,0,142,10,['#8a2a08','#ff6a1a','#ffe07a'],.1);
  rio(U,148,166,['#6a1a04','#ff8a2a','#fff0a0'],.03);B(160,104,40,'rgb(255,120,40)',.3+U.fl(3)*.15);
  const s=U.st('bigorna',()=>({c:0}));s.c-=U.k;if(s.c<=0){s.c=45+Math.random()*30;for(let i=0;i<30;i++)U.st('fa',()=>[]).push({x:150,y:132,vx:(Math.random()-.5)*2.4,vy:-Math.random()*2.2,l:1})}
  const fa=U.st('fa',()=>[]);for(let i=fa.length-1;i>=0;i--){const p=fa[i];p.vy+=.08*U.k;p.x+=p.vx*U.k;p.y+=p.vy*U.k;p.l-=.03*U.k;if(p.l<=0||p.y>142){fa.splice(i,1);continue}P(p.l>.5?'#fff0a0':'#ff8a2a',p.x,p.y)}
  particulas(U,'brasa',()=>[Math.random()*320,160],.6,p=>p.l>.5?'#ffd04a':'#ff5a1a',.01,-.5,'rgb(255,120,40)');
  for(let i=0;i<5;i++){const x=(i*70+t*.01)%340-10,y=150+sin(t*.004+i)*2;if(sin(t*.005+i*3)>.7){P('#fff0a0',x,y,2,1);P('#ff8a2a',x-1,y-1)}}};
C.forjaHef=C.forja;
C.dragao=U=>{const{P,t,B,k}=U;feixe(U,180,200,150,236,0,142,'rgb(255,240,190)');
  for(let i=0;i<14;i++){const x=1030%7+170+((i*37)%150),y=112+((i*23)%26);if(sin(t*.004+i*1.7)>.8){P('#ffffff',x,y);P('#fff2a8',x-1,y);P('#fff2a8',x+1,y);B(x,y,4,'rgb(255,230,120)',.6)}}
  // olhos do dragão se abrindo no escuro, lá no fundo
  const s=U.st('olho',()=>({f:-1}));if(s.f<0&&Math.random()<.0035*k)s.f=0;if(s.f>=0){s.f+=.006*k;const ab=s.f<.2?s.f/.2:s.f<.8?(sin(s.f*40)>.97?.1:1):(1-s.f)/.2;for(const dx of[-16,16])olhoGrande(U,80+dx,Math.max(60,U.y0+16),5,'#ffb020',0,Math.max(0,ab));if(s.f>1)s.f=-1}
  particulas(U,'moeda',()=>[200+Math.random()*80,112],.04,'#ffd04a',.02,.4);particulas(U,'fumo',()=>[Math.random()*320,142],.12,p=>`rgba(120,100,100,${p.l*.35})`,.004,-.2);
  particulas(U,'brasa',()=>[Math.random()*320,150],.25,'#ff8a3a',.01,-.4,'rgb(255,120,40)')};
C.orc=U=>{const{P,t,B}=U;const cav=(x,y)=>{P('#e0d8c0',x-2,y-2,4,3);P('#000',x-1,y-1);P('#000',x+1,y-1);P('#e0d8c0',x-1,y+1,3,1)};
  const bY=Math.max(20,U.y0-4);bandeira(U,62,bY,18,36,'#7a1a10','#b03020',0,cav);bandeira(U,240,bY,18,36,'#7a1a10','#b03020',1.5,cav);bandeira(U,150,bY+4,20,28,'#3a2a1a','#5a4228',2.5,cav);
  for(const x of [90,232])fogueira(U,x,108,.55);
  const pulso=Math.max(0,sin(t*.006))**8;U.B(160,140,120,'rgb(255,80,30)',.12*pulso);
  revoada(U,'corv','#06050a',4,.004,30);particulas(U,'poe',()=>[Math.random()*320,145],.2,'rgba(200,170,130,.6)',.01,-.1)};
C.labirinto=U=>{const{P,t,B}=U;feixe(U,140,180,118,204,0,142,'rgb(180,190,255)');for(const[x,f]of[[30,0],[290,2]])fogueira(U,x,62,.35);
  const s=U.st('mino',()=>({x:-1}));if(s.x<0&&Math.random()<.003*U.k)s.x=0;if(s.x>=0){s.x+=.012*U.k;const x=140+s.x*40,y=100,c='rgba(5,5,10,.85)';if(s.x<1){P(c,x,y,10,40);P(c,x-2,y-6,14,8);P(c,x-5,y-10,4,3);P(c,x+11,y-10,4,3);P('#ff3a2a',x+2,y-3);P('#ff3a2a',x+7,y-3)}else s.x=-1}
  particulas(U,'poe',()=>[118+Math.random()*90,Math.random()*140],.25,'rgba(220,225,255,.6)',.006,.05);nevoa(U,'rgb(110,110,150)',.18,.84)};
C.olho=U=>{const{P,t,B}=U;const oy=U.y0;for(const[x,y,f]of[[52,32,0],[160,16,2],[266,36,4],[30,oy+14,1],[110,oy+8,3],[210,oy+12,5],[292,oy+20,6]]){const px=Math.round(sin(t*.0011+f)*2),py=Math.round(cos(t*.0017+f)*1);B(x,y,10,'rgb(180,90,255)',.35+sin(t*.003+f)*.15);
    const pis=sin(t*.0007+f*3)>.985;P(pis?'#2a1a3a':'#f0e0ff',x-4,y-1,9,3);if(!pis){P('#8a3aff',x-1+px,y-1+py,3,3);P('#000',x+px,y+py)}}
  circulo(U,160,152,56,8,'#b07aff',0,40);
  for(let i=0;i<4;i++){const a=t*.0008+i*PI/2,x=160+cos(a)*70,y=88+sin(a)*16+sin(t*.003+i)*3,ab=sin(t*.005+i)*1.5;P(['#7a2a2a','#2a4a7a','#2a6a3a','#6a5a2a'][i],x-3,y,6,4);P('#f0e6cc',x-3,y-1-ab,3,1);P('#f0e6cc',x+1,y-1+ab,3,1)}
  particulas(U,'mag',()=>[160+(Math.random()-.5)*100,150],.3,p=>p.l>.5?'#e0c0ff':'#8a5aff',.01,-.4,'rgb(170,110,255)')};
C.capela=U=>{const{P,t,B,g,sx}=U;B(157,45,34,'rgb(255,60,80)',.25+sin(t*.0019)*.12);
  g.fillStyle='rgb(255,80,100)';g.globalAlpha=.12+sin(t*.0019)*.05;g.beginPath();g.moveTo(135*sx,80*sx);g.lineTo(180*sx,80*sx);g.lineTo(200*sx,142*sx);g.lineTo(115*sx,142*sx);g.fill();g.globalAlpha=1;
  for(const x0 of [56,256])for(let i=0;i<3;i++)vela(U,x0+i*3,98,x0+i);
  particulas(U,'poe',()=>[120+Math.random()*80,80+Math.random()*60],.3,'rgba(255,220,220,.7)',.008,-.05);
  const s=U.st('sino',()=>({f:-1}));if(s.f<0&&Math.random()<.002*U.k)s.f=0;if(s.f>=0){s.f+=.01*U.k;for(let r=0;r<3;r++){const rr=(s.f*80+r*14)%80;g.strokeStyle=`rgba(255,200,200,${(1-rr/80)*.25})`;g.beginPath();g.arc(157*sx,40*sx,rr*sx,0,7);g.stroke()}if(s.f>1)s.f=-1}};
C.telhado=U=>{chuva(U,130);relampago(U,.003);nevoa(U,'rgb(120,130,170)',.14,.7,5,'nuvem');
  for(const[x,f]of[[100,0],[220,2]])U.B(x,112,20,'rgb(255,200,120)',.3+U.fl(f)*.15);
  const s=U.st('lua',()=>({x:0}));s.x+=.08*U.k;const nx=(s.x%420)-60;U.B(243,22,24,'rgb(200,210,255)',.18);U.P('rgba(20,22,40,.8)',nx,18,40,4);U.P('rgba(20,22,40,.6)',nx+8,15,26,3);
  revoada(U,'corv','#05050a',4,.004,40)};
C.ruinas=U=>{const{P,t,B}=U;for(const[x,i0]of[[30,0],[100,1],[225,2],[290,3]])for(let j=0;j<5;j++){const y=45+j*16,on=sin(t*.003-j*.8-i0*1.3)>.4;if(on){P('#9affe8',x-1,y-1,3,3);B(x,y,6,'rgb(120,255,220)',.5)}}
  circulo(U,160,150,56,7,'#6affd8',0,36);for(let i=0;i<5;i++){const x=60+i*50,y=138-Math.abs(sin(t*.0015+i))*10;P('#3a4a50',x,y,6,4);P('#5a6a70',x,y,6,1);B(x+3,y+5,6,'rgb(120,255,220)',.25)}
  particulas(U,'faisca',()=>[Math.random()*320,150],.25,'#9affe8',.008,-.3,'rgb(120,255,220)');gotas(U,[50,140,200,260],0,142);nevoa(U,'rgb(90,140,150)',.2,.82)};
C.taverna=U=>{const{t}=U;fogueira(U,268,150,.5);for(const[x,f]of[[20,0],[100,2]])lanterna(U,x,0,8,f);for(let i=0;i<3;i++)vela(U,52+i*3,152,i);
  particulas(U,'poe',()=>[Math.random()*320,Math.random()*140],.15,'rgba(255,230,190,.6)',.006,-.03)};
C.entrada=U=>{const{t}=U;for(const x of [130,198])fogueira(U,x,102,.4);particulas(U,'vagal',()=>[Math.random()*320,60+Math.random()*80],.2,'#d8ff8a',.006,-.02,'rgb(200,255,120)');
  nevoa(U,'rgb(110,120,160)',.2,.84);revoada(U,'morc','#05050a',5,.003,40)};
window.CV_CENAS=C;
})();
