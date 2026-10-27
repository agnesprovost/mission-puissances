(function(root){
'use strict';
const pow=(a,n)=>`${a}<sup>${n}</sup>`;
const frac=(a,b)=>`<span class="math-fraction"><span>${a}</span><span>${b}</span></span>`;
const factors=(a,n,cancel=0)=>Array.from({length:n},(_,i)=>`<span class="factor ${i<cancel?'crossed':''}">${a}</span>`).join('<span aria-hidden="true"> × </span>')||'1';
const answer=(a,n)=>n<0?`1/${a}^${-n}`:n===0?'1':`${a}^${n}`;
const display=(a,n)=>n<0?frac('1',pow(a,-n)):n===0?'1':pow(a,n);
const step=(text,html)=>({text,html});
function lowerBase(a,n){for(let base=2;base<=Math.sqrt(a);base++){let value=base,power=1;while(value<a){value*=base;power++;}if(value===a)return {base,exponent:n*power};}return {base:a,exponent:n};}
function generate(kind,random=Math.random){
 if(['signes','signes-produits','signes-quotients','equation-lineaire','equation-fraction'].includes(kind))return advanced(kind,random);
 const r=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1));
 const a=r(2,7),n=r(2,5),m=r(2,5),k=r(1,6);let q={kind,a,n,m,k};
 if(kind==='produit'||kind==='quotient'||kind==='combine'){
  const top=kind==='produit'?n+m:kind==='combine'?n*m:n, bottom=kind==='produit'?0:k;
  const exponent=top-bottom, cancelled=Math.min(top,bottom);
  q.prompt=kind==='produit'?`${pow(a,n)} × ${pow(a,m)}`:kind==='quotient'?frac(pow(a,n),pow(a,k)):frac(`(${pow(a,n)})<sup>${m}</sup>`,pow(a,k));
  q.answer=answer(a,exponent);q.hint=bottom?'Développe le haut et le bas. Une paire de facteurs identiques se simplifie en 1.':'Compte les facteurs de même base dans les deux produits.';
  q.steps=[step('Développons les puissances en facteurs répétés.',bottom?frac(factors(a,top),factors(a,bottom)):factors(a,top)),...(bottom?[step('Simplifions une paire du haut et du bas à la fois.',frac(factors(a,top,cancelled),factors(a,bottom,cancelled)))]:[]),step(exponent<0?`Il reste ${-exponent} facteurs en bas, et 1 en haut.`:exponent===0?'Tous les facteurs se simplifient : il reste 1.':`Il reste ${exponent} facteurs au numérateur.`,display(a,exponent))];
 }else if(kind==='puissance'){
  q.prompt=`(${pow(a,n)})<sup>${m}</sup>`;q.answer=answer(a,n*m);q.hint='Combien de groupes ? Combien de facteurs dans chaque groupe ?';
  q.steps=[step(`Il y a ${m} groupes identiques.`,Array.from({length:m},()=>`<span class="factor-group">${factors(a,n)}</span>`).join(' × ')),step(`En ouvrant les groupes, on obtient ${n} × ${m} facteurs.`,factors(a,n*m)),step('Regroupons ce produit en une puissance.',pow(a,n*m))];
 }else if(kind==='paires'){
  const b=r(2,9);q.b=b;q.prompt=`${pow(a,n)} × ${pow(b,n)}`;q.answer=answer(a*b,n);q.hint='Les exposants sont identiques : associe un facteur de chaque base.';
  q.steps=[step('Développons les deux produits.',`${factors(a,n)} × ${factors(b,n)}`),step('Réordonnons pour former des paires.',Array.from({length:n},()=>`<span class="factor-group">${a} × ${b}</span>`).join(' × ')),step(`Chaque paire vaut ${a*b}. Il y en a ${n}.`,pow(a*b,n))];
 }else if(kind==='equation'||kind==='equation-puissance'){
  const product=kind==='equation-puissance',target=product?n*m:n+m;q.prompt=product?`(${pow(a,n)})<sup>?</sup> = ${pow(a,target)}`:`${pow(a,n)} × ${a}<sup>?</sup> = ${pow(a,target)}`;q.answer=String(m);q.unknown=true;q.hint=product?'Le nombre de groupes multiplié par les facteurs par groupe doit donner l’exposant de droite.':'Combien de facteurs faut-il ajouter à ceux de gauche pour obtenir le produit de droite ?';
  q.steps=[step(`À droite, il y a ${target} facteurs ${a}.`,factors(a,target)),step(product?`Rangeons-les en groupes de ${n} facteurs.`:`Séparons les ${n} facteurs déjà connus.`,product?Array.from({length:m},()=>`<span class="factor-group">${factors(a,n)}</span>`).join(' × '):`<span class="factor-group">${factors(a,n)}</span> × <span class="factor-group">${factors(a,m)}</span>`),step(product?`On compte ${m} groupes : l’exposant manquant est ${m}.`:`Il manque ${target} − ${n} = ${m} facteurs.`, `? = ${m}`)];
 }else if(kind==='scientifique'){
  const c=r(11,99)/10,e=r(-5,6);q.coefficient=c;q.exponent=e;const value=Number((c*10**e).toPrecision(12));q.prompt=value.toLocaleString('fr-BE',{maximumFractionDigits:8});q.answer=`${c}*10^${e}`;q.hint='Le premier nombre doit être entre 1 inclus et 10 exclu. Chaque déplacement de virgule est compensé par une puissance de 10.';
  q.steps=[step('Partons du nombre, avec une puissance de 10 égale à 1.',`${q.prompt} × 10<sup>0</sup>`)];
  for(let i=1;i<=Math.abs(e);i++){const shift=Math.sign(e)*i,co=Number((value/10**shift).toPrecision(12));q.steps.push(step(e>0?'Divisons le premier nombre par 10 et augmentons l’exposant de 1.':'Multiplions le premier nombre par 10 et diminuons l’exposant de 1.',`${co.toLocaleString('fr-BE',{maximumFractionDigits:8})} × ${pow(10,shift)}`));}
  q.steps.push(step('Le premier nombre est entre 1 inclus et 10 exclu.',`${String(c).replace('.',',')} × ${pow(10,e)}`));
 }else throw Error('Type inconnu');
 if(!q.unknown&&q.kind!=='scientifique'){
  const match=q.answer.match(/^(1\/)?(\d+)\^(\d+)$/);
  if(match){const reduced=lowerBase(Number(match[2]),Number(match[3]));q.answer=answer(reduced.base,match[1]?-reduced.exponent:reduced.exponent);if(reduced.base!==Number(match[2]))q.steps.push(step(`La base ${match[2]} est elle-même une puissance : ${reduced.base} répété ${Number(match[3])?reduced.exponent/Number(match[3]):1} fois. On réduit encore la base.`,display(reduced.base,match[1]?-reduced.exponent:reduced.exponent)));}
 }
 return q;
}
const kinds=['produit','quotient','combine','puissance','paires','equation','equation-puissance','scientifique'];
const levels={1:['produit','quotient','puissance','paires'],2:['produit','quotient','combine','equation','scientifique','signes','signes-produits'],3:['combine','equation-puissance','signes','signes-produits','signes-quotients','equation-lineaire','equation-fraction']};
function session(count,random=Math.random,level){const pool=levels[level]||kinds,list=[],seen=new Set();for(let i=0;i<count;i++){let q,tries=0;do{q=generate(pool[i%pool.length],random);}while(seen.has(q.prompt)&&++tries<200);seen.add(q.prompt);list.push(q);}for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
function advanced(kind,random){
 const r=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1));
 const signed=()=>{const a=r(2,8),n=r(2,6),inside=r(0,1)===1;return {a,n,inside,html:inside?pow('(−'+a+')',n):'−'+pow('('+a+')',n),value:inside?(-a)**n:-(a**n)};};
 const term=signed(),other=signed(),q={kind,numeric:true};
 const explain=t=>t.inside?('Le signe moins est dans les parenthèses : '+t.n+' facteurs négatifs. Un nombre '+(t.n%2?'impair donne un résultat négatif.':'pair donne un résultat positif.')):'Le signe moins est devant la puissance : on calcule la puissance de la base positive, puis on prend son opposé.';
 const expanded=t=>t.inside?Array.from({length:t.n},()=>'<span class="factor">(−'+t.a+')</span>').join(' × '):'−('+factors(t.a,t.n)+')';
 const reduce=(a,b)=>{if(b<0){a=-a;b=-b;}let u=Math.abs(a),v=b;while(v){[u,v]=[v,u%v];}a/=u;b/=u;return b===1?String(a):a+'/'+b;};
 if(kind==='signes'){
  q.prompt=term.html;q.answer=String(term.value);q.hint=explain(term);
  q.steps=[step(explain(term),expanded(term)),step('Comptons les facteurs négatifs avant de calculer la valeur.',term.html+' = '+term.value)];
 }else if(kind==='signes-produits'||kind==='signes-quotients'){
  const quotient=kind==='signes-quotients';q.prompt=quotient?frac(term.html,other.html):term.html+' × ('+other.html+')';q.answer=quotient?reduce(term.value,other.value):String(term.value*other.value);q.hint='Commence par regarder si chaque signe moins est dans ou devant les parenthèses. Puis applique la règle des signes au produit ou au quotient.';
  q.steps=[step('Première puissance : '+explain(term),expanded(term)+' = '+term.value),step('Deuxième puissance : '+explain(other),expanded(other)+' = '+other.value),step('Deux signes identiques donnent un résultat positif ; deux signes différents donnent un résultat négatif.',quotient?frac(String(term.value),String(other.value)):String(term.value)+' × ('+other.value+')'),step(quotient?'Réduisons la fraction, avec un dénominateur positif.':'Calculons le produit en conservant le bon signe.',q.answer.includes('/')?frac(...q.answer.split('/')):q.answer)];
 }else{
  const x=r(-9,12),quotient=kind==='equation-fraction';q.variable='x';q.answer=String(x);
  q.prompt=quotient?frac('x',term.html)+' = '+x:term.html+' × x = '+term.value*x;
  q.hint=quotient?'Calcule la puissance et son signe, puis multiplie les deux côtés par le dénominateur.':'Calcule la puissance et son signe, puis divise les deux côtés par ce coefficient.';
  if(quotient){q.answer=String(x*term.value);q.steps=[step(explain(term),expanded(term)+' = '+term.value),step('Multiplions les deux côtés par le même nombre non nul.','x = '+x+' × ('+term.value+')'),step('Appliquons la règle des signes.','x = '+q.answer)];}
  else q.steps=[step(explain(term),expanded(term)+' = '+term.value),step('Divisons les deux côtés par le coefficient non nul.','x = '+frac(String(term.value*x),String(term.value))),step('Appliquons la règle des signes.','x = '+x)];
 }
 return q;
}
// A deliberately small grammar: integers, positive powers, reciprocal powers,
// decimal values and scientific notation. No evaluation of user-provided code.
function parse(raw){const s=raw.toLowerCase().replace(/\s/g,'').replace(/,/g,'.').replace(/[×·x]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/²/g,'^2').replace(/³/g,'^3');let match;
 if((match=s.match(/^(\d+(?:\.\d+)?)\*10\^([+-]?\d{1,2})$/))){const e=Number(match[2]);if(Math.abs(e)>30)return null;const dec=decimal(match[1]);return e>=0?[dec[0]*10n**BigInt(e),dec[1]]:[dec[0],dec[1]*10n**BigInt(-e)];}
 if(s.length<=100&&/^\d{1,4}(?:\^\d{1,3})?(?:[+-]\d{1,4}(?:\^\d{1,3})?)+$/.test(s)){const tokens=s.split(/([+-])/);let value=parse(tokens[0]);if(!value)return null;for(let i=1;i<tokens.length;i+=2){const part=parse(tokens[i+1]);if(!part)return null;value=[value[0]*part[1]+(tokens[i]==='+'?1n:-1n)*part[0]*value[1],value[1]*part[1]];}return value;}
 if((match=s.match(/^(1\/)?(\d{1,4})(?:\^(\d{1,3}))?$/))){const a=BigInt(match[2]),n=Number(match[3]??1);if(n>120||a===0n&&match[1])return null;const value=a**BigInt(n);return match[1]?[1n,value]:[value,1n];}
 if(s.length<=100&&/^\d{1,4}(?:\^\d{1,3})?(?:[*/]\d{1,4}(?:\^\d{1,3})?)+$/.test(s)){const tokens=s.split(/([*/])/);let value=parse(tokens[0]);if(!value)return null;for(let i=1;i<tokens.length;i+=2){const part=parse(tokens[i+1]);if(!part||tokens[i]==='/'&&part[0]===0n)return null;value=tokens[i]==='*'?[value[0]*part[0],value[1]*part[1]]:[value[0]*part[1],value[1]*part[0]];}return value;}
 if(/^\d{1,16}\.\d{1,12}$/.test(s))return decimal(s);return expression(s);
}
function expression(s){if(s.length>100||!/^[\d.+*/^()\-]+$/.test(s))return null;let i=0;const add=(a,b,sign=1n)=>[a[0]*b[1]+sign*b[0]*a[1],a[1]*b[1]];
 function atom(){if(s[i]==='('){i++;const value=sum();if(s[i++]!==')')throw Error();return value;}const match=s.slice(i).match(/^\d{1,16}(?:\.\d{1,12})?/);if(!match)throw Error();i+=match[0].length;return decimal(match[0]);}
 function power(){let v=atom();if(s[i]==='^'){i++;const match=s.slice(i).match(/^-?\d{1,3}/);if(!match)throw Error();i+=match[0].length;const n=Number(match[0]);if(Math.abs(n)>120||n<0&&(v[0]!==10n||v[1]!==1n))throw Error();v=n<0?[v[1]**BigInt(-n),v[0]**BigInt(-n)]:[v[0]**BigInt(n),v[1]**BigInt(n)];}return v;}
 function signed(){if(s[i]==='-'||s[i]==='+'){const sign=s[i++];const v=signed();return sign==='-'?[-v[0],v[1]]:v;}return power();}
 function product(){let v=signed();while(s[i]==='*'||s[i]==='/'){const op=s[i++],b=signed();if(op==='/'&&b[0]===0n)throw Error();v=op==='*'?[v[0]*b[0],v[1]*b[1]]:[v[0]*b[1],v[1]*b[0]];}return v;}
 function sum(){let v=product();while(s[i]==='+'||s[i]==='-'){const op=s[i++];v=add(v,product(),op==='+'?1n:-1n);}return v;}
 try{const value=sum();return i===s.length&&value[1]!==0n?value:null;}catch{return null;}}
