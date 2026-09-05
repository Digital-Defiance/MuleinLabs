# Episode 12 terminal capture

`episode12-full-run.mp4` is generated locally by the tracked VHS tape at `captures/ep12-private-majority/episode12-full-run.tape`.

The tape opens a real Bash pseudo-terminal, types the complete Verilog into `/tmp`, verifies that it matches the tracked source byte-for-byte, and then reruns all six experiment stages. Full outputs are written by `tee` under `HELUT/build/episode12/capture-pass/`; the terminal displays concise decisive lines.

The final filmed rerun produced three LUTs, exhaustive 32-row clear equivalence PASS, exhaustive 32-row N=16 encrypted CPU PASS in 0.0095 s, and two-row N=1024 Metal PASS in 2.5320 s at 175.7 modeled classical bits. The initial pre-script receipt remains separate at `HELUT/logs/helut-episode12-private-majority-20260904.log` with its original 0.0089 s and 2.7189 s observations; two runs are not a timing distribution.

## Coda: encrypted RISC-V CPU

`episode12-picorv32-coda.mp4` is a second capture from the tracked tape at `captures/ep12-private-majority/episode12-picorv32-coda.tape`. It exists to give the episode a scale contrast, and it compiles both circuits live in the same run:

- `private_majority5`: 5 inputs, 3 LUTs, 0 DFFs, 1 output
- `picorv32`: 102 inputs, 4,785 LUTs, 1,565 DFFs, 307 outputs

It then executes a tiny RV32I program under encryption for 48 ticks: 14 instruction fetches advancing the program counter from `0x0` to `0x34`, a store of `0x00000001` to address zero, and a load that the host serves back as `0x00000001`. The program is three meaningful instructions padded with no-ops. The run passed with 48 of 48 rows matching the clear golden model in 2.4828 s at 4.0 modeled classical bits.

The lookup-table counts are a scale contrast rather than a normalized area metric: the majority netlist was mapped up to four-input tables while this PicoRV32 netlist tops out at three-input tables.

This is demonstration size, not production security. The host implements memory, so instruction addresses and memory data are visible to it and appear in the trace in the clear; only the synthesized CPU netlist is evaluated under encryption. The Metal path was skipped by `--cpu-only`.

## Durable provenance

- `captures/ep12-private-majority/capture-manifest.json` records tool versions, MP4 metadata, exact hashes, metrics, validation, and claim boundaries.
- `captures/ep12-private-majority/CAPTURE_TRANSCRIPT.md` records every command and substantive visible output with terminal line wrapping normalized.
- `captures/ep12-private-majority/episode12-full-run.tape` is the reproducible capture program.
- `captures/ep12-private-majority/picorv32-coda-manifest.json` and `PICORV32_CODA_TRANSCRIPT.md` are the equivalent records for the coda, including the trace-clarification note.

No capture is uploaded. The harness owns the key and decrypts in-process; this is not a deployed multiparty voting protocol or a host-privacy proof. The 175.7-bit value is modeled, and the reported zero bound uses `exactNoiselessConstruction`.
