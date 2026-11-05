# Data Lineage Console Portfolio Redesign

## Intent

Redesign Supreeth Gunniguntla Vidyasagar's portfolio into a fast, credible, technically distinctive presentation for data-engineering recruiters, hiring managers, and engineering peers. A visitor should understand the specialization, strongest evidence, and ways to make contact within roughly 30 seconds, while deeper architecture and implementation detail remains available without overwhelming the first scan.

The selected concept is **Data Lineage Console**: an original, permanently dark interface that presents Supreeth's career as a traceable data system. It borrows useful interaction principles from the supplied reference—progressive disclosure, a functional terminal, clear navigation, restrained motion, and polished responsive behavior—but not its composition, portrait treatment, colors, copy, or decorative motifs.

## Goals

- Establish Supreeth as a Data Engineer focused on production data platforms, cloud infrastructure, Databricks, and applied AI.
- Make the scale and substance of EY, Antern Technologies, and Indiana University work immediately understandable.
- Give projects enough architectural detail to demonstrate engineering judgment, not just technology lists.
- Make the latest résumé, GitHub profile, LinkedIn profile, and email easy to reach.
- Preserve useful current behavior such as smooth scrolling, reveal effects, a progress indicator, and structured skill categories while improving maintainability.
- Deliver excellent desktop and mobile behavior with keyboard access, reduced-motion support, semantic markup, and useful SEO metadata.
- Keep deployment compatible with GitHub Pages and require no server or paid runtime.

## Non-goals

- No blog, CMS, authentication, contact-form backend, analytics service, or résumé-question-answering backend.
- No attempt to reproduce the reference website's portrait-led hero, command palette, layout, or visual styling.
- No speculative project demos, fake live metrics, testimonials, client logos, availability claims, or technology proficiency ratings.
- No public display of a phone number; email, LinkedIn, and GitHub are sufficient contact paths.
- No light theme. The user explicitly selected a dark-themed implementation.

## Anti-goals

- A dense résumé pasted into a web page.
- A generic neon-on-black “developer template” with excessive glow, glass effects, or constant motion.
- Decorative terminal or architecture elements that are nonfunctional or misleading.
- Claims copied from the current site when they are absent from or conflict with the newer résumé.
- Interactions that only work on hover, trap keyboard focus, or hide essential content from search engines.

## Source hierarchy and factual constraints

1. `/Users/supreeth/Dallas Documents/resumes/portfolio/Supreeth_GVS (1).docx`, modified 2026-11-05, is the primary source of truth for all professional information: experience, titles, dates, accomplishments, skills, certifications, education, research, project descriptions, measurable achievements, and contact information.
2. The current `index.html` and public GitHub profile may supply only additional project information or links that can be verified and do not conflict with the résumé. Any unresolved conflict must be flagged rather than guessed through.
3. Public GitHub repositories may provide real destination URLs. A project receives a source-code link only when a matching repository is confidently identified.
4. The supplied reference website is a design-pattern reference only.
5. Do not invent achievements, dates, certifications, clients, project links, or contact information.

Direct user clarification on 2026-11-05 confirms that dbt was used in the Antern Technologies pipeline. This verified correction supplements the résumé where that tool attribution was omitted.

Website copy must not reproduce résumé bullets verbatim throughout the page. Reframe supported facts into concise recruiter-friendly narratives organized around the business or research problem, Supreeth's technical contribution, the technologies used, and the measurable result, without changing the claim's meaning or strength.

The repository currently contains one production file, `index.html`, with all markup, styling, content, and JavaScript inline. The tracked `Supreeth_2.pdf` is deleted in the working tree. The newer résumé exists as DOCX outside the repository. The implementation must not overwrite or disguise this state: it will package the newer résumé as the download asset unless a matching current PDF becomes available.

## Approaches considered

### 1. Data Lineage Console — selected

Use modular, buildless HTML, CSS, and ES-module JavaScript. Present the site as a calm data-infrastructure interface with a functional terminal, topology-inspired visual language, and expandable architecture traces. This offers the best balance of originality, performance, maintainability, accessibility, and zero-configuration GitHub Pages deployment.

