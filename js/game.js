/* =========================================================
   game.js — ระบบที่ทำให้เว็บรู้สึกเหมือนเล่นเกม
   ---------------------------------------------------------
   1. เสียงประกอบ (Sound effects) — สร้างด้วยโค้ด ไม่ต้องมีไฟล์เสียง
   2. NPC ผู้นำทาง — กล่องบทสนทนาแบบเกม RPG (ขึ้นครั้งแรกที่เข้าเว็บ)
   3. Quest Log — ภารกิจสำรวจ 4 อย่าง + Achievement เมื่อทำครบ → พาไปหน้า Contact

   ความคืบหน้าเก็บไว้ใน localStorage (หน่วยความจำของเบราว์เซอร์)
   → ปิดเว็บแล้วเปิดใหม่ ภารกิจยังอยู่
   ========================================================= */

const store = {
  get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: (k) => { try { localStorage.removeItem(k); } catch (e) {} }
};
const motionOff = () => document.documentElement.classList.contains("motion-off");


/* ---------- 1. เสียงประกอบ ----------
   เล่นเฉพาะตอนเปิดเสียงไว้ (ปุ่ม 🎵) — music.js บอกสถานะผ่าน window.SOUND_ON */
const Sfx = (() => {
  let ctx = null, out = null;
  const pent = [69, 72, 74, 76, 79, 81, 84];             // โน้ต A C D E G (pentatonic)
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function ready() {
    if (!window.SOUND_ON) return false;
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      out = ctx.createGain(); out.gain.value = 0.9;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3800;
      out.connect(lp).connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }

  function tone(midi, t, { type = "sine", vol = 0.05, decay = 0.6, bend = 1 } = {}) {
    const o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(hz(midi) * bend, t);
    o.frequency.exponentialRampToValueAtTime(hz(midi), t + 0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t + decay);
    o.connect(g).connect(out); o.start(t); o.stop(t + decay + 0.05);
  }

  return {
    // ชี้ที่อาคาร: กระดิ่งลม 2 เสียง
    chime() {
      if (!ready()) return;
      const t = ctx.currentTime, m = pent[3 + Math.floor(Math.random() * 4)] + 12;
      tone(m, t, { vol: 0.035, decay: 0.9 });
      tone(m + 7, t + 0.07, { vol: 0.02, decay: 0.8 });
    },
    // เปิดแผง: เสียงม้วนคัมภีร์คลี่ + เคาะไม้
    scroll() {
      if (!ready()) return;
      const t = ctx.currentTime;
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(700, t); bp.frequency.exponentialRampToValueAtTime(2600, t + 0.28);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.06, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      src.connect(bp).connect(g).connect(out); src.start(t);
      tone(52, t + 0.02, { type: "triangle", vol: 0.09, decay: 0.12, bend: 1.6 });  // เคาะไม้
    },
    // ตัวหนังสือในกล่องบทสนทนา: เสียงติ๊กเบาๆ
    blip() {
      if (!ready()) return;
      tone(pent[Math.floor(Math.random() * 3)] + 12, ctx.currentTime, { type: "triangle", vol: 0.012, decay: 0.05 });
    },
    // ได้ Achievement: ไล่โน้ตขึ้น 5 ตัว
    fanfare() {
      if (!ready()) return;
      const t = ctx.currentTime;
      [69, 72, 74, 76, 81].forEach((m, i) => tone(m, t + i * 0.09, { type: "triangle", vol: 0.07, decay: 0.9 }));
      tone(88, t + 0.5, { vol: 0.03, decay: 1.4 });
    }
  };
})();

// ชี้อาคาร = กระดิ่งลม (เว้นระยะไม่ให้ดังถี่เกิน)
let lastChime = 0;
document.querySelectorAll(".hotspot").forEach((spot) => {
  const ring = () => { if (Date.now() - lastChime > 250) { lastChime = Date.now(); Sfx.chime(); } };
  spot.addEventListener("pointerenter", ring);
  spot.addEventListener("focus", ring);
});


/* ---------- 2. NPC ผู้นำทาง ---------- */
const Npc = (() => {
  const LINES = [
    "Welcome, traveler. You have arrived in the realm of Sanpetch, a UX/UI designer.",
    "The great Sect Hall holds his projects. Each one is told as a journey, from the first plan to the final handoff.",
    "Explore every place to complete your quest. When you are done, the Teahouse Inn is where you can send him a message."
  ];
  const box = document.getElementById("npc");
  const typed = box.querySelector(".npc-typed");
  const full = document.getElementById("npc-full");
  const nextBtn = document.getElementById("npc-next");
  let line = 0, timer = null, typing = false;

  function type(text) {
    clearInterval(timer);
    full.textContent = text;                 // ข้อความเต็มสำหรับโปรแกรมอ่านหน้าจอ
    if (motionOff()) { typed.textContent = text; typing = false; return; }
    typed.textContent = ""; typing = true;
    let i = 0;
    timer = setInterval(() => {
      typed.textContent = text.slice(0, ++i);
      if (i % 3 === 0) Sfx.blip();
      if (i >= text.length) { clearInterval(timer); typing = false; }
    }, 28);
  }
  function show() {
    line = 0; box.hidden = false;
    document.body.classList.add("npc-open");
    type(LINES[0]); updateNext();
  }
  function close() {
    clearInterval(timer); box.hidden = true;
    document.body.classList.remove("npc-open");
    store.set("npcSeen", "1");
  }
  function updateNext() { nextBtn.textContent = line === LINES.length - 1 ? "Start exploring" : "Next ▸"; }

  nextBtn.addEventListener("click", () => {
    if (typing) { clearInterval(timer); typed.textContent = LINES[line]; typing = false; return; } // กดระหว่างพิมพ์ = แสดงทั้งบรรทัด
    if (line < LINES.length - 1) { line++; type(LINES[line]); updateNext(); }
    else close();
  });
  document.getElementById("npc-skip").addEventListener("click", close);

  return { show, close };
})();


