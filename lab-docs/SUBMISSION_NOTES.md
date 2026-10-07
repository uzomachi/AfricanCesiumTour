# Submission notes (DRAFTS — edit so they are truthful and in your own words)

## Pitch
I want to help **students and visitors who know Africa mostly from a few media images** explore **how long and varied Africa's record of building cities, universities and monuments is** using **Google Photorealistic 3D Tiles plus UNESCO and encyclopedia data**.
**Before sharing I will verify:** every coordinate and date against the source cited in `places.js`, that each pin sits on the named site, and that the 3D scan loads for each stop.

## AI conversation excerpts (from the build session; add your own prompts and confirm what you accepted or rejected)
**Planning.** Prompt: build an African history tour/flight simulator with Cesium, maybe Three.js, using the attached starters. *Accepted:* base it on Tour Lab (Path B) and reuse Flight Lab's `flight-core.js`; list verified stops with sources. *Rejected:* adding Three.js (Cesium already renders everything; a second renderer adds risk).
**Coding.** Issue raised: a height measured from the ellipsoid puts the camera underground at high places such as Nairobi or Lalibela. *Accepted:* sample the surface with `sampleHeightMostDetailed` and treat flight height as "above local ground". *Rejected:* storing a hand-typed elevation for every stop (unsourced data).
**Debugging.** The smoke test showed the "no key" and "key rejected" notices were erased once the first camera flight finished. *Accepted:* keep a persistent `notice` and append it to every status message. Result re-tested.

## Reflection (≈200 words — DRAFT)
I adapted the Tour Lab into an Africa-wide tour with twelve stops from Giza to Lagos, reusing the Flight Lab's movement rules for a free-flight mode over Google's 3D scans. My added feature is an auto-tour with a Fast, Normal or Slow pace and a visible countdown; its timing rule lives in `tour-core.js` as a pure function so it can be tested without a browser. Every stop has a source and a check date, and AI was not allowed to supply coordinates. My break-and-repair exercise was the missing-data record: the page listed "Unverified Stop" under Needs verification, showed 12 of 13 stops, and tests 12 and 14 failed until I restored the file. One limitation is that the Africa-sized check box cannot catch a swapped longitude and latitude for most African locations, so I verified coordinates against their sources and compared pins with a map. Another is that Google's scans vary in age and detail, so newer buildings such as the Iconic Tower may be missing. I could not test the live Google tiles until I added my own restricted API key. *(Edit: say what YOU ran, and delete anything you did not.)*

## Partner feedback (fill in)
Partner name / device: ____  Followed README only? Y/N  Step that was unclear: ____  What I changed because of it: ____

## Honest status of what was run
Run by the assistant: Node tests (35/35), headless-browser smoke tests with a local Cesium 1.145.0 copy and **mocked** Google responses, missing-data exercise on a temporary copy.
**Not run by anyone yet:** the live Google tiles, the six Canvas manual checks, your own break-and-repair, partner review. Do these yourself and log them in `Test_Log.csv`; do not claim them otherwise.
