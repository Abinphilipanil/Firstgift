// ==========================
// 1) CONFIG YOU WILL CHANGE
// ==========================

// Set your passcode here.
// Tip: Use something only you two understand.
const PASSCODE = "Abhi@123";

// Optional: set display name shown on the site (not her real name if you want).
const DISPLAY_NAME = "My Favorite Person";

// Your memory cards (8). Replace the placeholders.
// For photos: put files in /assets/photos/ and update the src below.
const MEMORY_CARDS = [
  {
    title: "Memory #1 Title",
    when: "Month / Year (optional)",
    photo: "assets/photos/photo1.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here. Keep it specific and real."
  },
  {
    title: "Memory #2 Title",
    when: "Season / Year",
    photo: "assets/photos/photo2.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here."
  },
  {
    title: "Memory #3 Title",
    when: "Day / Place",
    photo: "assets/photos/photo3.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here."
  },
  {
    title: "Memory #4 Title",
    when: "Any time",
    photo: "assets/photos/photo4.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here."
  },
  {
    title: "Memory #5 Title",
    when: "Any time",
    photo: "assets/photos/photo5.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here."
  },
  {
    title: "Memory #6 Title",
    when: "Any time",
    photo: "assets/photos/photo6.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here."
  },
  {
    title: "Memory #7 Title",
    when: "Any time",
    photo: "assets/photos/photo7.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here."
  },
  {
    title: "Memory #8 Title",
    when: "Any time",
    photo: "assets/photos/photo8.jpg",
    snippet: "1–2 lines teaser…",
    fullText: "Write the full memory here."
  }
];

// Gratitude notes: short, simple, honest. Replace text.
const GRATITUDE_NOTES = [
  { text: "You do ___, and it makes me feel ___." , tag: "steady" },
  { text: "I appreciate how you ___." , tag: "real" },
  { text: "Thank you for ___ when I ___." , tag: "support" },
  { text: "One thing I admire is ___." , tag: "admire" },
  { text: "You make ordinary moments ___." , tag: "warm" },
  { text: "I feel safe telling you ___." , tag: "trust" },
  { text: "You remind me to ___." , tag: "growth" },
  { text: "I’m grateful for the way you ___." , tag: "kind" },
  { text: "When I doubt myself, you ___." , tag: "strength" },
  { text: "You’ve helped me more than you know by ___." , tag: "impact" }
];

// Final note (write your own).
const FINAL_TITLE = "A note for you";
const FINAL_TEXT = `
I made this little space for you—no big reason, no special date—just because you matter.

Thank you for being the kind of person who makes life feel lighter.

(Replace this with your real final message.)
`;

// ==========================
// 2) GATE LOGIC
// ==========================
const gateEl = document.getElementById("gate");
const appEl = document.getElementById("app");
const gateForm = document.getElementById("gateForm");
const passcodeInput = document.getElementById("passcodeInput");
const gateError = document.getElementById("gateError");
const lockBtn = document.getElementById("lockBtn");

const displayNameEl = document.getElementById("displayName");
const finalTitleEl = document.getElementById("finalTitle");
const finalTextEl = document.getElementById("finalText");

const AUTH_KEY = "friendsite_unlocked";

function unlock() {
  localStorage.setItem(AUTH_KEY, "true");
  showApp();
}

function lock() {
  localStorage.removeItem(AUTH_KEY);
  showGate();
}

function showApp() {
  gateEl.classList.add("hidden");
  appEl.classList.remove("hidden");
}

function showGate() {
  appEl.classList.add("hidden");
  gateEl.classList.remove("hidden");
  passcodeInput.value = "password";
}

function isUnlocked() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  gateError.textContent = "";

  const entered = (passcodeInput.value || "").trim();
  if (!entered) {
    gateError.textContent = "Enter the passcode.";
    return;
  }

  if (entered === PASSCODE) {
    unlock();
  } else {
    gateError.textContent = "Wrong passcode. Try again.";
  }
});

lockBtn.addEventListener("click", lock);

// ==========================
// 3) RENDERING
// ==========================
const cardsGrid = document.getElementById("cardsGrid");
const gratitudeGrid = document.getElementById("gratitudeGrid");

// Modal
const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalMeta = document.getElementById("modalMeta");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");

function renderMemoryCards() {
  cardsGrid.innerHTML = "";

  MEMORY_CARDS.forEach((m, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open memory: ${m.title}`);

    const media = document.createElement("div");
    media.className = "card-media";

    const img = document.createElement("img");
    img.src = m.photo;
    img.alt = m.title;

    media.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = m.title;

    const meta = document.createElement("p");
    meta.className = "card-meta";
    meta.textContent = m.when || " ";

    const snippet = document.createElement("p");
    snippet.className = "card-snippet";
    snippet.textContent = m.snippet || "";

    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(snippet);

    card.appendChild(media);
    card.appendChild(body);

    card.addEventListener("click", () => openModal(idx));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openModal(idx);
    });

    cardsGrid.appendChild(card);
  });
}

function renderGratitude() {
  gratitudeGrid.innerHTML = "";

  GRATITUDE_NOTES.forEach((n, i) => {
    const note = document.createElement("div");
    note.className = "note";

    const top = document.createElement("div");
    top.className = "note-top";

    const dot = document.createElement("div");
    dot.className = "dot";
    // Alternate subtle accents across notes
    if (i % 3 === 0) dot.style.background = "var(--pink)";
    if (i % 3 === 1) dot.style.background = "var(--green)";
    if (i % 3 === 2) dot.style.background = "var(--lav)";

    const tag = document.createElement("small");
    tag.textContent = n.tag ? `#${n.tag}` : "";

    top.appendChild(dot);
    top.appendChild(tag);

    const p = document.createElement("p");
    p.textContent = n.text;

    note.appendChild(top);
    note.appendChild(p);

    gratitudeGrid.appendChild(note);
  });
}

function renderFinal() {
  displayNameEl.textContent = DISPLAY_NAME;
  finalTitleEl.textContent = FINAL_TITLE;
  finalTextEl.textContent = FINAL_TEXT.trim();
}

// ==========================
// 4) MODAL
// ==========================
function openModal(idx) {
  const m = MEMORY_CARDS[idx];
  modalImg.src = m.photo;
  modalMeta.textContent = m.when || "";
  modalTitle.textContent = m.title || "";
  modalText.textContent = m.fullText || "";

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

// ==========================
// 5) INIT
// ==========================
renderMemoryCards();
renderGratitude();
renderFinal();

if (isUnlocked()) showApp();
else showGate();