/* ---------- 3. Quest Log + Achievement ---------- */
const Quest = (() => {
  const QUESTS = [
    { id: "works",   text: "Visit the Sect Hall (UX/UI Works)" },
    { id: "project", text: "Read one project journey" },
    { id: "certs",   text: "Visit the Scroll Pavilion (Certificates)" },
    { id: "about",   text: "Visit the Bamboo Hut (About me)" }
  ];
  // ภารกิจลับ: ไม่นับรวมใน 4/4 (คนที่มาดูงานอย่างเดียวไม่ต้องทำ)
  const BONUS = { id: "novels", text: "Secret: Visit the Storyteller's Pavilion" };
  const list = document.getElementById("quest-list");
  const count = document.getElementById("quest-count");
  const toast = document.getElementById("achievement");

  const isDone = (id) => store.get("quest:" + id) === "1";

  function render() {
    const done = QUESTS.filter((q) => isDone(q.id)).length;
    count.textContent = `${done}/${QUESTS.length}`;
    list.innerHTML = QUESTS.map((q) => `
      <li class="${isDone(q.id) ? "is-done" : ""}">
        <span class="quest-check" aria-hidden="true">${isDone(q.id) ? "✓" : ""}</span>
        <span>${q.text}</span>
        <span class="sr-only">${isDone(q.id) ? "(completed)" : "(not yet)"}</span>
      </li>`).join("") + `
      <li class="quest-bonus ${isDone(BONUS.id) ? "is-done" : ""}">
        <span class="quest-check" aria-hidden="true">${isDone(BONUS.id) ? "✓" : "★"}</span>
        <span>${isDone(BONUS.id) ? BONUS.text : "Secret: ???"}</span>
        <span class="sr-only">${isDone(BONUS.id) ? "(bonus, completed)" : "(bonus, hidden)"}</span>
      </li>`;
    document.getElementById("quest").classList.toggle("is-complete", done === QUESTS.length);
    return done;
  }

  function complete(id) {
    if (id === BONUS.id && !isDone(id)) { store.set("quest:" + id, "1"); render(); Sfx.fanfare(); return; }
    if (!QUESTS.some((q) => q.id === id) || isDone(id)) return;
    store.set("quest:" + id, "1");
    const done = render();
    if (done === QUESTS.length && store.get("quest:rewarded") !== "1") {
      store.set("quest:rewarded", "1");
      setTimeout(showAchievement, 600);
    }
  }

  function showAchievement() {
    toast.hidden = false;
    Sfx.fanfare();
  }
  toast.querySelector("[data-dismiss]").addEventListener("click", () => { toast.hidden = true; });
  toast.querySelector("[data-open]").addEventListener("click", () => { toast.hidden = true; });

  // พับ/กาง Quest Log
  const toggle = document.getElementById("quest-toggle");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    list.hidden = !open;
    store.set("questOpen", open ? "1" : "0");
  });
  if (store.get("questOpen") === "0") { toggle.setAttribute("aria-expanded", "false"); list.hidden = true; }

  // เริ่มภารกิจใหม่ (ไว้ทดสอบ)
  document.getElementById("quest-reset").addEventListener("click", () => {
    QUESTS.concat(BONUS).forEach((q) => store.del("quest:" + q.id));
    store.del("quest:rewarded");
    toast.hidden = true;
    render();
  });
  document.getElementById("npc-replay").addEventListener("click", () => Npc.show());

  render();
  // กลับมาจากหน้าผลงาน แล้วครบพอดี → แสดง Achievement
  if (render() === QUESTS.length && store.get("quest:rewarded") !== "1") {
    store.set("quest:rewarded", "1");
    setTimeout(showAchievement, 1200);
  }
  return { complete };
})();

// main.js ส่งสัญญาณ "panel:open" ทุกครั้งที่เปิดแผง → ทำเสียง + ติ๊กภารกิจ
document.addEventListener("panel:open", (e) => {
  Sfx.scroll();
  Quest.complete(e.detail);
});

// ทุกครั้งที่เข้าเว็บหรือรีเฟรช → NPC ทักทายหลังฉากเปิดจบ
// (ยกเว้นกลับมาจากหน้าผลงานพร้อม #works ฯลฯ เพราะแผงจะเปิดอยู่แล้ว)
if (!location.hash) {
  setTimeout(() => Npc.show(), motionOff() ? 300 : 2700);
}
