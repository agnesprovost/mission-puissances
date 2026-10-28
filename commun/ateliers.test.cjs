const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('./expressions'),A=require('./algebre'),W=require('./ateliers-moteur'),F=require('./figures');
// Independent expected polynomials from the supplied school examples.
for(const [source,answer] of [
 ['6a+3b-4a+5a-10b','7a-7b'],
 ['-3a^2*5-(-4)*7a+2a*8a','a^2+28a'],
 ['8a^2b(3a-4bc)','24a^3b-32a^2b^2c'],
 ['6x(-9ax)-(-11ax+4ax^2)','-58ax^2+11ax'],
 ['-(a-b)','-a+b'],['a*a','a^2'],['3a*2a','6a^2'],
 ['(a+b)^2','a^2+2ab+b^2'],['(1/3)a+(1/6)a','(1/2)a'],['a-a','0']
])assert(A.check(source,answer).correct,source);
assert(!A.check('3a+2a^2','5a^2').correct);
assert(!A.check('a+b','ab').correct);
for(const s of ['7a-7b','b+2a','-58ax²+11ax','0','3/2a','a²','ba'])assert(A.reduced(s),s);
for(const s of ['3a+2a','2*3a','a*a','3(a+2)','0a+2','2/4a','a^0','a/0','a+-b'])assert(!A.reduced(s),s);
for(const s of ['','a/0','a/b','a^-1','a^7','a=1','<script>','(a+b','a..b'])assert(!A.check('a',s).valid,s);
assert.equal(E.format(W.equation('-2x+7=9')),'-1');
assert.equal(E.format(W.equation('3x=10')),'10/3');
assert.equal(E.format(W.equation('16=4x+4')),'3');
assert(W.check({type:'equation',source:'16=4x+4'},'12=4x').correct);
assert(!W.check({type:'equation',source:'16=4x+4'},'12=4x').complete);
assert(W.check({type:'equation',source:'3x=10'},'x=20/6').complete);
assert(!W.check({type:'equation',source:'3x=10'},'x=3.33').complete);
assert(!W.check({type:'equation',source:'16=4x+4'},'16=4x').correct);
assert(!W.check({type:'equation',source:'16=4x+4'},'0=0').valid);
for(const answer of ['5(10t+7)','(5)(10t+7)'])assert(W.check({type:'factor',source:'50t+35'},answer).complete);
assert(!W.check({type:'factor',source:'50t+35'},'1(50t+35)').complete);
assert(!W.check({type:'factor',source:'50t+35'},'5(10t+6)').correct);
assert(W.check({type:'factor',source:'11nx-33n'},'11n(x-3)').complete);
for(const answer of ['s=3n+1','s=4+3(n-1)','2n+(n+1)=s'])assert(W.check({type:'formula',answer:'3n+1'},answer).complete);
assert(!W.check({type:'formula',answer:'3n+1'},'s=130').correct);
assert(!W.check({type:'formula',answer:'3n+1'},'s=3n').correct);
assert(!W.check({type:'formula',answer:'3n+1'},'3n+1').valid);
assert.equal(W.lcm(W.lcm(8,6),3),24);
for(const [input,expected] of [['3,0+0','3'],['−1,25+0,25','-1'],['1.5*2','3'],['2/0,5','4'],['0,1+0,2','3/10'],['.5 + ,5','1']])assert(W.check({type:'numeric',answer:expected},input).complete,input);
assert(!W.check({type:'numeric',answer:'30'},'3,0+0').correct,'decimal expressions must not be reinterpreted as concatenated integers');
for(const input of ['1,2,3','2.0.0','1,5/0','2,5a'])assert(!W.check({type:'numeric',answer:'1'},input).valid,input);
for(const sides of [3,4,5])for(let count=1;count<=7;count++){const edges=F.chain(sides,count);assert.equal(edges.length,(sides-1)*count+1);assert.equal(edges.filter(e=>e.new).length,count===1?0:sides-1);}
function answer(q){if(q.type==='coordinates')return {x:String(q.x),y:String(q.y)};if(q.type==='verify')return {left:q.left,right:q.right,conclusion:q.answer};if(q.type==='formula')return 's='+q.answer;if(q.type==='equation')return 'x='+q.answer;return q.answer;}
let seed=421;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);let count=0;
for(const [module,config] of Object.entries(W.modules))for(const kind of Object.keys(config.families))for(const level of [1,2])for(let i=0;i<40;i++){
 const q=W.generate(module,kind,level,random);const result=W.check(q,answer(q));assert(result.complete,`${module}/${kind}: ${q.source} -> ${JSON.stringify(result)}`);
 if(q.type==='polynomial')for(const step of q.steps)assert(A.check(q.source,step).correct,step);
 if(q.type==='equation')for(const step of q.steps)assert(W.check(q,step).correct,step);
 if(q.type==='factor')for(const step of q.steps)assert(A.check(q.source,step).correct,step);
 count++;
}
// Controller smoke tests for every family: real static IDs, dynamic fields and helpers.
for(const [module,config] of Object.entries(W.modules)){
 const nodes={};class Element{constructor(tag='div'){this.tag=tag;this.children=[];this.style={};this.attrs={};this.value='';this.hidden=false;this.disabled=false;this.checked=false;}set id(v){this._id=v;nodes[v]=this;}get id(){return this._id;}append(...xs){this.children.push(...xs);if(this.tag==='select'&&this.children.length===xs.length)this.value=xs[0]?.value||'';}replaceChildren(...xs){this.children=[];this.append(...xs);}setAttribute(k,v){this.attrs[k]=v;}querySelector(){return new Element();}focus(){}}
 const html=fs.readFileSync(`${__dirname}/../${module}/index.html`,'utf8');for(const [,id] of html.matchAll(/id="([^"]+)"/g)){const node=new Element();node.id=id;}
 nodes.mode.value='explorer';nodes.level.value='1';nodes['show-support'].checked=true;nodes.family.tag='select';
 const document={body:{dataset:{module}},getElementById:id=>{assert(nodes[id],`${module}: missing ${id}`);return nodes[id];},createElement:tag=>new Element(tag),createElementNS:(ns,tag)=>new Element(tag)};
 let current;const workshops={...W,generate(...args){current=W.generate(...args);return current;}};
 const context={Expressions:E,Algebre:A,Ateliers:workshops,Figures:F,Seances:{mount:()=>({active:()=>false,solved:()=>false,record(){},hint(){},demonstration(){},next(){}})},document};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/ateliers.js','utf8'),context);
 function fill(q){const a=answer(q);if(q.type==='coordinates'){nodes['coordinate-x'].value=a.x;nodes['coordinate-y'].value=a.y;}else if(q.type==='verify'){nodes.left.value=a.left;nodes.right.value=a.right;nodes.conclusion.value=a.conclusion;}else if(q.type==='order'){const bank=nodes['answer-fields'].children[0];for(const value of a)bank.children.find(b=>b.textContent===value).onclick();}else nodes.answer.value=a;}
 for(const kind of Object.keys(config.families)){nodes.family.value=kind;nodes.family.onchange();fill(current);nodes.form.onsubmit({preventDefault(){}});assert.equal(nodes.next.hidden,false,`${module}/${kind} completion`);nodes.hint.onclick();nodes.demonstration.onclick();assert(nodes['hint-text'].textContent);assert(nodes.steps.children.length);nodes.restart.onclick();assert.equal(nodes.next.hidden,true);}
}
console.log(`OK : ${count} exercices, équivalences exactes, étapes algébriques, figures partagées et parcours des huit ateliers.`);
