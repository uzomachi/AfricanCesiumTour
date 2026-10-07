# Student handout: get the 3D scans working

## A. Get a Cesium ion token (about 5 minutes, free, no Google account)
1. Go to https://ion.cesium.com and create a free account.
2. Open the **Asset Depot** and find **Google Photorealistic 3D Tiles**. Add it to **My Assets** (the button wording may differ).
3. Open **Access Tokens** (https://ion.cesium.com/tokens).
   - *Quickest, fine for local practice:* copy the **Default** token. Cesium says the default token is meant for development, not production.
   - *For your public GitHub site:* **Create token** → name it → turn on only `assets:read` → under **Allowed URLs** choose *Selected URLs* and add `https://YOUR-USERNAME.github.io/` and `http://localhost:8000/`.
4. Open `config.js` and paste it between the quotes: `CESIUM_ION_TOKEN: "eyJ..."`. Save.
5. Run `python -m http.server 8000` in the project folder and open http://localhost:8000 (do **not** double-click `index.html`; a token with Allowed URLs needs a web address to check).
6. Never paste your real token into an AI chat or a screenshot. Replace it with `YOUR_CESIUM_ION_TOKEN` first.

The free plan listed 1,000 Google 3D root-tile loads per month for personal, non-commercial use when this was written (2026-10-05). Do not leave an auto-refreshing tab open.

## B. What the messages on the globe mean
| What you see | Likely cause | Fix |
|---|---|---|
| Solid blue or plain dark globe + yellow banner "No 3D scans…" | `config.js` still has the placeholder | Do section A, save, hard-refresh (Ctrl+Shift+R) |
| Banner says "HTTP 401" or "HTTP 403" | Wrong token, token missing `assets:read`, or Allowed URLs does not match the address bar | Check the token, and that the address (including `http://localhost:8000/`) is listed |
| Banner says "HTTP 404" or "asset not found" | Google Photorealistic 3D Tiles not added to My Assets | Add it in the Asset Depot |
| Grid globe, no banner, scans never appear | Slow network, or blocked by school/ad-block | Wait 20 s; read the console (F12); try another network |
| Camera ends up underground or in the sky | Scan not loaded at that spot yet | Wait for "3D scans loaded", press Next then Previous |
| Works locally but not on GitHub Pages | Pages URL missing from Allowed URLs | Add `https://YOUR-USERNAME.github.io/` (no path needed) |

**Why blue?** Cesium paints `Globe.baseColor`, pure blue by default, wherever no imagery has drawn. This project sets a calmer colour and keeps a grid visible until real tiles load, so a blue screen now means "tiles not drawing", and the banner tells you why.

## C. Prompt to paste into your AI assistant (blue-globe repair)
> I am a student working on a CesiumJS 1.145 project (plain HTML/JS, no build step) that shows Google Photorealistic 3D Tiles through Cesium ion using `Cesium.createGooglePhotorealistic3DTileset`. My globe is a blank blue (or dark grid) sphere and I see no 3D city scans.
>
> What I can see: [paste the yellow banner text exactly] and [paste any red lines from the browser console, F12 → Console]. I run it from [http://localhost:8000 / my GitHub Pages URL / by double-clicking the file].
>
> My `config.js` looks like this (my real token is replaced with a placeholder): `CESIUM_ION_TOKEN: "YOUR_CESIUM_ION_TOKEN"`.
>
> Please:
> 1. Ask me for anything you need to see before guessing.
> 2. Give me a short, ordered checklist to find the cause: token pasted correctly and saved, token has `assets:read`, Allowed URLs matches my address bar, Google Photorealistic 3D Tiles added to My Assets in Cesium ion, served over http(s) not file://, console errors.
> 3. For each check, tell me exactly what I should see if it passes and what to do if it fails.
> 4. Explain in two sentences why the globe is blue when no imagery has loaded (`Globe.baseColor`) and how the code decides when to hide the grid globe.
> 5. If a code change is needed, give the smallest change, tell me which file and line, and explain it so I can describe it in my own words. Do not invent API keys, URLs or Cesium functions; say so if you are unsure and point me to the Cesium documentation.
>
> After I apply the fix I will record in my test log: what I changed, expected result, actual result, pass/fail, and evidence (screenshot with the token hidden).

## D. Prompt to get the token set up (if you are stuck on section A)
> Walk me through creating a free Cesium ion account and getting an access token that works with Google Photorealistic 3D Tiles in CesiumJS. I am a beginner. Give one step at a time, tell me what the screen should look like, and wait for me to say "done" or describe what I see before the next step. Remind me to keep the token out of screenshots and chats.

## E. What to record (for the test log)
Date, message you saw, what you changed, message after, screenshot (token hidden), and one sentence on what you learned. If you could not get scans to load, say so honestly and submit the grid-globe evidence instead.
