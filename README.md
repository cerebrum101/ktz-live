# KTZ Live prototype

Responsive Kazakhstan rail dashboard with a C++ trajectory estimator. The hosted page now displays a dated timetable snapshot from five sampled stations on KTZ's public ticket site, refreshed twice hourly. Station markers represent timetable coverage, not train positions. No live GPS or complete nationwide timetable is claimed. The local server still contains a separate synthetic trajectory demo.

Run: `g++ -std=c++17 -include algorithm -O2 core.cpp -o core && npm start`.

## Data access finding (3 November 2026)

The official tracking frontend uses `/api/stations2`, `/api/trips-new`, `/api/trip-new`, and `/api/track`. A small read-only check showed dated trips and stop coordinates; `/api/track` returned a line geometry for one trip, not a verified current GPS point. The site's [robots.txt](https://tablo-railways.kz/robots.txt) explicitly prohibits automated API collection, storage, reuse, and third-party publication. Do not connect this prototype to that API without permission from the operator (1433).

The [Kazakhstan open data portal](https://data.egov.kz/datasets/view?index=list_and_schedule_of_socially_) lists a current rail routes and schedules dataset, but its API requires a user-issued key. That is the next lawful data source to evaluate. It may still lack stop-level times or route geometry.

Next: obtain permitted dated timetable and intermediate stops; use rail geometry and stop dwell times, add provenance and uncertainty to each train. Enable GPS only after the provider's technical access and reuse terms are confirmed.

The public ticket-site board gives timetable rows but no stable trip identifier across sampled stations. Train numbers repeat across days and sometimes directions, so those rows cannot yet be joined into a reliable live trajectory. The refresh job checks row validity and retains the previous snapshot if parsing fails.
