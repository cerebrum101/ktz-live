(function(root){
function minute(s){const m=/^(?:(\d+)\.)?(\d+):(\d{2})$/.exec(s);return m?Number(m[1]||0)*1440+Number(m[2])*60+Number(m[3]):NaN}
function name(s){return s.toUpperCase().replace(/Қ/g,'К').replace(/Ғ/g,'Г').replace(/Ң/g,'Н').replace(/Ө/g,'О').replace(/Ә/g,'А').replace(/Ұ|Ү/g,'У').replace(/І/g,'И').replace(/ПАСС/g,'П').replace(/[^А-ЯЁA-Z0-9]/g,'').replace('КАРАГАНДЫП','КАРАГАНДП').replace('ПЕТРОПАВЛОВСК','ПЕТРОПАВЛ').replace('КУРОРТБОРОВОЕ','КУРОРТБОР').replace('ТАЛДЫКОРГАН','ТАЛДЫКОРГА').replace('ЖАНАОЗЕН','УЗЕН').replace('УЗЕНЬ','УЗЕН')}
function segments(data){
 const places=new Map(data.stations.filter(s=>typeof s==='object').map(s=>[s.name,s])),destinations=new Map([...places.values()].map(s=>[name(s.name),s])),groups=new Map();
 const days=data.days||[{date:data.date,trains:data.trains}];
 for(const snapshot of days){const [day,month,year]=snapshot.date.split('-').map(Number),midnight=Date.UTC(year,month-1,day);
 for(const row of snapshot.trains){const p=places.get(row.station),d=minute(row.departure),duration=minute(row.duration),arrival=minute(row.arrival);if(!p||name(row.station)===name(row.to)||!Number.isFinite(d)||!Number.isFinite(duration)||!Number.isFinite(arrival)||d>=1440||duration<1||arrival>=1440)continue;
  const departure=midnight-(p.utcOffset??5)*3600000+d*60000,target=departure+duration*60000,destOffset=name(row.to)==='ПЕТРОПАВЛ'?3:5,destClock=new Date(target+destOffset*3600000);if(destClock.getUTCHours()*60+destClock.getUTCMinutes()!==arrival)continue;
  const key=[row.number,row.from,row.to,target].join('|'),event={...row,place:p,time:departure,target};if(!groups.has(key))groups.set(key,[]);groups.get(key).push(event);
 }}
 const out=[];for(const [key,events] of groups){if(new Set(events.map(e=>e.station)).size!==events.length||new Set(events.map(e=>e.time)).size!==events.length)continue;events.sort((a,b)=>a.time-b.time);function add(a,b,quality){const hours=(b.time-a.time)/3600000,km=111*Math.hypot(b.place.lat-a.place.lat,(b.place.lon-a.place.lon)*Math.cos(a.place.lat*Math.PI/180));if(hours<=0||km<5||km/hours>160)return;out.push({key,number:a.number,from:a.from,to:a.to,a:a.place,b:b.place,start:a.time,end:b.time,quality})}for(let i=1;i<events.length;i++)add(events[i-1],events[i],'matched');const last=events[events.length-1],destination=destinations.get(name(last.to));if(destination)add(last,{place:destination,time:last.target},'coarse')}
 return out;
}
if(typeof module!=='undefined')module.exports={segments};else root.trajectory={segments};
})(typeof window!=='undefined'?window:globalThis);
