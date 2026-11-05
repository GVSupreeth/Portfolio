# Supreeth — Data Lineage Console Portfolio

A buildless, GitHub Pages-compatible portfolio for Supreeth Gunniguntla Vidyasagar. The site uses semantic HTML, modern CSS, and small vanilla JavaScript modules; it has no runtime dependencies or compilation step.

## Local preview

From the repository root:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). Stop the server with `Ctrl+C`.

## Verification

```bash
npm test
npm run check
```

The tests verify the résumé-backed content model, internal navigation and local assets, semantic/SEO contracts, dark responsive styles, terminal commands, and interaction helpers.

## Content ownership

- `index.html` contains the complete no-JavaScript professional narrative and case studies.
- `assets/js/content.js` contains the verified summaries used by the terminal.
- `assets/resume/Supreeth_Gunniguntla_Vidyasagar_Resume.docx` is the packaged latest résumé.
- `docs/superpowers/specs/2026-11-05-portfolio-redesign-design.md` records the factual source hierarchy and design decisions.

The latest résumé is the source of truth for professional claims. The prior portfolio may add only non-conflicting, verified project context or links.

## Deployment

The repository root is directly compatible with GitHub Pages. No deployment or push was performed as part of the redesign; publishing requires explicit approval.
