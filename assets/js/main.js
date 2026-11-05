import { initTerminal } from './terminal.js';

export function prefersReducedMotion(win = globalThis.window) {
  return Boolean(win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

export function calculateScrollProgress(scrollTop, scrollHeight, clientHeight) {
  const available = Number(scrollHeight) - Number(clientHeight);
  if (!Number.isFinite(available) || available <= 0) return 0;

  const progress = (Number(scrollTop) / available) * 100;
  if (!Number.isFinite(progress)) return 0;
  return Math.min(100, Math.max(0, progress));
}

export function selectActiveSection(sections, offset) {
  if (!Array.isArray(sections) || sections.length === 0) return null;

  return sections.reduce((active, section) => {
    if (!section?.id || !Number.isFinite(section.top) || section.top > offset) {
      return active;
    }
    if (!active || section.top >= active.top) return section;
    return active;
  }, null)?.id ?? null;
}

export function initMobileNavigation(doc = globalThis.document) {
  const toggle = doc?.querySelector?.('#nav-toggle');
  const nav = doc?.querySelector?.('#primary-nav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList[open ? 'add' : 'remove']('nav-open');
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  doc.querySelectorAll('#primary-nav a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
}

export function initScrollProgress(doc = globalThis.document, win = globalThis.window) {
  const bar = doc?.querySelector?.('#scroll-progress-bar');
  const root = doc?.documentElement;
  if (!bar || !root || !win?.addEventListener) return;

  let queued = false;
  const update = () => {
    queued = false;
    const progress = calculateScrollProgress(
      root.scrollTop ?? win.scrollY ?? 0,
      root.scrollHeight,
      root.clientHeight,
    );
    bar.style.width = `${progress}%`;
  };

  const requestUpdate = () => {
    if (queued) return;
    queued = true;
    if (win.requestAnimationFrame) win.requestAnimationFrame(update);
    else update();
  };

  win.addEventListener('scroll', requestUpdate, { passive: true });
  win.addEventListener('resize', requestUpdate, { passive: true });
  update();
}

export function initActiveNavigation(doc = globalThis.document, win = globalThis.window) {
  const links = [...(doc?.querySelectorAll?.('#primary-nav a[href^="#"]') ?? [])];
  const sections = links
    .map((link) => {
      const target = link.getAttribute('href');
      const section = target ? doc.querySelector(target) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    sections.forEach(({ link, section }) => {
      if (section.id === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  if (win?.IntersectionObserver) {
    const visible = new Map();
    const observer = new win.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
          else visible.delete(entry.target.id);
        });

        const active = [...visible.entries()].sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0];
        if (active) setActive(active[0]);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 0.1, 0.5] },
    );

    sections.forEach(({ section }) => observer.observe(section));
    return;
  }

  const update = () => {
    const positions = sections.map(({ section }) => ({
      id: section.id,
      top: section.offsetTop,
    }));
    const active = selectActiveSection(positions, (win?.scrollY ?? 0) + 180);
    if (active) setActive(active);
  };

  win?.addEventListener?.('scroll', update, { passive: true });
  update();
}

export function initReveal(doc = globalThis.document, win = globalThis.window) {
  const elements = [...(doc?.querySelectorAll?.('[data-reveal]') ?? [])];
  if (!elements.length) return;

  if (prefersReducedMotion(win) || !win?.IntersectionObserver) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new win.IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  elements.forEach((element) => observer.observe(element));
}

export function initDetailsLabels(doc = globalThis.document) {
  const detailsElements = doc?.querySelectorAll?.('[data-project-details]') ?? [];

  detailsElements.forEach((details) => {
    const label = details.querySelector('summary > span:first-child');
    if (!label) return;

    const update = () => {
      label.textContent = details.open ? 'Hide architecture' : 'View architecture';
    };

    details.addEventListener('toggle', update);
    update();
  });
}

function navigateTo(target, doc, win) {
  const section = doc?.querySelector?.(target);
  if (!section) return;

  section.scrollIntoView({
    behavior: prefersReducedMotion(win) ? 'auto' : 'smooth',
    block: 'start',
  });
}

function downloadFile(url, doc) {
  if (!url || !doc?.createElement || !doc?.body) return;
  const anchor = doc.createElement('a');
  anchor.href = url;
  anchor.download = url.split('/').pop() ?? 'resume';
  anchor.hidden = true;
  doc.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export function initTerminalExperience(
  doc = globalThis.document,
  win = globalThis.window,
  terminalFactory = initTerminal,
) {
  const root = doc?.querySelector?.('#terminal');
  if (!root) return null;

  return terminalFactory(root, {
    onNavigate: (target) => navigateTo(target, doc, win),
    onOpen: (url) => downloadFile(url, doc),
  });
}

export function initPage(doc = globalThis.document, win = globalThis.window) {
  if (!doc) return;
  doc.documentElement?.classList?.add('js');
  initMobileNavigation(doc);
  initScrollProgress(doc, win);
  initActiveNavigation(doc, win);
  initReveal(doc, win);
  initDetailsLabels(doc);
  initTerminalExperience(doc, win);
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initPage(document, window), {
      once: true,
    });
  } else {
    initPage(document, window);
  }
}
