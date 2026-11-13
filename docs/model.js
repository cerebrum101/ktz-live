(function(root){
function minute(s){const m=/^(?:(\d+)\.)?(\d+):(\d{2})$/.exec(s);return m?Number(m[1]||0)*1440+Number(m[2])*60+Number(m[3]):NaN}
function name(s){return s.toUpperCase().replace(/Қ/g,'К').replace(/Ң/g,'Н').replace(/Ө/g,'О').replace(/Ә/g,'А').replace(/Ұ|Ү/g,'У').replace(/І/g,'И').replace(/ПАСС/g,'П').replace(/[^А-ЯЁA-Z0-9]/g,'').replace('КАРАГАНДЫП','КАРАГАНДП')}
function segments(data){
 const [day,month,year]=data.date.split('-').map(Number),base=Date.UTC(year,month-1,day)-5*3600000;
 const places=new Map(data.stations.filter(s=>typeof s==='object').map(s=>[s.name,s])),groups=new Map();
 for(const row of data.trains){const p=places.get(row.station),d=minute(row.departure),duration=minute(row.duration),arrival=minute(row.arrival);if(!p||name(row.station)===name(row.to)||!Number.isFinite(d)||!Number.isFinite(duration)||!Number.isFinite(arrival)||d>=1440||duration<1||arrival>=1440||(d+duration)%1440!==arrival)continue;
  const target=base+(d+duration)*60000,key=[row.number,row.from,row.to,target].join('|'),event={...row,place:p,time:base+d*60000};if(!groups.has(key))groups.set(key,[]);groups.get(key).push(event);
 }
 const out=[];for(const [key,events] of groups){if(new Set(events.map(e=>e.station)).size!==events.length||new Set(events.map(e=>e.time)).size!==events.length)continue;events.sort((a,b)=>a.time-b.time);for(let i=1;i<events.length;i++){const a=events[i-1],b=events[i],hours=(b.time-a.time)/3600000,km=111*Math.hypot(b.place.lat-a.place.lat,(b.place.lon-a.place.lon)*Math.cos(a.place.lat*Math.PI/180));if(hours<=0||km<5||km/hours>160)continue;out.push({key,number:a.number,from:a.from,to:a.to,a:a.place,b:b.place,start:a.time,end:b.time})}}
 return out;
}
if(typeof module!=='undefined')module.exports={segments};else root.trajectory={segments};
})(typeof window!=='undefined'?window:globalThis);
