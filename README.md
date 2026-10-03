# mobile-beef-plan

Business plan and research for a custom-exempt mobile beef harvest-and-cutting business,
backed by a hanging/aging cooler, in Virginia's Shenandoah Valley.

- `.wiki/` — the research wiki (sources, compiled articles, business plan PDF). History preserved from the
  `average-gary/wiki` hub, where it began as `topics/mobile-beef-processing`.
- `site/` — the interactive planning website, published on GitHub Pages.

Research draft: not legal, tax or financial advice.

## Site

Live at <https://average-gary.github.io/mobile-beef-plan/>:

- **Pro forma calculator:** every assumption is editable and tagged *sourced* or *placeholder*. Scenarios are kept in the URL, so you can share a link.
- **Business plan and research:** rendered from `.wiki/` by pandoc, with a PDF download.
- **Diligence tracker:** the 10 calls and grant deadlines. Progress is saved in your browser only.

Build and preview locally (needs pandoc ≥ 3.1 and Node ≥ 22):

```sh
node --test tests/*.test.mjs     # pro forma reproduces the business plan's numbers
bash tools/build.sh              # → _site/
python3 -m http.server -d _site  # http://localhost:8000
```

Every push to `main` runs the tests and the build, then deploys to Pages (`.github/workflows/pages.yml`).
`tools/reference/proforma.py` is the original model behind the PDF's tables, kept as the reference for the tests.
