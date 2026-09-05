# Episode 14 literal capture transcript — preserved Enigma M3 receipt

- Capture: `episode14-current-receipt`
- Role: archived receipt playback
- Tape: `episode14-current-receipt.tape`
- Video: `public/captures/ep14-skeptics-benchmark/episode14-current-receipt.mp4`
- Playback captured: 2026-09-05 13:40:18 PDT (MP4 completion mtime)
- Original experiment: 2026-09-05 16:40:43 UTC
- Durable source log: `ep14-enigma-m3-n1024-b1-x3.log`

Line wrapping below is normalized for readability. The MP4 is a literal visual
playback of the preserved log; it does **not** rerun the timing-sensitive
benchmark. The durable log is a byte-for-byte copy of
`HELUT/build/episode14/ep14-enigma-m3-n1024-b1-x3.log`.

VHS/ttyd visibly wraps or overlaps portions of a few typed command echoes at
prompt boundaries. That presentation artifact is retained in the MP4. The
projected result lines remain legible, and the preserved log is identified by a
visible SHA-256 hash at both the opening and close.

## Archived-playback disclosure and source receipt

```console
receipt$ echo 'EPISODE 14 / PRESERVED ENIGMA M3 RECEIPT'
EPISODE 14 / PRESERVED ENIGMA M3 RECEIPT
receipt$ echo 'ARCHIVED RECEIPT PLAYBACK - NOT A FRESH TIMING RUN'
ARCHIVED RECEIPT PLAYBACK - NOT A FRESH TIMING RUN
receipt$ echo 'Original experiment: 2026-09-05 / Apple M4 Max'
Original experiment: 2026-09-05 / Apple M4 Max
receipt$ sed -n '1,5p' $L
=== EP14 receipt: Enigma M3 boolean path, N=1024 B=1, 3 runs ===
date: 2026-09-05T16:40:43Z
cmd: helut-bench --bench enigma_netlist.json --degree 1024 --batch 1 --ticks 10 --warmup 1 --reset-hold 3 --bench-equiv
host: Apple M4 Max / macOS 26.6.2
netlist sha256: 747d4eb71a8d0564abc0aa86fa006c5f6472f0d98c2144d5a8125e9f8afaab05
receipt$ shasum -a 256 $L | sed 's#captures/ep14-skeptics-benchmark/##'
163dcb21a1ef00c5befbe792f6fb8208e81d675405822833640f7d7d07cbe051  ep14-enigma-m3-n1024-b1-x3.log
```

## 1/4 — Graph and encoding boundary

```console
receipt$ grep -m 1 -E 'Compiled module' $L
Compiled module 'enigma_core': 10 inputs, 688 LUTs, 26 DFFs, 8 outputs
receipt$ grep -m 3 -E 'N=1024|encoding:|LUT backend' $L
  N=1024  B=1  ticks=10  warmup=1  reset_hold=3
  encoding: constant-fill (trivial, noise-free)
  LUT backend: multilinear
receipt$ echo 'Scope: constant-fill / trivial / noise-free / not encrypted'
Scope: constant-fill / trivial / noise-free / not encrypted
```

The receipt is a Boolean-path run at the tensor shape used by the encrypted
side of the project. Constant-filled, noise-free values are not ciphertext.

## 2/4 — Three preserved timing runs

```console
######## run 1 ########
  total            0.0391 s
  tick 1 (JIT)     0.3064 s
  steady avg       0.0154 s/tick (n=9, skip warmup=1)
  steady Hz        64.92
RSS final 238.9 MiB (delta from start +221.6 MiB)
######## run 2 ########
  total            0.0379 s
  tick 1 (JIT)     0.3088 s
  steady avg       0.0147 s/tick (n=9, skip warmup=1)
  steady Hz        67.96
RSS final 239.0 MiB (delta from start +221.6 MiB)
######## run 3 ########
  total            0.0383 s
  tick 1 (JIT)     0.3074 s
  steady avg       0.0148 s/tick (n=9, skip warmup=1)
  steady Hz        67.49
RSS final 240.1 MiB (delta from start +222.7 MiB)
```

