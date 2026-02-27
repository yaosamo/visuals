import { faceScanExperiment } from './experiments/face-scan/index.js';

const app = document.querySelector('#app');

const experiments = [faceScanExperiment];
const experimentMap = new Map(experiments.map((exp) => [exp.id, exp]));

function selectedExperimentId() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get('exp');
  if (requested && experimentMap.has(requested)) return requested;
  return experiments[0].id;
}

function ensureExperimentStyle(stylePath) {
  const id = 'experiment-style';
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = stylePath;
  document.head.appendChild(link);
}

function renderExperimentPicker(activeId) {
  const picker = document.createElement('aside');
  picker.className = 'exp-picker';
  picker.innerHTML = `
    <label for="exp-select">Experiment</label>
    <select id="exp-select"></select>
  `;

  const select = picker.querySelector('#exp-select');
  for (const exp of experiments) {
    const option = document.createElement('option');
    option.value = exp.id;
    option.textContent = exp.name;
    if (exp.id === activeId) option.selected = true;
    select.appendChild(option);
  }

  select.addEventListener('change', () => {
    const next = select.value;
    const params = new URLSearchParams(window.location.search);
    params.set('exp', next);
    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.location.assign(nextUrl);
  });

  document.body.appendChild(picker);
}

function mountActiveExperiment() {
  const id = selectedExperimentId();
  const experiment = experimentMap.get(id) || experiments[0];
  ensureExperimentStyle(experiment.stylePath);
  app.innerHTML = '';
  experiment.mount(app);
  renderExperimentPicker(experiment.id);
}

mountActiveExperiment();
