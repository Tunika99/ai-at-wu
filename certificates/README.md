# Membership certificates

A4 portrait certificates in the AI Society Vienna style, one PDF per person,
with the society's rubber stamp (drawn in `generate.mjs`, `STAMP_SVG`).

## Make certificates

1. Edit `certificates.json`:
   - `certificates`: one entry per person - `name`, `template` (`member` or
     `president`), `memberSince`. Optional per person: `issued` (date text,
     default today), `number` (default ASV-<year>-001, -002, ...),
     `recognition`, `roleLine`, `title`, `about`, `signedBy`.
   - `templates`: the default texts. `{firstName}` and `{name}` are filled in.
     `signedBy` lists who signs: `["president", "vicePresident"]`.
   - `signers`: names and titles of the President and Vice President.
2. Run from the project folder:
   ```
   node certificates/generate.mjs
   ```
   PDFs land in `certificates/out/`. Add `--preview` for PNG previews.

Needs Node and Google Chrome (in /Applications).

## Signatures

- **On paper:** print and sign on the lines.
- **Digital:** save each signature as a transparent PNG -
  `signatures/president.png` and `signatures/vice-president.png` - and
  generate again; they appear above the lines. Without the files the lines
  stay empty, ready for ink.

Signatures and issued certificates are git-ignored on purpose: the website
repository is public.
