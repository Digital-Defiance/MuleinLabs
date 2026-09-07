# Episode 2 capture transcript — post-fix re-validation ledger

- Capture: `episode02-revalidation-ledger`
- Role: post-determinism-fix re-validation ledger playback
- Tape: `episode02-revalidation-ledger.tape`
- Durable receipt: `ep02-revalidation-summary.txt`
- Video: `public/captures/ep02-torus-fhe/episode02-revalidation-ledger.mp4`

This capture shows the encrypted re-validation ledger produced after the
determinism fix. It is included because it prints its own failure and its own
caveat, which is the difference between a results table and a receipt.

The durable file is a byte-for-byte copy of
`HELUT/logs/revalidate-2026-08-16/SUMMARY.txt`.

## Opening

```console
revalidate$ echo 'RUN AFTER THE DETERMINISM FIX - INCLUDES ITS OWN FAILURE'
RUN AFTER THE DETERMINISM FIX - INCLUDES ITS OWN FAILURE
revalidate$ sed -n '1,3p' $L
Re-validation of rows not covered after the determinism fix
started: 2026-08-16T18:53:32Z
commit:  2a42593
```

## 1/3 — Noise rows are completeness, not the gate

```console
-- noise measurements (do not exercise tick(); completeness only) --
PASS C26 measure-bk-noise N=1024 B=64  (75s)  c26-b64.log
PASS C26 measure-bk-noise N=1024 B=4  (77s)  c26-b4.log
PASS C30 eps-vs-B ladder N=128           c30-eps-sweep-n128.log
PASS C34 covering-b4 N=1024 B=1  (363s)  c34-noise.log
PASS C36 covering-b1 N=1024 B=32  (768s)  c36-noise.log
PASS C37 covering-b1 N=1024 sigma=24  (769s)  c37-noise.log
PASS C41 covering-b1 N=256 sigma=128  (7s)  c41-noise-n256.log
PASS C41 covering-b1 N=512 sigma=128  (97s)  c41-noise-n512.log
PASS C55 covering-b1 N=1024 sigma=128 lwe=256  (363s)  c55-noise.log
PASS C56 cryptoPublicMS N=1024 B=1 k=7  (146s)  c56-noise.log
```

The header is the important part: these rows never call `tick()`. They are
measurement completeness, not the functional gate, and a PASS here does not mean
the separate 2⁻⁶⁴ noise bar clears at that wire dimension.

## 2/3 — Rows that do exercise the fixed path

```console
-- encrypted SING (these DO exercise the fixed tick() path) --
PASS C33 SING N=1024 covering-crypto B=1  (23s)  c33-sing.log
PASS C34 SING N=1024 covering-b4 B=1  (85s)  c34-sing.log
PASS C36 SING N=1024 covering-b1 B=32  (333s)  c36-sing.log
PASS C37 SING N=1024 covering-b1 sigma=24  (335s)  c37-sing.log
PASS C41 SING N=512 covering-b1 sigma=128  (48s)  c41-sing.log
FAIL C56 SING N=1024 publicMS B=1 k=7  (10s, rc=133)  c56-sing.log
```

Five pass, including wire dimension 512. The sixth does not. `k` here is the
test-poly stride, confirmed verbatim in
`HELUT/logs/c60-target-cone-b2-k7-sigma128-cpu-metal-2026-08-20.log`.

## 3/3 — Totals and the ledger's own warning

```console
finished: 2026-08-16T19:51:57Z
PASS rows: 15
FAIL rows: 1

A nonzero exit is not automatically a broken claim -- some rows are graded
negatives and some flags may have moved. Read the log before concluding.
```

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 67.60 seconds
- Size: 504,272 bytes
- MP4 SHA-256: `b045b03cca4f8a294d01650b6c611d06ecdca2578a727d4610a566aa64ea375e`
- Durable receipt SHA-256: recorded in `revalidation-ledger-manifest.json`

## Visual validation

A full-resolution frame was inspected at 40 seconds. All five PASS SING rows and
the `FAIL C56 ... k=7 (10s, rc=133)` row are legible.

## Claim boundary

- Playback of a preserved ledger. No encrypted run was performed during capture.
- Per-row seconds are local Apple-silicon observations, not portable timings.
- Noise rows are completeness evidence, not the functional gate.
- The `k=7` failure is a real open row and is shown as FAIL.
- Native-dimension noisy PicoRV32 SING remains failed and open; these rows do
  not recover it.
