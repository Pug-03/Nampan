/* ============================================================
   Anniversary site — interactions
   ------------------------------------------------------------
   EDIT THESE TWO LINES to personalise:
   ============================================================ */

// The day your story began (year, month-1, day). March = month 2.
const START_DATE = new Date(2026, 2, 29, 0, 0, 0); // 29 March 2026

// Your slideshow media. Add images or video clips here, in display order.
// Use "video" for .mp4 clips and "image" for photos. If a file is missing it
// is skipped automatically; if none load you get pretty placeholder cards.
const MEDIA = [
  { type: "image", src: "images/photo01.jpg" },
  { type: "image", src: "images/photo02.jpg" },
  { type: "image", src: "images/photo03.jpg" },
  { type: "image", src: "images/photo04.jpg" },
  { type: "image", src: "images/photo05.jpg" },
  { type: "image", src: "images/photo06.jpg" },
  { type: "image", src: "images/photo07.jpg" },
  { type: "image", src: "images/photo08.jpg" },
];

/* ============================================================
   1) Floating hearts & sparkles
   ============================================================ */
// "︎" = the text (line-art) variation selector. It forces these symbols to
// render in the elegant line style instead of Apple/colour emoji, so they look
// the same on iPad, iPhone and PC.
const TEXT_STYLE = "︎";
const SYMBOLS = ["♡", "❤", "✿", "✦", "❀", "♥"].map((s) => s + TEXT_STYLE);
const particleLayer = document.getElementById("particles");
const burstLayer = document.getElementById("particles-front");

function spawnParticle() {
  const p = document.createElement("span");
  p.className = "particle";
  p.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const size = 12 + Math.random() * 22;
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = size + "px";
  p.style.setProperty("--drift", (Math.random() * 160 - 80) + "px");
  p.style.setProperty("--max-opacity", (0.4 + Math.random() * 0.5).toFixed(2));
  const dur = 9 + Math.random() * 8;
  p.style.animationDuration = dur + "s";
  particleLayer.appendChild(p);
  setTimeout(() => p.remove(), dur * 1000 + 200);
}
setInterval(spawnParticle, 420);
for (let i = 0; i < 14; i++) setTimeout(spawnParticle, i * 200);

// A grand, spectacular burst the moment the lid blows off:
// a light flash, expanding shockwave rings, and a radial explosion of hearts.
function grandReveal() {
  // 1) flash of light
  const flash = document.createElement("div");
  flash.className = "flash";
  document.body.appendChild(flash);
  requestAnimationFrame(() => flash.classList.add("go"));
  setTimeout(() => flash.remove(), 1100);

  // 2) several expanding shockwave rings
  for (let r = 0; r < 4; r++) {
    setTimeout(() => {
      const ring = document.createElement("div");
      ring.className = "shockwave";
      document.body.appendChild(ring);
      requestAnimationFrame(() => ring.classList.add("go"));
      setTimeout(() => ring.remove(), 1200);
    }, r * 150);
  }

  // 3) radial explosion of hearts & sparkles in every direction.
  // The reach scales with the screen so it fills big tablets (iPad) too.
  const COLORS = ["#ff8fb8", "#e7779b", "#f7d9a0", "#ffaecd", "#ffffff"];
  const ICONS = ["♡", "❤", "✦", "✿", "❀", "★"].map((s) => s + TEXT_STYLE);
  const reach = Math.max(window.innerWidth, window.innerHeight) * 0.62;

  function spawnConfetti(i, total, spread) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = ICONS[Math.floor(Math.random() * ICONS.length)];
    const angle = (Math.PI * 2 * i) / total + (Math.random() * spread - spread / 2);
    const dist = reach * (0.35 + Math.random() * 0.75);
    c.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    c.style.setProperty("--ty", Math.sin(angle) * dist + "px");
    c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    c.style.setProperty("--dur", (1.0 + Math.random() * 0.9).toFixed(2) + "s");
    c.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    c.style.fontSize = 16 + Math.random() * 30 + "px";
    document.body.appendChild(c);
    requestAnimationFrame(() => c.classList.add("go"));
    setTimeout(() => c.remove(), 2100);
  }

  // wave 1 — a huge immediate burst
  const n1 = 160;
  for (let i = 0; i < n1; i++) spawnConfetti(i, n1, 0.5);
  // wave 2 — a second denser shower a moment later, for a sustained "wow"
  setTimeout(() => {
    const n2 = 120;
    for (let i = 0; i < n2; i++) spawnConfetti(i + Math.random(), n2, 0.9);
  }, 260);
}

