import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const modulePath = join(root, 'assets/js/content.js');
const resumePath = join(
  root,
  'assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx',
);

async function loadContent() {
  assert.ok(existsSync(modulePath), 'verified content module must exist');
  return import(pathToFileURL(modulePath));
}

test('profile points to verified professional destinations', async () => {
  const { PROFILE } = await loadContent();

  assert.deepEqual(PROFILE, {
    name: 'Supreeth Gunniguntla Vidyasagar',
    role: 'Data Engineer',
    email: 'supreethgvvs@gmail.com',
    github: 'https://github.com/GVSupreeth',
    linkedin:
      'https://www.linkedin.com/in/supreeth-gunniguntla-vidyasagar-331610217/',
    portfolio: 'https://gvsupreeth.github.io/Portfolio/',
    resumeUrl:
      './assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx',
  });
});

test('evidence metrics retain resume-backed values and context', async () => {
  const { METRICS } = await loadContent();

  assert.deepEqual(
    METRICS.map(({ value, label }) => [value, label]),
    [
      ['16M+', 'banking customer records integrated'],
      ['70K+', 'candidate records transformed'],
      ['3K+', 'daily incremental candidate records'],
      ['100K+', 'chromosomes processed'],
    ],
  );
});

test('experience uses exact resume titles, organizations, and dates', async () => {
  const { EXPERIENCE_SUMMARIES } = await loadContent();

  assert.deepEqual(
    EXPERIENCE_SUMMARIES.map(({ organization, title, dates }) => ({
      organization,
      title,
      dates,
    })),
    [
      {
        organization: 'Indiana University',
        title: 'Research Assistant',
        dates: 'Jan 2026 – May 2026',
      },
      {
        organization: 'Antern Technologies',
        title: 'Data Engineering Intern',
        dates: 'May 2025 – Aug 2025',
      },
      {
        organization: 'Ernst & Young (EY)',
        title: 'Senior Analyst',
        dates: 'Feb 2023 – Jul 2024',
      },
    ],
  );

  const ey = EXPERIENCE_SUMMARIES.find(
    ({ organization }) => organization === 'Ernst & Young (EY)',
  );
  assert.ok(ey.stories.esg.includes('260+'));
  assert.ok(ey.stories.esg.includes('SEBI BRSR'));
  assert.ok(ey.stories.banking.includes('16M+'));
  assert.ok(ey.stories.banking.includes('3–4 days'));

  const antern = EXPERIENCE_SUMMARIES.find(
    ({ organization }) => organization === 'Antern Technologies',
  );
  assert.ok(!antern.stack.includes('dbt'), 'Antern stack must not add resume-unsupported dbt');
  assert.ok(!JSON.stringify(antern).toLowerCase().includes('dbt'));
});

test('projects use supported stacks, completed status, and no guessed links', async () => {
  const { PROJECT_SUMMARIES } = await loadContent();

  assert.deepEqual(
    PROJECT_SUMMARIES.map(({ name, status, repository }) => ({
      name,
      status,
      repository,
    })),
    [
      {
        name: 'AI-Powered ATS Resume Matcher',
        status: 'Completed',
        repository: null,
      },
      {
        name: 'Real-Time Delivery Monitoring & Delay Detection',
        status: 'Completed',
        repository: null,
      },
      {
        name: 'Inventory Monitoring & Replenishment Analytics',
        status: 'Completed',
        repository: null,
      },
      {
        name: 'Financial Intelligence Hub',
        status: 'Completed',
        repository: null,
      },
    ],
  );

  assert.deepEqual(PROJECT_SUMMARIES[0].stack, [
    'Gemini',
    'RAG',
    'BM25',
    'Vector Search',
  ]);
  assert.deepEqual(PROJECT_SUMMARIES[1].stack, ['Kafka', 'Snowflake', 'SQL']);
  assert.deepEqual(PROJECT_SUMMARIES[2].stack, [
    'Azure Data Factory',
    'ADLS Gen2',
    'Databricks',
    'PySpark',
    'Delta Lake',
    'Unity Catalog',
    'Power BI',
  ]);
  assert.deepEqual(PROJECT_SUMMARIES[3].stack, [
    'LangChain',
    'ChromaDB',
    'Gemini Flash',
    'Streamlit',
  ]);
});

test('skills and credentials match the latest resume', async () => {
  const { SKILL_GROUPS, CERTIFICATIONS } = await loadContent();

  assert.deepEqual(
    SKILL_GROUPS.map(({ category }) => category),
    [
      'Programming',
      'Data Engineering',
      'Data Warehousing',
      'Data Modeling',
      'Cloud Platforms',
      'Visualization',
      'Applied AI',
      'Development Tools',
    ],
  );

  assert.deepEqual(CERTIFICATIONS, [
    {
      name: 'Azure Databricks Data Engineer Associate',
      issuer: 'Microsoft Azure',
      url: 'https://learn.microsoft.com/api/credentials/share/en-us/supreethgv-9568/FAC16C7959F10ABD?sharingId',
    },
    {
      name: 'Snowflake Data Engineering Professional',
      issuer: 'Snowflake',
      url: 'https://www.coursera.org/account/accomplishments/specialization/MMX9RW2T9784',
    },
    {
      name: 'RAG and Agentic AI',
      issuer: 'IBM',
      url: 'https://www.coursera.org/account/accomplishments/specialization/RJC3O1Z7STGR',
    },
  ]);
});

test('verified content excludes unsupported legacy claims', async () => {
  const content = await loadContent();
  const serialized = JSON.stringify(content);

  for (const unsupported of [
    '140+ PostgreSQL',
    '43 normalized',
    'debugging time by 50%',
    'SCD Type 2',
    'legal exposure',
  ]) {
    assert.ok(!serialized.includes(unsupported), `must exclude ${unsupported}`);
  }
});

test('terminal help exposes exactly the supported commands', async () => {
  const { TERMINAL_HELP } = await loadContent();

  assert.deepEqual(TERMINAL_HELP, [
    'help',
    'about',
    'experience',
    'projects',
    'stack',
    'resume',
    'contact',
    'clear',
  ]);
});

test('stable resume asset exists and is non-empty', () => {
  assert.ok(existsSync(resumePath), 'latest resume must be packaged');
  assert.ok(statSync(resumePath).size > 0, 'packaged resume must be non-empty');
});
