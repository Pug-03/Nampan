/* ============================================================
   Anniversary site — interactions
   ------------------------------------------------------------
   EDIT THESE TWO LINES to personalise:
   ============================================================ */

// The day your story began (year, month-1, day). March = month 2.
const START_DATE = new Date(2026, 2, 29, 0, 0, 0); // 29 March 2026

// Your photos. Drop image files in the /images folder and list them here.
// If a file is missing it is skipped automatically; if none load you get
// pretty placeholder cards instead, so the page always looks complete.
const PHOTOS = [
  "images/photo1.jpg",
  "images/photo2.jpg",
  "images/photo3.jpg",
  "images/photo4.jpg",
];

/* ============================================================
   1) Floating hearts & sparkles
   ============================================================ */
const SYMBOLS = ["♡", "❤", "✿", "✦", "❀", "♥"];
const particleLayer = document.getElementById("particles");

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
setInterval(spawnParticle, 650);
for (let i = 0; i < 8; i++) setTimeout(spawnParticle, i * 300);

// A celebratory burst when the gift opens
function heartBurst() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const p = document.createElement("span");
      p.className = "particle";
      p.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      p.style.left = 50 + (Math.random() * 30 - 15) + "vw";
      p.style.fontSize = 16 + Math.random() * 26 + "px";
      p.style.setProperty("--drift", (Math.random() * 300 - 150) + "px");
      p.style.setProperty("--max-opacity", "0.95");
      const dur = 4 + Math.random() * 4;
      p.style.animationDuration = dur + "s";
      particleLayer.appendChild(p);
      setTimeout(() => p.remove(), dur * 1000 + 200);
    }, i * 40);
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

  gift.classList.add("opening");
  setTimeout(() => gift.classList.add("open"), 500);
  setTimeout(heartBurst, 650);

  setTimeout(() => {
    giftScreen.classList.remove("active");
    revealScreen.classList.add("active");
    fontToggle.hidden = false;
    window.scrollTo(0, 0);
    startCounter();
    initSlideshow();
  }, 1300);
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
  const prev = document.getElementById("prevBtn");
  const next = document.getElementById("nextBtn");

  // Probe which photos actually exist, then build slides.
  const checks = PHOTOS.map(
    (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(null);
        img.src = src;
      })
  );

  Promise.all(checks).then((results) => {
    const available = results.filter(Boolean);
    build(available);
  });

  function build(list) {
    slidesEl.innerHTML = "";
    dotsEl.innerHTML = "";

    if (list.length === 0) {
      // Placeholder cards so the section still looks lovely with no photos yet.
      const placeholders = ["Our first chat ♡", "That one laugh", "Us, lately", "More to come…"];
      placeholders.forEach((txt, i) => {
        const s = document.createElement("div");
        s.className = "slide placeholder" + (i === 0 ? " active" : "");
        s.innerHTML = `♡<small>${txt}</small>`;
        slidesEl.appendChild(s);
        addDot(i);
      });
    } else {
      list.forEach((src, i) => {
        const s = document.createElement("div");
        s.className = "slide" + (i === 0 ? " active" : "");
        s.style.backgroundImage = `url("${src}")`;
        slidesEl.appendChild(s);
        addDot(i);
      });
    }
    wireControls();
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
    slides.forEach((s, k) => s.classList.toggle("active", k === current));
    dots.forEach((d, k) => d.classList.toggle("active", k === current));
  }
  let timer;
  function wireControls() {
    prev.onclick = () => { go(current - 1); restart(); };
    next.onclick = () => { go(current + 1); restart(); };
    restart();
  }
  function restart() {
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 4500);
  }
}

/* ============================================================
   5) Cycle the number font
   ============================================================ */
// D, I, J, K — cycles in this order. [font-family, weight]
const NUM_FONTS = [
  ["'Comfortaa', 'Segoe UI', system-ui, sans-serif", 700], // D
  ["'Dancing Script', cursive", 700],                       // I
  ["'Marcellus', serif", 400],                              // J
  ["'Prata', serif", 400],                                  // K
];
let fontIdx = 0;
fontToggle.addEventListener("click", () => {
  fontIdx = (fontIdx + 1) % NUM_FONTS.length;
  const [family, weight] = NUM_FONTS[fontIdx];
  const root = document.documentElement.style;
  root.setProperty("--font-num", family);
  root.setProperty("--num-weight", weight);
});
