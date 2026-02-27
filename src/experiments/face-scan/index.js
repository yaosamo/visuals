export const faceScanExperiment = {
  id: 'face-scan',
  name: 'Face Scan',
  stylePath: 'src/experiments/face-scan/style.css',
  mount(root) {
    const app = root;

    app.innerHTML = `
  <main class="scan-screen" aria-label="Face scan visual experiment">
    <canvas id="scan-canvas"></canvas>
    <div class="scan-center" id="scan-center">0%</div>
    <section class="test-controls" id="test-controls" aria-label="Animation Controls (Test)">
      <h2>Animation Controls (Test)</h2>
      <label>
        Line Count
        <input id="ctrl-line-count" type="range" min="60" max="360" step="1" value="76" />
        <span id="ctrl-line-count-value">76</span>
      </label>
      <label>
        Max Outward Extend
        <input id="ctrl-max-outward" type="range" min="40" max="520" step="1" value="54" />
        <span id="ctrl-max-outward-value">54px</span>
      </label>
      <label>
        Angle Influence
        <input id="ctrl-angle-influence" type="range" min="0.10" max="1.20" step="0.01" value="0.37" />
        <span id="ctrl-angle-influence-value">0.37</span>
      </label>
      <label>
        Distance Sensitivity
        <input id="ctrl-radial-sense" type="range" min="0.20" max="1.80" step="0.01" value="0.20" />
        <span id="ctrl-radial-sense-value">0.20</span>
      </label>
      <label>
        Bounce Strength
        <input id="ctrl-bounce-strength" type="range" min="0.00" max="1.80" step="0.01" value="1.80" />
        <span id="ctrl-bounce-strength-value">1.80</span>
      </label>
      <label>
        Bounce Length
        <input id="ctrl-bounce-length" type="range" min="120" max="1200" step="10" value="1200" />
        <span id="ctrl-bounce-length-value">1200ms</span>
      </label>
      <label>
        Scanned Size
        <input id="ctrl-scanned-size" type="range" min="0.00" max="1.20" step="0.01" value="1.20" />
        <span id="ctrl-scanned-size-value">1.20</span>
      </label>
    </section>
  </main>
`;

const canvas = document.querySelector('#scan-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
const centerText = document.querySelector('#scan-center');
const controls = {
  panel: document.querySelector('#test-controls'),
  lineCount: document.querySelector('#ctrl-line-count'),
  lineCountValue: document.querySelector('#ctrl-line-count-value'),
  maxOutward: document.querySelector('#ctrl-max-outward'),
  maxOutwardValue: document.querySelector('#ctrl-max-outward-value'),
  angleInfluence: document.querySelector('#ctrl-angle-influence'),
  angleInfluenceValue: document.querySelector('#ctrl-angle-influence-value'),
  radialSense: document.querySelector('#ctrl-radial-sense'),
  radialSenseValue: document.querySelector('#ctrl-radial-sense-value'),
  bounceStrength: document.querySelector('#ctrl-bounce-strength'),
  bounceStrengthValue: document.querySelector('#ctrl-bounce-strength-value'),
  bounceLength: document.querySelector('#ctrl-bounce-length'),
  bounceLengthValue: document.querySelector('#ctrl-bounce-length-value'),
  scannedSize: document.querySelector('#ctrl-scanned-size'),
  scannedSizeValue: document.querySelector('#ctrl-scanned-size-value')
};

const TAU = Math.PI * 2;
const STORAGE_KEY = 'visual-experiment.scan-controls.v1';
let visitedBins = [];
let scanPulse = [];

const state = {
  width: 0,
  height: 0,
  cx: 0,
  cy: 0,
  ringRadius: 0,
  baseLen: 0,
  hoverBoost: 0,
  pointerInside: false,
  pointerActive: false,
  pointerX: 0,
  pointerY: 0,
  lastScanAngle: null,
  lastPulseBin: -1,
  progress: 0,
  completed: false,
  tuning: {
    dashCount: 76,
    maxOutwardPx: 54,
    influenceAngle: 0.37,
    radialSense: 0.2,
    bounceStrength: 1.8,
    bounceLengthMs: 1200,
    scannedSizeBoost: 1.2
  }
};

function loadTuningFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;

    const next = { ...state.tuning };
    if (Number.isFinite(Number(parsed.dashCount))) next.dashCount = Math.round(Number(parsed.dashCount));
    if (Number.isFinite(Number(parsed.maxOutwardPx))) next.maxOutwardPx = Number(parsed.maxOutwardPx);
    if (Number.isFinite(Number(parsed.influenceAngle))) next.influenceAngle = Number(parsed.influenceAngle);
    if (Number.isFinite(Number(parsed.radialSense))) next.radialSense = Number(parsed.radialSense);
    if (Number.isFinite(Number(parsed.bounceStrength))) next.bounceStrength = Number(parsed.bounceStrength);
    if (Number.isFinite(Number(parsed.bounceLengthMs))) next.bounceLengthMs = Number(parsed.bounceLengthMs);
    if (Number.isFinite(Number(parsed.scannedSizeBoost))) next.scannedSizeBoost = Number(parsed.scannedSizeBoost);
    state.tuning = next;
  } catch {
    // Ignore malformed storage payloads.
  }
}

function saveTuningToStorage() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tuning));
  } catch {
    // Ignore private mode / quota errors.
  }
}

