// home.js
const SESSION_KEY = "memsite_session_ok";
const REPLIES_KEY = "memsite_replies";

if (localStorage.getItem(SESSION_KEY) !== "true") {
  window.location.href = "login.html";
}

// ===== EDIT CONTENT HERE =====
const DISPLAY_NAME = "For someone important";

const MEMORIES = [
  { title: "Memory 1", when: "Month / Year", photo: "assets/photos/photo1.jpg", text: "Write the full memory here." },
  { title: "Memory 2", when: "Month / Year", photo: "assets/photos/photo2.jpg", text: "Write the full memory here." },
  { title: "Memory 3", when: "Month / Year", photo: "assets/photos/photo3.jpg", text: "Write the full memory here." },
  { title: "Memory 4", when: "Month / Year", photo: "assets/photos/photo4.jpg", text: "Write the full memory here." },
  { title: "Memory 5", when: "Month / Year", photo: "assets/photos/photo5.jpg", text: "Write the full memory here." },
  { title: "Memory 6", when: "Month / Year", photo: "assets/photos/photo6.jpg", text: "Write the full memory here." },
  { title: "Memory 7", when: "Month / Year", photo: "assets/photos/photo7.jpg", text: "Write the full memory here." },
  { title: "Memory 8", when: "Month / Year", photo: "assets/photos/photo8.jpg", text: "Write the full memory here." },
];

const GRATITUDE = [
  { text: "You notice details other people skip.", tag: "thoughtful" },
  { text: "You show up — quietly, consistently.", tag: "steady" },
  { text: "You make hard days easier to carry.", tag: "support" },
  { text: "You’re honest without being harsh.", tag: "real" },
  { text: "You make normal moments feel lighter.", tag: "warm" },
  { text: "You’ve helped me grow in ways I didn’t expect.", tag: "growth" },
];

const LETTER_TITLE = "A small note";
const LETTER_TEXT = "Write your letter here. Keep it simple, specific, and calm.";

const SONGS = [
  { title: "Song 1", artist: "Artist", note: "Short reason (optional).", spotify: "https://open.spotify.com/track/CHANGE_ME" },
  { title: "Song 2", artist: "Artist", note: "Keep it minimal.", spotify: "https://open.spotify.com/track/CHANGE_ME" },
  { title: "Song 3", artist: "Artist", note: "Another one.", spotify: "https://open.spotify.com/track/CHANGE_ME" },
  { title: "Song 4", artist: "Artist", note: "Another one.", spotify: "https://open.spotify.com/track/CHANGE_ME" },
];
// ============================

document.getElementById("displayName").textContent = DISPLAY_NAME;

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "login.html";
});

