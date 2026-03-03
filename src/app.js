import { faceScanExperiment } from './experiments/face-scan/index.js';
import { verticalCoverFlowExperiment } from './experiments/vertical-cover-flow/index.js';

const app = document.querySelector('#app');
const EXPERIMENT_PARAM_KEYS = ['state', 'experiment', 'exp'];
let activeCleanup = null;

const experiments = [faceScanExperiment, verticalCoverFlowExperiment];
const experimentMap = new Map(experiments.map((exp) => [exp.id, exp]));
const normalizedExperimentMap = new Map(experiments.map((exp) => [normalizeExperimentToken(exp.id), exp.id]));

function normalizeExperimentToken(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^[^a-z0-9]+/, '')
    .replace(/[^a-z0-9]+/g, '');
}

function readRequestedExperimentId() {
  const params = new URLSearchParams(window.location.search);
  for (const key of EXPERIMENT_PARAM_KEYS) {
    const requested = params.get(key);
    if (requested && experimentMap.has(requested)) return requested;
    const normalized = normalizedExperimentMap.get(normalizeExperimentToken(requested));
    if (normalized) return normalized;
  }
  return null;
}

function selectedExperimentId() {
  return readRequestedExperimentId() || experiments[0].id;
}

function experimentUrl(id) {
  const url = new URL(window.location.href);
  url.searchParams.set('state', id);
  url.searchParams.delete('experiment');
  url.searchParams.delete('exp');
  return url;
}

function syncExperimentUrl(id, mode = 'replace') {
  const url = experimentUrl(id);
  const method = mode === 'push' ? 'pushState' : 'replaceState';
  window.history[method](null, '', url);
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
  const existing = document.querySelector('.exp-picker');
  if (existing) existing.remove();

  const picker = document.createElement('aside');
  picker.className = 'exp-picker';
  picker.innerHTML = `
    <div class="exp-picker__chrome" aria-hidden="true">
      <span class="exp-picker__label">Experiment</span>
      <div class="exp-picker__select-wrap">
        <span class="exp-picker__value"></span>
        <span class="exp-picker__chevron" aria-hidden="true"></span>
      </div>
    </div>
    <select id="exp-select" aria-label="Select experiment"></select>
  `;

  const select = picker.querySelector('#exp-select');
  const value = picker.querySelector('.exp-picker__value');

  for (const exp of experiments) {
    const option = document.createElement('option');
    option.value = exp.id;
    option.textContent = exp.name;
    if (exp.id === activeId) option.selected = true;
    select.appendChild(option);
  }

  const syncPickerValue = () => {
    const selected = select.selectedOptions[0];
    if (value) value.textContent = selected ? selected.textContent : '';
  };

  syncPickerValue();

  select.addEventListener('change', () => {
    syncPickerValue();
    const next = select.value;
    syncExperimentUrl(next, 'push');
    window.location.reload();
  });

  document.body.appendChild(picker);
}

function mountActiveExperiment() {
  if (typeof activeCleanup === 'function') {
    activeCleanup();
    activeCleanup = null;
  }

  const id = selectedExperimentId();
  const experiment = experimentMap.get(id) || experiments[0];
  syncExperimentUrl(experiment.id);
  ensureExperimentStyle(experiment.stylePath);
  app.innerHTML = '';
  activeCleanup = experiment.mount(app) || null;
  renderExperimentPicker(experiment.id);
}

mountActiveExperiment();
