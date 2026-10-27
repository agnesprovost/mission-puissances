(function(root){
'use strict';
const abs=x=>x<0n?-x:x;
function rational(n,d=1n){n=BigInt(n);d=BigInt(d);if(!d)throw Error('La division par zéro est impossible.');if(abs(n).toString(2).length>4096||abs(d).toString(2).length>4096)throw Error('Ce calcul dépasse la taille prise en charge par cet atelier.');let a=abs(n),b=abs(d);while(b)[a,b]=[b,a%b];const sign=d<0n?-1n:1n;return {n:sign*n/(a||1n),d:abs(d)/(a||1n)};}
function calc(op,a,b){if(op==='+')return rational(a.n*b.d+b.n*a.d,a.d*b.d);if(op==='-')return rational(a.n*b.d-b.n*a.d,a.d*b.d);if(op==='*')return rational(a.n*b.n,a.d*b.d);if(op==='/')return rational(a.n*b.d,a.d*b.n);if(b.d!==1n||b.n<0n||b.n>12n)throw Error('L’exposant doit être un entier de 0 à 12.');if(a.n===0n&&b.n===0n)throw Error('0⁰ n’est pas défini dans cette activité.');return rational(a.n**b.n,a.d**b.n);}
const format=x=>x.d===1n?String(x.n):`${x.n}/${x.d}`;
function parse(raw){const text=String(raw).replace(/\s/g,'').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/²/g,'^2').replace(/³/g,'^3');if(text.length>160)throw Error('Expression trop longue.');const ts=text.match(/\d+|[()+*/^\-]/g)||[];if(!text||ts.join('')!==text)throw Error('Utilise des nombres entiers, des parenthèses et + − × ÷ ^.');let i=0,id=0;const node=(type,data)=>({id:++id,type,...data});
 function atom(){let t=ts[i++];if(t==='('){const child=sum();if(ts[i++]!==')')throw Error('Il manque une parenthèse fermante.');return node('group',{child});}if(t&&/^\d+$/.test(t))return node('number',{value:rational(t)});throw Error('Un nombre ou une parenthèse est attendu.');}
 function power(){let a=atom();if(ts[i]==='^'){i++;a=node('binary',{op:'^',left:a,right:unary()});}return a;}
 function unary(){if(ts[i]==='-'||ts[i]==='+'){const sign=ts[i++];return sign==='-'?node('negative',{child:unary()}):unary();}return power();}
 function product(){let a=unary();while(ts[i]==='*'||ts[i]==='/'){const op=ts[i++];a=node('binary',{op,left:a,right:unary()});}return a;}
 function sum(){let a=product();while(ts[i]==='+'||ts[i]==='-'){const op=ts[i++];a=node('binary',{op,left:a,right:product()});}return a;}
 const tree=sum();if(i!==ts.length)throw Error('Vérifie les opérateurs et les parenthèses.');return clean(tree);
}
function clean(t){if(t.type==='number')return t;if(t.type==='binary')return {...t,left:clean(t.left),right:clean(t.right)};const child=clean(t.child);if(child.type==='number')return {id:t.id,type:'number',value:t.type==='negative'?rational(-child.value.n,child.value.d):child.value};return {...t,child};}
function evaluate(t){if(t.type==='number')return t.value;if(t.type==='negative'){const v=evaluate(t.child);return rational(-v.n,v.d);}if(t.type==='group')return evaluate(t.child);return calc(t.op,evaluate(t.left),evaluate(t.right));}
function operations(t){let rows=[];function walk(n,inside=false){if(n.type==='binary'){rows.push({node:n,inside,ready:n.left.type==='number'&&n.right.type==='number'});walk(n.left,inside);walk(n.right,inside);}else if(n.child)walk(n.child,inside||n.type==='group');}walk(t);return rows;}
const priority=op=>op==='^'?3:['*','/'].includes(op)?2:1;
function choices(t){
 // Work inside innermost parentheses before ranking operations. An outer
 // power must never hide the addition needed to calculate its grouped base.
 function groups(n){const nested=n.type==='binary'?[...groups(n.left),...groups(n.right)]:n.child?groups(n.child):[];return n.type==='group'&&!nested.length?[n.child]:nested;}
 const scopes=groups(t);
 return (scopes.length?scopes:[t]).flatMap(scope=>{const rows=operations(scope),p=Math.max(0,...rows.map(r=>priority(r.node.op)));return rows.filter(r=>r.ready&&priority(r.node.op)===p).map(r=>r.node.id);});
}
function transform(t,id){const row=operations(t).find(r=>r.node.id===id);if(!row)return {ok:false,message:'Choisis une opération dans l’expression.'};if(!choices(t).includes(id))return {ok:false,message:!row.ready?'Calcule d’abord les opérations contenues dans cette partie. À même priorité, avance de gauche à droite dans une chaîne.':operations(t).some(r=>r.inside)?'Traite d’abord le contenu des parenthèses.':'Cherche d’abord les puissances, puis les multiplications et divisions, avant les additions et soustractions.'};try{const value=calc(row.node.op,row.node.left.value,row.node.right.value);function replace(n){if(n.id===id)return {id:n.id,type:'number',value};if(n.type==='binary')return {...n,left:replace(n.left),right:replace(n.right)};return n.child?{...n,child:replace(n.child)}:n;}return {ok:true,tree:clean(replace(t)),message:'Cette opération respecte les priorités.'};}catch(e){return {ok:false,message:e.message};}}
const symbols={'+':'+','-':'−','*':'×','/':'÷','^':'^'};
function text(t){if(t.type==='number')return t.value.n<0n||t.value.d!==1n?`(${format(t.value)})`:format(t.value);if(t.type==='group')return `(${text(t.child)})`;if(t.type==='negative')return `−${text(t.child)}`;return `${text(t.left)} ${symbols[t.op]} ${text(t.right)}`;}
function generate(level,random=Math.random){const n=(a,b)=>a+Math.floor(random()*(b-a+1));const a=n(2,9),b=n(2,7),c=n(2,5);return level===1?`${a} + ${b} × ${c}`:level===2?`${a*c} ÷ ${c} × ${b} + (${a} − ${c})`:`−${a} × (−${b}) + (${c} + 2)^2`;}
const api={rational,calc,format,parse,evaluate,operations,choices,transform,text,generate,symbols};if(typeof module!=='undefined')module.exports=api;else root.Expressions=api;
})(typeof globalThis!=='undefined'?globalThis:this);
