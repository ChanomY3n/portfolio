/* =========================================================
   main.js — การทำงานของหน้าแผนที่ (index.html)
   ---------------------------------------------------------
   ส่วนที่ 1: ตัวช่วยเล็กๆ (helper)
   ส่วนที่ 2: สร้างเนื้อหาในแผงจาก data.js
   ส่วนที่ 3: เปิด / ปิดแผง
   ส่วนที่ 4: ลาก / ซูมแผนที่
   ========================================================= */

/* ---------- 1. ตัวช่วย ---------- */

// ถ้าค่าเป็น TODO (null) → คืนป้าย [เดียวมาอัพเดต] แทน
function show(value) {
  return value ? escapeHtml(value) : '<span class="todo">[เดียวมาอัพเดต]</span>';
}
// กันไม่ให้ข้อความถูกตีความเป็นโค้ด HTML
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
const $ = (selector) => document.querySelector(selector);


/* ---------- 1.5 ห่อเนื้อหาในแผงด้วย .panel-scroll ----------
   ตัวแผง (dialog) = กรอบไม้หลังคาเขียว (อยู่กับที่)
   .panel-scroll   = กระดาษด้านใน ที่เลื่อนขึ้นลงได้ */
document.querySelectorAll("dialog.panel").forEach((d) => {
  const inner = document.createElement("div");
  inner.className = "panel-scroll";
  while (d.firstChild) inner.appendChild(d.firstChild);
  d.appendChild(inner);

  // ของตกแต่งรอบกรอบ (ภาพประดับ → aria-hidden ให้โปรแกรมอ่านหน้าจอข้าม)
  d.insertAdjacentHTML("beforeend", `
    <div class="panel-deco" aria-hidden="true">
      <img class="deco-roof" src="images/ui/deco-roof-ornament.webp" alt="">
      <img class="deco-blossom" src="images/ui/deco-blossom.webp" alt="">
      <img class="deco-cloud deco-cloud-l" src="images/ui/deco-cloud.webp" alt="">
      <img class="deco-cloud deco-cloud-r" src="images/ui/deco-cloud.webp" alt="">
    </div>
    <div class="jade-scroll" aria-hidden="true"><img class="jade-thumb" src="images/ui/scroll-thumb.webp" alt="" draggable="false"></div>`);

  /* แถบเลื่อนหยก: ซ่อนแถบเลื่อนปกติ แล้วใช้ป้ายหยกแทน
     (ลูกกลิ้งเมาส์ / คีย์บอร์ด ยังเลื่อนได้ตามปกติ — ป้ายหยกเป็นแค่ตัวบอกตำแหน่ง + ลากได้) */
  const rail = d.querySelector(".jade-scroll");
  const thumb = d.querySelector(".jade-thumb");
  function syncThumb() {
    const max = inner.scrollHeight - inner.clientHeight;
    rail.hidden = max <= 4;                             // เนื้อหาไม่ล้น → ไม่ต้องแสดง
    const room = rail.clientHeight - thumb.offsetHeight;
    thumb.style.transform = `translateY(${max > 0 ? (inner.scrollTop / max) * room : 0}px)`;
  }
  inner.addEventListener("scroll", syncThumb, { passive: true });
  new ResizeObserver(syncThumb).observe(inner);
  d.addEventListener("transitionend", syncThumb);
  d.addEventListener("panel-shown", syncThumb);
  thumb.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    thumb.setPointerCapture(e.pointerId);
    const y0 = e.clientY, s0 = inner.scrollTop;
    const move = (ev) => {
      const room = rail.clientHeight - thumb.offsetHeight;
      const max = inner.scrollHeight - inner.clientHeight;
      inner.scrollTop = s0 + ((ev.clientY - y0) / room) * max;
    };
    thumb.addEventListener("pointermove", move);
    thumb.addEventListener("pointerup", () => thumb.removeEventListener("pointermove", move), { once: true });
  });
});


/* ---------- 2. สร้างเนื้อหาในแผง ---------- */

