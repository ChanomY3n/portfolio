/* =========================================================
   ambient.js — แอนิเมชันบรรยากาศ ให้แผนที่ดูมีชีวิต
   ---------------------------------------------------------
   1. กลีบดอกไม้ร่วง (ลอยอยู่บนจอ)
   2. ประกายน้ำในลำธาร + น้ำตกระยิบระยับ (ติดอยู่กับแผนที่)
   3. หมอกลอยผ่านช้าๆ
   4. นกกระเรียนบินผ่านเป็นระยะ
   5. ประกายทองรอบอาคารตอนเอาเมาส์ชี้
   6. แผนที่ขยับตามเมาส์เล็กน้อย (parallax) ให้รู้สึกมีมิติ

   ทั้งหมดนี้ปิดได้ด้วยปุ่มเปิด/ปิดแอนิเมชัน (มุมขวาล่าง)
   และจะปิดเองตั้งแต่แรก ถ้าเครื่องตั้งค่า "ลดการเคลื่อนไหว" ไว้
   ========================================================= */

const worldEl = document.getElementById("world");
const rand = (min, max) => min + Math.random() * (max - min);

/* ---------- 1. กลีบดอกไม้ร่วง ---------- */
const petalLayer = document.createElement("div");
petalLayer.className = "petal-layer";
petalLayer.setAttribute("aria-hidden", "true");
for (let i = 0; i < 22; i++) {
  const petal = document.createElement("span");
  petal.className = "petal";
  const size = rand(12, 20);
  // ตัวแปร CSS แต่ละกลีบไม่เหมือนกัน → ร่วงไม่พร้อมกัน ดูเป็นธรรมชาติ
  petal.style.cssText = `
    left: ${rand(0, 100)}vw;
    width: ${size}px; height: ${size * 0.75}px;
    --drift: ${rand(-140, 140)}px;
    --spin: ${rand(240, 720)}deg;
    animation-duration: ${rand(10, 18)}s;
    animation-delay: -${rand(0, 18)}s;`;
  petalLayer.appendChild(petal);
}
document.getElementById("map").appendChild(petalLayer);

/* ---------- 2. ประกายน้ำ + น้ำตก ----------
   พิกัดบนลำธาร หามาจากสีของน้ำในภาพแผนที่ */
const WATER_POINTS = [
  [897, 143], [938, 226], [986, 304], [1008, 266], [1050, 281], [967, 508], [910, 544],
  [1024, 490], [943, 608], [976, 626], [1008, 642], [1055, 708], [1160, 810], [1146, 845], [1126, 882]
];
WATER_POINTS.forEach(([x, y]) => {
  const glint = document.createElement("span");
  glint.className = "glint";
  glint.style.cssText = `left:${x}px; top:${y}px; animation-delay:-${rand(0, 3)}s; animation-duration:${rand(2.2, 3.6)}s`;
  worldEl.appendChild(glint);
});

const fall = document.createElement("div");
fall.className = "waterfall-shimmer";
for (let i = 0; i < 5; i++) {
  const streak = document.createElement("span");
  streak.style.cssText = `left:${10 + i * 18}%; animation-delay:-${rand(0, 1.6)}s`;
  fall.appendChild(streak);
}
worldEl.appendChild(fall);

/* ---------- 3. หมอก ---------- */
const mist = document.createElement("div");
mist.className = "mist-layer";
mist.innerHTML = '<span class="mist m1"></span><span class="mist m2"></span><span class="mist m3"></span>';
worldEl.appendChild(mist);

/* ---------- 4. นกกระเรียน ---------- */
const crane = document.createElement("img");
crane.className = "crane-fly";
crane.src = "images/decor/crane.webp";
crane.alt = "";
worldEl.appendChild(crane);

/* ---------- 5. ประกายรอบอาคาร (เพิ่ม span เล็กๆ ในปุ่ม แล้วให้ CSS ทำให้ลอยขึ้นตอนชี้) ---------- */
document.querySelectorAll(".hotspot").forEach((spot) => {
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("span");
    s.className = "spark";
    s.setAttribute("aria-hidden", "true");
    s.style.cssText = `left:${rand(10, 90)}%; top:${rand(35, 85)}%; animation-delay:${rand(0, 1.2)}s`;
    spot.appendChild(s);
  }
});

/* ---------- 6. Parallax ตามเมาส์ ---------- */
{
  const viewportEl = document.getElementById("map");
  window.addEventListener("pointermove", (e) => {
    // -1 ถึง 1 : เมาส์อยู่ซ้ายสุด = -1, ขวาสุด = 1
    viewportEl.style.setProperty("--mx", (e.clientX / innerWidth) * 2 - 1);
    viewportEl.style.setProperty("--my", (e.clientY / innerHeight) * 2 - 1);
  });
}
