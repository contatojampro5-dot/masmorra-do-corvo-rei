const D=Math.PI/180;const GY=44;
const BASE={hx:18,hy:30,lean:4*D,fF:[21,GY],fB:[15,GY],aB1:55*D,aB2:95*D,aF1:20*D,aF2:40*D,sw:55*D,cape:0,plume:0,shR:5,shF:1};
const lerp=(a,b,t)=>a+(b-a)*t;
const mix=(a,b,t)=>{const o={};for(const k in a){const A=a[k],B=b[k]??A;o[k]=Array.isArray(A)?[lerp(A[0],B[0],t),lerp(A[1],B[1],t)]:typeof A==='number'?lerp(A,B,t):A}if(b.smear)o.smear=t>.5?b.smear:a.smear;return o};
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const KF=K=>f=>{let a=K[0],b=K[1];for(let i=0;i<K.length-1;i++)if(f>=K[i][0]&&f<=K[i+1][0]){a=K[i];b=K[i+1]}const t=b[0]===a[0]?0:(f-a[0])/(b[0]-a[0]);
  const A={...BASE,...a[1]},B={...BASE,...b[1]};const o=mix(A,B,ease(t));o.smear=(t>0&&b[1].smear)?b[1].smear:undefined;return o};
/* pés: no chão (GY) ou recolhidos no salto (perto do quadril) */
const ANIM={
 parado:{n:8,f:(f,n)=>{const t=f/n*2*Math.PI,b=Math.sin(t);return{...BASE,hy:30+(b>0.35?1:0),cape:1+Math.sin(t+1)*1.3,plume:Math.sin(t+.6)*1.5,sw:BASE.sw+b*3*D,aB2:BASE.aB2+b*4*D}}},
 andar:{n:8,f:(f,n)=>{const t=f/n*2*Math.PI,s=Math.sin(t),c=Math.cos(t),hx=18;
   const ft=(ph)=>{const q=Math.sin(ph),up=Math.max(0,Math.cos(ph));return[hx+q*5,GY-up*2.5]};
   return{...BASE,hx,hy:31-Math.round(Math.abs(c)*1),lean:8*D,fF:ft(t),fB:ft(t+Math.PI),cape:3+Math.sin(t*2)*1.5,plume:2+s,aF1:(20-s*12)*D,sw:(55-s*8)*D,aB1:(30+s*8)*D}}},
 rapido:{n:8,f:KF([[0,{}],[2,{hx:16,hy:32,lean:-6*D,fF:[20,GY],fB:[12,GY],aF1:-30*D,aF2:-20*D,sw:-10*D}],
   [3,{hx:22,hy:32,lean:16*D,fF:[28,GY],fB:[14,GY],aF1:80*D,aF2:90*D,sw:90*D,cape:4,plume:3}],
   [5,{hx:22,hy:32,lean:16*D,fF:[28,GY],fB:[14,GY],aF1:85*D,aF2:92*D,sw:92*D,cape:3,plume:2}],[8,{}]])},
 golpe:{n:12,f:KF([[0,{}],
   [3,{hx:16,hy:33,lean:-10*D,fF:[21,GY],fB:[11,GY],aF1:210*D,aF2:195*D,sw:200*D,cape:1,plume:-2,aB1:40*D,aB2:100*D}],
   [5,{hx:23,hy:32,lean:18*D,fF:[30,GY],fB:[15,GY],aF1:230*D,aF2:220*D,sw:195*D,cape:5,plume:4}],
   [6,{hx:25,hy:33,lean:24*D,fF:[32,GY],fB:[16,GY],aF1:60*D,aF2:80*D,sw:95*D,cape:6,plume:4,smear:[195*D,95*D]}],
   [8,{hx:25,hy:33,lean:22*D,fF:[32,GY],fB:[16,GY],aF1:40*D,aF2:25*D,sw:25*D,cape:4,plume:3,smear:[95*D,25*D]}],[12,{}]])},
 escudo:{n:8,f:KF([[0,{}],[3,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,cape:2,plume:-1,aF1:-10*D,aF2:10*D,sw:30*D}],[8,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,cape:1,plume:0,aF1:-10*D,aF2:10*D,sw:30*D}]])},
 bateEscudo:{n:8,f:KF([[0,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D}],
   [2,{hx:14,hy:33,lean:-12*D,fF:[20,GY],fB:[9,GY],aB1:70*D,aB2:110*D,shR:6,aF1:-20*D,aF2:0,sw:20*D,cape:4,plume:4}],
   [5,{hx:16,hy:33,lean:-6*D,fF:[21,GY],fB:[10,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D,cape:2}],[8,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D}]])},
 pesado:{n:14,f:KF([[0,{}],[2,{hy:35,lean:-6*D,fF:[23,GY],fB:[12,GY],aF1:200*D,aF2:190*D,sw:190*D,cape:1}],
   [5,{hy:20,lean:-10*D,fF:[21,30],fB:[15,29],aF1:185*D,aF2:182*D,sw:185*D,cape:-3,plume:-3}],
   [7,{hx:20,hy:21,lean:4*D,fF:[24,31],fB:[17,30],aF1:210*D,aF2:220*D,sw:220*D,cape:-1}],
   [8,{hx:22,hy:34,lean:30*D,fF:[30,GY],fB:[14,GY],aF1:75*D,aF2:95*D,sw:110*D,cape:6,plume:5,smear:[220*D,110*D]}],
   [11,{hx:22,hy:34,lean:28*D,fF:[30,GY],fB:[14,GY],aF1:70*D,aF2:90*D,sw:105*D,cape:3,plume:3}],[14,{}]])},
 epico:{n:18,f:KF([[0,{}],[3,{hy:34,lean:-4*D,fF:[23,GY],fB:[12,GY],aF1:185*D,aF2:182*D,sw:182*D,cape:1,plume:-1}],
   [6,{hy:35,lean:-6*D,fF:[23,GY],fB:[11,GY],aF1:182*D,aF2:181*D,sw:181*D,cape:2,plume:-2}],
   [9,{hy:14,lean:-12*D,fF:[21,24],fB:[15,23],aF1:184*D,aF2:182*D,sw:182*D,cape:-4,plume:-4}],
   [11,{hx:21,hy:15,lean:6*D,fF:[25,25],fB:[18,24],aF1:220*D,aF2:230*D,sw:230*D,cape:-2}],
   [12,{hx:23,hy:35,lean:34*D,fF:[32,GY],fB:[14,GY],aF1:80*D,aF2:100*D,sw:115*D,cape:7,plume:6,smear:[230*D,115*D]}],
   [15,{hx:23,hy:35,lean:30*D,fF:[32,GY],fB:[14,GY],aF1:75*D,aF2:95*D,sw:110*D,cape:4,plume:4}],[18,{}]])},
 ferido:{n:6,f:KF([[0,{}],[2,{hx:15,hy:32,lean:-20*D,fF:[21,GY],fB:[11,GY],aF1:-40*D,aF2:-20*D,sw:10*D,cape:5,plume:6,aB1:60*D}],[6,{}]])},
};

