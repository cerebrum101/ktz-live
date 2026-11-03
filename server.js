const http=require('node:http'),fs=require('node:fs'),cp=require('node:child_process');
const routes=[['Astana','Almaty',51.1694,71.4491,43.2389,76.8897],['Almaty','Shymkent',43.2389,76.8897,42.3417,69.5901],['Astana','Karaganda',51.1694,71.4491,49.806,73.085],['Aktobe','Atyrau',50.2839,57.167,47.0945,51.9238],['Shymkent','Turkistan',42.3417,69.5901,43.2973,68.2518]];
const port=process.env.PORT||3000;
http.createServer((req,res)=>{
 if(req.url==='/api/trains'){
  const now=Date.now()/1000, day=86400, start=Math.floor(now/day)*day;
  const trains=routes.map((r,i)=>{const depart=start+((i*4+2)%24)*3600,arrive=depart+(i+3)*3600; if(now<depart||now>arrive)return null;
   const p=cp.execFileSync('./core',[...r.slice(2).map(String),String(depart),String(arrive),String(now)],{encoding:'utf8'}).trim().split(' ').map(Number);
   return {id:`DEMO-${i+1}`,from:r[0],to:r[1],lat:p[0],lon:p[1],arrival:new Date(arrive*1000).toISOString(),source:'simulation'};}).filter(Boolean);
  res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify({updated:new Date().toISOString(),trains}));return;
 }
 if(req.url==='/'||req.url==='/index.html'){res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync('index.html'));return;}
 res.writeHead(404);res.end();
}).listen(port,()=>console.log(`KTZ Live on ${port}`));