// 2.1 การ์ดผลงาน
$("#work-grid").innerHTML = PROJECTS.map((p) => `
  <li>
    <a class="work-card" href="project.html?id=${p.id}">
      <div class="work-cover">
        ${p.cover
          ? `<img src="${p.cover}" alt="" loading="lazy">`
          : `<div class="cover-placeholder"><span class="todo">[เดียวมาอัพเดต] cover</span></div>`}
      </div>
      <div class="work-body">
        <p class="work-cat">${escapeHtml(p.category)}</p>
        <h3 class="work-title">${escapeHtml(p.title)}</h3>
        ${p.client ? `<p class="work-client">Client: ${escapeHtml(p.client)}</p>` : ""}
        <p class="work-summary">${show(p.summary)}</p>
        <!-- ตัวเลขผลลัพธ์ (metrics) ไม่แสดงในการ์ด → แสดงเต็มๆ ในหน้ารายละเอียดผลงาน -->
        <span class="work-cta">View project →</span>
      </div>
    </a>
  </li>`).join("");

// 2.1b การ์ดนิยาย — หน้าตาเดียวกับการ์ดผลงาน UX/UI (ปกด้านบน + ข้อมูลด้านล่าง)
//      ทั้งการ์ดกดได้ → เปิดหน้านิยายใน Dek-D (แท็บใหม่)
//      ชื่อไทยใส่ lang="th" → โปรแกรมอ่านหน้าจออ่านเป็นภาษาไทย
$("#novel-grid").innerHTML = NOVELS.map((n, i) => `
  <li>
    <div class="work-card">
      <div class="work-cover">
        ${n.cover
          ? `<button type="button" class="cert-zoom" data-gallery="novels" data-index="${i}" aria-label="View cover: ${escapeHtml(n.titleEn || n.titleTh)}">
               <img src="${n.cover}" alt="" loading="lazy">
               <span class="cert-zoom-hint" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg></span>
             </button>`
          : '<div class="cover-placeholder"><span class="todo">[เดียวมาอัพเดต] cover</span></div>'}
      </div>
      <div class="work-body">
        <p class="work-cat">${escapeHtml(n.genre)}</p>
        <h3 class="work-title">${show(n.titleEn)}</h3>
        <p class="work-client" lang="th">${escapeHtml(n.titleTh)}</p>
        <p class="work-summary">${show(n.blurb)}</p>
        ${n.url
          ? `<a class="work-cta" href="${n.url}" target="_blank" rel="noopener">Read on Dek-D ↗ <span class="novel-lang">(Thai)</span></a>`
          : '<span class="todo">[เดียวมาอัพเดต] Dek-D link</span>'}
      </div>
    </div>
  </li>`).join("");

// 2.2 การ์ดใบรับรอง — หน้าตาเดียวกับการ์ดผลงาน (รูปด้านบน + ข้อมูลด้านล่าง)
$("#cert-grid").innerHTML = CERTIFICATES.map((c, i) => `
  <li>
    <div class="work-card">
      <div class="work-cover cert-cover">
        ${c.image
          ? `<button type="button" class="cert-zoom" data-gallery="certs" data-index="${i}" aria-label="View full size: ${escapeHtml(c.title || "certificate")}">
               <img src="${c.image}" alt="" loading="lazy">
               <span class="cert-zoom-hint" aria-hidden="true">
                 <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/></svg>
               </span>
             </button>`
          : '<div class="cover-placeholder"><span class="todo">[เดียวมาอัพเดต] image</span></div>'}
      </div>
      <div class="work-body">
        <p class="work-cat">${escapeHtml(c.year)} · ${escapeHtml(c.issuer)}</p>
        <h3 class="work-title">${show(c.title)}</h3>
        ${c.verify ? `<a class="work-cta" href="${c.verify}" target="_blank" rel="noopener">Verify ↗</a>` : ""}
      </div>
    </div>
  </li>`).join("");