function resetScanState(nextCount = state.tuning.dashCount) {
  const count = Math.max(24, Math.round(nextCount));
  state.tuning.dashCount = count;
  visitedBins = new Array(count).fill(false);
  scanPulse = new Array(count).fill(0);
  state.progress = 0;
  state.completed = false;
  state.lastScanAngle = null;
  state.lastPulseBin = -1;
  centerText.classList.remove('is-complete-bounce');
  centerText.textContent = '0%';
}

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.floor(w * dpr);
  canvas.height = Math.floor(h * dpr);
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  state.width = w;
  state.height = h;
  state.cx = w * 0.5;
  state.cy = h * 0.5;
  state.ringRadius = Math.min(w, h) * 0.33;
  state.baseLen = Math.max(7, state.ringRadius * 0.045);
  state.hoverBoost = state.baseLen * 1.4;
  if (!state.pointerInside) {
    state.pointerX = state.cx;
    state.pointerY = state.cy;
  }
}

function normalizeAngle(a) {
  let angle = a % TAU;
  if (angle < 0) angle += TAU;
  return angle;
}

function shortestAngleDelta(a, b) {
  const d = Math.abs(a - b) % TAU;
  return d > Math.PI ? TAU - d : d;
}

function updateProgressByPointer() {
  if (!state.pointerActive || state.completed) return;
  const dashCount = state.tuning.dashCount;
  const dx = state.pointerX - state.cx;
  const dy = state.pointerY - state.cy;
  const angle = normalizeAngle(Math.atan2(dy, dx));

  if (state.lastScanAngle == null) {
    const centerBin = Math.floor((angle / TAU) * dashCount) % dashCount;
    if (centerBin !== state.lastPulseBin) {
      scanPulse[centerBin] = 1;
      visitedBins[centerBin] = true;
      state.lastPulseBin = centerBin;
    }
    state.lastScanAngle = angle;
  } else {
    // Sweep all bins crossed between frames so fast cursor motion doesn't skip scan.
    const prev = state.lastScanAngle;
    let delta = angle - prev;
    if (delta > Math.PI) delta -= TAU;
    if (delta < -Math.PI) delta += TAU;

    const step = TAU / dashCount;
    const steps = Math.max(1, Math.ceil(Math.abs(delta) / step));
    for (let s = 1; s <= steps; s += 1) {
      const a = normalizeAngle(prev + (delta * s) / steps);
      const bin = Math.floor((a / TAU) * dashCount) % dashCount;
      if (bin !== state.lastPulseBin) {
        scanPulse[bin] = 1;
        visitedBins[bin] = true;
        state.lastPulseBin = bin;
      }
    }
    state.lastScanAngle = angle;
  }

  let hit = 0;
  for (let i = 0; i < dashCount; i += 1) {
    if (visitedBins[i]) hit += 1;
  }
  state.progress = hit / dashCount;
  if (state.progress >= 0.999) {
    const wasCompleted = state.completed;
    state.progress = 1;
    state.completed = true;
    if (!wasCompleted) {
      centerText.classList.remove('is-complete-bounce');
      // Restart animation reliably on repeated completions.
      void centerText.offsetWidth;
      centerText.classList.add('is-complete-bounce');
    }
  }
  centerText.textContent = `${Math.round(state.progress * 100)}%`;
}

