(function(){
'use strict';
const E=Expressions,$=id=>document.getElementById(id);let source='24 ÷ 12 × 3 + 5²',states=[],selected=null,hints=0;const review=new Set();
const descriptions={explorer:'Teste tes idées et reviens en arrière, sans score ni chronomètre.',comprendre:'Choisis une opération. Les indices et la démonstration avancent uniquement à ta demande.',entrainer:'Résous une expression générée. Celles qui posent difficulté peuvent être reprises.'};
function current(){return states[states.length-1];}
function feedback(message,kind=''){ $('feedback').textContent=message;$('feedback').className='status '+kind;}
function start(raw){try{const tree=E.parse(raw);E.evaluate(tree);source=raw;states=[tree];selected=null;hints=0;$('hint-text').textContent='';$('source').value=raw;feedback('Sélectionne l’opération que tu veux effectuer.');render();}catch(e){feedback(e.message,'feedback-error');}}
function element(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;}
function draw(t){if(t.type==='number')return element('span',E.text(t),'number');if(t.type==='group'){const el=element('span',undefined,'group');el.append(element('span','('),draw(t.child),element('span',')'));return el;}if(t.type==='negative'){const el=element('span',undefined,'negative');el.append(element('span','−'),draw(t.child));return el;}const el=element('span');el.style.display='contents';const button=element('button',E.symbols[t.op],`operator ${t.op==='^'?'power':['+','-'].includes(t.op)?'sum':''} ${selected===t.id?'selected':''}`);button.type='button';button.setAttribute('aria-label',`Choisir ${E.text(t)}`);button.setAttribute('aria-pressed',String(selected===t.id));button.onclick=()=>{selected=t.id;$('selected').textContent=`Ton choix : ${E.text(t)}`;render();const active=$('expression').querySelector('[aria-pressed="true"]');if(active)active.focus();};el.append(draw(t.left),button,draw(t.right));return el;}
function render(){const t=current();$('expression').replaceChildren(draw(t));$('calculate').disabled=selected===null||t.type==='number';$('undo').disabled=states.length<2;$('demo').disabled=t.type==='number';$('hint').disabled=t.type==='number';$('retry').disabled=review.size===0;$('history').replaceChildren(...states.map((s,i)=>element('li',(i?'= ':'')+E.text(s))));if(t.type==='number'){feedback(`Tu as terminé : ${E.format(t.value)}. Prête pour une autre expression ?`,'feedback-success');$('selected').textContent='Expression entièrement calculée.';}}

function run(id){const before=current(),result=E.transform(before,id);if(!result.ok){feedback(result.message,'feedback-error');if($('mode').value!=='explorer'){review.add(source);}render();return;}states.push(result.tree);selected=null;hints=0;$('selected').textContent='Choisis l’opération suivante.';$('hint-text').textContent='';feedback(result.message,'feedback-success');render();}
$('calculate').onclick=()=>run(selected);
$('undo').onclick=()=>{if(states.length>1){states.pop();selected=null;$('selected').textContent='Choisis à nouveau une opération.';feedback('Retour à l’étape précédente.');render();}};
$('restart').onclick=()=>start(source);
$('new').onclick=()=>start(E.generate(Number($('level').value)));
$('retry').onclick=()=>{const raw=review.values().next().value;if(raw){review.delete(raw);start(raw);}};
$('custom').onsubmit=event=>{event.preventDefault();start($('source').value);};
$('mode').onchange=()=>{$('mode-description').textContent=descriptions[$('mode').value];start(source);};
$('hint').onclick=()=>{const id=E.choices(current())[0],row=E.operations(current()).find(r=>r.node.id===id);const messages=['Regarde les parenthèses, puis les puissances, puis × et ÷, puis + et −. À même priorité, avance de gauche à droite dans la chaîne.',row?.inside?'Une opération à l’intérieur des parenthèses peut être calculée.':row?.node.op==='^'?'Une puissance peut être calculée maintenant.':'Cherche une opération prioritaire dont les deux nombres sont déjà connus.',row?`Tu peux calculer : ${E.text(row.node)}.`:'Cette expression est terminée.'];$('hint-text').textContent=messages[Math.min(hints++,2)];render();};
$('demo').onclick=()=>{const id=E.choices(current())[0];if(id!==undefined){run(id);$('hint-text').textContent='Une seule étape a été montrée. À toi de choisir la suivante.';}};
$('tree-a').onclick=()=>{$('result-a').textContent='3 × 4 = 12, puis 8 + 12 = 20.';};$('tree-b').onclick=()=>{$('result-b').textContent='8 + 3 = 11, puis 11 × 4 = 44.';};
$('mode-description').textContent=descriptions.explorer;start(source);
})();
