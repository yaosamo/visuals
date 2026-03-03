const cardEntries = [
  {
    id: 'apple',
    layerClass: 'coverflow__card--layer-5',
    address: 'apple.com',
    eyebrow: 'Apple',
    title: 'iPhone 17 Pro',
    description: 'Titanium edges, new camera control, and a quieter landing page built around the product.',
    pageKicker: 'Product Story',
    pageTitle: 'A calmer product page built around hardware confidence.',
    pageDescription:
      'This fake page leans into large product messaging, simple navigation, and restrained supporting copy that lets the device carry the page.',
    stats: [
      ['Launch', 'September'],
      ['Focus', 'Camera control'],
      ['Tone', 'Quiet premium']
    ],
    sections: [
      {
        heading: 'Hero direction',
        body: 'Large headline, one supporting sentence, and enough empty space to make the product feel expensive before any deeper specification content appears.'
      },
      {
        heading: 'Page rhythm',
        body: 'Alternating product shots, feature callouts, and understated spec tables keep the story moving without feeling dense.'
      }
    ]
  },
  {
    id: 'x',
    layerClass: 'coverflow__card--layer-4',
    address: 'x.com',
    eyebrow: 'X',
    title: 'Live Pulse',
    description: 'Breaking posts, trending topics, and a fast-moving feed tuned for current conversation.',
    pageKicker: 'Social Feed',
    pageTitle: 'A live page that pushes speed over polish.',
    pageDescription:
      'This concept page foregrounds trends, live posts, and dense activity clusters so the experience feels immediate the moment it opens.',
    stats: [
      ['Refresh', 'Real-time'],
      ['Focus', 'Trends'],
      ['Density', 'High']
    ],
    sections: [
      {
        heading: 'Primary module',
        body: 'A compact stream of featured posts sits beside a large trending rail so users can jump between headlines and conversation quickly.'
      },
      {
        heading: 'Interaction model',
        body: 'Fast hover states, sticky side filters, and persistent composer entry points keep the page feeling active instead of editorial.'
      }
    ]
  },
  {
    id: 'threads',
    layerClass: 'coverflow__card--layer-3',
    address: 'threads.com',
    eyebrow: 'Threads',
    title: 'Design Notes',
    description: 'Short updates from studios and founders, arranged like a softer editorial social stream.',
    pageKicker: 'Editorial Social',
    pageTitle: 'A softer content page for design teams and founders.',
    pageDescription:
      'The fake destination page keeps the feed conversational while introducing more whitespace, more hierarchy, and a warmer editorial tone.',
    stats: [
      ['Format', 'Short notes'],
      ['Audience', 'Studios'],
      ['Mood', 'Warm']
    ],
    sections: [
      {
        heading: 'Content stack',
        body: 'Pinned notes, a featured thread, and a slower secondary stream give the page a more considered pace than a typical live feed.'
      },
      {
        heading: 'Visual language',
        body: 'Rounded modules, quieter separators, and softer contrast make the interface feel reflective rather than urgent.'
      }
    ]
  },
  {
    id: 'yaosamo',
    layerClass: 'coverflow__card--back',
    address: 'yaosamo.com',
    eyebrow: 'Yaosamo',
    title: 'Visual Experiments',
    description: 'Motion studies, interface sketches, and playful prototypes collected in one portfolio space.',
    pageKicker: 'Portfolio',
    pageTitle: 'A portfolio page for motion studies.',
    pageDescription:
      'This fake page presents experimental work as bold case-study blocks with quick context and image-first storytelling.',
    stats: [
      ['Type', 'Portfolio'],
      ['Content', 'Experiments'],
      ['Layout', 'Case-study']
    ],
    sections: [
      {
        heading: 'Featured work',
        body: 'Each experiment opens with a short rationale, one strong visual, and a compact note on what changed.'
      },
      {
        heading: 'Navigation',
        body: 'The page stays lightweight with one top nav, one filter rail, and a clear archive flow.'
      }
    ]
  },
  {
    id: 'claude',
    layerClass: 'coverflow__card--front',
    address: 'claude.ai',
    eyebrow: 'Claude',
    title: 'Team Workspace',
    description: 'Project knowledge, long-context chat, and writing workflows gathered into one calm assistant surface.',
    pageKicker: 'Workspace',
    pageTitle: 'A team workspace page built for context, drafts, and calm focus.',
    pageDescription:
      'The fake page emphasizes a focused chat column, lightweight document previews, and clear workspace states that feel calm rather than noisy.',
    stats: [
      ['Mode', 'Collaborative'],
      ['Focus', 'Long context'],
      ['Style', 'Calm']
    ],
    sections: [
      {
        heading: 'Main canvas',
        body: 'Conversation and document work sit side by side so a team can move from chat to draft to reference material without context switching.'
      },
      {
        heading: 'Supporting tools',
        body: 'Saved prompts, recent threads, and active projects stay visible but quiet so the center of the interface remains the work itself.'
      }
    ]
  }
];

