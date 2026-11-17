const D=Math.PI/180;
const BASE={hx:18,hy:31,lean:4*D,lB1:-8*D,lB2:2*D,lF1:12*D,lF2:-6*D,aB1:30*D,aB2:80*D,aF1:20*D,aF2:40*D,sw:55*D,cape:0,plume:0,shR:5,shF:1};
const mix=(a,b,t)=>{const o={};for(const k in a)o[k]=a[k]+((b[k]??a[k])-a[k])*t;return o};
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
/* cada animação devolve a pose no quadro f de n */
const KF=(K)=>(f)=>{let a=K[0],b=K[1];for(let i=0;i<K.length-1;i++)if(f>=K[i][0]&&f<=K[i+1][0]){a=K[i];b=K[i+1]}const t=b[0]===a[0]?0:(f-a[0])/(b[0]-a[0]);return mix({...BASE,...a[1]},{...BASE,...b[1]},ease(t))};
const ANIM={
 parado:{n:8,f:(f,n)=>{const t=f/n*2*Math.PI,b=Math.sin(t);return{...BASE,hy:31+(b>0.35?1:0),cape:1+Math.sin(t+1)*1.3,plume:Math.sin(t+.6)*1.5,sw:BASE.sw+b*3*D,aB2:BASE.aB2+b*4*D}}},
 andar:{n:8,f:(f,n)=>{const t=f/n*2*Math.PI,s=Math.sin(t),c=Math.cos(t);return{...BASE,hy:31-Math.round(Math.abs(c)),lean:8*D,lF1:s*30*D,lF2:(s<0?-s*-35:0)*D-8*D,lB1:-s*30*D,lB2:(s>0?s*35:0)*D-8*D,cape:3+Math.sin(t*2)*1.5,plume:2+s,aF1:(20-s*12)*D,sw:(55-s*8)*D}}},
 golpe:{n:10,f:KF([[0,{}],
   [2,{hx:17,hy:32,lean:-8*D,aF1:-150*D,aF2:-160*D,sw:-150*D,lF1:22*D,lF2:-28*D,lB1:-18*D,cape:1,plume:-2,aB1:40*D,aB2:100*D}],
   [4,{hx:22,hy:31,lean:20*D,aF1:-120*D,aF2:-130*D,sw:-160*D,lF1:34*D,lF2:-12*D,lB1:-32*D,lB2:22*D,cape:5,plume:4}],
   [5,{hx:24,hy:32,lean:24*D,aF1:60*D,aF2:80*D,sw:95*D,lF1:38*D,lF2:-18*D,lB1:-32*D,lB2:26*D,cape:6,plume:4}],
   [7,{hx:24,hy:32,lean:22*D,aF1:40*D,aF2:20*D,sw:20*D,lF1:34*D,lF2:-22*D,lB1:-28*D,lB2:18*D,cape:4,plume:3}],[10,{}]])},
 escudo:{n:6,f:(f,n)=>mix(BASE,{...BASE,hx:17,hy:32,lean:-2*D,aB1:80*D,aB2:120*D,shR:6,lF1:20*D,lF2:-14*D,lB1:-18*D,cape:2,plume:-1,aF1:-10*D,aF2:10*D,sw:30*D},ease(Math.min(1,f/3)))},
 pesado:{n:12,f:KF([[0,{}],[2,{hy:34,lean:-4*D,lF1:45*D,lF2:-75*D,lB1:-35*D,lB2:65*D,aF1:-160*D,aF2:-170*D,sw:-170*D,cape:1}],
   [5,{hy:20,lean:-10*D,lF1:35*D,lF2:-70*D,lB1:-10*D,lB2:-50*D,aF1:-175*D,aF2:-178*D,sw:-175*D,cape:-3,plume:-3}],
   [7,{hy:24,lean:12*D,aF1:-130*D,aF2:-120*D,sw:-120*D,cape:-1}],
   [8,{hx:21,hy:33,lean:30*D,lF1:48*D,lF2:-62*D,lB1:-36*D,lB2:44*D,aF1:70*D,aF2:90*D,sw:100*D,cape:6,plume:5}],
   [10,{hx:21,hy:33,lean:28*D,lF1:48*D,lF2:-62*D,lB1:-36*D,lB2:44*D,aF1:60*D,aF2:80*D,sw:92*D,cape:3,plume:3}],[12,{}]])},
 ferido:{n:5,f:(f,n)=>mix(BASE,{...BASE,hx:16,lean:-20*D,aF1:-40*D,aF2:-20*D,sw:10*D,lF1:-4*D,lB1:-22*D,cape:4,plume:5,aB1:60*D},Math.sin(f/(n-1)*Math.PI))},
};