### 2. Editorial Engineer

Use a portrait-led hero, large editorial typography, and reference-like storytelling. This could create a stronger personal presence but requires a professional portrait, is visually closer to the reference, and puts less emphasis on the systems-engineering identity the portfolio needs to establish.

### 3. React/Vite rebuild

Use React components and a static build. This would make future feature expansion straightforward but adds dependencies, build output, and deployment configuration without solving a present requirement that native browser APIs cannot handle.

The user selected the recommended first approach and requested that it remain dark themed.

## Information architecture

### Global navigation

A sticky, translucent navigation bar contains the SG monogram, concise links to Experience, Projects, Stack, and Contact, plus a prominent Résumé action. Desktop navigation includes active-section state. Mobile uses an accessible menu button and compact panel. A skip link appears first in the document.

### Hero: identity plus functional terminal

The hero is asymmetric but does not use a portrait. The primary column states Supreeth's name, role, and concise positioning around reliable data systems across cloud, Databricks, and applied AI. Primary actions lead to selected work and the résumé; GitHub and LinkedIn are immediately available.

The professional introduction is the primary recruiter path and must communicate the essential positioning without interaction. The terminal is a secondary, complementary proof of craft; it must never be required to discover Supreeth's role, strongest evidence, projects, résumé, or contact links.

The companion visual is a real terminal panel with an initial prompt and these commands:

- `help` — list supported commands.
- `about` — concise positioning statement.
- `experience` — summarize roles and move to the timeline.
- `projects` — list projects and move to selected work.
- `skills` — summarize the stack and move to the skills section.
- `resume` — download/open the packaged current résumé.
- `contact` — show email, GitHub, and LinkedIn.
- `clear` — clear terminal output.

Command buttons or examples make the interaction discoverable on touch devices. Terminal content is a progressive enhancement; the core hero and links remain usable without JavaScript. Autotyping is skipped when reduced motion is requested.

### Evidence strip

Use three high-signal, context-rich facts rather than a wall of counters:

- `16M+` banking customer records integrated at EY.
- `70K+` candidate records transformed at Antern Technologies, with `3K+` daily incremental records.
- `100K+` chromosomes processed in Indiana University population-genomics research.

The figures are always visible as text. Motion may reveal them but must not be required to understand them.

### Experience timeline

Present roles in reverse chronology with a continuous lineage rail and expandable technical details. Each entry has role, organization, dates, a concise system summary, verified scale, and technology tags.

**Indiana University — Research Assistant, Jan 2026–May 2026**

- Snakemake workflows for a population-genomics pipeline processing 100K+ chromosomes.
- Parameterized quality-control and PCA/FST analyses as reproducible HPC jobs.
- PostgreSQL persistence for structured results and run lineage while raw genotype files remain on storage.
- Python visualizations for Great Lakes Fishery Commission and state-agency stakeholders.

**Antern Technologies — Data Engineering Intern, May 2025–Aug 2025**

- End-to-end AWS pipeline using S3, Databricks, PySpark, Redshift, dbt, and Power BI across 70K+ candidate records.
- Cleaning and standardization of skills, experience, salary expectations, and preferred-location data.
- Unity Catalog for centralized access control and lineage.
- Auto Loader and Airflow for 3K+ daily incremental candidate records.

**Ernst & Young (EY) — Senior Analyst, Feb 2023–Jul 2024**

Show two clearly labeled engineering stories inside the EY entry:

1. **ESG Regulatory SaaS** — 260+ PostgreSQL database tasks supporting acquisition, CRUD operations, and SEBI BRSR reporting; stored procedures, functions, triggers, ER modeling, role-based access control, audit triggers, and roughly 70% improvement to SQL query execution and application performance through indexing and query/table optimization.
2. **Banking Data Warehouse** — integration of 16M+ customer records from three banking source systems into an on-premises PostgreSQL warehouse supporting 35+ internal and RBI regulatory reports; data profiling, source-to-target mapping, dimensional modeling, dbt transformations in a Bronze–Silver–Gold architecture, and Airflow orchestration that reduced reporting turnaround from roughly 14 days to 3–4 days.

