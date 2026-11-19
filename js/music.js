/* =========================================================
   music.js — เพลงประกอบแบบ Lofi เล่นวนไปเรื่อยๆ
   ---------------------------------------------------------
   เพลงนี้ "สร้างสดด้วยโค้ด" ผ่าน Web Audio API (เครื่องสังเคราะห์เสียงในเบราว์เซอร์)
   → ไม่ต้องมีไฟล์เพลง ไม่มีปัญหาลิขสิทธิ์ และไม่ทำให้เว็บโหลดช้า

   เพลงประกอบด้วย:
   - คอร์ดนุ่มๆ แบบเปียโนไฟฟ้า (Rhodes)
   - ทำนองเสียงดีด คล้ายกู่เจิง ใช้โน้ตบันไดเสียง 5 โน้ต (pentatonic) ให้ฟีลจีนโบราณ
   - กลองเบาๆ จังหวะ Lofi

   อยากใช้ไฟล์เพลงของตัวเองแทน:
   ใส่ไฟล์ไว้ในโฟลเดอร์ audio/ แล้วแก้บรรทัดล่างเป็น  const MUSIC_FILE = "audio/ชื่อไฟล์.mp3";

   เพลงเปิดเองทุกครั้งที่เข้าเว็บ (เสียงจะออกหลังผู้ใช้คลิกครั้งแรก ตามกฎเบราว์เซอร์)
   WCAG กำหนดว่าเสียงที่เล่นเองต้องมีปุ่มหยุด → ปุ่ม 🎵 ปิดได้ตลอด
   ========================================================= */

const MUSIC_FILE = null;

