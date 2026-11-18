# Orion Placement site demo

Clickable static prototype of the Orion Placement website, plus a demo of the employer flow: describe the seat in one line, see anonymous candidates, unlock the redacted resume, accept the one-page terms on the page, book the interview.

**Prototype only. Candidates, firms, pay figures and terms are sample data, not real people or offers.** Forms send nothing. Every page is `noindex`.

- Site: `index.html` (18 pages, shared `assets/`)
- Flow demo: `demo-flow/index.html` (one self-contained file; `?entry=email` opens the cold-email version)
- Ad landing page: `hire-attorneys/index.html` (no site nav; `?practice=&level=&city=` matches the ad; highlighted claims still to confirm)

Run locally: open `index.html`, or `python3 -m http.server 8811` in this folder.