/* ---------- mais vida ---------- */
const sinw=(f,n,k=1,ph=0)=>Math.sin(f/n*2*Math.PI*k+ph);
Object.assign(ANIM,{
 parado:{n:16,f:(f,n)=>{const b=(sinw(f,n)+1)/2,w=sinw(f,n,1,1.2);return{...BASE,hy:30+(b>.55?1:0),br:b*1.2,hx:18+w*.6,fF:[21,GY],fB:[15,GY],lean:(4+w*1.5)*D,sw:BASE.sw+(b-.5)*5*D,aB2:BASE.aB2+(b-.5)*6*D,aF1:BASE.aF1+(b-.5)*4*D}}},
 olhar:{n:16,f:KF([[0,{}],[4,{ht:-1,hd:-1,lean:0,br:.6}],[10,{ht:-1,hd:-1,lean:0,br:.3}],[13,{ht:.4,br:.8}],[16,{}]])},
 ajeitar:{n:14,f:KF([[0,{}],[3,{aF1:-10*D,aF2:-30*D,sw:20*D,br:.7}],[5,{aF1:-5*D,aF2:-20*D,sw:-60*D,br:.9}],[7,{aF1:-10*D,aF2:-25*D,sw:-90*D,br:.6}],[10,{aF1:15*D,aF2:35*D,sw:60*D,br:.3}],[14,{}]])},
 cansado:{n:10,f:(f,n)=>{const b=(sinw(f,n)+1)/2;return{...BASE,hx:17,hy:33+(b>.5?1:0),lean:18*D,br:b*1.6,hd:1,ht:.6,fF:[21,GY],fB:[13,GY],aF1:30*D,aF2:20*D,sw:15*D,aB1:20*D,aB2:30*D}}},
 aparar:{n:10,f:KF([[0,{}],[2,{hx:17,hy:31,lean:-6*D,fF:[21,GY],fB:[12,GY],aF1:-60*D,aF2:250*D,sw:210*D,br:.8}],
   [3,{hx:15,hy:32,lean:-12*D,fF:[20,GY],fB:[11,GY],aF1:-70*D,aF2:240*D,sw:220*D,smear:[210*D,-140*D]}],[6,{hx:16,hy:31,lean:-8*D,fF:[20,GY],fB:[11,GY],aF1:-60*D,aF2:250*D,sw:210*D}],[10,{}]])},
 escudoAlto:{n:10,f:KF([[0,{}],[3,{hx:17,hy:33,lean:-6*D,fF:[22,GY],fB:[11,GY],aB1:150*D,aB2:170*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D,ht:-1}],[5,{hx:16,hy:35,lean:-8*D,fF:[22,GY],fB:[10,GY],aB1:150*D,aB2:172*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D,ht:-1}],[7,{hx:17,hy:33,lean:-6*D,fF:[22,GY],fB:[11,GY],aB1:150*D,aB2:170*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D,ht:-1}],[10,{}]])},
 esquiva:{n:10,f:KF([[0,{}],[2,{hy:32,lean:-6*D,fF:[22,GY],fB:[15,GY]}],[4,{hx:12,hy:26,lean:-14*D,fF:[16,38],fB:[9,37],aB1:60*D,aB2:110*D,sw:20*D}],[6,{hx:9,hy:32,lean:-6*D,fF:[13,GY],fB:[5,GY]}],[8,{hx:12,hy:31,fF:[16,GY],fB:[8,GY]}],[10,{}]])},
 vitoria:{n:14,f:KF([[0,{}],[3,{hy:32,br:.5}],[6,{hy:29,lean:-4*D,aF1:190*D,aF2:185*D,sw:182*D,br:1.4,ht:-1,hd:-1,fF:[23,GY],fB:[13,GY]}],[11,{hy:29,lean:-4*D,aF1:188*D,aF2:184*D,sw:182*D,br:1,ht:-1,hd:-1,fF:[23,GY],fB:[13,GY]}],[14,{hy:29,lean:-4*D,aF1:188*D,aF2:184*D,sw:182*D,br:1.3,ht:-1,hd:-1,fF:[23,GY],fB:[13,GY]}]])},
 caindo:{n:16,f:KF([[0,{}],[3,{hx:16,hy:32,lean:-16*D,ht:-1,fF:[21,GY],fB:[12,GY],aF1:-30*D,sw:-20*D}],[6,{hx:18,hy:37,lean:14*D,ht:.8,hd:1,fF:[24,GY],fB:[13,GY],aF1:50*D,aF2:70*D,sw:95*D}],[10,{hx:18,hy:37,lean:20*D,ht:1,hd:1,fF:[24,GY],fB:[13,GY],aF1:55*D,aF2:80*D,sw:100*D,br:.2}],[13,{hx:20,hy:40,lean:60*D,ht:1,hd:2,fF:[24,GY],fB:[14,GY],aF1:70*D,aF2:90*D,sw:90*D}],[16,{hx:22,hy:41,lean:80*D,ht:1,hd:2,fF:[25,GY],fB:[15,GY],aF1:80*D,aF2:90*D,sw:90*D}]])},
});
/* física das partes soltas: capa e penacho como molas, puxadas pelo movimento do pescoço */
function comMolas(seq){const out=[];let c=0,cv=0,pl=0,pv=0,px=null,py=null;
  for(let r=0;r<2;r++)for(let i=0;i<seq.length;i++){const s=seq[i],nx=s.hx+Math.sin(s.lean||0)*10,ny=s.hy-(s.br||0);const vx=px===null?0:nx-px,vy=py===null?0:ny-py;px=nx;py=ny;
    const tc=(s.cape||0)*.6+vx*2.2-vy*.6,tp=(s.plume||0)*.6+vx*1.8+vy*.8;cv+=(tc-c)*.35;cv*=.72;c+=cv;pv+=(tp-pl)*.4;pv*=.7;pl+=pv;
    if(r===1)out.push({...s,cape:Math.max(-4,Math.min(9,c)),plume:Math.max(-4,Math.min(7,pl))})}
  return out}

