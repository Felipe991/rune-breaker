// PROTOTYPE - NOT FOR PRODUCTION
// Procedural music for Rune Breaker, made entirely with Web Audio (no audio files, plays offline).
//
//   BEDS    one loop per place: menu, workshop (the Shop shares it), play, over. Changing place crossfades one bed into the next:
//           on the next bar when the game decides (a boss round ends), quickly when the player taps something.
//   LAYERS  a bed is built from layers. The play bed adds and removes layers as the game changes (Flow tier, combo, a boss,
//           danger, a good or bad surprise, a Relic or Joker choice), so the music follows what is happening.
//   STINGERS one-shot musical hits for moments (run start, boss, Relic, game over...), on the beat when it matters.
//   SFX     the Workshop and Shop's small interface sounds (tap, buy, equip, upgrade, deny...).
//
// The game feeds it: Music.attach(audio, () => tune) once, Music.set(state) every frame, Music.stinger(name), Music.sfx(name).
window.Music = (function () {
  const M = {};
  let ac = null, out = null, mix = null, duck = null, lp = null, fx = null, an = null, noiseBuf = null, T = () => ({});
  let cur = null, nxt = null, st = {}, last = '', timer = null, notes = 0, wanted = null;
  const LOOK = 0.28; // seconds scheduled ahead
  const mf = m => 440 * Math.pow(2, (m - 69) / 12);
  const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }; // a steady "random" for patterns
  const tv = () => T().music_volume === undefined ? 0.55 : T().music_volume;
  let prefMusic = true, prefSfx = true; const mg = () => (prefMusic ? tv() : 0), fg = () => (prefSfx ? tv() : 0); // the player can switch the music and the sound effects off separately

  // ---- instruments: each writes into a destination node `d` -------------------------------------------------
  function osc(d, type, f, t, dur, vol, a = 0.006, det = 0) {
    const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.value = f; o.detune.value = det;
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a + 0.02, dur));
    o.connect(g).connect(d); o.start(t); o.stop(t + dur + 0.06); notes++;
  }
  function noise(d, t, dur, vol, type, f, q = 1) {
    if (!noiseBuf) return; const s = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; flt.type = type; flt.frequency.value = f; flt.Q.value = q;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(flt).connect(g).connect(d); s.start(t, hash(t * 13) * 0.5, dur + 0.05); notes++;
  }
  const kick = (d, t, v = 0.5) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26); o.connect(g).connect(d); o.start(t); o.stop(t + 0.3); notes++; };
  const hat = (d, t, v = 0.1, open = false) => noise(d, t, open ? 0.16 : 0.04, v, 'highpass', 7000);
  const clap = (d, t, v = 0.15) => { noise(d, t, 0.12, v, 'bandpass', 1700, 0.8); noise(d, t + 0.012, 0.08, v * 0.7, 'bandpass', 2100, 0.8); };
  const tom = (d, t, m, v = 0.4) => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.setValueAtTime(mf(m) * 1.5, t); o.frequency.exponentialRampToValueAtTime(mf(m), t + 0.16);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4); o.connect(g).connect(d); o.start(t); o.stop(t + 0.45); notes++; };
  const bell = (d, t, m, v = 0.15, dur = 1.3) => { const f = mf(m); osc(d, 'sine', f, t, dur, v, 0.004); osc(d, 'sine', f * 2.76, t, dur * 0.35, v * 0.3, 0.004); };
  const pluck = (d, t, m, v = 0.15, dur = 0.3, type = 'triangle') => { osc(d, type, mf(m), t, dur, v, 0.004); osc(d, 'sine', mf(m) * 2, t, dur * 0.5, v * 0.3, 0.004); };
  const sub = (d, t, m, dur, v = 0.3) => { osc(d, 'sine', mf(m), t, dur, v, 0.02); osc(d, 'triangle', mf(m), t, dur * 0.6, v * 0.4, 0.02); };
  function pad(d, t, ms, dur, v = 0.12, cut = 1100) { // slow, soft, two detuned saws per note through one low-pass
    const flt = ac.createBiquadFilter(), g = ac.createGain(); flt.type = 'lowpass'; flt.frequency.value = cut; flt.connect(g).connect(d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(1, t + Math.min(0.5, dur * 0.3)); g.gain.linearRampToValueAtTime(0.0001, t + dur);
    ms.forEach(m => { [-7, 7].forEach(c => { const o = ac.createOscillator(), og = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = mf(m); o.detune.value = c; og.gain.value = v / ms.length;
      o.connect(og).connect(flt); o.start(t); o.stop(t + dur + 0.05); notes++; }); });
  }
  function brass(d, t, ms, dur, v = 0.2) { const flt = ac.createBiquadFilter(), g = ac.createGain(); flt.type = 'lowpass'; flt.frequency.setValueAtTime(500, t); flt.frequency.linearRampToValueAtTime(1800, t + 0.12); flt.connect(g).connect(d);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.06); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    ms.forEach(m => { const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mf(m); o.connect(flt); o.start(t); o.stop(t + dur + 0.05); notes++; }); }
  function rise(d, t, dur, v = 0.2) { // a noise riser
    if (!noiseBuf) return; const s = ac.createBufferSource(), flt = ac.createBiquadFilter(), g = ac.createGain(); s.buffer = noiseBuf; s.loop = true; flt.type = 'bandpass'; flt.Q.value = 1.4;
    flt.frequency.setValueAtTime(300, t); flt.frequency.exponentialRampToValueAtTime(5000, t + dur); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.05);
    s.connect(flt).connect(g).connect(d); s.start(t); s.stop(t + dur + 0.1); notes++;
  }
  function crunch(d, t, m, dur, v = 0.2) { // a gritty distorted bass/guitar-like growl
    const o = ac.createOscillator(), o2 = ac.createOscillator(), ws = ac.createWaveShaper(), flt = ac.createBiquadFilter(), g = ac.createGain(), k = new Float32Array(256);
    for (let i = 0; i < 256; i++) { const x = i / 128 - 1; k[i] = Math.tanh(x * 6); } ws.curve = k; o.type = 'sawtooth'; o2.type = 'square'; o.frequency.value = mf(m); o2.frequency.value = mf(m) * 1.005;
    flt.type = 'lowpass'; flt.frequency.value = 900; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(ws); o2.connect(ws); ws.connect(flt).connect(g).connect(d);
    o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05); notes += 2;
  }
  function glide(d, type, f0, f1, t, dur, v) { const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g).connect(d); o.start(t); o.stop(t + dur + 0.05); notes++; }

  // ---- the songs -------------------------------------------------------------------------------------------------
  const CH = { // chord notes (midi) and the bass root
    Am: { r: 33, n: [57, 60, 64] }, F: { r: 29, n: [53, 57, 60] }, C: { r: 36, n: [55, 60, 64] }, G: { r: 31, n: [55, 59, 62] },
    Dm: { r: 38, n: [50, 53, 57] }, E: { r: 40, n: [52, 56, 59] },   };
  const PENT = [57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81]; // A minor pentatonic over two octaves
  const bar = bpm => 16 * 60 / bpm / 4;
  const BEDS = {
    menu: { bpm: () => 76, bars: ['Am', 'F', 'C', 'G', 'Am', 'F', 'Dm', 'E'], layers: {
      pad: { vol: 1, step: c => { if (c.s === 0) pad(c.d, c.t, c.ch.n, bar(76) * 1.02, 0.2, 900); } },
      sub: { vol: 1, step: c => { if (c.s === 0) sub(c.d, c.t, c.ch.r + 12, bar(76) * 0.9, 0.28); } },
      bell: { vol: 1, step: c => { if ([0, 3, 6, 8, 11, 14].includes(c.s) && hash(c.ord * 3) < 0.62) bell(c.d, c.t, c.ch.n[Math.floor(hash(c.ord) * 3)] + 12 * (1 + Math.floor(hash(c.ord + 9) * 2)), 0.12); } },
      shimmer: { vol: 1, step: c => { if (c.s === 0 && c.barNo % 2 === 0) bell(c.d, c.t, c.ch.n[2] + 36, 0.06, 2.4); } },
    } },
    workshop: { bpm: () => 92, bars: ['Am', 'F', 'C', 'G', 'Am', 'F', 'C', 'E'], layers: {
      pad: { vol: 1, step: c => { if (c.s === 0) pad(c.d, c.t, c.ch.n, bar(92) * 1.02, 0.14, 800); } },
      bass: { vol: 1, step: c => { if ([0, 6, 10, 12].includes(c.s)) pluck(c.d, c.t, c.ch.r + (c.s === 12 ? 19 : 12), 0.3, 0.28, 'sine'); } },
      marimba: { vol: 1, step: c => { if (c.s % 2 === 0 && hash(c.ord * 5) > 0.22) pluck(c.d, c.t, c.ch.n[[0, 1, 2, 1, 0, 2, 1, 2][(c.s / 2) % 8] % 3] + 12, 0.15, 0.36); } },
      tap: { vol: 1, step: c => { if (c.s === 0 || c.s === 8) kick(c.d, c.t, 0.32); if (c.s === 4 || c.s === 12) noise(c.d, c.t, 0.03, 0.18, 'bandpass', 3200, 3); hat(c.d, c.t, 0.035); } },
    } },
    over: { bpm: () => 62, bars: ['Am', 'F', 'Dm', 'E'], layers: {
      pad: { vol: 1, step: c => { if (c.s === 0) pad(c.d, c.t, c.ch.n, bar(62) * 1.02, 0.18, 650); } },
      sub: { vol: 1, step: c => { if (c.s === 0) sub(c.d, c.t, c.ch.r + 12, bar(62) * 0.9, 0.3); } },
      bell: { vol: 1, step: c => { if (c.s === 0 || c.s === 10) bell(c.d, c.t, c.ch.n[c.s ? 0 : 2] + 12, 0.1, 2); } },
    } },
    play: { bpm: () => T().music_play_bpm || 112, bars: ['Am', 'F', 'C', 'G', 'Am', 'F', 'E', 'E'], layers: {
      pad: { vol: 1, step: c => { if (c.s === 0) pad(c.d, c.t, c.ch.n, bar(c.bpm) * 1.02, 0.16, 1100); } },
      bass: { vol: 1, step: c => { if ([0, 3, 6, 8, 11, 14].includes(c.s)) osc(c.d, 'triangle', mf(c.ch.r + 12), c.t, 0.22, 0.28); if (c.s === 0) sub(c.d, c.t, c.ch.r, 0.4, 0.25); } },
      beat: { vol: 1, step: c => { if (c.s % 4 === 0) kick(c.d, c.t, 0.42); if (c.s % 4 === 2) hat(c.d, c.t, 0.1); if (c.s === 4 || c.s === 12) clap(c.d, c.t, 0.1); } },
      arp: { vol: 1, step: c => { const n = c.ch.n; pluck(c.d, c.t, n[[0, 1, 2, 1][c.s % 4]] + 12 + (c.s % 8 >= 4 ? 12 : 0), 0.09, 0.22); } },
      lead: { vol: 1, step: c => { if ([0, 3, 6, 10].includes(c.s)) { const k = [0, 3, 6, 10].indexOf(c.s); pluck(c.d, c.t, PENT[4 + ((c.barNo * 2 + k * 2 + (hash(c.barNo) > 0.5 ? 1 : 0)) % 7)] + 12, 0.14, 0.3, 'sawtooth'); } } },
      drive: { vol: 1, step: c => { hat(c.d, c.t, 0.06, c.s === 14); if (c.s === 4 || c.s === 12) clap(c.d, c.t, 0.18); if (c.s % 2 === 0) osc(c.d, 'sawtooth', mf(c.ch.r + 24), c.t, 0.12, 0.08); } },
      tension: { vol: 1, step: c => { if (c.s === 0) { sub(c.d, c.t, 33, bar(c.bpm), 0.3); kick(c.d, c.t, 0.5); } if (c.s === 3) kick(c.d, c.t, 0.3); if (c.s === 8) kick(c.d, c.t, 0.5); if (c.s === 11) kick(c.d, c.t, 0.3); } },
      boss: { vol: 1, step: c => { // a harder, faster, grittier layer: syncopated kicks, snare rolls, 16th hats, distorted riffs, power chords
        if ([3, 10, 11, 14].includes(c.s)) kick(c.d, c.t, 0.5);
        if (c.s === 4 || c.s === 12) { clap(c.d, c.t, 0.26); noise(c.d, c.t, 0.1, 0.18, 'bandpass', 220, 1.2); }
        if (c.barNo % 4 === 3 && c.s >= 12) { clap(c.d, c.t, 0.16 + (c.s - 12) * 0.03); tom(c.d, c.t, 45 - (c.s - 12), 0.3); } // a snare and tom fill every fourth bar
        if (c.s % 2 === 1) hat(c.d, c.t, 0.07);
        if ([0, 6, 8, 11, 14].includes(c.s)) tom(c.d, c.t, c.s === 0 ? 38 : 41, 0.36);
        if (c.s % 2 === 0) crunch(c.d, c.t, c.ch.r + 12 + (c.s === 6 ? 1 : c.s === 14 ? 6 : 0), 0.2, 0.17); // the root, with a minor-second and tritone bite
        if (c.s === 0 || c.s === 10) brass(c.d, c.t, [c.ch.r + 12, c.ch.r + 19, c.ch.r + 24], 0.42, 0.26); // power chord stabs
        if (c.barNo % 2 === 1 && c.s === 8) rise(c.d, c.t, 8 * (60 / c.bpm / 4), 0.14); // a rising siren into the next bar
        osc(c.d, 'triangle', mf(c.ch.n[c.s % 3] + 12), c.t, 0.09, 0.05);
      } },
      boss_ember: { vol: 1, step: c => { // the Ember Tyrant: double-time kicks, a grinding chromatic riff, power chords on the off-beats
        if (c.s % 2 === 0) kick(c.d, c.t, 0.42); if (c.s === 4 || c.s === 12) clap(c.d, c.t, 0.3); hat(c.d, c.t, c.s % 4 === 0 ? 0.1 : 0.06);
        if (c.s % 2 === 0) crunch(c.d, c.t, c.ch.r + 12 + [0, 0, 1, 0, 0, 3, 2, 1][(c.s / 2) % 8], 0.16, 0.2);
        if (c.s === 0 || c.s === 6 || c.s === 10) brass(c.d, c.t, [c.ch.r + 12, c.ch.r + 19, c.ch.r + 24], 0.3, 0.24); if (c.s === 15) rise(c.d, c.t, c.stepDur * 1, 0.12); } },
      boss_tide: { vol: 1, step: c => { // the Tide Leviathan: crushing half-time, swelling sub, rolling toms and a wave riser each bar
        if (c.s === 0 || c.s === 6 || c.s === 10) kick(c.d, c.t, 0.62); if (c.s === 8) { clap(c.d, c.t, 0.36); tom(c.d, c.t, 36, 0.4); }
        if (c.s === 0) { sub(c.d, c.t, c.ch.r, bar(c.bpm) * 0.95, 0.5); crunch(c.d, c.t, c.ch.r + 12, 0.9, 0.2); } if (c.s >= 12) tom(c.d, c.t, 48 - (c.s - 12) * 2, 0.32);
        if (c.s === 8) rise(c.d, c.t, 8 * (60 / c.bpm / 4), 0.15); } },
      boss_storm: { vol: 1, step: c => { // the Storm Warden: staccato glitchy arps, noise bursts, snare rolls and stabs
        pluck(c.d, c.t, PENT[3 + Math.floor(hash(c.ord * 3) * 7)] + 12, 0.11, 0.07, 'square'); if (hash(c.ord * 5) > 0.7) noise(c.d, c.t, 0.03, 0.16, 'highpass', 5000);
        if ([0, 3, 6, 10].includes(c.s)) kick(c.d, c.t, 0.46); if (c.barNo % 4 === 3 && c.s >= 12) clap(c.d, c.t, 0.18); hat(c.d, c.t, 0.07);
        if (c.s === 0 || c.s === 8) brass(c.d, c.t, [c.ch.r + 24, c.ch.r + 31], 0.18, 0.2); } },
      boss_moon: { vol: 1, step: c => { // the Hollow Moon: a dissonant cluster, a tritone drone, tolling low bells, irregular heavy toms
        if (c.s === 0) { pad(c.d, c.t, [c.ch.r + 24, c.ch.r + 25, c.ch.r + 30], bar(c.bpm), 0.24, 700); sub(c.d, c.t, c.ch.r + 6, bar(c.bpm) * 0.9, 0.3); }
        if (c.s === 0 || c.s === 8) bell(c.d, c.t, c.ch.r + 24, 0.22, 2.4); if ([3, 7, 11, 13].includes(c.s)) tom(c.d, c.t, 38, 0.4); if (c.s === 0 || c.s === 10) kick(c.d, c.t, 0.55); if (c.s % 4 === 2) noise(c.d, c.t, 0.12, 0.06, 'bandpass', 1200, 3); } },
      good: { vol: 1, step: c => { if (c.s % 2 === 0 && hash(c.ord * 7) < 0.6) bell(c.d, c.t, PENT[5 + Math.floor(hash(c.ord) * 6)] + 12, 0.11, 1.2); } },
      bad: { vol: 1, step: c => { if (c.s === 0) { osc(c.d, 'sawtooth', mf(45), c.t, bar(c.bpm), 0.12); osc(c.d, 'sawtooth', mf(51), c.t, bar(c.bpm), 0.1); } if (c.s % 4 === 3 && hash(c.ord * 11) > 0.45) noise(c.d, c.t, 0.05, 0.1, 'bandpass', 900, 2); } },
      spark: { vol: 1, step: c => { if (c.s % 4 === 0) bell(c.d, c.t, c.ch.n[(c.s / 4 | 0) % 3] + 24, 0.09, 1.1); } },
    } },
  };
  const LAYER_NAMES = n => Object.keys(BEDS[n].layers);

  // ---- what the game state asks of each layer (0 = silent, 1 = full) ----------------------------------------------
  function targets(bed, s) {
    const out = {}; LAYER_NAMES(bed).forEach(k => { out[k] = 1; });
    if (bed !== 'play') return out;
    const tier = s.tier || 0, boss = !!s.boss, danger = s.danger || 0; // a Warden always brings the full rhythm section
    out.beat = (tier >= 1 || (s.combo || 0) >= 3 || boss) ? 1 : 0; out.arp = (tier >= 2 || s.good) ? 1 : 0; out.lead = tier >= 3 ? 1 : 0; out.drive = tier >= 4 ? 1 : 0;
    out.tension = danger > 0.45 ? 0.5 + danger * 0.5 : 0; out.boss = s.boss === 'stone' ? 1 : 0; ['ember', 'tide', 'storm', 'moon'].forEach(t => { out['boss_' + t] = s.boss === t ? 1 : 0; }); if (boss) { out.beat = 1; out.drive = 1; if ((s.bossTier || 0) >= 1) out.lead = 1; if ((s.bossTier || 0) >= 2) out.tension = Math.max(out.tension, 0.8); } out.good = s.good ? 1 : 0; out.bad = s.bad ? 1 : 0; out.spark = s.choice ? 1 : 0;
    if (s.revive) { Object.keys(out).forEach(k => { out[k] = 0; }); out.pad = 0.4; out.tension = 1; }
    return out;
  }
  function filterFor(s) { // how muffled the music is, and how loud
    if (s.paused) return [450, 0.4]; if (s.revive) return [1200, 0.85]; if (s.choice) return [800, 0.72]; if (s.tip) return [5000, 0.8]; if (s.bad) return [3600, 1]; return [16000, 1];
  }

  // ---- the scheduler ----------------------------------------------------------------------------------------------
  function makeInst(name, t0, fade) {
    const def = BEDS[name], g = ac.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(1, t0 + fade); g.connect(lp);
    const inst = { name, def, bpm: def.bpm(), t0, i: 0, next: t0, g, lay: {}, stopAt: Infinity };
    inst.stepDur = 60 / inst.bpm / 4;
    LAYER_NAMES(name).forEach(k => { const lg = ac.createGain(); lg.gain.value = 0; lg.connect(g); inst.lay[k] = { g: lg, tgt: -1, tail: 0 }; });
    return inst;
  }
  function applyTargets(inst, s, now) {
    const tg = targets(inst.name, s);
    for (const k in tg) { const L = inst.lay[k]; if (!L) continue; if (Math.abs(L.tgt - tg[k]) < 1e-6) continue;
      L.tgt = tg[k]; L.g.gain.cancelScheduledValues(now); L.g.gain.setTargetAtTime(tg[k] * def0(inst, k), now, tg[k] > 0 ? 0.25 : 0.4); if (tg[k] === 0) L.tail = now + 2.5; }
  }
  const def0 = (inst, k) => inst.def.layers[k].vol;
  function run(inst, now) {
    while (inst.next < now + LOOK) {
      const i = inst.i, s = i % 16, barNo = Math.floor(i / 16), ch = CH[inst.def.bars[barNo % inst.def.bars.length]];
      if (inst.next >= inst.t0 - 1e-6 && inst.next < inst.stopAt) for (const k in inst.def.layers) { const L = inst.lay[k];
        if (L.tgt > 0 || now < L.tail) inst.def.layers[k].step({ t: inst.next, s, barNo, ord: i, ch, d: L.g, bpm: inst.bpm, stepDur: inst.stepDur }); }
      inst.i++; inst.next += inst.stepDur;
    }
  }
  function nextBoundary(inst, unit) { // the next beat (4 steps) or bar (16 steps) after now
    const now = ac.currentTime + 0.05, len = inst.stepDur * (unit === 'bar' ? 16 : 4); return inst.t0 + Math.ceil((now - inst.t0) / len) * len;
  }
  function tick() {
    if (!ac || ac.state !== 'running') return; const now = ac.currentTime;
    if (nxt && now >= nxt.t0 - 0.02) { if (cur) { cur.g.gain.cancelScheduledValues(nxt.t0); cur.g.gain.setValueAtTime(cur.g.gain.value, nxt.t0); cur.g.gain.linearRampToValueAtTime(0.0001, nxt.t0 + nxt.fade); cur.stopAt = nxt.t0 + nxt.fade + 0.1; cur.old = true; olds.push(cur); } cur = nxt; nxt = null; }
    if (cur) { run(cur, now); applyTargets(cur, st, now); }
    if (nxt) { run(nxt, now); applyTargets(nxt, st, now); }
    for (let k = olds.length - 1; k >= 0; k--) { const o = olds[k]; run(o, now); if (now > o.stopAt + 3) { o.g.disconnect(); olds.splice(k, 1); } }
  }
  const olds = [];

  // ---- public ---------------------------------------------------------------------------------------------------
  M.attach = function (audio, getTune) {
    if (ac) return; ac = audio.ac; out = audio.out; T = getTune || T;
    mix = ac.createGain(); mix.gain.value = mg(); duck = ac.createGain(); lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 16000; lp.Q.value = 0.5;
    fx = ac.createGain(); fx.gain.value = fg(); an = ac.createAnalyser(); an.fftSize = 1024;
    lp.connect(duck).connect(mix); mix.connect(out); fx.connect(out); out.connect(an); // the meter listens after the master volume and mute
    const len = ac.sampleRate; noiseBuf = ac.createBuffer(1, len, ac.sampleRate); const ch = noiseBuf.getChannelData(0); for (let i = 0; i < len; i++) ch[i] = hash(i * 0.37) * 2 - 1;
    timer = setInterval(tick, 30); if (wanted) M.set(wanted); addEventListener('tune', () => { mix.gain.value = mg(); fx.gain.value = fg(); });
  };
  M.set = function (s) { // called every frame; acts only when something changed
    wanted = s; if (!ac) return; const key = JSON.stringify(s); if (key === last) return; const prevBed = last ? JSON.parse(last).bed : null; last = key; st = s;
    const now = ac.currentTime, [f, g] = filterFor(s); lp.frequency.setTargetAtTime(f, now, 0.18); duck.gain.setTargetAtTime(g, now, 0.2);
    if (s.bed !== prevBed || (s.bed && !cur && !nxt)) M.bed(s.bed, s.quick ? 'now' : 'bar');
  };
  M.bed = function (name, mode) { // crossfade to a bed (null = silence)
    if (!ac) return; const now = ac.currentTime;
    if (nxt) { nxt.g.disconnect(); nxt = null; }
    if (!name) { if (cur) { cur.g.gain.cancelScheduledValues(now); cur.g.gain.setValueAtTime(cur.g.gain.value, now); cur.g.gain.linearRampToValueAtTime(0.0001, now + 0.4); cur.stopAt = now + 0.5; olds.push(cur); cur = null; } return; }
    if (cur && cur.name === name) return;
    let at = now + 0.05, fade = 0.45; if (cur && mode === 'bar') { at = nextBoundary(cur, 'bar'); if (at - now > 4) at = nextBoundary(cur, 'beat'); fade = 1.3; } else if (cur) fade = 0.6;
    nxt = makeInst(name, at, fade); nxt.fade = fade; if (!cur) { nxt.t0 = now + 0.05; nxt.next = nxt.t0; }
  };
  M.stinger = function (name, quant) { // a one-shot hit, on the beat or bar if asked
    if (!ac || ac.state !== 'running') return; let t = ac.currentTime + 0.02; if (quant && cur) t = nextBoundary(cur, quant); const d = fx;
    const S = {
      start: () => { glide(d, 'sawtooth', 180, 900, t, 0.3, 0.12); noise(d, t + 0.28, 0.35, 0.3, 'highpass', 3000); kick(d, t + 0.28, 0.6); bell(d, t + 0.3, 81, 0.12, 1); },
      boss: () => { sub(d, t, 28, 1.6, 0.5); noise(d, t, 1.2, 0.28, 'lowpass', 400); brass(d, t + 0.05, [45, 52, 57], 1.1, 0.26); crunch(d, t, 33, 1.0, 0.28); crunch(d, t + 0.02, 34, 0.5, 0.18); clap(d, t, 0.3); [0.5, 0.62, 0.74, 0.84, 0.92].forEach((x, i) => tom(d, t + x, 45 - i, 0.34)); tom(d, t + 1.0, 33, 0.55); },
      bossDown: () => { [57, 61, 64, 69, 73].forEach((m, i) => bell(d, t + i * 0.07, m + 12, 0.16, 1.6)); noise(d, t, 1.2, 0.18, 'highpass', 5000); pad(d, t, [57, 61, 64], 2, 0.25, 1500); },
      relic: () => { [0, 2, 4, 7].forEach((k, i) => bell(d, t + i * 0.08, PENT[3 + k % 7] + 12, 0.14, 1.2)); },
      gameover: () => { glide(d, 'sawtooth', 440, 55, t, 1.4, 0.18); pad(d, t + 0.3, [45, 48, 52], 3, 0.3, 500); sub(d, t + 0.2, 33, 2.4, 0.4); },
      newbest: () => { [0, 1, 2, 3, 4].forEach((k, i) => bell(d, t + 0.6 + i * 0.1, PENT[4 + k] + 12, 0.15, 1.3)); },
      good: () => { [0, 2, 4].forEach((k, i) => bell(d, t + i * 0.07, PENT[5 + k] + 12, 0.14, 1.1)); },
      bad: () => { glide(d, 'sawtooth', 300, 70, t, 0.7, 0.16); osc(d, 'square', mf(45), t, 0.5, 0.1); osc(d, 'square', mf(51), t, 0.5, 0.1); },
      revive: () => { kick(d, t, 0.6); kick(d, t + 0.28, 0.5); [57, 60, 64, 69].forEach((m, i) => bell(d, t + 0.8 + i * 0.09, m + 12, 0.15, 1.5)); },
    };
    if (S[name]) S[name]();
  };
  M.sfx = function (name) { // small interface sounds
    if (!ac || ac.state !== 'running') return; const t = ac.currentTime + 0.01, d = fx;
    const S = {
      click: () => osc(d, 'square', 1300, t, 0.05, 0.12), tick: () => osc(d, 'square', 2300, t, 0.018, 0.05), tab: () => { osc(d, 'triangle', 660, t, 0.08, 0.16); osc(d, 'triangle', 880, t + 0.06, 0.1, 0.16); },
      back: () => { osc(d, 'triangle', 700, t, 0.08, 0.16); osc(d, 'triangle', 500, t + 0.06, 0.12, 0.16); }, deny: () => { osc(d, 'sawtooth', 150, t, 0.16, 0.2); osc(d, 'square', 120, t + 0.05, 0.16, 0.12); },
      equip: () => { osc(d, 'sine', 180, t, 0.1, 0.35); pluck(d, t + 0.04, 76, 0.16, 0.2); }, unequip: () => { osc(d, 'sine', 160, t, 0.1, 0.3); pluck(d, t + 0.04, 64, 0.14, 0.2); },
      upgrade: () => { [0, 1, 2, 3].forEach((k, i) => pluck(d, t + i * 0.06, PENT[2 + k] + 12, 0.16, 0.25)); noise(d, t + 0.2, 0.12, 0.1, 'highpass', 6000); },
      buy: () => { bell(d, t, 88, 0.16, 0.9); bell(d, t + 0.09, 95, 0.16, 1.1); noise(d, t, 0.1, 0.12, 'highpass', 8000); },
      cash: () => { noise(d, t, 0.06, 0.2, 'bandpass', 4000, 2); bell(d, t + 0.05, 91, 0.18, 1); bell(d, t + 0.13, 95, 0.18, 1.2); bell(d, t + 0.22, 100, 0.16, 1.6); },
      gem: () => { [96, 100, 103].forEach((m, i) => bell(d, t + i * 0.06, m, 0.12, 1.2)); }, open: () => glide(d, 'sine', 300, 900, t, 0.18, 0.1),
      rebirth: () => { sub(d, t, 36, 0.9, 0.32); noise(d, t, 0.9, 0.22, 'highpass', 2500); glide(d, 'sine', 200, 1300, t, 0.85, 0.22); [88, 92, 95, 100].forEach((m, i) => bell(d, t + 0.12 + i * 0.1, m, 0.13, 1.7)); },
      killblow: () => { glide(d, 'sawtooth', 220, 38, t, 0.55, 0.3); noise(d, t, 0.4, 0.22, 'lowpass', 1100); [76, 83, 88].forEach((m, i) => bell(d, t + 0.06 + i * 0.06, m, 0.13, 1.5)); },
    };
    if (S[name]) S[name]();
  };
  M.finisher = function (minS, maxS) { // the build-up to a finishing blow: a rise that tightens into the blow, which lands on a beat of the music. Returns the seconds until the blow
    if (!ac || ac.state !== 'running') return minS; // no sound: the game still waits the minimum
    const now = ac.currentTime + 0.02, d = fx; let hit = now + minS, B = 0.5;
    if (cur) { B = cur.stepDur * 4; hit = cur.t0 + Math.ceil((now + minS - cur.t0) / B) * B; if (hit - now > maxS) hit = now + minS; }
    const T = hit - now;
    rise(d, now, T, 0.26); glide(d, 'sawtooth', 90, 900, now, T, 0.09); sub(d, now, 33, T, 0.16);
    const ticks = []; let tt = hit, gap = B / 4; while (tt - gap > now + 0.05) { tt -= gap; ticks.push(tt); const left = hit - tt; gap = left < B ? B / 4 : left < 2 * B ? B / 2 : B; } // pulses on the beat, then half beats, then quarter beats into the blow
    ticks.forEach(x => { const p = (x - now) / T; tom(d, x, 38 + 16 * p, 0.12 + 0.14 * p); });
    noise(d, hit, 0.5, 0.35, 'highpass', 4000); crunch(d, hit, 33, 1.0, 0.3); kick(d, hit, 0.8); sub(d, hit, 28, 1.3, 0.45); glide(d, 'sawtooth', 220, 38, hit, 0.55, 0.3); // the slash and the boom
    [76, 83, 88, 95].forEach((m, i) => bell(d, hit + 0.05 + i * 0.06, m, 0.14, 1.6));
    return T;
  };
  M.level = function () { // a measured loudness of everything music makes (for the tests)
    if (!an) return { rms: 0, peak: 0 }; const b = new Float32Array(an.fftSize); an.getFloatTimeDomainData(b); let sq = 0, pk = 0; for (const v of b) { sq += v * v; pk = Math.max(pk, Math.abs(v)); } return { rms: Math.sqrt(sq / b.length), peak: pk };
  };
  M.debug = function () { return { now: ac ? ac.currentTime : 0, t0: cur ? cur.t0 : 0, beat: cur ? cur.stepDur * 4 : 0, bed: cur && cur.name, next: nxt && nxt.name, notes, state: ac && ac.state, layers: cur ? Object.fromEntries(Object.entries(cur.lay).map(([k, v]) => [k, v.tgt])) : {}, filter: lp ? lp.frequency.value : 0 }; };
  M.prefs = function (music, sfx) { prefMusic = music !== false; prefSfx = sfx !== false; if (mix) { mix.gain.value = mg(); fx.gain.value = fg(); } };
  M.gains = () => ({ music: mix ? mix.gain.value : null, fx: fx ? fx.gain.value : null });
  M.suspend = () => { if (ac && ac.state === 'running') ac.suspend(); };
  M.resume = () => { if (ac && ac.state === 'suspended') ac.resume(); };
  return M;
})();
