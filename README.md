# Desi Dil Radio

A senior-simple live-radio web app for Krishna’s mom. Large CarPlay-style station tiles, a big now-playing bar, favorites, a sleep timer, and an obvious **AirPlay** button so she can send sound to a HomePod or Apple TV.

This is a static site (no build step). It follows the phone’s light/dark mode, uses a system/SF font, and respects **Reduce Transparency** and **Increase Contrast**.

## Live site

https://antmanfitness.github.io/home-radio/

## Put it on her iPhone

1. Open the live link above in **Safari** (AirPlay only works in Safari, not in Chrome).
2. Tap **Share** → **Add to Home Screen**. Open it from the new Radio icon.
3. The app remembers her last station and starts it when she opens it. If the phone needs a tap first, a large **Tap to play** button appears.
4. To hear it on a HomePod or Apple TV, tap **AirPlay** in the now-playing bar and pick the speaker (same Wi‑Fi).
5. Lock the phone — play, pause, and next/previous station work from the lock screen and Control Center.
6. In **Settings** (the gear), she can turn on **Bigger text** or switch the labels to **हिंदी**.

### What a web app cannot do

A website cannot appear as a source in the **Home** app or in **CarPlay**. The reliable path into Apple Home is AirPlay from Safari (or the Home Screen app, which is still Safari). Media Session covers the lock screen.

## Features borrowed from popular radio apps

Kept only what stays simple for her:

- **Apple Music Radio / CarPlay:** large rounded station tiles, a big persistent now-playing bar, typography and spacing, a clearly labeled AirPlay control, and lock-screen / Control Center playback.
- **TuneIn:** Favorites (heart), a full station list, and a sleep timer with a countdown.
- **iHeartRadio:** live radio presented as a logo/tile grid, a sleep timer, and a persistent player so play/pause is always in reach.
- **Radio Garden:** the idea of “tap a station, it just plays.” The globe map was left out — too fussy for everyday use.

Also included, still kept simple:

- **Resume on open**, with a single large Tap to play button when iPhone blocks autoplay.
- **Quiet auto-reconnect** if the stream or Wi‑Fi drops (no error pop-ups).
- **Song titles** on the now-playing bar and lock screen, when a station provides them.
- **Bigger text** and **English / हिंदी** labels, saved on the phone.

The layout is **iPhone Duo** friendly. On the narrow front (cover) screen it stays the simple phone grid, and shows next/previous when they fit. On the large inside screen — or any wide or nearly square window — it becomes two panes: stations on the left, a large now-playing panel on the right. Folding, unfolding, or rotating only reflows the layout; playback does not stop. The app follows the screen size and, when the browser provides it, the fold/hinge (`viewport-segment` environment variables). It does not sniff for a specific device.

Left out on purpose: search, accounts, podcasts, alarms, recommendations, and a world map.

## Stations

The list is built for Krishna’s mom: local NJ/NY South Asian stations first (Radio Mirchi USA and Radio Zindagi in Edison at the top), plus a smaller **From India** group (Vividh Bharati, AIR FM Gold, Club Mirchi). Only HTTPS streams that were verified to return audio are included. Edit `stations.js` to add or change stations.

Favorites, the last station, text size, and language are stored only on the phone (localStorage).

## Local preview

```bash
cd /workspace/home-radio
python3 -m http.server 8787
```

Open http://127.0.0.1:8787 — AirPlay itself is a Safari-on-Apple-device feature and will not appear in Chrome on Linux.