/* ===================== camada de VIDA (tira o "robô") ===================== */
/* 1) ritmo de luta: cada trecho pode ter o seu tempo (e:'rapido' acelera até o impacto, 'devagar' sai suave, 'segura' para) */
const EASE={suave:ease,rapido:t=>t*t*t,devagar:t=>1-Math.pow(1-t,3),segura:t=>0,volta:t=>{const c=1.6;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)}};
const KF2=K=>f=>{f=Math.max(0,Math.min(K[K.length-1][0],f));let a=K[0],b=K[1];for(let i=0;i<K.length-1;i++)if(f>=K[i][0]&&f<=K[i+1][0]){a=K[i];b=K[i+1]}
  const t=b[0]===a[0]?0:(f-a[0])/(b[0]-a[0]),E=EASE[b[1].e||'suave'];const A={...BASE,...a[1]},B={...BASE,...b[1]};delete A.e;delete B.e;const o=mix(A,B,E(t));o.smear=(t>0&&b[1].smear)?b[1].smear:undefined;return o};
/* golpes com ritmo de verdade: preparo devagar, golpe rápido, pausa no impacto, volta devagar */
ANIM.golpe={n:14,f:KF2([[0,{}],
  [4,{e:'devagar',hx:16,hy:33,lean:-10*D,fF:[21,GY],fB:[11,GY],aF1:210*D,aF2:195*D,sw:200*D,aB1:45*D,aB2:100*D}],
  [5,{e:'segura',hx:16,hy:33,lean:-10*D,fF:[21,GY],fB:[11,GY],aF1:210*D,aF2:195*D,sw:200*D,aB1:45*D,aB2:100*D}],
  [6,{e:'rapido',hx:24,hy:32,lean:20*D,fF:[31,GY],fB:[15,GY],aF1:150*D,aF2:150*D,sw:170*D}],
  [7,{e:'rapido',hx:25,hy:33,lean:24*D,fF:[32,GY],fB:[16,GY],aF1:60*D,aF2:80*D,sw:95*D,smear:[200*D,95*D]}],
  [9,{e:'segura',hx:25,hy:33,lean:24*D,fF:[32,GY],fB:[16,GY],aF1:60*D,aF2:80*D,sw:95*D}],
  [14,{e:'devagar'}]])};
