# KTZ Live prototype

The hosted map estimates positions using matched timetable rows from 45 sampled stations on KTZ's public ticket site. It refreshes on a best-effort schedule, flags snapshots more than two hours old, and hides estimates without a current-day snapshot. Coverage is partial, lines between stations are straight approximations, and delays, cancellations and GPS are not known. The local server is a separate synthetic trajectory demo.

Run: `g++ -std=c++17 -include algorithm -O2 core.cpp -o core && npm start`.

## Data access finding (3 November 2026)

The official tracking frontend uses `/api/stations2`, `/api/trips-new`, `/api/trip-new`, and `/api/track`. A small read-only check showed dated trips and stop coordinates; `/api/track` returned a line geometry for one trip, not a verified current GPS point. The site's [robots.txt](https://tablo-railways.kz/robots.txt) explicitly prohibits automated API collection, storage, reuse, and third-party publication. Do not connect this prototype to that API without permission from the operator (1433).

The [Kazakhstan open data portal](https://data.egov.kz/datasets/view?index=list_and_schedule_of_socially_) lists a current rail routes and schedules dataset, but its API requires a user-issued key. That is the next lawful data source to evaluate. It may still lack stop-level times or route geometry.

Next: obtain permitted dated timetable and intermediate stops; use rail geometry and stop dwell times, add provenance and uncertainty to each train. Enable GPS only after the provider's technical access and reuse terms are confirmed.

The public ticket-site board gives timetable rows without a stable trip identifier. The estimator conservatively matches full train number, endpoints and computed destination arrival timestamp, rejects duplicate or inconsistent rows, and joins sampled station events across dates when available. Up to seven days of board history are retained as refreshes accumulate. When a destination is known but no later sampled stop exists, the final leg is marked as a coarse estimate. Matching is heuristic and requires further operator validation. It cannot establish all active trains. The refresh job retains the previous snapshot on fetch or parsing failure. Reuse terms for the ticket-site data have not been confirmed. See [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) for the data flow and remaining work.
