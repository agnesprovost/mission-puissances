const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('./ecarts'),S=require('./moteur');
assert.deepEqual(E.analyze([1573,1574,1575,1576,1577],1575),{deltas:[-2,-1,0,1,2],deficit:3,surplus:3,net:0,balanced:true});
assert.equal(E.mean([1573,1574,1575,1576,1577],1573),1575);assert.equal(E.mean([947,951,951,953,953],949),951);
assert.equal(E.missing([9,11,14],12),14);assert.equal(E.missing([1573,1574,1577],1575),1576);assert.equal(E.missing([1577,1578,1574],1575),1571);
assert.equal(E.weightedMean([1572,1575,1578],[3,2,1],1575),1574);
assert.equal(E.weightedMean([1572,1575,1578],[3,2,3],1575),1575);
assert.equal(E.missing([1572,1572,1575,1575,1575,1578],1575,3),1576);
assert.equal(E.missingCount([1572,1572,1575,1575,1575],1575,1578),2);
assert.throws(()=>E.missing([9,11,14],12,0));assert.throws(()=>E.missingCount([9],12,12));assert.throws(()=>E.expand([1],[1.5]));
const repeated=E.groups([1572,1572,1572,1575,1575,1578],1575);assert.deepEqual(repeated.map(g=>g.contribution),[-9,0,3]);assert(E.visual([1572,1572,1572,1575,1575,1578],1575).includes('3 × (−3)')||E.visual([1572,1572,1572,1575,1575,1578],1575).includes('3 × (-3)'));
for(const kind of ['moyenne-ecarts-effectifs','valeur-repetee-ecarts','effectif-ecarts'])for(let i=0;i<150;i++){
 const q=S.generate(kind);assert(S.check(q,String(q.answer)).correct);
 if(kind==='moyenne-ecarts-effectifs'){assert.equal(q.answer,S.weighted(q.values,q.counts));assert.notEqual(q.answer,S.mean(q.values));}
 if(kind==='valeur-repetee-ecarts')assert.equal(S.weighted([...q.values,q.answer],[...q.counts,q.repetitions]),q.reference);
 if(kind==='effectif-ecarts')assert.equal(S.weighted(q.values,[...q.counts.slice(0,2),q.answer]),q.reference);
 assert(!q.visual.labels.includes(String(q.answer))||kind==='valeur-repetee-ecarts');
}
assert.throws(()=>E.analyze([],0));assert.throws(()=>E.analyze([NaN],0));
for(const offset of [0,1000,1000000000]){const values=[-3,-1,0,2,7].map(v=>v+offset);assert.equal(E.mean(values,offset),offset+1);assert.equal(E.missing([offset-3,offset-1,offset+2],offset),offset+2);}
let seed=87;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(const kind of ['moyenne-ecarts','manquante-ecarts'])for(let i=0;i<250;i++){const q=S.generate(kind,random);assert(S.check(q,String(q.answer)).correct);if(kind==='moyenne-ecarts')assert.equal(q.answer,S.mean(q.values));else assert.equal(S.mean([...q.values,q.answer]),q.reference);assert(q.steps.every(s=>!s.text.includes('somme totale')));}
assert(E.visual([1573,1574,1575,1576,1577],1575).includes('équilibré'));assert(!E.visual([1573,1574,1575,1576,1577],1573).includes('La moyenne est'));
// Exercise the actual tutorial controller with a small DOM adapter.
class El{constructor(){this.value='';this.children=[];this.style={};}replaceChildren(){this.children=[];}append(...els){this.children.push(...els);}setAttribute(){}}
const els={},dom={getElementById:id=>els[id]??=new El(),querySelectorAll:()=>[],createElement:()=>new El()};dom.getElementById('atelier').value='ecarts';
const context={document:dom,Stats:S,Ecarts:E,StatsVue:{visual:()=>''},Graphiques:{},URLSearchParams,location:{search:'?atelier=ecarts'},history:{replaceState(){}},setTimeout:()=>0,clearTimeout(){}};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/tuto.js','utf8'),context);
assert(els['gap-task'].textContent.includes('1'));assert.equal(els['gap-current'].textContent,'1 573');assert.equal(els.explanation.hidden,true);
els['gap-up'].onclick();els['gap-up'].onclick();assert(els.feedback.textContent.includes('équilibre'));assert(els.explanation.innerHTML.includes('1 575'));
els['gap-scenario'].value='3';els['gap-scenario'].onchange();assert.equal(els.explanation.hidden,true);els['gap-guess'].value='1576';els['gap-prediction'].onsubmit({preventDefault(){}});assert(els.feedback.textContent.includes('équilibre'));assert(els.explanation.innerHTML.includes('+ 1 = 1 576'));
els['gap-scenario'].value='4';els['gap-scenario'].onchange();for(let i=0;i<4;i++)els['gap-down'].onclick();assert(els.explanation.innerHTML.includes('− 4 = 1 571'));
els['gap-scenario'].value='5';els['gap-scenario'].onchange();els['gap-up'].onclick();els['gap-up'].onclick();assert(els.feedback.textContent.includes('équilibre'));assert(els['gap-visual'].innerHTML.includes('3 fois'));
els['gap-scenario'].value='6';els['gap-scenario'].onchange();els['gap-down'].onclick();assert(els.explanation.innerHTML.includes('1 574'));
els['gap-scenario'].value='7';els['gap-scenario'].onchange();els['gap-up'].onclick();assert(els.explanation.innerHTML.includes('3 occurrence(s) cachée(s)'));assert(els.explanation.innerHTML.includes('1 576'));
els['gap-scenario'].value='8';els['gap-scenario'].onchange();for(let i=0;i<3;i++)els['gap-down'].onclick();assert(els.explanation.innerHTML.includes('1 572'));
els['gap-scenario'].value='9';els['gap-scenario'].onchange();els['gap-up'].onclick();els['gap-up'].onclick();assert(els.explanation.innerHTML.includes('2 occurrences'));
for(const level of [1,2,3])for(const count of [20,50,100]){const questions=S.session(count,level,random,'ecarts');assert(questions.every(q=>S.gapKinds.includes(q.kind)));assert.equal(questions.length,count);assert.equal(new Set(questions.map(q=>q.text+JSON.stringify(q.visual))).size,count);if(level===3)assert(questions.some(q=>q.kind==='effectif-ecarts'));}
console.log('OK : écarts équilibrés, grands nombres, invariance par décalage, 500 défis, valeur cachée et curseur de repère.');
console.log('OK : effectifs différents, inconnues répétées, effectifs manquants, 450 défis pondérés, situations du tutoriel et séries ciblées.');
