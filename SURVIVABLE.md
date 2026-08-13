# MuleinLabs ↔ HELUT — survivable layout

**Rule:** one science corpus, one publish umbrella, **no duplicated claims or TeX**.

| Concern | Lives in | Consumed by |
|---------|----------|-------------|
| Claims, code, `REPRODUCE`, textbook **TeX**, paper, campaign ledger | **HELUT** (`Digital-Defiance/HELUT`) | everyone |
| Remotion / TTS / MP4 | **MuleinLabs/`helut-videos`** | YouTube |
| Branded teaching site (MD snapshot of textbook) | **MuleinLabs/`site`** | muleinlabs.com / Pages |
| Pinned HELUT tree for CI / one-checkout | **MuleinLabs/`HELUT` submodule** | site sync, videos relative paths |

## Do not

- Copy `directives/claim-sheet.md` or textbook TeX into MuleinLabs
- Edit science inside `MuleinLabs/HELUT` for day-to-day work — use `/Volumes/Code/HELUT` (or your standalone clone), push, then **pin**
- Hand-edit `site/content/living-textbook.md` — run `npm run sync-textbook`

## Day-to-day science

```bash
cd /Volumes/Code/HELUT          # standalone clone
# … land C/H rows, make textbook, commit, push, tag helut-corpus-C*
```

## After a HELUT corpus tag (pin ritual)

```bash
cd /Volumes/Code/MuleinLabs
./scripts/pin-helut.sh helut-corpus-C34   # or omit tag → origin/main
cd site && npm run sync-textbook
# videos claimEpoch should already match from the science turn
git add HELUT site/content helut-videos/scripts/episodes 2>/dev/null
git status
git commit -m "Pin HELUT @ <tag>; refresh textbook snapshot"
git push
```

## Binaries (HELUT packaging)

Named tools live in the HELUT package (`helut-bench`, `helut-bombe`, …).
See `HELUT/directives/packaging-roadmap.md`. MuleinLabs does not rebuild them.
