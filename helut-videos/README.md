# HELUT videos (Remotion)

YouTube concept series for [HELUT](https://helut.digitaldefiance.org), housed
under **MuleinLabs** so Remotion and ElevenLabs media stay outside the science
repository.

The sibling [`HELUT`](../HELUT) checkout is the science source of truth. Its
claim sheet, reproduction commands, campaign ledger, E256 specification, and
audit receipts win over narration. Set `HELUT_ROOT` only when intentionally
checking against another HELUT checkout.

| Composition | Episode | Focus |
|---|---|---|
| `Episode00` | **What is HELUT?** | Shared compiler substrate · two core research paths · application boundaries |
| `Episode01` | **The compiler substrate** | Yosys → dependency waves → MPSGraph · application-agnostic batch axis |
| `Episode02` | **Torus FHE** | Core path: sample types · blind rotation · SING · separate receipts |
| `Episode03` | **TensorLUT** | Core path: continuous truth tables · bounded snap and emit |
| `Episode04` | **Enigma application: the P1030680 Bombe** | Chosen cleartext application · historical context · bounded Phase 51.16 result |
| `Episode05` | **E256 architecture** | Separate experimental offshoot · base-256 byte path · host/RTL boundary |
| `Episode06` | **E256 evolution without hype** | v1 autopsy · offline promotion · evidence ladder · open audit |
| `Episode07` | **Almost — the near misses** | Capability margins · named levers · withdrawn failures · living ledger |
| `Episode08` | **The encrypted processor** | PicoRV32 under FHE · store-then-load · production-size tick · bounded non-claims |

The taxonomy is deliberate:

- The Metal compiler is shared infrastructure.
- Torus FHE and TensorLUT are HELUT's two core research paths.
- P1030680/Enigma is one concrete application chosen to exercise the cleartext
  compiler, batch engine, and related TensorLUT machinery.
- E256 is a later, separate experimental crypto offshoot inspired by lessons
  from that application—not a third HELUT pillar.

The series framing is **living research on living silicon**. Every episode is
stamped with a claim epoch because the ledger is expected to move: claims get
re-measured, corrected, withdrawn, and sometimes recovered by a better route.
Episode07 is the explicit statement of that posture — it presents capability
near misses as measured margins with named levers, including two "failures"
that turned out to be measurement bugs and seven rows that had *understated*
the code. When a narrated claim changes upstream, update the script and the
epoch before regenerating speech.

Scripts preserve these evidence boundaries:

- P1030680 remains unbroken; a stop is not a candidate, gate, key, or decrypt.
- Operational Enigma was not universally “unbreakable without a crib”; the
  short target has a specific information deficit and incomplete coverage.
- E256 responds to selected M4 attack conveniences, but has no established
  comparative security level and must not protect real data.
- Runtime E256 mutation is disabled. Profile search is offline, deterministic,
  fail-closed, versioned, and subject to explicit promotion.
- The anti-fascist and Turing framing is the author's personal ethical
  motivation, not cryptographic evidence or a claim of historical equivalence.

## Living sync and preflight

Every episode carries `claimEpoch`, which must match HELUT `\livingepoch` in
[`textbook/preamble.tex`](../HELUT/textbook/preamble.tex), currently
**2026-08-20 / C69**. Descriptions must carry the same `Epoch C…` label.

```bash
npm run check          # typecheck + HELUT epoch sync + schema/assets/pacing
```

When HELUT changes a public **C**, **H**, or **N** assertion, update the scripts,
diagrams, and epoch before generating new speech.

## Pipeline

```text
episode JSON  →  Remotion compositions  →  MP4
       ↓                    ↓
(optional) ElevenLabs TTS   authored SVG figures
       ↓
public/audio/<episode>/…
```

```bash
cd /Volumes/Code/MuleinLabs/helut-videos
npm install
npm run check
npm run studio

npm run tts             # no key: complete no-cost dry-run plan

export ELEVENLABS_API_KEY=…
# Audition one explicit scene before any bulk, billable run.
npm run tts -- --episode ep04-p1030680-bombe --scene tolerant-board
npm run tts -- --episode ep05-enigma256-architecture --scene title

npm run render:ep04
npm run render:ep05
npm run render:ep06
npm run render:ep07
npm run render:ep08
```

The default narrator is `NtS6nEHDYMQC9QczMQuq`. Do not change
`ELEVENLABS_VOICE_ID` accidentally. `npm run tts` runs the full preflight first;
without an API key it stays free and uses conservative fallback timings.

Spoken text passes through `scripts/lib/speakable.mjs`. The ElevenLabs lexicon
is `scripts/tts/helut-academy.pls`. The intended series pronunciations are:

- **HELUT**: “HEE-lyoot,” stylized **HELÜT** (`/ˈhiːl.juːt/`)
- **TensorLUT**: “Tensor-lut”
- **JSON / JSONL**: “JAY-sahn” (Japanese *san*) / “JAY-sahn lines”
- **Mulein**: “mull-een”

### What still needs synthesis

Never reconstruct this from memory or notes. It is computable from the repo:

```bash
npm run tts:pending              # free, local, no API key, no network call
npm run tts:pending -- --commands            # just the commands
npm run tts:pending -- --terms HELUT,TensorLUT,JSON   # narrow the lexicon tier
```

It classifies every scene as **NEW** (no audio yet), **CHANGED** (spoken text
differs from the generated clip), **DICTIONARY** (text unchanged but the lexicon
moved under it), or **OK**, lists orphaned clips whose scene id no longer exists,
and prints the exact billable commands ending with an audition step. Safe to run
after an arbitrarily long gap — that is the point.

### Dictionary and fingerprints

The lexicon is uploaded by the same keyed command that synthesizes, so a refresh
is never free. Two facts drive the workflow:

- A sync mints a **new dictionary version**, and that version is part of every
  clip's plan fingerprint. After a sync, every previously generated clip is
  nominally stale.
- Supplying a dictionary switches the model to `eleven_flash_v2`. Without one it
  is `eleven_multilingual_v2`. Mixing those across a series would be audibly
  inconsistent, so the whole series should land on one dictionary version.

Therefore: if `tts:pending` reports the lexicon as edited, do the audition, then
run `--stale` and let the series converge on the new version. If it reports the
lexicon as current, regenerate only the named scenes and do **not** run
unfiltered `--stale`. Let `tts:pending` decide — it prints the right one.

Generated clips are normalized to mono 44.1 kHz, −16 LUFS, true peak −1.5 dB.
Normalize an existing episode without new synthesis:

```bash
npm run tts -- --normalize --episode ep05-enigma256-architecture
```

## Script and figure conventions

`scripts/episodes/*.json` is validated against `src/lib/schema.ts`. Scene kinds
are `title`, `narration`, `concept`, and `outro`. Optional `backgroundAsset`
filenames resolve under `public/story/<episode-id>/`.

Figures are authored at 1920×1080. Keep the top-left copy region and lower
caption band clear. Captions show one active sentence; ElevenLabs alignment is
preferred, while silent previews allocate fallback time by sentence word count.
Measured MP3 duration plus a 0.9-second tail replaces fallback timing after TTS.

## Production bar

- Define a term before relying on it; expand acronyms on first spoken use.
- Narrate conclusions and relationships. Keep dense receipts in figures,
  descriptions, and source links.
- Preserve bounded language for FHE, TensorLUT, the Enigma application, and the
  E256 offshoot.
- Audition **HELUT**, **TensorLUT**, **JSON**, **Mulein**, Grund, Bombe, E256,
  identifiers, and number delivery before bulk synthesis.
- Watch every 1920×1080 scene after real audio exists. Check caption wrapping,
  figure labels, cuts, pronunciation, and audio tails.
- Render only after `npm run check` is green and the voice auditions pass.
