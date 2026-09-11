const { chromium }=require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const b=await chromium.launch({headless:true,channel:'msedge'});const p=await b.newPage({viewport:{width:1600,height:1100}});const errors=[],bad=[];p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)bad.push([r.status(),r.url()])});
await p.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
await p.locator('.experience').scrollIntoViewIfNeeded();await p.waitForTimeout(7000);
console.log('canvases',await p.locator('.work-badge canvas').count());
await p.screenshot({path:'output/badges-desktop.png'});
const card=await p.locator('.work-badge canvas').first().boundingBox();if(card){await p.mouse.move(card.x+card.width/2,card.y+card.height*.64);await p.mouse.down();await p.mouse.move(card.x+card.width*.75,card.y+card.height*.45,{steps:20});await p.screenshot({path:'output/badge-drag.png'});await p.mouse.up();}
await p.locator('.profile-photo').scrollIntoViewIfNeeded();await p.locator('.tilted-card-figure').hover({position:{x:35,y:70}});await p.waitForTimeout(1200);console.log('tilt',await p.locator('.tilted-card-inner').evaluate(e=>getComputedStyle(e).transform));await p.screenshot({path:'output/portrait-tilt.png'});
await p.setViewportSize({width:390,height:844});await p.locator('.work-badge').last().scrollIntoViewIfNeeded();await p.waitForTimeout(2500);console.log('mobile overflow',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await p.screenshot({path:'output/badges-mobile.png'});console.log({errors,bad});await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
