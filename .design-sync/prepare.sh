#!/usr/bin/env bash
# Regenerates the two inputs the /design-sync converter needs from this repo.
# Run from the repo root; re-run before the converter whenever component
# source or styles change. Referenced as cfg.buildCmd.
#
# This repo is a Rails + Inertia app, not a published package: it has no build
# that emits .d.ts and its stylesheet is Tailwind *source*, not compiled CSS.
# Both outputs are gitignored and fully reproducible from committed inputs.
set -euo pipefail
cd "$(dirname "$0")/.."

# 1. Declaration tree -> dist/types/. This is where the converter derives every
#    <Name>Props contract from, so it must exist before package-build.mjs.
#    tsc reports pre-existing type errors in app/frontend/pages/ (app code
#    outside the design-system surface) but still emits; don't fail on them.
echo "-- emitting declarations -> dist/types/"
node node_modules/typescript/bin/tsc -p .design-sync/tsconfig.dts.json || true
test -f dist/types/components/pill.d.ts || { echo "!! declaration emit produced nothing"; exit 1; }

# 2. Types entry. package.json "types" points here; the converter uses it as
#    the root of the export graph. Mirrors .design-sync/ds-entry.ts, with the
#    ../app/frontend/ prefix rewritten to the emitted tree's own layout.
echo "-- generating dist/types/index.d.ts"
sed 's|\.\./app/frontend/|./|g' .design-sync/ds-entry.ts > dist/types/index.d.ts

# 3. Compiled stylesheet -> .design-sync/.cache/compiled.css (cfg.cssEntry).
#    Tailwind v4 + daisyUI + the merrimack themes + vendored FontAwesome rules.
echo "-- compiling stylesheet -> .design-sync/.cache/compiled.css"
node .ds-sync/node_modules/@tailwindcss/cli/dist/index.mjs \
  -i .design-sync/ds-styles.css \
  -o .design-sync/.cache/compiled.css

echo "-- prepare.sh done"
