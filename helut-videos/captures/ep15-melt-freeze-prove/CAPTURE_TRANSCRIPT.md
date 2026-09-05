# Episode 15 literal capture transcript — preserved melt/freeze test receipt

- Capture: `episode15-local-pass`
- Role: archived receipt playback
- Tape: `episode15-local-pass.tape`
- Video: `public/captures/ep15-melt-freeze-prove/episode15-local-pass.mp4`
- Playback captured: 2026-09-05 12:51:22 PDT (MP4 completion mtime)
- Original test run: 2026-09-05 16:43:29 UTC
- Durable source log: `ep15-melt-freeze-tests.log`

Line wrapping below is normalized for readability. The MP4 is a literal visual
playback of the preserved test log; it does **not** rerun the release tests. The
durable log is a byte-for-byte copy of
`HELUT/build/episode15/ep15-melt-freeze-tests.log`.

VHS/ttyd visibly wraps or overlaps portions of a few typed command echoes at
prompt boundaries. That presentation artifact is retained in the MP4. The
projected result lines remain legible, and the preserved log is identified by a
visible SHA-256 hash at both the opening and close.

## Archived-playback disclosure and source receipt

```console
receipt$ echo 'EPISODE 15 / PRESERVED MELT-FREEZE TEST RECEIPT'
EPISODE 15 / PRESERVED MELT-FREEZE TEST RECEIPT
receipt$ echo 'ARCHIVED RECEIPT PLAYBACK - NOT A FRESH TIMING RUN'
ARCHIVED RECEIPT PLAYBACK - NOT A FRESH TIMING RUN
receipt$ echo 'Original experiment: 2026-09-05 / Apple M4 Max'
Original experiment: 2026-09-05 / Apple M4 Max
receipt$ sed -n '1,5p' $L
=== EP15 receipt: TensorLUT melt/freeze + Yosys round trip ===
date: 2026-09-05T16:43:29Z
cmd: swift test -c release --filter 'TensorFreezeMaskTests|TensorLUTYosysRoundTripTests'
host: Apple M4 Max / macOS 26.6.2
yosys: Yosys 0.68+post (git sha1 c12172fbae8af5e20f6fb52e3d4e92d56ed587b6, Release, AppleClang clang++ 21.0.0.21000101)
receipt$ shasum -a 256 $L | sed 's#captures/ep15-melt-freeze-prove/##'
1ccc05562d22de5a82775284fd6738ffe72497835b85808f73d3ab49a421c08f  ep15-melt-freeze-tests.log
```

The source command ran both suites. This capture intentionally projects only
the six freeze-mask tests and states that identity round-trip evidence is
separate.

## 1/3 — Six freeze-mask tests

```console
Test Case '-[HELUTTests.TensorFreezeMaskTests testCrossoverKeepsFrozenParentA]' passed (0.000 seconds).
Test Case '-[HELUTTests.TensorFreezeMaskTests testHostPenaltyIgnoresFrozenLUTs]' passed (0.000 seconds).
Test Case '-[HELUTTests.TensorFreezeMaskTests testMetalPenaltyMatchesHostWithFreeze]' passed (0.044 seconds).
Test Case '-[HELUTTests.TensorFreezeMaskTests testMutateSkipsFrozenLUTs]' passed (0.001 seconds).
Test Case '-[HELUTTests.TensorFreezeMaskTests testTwoBitAdderTargetedMeltDiscovers]' passed (1.092 seconds).
Test Case '-[HELUTTests.TensorFreezeMaskTests testWipeMeltRegionPreservesFrozen]' passed (0.000 seconds).
```

## 2/3 — Targeted two-bit melt and suite verdict

```console
Test Case '-[HELUTTests.TensorFreezeMaskTests testTwoBitAdderTargetedMeltDiscovers]' started.
Test Case '-[HELUTTests.TensorFreezeMaskTests testTwoBitAdderTargetedMeltDiscovers]' passed (1.092 seconds).
         Executed 6 tests, with 0 failures (0 unexpected) in 1.137 (1.138) seconds
receipt$ echo 'Observed targeted-melt time: 1.092 s inside the saved run'
Observed targeted-melt time: 1.092 s inside the saved run
receipt$ echo 'Elapsed time is an observation, not a deterministic contract.'
Elapsed time is an observation, not a deterministic contract.
```

This establishes the preserved six-test suite result. It does not turn one
elapsed-time observation into a benchmark distribution.

## 3/3 — Boundary around the visible pass

```console
receipt$ echo 'This proves the freeze-mask suite passed in the archived run.'
This proves the freeze-mask suite passed in the archived run.
receipt$ echo 'It does not emit the searched elite or re-prove it through Yosys.'
It does not emit the searched elite or re-prove it through Yosys.
receipt$ echo 'A separate identity round-trip receipt follows in the episode.'
A separate identity round-trip receipt follows in the episode.
receipt$ shasum -a 256 $L | sed 's#captures/ep15-melt-freeze-prove/##'
1ccc05562d22de5a82775284fd6738ffe72497835b85808f73d3ab49a421c08f  ep15-melt-freeze-tests.log
```

The combined durable log also contains two passing identity round-trip tests,
a 48-output-bit/16-assignment identity check, and a negative control with four
observed mismatches. Those lines are not projected in this capture and are not
used to overstate what the targeted-melt pass proves.

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 55.16 seconds
- Size: 612,563 bytes
- MP4 SHA-256: `11d195a4dc64caa62913365d189ebe6d3e985ef4b1a5169506f84f699b16d5ec`
- Tape SHA-256: `1d80aac3b38684d37f7e858363449fbf6b32c01919140a15f07ffccccd57b657`
- Durable-log SHA-256: `1ccc05562d22de5a82775284fd6738ffe72497835b85808f73d3ab49a421c08f`

## Visual validation

The v2 contact sheet and full-resolution frames at 5 and 49 seconds were
inspected. The archived-playback disclosure, source command and host, all six
freeze-mask pass lines, targeted-test timing, six-test zero-failure verdict,
timing caveat, separate-round-trip boundary, and final hash are visible.
Evidence output is legible despite the retained command-echo wrapping/overlap
artifact. Hidden setup is absent.

## Claim boundary

- This is normal-speed playback of a preserved log, not a fresh test run.
- The visible receipt establishes six freeze-mask tests passing with zero
  failures in one saved release run.
- The targeted-melt test does not emit and re-prove its searched elite through
  Yosys.
- Identity round-trip and corruption-detection output exists in the combined
  source log but is deliberately a separate episode receipt.
- The 1.092-second value is one local observation, not a timing contract.
- This receipt establishes no topology mutation, area/depth reduction, or
  general simplification result.
