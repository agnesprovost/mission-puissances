const assert=require('node:assert/strict');
const D=require('./defis-moteur.js');
let seed=1207;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
for(const count of [20,50,100]){const list=D.session(count,random);assert.equal(list.length,count);assert.equal(new Set(list.map(q=>q.prompt)).size,count);assert.equal(new Set(list.map(q=>q.kind)).size,8);}
for(const kind of D.kinds)for(let i=0;i<200;i++){
 const q=D.generate(kind,random);assert(D.check(q,q.answer).correct,`${kind}: ${q.answer}`);assert(!D.check(q,'9999').correct);assert(!D.check(q,'alert(1)').valid);assert(q.steps.length>=2);
 if(q.unknown){assert.equal(Number(q.answer),q.m);continue;}
 const [num,den]=D.parse(q.answer);let expected;
 if(kind==='scientifique')expected=q.coefficient*10**q.exponent;
 else if(kind==='paires')expected=q.a**q.n*q.b**q.n;
 else if(kind==='puissance')expected=(q.a**q.n)**q.m;
 else if(kind==='combine')expected=(q.a**q.n)**q.m/q.a**q.k;
 else if(kind==='quotient')expected=q.a**q.n/q.a**q.k;
 else expected=q.a**q.n*q.a**q.m;
 assert(Math.abs(Number(num)/Number(den)-expected)/expected<1e-12);
 if(kind!=='scientifique')assert(!q.steps.some(s=>/<sup>-/.test(s.html)));
}
assert(D.check({kind:'produit',answer:'3^4'},'81').correct);
assert(D.check({kind:'quotient',answer:'1/3^2'},'1/9').correct);
assert(!D.check({kind:'scientifique',answer:'4.5*10^3'},'45*10^2').correct);
assert(!D.check({kind:'quotient',answer:'1'},'1/0').valid);
console.log('OK : 1 600 exercices, valeurs et réponses, séries sans doublons de 20/50/100, fractions et formats invalides.');
const vm=require('node:vm'),fs=require('node:fs');
class Element{constructor(){this.value='20';this.children=[];this.selectors={};}querySelector(selector){return this.selectors[selector]??=new Element();}querySelectorAll(selector){const type=selector.includes('magnitude')?'magnitude':'sign';return this.selectors[selector]??=['magnitude'].includes(type)?['greater','equal','less'].map(value=>{const e=new Element();e.dataset={[type]:value};return e;}):['positive','negative','zero'].map(value=>{const e=new Element();e.dataset={[type]:value};return e;});}setAttribute(name,value){this[name]=value;}focus(){}replaceChildren(){this.children=[];}append(...els){this.children.push(...els);}setRangeText(text,start,end){this.value=this.value.slice(0,start)+text+this.value.slice(end);this.selectionStart=this.selectionEnd=start+text.length;}}
const keyboard=['^',' × ',' ÷ ','−','+',' = '].map(text=>({dataset:{insert:text}}));
const els={},context={Defis:D,Intuition:require('../commun/intuition.js'),Progression:require('../commun/progression.js'),URLSearchParams,location:{search:'?nombre=20'},document:{getElementById:id=>els[id]??=new Element(),createElement:()=>new Element(),querySelectorAll:()=>keyboard}};
vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/defis.js','utf8'),context);
assert.equal(els.exercise.hidden,false);assert.equal(els.setup.hidden,true);
const unlock=()=>els.intuition.querySelector('.intuition-skip').onclick();unlock();
els.answer.value='invalid';els.form.onsubmit({preventDefault(){}});assert(els.feedback.textContent.includes('reconnais'));
for(let i=0;i<20;i++){
 unlock();
 if(i===1)els.hint.onclick();
 if(i===2){els.show.onclick();while(!els.step.hidden)els.step.onclick();assert(els.steps.children.length>=2);}
 if(i===3){els.skip.onclick();continue;}
 els.answer.value=vm.runInContext('current().answer',context);els.form.onsubmit({preventDefault(){}});assert.equal(els.next.hidden,false);els.next.onclick();
}
assert.equal(els.summary.hidden,false);assert(els.report.innerHTML.includes('17 résolus sans aide'));assert(els.report.innerHTML.includes('1 résolus avec un indice'));assert(els.report.innerHTML.includes('1 résolus avec le développement'));assert(els.report.innerHTML.includes('1 laissés de côté'));els.again.onclick();assert.equal(els.setup.hidden,false);
console.log('OK : séance complète, formats invalides, indice, développement, question passée et bilan.');
const reduced={kind:'paires',answer:'3^12'};
assert.deepEqual(D.check(reduced,'27^4'),{valid:true,correct:true,reduced:false});
assert(D.check(reduced,'3^4 × 9^4 = 3^12').reduced);
assert(D.check(reduced,'3^12').reduced);
assert(!D.check(reduced,'3^11').correct);
assert(D.check({kind:'quotient',answer:'1/2^6'},'1 ÷ 2^6').reduced);
assert.equal(D.parse('5−2')[0],3n);assert.equal(D.parse('1+2')[0],3n);
vm.runInContext("questions=[{kind:'paires',answer:'3^12',prompt:'test',steps:[],hint:'indice'}];states=[{attempts:0,hint:false,shown:0,solved:false}];position=0;render();",context);unlock();
els.answer.value='27^4';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-partial');assert.equal(els.answer.disabled,false);
els.answer.value='3^11';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-error');
els.answer.value='3^12';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-success');
els.answer.disabled=false;els.answer.value='3';els.answer.selectionStart=els.answer.selectionEnd=1;keyboard[0].onclick();assert.equal(els.answer.value,'3^');
els.answer.value='3?4';els.answer.selectionStart=1;els.answer.selectionEnd=2;keyboard[1].onclick();assert.equal(els.answer.value,'3 × 4');
console.log('OK : base minimale, égalité, signes × ÷ − +, couleurs et insertion au curseur.');
els.answer.value='2^5';els.answer.oninput();assert(els.preview.innerHTML.includes('2<sup>5</sup>'));
els.answer.value='<img src=x onerror=alert(1)>^2';els.answer.oninput();assert(!els.preview.innerHTML.includes('<img'));
vm.runInContext("questions=[{unknown:true,kind:'equation',answer:'5',prompt:'2<sup>4</sup> × 2<sup>?</sup> = 2<sup>9</sup>',steps:[]}];states=[{attempts:0,hint:false,shown:0,solved:false}];position=0;render();",context);unlock();
assert.equal(els['answer-label'].textContent,'Exposant manquant (?)');assert.equal(els.preview.hidden,true);
els.answer.value='2^5';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-partial');assert(els.feedback.textContent.includes('exposant tout seul'));
els.answer.value='5';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-success');
console.log('OK : aperçu des puissances, saisie échappée et consigne pour l’exposant inconnu.');
for(const sign of ['x','X','×','*','·']){const result=D.check({kind:'scientifique',answer:'3.6*10^0'},`3,6 ${sign} 10^0`);assert(result.correct&&result.reduced,sign);}
assert(!D.check({kind:'scientifique',answer:'3.6*10^0'},'36 x 10^-1').correct);
console.log('OK : 3,6 x 10^0, variantes de fois et contrôle de la notation scientifique.');
assert.equal(Number(D.parse('(-5)^6')[0]),15625);
assert.equal(Number(D.parse('-(3)^3')[0]),-27);
assert.equal(Number(D.parse('(-3)^4')[0]),81);
assert.equal(Number(D.parse('-(3)^4')[0]),-81);
assert.equal(D.parse('(2)/(0)'),null);assert.equal(D.parse('(-3)^-2'),null);
const plain=html=>html.replace(/<sup>(.*?)<\/sup>/g,'^$1').replace(/<span class="math-fraction"><span>(.*?)<\/span><span>(.*?)<\/span><\/span>/g,'(($1)/($2))');
for(const level of [1,2,3])for(const count of [20,50,100]){
 const list=D.session(count,random,level);assert.equal(list.length,count);assert.equal(new Set(list.map(q=>q.prompt)).size,count);assert(list.every(q=>D.levels[level].includes(q.kind)));
 assert(list.every(q=>D.check(q,q.answer).correct));
}
for(const kind of ['signes','signes-produits','signes-quotients','equation-lineaire','equation-fraction'])for(let i=0;i<200;i++){
 const q=D.generate(kind,random);assert(D.check(q,q.answer).correct,kind+' '+q.answer);assert(D.check(q,q.answer).reduced);
 if(q.variable){assert(D.check(q,'x = '+q.answer).correct);const sides=plain(q.prompt).replace(/x/g,'('+q.answer+')').split('=');const l=D.parse(sides[0]),r=D.parse(sides[1]);assert(l&&r,q.prompt);assert(l[0]*r[1]===r[0]*l[1],q.prompt);}
 else {const expected=D.parse(plain(q.prompt)),actual=D.parse(q.answer);assert(expected&&actual,q.prompt);assert(expected[0]*actual[1]===actual[0]*expected[1],q.prompt);}
}
vm.runInContext("questions=[{kind:'quotient',answer:'1/3^2',prompt:'test',steps:[]}];states=[{attempts:0,hint:false,shown:0,solved:false}];position=0;render();",context);unlock();
els['fraction-toggle'].onclick();assert.equal(els['fraction-input'].hidden,false);assert.equal(els.answer.required,false);
els.numerator.value='1';els.denominator.value='3^2';els.denominator.oninput();assert(els.preview.innerHTML.includes('math-fraction'));assert(els.preview.innerHTML.includes('3<sup>2</sup>'));
els.denominator.onfocus();els.denominator.selectionStart=els.denominator.selectionEnd=3;keyboard[0].onclick();assert.equal(els.denominator.value,'3^2^');els.denominator.value='3^2';
els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-success');assert.equal(els.denominator.disabled,true);
vm.runInContext('render()',context);assert.equal(els['fraction-input'].hidden,true);assert.equal(els.denominator.value,'');
console.log('OK : trois niveaux, 1 000 exercices signés et équations, parité, fractions saisies verticalement et clavier dans le dénominateur.');
vm.runInContext("questions=[{kind:'fraction-vers-puissance',form:'fraction-power',answer:'(11/10)^2',power:{numerator:11,denominator:10,exponent:2},prompt:'121/100',instruction:'Écris une seule puissance.',format:'Une puissance de fraction',steps:[]}];states=[{attempts:0,hint:false,shown:0,solved:false}];position=0;render();",context);unlock();
els['fraction-toggle'].onclick();els.numerator.value='11';els.denominator.value='10';els['fraction-exponent'].value='2';els['fraction-exponent'].oninput();assert(els.preview.innerHTML.includes('math-fraction'));assert(els.preview.innerHTML.includes('<sup>2</sup>'));
els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-success');assert(els['fraction-exponent'].disabled);
vm.runInContext("questions=[{kind:'phrase-traduction',form:'translation',expression:'-(-3)^3',answer:'27',prompt:'L’opposé du cube de l’opposé de 3.',instruction:'Traduis sans effectuer.',steps:[]}];states=[{attempts:0,hint:false,shown:0,solved:false}];position=0;render();",context);unlock();
assert.equal(els['answer-label'].textContent,'Expression à écrire');assert(els['fraction-toggle'].hidden);assert.equal(els['fraction-exponent'].value,'');
els.answer.value='27';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-partial');assert(!vm.runInContext('state().firstResponse.correct',context));
els.answer.value='-(-3)^3';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-success');
console.log('OK : exposant de toute la fraction, remise à zéro, consigne de traduction et score initial distinct après correction.');

