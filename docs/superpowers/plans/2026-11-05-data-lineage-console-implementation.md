# Data Lineage Console Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality, permanently dark Data Lineage Console portfolio that presents Supreeth's verified experience and projects through a recruiter-first narrative, functional terminal, and accessible architecture case studies.

**Architecture:** Keep the GitHub Pages root buildless and static. Critical content remains semantic HTML so it works without JavaScript; CSS owns the responsive visual system and architecture diagrams; small ES modules provide the terminal, navigation state, mobile menu, progress, and progressive motion. Node's built-in test runner verifies content, links, document contracts, and pure interaction logic without adding runtime dependencies.

**Tech Stack:** HTML5, modern CSS, vanilla JavaScript ES modules, Node.js `node:test`, GitHub Pages, headless Chrome for local visual QA.

**Spec:** `docs/superpowers/specs/2026-11-05-portfolio-redesign-design.md`

## Global Constraints

- Remain directly deployable from the repository root through GitHub Pages; no build output or backend.
- Permanent dark theme; do not add a light-theme toggle.
- Use only claims, dates, credentials, contact details, project descriptions, and status evidence supported by the latest résumé or existing repository.
- Treat the latest résumé as authoritative for every professional fact; use the existing website/GitHub only for additional non-conflicting verified project context or links, and flag unresolved conflicts rather than guessing.
- Transform résumé facts into recruiter-friendly problem → contribution → technology → outcome narratives without copying bullets verbatim or altering claim meaning.
- Keep the professional hero content primary and the terminal secondary.
- Preserve core content, links, project summaries, and architecture explanations without JavaScript.
- Do not add React, Vite, animation libraries, analytics, a CMS, a contact backend, or runtime dependencies.
- Meet keyboard, focus, contrast, reduced-motion, semantic HTML, responsive, and no-horizontal-overflow requirements.
- Do not restore, stage, or commit the pre-existing `Supreeth_2.pdf` deletion.
- Package the newer résumé DOCX with a stable, clearly labeled filename unless a matching current PDF is supplied.
- Work on a dedicated development branch; do not push or deploy without explicit user approval.

## File Structure

- Modify: `index.html` — semantic content, recruiter-first page structure, project case studies, metadata, structured data, and module entry point.
- Create: `package.json` — marks JavaScript as ES modules and exposes dependency-free test/check scripts.
- Create: `assets/css/styles.css` — tokens, dark visual system, responsive layouts, components, architecture flows, animation, print, and accessibility states.
- Create: `assets/js/content.js` — verified profile data and terminal summaries; no rendering of critical page content.
- Create: `assets/js/terminal.js` — pure command resolver plus terminal DOM adapter.
- Create: `assets/js/main.js` — mobile navigation, section state, progress, reveal enhancement, details behavior, and terminal initialization.
- Create: `assets/icons/favicon.svg` — original SG/data-node favicon.
- Create: `assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx` — byte-for-byte copy of the newest résumé source.
- Create: `tests/content.test.mjs` — verified content, source hierarchy, prohibited claims, project status, credential, and résumé asset tests.
- Create: `tests/site-contract.test.mjs` — HTML landmarks, headings, anchors, assets, SEO, no-JS content, and external link contract tests.
- Create: `tests/styles.test.mjs` — dark tokens, responsive, focus, reduced-motion, print, architecture, and overflow prevention contract tests.
- Create: `tests/terminal.test.mjs` — command normalization, command actions, unknown input, and safe output tests.
- Create: `tests/main.test.mjs` — pure progress and active-section helper tests plus progressive-enhancement source contracts.
- Create: `README.md` — local preview, tests, content-update locations, GitHub Pages compatibility, and no-deploy status.

## Review Focus

