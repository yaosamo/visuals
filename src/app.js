const app = document.querySelector('#app');

app.innerHTML = `
  <section class="hud">
    <div class="starfield" id="stars"></div>
    <div class="layout">
      <aside class="left">
        <div class="headline">SAT DATA</div>
        <div class="block" id="telemetry"></div>
        <div>
          <div class="controls"><b>TRACK</b><b>ENGAGE</b><b>LINK</b></div>
          <div class="block">
            <div class="metric"><span>VEL</span><span id="vel">4.03 KM/S</span></div>
            <div class="metric"><span>ACC</span><span id="acc">0.24 M/S/S</span></div>
            <div class="metric"><span>DIST</span><span id="dist">29639.5 KM</span></div>
          </div>
        </div>
        <div class="orbit-status">ORBIT STATUS: <em>SAFE</em></div>
      </aside>
      <section class="main">
        <div class="topline"><span>S04 AUTO</span><span>SATELLITE CBK 01</span></div>
        <div class="readout">
          <span id="lecp">LECP:47</span>
          <span id="crs">CRS:287</span>
          <span id="mag">MAG:784</span>
        </div>
        <div class="canvas">
          <svg class="grid" viewBox="0 0 1000 360" preserveAspectRatio="none">
            <line x1="72" y1="0" x2="72" y2="360" stroke="rgba(91,217,255,.45)" stroke-width="2" />
            <line x1="72" y1="0" x2="84" y2="0" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="40" x2="84" y2="40" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="80" x2="84" y2="80" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="120" x2="84" y2="120" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="160" x2="84" y2="160" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="200" x2="84" y2="200" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="240" x2="84" y2="240" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="280" x2="84" y2="280" stroke="rgba(91,217,255,.45)" />
            <line x1="72" y1="320" x2="84" y2="320" stroke="rgba(91,217,255,.45)" />
          </svg>

          <svg class="globe" viewBox="0 0 980 760">
            <g fill="none" stroke="var(--hud-cyan)" stroke-width="2.4" opacity="0.95">
              <path d="M30,690 C140,530 250,420 400,320 C560,214 740,140 960,80" />
              <path d="M95,760 C210,560 300,440 460,330 C620,220 790,148 980,90" />
              <path d="M170,760 C250,610 360,460 530,348 C675,252 840,182 980,130" />
              <path d="M250,760 C320,625 430,500 570,390 C718,280 870,215 980,175" />
              <path d="M340,760 C410,642 500,534 620,438 C760,326 900,260 980,230" />
              <path d="M430,760 C500,674 580,590 680,516 C810,418 920,360 980,336" />
            </g>
            <g fill="none" stroke="var(--hud-cyan-dim)" stroke-width="2">
              <path d="M200,760 C280,620 380,510 520,400 C680,276 860,196 980,150" />
              <path d="M120,760 C200,590 320,462 470,350 C620,240 820,158 980,110" />
            </g>
            <g fill="none" stroke="var(--hud-orange)" stroke-width="3.2" opacity="0.88">
              <path d="M640,160 L870,110 L915,138 L748,188" />
              <path d="M615,215 L790,205 L700,278 L540,290 L520,238" />
              <path d="M534,282 L556,313 L575,388 L565,476 L540,575 L500,665 L470,738" />
              <path d="M905,375 L940,460 L968,545 L980,620" />
            </g>
          </svg>

          <svg class="path" viewBox="0 0 1000 360" preserveAspectRatio="none">
            <path class="orbit-dash" d="M175,210 C260,145 350,120 430,134 C550,155 630,220 790,300" />
            <path d="M170,212 C200,168 225,142 260,124" stroke="var(--hud-orange)" stroke-width="3" fill="none"/>
            <circle class="target" id="sat-0" cx="265" cy="120" r="7" />
            <circle class="target" id="sat-1" cx="276" cy="123" r="7" />
            <circle class="target" id="sat-2" cx="287" cy="126" r="7" />
            <path d="M140,130 C220,160 250,210 300,250" stroke="var(--hud-orange)" stroke-width="2.5" fill="none" stroke-dasharray="3 10"/>
          </svg>
        </div>
        <div class="bottomline"><span>ORBIT FEED</span><span>AOS 17.08</span></div>
      </section>
    </div>
  </section>
`;

const stars = document.querySelector('#stars');
for (let i = 0; i < 90; i += 1) {
  const star = document.createElement('span');
  star.className = 'star';
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.animationDelay = `${Math.random() * 4}s`;
  stars.appendChild(star);
}

const telemetryRows = [
  ['LATITUDE', '44.55N'],
  ['LONGITUDE', '135.30W'],
  ['ORBIT', '13096'],
  ['ALTITUDE', '814'],
  ['RANGE', '6285'],
  ['MAX RANGE', '9463'],
  ['PATH LOSS', '--'],
  ['AOS', '17.08']
];

const telemetry = document.querySelector('#telemetry');
telemetry.innerHTML = telemetryRows.map(([k, v]) => `<div class="metric"><span>${k}:</span><span>${v}</span></div>`).join('');

const els = {
  vel: document.querySelector('#vel'),
  acc: document.querySelector('#acc'),
  dist: document.querySelector('#dist'),
  lecp: document.querySelector('#lecp'),
  crs: document.querySelector('#crs'),
  mag: document.querySelector('#mag')
};

setInterval(() => {
  const vel = (3.8 + Math.random() * 0.45).toFixed(2);
  const acc = (0.15 + Math.random() * 0.21).toFixed(2);
  const dist = (29200 + Math.random() * 680).toFixed(1);
  els.vel.textContent = `${vel} KM/S`;
  els.acc.textContent = `${acc} M/S/S`;
  els.dist.textContent = `${dist} KM`;
  els.lecp.textContent = `LECP:${44 + Math.floor(Math.random() * 10)}`;
  els.crs.textContent = `CRS:${280 + Math.floor(Math.random() * 20)}`;
  els.mag.textContent = `MAG:${760 + Math.floor(Math.random() * 45)}`;
}, 900);