// A celebratory burst when the gift opens
function heartBurst() {
  for (let i = 0; i < 90; i++) {
    setTimeout(() => {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      p.style.left = 50 + (Math.random() * 70 - 35) + "vw";
      p.style.fontSize = 16 + Math.random() * 26 + "px";
      p.style.setProperty("--drift", (Math.random() * 300 - 150) + "px");
      p.style.setProperty("--max-opacity", "0.95");
      const dur = 4 + Math.random() * 4;
      p.style.animationDuration = dur + "s";
      burstLayer.appendChild(p);   // front layer, so it pops over the gift
      setTimeout(() => p.remove(), dur * 1000 + 200);
    }, i * 18);
  }
}

/* ============================================================
   2) Open the gift  ->  reveal
   ============================================================ */
const gift = document.getElementById("gift");
const giftScreen = document.getElementById("gift-screen");
const revealScreen = document.getElementById("reveal-screen");
const fontToggle = document.getElementById("font-toggle");

let opened = false;
gift.addEventListener("click", () => {
  if (opened) return;
  opened = true;

  startMusic();        // the tap counts as the gesture browsers need for audio
  gift.classList.add("opening");
  setTimeout(() => {
    gift.classList.add("open");
    grandReveal();      // flash + shockwave + heart explosion
  }, 600);
  setTimeout(heartBurst, 800);

  setTimeout(() => {
    giftScreen.classList.remove("active");
    revealScreen.classList.add("active");
    fontToggle.hidden = false;
    if (musicAvailable) musicToggle.hidden = false;
    window.scrollTo(0, 0);
    startCounter();
    initSlideshow();
  }, 1600);
});

/* ============================================================
   3) "Days together" live counter
   ============================================================ */
function startCounter() {
  const elDays = document.getElementById("days");
  const elHours = document.getElementById("hours");
  const elMins = document.getElementById("minutes");
  const elSecs = document.getElementById("seconds");
  const sub = document.getElementById("counter-sub");

  // Update a number and give it a little bounce only when it actually changes.
  function bump(el, val) {
    if (el.textContent === val) return;
    el.textContent = val;
    el.classList.remove("pop");
    void el.offsetWidth; // force reflow so the animation restarts
    el.classList.add("pop");
  }

  function tick() {
    const now = new Date();
    let diff = Math.max(0, now - START_DATE) / 1000; // seconds

    const days = Math.floor(diff / 86400); diff -= days * 86400;
    const hours = Math.floor(diff / 3600);  diff -= hours * 3600;
    const mins = Math.floor(diff / 60);     diff -= mins * 60;
    const secs = Math.floor(diff);

    elDays.textContent = days;
    bump(elHours, String(hours).padStart(2, "0"));
    bump(elMins, String(mins).padStart(2, "0"));
    bump(elSecs, String(secs).padStart(2, "0"));

    const months = Math.floor(days / 30.4375);
    if (months >= 1) {
      sub.textContent = `that's about ${months} beautiful month${months > 1 ? "s" : ""} of us`;
    }
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   4) Photo slideshow (with graceful fallback)
   ============================================================ */
function initSlideshow() {
  const slidesEl = document.getElementById("slides");
  const dotsEl = document.getElementById("dots");

  // Probe which media actually load, then build slides (keeping order).
  const checks = MEDIA.map(
    (item) =>
      new Promise((resolve) => {
        if (item.type === "video") {
          const v = document.createElement("video");
          v.onloadedmetadata = () => resolve(item);
          v.onerror = () => resolve(null);
          v.src = item.src;
        } else {
          const img = new Image();
          img.onload = () => resolve(item);
          img.onerror = () => resolve(null);
          img.src = item.src;
        }
      })
  );

  Promise.all(checks).then((results) => {
    build(results.filter(Boolean));
  });

  function build(list) {
    slidesEl.innerHTML = "";
    dotsEl.innerHTML = "";

    if (list.length === 0) {
      // Placeholder cards so the section still looks lovely with no media yet.
      const placeholders = ["Our first chat ♡", "That one laugh", "Us, lately", "More to come…"];
      placeholders.forEach((txt, i) => {
        const s = document.createElement("div");
        s.className = "slide placeholder" + (i === 0 ? " active" : "");
        s.innerHTML = `♡<small>${txt}</small>`;
        slidesEl.appendChild(s);
        addDot(i);
      });
    } else {
      list.forEach((item, i) => {
        const s = document.createElement("div");
        s.className = "slide" + (i === 0 ? " active" : "");
        if (item.type === "video") {
          s.classList.add("slide-video");
          const v = document.createElement("video");
          v.muted = true;
          v.defaultMuted = true;
          v.playsInline = true;
          v.setAttribute("muted", "");        // attribute form is required for autoplay policy
          v.setAttribute("playsinline", "");
          v.preload = "auto";                 // buffer so the first frame shows right away
          v.src = item.src;
          // when a clip finishes, move on to the next slide
          v.addEventListener("ended", () => go(current + 1));
          s.appendChild(v);
        } else {
          s.style.backgroundImage = `url("${item.src}")`;
        }
        slidesEl.appendChild(s);
        addDot(i);
      });
    }
    enableSwipe();
    go(0);
  }

  let current = 0;
  function addDot(i) {
    const d = document.createElement("span");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.addEventListener("click", () => go(i));
    dotsEl.appendChild(d);
  }
  function go(i) {
    const slides = slidesEl.querySelectorAll(".slide");
    const dots = dotsEl.querySelectorAll(".dot");
    if (!slides.length) return;
    current = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === current;
      s.classList.toggle("active", on);
      const v = s.querySelector("video");
      if (v) {
        if (on) { v.currentTime = 0; v.play().catch(() => {}); }
        else { v.pause(); }
      }
    });
    dots.forEach((d, k) => d.classList.toggle("active", k === current));
    schedule(slides[current]);
  }
  let timer;
  // Images advance after 4.5s; videos play through (with a safety timeout).
  function schedule(slideEl) {
    clearTimeout(timer);
    const v = slideEl && slideEl.querySelector("video");
    if (v) {
      const ms = (v.duration && isFinite(v.duration) ? v.duration * 1000 : 12000) + 800;
      timer = setTimeout(() => go(current + 1), ms); // fallback if "ended" never fires
    } else {
      timer = setTimeout(() => go(current + 1), 4500);
    }
  }

  // Swipe with a finger (or click-drag with a mouse) to flip photos.
  function enableSwipe() {
    let startX = null;
    let startY = null;
    const THRESHOLD = 45; // min horizontal travel to count as a swipe

    slidesEl.addEventListener("pointerdown", (e) => {
      startX = e.clientX;
      startY = e.clientY;
      try { slidesEl.setPointerCapture(e.pointerId); } catch (_) {}
    });

    slidesEl.addEventListener("pointerup", (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      startX = startY = null;
      // ignore mostly-vertical gestures (let the page scroll)
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      go(current + (dx < 0 ? 1 : -1)); // swipe left -> next, right -> prev (go() reschedules)
    });

    slidesEl.addEventListener("pointercancel", () => { startX = startY = null; });
  }
}

