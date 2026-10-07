/* Tour rules with no Cesium and no buttons, so they can be tested on their own. */
(function (root) {
  // Area the project is expected to stay inside: mainland Africa plus nearby islands.
  // LIMIT: a continent-sized box cannot catch every swapped longitude/latitude
  // (e.g. Giza swapped is still inside Africa). Always check coordinates against a source.
  const AREA = { west: -26, east: 64, south: -36, north: 38 };

  const hasText = v => typeof v === 'string' && v.trim().length > 0;
  const isNum = v => typeof v === 'number' && Number.isFinite(v);

  // Returns a list of problems. An empty list means the record is usable.
  function validatePlace(p, area = AREA) {
    const problems = [];
    if (!p || typeof p !== 'object') return ['record is not an object'];
    for (const k of ['name', 'description', 'source', 'checked'])
      if (!hasText(p[k])) problems.push('missing ' + k);
    if (!isNum(p.lon) || p.lon < -180 || p.lon > 180) problems.push('longitude must be a number from -180 to 180');
    if (!isNum(p.lat) || p.lat < -90 || p.lat > 90) problems.push('latitude must be a number from -90 to 90');
    if (problems.length === 0 && !inArea(p, area)) problems.push('outside the project area: are longitude and latitude swapped?');
    if (hasText(p.photo) && !hasText(p.photoAlt)) problems.push('photo needs alt text');
    return problems;
  }

  const inArea = (p, a = AREA) => p.lon >= a.west && p.lon <= a.east && p.lat >= a.south && p.lat <= a.north;
  const usable = (places, area = AREA) => places.filter(p => validatePlace(p, area).length === 0);
  const nextIndex = (i, n) => (n > 0 ? (i + 1) % n : 0);
  const prevIndex = (i, n) => (n > 0 ? (i - 1 + n) % n : 0);

  // ---- Added for the Africa tour ----------------------------------------------------

  // FEATURE: auto-tour timer. Pure function: given the current state and elapsed seconds,
  // say whether to move to the next stop. The browser calls this once per second.
  function autoTourStep(state, dt, interval, n) {
    if (n <= 0) return { index: 0, remaining: interval, advanced: false };
    const left = state.remaining - dt;
    if (left > 0) return { index: state.index, remaining: left, advanced: false };
    return { index: nextIndex(state.index, n), remaining: interval, advanced: true };
  }

  // Camera settings for a stop, with safe defaults and limits (degrees and metres).
  function cameraFor(p) {
    const v = (p && p.view) || {};
    const num = (x, d) => (isNum(x) ? x : d);
    return {
      heading: ((num(v.heading, 0) % 360) + 360) % 360,
      pitch: Math.max(-89, Math.min(-5, num(v.pitch, -35))),
      range: Math.max(100, Math.min(20000, num(v.range, 1200)))
    };
  }

  // Great-circle distance in km (haversine, Earth radius 6371 km) for "nearest stop" in flight mode.
  function distanceKm(a, b) {
    const r = Math.PI / 180, R = 6371;
    const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function nearest(pos, places) {
    let best = null;
    for (const p of places) {
      const d = distanceKm(pos, p);
      if (!best || d < best.km) best = { place: p, km: d };
    }
    return best;
  }

  // Search + category filter for the stop list. Returns [{ place, index }] so the UI keeps original numbering.
  function filterStops(places, query, category) {
    const q = String(query || '').trim().toLowerCase();
    const out = [];
    places.forEach((p, index) => {
      if (category && category !== 'All' && p.category !== category) return;
      const hay = [p.name, p.country, p.era, p.category].filter(Boolean).join(' ').toLowerCase();
      if (q && !hay.includes(q)) return;
      out.push({ place: p, index });
    });
    return out;
  }

  const api = { AREA, validatePlace, inArea, usable, nextIndex, prevIndex, autoTourStep, cameraFor, distanceKm, nearest, filterStops };
  if (typeof module !== 'undefined') module.exports = api;
  root.Tour = api;
})(globalThis);
