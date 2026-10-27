const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../commun/expressions');
function solve(source){let t=E.parse(source),count=0;const expected=E.format(E.evaluate(t));while(t.type!=='number'){const before=E.text(t),ids=E.choices(t);assert(ids.length,source);const r=E.transform(t,ids[0]);assert(r.ok);assert.equal(E.text(t),before,'immutable');assert.equal(E.format(E.evaluate(r.tree)),expected);t=r.tree;assert(++count<100);}return E.format(t.value);}
for(const [s,v] of [['24 ÷ 12 × 3 + 5²','31'],['−2 × (−3) × (−4) − 8','-32'],['(8 × 2 + 1²) + 4','21'],['4 × 7⁰ + (6 + 4)²','104'],['-3^2','-9'],['(-3)^2','9'],['8/4*2','4'],['8-3+2','7'],['10/3','10/3'],['1/3+1/6','1/2'],['2^3^2','512'],['8+3*4','20'],['(8+3)*4','44'],['2*(3+(4*5))','46']])assert.equal(solve(s.replace('⁰','^0')),v,s);
let t=E.parse('24/12*3+5^2');const multiply=E.operations(t).find(r=>r.node.op==='*');assert(!E.transform(t,multiply.node.id).ok);const power=E.operations(t).find(r=>r.node.op==='^');assert(E.transform(t,power.node.id).ok);
assert.equal(E.choices(E.parse('2*3+4*5')).length,2,'independent valid choices');
t=E.parse('(2+3)+4^2');assert(E.choices(t).every(id=>E.operations(t).find(r=>r.node.id===id).inside));
for(const source of ['1/0','0^0','2^-1','2^13'])assert.throws(()=>E.evaluate(E.parse(source)));
for(const source of ['','alert(1)','2a','(2+3','2++','2.5','2;3'])assert.throws(()=>E.parse(source));
assert.equal(E.format(E.rational(9007199254740993n*3n,3n)),'9007199254740993');
let seed=73;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);for(const level of [1,2,3])for(let i=0;i<150;i++)solve(E.generate(level,random));
// Full controller: choose wrong operation, solve, undo, restart and generate.
class Element{constructor(){this.value='';this.children=[];this.style={};this.attrs={};this.disabled=false;}append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=[...nodes];}setAttribute(k,v){this.attrs[k]=v;}focus(){}querySelector(){return null;}}
const els={};const document={getElementById:id=>els[id]??=new Element(),createElement:()=>new Element()};document.getElementById('mode').value='comprendre';document.getElementById('level').value='1';const context={Expressions:E,document};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/priorites.js','utf8'),context);
function buttons(el){return el.children.flatMap(child=>[...(child.attrs?.['aria-label']?[child]:[]),...buttons(child)]);}
function select(label){const button=buttons(els.expression).find(b=>b.attrs['aria-label']===label);assert(button,label);button.onclick();els.calculate.onclick();}
select('Choisir 24 ÷ 12 × 3');assert.match(els.feedback.textContent,/d’abord/);assert(!els.retry.disabled);
select('Choisir 5 ^ 2');select('Choisir 24 ÷ 12');select('Choisir 2 × 3');select('Choisir 6 + 25');assert.match(els.feedback.textContent,/31/);assert(els.calculate.disabled);assert.equal(els.history.children.length,5);
els.undo.onclick();assert.equal(els.history.children.length,4);select('Choisir 6 + 25');els.restart.onclick();assert.equal(els.history.children.length,1);
els.demo.onclick();assert.equal(els.history.children.length,2);els.hint.onclick();assert(els['hint-text'].textContent);
els.source.value='1/0';els.custom.onsubmit({preventDefault(){}});assert.match(els.feedback.textContent,/zéro/);assert.equal(els.history.children.length,2);
els.new.onclick();assert.equal(els.history.children.length,1);els['tree-a'].onclick();els['tree-b'].onclick();assert.match(els['result-a'].textContent,/20/);assert.match(els['result-b'].textContent,/44/);
console.log('OK : calculs exacts, priorités, signes, parenthèses, 450 exercices reproductibles et parcours du contrôleur.');