- **JavaScript unavailable:** hero, evidence, experience, projects, architecture explanations, skills, résumé, and contact links remain visible; pinned by `tests/site-contract.test.mjs` in Task 2.
- **Missing or stale résumé:** the visible link targets the packaged non-empty latest DOCX and never `Supreeth_2.pdf`; pinned by `tests/content.test.mjs` and `tests/site-contract.test.mjs` in Tasks 1–2.
- **Unexpected terminal input:** whitespace/case are normalized, unknown commands produce help, and user input is never interpreted as HTML; pinned by `tests/terminal.test.mjs` in Task 4.
- **Narrow/mobile viewport and long content:** layouts stack, architecture nodes wrap vertically, touch controls remain usable, and the page prevents horizontal overflow; pinned by `tests/styles.test.mjs` and screenshots in Tasks 3 and 6.
- **Reduced motion and keyboard use:** animation is disabled/simplified, native details remain operable, focus is visible, and mobile navigation exposes correct ARIA state; pinned by `tests/styles.test.mjs`, `tests/site-contract.test.mjs`, and manual browser checks in Tasks 3, 5, and 6.

---

### Task 1: Development Branch, Verified Content Model, and Résumé Asset

**Files:**
- Create: `package.json`
- Create: `assets/js/content.js`
- Create: `assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx`
- Create: `tests/content.test.mjs`
- Modify: `docs/superpowers/specs/2026-11-05-portfolio-redesign-design.md`
- Create: `docs/superpowers/plans/2026-11-05-data-lineage-console-implementation.md`

**Interfaces:**
- Produces: `PROFILE`, `METRICS`, `EXPERIENCE_SUMMARIES`, `PROJECT_SUMMARIES`, `SKILL_GROUPS`, `CERTIFICATIONS`, and `TERMINAL_HELP` named exports from `assets/js/content.js`.
- Produces: stable résumé URL `./assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx` for HTML and terminal consumers.

- [ ] **Step 1: Create the development branch before production edits**

Run: `git switch -c feat/data-lineage-console`

Expected: current branch is `feat/data-lineage-console`; the existing unstaged deletion of `Supreeth_2.pdf` remains unstaged.

- [ ] **Step 2: Add the dependency-free test harness and failing verified-content tests**

Create `package.json` with `"type": "module"`, `"test": "node --test tests/*.test.mjs"`, and `"check": "node --check assets/js/main.js"`. The test suite imports all three modules, so it also parses `content.js` and `terminal.js`.

In `tests/content.test.mjs`, assert:

- exact profile name, GitHub URL, updated LinkedIn URL, email, and stable résumé path;
- exact `16M+`, `70K+`, `3K+`, and `100K+` evidence values and contexts;
- three roles with exact organizations, titles, and dates;
- EY has separate `esg` and `banking` stories;
- four projects have status `Completed`, no unverified project repository link, and verified stacks;
- eight skill categories and three exact certification URLs;
- serialized content excludes the unsupported current-site claims listed in the spec;
- the stable résumé asset exists and has non-zero size.

- [ ] **Step 3: Run the content test and verify it fails**

Run: `node --test tests/content.test.mjs`

Expected: FAIL because `assets/js/content.js` and the stable résumé asset do not exist.

- [ ] **Step 4: Implement the verified content exports**

Create `assets/js/content.js` with the named exports above. Use the exact résumé-backed details in the spec. Keep project links `null` unless verified; set all four statuses to `Completed` using the evidence recorded in the spec.

- [ ] **Step 5: Package the latest résumé without altering it**

Create `assets/resume/` and copy `/Users/supreeth/Dallas Documents/resumes/portfolio/Supreeth_GVS (1).docx` to `assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx`. Compare byte counts or checksums to confirm the copy is identical.

- [ ] **Step 6: Run the content test and verify it passes**

Run: `node --test tests/content.test.mjs`

Expected: all content and résumé assertions PASS.

- [ ] **Step 7: Commit the content foundation without staging the deleted PDF**

```bash
git add package.json assets/js/content.js assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx tests/content.test.mjs docs/superpowers
git commit -m "chore: define verified portfolio content"
```

Expected: commit succeeds; `git status --short` still shows ` D Supreeth_2.pdf` as an unstaged pre-existing change.

### Task 2: Semantic Recruiter-First Page and SEO

**Files:**
- Modify: `index.html`
- Create: `assets/icons/favicon.svg`
- Create: `tests/site-contract.test.mjs`

