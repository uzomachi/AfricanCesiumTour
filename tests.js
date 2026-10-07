(function () {
  const results = [];
  const test = (name, fn) => { try { if (!fn()) throw Error('Unexpected result'); results.push({ name, pass: true }); } catch (e) { results.push({ name, pass: false, error: e.message }); } };
  const T = (typeof Tour !== 'undefined') ? Tour : require('./tour-core.js');
  const F = (typeof Flight !== 'undefined') ? Flight : require('./flight-core.js');
  const data = (typeof PLACES !== 'undefined') ? PLACES : require('./places.js');
  // Fixture moved from the Pennsylvania teaching origin to Giza so it sits inside the Africa project area.
  const good = { name: 'A', lon: 31.13, lat: 29.98, description: 'd', source: 's', checked: '2026-10-05' };

  // --- Tour starter checks (the original 12; only the fixture location changed) ---
  test('Next moves forward', () => T.nextIndex(0, 3) === 1);
  test('Next wraps from the last stop to the first', () => T.nextIndex(2, 3) === 0);
  test('Previous wraps from the first stop to the last', () => T.prevIndex(0, 3) === 2);
  test('Empty list does not crash', () => T.nextIndex(0, 0) === 0 && T.prevIndex(0, 0) === 0);
  test('A complete record is usable', () => T.validatePlace(good).length === 0);
  test('Missing longitude is flagged, not guessed', () => T.validatePlace({ ...good, lon: null }).some(m => m.includes('longitude')));
  test('Longitude 200 is out of range', () => T.validatePlace({ ...good, lon: 200 }).length > 0);
  test('Swapped longitude/latitude is caught', () => T.validatePlace({ ...good, lon: 40.33, lat: -75.93 }).some(m => m.includes('swapped')));
  test('Missing source is flagged', () => T.validatePlace({ ...good, source: '' }).some(m => m.includes('source')));
  test('Photo without alt text is flagged', () => T.validatePlace({ ...good, photo: 'x.jpg', photoAlt: '' }).some(m => m.includes('alt')));
  test('usable() drops bad records only', () => T.usable([good, { ...good, lat: null }]).length === 1);
  test('Every record in places.js is usable', () => data.every(p => T.validatePlace(p).length === 0));

  // --- Added: data quality for this project ---
  test('places.js has at least 3 stops', () => data.length >= 3);
  test('Every stop has a source URL and a check date', () => data.every(p => /https?:\/\//.test(p.source) && /^\d{4}-\d{2}-\d{2}$/.test(p.checked)));
  test('No two stops share the same coordinates', () => new Set(data.map(p => p.lon + ',' + p.lat)).size === data.length);

  // --- Added: auto-tour feature ---
  test('Auto-tour counts down without advancing', () => { const r = T.autoTourStep({ index: 0, remaining: 5 }, 1, 25, 3); return r.index === 0 && r.remaining === 4 && !r.advanced; });
  test('Auto-tour advances at zero and resets the timer', () => { const r = T.autoTourStep({ index: 0, remaining: 1 }, 1, 25, 3); return r.index === 1 && r.remaining === 25 && r.advanced; });
  test('Auto-tour wraps after the last stop', () => T.autoTourStep({ index: 2, remaining: 1 }, 1, 25, 3).index === 0);
  test('Auto-tour with no stops does not crash', () => { const r = T.autoTourStep({ index: 0, remaining: 1 }, 1, 25, 0); return r.index === 0 && !r.advanced; });

  // --- Added: camera + distance helpers ---
  test('cameraFor fills defaults', () => { const c = T.cameraFor({}); return c.heading === 0 && c.pitch === -35 && c.range === 1200; });
  test('cameraFor clamps unsafe values', () => { const c = T.cameraFor({ view: { heading: -90, pitch: 10, range: 5 } }); return c.heading === 270 && c.pitch === -5 && c.range === 100; });
  test('distanceKm: same point is 0', () => T.distanceKm(good, good) === 0);
  test('distanceKm: 1 degree of latitude is about 111 km', () => Math.abs(T.distanceKm({ lon: 0, lat: 0 }, { lon: 0, lat: 1 }) - 111.19) < 0.5);
  test('nearest() picks the closer stop', () => T.nearest({ lon: 31.1, lat: 30 }, data).place.name.startsWith('Great Pyramid'));

  // --- Added: search and filter for the stop list ---
  test('Empty search and "All" returns every stop', () => T.filterStops(data, '', 'All').length === data.length);
  test('Search matches country text (egypt = 3 stops)', () => T.filterStops(data, 'Egypt', 'All').length === 3);
  test('Category filter keeps original numbering', () => { const r = T.filterStops(data, '', 'Modern city'); return r.length > 0 && r.every(x => data[x.index] === x.place && x.place.category === 'Modern city'); });
  test('Search with no match returns an empty list', () => T.filterStops(data, 'zzzz-not-a-place', 'All').length === 0);

  // --- Flight starter checks (the original 7) ---
  const s = { ...F.initial(), paused: false };
  test('Pause preserves position', () => JSON.stringify(F.step({ ...s, paused: true }, 5)) === JSON.stringify({ ...s, paused: true }));
  test('North increases latitude', () => F.step(s, 1).lat > s.lat);
  test('East increases longitude', () => F.step({ ...s, heading: 90 }, 1).lon > s.lon);
  test('Heading wraps in both directions', () => F.wrap(-10) === 350 && F.wrap(370) === 10);
  test('Height limits clamp', () => F.clamp(-5, 50, 5000) === 50 && F.clamp(8000, 50, 5000) === 5000);
  test('Zero speed keeps position', () => F.step({ ...s, speed: 0 }, 1).lat === s.lat);
  test('Duration consistency: one second equals ten 0.1-second steps', () => { const once = F.step(s, 1); let many = s; for (let i = 0; i < 10; i++) many = F.step(many, 0.1); return Math.abs(once.lat - many.lat) < 1e-8 && Math.abs(once.lon - many.lon) < 1e-8; });

  const failed = results.filter(r => !r.pass).length;
  const lines = results.map((r, n) => `${r.pass ? 'PASS' : 'FAIL'} ${String(n + 1).padStart(2, '0')}: ${r.name}${r.error ? ' (' + r.error + ')' : ''}`);
  lines.push('', `${results.length - failed} of ${results.length} passed`);
  if (typeof document !== 'undefined') document.getElementById('results').textContent = lines.join('\n');
  else { console.log(lines.join('\n')); if (failed) process.exitCode = 1; }
})();
