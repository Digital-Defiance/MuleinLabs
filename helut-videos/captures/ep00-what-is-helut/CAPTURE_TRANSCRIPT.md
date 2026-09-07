# Episode 0 literal capture transcripts — live runs

Two captures, both **live executions recorded during filming**, not playback of
preserved logs. That is the difference between these and the Episode 14/15
captures, and it is only possible because the release test binary was already
built: the runs take under two seconds each.

- `episode00-selfrepair` — erase, rediscover, prove, then break it on purpose
- `episode00-crossover` — HELUT against Verilator on the same circuit

Line wrapping below is normalised for readability. VHS/ttyd visibly wraps or
overlaps portions of a few typed command echoes at prompt boundaries; that
artifact is retained in both MP4s. Projected output is folded at 104 columns by
the recorded commands themselves, so result lines wrap at word boundaries.

---

# 1. `episode00-selfrepair`

- Tape: `episode00-selfrepair.tape`
- Video: `public/captures/ep00-what-is-helut/episode00-selfrepair.mp4`
- Captured: 2026-09-05 16:29:19 PDT
- Duration: 80.28 s

## 1/4 — The circuit, with its carry logic deleted

```console
helut$ echo 'EPISODE 0 / LIVE RUN - NOT A REPLAY'
EPISODE 0 / LIVE RUN - NOT A REPLAY
helut$ echo '1/4  THE CIRCUIT, WITH ITS CARRY LOGIC DELETED'
1/4  THE CIRCUIT, WITH ITS CARRY LOGIC DELETED
helut$ sed -n '/func meltedAdderNetlist/,/^    }/p' $F
    private func meltedAdderNetlist() -> TensorLUTNetlist {
        TensorLUTNetlist(
            luts: [
                TensorLUT6Cell(cellID: 0, inputWires: [0, 2], outputWire: 5, rawTruthTable: "0110"),
                TensorLUT6Cell(cellID: 1, inputWires: [0, 2], outputWire: 4, rawTruthTable: "1000"),
                TensorLUT6Cell(
                    cellID: 2, inputWires: [1, 3, 4], outputWire: 6,
                    rawTruthTable: String(repeating: "0", count: 8)
                ),
                TensorLUT6Cell(
                    cellID: 3, inputWires: [1, 3, 4], outputWire: 7,
                    rawTruthTable: String(repeating: "0", count: 8)
                )
            ],
            dffs: [],
            totalWires: 8,
            executionLevels: [[0, 1], [2, 3]]
        )
    }
```

Cell 0 is `0110`, exclusive-or, the low sum bit. Cell 1 is `1000`, and, the low
carry. Cells 2 and 3 are declared as eight zeros each. There is no correct answer
hiding underneath the wipe, so the search has to discover the carry logic rather
than remember it.

## 2/4 — The wrapper, shown before it is used

```console
helut$ type prove | tail -n +2
prove ()
{
    swift test -c release --filter TensorLUTYosysRoundTripTests/$1 2>&1 | grep -E 'Executed 1 test|^TENSORLUT' | fold -s -w 104
}
```

Defined off camera only so the typed lines fit the terminal, then printed so
nothing is concealed. It is a plain `swift test` invocation with the output
filtered and folded.

## 3/4 — Erased circuit fails, search rediscovers, Yosys confirms

```console
helut$ prove testSearchedEliteResynthesizesToTargetFunction
         Executed 1 test, with 0 failures (0 unexpected) in 1.638 (1.638) seconds
TENSORLUT_SEARCHED_ROUNDTRIP ok: erased design failed 14 of 48 bits; searched elite agrees on 48/48
output bits over 16 input assignments, yosys-resynthesized vs target
```

Three gates in one line. The erased design fails 14 of 48 output bits, so the
fixture is genuinely broken. The searched result agrees on all 48. The reference
is the target truth table, not the source netlist — the source computes the wrong
function by construction, so comparing against it would assert the search failed.

## 4/4 — Proven over the whole input space, then broken on purpose

```console
helut$ prove testSearchedEliteIsFormallyEquivalentToBehavioralAdder
         Executed 1 test, with 0 failures (0 unexpected) in 1.801 (1.801) seconds
TENSORLUT_SAT_EQUIV ok: searched elite proven equivalent to behavioural two-bit addition over the
entire input space (yosys miter + minisat, post abc -lut 6)
helut$ prove testFormalProofRefutesCorruptedSearchedElite
         Executed 1 test, with 0 failures (0 unexpected) in 1.530 (1.530) seconds
TENSORLUT_SAT_EQUIV negative control: SAT refuted the corrupted elite and produced a counterexample
```

The proof is a `miter -equiv` comparator plus `sat -prove trigger 0`, run against
a behavioural Verilog `+` model that knows nothing about lookup tables. What is
proven is the post-`abc -lut 6` netlist, the same form the repository's own loader
consumes. The negative control flips one discovered entry and requires SAT to find
a counterexample, because a proof that cannot be refuted proves nothing.

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 80.28 seconds
- Size: 863,742 bytes
- MP4 SHA-256: `5e3a05203fc51dd6e2375585e95271d2cb811af4184a0ab13c7bf4fe0b6338a5`
- Tape SHA-256: `2c09142dd5795846543764c626202fb78694c81114ab0da1b8407ad546aa0d3c`

---

# 2. `episode00-crossover`

- Tape: `episode00-crossover.tape`
- Video: `public/captures/ep00-what-is-helut/episode00-crossover.mp4`
- Captured: 2026-09-05 16:30:59 PDT
- Duration: 38.36 s

