const fs=require('node:fs'),cp=require('node:child_process');
const stations=[['Алматы 2','2700001',43.2742,76.9393],['Астана-1','2708000',51.1815,71.4115],['Шымкент','2700770',42.312,69.575],['Қарағанды Пасс','2708950',49.8019,73.105],['Ақтөбе-1','2704600',50.2904,57.1546],['Нурлы жол','2700152',51.125,71.514],['Кокшетау 1','2708800',53.2884,69.4224],['Павлодар','2708900',52.2906,76.958],['Семей','2700900',50.411,80.25],['Костанай','2708700',53.223,63.635],['Кызылорда','2704999',44.837,65.51],['Туркестан','2700860',43.295,68.245],['Атырау','2704830',47.107,51.922],['Мангистау','2704807',43.691,51.207],['Орал','2704810',51.235,51.39],['Оскемен-1','2700730',49.952,82.608],['Тараз','2700710',42.9,71.366],['Шу','2700780',43.599,73.761],['Петропавловск','2040500',54.85444,69.165,3],['Жезказган','2708930',47.78954,67.67843],['Балхаш 2','2708790',46.85612,74.98722],['Бейнеу','2704817',45.32211,55.19662],['Шалкар','2704840',47.83408,59.62203],['Кандыагаш','2704870',49.47058,57.42743],['Кульсары','2704822',46.94796,53.93873],['Арыс 1','2700680',42.41928,68.79353],['Сарыагаш','2700116',41.46507,69.14757],['Достык','2700393',45.25286,82.48665],['Аягоз','2700690',47.9631,80.44366],['Актогай','2700670',46.95306,79.68175]];
const dateAt=t=>new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Almaty',day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(t)).replaceAll('/','-');
const now=Date.now(),date=dateAt(now),yesterday=dateAt(now-86400000),tomorrow=dateAt(now+86400000);
const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
function fetchDay(date){const trains=[];
for(const [station,id] of stations){try{
 const html=cp.execFileSync('curl',['-fsSLG','--max-time','20','https://bilet.railways.kz/sale/default/station/schedule','--data-urlencode',`station_schedule_form[station]=${id}`,'--data-urlencode',`station_schedule_form[date]=${date}`],{encoding:'utf8'});
 for(const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)){const cells=[...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(x=>clean(x[1]));if(cells.length!==7)continue;
  const values=cells.map(x=>x.replace(/^[^:]{0,40}:\s*/,'').trim());const number=values[3].match(/\d{1,4}[А-ЯЁA-Z]?/u)?.[0];if(!number)continue;
  trains.push({station,number,departure:values[0].match(/\d{2}:\d{2}/)?.[0]||'',duration:values[1].match(/(?:\d+\.)?\d{2}:\d{2}/)?.[0]||'',arrival:values[2].match(/\d{2}:\d{2}/)?.[0]||'',from:values[4],to:values[5],frequency:values[6]});
 }
}catch(e){throw new Error(`station fetch failed: ${station}: ${e.message}`)}}
if(!trains.length||trains.some(t=>!t.number||!t.from||!t.to||!t.departure||!t.arrival||!t.duration))throw Error('invalid station timetable');return trains;}
let old={};try{old=JSON.parse(fs.readFileSync('docs/timetable.json','utf8'))}catch(e){if(e.code!=='ENOENT')throw e}
const previous=(old.days||[{date:old.date,trains:old.trains}]).find(x=>x.date===yesterday&&Array.isArray(x.trains));
const trains=fetchDay(date),days=[...(previous?[previous]:[]),{date,trains}];
const hour=Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Almaty',hour:'2-digit',hourCycle:'h23'}).format(new Date(now)));
if(hour>=20)days.push({date:tomorrow,trains:fetchDay(tomorrow)});
fs.writeFileSync('docs/timetable.json',JSON.stringify({date,updated:new Date().toISOString(),stations:stations.map(([name,id,lat,lon,utcOffset])=>({name,lat,lon,...(utcOffset?{utcOffset}:{})})),source:'https://bilet.railways.kz/sale/default/station/schedule',trains,days}));
console.log(date,days.map(x=>`${x.date}: ${x.trains.length}`).join(', '),'published station timetable rows');
