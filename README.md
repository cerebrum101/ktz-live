# KTZ Live prototype

Responsive Kazakhstan train map and dashboard with a C++ trajectory estimator. Current data is explicitly synthetic; no live KTZ GPS or complete timetable is claimed. The server refreshes positions every 30 seconds.

Run: `g++ -std=c++17 -include algorithm -O2 core.cpp -o core && npm start`.

## Data access finding (3 November 2026)

The official tracking frontend uses `/api/stations2`, `/api/trips-new`, `/api/trip-new`, and `/api/track`. A small read-only check showed dated trips and stop coordinates; `/api/track` returned a line geometry for one trip, not a verified current GPS point. The site's [robots.txt](https://tablo-railways.kz/robots.txt) explicitly prohibits automated API collection, storage, reuse, and third-party publication. Do not connect this prototype to that API without permission from the operator (1433).

The [Kazakhstan open data portal](https://data.egov.kz/datasets/view?index=list_and_schedule_of_socially_) lists a current rail routes and schedules dataset, but its API requires a user-issued key. That is the next lawful data source to evaluate. It may still lack stop-level times or route geometry.

Next: obtain permitted dated timetable and intermediate stops; use rail geometry and stop dwell times, add provenance and uncertainty to each train. Enable GPS only after the provider's technical access and reuse terms are confirmed.
