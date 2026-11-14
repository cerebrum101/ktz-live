"""Build inferred station-to-station paths from a local OSM PBF extract.

Usage: python build-rail-routes.py kazakhstan.osm.pbf
Requires pyosmium. Output is derived from OpenStreetMap, ODbL 1.0.
"""
import heapq
import json
import math
import sys
from collections import defaultdict

import osmium

def km(a, b):
    lat = math.radians((a[0] + b[0]) / 2)
    return 111.195 * math.hypot(a[0] - b[0], (a[1] - b[1]) * math.cos(lat))

class Rail(osmium.SimpleHandler):
    def __init__(self):
        super().__init__()
        self.nodes = {}
        self.edges = defaultdict(list)

    def way(self, way):
        if way.tags.get('railway') != 'rail' or way.tags.get('service') in ('yard', 'siding', 'spur'):
            return
        points = []
        for node in way.nodes:
            if not node.location.valid():
                return
            point = (node.lat, node.lon)
            self.nodes[node.ref] = point
            points.append(node.ref)
        for a, b in zip(points, points[1:]):
            distance = km(self.nodes[a], self.nodes[b])
            self.edges[a].append((b, distance))
            self.edges[b].append((a, distance))

def build(rail, stations):
    snapped = {}
    for station in stations:
        point = (station['lat'], station['lon'])
        node = min(rail.nodes, key=lambda n: km(point, rail.nodes[n]))
        if km(point, rail.nodes[node]) <= 2:
            snapped[station['name']] = node
    paths = {}
    names = list(snapped)
    for index, name in enumerate(names):
        source = snapped[name]
        distance = {source: 0}
        previous = {}
        queue = [(0, source)]
        targets = {snapped[n] for n in names[index + 1:]}
        while queue and targets:
            dist, node = heapq.heappop(queue)
            if dist != distance[node]:
                continue
            targets.discard(node)
            for other, weight in rail.edges[node]:
                candidate = dist + weight
                if candidate < distance.get(other, math.inf):
                    distance[other] = candidate
                    previous[other] = node
                    heapq.heappush(queue, (candidate, other))
        for dest in names[index + 1:]:
            target = snapped[dest]
            if target not in distance or target == source:
                continue
            direct = km(rail.nodes[source], rail.nodes[target])
            if direct < 5 or distance[target] > direct * 2.5:
                continue
            nodes = [target]
            while nodes[-1] != source:
                nodes.append(previous[nodes[-1]])
            nodes.reverse()
            # Keep enough points to preserve the track shape while limiting download size.
            points = [rail.nodes[nodes[0]]]
            for n in nodes[1:-1]:
                if km(points[-1], rail.nodes[n]) >= 1:
                    points.append(rail.nodes[n])
            points.append(rail.nodes[nodes[-1]])
            paths[name + '|' + dest] = [[round(x, 5), round(y, 5)] for x, y in points]
    return paths, snapped

if __name__ == '__main__':
    data = json.load(open('docs/timetable.json'))
    rail = Rail()
    rail.apply_file(sys.argv[1], locations=True)
    paths, snapped = build(rail, data['stations'])
    with open('docs/rail-routes.json', 'w') as output:
        json.dump({'source': 'OpenStreetMap contributors via https://download.geofabrik.de/asia/kazakhstan.html', 'license': 'https://opendatacommons.org/licenses/odbl/1-0/', 'paths': paths}, output, separators=(',', ':'))
    print(f'{len(rail.nodes)} rail nodes, {len(snapped)}/{len(data["stations"])} stations snapped, {len(paths)} paths')