Unsupported current-site claims such as 140 stored procedures, 43 ER models, 50% debugging reduction, SCD Type 2 ownership, or legal-exposure reduction are omitted.

### Selected projects

Projects are the signature technical section. Project cards show the project name, problem, concise solution, stack, verified impact where available, and status by default. Each contains an accessible “View architecture” control that expands a reusable responsive flow covering source → ingestion → processing → storage → serving, with orchestration, governance, and monitoring shown only where verified. Expansion state uses native or ARIA-correct controls and remains keyboard accessible.

1. **AI-Powered ATS Resume Matcher — Completed** — Gemini, document parsing, structured extraction, BM25 plus vector retrieval, evidence-backed matching, schema validation, retries, fallback logic, guardrails, and weighted scoring. No source link unless a matching repository is identified.
2. **Real-Time Delivery Monitoring & Delay Detection — Completed** — Kafka and Snowflake ingestion of GPS/delivery-status events, Snowflake Dynamic Tables and SQL for deduplication, route-deviation and delay detection, and near-real-time analytics.
3. **Inventory Monitoring & Replenishment Analytics — Completed** — ADF, ADLS Gen2, Databricks/PySpark, 100K+ supply-chain records across Bronze/Silver/Gold Delta layers, Unity Catalog, Databricks SQL, and Power BI.
4. **Financial Intelligence Hub — Completed** — retain as an additional project because it is already described in the repository as built and deployed, using only its existing supplied description and stack. Do not add unsupported scale or a repository link.

The first three statuses are supported by completed-work language in the latest résumé; the fourth is supported by the current site's completed-work language. The diagrams may show only architecture explicitly present in those sources. Use directional connections and subtle data-flow motion, with a static equivalent under reduced motion.

### Engineering case studies

Expanded project content follows the same compact structure: **Problem**, **Architecture**, **Implementation**, **Engineering decisions**, **Challenges**, and **Outcome**. Omit a subsection when the supplied sources do not support it; never fill gaps with plausible-sounding details. Prefer short bullets and diagram annotations over long paragraphs.

### Technical stack

Use eight readable groups rather than proficiency bars:

- Programming: Python, SQL, PL/SQL.
- Data engineering: ETL/ELT, Databricks, dbt, Airflow, Spark, Kafka, ADF.
- Data warehousing: PostgreSQL, Snowflake, BigQuery, Redshift, Synapse.
- Data modeling: Dimensional Modeling, Medallion Architecture, ER Diagrams.
- Cloud platforms: AWS, Azure, GCP.
- Visualization: Tableau, Power BI, Looker Studio.
- Applied AI: LangChain, RAG pipelines, LLM integration, vector databases, AI harness/evals.
- Development tools: Git, GitHub, Docker, Agile/Scrum, Jira.

### Education and credentials

- Indiana University Bloomington — M.S. Data Science, Aug 2024–May 2026.
- New Horizon College of Engineering — B.E. Electronics and Communications Engineering, Jun 2019–May 2023.
- Include only the three certifications and credential URLs present in the latest résumé: Azure Databricks Data Engineer Associate, Snowflake Data Engineering Professional, and IBM RAG and Agentic AI.

### Contact and footer

Close with a concise invitation to discuss data-platform work. Provide verified email, GitHub, and the updated LinkedIn URL from the latest résumé. Do not display a phone number. Include a small “system status” colophon describing the site as static, accessible, and hosted on GitHub Pages without presenting unverifiable performance scores.

## Visual system

- Permanent dark palette with deep graphite and blue-black surfaces, off-white body text, muted blue-gray secondary text, electric cyan as the main signal color, and warm amber as a sparse counter-accent.
- Typography pairs a clean sans-serif for narrative content with a mono face for labels, commands, dates, and architecture nodes. Fonts use performant fallbacks and `font-display` behavior; the page remains legible if remote fonts fail.
- Data-lineage motifs use thin rails, nodes, dashed paths, and subtle packet pulses. The hero background is an original SVG/CSS topology field, not the reference's particle field or portrait arch.
- Cards use clear borders and surface contrast rather than heavy glass blur. Glow appears only on focus, active terminal input, and selected lineage nodes.
- Motion is brief and purposeful: reveal transitions, terminal typing, topology pulses, project expansion, and active navigation. All animations stop or simplify for `prefers-reduced-motion`.

