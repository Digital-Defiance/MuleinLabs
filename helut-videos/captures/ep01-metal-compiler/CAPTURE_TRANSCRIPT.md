# Episode 01 — three-tier validation live capture

Recorded: `2026-09-06`  
Duration: `33.96 s`  
MP4 SHA-256: `454e161bac637999b6a9209f3c7c5f712ab77547e01bfc593a641a5e5475eb50`  
Tape SHA-256: `df76e33652e389e32d3ec428f70bebd59dde5dada89c0cd7c08ac114a89f4426`

## Command

```bash
.build/release/helut-compile --validate
```

## Visible evidence

- `Assert: lane 42 exclusive plaintext recovery — PASS`
- `Cleartext netlist ≡ oracle for HELUT baseline — PASS`
- FHPQX prefix `ANXPANZXGRUPPEXVIERXSIEG`
- `Crib window contains SIEGFR: PASS`
- `Spike isolation of SDV among 200 hypotheses — PASS`
- `VALIDATION COMPLETE — tiers 1–3 green.`

The rendered frame was sampled after recording and all three tiers plus the final marker are visible at once.

## Boundary

One default Enigma validation fixture. The command grades an injected-lane control, clear-netlist/oracle parity, one historical vector, and one 200-hypothesis scoreboard. It is not arbitrary-Verilog correctness, encrypted evaluation, generic DFF proof, or a P1030680 result. Independent research receipt: `../../../HELUT/logs/claim-recovery-20260906T155604Z/01-compiler-validation.md`.