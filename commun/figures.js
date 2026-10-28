(function(root){
'use strict';
// Reflect each polygon across a right-hand edge to attach the next one.
// The common edge remains unique: each new polygon adds sides - 1 segments.
function chain(sides,count){if(![3,4,5].includes(sides)||!Number.isInteger(count)||count<1||count>12)throw Error('Figure hors du périmètre.');let polygon=[[0,0],[0,40]],direction=Math.PI/2;for(let i=2;i<sides;i++){direction-=2*Math.PI/sides;const p=polygon[i-1];polygon.push([p[0]+40*Math.cos(direction),p[1]+40*Math.sin(direction)]);}const edges=new Map(),round=x=>Math.round(x*1e5)/1e5;const edgeKey=(a,b)=>[a.map(round).join(','),b.map(round).join(',')].sort().join('|');let previous='';
for(let n=0;n<count;n++){for(let i=0;i<sides;i++){const a=polygon[i],b=polygon[(i+1)%sides],key=edgeKey(a,b);if(!edges.has(key))edges.set(key,{a,b,new:n===count-1&&count>1});}if(n<count-1){const candidates=polygon.map((a,i)=>({a,b:polygon[(i+1)%sides]})).filter(e=>edgeKey(e.a,e.b)!==previous).sort((u,v)=>(v.a[0]+v.b[0])-(u.a[0]+u.b[0]));const {a,b}=candidates[0];previous=edgeKey(a,b);const dx=b[0]-a[0],dy=b[1]-a[1],norm=dx*dx+dy*dy;polygon=polygon.map(p=>{const t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/norm;return [2*(a[0]+t*dx)-p[0],2*(a[1]+t*dy)-p[1]];});}}
return [...edges.values()];}
const api={chain};if(typeof module!=='undefined')module.exports=api;else root.Figures=api;
})(typeof globalThis!=='undefined'?globalThis:this);
