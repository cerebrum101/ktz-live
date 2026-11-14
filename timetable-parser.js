const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
function parseRows(html,station){if(!html.includes('station_schedule_form'))throw Error('unexpected station page');const trains=[];
 for(const row of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)){const cells=[...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(x=>clean(x[1]));if(cells.length!==7)continue;
  const values=cells.map(x=>x.replace(/^[^:]{0,40}:\s*/,'').trim()),number=values[3].match(/\d{1,4}[А-ЯЁA-Z]?/u)?.[0];if(!number)continue;
  const train={station,number,departure:values[0].match(/\d{2}:\d{2}/)?.[0]||'',duration:values[1].match(/(?:\d+\.)?\d{2}:\d{2}/)?.[0]||'',arrival:values[2].match(/\d{2}:\d{2}/)?.[0]||'',from:values[4],to:values[5],frequency:values[6]};
  if(!train.departure||!train.duration||!train.arrival||!train.from||!train.to)throw Error('incomplete train row');trains.push(train);
 }return trains;}
function collect(stations,date,fetchPage){const trains=[],failed=[];let consecutive=0;
 for(let i=0;i<stations.length;i++){const [station,id]=stations[i];try{trains.push(...parseRows(fetchPage(id),station));consecutive=0}catch(e){failed.push(station);if(++consecutive>=3){failed.push(...stations.slice(i+1).map(s=>s[0]));break}}}
 if(!trains.length)throw Error(`no timetable data for ${date}`);return {date,trains,failed};}
function retainDays(old,updates,today){const [day,month,year]=today.split('-').map(Number),base=Date.UTC(year,month-1,day),byDate=new Map();for(const snapshot of [...old,...updates]){if(!snapshot||!Array.isArray(snapshot.trains)||!/^\d{2}-\d{2}-\d{4}$/.test(snapshot.date))continue;const [d,m,y]=snapshot.date.split('-').map(Number),delta=(Date.UTC(y,m-1,d)-base)/86400000;if(delta>=-6&&delta<=1)byDate.set(snapshot.date,snapshot)}return [...byDate.values()].sort((a,b)=>{const timestamp=s=>{const [d,m,y]=s.date.split('-').map(Number);return Date.UTC(y,m-1,d)};return timestamp(a)-timestamp(b)})}
module.exports={parseRows,collect,retainDays};