These are preserved observations, not deterministic performance contracts. The
first tick includes Metal kernel graph construction/specialization cost.

## 3/4 — Clear-oracle and Metal equivalence gate

```console
######## run 1 ########
  plaintext      KEINEBESONDERENEREIGNISSE
  clear          KEINEBESONDERENEREIGNISSE
  metal          KEINEBESONDERENEREIGNISSE
  result          PASS
######## run 2 ########
  plaintext      KEINEBESONDERENEREIGNISSE
  clear          KEINEBESONDERENEREIGNISSE
  metal          KEINEBESONDERENEREIGNISSE
  result          PASS
######## run 3 ########
  plaintext      KEINEBESONDERENEREIGNISSE
  clear          KEINEBESONDERENEREIGNISSE
  metal          KEINEBESONDERENEREIGNISSE
  result          PASS
```

All 25 output letters agree in all three preserved runs. This is evidence for
the supported synthesized Boolean graph, not general four-state HDL semantics.

## 4/4 — Median and spread quoted by Episode 14

```console
######## provenance / spread notes ########
# The three runs above are the warm set quoted by Episode 14.
#   compile   0.0391 / 0.0379 / 0.0383 s   -> median 0.0383 s
#   tick 1    0.3064 / 0.3088 / 0.3074 s   -> median 0.3074 s
#   steady    0.0154 / 0.0147 / 0.0148 s   -> median 0.0148 s/tick (n=9 each)
#   steady Hz 64.92 / 67.96 / 67.49        -> median 67.49, spread 64.9-68.0
#   RSS final 238.9 / 239.0 / 240.1 MiB    -> median 239.0 MiB
#   EQUIV     PASS x3, KEINEBESONDERENEREIGNISSE, 25 letters, clear == metal
#
# Cold-pass observations taken immediately before this set, same command, same
receipt$ echo 'BOUNDARY: B=1; no native baseline; no batch-throughput claim'
BOUNDARY: B=1; no native baseline; no batch-throughput claim
receipt$ shasum -a 256 $L | sed 's#captures/ep14-skeptics-benchmark/##'
163dcb21a1ef00c5befbe792f6fb8208e81d675405822833640f7d7d07cbe051  ep14-enigma-m3-n1024-b1-x3.log
```

The complete cold-pass and archived-August context remains in the durable log;
this final screen only introduces that context before restating the claim
boundary and source-log hash. The tape holds this final receipt screen for 31
seconds so the already-generated narration can finish over visible evidence;
the hold is presentation time, not benchmark execution.

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 83.48 seconds
- Size: 1,104,570 bytes
- MP4 SHA-256: `44ebe299b6b6cebc426f6b3dbb72b5fd22e241aefac80201d5cf97b971eb2866`
- Tape SHA-256: `64535714880374ed11b65585dd336a89b7b2014e938f2a26339b8849d3f9d8ce`
- Durable-log SHA-256: `163dcb21a1ef00c5befbe792f6fb8208e81d675405822833640f7d7d07cbe051`

## Visual validation

Full-resolution frames from the newly encoded media at 5, 63, and 80 seconds
were inspected, in addition to the prior contact-sheet review. The
archived-playback disclosure, source provenance, graph shape, constant-fill
boundary, three timing runs, three equivalence passes, median and spread,
B=1/native-baseline boundary, and final hash are visible. The final claim and
hash screen remains legible during the extended narration hold. Evidence output
is legible despite the retained command-echo wrapping/overlap artifact. Hidden
setup is absent.

## Claim boundary

- This is normal-speed playback of a preserved log, not a fresh benchmark run.
- N=1024 is constant-filled, trivial, and noise-free; it is not encrypted data.
- B=1 establishes no lane-distinct batch-throughput result.
- Clear and Metal agree for this supported graph and transcript; this is not
  full HDL equivalence.
- There is no Verilator, CXXRTL, or discrete-GPU baseline in this receipt, so it
  establishes no speed superiority.
- Timings and memory figures are local observations on one Apple M4 Max. The
  spread is reported because a single number would conceal observed variance.