function renderStat([label, value]) {
  return `
    <div class="coverflow__detail-stat">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderSection(section) {
  return `
    <section class="coverflow__detail-section">
      <h3>${section.heading}</h3>
      <p>${section.body}</p>
    </section>
  `;
}

function renderCard(entry) {
  return `
    <article class="coverflow__card ${entry.layerClass}" data-card-id="${entry.id}">
      <div class="coverflow__card-surface" tabindex="0" role="button" aria-expanded="false" aria-label="${entry.title}">
        <button class="coverflow__card-close" type="button" aria-label="Close page">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
        <div class="coverflow__card-controls" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="coverflow__card-address" aria-hidden="true">${entry.address}</div>
        <div class="coverflow__card-summary">
          <p class="coverflow__eyebrow">${entry.eyebrow}</p>
          <h1 class="coverflow__title">${entry.title}</h1>
          <p class="coverflow__description">${entry.description}</p>
        </div>
        <div class="coverflow__detail-content" aria-hidden="true">
          <section class="coverflow__detail-hero">
            <p class="coverflow__detail-kicker">${entry.pageKicker}</p>
            <h2>${entry.pageTitle}</h2>
            <p class="coverflow__detail-copy">${entry.pageDescription}</p>
          </section>
          <section class="coverflow__detail-stats">
            ${entry.stats.map(renderStat).join('')}
          </section>
          <section class="coverflow__detail-grid">
            ${entry.sections.map(renderSection).join('')}
          </section>
        </div>
      </div>
    </article>
  `;
}

export const verticalCoverFlowExperiment = {
  id: 'vertical-cover-flow',
  name: 'Vertical Cover Flow',
  stylePath: 'src/experiments/vertical-cover-flow/style.css',
  mount(root) {
    root.innerHTML = `
      <section class="coverflow-shell">
        <main class="coverflow" aria-label="Vertical cover flow experiment">
          ${cardEntries.map(renderCard).join('')}
        </main>
        <button class="coverflow__backdrop" type="button" aria-label="Close page"></button>
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
        </aside>
      </section>
    `;

    const shell = root.querySelector('.coverflow-shell');
    const coverflow = root.querySelector('.coverflow');
    const cards = [...root.querySelectorAll('.coverflow__card')];
    const panel = root.querySelector('.coverflow__spring-panel');
    const backdrop = root.querySelector('.coverflow__backdrop');
    const controls = [...root.querySelectorAll('[data-spring-var]')];
    const holdClasses = ['coverflow__card--hold-left', 'coverflow__card--hold-right'];
    const animateClasses = ['coverflow__card--animate-left', 'coverflow__card--animate-right'];
    let activeCard = null;
    let closeTimer = null;

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

    const syncExpandedState = () => {
      cards.forEach((card) => {
        const surface = card.querySelector('.coverflow__card-surface');
        const detailContent = card.querySelector('.coverflow__detail-content');
        const isActive = card === activeCard;
        surface?.setAttribute('aria-expanded', String(isActive));
        detailContent?.setAttribute('aria-hidden', String(!isActive));
      });
    };

    const clearCloseTimer = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    };

    const finishClose = (cardToReset) => {
      if (!cardToReset) return;
      cardToReset.classList.remove('is-active', 'is-floating');
      cardToReset.style.removeProperty('--open-left');
      cardToReset.style.removeProperty('--open-top');
      cardToReset.style.removeProperty('--open-width');
      cardToReset.style.removeProperty('--open-height');
      shell?.classList.remove('is-detail-open');
      activeCard = null;
      syncExpandedState();
      cardToReset.querySelector('.coverflow__card-surface')?.focus();
    };

    const openDetail = (card) => {
      if (!card || activeCard) return;

      const rect = card.getBoundingClientRect();
      card.style.setProperty('--open-left', `${rect.left}px`);
      card.style.setProperty('--open-top', `${rect.top}px`);
      card.style.setProperty('--open-width', `${rect.width}px`);
      card.style.setProperty('--open-height', `${rect.height}px`);
      card.classList.add('is-floating');
      activeCard = card;
      syncExpandedState();

      window.requestAnimationFrame(() => {
        shell?.classList.add('is-detail-open');
        card.classList.add('is-active');
        window.setTimeout(() => {
          card.querySelector('.coverflow__card-close')?.focus();
        }, 180);
      });
    };

    const closeDetail = () => {
      if (!activeCard) return;

      const cardToReset = activeCard;
      clearCloseTimer();
      cardToReset.classList.remove('is-active');
      closeTimer = window.setTimeout(() => {
        finishClose(cardToReset);
      }, 360);
    };

    controls.forEach(updateControlValue);

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
      if (card.dataset.hoverActive === 'true' || activeCard) {
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
      const surface = card.querySelector('.coverflow__card-surface');
      const closeButton = card.querySelector('.coverflow__card-close');
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

      const handleClick = (event) => {
        if (event.target instanceof Element && event.target.closest('.coverflow__card-close')) {
          return;
        }
        openDetail(card);
      };

      const handleKeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetail(card);
        }
      };

      const handleCloseClick = (event) => {
        event.stopPropagation();
        closeDetail();
      };

      surface?.addEventListener('mouseenter', handleEnter);
      surface?.addEventListener('mouseleave', handleLeave);
      surface?.addEventListener('click', handleClick);
      surface?.addEventListener('keydown', handleKeydown);
      closeButton?.addEventListener('click', handleCloseClick);
      card.addEventListener('animationend', handleAnimationEnd);

      return { card, surface, closeButton, handleEnter, handleLeave, handleClick, handleKeydown, handleCloseClick, handleAnimationEnd };
    });

    const controlListeners = controls.map((input) => {
      const handleInput = () => updateControlValue(input);
      input.addEventListener('input', handleInput);
      return { input, handleInput };
    });

    const handleBackdropClick = () => closeDetail();
    const handleTogglePanel = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        panel?.classList.toggle('is-visible');
        return;
      }

      if (event.key === 'Escape' && activeCard) {
        event.preventDefault();
        closeDetail();
      }
    };

    backdrop?.addEventListener('click', handleBackdropClick);
    window.addEventListener('keydown', handleTogglePanel);

    return () => {
      clearCloseTimer();
      listeners.forEach(({ card, surface, closeButton, handleEnter, handleLeave, handleClick, handleKeydown, handleCloseClick, handleAnimationEnd }) => {
        cancelPendingSettle(card);
        surface?.removeEventListener('mouseenter', handleEnter);
        surface?.removeEventListener('mouseleave', handleLeave);
        surface?.removeEventListener('click', handleClick);
        surface?.removeEventListener('keydown', handleKeydown);
        closeButton?.removeEventListener('click', handleCloseClick);
        card.removeEventListener('animationend', handleAnimationEnd);
      });
      controlListeners.forEach(({ input, handleInput }) => {
        input.removeEventListener('input', handleInput);
      });
      backdrop?.removeEventListener('click', handleBackdropClick);
      window.removeEventListener('keydown', handleTogglePanel);
    };
  }
};
