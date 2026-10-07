/* UI + Cesium rendering. Rules live in tour-core.js and flight-core.js; data lives in places.js;
   your Cesium ion token (or Google key) lives in config.js. Nothing here invents facts. */
(() => {
  const $ = id => document.getElementById(id);
  const all = typeof PLACES !== 'undefined' ? PLACES : [];
  const cfg = window.APP_CONFIG || {};
  const real = v => { const s = String(v || '').trim(); return s && !/^YOUR_/i.test(s) ? s : ''; };
  const ionToken = real(cfg.CESIUM_ION_TOKEN);      // Option A: Cesium ion (no Google account)
  const googleKey = real(cfg.GOOGLE_MAPS_API_KEY);  // Option B: your own Google Map Tiles key
  const rad = deg => deg * Math.PI / 180;
  // Cesium request errors carry an HTTP status instead of a message (401/403 = token or URL problem, 404 = asset missing).
  const describe = e => (e && (e.message || (e.statusCode ? 'HTTP ' + e.statusCode : ''))) || String(e || 'unknown error');
  const isMobile = () => window.matchMedia('(max-width: 900px)').matches;

  // 1. Check the data before drawing anything.
  const problems = all
    .map((p, n) => ({ label: (p && p.name) || 'Record ' + (n + 1), issues: Tour.validatePlace(p) }))
    .filter(r => r.issues.length);
  if (problems.length) {
    const strong = document.createElement('strong');
    strong.textContent = 'Needs verification (not shown on the map):';
    const ul = document.createElement('ul');
    problems.forEach(r => { const li = document.createElement('li'); li.textContent = `${r.label}: ${r.issues.join('; ')}`; ul.appendChild(li); });
    $('problems').append(strong, ul);
  }
  const stops = Tour.usable(all);

  // 2. State
  let i = 0;                    // selected stop
  let mode = 'tour';            // 'tour' | 'flight'
  let viewer = null, tileset = null, markers = [], plane = null;
  let navToken = 0;             // lets a newer camera move cancel an older one
  let ground = 0;               // metres above the ellipsoid of the surface under the camera target
  let fstate = Flight.initial();
  let autoTimer = null, autoRemaining = 0;
  let query = '', category = 'All';
  let notice = '';              // persistent warning shown when 3D scans are missing or failing
  let msgTimer = null;

  // Status line. level 'warn' stays on screen; normal messages fade after 8 s.
  function say(text, level) {
    const m = $('message');
    clearTimeout(msgTimer);
    m.textContent = text || '';
    m.className = level === 'warn' ? 'warn' : '';
    m.hidden = !text;
    if (text && level !== 'warn') msgTimer = setTimeout(() => { if (!notice) m.hidden = true; else showNotice(); }, 8000);
  }
  const showNotice = () => say(notice, 'warn');
  function setNotice(text) { notice = text; if (text) showNotice(); }

  // ---------- Panels ----------
  function setPanel(side, open) {
    $(side + 'Panel').classList.toggle('closed', !open);
    $('toggle' + (side === 'left' ? 'Left' : 'Right')).setAttribute('aria-expanded', String(open));
    if (open && isMobile()) { const other = side === 'left' ? 'right' : 'left'; setPanel(other, false); }
  }
  const panelOpen = side => !$(side + 'Panel').classList.contains('closed');
  $('toggleLeft').onclick = () => setPanel('left', !panelOpen('left'));
  $('toggleRight').onclick = () => setPanel('right', !panelOpen('right'));
  document.querySelectorAll('[data-close]').forEach(b => { b.onclick = () => setPanel(b.dataset.close, false); });
  $('fs').onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen(); };
  $('aboutBtn').onclick = () => { const d = $('about'); if (d.showModal) d.showModal(); };

  // ---------- Stop details ----------
  function renderSource(el, p) {
    el.textContent = '';
    el.append('Source: ');
    String(p.source).split(/(https?:\/\/[^\s)]+)/).forEach(part => {
      if (/^https?:\/\//.test(part)) {
        const a = document.createElement('a');
        a.href = part; a.textContent = part; a.target = '_blank'; a.rel = 'noopener noreferrer';
        el.appendChild(a);
      } else el.append(part);
    });
    el.append(` · Checked: ${p.checked}`);
  }

  const markerColor = p => (p && p.category === 'Modern city' ? Cesium.Color.fromCssColorString('#3fd6e8') : Cesium.Color.fromCssColorString('#ff9a3c'));

  function renderStop() {
    if (!stops.length) { $('name').textContent = 'No usable stops yet'; $('desc').textContent = 'Fix the records in places.js.'; return; }
    const p = stops[i];
    $('count').textContent = `Stop ${i + 1} of ${stops.length}`;
    const chips = $('chips'); chips.textContent = '';
    [p.era, p.country, p.category].filter(Boolean).forEach(t => { const s = document.createElement('span'); s.className = 'chip'; s.textContent = t; chips.appendChild(s); });
    $('name').textContent = p.name;
    $('desc').textContent = p.description;
    $('explore').textContent = p.explore ? 'Try this: ' + p.explore : '';
    $('explore').hidden = !p.explore;
    renderSource($('source'), p);
    const img = $('photo');
    if (p.photo) { img.src = p.photo; img.alt = p.photoAlt; img.hidden = false; }
    else { img.hidden = true; img.removeAttribute('src'); }
    document.querySelectorAll('#stoplist button').forEach(b => {
      if (Number(b.dataset.index) === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    if (typeof Cesium !== 'undefined') markers.forEach((m, n) => { m.point.color = n === i ? Cesium.Color.WHITE : markerColor(stops[n]); m.point.pixelSize = n === i ? 18 : 12; });
  }

  // ---------- Stop list (search + filter) ----------
  function renderList() {
    const ol = $('stoplist'); ol.textContent = '';
    const shown = Tour.filterStops(stops, query, category);
    shown.forEach(({ place: p, index: n }) => {
      const li = document.createElement('li'), b = document.createElement('button');
      b.dataset.index = n;
      const num = document.createElement('span'); num.className = 'num' + (p.category === 'Modern city' ? ' modern' : ''); num.textContent = n + 1;
      const txt = document.createElement('span');
      const name = document.createElement('b'); name.textContent = p.name;
      const sub = document.createElement('small'); sub.textContent = [p.country, p.era].filter(Boolean).join(' · ');
      txt.append(name, sub);
      b.append(num, txt);
      b.onclick = () => go(n);
      li.appendChild(b); ol.appendChild(li);
    });
    $('listcount').textContent = shown.length === stops.length ? `${stops.length} stops` : `${shown.length} of ${stops.length} stops`;
    if (!shown.length) $('listcount').textContent = 'No stops match. Clear the search or choose All.';
    renderStop();
  }
  function buildCategories() {
    const box = $('cats');
    ['All', ...new Set(stops.map(p => p.category).filter(Boolean))].forEach(c => {
      const b = document.createElement('button');
      b.textContent = c; b.setAttribute('aria-pressed', String(c === category));
      b.onclick = () => { category = c; box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); renderList(); };
      box.appendChild(b);
    });
  }
  $('search').addEventListener('input', e => { query = e.target.value; renderList(); });

  function go(n) {
    i = n; resetAuto(); renderStop();
    if (isMobile()) { setPanel('left', false); setPanel('right', true); }
    if (viewer && mode === 'tour') goToStop(stops[i]);
  }
  $('next').onclick = () => go(Tour.nextIndex(i, stops.length));
  $('prev').onclick = () => go(Tour.prevIndex(i, stops.length));

  // ---------- Auto-tour (the lab's added feature) ----------
  const interval = () => Number($('interval').value) || 25;
  function resetAuto() { autoRemaining = interval(); paintCountdown(); }
  function paintCountdown() { $('countdown').textContent = autoTimer ? `Next stop in ${Math.ceil(autoRemaining)} s` : ''; }
  function startAuto() {
    resetAuto();
    $('auto').setAttribute('aria-pressed', 'true'); $('auto').textContent = '■ Stop auto-tour';
    autoTimer = setInterval(() => {
      const r = Tour.autoTourStep({ index: i, remaining: autoRemaining }, 1, interval(), stops.length);
      autoRemaining = r.remaining;
      if (r.advanced) go(r.index);       // go() resets the countdown and flies the camera
      paintCountdown();
    }, 1000);
    paintCountdown();
  }
  function stopAuto() {
    clearInterval(autoTimer); autoTimer = null;
    $('auto').setAttribute('aria-pressed', 'false'); $('auto').textContent = '▶ Auto-tour';
    paintCountdown();
  }
  $('auto').onclick = () => (autoTimer ? stopAuto() : startAuto());
  $('interval').onchange = resetAuto;
  $('auto').disabled = stops.length < 2;
  document.addEventListener('visibilitychange', () => { if (document.hidden) { stopAuto(); fstate.paused = true; paintFlight(); } });

  // ---------- Globe camera ----------
  function flyView(center, headingDeg, pitchDeg, range, duration) {
    return new Promise(resolve => viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(center, 1), {
      offset: new Cesium.HeadingPitchRange(rad(headingDeg), rad(pitchDeg), range),
      duration, complete: resolve, cancel: resolve
    }));
  }

  // Height of the surface (ground or rooftop) in metres above the ellipsoid.
  // Needed because many stops are high above sea level (Nairobi, Lalibela, Johannesburg).
  async function surfaceHeight(lon, lat) {
    if (!tileset || !viewer.scene.sampleHeightSupported) return 0;
    const pos = Cesium.Cartographic.fromDegrees(lon, lat);
    try {
      const res = await Promise.race([
        viewer.scene.sampleHeightMostDetailed([pos]),
        new Promise(r => setTimeout(() => r(null), 8000))
      ]);
      const h = res && res[0] && res[0].height;
      if (Number.isFinite(h)) return h;
    } catch (e) { console.warn('sampleHeightMostDetailed failed', e); }
    const quick = viewer.scene.sampleHeight(Cesium.Cartographic.fromDegrees(lon, lat));
    return Number.isFinite(quick) ? quick : 0;
  }

  async function goToStop(p) {
    const token = ++navToken;
    const cam = Tour.cameraFor(p);
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);   // release any flight-mode lock
    if (tileset) {
      say('Flying in… loading the 3D scan.');
      // Approach high enough to be above any ground in Africa, so tiles load before we get close.
      await flyView(Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 0), cam.heading, -45, 20000, 2);
      if (token !== navToken) return;
      ground = await surfaceHeight(p.lon, p.lat);
      if (token !== navToken) return;
    }
    await flyView(Cesium.Cartesian3.fromDegrees(p.lon, p.lat, ground), cam.heading, cam.pitch, cam.range, tileset ? 3 : 2.5);
    if (token === navToken) {
      if (notice) showNotice();
      else say(tileset ? 'Drag to orbit, scroll to zoom. A camera flight is not a walking route.' : 'Grid globe, no 3D scans.');
    }
  }

  // ---------- Free flight ----------
  const flightPosition = () => Cesium.Cartesian3.fromDegrees(fstate.lon, fstate.lat, ground + fstate.height);
  function follow() {
    viewer.camera.lookAt(flightPosition(), new Cesium.HeadingPitchRange(rad(fstate.heading), rad(-30), 1500));
  }
  function paintFlight() {
    if (mode !== 'flight') return;
    $('readout').textContent = `${fstate.paused ? 'Paused' : 'Flying (simulated)'} · Heading ${fstate.heading.toFixed(0)}° · ${fstate.lon.toFixed(4)}, ${fstate.lat.toFixed(4)} · ${fstate.height.toFixed(0)} m above ground · ${fstate.speed.toFixed(0)} m/s`;
    const nb = Tour.nearest(fstate, stops);
    $('nearest').textContent = nb ? `Nearest stop: ${nb.place.name}, ${nb.km.toFixed(1)} km away (straight line)` : '';
  }
  let lastSample = 0;
  function sampleGround(now) {
    if (!tileset || now - lastSample < 300) return;
    lastSample = now;
    const h = viewer.scene.sampleHeight(Cesium.Cartographic.fromDegrees(fstate.lon, fstate.lat));
    if (Number.isFinite(h)) ground += (h - ground) * (h > ground ? 0.5 : 0.1);   // rise fast, sink slowly: stay above rooftops
  }

  function setMode(next) {
    if (next === mode || (!viewer && next === 'flight')) return;
    mode = next;
    $('modeTour').setAttribute('aria-pressed', String(next === 'tour'));
    $('modeFlight').setAttribute('aria-pressed', String(next === 'flight'));
    $('dockTour').hidden = next !== 'tour';
    $('dockFlight').hidden = next !== 'flight';
    plane.show = next === 'flight';
    document.body.classList.toggle('flight', next === 'flight');   // flight dock is taller: CSS makes room
    navToken++;                        // cancel any camera move in progress
    viewer.camera.cancelFlight();
    if (next === 'flight') {
      stopAuto();
      setPanel('left', false);                 // keep the view clear while flying
      if (isMobile()) setPanel('right', false);
      const p = stops[i], cam = Tour.cameraFor(p);
      fstate = { ...Flight.initial(), lon: p.lon, lat: p.lat, heading: cam.heading };
      $('speed').value = fstate.speed; $('height').value = fstate.height;
      say('Free flight: press Fly. ← → or A D to turn.');
      paintFlight(); follow();
    } else {
      $('nearest').textContent = '';
      renderStop(); goToStop(stops[i]);
    }
  }
  $('modeTour').onclick = () => setMode('tour');
  $('modeFlight').onclick = () => setMode('flight');

  const turn = d => { if (mode !== 'flight') return; fstate.heading = Flight.wrap(fstate.heading + d); paintFlight(); follow(); };
  $('fly').onclick = () => { fstate.paused = false; paintFlight(); };
  $('pause').onclick = () => { fstate.paused = true; paintFlight(); };
  $('left').onclick = () => turn(-10);
  $('right').onclick = () => turn(10);
  $('reset').onclick = () => {
    const p = stops[i], cam = Tour.cameraFor(p);
    fstate = { ...Flight.initial(), lon: p.lon, lat: p.lat, heading: cam.heading };
    $('speed').value = fstate.speed; $('height').value = fstate.height; paintFlight(); follow();
  };
  for (const [id, min, max] of [['speed', 0, 250], ['height', 50, 5000]]) {
    $(id).onchange = () => { const n = Number($(id).value); if (Number.isFinite(n)) fstate[id] = Flight.clamp(n, min, max); $(id).value = fstate[id]; paintFlight(); follow(); };
  }
  document.addEventListener('keydown', e => {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) || document.querySelector('dialog[open]')) return;
    const left = e.key === 'ArrowLeft' || (mode === 'flight' && e.key.toLowerCase() === 'a');
    const right = e.key === 'ArrowRight' || (mode === 'flight' && e.key.toLowerCase() === 'd');
    if (mode === 'flight') { if (left) turn(-10); if (right) turn(10); }
    else { if (left) go(Tour.prevIndex(i, stops.length)); if (right) go(Tour.nextIndex(i, stops.length)); }
    if (left || right) e.preventDefault();
  });

  // ---------- Start-up ----------
  buildCategories();
  renderList();
  resetAuto();
  setPanel('left', !isMobile());
  setPanel('right', true);

  async function startGlobe() {
    if (typeof Cesium === 'undefined') {
      setNotice('Cesium did not load. The stop list still works; check internet or CDN access for the globe.');
      $('modeFlight').disabled = true; return;
    }
    try {
      viewer = new Cesium.Viewer('globe', {
        baseLayer: false, baseLayerPicker: false, geocoder: false, animation: false,   // geocoder:false is required by Google's terms
        timeline: false, homeButton: false, sceneModePicker: false, navigationHelpButton: false,
        fullscreenButton: false, infoBox: false, selectionIndicator: false,
        terrainProvider: new Cesium.EllipsoidTerrainProvider()
      });
      // BLUE-GLOBE FIX: Cesium paints Globe.baseColor (pure blue by default) wherever no imagery draws.
      // Use a calm dark colour and a visible grid so the fallback looks intentional, not broken.
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#16303a');
      viewer.imageryLayers.addImageryProvider(new Cesium.GridImageryProvider({
        cells: 8, color: Cesium.Color.fromCssColorString('#8fc4d6').withAlpha(0.75),
        glowColor: Cesium.Color.fromCssColorString('#8fc4d6').withAlpha(0.25), backgroundColor: Cesium.Color.fromCssColorString('#16303a')
      }));
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 30;   // do not zoom into the ground
      markers = stops.map((p, n) => viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, 0),                    // longitude FIRST
        point: { pixelSize: 12, color: markerColor(p), outlineColor: Cesium.Color.BLACK, outlineWidth: 2,
                 heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Number.POSITIVE_INFINITY },
        label: { text: `${n + 1}. ${p.name}`, font: '14px sans-serif', pixelOffset: new Cesium.Cartesian2(0, -24), showBackground: true,
                 heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: Number.POSITIVE_INFINITY,
                 distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000000) }
      }));
      plane = viewer.entities.add({
        show: false,
        position: new Cesium.CallbackProperty(flightPosition, false),
        point: { pixelSize: 16, color: Cesium.Color.GOLD, outlineColor: Cesium.Color.BLACK, outlineWidth: 2, disableDepthTestDistance: Number.POSITIVE_INFINITY },
        label: { text: 'SIMULATED FLIGHT', font: '14px sans-serif', pixelOffset: new Cesium.Cartesian2(0, -28), showBackground: true, disableDepthTestDistance: Number.POSITIVE_INFINITY }
      });
      viewer.camera.setView({ destination: Cesium.Cartesian3.fromDegrees(18, 3, 9000000) });   // whole continent

      let last = performance.now(), lastPaint = 0;
      viewer.scene.preRender.addEventListener(() => {
        const now = performance.now(), dt = Math.min((now - last) / 1000, 0.1); last = now;
        if (mode !== 'flight') return;
        fstate = Flight.step(fstate, dt);
        sampleGround(now);
        if (!fstate.paused) follow();
        if (now - lastPaint > 150) { paintFlight(); lastPaint = now; }
      });
      renderStop();
    } catch (e) {
      viewer = null; console.error(e);
      setNotice('The globe could not start (is WebGL on?). The stop list still works.');
      $('modeFlight').disabled = true; return;
    }

    if (!ionToken && !googleKey) {
      setNotice('No 3D scans: add a Cesium ion token in config.js (CESIUM_ION_TOKEN). Showing a plain grid globe.');
    } else {
      say('Loading Google Photorealistic 3D Tiles…');
      try {
        const apiOptions = { onlyUsingWithGoogleGeocoder: true };    // we use no other geocoder (Google's terms)
        if (ionToken) Cesium.Ion.defaultAccessToken = ionToken;      // served through Cesium ion (preferred)
        else apiOptions.key = googleKey;                             // or straight from Google with your own key
        tileset = await Cesium.createGooglePhotorealistic3DTileset(apiOptions, { showCreditsOnScreen: true });   // Google requires attributions on screen
        viewer.scene.primitives.add(tileset);

        // BLUE-GLOBE FIX: keep the grid globe visible until real tiles have drawn; only then hide it.
        let ready = false, failures = 0;
        tileset.initialTilesLoaded.addEventListener(() => {
          ready = true; viewer.scene.globe.show = false;
          if (!failures) { notice = ''; say('3D scans loaded.'); }
        });
        tileset.tileFailed.addEventListener(err => {
          failures++; console.error('3D tile failed to load:', err);
          if (failures === 1 || failures % 25 === 0) setNotice(`${failures} Google 3D tile request(s) failed (${describe(err)}). Check your token, its Allowed URLs, and that Google Photorealistic 3D Tiles is in your ion assets.`);
        });
        setTimeout(() => { if (!ready && !notice) setNotice('3D scans are slow or not drawing yet. Open the browser console (F12) and look for red errors.'); }, 20000);
      } catch (e) {
        tileset = null; console.error(e);
        setNotice('Google 3D scans did not load: ' + describe(e) + '. Check the token or key, that Google Photorealistic 3D Tiles is in your ion assets, and URL restrictions.');
      }
    }
    if (stops.length) goToStop(stops[i]);
  }
  startGlobe();
})();
