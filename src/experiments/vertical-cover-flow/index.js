export const verticalCoverFlowExperiment = {
  id: 'vertical-cover-flow',
  name: 'Vertical Cover Flow',
  stylePath: 'src/experiments/vertical-cover-flow/style.css',
  mount(root) {
    root.innerHTML = `
      <main class="coverflow" aria-label="Vertical cover flow experiment">
        <article class="coverflow__card coverflow__card--layer-5" aria-hidden="true">
          <div class="coverflow__card-surface">
            <div class="coverflow__card-controls" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="coverflow__card-address" aria-hidden="true">apple.com</div>
            <p class="coverflow__eyebrow">Apple</p>
            <h1 class="coverflow__title">iPhone 17 Pro</h1>
            <p class="coverflow__description">Titanium edges, new camera control, and a quieter landing page built around the product.</p>
          </div>
        </article>
        <article class="coverflow__card coverflow__card--layer-4" aria-hidden="true">
          <div class="coverflow__card-surface">
            <div class="coverflow__card-controls" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="coverflow__card-address" aria-hidden="true">x.com</div>
            <p class="coverflow__eyebrow">X</p>
            <h1 class="coverflow__title">Live Pulse</h1>
            <p class="coverflow__description">Breaking posts, trending topics, and a fast-moving feed tuned for current conversation.</p>
          </div>
        </article>
        <article class="coverflow__card coverflow__card--layer-3" aria-hidden="true">
          <div class="coverflow__card-surface">
            <div class="coverflow__card-controls" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="coverflow__card-address" aria-hidden="true">threads.com</div>
            <p class="coverflow__eyebrow">Threads</p>
            <h1 class="coverflow__title">Design Notes</h1>
            <p class="coverflow__description">Short updates from studios and founders, arranged like a softer editorial social stream.</p>
          </div>
        </article>
        <article class="coverflow__card coverflow__card--back" aria-hidden="true">
          <div class="coverflow__card-surface">
            <div class="coverflow__card-controls" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="coverflow__card-address" aria-hidden="true">yaosamo.com</div>
            <p class="coverflow__eyebrow">Yaosamo</p>
            <h1 class="coverflow__title">Visual Experiments</h1>
            <p class="coverflow__description">Motion studies, interface sketches, and playful prototypes collected in one portfolio space.</p>
          </div>
        </article>
        <article class="coverflow__card coverflow__card--front">
          <div class="coverflow__card-surface">
            <div class="coverflow__card-controls" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="coverflow__card-address" aria-hidden="true">claude.ai</div>
            <p class="coverflow__eyebrow">Claude</p>
            <h1 class="coverflow__title">Team Workspace</h1>
            <p class="coverflow__description">Project knowledge, long-context chat, and writing workflows gathered into one calm assistant surface.</p>
          </div>
        </article>
      </main>
      <aside class="coverflow__spring-panel" aria-hidden="true">
        <p class="coverflow__spring-label">Animation Controls (Test)</p>
        <label class="coverflow__spring-control">
          <span>Cards Spread</span>
          <input data-spring-var="--stack-spread" data-unit="px" type="range" min="16" max="300" step="4" value="32" />
          <output>32px</output>
        </label>
        <label class="coverflow__spring-control">
          <span>Rise</span>
          <input data-spring-var="--spring-rise-duration" data-unit="ms" type="range" min="140" max="520" step="10" value="520" />
          <output>520ms</output>
        </label>
        <label class="coverflow__spring-control">
          <span>Settle</span>
          <input data-spring-var="--spring-settle-duration" data-unit="ms" type="range" min="120" max="360" step="10" value="360" />
          <output>360ms</output>
        </label>
        <label class="coverflow__spring-control">
          <span>Lift</span>
          <input data-spring-var="--spring-lift" data-unit="em" type="range" min="0.4" max="1.6" step="0.05" value="0.4" />
          <output>0.4em</output>
        </label>
        <label class="coverflow__spring-control">
          <span>Overshoot</span>
          <input data-spring-var="--spring-overshoot-lift" data-unit="em" type="range" min="0.6" max="1.8" step="0.05" value="1.4" />
          <output>1.4em</output>
        </label>
        <label class="coverflow__spring-control">
          <span>Tilt</span>
          <input data-spring-var="--spring-rotate" data-unit="deg" type="range" min="0.6" max="3" step="0.05" value="0.6" />
          <output>0.6deg</output>
        </label>
        <label class="coverflow__spring-control">
          <span>Overshoot Tilt</span>
          <input data-spring-var="--spring-overshoot-rotate" data-unit="deg" type="range" min="0.8" max="3.6" step="0.05" value="2" />
          <output>2deg</output>
        </label>
        <label class="coverflow__spring-toggle">
          <span>Perspective</span>
          <input data-toggle="perspective" type="checkbox" checked />
        </label>
      </aside>
    `;

    const coverflow = root.querySelector('.coverflow');
    const cards = [...root.querySelectorAll('.coverflow__card')];
    const panel = root.querySelector('.coverflow__spring-panel');
    const controls = [...root.querySelectorAll('[data-spring-var]')];
    const toggles = [...root.querySelectorAll('[data-toggle]')];
    const holdClasses = ['coverflow__card--hold-left', 'coverflow__card--hold-right'];
    const animateClasses = ['coverflow__card--animate-left', 'coverflow__card--animate-right'];

    const updateControlValue = (input) => {
      const unit = input.dataset.unit ?? '';
      const value = `${input.value}${unit}`;
      coverflow?.style.setProperty(input.dataset.springVar, value);
      const output = input.parentElement?.querySelector('output');
      if (output) {
        output.value = value;
        output.textContent = value;
      }
    };

    controls.forEach(updateControlValue);

    const updateToggleValue = (input) => {
      if (!coverflow) {
        return;
      }

      if (input.dataset.toggle === 'perspective') {
        coverflow.classList.toggle('coverflow--flat', !input.checked);
      }
    };

    toggles.forEach(updateToggleValue);

    const cancelPendingSettle = (card) => {
      if (card._settleFrameA) {
        window.cancelAnimationFrame(card._settleFrameA);
        card._settleFrameA = null;
      }
      if (card._settleFrameB) {
        window.cancelAnimationFrame(card._settleFrameB);
        card._settleFrameB = null;
      }
    };

    const settleFromHoverPose = (card) => {
      const holdClass = card.dataset.hoverHoldClass;
      if (!holdClass) {
        return;
      }

      cancelPendingSettle(card);
      card.classList.add(holdClass);
      card._settleFrameA = window.requestAnimationFrame(() => {
        card._settleFrameB = window.requestAnimationFrame(() => {
          if (card.dataset.hoverActive !== 'true' && card.dataset.hoverHoldClass === holdClass) {
            card.classList.remove(holdClass);
          }
        });
      });
    };

    const playRandomHoverTilt = (card) => {
      if (card.dataset.hoverActive === 'true') {
        return;
      }

      const holdClass = holdClasses[Math.floor(Math.random() * holdClasses.length)];
      const animateClass = holdClass.replace('--hold-', '--animate-');

      cancelPendingSettle(card);
      card.dataset.hoverActive = 'true';
      card.dataset.hoverHoldClass = holdClass;
      card.classList.remove(...holdClasses, ...animateClasses);
      void card.offsetWidth;
      card.classList.add(animateClass);
    };

    const listeners = cards.map((card) => {
      const handleEnter = () => playRandomHoverTilt(card);
      const handleAnimationEnd = () => {
        card.classList.remove(...animateClasses);

        if (card.dataset.hoverActive === 'true' && card.dataset.hoverHoldClass) {
          card.classList.add(card.dataset.hoverHoldClass);
          return;
        }

        if (card.dataset.hoverHoldClass) {
          settleFromHoverPose(card);
        }
      };

      const handleLeave = () => {
        card.dataset.hoverActive = 'false';
        if (
          !card.classList.contains('coverflow__card--animate-left') &&
          !card.classList.contains('coverflow__card--animate-right') &&
          card.dataset.hoverHoldClass
        ) {
          card.classList.remove(card.dataset.hoverHoldClass);
        }
      };

      card.addEventListener('mouseenter', handleEnter);
      card.addEventListener('mouseleave', handleLeave);
      card.addEventListener('animationend', handleAnimationEnd);

      return { card, handleEnter, handleLeave, handleAnimationEnd };
    });

    const controlListeners = controls.map((input) => {
      const handleInput = () => updateControlValue(input);
      input.addEventListener('input', handleInput);
      return { input, handleInput };
    });

    const toggleListeners = toggles.map((input) => {
      const handleChange = () => updateToggleValue(input);
      input.addEventListener('change', handleChange);
      return { input, handleChange };
    });

    const handleTogglePanel = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        panel?.classList.toggle('is-visible');
      }
    };

    window.addEventListener('keydown', handleTogglePanel);

    return () => {
      listeners.forEach(({ card, handleEnter, handleLeave, handleAnimationEnd }) => {
        cancelPendingSettle(card);
        card.removeEventListener('mouseenter', handleEnter);
        card.removeEventListener('mouseleave', handleLeave);
        card.removeEventListener('animationend', handleAnimationEnd);
      });
      controlListeners.forEach(({ input, handleInput }) => {
        input.removeEventListener('input', handleInput);
      });
      toggleListeners.forEach(({ input, handleChange }) => {
        input.removeEventListener('change', handleChange);
      });
      window.removeEventListener('keydown', handleTogglePanel);
    };
  }
};
