# Capture records — 2026-09-05/06 batch

This index covers both live runs recorded during filming and explicitly labeled
playback of preserved evidence. Capture mode is part of each receipt; playback
must never be described as a fresh timing run.

The final `episode14-native-and-lanes` definition is now sealed receipt playback
rather than live benchmark execution. Its replacement MP4 is pending. The stale
pre-final MP4 remains on disk only as an identified superseded artifact and is
not valid final media. `episode14-current-receipt.mp4` and
`episode15-local-pass.mp4` also remain on disk with their original transcripts,
but no episode scene references them.

This batch covers 8 of the 16 episodes; the table distinguishes live footage
from deterministic playback. Series-wide coverage after the later
receipt-playback pass is recorded at the end of this file.

| Episode | Capture | Duration | Mode |
|---|---|---:|---|
| ep07 | `episode07-determinism-guard` | 124.48 s | live |
| ep08 | `episode08-encrypted-cpu` | 47.00 s | live |
| ep09 | `episode09-radio-match` | 60.28 s | live |
| ep14 | `episode14-native-and-lanes` | 71.64 s | sealed receipt playback |
| ep14 | `episode14-enigma-live` | 63.88 s | live |
| ep15 | `episode15-scale-and-boundary` | 83.72 s | live |
| ep15 | `episode15-freeze-and-roundtrip` | 60.68 s | live |

## Why several tapes call the xctest bundle directly

Where a beat runs Swift tests, the tape invokes the prebuilt release bundle:

```bash
B=.build/arm64-apple-macosx/release/helutPackageTests.xctest
xcrun xctest -XCTest HELUTTests.<Suite>/<test> $B
```

`swift test` re-plans the build on every invocation. Two early takes overran
their sleep windows because of it, and keystrokes for the following beat queued
into the still-running process and corrupted the screen. Calling the prebuilt
bundle removes that variance. Same test code, same assertions, different
launcher. Requires a current `swift build -c release` first.

---

## ep07 — `episode07-determinism-guard` (124.48 s, live)

Command: `python3 Scripts/determinism_cross_process.py --runs 5 --verbose`
Measured wall: **98.60 s** (`/usr/bin/time -p`).

```console
cross-process determinism: 5 separate processes
  run 0: 7faabcf86438dc05
  run 1: 7faabcf86438dc05
  run 2: 7faabcf86438dc05
  run 3: 7faabcf86438dc05
  run 4: 7faabcf86438dc05
PASS all 5 processes agreed: 7faabcf86438dc05
```

This is the guard named in the episode's own `failure-that-wasnt` scene. The
encrypted path had iterated primary inputs in `Dictionary` order while drawing
from one shared RNG; Swift reseeds Dictionary hashing per process, so masks
depended on the seed. It cost a claim — an *n*=512 covering adder was filed as a
noise FAIL and later withdrawn.

Boundaries: the fingerprint value is configuration-specific and is **not**
narrated as a constant (`REPRODUCE.md` quotes a different one for a different
configuration). `SWIFT_DETERMINISTIC_HASHING` must stay unset or the script
refuses with exit 2. The "3 distinct fingerprints across 6 processes" figure for
the reintroduced bug is quoted from `REPRODUCE.md`, not filmed here.

## ep08 — `episode08-encrypted-cpu` (47.00 s, live)

```bash
N=Generated/Netlists/PicoRV32/picorv32_lut6_netlist.json
.build/release/helut-bench --bench $N --degree 64 --bench-encrypted --cpu-only \
  --sing --vectors 1 --paths 'blind-rotate public-ms boolean' | sed -n '1,17p'
```

Measured wall: **0.69 s**. On screen: `poly N=64  LUTs=2006  DFFs=1565
sequential`, then `wall 0.1757 s (175.66 ms/row)`, `classical bits 32.0 (≥128?
no)`, `noisy BK bound 0 (exactNoiselessConstruction; decodable true)`, `result
PASS`.

Boundaries: *N*=64 CPU is a demonstration parameter. The harness prints its own
32-bit hardness and its own "no" against 128. Exact-noiseless bootstrap key
construction. This is correctness on encrypted state, not production security,
and it is not the *N*=1024 Metal path.

## ep09 — `episode09-radio-match` (60.28 s, live)

