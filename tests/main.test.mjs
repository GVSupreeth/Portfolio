import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = join(root, 'assets/js/main.js');

async function loadMain() {
  assert.ok(existsSync(modulePath), 'main module must exist');
  return import(pathToFileURL(modulePath));
}

function interactiveElement(initialAttributes = {}) {
  const attributes = new Map(Object.entries(initialAttributes));
  const listeners = new Map();
  const classes = new Set();

  return {
    attributes,
    classList: {
      add(value) {
        classes.add(value);
      },
      remove(value) {
        classes.delete(value);
      },
      contains(value) {
        return classes.has(value);
      },
    },
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
    dispatch(type, event = {}) {
      listeners.get(type)?.(event);
    },
    getAttribute(name) {
      return attributes.get(name) ?? null;
    },
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
  };
}

test('main module imports without a browser document', async () => {
  const originalDocument = globalThis.document;
  try {
    delete globalThis.document;
    const module = await loadMain();
    assert.equal(typeof module.initPage, 'function');
  } finally {
    if (originalDocument) globalThis.document = originalDocument;
  }
});

test('scroll progress handles empty, negative, and overflow ranges', async () => {
  const { calculateScrollProgress } = await loadMain();

  assert.equal(calculateScrollProgress(10, 100, 100), 0);
  assert.equal(calculateScrollProgress(-50, 1000, 500), 0);
  assert.equal(calculateScrollProgress(250, 1000, 500), 50);
  assert.equal(calculateScrollProgress(900, 1000, 500), 100);
});

test('active section selection chooses the latest section above the offset', async () => {
  const { selectActiveSection } = await loadMain();

  assert.equal(selectActiveSection([], 200), null);
  assert.equal(
    selectActiveSection(
      [
        { id: 'experience', top: 300 },
        { id: 'projects', top: 900 },
        { id: 'stack', top: 1400 },
      ],
      1100,
    ),
    'projects',
  );
  assert.equal(
    selectActiveSection([{ id: 'experience', top: 300 }], 100),
    null,
  );
});

test('mobile navigation keeps aria-expanded and visible state synchronized', async () => {
  const { initMobileNavigation } = await loadMain();
  const toggle = interactiveElement({ 'aria-expanded': 'false' });
  const nav = interactiveElement();
  const link = interactiveElement();
  const documentListeners = new Map();
  const doc = {
    querySelector(selector) {
      if (selector === '#nav-toggle') return toggle;
      if (selector === '#primary-nav') return nav;
      return null;
    },
    querySelectorAll(selector) {
      return selector === '#primary-nav a' ? [link] : [];
    },
    addEventListener(type, listener) {
      documentListeners.set(type, listener);
    },
  };

  initMobileNavigation(doc);
  toggle.dispatch('click');
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.ok(nav.classList.contains('nav-open'));

  link.dispatch('click');
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.ok(!nav.classList.contains('nav-open'));

  toggle.dispatch('click');
  documentListeners.get('keydown')?.({ key: 'Escape' });
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
});

test('reveal enhancement exposes all content when IntersectionObserver is unavailable', async () => {
  const { initReveal } = await loadMain();
  const first = interactiveElement();
  const second = interactiveElement();
  const doc = { querySelectorAll: () => [first, second] };

  initReveal(doc, {});

  assert.ok(first.classList.contains('is-visible'));
  assert.ok(second.classList.contains('is-visible'));
});

test('reduced motion preference is read from the supplied window', async () => {
  const { prefersReducedMotion } = await loadMain();

  assert.equal(
    prefersReducedMotion({ matchMedia: (query) => ({ matches: query.includes('reduce') }) }),
    true,
  );
  assert.equal(prefersReducedMotion({}), false);
});

test('project disclosure labels describe the next action', async () => {
  const { initDetailsLabels } = await loadMain();
  const label = { textContent: 'View architecture' };
  const details = interactiveElement();
  details.open = false;
  details.querySelector = () => label;
  const doc = { querySelectorAll: () => [details] };

  initDetailsLabels(doc);
  details.open = true;
  details.dispatch('toggle');
  assert.equal(label.textContent, 'Hide architecture');

  details.open = false;
  details.dispatch('toggle');
  assert.equal(label.textContent, 'View architecture');
});

test('print lifecycle expands disclosures and restores their previous state', async () => {
  const { initPrintDetails } = await loadMain();
  const first = { open: false };
  const second = { open: true };
  const listeners = new Map();
  const doc = { querySelectorAll: () => [first, second] };
  const win = {
    addEventListener(type, listener) {
      listeners.set(type, listener);
    },
  };

  initPrintDetails(doc, win);
  listeners.get('beforeprint')();
  assert.equal(first.open, true);
  assert.equal(second.open, true);

  listeners.get('afterprint')();
  assert.equal(first.open, false);
  assert.equal(second.open, true);
});
