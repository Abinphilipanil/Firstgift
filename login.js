// login.js
const PASS_HASH_KEY = "memsite_pass_hash";
const SESSION_KEY = "memsite_session_ok";

// ===== Login logic =====
const loginForm = document.getElementById("loginForm");
const passInput = document.getElementById("pass");
const msg = document.getElementById("msg");
const toggleBtn = document.getElementById("togglePass");

if (toggleBtn && passInput) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = passInput.type === "password";
    passInput.type = isHidden ? "text" : "password";
    toggleBtn.textContent = isHidden ? "Hide" : "Show";
  });
}

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

if (loginForm && passInput && msg) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    const savedHash = localStorage.getItem(PASS_HASH_KEY);
    if (!savedHash) {
      msg.textContent = "Passcode not found on this device.";
      return;
    }

    const entered = passInput.value.trim();
    const enteredHash = await sha256(entered);

    if (enteredHash === savedHash) {
      localStorage.setItem(SESSION_KEY, "true");
      window.location.href = "home.html";
    } else {
      msg.textContent = "Incorrect passcode.";
    }
  });
}


// ===== Falling Text Background (Matter.js) + Typewriter Quote =====
(function FallingTextBg() {
  const bg = document.getElementById("fallingBg");
  const textHost = document.getElementById("fallingText");
  const canvasHost = document.getElementById("fallingCanvas");
  if (!bg || !textHost || !canvasHost) return;

  // ✅ Quote shown top-left (typewriter)
  const QUOTE_TEXT = "“Hey friend, keep the secret. Stay soft. Stay safe.This is just between us. I’m saying this to you as a friend and offering it as a small, honest gift. There’s nothing you need to prove here and nothing you need to explain. Keep the secret—it’s safe in your hands and safe in this space. Be gentle with your heart, especially on the days when the world feels heavier than it should. It’s okay to slow down, to rest, and to feel things deeply. Stay soft, because that softness is not a weakness—it’s the part of you that makes you real and kind. And stay safe. Take care of yourself in the quiet moments, the unseen ones. Even when nothing is said out loud, know that you’re thought of, you’re valued, and you’re never as alone as you might feel.””";
  const QUOTE_AUTHOR = "— 'A' Frnd";

  // ✅ Background falling text (physics words)
  const TEXT = "Don't break the secret . softness . friendship ."
  const HIGHLIGHT =["secret","softness","friendship"];
  let started = false;
  let engine, render, runner;
  let wordBodies = [];

  // ---------- Inject quote UI + CSS ----------
  function ensureQuoteUI() {
    let quoteBox = document.getElementById("quoteBox");
    if (!quoteBox) {
      quoteBox = document.createElement("div");
      quoteBox.id = "quoteBox";
      quoteBox.innerHTML = `
        <p id="quoteText" class="quote-text"></p>
        <span id="quoteAuthor" class="quote-author" style="display:none;"></span>
      `;
      bg.appendChild(quoteBox);
    }

    if (!document.getElementById("quoteTypewriterStyles")) {
      const style = document.createElement("style");
      style.id = "quoteTypewriterStyles";
      style.textContent = `
        #quoteBox {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          max-width: 420px;
          z-index: 20;
          font-family: Georgia, serif;
          pointer-events: none;
        }
        #quoteBox .quote-text {
          margin: 0;
          font-size: 1.05rem;
          line-height: 1.6;
          color: #e5e7eb;
          white-space: pre-wrap;
        }
        #quoteBox .quote-author {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.9rem;
          color: #9ca3af;
          opacity: 0;
          animation: quoteAuthorFade 450ms ease forwards;
        }
        @keyframes quoteAuthorFade { to { opacity: 1; } }

        #quoteBox .caret {
          display: inline-block;
          width: 8px;
          margin-left: 2px;
          border-right: 2px solid rgba(229,231,235,0.9);
          height: 1em;
          transform: translateY(2px);
          animation: quoteBlink 0.8s steps(1) infinite;
        }
        @keyframes quoteBlink { 50% { opacity: 0; } }
      `;
      document.head.appendChild(style);
    }
  }

  function startTypewriter() {
    ensureQuoteUI();

    const quoteTextEl = document.getElementById("quoteText");
    const authorEl = document.getElementById("quoteAuthor");
    if (!quoteTextEl || !authorEl) return;

    // Reset
    quoteTextEl.textContent = "";
    authorEl.style.display = "none";
    authorEl.textContent = QUOTE_AUTHOR;

    // caret
    const caret = document.createElement("span");
    caret.className = "caret";
    caret.setAttribute("aria-hidden", "true");

    let i = 0;
    const speed = 35;

    const timer = setInterval(() => {
      i += 1;
      quoteTextEl.textContent = QUOTE_TEXT.slice(0, i);
      quoteTextEl.appendChild(caret);

      if (i >= QUOTE_TEXT.length) {
        clearInterval(timer);
        setTimeout(() => {
          authorEl.style.display = "block";
        }, 350);
      }
    }, speed);
  }

  // ---------- Falling words rendering ----------
  function renderWords() {
    const words = TEXT.split(" ");
    textHost.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(" ");
  }

  function cleanup() {
    try {
      if (render) {
        Matter.Render.stop(render);
        if (render.canvas && canvasHost.contains(render.canvas)) {
          canvasHost.removeChild(render.canvas);
        }
      }
      if (runner) Matter.Runner.stop(runner);
      if (engine) {
        Matter.World.clear(engine.world);
        Matter.Engine.clear(engine);
      }
    } catch {}
    engine = null; render = null; runner = null;
    wordBodies = [];
  }

  function fallbackDrop() {
    const spans = [...textHost.querySelectorAll(".word")];
    spans.forEach((el, i) => {
      el.style.position = "absolute";
      el.style.left = (20 + Math.random() * 60) + "vw";
      el.style.top = (20 + Math.random() * 30) + "vh";
      el.style.transition = "transform 1200ms cubic-bezier(.2,.8,.2,1), opacity 1200ms ease";
      el.style.transform = `translate(-50%,-50%) rotate(${(Math.random()-0.5)*40}deg)`;
      setTimeout(() => {
        el.style.opacity = "0";
        el.style.transform = `translate(-50%, 140vh) rotate(${(Math.random()-0.5)*220}deg)`;
      }, 20 + i * 18);
    });
  }

  function startPhysics() {
    if (started) return;
    started = true;

    if (!window.Matter) {
      fallbackDrop();
      return;
    }

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter;

    const rect = bg.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);

    engine = Engine.create();
    engine.world.gravity.y = 1.05;

    render = Render.create({
      element: canvasHost,
      engine,
      options: { width, height, background: "transparent", wireframes: false }
    });

    const wallOpts = { isStatic: true, render: { visible: false } };
    const floor = Bodies.rectangle(width / 2, height + 30, width + 240, 60, wallOpts);
    const left = Bodies.rectangle(-30, height / 2, 60, height + 240, wallOpts);
    const right = Bodies.rectangle(width + 30, height / 2, 60, height + 240, wallOpts);

    const containerRect = bg.getBoundingClientRect();
    const spans = [...textHost.querySelectorAll(".word")];

    wordBodies = spans.map((el) => {
      const r = el.getBoundingClientRect();
      const x = r.left - containerRect.left + r.width / 2;
      const y = r.top - containerRect.top + r.height / 2;

      const body = Bodies.rectangle(x, y, r.width + 10, r.height + 8, {
        restitution: 0.72,
        frictionAir: 0.018,
        friction: 0.15,
        render: { visible: false }
      });

      Body.setVelocity(body, { x: (Math.random() - 0.5) * 4, y: -0.5 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);

      el.style.position = "absolute";
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = "translate(-50%, -50%)";

      return { el, body };
    });

    textHost.style.display = "block";
    textHost.style.placeItems = "unset";

    const mouse = Mouse.create(bg);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    render.mouse = mouse;

    World.add(engine.world, [floor, left, right, mc, ...wordBodies.map(w => w.body)]);

    runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    const tick = () => {
      for (const w of wordBodies) {
        const { x, y } = w.body.position;
        w.el.style.left = `${x}px`;
        w.el.style.top = `${y}px`;
        w.el.style.transform = `translate(-50%, -50%) rotate(${w.body.angle}rad)`;
      }
      requestAnimationFrame(tick);
    };
    tick();
  }

  // init
  renderWords();
  startTypewriter(); // starts immediately

  document.addEventListener("click", (e) => {
    if (e.target && e.target.closest && e.target.closest(".login-panel")) return;
    startPhysics();
  });

  window.addEventListener("resize", () => {
    if (!started) return;
    cleanup();
    started = false;
    renderWords();
  });
})();
