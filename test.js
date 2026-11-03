const {execFileSync}=require('node:child_process');
const run=t=>execFileSync('/tmp/ktz-core',['0','0','10','20','0','100',String(t)],{encoding:'utf8'}).trim();
if(run(0)!=='0.000000 0.000000'||run(50)!=='5.000000 10.000000'||run(100)!=='10.000000 20.000000')throw Error('trajectory failed');