const LofiMusic = (() => {
  const BPM = 72;
  const STEP = 60 / BPM / 4;        // 1 step = โน้ตตัวเขบ็ต 2 ชั้น (1/16)
  const BARS = 8, STEPS_PER_BAR = 16;
  const freq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);  // เลขโน้ต MIDI → ความถี่ (Hz)

  // คอร์ด 8 ห้อง (เลข MIDI): Am7 · Fmaj7 · C/G · G6 · Am7 · Fmaj7 · Dm7 · Em7
  const CHORDS = [[57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 60, 64], [55, 59, 62, 64],
                  [57, 60, 64, 67], [53, 57, 60, 64], [50, 53, 57, 60], [52, 55, 59, 62]];
  const BASS = [45, 41, 43, 43, 45, 41, 38, 40];
  // ทำนอง: ห้องละ 8 ช่อง (โน้ตตัวเขบ็ต 1 ชั้น), 0 = เงียบ — ใช้แค่ A C D E G (pentatonic)
  const MELODY = [
    [76, 0, 74, 0, 72, 0, 0, 0], [69, 0, 0, 72, 74, 0, 0, 0],
    [67, 0, 69, 0, 72, 0, 74, 0], [76, 0, 0, 0, 74, 72, 0, 0],
    [81, 0, 79, 0, 76, 0, 0, 0], [74, 0, 76, 0, 72, 0, 0, 69],
    [74, 0, 0, 72, 69, 0, 67, 0], [69, 0, 0, 0, 0, 0, 0, 0]
  ];
  const KICK = [0, 6, 10], SNARE = [4, 12];

  /* ---------- สร้างเครื่องดนตรี ---------- */
  function build(ctx) {
    // สายสัญญาณหลัก: ทุกเสียง → ตัดเสียงแหลม (ให้เสียงนุ่ม ไม่บาดหู) → บีบเสียงให้นุ่ม → ปรับความดัง → ลำโพง
    const master = ctx.createGain(); master.gain.value = 0;
    const lowpass = ctx.createBiquadFilter(); lowpass.type = "lowpass"; lowpass.frequency.value = 3200;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
    lowpass.connect(comp).connect(master).connect(ctx.destination);

    // เสียงสะท้อน (echo) ให้ทำนองฟังกว้างขึ้น
    const echo = ctx.createDelay(1); echo.delayTime.value = STEP * 6;
    const feedback = ctx.createGain(); feedback.gain.value = 0.28;
    const echoOut = ctx.createGain(); echoOut.gain.value = 0.3;
    echo.connect(feedback).connect(echo); echo.connect(echoOut).connect(lowpass);

    // เสียงซ่า (noise) ใช้ทำกลองสแนร์และไฮแฮท
    const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;


    return { ctx, master, bus: lowpass, echo, noise };
  }

  function rhodes(a, midi, t, dur) {
    const { ctx, bus } = a;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1500;
    [["sine", 1, 0.09], ["triangle", 2, 0.012]].forEach(([type, mult, vol]) => {
      const o = ctx.createOscillator(); o.type = type;
      o.frequency.value = freq(midi) * mult; o.detune.value = Math.random() * 8 - 4;
      const og = ctx.createGain(); og.gain.value = vol;
      o.connect(og).connect(g); o.start(t); o.stop(t + dur + 0.6);
    });
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.35, t + dur * 0.8);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.5);
    g.connect(f).connect(bus);
  }

  function bass(a, midi, t, dur) {
    const { ctx, bus } = a;
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq(midi);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(bus); o.start(t); o.stop(t + dur + 0.05);
  }

  // เสียงดีดคล้ายกู่เจิง: เริ่มสูงนิดๆ แล้วไถลลงหาโน้ต + จางเร็ว
  function pluck(a, midi, t) {
    const { ctx, bus, echo } = a;
    const o = ctx.createOscillator(); o.type = "triangle";
    o.frequency.setValueAtTime(freq(midi) * 1.025, t);
    o.frequency.exponentialRampToValueAtTime(freq(midi), t + 0.07);
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = freq(midi) * 2;
    const g2 = ctx.createGain(); g2.gain.value = 0.25;
    const f = ctx.createBiquadFilter(); f.type = "lowpass";
    f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(900, t + 0.8);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    o.connect(f); o2.connect(g2).connect(f); f.connect(g);
    g.connect(bus); g.connect(echo);
    o.start(t); o2.start(t); o.stop(t + 1.5); o2.stop(t + 1.5);
  }

  function kick(a, t) {
    const { ctx, bus } = a;
    const o = ctx.createOscillator(); o.type = "sine";
    o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    o.connect(g).connect(bus); o.start(t); o.stop(t + 0.35);
  }

  function noiseHit(a, t, { type, freqHz, q = 0.7, vol, decay }) {
    const { ctx, bus, noise } = a;
    const src = ctx.createBufferSource(); src.buffer = noise;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freqHz; f.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + decay);
    src.connect(f).connect(g).connect(bus);
    src.start(t, Math.random()); src.stop(t + decay + 0.02);
  }

  // วางโน้ตของ 1 step (เรียกทีละ step ล่วงหน้าเล็กน้อย)
  function scheduleStep(a, step, t) {
    const bar = Math.floor(step / STEPS_PER_BAR) % BARS;
    const s = step % STEPS_PER_BAR;
    const swing = s % 4 === 2 ? STEP * 0.33 : 0;   // จังหวะยกให้ช้านิดๆ = ฟีล lofi

    if (s === 0) {
      CHORDS[bar].forEach((m) => rhodes(a, m, t, STEP * 16));
      bass(a, BASS[bar], t, STEP * 7);
    }
    if (s === 8) bass(a, BASS[bar], t, STEP * 6);
    if (s % 2 === 0) {
      const m = MELODY[bar][s / 2];
      if (m) pluck(a, m, t + swing);
      noiseHit(a, t + swing, { type: "bandpass", freqHz: 6000, q: 1.2, vol: 0.012, decay: 0.035 });   // ไฮแฮท (เบามาก)
    }
    if (KICK.includes(s)) kick(a, t);
    if (SNARE.includes(s)) noiseHit(a, t, { type: "bandpass", freqHz: 1100, q: 1, vol: 0.07, decay: 0.14 });  // สแนร์ (ทุ้มๆ นุ่มๆ)
  }


  /* ---------- เล่นสด ---------- */
  let audio = null, timer = null, step = 0, nextTime = 0;

  function start() {
    if (!audio) audio = build(new (window.AudioContext || window.webkitAudioContext)());
    const { ctx, master } = audio;
    ctx.resume();
    step = 0; nextTime = ctx.currentTime + 0.1;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 2);   // ค่อยๆ ดังขึ้น 2 วินาที
    clearInterval(timer);
    // ทุก 25ms ดูว่าต้องวางโน้ตอะไรในอีก 0.2 วินาทีข้างหน้า (วิธีมาตรฐานให้จังหวะเป๊ะ)
    timer = setInterval(() => {
      while (nextTime < ctx.currentTime + 0.2) {
        scheduleStep(audio, step, nextTime);
        nextTime += STEP; step++;
      }
    }, 25);
  }

  function stop() {
    if (!audio) return;
    const { ctx, master } = audio;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);    // ค่อยๆ เบาลงก่อนหยุด
    setTimeout(() => { clearInterval(timer); ctx.suspend(); }, 900);
  }

  // ใช้สร้างไฟล์ตัวอย่างเพลง (ไม่ได้ใช้ในเว็บ)
  async function renderOffline(seconds = BARS * STEPS_PER_BAR * STEP * 2) {
    const ctx = new OfflineAudioContext(2, Math.ceil(44100 * seconds), 44100);
    const a = build(ctx); a.master.gain.value = 0.55;
    for (let i = 0; i * STEP < seconds - 0.5; i++) scheduleStep(a, i, i * STEP);
    return ctx.startRendering();
  }

  // เบราว์เซอร์ยังไม่อนุญาตให้มีเสียง? → ลองปลุกอีกครั้ง (เรียกตอนผู้ใช้คลิก/กดปุ่มครั้งแรก)
  function unlock() { if (audio && audio.ctx.state === "suspended") audio.ctx.resume(); }
  function isSilent() { return !audio || audio.ctx.state !== "running"; }

  return { start, stop, renderOffline, unlock, isSilent };
})();


