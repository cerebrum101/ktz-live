import importlib.util
import unittest
from collections import defaultdict

spec = importlib.util.spec_from_file_location('rail_routes', 'build-rail-routes.py')
routes = importlib.util.module_from_spec(spec)
spec.loader.exec_module(routes)

class RailRoutesTest(unittest.TestCase):
    def test_connected_paths_and_missing_station(self):
        graph = routes.Rail()
        graph.nodes = {1: (43, 76), 2: (43.1, 76), 3: (43.1, 76.1)}
        graph.edges = defaultdict(list, {1: [(2, 11)], 2: [(1, 11), (3, 8)], 3: [(2, 8)]})
        stations = [{'name': 'A', 'lat': 43, 'lon': 76}, {'name': 'B', 'lat': 43.1, 'lon': 76.1}, {'name': 'C', 'lat': 50, 'lon': 70}]
        paths, snapped = routes.build(graph, stations)
        self.assertEqual(set(snapped), {'A', 'B'})
        self.assertEqual(paths['A|B'], [[43, 76], [43.1, 76], [43.1, 76.1]])

if __name__ == '__main__':
    unittest.main()
