const fs=require('node:fs'),cp=require('node:child_process');
const stations=[['Алматы 2','2700001'],['Астана-1','2708000']];
const date=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Almaty',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date()).replaceAll('/','-');
const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
const trains=[];
for(const [station,id] of stations){try{
 const html=cp.execFileSync('curl',['-fsSLG','--max-time','20','https://bilet.railways.kz/sale/default/station/schedule','--data-urlencode',`station_schedule_form[station]=${id}`,'--data-urlencode',`station_schedule_form[date]=${date}`],{encoding:'utf8'});
 for(const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)){const cells=[...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(x=>clean(x[1]));if(cells.length!==7)continue;
  const values=cells.map(x=>x.replace(/^[^:]{0,40}:\s*/,'').trim());const number=values[3].match(/\b\d{1,4}[А-ЯA-Z]?\b/u)?.[0];if(!number)continue;
  trains.push({station,number,departure:values[0].match(/\d{2}:\d{2}/)?.[0]||'',duration:values[1].match(/\d{2}:\d{2}/)?.[0]||'',arrival:values[2].match(/\d{2}:\d{2}/)?.[0]||'',from:values[4],to:values[5],frequency:values[6]});
 }
}catch(e){console.error('station fetch failed',station,e.message)}}
if(!trains.length||trains.some(t=>!t.number||!t.from||!t.to||!t.departure||!t.arrival))throw Error('invalid station timetable');
fs.writeFileSync('docs/timetable.json',JSON.stringify({date,updated:new Date().toISOString(),source:'https://bilet.railways.kz/sale/default/station/schedule',trains}));
console.log(date,trains.length,'published station timetable rows');
