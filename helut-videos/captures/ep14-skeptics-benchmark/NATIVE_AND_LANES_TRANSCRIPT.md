# Episode 14 native-and-lanes capture transcript — sealed receipt playback

- Capture: `episode14-native-and-lanes`
- Role: sealed matched-native receipt playback
- Tape: `episode14-native-and-lanes.tape`
- Presentation ledger: `ep14-native-final-receipt.txt`
- Intended video: `public/captures/ep14-skeptics-benchmark/episode14-native-and-lanes.mp4`
- Render status: **rendered and reviewed**

This capture is deterministic playback of a presentation ledger bound to the
final sealed HELUT evidence. It does **not** execute XCTest, Verilator, Yosys,
`helut-bench`, or any timing-sensitive command. The earlier MP4 at this path was
stale footage from the superseded live-run definition, SHA-256
`daf31d5c3c7688a25a1ebf79ddbf482a4dea53e2de66c87d7f0cfdc723b971ac`;
it has been replaced by the render recorded below.

## Playback source receipt

```text
=== EP14 FINAL MATCHED NATIVE RECEIPT ===
Presentation ledger derived from sealed HELUT evidence; no timing rerun.

SOURCE
Git blob SHA-1: b0dce16ca9844ce499d07ea090ed4ff7cedae6f9
Source SHA-256: 3ee58213f460cbc8a0a316dc90e6edb9a7af5e77426b839fb1d83e8675e490e2
Compiled XCTest SHA-256: 5f6ea6aa884e28fccbd2ab1acc872687e5054bf89d933795db4bba6c7ec505ad
Pre-execution gate: PASS
XCTest: Executed 1 test, with 0 failures (0 unexpected)
```

The sole accepted execution used eight lane widths and five unpinned trials per
width with 16 requested native workers. All reported digests matched and all
phase-accounting residuals were zero.

## 1/3 — Two scopes, one publication verdict

```text
NATIVE_BASELINE 65536  0.000921965  0.007094667  0.130x  match 52f209ab0358725
Historical scope: warmed synchronized HELUT graph vs scalar assign/eval/read/digest.
Historical graph result is intentionally asymmetric; it is not paired throughput.

NATIVE_PAIRED  65536  0.008544087  0.007421917   16  1.151x  match 52f209ab0358725
Paired scope: deterministic preparation through strict readback and ordered digest.
VERDICT: HELUT remained 15.1% slower at B=65,536.
NATIVE_PAIRED crossover: none through B=65536 against configured parallel Verilator.
```

The direct paired result is the publication verdict: HELUT measured
`8.544087 ms` versus `7.421917 ms` for 16-worker Verilator, a ratio of
`1.151197×` and a remaining gap of `1.122170 ms`. The historical graph-only row
is retained as a dated asymmetric observation, not converted into a paired
speed claim.

## 2/3 — Final HELUT phase medians at B=65,536

```text
assignment      0.029922 ms
input pack      0.528932 ms
graph           0.766039 ms
strict decode   0.548005 ms
ordered digest  6.676912 ms
paired total    8.544087 ms
native total    7.421917 ms
remaining gap   1.122170 ms
```

Independent phase medians need not sum to the total median. The ordered digest
consumes the same canonical lane/wire/value byte stream inside both paired
timers. It is required shared work and is not subtracted post hoc. No
`12×` digest-subtracted evaluator ratio, equal-scope `NATIVE_EVAL` ratio, or
other ratio synthesized from independent medians is claimed.

## 3/3 — Distinct-lane correctness and negative control

The separately sealed production distinct-lane receipt records:

```text
Production distinct receipt: PASS
lanes=65536 distinct_inputs=65536 checked_output_bits=589824 mismatches=0
unique_output_signatures=511 digest=fnv1a64-3f03b6872d46d5a5
```

The exact preserved corruption-control line is:

```text
BATCH_LANES negative control: lane 37 corruption produced 5 mismatch(es); digest 2c81f1c165bf1edd → a06c2874ad01d2c4
```

That control ran in the preceding 256-lane fixture, whose positive line checked
1,280 output bits and produced 31 distinct output signatures. It was not a
64-lane or 65,536-lane corruption run.

## Sealed evidence binding