// 2.3 About
const downloadButtons = `
  <div class="doc-buttons">
    ${PROFILE.resume ? `<a class="work-cta" href="${PROFILE.resume}" download>Download Resume <span aria-hidden="true">↓</span></a>` : ""}
    ${PROFILE.cv ? `<a class="work-cta" href="${PROFILE.cv}" download>Download CV <span aria-hidden="true">↓</span></a>` : ""}
  </div>`;

$("#about-body").innerHTML = `
  <div class="about-hero">
    <img class="about-photo" src="${PROFILE.photo}" alt="Portrait of ${escapeHtml(PROFILE.name)}" width="220" height="220">
    <div class="about-hero-text">
      <h3 class="about-name">${escapeHtml(PROFILE.name)} <span>(${escapeHtml(PROFILE.nickname)})</span></h3>
      <p class="about-role">${escapeHtml(PROFILE.headline)} · <strong>${escapeHtml(PROFILE.status)}</strong></p>
      <p class="about-meta">${show(PROFILE.experience)} · ${show(PROFILE.location)}</p>
      ${downloadButtons}
    </div>
  </div>
  <section>
    <h3>Profile</h3>
    <p class="about-intro">${escapeHtml(PROFILE.intro)}</p>
    <p class="about-intro">${escapeHtml(PROFILE.strengths)}</p>
    <p class="about-quote">“${escapeHtml(PROFILE.quote)}”</p>
  </section>
  <section>
    <h3>Experience</h3>
    <ul class="timeline">
      ${PROFILE.experienceList.map((e) => `
        <li>
          <strong>${escapeHtml(e.role)} · ${escapeHtml(e.company)}</strong>
          <span class="timeline-period">${show(e.period)}</span>
          ${e.points && e.points.length ? `<ul class="timeline-points">${e.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>` : ""}
        </li>`).join("")}
    </ul>
  </section>
  <section>
    <h3>Skills</h3>
    <div class="skill-groups">
      ${PROFILE.skills.map((g) => `<div><h4>${escapeHtml(g.group)}</h4><div class="chips">${g.items.map((i) => `<span class="chip">${escapeHtml(i)}</span>`).join("")}</div></div>`).join("")}
    </div>
  </section>
  <section class="about-two">
    <div>
      <h3>Education</h3>
      <ul class="timeline">
        ${PROFILE.education.map((e) => `<li><strong>${escapeHtml(e.school)}</strong>${escapeHtml(e.detail)}${e.period ? ` · ${escapeHtml(e.period)}` : ""}</li>`).join("")}
      </ul>
    </div>
    <div>
      <h3>Languages</h3>
      <ul class="timeline">
        ${PROFILE.languages.map((l) => `<li><strong>${escapeHtml(l.name)}</strong>${escapeHtml(l.level)}</li>`).join("")}
      </ul>
    </div>
  </section>`;

// 2.4 Contact — แต่ละแถวมีไอคอน (SVG เส้น สีเดียวกับตัวหนังสือ)
const ICONS = {
  email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  behance: '<path d="M3 7h5a2.5 2.5 0 0 1 0 5H3zM3 12h5.5a2.5 2.5 0 0 1 0 5H3zM14 8h5M14 14.5h7a3.5 3.5 0 1 0-1 2.5"/>',
  facebook: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M15.5 8H14a2 2 0 0 0-2 2v11M9.5 13h5"/>',
  resume: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  cv: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M12 11v6M9.5 14.5 12 17l2.5-2.5"/>'
};
const icon = (k) => `<svg class="contact-icon" viewBox="0 0 24 24" aria-hidden="true">${ICONS[k]}</svg>`;
const contactRow = (k, label, href, value, extra = "") =>
  `<li><a href="${href}" ${extra}><span class="contact-label">${icon(k)}${label}</span><span class="contact-value">${value}</span></a></li>`;