for(let level=1;level<=5;level++)for(const count of [20,50,100]){
 const qs=D.session(count,random,level);assert.equal(qs.length,count);assert.equal(new Set(qs.map(q=>q.prompt)).size,count);
 assert(qs.every(q=>D.check(q,q.answer).correct));
 if(level<5)assert(qs.every(q=>!['fraction-vers-puissance','puissance-fraction','fractions-puissances'].includes(q.kind)));
 if(level===2)assert(qs.some(q=>q.kind==='phrase-traduction')&&qs.some(q=>q.kind==='equation-quotient'));
}
for(const kind of ['produit-quotient','produit-quotient-bases','equation-quotient'])for(let i=0;i<150;i++){
 const q=D.generate(kind,random);assert(D.check(q,q.answer).correct);assert(q.steps.length>=3);
 if(!q.unknown){const X=require('./exercices-plus.js');const a=X.evaluate(X.tree(q.answer));assert.equal(a[0]*D.parse(q.answer)[1],D.parse(q.answer)[0]*a[1]);}
}
console.log('OK : cinq paliers, fractions réservées au dernier, phrases et quotients inconnus accessibles.');

for(const raw of ['0,5','0.5','1/2','50%']){const r=D.check({kind:'signes-quotients',numeric:true,answer:'1/2'},raw);assert(r.correct&&r.reduced,raw);}
assert.equal(D.check({kind:'signes-quotients',numeric:true,answer:'1/2'},'2/4').reduced,false);
assert.equal(D.check({kind:'produit',answer:'2^3'},'8').reduced,false);
assert.equal(D.check({kind:'phrase-traduction',form:'translation',expression:'-(-3)^3',answer:'27'},'27').reduced,false);
assert(D.check({kind:'puissance-fraction',numeric:true,answer:'3/4'},'75%').reduced);
console.log('OK : équivalences numériques acceptées, fractions non réduites et formes de puissances toujours contrôlées.');