```bash
.build/release/helut-radio --selftest
.build/release/helut-radio --feed --netlist regex_netlist.json --text 'SENDING DEFCON ALERT DEF'
.build/release/helut-radio --feed --netlist regex_netlist.json --text 'NOTHING TO SEE HERE'
```

Selftest measured wall: **0.28 s**. It prints module, `inputs: 3 ports / 24
bits`, `outputs: 1 ports / 1 bits`, and `feed "XXDEFYYDEFZZ" → hits at [4, 9]
PASS`. The feed prints one line per byte with `★ MATCH` on a hit — matches land
at bytes 10 and 23 in the first stream, and the negative stream fires nothing.

Boundaries: clear Boolean oracle only. No antenna, no over-the-air signal,
nothing intercepted, and no GNU Radio needed for this capture. The circuit is a
fixed three-byte ASCII literal, not a general regex engine. Encrypted evaluation
is not shown here; `--mode encrypted-demo` returns too fast to be filmed as
encrypted work and was deliberately left out.

## ep14 — `episode14-native-and-lanes` (sealed playback; render pending)

The timing-sensitive native comparison is no longer defined as a live filming
run. `episode14-native-and-lanes.tape` now performs deterministic playback of
`ep14-native-final-receipt.txt`; it requires only `bash` and `shasum` at playback
time and invokes no XCTest, Verilator, Yosys, or `helut-bench` command.

The accepted B=65,536 rows shown by the planned playback are:

```text
NATIVE_BASELINE 65536  0.000921965  0.007094667  0.130x  match 52f209ab0358725
NATIVE_PAIRED  65536  0.008544087  0.007421917   16  1.151x  match 52f209ab0358725
NATIVE_PAIRED crossover: none through B=65536 against configured parallel Verilator.
```

`NATIVE_BASELINE` remains the historical asymmetric scope: warmed synchronized
HELUT graph execution versus scalar native assignment/evaluation/readback and
digest. It is not the throughput verdict. `NATIVE_PAIRED` is the accepted direct
comparison from deterministic preparation through strict readback and the same
ordered digest inside both timers. HELUT measured **8.544087 ms** versus
**7.421917 ms** for 16-worker Verilator: **1.151197×, or 15.1% slower**, with a
**1.122170 ms** remaining gap and no paired crossover through B=65,536.

The final HELUT phase medians at that width are assignment `0.029922 ms`, input
pack `0.528932 ms`, graph `0.766039 ms`, strict decode `0.548005 ms`, and ordered
digest `6.676912 ms`. Independent phase medians are diagnostics, not a new
end-to-end ratio; the digest remains required shared work inside both paired
timers.

The same ledger also presents the separately sealed lane evidence:

```text
Production distinct receipt: PASS
lanes=65536 distinct_inputs=65536 checked_output_bits=589824 mismatches=0
unique_output_signatures=511 digest=fnv1a64-3f03b6872d46d5a5

BATCH_LANES negative control: lane 37 corruption produced 5 mismatch(es)
digest 2c81f1c165bf1edd -> a06c2874ad01d2c4
```

The corruption control belongs to a **256-lane** fixture, not the 65,536-lane
production receipt. See `NATIVE_AND_LANES_TRANSCRIPT.md` and
`native-and-lanes-manifest.json` for the exact source/XCTest/evidence/generated
artifact hashes and the complete claim boundary.

Presentation hashes:

- Ledger SHA-256: `3e716bbf902cff89859458b898d157a8f2314f62ad165871fc25feaff991dc5c`
- Tape SHA-256: `2722b597c32ea20acb04cc960fc4c525d8eb12a2fd25e1b553313d268b5ce681`

**Media status:** rendered and reviewed. MP4 SHA-256
`1190a00091346c46c05fc130d2be0d0359954ab9f41f758ce59df779a7e98318`,
71.64 s, 754,522 bytes. Frames inspected at 9, 26, 45, and 60 s. This replaced
the superseded live-run footage
`daf31d5c3c7688a25a1ebf79ddbf482a4dea53e2de66c87d7f0cfdc723b971ac`,
which predated the final paired receipt.

Boundaries: one degree-1 cleartext combinational 8-bit ripple adder (14 mapped
LUTs, 0 DFFs), one Mac16,5 host, and five unpinned trials at eight widths. The
million-lane graph sweep is another fixture with projected high-width native
values. No general HDL, sequential, encrypted, CXXRTL, cross-host,
best-possible-native, or Apple-superiority claim follows.