function decimal(s){const [a,b='']=s.split('.');return [BigInt(a+b),10n**BigInt(b.length)];}
function check(q,raw){if(raw.length>100)return {valid:false};raw=raw.replace(/−/g,'-');if(raw.includes('=')){const sides=raw.split('=');if(sides.length!==2||sides.some(s=>!s.trim()))return {valid:false};if(q.variable){if(sides[0].trim()!==q.variable)return {valid:false};}else if(q.unknown){if(!/^\s*\?\s*$/.test(sides[0]))return {valid:false};}else{const left=parse(sides[0]),expected=parse(q.answer);if(!left)return {valid:false};if(left[0]*expected[1]!==expected[0]*left[1])return {valid:true,correct:false};}raw=sides[1];}raw=raw.trim().replace(/^\+/,'');if(q.unknown){if(!/^\s*\d{1,2}\s*$/.test(raw))return {valid:false};return {valid:true,correct:Number(raw)===Number(q.answer)};}
 const value=parse(raw),expected=parse(q.answer);if(!value)return {valid:false};if(q.kind==='scientifique'){const match=raw.replace(/\s/g,'').replace(',','.').match(/^(\d+(?:\.\d+)?)[*×·xX]10\^([+-]?\d{1,2})$/);if(!match||Number(match[1])<1||Number(match[1])>=10)return {valid:true,correct:false};}
 const correct=value[0]*expected[1]===expected[0]*value[1];
 const normalized=raw.replace(/\s/g,'').replace(/÷/g,'/').replace(/²/g,'^2').replace(/³/g,'^3').replace(/\(([-+]?\d+(?:\^\d+)?)\)/g,'$1');
 return {valid:true,correct,reduced:q.kind==='scientifique'||normalized===q.answer||q.answer.endsWith('^1')&&normalized===q.answer.slice(0,-2)};}
const api={generate,session,check,parse,kinds,levels};if(typeof module!=='undefined')module.exports=api;else root.Defis=api;
})(typeof globalThis!=='undefined'?globalThis:this);
