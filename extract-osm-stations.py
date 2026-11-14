"""Extract named railway station and halt nodes from an OSM PBF (ODbL)."""
import osmium,json,sys
from collections import Counter
items=[]
proc=osmium.FileProcessor(sys.argv[1]).with_filter(osmium.filter.TagFilter(('railway','station'),('railway','halt')))
for o in proc:
 if not o.is_node() or not o.location.valid():continue
 if o.tags.get('station') in ('subway','light_rail','tram','monorail'):continue
 name=o.tags.get('name') or o.tags.get('name:kk') or o.tags.get('name:ru')
 if not name:continue
 items.append({'id':f'n{o.id}','name':name,'lat':round(o.location.lat,6),'lon':round(o.location.lon,6),'type':o.tags.get('railway'),'names':[o.tags.get(k) for k in ('name:kk','name:ru','alt_name') if o.tags.get(k)]})
json.dump({'source':'OpenStreetMap contributors via Geofabrik Kazakhstan','license':'https://opendatacommons.org/licenses/odbl/1-0/','stations':items},open('docs/stations-osm.json','w'),ensure_ascii=False,separators=(',',':'));print('named nodes',len(items))