| Artifact | SHA-256 |
|---|---|
| Preregister | `ccef741e7b42a78517af81579bf878910bebb47dd7344eaf7a572adc298b2890` |
| Raw log | `bae12bb19270904133c5fd566c114abd805ae6665acaa4f97640255439566435` |
| Receipt | `6912cb6586fb3885607849be86ab104c427ceb26b13977b38692cbc0844087d8` |
| Final handoff | `8987008bd6b862a96a6fc6aba779209af92686f39b27ea56f1c3ea8c00da4301` |
| Additive errata | `8e54453ca3c51d381bc14edca2a0bb58906d4a84286376766f65aa142fdfb6d5` |
| Final source/binary sidecar | `64670e40ad75f8258f612172ef82fc7f105e11f5b5bbc29f9611481e4c367d76` |
| Distinct-lane receipt | `81a8b9161263cf33466e01c9838d49410cab56cbca4e406d45349a3ea9b07c33` |
| Corruption-control log | `915083f5147877fad31d7c3425f3b3f4519fd37bebf82f2d8a1f9bf7a2de1f2e` |

Generated benchmark artifacts:

| Artifact | SHA-256 | Preservation |
|---|---|---|
| `emitted.v` | `8ba6dc328983119bd3b2236438f3431d5d54f530710fe73d6512359dd51c6a5e` | copied into sealed bundle |
| `lut6.v` | `4c9d11388c4385f5fecc293d6c54a44abe830878cc2832993ce4ff6de7905e66` | copied into sealed bundle |
| `flow.ys` | `40dc7c3526448219a5eca28fa8102c90129d3a031f0ab46e9c1ab70f2848952a` | copied into sealed bundle |
| `tb.cpp` | `2dfd5a6cb66a4c15628f4464625c7b076498e6dee6219fbeedadfffa483c34b2` | copied into sealed bundle |
| `resynth.json` | `84ba190a62302f886b63f7607480b0e3f50f27b380f139ce91bb178fac8164fb` | 44,729 bytes; hash-identified, not copied into bundle |
| `obj_dir/sim` | `60aab5d844d2b5fc36d6efc20ea0b0fe224a2bde12c4afbe847e4a47e1dfacb9` | 360,784 bytes; hash-identified, not copied into bundle |

The sealed receipt's human-readable source and XCTest mtimes incorrectly append
`Z` to local Pacific values. The Unix epochs, byte sizes, source hash, and
compiled-XCTest hash are correct; `ERRATA.md` records the correct `-0700` and UTC
renderings without altering the sealed files. The raw log was banked from the
complete sole-run output retained after session compaction. The benchmark was
not rerun. The predecessor blob `0d389184…` was not retained, so no direct byte
diff to that predecessor is available.

## Presentation artifacts

- Ledger SHA-256: `3e716bbf902cff89859458b898d157a8f2314f62ad165871fc25feaff991dc5c`
- Tape SHA-256: `d6909a00fb6478d99472d6a7c1ec7baec607407ecce98f8dc840ef1e014ac4ac`
- Tape prerequisites: `bash`, `shasum`, VHS for validation/rendering
- Benchmark/runtime prerequisites: none; playback performs no fresh execution
- MP4 SHA-256: `1190a00091346c46c05fc130d2be0d0359954ab9f41f758ce59df779a7e98318`
- MP4: H.264/yuv420p, 1280×720, 25 fps, 71.64 s, 754,522 bytes
- Superseded prior MP4 SHA-256: `daf31d5c3c7688a25a1ebf79ddbf482a4dea53e2de66c87d7f0cfdc723b971ac`

## Visual validation

Full-resolution frames were inspected at 9, 26, 45, and 60 seconds. The source
and compiled-XCTest hashes, the pre-execution gate, the XCTest footer, both
scope rows with matching digests, the 15.1% verdict, the no-crossover line, the
claim boundary, and all three sealed evidence hashes are legible. VHS visibly
overlaps the tail of some typed command echoes at prompt boundaries; that
artifact is retained and the projected evidence lines remain readable.

## Claim boundary

- One degree-1 cleartext combinational 8-bit ripple adder, 14 mapped LUTs, no
  DFFs, one Mac16,5 host, five unpinned trials at each width.
- No paired crossover was observed through B=65,536.
- The million-lane HELUT graph sweep is a different fixture and uses projected
  high-width native values; it is not evidence of a measured paired crossover.
- The distinct-lane receipt establishes exhaustive correctness for 65,536
  assignments on this fixture. The corruption control establishes that this
  checker detects one specific lane-37 perturbation in its 256-lane fixture.
- No general HDL, sequential, encrypted, CXXRTL, cross-host,
  best-possible-native, or Apple-superiority conclusion follows.
- This capture is deterministic playback of preserved values. No benchmark,
  test suite, or synthesis ran during recording.
