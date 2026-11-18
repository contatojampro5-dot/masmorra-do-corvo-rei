/* Base dos heróis animados: tamanho da tela, corpo com IK, efeitos comuns (partículas, poeira, estrelinhas).
   Os heróis olham para a DIREITA. A área da direita (x 54..72) é onde fica o alvo: chuva de flechas, raios e meteoros caem ali.
   Usa o motor de tools/lab/inimigos/bichos.js. */
(function(){
const {P,lerp,ik,kf,sw,olhoX,D,PI}=BICHO.util;
const W=72,H=64,GY=58,ALVO=[62,40];
const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const BAY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],dit=(x,y,a)=>(BAY[((y|0)&3)*4+((x|0)&3)]+.5)/16<a;
const PELE=['#c88a6a','#e8b890','#f4d0b0'];
const DEFB={hx:21,hy:40,lean:3*D,fF:[25,GY],fB:[18,GY],aF:60*D,aF2:-40*D,aB:70*D,aB2:-30*D,ht:0,hd:0,mo:0,capa:0,ph:0,arma:0,dead:0,rot:0,px:21,py:GY,tx:0,ty:0,al:1,sh:0,br:0,
  rastro:0,rdx:0,rdy:0,flash:0};
/* corpo comum: pernas com IK, tronco, cabeça */
function corpo(pen,p,o){const hip=[p.hx+(p.sh||0),p.hy],lean=p.lean,neck=P(hip,-PI/2+lean,o.tronco||10),br=p.br||0;neck[1]-=br*.6;
  const shF=[neck[0]+1.5,neck[1]+1.5],shB=[neck[0]-1.5,neck[1]+1.5],head=[neck[0]+1.2+(p.ht||0)*.6,neck[1]-4.2+Math.abs(p.ht||0)*.3+(p.hd||0)];
  const perna=(h,f,c,bota)=>{const[k,ft]=ik(h,f,o.perna||6,o.perna||6,1);pen.line(h[0],h[1],k[0],k[1],c[0],o.gross||2);pen.line(k[0],k[1],ft[0],ft[1],c[1],2);pen.px(k[0]+1,k[1],c[2]||c[1]);pen.line(ft[0]-1,ft[1]-.5,ft[0]+2.5,ft[1]-.5,bota,2);return k};
  const braco=(sh,a1,a2,c,mao,L=4.5)=>{const e=P(sh,a1,L),h=P(e,a1+a2,L);pen.line(sh[0],sh[1],e[0],e[1],c[0],2);pen.line(e[0],e[1],h[0],h[1],c[1],2);if(mao)pen.px(h[0],h[1],mao);return{e,h}};
  return{hip,neck,shF,shB,head,perna,braco}}
/* passos: com p.andar>0 os pés seguem p.passo (corrida/caminhada) */
function pes(p,abre=3.5){if(!(p.andar>0))return null;const a=Math.sin(p.passo),b=Math.cos(p.passo);return{fF:[p.hx+2+a*abre,GY-Math.max(0,b)*2.2],fB:[p.hx-2-a*abre,GY-Math.max(0,-b)*2.2]}}
/* depois de montar os quadros-chave: ph = número do quadro (para o brilho mexer) e tremor */
function anima(B){for(const k in B.A){const A=B.A[k];if(A.loop||!A.f)continue;const g=A.f;A.f=f=>{const o={...g(f),ph:f};if(o.tremor)o.sh=(f%2?1:-1)*o.tremor;return o}}}
/* efeitos que todos usam (camada sem luz) */
function estrelas(pn,c,n,r,cor,ph){for(let i=0;i<n;i++){const a=ph*.4+i*PI*2/n,q=[c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r*.7];pn.px(q[0],q[1],cor);if(i%2)pn.px(q[0],q[1]-1,'#ffffff')}}
function poeira(pn,x,t,cor='#8a7a60'){if(t<=0||t>=1)return;for(let i=0;i<12;i++){const s=i<6?-1:1;pn.px(x+s*(2+i%6*2.2)*t*1.8,GY-Math.sin(t*PI)*(1+i%3)*1.7,cor)}}
function racha(pn,x,t,l=8){if(t<=0)return;for(let i=-l;i<=l;i++)pn.px(x+i,GY+((i*7)%3===0?-1:0),'#120a06')}
function onda(pn,x,t,cor){if(t<=0||t>=1)return;const r=4+t*24;for(let a=0;a<PI;a+=.06)pn.px(x+Math.cos(a)*r,GY-Math.sin(a)*r*.35,cor)}
window.HB={W,H,GY,ALVO,cl,dit,PELE,DEFB,corpo,pes,anima,estrelas,poeira,racha,onda};
window.HEROIS=window.HEROIS||{};
})();
