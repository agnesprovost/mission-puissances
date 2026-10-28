const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('./seances'),P=require('./progression'),W=require('./ateliers-moteur'),D=require('../puissances/defis-moteur'),T=require('../stats/moteur');
for(const value of [1,7,20,30,37,50,100,500])assert(S.validCount(value));
for(const value of ['',0,-1,1.5,501,Infinity,'20x'])assert(!S.validCount(value));
for(const count of [1,7,30,37,500]){
 const session=S.create({count,kinds:['a','b'],level:2,generate:(kind,level)=>({kind,level})});assert.equal(session.rows.length,count);assert.equal(session.states.length,count);assert(Math.abs(session.rows.filter(q=>q.kind==='a').length-session.rows.filter(q=>q.kind==='b').length)<=1);
 assert.equal(D.session(count,Math.random,1).length,count);assert.equal(T.session(count,1).length,count);
}
for(const n of [0,-1,501,1.5]){assert.throws(()=>D.session(n));assert.throws(()=>T.session(n));}
const targeted=T.session(37,2,Math.random,'ecarts');assert.equal(targeted.length,37);assert(targeted.every(q=>T.gapKinds.includes(q.kind)));
assert(P.valid({id:'targeted',mission:'stats',theme:'ecarts',level:2,total:37,date:new Date().toISOString(),seconds:1,solo:37,hint:0,assisted:0,skipped:0}));
const storage={value:null,getItem(){return this.value;},setItem(key,value){this.value=value;}};
const legacy={id:'old',mission:'stats',level:1,total:20,date:new Date().toISOString(),seconds:20,solo:20,hint:0,assisted:0,skipped:0,bonus:0,predictions:0};assert(P.save(legacy,storage).ok);
for(const mission of Object.keys(P.missions))assert(P.save({...legacy,id:mission,mission,total:37,solo:37},storage).ok);
assert.equal(P.read(storage).sessions.length,Object.keys(P.missions).length+1);
const els=[];class El{constructor(tag){this.tag=tag;this.children=[];this.hidden=false;this.value='';els.push(this);}append(...nodes){if(this.tag==='select'&&!this.children.length)this.value=nodes[0].value;this.children.push(...nodes);}replaceChildren(...nodes){this.children=[];this.append(...nodes);}setAttribute(){}scrollIntoView(){}}
let saved,current;const context={document:{createElement:tag=>new El(tag)},Progression:{...P,timer:()=>({stop:()=>10}),finish:(...args)=>{saved=P.finish(...args).row;return {row:saved,ok:true};}}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/seances.js','utf8'),context);
const host=new El('section'),drill=context.Seances.mount({host,mission:'litteral',families:{reduire:'Réduire'},generate:(kind,level)=>W.generate('litteral',kind,level),load:q=>{current=q;}});
const count=els.find(e=>e.tag==='input'),form=els.find(e=>e.tag==='form'),next=els.find(e=>e.textContent==='Question suivante'),skip=els.find(e=>e.textContent==='Passer cette question'),retry=els.find(e=>e.textContent==='Refaire les questions à revoir');
count.value='3';form.onsubmit({preventDefault(){}});assert(drill.active());
drill.record({valid:true,correct:true,complete:false},'étape intermédiaire');drill.complete();drill.complete();next.onclick();
drill.wrong();drill.hint();drill.complete();next.onclick();skip.onclick();assert(!drill.active());assert.equal(saved.total,3);assert.equal(saved.solo,1);assert.equal(saved.hint,1);assert.equal(saved.skipped,1);assert.equal(saved.initialCorrect,1);assert.equal(saved.initialAnswered,2);assert(!retry.hidden);
retry.onclick();assert(drill.active());drill.complete();next.onclick();drill.demonstration();drill.complete();next.onclick();assert.equal(saved.total,2);assert.equal(saved.assisted,1);assert.equal(saved.initialCorrect,1);
// All nine controllers mount real session widgets without a global-mocking dependency.
for(const module of [...Object.keys(W.modules),'priorites']){
 const nodes={};class Node{constructor(tag='div'){this.tag=tag;this.children=[];this.value='';this.style={};this.attrs={};}set id(v){this._id=v;nodes[v]=this;}get id(){return this._id;}append(...xs){if(this.tag==='select'&&!this.children.length)this.value=xs[0]?.value||'';this.children.push(...xs);}replaceChildren(...xs){this.children=[];this.append(...xs);}setAttribute(k,v){this.attrs[k]=v;}querySelector(){return new Node();}querySelectorAll(){return [];}focus(){}scrollIntoView(){}}
 const html=fs.readFileSync(`${__dirname}/../${module}/index.html`,'utf8');for(const [,id] of html.matchAll(/id="([^"]+)"/g)){const n=new Node();n.id=id;}nodes.mode.value='explorer';nodes.level.value='1';if(nodes.family)nodes.family.tag='select';const doc={body:{dataset:{module}},getElementById:id=>{assert(nodes[id],module+':'+id);return nodes[id];},createElement:tag=>new Node(tag),createElementNS:(ns,tag)=>new Node(tag)};
 const ctx={document:doc,Expressions:require('./expressions'),Algebre:require('./algebre'),Figures:require('./figures'),Ateliers:W,Progression:context.Progression};vm.createContext(ctx);vm.runInContext(fs.readFileSync(__dirname+'/seances.js','utf8'),ctx);vm.runInContext(fs.readFileSync(module==='priorites'?__dirname+'/../priorites/priorites.js':__dirname+'/ateliers.js','utf8'),ctx);
 const section=nodes.session,settings=section.children.find(n=>n.tag==='form'),controls=settings.children[0],field=controls.children[0].children[0];field.value='2';settings.onsubmit({preventDefault(){}});assert(settings.hidden,module+' session started');assert(nodes.level.disabled,module+' settings locked');
 const footer=nodes.question.children.find(n=>n.tag==='div'&&n.className==='actions'),pass=footer.children.find(n=>n.textContent==='Passer cette question');pass.onclick();pass.onclick();assert.equal(saved.total,2);assert.equal(saved.mission,module);assert.equal(saved.skipped,2);assert(!nodes.level.disabled);
}
const training=fs.readFileSync(__dirname+'/../priorites/index.html','utf8'),basics=fs.readFileSync(__dirname+'/../priorites/fondamentaux.html','utf8');assert(!training.includes('tree-a'));assert(basics.includes('tree-a'));
console.log('OK : nombres libres 1–500, anciennes sauvegardes, bilans, reprises et séances des neuf catégories ; fondamentaux séparés.');