## ep15 — `episode15-scale-and-boundary` (83.72 s, live)

See `SCALE_AND_BOUNDARY_TRANSCRIPT.md` for the full record.

- MP4 SHA-256: `b4446d44ea1edd4de331f94f7009bca48addf6d9584e8716ec3e73f5637827bc`
- Tape SHA-256: `1944c9a5601bc6ce654354b2c42be52b06a1d9b34e3142e1e51482fb99aeec22`

---

## Regenerate or validate a capture

For the final ep14 native receipt playback:

```bash
vhs validate captures/ep14-skeptics-benchmark/episode14-native-and-lanes.tape
vhs captures/ep14-skeptics-benchmark/episode14-native-and-lanes.tape
```

Playback requires `bash` and `shasum`; it does not require a HELUT build, Yosys,
Verilator, XCTest, or a benchmark command. Rendering will overwrite the stale
MP4 at the declared output path, so hash, probe, and visually review the new
media before updating its manifest from pending to complete.

For the other live captures, use the corresponding tape path:

```bash
vhs validate captures/<episode>/<tape>.tape
vhs captures/<episode>/<tape>.tape
```

Those live experiment tapes may require `swift build -c release` in the sibling
`HELUT` checkout plus Yosys and Verilator on `PATH`. Without Yosys, applicable
melt/prove tests `XCTSkip` and their screens come back empty.

## Known cosmetic artifact

VHS/ttyd visibly overlaps the tail of a long typed command echo at prompt
boundaries, so the first line of some screens reads e.g. `cho '2/2 ...helut$
echo '2/2 ...`. This is present in the pre-existing Episode 0/12/13 captures too
and is retained rather than hidden. Keeping echoed labels under about 60
characters reduces it.

---

## ep14 — `episode14-enigma-live` (63.88 s, live)

Replaces the archived `episode14-current-receipt` playback with a live run of the
same experiment. Measured wall for one pass: **1.68 s**, which is why three more
passes fit on the second screen.

```bash
E='--bench enigma_netlist.json --degree 1024 --batch 1 --ticks 10 --warmup 1 --reset-hold 3 --bench-equiv'
.build/release/helut-bench $E   # screen 1, filtered to decisive lines
for i in 1 2 3; do .build/release/helut-bench $E | grep -E 'steady Hz|result '; done
```

Screen 1 shows `N=1024 B=1`, `batch mode: legacy-broadcast-v1`, `encoding:
constant-fill (trivial, noise-free)`, `Compiled module 'enigma_core': 10 inputs,
688 LUTs, 26 DFFs, 8 outputs`, `COMPILE total 0.0378 s`, `tick 1 (JIT) 0.3025 s`,
`steady avg 0.0146 s/tick`, `steady Hz 68.53`, then the equivalence block with
`plaintext` / `clear` / `metal` all reading `KEINEBESONDERENEREIGNISSE` and
`result PASS`.

Screen 2 filmed **66.50, 67.06, 67.23** ticks/s, all PASS. With screen 1's 68.53
that is four passes in one sitting spanning about 2.6 Hz, which is the concrete
justification for quoting a median rather than a single number
(`HELUT/directives/claim-sheet.md` notes a cold run can be 2.4× a warm one).

Boundaries: B=1 broadcast, constant-fill and noise-free, so not encrypted and not
a batch-throughput result. The tool prints both of those labels itself.

## ep15 — `episode15-freeze-and-roundtrip` (60.68 s, live)

Replaces the archived `episode15-local-pass` playback. Two suites via the
prebuilt bundle:

```bash
xcrun xctest -XCTest HELUTTests.TensorFreezeMaskTests $B          # 1.39 s, 6 tests
xcrun xctest -XCTest HELUTTests.TensorLUTYosysRoundTripTests $B   # 14.39 s
```

### New result: sequential repair is now proven

The round-trip suite now prints two `TENSORLUT_SEQUENTIAL_EQUIV` lines that had
**no archived receipt** before this pass:

```
TENSORLUT_SEQUENTIAL_EQUIV ok: erased transition refuted; search recovered q_next=q XOR x
  behind 1 DFF; post-ABC equiv_induct proved every matched Boolean state and all
  enable/reset/input combinations
TENSORLUT_SEQUENTIAL_EQUIV negative control: one discovered INIT bit flipped; induction left Q
  unproved and bounded SAT produced the reset → x=0 → divergent-Q counterexample
```

This closes the "no flip-flops in the proof loop" open item. Three scripts
asserted it and were corrected: `ep00/whats-open` (bullet and narration),
`ep15/verdict`, and the ep15 `description`. Proof mechanism is `equiv_make` +
`equiv_induct -seq 1` + `equiv_status`, with a bounded `sat -seq 3 ... -prove
trigger 0 -prove-skip 2` reset trace.

Boundary to hold: **one** flip-flop on a toy toggle fixture, not a processor.
`ep00/episode00-selfrepair`'s own transcript still correctly says both of *its*
circuits are combinational; that statement was not changed.

The other six lines on screen are the combinational gates and their negative
controls: `TENSORLUT_ROUNDTRIP` 48 bits over 16 assignments, `4 mismatch(es)` on
a corrupted table, `TENSORLUT_SAT_EQUIV` proven then refuted on corruption, and
`TENSORLUT_SEARCHED_ROUNDTRIP` erased-fails-14-of-48 then 48/48, with `3
mismatch(es)` after one flipped discovered entry.

Note the eight lines appear in a non-obvious order because XCTest buffers stdout
across tests. Each line is self-contained, so this is cosmetic.

---

# Claim-recovery live captures — 2026-09-06

Three additional episodes now open with live, independently scoped gates. Series capture coverage moves from 8 of 16 episodes to 11 of 16.

| Episode | Capture | Duration | Live? |
|---|---|---:|---|
| ep01 | `episode01-three-tier-validation` | 33.96 s | live |
| ep03 | `episode03-proof-ladder` | 63.84 s | live |
| ep04 | `episode04-mechanism-controls` | 54.28 s | live |

## ep01 — bounded three-tier compiler control

`.build/release/helut-compile --validate` visibly completes all three tiers: exclusive injected-lane recovery, clear-netlist/oracle parity, FHPQX/SIEGFR reproduction, and SDV isolation among 200 hypotheses. The screen itself ends with `VALIDATION COMPLETE — tiers 1–3 green.` Narration explicitly limits this to one Enigma fixture; it is not arbitrary-Verilog correctness or FHE. Full record: `ep01-metal-compiler/CAPTURE_TRANSCRIPT.md`.

## ep03 — analytic certificate plus bounded multi-LUT ladder

The prebuilt XCTest bundle runs the formal certificate, the 2/4/6/8 melt-region boundary, and the 8/8 budget recovery. The low-budget 8/8 row remains on camera as `REFUTED` and fully binary; the 500-generation row is `PROVED`. This replaces the stale absolute sentence that all evidence stops at two tables while preserving the narrower analytic and arbitrary-topology boundaries. Full record: `ep03-tensorlut/CAPTURE_TRANSCRIPT.md`.

## ep04 — known-control garble and indel grades

The live Metal grade shows exact closure losing one- and two-substitution controls, matching tolerance recovering them, and 0/192 host/GPU mismatches. The indel screen shows the correct synthetic splice recovering 25/25 deductions and, equally prominently, `BOARD-SPECIFICITY IS UNMEASURED HERE` because all wrong splices died under legality before board evaluation. No P1030680 data appears. Full record: `ep04-p1030680-bombe/CAPTURE_TRANSCRIPT.md`.

All three MP4s were probed for duration and sampled as rendered frames after recording. The temporary frame files were deleted after visual verification.

---

# Receipt-playback coverage pass — 2026-09-06

Five episodes had no terminal screen at all. Four of them had preserved,
self-contained receipts on disk that could be replayed honestly, so they now
have one. Nothing was re-run to produce these: each tape reads a durable
byte-for-byte copy of an existing receipt and prints its SHA-256 on screen.

