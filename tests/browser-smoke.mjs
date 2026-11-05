import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const previewUrl = process.env.PORTFOLIO_PREVIEW_URL ?? 'http://127.0.0.1:8000/';
const devtoolsUrl = process.env.CHROME_DEVTOOLS_URL ?? 'http://127.0.0.1:9222';
const viewportWidth = Number(process.env.VIEWPORT_WIDTH ?? 390);
const viewportHeight = Number(process.env.VIEWPORT_HEIGHT ?? 844);
const screenshotPath = process.env.SCREENSHOT_PATH ?? '/tmp/portfolio-mobile-cdp.png';
const captureFullPage = process.env.FULL_PAGE === '1';
const captureSection = process.env.CAPTURE_SECTION ?? '';

const target = await fetch(`${devtoolsUrl}/json/new?about:blank`, { method: 'PUT' }).then(
  (response) => {
    if (!response.ok) throw new Error(`Unable to create Chrome target: ${response.status}`);
    return response.json();
  },
);

const socket = new WebSocket(target.webSocketDebuggerUrl);
const pending = new Map();
const waiters = new Map();
const browserErrors = [];
let nextId = 0;

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request?.reject(new Error(message.error.message));
    else request?.resolve(message.result);
    return;
  }

  const listeners = waiters.get(message.method) ?? [];
  listeners.splice(0).forEach((resolve) => resolve(message.params));

  if (message.method === 'Runtime.exceptionThrown') {
    browserErrors.push(message.params.exceptionDetails?.text ?? 'Runtime exception');
  }
  if (message.method === 'Log.entryAdded' && message.params.entry?.level === 'error') {
    browserErrors.push(message.params.entry.text);
  }
});

await new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

function send(method, params = {}) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function waitFor(method) {
  return new Promise((resolve) => {
    const listeners = waiters.get(method) ?? [];
    listeners.push(resolve);
    waiters.set(method, listeners);
  });
}

await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');
await send('Network.enable');
await send('Network.setCacheDisabled', { cacheDisabled: true });
await send('Emulation.setDeviceMetricsOverride', {
  width: viewportWidth,
  height: viewportHeight,
  deviceScaleFactor: 1,
  mobile: viewportWidth <= 720,
});

const loaded = waitFor('Page.loadEventFired');
await send('Page.navigate', { url: previewUrl });
await loaded;
await new Promise((resolve) => setTimeout(resolve, 300));

const evaluation = await send('Runtime.evaluate', {
  expression: `(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    heroWidth: document.querySelector('.hero-grid')?.getBoundingClientRect().width,
    copyWidth: document.querySelector('.hero-copy')?.getBoundingClientRect().width,
    headlineClientWidth: document.querySelector('.hero h1')?.clientWidth,
    headlineScrollWidth: document.querySelector('.hero h1')?.scrollWidth,
    labelClientWidth: document.querySelector('.system-label')?.clientWidth,
    labelScrollWidth: document.querySelector('.system-label')?.scrollWidth
  }))()`,
  returnByValue: true,
});

const metrics = evaluation.result.value;
console.log(JSON.stringify(metrics));
assert.equal(
  metrics.scrollWidth,
  metrics.clientWidth,
  `mobile page must not overflow: ${metrics.scrollWidth}px > ${metrics.clientWidth}px`,
);
assert.ok(metrics.heroWidth <= metrics.clientWidth, 'hero grid must fit the mobile viewport');
assert.ok(metrics.copyWidth <= metrics.clientWidth, 'hero copy must fit the mobile viewport');
assert.ok(
  metrics.headlineScrollWidth <= metrics.headlineClientWidth,
  'hero headline text must wrap inside its mobile content box',
);
assert.ok(
  metrics.labelScrollWidth <= metrics.labelClientWidth,
  'hero system label must wrap inside its mobile content box',
);

if (captureSection) {
  await send('Runtime.evaluate', {
    expression: `(() => {
      const target = document.querySelector(${JSON.stringify(captureSection)});
      target?.scrollIntoView({ behavior: 'instant', block: 'start' });
      if (${JSON.stringify(captureSection)} === '#projects') {
        const details = target?.querySelector('[data-project-details]');
        if (details) details.open = true;
      }
    })()`,
  });
  await new Promise((resolve) => setTimeout(resolve, 700));
}

const screenshot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: captureFullPage,
  fromSurface: true,
});
await writeFile(screenshotPath, Buffer.from(screenshot.data, 'base64'));

const interactionEvaluation = await send('Runtime.evaluate', {
  expression: `(() => {
    const toggle = document.querySelector('#nav-toggle');
    const nav = document.querySelector('#primary-nav');
    toggle.click();
    const menuOpened = toggle.getAttribute('aria-expanded') === 'true' && nav.classList.contains('nav-open');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const menuClosed = toggle.getAttribute('aria-expanded') === 'false' && !nav.classList.contains('nav-open');

    const internalMissing = [...document.querySelectorAll('a[href^="#"]')]
      .map((link) => link.getAttribute('href'))
      .filter((href) => !document.querySelector(href));

    const form = document.querySelector('#terminal-form');
    const input = document.querySelector('#terminal-input');
    const output = document.querySelector('#terminal-output');
    const commandOutput = {};
    for (const command of ['help', 'about', 'experience', 'projects', 'stack', 'contact', 'resume', 'not-a-command', 'clear']) {
      input.value = command;
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      commandOutput[command] = output.textContent.trim();
    }

    const detailLabels = [...document.querySelectorAll('[data-project-details]')].map((details) => {
      details.open = true;
      details.dispatchEvent(new Event('toggle'));
      return details.querySelector('summary > span:first-child')?.textContent;
    });

    const firstSummary = document.querySelector('[data-project-details] summary');
    firstSummary.focus();

    return {
      hasJsClass: document.documentElement.classList.contains('js'),
      menuOpened,
      menuClosed,
      internalMissing,
      commandOutput,
      detailCount: detailLabels.length,
      detailLabels,
      summaryFocusable: document.activeElement === firstSummary && firstSummary.tabIndex === 0,
      resumeDownload: document.querySelector('a[download][href*="Supreeth_Gunniguntla_Vidyasagar_Resume.docx"]') !== null
    };
  })()`,
  returnByValue: true,
});

