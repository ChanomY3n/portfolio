/* =========================================================
   project.js — สร้างหน้ารายละเอียดผลงาน (project.html)
   ---------------------------------------------------------
   1. อ่าน id จาก URL (เช่น ?id=gistda) แล้วหาผลงานใน PROJECTS (data.js)
   2. สร้างหน้าเป็นหัวข้อตาม CASE_SECTIONS — หัวข้อไหนไม่มีข้อมูล = ไม่สร้าง
   3. สารบัญ (On this page) + ไฮไลต์หัวข้อที่กำลังอ่าน
   4. Lightbox: กดภาพเพื่อดูเต็มจอ · ← → เปลี่ยนภาพ · Esc ปิด แล้วกลับไปที่ปุ่มเดิม
   ========================================================= */

/* ---------- 0. ตัวช่วย ---------- */
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
// มีข้อมูลจริงไหม (TODO / null / "" / [] / {} ที่ว่างทุกช่อง = ไม่มี)
function has(v) {
  if (v === null || v === undefined || v === false || v === "") return false;
  if (Array.isArray(v)) return v.some(has);
  if (typeof v === "object") return Object.values(v).some(has);
  return true;
}
const SIZES = typeof IMAGE_SIZES === "object" ? IMAGE_SIZES : {};

// <img> พร้อม width/height จริง → เบราว์เซอร์จองที่ไว้ก่อน ภาพไม่ดันเนื้อหาตอนโหลด
function img(src, { lazy = true } = {}) {
  const s = SIZES[src];
  const dims = s ? ` width="${s[0]}" height="${s[1]}"` : "";
  return `<img src="${src}" alt=""${dims} ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;
}

/* ---------- 1. ภาพที่กดขยายได้ ---------- */
const ALL_IMAGES = [];   // ทุกภาพในหน้านี้ เรียงตามลำดับ → กด ‹ › ดูต่อกันได้
function shot(im, opts = {}) {
  const i = ALL_IMAGES.push(im) - 1;
  const pins = (im.pins || []).map((p, n) =>
    `<span class="cs-pin" style="left:${p.x}%;top:${p.y}%" aria-hidden="true">${n + 1}</span>`).join("");
  return `<button type="button" class="cs-shot" data-shot="${i}" aria-label="View full size: ${escapeHtml(im.caption)}">
            <span class="cs-shot-inner">${img(im.src, opts)}${pins}</span>
            <span class="cs-zoom" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg></span>
          </button>`;
}
// ภาพ + คำบรรยาย (+ รายการคำอธิบายตามหมุด ถ้ามี)
function figure(im, cls = "") {
  const notes = has(im.pins)
    ? `<ol class="cs-pin-notes">${im.pins.map((p) => `<li>${escapeHtml(p.text)}</li>`).join("")}</ol>` : "";
  if (im.phone) cls += " is-phone";
  if (im.tall) cls += " is-tall";
  return `<figure class="cs-figure ${cls}">${shot(im)}<figcaption>${escapeHtml(im.caption)}</figcaption>${notes}</figure>`;
}

/* ---------- 2. แต่ละหัวข้อ (คืนค่า "" ถ้าไม่มีข้อมูล → หัวข้อถูกซ่อน) ---------- */
const OVERVIEW_LABELS = { role: "My role", scope: "My scope", team: "Team", duration: "Duration", platform: "Platform", status: "Status", tools: "Tools" };

const render = {
  overview(p) {
    const rows = Object.entries(OVERVIEW_LABELS).filter(([k]) => has(p.overview && p.overview[k]));
    if (!rows.length) return "";
    return `<dl class="cs-overview">${rows.map(([k, label]) =>
      `<div><dt>${label}</dt><dd>${escapeHtml(p.overview[k])}</dd></div>`).join("")}</dl>`;
  },

  problem(p) {
    const pr = p.problem || {};
    if (!has(pr) && !has(p.insights)) return "";
    const heads = p.insightHeads || ["Problem", "Design need"];
    return `
      <div class="cs-split">
        <div class="cs-prose">
          ${has(pr.context) ? pr.context : ""}
          ${has(pr.source) ? `<p class="cs-source"><strong>Where this came from:</strong> ${escapeHtml(pr.source)}</p>` : ""}
        </div>
        ${has(pr.goals) ? `<div class="cs-card cs-goals"><h3>Goals</h3><ul>${pr.goals.map((g) => `<li>${escapeHtml(g)}</li>`).join("")}</ul>${has(pr.goalsNote) ? `<p class="cs-note">${escapeHtml(pr.goalsNote)}</p>` : ""}</div>` : ""}
      </div>
      ${has(pr.users) ? `<h3 class="cs-sub">Who it serves</h3>
        <ul class="cs-users">${pr.users.map((u) => `<li class="cs-card"><strong>${escapeHtml(u.name)}</strong><span>${escapeHtml(u.need)}</span></li>`).join("")}</ul>` : ""}
      ${has(p.insights) ? `<h3 class="cs-sub">${escapeHtml(p.insightsTitle || "From problem to design need")}</h3>
        <div class="cs-table" role="table" aria-label="Problems and design needs">
          <div class="cs-row cs-row-head" role="row"><span role="columnheader">${escapeHtml(heads[0])}</span><span aria-hidden="true"></span><span role="columnheader">${escapeHtml(heads[1])}</span></div>
          ${p.insights.map((r) => `<div class="cs-row" role="row"><span role="cell">${escapeHtml(r.pain)}</span><span class="cs-arrow" aria-hidden="true">→</span><span role="cell">${escapeHtml(r.need)}</span></div>`).join("")}
        </div>
        ${has(p.insightsSource) ? `<p class="cs-source">Source: ${escapeHtml(p.insightsSource)}</p>` : ""}` : ""}`;
  },

  decisions(p) {
    if (!has(p.decisions)) return "";
    return p.decisions.map((d, i) => `
      <article class="cs-decision ${i % 2 ? "is-flipped" : ""}">
        <div class="cs-decision-text">
          <p class="cs-kicker">Decision ${i + 1}</p>
          <h3>${escapeHtml(d.title)}</h3>
          <dl>
            ${has(d.problem) ? `<dt>The problem</dt><dd>${escapeHtml(d.problem)}</dd>` : ""}
            ${has(d.approach) ? `<dt>What we did</dt><dd>${escapeHtml(d.approach)}</dd>` : ""}
            ${has(d.why) ? `<dt>Why, and the trade-off</dt><dd>${escapeHtml(d.why)}</dd>` : ""}
            ${has(d.feedback) ? `<dt>Feedback</dt><dd>${escapeHtml(d.feedback)}</dd>` : ""}
          </dl>
        </div>
        ${has(d.image) ? `<div class="cs-decision-media">${figure(d.image)}</div>` : ""}
      </article>`).join("");
  },

  flows(p) {
    if (!has(p.flows)) return "";
    return (has(p.flowsNote) ? `<p class="cs-context-note">${escapeHtml(p.flowsNote)}</p>` : "") + p.flows.map((f) => `
      ${has(f.text) ? `<p class="cs-lead">${escapeHtml(f.text)}</p>` : ""}
      ${figure(f, "cs-wide")}`).join("");
  },

  development(p) {
    if (!has(p.development)) return "";
    return p.development.map((d) => `
      ${has(d.text) ? `<p class="cs-lead">${escapeHtml(d.text)}</p>` : ""}
      <div class="cs-compare ${has(d.after) ? "" : "is-single"} ${d.layout === "side" ? "is-side" : ""}">
        ${has(d.before) ? figure({ ...d.before, caption: has(d.after) ? `Before · ${d.before.caption}` : d.before.caption }) : ""}
        ${has(d.after) ? figure({ ...d.after, caption: `After · ${d.after.caption}` }) : ""}
      </div>`).join("");
  },

  finalDesign(p) {
    if (!has(p.finalDesign) && !has(p.prototype)) return "";
    return (p.finalDesign || []).map((g) => {
      const pinned = g.shots.filter((s) => has(s.pins));
      const plain = g.shots.filter((s) => !has(s.pins));
      return `
        <div class="cs-group">
          <h3 class="cs-sub">${escapeHtml(g.title)}</h3>
          ${has(g.text) ? `<p class="cs-lead">${escapeHtml(g.text)}</p>` : ""}
          ${pinned.map((s) => `<div class="cs-spot">${figure(s)}</div>`).join("")}
          ${plain.length ? `<div class="cs-grid">${plain.map((s) => figure(s)).join("")}</div>` : ""}
        </div>`;
    }).join("") + (has(p.prototype)
      ? `<p><a class="btn btn-seal" href="${escapeHtml(p.prototype)}" target="_blank" rel="noopener">Open the prototype ↗</a></p>` : "");
  },

  designSystem(p) {
    const ds = p.designSystem;
    if (!has(ds)) return "";
    return `${has(ds.text) ? `<p class="cs-lead">${escapeHtml(ds.text)}</p>` : ""}
      ${has(ds.items) ? `<div class="cs-grid cs-grid-ds">${ds.items.map((s) => figure(s)).join("")}</div>` : ""}`;
  },

  outcomes(p) {
    const blocks = [
      ["How it was checked", p.validation],
      ["Handoff to developers", p.handoff],
      ["What was delivered", p.delivered]
    ].filter(([, v]) => has(v));
    if (!blocks.length && !has(p.trackMetrics)) return "";
    return `<div class="cs-outcomes">
      ${blocks.map(([t, v]) => `<div class="cs-card"><h3>${t}</h3>${v}</div>`).join("")}
      ${has(p.trackMetrics) ? `<div class="cs-card cs-track"><h3>Metrics to track next</h3>
        <p class="cs-note">Proposed, not yet measured.</p>
        <ul>${p.trackMetrics.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul></div>` : ""}
    </div>`;
  },

  reflection(p) {
    return has(p.reflection) ? `<div class="cs-prose">${p.reflection}</div>` : "";
  }
};

/* ---------- 3. ประกอบหน้า ---------- */
const id = new URLSearchParams(location.search).get("id");
const index = PROJECTS.findIndex((p) => p.id === id);
const main = document.getElementById("content");

// สีตัวหนังสือบนสีประจำงาน: ขาว หรือ หมึก (เลือกอันที่อ่านชัดกว่า)
function onColor(hex) {
  const [r, g, b] = hex.replace("#", "").match(/../g).map((h) => parseInt(h, 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return (1.05 / (L + 0.05)) >= 4.5 ? "#fff" : "#1E1A14";
}

if (index === -1) {
  main.innerHTML = `<div class="cs-paper"><h1>Project not found</h1><p><a href="index.html#works">Back to all works</a></p></div>`;
} else {
  const p = PROJECTS[index];
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  document.title = `${p.title}${p.subtitle ? " · " + p.subtitle : ""} — Sanpetch Meejue`;
  try { localStorage.setItem("quest:project", "1"); } catch (e) {}   // ภารกิจในหน้าแผนที่

  if (p.accent) {
    main.style.setProperty("--accent", p.accent);
    main.style.setProperty("--on-accent", onColor(p.accent));
  }

  // ภาพปกต้องสร้างก่อน → ลำดับใน Lightbox ตรงกับลำดับบนหน้า
  const coverImage = p.hero || p.cover;
  const heroHtml = coverImage ? `<div class="cs-hero">${shot({ src: coverImage, caption: p.title }, { lazy: false })}</div>` : "";

  // สร้างเฉพาะหัวข้อที่มีข้อมูล แล้วนับเลขใหม่ 01, 02, 03…
  const sections = CASE_SECTIONS.map((s) => ({ ...s, html: render[s.key](p) })).filter((s) => s.html.trim());
  const num = (i) => String(i + 1).padStart(2, "0");

  main.innerHTML = `
    <header class="cs-cover">
      <p class="cs-category">${escapeHtml(p.category)}</p>
      <h1>${escapeHtml(p.title)}${has(p.subtitle) ? `<span class="cs-subtitle">${escapeHtml(p.subtitle)}</span>` : ""}</h1>
      ${has(p.summary) ? `<p class="cs-summary">${escapeHtml(p.summary)}</p>` : ""}
      ${has(p.tags) ? `<ul class="cs-tags">${p.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>` : ""}
      ${has(p.client) ? `<p class="cs-client">Client: ${escapeHtml(p.client)}</p>` : ""}
      ${has(p.pdf) ? `<p><a class="btn btn-seal" href="${escapeHtml(p.pdf)}" download>Download case study (PDF)</a></p>` : ""}
      ${heroHtml}
    </header>

    <div class="cs-layout ${sections.length ? "" : "is-empty"}">
      ${sections.length > 1 ? `
      <nav class="cs-toc" aria-label="On this page">
        <details class="cs-toc-box">
          <summary>On this page</summary>
          <ol>${sections.map((s, i) => `<li><a href="#${s.key}"><span class="cs-toc-no" aria-hidden="true">${num(i)}</span>${s.title}</a></li>`).join("")}</ol>
        </details>
      </nav>` : ""}
      <div class="cs-body">
        ${sections.map((s, i) => `
          <section class="cs-section" id="${s.key}" aria-labelledby="${s.key}-h">
            <div class="cs-head"><span class="cs-no" aria-hidden="true">${num(i)}</span><h2 id="${s.key}-h">${s.title}</h2></div>
            ${s.html}
          </section>`).join("")}
      </div>
    </div>

    <nav class="cs-pager" aria-label="More projects">
      <a class="cs-pager-card" href="project.html?id=${prev.id}">
        <span class="cs-pager-label">← Previous</span>
        ${prev.cover ? img(prev.cover) : ""}<strong>${escapeHtml(prev.title)}</strong>
      </a>
      <a class="btn btn-ghost cs-pager-all" href="index.html#works">All works</a>
      <a class="cs-pager-card is-next" href="project.html?id=${next.id}">
        <span class="cs-pager-label">Next →</span>
        ${next.cover ? img(next.cover) : ""}<strong>${escapeHtml(next.title)}</strong>
      </a>
    </nav>`;

  /* ---------- 4. สารบัญ: จอใหญ่เปิดค้าง · จอเล็กพับเก็บ ---------- */
  const tocBox = main.querySelector(".cs-toc-box");
  if (tocBox) {
    const wide = matchMedia("(min-width: 1100px)");
    const sync = () => { tocBox.open = wide.matches; };
    sync(); wide.addEventListener("change", sync);
    // จอเล็ก: กดหัวข้อแล้วพับสารบัญเก็บ
    tocBox.addEventListener("click", (e) => { if (e.target.closest("a") && !wide.matches) tocBox.open = false; });

    // ไฮไลต์หัวข้อที่กำลังอ่าน
    const links = new Map([...tocBox.querySelectorAll("a")].map((a) => [a.hash.slice(1), a]));
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => seen.set(en.target.id, en.isIntersecting));
      const current = sections.map((s) => s.key).find((k) => seen.get(k));
      if (!current) return;
      links.forEach((a, k) => (k === current ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    }, { rootMargin: "-30% 0px -60% 0px" });
    main.querySelectorAll(".cs-section").forEach((s) => io.observe(s));
  }
}


/* ---------- 5. Lightbox: ดูภาพเต็มจอ ----------
   ‹ › หรือลูกศรซ้าย/ขวา = ภาพก่อน/ถัดไป · ✕, Esc หรือกดพื้นมืด = ปิด แล้วโฟกัสกลับไปที่ภาพเดิม */
const lightbox = document.getElementById("lightbox");
if (lightbox && ALL_IMAGES.length) {
  const view = document.getElementById("lightbox-img");
  const cap = document.getElementById("lightbox-caption");
  let at = 0, opener = null;
  const showShot = (i) => {
    at = (i + ALL_IMAGES.length) % ALL_IMAGES.length;
    view.src = ALL_IMAGES[at].src; view.alt = ALL_IMAGES[at].caption;
    cap.innerHTML = `<strong>${escapeHtml(ALL_IMAGES[at].caption)}</strong><span>${at + 1} / ${ALL_IMAGES.length}</span>`;
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest(".cs-shot");
    if (!b) return;
    opener = b; showShot(Number(b.dataset.shot)); lightbox.showModal();
  });
  document.getElementById("lightbox-prev").addEventListener("click", () => showShot(at - 1));
  document.getElementById("lightbox-next").addEventListener("click", () => showShot(at + 1));
  document.getElementById("lightbox-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) lightbox.close(); });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showShot(at - 1);
    if (e.key === "ArrowRight") showShot(at + 1);
  });
  lightbox.addEventListener("close", () => { if (opener) opener.focus({ preventScroll: true }); });
}
