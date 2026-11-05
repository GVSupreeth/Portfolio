import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');

function count(pattern) {
  return [...html.matchAll(pattern)].length;
}

function stripMarkup(value) {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

test('document exposes semantic landmarks and resolvable navigation', () => {
  assert.equal(count(/<h1\b/gi), 1, 'document must contain exactly one h1');
  assert.match(html, /<a\b[^>]*class="skip-link"[^>]*href="#main"/i);
  assert.match(html, /<main\b[^>]*id="main"/i);

  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
  for (const required of [
    'top',
    'experience',
    'projects',
    'stack',
    'education',
    'contact',
    'terminal',
    'nav-toggle',
    'primary-nav',
  ]) {
    assert.ok(ids.has(required), `missing #${required}`);
  }

  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(ids.has(target), `internal link #${target} must resolve`);
  }
});

test('hero communicates the recruiter essentials without JavaScript', () => {
  const hero = html.match(/<section\b[^>]*class="[^"]*hero[^"]*"[\s\S]*?<\/section>/i)?.[0];
  assert.ok(hero, 'hero section must exist');

  for (const copy of [
    'Supreeth Gunniguntla Vidyasagar',
    'Data Engineer',
    'data pipelines',
    'cloud platforms',
    'applied AI',
    'Explore work',
    'View résumé',
    'GitHub',
    'LinkedIn',
  ]) {
    assert.ok(stripMarkup(hero).includes(copy), `hero must expose ${copy}`);
  }
});

test('verified evidence and experience are present in static HTML', () => {
  for (const evidence of ['16M+', '70K+', '3K+', '100K+']) {
    assert.ok(html.includes(evidence), `missing evidence ${evidence}`);
  }

  for (const role of [
    'Indiana University',
    'Research Assistant',
    'Antern Technologies',
    'Data Engineering Intern',
    'Ernst &amp; Young (EY)',
    'Senior Analyst',
    'ESG Regulatory SaaS',
    'Banking Data Warehouse',
  ]) {
    assert.ok(html.includes(role), `missing experience content: ${role}`);
  }

  const anternEntry = html.match(
    /<article\b[^>]*class="experience-entry"[\s\S]*?Antern Technologies[\s\S]*?<\/article>/i,
  )?.[0];
  assert.ok(anternEntry, 'Antern experience entry must exist');
  assert.match(anternEntry, /\bdbt\b/i);
});

test('all project case studies and architecture summaries work without JavaScript', () => {
  for (const project of [
    'AI-Powered ATS Resume Matcher',
    'Real-Time Delivery Monitoring &amp; Delay Detection',
    'Inventory Monitoring &amp; Replenishment Analytics',
    'Financial Intelligence Hub',
  ]) {
    assert.ok(html.includes(project), `missing project ${project}`);
  }

  assert.equal(count(/<details\b[^>]*data-project-details/gi), 4);
  assert.equal(count(/<span\b[^>]*class="status-badge"[^>]*>Completed<\/span>/gi), 4);
  assert.ok(count(/<dt>Problem<\/dt>/gi) >= 4);
  assert.ok(count(/<dt>Implementation<\/dt>/gi) >= 4);
  assert.ok(count(/<dt>Outcome<\/dt>/gi) >= 4);
  assert.equal(count(/class="architecture-flow"/gi), 4);
  assert.ok(count(/class="architecture-node/gi) >= 16);
});

test('skills, education, credentials, and contact are complete', () => {
  for (const category of [
    'Programming',
    'Data Engineering',
    'Data Warehousing',
    'Data Modeling',
    'Cloud Platforms',
    'Visualization',
    'Applied AI',
    'Development Tools',
  ]) {
    assert.ok(html.includes(category), `missing skill category ${category}`);
  }

  for (const fact of [
    'M.S. Data Science',
    'B.E. Electronics and Communications Engineering',
    'Azure Databricks Data Engineer Associate',
    'Snowflake Data Engineering Professional',
    'RAG and Agentic AI',
    'supreethgvvs@gmail.com',
  ]) {
    assert.ok(html.includes(fact), `missing professional fact ${fact}`);
  }
});

test('resume download points only to the packaged latest document', () => {
  assert.match(
    html,
    /<a\b[^>]*href="\.\/assets\/resume\/Supreeth_Gunniguntla_Vidyasagar_Resume\.docx"[^>]*download/i,
  );
  assert.ok(!html.includes('Supreeth_2.pdf'));
  assert.ok(
    existsSync(join(root, 'assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx')),
  );
});

test('metadata and structured data expose verified identity only', () => {
  assert.match(html, /<title>[^<]*Supreeth[^<]*Data Engineer[^<]*<\/title>/i);
  assert.match(html, /<meta\b[^>]*name="description"[^>]*content="[^"]+"/i);
  assert.match(html, /<meta\b[^>]*name="theme-color"[^>]*content="#[0-9a-f]+"/i);
  assert.match(
    html,
    /<link\b[^>]*rel="canonical"[^>]*href="https:\/\/gvsupreeth\.github\.io\/Portfolio\/"/i,
  );
  assert.match(html, /<meta\b[^>]*property="og:title"/i);
  assert.match(html, /<meta\b[^>]*property="og:description"/i);
  assert.match(html, /<link\b[^>]*rel="icon"[^>]*assets\/icons\/favicon\.svg/i);

  const jsonLdText = html.match(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
  )?.[1];
  assert.ok(jsonLdText, 'Person JSON-LD must exist');
  const jsonLd = JSON.parse(jsonLdText);
  assert.equal(jsonLd['@type'], 'Person');
  assert.equal(jsonLd.name, 'Supreeth Gunniguntla Vidyasagar');
  assert.deepEqual(jsonLd.sameAs, [
    'https://github.com/GVSupreeth',
    'https://www.linkedin.com/in/supreeth-gunniguntla-vidyasagar-331610217/',
  ]);
  assert.equal(jsonLd.telephone, undefined);
  assert.ok(!html.includes('tel:'));
});

test('page references modular assets and secures external links', () => {
  assert.match(html, /href="\.\/assets\/css\/styles\.css"/i);
  assert.match(html, /<script\b[^>]*type="module"[^>]*src="\.\/assets\/js\/main\.js"/i);
  assert.ok(existsSync(join(root, 'assets/icons/favicon.svg')));
  assert.ok(existsSync(join(root, 'assets/js/content.js')));

  for (const [anchor] of html.matchAll(/<a\b[^>]*href="https?:\/\/[^"]+"[^>]*>/gi)) {
    assert.match(anchor, /target="_blank"/i);
    assert.match(anchor, /rel="noopener noreferrer"/i);
  }
});