function escapeHtml(s) {
  return (s || "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[c]));
}

// ===== MODAL =====
const modal = document.getElementById("modal");
const modalBg = document.getElementById("modalBg");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalMeta = document.getElementById("modalMeta");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function openModal(idx) {
  const m = MEMORIES[idx];
  modalImg.src = m.photo;
  modalImg.alt = m.title;
  modalMeta.textContent = m.when || "";
  modalTitle.textContent = m.title || "";
  modalText.textContent = m.text || "";
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}
modalBg.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

// ===== BounceCards =====
const bounceRoot = document.getElementById("bounceCards");

const bounceConfig = {
  animationDelay: 0.55,
  animationStagger: 0.08,
  easeType: "elastic.out(1, 0.55)",
  enableHover: true, // ✅ ENABLE HOVER
};

// detect hover capability (don’t mess with touch devices)
const CAN_HOVER = window.matchMedia && window.matchMedia("(hover: hover)").matches;

function buildTransforms(count) {
  if (count === 1) return ["rotate(0deg) translate(0px)"];
  const transforms = [];
  const maxSpread = 170;
  const mid = (count - 1) / 2;

  for (let i = 0; i < count; i++) {
    const t = (i - mid) / mid;
    const x = t * maxSpread;
    const rot = (i % 2 === 0 ? 1 : -1) * (2 + Math.abs(t) * 4);
    transforms.push(`rotate(${rot.toFixed(1)}deg) translate(${Math.round(x)}px)`);
  }
  return transforms;
}
const transformStyles = buildTransforms(MEMORIES.length);

function renderBounceCards() {
  bounceRoot.innerHTML = "";

  MEMORIES.forEach((m, idx) => {
    const card = document.createElement("div");
    card.className = `bounce-card bc-${idx}`;
    card.style.transform = transformStyles[idx] || "none";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Open memory: ${m.title}`);

    const img = document.createElement("img");
    img.src = m.photo;
    img.alt = m.title;

    card.appendChild(img);

    card.addEventListener("click", () => openModal(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(idx);
    });

    bounceRoot.appendChild(card);
  });

  if (window.gsap) {
    gsap.fromTo(
      ".bounce-card",
      { scale: 0 },
      {
        scale: 1,
        stagger: bounceConfig.animationStagger,
        ease: bounceConfig.easeType,
        delay: bounceConfig.animationDelay
      }
    );
  }

  // ✅ Hover push siblings (desktop only)
  if (bounceConfig.enableHover && CAN_HOVER && window.gsap) {
    enableBounceHover();
  }
}

function enableBounceHover() {
  const getNoRotationTransform = (transformStr) => {
    const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
    if (hasRotate) return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
    if (transformStr === "none") return "rotate(0deg)";
    return `${transformStr} rotate(0deg)`;
  };

  const getPushedTransform = (baseTransform, offsetX) => {
    const translateRegex = /translate\(([-0-9.]+)px\)/;
    const match = baseTransform.match(translateRegex);
    if (match) {
      const currentX = parseFloat(match[1]);
      const newX = currentX + offsetX;
      return baseTransform.replace(translateRegex, `translate(${newX}px)`);
    }
    return baseTransform === "none"
      ? `translate(${offsetX}px)`
      : `${baseTransform} translate(${offsetX}px)`;
  };

  const pushSiblings = (hoveredIdx) => {
    MEMORIES.forEach((_, i) => {
      const target = document.querySelector(`.bc-${i}`);
      if (!target) return;

      gsap.killTweensOf(target);
      const base = transformStyles[i] || "none";

      if (i === hoveredIdx) {
        gsap.to(target, {
          transform: getNoRotationTransform(base),
          duration: 0.35,
          ease: "back.out(1.4)",
          overwrite: "auto"
        });
      } else {
        const offsetX = i < hoveredIdx ? -140 : 140;
        const pushed = getPushedTransform(base, offsetX);
        const distance = Math.abs(hoveredIdx - i);

        gsap.to(target, {
          transform: pushed,
          duration: 0.35,
          ease: "back.out(1.4)",
          delay: distance * 0.04,
          overwrite: "auto"
        });
      }
    });
  };

  const resetSiblings = () => {
    MEMORIES.forEach((_, i) => {
      const target = document.querySelector(`.bc-${i}`);
      if (!target) return;

      gsap.killTweensOf(target);
      gsap.to(target, {
        transform: transformStyles[i] || "none",
        duration: 0.35,
        ease: "back.out(1.4)",
        overwrite: "auto"
      });
    });
  };

  MEMORIES.forEach((_, i) => {
    const card = document.querySelector(`.bc-${i}`);
    if (!card) return;
    card.addEventListener("mouseenter", () => pushSiblings(i));
    card.addEventListener("mouseleave", resetSiblings);
  });
}

renderBounceCards();

// ===== Letter =====
document.getElementById("letterTitle").textContent = LETTER_TITLE;
document.getElementById("letterText").textContent = LETTER_TEXT;
document.getElementById("openLetter").addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("opened");
});

// ===== Gratitude =====
const grEl = document.getElementById("gratitude");
grEl.innerHTML = "";
GRATITUDE.forEach((g, i) => {
  const el = document.createElement("div");
  el.className = "note";
  el.innerHTML = `
    <div class="note-top">
      <div class="dot d${i % 3}"></div>
      <div class="muted small">#${escapeHtml(g.tag || "")}</div>
    </div>
    <div>${escapeHtml(g.text || "")}</div>
  `;
  grEl.appendChild(el);
});

// ===== Replies =====
const replyForm = document.getElementById("replyForm");
const replyText = document.getElementById("replyText");
const replyStatus = document.getElementById("replyStatus");
const replyList = document.getElementById("replyList");
const copyReply = document.getElementById("copyReply");
const downloadReply = document.getElementById("downloadReply");

function loadReplies() {
  try { return JSON.parse(localStorage.getItem(REPLIES_KEY) || "[]"); }
  catch { return []; }
}
function saveReplies(list) { localStorage.setItem(REPLIES_KEY, JSON.stringify(list)); }
function renderReplies() {
  const list = loadReplies();
  replyList.innerHTML = "";
  if (!list.length) {
    replyList.innerHTML = `<div class="muted small">No replies saved yet.</div>`;
    return;
  }
  list.slice().reverse().forEach((r) => {
    const item = document.createElement("div");
    item.className = "reply-item";
    item.innerHTML = `
      <div class="muted small">${new Date(r.at).toLocaleString()}</div>
      <div class="reply-text">${escapeHtml(r.text)}</div>
    `;
    replyList.appendChild(item);
  });
}
replyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = (replyText.value || "").trim();
  if (!text) { replyStatus.textContent = "Write something first."; return; }
  const list = loadReplies();
  list.push({ text, at: Date.now() });
  saveReplies(list);
  replyText.value = "";
  replyStatus.textContent = "Saved on this device.";
  renderReplies();
});
copyReply.addEventListener("click", async () => {
  const text = (replyText.value || "").trim();
  if (!text) { replyStatus.textContent = "Nothing to copy."; return; }
  await navigator.clipboard.writeText(text);
  replyStatus.textContent = "Copied.";
});
downloadReply.addEventListener("click", () => {
  const text = (replyText.value || "").trim();
  if (!text) { replyStatus.textContent = "Nothing to download."; return; }
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "reply.txt";
  a.click();
  URL.revokeObjectURL(a.href);
  replyStatus.textContent = "Downloaded.";
});
renderReplies();

// ===== Falling effects =====
const fxToggle = document.getElementById("fxToggle");
const fxLayer = document.getElementById("fxLayer");
let fxOn = false;
let fxTimer = null;

const FALL_ITEMS = ["✿", "❀", "✦", "★", "✧", "❁", "❀", "✦"];

function spawnFx() {
  const el = document.createElement("div");
  el.className = "fx";
  el.textContent = FALL_ITEMS[Math.floor(Math.random() * FALL_ITEMS.length)];
  el.style.left = Math.random() * 100 + "vw";
  el.style.fontSize = (12 + Math.random() * 16) + "px";
  el.style.opacity = (0.30 + Math.random() * 0.45).toFixed(2);
  el.style.animationDuration = (4.5 + Math.random() * 4) + "s";
  fxLayer.appendChild(el);
  setTimeout(() => el.remove(), 9500);
}
function startFx() {
  fxOn = true;
  fxToggle.textContent = "Effects: On";
  fxLayer.classList.remove("hidden");
  fxTimer = setInterval(spawnFx, 200);
}
function stopFx() {
  fxOn = false;
  fxToggle.textContent = "Effects: Off";
  fxLayer.classList.add("hidden");
  if (fxTimer) clearInterval(fxTimer);
  fxTimer = null;
  fxLayer.innerHTML = "";
}
fxToggle.addEventListener("click", () => fxOn ? stopFx() : startFx());
stopFx();

// ===== Songs carousel (LOOPING) =====
const track = document.getElementById("songsTrack");
const carousel = document.getElementById("songsCarousel");
const dots = document.getElementById("songsDots");
const btnPrev = document.getElementById("songsPrev");
const btnNext = document.getElementById("songsNext");
const autoplayCheck = document.getElementById("songsAutoplay");

let index = 0;
let autoplayTimer = null;
let isHover = false;

let isDown = false;
let startX = 0;
let startTx = 0;

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function buildSongCard(song) {
  const card = document.createElement("div");
  card.className = "song-card";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");

  card.innerHTML = `
    <div class="song-top">
      <div class="song-badge">spotify</div>
      <div class="song-title">${escapeHtml(song.title)}</div>
      <div class="song-artist muted small">${escapeHtml(song.artist || "")}</div>
    </div>
    <div class="song-note muted small">${escapeHtml(song.note || "")}</div>
    <div class="song-cta">Open in Spotify →</div>
  `;

  const open = () => song.spotify && window.open(song.spotify, "_blank", "noopener,noreferrer");
  card.addEventListener("click", open);
  card.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && open());

  return card;
}

// Clone ends for seamless loop: [last, ...songs, first]
function getLoopSongs() {
  if (SONGS.length <= 1) return SONGS.slice();
  return [SONGS[SONGS.length - 1], ...SONGS, SONGS[0]];
}

let loopSongs = [];
let internalIndex = 1; // start at first real item

function slideWidth() {
  const card = track.querySelector(".song-card");
  if (!card) return 0;
  const styles = getComputedStyle(track);
  const gap = parseFloat(styles.columnGap || styles.gap || "16") || 16;
  return card.getBoundingClientRect().width + gap;
}

function setTransformForInternalIndex(animate = true) {
  const w = slideWidth();
  track.style.transition = animate ? "transform 350ms cubic-bezier(.2,.8,.2,1)" : "none";
  track.style.transform = `translateX(${-(internalIndex * w)}px)`;
}

function activeRealIndex() {
  if (SONGS.length === 0) return 0;
  // internalIndex maps: 1..n => 0..n-1
  let real = internalIndex - 1;
  if (real < 0) real = SONGS.length - 1;
  if (real > SONGS.length - 1) real = 0;
  return real;
}

function renderDots() {
  dots.innerHTML = "";
  SONGS.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dot-btn";
    b.type = "button";
    b.addEventListener("click", () => goToReal(i));
    dots.appendChild(b);
  });
}

function updateDots() {
  const real = activeRealIndex();
  [...dots.querySelectorAll(".dot-btn")].forEach((b, i) => b.classList.toggle("active", i === real));
}

function renderSongs() {
  track.innerHTML = "";
  loopSongs = getLoopSongs();

  loopSongs.forEach((s) => track.appendChild(buildSongCard(s)));

  renderDots();

  // start position at internalIndex=1 (first real item)
  internalIndex = SONGS.length > 1 ? 1 : 0;
  requestAnimationFrame(() => {
    setTransformForInternalIndex(false);
    updateDots();
  });
}

function next() {
  if (loopSongs.length <= 1) return;
  internalIndex += 1;
  setTransformForInternalIndex(true);
}

function prev() {
  if (loopSongs.length <= 1) return;
  internalIndex -= 1;
  setTransformForInternalIndex(true);
}

function goToReal(realIdx) {
  if (SONGS.length <= 1) return;
  internalIndex = realIdx + 1;
  setTransformForInternalIndex(true);
}

btnNext.addEventListener("click", next);
btnPrev.addEventListener("click", prev);

track.addEventListener("transitionend", () => {
  if (SONGS.length <= 1) return;

  // If we moved to the cloned first (end), jump to real first
  if (internalIndex === loopSongs.length - 1) {
    internalIndex = 1;
    setTransformForInternalIndex(false);
  }
  // If we moved to the cloned last (start), jump to real last
  if (internalIndex === 0) {
    internalIndex = loopSongs.length - 2;
    setTransformForInternalIndex(false);
  }
  updateDots();
});

function startAutoplay() {
  stopAutoplay();
  if (!autoplayCheck.checked) return;
  if (SONGS.length <= 1) return;

  autoplayTimer = setInterval(() => {
    if (isHover) return;
    next();
  }, 1400);
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = null;
}

autoplayCheck.addEventListener("change", startAutoplay);

carousel.addEventListener("mouseenter", () => { isHover = true; });
carousel.addEventListener("mouseleave", () => { isHover = false; });

window.addEventListener("resize", () => {
  setTransformForInternalIndex(false);
});

// Drag/swipe
carousel.addEventListener("pointerdown", (e) => {
  isDown = true;
  carousel.setPointerCapture(e.pointerId);
  startX = e.clientX;
  startTx = getTranslateX(track);
  track.classList.add("dragging");
});

carousel.addEventListener("pointermove", (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  track.style.transition = "none";
  track.style.transform = `translateX(${startTx + dx}px)`;
});

carousel.addEventListener("pointerup", (e) => {
  if (!isDown) return;
  isDown = false;
  track.classList.remove("dragging");

  const dx = e.clientX - startX;
  const threshold = 60;

  if (dx < -threshold) next();
  else if (dx > threshold) prev();
  else setTransformForInternalIndex(true);
});

function getTranslateX(el) {
  const m = getComputedStyle(el).transform;
  if (!m || m === "none") return 0;
  const parts = m.match(/matrix\((.+)\)/);
  if (!parts) return 0;
  const nums = parts[1].split(",").map(n => parseFloat(n.trim()));
  return nums[4] || 0;
}
// =======================
// Gooey Nav (vanilla)
// =======================
function initGooeyNav({
  containerId = "gooeyNav",
  listId = "gooeyNavList",
  filterId = "gooeyFilter",
  textId = "gooeyText",
  animationTime = 600,
  particleCount = 14,
  particleDistances = [90, 12],
  particleR = 100,
  timeVariance = 260,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0
} = {}) {
  const container = document.getElementById(containerId);
  const list = document.getElementById(listId);
  const filter = document.getElementById(filterId);
  const text = document.getElementById(textId);
  if (!container || !list || !filter || !text) return;

  const items = [...list.querySelectorAll("li")];

  let activeIndex = Math.max(0, Math.min(initialActiveIndex, items.length - 1));

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const clearParticles = () => {
    const ps = filter.querySelectorAll(".particle");
    ps.forEach(p => p.remove());
  };

  const makeParticles = () => {
    const d = particleDistances;
    const r = particleR;

    const bubbleTime = animationTime * 2 + timeVariance;
    filter.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);

      filter.classList.remove("active");

      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);

        point.classList.add("point");
        particle.appendChild(point);
        filter.appendChild(particle);

        requestAnimationFrame(() => {
          filter.classList.add("active");
          text.classList.add("active");
        });

        setTimeout(() => {
          try { particle.remove(); } catch {}
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (li) => {
    const containerRect = container.getBoundingClientRect();
    const pos = li.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };

    Object.assign(filter.style, styles);
    Object.assign(text.style, styles);
    text.textContent = li.innerText.trim();
  };

  const setActive = (idx, li) => {
    if (idx === activeIndex) return;

    items.forEach(x => x.classList.remove("active"));
    li.classList.add("active");
    activeIndex = idx;

    updateEffectPosition(li);
    clearParticles();
    text.classList.remove("active");
    // reflow to restart animation
    void text.offsetWidth;
    text.classList.add("active");
    makeParticles();
  };

  // click + keyboard + smooth scroll
  items.forEach((li, idx) => {
    const a = li.querySelector("a");
    if (!a) return;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      setActive(idx, li);

      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    a.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        a.click();
      }
    });
  });

  // initial
  const activeLi = items[activeIndex];
  if (activeLi) {
    activeLi.classList.add("active");
    updateEffectPosition(activeLi);
    text.classList.add("active");
  }

  // keep aligned on resize
  const ro = new ResizeObserver(() => {
    const current = items[activeIndex];
    if (current) updateEffectPosition(current);
  });
  ro.observe(container);
}

// call once after everything is ready
initGooeyNav();

renderSongs();
startAutoplay();
