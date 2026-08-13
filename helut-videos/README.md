# HELUT videos (Remotion)

YouTube concept series for [HELUT](https://helut.digitaldefiance.org) —
housed under **MuleinLabs** so Remotion / ElevenLabs media stays out of the
science repo. Same pipeline pattern as Subspace Lattice `apps/academy-videos`,
slimmed for research intros (no board / mission figures).

Science source of truth remains
[`/Volumes/Code/HELUT`](../../HELUT) (claim sheet, reproduce commands).

| Composition | Episode | Focus |
|---|---|---|
| `Episode00` | **What is HELUT?** | Stack overview · three pillars · non-claims |
| `Episode01` | **Pillar I — Metal compiler** | Yosys → MPSGraph · batch axis · cleartext fitness |
| `Episode02` | **Pillar II — Torus FHE** | Blind-rotate LUTs · certificates · SING |
| `Episode03` | **Pillar III — TensorLUT** | Continuous INIT · melt / involution · parallel to campaign |

Scripts are honest to
[`HELUT/directives/claim-sheet.md`](../../HELUT/directives/claim-sheet.md):
no implied P1030680 decrypt, no “we invented TFHE,” campaign fitness ≠
encrypted tick rate.

## Living sync

Each episode JSON carries `claimEpoch`, which must match HELUT
`\livingepoch` in [`textbook/preamble.tex`](../../HELUT/textbook/preamble.tex)
(currently **2026-08-14 / C54**). Claim sheet wins if they disagree.

```bash
npm run sync:check          # fail if any episode lags \\livingepoch
```

When HELUT lands a new **C** / **H** / **N** that VO asserts, agents follow
`HELUT/.cursor/rules/helut-videos-sync.mdc`: patch scripts + bump `claimEpoch`
in the same turn as the science. Do not re-TTS until you ask.

## Pipeline

```
episode JSON  →  Remotion compositions  →  MP4
       ↓
  (optional) ElevenLabs TTS → public/audio/…
```

```bash
cd /Volumes/Code/MuleinLabs/helut-videos
npm install
npm run studio          # Remotion Studio preview

export ELEVENLABS_API_KEY=…
# Voice defaults to Subspace Lattice academy narrator (NtS6nEHDYMQC9QczMQuq).
# Do not set ELEVENLABS_VOICE_ID unless you want a different narrator.
npm run tts             # dry-run without key; synth + −16 LUFS with key

npm run render:ep00     # → out/ep00-what-is-helut.mp4
```

Without a key, `npm run tts` dry-runs and scenes use `durationHintSec`.
Spoken lines run through `scripts/lib/speakable.mjs`. Pronunciation for
HELUT jargon lives in `scripts/tts/helut-academy.pls` (uploaded via
ElevenLabs `add-from-rules` when a key is present). Force a lexicon
re-upload with `npm run tts -- --sync-dictionary`.

Re-run TTS after script changes; use `--episode` / `--scene` / `--stale`
to limit spend. Normalize existing mp3s without re-billing:

```bash
npm run tts -- --normalize --episode ep00-what-is-helut
```

## Script schema

`scripts/episodes/*.json` — Zod schema in `src/lib/schema.ts`.

Scene kinds: `title` · `narration` · `concept` · `outro`.

Optional per-scene `backgroundAsset` (filename under
`public/story/<episode-id>/`) and `bgm` (path under `public/`, or
`episode:bed.mp3`). Episode-level `bgm` is the default; scene `bgm: null`
silences a beat. Consecutive identical beds share one continuous
`<Audio>` with VO ducking (`SmartBgm`).

Edit JSON → refresh Studio. Timing follows MP3 length + ~0.9s tail pad
when TTS clips exist.

## Layout

```
helut-videos/
  public/fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.woff2
  public/audio/<episode-id>/*.mp3   # TTS (gitignored)
  public/story/<episode-id>/        # optional stills
  public/soundtrack/                # optional BGM beds
  scripts/episodes/*.json
  scripts/generate-tts.mjs
  src/compositions/Episode.tsx
  src/components/Scenes.tsx
```

Typography matches the site: **Fraunces** (display headlines) + **Outfit**
(body / captions / kickers) via `src/lib/fonts.ts`.

## AI production notes

- **Authoring**: keep voiceover aligned with the HELUT claim sheet; print hedges.
- **TTS**: ElevenLabs via `scripts/generate-tts.mjs` — **same voice as
  Subspace Lattice academy** (`NtS6nEHDYMQC9QczMQuq`). Override only with
  `ELEVENLABS_VOICE_ID` if you intentionally want a different narrator.
- **Captions**: `concept` beats use ElevenLabs `with-timestamps` alignment
  (`*.alignment.json`) via `SyncedCaptions`.
