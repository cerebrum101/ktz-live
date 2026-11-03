# KTZ Live prototype

Responsive Kazakhstan train map and dashboard with a C++ trajectory estimator. Current data is explicitly synthetic; no live KTZ GPS or complete timetable is claimed. The server refreshes positions every 30 seconds.

Run: `g++ -std=c++17 -include algorithm -O2 core.cpp -o core && npm start`.

Next: import permitted dated timetable and intermediate stops; use rail geometry and stop dwell times, add provenance and uncertainty to each train. Enable GPS only after the provider's technical access and reuse terms are confirmed.
