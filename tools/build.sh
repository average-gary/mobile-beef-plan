#!/usr/bin/env bash
# Build the static site into _site/. Run from anywhere; needs pandoc (>= 3.1).
set -euo pipefail
cd "$(dirname "$0")/.."

PLAN=.wiki/output/business-plan-mobile-beef-2026-10-02
GH=https://github.com/average-gary/mobile-beef-plan/tree/main/.wiki/raw
# The sed escapes the "|" in [[slug|Title]] so it can't split a pipe-table cell; wikilinks.lua does the rest.
render() {
  local f=$1; shift
  sed -E 's/\[\[([^]|]*)\|/[[\1\\|/g' "$f" |
    pandoc -f markdown --standalone --template tools/page.html --lua-filter tools/wikilinks.lua "$@"
}

rm -rf _site
cp -R site _site
rm -f _site/_shell.html
mkdir -p _site/plan _site/wiki

render "$PLAN.md" -M root=../ -M titleblock=1 -M nav-plan=1 -M pdf="$(basename "$PLAN.pdf")" --toc --toc-depth=2 --shift-heading-level-by=1 -o _site/plan/index.html
cp "$PLAN.pdf" _site/plan/

meta=$(mktemp); trap 'rm -f "$meta"' EXIT
printf -- '- [$title$]($cat$/$slug$.html) — $summary$\n' > "$meta"

{
  printf -- '---\ntitle: Research\n---\n\n# Research wiki\n\n'
  printf 'Compiled articles behind the [business plan](../plan/) ([PDF](../plan/%s)). ' "$(basename "$PLAN.pdf")"
  printf 'Raw sources are on [GitHub](%s).\n\n' "$GH"
  for cat in topics concepts references theses; do
    files=(.wiki/wiki/$cat/[!_]*.md)
    [ -e "${files[0]}" ] || continue
    mkdir -p "_site/wiki/$cat"
    printf '## %s\n\n' "$(tr '[:lower:]' '[:upper:]' <<<"${cat:0:1}")${cat:1}"
    for f in "${files[@]}"; do
      slug=$(basename "$f" .md)
      render "$f" -M root=../../ -M nav-wiki=1 -o "_site/wiki/$cat/$slug.html"
      pandoc "$f" -t markdown --template "$meta" -V cat="$cat" -V slug="$slug"
    done
    echo
  done
} > _site/wiki/index.md
render _site/wiki/index.md -M root=../ -M nav-wiki=1 -o _site/wiki/index.html
rm _site/wiki/index.md

echo "built _site: $(find _site -name '*.html' | wc -l | tr -d ' ') html files"