ANIM.rapido={n:10,f:KF2([[0,{}],[3,{e:'devagar',hx:16,hy:32,lean:-6*D,fF:[20,GY],fB:[12,GY],aF1:-30*D,aF2:-20*D,sw:-10*D}],
  [4,{e:'rapido',hx:22,hy:32,lean:16*D,fF:[28,GY],fB:[14,GY],aF1:80*D,aF2:90*D,sw:90*D}],[6,{e:'segura',hx:22,hy:32,lean:16*D,fF:[28,GY],fB:[14,GY],aF1:80*D,aF2:90*D,sw:90*D}],[10,{e:'devagar'}]])};
ANIM.pesado={n:16,f:KF2([[0,{}],[3,{e:'devagar',hy:35,lean:-6*D,fF:[23,GY],fB:[12,GY],aF1:200*D,aF2:190*D,sw:190*D}],
  [6,{e:'devagar',hy:20,lean:-10*D,fF:[21,30],fB:[15,29],aF1:185*D,aF2:182*D,sw:185*D}],[7,{e:'segura',hy:20,lean:-10*D,fF:[21,30],fB:[15,29],aF1:185*D,aF2:182*D,sw:185*D}],
  [8,{e:'rapido',hx:20,hy:24,lean:8*D,fF:[24,33],fB:[17,32],aF1:220*D,aF2:220*D,sw:220*D}],
  [9,{e:'rapido',hx:22,hy:34,lean:30*D,fF:[30,GY],fB:[14,GY],aF1:75*D,aF2:95*D,sw:110*D,smear:[220*D,110*D]}],
  [12,{e:'segura',hx:22,hy:34,lean:30*D,fF:[30,GY],fB:[14,GY],aF1:75*D,aF2:95*D,sw:110*D}],[16,{e:'devagar'}]])};
