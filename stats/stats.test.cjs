const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('./moteur'),P=require('../commun/progression'),I=require('../commun/intuition'),G=require('../commun/graphiques');
assert.equal(S.mean([2,4,6,8,10]),6);assert.equal(S.mean([4,6,8,10,12]),8);
assert.equal(S.weighted([2,4,6],[1,2,3]),28/6);assert.throws(()=>S.mean([]));assert.throws(()=>S.weighted([1],[0]));
assert.deepEqual(S.fraction(5,20),[1,4]);assert.deepEqual(S.fraction(0,20),[0,1]);assert.equal(S.percent(5,20),25);assert.equal(S.angle(5,20),90);assert.equal(S.angle(10,20),180);assert.equal(S.angle(20,20),360);assert.throws(()=>S.percent(1,0));
assert.equal(S.grouped([0,1,2,3,4],[1,2,3,4,5],'plus',2),6);assert.equal(S.grouped([0,1,2,3,4],[1,2,3,4,5],'moins',3),9);assert.equal(S.grouped([0,1,2,3,4],[1,2,3,4,5],'strict',3),5);
assert(S.check({answer:28/6},'4,67').correct);assert(S.check({answer:.25},'1/4').correct);assert(!S.check({answer:1},'1/0').valid);assert(!S.check({answer:2},'alert(2)').valid);
for(const raw of ['75%','75','3/4','6/8','3 ÷ 4'])assert(S.check({answer:75,unit:'%'},raw).correct,raw);
assert(!S.check({answer:75,unit:'%'},'3/4%').correct);
assert(I.evaluate('3/4','75',raw=>S.parseAnswer({unit:'%'},raw)).bonus);
assert(I.evaluate('75%','75',raw=>S.parseAnswer({unit:'%'},raw)).bonus);
assert.equal(S.parseAnswer({unit:'°'},'3/4'),.75);
let seed=45;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(const kind of new Set(Object.values(S.pools).flat()))for(let i=0;i<120;i++){const q=S.generate(kind,random);assert(S.check(q,String(q.answer)).correct,kind);assert(q.hint&&q.steps.length>=2);if(q.visual?.kind==='table'&&kind==='ponderee')assert.equal(q.answer,S.weighted(q.visual.labels.map(Number),q.visual.values));if(kind==='tableau')assert(q.visual.values.includes(q.answer));}
for(const level of [1,2,3])for(const count of [20,50,100]){const rows=S.session(count,level,random);assert.equal(rows.length,count);assert(rows.every(q=>S.pools[level].includes(q.kind)));}
assert(I.evaluate('120','100',S.parse).bonus);assert(!I.evaluate('121','100',S.parse).bonus);assert(I.evaluate('-120','-100',S.parse).bonus);assert(!I.evaluate('120','-100',S.parse).bonus);assert(!I.evaluate('1','0',S.parse).bonus);assert(I.evaluate('0','0',S.parse).bonus);assert(!I.evaluate('4','5',S.parse,{exact:true}).bonus);assert(I.evaluate('A','A',S.parse,{choices:['A','B']}).bonus);
const storage={value:null,getItem(){return this.value},setItem(k,v){this.value=v}};
const record={id:'test-1',mission:'stats',level:2,total:20,date:'2026-10-27T10:00:00.000Z',seconds:125,solo:10,hint:3,assisted:2,skipped:5,predictions:8,bonus:4};
assert(P.save(record,storage).ok);assert.equal(P.read(storage).sessions.length,1);assert(P.save(record,storage).ok);assert.equal(P.read(storage).sessions.length,1);
const backup=JSON.stringify({version:1,sessions:[record,{...record,id:'test-2',mission:'puissances'}]});assert.equal(P.restore(backup,storage).added,1);assert.equal(P.restore(backup,storage).added,0);assert.equal(P.read(storage).sessions.length,2);const before=storage.value;assert(!P.restore('{"version":1,"sessions":[{}]}',storage).ok);assert.equal(storage.value,before);assert(!P.save({...record,bonus:21},storage).ok);assert(!P.save({...record,solo:21},storage).ok);
assert(!P.read({getItem(){throw Error('blocked')}}).ok);assert(!P.save(record,{getItem(){return null},setItem(){throw Error('quota')}}).ok);
// Test that visibility pauses time, and stopping twice never adds more time.
let now=0,listener=null;const document={hidden:false,addEventListener(name,fn){listener=fn},removeEventListener(){listener=null}},context={document,performance:{now:()=>now}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../commun/progression.js','utf8'),context);const timer=context.Progression.timer();now=10000;document.hidden=true;listener();now=50000;document.hidden=false;listener();now=65000;assert.equal(timer.stop(),25);now=80000;assert.equal(timer.stop(),25);assert.equal(listener,null);
assert(G.pie(['A','B'],[0,0]).includes('Aucune'));assert(!G.pie(['<img>'],[1]).includes('<img>'));assert(!G.bars(['<script>'],[1]).includes('<script>'));
// Run a full series through the controller with a small DOM adapter.
class E{constructor(){this.value='20';this.children=[];this.selectors={};}querySelector(s){return this.selectors[s]??=new E();}replaceChildren(){this.children=[];}append(...v){this.children.push(...v);}focus(){}}
const els={},dom={getElementById:id=>els[id]??=new E(),createElement:()=>new E(),querySelector:()=>null,querySelectorAll:()=>[]};dom.getElementById('level').value='1';let storedResult;
const browser={Stats:S,Graphiques:G,Intuition:I,StatsVue:{visual:()=>''},Progression:{validCount:P.validCount,captureFirst:P.captureFirst,timer:()=>({stop:()=>123}),duration:P.duration,finish:(...args)=>{const output=P.finish(...args);storedResult=output.row;return output;}},document:dom,URLSearchParams,location:{search:'?nombre=20&niveau=1'}};
vm.createContext(browser);vm.runInContext(fs.readFileSync(__dirname+'/defis.js','utf8'),browser);assert.equal(els.resolution.hidden,true);
for(let i=0;i<20;i++){
 const q=vm.runInContext('current()',browser),widget=els.intuition;
 if(i===0){widget.querySelector('input,select').value=String(q.answer);widget.querySelector('form').onsubmit({preventDefault(){}});}else widget.querySelector('.intuition-skip').onclick();assert.equal(els.resolution.hidden,false);
 if(i===1)els.hint.onclick();if(i===2){els.show.onclick();while(!els.step.hidden)els.step.onclick();}if(i===3){els.skip.onclick();continue;}
 els.answer.value=String(q.answer);els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-success');els.next.onclick();
}
assert.equal(els.summary.hidden,false);assert.equal(storedResult.solo,17);assert.equal(storedResult.hint,1);assert.equal(storedResult.assisted,1);assert.equal(storedResult.skipped,1);assert.equal(storedResult.predictions,1);assert.equal(storedResult.bonus,1);assert.equal(storedResult.seconds,123);assert.equal(storedResult.initialCorrect,17);assert.equal(storedResult.initialAnswered,19);
console.log('OK : calculs statistiques, 2 160 questions, séries 20/50/100, arrondis, bonus, sauvegarde/import, stockage indisponible, temps actif et séance complète.');
