# KTZ Live system design

## Goal and boundaries

Show the best available position for each active passenger journey, with its source and uncertainty. Nationwide coverage is a measurable goal, not an assumption: the present source contains boards from 45 selected stations and does not provide a complete trip inventory. A scheduled service is not proof that a train is running, and an estimate is not GPS.

## Data flow

1. **Acquire:** fetch public station boards at a bounded rate. Record the station, service date, fetch time, source, and failures. Keep the previous usable snapshot if a whole fetch fails. Do not use the tracking site's prohibited API. Check republication rights before relying on a source in production.
2. **Normalize:** turn rows into station events with a train number, origin, destination, scheduled departure, destination arrival and timezone. Preserve the raw source values. Retain seven days of station-board snapshots and the next day when available, so multi-day trips can be assembled across midnight. Seven days is a retention limit, not a guarantee that earlier snapshots exist.
3. **Assemble journeys:** group events by a provider trip ID and origin date if one becomes available. Today the public board lacks that ID, so use the full train number, endpoints and calculated destination arrival instant. Check station sequence and times; reject conflicting or implausible matches. Different departures of the same train number are separate journeys. A heuristic match is not authoritative.
4. **Position:** prefer a permitted, fresh GPS observation tied to a known trip. Otherwise interpolate between the nearest timed stops; hold at stations when actual arrival and departure times become available. Follow a verified railway path when available. Current board rows provide departures only, and current positions interpolate along straight lines; last-stop-to-destination estimates are marked coarse.
5. **Publish:** serve a small, versioned snapshot containing journey identity, position, source, observation or schedule time, and quality. The current prototype publishes station boards and calculates positions in the browser. Show refresh failures and hide stale data instead of presenting it as live.
6. **Measure:** compare the list of modeled active journeys with an independent, dated complete inventory. Report matched, missing, ambiguous and extra trips and source freshness. Until such an inventory and rights are established, do not claim all trains are covered.

## Next implementation steps

- Discover and verify more public station codes, coordinates and timezone conventions; expand coverage without bypassing access controls.
- Obtain full dated stop sequences and stable trip identifiers from a source that permits this use. Add matching fixtures from real journeys, especially multi-day services, irregular days, midnight and timezone boundaries.
- Add railway geometry with route validation, then compare estimates against permitted observed positions to quantify error. Do not draw a plausible-looking track as an authoritative route without validation.
- Add automated checks for source schema changes, fresh data, partial failures, duplicate journey hypotheses and deployment health. Resolve timetable reuse terms and any GPS license before a production launch.

The existing GitHub Actions and static site are sufficient for the present prototype. A backend or database is justified when an authorized live feed, larger inventory, or refresh volume requires it; it does not by itself solve missing or unlicensed data.