ANIM.epico={n:22,f:KF2([[0,{}],[4,{e:'devagar',hy:34,lean:-4*D,fF:[23,GY],fB:[12,GY],aF1:185*D,aF2:182*D,sw:182*D}],
  [8,{e:'segura',hy:35,lean:-6*D,fF:[23,GY],fB:[11,GY],aF1:182*D,aF2:181*D,sw:181*D}],
  [11,{e:'devagar',hy:14,lean:-12*D,fF:[21,24],fB:[15,23],aF1:184*D,aF2:182*D,sw:182*D}],[12,{e:'segura',hy:14,lean:-12*D,fF:[21,24],fB:[15,23],aF1:184*D,aF2:182*D,sw:182*D}],
  [13,{e:'rapido',hx:21,hy:18,lean:6*D,fF:[25,28],fB:[18,27],aF1:225*D,aF2:228*D,sw:228*D}],
  [14,{e:'rapido',hx:23,hy:35,lean:34*D,fF:[32,GY],fB:[14,GY],aF1:80*D,aF2:100*D,sw:115*D,smear:[228*D,115*D]}],
  [18,{e:'segura',hx:23,hy:35,lean:34*D,fF:[32,GY],fB:[14,GY],aF1:80*D,aF2:100*D,sw:115*D}],[22,{e:'devagar'}]])};
ANIM.bateEscudo={n:10,f:KF2([[0,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D}],
  [1,{e:'rapido',hx:13,hy:34,lean:-14*D,fF:[20,GY],fB:[9,GY],aB1:65*D,aB2:105*D,shR:6,aF1:-25*D,aF2:-5*D,sw:15*D}],
  [3,{e:'segura',hx:13,hy:34,lean:-14*D,fF:[20,GY],fB:[9,GY],aB1:65*D,aB2:105*D,shR:6,aF1:-25*D,aF2:-5*D,sw:15*D}],
  [10,{e:'devagar',hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D}]])};
/* 2) respiração viva: ritmos misturados (não é uma onda perfeita) */
ANIM.parado={n:48,f:(f,n)=>{const T=f/n*2*Math.PI,b=(Math.sin(T*2)+.35*Math.sin(T*3+1)+1.35)/2.7,w=Math.sin(T)+.3*Math.sin(T*2+2),g=Math.sin(T*3+.7);
  return{...BASE,hy:30+(b>.6?1:0),br:b*1.3,hx:18+w*.7,lean:(4+w*1.6)*D,sw:BASE.sw+(b-.5)*5*D+g*2*D,aB2:BASE.aB2+(b-.5)*6*D,aF1:BASE.aF1+(b-.5)*4*D+g*1.5*D,ht:Math.max(0,Math.sin(T+2))*.35}}};
/* 3) cascata + passar do ponto: cada parte do corpo atrasa um pouco e as pontas (braços, espada) têm mola */
const ATRASO={lean:.45,br:.4,ht:1.1,hd:1.1,aF1:0,aF2:0,sw:0,aB1:.7,aB2:.9};
function vivo(name){const A=ANIM[name],n=A.n,loop=['parado','andar','cansado'].includes(name);
  const at=f=>A.f(loop?((f%n)+n)%n:Math.max(0,f),n);
  const raw=[...Array(n)].map((_,f)=>{const base=at(f),o={...base};for(const k in ATRASO){const v=at(f-ATRASO[k])[k];if(v!==undefined)o[k]=v}return o});
  // molas nas pontas: espada e braços passam do ponto e se acomodam
  const S={};const out=[];const passes=loop?2:1;
  for(let r=0;r<passes;r++)for(let i=0;i<n;i++){const p={...raw[i]};
    for(const [k,kk,dd] of [['sw',.55,.62],['aF2',.6,.62],['aB2',.55,.65]]){const tgt=p[k];if(S[k]===undefined)S[k]={x:tgt,v:0};const s=S[k];if(Math.abs(tgt-s.x)>.6){s.v=(tgt-s.x)*.25;s.x=tgt-Math.sign(tgt-s.x)*.12}else{s.v+=(tgt-s.x)*kk;s.v*=dd;s.x+=s.v}
      // no impacto (pausa) a mola fica firme
      p[k]=p.smear?tgt:s.x}
    if(!loop||r===passes-1)out.push(p)}
  return comMolas(out)}
