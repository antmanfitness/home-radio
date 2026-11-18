/* Home Radio — simple player for iPhone + AirPlay + lock-screen controls */
(() => {
  const STORAGE_FAVS = "homeRadio.favorites";
  const STORAGE_LAST = "homeRadio.lastStation";
  const STORAGE_INSTALL = "homeRadio.hideInstall";

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
  const airplayHelp = document.getElementById("airplayHelp");

  const state = {
    view: "all", // "all" | "favorites"
    favorites: loadFavs(),
    currentId: (function () {
      const last = localStorage.getItem(STORAGE_LAST);
      if (last && stations.some((s) => s.id === last)) return last;
      return stations[0]?.id || null;
    })(),
    playing: false,
    sleepEndsAt: null,
    sleepLabel: null,
    airplayAvailable: false,
    airplayWireless: false,
    error: ""
  };

  let sleepTick = null;
  let toastTimer = null;
  let fadeTimer = null;

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
    return `
      <div class="tile ${playing ? "is-playing" : ""}" role="button" tabindex="0"
           data-play="${s.id}" aria-label="Play ${s.name}">
        <div class="monogram" style="background:${s.color}">${s.monogram}</div>
        <h2 class="tile__name">${escapeHtml(s.name)}</h2>
        <p class="tile__tag">${playing ? `<span class="live-dot">Live</span> · ` : ""}${escapeHtml(s.tagline)}</p>
        <button class="heart ${fav ? "is-on" : ""}" type="button" data-fav="${s.id}"
          aria-label="${fav ? "Remove from favorites" : "Add to favorites"}"
          aria-pressed="${fav}">${iconHeart(fav)}</button>
      </div>`;
  }

  function renderGrid() {
    const list = visibleStations();
    if (state.view === "favorites" && list.length === 0) {
      gridEl.innerHTML = `
        <div class="empty">
          <h2>No favorites yet</h2>
          <p>On All Stations, tap the heart on a station you love. It will show up here so it’s easy to find.</p>
          <button class="btn-solid" type="button" id="showAllBtn">Show all stations</button>
        </div>`;
      document.getElementById("showAllBtn").addEventListener("click", () => {
        state.view = "all";
        render();
      });
      return;
    }
    if (state.view === "all") {
      const groups = [
        { title: "New York & New Jersey", items: stations.filter((s) => s.section === "local") },
        { title: "From India", items: stations.filter((s) => s.section === "india") }
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

  function renderNow() {
    const s = byId(state.currentId) || stations[0];
    if (!s) return;
    document.getElementById("nowArt").style.background = s.color;
    document.getElementById("nowArt").textContent = s.monogram;
    document.getElementById("nowName").textContent = s.name;
    const sub = document.getElementById("nowSub");
    if (state.error) {
      sub.innerHTML = `<span class="status-error">${escapeHtml(state.error)}</span>`;
    } else if (state.sleepEndsAt) {
      sub.innerHTML = `${state.playing ? `<span class="live-dot">Live</span>` : "Paused"} · Sleep ${fmtRemain()}`;
    } else {
      sub.innerHTML = state.playing
        ? `<span class="live-dot">Live</span> · ${escapeHtml(s.tagline)}`
        : `Ready · ${escapeHtml(s.tagline)}`;
    }
    const playBtn = document.getElementById("playBtn");
    playBtn.setAttribute("aria-label", state.playing ? "Pause" : "Play");
    playBtn.innerHTML = state.playing ? iconPause() : iconPlay();

    const air = document.getElementById("airplayBtn");
    air.classList.toggle("is-wireless", state.airplayWireless);
    if (state.airplayWireless) air.setAttribute("aria-label", "AirPlay · playing on a speaker");
    else air.setAttribute("aria-label", "AirPlay — send sound to a HomePod or Apple TV");

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

  function render() {
    renderTabs();
    renderGrid();
    renderNow();
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
    localStorage.setItem(STORAGE_LAST, id);
    if (changed || audio.src !== s.stream) {
      audio.pause();
      audio.src = s.stream;
      audio.load();
    }
    try {
      await audio.play();
      state.playing = true;
    } catch (err) {
      state.playing = false;
      if (user) {
        state.error = "Can’t play this station. Try again, or pick another.";
        toast(state.error);
      }
    }
    updateMediaSession();
    render();
  }

  function pause() {
    audio.pause();
    state.playing = false;
    updateMediaSession();
    renderNow();
  }

  function togglePlay() {
    if (!state.currentId) {
      playStation(stations[0].id);
      return;
    }
    if (state.playing) pause();
    else playStation(state.currentId);
  }

  function step(dir) {
    const list = visibleStations();
    const fallback = stations;
    const pool = list.length ? list : fallback;
    const idx = Math.max(0, pool.findIndex((s) => s.id === state.currentId));
    const next = pool[(idx + dir + pool.length) % pool.length];
    playStation(next.id);
  }

  function toggleFav(id) {
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    saveFavs();
    render();
  }

  /* ---------- AirPlay ---------- */
  function setupAirPlay() {
    // iOS/Safari: show the system AirPlay picker from the audio element
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
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: s.name,
        artist: s.tagline || "Live radio",
        album: "Home Radio",
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
    bind("play", () => playStation(state.currentId || stations[0].id));
    bind("pause", pause);
    bind("stop", pause);
    bind("previoustrack", () => step(-1));
    bind("nexttrack", () => step(1));
  }

  /* ---------- Sleep timer (borrowed from TuneIn / iHeart) ---------- */
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
    toast(`Sleep timer: ${minutes} minutes`);
    renderNow();
  }

  function clearSleep(announce) {
    state.sleepEndsAt = null;
    state.sleepLabel = null;
    if (sleepTick) { clearInterval(sleepTick); sleepTick = null; }
    if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; }
    audio.volume = 1;
    if (announce) toast("Sleep timer off");
  }

  function endSleep() {
    // Gentle fade, then pause — nicer than a hard stop
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
        pause();
        audio.volume = 1;
        clearSleep(false);
        toast("Sleep timer ended. Radio is off.");
        render();
      }
    }, 80);
    state.sleepEndsAt = Date.now(); // leftover 0
  }

  /* ---------- sheets ---------- */
  function openSheet(id) {
    document.getElementById(id).hidden = false;
    const first = document.getElementById(id).querySelector("button");
    first && first.focus();
  }
  function closeSheets() {
    sleepSheet.hidden = true;
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
      e.preventDefault();
      e.stopPropagation();
      toggleFav(fav.dataset.fav);
      return;
    }
    const tile = e.target.closest("[data-play]");
    if (tile) playStation(tile.dataset.play);
  });
  gridEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const tile = e.target.closest("[data-play]");
    if (!tile || e.target.closest("[data-fav]")) return;
    e.preventDefault();
    playStation(tile.dataset.play);
  });

  document.getElementById("playBtn").addEventListener("click", togglePlay);
  document.getElementById("prevBtn").addEventListener("click", () => step(-1));
  document.getElementById("nextBtn").addEventListener("click", () => step(1));
  document.getElementById("airplayBtn").addEventListener("click", openAirPlay);
  document.getElementById("sleepBtn").addEventListener("click", () => {
    renderSleepChoices();
    openSheet("sleepSheet");
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
  airplayHelp.addEventListener("click", (e) => {
    if (e.target === airplayHelp || e.target.closest("[data-close]")) closeSheets();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSheets();
  });

  audio.addEventListener("playing", () => {
    state.playing = true;
    state.error = "";
    updateMediaSession();
    render();
  });
  audio.addEventListener("pause", () => {
    // Ignore pauses caused by seeking/reload mid-play
    if (!audio.ended && document.visibilityState === "hidden") return;
    if (audio.readyState < 2 && state.playing) return;
    // If iOS interrupted, keep UI in sync
    state.playing = !audio.paused;
    updateMediaSession();
    renderNow();
  });
  audio.addEventListener("error", () => {
    state.playing = false;
    state.error = "Can’t play this station. Try another, or check the Wi‑Fi.";
    renderNow();
  });
  audio.addEventListener("waiting", () => {
    // keep playing UI; buffering is normal for live radio
  });

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
  setupAirPlay();
  setupMediaSession();
  maybeInstallTip();
  render();
  updateMediaSession();

  if ("serviceWorker" in navigator) {
    const base = appBase();
    navigator.serviceWorker.register(new URL("sw.js", base), { scope: base.pathname }).catch(() => {});
  }
})();
