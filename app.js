/* Home Radio — simple player for iPhone + AirPlay + lock-screen controls */
(() => {
  const STORAGE_FAVS = "homeRadio.favorites";
  const STORAGE_LAST = "homeRadio.lastStation";
  const STORAGE_INSTALL = "homeRadio.hideInstall";
  const STORAGE_BIG = "homeRadio.bigText";
  const STORAGE_LANG = "homeRadio.lang";

  const RECONNECT_DELAYS = [2000, 5000, 10000, 15000];
  const RECONNECT_MAX_MS = 5 * 60 * 1000;
  const WAITING_RECONNECT_MS = 8000;
  const NOWPLAYING_POLL_MS = 20000;

  const STRINGS = {
    en: {
      appTitle: "Radio",
      favorites: "Favorites",
      allStations: "All Stations",
      stationLists: "Station lists",
      sectionLocal: "New York & New Jersey",
      sectionIndia: "From India",
      chooseStation: "Choose a station",
      tapToPlayHint: "Tap a station to play",
      ready: "Ready",
      live: "Live",
      paused: "Paused",
      sleep: "Sleep",
      airplay: "AirPlay",
      airplayAria: "AirPlay — send sound to a HomePod or Apple TV",
      airplayWireless: "AirPlay · playing on a speaker",
      play: "Play",
      pause: "Pause",
      prev: "Previous station",
      next: "Next station",
      sleepTimer: "Sleep timer",
      sleepLead: "The radio will fade out and stop after this time.",
      min15: "15 minutes",
      min30: "30 minutes",
      min45: "45 minutes",
      min60: "1 hour",
      min90: "90 minutes",
      dontStop: "Don’t stop",
      cancel: "Cancel",
      done: "Done",
      settings: "Settings",
      biggerText: "Bigger text",
      biggerTextHint: "Makes buttons and words easier to read",
      language: "Language",
      installHtml: "<strong>Add this to the Home Screen</strong> so Radio is easy to open: tap the Share button, then <strong>Add to Home Screen</strong>.",
      dismiss: "Dismiss",
      emptyFavTitle: "No favorites yet",
      emptyFavBody: "On All Stations, tap the heart on a station you love. It will show up here so it’s easy to find.",
      showAll: "Show all stations",
      airplayTitle: "Play on a HomePod or Apple TV",
      airplayHelp1: "Open this page in <strong>Safari</strong> on iPhone or iPad, start a station, then tap <strong>AirPlay</strong> and choose the speaker. A web app can’t appear in the Home app or CarPlay, but AirPlay sends the sound to any HomePod or Apple TV on the same Wi‑Fi.",
      airplayHelp2: "On a Mac, the AirPlay button in Safari’s media controls also works.",
      ok: "OK",
      tapToPlay: "Tap to play",
      reconnecting: "Reconnecting…",
      cantReach: "Can’t reach the station. Tap play to try again.",
      cantPlay: "Can’t play this station. Try again, or pick another.",
      sleepSet: "Sleep timer: {n} minutes",
      sleepOff: "Sleep timer off",
      sleepEnded: "Sleep timer ended. Radio is off.",
      addFav: "Add to favorites",
      removeFav: "Remove from favorites"
    },
    hi: {
      appTitle: "रेडियो",
      favorites: "पसंदीदा",
      allStations: "सभी स्टेशन",
      stationLists: "स्टेशन सूची",
      sectionLocal: "न्यूयॉर्क और न्यू जर्सी",
      sectionIndia: "भारत से",
      chooseStation: "स्टेशन चुनें",
      tapToPlayHint: "चलाने के लिए स्टेशन टैप करें",
      ready: "तैयार",
      live: "लाइव",
      paused: "रुका हुआ",
      sleep: "स्लीप",
      airplay: "AirPlay",
      airplayAria: "AirPlay — आवाज़ HomePod या Apple TV पर भेजें",
      airplayWireless: "AirPlay · स्पीकर पर चल रहा है",
      play: "चलाएँ",
      pause: "रोकें",
      prev: "पिछला स्टेशन",
      next: "अगला स्टेशन",
      sleepTimer: "स्लीप टाइमर",
      sleepLead: "रेडियो इतने समय बाद धीरे से बंद हो जाएगा।",
      min15: "15 मिनट",
      min30: "30 मिनट",
      min45: "45 मिनट",
      min60: "1 घंटा",
      min90: "90 मिनट",
      dontStop: "बंद न करें",
      cancel: "रद्द करें",
      done: "हो गया",
      settings: "सेटिंग्स",
      biggerText: "बड़े अक्षर",
      biggerTextHint: "बटन और शब्द पढ़ने में आसान होंगे",
      language: "भाषा",
      installHtml: "<strong>इसे होम स्क्रीन पर जोड़ें</strong> ताकि रेडियो खोलना आसान रहे: Share बटन टैप करें, फिर <strong>Add to Home Screen</strong>।",
      dismiss: "बंद करें",
      emptyFavTitle: "अभी कोई पसंदीदा नहीं",
      emptyFavBody: "सभी स्टेशन पर, जो स्टेशन पसंद हो उसके दिल पर टैप करें। वह यहाँ दिखेगा, ताकि आसानी से मिल जाए।",
      showAll: "सभी स्टेशन दिखाएँ",
      airplayTitle: "HomePod या Apple TV पर चलाएँ",
      airplayHelp1: "iPhone या iPad पर <strong>Safari</strong> में यह पेज खोलें, स्टेशन चलाएँ, फिर <strong>AirPlay</strong> टैप करके स्पीकर चुनें। यह ऐप Home या CarPlay में नहीं दिखता, लेकिन AirPlay से उसी वाई-फ़ाई पर किसी भी HomePod या Apple TV पर आवाज़ जा सकती है।",
      airplayHelp2: "Mac पर, Safari के मीडिया नियंत्रण में AirPlay बटन भी चलता है।",
      ok: "ठीक है",
      tapToPlay: "चलाने के लिए टैप करें",
      reconnecting: "फिर से कनेक्ट हो रहा है…",
      cantReach: "स्टेशन नहीं मिल रहा। फिर कोशिश करने के लिए चलाएँ टैप करें।",
      cantPlay: "यह स्टेशन नहीं चल रहा। फिर कोशिश करें, या दूसरा चुनें।",
      sleepSet: "स्लीप टाइमर: {n} मिनट",
      sleepOff: "स्लीप टाइमर बंद",
      sleepEnded: "स्लीप टाइमर समाप्त। रेडियो बंद है।",
      addFav: "पसंदीदा में जोड़ें",
      removeFav: "पसंदीदा से हटाएँ"
    }
  };

  /* Trailing-slash-safe base for GitHub Pages (/home-radio/) and local preview. */
  function appBase() {
    const url = new URL(window.location.href);
    let path = url.pathname;
    if (path.endsWith("index.html")) path = path.slice(0, -"index.html".length);
    if (!path.endsWith("/")) path += "/";
    url.pathname = path;
    url.search = "";
    url.hash = "";
    return url;
  }

  const stations = window.STATIONS || [];
  const audio = document.getElementById("player");
  const gridEl = document.getElementById("grid");
  const toastEl = document.getElementById("toast");
  const installEl = document.getElementById("installTip");
  const sleepSheet = document.getElementById("sleepSheet");
  const settingsSheet = document.getElementById("settingsSheet");
  const airplayHelp = document.getElementById("airplayHelp");
  const resumeEl = document.getElementById("resumePlay");

  function loadLang() {
    try {
      const v = localStorage.getItem(STORAGE_LANG);
      return v === "hi" ? "hi" : "en";
    } catch {
      return "en";
    }
  }
  function loadBigText() {
    try { return localStorage.getItem(STORAGE_BIG) === "1"; } catch { return false; }
  }
  function loadLastId() {
    try {
      const last = localStorage.getItem(STORAGE_LAST);
      if (last && stations.some((s) => s.id === last)) return last;
    } catch { /* ignore */ }
    return null;
  }

  const state = {
    view: "all",
    favorites: loadFavs(),
    currentId: loadLastId() || stations[0]?.id || null,
    hasLast: !!loadLastId(),
    playing: false,
    wantPlay: false,
    pendingResume: false,
    reconnecting: false,
    sleepEndsAt: null,
    sleepLabel: null,
    airplayAvailable: false,
    airplayWireless: false,
    error: "",
    trackTitle: "",
    trackArtist: "",
    lang: loadLang(),
    bigText: loadBigText()
  };

  let sleepTick = null;
  let toastTimer = null;
  let fadeTimer = null;
  let reconnectTimer = null;
  let reconnectStartedAt = 0;
  let reconnectAttempt = 0;
  let waitingTimer = null;
  let nowPlayingTimer = null;
  let nowPlayingAbort = null;

  function t(key, vars) {
    const pack = STRINGS[state.lang] || STRINGS.en;
    let s = pack[key] || STRINGS.en[key] || key;
    if (vars) s = s.replace(/\{n\}/g, String(vars.n));
    return s;
  }
  function stationName(s) {
    if (!s) return "";
    return state.lang === "hi" && s.nameHi ? s.nameHi : s.name;
  }
  function stationTag(s) {
    if (!s) return "";
    return state.lang === "hi" && s.taglineHi ? s.taglineHi : s.tagline;
  }

  function loadFavs() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_FAVS) || "[]");
      return new Set(Array.isArray(raw) ? raw : []);
    } catch {
      return new Set();
    }
  }
  function saveFavs() {
    localStorage.setItem(STORAGE_FAVS, JSON.stringify([...state.favorites]));
  }

  const byId = (id) => stations.find((s) => s.id === id);
  const visibleStations = () =>
    state.view === "favorites"
      ? stations.filter((s) => state.favorites.has(s.id))
      : stations;

  function toast(msg, ms = 3200) {
    toastEl.textContent = msg;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms);
  }

  function applyI18n() {
    document.documentElement.lang = state.lang === "hi" ? "hi" : "en";
    document.title = t("appTitle");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.getElementById("resumeLabel").textContent = t("tapToPlay");
  }

  function applyBigText() {
    document.documentElement.classList.toggle("big-text", !!state.bigText);
    const btn = document.getElementById("bigTextToggle");
    if (btn) btn.setAttribute("aria-checked", state.bigText ? "true" : "false");
  }

  function applyLangButtons() {
    document.querySelectorAll(".lang-opt").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.lang === state.lang ? "true" : "false");
    });
  }

  function setLang(lang) {
    state.lang = lang === "hi" ? "hi" : "en";
    try { localStorage.setItem(STORAGE_LANG, state.lang); } catch { /* ignore */ }
    applyI18n();
    applyLangButtons();
    updateMediaSession();
    render();
    renderResume();
  }

  function setBigText(on) {
    state.bigText = !!on;
    try { localStorage.setItem(STORAGE_BIG, state.bigText ? "1" : "0"); } catch { /* ignore */ }
    applyBigText();
  }

  /* ---------- render ---------- */
  function iconHeart(filled) {
    const d = "M12 21s-7.2-4.6-9.8-8.8C.2 9.4 1.2 5.5 4.6 4.4 6.8 3.7 9 4.5 12 7.6c3-3.1 5.2-3.9 7.4-3.2 3.4 1.1 4.4 5 2.4 8.8C19.2 16.4 12 21 12 21z";
    return filled
      ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`
      : `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="${d}"/></svg>`;
  }

  function renderTabs() {
    document.querySelectorAll(".tab").forEach((btn) => {
      const on = btn.dataset.view === state.view;
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function tileHTML(s) {
    const fav = state.favorites.has(s.id);
    const playing = s.id === state.currentId && state.playing;
    const name = stationName(s);
    return `
      <div class="tile ${playing ? "is-playing" : ""}" role="button" tabindex="0"
           data-play="${s.id}" aria-label="${t("play")} ${escapeHtml(name)}">
        <div class="monogram" style="background:${s.color}">${s.monogram}</div>
        <h2 class="tile__name">${escapeHtml(name)}</h2>
        <p class="tile__tag">${playing ? `<span class="live-dot">${escapeHtml(t("live"))}</span> · ` : ""}${escapeHtml(stationTag(s))}</p>
        <button class="heart ${fav ? "is-on" : ""}" type="button" data-fav="${s.id}"
          aria-label="${fav ? t("removeFav") : t("addFav")}"
          aria-pressed="${fav}">${iconHeart(fav)}</button>
      </div>`;
  }

  function renderGrid() {
    const list = visibleStations();
    if (state.view === "favorites" && list.length === 0) {
      gridEl.innerHTML = `
        <div class="empty">
          <h2>${escapeHtml(t("emptyFavTitle"))}</h2>
          <p>${escapeHtml(t("emptyFavBody"))}</p>
          <button class="btn-solid" type="button" id="showAllBtn">${escapeHtml(t("showAll"))}</button>
        </div>`;
      document.getElementById("showAllBtn").addEventListener("click", () => {
        state.view = "all";
        render();
      });
      return;
    }
    if (state.view === "all") {
      const groups = [
        { title: t("sectionLocal"), items: stations.filter((s) => s.section === "local") },
        { title: t("sectionIndia"), items: stations.filter((s) => s.section === "india") }
      ];
      gridEl.innerHTML = groups.filter((g) => g.items.length).map((g) => `
        <section class="station-section">
          <h2 class="section-title">${escapeHtml(g.title)}</h2>
          <div class="grid">${g.items.map(tileHTML).join("")}</div>
        </section>`).join("");
      return;
    }
    gridEl.innerHTML = `<div class="grid">${list.map(tileHTML).join("")}</div>`;
  }

  function trackLine() {
    const title = (state.trackTitle || "").trim();
    const artist = (state.trackArtist || "").trim();
    if (title && artist) return `${title} — ${artist}`;
    return title || artist || "";
  }

  function renderNow() {
    const s = byId(state.currentId) || stations[0];
    const nowName = document.getElementById("nowName");
    const sub = document.getElementById("nowSub");
    if (!s) {
      nowName.textContent = t("chooseStation");
      sub.textContent = t("tapToPlayHint");
      return;
    }
    document.getElementById("nowArt").style.background = s.color;
    document.getElementById("nowArt").textContent = s.monogram;
    nowName.textContent = stationName(s);

    if (state.reconnecting && state.wantPlay) {
      sub.innerHTML = `<span class="status-reconnect">${escapeHtml(t("reconnecting"))}</span>`;
    } else if (state.error) {
      sub.innerHTML = `<span class="status-error">${escapeHtml(state.error)}</span>`;
    } else if (state.sleepEndsAt) {
      const song = state.playing ? trackLine() : "";
      const head = state.playing
        ? `<span class="live-dot">${escapeHtml(t("live"))}</span>`
        : escapeHtml(t("paused"));
      sub.innerHTML = song
        ? `${head} · ${escapeHtml(song)} · ${escapeHtml(t("sleep"))} ${escapeHtml(fmtRemain())}`
        : `${head} · ${escapeHtml(t("sleep"))} ${escapeHtml(fmtRemain())}`;
    } else if (state.playing) {
      const song = trackLine();
      sub.innerHTML = song
        ? `<span class="live-dot">${escapeHtml(t("live"))}</span> · ${escapeHtml(song)}`
        : `<span class="live-dot">${escapeHtml(t("live"))}</span> · ${escapeHtml(stationTag(s))}`;
    } else {
      sub.textContent = `${t("ready")} · ${stationTag(s)}`;
    }

    const playBtn = document.getElementById("playBtn");
    playBtn.setAttribute("aria-label", state.playing ? t("pause") : t("play"));
    playBtn.innerHTML = state.playing ? iconPause() : iconPlay();

    const air = document.getElementById("airplayBtn");
    air.classList.toggle("is-wireless", state.airplayWireless);
    air.setAttribute("aria-label", state.airplayWireless ? t("airplayWireless") : t("airplayAria"));

    const sleepBtn = document.getElementById("sleepBtn");
    sleepBtn.classList.toggle("is-active", !!state.sleepEndsAt);
    const badge = sleepBtn.querySelector(".badge");
    if (state.sleepEndsAt) {
      badge.hidden = false;
      badge.textContent = fmtRemain(true);
    } else {
      badge.hidden = true;
    }
  }

  function renderResume() {
    const s = byId(state.currentId);
    const show = !!(state.pendingResume && s && state.wantPlay);
    resumeEl.hidden = !show;
    if (show) {
      document.getElementById("resumeLabel").textContent = t("tapToPlay");
      document.getElementById("resumeStation").textContent = stationName(s);
      document.getElementById("resumePlayBtn").setAttribute(
        "aria-label",
        `${t("tapToPlay")} ${stationName(s)}`
      );
    }
  }

  function render() {
    renderTabs();
    renderGrid();
    renderNow();
    renderResume();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }
  function iconPlay() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.2v13.6c0 .7.8 1.1 1.4.7l10-6.8c.6-.4.6-1.2 0-1.6l-10-6.8C8.8 4.1 8 4.5 8 5.2z"/></svg>`;
  }
  function iconPause() {
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z"/></svg>`;
  }

  /* ---------- playback ---------- */
  async function playStation(id, { user = true } = {}) {
    const s = byId(id);
    if (!s) return;
    const changed = state.currentId !== id;
    state.currentId = id;
    state.error = "";
    state.wantPlay = true;
    if (changed) {
      state.trackTitle = "";
      state.trackArtist = "";
    }
    if (user) state.pendingResume = false;
    try { localStorage.setItem(STORAGE_LAST, id); } catch { /* ignore */ }
    state.hasLast = true;
    if (user) clearReconnect({ keepWant: true });
    if (changed || audio.getAttribute("src") !== s.stream) {
      audio.pause();
      audio.src = s.stream;
      audio.load();
    }
    try {
      await audio.play();
      state.playing = true;
      state.pendingResume = false;
      state.reconnecting = false;
      state.error = "";
    } catch (err) {
      state.playing = false;
      const blocked = isAutoplayBlock(err);
      if (blocked && !user) {
        state.pendingResume = true;
      } else if (state.wantPlay && !blocked) {
        scheduleReconnect();
      } else if (user && blocked) {
        state.pendingResume = true;
      } else if (user) {
        state.error = t("cantPlay");
      }
    }
    updateMediaSession();
    render();
  }

  function isAutoplayBlock(err) {
    if (!err) return false;
    const name = err.name || "";
    const msg = String(err.message || err).toLowerCase();
    return name === "NotAllowedError" || msg.includes("user didn't interact") || msg.includes("autoplay");
  }

  function userStop() {
    state.wantPlay = false;
    state.pendingResume = false;
    state.reconnecting = false;
    state.error = "";
    clearReconnect({ keepWant: false });
    stopNowPlayingPoll();
    audio.pause();
    state.playing = false;
    updateMediaSession();
    render();
  }

  function pause() {
    userStop();
  }

  function togglePlay() {
    if (state.playing || (state.wantPlay && !state.pendingResume && state.reconnecting)) {
      userStop();
      return;
    }
    if (!state.currentId) {
      if (!stations[0]) return;
      playStation(stations[0].id, { user: true });
      return;
    }
    playStation(state.currentId, { user: true });
  }

  function step(dir) {
    const list = visibleStations();
    const fallback = stations;
    const pool = list.length ? list : fallback;
    const idx = Math.max(0, pool.findIndex((s) => s.id === state.currentId));
    const next = pool[(idx + dir + pool.length) % pool.length];
    playStation(next.id, { user: true });
  }

  function toggleFav(id) {
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    saveFavs();
    render();
  }

  /* ---------- Auto-reconnect ---------- */
  function clearReconnect({ keepWant } = {}) {
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    if (waitingTimer) { clearTimeout(waitingTimer); waitingTimer = null; }
    reconnectAttempt = 0;
    reconnectStartedAt = 0;
    state.reconnecting = false;
    if (!keepWant) { /* caller manages wantPlay */ }
  }

  function giveUpReconnect() {
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    if (waitingTimer) { clearTimeout(waitingTimer); waitingTimer = null; }
    reconnectAttempt = 0;
    reconnectStartedAt = 0;
    state.reconnecting = false;
    if (state.wantPlay) state.error = t("cantReach");
    state.playing = false;
    updateMediaSession();
    renderNow();
    renderResume();
  }

  function scheduleReconnect() {
    if (!state.wantPlay || state.pendingResume) return;
    if (!reconnectStartedAt) reconnectStartedAt = Date.now();
    if (Date.now() - reconnectStartedAt > RECONNECT_MAX_MS) {
      giveUpReconnect();
      return;
    }
    if (reconnectTimer) return;
    const idx = Math.min(reconnectAttempt, RECONNECT_DELAYS.length - 1);
    const delay = RECONNECT_DELAYS[idx];
    reconnectAttempt += 1;
    state.reconnecting = true;
    state.error = "";
    renderNow();
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      tryReconnect();
    }, delay);
  }

  function tryReconnect() {
    if (!state.wantPlay || state.pendingResume) return;
    if (reconnectStartedAt && Date.now() - reconnectStartedAt > RECONNECT_MAX_MS) {
      giveUpReconnect();
      return;
    }
    const s = byId(state.currentId);
    if (!s) return;
    state.reconnecting = true;
    state.error = "";
    renderNow();
    try {
      audio.pause();
      audio.src = s.stream;
      audio.load();
    } catch { /* keep going to play() */ }
    audio.play().then(() => {
      /* "playing" handler clears reconnect */
    }).catch((err) => {
      if (isAutoplayBlock(err)) {
        state.pendingResume = true;
        state.reconnecting = false;
        render();
        return;
      }
      scheduleReconnect();
    });
  }

  function onNetworkOnline() {
    if (!state.wantPlay || state.pendingResume) return;
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    reconnectAttempt = 0;
    reconnectStartedAt = Date.now();
    state.reconnecting = true;
    state.error = "";
    renderNow();
    tryReconnect();
  }

  function armWaitingReconnect() {
    if (!state.wantPlay || state.pendingResume) return;
    if (waitingTimer) clearTimeout(waitingTimer);
    waitingTimer = setTimeout(() => {
      waitingTimer = null;
      if (!state.wantPlay || state.pendingResume) return;
      if (audio.readyState >= 3 && !audio.paused) return;
      scheduleReconnect();
    }, WAITING_RECONNECT_MS);
  }

  /* ---------- Now playing metadata ---------- */
  function prettify(str) {
    const t0 = String(str || "").trim();
    if (!t0) return "";
    if (t0 === t0.toUpperCase() && /[A-Z]/.test(t0) && t0.length > 2) {
      return t0.toLowerCase().replace(/(^|[\s(/:&\-,.])(\S)/g, (m, a, b) => a + b.toUpperCase());
    }
    return t0;
  }

  function isJunkTitle(title, artist) {
    const blob = `${title} ${artist}`.trim().toLowerCase();
    if (!blob) return true;
    const junk = ["unknown", "n/a", "na", "-", "—", "null", "undefined", "advertisement", "stream title"];
    return junk.includes(blob) || junk.includes(title.toLowerCase());
  }

  function tritonProp(xml, name) {
    const re = new RegExp(`name="${name}"\\s*>\\s*(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?\\s*</property>`, "i");
    const m = re.exec(xml);
    return m ? m[1].trim() : "";
  }

  async function fetchTriton(mount, signal) {
    const url = `https://np.tritondigital.com/public/nowplaying?mountName=${encodeURIComponent(mount)}&numberToFetch=1&eventType=track&_=${Date.now()}`;
    const res = await fetch(url, { cache: "no-store", signal });
    if (!res.ok) return null;
    const xml = await res.text();
    const title = prettify(tritonProp(xml, "cue_title"));
    const artist = prettify(tritonProp(xml, "track_artist_name"));
    if (isJunkTitle(title, artist)) return null;
    return { title, artist };
  }

  function concatBytes(chunks) {
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) { out.set(c, off); off += c.length; }
    return out;
  }

  async function fetchIcy(url, signal) {
    const res = await fetch(url, {
      mode: "cors",
      cache: "no-store",
      headers: { "Icy-MetaData": "1" },
      signal
    });
    if (!res.ok || !res.body) return null;
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    const max = 40 * 1024;
    try {
      while (received < max) {
        const { done, value } = await reader.read();
        if (done || !value) break;
        chunks.push(value);
        received += value.length;
      }
    } finally {
      try { await reader.cancel(); } catch { /* ignore */ }
    }
    const text = new TextDecoder("iso-8859-1").decode(concatBytes(chunks));
    const m = /StreamTitle='([^']*)'/.exec(text);
    if (!m) return null;
    const raw = m[1].trim();
    if (!raw) return null;
    let title = raw;
    let artist = "";
    const parts = raw.split(" - ");
    if (parts.length >= 2) {
      artist = prettify(parts[0]);
      title = prettify(parts.slice(1).join(" - "));
    } else {
      title = prettify(raw);
    }
    if (isJunkTitle(title, artist)) return null;
    return { title, artist };
  }

  function stopNowPlayingPoll() {
    if (nowPlayingTimer) { clearInterval(nowPlayingTimer); nowPlayingTimer = null; }
    if (nowPlayingAbort) { try { nowPlayingAbort.abort(); } catch { /* ignore */ } nowPlayingAbort = null; }
  }

  async function pollNowPlaying() {
    const s = byId(state.currentId);
    if (!s || !state.playing || state.pendingResume || !s.nowPlaying) return;
    if (nowPlayingAbort) { try { nowPlayingAbort.abort(); } catch { /* ignore */ } }
    const ac = new AbortController();
    nowPlayingAbort = ac;
    const kill = setTimeout(() => ac.abort(), 7000);
    try {
      let info = null;
      if (s.nowPlaying.type === "triton" && s.nowPlaying.mount) {
        info = await fetchTriton(s.nowPlaying.mount, ac.signal);
      } else if (s.nowPlaying.type === "icy") {
        info = await fetchIcy(s.stream, ac.signal);
      }
      if (!info || ac.signal.aborted) return;
      if (s.id !== state.currentId || !state.playing) return;
      const nextTitle = info.title || "";
      const nextArtist = info.artist || "";
      if (nextTitle === state.trackTitle && nextArtist === state.trackArtist) return;
      state.trackTitle = nextTitle;
      state.trackArtist = nextArtist;
      updateMediaSession();
      renderNow();
    } catch {
      /* Station didn't provide metadata, or CORS blocked it — stay quiet. */
    } finally {
      clearTimeout(kill);
    }
  }

  function startNowPlayingPoll() {
    stopNowPlayingPoll();
    const s = byId(state.currentId);
    if (!s || !s.nowPlaying) return;
    pollNowPlaying();
    nowPlayingTimer = setInterval(pollNowPlaying, NOWPLAYING_POLL_MS);
  }

  /* ---------- AirPlay ---------- */
  function setupAirPlay() {
    audio.setAttribute("x-webkit-airplay", "allow");
    if (typeof audio.webkitShowPlaybackTargetPicker === "function") {
      state.airplayAvailable = true;
    }
    audio.addEventListener("webkitplaybacktargetavailabilitychanged", (e) => {
      state.airplayAvailable = e.availability === "available";
    });
    audio.addEventListener("webkitcurrentplaybacktargetiswirelesschanged", () => {
      state.airplayWireless = !!audio.webkitCurrentPlaybackTargetIsWireless;
      renderNow();
    });
  }

  function openAirPlay() {
    if (audio && typeof audio.webkitShowPlaybackTargetPicker === "function") {
      try {
        audio.webkitShowPlaybackTargetPicker();
        return;
      } catch (err) {
        /* fall through to help */
      }
    }
    openSheet("airplayHelp");
  }

  /* ---------- Media Session (lock screen / Control Center) ---------- */
  function updateMediaSession() {
    if (!("mediaSession" in navigator)) return;
    const s = byId(state.currentId);
    if (!s) return;
    const art = new URL("icons/icon-512.png", appBase()).href;
    const song = (state.trackTitle || "").trim();
    const artist = (state.trackArtist || "").trim();
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song || stationName(s),
        artist: song ? (artist || stationName(s)) : (stationTag(s) || "Live radio"),
        album: song ? stationName(s) : "Home Radio",
        artwork: [
          { src: art, sizes: "192x192", type: "image/png" },
          { src: art, sizes: "512x512", type: "image/png" }
        ]
      });
      navigator.mediaSession.playbackState = state.playing ? "playing" : "paused";
    } catch { /* older Safari */ }
  }

  function setupMediaSession() {
    if (!("mediaSession" in navigator)) return;
    const bind = (action, fn) => {
      try { navigator.mediaSession.setActionHandler(action, fn); } catch { /* unsupported */ }
    };
    bind("play", () => playStation(state.currentId || stations[0].id, { user: true }));
    bind("pause", userStop);
    bind("stop", userStop);
    bind("previoustrack", () => step(-1));
    bind("nexttrack", () => step(1));
  }

  /* ---------- Sleep timer ---------- */
  function fmtRemain(short) {
    if (!state.sleepEndsAt) return "";
    const ms = Math.max(0, state.sleepEndsAt - Date.now());
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    if (short) return m >= 1 ? `${m}m` : `${s}s`;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function startSleep(minutes) {
    clearSleep(false);
    if (!minutes) {
      renderNow();
      return;
    }
    state.sleepEndsAt = Date.now() + minutes * 60 * 1000;
    state.sleepLabel = minutes;
    sleepTick = setInterval(() => {
      if (!state.sleepEndsAt) return;
      if (Date.now() >= state.sleepEndsAt) {
        endSleep();
      } else {
        renderNow();
      }
    }, 1000);
    toast(t("sleepSet", { n: minutes }));
    renderNow();
  }

  function clearSleep(announce) {
    state.sleepEndsAt = null;
    state.sleepLabel = null;
    if (sleepTick) { clearInterval(sleepTick); sleepTick = null; }
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    audio.volume = 1;
    if (announce) toast(t("sleepOff"));
  }

  function endSleep() {
    const start = audio.volume || 1;
    const t0 = Date.now();
    const dur = 3500;
    if (fadeTimer) clearInterval(fadeTimer);
    fadeTimer = setInterval(() => {
      const p = Math.min(1, (Date.now() - t0) / dur);
      audio.volume = Math.max(0, start * (1 - p));
      if (p >= 1) {
        clearInterval(fadeTimer);
        fadeTimer = null;
        audio.volume = 1;
        clearSleep(false);
        userStop();
        toast(t("sleepEnded"));
        render();
      }
    }, 80);
    state.sleepEndsAt = Date.now();
  }

  /* ---------- sheets ---------- */
  function openSheet(id) {
    document.getElementById(id).hidden = false;
    const first = document.getElementById(id).querySelector("button");
    first && first.focus();
  }
  function closeSheets() {
    sleepSheet.hidden = true;
    settingsSheet.hidden = true;
    airplayHelp.hidden = true;
  }

  function renderSleepChoices() {
    document.querySelectorAll("[data-sleep]").forEach((btn) => {
      const mins = Number(btn.dataset.sleep);
      const on = mins !== 0 && state.sleepLabel === mins;
      btn.classList.toggle("is-on", on);
    });
  }

  /* ---------- events ---------- */
  document.getElementById("tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    state.view = btn.dataset.view;
    render();
  });

  gridEl.addEventListener("click", (e) => {
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      e.stopPropagation();
      toggleFav(fav.dataset.fav);
      return;
    }
    const tile = e.target.closest("[data-play]");
    if (tile) playStation(tile.dataset.play, { user: true });
  });
  gridEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tile = e.target.closest("[data-play]");
    if (!tile || e.target.closest("[data-fav]")) return;
    e.preventDefault();
    playStation(tile.dataset.play, { user: true });
  });

  document.getElementById("playBtn").addEventListener("click", togglePlay);
  document.getElementById("prevBtn").addEventListener("click", () => step(-1));
  document.getElementById("nextBtn").addEventListener("click", () => step(1));
  document.getElementById("airplayBtn").addEventListener("click", openAirPlay);
  document.getElementById("sleepBtn").addEventListener("click", () => {
    renderSleepChoices();
    openSheet("sleepSheet");
  });
  document.getElementById("settingsBtn").addEventListener("click", () => {
    applyBigText();
    applyLangButtons();
    openSheet("settingsSheet");
  });
  document.getElementById("bigTextToggle").addEventListener("click", () => {
    setBigText(!state.bigText);
  });
  document.getElementById("langSeg").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (btn) setLang(btn.dataset.lang);
  });
  document.getElementById("resumePlayBtn").addEventListener("click", () => {
    if (state.currentId) playStation(state.currentId, { user: true });
  });

  sleepSheet.addEventListener("click", (e) => {
    if (e.target === sleepSheet) closeSheets();
    const btn = e.target.closest("[data-sleep]");
    if (btn) {
      startSleep(Number(btn.dataset.sleep));
      closeSheets();
    }
    if (e.target.closest("[data-close]")) closeSheets();
  });
  settingsSheet.addEventListener("click", (e) => {
    if (e.target === settingsSheet || e.target.closest("[data-close]")) closeSheets();
  });
  airplayHelp.addEventListener("click", (e) => {
    if (e.target === airplayHelp || e.target.closest("[data-close]")) closeSheets();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheets();
  });

  audio.addEventListener("playing", () => {
    state.playing = true;
    state.error = "";
    state.reconnecting = false;
    state.pendingResume = false;
    if (waitingTimer) { clearTimeout(waitingTimer); waitingTimer = null; }
    reconnectAttempt = 0;
    reconnectStartedAt = 0;
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    updateMediaSession();
    startNowPlayingPoll();
    render();
  });
  audio.addEventListener("pause", () => {
    if (state.reconnecting) return;
    if (!audio.ended && document.visibilityState === "hidden") return;
    if (audio.readyState < 2 && state.playing) return;
    state.playing = !audio.paused;
    if (audio.paused && !state.wantPlay) stopNowPlayingPoll();
    updateMediaSession();
    renderNow();
  });
  audio.addEventListener("error", () => {
    if (!state.wantPlay || state.pendingResume) return;
    state.playing = false;
    scheduleReconnect();
  });
  audio.addEventListener("stalled", () => {
    armWaitingReconnect();
  });
  audio.addEventListener("waiting", () => {
    armWaitingReconnect();
  });
  audio.addEventListener("canplay", () => {
    if (waitingTimer) { clearTimeout(waitingTimer); waitingTimer = null; }
  });
  window.addEventListener("online", onNetworkOnline);

  document.getElementById("dismissInstall")?.addEventListener("click", () => {
    localStorage.setItem(STORAGE_INSTALL, "1");
    installEl.hidden = true;
  });

  /* ---------- install tip (Add to Home Screen) ---------- */
  function maybeInstallTip() {
    const standalone = window.navigator.standalone === true
      || window.matchMedia("(display-mode: standalone)").matches;
    if (standalone || localStorage.getItem(STORAGE_INSTALL) === "1") {
      installEl.hidden = true;
    } else {
      installEl.hidden = false;
    }
  }

  /* ---------- boot ---------- */
  applyBigText();
  applyI18n();
  applyLangButtons();
  setupAirPlay();
  setupMediaSession();
  maybeInstallTip();
  render();
  updateMediaSession();

  if (state.hasLast && state.currentId) {
    playStation(state.currentId, { user: false });
  }

  if ("serviceWorker" in navigator) {
    const base = appBase();
    navigator.serviceWorker.register(new URL("sw.js", base), { scope: base.pathname }).catch(() => {});
  }
})();
