# Episode 12 capture and integration record

## Principle

Episode 12 uses two complementary forms of evidence:

1. authored SVG panels keep the scientific receipts readable beside narration;
2. a literal terminal recording proves that the documented commands actually executed.

The initial pre-script experiment and the later filmed rerun are separate observations. Do not merge their timing values or describe two observations as a timing distribution.

The spoken boundary remains: HELUT evaluates five encrypted ballot bits, decrypts one selected result inside the SING harness, and compares it with a clear golden model. This is not a deployed multiparty voting protocol. The N=1024 path uses `exactNoiselessConstruction`; it is not a noisy bootstrap-key proof.

## Final literal capture

- Tape: `captures/ep12-private-majority/episode12-full-run.tape`
- Video: `public/captures/ep12-private-majority/episode12-full-run.mp4`
- Manifest: `captures/ep12-private-majority/capture-manifest.json`
- Transcript: `captures/ep12-private-majority/CAPTURE_TRANSCRIPT.md`
- Public note: `public/captures/ep12-private-majority/README.md`
- Captured: 2026-09-04 13:59:20 PDT
- Encoded media: H.264/yuv420p, 1280×720, 25 fps, 56.76 seconds
- MP4 SHA-256: `066c818c6bcb239171eac95247ee413c7c6864b9756b99842d352a313efd7288`

The VHS tape opens a real Bash pseudo-terminal, types the complete Verilog into `/tmp`, verifies a byte-for-byte match with the tracked source, executes all six stages, and shows final hashes. The final contact-sheet inspection confirmed that the source, commands, decisive outputs, and hashes are legible and that the hidden setup sentinel is absent.

Regenerate locally from the video repository with:

```bash
vhs validate captures/ep12-private-majority/episode12-full-run.tape
vhs captures/ep12-private-majority/episode12-full-run.tape
```

No capture is uploaded or published by the tape.

## Coda capture: encrypted RISC-V CPU

- Tape: `captures/ep12-private-majority/episode12-picorv32-coda.tape`
- Video: `public/captures/ep12-private-majority/episode12-picorv32-coda.mp4`
- Manifest: `captures/ep12-private-majority/picorv32-coda-manifest.json`
- Transcript: `captures/ep12-private-majority/PICORV32_CODA_TRANSCRIPT.md`
- Captured: 2026-09-04 15:23:30 PDT
- Encoded media: H.264/yuv420p, 1280×720, 25 fps, 53.80 seconds
- MP4 SHA-256: `8f2568f6090fe219f231120477d1a76fbbceea8350aa9067364027fa64c998c9`

The coda exists to give the episode a scale contrast. It compiles both circuits live in the same run, so the comparison is measured rather than asserted:

| Circuit | Inputs | LUTs | DFFs | Outputs |
|---|---:|---:|---:|---:|
| `private_majority5` | 5 | 3 | 0 | 1 |
| `picorv32` | 102 | 4,785 | 1,565 | 307 |

It then executes a tiny RV32I program encrypted on CPU for 48 ticks: 14 fetches advancing the program counter from `0x0` to `0x34`, a store of `0x00000001` to address zero, and a load the host serves back as `0x00000001`. Result: 48 of 48 rows PASS in 2.4828 s at 4.0 modeled classical bits.

The program is three meaningful instructions — `addi x1,x0,1`, `sw x1,0(x0)`, `lw x2,0(x0)` — padded with no-ops. `romWord` returns `nop` for every address at or above `0x14`, so do not describe it as a fixed six-instruction program.

The `3 LUTs` versus `4785 LUTs` comparison is a scale contrast, not a normalized area metric: the majority netlist was mapped up to four-input tables while this PicoRV32 netlist tops out at three-input tables.

### Trace clarification made for this capture

The per-tick `LOAD` line previously printed the value on `mem_rdata` at the moment the request was first observed. The host is still driving the pending ROM word at that point, so a correct load displayed `rdata=0x00000013`, the RV32I `nop` encoding. The served RAM word only reached the end-of-run summary.

`Sources/HELUTToolKit/HelutBench.swift` now relabels that line as `LOAD req ... bus=0x... (pre-transfer)` and prints a new inline `LOAD xfer ... served=0x...` line, and the `LOAD` summary lists requests, transfers, and served values. The change is additive trace output only: no evaluation, scheduling, metric, or PASS assertion was modified. Do not narrate the pre-transfer bus value as the loaded result.

### Coda claim boundary

- N=8 is a demonstration parameter reporting 4.0 modeled classical bits.
- The host implements memory, so instruction addresses and memory data are visible to it and appear in the trace in the clear.
- Only the synthesized `picorv32` netlist is evaluated under encryption.
- CPU blind rotation only; the Metal path was skipped by `--cpu-only`.
- Three meaningful instructions in a no-op-padded ROM is not an operating system, a workload benchmark, or a production encrypted processor.

## Two dated observations

| Observation | N=16 CPU | N=1024 Metal | Meaning |
|---|---:|---:|---|
| Initial pre-script receipt | 0.0089 s, 32 rows | 2.7189 s, 2 rows | Values retained in the authored SVG panels |
| Filmed terminal rerun | 0.0095 s, 32 rows | 2.5320 s, 2 rows | Values visible in the literal MP4 |

Both runs passed. These are two individual observations, not evidence of timing stability. The initial receipt remains at `../HELUT/logs/helut-episode12-private-majority-20260904.log`.

## Composition integration

Episode 12 has twelve scenes and two `capture` scenes. The main filmed rerun sits after the initial N=1024 panel and before the bounded summary; the coda pair (`coda-scale`, then `picorv32-coda`) sits after the summary and before the outro. Both MP4s are foreground evidence, not a dimmed atmosphere layer:

- playback remains normal speed;
- terminal audio is muted defensively;
- the source duration is a hard scene-duration floor even after TTS exists, so `durationHintSec` on a capture scene must equal the real media duration;
- future narration longer than the footage falls through to a static completion mat rather than looping the experiment;
- the ten SVG panels remain in place;
- timing panels are labeled `INITIAL PRE-SCRIPT RECEIPT`;
- narration explicitly distinguishes 0.0089/2.7189 from 0.0095/2.5320.

Video assets are public-root relative when passed through Remotion `staticFile()`: `captures/ep12-private-majority/episode12-full-run.mp4` and `captures/ep12-private-majority/episode12-picorv32-coda.mp4`.

`site/scripts/sync-episodes.mjs` also consumes these scripts, so it must accept the `capture` kind. Its `sceneKinds` allowlist fails closed and would otherwise block the whole site registry and the Pages deploy.

## Claim boundary

- The SING harness owns the key and decrypts in-process.
- The run does not establish a deployed multiparty voting protocol or host privacy.
- N=16 is a demonstration parameter with 8.0 modeled classical bits.
- N=1024 checks two deterministic rows, not all 32 rows.
- 175.7 classical bits is a model output, not an independent audit.
- A zero bound under `exactNoiselessConstruction` is not a noisy-key robustness proof.

## Before release

1. Decide whether the result receives a HELUT claim-sheet row; the video stays pinned to C69 until the source ledger changes.
2. Run `npm run check`.
3. Run `xmllint --noout public/story/ep12-private-majority/*.svg`.
4. Run `npm run tts:pending -- --commands`; generating TTS remains a separate billable step requiring an ElevenLabs key.
5. Inspect the capture scene at its beginning, decisive result frames, and source end.
6. Render the final episode with `npm run render:ep12` only after narration exists and has been auditioned.
