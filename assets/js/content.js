export const PROFILE = Object.freeze({
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

export const METRICS = Object.freeze([
  {
    value: '16M+',
    label: 'banking customer records integrated',
    context: 'Three source systems consolidated for regulatory reporting at EY.',
  },
  {
    value: '70K+',
    label: 'candidate records transformed',
    context: 'AWS and Databricks pipeline built at Antern Technologies.',
  },
  {
    value: '3K+',
    label: 'daily incremental candidate records',
    context: 'Scheduled ingestion with Auto Loader and Apache Airflow.',
  },
  {
    value: '100K+',
    label: 'chromosomes processed',
    context: 'Reproducible population-genomics workflows on HPC infrastructure.',
  },
]);

export const EXPERIENCE_SUMMARIES = Object.freeze([
  {
    organization: 'Indiana University',
    title: 'Research Assistant',
    dates: 'Jan 2026 – May 2026',
    summary:
      'Turned population-genomics analyses into reproducible HPC workflows with durable result lineage.',
    stack: ['Snakemake', 'PostgreSQL', 'Python', 'HPC', 'PCA', 'FST'],
    outcome:
      'Processed data from 100K+ chromosomes and generated reports for the Great Lakes Fishery Commission and state agencies.',
  },
  {
    organization: 'Antern Technologies',
    title: 'Data Engineering Intern',
    dates: 'May 2025 – Aug 2025',
    summary:
      'Built an AWS data path that converted inconsistent candidate records into governed, analytics-ready datasets.',
    stack: [
      'Amazon S3',
      'Databricks',
      'PySpark',
      'Redshift',
      'Airflow',
      'Power BI',
    ],
    outcome:
      'Transformed 70K+ candidate records and automated 3K+ daily incremental records with Auto Loader and Airflow.',
  },
  {
    organization: 'Ernst & Young (EY)',
    title: 'Senior Analyst',
    dates: 'Feb 2023 – Jul 2024',
    summary:
      'Engineered PostgreSQL systems for ESG compliance and helped modernize a banking reporting warehouse.',
    stack: ['PostgreSQL', 'SQL', 'dbt', 'Airflow', 'RBAC', 'Dimensional Modeling'],
    stories: {
      esg:
        'Delivered 260+ PostgreSQL development tasks for an ESG regulatory SaaS platform supporting data acquisition, CRUD workflows, and SEBI BRSR reporting; indexing and query optimization improved SQL execution and application performance by approximately 70%.',
      banking:
        'Helped consolidate 16M+ customer records from three banking source systems into an on-premises PostgreSQL warehouse; dbt transformations and Airflow orchestration reduced reporting turnaround from approximately 14 days to 3–4 days.',
    },
  },
]);

export const PROJECT_SUMMARIES = Object.freeze([
  {
    name: 'AI-Powered ATS Resume Matcher',
    status: 'Completed',
    repository: null,
    stack: ['Gemini', 'RAG', 'BM25', 'Vector Search'],
    problem:
      'Resume-to-job matching needs structured evidence, not an unexplained similarity score.',
    solution:
      'Combined document parsing, structured extraction, and hybrid BM25/vector retrieval with Gemini-driven evaluation.',
    outcome:
      'Produced evidence-backed fit scores with schema validation, retries, fallbacks, guardrails, and weighted scoring.',
  },
  {
    name: 'Real-Time Delivery Monitoring & Delay Detection',
    status: 'Completed',
    repository: null,
    stack: ['Kafka', 'Snowflake', 'SQL'],
    problem:
      'Shipment teams need continuous visibility into route deviations and delivery delays.',
    solution:
      'Streamed GPS and delivery-status events through Kafka and modeled continuously refreshed results in Snowflake.',
    outcome:
      'Used Dynamic Tables and SQL transformations for deduplication, deviation detection, and near-real-time analytics.',
  },
  {
    name: 'Inventory Monitoring & Replenishment Analytics',
    status: 'Completed',
    repository: null,
    stack: [
      'Azure Data Factory',
      'ADLS Gen2',
      'Databricks',
      'PySpark',
      'Delta Lake',
      'Unity Catalog',
      'Power BI',
    ],
    problem:
      'Inventory teams needed reliable stock visibility and reorder signals beyond spreadsheet reporting.',
    solution:
      'Built a governed Azure pipeline across Bronze, Silver, and Gold Delta Lake layers.',
    outcome:
      'Processed 100K+ supply-chain records and served curated inventory data through Databricks SQL and Power BI.',
  },
  {
    name: 'Financial Intelligence Hub',
    status: 'Completed',
    repository: null,
    stack: ['LangChain', 'ChromaDB', 'Gemini Flash', 'Streamlit'],
    problem:
      'Market data, technical indicators, contextual research, and portfolio activity were split across separate workflows.',
    solution:
      'Built a multi-tool ReAct agent and a RAG pipeline for contextual S&P 500 analysis.',
    outcome:
      'Delivered a Streamlit portfolio view for market context, live profit-and-loss information, and trade history.',
  },
]);

export const SKILL_GROUPS = Object.freeze([
  { category: 'Programming', skills: ['Python', 'SQL', 'PL/SQL'] },
  {
    category: 'Data Engineering',
    skills: ['ETL/ELT', 'Databricks', 'dbt', 'Airflow', 'Spark', 'Kafka', 'ADF'],
  },
  {
    category: 'Data Warehousing',
    skills: ['PostgreSQL', 'Snowflake', 'BigQuery', 'Redshift', 'Synapse'],
  },
  {
    category: 'Data Modeling',
    skills: ['Dimensional Modeling', 'Medallion Architecture', 'ER Diagrams'],
  },
  { category: 'Cloud Platforms', skills: ['AWS', 'Azure', 'GCP'] },
  {
    category: 'Visualization',
    skills: ['Tableau', 'Power BI', 'Looker Studio'],
  },
  {
    category: 'Applied AI',
    skills: [
      'LangChain',
      'RAG Pipelines',
      'LLM Integration',
      'Vector Databases',
      'AI Harness',
      'Evals',
    ],
  },
  {
    category: 'Development Tools',
    skills: ['Git', 'GitHub', 'Docker', 'Agile', 'Scrum', 'Jira'],
  },
]);

export const CERTIFICATIONS = Object.freeze([
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

export const TERMINAL_HELP = Object.freeze([
  'help',
  'about',
  'experience',
  'projects',
  'stack',
  'resume',
  'contact',
  'clear',
]);
