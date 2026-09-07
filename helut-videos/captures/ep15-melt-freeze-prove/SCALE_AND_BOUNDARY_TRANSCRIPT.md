# Episode 15 capture record — scale and boundary

A **live run**, recorded during filming, not playback of a preserved log. This is
the second live capture in the series (after the two Episode 0 tapes); the
existing `episode15-local-pass` capture is archived log playback and stays
labelled that way.

- Tape: `captures/ep15-melt-freeze-prove/episode15-scale-and-boundary.tape`
- Video: `public/captures/ep15-melt-freeze-prove/episode15-scale-and-boundary.mp4`
- Captured: 2026-09-05
- Encoded media: H.264/yuv420p, 1280×720, 25 fps, 83.72 seconds, 593,777 bytes
- MP4 SHA-256: `b4446d44ea1edd4de331f94f7009bca48addf6d9584e8716ec3e73f5637827bc`
- Tape SHA-256: `1944c9a5601bc6ce654354b2c42be52b06a1d9b34e3142e1e51482fb99aeec22`

## Why the prebuilt bundle is invoked directly

The tape calls the release xctest bundle rather than `swift test`:

```bash
B=.build/arm64-apple-macosx/release/helutPackageTests.xctest
xcrun xctest -XCTest HELUTTests.TensorLUTMeltScalingTests/<name> $B
```

`swift test` re-plans the build on every invocation, which added tens of seconds
of unpredictable dead time and made two earlier takes overrun their windows —
keystrokes for the next beat queued into the still-running process. Calling the
prebuilt bundle removes the build variance. It is the same test code and the same
assertions; only the launcher differs. Measured direct wall time for the axis-D
test was **24.91 s** (`/usr/bin/time -p`).

## 1/2 — Train on 0.10% of the input space, prove over 100%

```console
helut$ melt testSearchConvergesFromSampledStimulusAndStillProves
MELT_SCALING sampled gen=500 rows=64/65536 (0.10%) → PROVED fitness=0.0 search=7.14s
MELT_SCALING sampled gen=500 rows=256/65536 (0.39%) → PROVED fitness=0.0 search=9.13s
MELT_SCALING sampled gen=500 rows=1024/65536 (1.56%) → PROVED fitness=0.0 search=9.69s
MELT_SCALING axis-D (8-bit adder, 2-LUT melt, sampled training stimulus)
  bits  LUTs  melted  rows   space   search_s  fitness    frac  frozen  erased        searched
     8    16      2     64   65536      7.14    0.0000     0     yes  REFUTED       PROVED
     8    16      2    256   65536      9.13    0.0000     0     yes  REFUTED       PROVED
     8    16      2   1024   65536      9.69    0.0000     0     yes  REFUTED       PROVED
MELT_SCALING sampling verdict: search cost DECOUPLES from input space — 64 of 65536 rows (0.10%)
sufficed, and the result is formally proven over all 65536 assignments.
```

An 8-bit ripple adder holds 16 LUTs over a 65,536-assignment input space. Two
tables are erased. The search sees only the sampled `rows` column; the proof
quantifies over `space`. The `erased` column reads `REFUTED` on every row, so the
starting fixture was genuinely broken and the proof is not vacuous.

The `search_s` values here run higher than the archived receipt
(`logs/helut-melt-scaling-20260905T225142Z.log`: 5.46 / 5.96 / 7.55 s). That is
ordinary run-to-run variance on one host and is why the narration describes the
structure rather than quoting a single timing. Per
`HELUT/directives/claim-sheet.md`, a cold run can be 2.4× a warm one.

## 2/2 — The boundary: erase everything and the answer goes binary but wrong

```console
helut$ melt testMeltScalingByMeltRegionSize
MELT_SCALING axis-B boundary: melting 8 of 8 LUTs did not prove — REFUTED, 0 fractional entries, fitness
-16.0
MELT_SCALING axis-B (fixed 4-bit adder, growing melt region)
  bits  LUTs  melted  rows   space   search_s  fitness    frac  frozen  erased        searched
     4     8      2    256     256      1.56    0.0000     0     yes  REFUTED       PROVED
     4     8      4    256     256      1.55    0.0000     0     yes  REFUTED       PROVED
     4     8      6    256     256      1.55    0.0000     0     yes  REFUTED       PROVED
     4     8      8    256     256      1.56  -16.0000     0     yes  REFUTED       REFUTED
```

Melting 2, 4, or 6 of 8 tables proves. Melting all 8 is no longer repair — there
is no frozen anchor to search around — and it returns a **fully binary** result
(`frac` 0) that is nonetheless wrong (`REFUTED`, fitness −16). This is the single
most useful line in the episode: freezing is not correctness.

Axis C, not in this capture, shows the same cold-start case proving at 500
generations instead of 120, which makes it a budget lever at this size rather
than a wall.

## Regenerate locally

```bash
vhs validate captures/ep15-melt-freeze-prove/episode15-scale-and-boundary.tape
vhs captures/ep15-melt-freeze-prove/episode15-scale-and-boundary.tape
```

Requires a current `swift build -c release` so the xctest bundle exists, plus
`yosys` on PATH. Without Yosys both tests `XCTSkip` and the screens come back
empty.

## Composition contract

Remotion asset path `captures/ep15-melt-freeze-prove/episode15-scale-and-boundary.mp4`,
foreground `capture` scene, **83.72-second** duration floor, normal playback
speed, muted terminal audio. Narration longer than the media falls through to a
static completion mat rather than looping the evidence.

## Claim boundary

- Both screens are combinational. No flip-flops appear in either proof loop.
- The search moves LUT `INIT` values on fixed topology. It does not add, remove,
  or rewire cells, so this is not structural logic synthesis.
- Sampled-stimulus generalisation is demonstrated for a 2-LUT melt on an 8-bit
  ripple adder. It is not established for arbitrary circuits or melt sizes.
- The proof is Yosys `miter -equiv` plus `sat -prove trigger 0` (minisat) against
  a behavioural Verilog `+` reference, run on the post-`abc -lut 6` artifact.
- Cold-start (8 of 8) is refuted at this budget. Axis C reaches it at 500
  generations on a 4-bit adder; that is not a general cold-start synthesis claim.
- Discovered circuits map to the same post-ABC LUT count as hand-designed ones
  (6 vs 6), so no area or depth improvement is claimed.
- Timings are single local observations on one Apple M4 Max, not distributions.