const interactions = interactionEvaluation.result.value;
assert.equal(interactions.hasJsClass, true, 'progressive enhancement class must initialize');
assert.equal(interactions.menuOpened, true, 'mobile menu must open and expose aria state');
assert.equal(interactions.menuClosed, true, 'Escape must close the mobile menu');
assert.deepEqual(interactions.internalMissing, [], 'every internal link must resolve');
assert.match(interactions.commandOutput.help, /Available commands/);
assert.match(interactions.commandOutput.about, /Data Engineer/);
assert.match(interactions.commandOutput.experience, /Research Assistant/);
assert.match(interactions.commandOutput.projects, /AI-Powered ATS Resume Matcher/);
assert.match(interactions.commandOutput.stack, /Programming:/);
assert.match(interactions.commandOutput.contact, /supreethgvvs@gmail\.com/);
assert.match(interactions.commandOutput.resume, /Opening the latest packaged résumé/);
assert.match(interactions.commandOutput['not-a-command'], /Command not found/);
assert.equal(interactions.commandOutput.clear, '');
assert.equal(interactions.detailCount, 4);
assert.deepEqual(interactions.detailLabels, Array(4).fill('Hide architecture'));
assert.equal(interactions.summaryFocusable, true, 'project disclosures must be keyboard focusable');
assert.equal(interactions.resumeDownload, true, 'latest resume must remain downloadable');

await send('Page.bringToFront');
const terminalFocus = await send('Runtime.evaluate', {
  expression: `(() => {
    const input = document.querySelector('#terminal-input');
    input.focus();
    const style = getComputedStyle(input);
    return {
      activeId: document.activeElement?.id ?? '',
      matchesFocus: input.matches(':focus'),
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
    };
  })()`,
  returnByValue: true,
});
assert.equal(terminalFocus.result.value.activeId, 'terminal-input');
assert.equal(terminalFocus.result.value.matchesFocus, true);
assert.notEqual(terminalFocus.result.value.outlineStyle, 'none');
assert.notEqual(terminalFocus.result.value.outlineWidth, '0px');

await send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});
const reducedMotion = await send('Runtime.evaluate', {
  expression: `({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    duration: getComputedStyle(document.querySelector('.architecture-connector')).animationDuration
  })`,
  returnByValue: true,
});
assert.equal(reducedMotion.result.value.matches, true);
assert.notEqual(reducedMotion.result.value.duration, '2.4s');

const reducedNavigation = await send('Runtime.evaluate', {
  expression: `new Promise((resolve) => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('[data-command="projects"]').click();
    setTimeout(() => {
      resolve({
        projectTop: document.querySelector('#projects').getBoundingClientRect().top,
        activeId: document.activeElement?.id ?? '',
        scrollY: window.scrollY
      });
    }, 80);
  })`,
  awaitPromise: true,
  returnByValue: true,
});
assert.equal(reducedNavigation.result.value.activeId, 'projects');
assert.ok(
  Math.abs(reducedNavigation.result.value.projectTop) < 120,
  `reduced-motion navigation must reach Projects, top=${reducedNavigation.result.value.projectTop}`,
);

await send('Emulation.setEmulatedMedia', { media: 'print', features: [] });
const printEvaluation = await send('Runtime.evaluate', {
  expression: `new Promise((resolve) => {
    const details = [...document.querySelectorAll('details')];
    details.forEach((item) => { item.open = false; });
    document.querySelectorAll('[data-reveal]').forEach((item) => item.classList.remove('is-visible'));
    window.dispatchEvent(new Event('beforeprint'));
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const opacity = getComputedStyle(document.querySelector('#experience [data-reveal]')).opacity;
      const caseHeight = document.querySelector('.project-case-study').getBoundingClientRect().height;
      const expandedForPrint = details.every((item) => item.open);
      window.dispatchEvent(new Event('afterprint'));
      resolve({
        opacity,
        caseHeight,
        expandedForPrint,
        restoredClosed: details.every((item) => !item.open)
      });
    }));
  })`,
  awaitPromise: true,
  returnByValue: true,
});
assert.equal(printEvaluation.result.value.opacity, '1');
assert.ok(printEvaluation.result.value.caseHeight > 100, 'print must include project case-study bodies');
assert.equal(printEvaluation.result.value.expandedForPrint, true);
assert.equal(printEvaluation.result.value.restoredClosed, true);
assert.deepEqual(browserErrors, [], 'browser console must have no runtime errors');

console.log(JSON.stringify({
  viewport: [viewportWidth, viewportHeight],
  interactions: 'pass',
  reducedMotion: reducedMotion.result.value,
  reducedNavigation: reducedNavigation.result.value,
  print: printEvaluation.result.value,
  browserErrors,
}));

socket.close();
await fetch(`${devtoolsUrl}/json/close/${target.id}`);
