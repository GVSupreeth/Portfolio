import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stylesPath = join(root, 'assets/css/styles.css');

function loadStyles() {
  assert.ok(existsSync(stylesPath), 'production stylesheet must exist');
  return readFileSync(stylesPath, 'utf8');
}

test('palette is permanently dark with restrained signal colors', () => {
  const css = loadStyles();

  assert.match(css, /--color-bg:\s*#080b10/i);
  assert.match(css, /--color-surface:\s*#10151d/i);
  assert.match(css, /--color-text:\s*#f4f7fa/i);
  assert.match(css, /--color-signal:\s*#5ee7f7/i);
  assert.match(css, /--color-amber:\s*#f0ad4e/i);
  assert.doesNotMatch(css, /data-theme\s*=\s*["']light["']/i);
});

test('global frame protects readability, focus, and viewport width', () => {
  const css = loadStyles();

  assert.match(css, /body\s*\{[^}]*overflow-x:\s*clip/is);
  assert.match(css, /:focus-visible\s*\{/i);
  assert.match(css, /\.skip-link\s*\{/i);
  assert.match(css, /font-size:\s*clamp\(/i);
  assert.match(css, /\.button\s*\{/i);
  assert.match(css, /min-block-size:\s*44px/i);
});

test('portfolio components share a coherent lineage system', () => {
  const css = loadStyles();

  for (const component of [
    '.terminal',
    '.evidence-grid',
    '.experience-timeline',
    '.experience-entry',
    '.experience-stories',
    '.project-card',
    '.architecture-flow',
    '.architecture-node',
    '.architecture-connector',
    '.skills-grid',
    '.credentials-grid',
    '.contact-grid',
  ]) {
    assert.ok(css.includes(component), `missing ${component} styling`);
  }

  assert.match(css, /details\[open\][^{]*\.details-icon/is);
  assert.match(css, /details\s*>\s*summary\s*\{/i);
});

test('hero portrait card has polished cropping and a compact mobile layout', () => {
  const css = loadStyles();

  assert.match(css, /\.hero-identity\s*\{/i);
  assert.match(css, /\.profile-card\s*\{[^}]*border-radius:[^}]*box-shadow:/is);
  assert.match(css, /\.profile-headshot\s*\{[^}]*object-fit:\s*cover/is);
  assert.match(
    css,
    /@media\s*\(max-width:\s*480px\)[\s\S]*?\.hero-identity\s*\{[^}]*grid-template-columns:/is,
  );
});

test('tablet and mobile rules stack the layout and preserve input usability', () => {
  const css = loadStyles();

  assert.match(css, /@media\s*\(max-width:\s*960px\)/i);
  assert.match(css, /@media\s*\(max-width:\s*720px\)/i);
  assert.match(
    css,
    /@media\s*\(max-width:\s*960px\)[\s\S]*?\.hero-grid\s*\{[^}]*grid-template-columns:\s*1fr/is,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*720px\)[\s\S]*?\.architecture-flow\s*\{[^}]*flex-direction:\s*column/is,
  );
  assert.match(
    css,
    /@media\s*\(max-width:\s*720px\)[\s\S]*?\.terminal-form\s+input\s*\{[^}]*font-size:\s*16px/is,
  );
});

test('motion, contrast, and print preferences have complete fallbacks', () => {
  const css = loadStyles();

  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
  assert.match(css, /@media\s*\(prefers-contrast:\s*more\)/i);
  assert.match(css, /@media\s+print/i);
  assert.match(
    css,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?animation-duration:\s*0\.01ms/is,
  );
  assert.match(css, /@keyframes\s+data-flow/i);
});