**Interfaces:**
- Consumes: stable profile/resume destinations and exact content from Task 1.
- Produces: DOM IDs `top`, `experience`, `projects`, `stack`, `education`, and `contact`; terminal root `#terminal`; mobile controls `#nav-toggle` and `#primary-nav`; details elements `[data-project-details]`.

- [ ] **Step 1: Write failing document-contract tests**

In `tests/site-contract.test.mjs`, read `index.html` and assert:

- one `h1`, skip link to `#main`, `main` landmark, sequential section headings, and all required IDs;
- every internal `href="#…"` resolves to an existing ID;
- hero contains visible name, Data Engineer title, specialization, introduction, Explore Work, résumé, GitHub, and LinkedIn links;
- all three evidence metrics and all three experience entries appear in static HTML;
- EY contains separate ESG Regulatory SaaS and Banking Data Warehouse labels;
- all four project names, `Completed` statuses, Problem/Architecture/Implementation/Outcome labels, and architecture summaries appear in static HTML; Engineering Decisions and Challenges appear only for projects whose supplied sources support them;
- eight skill categories, education, three certifications, and contact destinations appear;
- résumé link targets the stable DOCX with `download`; no link targets `Supreeth_2.pdf`;
- metadata includes title, description, canonical URL, theme color, favicon, Open Graph basics, and valid `Person` JSON-LD without phone data;
- module scripts load `assets/js/main.js`; stylesheet and every local asset exist;
- external links use `target="_blank"` with `rel="noopener noreferrer"` where appropriate.

- [ ] **Step 2: Run the document test and verify it fails**

Run: `node --test tests/site-contract.test.mjs`

Expected: FAIL against the old single-file page.

- [ ] **Step 3: Replace `index.html` with the semantic static experience**

Implement the complete content progression from the spec. Use static HTML for critical copy and native `<details data-project-details>` for project architecture/case studies. Include concise problem, solution, supported architecture nodes, implementation, engineering decisions only where the sources support them, and verified outcome. Add touch-friendly terminal command suggestions without making them required.

- [ ] **Step 4: Add the original favicon**

Create `assets/icons/favicon.svg` as a simple SG/data-node mark using the selected cyan and graphite palette; include accessible site metadata but mark the SVG's decorative paths appropriately.

- [ ] **Step 5: Run content and document tests**

Run: `node --test tests/content.test.mjs tests/site-contract.test.mjs`

Expected: all assertions PASS.

- [ ] **Step 6: Commit the semantic site shell**

```bash
git add index.html assets/icons/favicon.svg tests/site-contract.test.mjs
git commit -m "feat: build recruiter-first portfolio structure"
```

### Task 3: Dark Visual System, Responsive Layout, and Architecture Components

**Files:**
- Create: `assets/css/styles.css`
- Create: `tests/styles.test.mjs`

**Interfaces:**
- Consumes: class names and `data-project-details` structure from Task 2.
- Produces: reusable `.architecture-flow`, `.architecture-node`, `.architecture-connector`, `.experience-entry`, `.project-card`, `.terminal`, and responsive state styles.

- [ ] **Step 1: Write failing stylesheet-contract tests**

In `tests/styles.test.mjs`, assert that `styles.css` contains:

- dark graphite/midnight tokens, off-white text, cyan signal, amber accent, and no light-theme selector;
- base focus-visible, skip-link, button/link, terminal, card, timeline, and architecture component rules;
- `overflow-x: clip` or equivalent protection and fluid sizing via `clamp()`;
- desktop, tablet, and mobile media queries including stacked hero and vertical architecture flows;
- `prefers-reduced-motion`, `prefers-contrast`, and print rules;
- touch-friendly control sizing and at least 16px mobile form input text;
- details open/closed states that do not hide summaries without JavaScript.

- [ ] **Step 2: Run the stylesheet test and verify it fails**

Run: `node --test tests/styles.test.mjs`

Expected: FAIL because `assets/css/styles.css` does not exist.

- [ ] **Step 3: Implement the design tokens and global frame**

Define the dark palette, typography stacks, spacing, content widths, focus states, selection, body topology background, sticky navigation, section rhythm, buttons, and recruiter-first split hero. Prefer system/local font stacks unless a remote font is demonstrably necessary.

- [ ] **Step 4: Implement portfolio components**

