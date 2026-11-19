"""
build.py — ตรวจและเตรียมไฟล์ก่อนอัปโหลดเว็บ (ไม่ต้องติดตั้งอะไรเพิ่มนอกจาก Python + Pillow)

วิธีใช้ (เปิด Terminal ในโฟลเดอร์ site):
    python tools/build.py

ทำ 2 อย่าง:
1. สร้าง js/image-sizes.js — ขนาดจริงของภาพผลงานทุกภาพ
   หน้าเว็บใช้ค่านี้ใส่ width/height ให้ <img> → ภาพไม่กระตุกตอนโหลด (ลด layout shift)
2. ตรวจว่าภาพทุกไฟล์ที่ js/data.js อ้างถึง มีอยู่จริง
"""
import json, re, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
data = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
# ตัดบรรทัดคำอธิบาย (comment) ออกก่อนตรวจ
code = "\n".join(l for l in data.splitlines() if not l.strip().startswith(("//", "-", "*", "/*")) and " cover   :" not in l)

# 1. ขนาดภาพผลงาน
sizes = {}
for f in sorted((ROOT / "images" / "projects").rglob("*.webp")):
    with Image.open(f) as im:
        sizes[f.relative_to(ROOT).as_posix()] = [im.width, im.height]
out = "/* สร้างอัตโนมัติโดย tools/build.py — ไม่ต้องแก้ไฟล์นี้เอง */\nconst IMAGE_SIZES = " + json.dumps(sizes, indent=0) + ";\n"
(ROOT / "js" / "image-sizes.js").write_text(out, encoding="utf-8")
print(f"image-sizes.js: {len(sizes)} images")

# 2. ภาพที่อ้างถึงต้องมีอยู่จริง
missing = [p for p in sorted(set(re.findall(r'"((?:images|files)/[^"]+)"', code))) if not (ROOT / p).exists()]
if missing:
    print("Missing files:"); [print("  -", m) for m in missing]; sys.exit(1)
print("All referenced files exist.")