## Technical architecture

Remain buildless and static:

- `index.html` — semantic page structure, metadata, structured data, and no-JavaScript fallback content.
- `assets/css/styles.css` — design tokens, layout, components, states, print and responsive rules.
- `assets/js/content.js` — verified profile, navigation, terminal, and project architecture data.
- `assets/js/terminal.js` — command parsing, output, focus, and touch shortcuts.
- `assets/js/main.js` — navigation, scroll progress, reveal behavior, project disclosure, and initialization.
- `assets/resume/` — the newest downloadable résumé asset with a stable filename.

No dependency installation or compilation is required. JavaScript modules must fail gracefully when an optional DOM feature is unavailable.

## Responsive behavior

- Desktop: split hero, sticky navigation, horizontal evidence strip, generous timeline rail, and architecture flows laid out left-to-right.
- Tablet: narrower split hero, wrapping evidence items, and compressed timeline metadata.
- Mobile: single-column hero, terminal below copy, accessible menu, stacked evidence, timeline rail at the edge, and architecture flows stacked vertically.
- Minimum interactive target size is 44px where practical. Body copy remains at least 16px on small screens, and terminal inputs avoid iOS zoom.

## Accessibility, performance, and SEO

- Semantic landmarks, one descriptive `h1`, sequential headings, a skip link, visible focus states, and descriptive link/button labels.
- Keyboard-complete terminal, navigation, menu, and project disclosures; `aria-live` is limited to terminal results and does not announce decorative typing.
- Color contrast targets WCAG AA. Information is never conveyed by color alone.
- Respect reduced-motion and high-contrast preferences. Decorative SVGs are hidden from assistive technology.
- Add a unique title, accurate meta description, canonical GitHub Pages URL, Open Graph/Twitter metadata that does not reference a nonexistent image, and JSON-LD `Person` data containing only verified details.
- Keep JavaScript small and deferred/module-loaded. Avoid image dependencies unless a real asset adds value. Use explicit dimensions for any assets to prevent layout shift.
- Add print rules that produce a clean project/experience overview and expose link destinations where useful.
- Measure Lighthouse after implementation and aim for 90+ in Performance, Accessibility, Best Practices, and SEO, but report measured results and never claim an unrun or unavailable score.

## Validation criteria

- Serve the site locally and verify it loads without console errors.
- Confirm every internal navigation target exists and receives focus/scroll behavior correctly.
- Confirm résumé, GitHub, LinkedIn, certification, and email destinations are valid and use appropriate external-link attributes.
- Exercise every terminal command, the mobile menu, project expand/collapse controls, scroll progress, and active navigation.
- Verify layout at representative mobile, tablet, and desktop widths.
- Test keyboard-only navigation, skip link, visible focus, reduced-motion mode, and no-JavaScript readability.
- Run HTML/CSS/JavaScript syntax or project checks available without adding unnecessary dependencies.
- Confirm the root remains directly deployable through GitHub Pages.
- Confirm the 15-second recruiter path exposes identity, specialization, experience, and strongest evidence; the 2-minute path exposes responsibilities, system scale, and business problems; and the 5-minute path exposes project architectures, implementation details, and supported tradeoffs.
- Work on a dedicated development branch. Do not push or deploy without explicit user approval.

## Builder decisions left open

- Exact color values, type scale, spacing scale, and microcopy may be tuned during implementation while preserving the selected visual direction.
- Use native `<details>` for project disclosures unless custom buttons materially improve the experience without reducing accessibility.
- Choose system fonts if remote font loading would compromise performance or offline resilience.
- If a current PDF matching the latest résumé is unavailable, package the verified DOCX with a clearly labeled download rather than linking the stale or deleted PDF.
