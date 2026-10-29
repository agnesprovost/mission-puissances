(function(root){
'use strict';
const pow=(a,n)=>`${a}<sup>${n}</sup>`,frac=(a,b)=>`<span class="math-fraction"><span>${a}</span><span>${b}</span></span>`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prioritySamples=['-8*(17-2)-(21-5)*3','12/3*2+3*(5-8)^2','2*3^2+(4-1)^2+3*(5-2)','4-5*(2^3+4*3)+(-8)^2'];
function gcd(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b)[a,b]=[b,a%b];return a;}
function rat(n,d=1n){if(!d)throw Error('Dénominateur nul');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return [n/g,d/g];}
const text=v=>v[1]===1n?String(v[0]):`${v[0]}/${v[1]}`;
const val=v=>['val',String(v[0]),String(v[1])];
const nodeValue=t=>t[0]==='val'?rat(BigInt(t[1]),BigInt(t[2])):t[0]==='num'?rat(BigInt(t[1])):null;
function preferredFractionPower(p,d,n){if(n===0)return '1';if(n===1)return text(rat(BigInt(p),BigInt(d)));const negative=p<0&&n%2===1,sign=negative?'-':'';if(Math.abs(p)===1)return `${sign}1/${d}^${n}`;if(d===1)return `${sign}${Math.abs(p)}^${n}`;return `(${p}/${d})^${n}`;}
function tree(raw,{variables=false}={}){
 const s=String(raw).replace(/\s/g,'').replace(/[×·xX]/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/²/g,'^2').replace(/³/g,'^3');
 if(s.length>100||!s||!(variables?/^[\d+*/^()ab-]+$/:/^[\d+*/^()-]+$/).test(s))return null;let i=0;
 function atom(){if(s[i]==='('){i++;const v=sum();if(s[i++]!==')')throw Error();return v;}if(variables&&/[ab]/.test(s[i]||''))return ['var',s[i++]];const m=s.slice(i).match(/^\d{1,16}/);if(!m)throw Error();i+=m[0].length;return ['num',String(BigInt(m[0]))];}
 function power(){let v=atom();if(s[i]==='^'){i++;const m=s.slice(i).match(/^\d{1,2}/);if(!m||Number(m[0])>30)throw Error();i+=m[0].length;v=['pow',v,Number(m[0])];}return v;}
 function signed(){if(s[i]==='-'||s[i]==='+'){const sign=s[i++],v=signed();return sign==='-'?['neg',v]:v;}return power();}
 function product(){let v=signed();while(s[i]==='*'||s[i]==='/'||s[i]==='('||variables&&/[ab]/.test(s[i]||'')){const explicit=s[i]==='*'||s[i]==='/',op=explicit?s[i++]:'*';v=[op==='*'?'mul':'div',v,signed()];}return v;}
 function sum(){let v=product();while(s[i]==='+'||s[i]==='-'){const op=s[i++];v=[op==='+'?'add':'sub',v,product()];}return v;}
 try{const result=sum();return i===s.length?result:null;}catch{return null;}
}
function evaluate(t,variables={}){
 if(!t)throw Error('Expression incorrecte');const value=nodeValue(t);if(value)return value;
 if(t[0]==='var'){if(!Object.hasOwn(variables,t[1]))throw Error('Variable inconnue');return rat(BigInt(variables[t[1]]));}
 const a=evaluate(t[1],variables);if(t[0]==='neg')return [-a[0],a[1]];
 if(t[0]==='pow'){if(Math.max(a[0].toString(2).length,a[1].toString(2).length)*t[2]>4096)throw Error('Expression trop grande');return rat(a[0]**BigInt(t[2]),a[1]**BigInt(t[2]));}
 const b=evaluate(t[2],variables);
 if(t[0]==='mul')return rat(a[0]*b[0],a[1]*b[1]);if(t[0]==='div')return rat(a[0]*b[1],a[1]*b[0]);
 return rat(a[0]*b[1]+(t[0]==='add'?1n:-1n)*b[0]*a[1],a[1]*b[1]);
}
function html(t){if(t.highlight)return `<mark class="operation-focus">${html(t.slice())}</mark>`;const value=nodeValue(t);if(value)return value[1]===1n?String(value[0]).replace('-','−'):frac(String(value[0]).replace('-','−'),String(value[1]));if(t[0]==='var')return t[1];if(t[0]==='neg')return ['num','pow'].includes(t[1][0])?`−${html(t[1])}`:`−(${html(t[1])})`;if(t[0]==='pow'){const base=t[1],simple=base[0]==='var'||base[0]==='num'&&BigInt(base[1])>=0n;return pow(simple?html(base):`(${html(base)})`,t[2]);}if(t[0]==='div')return frac(html(t[1]),html(t[2]));const sign={mul:'×',add:'+',sub:'−'}[t[0]];const part=v=>['add','sub'].includes(v[0])||v[0]==='neg'?`(${html(v)})`:html(v);return `${part(t[1])} ${sign} ${part(t[2])}`;}
function substitute(t,values){if(t[0]==='var')return ['num',String(values[t[1]])];if(['num','val'].includes(t[0]))return t;return t[0]==='pow'?['pow',substitute(t[1],values),t[2]]:t[0]==='neg'?['neg',substitute(t[1],values)]:[t[0],substitute(t[1],values),substitute(t[2],values)];}
function reduceOne(t){
 const candidates=[],precedence={neg:3,pow:3,mul:2,div:2,add:1,sub:1};
 function visit(node,boost=0){if(['num','val','var'].includes(node[0]))return;const unary=node[0]==='pow'||node[0]==='neg';if(nodeValue(node[1])&&(unary||nodeValue(node[2]))){candidates.push({node,rank:boost+precedence[node[0]]});return;}for(const index of unary?[1]:[1,2]){const child=node[index],compound=!['num','val','var'].includes(child[0]);const grouped=compound&&(node[0]==='pow'||node[0]==='neg'||node[0]==='div'||node[0]==='mul'&&['add','sub'].includes(child[0]));visit(child,boost+(grouped?10:0));}}
 visit(t);if(!candidates.length)return null;candidates.sort((a,b)=>b.rank-a.rank);const focus=candidates[0].node;
 function replace(node){if(node===focus)return val(evaluate(node));if(['num','val','var'].includes(node[0]))return node;return node[0]==='pow'?[node[0],replace(node[1]),node[2]]:node[0]==='neg'?[node[0],replace(node[1])]:[node[0],replace(node[1]),replace(node[2])];}
 const messages={neg:'Prendre l’opposé change le signe de tout le groupe.',pow:'Calculer cette puissance avant les produits et sommes extérieurs.',mul:'Effectuer cette multiplication et appliquer la règle des signes.',div:'Effectuer cette division et réduire la fraction.',add:'Additionner les termes restants.',sub:'Soustraire en conservant les signes et les parenthèses.'};return {tree:replace(t),text:messages[focus[0]],focus};
}
function marked(t,focus){if(t===focus){const copy=t.slice();copy.highlight=true;return copy;}if(['num','val','var'].includes(t[0]))return t;return t[0]==='pow'?[t[0],marked(t[1],focus),t[2]]:t[0]==='neg'?[t[0],marked(t[1],focus)]:[t[0],marked(t[1],focus),marked(t[2],focus)];}
function numberLine(t){if(!['add','sub'].includes(t[0]))return '';const a=nodeValue(t[1]),b=nodeValue(t[2]);if(!a||!b||a[1]!==1n||b[1]!==1n)return '';const start=Number(a[0]),delta=Number(b[0])*(t[0]==='sub'?-1:1),end=start+delta;if(Math.max(Math.abs(start),Math.abs(delta),Math.abs(end))>10000)return '';const min=Math.min(0,start,end),max=Math.max(0,start,end),span=Math.max(1,max-min),x=v=>45+(v-min)/span*470,arrow=delta>0?-1:1;const message=`On part de ${start}. ${t[0]==='add'?'Ajouter':'Soustraire'} ${b[0]} ${delta===0?'ne déplace pas le point':`fait avancer de ${Math.abs(delta)} vers la ${delta>0?'droite':'gauche'}`}. On arrive à ${end}.`;return `<figure class="number-line"><figcaption>${message}</figcaption><svg viewBox="0 0 560 110" role="img" aria-label="${esc(message)}"><line x1="28" y1="65" x2="535" y2="65" stroke="#687189" stroke-width="2"/>${Array.from(new Set([0,start,end])).map(v=>`<line x1="${x(v)}" y1="59" x2="${x(v)}" y2="72" stroke="#687189"/><text x="${x(v)}" y="96" text-anchor="middle">${v}</text>`).join('')}<line x1="${x(start)}" y1="35" x2="${x(end)}" y2="35" stroke="#4154bc" stroke-width="3"/>${delta?`<path d="M${x(end)+arrow*8} 29 L${x(end)} 35 L${x(end)+arrow*8} 41" fill="none" stroke="#4154bc" stroke-width="3"/>`:''}<circle cx="${x(start)}" cy="65" r="5" fill="#4154bc"/><circle cx="${x(end)}" cy="65" r="6" fill="#206f39"/><text x="${(x(start)+x(end))/2}" y="22" text-anchor="middle">${delta>=0?'+':''}${delta}</text></svg></figure>`;}
function worked(t,values){const steps=[];let current=t;if(values){current=substitute(t,values);steps.push({text:'Remplacer chaque lettre par sa valeur, entre parenthèses si elle est négative.',html:html(current)});}let next,limit=24;while(limit--&&(next=reduceOne(current))){const before=html(marked(current,next.focus)),line=next.focus===current?numberLine(next.focus):'';current=next.tree;steps.push({text:next.text,html:`<div class="work-before">${before}</div><div class="work-after">→ ${html(current)}</div>${line}`});}return steps;}
// Preserve the requested operations for a translation, while accepting redundant
// parentheses, rearranged products and an outside minus written as × (−1).
function canonical(t){
 if(t[0]==='num')return ['num',String(BigInt(t[1]))];
 if(t[0]==='neg'||t[0]==='mul'){
  let coefficient=1n;const factors=[];
  function collect(v){if(v[0]==='neg'){coefficient=-coefficient;collect(v[1]);}else if(v[0]==='mul'){collect(v[1]);collect(v[2]);}else if(v[0]==='num')coefficient*=BigInt(v[1]);else factors.push(canonical(v));}
  collect(t);factors.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));if(!factors.length)return ['num',String(coefficient)];if(coefficient===1n&&factors.length===1)return factors[0];return ['product',String(coefficient),...factors];
 }
 if(t[0]==='pow')return ['pow',canonical(t[1]),t[2]];return [t[0],canonical(t[1]),canonical(t[2])];
}
function powerShape(t){
 if(t[0]==='neg')return powerShape(t[1]);
 if(t[0]==='pow'){
  const simple=v=>v[0]==='num'||v[0]==='neg'&&simple(v[1])||v[0]==='div'&&simple(v[1])&&simple(v[2]);
  if(!simple(t[1]))return null;const base=evaluate(t[1]);return {base:rat(base[0]<0n?-base[0]:base[0],base[1]),exponent:t[2]};
 }
 if(t[0]==='div'){
  const numerator=nodeValue(t[1])||t[1][0]==='neg'&&nodeValue(t[1][1]);
  if(numerator&&numerator[1]===1n&&(numerator[0]===1n||numerator[0]===-1n)){const shape=powerShape(t[2]);if(shape)return {base:rat(shape.base[1],shape.base[0]),exponent:shape.exponent};}
 }
 return null;
}
function checkForm(q,raw){
 const parsed=tree(raw);if(!parsed)return {valid:false};try{const value=evaluate(parsed),expected=evaluate(tree(q.answer)),correct=value[0]*expected[1]===expected[0]*value[1];let reduced=false;
  if(q.form==='translation')reduced=JSON.stringify(canonical(parsed))===JSON.stringify(canonical(tree(q.expression)));
  else if(q.power.exponent===0)reduced=parsed[0]==='num'&&parsed[1]==='1';
  else{const shape=powerShape(parsed),base=rat(BigInt(q.power.numerator),BigInt(q.power.denominator));reduced=!!shape&&shape.exponent===q.power.exponent&&shape.base[0]*base[1]===base[0]*shape.base[1];if(q.power.exponent===1){const simple=v=>v[0]==='num'||v[0]==='neg'&&simple(v[1])||v[0]==='div'&&simple(v[1])&&simple(v[2]);if(simple(parsed))reduced=true;}}
  return {valid:true,correct,reduced};
 }catch{return {valid:false};}
}
const kinds=['fraction-vers-puissance','puissance-fraction','fractions-puissances','quotient-signe-puissance','phrase-traduction','phrase-calcul','priorites-puissances','calcul-litteral','equation-bases'];
function create(kind,random=Math.random){
 const r=(a,b)=>a+Math.floor(random()*(b-a+1)),choose=a=>a[r(0,a.length-1)],q={kind};
 if(['fraction-vers-puissance','puissance-fraction','fractions-puissances'].includes(kind)){
  const [p,d]=choose([[1,2],[2,3],[3,2],[3,4],[4,3],[11,10],[1,3],[5,2],[2,5]]),negative=r(0,1)===1,n=r(2,5),signed=negative?-p:p;
  if(kind==='fraction-vers-puissance'||kind==='puissance-fraction'){
   const expression=`(${signed}/${d})^${n}`,value=evaluate(tree(expression));q.answer=kind==='fraction-vers-puissance'?preferredFractionPower(signed,d,n):text(value);
   q.prompt=kind==='fraction-vers-puissance'?html(val(value)):html(tree(expression));
   q.numeric=kind==='puissance-fraction';if(!q.numeric){q.form='fraction-power';q.power={numerator:p,denominator:d,exponent:n};q.instruction='Écris cette fraction sous la forme d’une seule puissance.';q.format='Garde la puissance de toute la fraction : par exemple (2/3)^4. N’effectue pas la puissance.';}
   q.hint=negative?'Observe le signe : une base négative élevée à une puissance impaire reste négative. Cherche des facteurs identiques en haut et en bas.':'Cherche combien de facteurs identiques se répètent au numérateur et au dénominateur.';
   const repeated=(a,n)=>Array.from({length:n},()=>`<span class="factor">${a<0?'(−'+(-a)+')':a}</span>`).join(' × ');
   q.steps=[{text:`Le numérateur et le dénominateur contiennent chacun ${n} facteurs.`,html:frac(repeated(signed,n),repeated(d,n))},{text:'Associons un facteur du haut à un facteur du bas : chaque paire forme la même fraction.',html:Array.from({length:n},()=>`<span class="factor-group">${frac(String(signed).replace('-','−'),d)}</span>`).join(' × ')},{text:`La fraction est répétée ${n} fois. L’exposant porte sur toute la fraction.`,html:html(tree(expression))},...(q.numeric?[{text:'Effectuons les puissances et gardons une fraction réduite.',html:html(val(value))}]:[])];
   if(!q.numeric&&p===1){q.instruction='Écris la fraction avec une puissance au dénominateur.';q.format='Privilégie 1 sur une puissance, avec le bon signe. La puissance de toute la fraction reste acceptée.';q.preferredHtml=html(tree(q.answer));q.steps.push({text:`La puissance de 1 reste 1. ${signed<0?(n%2?'L’exposant impair conserve le signe moins.':'L’exposant pair donne un signe positif.'):'Le signe reste positif.'} On conserve seulement la puissance au dénominateur.`,html:q.preferredHtml});}
  }else{
   const m=choose([n-1,n,n+1,n+2]),delta=n-m,base=delta<0?`${negative?-d:d}/${p}`:`${signed}/${d}`,exponent=Math.abs(delta),expression=delta===0?'1':`(${base})^${exponent}`;
   q.form='fraction-power';q.power={numerator:delta<0?d:p,denominator:delta<0?p:d,exponent};q.answer=preferredFractionPower(delta<0?(negative?-d:d):signed,delta<0?p:d,exponent);q.prompt=frac(html(tree(`(${signed}/${d})^${n}`)),html(tree(`(${signed}/${d})^${m}`)));
   q.instruction='Simplifie en une puissance de fraction, ou en 1.';q.format='Si des facteurs restent en bas, inverse la fraction et garde un exposant positif. Par exemple (3/2)^2 ou 1.';
   q.hint='Une fraction entière est ici la base. Annule les facteurs identiques du haut et du bas, puis regarde où il en reste.';
   const repeated=(count,cancel=0)=>Array.from({length:count},(_,i)=>`<span class="factor-group ${i<cancel?'crossed-group':''}">${frac(String(signed).replace('-','−'),d)}</span>`).join(' × ');
   q.steps=[{text:'Développons les puissances comme des produits de fractions identiques.',html:frac(repeated(n),repeated(m))},{text:`Simplifions ${Math.min(n,m)} paires de fractions identiques non nulles.`,html:frac(repeated(n,Math.min(n,m)),repeated(m,Math.min(n,m)))},{text:delta===0?'Tous les facteurs se simplifient : il reste 1.':delta<0?'Les facteurs restants sont au dénominateur. Prendre leur inverse évite un exposant négatif.':'Les facteurs restants sont au numérateur.',html:html(tree(expression))}];
   if(expression!==q.answer){q.preferredHtml=html(tree(q.answer));q.steps.push({text:'On simplifie les puissances de 1 et les exposants égaux à 1. Le signe suit la parité de l’exposant.',html:q.preferredHtml});}
  }
 }else if(kind==='quotient-signe-puissance'){
  const a=choose([2,3,5,6,7]),n=r(2,8),m=choose([n-2,n,n+2,n+3]),left=r(0,1)===1,right=r(0,1)===1,sign=(left&&n%2?-1:1)*(right&&m%2?-1:1),delta=n-m,exponent=Math.abs(delta);
  q.form='fraction-power';q.power={numerator:delta<0?1:a,denominator:delta<0?a:1,exponent};
  q.answer=delta===0?String(sign):delta>0?`${sign<0?'-':''}${a}^${delta}`:`${sign<0?'-':''}1/${a}^${-delta}`;
  // Equal exponents can also produce −1: keep that as a literal final result.
  if(delta===0){q.numeric=true;delete q.form;}
  const top=pow(left?`(−${a})`:a,n),bottom=pow(right?`(−${a})`:a,m);q.prompt=frac(top,bottom);
  q.instruction='Simplifie le quotient signé en gardant les puissances.';q.format='Garde les exposants et le bon signe. Si les facteurs restent en bas, écris 1 sur une puissance, avec un signe moins si nécessaire.';
  q.hint='Décide d’abord du signe de chaque puissance. Simplifie ensuite les facteurs de même valeur absolue.';
  q.steps=[{text:'Une base négative donne un résultat positif avec un exposant pair et négatif avec un exposant impair.',html:frac(`${left&&n%2?'−':''}${pow(a,n)}`,`${right&&m%2?'−':''}${pow(a,m)}`)},{text:`Le quotient est ${sign<0?'négatif':'positif'}. Comparons les ${n} facteurs du haut et les ${m} facteurs du bas.`,html:`${sign<0?'−':''}${frac(pow(a,n),pow(a,m))}`},{text:delta<0?`Il reste ${-delta} facteurs ${a} en bas : la valeur absolue est inférieure à 1.`:delta>0?`Il reste ${delta} facteurs ${a} en haut : la valeur absolue est supérieure à 1.`:'Les valeurs absolues se simplifient complètement : il reste 1 ou −1 selon le signe.',html:html(tree(q.answer))}];
 }else if(kind==='phrase-traduction'||kind==='phrase-calcul'){
  const a=r(2,12),variant=r(0,4),phrases=[`L’opposé du cube de l’opposé de ${a}.`,`Le triple du carré de l’opposé de ${a}.`,`L’opposé du double du cube de ${a}.`,`Le carré de l’opposé du double de ${a}.`,`Le double de l’opposé du carré de ${a}.`],expressions=[`-(-${a})^3`,`3*(-${a})^2`,`-(2*${a}^3)`,`(-(2*${a}))^2`,`2*(-(${a}^2))`];
  const expression=expressions[variant],parsed=tree(expression);q.prompt=esc(phrases[variant]);q.answer=text(evaluate(parsed));q.expression=expression;q.form=kind==='phrase-traduction'?'translation':undefined;q.numeric=kind==='phrase-calcul';
  q.instruction=q.numeric?'Traduis la phrase, puis effectue le calcul.':'Traduis la phrase en expression, sans effectuer le calcul.';q.format=q.numeric?'Donne la valeur numérique finale.':'Écris les signes, les parenthèses et la puissance demandés. Une valeur déjà calculée ne suffit pas.';q.hint='Lis les opérations de l’intérieur vers l’extérieur. « Opposé » change le signe ; « double » multiplie par 2 ; « triple » multiplie par 3 ; carré et cube sont des puissances.';
  const explanations=[['L’opposé de '+a+' est −'+a+'.','Le cube porte sur tout ce nombre négatif.','On prend ensuite l’opposé de ce cube.'],['On part de l’opposé de '+a+'.','Le carré porte sur ce nombre entier.','Le triple signifie multiplier le carré par 3, pas mettre 3 en exposant.'],['On construit d’abord le cube de '+a+'.','On double ce cube.','L’opposé porte sur tout le résultat.'],['On double d’abord '+a+'.','On prend l’opposé de ce double.','Le carré porte sur tout ce groupe.'],['On construit le carré de '+a+'.','On prend l’opposé de ce carré.','On multiplie cet opposé par 2.']][variant];
  const intermediate=[['-'+a,`(-${a})^3`,expression],['-'+a,`(-${a})^2`,expression],[`${a}^3`,`2*${a}^3`,expression],[`2*${a}`,`-(2*${a})`,expression],[`${a}^2`,`-(${a}^2)`,expression]][variant];
  q.steps=explanations.map((text,i)=>({text,html:html(tree(intermediate[i]))}));if(q.numeric)q.steps.push(...worked(parsed));
 }else if(kind==='calcul-litteral'||kind==='priorites-puissances'){
  const a=choose([-4,-3,-2,2,3,4]),b=r(1,5),c=r(1,4),variables=kind==='calcul-litteral';
  const expressions=variables?['2*a^2-3*b+(a-b)^2','-(a^2)+3*a*b-(b-a)^2','(a^3-b^2)/(a-b)+2*a']:[`-(-${Math.abs(a)})^2+${b}*(3^2-${c})`,`(2^3-${b})*(-${c})^2-${Math.abs(a)}^2`,`((-3)^3+${b})/${c}+2*${Math.abs(a)}^2`,`-${r(2,9)}*(${r(12,20)}-${r(1,9)})-(${r(15,24)}-${r(1,8)})*${r(2,5)}`,`${r(2,6)*3}/3*${r(2,4)}+${r(2,5)}*(${r(2,5)}-${r(6,9)})^2`,`${r(2,4)}*3^2+(${r(3,7)}-1)^2+3*(${r(4,8)}-2)`,`${r(2,8)}-${r(2,6)}*(2^3+${r(2,5)}*3)+(-${r(4,9)})^2`,...prioritySamples];
  // Avoid zero denominators without resampling the whole exercise.
  const assigned={a,b:a===b?b+1:b},expression=choose(expressions),parsed=tree(expression,{variables});
  q.numeric=true;q.assignments=variables?assigned:undefined;q.expression=expression;q.answer=text(evaluate(parsed,assigned));q.prompt=(variables?`<p class="assignment">Pour a = ${assigned.a} et b = ${assigned.b}</p>`:'')+html(parsed);q.instruction=variables?'Remplace les lettres, puis effectue le calcul.':'Effectue le calcul en respectant les priorités.';q.format='Donne un nombre calculé ou une fraction réduite. Les puissances et parenthèses sont prioritaires.';
  q.hint=variables?'Remplace chaque lettre négative entre parenthèses. Calcule ensuite les puissances, puis les produits et quotients, puis les sommes.':'Traite d’abord les parenthèses et les puissances. Le signe moins devant une puissance ne fait pas partie de sa base.';q.steps=[{text:variables?'Identifions les valeurs et les groupes avant de calculer.':'Les parenthèses et les puissances déterminent l’ordre des calculs.',html:html(parsed)},...worked(parsed,variables?assigned:undefined)];
 }else if(kind==='equation-bases'){
  const a=choose([2,3,5,6,7]),n=r(2,5),variant=r(0,1);q.unknown=true;
  if(variant===0){const total=n+2;q.answer=String(n);q.prompt=`${a}<sup>?</sup> × ${a*a} = ${pow(a,total)}`;q.hint=`Réécris ${a*a} avec la base ${a}, puis compare les exposants.`;q.steps=[{text:`${a*a} est un carré.`,html:`${a*a} = ${pow(a,2)}`},{text:'Le produit de puissances de même base additionne les exposants.',html:`${a}<sup>? + 2</sup> = ${pow(a,total)}`},{text:'Retrouvons l’exposant manquant.',html:`? = ${total} − 2 = ${n}`}];}
  else{const k=r(2,4);q.answer=String(n*k);q.prompt=`(${a} × ${2**k})<sup>${n}</sup> = ${pow(a,n)} × 2<sup>?</sup>`;q.hint=`Réécris ${2**k} comme une puissance de 2 avant d’appliquer la puissance d’un produit.`;q.steps=[{text:`${2**k} = 2 puissance ${k}.`,html:pow(2,k)},{text:'La puissance porte sur chaque facteur du produit.',html:`${pow(a,n)} × (${pow(2,k)})<sup>${n}</sup>`},{text:'Une puissance de puissance multiplie les exposants.',html:`? = ${k} × ${n} = ${k*n}`}];}
 }else throw Error('Type inconnu');
 return q;
}
const api={kinds,prioritySamples,create,tree,evaluate,html,rat,text,worked,checkForm,powerShape,preferredFractionPower,nextStep:reduceOne};if(typeof module!=='undefined')module.exports=api;else root.ExercicesPlus=api;
})(typeof globalThis!=='undefined'?globalThis:this);