$("#contact-body").innerHTML = `
  <p class="panel-lead">${escapeHtml(PROFILE.status)} — the fastest way to reach me is email.</p>
  <ul class="contact-list">
    ${contactRow("email", "Email", `mailto:${PROFILE.email}`, PROFILE.email)}
    ${contactRow("phone", "Phone", `tel:${PROFILE.phone.replace(/-/g, "")}`, PROFILE.phone)}
    ${contactRow("linkedin", "LinkedIn", PROFILE.linkedin, "sanpetch-meejue ↗", 'target="_blank" rel="noopener"')}
    ${contactRow("behance", "Behance", PROFILE.behance, "chanom-yen ↗", 'target="_blank" rel="noopener"')}
    ${PROFILE.facebook ? contactRow("facebook", "Facebook", PROFILE.facebook, "FongFold ↗", 'target="_blank" rel="noopener"') : ""}
    ${PROFILE.resume ? contactRow("resume", "Resume", PROFILE.resume, "Download PDF ↓", "download") : ""}
    ${PROFILE.cv ? contactRow("cv", "CV (full)", PROFILE.cv, "Download PDF ↓", "download") : ""}
  </ul>`;

// 2.5 Quick view (รายการทั้งหมด)
$("#quick-body").innerHTML = `
  <section><h3>UX/UI Works</h3><ul>${PROJECTS.map((p) => `<li><a href="project.html?id=${p.id}">${escapeHtml(p.title)}</a> — ${escapeHtml(p.category)}</li>`).join("")}</ul></section>
  <section><h3>Novels (in Thai, by ${escapeHtml(PEN_NAME)})</h3><ul>${NOVELS.map((n) => `<li>${n.url ? `<a href="${n.url}" target="_blank" rel="noopener" lang="th">${escapeHtml(n.titleTh)}</a>` : `<span lang="th">${escapeHtml(n.titleTh)}</span>`}</li>`).join("")}</ul></section>
  <section><h3>More</h3><ul>
    <li><button type="button" class="link-btn" data-open="about">About me</button></li>
    <li><button type="button" class="link-btn" data-open="certs">Certificates</button></li>
    <li><button type="button" class="link-btn" data-open="contact">Contact</button></li>
  </ul></section>`;


/* ---------- 3. เปิด / ปิดแผง ---------- */

let lastTrigger = null; // จำปุ่มที่กดเปิด เพื่อคืนโฟกัสตอนปิด (สำคัญสำหรับคนใช้คีย์บอร์ด)

function openPanel(id, trigger) {
  document.querySelectorAll("dialog[open]").forEach((d) => d.close());
  const panel = document.getElementById(id);
  if (!panel) return;
  lastTrigger = trigger || null;

  // แผงเปิดทางขวาเสมอ (อาคารที่อยู่ฝั่งขวาจะถูกแผงทับ — ไม่เป็นไร)
  const place = document.querySelector(`.hotspot[data-open="${id}"]`);

  panel.showModal();
  panel.querySelector(".panel-scroll").scrollTop = 0;
  requestAnimationFrame(() => panel.dispatchEvent(new Event("panel-shown")));
  if (place && window.innerWidth > 760) flyTo(place, panel);   // วัดขนาดแผงจริงหลังเปิด แล้วเลื่อนกล้อง
  document.dispatchEvent(new CustomEvent("panel:open", { detail: id })); // บอก game.js ว่าเปิดแผงไหน
  history.replaceState(null, "", "#" + id); // ใส่ #works ใน URL → กด Back จากหน้าผลงานแล้วกลับมาที่แผงเดิม
}

document.addEventListener("click", (e) => {
  const opener = e.target.closest("[data-open]");
  if (opener) {
    e.preventDefault();
    if (opener.classList.contains("hotspot")) {
      if (wasDragged) return;                           // ลากแผนที่ไม่ถือว่าเป็นการกด
      if (typeof Player !== "undefined") {              // มีตัวละคร → เดินไปก่อน แล้วค่อยเปิดแผง
        if (Player.isBusy()) return;
        Player.walkTo(opener.dataset.open).then(() => openPanel(opener.dataset.open, opener));
        return;
      }
    }
    openPanel(opener.dataset.open, opener);
  }
  if (e.target.closest("[data-close]")) e.target.closest("dialog").close();
});

