# Episode 10 capture transcript — objective-v2 correction

- Capture: `episode10-objective-correction`
- Role: current objective-v2 known-shell receipt playback
- Tape: `episode10-objective-correction.tape`
- Durable receipts: `ep10-enigma-dependent-comparison.md`, `ep10-exhaust-selftest-current.log`
- Video: `public/captures/ep10-why-it-holds/episode10-objective-correction.mp4`

This capture does not run the cracker. It deterministically plays byte-for-byte
copies of the sealed comparison and normalized self-test receipts from
`HELUT/logs/enigma-dependent-rerun-20260907T030037Z/`. That bundle binds search
objective `helut-enigma-search-n72-correlation-discounted-z-06f8694e-e08a5659-v2`
to the independent objective attestation at
`HELUT/logs/enigma-objective-calibration-20260907T025406Z/manifest.json`.

## Opening — the four-checkpoint correction

The first screen explains why objective v2 exists and prints the same 72-letter
known-shell control across four checkpoints:

| Metric | sparse August control | dense raw-bigram probe | objective v1 (superseded) | objective v2 (current) |
|---|---:|---:|---:|---:|
| Level-1 rank | 223,118 / 456,976 | 223,118 / 456,976 | 223,118 / 456,976 | 223,118 / 456,976 |
| letters correct | 4 / 72 | 21 / 72 | 25 / 72 | **25 / 72** |
| true plugs recovered | 0 / 10 | 4 / 10 | 5 / 10 | **5 / 10** |
| plugs proposed | 7 | 9 | 7 | 7 |
| final verdict | no break | no break | no break | **no break** |

Objective v1 normalized the full bigram/IC/crib attack score with raw-bigram
moments and used raw-bigram/trigram correlation. Objective v2 calibrates the
exact attack score and its paired trigram relationship. V1 and v2 recover the
same candidate; v2 corrects its objective coordinates.

## 1/3 — Level one remains blind

The screen includes the objective-v2 model ID followed by the unchanged control:

```console
Level 1 — correct wheels/rings, plugs unknown, sieve = IC over 26^4 message keys
  true key IC = 0.0379
  rank = 223118 of 456976
  percentile = top 48.825%
```

## 2/3 — Objective v2 calibrates the exact attack score

```console
Level 2 — stecker hill-climb from the TRUE rotor setting
  objective: correlation-discounted standardized bigram/IC/crib + trigram
  recovered: NNNWOLNARSUNSTTOSOITSXDMIROOONISSIKETTONZWBGNIKSIBATRONDORIVZAUDLEGSEKKS
  letters correct: 25/72 (35%)
  objective=6.7292 (true plugs: 7.7110)
  bigram=-3.2711 trigram=-3.5222 IC=0.0669
  plugs recovered: 5/10 correct, 7 proposed
```

The superseded v1 coordinates were 5.9117 for this candidate and 6.8812 for the
truth. The corrected coordinates do not change candidate identity, letters,
plugs, or verdict.

## 3/3 — Separate fail-closed final assessment

```console
Level 3 — final assessment on the recovered text
  bigram-position=1.08 IC=0.0669 trigram=-3.5222 cribs=(none)
  NO BREAK. High bigram calibration position without naval structure (bigram-fluent nonsense at this message length).

Read this as a known-shell diagnostic, not a target ceiling: this rehearsal remains NO BREAK.
```

`bigram-position` is an unbounded diagnostic coordinate, not probability or
confidence. The final assessment is a separate fail-closed policy gate. It is
not claimed to be statistically independent of ranking.

## Media receipt

- H.264/yuv420p, 1280×720, encoded at 25 fps
- Duration: 66.60 seconds
- Size: 714,758 bytes
- MP4 SHA-256: `6a9ba6fbf4d7e868153fd2d4158885088f19f1f65f7f917e53ef65131c5e0cca`
- Tape SHA-256: `b65ef696ed30e0c0604d6c2f5a5ff6a2f2010254bcc71e6fc2502f8ff8d25f57`
- Receipt SHA-256 values: recorded in `objective-correction-manifest.json`

## Visual validation

Full-resolution frames were inspected at 8, 24, 40, and 58 seconds. The v2
rationale and four-checkpoint table, comparison hash, objective-v2 model ID,
invariant rank, corrected 6.7292/7.7110 coordinates, complete recovered text,
`bigram-position=1.08`, `NO BREAK`, known-shell-not-target-ceiling boundary, and
full self-test hash are legible. No command echo wraps over evidence, and hidden
setup is not visible.

## Claim boundary

- Playback of sealed receipts; no cracking run occurred during capture.
- Both local receipt files are byte-for-byte copies of their v2 HELUT sources.
- Sparse and dense rows are historical; objective v1 is superseded; objective v2 is current.
- Objective v1 and v2 recover the same candidate; v2 corrects calibration coordinates.
- Better ranking is not a break, probability, or publication confidence.
- The final assessment is separate and fail-closed, not claimed statistically independent.
- This is one known-key 72-letter control, not a target decrypt or target ceiling.
- P1030680 remains without a key, plaintext, or break.
