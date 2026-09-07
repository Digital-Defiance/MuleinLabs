# Episode 03 — TensorLUT proof-ladder live capture

Recorded: `2026-09-06`  
Duration: `63.84 s`  
MP4 SHA-256: `6b381549e92958492d54b75358f812345e0cc51e68fba633ca3f10b6e5c1e30e`  
Tape SHA-256: `89f0cb986f97162b591e2dbaf4667b13cbf586ab89e5811b20d59ac004826614`

The tape invokes the prebuilt release XCTest bundle directly to avoid build-planning variance.

## Commands

```bash
B=.build/arm64-apple-macosx/release/helutPackageTests.xctest
xcrun xctest -XCTest HELUTTests.TFHESeamTests/testTensorLUTFormalCertificate $B
xcrun xctest -XCTest HELUTTests.TensorLUTMeltScalingTests/testMeltScalingByMeltRegionSize $B
xcrun xctest -XCTest HELUTTests.TensorLUTMeltScalingTests/testColdStartMeltIsBudgetLeverOrBoundary $B
```

## Visible evidence

- The formal-certificate test passes.
- At one fixed budget, melting 2/8, 4/8, and 6/8 LUTs yields `PROVED`, fitness `0`, and zero fractional entries.
- Melting 8/8 at that budget yields `REFUTED`, fitness `-16`, despite zero fractional entries.
- The same 8/8 fixture at 500 generations yields `PROVED`, fitness `0`.

Rendered frames were sampled after recording. Both the 2/4/6/8 table and the 120-versus-500 budget table are readable.

## Boundary

The analytic certificate remains hypothesis-scoped. The larger rows are deterministic SAT-backed ripple-adder fixtures, not arbitrary-topology completeness or guaranteed convergence. The video intentionally includes the low-budget failure. Independent research receipt: `../../../HELUT/logs/claim-recovery-20260906T155604Z/03-tensorlut-proof-ladder.md`.