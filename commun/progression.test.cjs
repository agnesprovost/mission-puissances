const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const P=require('./progression'),I=require('./intuition'),D=require('../puissances/defis-moteur');
const right={valid:true,correct:true,reduced:true},wrong={valid:true,correct:false};
const retried={};P.captureFirst(retried,wrong,'3^5');P.captureFirst(retried,right,'3^4');retried.solved=true;
assert.equal(retried.firstResponse.correct,false);assert.equal(P.initialScore([retried]).initialCorrect,0);
const firstRight={};P.captureFirst(firstRight,right,'3^4');firstRight.solved=true;firstRight.hint=true;
assert.equal(P.initialScore([firstRight]).initialCorrect,1); // Later help never rewrites the first answer.
const helped={hint:true,solved:true};P.captureFirst(helped,right,'3^4');assert.equal(P.initialScore([helped]).initialCorrect,0);
const shown={shown:1};P.captureFirst(shown,right,'3^4');assert.equal(P.initialScore([shown]).initialCorrect,0);
const partial={};P.captureFirst(partial,{valid:true,correct:true,reduced:false},'81');P.captureFirst(partial,right,'3^4');assert.equal(P.initialScore([partial]).initialCorrect,0);
const invalid={};P.captureFirst(invalid,{valid:false},'inconnu');P.captureFirst(invalid,right,'3^4');assert.equal(P.initialScore([invalid]).initialCorrect,0);
const empty={};P.captureFirst(empty,wrong,'  ');assert.equal(empty.firstResponse,undefined);
assert.deepEqual(P.initialScore([retried,firstRight,helped,shown,partial,invalid,empty,{}]),{initialCorrect:1,initialAnswered:6});
const states=[retried,firstRight,helped,...Array.from({length:17},()=>({}))];
const saved=P.finish('puissances',1,states,{stop:()=>10}).row;
assert.equal(saved.initialCorrect,1);assert.equal(saved.initialAnswered,3);assert.equal(saved.solo,1);assert.equal(saved.hint,2);assert(P.valid(saved));
const focused=P.finish('stats',2,states,{stop:()=>10},{theme:'ecarts'}).row;assert.equal(focused.theme,'ecarts');assert(P.valid(focused));assert(!P.valid({...focused,theme:'autre'}));assert(!P.valid({...focused,mission:'puissances'}));
const legacy={...saved,id:'legacy'};delete legacy.initialCorrect;delete legacy.initialAnswered;assert(P.valid(legacy));
assert(!P.valid({...saved,initialCorrect:4,initialAnswered:3}));assert(!P.valid({...saved,initialCorrect:1,initialAnswered:21}));
const store={value:null,getItem(){return this.value},setItem(k,v){this.value=v}};
assert(P.restore(JSON.stringify({version:1,sessions:[legacy,saved]}),store).ok);assert.equal(P.read(store).sessions[0].initialCorrect,undefined);assert.equal(P.read(store).sessions[1].initialCorrect,1);
for(const [value,magnitude,sign] of [['2^4','greater','positive'],['-(3)^4','greater','negative'],['(-3)^4','greater','positive'],['(-3)^3','greater','negative'],['1/2^6','less','positive'],['-1/2^6','less','negative'],['1','equal','positive'],['-1','equal','negative'],['0','less','zero'],['1/10^120','less','positive']])assert.deepEqual(I.classify(value,D.parse),{magnitude,sign},value);
// Button-only prediction: two independent choices, no correctness revealed before solving.
class E{constructor(){this.attrs={};this.selectors={};this.hidden=false;}querySelector(s){return this.selectors[s]??=new E();}querySelectorAll(s){const type=s.includes('magnitude')?'magnitude':'sign';return this.selectors[s]??=(type==='magnitude'?['greater','equal','less']:['positive','negative','zero']).map(v=>{const e=new E();e.dataset={[type]:v};return e;});}setAttribute(k,v){this.attrs[k]=v;}}
const target=new E(),state={};let unlocked=0;I.mount({target,state,expected:'-1/2^3',parse:D.parse,qualitative:true,unlock:()=>unlocked++});
assert(!target.innerHTML.includes('<input'));assert(target.innerHTML.includes('valeur absolue'));
const form=target.querySelector('form'),magnitude=target.querySelectorAll('[data-magnitude]'),sign=target.querySelectorAll('[data-sign]');
form.onsubmit({preventDefault(){}});assert.equal(unlocked,0);magnitude[2].onclick();form.onsubmit({preventDefault(){}});assert.equal(unlocked,0);sign[1].onclick();form.onsubmit({preventDefault(){}});assert.equal(unlocked,1);assert(state.bonus);assert.deepEqual(state.prediction,{magnitude:'less',sign:'negative'});assert(form.hidden);assert(!target.querySelector('.intuition-message').textContent.includes('+1'));
sign[0].onclick();form.onsubmit({preventDefault(){}});assert.equal(unlocked,1);assert.equal(state.prediction.sign,'negative');
// Dashboard keeps missing historical scores distinct from a measured zero.
const els={},series=[legacy,saved,{...saved,id:'zero',initialCorrect:0}],chartCalls=[];
const context={Progression:{read:()=>({ok:true,sessions:series}),duration:P.duration},Graphiques:{escape:String,line:(rows,value,options)=>{chartCalls.push({rows,values:rows.map(value),title:options.title});return 'graph';}},document:{getElementById:id=>els[id]??={value:'all'}},URLSearchParams,location:{search:''}};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/scores.js','utf8'),context);
const initial=chartCalls.find(c=>c.title==='Score initial avant correction et aide');assert.equal(initial.rows.length,2);assert.deepEqual(Array.from(initial.values),[5,0]);assert(els.history.innerHTML.includes('Non mesuré'));assert(els.history.innerHTML.includes('0 / 20 (0 %)'));
console.log('OK : première réponse figée, aide avant/après, erreurs de format, anciennes sauvegardes, score initial nul, intuitions de taille/signe et verrouillage.');
