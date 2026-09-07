# Episode 6 capture transcript — E256 evidence ladder and the open row

- Capture: `episode06-evidence-ladder`
- Role: E256 evidence-ladder and open-finding receipt playback
- Tape: `episode06-evidence-ladder.tape`
- Durable receipt: `ep06-e256-fixture-v4-validation.json`
- Video: `public/captures/ep06-e256-evolution-audit/episode06-evidence-ladder.mp4`

The episode narrates an evidence ladder. This capture shows it as a file, and
ends on the row the receipt does not close.

The durable file is a byte-for-byte copy of
`HELUT/logs/e256-v2-gen0-fixture-v4-validation.json`.

## Opening — four independent implementations

```console
audit$ echo 'FOUR INDEPENDENT IMPLEMENTATIONS, ONE FIXTURE'
FOUR INDEPENDENT IMPLEMENTATIONS, ONE FIXTURE
audit$ grep -n 'swift_fixture_suite\|direct_rtl\|native_nlff_rtl\|rust_reference' $J
33:    "swift_fixture_suite": {
43:    "direct_rtl": {
55:    "native_nlff_rtl": {
72:    "rust_reference": {
```

## 1/3 — The ladder: bytes, tables, traces, artifacts

```console
75:      "kat_bytes": 1024,
76:      "tables": 9,
77:      "trace_files": 10,
78:      "artifacts": 25,
79:      "reciprocal_decrypt": "PASS",
80:      "yosys_parity": "8/8 full-adder rows; 16 counter transitions; 1024 toy-ISA transitions",
```

## 2/3 — One bounded certificate plus 49 guard checks

```console
    "formal_certificate": {
      "command": "swift test -c release --filter testEnigma256FormalCertificate",
      "status": 0,
      "tests": 1,
      "failures": 0,
      "checks": [
        "bounded scramble bijection",
        "frozen reciprocity",
        "128-byte stream round-trip",
        "plugboard and XOR-center involutions plus fixed-point law",
        "exact fixture-v4 native-profile integrity"
      ]
    }
135:    "publication_guard_suite": {
136:      "command": "swift test -c release --filter Enigma256Tests",
137:      "status": 0,
138:      "tests": 49,
```

The certificate is exactly one test with five named checks. The publication
guard suite is a separate 49-test suite. Note that the canonical Swift fixture
suite in the same file reports 47 tests; these are different suites and should
not be conflated.

## 3/3 — The row this receipt does not close

```console
"optimizer_verdict": "blue_hold",
"interpretation": "bounded optimizer failure; not security evidence or a work-factor estimate",
"human_review": "pending",
"finding": "E256-003",
"review_boundary": "AI semantic review is not human acceptance and does not close E256-003",
```

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 69.00 seconds
- Size: 556,525 bytes
- MP4 SHA-256: `e16273f6ede8b01286adb706b09a23ba9607eb5e859a61e2e44039eb0289becc`
- Durable receipt SHA-256: recorded in `evidence-ladder-manifest.json`

## Visual validation

A full-resolution frame was inspected at 40 seconds. The five-check formal
certificate block and the `"tests": 49` guard-suite lines are legible.

## Claim boundary

- Playback of a preserved receipt, not a live run.
- Four agreeing implementations is a parity result, not a security result.
- The optimizer outcome is a bounded failure, labelled in the file as not
  security evidence.
- Human review is pending; audit finding E256-003 remains OPEN.
- The v1-autopsy figures narrated in this episode are not printed by this
  receipt and are not shown on screen.
