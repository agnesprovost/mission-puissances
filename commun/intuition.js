(function(root){
'use strict';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function evaluate(raw,expected,parse,{choices,exact=false}={}){
 if(choices)return {valid:choices.includes(raw),bonus:raw===expected};
 const value=parse(raw),answer=parse(String(expected));if(value===null||answer===null)return {valid:false,bonus:false};
 const number=v=>Array.isArray(v)?Number(v[0])/Number(v[1]):Number(v),v=number(value),a=number(answer);
 if(!Number.isFinite(v)||!Number.isFinite(a))return {valid:false,bonus:false};
 return {valid:true,bonus:exact||a===0?Math.abs(v-a)<1e-9:Math.abs(v-a)<=Math.abs(a)*.2+1e-9};
}
function mount({target,state,expected,parse,choices,exact=false,unit,unlock}){
 target.innerHTML=`<h3>Avant le calcul : ton intuition</h3><p>${choices?'Fais un premier choix intuitif.':exact?'Propose le nombre qui te semble convenir.':'Estime la valeur numérique du résultat, sans poser tout le calcul.'} Un bonus est possible, sans pénalité si tu te trompes.</p>${unit==='%'?'<p>Tu peux écrire une fraction ou un pourcentage : 3/4 = 75 %.</p>':''}<p class="note">${choices||exact?'Bonus si la prédiction est exacte.':'Bonus si l’estimation est à 20 % ou moins du résultat (pour 0, il faut proposer 0).'} Le résultat du bonus sera révélé après la résolution.</p><form class="intuition-form"><label>Ma prédiction${choices?`<select required><option value="">Choisir…</option>${choices.map(c=>`<option>${escape(c)}</option>`).join('')}</select>`:'<input type="text" autocomplete="off" placeholder="Estimation ou fraction" required>'}</label><button>Enregistrer mon intuition</button><button type="button" class="secondary intuition-skip">Résoudre sans prédiction</button></form><p class="intuition-message" role="status"></p>`;
 const form=target.querySelector('form'),field=target.querySelector('input,select'),message=target.querySelector('.intuition-message');
 function done(){form.hidden=true;unlock();}
 form.onsubmit=e=>{e.preventDefault();const result=evaluate(field.value,expected,parse,{choices,exact});if(!result.valid){message.textContent='Écris une estimation numérique, une fraction ou choisis une réponse.';return;}state.predicted=true;state.bonus=result.bonus;state.prediction=field.value;message.textContent='Intuition enregistrée. Tu peux maintenant résoudre ; elle ne peut plus être modifiée.';done();};
 target.querySelector('.intuition-skip').onclick=()=>{state.predicted=false;state.bonus=false;message.textContent='Pas de prédiction pour cet exercice. Place à la résolution !';done();};
}
function report(state){return !state.predicted?'':state.bonus?' Bonus intuition : +1 point !':' Intuition enregistrée : pas de bonus cette fois.';}
const api={evaluate,mount,report};if(typeof module!=='undefined')module.exports=api;else root.Intuition=api;
})(typeof globalThis!=='undefined'?globalThis:this);
