# KTZ Live data path

## Verified

- Kaspi's rail-ticket service was launched through a direct KTZ–Kaspi IT integration, not a documented anonymous public feed: https://rail-news.kz/kz/passenger-transportation/9052-poyyz-biletterin-endi-kaspi-kz-zh-ktemesi-ar-yly-satyp-alu-a-bolady.html
- KTZ's computing centre publishes an information-services contract and application, and lists a marketing contact: https://iservice.railways.kz/ . Its public description refers to rolling-stock location; whether it covers passenger-train GPS and third-party map publication needs confirmation.
- The official tracking site's robots notice disallows automated `/api/` collection and republication: https://tablo-railways.kz/robots.txt . Do not use its internal endpoints for this hosted map without written access.
- The Kazakhstan open-data portal has a published rail routes/schedules dataset (`list_and_schedule_of_socially_`, version `v18`) but requires a developer key: https://data.egov.kz/datasets/view?index=list_and_schedule_of_socially_ . Check its fields and license before relying on it for dated trips.
- Yandex Timetables has a documented schedule/stop API, but its terms restrict processing and altering API data. An estimated-position map would require specific permission: https://yandex.ru/legal/rasp_api/ru .

## Access request to KTZ

Ask the Passenger Transportation operator and KTZ Computing Centre for (1) a dated passenger train trip feed with train number, unique trip ID, start/end and intermediate stop timestamps; (2) GPS positions where available, timestamps and update interval; (3) coverage and service-level expectations; (4) rate limits, price, attribution and permission to cache, estimate missing positions and publish a free Kazakhstan-wide map. Request a test feed and written reuse terms. KTZ Computing Centre lists IT-services marketing contact `nurgali_ae@railways.kz`; verify the correct passenger-data owner before contracting.

## Build once access is confirmed

Ingest only the licensed feed, normalize times to UTC, deduplicate by trip ID and service date, reject stale GPS, and calculate estimated positions between adjacent stops with the C++ core. Follow rail geometry, not straight lines, before describing locations as geographically precise. Publish source, timestamp, freshness and uncertainty per marker. Run a coverage check against the operator's trip inventory; never claim “all active trains” until that check passes.