document.querySelectorAll("dialog.panel").forEach((d) => {
  // กดพื้นที่มืดนอกแผง → ปิด
  d.addEventListener("click", (e) => {
    if (e.target !== d) return;
    const r = d.getBoundingClientRect();   // กดนอกกรอบจริงๆ เท่านั้นถึงปิด (กดโดนกรอบไม้ไม่ปิด)
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
  });
  d.addEventListener("close", () => {
    history.replaceState(null, "", location.pathname);
    render(true);                       // ปิดแผง → แผนที่กลับมาอยู่ในขอบเขตปกติ
    if (lastTrigger) lastTrigger.focus({ preventScroll: true });   // preventScroll = ไม่ให้เบราว์เซอร์เลื่อนแผนที่เอง
  });
});

// เปิดหน้ามาพร้อม #works → เปิดแผงนั้นเลย
window.addEventListener("load", () => {
  const id = location.hash.slice(1);
  if (id && document.getElementById(id)) openPanel(id);
});


/* ---------- 4. ลาก / ซูมแผนที่ ---------- */

const viewport = $("#map");
const world = $("#world");
const WORLD_W = 1586, WORLD_H = 992;
const view = { x: 0, y: 0, scale: 1 };
let wasDragged = false;

function minScale() { return Math.max(window.innerWidth / WORLD_W, window.innerHeight / WORLD_H) * 1.03; } // ×1.03 = เผื่อขอบให้ parallax ขยับได้
function maxScale() { return minScale() * 2.2; }

// ไม่ให้เลื่อนเลยขอบภาพ
function clamp() {
  const M = 14;   // เผื่อขอบ 14px ให้ parallax ขยับได้ โดยไม่เห็นขอบภาพ
  view.scale = Math.min(maxScale(), Math.max(minScale(), view.scale));
  view.x = Math.min(-M, Math.max(window.innerWidth - WORLD_W * view.scale + M, view.x));
  view.y = Math.min(-M, Math.max(window.innerHeight - WORLD_H * view.scale + M, view.y));
}
function render(animate) {
  clamp();        // ไม่ให้เลื่อนเลยขอบภาพ → ไม่มีช่องว่างสีพื้นหลังโผล่
  world.classList.toggle("is-animating", !!animate);
  world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
}

// ซูมโดยให้จุด (cx, cy) บนจออยู่กับที่
function zoomAt(factor, cx = window.innerWidth / 2, cy = window.innerHeight / 2, animate) {
  const next = Math.min(maxScale(), Math.max(minScale(), view.scale * factor));
  view.x = cx - (cx - view.x) * (next / view.scale);
  view.y = cy - (cy - view.y) * (next / view.scale);
  view.scale = next;
  render(animate);
}

// เริ่มต้น: ให้แผนที่เต็มจอ และอยู่ตรงกลาง
function resetView(animate) {
  view.scale = minScale();
  view.x = (window.innerWidth - WORLD_W * view.scale) / 2;
  // แนวตั้ง: ไม่จัดกึ่งกลาง แต่ชิดด้านบน (ตัดขอบบนแค่ 20px ของภาพ)
  // → จอกว้างแค่ไหน ป้าย UX/UI ด้านบนก็ไม่ถูกตัด
  view.y = Math.max(window.innerHeight - WORLD_H * view.scale, -20 * view.scale);
  render(animate);
}