assert.equal(D.productAnswer(7,4,6,2),'2^2*3^2*7^4');
const largeProduct={kind:'signes-produits',powerProduct:true,primeBases:true,answer:D.productAnswer(7,4,6,2)};
for(const raw of ['2^2 × 3^2 × 7^4','7^4*3^2*2^2','(2^2)*(3^2)*(7^4)']){const r=D.check(largeProduct,raw);assert(r.correct&&r.reduced,raw);}
assert(!D.check(largeProduct,'-7^4*6^2').correct);
assert.equal(D.productAnswer(4,3,2,2),'2^8');
assert.equal(D.productAnswer(3,4,5,4,true),'-3^4*5^4');
assert.equal(D.check({powerProduct:true,answer:'2^8'},'4^3*2^2').reduced,false);
assert.equal(D.check({primeBases:true,answer:'3^4*5^4'},'15^4').reduced,false);
for(let i=0;i<200;i++){const q=D.generate('signes-produits',random);assert(!q.numeric);assert(q.format.includes('premiers')||q.format.includes('décompose'));assert(q.primeBases);assert(D.check(q,q.answer).reduced);assert(q.steps.length>=3);}
vm.runInContext("questions=[{kind:'signes-produits',powerProduct:true,primeBases:true,answer:'2^2*3^2*7^4',instruction:'Simplifie en gardant les puissances.',format:'Plusieurs puissances possibles.',prompt:'test',steps:[]}];states=[{attemptCount:0,hint:false,shown:0,solved:false}];position=0;render();",context);unlock();
assert(els.instruction.textContent.includes('gardant les puissances'));els.answer.value='2^2 × 3^2 × 7^4';els.form.onsubmit({preventDefault(){}});assert.equal(els.feedback.className,'status feedback-success');
console.log('OK : grands produits acceptés en puissances, signes et regroupements contrôlés, consigne et validation dans le contrôleur.');

for(const raw of ['7^4*6^2','86436','2*2*3^2*7^4','(2*3)^2*7^4']){const r=D.check(largeProduct,raw);assert(r.correct&&!r.reduced,raw);}
for(const [input,expected] of [['6^6','2^6*3^6'],['1/6^3','1/(2^3*3^3)'],['4^3*2^2','2^8'],['12^2/6^3','2/3']])assert.equal(D.primeAnswer(input),expected);
for(const kind of ['produit','quotient','puissance','paires','combine','produit-quotient','produit-quotient-bases'])for(let i=0;i<100;i++){const q=D.generate(kind,random);assert(q.primeBases);assert(D.check(q,q.answer).reduced);assert(q.format.includes('premiers'));}
console.log('OK : bases premières obligatoires, exposants regroupés et fractions simplifiées sans calculer les grandes puissances.');