function drawFrame() {
  updateProgressByPointer();
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, state.width, state.height);
  const dashCount = state.tuning.dashCount;

  const pointerDx = state.pointerX - state.cx;
  const pointerDy = state.pointerY - state.cy;
  const pointerRadius = Math.hypot(pointerDx, pointerDy);
  const pointerAngle = normalizeAngle(Math.atan2(state.pointerY - state.cy, state.pointerX - state.cx));
  const closestBin = Math.floor((pointerAngle / TAU) * dashCount) % dashCount;
  const influenceAngle = state.tuning.influenceAngle;
  const pulseDecay = Math.min(0.5, 16.67 / Math.max(60, state.tuning.bounceLengthMs));

  for (let i = 0; i < dashCount; i += 1) {
    const t = i / dashCount;
    const angle = t * TAU;
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const outerX = state.cx + ux * state.ringRadius;
    const outerY = state.cy + uy * state.ringRadius;

    const angBoost = state.pointerActive
      ? Math.max(0, 1 - shortestAngleDelta(angle, pointerAngle) / influenceAngle)
      : 0;
    const hover = angBoost;
    const radialDistance = Math.abs(pointerRadius - state.ringRadius);
    const radialFactor = state.pointerActive
      ? Math.max(0, 1 - radialDistance / (state.ringRadius * state.tuning.radialSense))
      : 0;
    const distScale = 0.35 + radialFactor * 1.15;
    const binDistance = Math.min(Math.abs(i - closestBin), dashCount - Math.abs(i - closestBin));
    const nearestBoost = state.pointerActive && binDistance === 0 ? 1.2 : 1;

    const scanned = state.completed || visitedBins[i];
    const pulse = scanPulse[i];
    // Light bounce pulse: starts with overshoot and settles quickly.
    const bounce = pulse > 0 ? Math.sin((1 - pulse) * Math.PI * 1.5) * pulse : 0;
    const boostLen = state.hoverBoost * hover * distScale * nearestBoost;
    const scannedLenBoost = scanned ? state.baseLen * state.tuning.scannedSizeBoost : 0;
    const dashLen = state.baseLen + scannedLenBoost + boostLen;
    const innerX = outerX - ux * dashLen;
    const innerY = outerY - uy * dashLen;
    const outwardToCursor = Math.max(0, pointerRadius - state.ringRadius);
    const pulseOutward = Math.max(0, bounce) * state.baseLen * state.tuning.bounceStrength;
    const outwardLenBase = state.pointerActive
      ? Math.min(state.tuning.maxOutwardPx, outwardToCursor) * hover
      : 0;
    const outwardLen = outwardLenBase + pulseOutward;
    const startX = outerX + ux * outwardLen;
    const startY = outerY + uy * outwardLen;

    const green = scanned ? 1 : hover;
    const gray = 190 - Math.round(80 * hover);
    const color = green > 0
      ? `rgba(85, 255, 145, ${0.32 + green * 0.68})`
      : `rgb(${gray}, ${gray}, ${gray})`;

    ctx.strokeStyle = color;
    const scannedWidthBoost = scanned ? 1.6 * state.tuning.scannedSizeBoost : 0;
    ctx.lineWidth = 1.6 + scannedWidthBoost + hover * 1.1 + Math.max(0, bounce) * (0.8 + state.tuning.bounceStrength * 0.7);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(innerX, innerY);
    ctx.stroke();

    if (scanPulse[i] > 0) {
      scanPulse[i] = Math.max(0, scanPulse[i] - pulseDecay);
    }
  }

  if (state.pointerActive || state.completed) {
    ctx.strokeStyle = state.completed ? 'rgba(85, 255, 145, 0.5)' : 'rgba(85, 255, 145, 0.24)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(state.cx, state.cy, state.ringRadius + state.baseLen * 0.7, 0, TAU);
    ctx.stroke();
  }

  requestAnimationFrame(drawFrame);
}