// เลื่อนกล้องไปหาอาคาร (ให้อาคารอยู่ฝั่งซ้ายของจอ)
function flyTo(place, panel) {
  const px = parseFloat(place.style.getPropertyValue("--x"));
  const py = parseFloat(place.style.getPropertyValue("--y")) - 80;
  // พยายามวางอาคารไว้กลางพื้นที่ด้านซ้ายที่แผงไม่บัง
  // ถ้าอาคารอยู่ริมขวา render() จะหยุดที่ขอบภาพ (ไม่มีช่องว่าง) และแผงจะทับอาคารแทน
  const areaRight = panel.getBoundingClientRect().left;
  view.scale = Math.min(maxScale(), minScale() * 1.1);
  view.x = areaRight / 2 - px * view.scale;
  view.y = window.innerHeight * 0.55 - py * view.scale;
  render(true);   // render ปกติ = ไม่ให้เลื่อนเลยขอบภาพ → ไม่มีช่องว่างสีเขียวโผล่
}

// ลากด้วยเมาส์ / นิ้ว (Pointer Events ใช้ได้ทั้งสองแบบ)
const pointers = new Map();
let start = null;

viewport.addEventListener("pointerdown", (e) => {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  start = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, dist: pinchDistance(), scale: view.scale };
  wasDragged = false;
});
viewport.addEventListener("pointermove", (e) => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (pointers.size === 2 && start.dist) {          // สองนิ้ว = ซูม (pinch)
    const ratio = pinchDistance() / start.dist;
    const c = pinchCenter();
    view.scale = start.scale; view.x = start.vx; view.y = start.vy;
    zoomAt(ratio, c.x, c.y);
    wasDragged = true;
    return;
  }
  const dx = e.clientX - start.x, dy = e.clientY - start.y;
  if (Math.abs(dx) + Math.abs(dy) > 6) {
    wasDragged = true;
    viewport.classList.add("is-dragging");
    if (!viewport.hasPointerCapture(e.pointerId)) viewport.setPointerCapture(e.pointerId);
  }
  if (wasDragged) { view.x = start.vx + dx; view.y = start.vy + dy; render(false); }
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  viewport.classList.remove("is-dragging");
  if (pointers.size === 1) {                         // ยกนิ้วออก 1 นิ้ว → เริ่มลากต่อจากนิ้วที่เหลือ
    const p = [...pointers.values()][0];
    start = { x: p.x, y: p.y, vx: view.x, vy: view.y, dist: 0, scale: view.scale };
  }
}
viewport.addEventListener("pointerup", endPointer);
viewport.addEventListener("pointercancel", endPointer);

