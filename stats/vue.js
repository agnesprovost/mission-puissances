(function(root){
'use strict';
function visual(v){if(!v)return '';const G=root.Graphiques;
 if(v.kind==='bars')return G.bars(v.labels,v.values);
 if(v.kind==='mean')return G.average(v.values,v.labels);
 if(v.kind==='simplification'){
  const [n,d]=Stats.fraction(v.percentage,100),perGroup=v.total/d;
  const fraction=(a,b)=>`<span class="math-fraction"><span>${a}</span><span>${b}</span></span>`;
  return `<div class="visual-calculation"><p>${v.percentage} % = ${fraction(v.percentage,100)} = ${fraction(n,d)}</p><p>${v.total} × ${fraction(n,d)} = ${fraction(`${v.total} × ${n}`,d)} = ${fraction(`<s>${v.total}</s> <strong>${perGroup}</strong> × ${n}`,`<s>${d}</s> <strong>1</strong>`)} = <strong>${perGroup*n}</strong></p><p>On divise le facteur ${v.total} du numérateur et le dénominateur ${d} par ${d}. La valeur de la fraction ne change pas.</p></div><div class="share-groups">${Array.from({length:d},(_,i)=>`<div class="share-group ${i<n?'kept':''}"><strong>Groupe ${i+1} · ${perGroup} objets</strong><p>${i<n?'✓ Retenu':'Non retenu'}</p><div class="dots">${Array.from({length:perGroup},()=>'<span class="object">●</span>').join('')}</div></div>`).join('')}</div>`;
 }
 if(v.kind==='pie')return G.pie(v.labels,v.values)+`<p class="legend">${v.labels.map((s,i)=>`<span><i style="background:${G.colors[i%6]}"></i>${G.escape(s)}</span>`).join('')}</p>`;
 if(v.kind==='objects')return `<p>${v.selected} objets marqués sur ${v.total}</p><div class="dots">${Array.from({length:v.total},(_,i)=>`<span class="object ${i<v.selected?'selected':''}" aria-label="${i<v.selected?'Sélectionné':'Autre'}">${i<v.selected?'●':'○'}</span>`).join('')}</div>`;
 if(v.kind==='table')return `<div class="scroll-table"><table><caption>Tableau d’effectifs</caption><thead><tr><th>${G.escape(v.heading||'Catégorie')}</th><th>Effectif</th></tr></thead><tbody>${v.labels.map((s,i)=>`<tr><th scope="row">${G.escape(s)}</th><td>${v.values[i]}</td></tr>`).join('')}</tbody></table></div>`;
 if(v.kind==='time')return `<svg viewBox="0 0 400 240" role="img" aria-label="Évolution de la température de 8 h à 10 h"><title>Les points sont reliés dans l’ordre des heures</title><path d="M40 20 V200 H380" fill="none" stroke="#70788d"/><polyline points="60,160 200,70 340,130" fill="none" stroke="#4154bc" stroke-width="4"/>${[['8 h',60,160,'4 °C'],['9 h',200,70,'7 °C'],['10 h',340,130,'5 °C']].map(([label,x,y,temp])=>`<circle cx="${x}" cy="${y}" r="6" fill="#4154bc"/><text x="${x}" y="225" text-anchor="middle">${label}</text><text x="${x}" y="${y-14}" text-anchor="middle">${temp}</text>`).join('')}</svg>`;
 return '';
}
root.StatsVue={visual};
})(globalThis);
