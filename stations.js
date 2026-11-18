/* Curated live streams for Home Radio.
   Only HTTPS URLs that were verified to return audio are listed.
   nowPlaying: optional, free public metadata (skipped quietly when missing). */
window.STATIONS = [
  /* —— New York / New Jersey (priority) —— */
  {
    id: "mirchi-nj",
    section: "local",
    name: "Radio Mirchi",
    nameHi: "रेडियो मिर्ची",
    tagline: "Hindi · New Jersey 92.7 FM",
    taglineHi: "हिंदी · न्यू जर्सी 92.7 FM",
    language: "Hindi",
    stream: "https://playerservices.streamtheworld.com/api/livestream-redirect/NJS_HIN_EST.mp3",
    color: "#C41A22",
    monogram: "RM",
    nowPlaying: { type: "triton", mount: "NJS_HIN_EST" }
  },
  {
    id: "zindagi",
    section: "local",
    name: "Radio Zindagi",
    nameHi: "रेडियो ज़िंदगी",
    tagline: "Hindi · Edison, NJ 96.7 FM",
    taglineHi: "हिंदी · एडिसन, न्यू जर्सी 96.7 FM",
    language: "Hindi",
    stream: "https://us9.maindigitalstream.com/stream/rznynjct",
    color: "#C45A12",
    monogram: "RZ",
    nowPlaying: { type: "icy" }
  },
  {
    id: "mirchi-ny",
    section: "local",
    name: "Radio Mirchi NY",
    nameHi: "रेडियो मिर्ची NY",
    tagline: "Hindi · New York 1600 AM",
    taglineHi: "हिंदी · न्यूयॉर्क 1600 AM",
    language: "Hindi",
    stream: "https://playerservices.streamtheworld.com/api/livestream-redirect/NYC_HIN_EST.mp3",
    color: "#B71C1C",
    monogram: "NY",
    nowPlaying: { type: "triton", mount: "NYC_HIN_EST" }
  },
  {
    id: "ebc",
    section: "local",
    name: "EBC Radio",
    nameHi: "ईबीसी रेडियो",
    tagline: "Hindi · New Jersey 1170 AM",
    taglineHi: "हिंदी · न्यू जर्सी 1170 AM",
    language: "Hindi",
    stream: "https://ice7.securenetsystems.net/WWTR",
    color: "#1A4A8A",
    monogram: "EBC"
  },
  {
    id: "radiodil",
    section: "local",
    name: "Radio Dil",
    nameHi: "रेडियो दिल",
    tagline: "Hindi & Gujarati · NJ / NY",
    taglineHi: "हिंदी और गुजराती · न्यू जर्सी / न्यूयॉर्क",
    language: "Hindi, Gujarati, Marathi",
    stream: "https://us3.streamingpulse.com/ssl/radiodil2",
    color: "#8A1A4A",
    monogram: "DIL",
    nowPlaying: { type: "icy" }
  },
  {
    id: "easy96",
    section: "local",
    name: "Easy 96",
    nameHi: "ईज़ी 96",
    tagline: "Hindi, Punjabi, Gujarati · NY",
    taglineHi: "हिंदी, पंजाबी, गुजराती · न्यूयॉर्क",
    language: "Hindi, Urdu, Punjabi, Gujarati, Bengali",
    stream: "https://ice8.securenetsystems.net/EASY96",
    color: "#1A6A4A",
    monogram: "96"
  },

  /* —— From India (smaller set) —— */
  {
    id: "vividh",
    section: "india",
    name: "Vividh Bharati",
    nameHi: "विविध भारती",
    tagline: "Hindi · All India Radio",
    taglineHi: "हिंदी · आकाशवाणी",
    language: "Hindi",
    stream: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio011/hlspbaudio011_Auto.m3u8",
    color: "#1A5A8A",
    monogram: "VB"
  },
  {
    id: "fmgold",
    section: "india",
    name: "AIR FM Gold",
    nameHi: "एआईआर एफएम गोल्ड",
    tagline: "Hindi · All India Radio, Delhi",
    taglineHi: "हिंदी · आकाशवाणी, दिल्ली",
    language: "Hindi",
    stream: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8",
    color: "#8A6D1C",
    monogram: "GOLD"
  },
  {
    id: "clubmirchi",
    section: "india",
    name: "Club Mirchi",
    nameHi: "क्लब मिर्ची",
    tagline: "Hindi · Radio Mirchi, India",
    taglineHi: "हिंदी · रेडियो मिर्ची, भारत",
    language: "Hindi",
    stream: "https://mirchiplaylive.akamaized.net/hls/live/2036929-b/MUM/CLUBMI_Auto.m3u8",
    color: "#C41A22",
    monogram: "CM"
  }
];