function bindTestControls() {
  const bind = (input, valueEl, formatter, onValue) => {
    if (!(input instanceof HTMLInputElement) || !(valueEl instanceof HTMLElement)) return;
    const sync = () => {
      const raw = Number(input.value);
      onValue(raw);
      valueEl.textContent = formatter(raw);
      saveTuningToStorage();
    };
    if (Number.isFinite(rawControlValue(input.id))) {
      input.value = String(rawControlValue(input.id));
    }
    input.addEventListener('input', sync);
    sync();
  };

  bind(controls.lineCount, controls.lineCountValue, (v) => String(Math.round(v)), (v) => {
    resetScanState(v);
  });
  bind(controls.maxOutward, controls.maxOutwardValue, (v) => `${Math.round(v)}px`, (v) => {
    state.tuning.maxOutwardPx = v;
  });
  bind(controls.angleInfluence, controls.angleInfluenceValue, (v) => v.toFixed(2), (v) => {
    state.tuning.influenceAngle = v;
  });
  bind(controls.radialSense, controls.radialSenseValue, (v) => v.toFixed(2), (v) => {
    state.tuning.radialSense = v;
  });
  bind(controls.bounceStrength, controls.bounceStrengthValue, (v) => v.toFixed(2), (v) => {
    state.tuning.bounceStrength = v;
  });
  bind(controls.bounceLength, controls.bounceLengthValue, (v) => `${Math.round(v)}ms`, (v) => {
    state.tuning.bounceLengthMs = v;
  });
  bind(controls.scannedSize, controls.scannedSizeValue, (v) => v.toFixed(2), (v) => {
    state.tuning.scannedSizeBoost = v;
  });
}

function rawControlValue(controlId) {
  switch (controlId) {
    case 'ctrl-line-count': return state.tuning.dashCount;
    case 'ctrl-max-outward': return state.tuning.maxOutwardPx;
    case 'ctrl-angle-influence': return state.tuning.influenceAngle;
    case 'ctrl-radial-sense': return state.tuning.radialSense;
    case 'ctrl-bounce-strength': return state.tuning.bounceStrength;
    case 'ctrl-bounce-length': return state.tuning.bounceLengthMs;
    case 'ctrl-scanned-size': return state.tuning.scannedSizeBoost;
    default: return NaN;
  }
}

window.addEventListener('resize', resize);
window.addEventListener('keydown', (event) => {
  const key = String(event.key || '').toLowerCase();
  if (key !== 'k') return;
  if (!(event.metaKey || event.ctrlKey)) return;
  event.preventDefault();
  if (controls.panel) controls.panel.classList.toggle('is-hidden');
});
canvas.addEventListener('pointerenter', (event) => {
  state.pointerInside = true;
  state.pointerActive = true;
  state.pointerX = event.clientX;
  state.pointerY = event.clientY;
});
canvas.addEventListener('pointerleave', () => {
  state.pointerInside = false;
});
canvas.addEventListener('pointermove', (event) => {
  state.pointerInside = true;
  state.pointerActive = true;
  state.pointerX = event.clientX;
  state.pointerY = event.clientY;
});
window.addEventListener('mousemove', (event) => {
  state.pointerActive = true;
  state.pointerX = event.clientX;
  state.pointerY = event.clientY;
});

loadTuningFromStorage();
bindTestControls();
resetScanState(state.tuning.dashCount);
resize();
drawFrame();
  }
};
