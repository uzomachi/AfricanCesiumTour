/* ONE PLACE TO CHANGE YOUR TOKEN. Fill in ONE of the two options, save, refresh.
   OPTION A (recommended, no Google account): a Cesium ion access token.
     1. https://ion.cesium.com -> Asset Depot -> add "Google Photorealistic 3D Tiles" to My Assets
     2. https://ion.cesium.com/tokens -> copy the Default token (practice) or create one with only
        assets:read and Allowed URLs = your github.io address + http://localhost:8000/ (public site)
   OPTION B: a Google Map Tiles API key (needs Google Cloud billing; restrict it to the Map Tiles API
     and your github.io address). If both are filled in, the ion token is used.
   This file is public on GitHub Pages, so use a restricted token. Never share a real token in chats.
   Leave the placeholders and the app still runs on a plain grid globe (no 3D scans). */
window.APP_CONFIG = {
  CESIUM_ION_TOKEN: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImhabEhENEwzVFVScGZPQ1giLCJqdGkiOiJlZWJlNWVmNi0wZWY3LTRhYzktOGVjZC05MjI1MGNjZjdlYTUiLCJpZCI6MzQ4MTcsInN1YiI6IlV6b21hY2hpIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6IkFmcmljYW5DZXNpdW1Ub3VyIiwiaWF0IjoxNzkxMzc5MjgwfQ.d2M_wkVGRYMq_8ExYLmHD56O7eDmLpayfpz9vf_nLIA",
  GOOGLE_MAPS_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IldYUWRNSWtlVU9IX2lNaFQiLCJqdGkiOiJlNjJhZmVkYi0zOTlmLTQwYjQtOThhOS0wOGQ4MmYwNmVmNWEiLCJpZCI6MzQ4MTcsInN1YiI6IlV6b21hY2hpIiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6IkFmcmljYVRlc3QiLCJpYXQiOjE3OTEzODEyMDh9.noy_5-EU9hoyHRKUxfX-R_qFmLeoGJpJzrOkujJhl1I"
};