Style the evidence strip, lineage timeline, two-story EY block, project cards, native details, responsive architecture nodes/connectors, skill groups, credentials, contact panel, terminal, and status colophon. Use borders and contrast rather than heavy glass blur or glow.

- [ ] **Step 5: Implement responsive, motion, and print states**

At tablet and mobile breakpoints, stack the hero, navigation, metrics, timeline metadata, and architecture flows. Add short reveal/data-flow animation, disable it under reduced motion, strengthen borders under increased contrast, and produce a clean printable overview.

- [ ] **Step 6: Run stylesheet and document tests**

Run: `node --test tests/styles.test.mjs tests/site-contract.test.mjs`

Expected: all assertions PASS.

- [ ] **Step 7: Commit the visual system**

```bash
git add assets/css/styles.css tests/styles.test.mjs
git commit -m "feat: add dark data-lineage visual system"
```

### Task 4: Functional Terminal

**Files:**
- Create: `assets/js/terminal.js`
- Create: `tests/terminal.test.mjs`

**Interfaces:**
- Consumes: `PROFILE`, `EXPERIENCE_SUMMARIES`, `PROJECT_SUMMARIES`, `SKILL_GROUPS`, and `TERMINAL_HELP` from Task 1.
- Produces: `resolveCommand(raw: string) -> { kind: 'print' | 'navigate' | 'open' | 'clear', lines: string[], target?: string, url?: string }`.
- Produces: `initTerminal(root: HTMLElement, options?: { onNavigate?: Function, onOpen?: Function }) -> { focus(): void, run(raw: string): void }`.

- [ ] **Step 1: Write failing command-resolver tests**

In `tests/terminal.test.mjs`, assert:

- `help`, `about`, `experience`, `projects`, `stack`, `resume`, `contact`, and `clear` return the specified action kinds and destinations;
- input is trimmed and case-normalized;
- empty input prints a concise prompt and unknown input prints a safe “command not found” plus help hint;
- `<script>`-like input remains an inert string and is never returned as trusted HTML;
- `resume` returns the stable local résumé URL;
- navigation commands target existing section IDs.

- [ ] **Step 2: Run terminal tests and verify they fail**

Run: `node --test tests/terminal.test.mjs`

Expected: FAIL because `assets/js/terminal.js` does not exist.

- [ ] **Step 3: Implement the pure command resolver**

Implement `resolveCommand` with an exact command map and no shell evaluation, dynamic code, or HTML output.

- [ ] **Step 4: Implement the terminal DOM adapter**

Implement `initTerminal` using `textContent`, a bounded output history, form submission, command suggestion buttons, focus management, `aria-live="polite"` output, and injected navigation/open callbacks. Skip decorative autotyping when reduced motion is enabled.

- [ ] **Step 5: Run terminal and syntax tests**

Run: `node --test tests/terminal.test.mjs`

Then run: `node --check assets/js/terminal.js`

Expected: all assertions PASS and syntax check exits 0.

- [ ] **Step 6: Commit the terminal**

```bash
git add assets/js/terminal.js tests/terminal.test.mjs
git commit -m "feat: add accessible portfolio terminal"
```

### Task 5: Navigation, Progress, Reveal, and Progressive Enhancement