```console
helut$ echo 'EPISODE 0 / HELUT vs VERILATOR / LIVE RUN'
EPISODE 0 / HELUT vs VERILATOR / LIVE RUN
helut$ verilator --version
Verilator 5.052 2026-09-05 rev vUNKNOWN-built20260905
helut$ echo 'Same emitted circuit. Same stimulus. Same digest, or the timings are void.'
Same emitted circuit. Same stimulus. Same digest, or the timings are void.
helut$ bench
NATIVE_BASELINE verilator build (excluded from timings): 1.83s
NATIVE_BASELINE circuit: 8-bit ripple adder, 16 emitted LUT6, 14 $lut after abc -lut 6, 16 input bits,
9 output bits
NATIVE_BASELINE lanes  helut_median_s  verilator_median_s  ratio  digests
NATIVE_BASELINE     1  0.002573967  0.000000250     10295.9x  match 8f9f7fb8cfd7dde2
NATIVE_BASELINE    16  0.002650976  0.000002209      1200.6x  match 84c0b917691450a5
NATIVE_BASELINE   256  0.002681017  0.000026209       102.3x  match aa0c5f15c933c725
NATIVE_BASELINE  1024  0.003088951  0.000105750        29.2x  match 25bc9c05761bbee5
NATIVE_BASELINE  4096  0.003085971  0.000441875         7.0x  match 53efd78eadd2ee5
NATIVE_BASELINE 16384  0.003169894  0.001655167         1.9x  match 5bae3d89c7c044e5
NATIVE_BASELINE 32768  0.003816962  0.003416541         1.1x  match f79eaea4cb7276a5
NATIVE_BASELINE 65536  0.002204061  0.006897500         0.3x  match 52f209ab0358725
NATIVE_BASELINE crossover: HELUT first becomes faster than sequential Verilator at 65536 lanes
(0.002204061s vs 0.006897500s).
```

Every row reads `match`. Both backends folded their outputs into the same FNV-1a
digest over `(lane, wire, value)`, and the test fails if any width disagrees, so
the timings cannot compare different work.

The shape is the point. HELUT sits between 2.2 and 3.8 milliseconds across a
65,536× range of work, because its cost is dominated by fixed per-submission
overhead. Verilator rises linearly. They cross.

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 38.36 seconds
- Size: 638,113 bytes
- MP4 SHA-256: `1253f3933e7e2dc949aa9f665411142459fe0aeb89525eee0058eb993286218e`
- Tape SHA-256: `8c79be77eba4af405b0510b282a82479f30a668543435c1ee0cb216555452c3a`

---

# Visual validation

Full-resolution frames were inspected at 10, 32, 58, and 78 seconds for the
self-repair capture and at 8 and 34 seconds for the crossover capture. The erased
fixture, the wrapper definition, the erased-baseline failure count, the formal
proof line, the refuted negative control, all eight comparison widths, every
`match` verdict, the crossover line, and the boundary note are legible. Hidden
setup is absent from both.

# Claim boundaries

- Both captures are live runs from 2026-09-05, not archived playback.
- The self-repair circuit is four LUTs; the comparison circuit is sixteen. Neither
  establishes behaviour at production scale.
- The search moves LUT `INIT` values on fixed topology. It does not add, remove,
  or rewire cells.
- Both circuits are combinational. No flip-flops appear in either loop.
- Verilator runs single-threaded and loops lanes sequentially. Threading or
  batching it in C++ would move the crossover, so this is a measurement of where
  the line sits today, not a claim about Verilator's ceiling.
- HELUT loses a single instance by roughly four orders of magnitude. The result is
  a crossover, not a victory.
- Discovered circuits map to the same LUT count as hand-designed ones under
  `abc -lut 6`, so no area or depth improvement is claimed anywhere here.
- Elapsed times are local observations on one Apple M4 Max, not distributions.

## Later paired-evidence addendum — 2026-09-06

The `episode00-crossover` MP4, its visible table, and its tape/video hashes above
remain unchanged. It is a dated live observation of the earlier **asymmetric**
comparison and its first tested historical HELUT graph win at B=65,536. That is
what the film showed; rewriting its rows would falsify the capture.

Current performance wording comes from the later preregistered paired receipt:

```text
HELUT paired total, B=65,536:       8.544087 ms
16-worker Verilator paired total:   7.421917 ms
HELUT / native:                     1.151197×
Verdict:                            HELUT 15.1% slower
Remaining gap:                      1.122170 ms
Paired crossover through B=65,536: none
```

The paired contract includes deterministic preparation, execution, strict
readback, decode, and the same ordered digest inside both timers. The digest is
not removed after observation to manufacture another evaluator ratio.

Evidence binding:

- Final source Git blob: `b0dce16ca9844ce499d07ea090ed4ff7cedae6f9`
- Final source SHA-256: `3ee58213f460cbc8a0a316dc90e6edb9a7af5e77426b839fb1d83e8675e490e2`
- Compiled XCTest SHA-256: `5f6ea6aa884e28fccbd2ab1acc872687e5054bf89d933795db4bba6c7ec505ad`
- Sealed receipt SHA-256: `6912cb6586fb3885607849be86ab104c427ceb26b13977b38692cbc0844087d8`

Use the historical table only as the dated graph-amortization demonstration. Use
the later sealed receipt for the current matched-native verdict. Neither result
establishes general HDL, sequential, encrypted, cross-host, or
best-possible-native performance.
