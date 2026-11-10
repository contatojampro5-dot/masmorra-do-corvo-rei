const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:956,height:440},deviceScaleFactor:2.5,isMobile:true,hasTouch:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{localStorage.setItem('trc-tut','1');localStorage.setItem('trc-tips',JSON.stringify(['mapa','recompensa','forja','loja','evento','descanso','elite','chefe']));localStorage.setItem('trc-opt',JSON.stringify({cenas:'nunca',bateria:'normal'}));localStorage.setItem('trc-abertura','1')});
await p.goto(process.argv[2]);await p.waitForTimeout(1500);await p.evaluate(()=>{document.querySelector('#abert')?.remove();document.body.classList.add('rotok');UI.choose=true;render()});
await p.waitForTimeout(500);await p.evaluate(()=>document.querySelector('[data-ch=nec]').click());await p.waitForTimeout(400);await p.evaluate(()=>document.querySelector('[data-act=namego]')?.click());await p.waitForTimeout(800);
await p.evaluate(()=>{G.act=3;G.kills=['goblin','esqueleto'];startCombat(['reicorvo'],'boss',true)});await p.waitForTimeout(3500);
await p.evaluate(()=>document.querySelectorAll('.tipcard,.toast,.banner').forEach(x=>x.remove()));await p.screenshot({path:'loja/raw-6.png'});console.log(errs);await b.close()})();
