#!/usr/bin/env bash
# Pin the HELUT submodule to a tag or commit, then print next steps.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
REF="${1:-origin/main}"

git submodule update --init HELUT
git -C HELUT fetch --tags origin
git -C HELUT checkout --detach "$REF"
echo "HELUT now at: $(git -C HELUT rev-parse --short HEAD) ($(git -C HELUT describe --tags --always))"
echo "Next: cd site && npm run sync-textbook && git add HELUT site/content && git commit"
