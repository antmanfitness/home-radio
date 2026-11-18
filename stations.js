/* Only stations with a verified, working HTTPS stream (checked 2026-11-18). */
window.STATIONS = [
  /* —— NY / NJ (local), priority order —— */
  {
    id: "mirchi-nj",
    section: "local",
    name: "Radio Mirchi",
    tagline: "Hindi · New Jersey 92.7 FM",
    language: "Hindi",
    stream: "https://playerservices.streamtheworld.com/api/livestream-redirect/NJS_HIN_EST.mp3",
    color: "#E31C23",
    monogram: "M"
  },
  {
    id: "zindagi",
    section: "local",
    name: "Radio Zindagi",
    tagline: "Hindi · Edison, NJ 96.7 FM",
    language: "Hindi",
    stream: "https://us9.maindigitalstream.com/stream/rznynjct",
    color: "#C45A12",
    monogram: "RZ"
  },
  {
    id: "mirchi-ny",
    section: "local",
    name: "Radio Mirchi NY",
    tagline: "Hindi · New York 1600 AM",
    language: "Hindi",
    stream: "https://playerservices.streamtheworld.com/api/livestream-redirect/NYC_HIN_EST.mp3",
    color: "#B71C1C",
    monogram: "NY"
  },
  {
    id: "ebc",
    section: "local",
    name: "EBC Radio",
    tagline: "Hindi · New Jersey 1170 AM",
    language: "Hindi",
    stream: "https://ice7.securenetsystems.net/WWTR",
    color: "#1A4A8A",
    monogram: "EBC"
  },
  {
    id: "radiodil",
    section: "local",
    name: "Radio Dil",
    tagline: "Hindi & Gujarati · NJ / NY",
    language: "Hindi, Gujarati, Marathi",
    stream: "https://us3.streamingpulse.com/ssl/radiodil2",
    color: "#8A1A4A",
    monogram: "DIL"
  },
  {
    id: "easy96",
    section: "local",
    name: "Easy 96",
    tagline: "Hindi, Punjabi, Gujarati · NY",
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
    tagline: "Hindi · All India Radio",
    language: "Hindi",
    stream: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio011/hlspbaudio011_Auto.m3u8",
    color: "#1A5A8A",
    monogram: "VB"
  },
  {
    id: "fmgold",
    section: "india",
    name: "AIR FM Gold",
    tagline: "Hindi · All India Radio, Delhi",
    language: "Hindi",
    stream: "https://airhlspush.pc.cdn.bitgravity.com/httppush/hlspbaudio005/hlspbaudio005_Auto.m3u8",
    color: "#8A6D1C",
    monogram: "GOLD"
  },
  {
    id: "clubmirchi",
    section: "india",
    name: "Club Mirchi",
    tagline: "Hindi · Radio Mirchi, India",
    language: "Hindi",
    stream: "https://mirchiplaylive.akamaized.net/hls/live/2036929-b/MUM/CLUBMI_Auto.m3u8",
    color: "#C41A22",
    monogram: "CM"
  }
];
