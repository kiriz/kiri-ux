#!/usr/bin/env bash
# kiri-ux · check-hardcoded-colors.sh
# Anti ISC-69: no hardcoded hex/rgb/hsl literal in component CSS (all color via
# tokens). Primitives + the select-arrow data-URI are the only allowed sources.
# Exits 1 if a color literal appears in components/ or base/.
set -euo pipefail
cd "$(dirname "$0")/.."

# Allow: tokens/primitives (where literals are defined), data: URIs (SVG arrow).
violations=$(grep -rnE '#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(' components/ base/ \
  | grep -v 'data:image' \
  | grep -v '\.js:' || true)

if [ -n "$violations" ]; then
  echo "❌ Hardcoded color literals found in components/ or base/ (use tokens):"
  echo "$violations"
  exit 1
fi
echo "✅ No hardcoded color literals in components/ or base/"
