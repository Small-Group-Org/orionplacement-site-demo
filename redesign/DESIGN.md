# Orion Placement design system: "quiet law-firm stationery"

The look of a firm that partners already trust: paper, ink, one serif, one restrained accent. Proof and people carry the page, not effects.

Sources: owner's employer, candidate and designer reviews (2026-11-18); Inspo references (Everlaw, Harvard About, Humahome); reference study of legal recruiters and law firms (`ops/runs/2026-10-30-orion-placement-redo/redesign-stationery.md`).

## Colour

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FAF8F3` | Page background |
| `--surface` | `#FFFFFF` | Cards, form |
| `--band` | `#F2EEE6` | Alternate section background (max one per page in a row) |
| `--ink` | `#1A1A1A` | Headings, strong text |
| `--text` | `#3D3F44` | Body text |
| `--muted` | `#5B6472` | Secondary text. Nothing lighter on paper or white |
| `--rule` | `#E4DFD5` | Borders, dividers |
| `--accent` | `#7A2E2E` | Oxblood. Main button, links, labels. Employer pages |
| `--accent-ink` | `#5E2222` | Hover/pressed |
| `--accent-tint` | `#F4ECEA` | Selected state, highlight behind a figure |
| `--sage` | `#3F5D4E` | Candidate pages accent (replaces oxblood there) |
| `--brass` | `#7A5C17` | Stars only |
| `--error` | `#A12A1F` | Form errors |

Contrast on `--paper` (on `--band`): ink 16.4 (15.0), text 9.9 (9.1), muted 5.6 (5.2), accent 8.8 (8.0), sage 6.9 (6.3), brass 5.9 (5.4). White on accent 9.3.

Banned: navy or dark-blue backgrounds, gradients, glows, coloured shadows, backdrop blur, neon, emoji or sparkle bullets.

## Type

- Headings: **Source Serif 4** (Google Fonts, variable, real weights). Weight 400 for H1/H2 (every reference law firm uses regular weight), 600 for H3. Never faux bold.
- Body and UI: **Inter** 400/500/600. Tabular figures (`font-variant-numeric: tabular-nums`) for pay, fees and stats.
- No monospace except candidate IDs (`EP-TX-0412`), set in Inter 600 with `letter-spacing: .04em`.

| Role | Size / line-height | Notes |
|---|---|---|
| H1 | `clamp(38px, 4.6vw, 58px)` / 1.06, `-0.015em` | One per page, 2–3 lines max at 1440 |
| H2 | `clamp(28px, 3.2vw, 40px)` / 1.15 | |
| H3 | 21px / 1.3 | Serif 600 |
| Lead | 19px / 1.55 | Under H1 only |
| Body | 17px / 1.6 | Max 68ch |
| Small | 14px / 1.5 | Captions, fine print |
| Label | 13px / 1.4, 600, uppercase, `letter-spacing: .08em`, accent colour | Plain text above a heading. No pill, no background, no border |

Sentence case for headings and buttons. Italics: at most once per page, in ink, for a quotation.

## Space and layout

- Container: `max-width: 1120px`, `padding-inline: 24px` (32px at >= 768). Centred.
- Section rhythm: `padding-block: clamp(64px, 9vw, 112px)`. One rhythm everywhere.
- 12-column grid, 24px gap. Text left-aligned. Centre only the final call to action.
- Hero fits the first viewport at 1280x800: label, H1, lead, terms and the form's first fields.
- At most 6 sections on a landing page.

## Components

- **Primary button**: accent background, white text, Inter 600 16px, height 52px, radius 6px, padding 0 24px. One per screen.
- **Secondary button**: transparent, 1px `--ink` border, ink text, same size. Or a plain text link with an arrow.
- **Small button**: height 44px (minimum tap target).
- **Card**: `--surface`, 1px `--rule`, radius 8px, padding 24px, no shadow. Hover (links only): border becomes `--ink`.
- **Field**: height 48px, 16px text (prevents iOS zoom), 1px `#B9B2A6` border, radius 6px, white. Label above, 14px 600 ink. Focus: 2px accent border plus 3px `--accent-tint` ring. Error: `--error` border, message below with an icon-free sentence, linked by `aria-describedby`.
- **Focus ring** (all interactive): `outline: 3px solid var(--accent); outline-offset: 2px`.
- **Stat**: figure in serif 400 at 36px, tabular; caption 14px muted. No icon tiles.
- **Quote**: serif 400 italic 22px in ink, attribution 14px.
- **Photo**: real founder photos, warm, 4:5 or square, radius 8px. No stock boardrooms.

## Content rules

- One fact, one number, everywhere. Turnaround, volume, coverage and terms come from a single list (see run notes).
- Name the person: "Justin replies", "Screened by Jon".
- Every page says what happens after the form.
- Never state limitations; say it can be customised.
