const D=Math.PI/180;const GY=44;
const BASE={hx:18,hy:30,lean:4*D,fF:[21,GY],fB:[15,GY],aB1:30*D,aB2:80*D,aF1:20*D,aF2:40*D,sw:55*D,cape:0,plume:0,shR:5,shF:1};
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
   [3,{hx:16,hy:33,lean:-10*D,fF:[21,GY],fB:[11,GY],aF1:-150*D,aF2:-165*D,sw:-160*D,cape:1,plume:-2,aB1:40*D,aB2:100*D}],
   [5,{hx:23,hy:32,lean:18*D,fF:[30,GY],fB:[15,GY],aF1:-130*D,aF2:-140*D,sw:-165*D,cape:5,plume:4}],
   [6,{hx:25,hy:33,lean:24*D,fF:[32,GY],fB:[16,GY],aF1:60*D,aF2:80*D,sw:95*D,cape:6,plume:4,smear:[-165*D,95*D]}],
   [8,{hx:25,hy:33,lean:22*D,fF:[32,GY],fB:[16,GY],aF1:40*D,aF2:25*D,sw:25*D,cape:4,plume:3,smear:[95*D,25*D]}],[12,{}]])},
 escudo:{n:8,f:KF([[0,{}],[3,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,cape:2,plume:-1,aF1:-10*D,aF2:10*D,sw:30*D}],[8,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,cape:1,plume:0,aF1:-10*D,aF2:10*D,sw:30*D}]])},
 bateEscudo:{n:8,f:KF([[0,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D}],
   [2,{hx:14,hy:33,lean:-12*D,fF:[20,GY],fB:[9,GY],aB1:70*D,aB2:110*D,shR:6,aF1:-20*D,aF2:0,sw:20*D,cape:4,plume:4}],
   [5,{hx:16,hy:33,lean:-6*D,fF:[21,GY],fB:[10,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D,cape:2}],[8,{hx:17,hy:33,lean:-4*D,fF:[22,GY],fB:[11,GY],aB1:80*D,aB2:120*D,shR:6,aF1:-10*D,aF2:10*D,sw:30*D}]])},
 pesado:{n:14,f:KF([[0,{}],[2,{hy:35,lean:-6*D,fF:[23,GY],fB:[12,GY],aF1:-160*D,aF2:-170*D,sw:-170*D,cape:1}],
   [5,{hy:20,lean:-10*D,fF:[21,30],fB:[15,29],aF1:-175*D,aF2:-178*D,sw:-175*D,cape:-3,plume:-3}],
   [7,{hx:20,hy:21,lean:4*D,fF:[24,31],fB:[17,30],aF1:-150*D,aF2:-140*D,sw:-140*D,cape:-1}],
   [8,{hx:22,hy:34,lean:30*D,fF:[30,GY],fB:[14,GY],aF1:75*D,aF2:95*D,sw:110*D,cape:6,plume:5,smear:[-140*D,110*D]}],
   [11,{hx:22,hy:34,lean:28*D,fF:[30,GY],fB:[14,GY],aF1:70*D,aF2:90*D,sw:105*D,cape:3,plume:3}],[14,{}]])},
 epico:{n:18,f:KF([[0,{}],[3,{hy:34,lean:-4*D,fF:[23,GY],fB:[12,GY],aF1:-175*D,aF2:-178*D,sw:-178*D,cape:1,plume:-1}],
   [6,{hy:35,lean:-6*D,fF:[23,GY],fB:[11,GY],aF1:-178*D,aF2:-179*D,sw:-179*D,cape:2,plume:-2}],
   [9,{hy:14,lean:-12*D,fF:[21,24],fB:[15,23],aF1:-176*D,aF2:-178*D,sw:-178*D,cape:-4,plume:-4}],
   [11,{hx:21,hy:15,lean:6*D,fF:[25,25],fB:[18,24],aF1:-140*D,aF2:-130*D,sw:-130*D,cape:-2}],
   [12,{hx:23,hy:35,lean:34*D,fF:[32,GY],fB:[14,GY],aF1:80*D,aF2:100*D,sw:115*D,cape:7,plume:6,smear:[-130*D,115*D]}],
   [15,{hx:23,hy:35,lean:30*D,fF:[32,GY],fB:[14,GY],aF1:75*D,aF2:95*D,sw:110*D,cape:4,plume:4}],[18,{}]])},
 ferido:{n:6,f:KF([[0,{}],[2,{hx:15,hy:32,lean:-20*D,fF:[21,GY],fB:[11,GY],aF1:-40*D,aF2:-20*D,sw:10*D,cape:5,plume:6,aB1:60*D}],[6,{}]])},
};