function pinchDistance() {
  if (pointers.size < 2) return 0;
  const [a, b] = [...pointers.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function pinchCenter() {
  const [a, b] = [...pointers.values()];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// ลูกกลิ้งเมาส์ = ซูม
viewport.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoomAt(e.deltaY < 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY);
}, { passive: false });

// ปุ่ม + / − / ดูทั้งแผนที่
$("#zoom-in").addEventListener("click", () => zoomAt(1.3, undefined, undefined, true));
$("#zoom-out").addEventListener("click", () => zoomAt(1 / 1.3, undefined, undefined, true));
$("#zoom-reset").addEventListener("click", () => resetView(true));

// กด Tab มาที่อาคารที่อยู่นอกจอ → เลื่อนแผนที่ให้เห็น
document.querySelectorAll(".hotspot").forEach((place) => {
  place.addEventListener("focus", () => {
    const r = place.getBoundingClientRect();
    if (r.left < 0 || r.right > innerWidth || r.top < 0 || r.bottom > innerHeight) {
      const px = parseFloat(place.style.getPropertyValue("--x"));
      const py = parseFloat(place.style.getPropertyValue("--y")) - 80;
      view.x = innerWidth / 2 - px * view.scale;
      view.y = innerHeight / 2 - py * view.scale;
      render(true);
    }
  });
});

window.addEventListener("resize", () => render(false));
// กันเบราว์เซอร์เลื่อนกรอบแผนที่เอง (เช่น ตอนโฟกัสปุ่มที่อยู่ขอบจอ) → เลื่อนได้ทางเดียวคือผ่าน view
viewport.addEventListener("scroll", () => { viewport.scrollTop = 0; viewport.scrollLeft = 0; });

/* ฉากเปิด: เริ่มจากซูมใกล้ๆ ที่สำนัก UX/UI แล้วค่อยๆ ถอยกล้องออกจนเห็นทั้งแผนที่ (เหมือนเปิดเกม) */
const calmMotion = document.documentElement.classList.contains("motion-off");
if (calmMotion || location.hash) {
  resetView(false);
} else {
  view.scale = minScale() * 2;          // เริ่มที่ซูม 2 เท่า
  view.x = innerWidth / 2 - 740 * view.scale;   // 740, 330 = ตำแหน่งสำนัก UX/UI บนภาพ
  view.y = innerHeight / 2 - 330 * view.scale;
  render(false);
  world.classList.add("is-intro");
  setTimeout(() => resetView(true), 250);
  setTimeout(() => world.classList.remove("is-intro"), 2600);
}

/* ปุ่มเปิด/ปิดแอนิเมชัน */
const motionBtn = $("#motion-toggle");
function syncMotionButton() {
  motionBtn.setAttribute("aria-pressed", String(!document.documentElement.classList.contains("motion-off")));
}
motionBtn.addEventListener("click", () => {
  const off = document.documentElement.classList.toggle("motion-off");
  syncMotionButton();
});
syncMotionButton();


/* ---------- 5. ดูรูปเต็มจอ (Lightbox) — ใช้กับใบรับรองและปกนิยาย ----------
   กดรูปย่อ → เปิดรูปเต็มจอ · ‹ › หรือลูกศรซ้าย/ขวา = รูปก่อน/ถัดไป (ในหมวดเดียวกัน) · Esc หรือกดพื้นมืด = ปิด */
const lightbox = $("#lightbox");
const lbImg = $("#lightbox-img");
const lbCaption = $("#lightbox-caption");
const GALLERIES = {
  certs: CERTIFICATES.map((c) => c.image && {
    src: c.full || c.image, alt: `Certificate: ${c.title || ""}, ${c.issuer}, ${c.year}`,
    caption: `<strong>${show(c.title)}</strong><span>${escapeHtml(c.issuer)} · ${escapeHtml(c.year)}</span>${c.verify ? `<a href="${c.verify}" target="_blank" rel="noopener">Verify ↗</a>` : ""}`
  }),
  novels: NOVELS.map((n) => n.cover && {
    src: n.full || n.cover, alt: `Book cover: ${n.titleEn || n.titleTh}`,
    caption: `<strong>${escapeHtml(n.titleEn || "")}</strong><span lang="th">${escapeHtml(n.titleTh)}</span>${n.url ? `<a href="${n.url}" target="_blank" rel="noopener">Read on Dek-D ↗</a>` : ""}`
  })
};
let lbSet = "certs", lbIndex = 0, lbOpener = null;

function showItem(i) {
  lbIndex = i;
  const it = GALLERIES[lbSet][i];
  lbImg.src = it.src; lbImg.alt = it.alt; lbCaption.innerHTML = it.caption;
  const many = GALLERIES[lbSet].filter(Boolean).length > 1;
  $("#lightbox-prev").hidden = !many;
  $("#lightbox-next").hidden = !many;
}
function stepItem(dir) {
  const ids = GALLERIES[lbSet].map((x, i) => x ? i : -1).filter((i) => i >= 0);
  const pos = ids.indexOf(lbIndex);
  showItem(ids[(pos + dir + ids.length) % ids.length]);
}
document.addEventListener("click", (e) => {
  const zoom = e.target.closest(".cert-zoom");
  if (!zoom) return;
  lbOpener = zoom; lbSet = zoom.dataset.gallery;
  showItem(Number(zoom.dataset.index));
  lightbox.showModal();
});
$("#lightbox-prev").addEventListener("click", () => stepItem(-1));
$("#lightbox-next").addEventListener("click", () => stepItem(1));
$("#lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) lightbox.close(); });
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") stepItem(-1);
  if (e.key === "ArrowRight") stepItem(1);
});
lightbox.addEventListener("close", () => { if (lbOpener) lbOpener.focus({ preventScroll: true }); });