/* ---------- ปุ่ม 🎵 ---------- */
(() => {
  const btn = document.getElementById("music-toggle");
  if (!btn) return;
  let fileAudio = null;
  let playing = false;

  function play() {
    if (MUSIC_FILE) {
      fileAudio = fileAudio || Object.assign(new Audio(MUSIC_FILE), { loop: true, volume: 0.4 });
      fileAudio.play().catch(() => {});   // ถูกบล็อก → รอคลิกแรก
    } else {
      LofiMusic.start();
    }
    playing = true; sync();
  }
  function pause() {
    if (MUSIC_FILE) { if (fileAudio) fileAudio.pause(); } else LofiMusic.stop();
    playing = false; sync();
  }
  function sync() {
    btn.setAttribute("aria-pressed", String(playing));
    window.SOUND_ON = playing;   // game.js ใช้ค่านี้: เปิดเพลงอยู่ = เปิดเสียงประกอบด้วย
  }

  btn.addEventListener("click", () => {
    playing ? pause() : play();   // ปิดเพลงได้ตลอด แต่รีเฟรชแล้วจะเปิดใหม่
  });

  // เข้าเว็บ / รีเฟรช → เปิดเพลงทันทีทุกครั้ง
  // แต่กฎของเบราว์เซอร์: ถ้าผู้ใช้ยังไม่เคยคลิกอะไรในเว็บ จะยังไม่มีเสียงออก
  // → เพลงจึง "พร้อมเล่น" ไว้ก่อน แล้วดังขึ้นทันทีเมื่อผู้ใช้คลิกหรือกดปุ่มอะไรก็ได้ครั้งแรก
  //   (เช่น กด Next / Skip ของ NPC หรือคลิกแผนที่)
  if (!MUSIC_FILE) {
    play();
    const unlock = () => {
      if (playing) MUSIC_FILE ? fileAudio.play() : LofiMusic.unlock();
      if (!LofiMusic.isSilent()) {
        window.removeEventListener("pointerdown", unlock, true);
        window.removeEventListener("keydown", unlock, true);
      }
    };
    window.addEventListener("pointerdown", unlock, true);
    window.addEventListener("keydown", unlock, true);
  } else {
    play();
    const unlockFile = () => { if (playing && fileAudio.paused) fileAudio.play().catch(() => {}); };
    window.addEventListener("pointerdown", unlockFile, { once: true, capture: true });
    window.addEventListener("keydown", unlockFile, { once: true, capture: true });
  }
  sync();
})();
