"""Extract published route descriptions, not dated departures, from a KTZ page."""
from html.parser import HTMLParser
import json
import re
import sys

class Cells(HTMLParser):
    def __init__(self):
        super().__init__()
        self.cells = []
        self.cell = None
    def handle_starttag(self, tag, attrs):
        if tag == 'td':
            self.cell = ''
    def handle_data(self, data):
        if self.cell is not None:
            self.cell += data
    def handle_endtag(self, tag):
        if tag == 'td' and self.cell is not None:
            self.cells.append(' '.join(self.cell.split()))
            self.cell = None

page = open(sys.argv[1], encoding='utf8').read()
period = re.search(r'Пойыз кестесі\s+([^<]+)', page)
if not period:
    raise ValueError('Missing publication period')
p = Cells()
p.feed(page)
entries = []
for cell in p.cells:
    match = re.match(r'^(?:№\s*)?(\d{1,4}(?:\s*/+\s*\d{1,4})*\s*/?)\s+([А-Яа-яЁёӘәҒғҚқҢңӨөҰұҮүҺһІі].+)', cell)
    if match and (cell.startswith('№') or '/' in match.group(1)):
        entries.append({'numbers': match.group(1).strip(), 'route': match.group(2).strip()})
if len(entries) < 50:
    raise ValueError('Unexpected service list')
with open('docs/services-catalog.json', 'w', encoding='utf8') as f:
    json.dump({'source':'https://bilet.railways.kz/post/schedule?_locale=ru', 'period':period.group(1).strip(), 'services':entries},f,ensure_ascii=False,separators=(',',':'))
print(len(entries), 'published route descriptions')
