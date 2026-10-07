/* TOUR DATA — one record per stop, chronological. Every record uses the same fields.
   Coordinates and claims come from the sources named in each record, checked 2026-10-05.
   No coordinates were guessed by AI: each came from the cited page (see "source").
   Extra optional fields used by this version: country, category, era, explore, view.
   - explore = a suggestion for what to try with the 3D scan (an instruction, not a claim about the scan)
   - view    = camera settings only (heading/pitch in degrees, range in metres); not facts. */
const PLACES = [
  {
    name: "Great Pyramid of Giza",
    country: "Egypt", category: "Ancient & medieval", era: "c. 2600 BC",
    lon: 31.13417, lat: 29.97917,
    description: "Built around 2600 BC, the Great Pyramid originally stood about 146.6 m tall. It was the world's tallest human-made structure for more than 3,700 years, until the mid-13th century AD. The wider pyramid fields from Giza to Dahshur, once part of the Old Kingdom capital Memphis, were inscribed as a UNESCO World Heritage Site in 1979.",
    explore: "Orbit the pyramid and compare its footprint with the buildings around the plateau.",
    view: { heading: 330, pitch: -30, range: 700 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Great Pyramid of Giza' https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza (coordinates, height, date, record); UNESCO https://whc.unesco.org/en/list/86 (1979 inscription)",
    checked: "2026-10-05"
  },
  {
    name: "Al-Azhar Mosque and University",
    country: "Egypt", category: "Ancient & medieval", era: "970–972 CE",
    lon: 31.262683, lat: 30.045709,
    description: "Construction began in 970 CE and the mosque was completed in 972 CE in Fatimid Cairo. It began hiring scholars in 989 and grew into a centre of learning; by the 14th century it was a leading centre for law, theology and Arabic for students from across the Islamic world. Wikipedia describes the affiliated Al-Azhar University as the second-oldest continuously run university in the world, after Al-Qarawiyyin in Fes (a ranking that depends on how 'university' is defined).",
    explore: "Zoom out to see how a 10th-century institution sits inside today's dense Cairo street grid.",
    view: { heading: 20, pitch: -35, range: 600 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Al-Azhar Mosque' https://en.wikipedia.org/wiki/Al-Azhar_Mosque (coordinates, dates, university claim)",
    checked: "2026-10-05"
  },
  {
    name: "Great Zimbabwe",
    country: "Zimbabwe", category: "Ancient & medieval", era: "1100–1450 CE",
    lon: 30.93327, lat: -20.27117,
    description: "UNESCO calls the ruins a unique testimony to the Bantu civilization of the Shona between the 11th and 15th centuries. Built between about 1100 and 1450 AD, the roughly 80-hectare city was an important trading centre. The Great Enclosure wall is about 11 m high and runs roughly 250 m, and Wikipedia calls Great Zimbabwe the largest stone structure in precolonial Southern Africa. Population estimates differ: older figures say about 20,000, a recent study says no more than 10,000.",
    explore: "Look at the curved enclosure walls from above, then tilt down to ground level.",
    view: { heading: 0, pitch: -40, range: 900 },
    photo: "", photoAlt: "",
    source: "UNESCO https://whc.unesco.org/en/list/364 (coordinates S20°16'16.212\" E30°55'59.768\", dates, description); Wikipedia 'Great Zimbabwe' https://en.wikipedia.org/wiki/Great_Zimbabwe (wall size, 'largest stone structure', population estimates)",
    checked: "2026-10-05"
  },
  {
    name: "Rock-Hewn Churches of Lalibela",
    country: "Ethiopia", category: "Ancient & medieval", era: "12th–13th century",
    lon: 39.04111, lat: 12.03167,
    description: "UNESCO identifies 11 medieval monolithic churches, carved down into living rock around the 13th-century 'New Jerusalem'. They are traditionally dated to the reign of the Zagwe king Gebre Meskel Lalibela (r. c. 1181–1221), though scholars debate the timing. Bete Giyorgis, shaped like a cross, was carved downward from volcanic tuff in a trench about 25 × 25 × 30 m. The site was inscribed in 1978 and is still an active place of pilgrimage. The town sits at about 2,500 m above sea level.",
    explore: "Because the churches are carved downward, tilt the camera low and look for the trenches.",
    view: { heading: 0, pitch: -45, range: 500 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Lalibela' https://en.wikipedia.org/wiki/Lalibela (town coordinates 12.03167, 39.04111, dating debate, elevation); UNESCO https://whc.unesco.org/en/list/18 (11 churches, 1978); Wikipedia 'Bete Giyorgis' https://en.wikipedia.org/wiki/Bete_Giyorgis (cross shape, trench size). Coordinates are for the town, not one church.",
    checked: "2026-10-05"
  },
  {
    name: "Kilwa Kisiwani",
    country: "Tanzania", category: "Ancient & medieval", era: "13th–16th century",
    lon: 39.5128, lat: -8.9600,
    description: "A Swahili port city on an island off Tanzania's coast that prospered from Indian Ocean trade. UNESCO says its merchants dealt in gold, silver, pearls, perfumes, Arabian crockery, Persian earthenware and Chinese porcelain, and its coral-stone ruins include a Great Mosque (11th–13th century). Wikipedia reports that Ibn Battuta visited in 1331 and called it one of the most beautiful cities in the world. The ruins of Kilwa Kisiwani and Songo Mnara were inscribed in 1981.",
    explore: "Fly low over the island and note how a major trading city looks from the air today.",
    view: { heading: 0, pitch: -40, range: 1200 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Kilwa Kisiwani' https://en.wikipedia.org/wiki/Kilwa_Kisiwani (coordinates -8.9600, 39.5128, Ibn Battuta 1331); UNESCO https://whc.unesco.org/en/list/144 (trade goods, Great Mosque, 1981)",
    checked: "2026-10-05"
  },
  {
    name: "Timbuktu",
    country: "Mali", category: "Ancient & medieval", era: "15th–16th century peak",
    lon: -2.99944, lat: 16.77333,
    description: "UNESCO describes Timbuktu as an intellectual and spiritual capital and a centre for the spread of Islam across Africa in the 15th and 16th centuries, home to Sankore University and many Koranic schools. Wikipedia notes that hundreds of thousands of manuscripts were collected there over the centuries, and that the city was the southern end of an important trans-Saharan trade route. Timbuktu was inscribed in 1988.",
    explore: "Notice the earthen (mud-brick) architecture and how it differs from the concrete-and-glass stops later in the tour.",
    view: { heading: 0, pitch: -40, range: 900 },
    photo: "", photoAlt: "",
    source: "UNESCO https://whc.unesco.org/en/list/119 (coordinates N16°46'24\" W2°59'58\", description, 1988); Wikipedia 'Timbuktu' https://en.wikipedia.org/wiki/Timbuktu (manuscripts, trade route). Wikipedia's coordinates differ by about 1 km; UNESCO's were used.",
    checked: "2026-10-05"
  },
  {
    name: "Carlton Centre, Johannesburg",
    country: "South Africa", category: "Modern city", era: "1973",
    lon: 28.04667, lat: -26.20556,
    description: "A 50-floor, 223 m tower completed in 1973. Wikipedia states it was the tallest building in Africa for 46 years, from 1973 until 2019. Johannesburg's central business district grew around it as one of the continent's major commercial centres.",
    explore: "Zoom out to see the density of the Johannesburg skyline around the tower.",
    view: { heading: 45, pitch: -30, range: 900 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Carlton Centre' https://en.wikipedia.org/wiki/Carlton_Centre (coordinates, height, floors, 1973, tallest-in-Africa claim). The 'major commercial centre' phrase is general context, not a sourced statistic.",
    checked: "2026-10-05"
  },
  {
    name: "Kenyatta International Convention Centre, Nairobi",
    country: "Kenya", category: "Modern city", era: "1973",
    lon: 36.82306, lat: -1.28861,
    description: "A 105 m, 32-storey complex opened in 1973 and designed by Karl Henrik Nøstvik. Its plenary hall seats up to 5,000, described as the largest conference chamber of its kind in East Africa, and a revolving restaurant crowns the tower. It was renamed the Kenyatta International Convention Centre in 2013.",
    explore: "Compare its tower and drum-shaped hall with the surrounding Nairobi skyline.",
    view: { heading: 200, pitch: -30, range: 600 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Kenyatta International Convention Centre' https://en.wikipedia.org/wiki/Kenyatta_International_Convention_Centre (coordinates, 1973, height, plenary capacity, architect, renaming)",
    checked: "2026-10-05"
  },
  {
    name: "Hassan II Mosque, Casablanca",
    country: "Morocco", category: "Modern city", era: "completed 1993",
    lon: -7.6327, lat: 33.6085,
    description: "Completed on 30 August 1993 on Casablanca's Atlantic waterfront. Wikipedia states that its 210 m minaret is the world's second-tallest minaret.",
    explore: "Follow the waterfront edge and look at how the mosque meets the sea.",
    view: { heading: 90, pitch: -30, range: 900 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Hassan II Mosque' https://en.wikipedia.org/wiki/Hassan_II_Mosque (coordinates 33.6085°N 7.6327°W, completion date, minaret height). 'Atlantic waterfront' is general geography, not quoted from the page.",
    checked: "2026-10-05"
  },
  {
    name: "Kigali Convention Centre",
    country: "Rwanda", category: "Modern city", era: "opened 2016",
    lon: 30.09389, lat: -1.95472,
    description: "A conference centre in Rwanda's capital, opened in 2016 with seating capacity for 2,600 and designed by German architect Roland Dieterle. It is an example of a city investing in meetings, tourism and business infrastructure.",
    explore: "Orbit the building and look at the hills and neighbourhoods around central Kigali.",
    view: { heading: 150, pitch: -30, range: 700 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Kigali Convention Centre' https://en.wikipedia.org/wiki/Kigali_Convention_Centre (coordinates, 2016, capacity, architect). The last sentence is interpretation, not a sourced claim.",
    checked: "2026-10-05"
  },
  {
    name: "Iconic Tower, New Administrative Capital",
    country: "Egypt", category: "Modern city", era: "completed 2024",
    lon: 31.69389, lat: 30.01278,
    description: "At 394 m, the Iconic Tower has been the tallest building in Africa since 2024, according to Wikipedia. It stands in Egypt's New Administrative Capital east of Cairo, a planned city still under development. The 3D scan may predate recent construction here, so some new buildings may be missing.",
    explore: "Zoom out and compare this planned district's street layout with old Cairo at the Al-Azhar stop.",
    view: { heading: 0, pitch: -30, range: 1500 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Iconic Tower (Egypt)' https://en.wikipedia.org/wiki/Iconic_Tower_(Egypt) (coordinates 30.01278°N 31.69389°E, 394 m, 2024, tallest in Africa). 'East of Cairo' and 'planned city still under development' are general context to re-check.",
    checked: "2026-10-05"
  },
  {
    name: "Eko Atlantic, Lagos",
    country: "Nigeria", category: "Modern city", era: "under construction",
    lon: 3.405, lat: 6.40,
    description: "A planned city on land reclaimed from the Atlantic in Lagos State, intended to address coastal erosion while adding commercial and residential space. Wikipedia gives about 10 km² of land and says it is planned for at least 250,000 residents. Its status was 'under construction' in the source, so check current progress before sharing. The 3D scan may not show recent buildings.",
    explore: "Look at the straight shoreline edge of the reclaimed land and compare it with Lagos's older waterfront.",
    view: { heading: 0, pitch: -35, range: 2500 },
    photo: "", photoAlt: "",
    source: "Wikipedia 'Eko Atlantic' https://en.wikipedia.org/wiki/Eko_Atlantic (coordinates are rounded to 6.40°N 3.405°E, so approximate; area, population goal, status 'as of November 2020' in the page). Re-check status before sharing.",
    checked: "2026-10-05"
  }

  /* MISSING-DATA EXERCISE: on a copy, delete this line and the END line below, then reload.
  ,{
    name: "Unverified Stop",
    lon: null, lat: 6.45,
    description: "Coordinates not verified yet.",
    photo: "", photoAlt: "",
    source: "", checked: ""
  }
  END OF EXERCISE */
];
if (typeof module !== 'undefined') module.exports = PLACES;
