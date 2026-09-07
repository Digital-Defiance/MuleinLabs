# Episode 04 — Bombe mechanism-control live capture

Recorded: `2026-09-06`  
Duration: `54.28 s`  
MP4 SHA-256: `da0563db903749c5b115b8c55ce5c53b015ba155a7f0340aec9ca659736b8001`  
Tape SHA-256: `23b2d4623b59ea74e16d57176c6469d23679fe253415044752930c798b13f958`

## Commands

```bash
.build/release/helut-bombe --garble-gpu --garble-tolerance 2
.build/release/helut-bombe --indel-selftest
```

The filmed views filter only decisive lines; the underlying commands run in full with `pipefail` enabled.

## Visible evidence

Garble/Metal screen:

- 0 injected substitutions: exact and tolerant paths keep the true lane.
- 1 and 2 substitutions: exact loses; matching tolerance keeps.
- Host and Metal agree.
- Tolerances 0/1/2 each retain one lane on the clean full sweep.
- `0/192` host/GPU mismatches at every tolerance.

Indel screen:

- ordinary damaged menu: illegal by self-encipherment;
- undamaged bound: `KEPT 25/25`;
- correct spliced menu: `KEPT 25/25`;
- wrong splices killed by legality: 28;
- wrong splices reaching the board: 0;
- `BOARD-SPECIFICITY IS UNMEASURED HERE`;
- 302 distinct spliced menus.

Rendered frames were sampled after recording; both the parity table and the unmeasured-specificity warning are visible.

## Boundary

Published-key P1030684 and synthetic damage only. These screens grade mechanisms; they contain no P1030680 data and establish no target corruption, key, plaintext, decrypt, or BREAK gate. Independent research receipt: `../../../HELUT/logs/claim-recovery-20260906T155604Z/04-bombe-mechanism-controls.md`.