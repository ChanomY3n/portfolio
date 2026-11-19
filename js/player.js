/* =========================================================
   player.js — ตัวละครของเรา เดินไปตามทางหินบนแผนที่
   ---------------------------------------------------------
   กดอาคาร → ตัวละครเดินตามทางหิน "เส้นที่สั้นที่สุด" ไปหน้าอาคาร → แล้วค่อยเปิดแผง

   วิธีหาทาง:
   - NODES = จุดบนทางหิน (พิกัด x, y บนภาพแผนที่ 1586×992)
   - EDGES = ทางเดินที่เชื่อมระหว่างจุด
   - ใช้วิธี Dijkstra (วิธีมาตรฐานหาเส้นทางที่สั้นที่สุด แบบที่ Google Maps ใช้)
     เช่น Certificates → Contact จะข้ามสะพาน
          Contact → About me จะเดินลงทางหินฝั่งขวาของลำธาร

   อยากเพิ่มทางเดิน: เพิ่มจุดใน NODES แล้วเชื่อมใน EDGES
   ========================================================= */

const Player = (() => {
  const NODES = {
    hub: [660, 470],                                            // ลานกลาง (จุดเริ่ม)
    // ทางขึ้นสำนัก UX/UI
    ux1: [700, 420], ux2: [700, 365], works: [688, 328],
    // ทางไปหอคัมภีร์ (Certificates)
    w1: [600, 488], w2: [545, 510], w3: [470, 535], certs: [372, 548],
    // ทางหินฝั่งซ้าย ลงไปกระท่อม (About me)
    s1: [470, 600], s2: [478, 665], s3: [520, 705], s4: [620, 765], about: [700, 780],
    // ทางไปสะพาน → โรงเตี๊ยม (Contact)
    b0: [760, 455], b1: [845, 440], b2: [975, 395], b3: [1065, 380], contact: [1145, 375],
    // ทางหินฝั่งขวาของลำธาร: โรงเตี๊ยม ↓ กระท่อม
    r1: [1160, 430], r2: [1175, 478], r3: [1150, 512], r4: [1110, 542], r5: [1085, 575],
    r6: [1083, 612], r7: [1058, 645], r8: [1030, 670], r9: [985, 697], r10: [900, 738], r11: [800, 785],
    // แยกจากทางหินฝั่งขวา → ศาลานักเล่าเรื่อง (Novels)
    n1: [1195, 590], novels: [1262, 622]
  };
  const EDGES = [
    ["hub", "ux1"], ["ux1", "ux2"], ["ux2", "works"],
    ["hub", "w1"], ["w1", "w2"], ["w2", "w3"], ["w3", "certs"],
    ["w3", "s1"], ["s1", "s2"], ["s2", "s3"], ["s3", "s4"], ["s4", "about"],
    ["hub", "b0"], ["b0", "b1"], ["b1", "b2"], ["b2", "b3"], ["b3", "contact"],
    ["contact", "r1"], ["r1", "r2"], ["r2", "r3"], ["r3", "r4"], ["r4", "r5"], ["r5", "r6"],
    ["r6", "r7"], ["r7", "r8"], ["r8", "r9"], ["r9", "r10"], ["r10", "r11"], ["r11", "about"],
    ["r3", "n1"], ["n1", "novels"]
  ];
  const SPEED = 420;          // พิกเซลต่อวินาที (บนภาพแผนที่)
  const MAX_TIME = 2.2;       // เดินนานสุดไม่เกิน 2.2 วินาที (ทางไกลจะเดินเร็วขึ้นเอง)
  const SPRITE_FACES = "left";  // ภาพตัวละครต้นฉบับหันไปทางไหน ("left" หรือ "right")

  /* ---------- หาเส้นทางที่สั้นที่สุด (Dijkstra) ---------- */
  const dist = (a, b) => Math.hypot(NODES[a][0] - NODES[b][0], NODES[a][1] - NODES[b][1]);
  const links = {};
  EDGES.forEach(([a, b]) => {
    (links[a] = links[a] || []).push(b);
    (links[b] = links[b] || []).push(a);
  });
  function shortestPath(from, to) {
    const cost = { [from]: 0 }, prev = {}, todo = new Set(Object.keys(NODES));
    while (todo.size) {
      let u = null;
      todo.forEach((n) => { if (cost[n] !== undefined && (u === null || cost[n] < cost[u])) u = n; });
      if (u === null || u === to) break;
      todo.delete(u);
      (links[u] || []).forEach((v) => {
        const c = cost[u] + dist(u, v);
        if (cost[v] === undefined || c < cost[v]) { cost[v] = c; prev[v] = u; }
      });
    }
    const path = [to];
    while (path[0] !== from) path.unshift(prev[path[0]]);
    return path;
  }

  /* ---------- สร้างตัวละคร ---------- */
  const world = document.getElementById("world");
  const el = document.createElement("div");
  el.className = "player";
  el.setAttribute("aria-hidden", "true");     // เป็นภาพประกอบ โปรแกรมอ่านหน้าจอไม่ต้องอ่าน
  el.innerHTML = PROFILE.playerSprite
    ? `<span class="player-shadow"></span><img class="player-sprite" src="${PROFILE.playerSprite}" alt="">`
    : `<span class="player-shadow"></span><span class="player-token"><img src="${PROFILE.photo}" alt=""></span>`;
  world.appendChild(el);

  let at = "hub";             // ตอนนี้ยืนอยู่ที่จุดไหน
  let busy = false;
  const place = ([x, y]) => { el.style.transform = `translate(${x}px, ${y}px)`; };
  place(NODES.hub);

  // หันหน้า: ภาพหันซ้ายอยู่แล้ว → ตอนเดินไปขวาให้กลับด้าน (และกลับกันถ้าภาพหันขวา)
  function face(goingLeft) {
    const flip = SPRITE_FACES === "left" ? !goingLeft : goingLeft;
    el.classList.toggle("is-flipped", flip);
  }

  function walkTo(id) {
    if (!NODES[id] || id === at || busy) return Promise.resolve();
    const points = shortestPath(at, id).map((n) => NODES[n]);
    if (document.documentElement.classList.contains("motion-off")) {
      place(NODES[id]); at = id; return Promise.resolve();
    }

    const segs = [];
    let total = 0;
    for (let i = 1; i < points.length; i++) {
      const d = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      segs.push(d); total += d;
    }
    const duration = Math.min(MAX_TIME, total / SPEED) * 1000;

    busy = true;
    el.classList.add("is-walking");
    return new Promise((resolve) => {
      const t0 = performance.now();
      function frame(now) {
        const k = Math.min(1, (now - t0) / duration);
        let d = k * total, i = 0;
        while (i < segs.length - 1 && d > segs[i]) { d -= segs[i]; i++; }
        const a = points[i], b = points[i + 1], f = segs[i] ? d / segs[i] : 1;
        if (Math.abs(b[0] - a[0]) > 4) face(b[0] < a[0]);     // เดินแนวตั้งล้วนๆ ไม่ต้องหันใหม่
        place([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
        if (k < 1) requestAnimationFrame(frame);
        else { busy = false; at = id; el.classList.remove("is-walking"); setTimeout(resolve, 150); }
      }
      requestAnimationFrame(frame);
    });
  }

  return { walkTo, isBusy: () => busy };
})();