/* ============================================================
   5) Background music
   ------------------------------------------------------------
   Drop a file at media/music.mp4 to enable it. If the file is
   missing, the toggle button simply never appears — no errors.
   ============================================================ */
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

// Assume there's a track until the browser tells us the file can't load.
let musicAvailable = true;
music.addEventListener("error", () => {
  musicAvailable = false;
  musicToggle.hidden = true;
});

// .muted class drives which icon shows (speaker vs. speaker-off).
let musicOn = false;
function startMusic() {
  if (!musicAvailable) return;
  music.volume = 0.5;
  music.play().then(() => {
    musicOn = true;
    musicToggle.classList.remove("muted");
  }).catch(() => {
    // Autoplay was blocked or the file is missing — leave it paused/hidden.
  });
}

musicToggle.addEventListener("click", () => {
  if (!musicAvailable) return;
  if (musicOn) {
    music.pause();
    musicOn = false;
    musicToggle.classList.add("muted");
  } else {
    music.play().catch(() => {});
    musicOn = true;
    musicToggle.classList.remove("muted");
  }
});

/* ============================================================
   6) Cycle the number font
   ============================================================ */
// Starts on Comfortaa (the original), then cycles. [font-family, weight, size-scale]
const NUM_FONTS = [
  ["'Comfortaa', 'Segoe UI', system-ui, sans-serif", 700, 1], // D (default)
  ["'Dancing Script', cursive", 700, 1],                       // I
  ["'Marcellus', serif", 400, 1],                              // J
  ["'Prata', serif", 400, 1],                                  // K
];
let fontIdx = 0;
const fontIcon = fontToggle.querySelector(".font-icon");
fontToggle.addEventListener("click", () => {
  fontIdx = (fontIdx + 1) % NUM_FONTS.length;
  const [family, weight, scale] = NUM_FONTS[fontIdx];
  const root = document.documentElement.style;
  root.setProperty("--font-num", family);
  root.setProperty("--num-weight", weight);
  root.setProperty("--num-scale", scale);

  // spin the icon a full turn each press, for a "swap" feel
  fontIcon.classList.remove("spin");
  void fontIcon.offsetWidth; // restart the animation
  fontIcon.classList.add("spin");
});
