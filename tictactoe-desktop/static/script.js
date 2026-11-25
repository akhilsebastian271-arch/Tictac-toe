(() => {
  "use strict";
  const { N, K, other, findWin } = window.TTT;

  // Custom SVG marks for each theme (null = default CSS Neon X / O)
  const SVG_MARKS = {
    minecraft: {
      // Pixel Redstone / Sword X
      X: `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">
            <path d="M2 2h2v2H2zm10 0h2v2h-2zM4 4h2v2H4zm6 0h2v2h-2zM6 6h4v4H6zM4 10h2v2H4zm6 0h2v2h-2zM2 12h2v2H2zm10 0h2v2h-2z" fill="#7f1d1d"/>
            <path d="M3 2h1v1H3zm9 0h1v1h-1zM4 3h2v2H4zm6 0h2v2h-2zM6 5h4v6H6zM4 11h2v2H4zm6 0h2v2h-2zM3 13h1v1H3zm9 0h1v1h-1z" fill="#ef4444"/>
            <path d="M5 4h1v1H5zm5 0h1v1h-1zM7 6h2v4H7z" fill="#fca5a5"/>
          </svg>`,
      // Pixel Ender Pearl / Diamond Ring O
      O: `<svg viewBox="0 0 16 16" shape-rendering="crispEdges">
            <path d="M5 1h6v2H5zm-2 2h2v2H3zm8 0h2v2h-2zM1 5h2v6H1zm12 0h2v6h-2zM3 11h2v2H3zm8 0h2v2h-2zM5 13h6v2H5z" fill="#1e3a8a"/>
            <path d="M5 2h6v2H5zM3 4h2v2H3zm8 0h2v2h-2zM2 5h2v6H2zm10 0h2v6h-2zM3 10h2v2H3zm8 0h2v2h-2zM5 12h6v2H5z" fill="#3b82f6"/>
            <path d="M6 2h4v1H6zM3 6h1v4H3z" fill="#93c5fd"/>
          </svg>`
    },
    amongus: {
      // Red Impostor Crewmate with X visor
      X: `<svg viewBox="0 0 64 64">
            <rect x="10" y="22" width="8" height="24" rx="4" fill="#991b1b" stroke="#0f172a" stroke-width="3"/>
            <path d="M18 18c0-8 6-12 16-12s16 4 16 12v28c0 3-2 5-5 5h-4v-7h-6v7h-6c-3 0-5-2-5-5V18z" fill="#ef4444" stroke="#0f172a" stroke-width="3"/>
            <rect x="27" y="16" width="22" height="12" rx="6" fill="#bae6fd" stroke="#0f172a" stroke-width="3"/>
            <path d="M33 19l8 6M41 19l-8 6" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round"/>
          </svg>`,
      // Blue Crewmate
      O: `<svg viewBox="0 0 64 64">
            <rect x="10" y="22" width="8" height="24" rx="4" fill="#1e40af" stroke="#0f172a" stroke-width="3"/>
            <path d="M18 18c0-8 6-12 16-12s16 4 16 12v28c0 3-2 5-5 5h-4v-7h-6v7h-6c-3 0-5-2-5-5V18z" fill="#3b82f6" stroke="#0f172a" stroke-width="3"/>
            <rect x="27" y="16" width="22" height="12" rx="6" fill="#e0f2fe" stroke="#0f172a" stroke-width="3"/>
            <rect x="31" y="18" width="12" height="3" rx="1.5" fill="#ffffff"/>
          </svg>`
    },
    clash: {
      // Crossed Swords
      X: `<svg viewBox="0 0 64 64">
            <g stroke="#292524" stroke-width="2.5" stroke-linejoin="round">
              <path d="M14 10l8 2 24 24-6 6-24-24-2-8z" fill="#e2e8f0"/>
              <path d="M38 42l10-10 4 4-10 10z" fill="#f59e0b"/>
              <path d="M44 44l8 8-4 4-8-8z" fill="#78350f"/>
              <path d="M50 10l-8 2-24 24 6 6 24-24 2-8z" fill="#f8fafc"/>
              <path d="M26 42L16 32l-4 4 10 10z" fill="#f59e0b"/>
              <path d="M20 44l-8 8 4 4 8-8z" fill="#78350f"/>
            </g>
          </svg>`,
      // Elixir Drop / Shield
      O: `<svg viewBox="0 0 64 64">
            <path d="M32 8C22 22 14 31 14 41c0 10 8 17 18 17s18-7 18-17c0-10-8-19-18-33z" fill="#38bdf8" stroke="#0c4a6e" stroke-width="3.5"/>
            <path d="M25 32c-2 4-3 8-2 12 1 3 3 5 5 6" fill="none" stroke="#e0f2fe" stroke-width="3.5" stroke-linecap="round"/>
          </svg>`
    },
    starwars: {
      // Galactic Empire Crest
      X: `<svg viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="24" fill="none" stroke="#ff2a2a" stroke-width="4"/>
            <circle cx="32" cy="32" r="9" fill="none" stroke="#ff2a2a" stroke-width="3.5"/>
            <path d="M32 8v15M32 41v15M8 32h15M41 32h15M15 15l11 11M38 38l11 11M49 15L38 26M26 38L15 49" stroke="#ff2a2a" stroke-width="3.5"/>
          </svg>`,
      // Rebel Alliance Starbird
      O: `<svg viewBox="0 0 64 64">
            <path d="M32 54C16 50 10 36 14 21c2 7 6 11 10 12-3-7-2-15 4-21l4 8 4-8c6 6 7 14 4 21 4-1 8-5 10-12 4 15-2 29-18 33z" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M32 14l-3 7 3 4 3-4-3-7z" fill="#38bdf8"/>
          </svg>`
    }
  };

  const THEMES = [
    { id: "neon",      label: "Neon",      x: "#ff3fd8", o: "#22e5ff", confetti: ["#ff3fd8", "#22e5ff", "#ffe27a", "#ffffff"] },
    { id: "minecraft", label: "Minecraft", x: "#ff3b3b", o: "#3b82f6", confetti: ["#4ade80", "#ffaa00", "#3b82f6", "#ef4444", "#a855f7"] },
    { id: "amongus",   label: "Among Us",  x: "#ef4444", o: "#3b82f6", confetti: ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#ec4899"] },
    { id: "clash",     label: "Clash",     x: "#ef4444", o: "#38bdf8", confetti: ["#fde047", "#d946ef", "#38bdf8", "#84cc16", "#f97316"] },
    { id: "starwars",  label: "Star Wars", x: "#ff2a2a", o: "#38bdf8", confetti: ["#ff2a2a", "#38bdf8", "#facc15", "#4ade80", "#ffffff"] },
  ];

  const DEFAULT_NAMES = { X: "Player 1", O: "Player 2" };
  const STORE_KEY = "ttt-ultimate";

  const $ = (s) => document.querySelector(s);
  const boardEl = $("#board");
  const strikeEl = $("#strike");
  const statusEl = $("#status");
  const subEl = $("#sub");
  const modalEl = $("#modal");
  const nameEls = { X: document.querySelector('.name[data-p="X"]'),
                    O: document.querySelector('.name[data-p="O"]') };
  const cardEls = { X: $("#card-X"), O: $("#card-O") };
  const scoreEls = { X: $("#score-X"), O: $("#score-O") };
  const iconEls = { X: $("#icon-X"), O: $("#icon-O") };

  // ---------------------------------------------------------------- state
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (_) {}

  const state = {
    board: [], turn: "X", starter: "X",
    over: false, result: null, win: null,
    undo: [], last: null, note: "", round: 0,
    names: { ...DEFAULT_NAMES, ...(saved.names || {}) },
    score: { X: 0, O: 0, Draw: 0, ...(saved.score || {}) },
    theme: Number.isInteger(saved.theme) ? saved.theme % THEMES.length : 0,
    sound: saved.sound !== false,
  };
  let cells = [];

  const persist = () => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        names: state.names, score: state.score, theme: state.theme, sound: state.sound,
      }));
    } catch (_) { /* storage unavailable - game still works */ }
  };

  // ================================================================ SOUND (Web Audio, themed)
  let actx = null;
  function audio() {
    if (!state.sound) return null;
    if (!actx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      actx = new AC();
    }
    if (actx.state === "suspended") actx.resume();
    return actx;
  }

  function tone(freq, start, dur, type = "sine", vol = 0.3, slideTo = null) {
    const a = audio();
    if (!a) return;
    const t0 = a.currentTime + start;
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  const currentThemeId = () => THEMES[state.theme].id;

  const sfx = {
    X: () => {
      const t = currentThemeId();
      if (t === "minecraft") {
        // Block placement pop/thud
        tone(180, 0, 0.07, "square", 0.22, 110);
        tone(320, 0.03, 0.06, "triangle", 0.18, 220);
      } else if (t === "amongus") {
        // Task click / vent blip
        tone(520, 0, 0.06, "sine", 0.28, 780);
      } else if (t === "clash") {
        // Sword metallic clink
        tone(980, 0, 0.09, "triangle", 0.26, 420);
        tone(1480, 0.01, 0.07, "sine", 0.16, 800);
      } else if (t === "starwars") {
        // Red lightsaber / blaster pew
        tone(880, 0, 0.14, "sawtooth", 0.2, 190);
      } else {
        tone(540, 0, 0.14, "triangle", 0.32, 270);
      }
    },
    O: () => {
      const t = currentThemeId();
      if (t === "minecraft") {
        // XP orb chime
        tone(660, 0, 0.09, "sine", 0.24, 880);
      } else if (t === "amongus") {
        // Crewmate scan beep
        tone(440, 0, 0.08, "triangle", 0.28, 660);
      } else if (t === "clash") {
        // Elixir bubble / shield deploy
        tone(340, 0, 0.14, "sine", 0.3, 620);
      } else if (t === "starwars") {
        // Blue lightsaber ignition hum
        tone(140, 0, 0.18, "sawtooth", 0.2, 260);
        tone(280, 0.02, 0.16, "triangle", 0.18, 520);
      } else {
        tone(300, 0, 0.17, "sine", 0.38, 640);
      }
    },
    win: () => {
      const t = currentThemeId();
      if (t === "minecraft") {
        // Minecraft Challenge Complete / Level-up fanfare
        const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        const times = [0.05, 0.16, 0.27, 0.38, 0.54, 0.68];
        const durs  = [0.12, 0.12, 0.12, 0.15, 0.13, 0.38];
        notes.forEach((f, i) => {
          tone(f, times[i], durs[i], "triangle", 0.28);
          tone(f * 0.5, times[i], durs[i], "sine", 0.16);
        });
      } else if (t === "amongus") {
        // Among Us Victory / Role Reveal Sting
        tone(130.81, 0.05, 0.55, "sawtooth", 0.22, 123.47);
        tone(523.25, 0.08, 0.14, "triangle", 0.28);
        tone(622.25, 0.22, 0.14, "triangle", 0.28);
        tone(783.99, 0.36, 0.42, "triangle", 0.32);
        tone(1046.5, 0.36, 0.42, "sine", 0.22);
      } else if (t === "clash") {
        // Clash of Clans Battle Victory Brass Fanfare
        const notes = [392.00, 493.88, 587.33, 783.99, 659.25, 783.99];
        const times = [0.05, 0.17, 0.29, 0.41, 0.58, 0.72];
        const durs  = [0.12, 0.12, 0.12, 0.16, 0.13, 0.42];
        notes.forEach((f, i) => {
          tone(f, times[i], durs[i], "sawtooth", 0.2);
          tone(f, times[i], durs[i], "triangle", 0.24);
        });
      } else if (t === "starwars") {
        // Star Wars Throne Room / Force Theme Heroic Cadence
        const notes = [293.66, 392.00, 440.00, 493.88, 523.25, 587.33, 440.00, 587.33];
        const times = [0.05, 0.22, 0.44, 0.54, 0.64, 0.76, 1.02, 1.18];
        const durs  = [0.16, 0.20, 0.10, 0.10, 0.12, 0.24, 0.15, 0.45];
        notes.forEach((f, i) => {
          tone(f, times[i], durs[i], "sawtooth", 0.22);
          tone(f * 0.5, times[i], durs[i], "triangle", 0.22);
        });
      } else {
        // Original Neon win arpeggio
        [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18 + i * 0.11, 0.22, "triangle", 0.28));
      }
    },
    draw: () => {
      const t = currentThemeId();
      if (t === "amongus") {
        // Emergency alarm two-tone
        tone(480, 0.08, 0.18, "sawtooth", 0.18);
        tone(360, 0.28, 0.26, "sawtooth", 0.18);
      } else {
        tone(330, 0.15, 0.2, "sawtooth", 0.12);
        tone(247, 0.35, 0.32, "sawtooth", 0.12);
      }
    },
    on: () => tone(660, 0, 0.1, "sine", 0.25),
  };

  function renderSoundBtn() {
    const b = $("#soundBtn");
    b.classList.toggle("muted", !state.sound);
    b.setAttribute("aria-pressed", String(state.sound));
    b.title = state.sound ? "Sound on" : "Sound off";
  }

  // ================================================================ CONFETTI (party popper)
  const cv = $("#confetti");
  const cx = cv.getContext("2d");
  let parts = [];
  let raf = null;
  let lastT = 0;

  function sizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(innerWidth * dpr);
    cv.height = Math.round(innerHeight * dpr);
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", sizeCanvas);
  sizeCanvas();

  function burst(ox, oy, angleDeg, count) {
    const colors = THEMES[state.theme].confetti;
    const isPixel = currentThemeId() === "minecraft";
    const scale = Math.max(0.7, Math.min(1.4, innerHeight / 800));
    for (let i = 0; i < count; i++) {
      const a = (angleDeg + (Math.random() - 0.5) * 38) * Math.PI / 180;
      const speed = (9 + Math.random() * 15) * scale;
      const sz = 6 + Math.random() * 7;
      parts.push({
        x: ox, y: oy,
        vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        w: sz, h: isPixel ? sz : (4 + Math.random() * 6),
        rot: isPixel ? 0 : Math.random() * Math.PI * 2,
        vr: isPixel ? 0 : (Math.random() - 0.5) * 0.4,
        color: colors[(Math.random() * colors.length) | 0],
        round: !isPixel && Math.random() < 0.25,
        life: 0, max: 130 + Math.random() * 90,
      });
    }
    if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(tick); }
  }

  function popper() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const W = innerWidth, H = innerHeight;
    burst(W * 0.04, H * 1.0, -60, 90);
    burst(W * 0.96, H * 1.0, -120, 90);
    setTimeout(() => { burst(W * 0.04, H * 1.0, -72, 70); burst(W * 0.96, H * 1.0, -108, 70); }, 260);
    setTimeout(() => burst(W * 0.5, H * 0.35, -90, 60), 520);
  }

  function tick(t) {
    const dt = Math.min(2.5, (t - lastT) / 16.67);
    lastT = t;
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter((p) => p.life < p.max && p.y < innerHeight + 40);
    for (const p of parts) {
      p.life += dt;
      p.vx *= Math.pow(0.985, dt);
      p.vy = p.vy * Math.pow(0.985, dt) + 0.32 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      cx.save();
      cx.globalAlpha = Math.min(1, (p.max - p.life) / 40);
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      cx.fillStyle = p.color;
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.w / 2.2, 0, Math.PI * 2); cx.fill(); }
      else cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cx.restore();
    }
    if (parts.length) raf = requestAnimationFrame(tick);
    else { raf = null; cx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  // ================================================================ GAME
  function renderMarkHTML(p, extraClasses = []) {
    const tId = currentThemeId();
    const svg = SVG_MARKS[tId]?.[p];
    const cls = ["mark", p.toLowerCase(), ...extraClasses];
    if (!svg) cls.push("css-mark");
    return `<span class="${cls.join(" ")}">${svg || ""}</span>`;
  }

  function applyTheme() {
    const theme = THEMES[state.theme];
    document.body.dataset.theme = theme.id;
    document.documentElement.style.setProperty("--x", theme.x);
    document.documentElement.style.setProperty("--o", theme.o);
    $("#styleLabel").textContent = theme.label;

    // Update player card icons
    for (const p of ["X", "O"]) {
      const svg = SVG_MARKS[theme.id]?.[p];
      iconEls[p].className = `mark ${p.toLowerCase()} icon${svg ? "" : " css-mark"}`;
      iconEls[p].innerHTML = svg || "";
    }
  }

  function buildBoard() {
    boardEl.innerHTML = "";
    cells = [];
    for (let i = 0; i < N * N; i++) {
      const row = Math.floor(i / N), col = i % N;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cell" + (col < N - 1 ? " r" : "") + (row < N - 1 ? " b" : "");
      b.dataset.i = i;
      b.setAttribute("aria-label", `Row ${row + 1}, column ${col + 1}`);
      boardEl.appendChild(b);
      cells.push(b);
    }
    fitMarks();
  }

  function fitMarks() {
    boardEl.style.fontSize = (boardEl.clientWidth / N) * 0.1 + "px";
  }

  function newRound() {
    state.board = Array(N * N).fill(null);
    state.turn = state.starter;
    Object.assign(state, { over: false, result: null, win: null, undo: [], last: null, note: "" });
    state.round++;
    hideModal();
    render();
  }

  function play(i) {
    if (state.over || state.board[i] !== null) return;
    const p = state.turn;
    state.undo.push({ board: state.board.slice(), turn: p });
    state.board[i] = p;
    state.last = i;
    sfx[p]();

    const win = findWin(state.board, N, K, p, i);
    if (win) finish(p, win);
    else if (state.board.every((v) => v !== null)) finish("Draw");
    else state.turn = other(p);
    render();
  }

  function finish(result, win = null) {
    state.over = true;
    state.result = result;
    state.win = win;
    state.score[result]++;
    state.starter = other(state.starter);
    persist();
    saveResult(result);

    if (win) { sfx.win(); setTimeout(() => state.over && popper(), 350); }
    else sfx.draw();

    const round = state.round;
    setTimeout(() => { if (state.round === round && state.over) showModal(); }, 800);
  }

  function undo() {
    if (!state.undo.length || state.over) return;
    const prev = state.undo.pop();
    Object.assign(state, { board: prev.board, turn: prev.turn, last: null });
    render();
  }

  function nextStyle() {
    state.theme = (state.theme + 1) % THEMES.length;
    applyTheme();
    persist();
    render();
  }

  function resetScore() {
    state.score = { X: 0, O: 0, Draw: 0 };
    persist();
    newRound();
  }

  function toggleSound() {
    state.sound = !state.sound;
    persist();
    renderSoundBtn();
    if (state.sound) sfx.on();
  }

  // ---------------------------------------------------------------- win pop-up
  function showModal() {
    $("#modalTitle").textContent = state.result === "Draw"
      ? "It's a draw!" : `${state.names[state.result]} wins!`;
    modalEl.hidden = false;
    $("#nextBtn").focus();
  }
  function hideModal() { modalEl.hidden = true; }

  // ---------------------------------------------------------------- backend
  async function saveResult(result) {
    const round = state.round;
    let note;
    try {
      const r = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player1: state.names.X, player2: state.names.O,
                               mode: "Classic", winner: result }),
      });
      note = r.ok ? "Result saved" : "Couldn't save result";
    } catch (_) {
      note = "Couldn't save result";
    }
    if (state.round === round && state.over) {
      state.note = note;
      render();
    }
  }

  // ---------------------------------------------------------------- rendering
  function render() {
    const lead = state.over && state.result !== "Draw" ? state.result : state.turn;
    const colorVar = `var(--${lead === "X" ? "x" : "o"})`;

    for (const p of ["X", "O"]) {
      cardEls[p].classList.toggle("active", state.turn === p && !state.over);
      scoreEls[p].textContent = state.score[p];
      nameEls[p].textContent = state.names[p];
    }
    $("#draws").textContent = state.score.Draw;

    let text;
    if (state.over) text = state.result === "Draw" ? "It's a draw!" : `${state.names[state.result]} wins!`;
    else text = `${state.names[state.turn]}'s turn`;
    statusEl.textContent = text;
    statusEl.style.setProperty("--c", state.over && state.result === "Draw" ? "#ffffff" : colorVar);
    subEl.textContent = state.over
      ? [state.note, "Press Space for the next round"].filter(Boolean).join(" · ")
      : "Double-click a name to rename";

    const winSet = new Set(state.win || []);
    cells.forEach((cell, i) => {
      const p = state.board[i];
      cell.disabled = state.over || p !== null;
      if (p) {
        const extra = [];
        if (i === state.last) extra.push("pop");
        if (winSet.has(i)) extra.push("win");
        cell.innerHTML = renderMarkHTML(p, extra);
      } else {
        cell.innerHTML = renderMarkHTML(state.turn, ["ghost"]);
      }
    });
    state.last = null;

    drawStrike();
    $("#undoBtn").disabled = state.over || state.undo.length === 0;
  }

  function drawStrike() {
    strikeEl.innerHTML = "";
    if (!state.win) return;
    const pt = (i) => [(i % N) + 0.5, Math.floor(i / N) + 0.5];
    const [x1, y1] = pt(state.win[0]);
    const [x2, y2] = pt(state.win[state.win.length - 1]);
    strikeEl.setAttribute("viewBox", `0 0 ${N} ${N}`);
    strikeEl.style.setProperty("--c", `var(--${state.result === "X" ? "x" : "o"})`);
    const line = (cls) =>
      `<line class="${cls}" pathLength="1" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    strikeEl.innerHTML = line("glow") + line("core");
  }

  // ---------------------------------------------------------------- name editing
  function editName(p) {
    const span = nameEls[p];
    if (!span.isConnected) return;
    const input = document.createElement("input");
    input.className = "name-input";
    input.style.setProperty("--c", `var(--${p === "X" ? "x" : "o"})`);
    input.maxLength = 12;
    input.value = state.names[p];
    input.setAttribute("aria-label", `Name for ${DEFAULT_NAMES[p]}`);
    span.replaceWith(input);
    input.focus();
    input.select();

    let done = false;
    const finishEdit = (save) => {
      if (done) return;
      done = true;
      if (save) state.names[p] = input.value.trim() || DEFAULT_NAMES[p];
      input.replaceWith(span);
      persist();
      render();
    };
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") finishEdit(true);
      else if (e.key === "Escape") finishEdit(false);
    });
    input.addEventListener("blur", () => finishEdit(true));
  }

  // ---------------------------------------------------------------- events
  boardEl.addEventListener("click", (e) => {
    const cell = e.target.closest(".cell");
    if (cell) play(Number(cell.dataset.i));
  });
  for (const p of ["X", "O"]) nameEls[p].addEventListener("dblclick", () => editName(p));

  $("#styleBtn").addEventListener("click", nextStyle);
  $("#soundBtn").addEventListener("click", toggleSound);
  $("#undoBtn").addEventListener("click", undo);
  $("#newBtn").addEventListener("click", newRound);
  $("#resetBtn").addEventListener("click", resetScore);
  $("#nextBtn").addEventListener("click", newRound);
  $("#modalClose").addEventListener("click", hideModal);
  modalEl.addEventListener("click", (e) => { if (e.target === modalEl) hideModal(); });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modalEl.hidden) { hideModal(); return; }
    if (e.target !== document.body) return;
    if (state.over && (e.code === "Space" || e.key === "Enter")) {
      e.preventDefault();
      newRound();
    }
  });

  new ResizeObserver(fitMarks).observe(boardEl);

  // ---------------------------------------------------------------- go
  applyTheme();
  renderSoundBtn();
  buildBoard();
  newRound();
})();
