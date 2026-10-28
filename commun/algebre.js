(function(root){
'use strict';
const R=typeof module!=='undefined'?require('./expressions'):root.Expressions;
const zero=()=>R.rational(0),one=()=>R.rational(1);
function key(powers){return Object.keys(powers).sort().filter(v=>powers[v]).map(v=>v+(powers[v]===1?'':`^${powers[v]}`)).join('*');}
function powers(k){const out={};if(k)for(const term of k.split('*')){const [v,n='1']=term.split('^');out[v]=Number(n);}return out;}
function add(a,b,sign=1){const out=new Map(a);for(const [k,c] of b){const v=R.calc('+',out.get(k)||zero(),sign===1?c:R.rational(-c.n,c.d));if(v.n)out.set(k,v);else out.delete(k);}return out;}
function multiply(a,b){const out=new Map();for(const [ka,ca] of a)for(const [kb,cb] of b){const p=powers(ka);for(const [v,n] of Object.entries(powers(kb)))p[v]=(p[v]||0)+n;const k=key(p),c=R.calc('+',out.get(k)||zero(),R.calc('*',ca,cb));if(c.n)out.set(k,c);else out.delete(k);}if(out.size>100)throw Error('Cette expression comporte trop de termes pour cet atelier.');return out;}
function parse(raw){
 const text=String(raw).toLowerCase().replace(/\s/g,'').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/²/g,'^2').replace(/³/g,'^3');
 if(!text||text.length>180)throw Error('Écris une expression de moins de 180 caractères.');
 const tokens=text.match(/\d+|[a-z()+*/^\-]/g)||[];
 if(tokens.join('')!==text)throw Error('Utilise des nombres entiers, des lettres, des parenthèses et + − × ÷ ^.');
 let i=0;const num=n=>new Map(n.n?[['',n]]:[]);
 function atom(){const t=tokens[i++];if(t==='('){const x=sum();if(tokens[i++]!==')')throw Error('Vérifie les parenthèses.');return x;}if(t&&/^\d+$/.test(t))return num(R.rational(t));if(t&&/^[a-z]$/.test(t))return new Map([[t,one()]]);throw Error('Un nombre, une lettre ou une parenthèse est attendu.');}
 function power(){let a=atom();if(tokens[i]==='^'){i++;const exp=tokens[i++];if(!exp||!/^\d+$/.test(exp)||Number(exp)>6)throw Error('Utilise un exposant entier de 0 à 6.');if(!a.size&&Number(exp)===0)throw Error('0⁰ n’est pas défini dans cet atelier.');let b=num(one());for(let j=0;j<Number(exp);j++)b=multiply(b,a);a=b;}return a;}
 function unary(){if(tokens[i]==='+'){i++;return unary();}if(tokens[i]==='-'){i++;return multiply(num(R.rational(-1)),unary());}return power();}
 function product(){let a=unary();while(i<tokens.length){const op=tokens[i],implicit=/^(?:\d+|[a-z]|\()$/.test(op);if(!['*','/'].includes(op)&&!implicit)break;if(!implicit)i++;const b=unary();if(op==='/'){if(b.size!==1||!b.has('')||!b.get('').n)throw Error('La division est autorisée uniquement par une constante non nulle.');a=new Map([...a].map(([k,c])=>[k,R.calc('/',c,b.get(''))]));}else a=multiply(a,b);}return a;}
 function sum(){let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++];a=add(a,product(),op==='+'?1:-1);}return a;}
 const result=sum();if(i!==tokens.length)throw Error('Vérifie les signes et les parenthèses.');return result;
}
function equal(a,b){return !add(a,b,-1).size;}
function degree(k){return Object.values(powers(k)).reduce((a,b)=>a+b,0);}
function format(poly){const rows=[...poly].sort(([a],[b])=>degree(b)-degree(a)||a.localeCompare(b));if(!rows.length)return '0';return rows.map(([k,c],i)=>{const negative=c.n<0n,n=R.rational(negative?-c.n:c.n,c.d),coefficient=k&&n.n===n.d?'':R.format(n),letters=k.replace(/\*/g,'').replace(/\^2/g,'²').replace(/\^3/g,'³');return (i?(negative?' − ':' + '):(negative?'−':''))+coefficient+letters;}).join('');}
// A reduced answer may order its terms and variables freely, but has no repeated
// monomials, unevaluated coefficient products, parentheses or repeated variables.
function reduced(raw){const text=String(raw).toLowerCase().replace(/\s/g,'').replace(/−/g,'-').replace(/²/g,'^2').replace(/³/g,'^3');if(text==='0')return true;const terms=text.match(/[+-]?[^+-]+/g)||[];if(terms.join('')!==text||!terms.length)return false;const seen=new Set();for(const term of terms){const m=term.match(/^([+-]?)(?:(\d+(?:\/\d+)?))?((?:[a-z](?:\^[0-6])?)*)$/);if(!m||(!m[2]&&!m[3]))return false;const p={},letters=m[3].match(/[a-z](?:\^[0-6])?/g)||[];for(const letter of letters){const [v,n='1']=letter.split('^');if(p[v]||n==='0')return false;p[v]=Number(n);}if(m[2]){const [n,d=1n]=m[2].split('/').map(BigInt);if(!n||!d||(letters.length&&n===d))return false;const c=R.rational(n,d);if(c.n!==n||c.d!==d)return false;}const k=key(p);if(seen.has(k))return false;seen.add(k);}return true;}
function check(source,answer){try{const expected=parse(source),actual=parse(answer);return {valid:true,correct:equal(expected,actual),reduced:reduced(answer)};}catch(e){return {valid:false,message:e.message};}}
const families={reduire:'Termes semblables',produit:'Produits de monômes',distribuer:'Distributivité',signes:'Parenthèses et signes'};
function generate(kind,level=1,random=Math.random){const n=(a,b)=>a+Math.floor(random()*(b-a+1)),a=n(2,8),b=n(2,7),c=n(2,6);let source,steps,terms=[];
 if(kind==='reduire'){terms=level===1?[`${a}a`,`${b}b`,`${c}a`]:[`${a}a²`,`${b}a`,`−${c}a²`,`−${a}b`,`${c}b`];source=terms.join(' + ').replace(/\+ −/g,'− ');steps=[terms.slice().sort((x,y)=>x.replace(/[−\d]/g,'').localeCompare(y.replace(/[−\d]/g,''))).join(' + ').replace(/\+ −/g,'− '),format(parse(source))];}
 else if(kind==='produit'){source=level===1?`${a}a × ${b}a`:`−${a}a²b × ${b}ab`;steps=[level===1?`${a*b}a × a`:`−${a*b}a² × a × b × b`,format(parse(source))];}
 else if(kind==='distribuer'){source=level===1?`${a}(a + ${b})`:`${a}a²b(${b}a − ${c}bc)`;steps=[level===1?`${a} × a + ${a} × ${b}`:`${a}a²b × ${b}a − ${a}a²b × ${c}bc`,format(parse(source))];}
 else if(kind==='signes'){source=level===1?`−(${a}a − ${b})`:`${a}x(−${b}ax) − (−${c}ax + ${a}ax²)`;steps=[level===1?`−${a}a + ${b}`:`−${a*b}ax² + ${c}ax − ${a}ax²`,format(parse(source))];}
 else throw Error('Famille inconnue.');
 return {kind,level,source,terms,steps,answer:format(parse(source))};
}
const api={parse,equal,format,reduced,check,generate,families};if(typeof module!=='undefined')module.exports=api;else root.Algebre=api;
})(typeof globalThis!=='undefined'?globalThis:this);
