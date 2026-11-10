/* Masmorra do Corvo Rei: guarda o jogo no aparelho para abrir rápido e sem internet */
const V='corvo-v2.16';
const BASE=['./','index.html','manifest.webmanifest','abertura.jpg','icones/icone-192.png','icones/icone-512.png','icones/icone-180.png',"sfx/bloqueio.mp3","sfx/botao.mp3","sfx/carimbo.mp3","sfx/carta-comprar.mp3","sfx/carta-jogar.mp3","sfx/cura.mp3","sfx/dano-heroi.mp3","sfx/flecha.mp3","sfx/forjar.mp3","sfx/golpe-espada.mp3","sfx/golpe-pesado.mp3","sfx/inimigo-morre.mp3","sfx/magia.mp3","sfx/martelo-hefesto.mp3","sfx/moedas.mp3","sfx/pocao.mp3","sfx/tocha.mp3","sfx/turno.mp3"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||r.headers.has('range')||new URL(r.url).origin!==location.origin)return;
  const page=r.mode==='navigate'||r.url.endsWith('/index.html')||r.url.endsWith('/');
  if(page){e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&res.status===200){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