| Episode | Capture | Duration | Mode | What it settles |
|---|---|---:|---|---|
| ep02 | `episode02-revalidation-ledger` | 67.60 s | receipt playback | 15 pass / 1 fail after the determinism fix, failure shown |
| ep05 | `episode05-fixture-receipt` | 72.36 s | receipt playback | fixture-v4 parity, and E256-003 still open |
| ep06 | `episode06-evidence-ladder` | 69.00 s | receipt playback | four implementations agree; optimizer verdict is a bounded failure |
| ep10 | `episode10-rehearsal-ceiling` | 71.48 s | historical receipt playback | August sparse-model baseline: 4/72, 0/10, `NO BREAK` |
| ep10 | `episode10-objective-correction` | 66.60 s | sealed receipt playback | sparse 4/72 → dense 21/72 → objective v1 25/72 → objective v2 25/72; every row `NO BREAK` |
| ep10 | `episode10-current-ladders` | 68.60 s | sealed receipt playback | objective-v2-binary generic/naval and oracle-seed controls; staged scorer does not consume the objective |
| ep15 | `episode15-abc-comparison` | 88.84 s | receipt playback | search vs identical ABC: 0 wins, 18 ties, 0 losses |

**Episode 10 media boundary.** All three embedded capture MP4s are current,
probed, hash-bound, and transcripted. The canonical Episode 10 narration and
story panels now describe the correction, but its ElevenLabs audio plan/clips and
`out/ep10-why-it-holds.mp4` predate that rewrite. `npm run tts:pending` reports
all 14 Episode 10 scenes pending (three NEW capture narrations and eleven
CHANGED scenes), plus the revised Episode 0 general-audience answer and two
pre-existing Episode 4 items (`mechanism-controls-live` NEW and `future-bank`
CHANGED). The project-wide queue is 82 clips: 24 NEW and 58 CHANGED. No billable
or networked TTS call was made. Episode 10 is not current final media until that
external step and a fresh Remotion render complete. Episode 4's mechanism-control
claims and 54.28-second live capture are scientifically unaffected; no replacement
VHS footage is required.

**ep11 deliberately has no capture.** Every scene in that episode is filed as
material that is not a claim until it earns a reproduce command, and no receipts
exist for the five graduating experiments. A terminal screen there would
manufacture the exact inference the episode is written to prevent.

## The ABC comparison, because it was the unanswered question

A skeptic asked how HELUT's simplification compares with existing logic
simplification. `episode15-abc-comparison` answers it on camera, and the answer
is a null rather than a win.

Before mapping, the search removes real cells:

```text
8:1 mux          15 LUT d4 -> 7 LUT d3
3x3 multiplier   18 LUT d2 -> 6 LUT d1
8-bit adder      41 LUT d9 -> 16 LUT d8
```

Then the same `abc -lut 6` recipe runs on the hand-designed baseline *and* the
evolved circuit, and the columns collapse onto each other:

```text
mapped_lut_wins=0 mapped_lut_ties=18 mapped_lut_losses=0
mapped_depth_wins=0 mapped_depth_ties=18 mapped_depth_losses=0
verdict=honest null
```

Six circuits, three seeds, 18 comparisons, every retained finalist SAT-proved,
zero wins and zero losses. `ep15/compare-abc` and `ep15/verdict` previously said
the combined flow had not been run end to end; it has, and both scenes now report
the measured tie. `ep00/whats-open` was corrected the same way.

Source receipt: `HELUT/logs/helut-structural-abc-20260906T004058Z.log`, durable
copy SHA-256
`e2947a75dc6d693e359c7d88b4d4c6088345ac420852916f1c34a52ef79d2e6f`.

## Manifest coverage

Every capture referenced by an episode scene now has a durable manifest, up from
8 to 21. The previously unmanifested live captures — ep01, ep03, ep04, ep07,
ep08, ep09, and both ep15 live screens — gained manifests in this pass with
hashes and probe data recomputed from disk. Those manifests set
`framesReInspectedThisPass: false` and point at this file and the linked
transcript for the original visual review, rather than restating a review that
was not repeated.

Series capture coverage is now 15 of 16 episodes and 20 capture scenes.

## Regenerating a playback capture

```bash
vhs validate captures/<episode>/<tape>.tape
vhs captures/<episode>/<tape>.tape
```

The five playback tapes need only `bash`, `shasum`, and VHS. They do not need a
HELUT build, Yosys, Verilator, XCTest, or any benchmark command. After a
re-render, re-probe the MP4 and update the matching manifest, because each
episode's `durationHintSec` is validated against the real media duration.
