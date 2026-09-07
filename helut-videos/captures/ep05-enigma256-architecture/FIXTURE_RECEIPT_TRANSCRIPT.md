# Episode 5 capture transcript — E256 fixture-v4 validation receipt

- Capture: `episode05-fixture-receipt`
- Role: E256 fixture-v4 validation receipt playback
- Tape: `episode05-fixture-receipt.tape`
- Durable receipt: `ep05-e256-fixture-v4-validation.json`
- Video: `public/captures/ep05-enigma256-architecture/episode05-fixture-receipt.mp4`

The episode describes an architecture. This capture shows the validation receipt
that pins it, and equally shows what the receipt refuses to claim.

The durable file is a byte-for-byte copy of
`HELUT/logs/e256-v2-gen0-fixture-v4-validation.json`.

## Opening — identity and compatibility

```console
e256$ echo 'IMPLEMENTATION PARITY EVIDENCE - NOT A SECURITY PROOF'
IMPLEMENTATION PARITY EVIDENCE - NOT A SECURITY PROOF
e256$ grep -n 'schema\|family\|suite_version\|fixture_schema_version\|compatibility_key' $J
1:  "schema": "E256-VALIDATION-1",
4:    "family": "E256",
5:    "suite_version": 2,
7:    "fixture_schema_version": 4,
9:    "compatibility_key": "E256/v2/gen0/fa246e9c.../fixture-v4",
```

The compatibility key is why a mismatched profile is rejected instead of
silently accepted.

## 1/3 — The state rules the hardware must obey

```console
11:    "center_formula": "A_i^-1(A_i(x) XOR k_i)",
14:    "absolute_counter": "uint64_be_block_counter_start_0",
46:      "directed_center_and_counter": "PASS",
79:      "reciprocal_decrypt": "PASS",
```

The centre is a conjugated XOR, the counter is an absolute big-endian 64-bit
block counter starting at zero, and both the directed centre/counter check and
reciprocal decryption pass.

## 2/3 — One byte path, two buses, same tables

```console
59:    "axi_stream": {
61:      "table_bytes": 2304,
62:      "payload_bytes": 1024,
65:    "axi_lite": {
67:      "table_bytes": 2304,
68:      "payload_bytes": 1024,
75:      "kat_bytes": 1024,
76:      "tables": 9,
77:      "trace_files": 10,
78:      "artifacts": 25,
80:      "yosys_parity": "8/8 full-adder rows; 16 counter transitions; 1024 toy-ISA transitions",
```

Both bus paths carry the same nine tables — 2,304 bytes — and the same
1,024-byte payload.

## 3/3 — What the receipt refuses to claim

```console
"human_review": "pending",
"finding_state": "OPEN",
"review_boundary": "AI semantic review is not human acceptance and does not close E256-003",
"limitations": [
  "This is bounded implementation and parity evidence, not an IND-CPA proof or an HMAC security proof.",
  ...
```

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 72.36 seconds
- Size: 771,600 bytes
- MP4 SHA-256: `63a70767481cf70455d4c39b6b4589a7776a5fec0a916a0b5474138b6f60f40c`
- Durable receipt SHA-256: recorded in `fixture-receipt-manifest.json`

## Visual validation

A full-resolution frame was inspected at 40 seconds. Both bus blocks with
`table_bytes: 2304` and `payload_bytes: 1024`, the evidence ladder counts, and
the TensorLUT limitation line are legible.

## Claim boundary

- Playback of a preserved receipt, not a live run.
- Bounded implementation and parity evidence, not an IND-CPA or HMAC proof.
- Human review is pending; audit finding E256-003 remains OPEN.
- RTL validates the counter; it does not implement HMAC.
- Rotor-pool sizing, state-seed width, and serial-access counts are
  design-document claims and are not proved by this receipt.