**Files:**
- Create: `assets/js/main.js`
- Create: `tests/main.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: `initTerminal` from Task 4 and DOM IDs/classes from Tasks 2–3.
- Produces: `calculateScrollProgress(scrollTop: number, scrollHeight: number, clientHeight: number) -> number` clamped to `0..100`.
- Produces: `selectActiveSection(sections: Array<{ id: string, top: number }>, offset: number) -> string | null`.
- Produces: initialization functions for mobile navigation, progress, active links, reveal enhancement, details labels, and terminal wiring.

- [ ] **Step 1: Write failing pure-helper and source-contract tests**

In `tests/main.test.mjs`, assert:

- scroll progress returns `0` for a non-scrollable page and clamps negative/overflow values;
- active-section selection handles no sections and chooses the latest section above the offset;
- module source does not execute DOM queries before initialization;
- initialization references the required mobile-nav ARIA attributes, reduced-motion query, `IntersectionObserver` fallback, and terminal callbacks.

- [ ] **Step 2: Run main-module tests and verify they fail**

Run: `node --test tests/main.test.mjs`

Expected: FAIL because `assets/js/main.js` does not exist.

- [ ] **Step 3: Implement pure helpers and guarded initializers**

Implement and export the exact helper signatures. Add guarded initializers that safely no-op when a feature's root element is absent.

- [ ] **Step 4: Wire accessible navigation and page chrome**

Implement mobile menu toggle/close/Escape behavior with `aria-expanded`, active navigation through `IntersectionObserver`, clamped scroll progress, and smooth scrolling that respects reduced motion. Keep native anchor behavior as fallback.

- [ ] **Step 5: Wire reveals, project details, and terminal actions**

Add `.js` only after initialization begins, reveal content immediately when `IntersectionObserver` is unavailable, update architecture disclosure labels without replacing native semantics, and wire terminal navigation/resume actions.

- [ ] **Step 6: Run the full automated suite and syntax checks**

Run: `npm test`

Then run: `npm run check`

Expected: all tests PASS and all module syntax checks exit 0.

- [ ] **Step 7: Commit the interaction layer**

```bash
git add assets/js/main.js tests/main.test.mjs index.html
git commit -m "feat: add polished portfolio interactions"
```

### Task 6: Local Browser Validation, Documentation, and Release Audit

**Files:**
- Create: `README.md`
- Modify: implementation files only when validation finds a defect.

**Interfaces:**
- Consumes: completed static site and automated checks from Tasks 1–5.
- Produces: documented preview/test workflow and evidence-backed validation report; no deployment.

- [ ] **Step 1: Document the local workflow**

Create `README.md` with `python3 -m http.server 8000`, `npm test`, `npm run check`, content-source locations, the stable résumé path, GitHub Pages root deployment compatibility, and a note that deployment is intentionally not performed.

- [ ] **Step 2: Run automated verification**

Run: `npm test`

Then run: `npm run check`

Expected: zero failing tests and zero syntax errors.

- [ ] **Step 3: Start a local server and verify HTTP assets**

Run: `python3 -m http.server 8000 --bind 127.0.0.1`

Verify `/`, `/assets/css/styles.css`, all three JavaScript modules, the favicon, and the résumé return HTTP 200 with non-empty content.

- [ ] **Step 4: Verify navigation, terminal, and disclosure behavior in Chrome**

At desktop and mobile widths, exercise every navigation link, mobile-menu open/close/Escape behavior, all eight terminal commands plus unknown input, all four project disclosures, résumé download, keyboard order, visible focus, and reduced-motion emulation. Confirm no console errors.

- [ ] **Step 5: Capture and inspect responsive screenshots**

Use headless Chrome at representative `1440×1200`, `768×1024`, and `390×844` viewports. Inspect for hierarchy, clipping, overlap, horizontal overflow, readable architecture flows, and the 15-second/2-minute/5-minute paths. Fix defects and rerun relevant tests.

- [ ] **Step 6: Validate external destinations**

Check GitHub, updated LinkedIn, email syntax, canonical URL, and all three credential URLs. Record services that block automated requests as unverified-by-automation rather than treating them as broken.

- [ ] **Step 7: Measure available quality signals**

Run Lighthouse only if already available locally. Record actual scores and findings; if unavailable, report that limit without installing a dependency solely for a score. Confirm WCAG-oriented static contracts, no layout shifts from missing asset dimensions, and no unsupported claims.

- [ ] **Step 8: Commit documentation and validation fixes**

```bash
git add README.md index.html assets tests package.json
git commit -m "docs: add portfolio preview and validation guide"
```

Skip the commit if `README.md` and all implementation files are already clean from a prior commit. Never stage `Supreeth_2.pdf`.

- [ ] **Step 9: Final branch audit without push or deployment**

Run these three read-only commands separately:

- `git status --short --branch`
- `git log --oneline --decorate -6`
- `git diff main...HEAD --stat`

Expected: branch is `feat/data-lineage-console`; implementation changes are committed; the only unrelated worktree item is the pre-existing unstaged `Supreeth_2.pdf` deletion; nothing has been pushed or deployed.
