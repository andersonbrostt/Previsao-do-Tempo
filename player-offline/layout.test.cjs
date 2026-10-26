const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'index.html'),'utf8');
const code=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
for(const [width,height,contentHeight] of [[1920,1080,1090],[1366,768,1000],[390,844,1200],[844,390,720],[1920,1080,1080]]){
 const panel={style:{},scrollHeight:contentHeight,offsetHeight:contentHeight};const events={};let changed;
 vm.runInNewContext(code,{document:{getElementById:()=>panel,documentElement:{clientWidth:width,clientHeight:height}},window:{addEventListener:(name,fn)=>events[name]=fn},requestAnimationFrame:fn=>fn(),MutationObserver:class{constructor(fn){changed=fn}observe(){}}});
 const scale=Number(panel.style.transform.match(/scale\((.*)\)/)[1]);
 assert(contentHeight*scale<=height+0.001);assert(width*scale<=width);assert(scale>0);
 panel.scrollHeight=contentHeight+100;changed();const next=Number(panel.style.transform.match(/scale\((.*)\)/)[1]);assert(panel.scrollHeight*next<=height+0.001);
 events.resize();console.log('PASS: enquadramento e atualização '+width+'x'+height);
}
