const assert=require('node:assert/strict'),E=require('./exercices-plus'),D=require('./defis-moteur'),I=require('../commun/intuition');
const same=(a,b)=>a[0]*b[1]===b[0]*a[1];
const power=(p,d,n,answer)=>({form:'fraction-power',power:{numerator:p,denominator:d,exponent:n},answer});
const square=power(11,10,2,'(11/10)^2'),negative=power(1,2,5,'(-1/2)^5');
for(const answer of ['(11/10)^2','((11)/(10))^2','(-11/10)^2']){const r=D.check(square,answer);assert(r.correct&&r.reduced,answer);}
assert(D.check(square,'121/100').correct);assert(!D.check(square,'121/100').reduced);assert(!D.check(square,'11^2/10^2').reduced);assert(!D.check(square,'(10/11)^2').correct);
for(const answer of ['(-1/2)^5','-(1/2)^5','1/(-2)^5','-1/2^5'])assert(D.check(negative,answer).correct&&D.check(negative,answer).reduced,answer);
assert.equal(E.preferredFractionPower(-1,2,5),'-1/2^5');assert.equal(E.preferredFractionPower(-1,2,4),'1/2^4');assert.equal(E.preferredFractionPower(1,3,3),'1/3^3');assert.equal(E.preferredFractionPower(-2,1,3),'-2^3');assert.equal(E.preferredFractionPower(2,3,1),'2/3');
const even=power(1,2,4,'1/2^4');assert(D.check(even,'(-1/2)^4').correct&&D.check(even,'(-1/2)^4').reduced);assert(!D.check(even,'-1/2^4').correct);
assert(!D.check(negative,'(1/2)^5').correct);assert(!D.check(negative,'-1/32').reduced);
const reciprocal=power(1,3,3,'-1/3^3');assert(D.check(reciprocal,'1/(-3)^3').reduced);assert(D.check(reciprocal,'1/(-3)^3').correct);
assert.deepEqual(I.classify(negative.answer,D.parse),{magnitude:'less',sign:'negative'});
assert.deepEqual(I.classify(square.answer,D.parse),{magnitude:'greater',sign:'positive'});
const phrases=[['-(-3)^3',27],['3*(-5)^2',75],['-(2*3^3)',-54],['(-(2*3))^2',36],['2*(-(3^2))',-18]];
for(const [expression,value] of phrases){assert.equal(Number(E.evaluate(E.tree(expression))[0]),value);const q={form:'translation',expression,answer:String(value)};assert(D.check(q,expression).correct&&D.check(q,expression).reduced);assert(D.check(q,String(value)).correct);assert(!D.check(q,String(value)).reduced);}
assert(D.check({form:'translation',expression:'3*(-5)^2',answer:'75'},'(-5)^2 × 3').reduced);
assert(D.check({form:'translation',expression:'3*(-5)^2',answer:'75'},'3(-5)^2').reduced);
assert(D.check({form:'translation',expression:'-(2*3^3)',answer:'-54'},'-2*3^3').reduced);
assert(!D.check({form:'translation',expression:'-(-3)^3',answer:'27'},'3^3').reduced);
assert(!D.check({form:'translation',expression:'(-(2*3))^2',answer:'36'},'-2*3^2').correct);
assert.equal(E.tree('alert(1)'),null);assert.equal(E.tree('2^(-3)'),null);assert.equal(E.tree('a+2'),null);assert.throws(()=>E.evaluate(E.tree('1/0')));
assert.throws(()=>E.evaluate(E.tree('((2^30)^30)^30')));
let seed=705;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};let less=0,greater=0,equal=0;
for(const kind of E.kinds)for(let i=0;i<160;i++){
 const q=D.generate(kind,random),answer=q.form==='translation'?q.expression:q.answer,result=D.check(q,answer);assert(result.valid&&result.correct&&result.reduced!==false,kind+' '+answer);assert(q.steps.length>=2);assert(q.steps.every(s=>!/<sup>−?-[0-9]/.test(s.html)));
 const prediction=I.classify(q.answer,D.parse);assert(prediction,kind);if(prediction.magnitude==='less')less++;if(prediction.magnitude==='equal')equal++;if(prediction.magnitude==='greater')greater++;
 if(q.expression){const numeric=q.expression.replace(/[ab]/g,c=>`(${q.assignments?.[c]})`);const expected=D.parse(numeric),actual=D.parse(q.answer);assert(expected&&actual,kind+' '+numeric);assert(same(expected,actual),kind+' '+q.expression);}
 if(kind==='equation-bases'){assert(/^[1-9]\d*$/.test(q.answer));assert(q.unknown);}
}
assert(less>100&&greater>100&&equal>10);
// Every visual reduction preserves the value and finishes within the step budget.
for(const expression of ['2*3^2+4*2','2*(3^2-1)+4*5','-(-3)^2+4*(3^2-1)','((-3)^3+2)/4+2*3^2']){
 let current=E.tree(expression),expected=D.parse(expression),step,count=0;while((step=E.nextStep(current))){assert(same(E.evaluate(step.tree),expected));current=step.tree;assert(++count<24);}assert(same(E.evaluate(current),expected));
}
assert.equal(E.nextStep(E.tree('2*3^2+4*2')).focus[0],'pow');
assert.equal(E.nextStep(E.tree('2*(3+1)+4*5')).focus[0],'add');
for(const [expression,answer] of E.prioritySamples.map((expression,i)=>[expression,[-168,35,36,-32][i]])){
 const parsed=E.tree(expression);assert.equal(E.text(E.evaluate(parsed)),String(answer));assert(same(E.evaluate(parsed),D.parse(expression)));
 const steps=E.worked(parsed);assert(steps.at(-1).html.includes('number-line'));assert(steps.at(-1).html.includes(`On arrive à ${answer}.`));
 let current=parsed,next;while((next=E.nextStep(current))){current=next.tree;assert.equal(E.text(E.evaluate(current)),String(answer));}
}
assert.equal(E.text(E.evaluate(E.tree('12/3*2'))),'8');
assert.equal(E.nextStep(E.tree('12/3*2')).focus[0],'div');
assert(E.worked(E.tree('-96+64')).at(-1).html.includes('vers la droite'));
assert(E.worked(E.tree('-120-48')).at(-1).html.includes('vers la gauche'));
const observed=new Set();for(let i=0;i<400;i++)observed.add(E.create('priorites-puissances',random).expression);for(const expression of E.prioritySamples)assert(observed.has(expression));
for(const level of [1,2,3,4,5])for(const count of [20,50,100]){
 const rows=D.session(count,random,level);assert.equal(rows.length,count);assert.equal(new Set(rows.map(q=>q.prompt)).size,count);
 assert.equal(rows.some(q=>['fraction-vers-puissance','puissance-fraction','fractions-puissances'].includes(q.kind)),level===5);if(level>=2&&level<=4)assert(rows.some(q=>q.kind.startsWith('phrase-')));
 for(const q of rows){const r=D.check(q,q.form==='translation'?q.expression:q.answer);assert(r.correct&&r.reduced!==false,q.kind);}
}
console.log('OK : 1 440 nouveaux exercices, fractions comme puissances, traductions non calculées, signes, comparaisons à 1, équations, priorités visuelles et séries enrichies.');
console.log('OK : quatre exemples de priorités, résultats −168 / 35 / 36 / −32, division puis multiplication de gauche à droite et droite graduée finale.');
