const assert=require('node:assert/strict'),{segments}=require('./docs/model');
const data={date:'13-11-2026',stations:[{name:'A',lat:51,lon:71},{name:'B',lat:50,lon:73}],trains:[{station:'A',number:'106Т',from:'P',to:'M',departure:'06:45',duration:'17:00',arrival:'23:45'},{station:'B',number:'106Т',from:'P',to:'M',departure:'10:08',duration:'13:37',arrival:'23:45'}]};
assert.equal(segments(data).length,1);assert.equal(segments({...data,trains:[...data.trains,{...data.trains[1]}]}).length,0);assert.equal(segments({...data,trains:[data.trains[0],{...data.trains[1],arrival:'23:44'}]}).length,0);
const overnight={...data,trains:[{...data.trains[0],departure:'23:57',duration:'2.05:53',arrival:'05:50'},{...data.trains[1],departure:'18:21',duration:'11:29',arrival:'05:50'}]};assert.equal(segments(overnight).length,0);
assert.equal(segments({...data,trains:[...data.trains,{...data.trains[0],station:'M'}],stations:[...data.stations,{name:'M',lat:49,lon:75}]}).length,1);
