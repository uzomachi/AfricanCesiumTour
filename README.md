# Africa: Cities & Civilizations — Tour + Flight Lab (AI 101, Path B)

A virtual tour and simulated flight over **Google Photorealistic 3D Tiles**, built on the supplied Tour Lab and Flight Lab starters. Twelve stops, from the Great Pyramid (c. 2600 BC) to Kigali and Lagos, each with a description, source and date checked.

**CesiumJS version: 1.145** (loaded from Cesium's CDN, no build step, no Cesium ion token).

## Run (exact steps)
**Option A — Cesium ion token (no Google account, recommended):**
1. Sign up free at https://ion.cesium.com → Asset Depot → find **Google Photorealistic 3D Tiles** → *Add to my assets*.
2. Access Tokens → create a token with only `assets:read`; under *Allowed URLs* add `https://YOUR-USERNAME.github.io/` (and `http://localhost:8000/` for local tests).
3. Paste it into `config.js` as `CESIUM_ION_TOKEN`.

The free Community plan listed 1,000 Google root tiles per month and is for personal, non-commercial use when I checked on 2026-10-05; re-check the pricing page before relying on it.

**Option B — your own Google key:** Google Cloud → enable billing and **Map Tiles API** → create a key, restrict it to Map Tiles API and your github.io URL, add a budget alert, and paste it as `GOOGLE_MAPS_API_KEY`. If both are set, the ion token is used.

Then:
4. Serve the folder: `python -m http.server 8000`, open http://localhost:8000. Internet and WebGL required.
5. **Publish:** new public GitHub repo → upload all files to the repo root → Settings → Pages → Deploy from a branch → `main` / `(root)` → open the Pages URL.

No token or key set? The app still runs on a plain grid globe (tour, flight and tests all work), and says so on screen. If the 3D tiles fail to load, it falls back the same way and tells you why.

## Use
- **Layout:** full-screen globe, a small floating title, a **Stops** panel on the left (search, Ancient/Modern filter, numbered list) and a **Details** panel on the right (description, "Try this", sources). Both close with ×; ⛶ is full screen; ? opens About and limits.
- **Guided tour** (bottom bar): ◀ / Next, or ← → keys, or click any stop. **Auto-tour** advances every 15, 25 or 40 s (Fast / Normal / Slow) with a countdown.
- **Free flight:** starts at the stop you last viewed. Fly / Pause / Reset, ◀ 10° / 10° ▶ (also ← → or A D), speed 0–250 m/s, height 50–5000 m **above local ground**. The Details panel shows the nearest tour stop.
- Drag to orbit, scroll to zoom. Keep Cesium's and Google's on-screen credits visible.
- **Blue or empty globe?** See `lab-docs/STUDENT_PROMPTS.md` (token steps, symptom table, AI prompt). The page shows a yellow banner explaining why scans are missing.

## What I changed from the starters
| Area | Change |
|---|---|
| `places.js` | 12 sourced records (source URLs + `checked: 2026-10-05`); extra optional fields `country`, `category`, `era`, `explore`, `view` |
| `tour-core.js` | Project area changed from a Pennsylvania box to Africa; added `autoTourStep`, `cameraFor`, `distanceKm`, `nearest` |
| `flight-core.js` | Unchanged from Flight Lab (reused for Free flight) |
| `index.html`, `style.css` | Full-screen globe with floating title, left/right panels and bottom dock (phone-friendly) |
| `app.js` | Google 3D Tiles with fallback and on-screen diagnostics; ground-height sampling; two-phase camera approach; search/filter; auto-tour; flight mode |
| `tests.js` | Original 12 tour checks (fixture moved to Giza) + 7 flight checks + 16 new = 35 |
| `config.js` | New: your Cesium ion token or Google key |

**Assignment feature (small, observable): Auto-tour with a pace selector and countdown.** Everything else (flight mode, stop list, keys) is an extension of the starters.

**Why height is "above local ground":** many stops are high above sea level (Lalibela ≈ 2,500 m, Nairobi, Johannesburg). A height measured from the ellipsoid would put the camera underground, so the app samples the surface height with `scene.sampleHeightMostDetailed` and adds your height to it.

**Why no Three.js:** Cesium already draws the scans, markers and camera. Adding a second renderer would add a dependency and sync problems without a clear benefit for this lab.

## Test
- Open `tests.html` (35 checks) or run `node tests.js`.
- Record results in `Test_Log.csv`; complete the six manual tour checks from Canvas page 05.
- **Missing-data exercise (on a copy):** in `places.js`, delete the `MISSING-DATA EXERCISE` line and the `END OF EXERCISE` line, reload. Expected: page shows *"Unverified Stop: missing source; missing checked; longitude must be a number from -180 to 180"* under "Needs verification", the map shows 12 of 13 stops, and tests 12 and 14 fail. Restore the comments and confirm 35/35.

## Limits (read before sharing)
- **Virtual tour only.** Camera flights are not routes, travel times or accessibility guides. Flight is a point moving on a sphere: no lift, drag, bank, collision or real navigation.
- **Scan age and detail vary by place.** Google's scans can predate new buildings (see Iconic Tower, Eko Atlantic) and some sites may look coarser than others. Not checked against live tiles by the author of this starter (see `Test_Log.csv`).
- **Camera targets the surface at the stop's coordinates**, which for tall towers is the roof.
- **Coordinates:** most are from Wikipedia or UNESCO pages named in each record; Eko Atlantic's source gives only rounded values, Lalibela's point is the town, and Timbuktu's two sources differ by about 1 km. The Africa-wide check box cannot catch a swapped longitude/latitude for most African points (swapped Giza is still inside Africa), so verify against the source.
- **Claims:** Wikipedia is a secondary source; replace with primary sources (UNESCO, museum, official site) where you can. "Second-oldest university" is how Wikipedia words it and depends on definitions.
- **Google terms:** 3D tiles may not be cached, scraped or analysed; no other geocoder may be used; attributions must stay visible. Check current pricing and quotas yourself: billing is required and I could not confirm current free-tier terms.

## Student additions — complete before submission
Audience and purpose: *(draft in `lab-docs/SUBMISSION_NOTES.md`, edit to be yours)*
Stops and sources (with date checked): see `places.js`
Feature changed: Auto-tour (pace selector + countdown)
AI assistance accepted/rejected: *(your three excerpts)*
Tests and evidence: `Test_Log.csv`
Partner reproduction feedback: *(pending)*
Known limitations: see Limits above

## References
- https://cesium.com/learn/cesiumjs/ref-doc/Camera.html#flyToBoundingSphere
- https://cesium.com/learn/cesiumjs/ref-doc/Scene.html#sampleHeightMostDetailed
- https://cesium.com/learn/cesiumjs/ref-doc/createGooglePhotorealistic3DTileset.html
- https://developers.google.com/maps/documentation/tile/policies
- https://developers.google.com/maps/documentation/tile/usage-and-billing
- https://whc.unesco.org/en/list/ (UNESCO World Heritage List, individual entries cited per stop)

CesiumJS is an external dependency with its own license and notices. Google imagery and attributions belong to Google and its data providers.
