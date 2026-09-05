# Episode 13 literal capture — AB0CDE callsign matcher

- Video: `episode13-ab0cde.mp4`
- Tape: `captures/ep13-ab0cde/episode13-ab0cde.tape`
- Captured: 2026-09-04 19:24:32 PDT
- Media: H.264/yuv420p, 1280×720, 25 fps, 48.24 seconds, 932,025 bytes
- MP4 SHA-256: `fd1264ea5fc6386a906a087b87dbbe7f4fc6e961527f7061b3e37065fa959625`

The capture uses a real Bash pseudo-terminal and the local radioconda GNU Radio
environment. It displays the authored six-byte `AB0CDE` RTL circuit, validates
its 48-input/47-LUT Yosys netlist, then runs a deterministic closed loop:
generated BPSK-like IQ, simulated AWGN at `noise_voltage=0.0`, recovered bytes,
the HELUT clear netlist oracle, 10,000 scalar host-loop windows, and one N=8
encrypted-demo freeze.

The transmitted and recovered payload is `CQ CQ CQ DE AB0CDE AB0CDE K`.
The callsign completes at payload indices 17 and 24; Act II reports `908/908`,
and the one-window encrypted freeze returns `1`.

No antenna, OTA signal, interception, upload, CI service, or billable external
service is involved. Acts I–II are clear/oracle execution. Act II is not native
tensor batching or encrypted throughput. Act III is one window at demonstration
parameter N=8, not a production-security claim, and its timer excludes engine
and key setup.

Exact reproduction commands, hashes, output, and media validation live in:

- `captures/ep13-ab0cde/capture-manifest.json`
- `captures/ep13-ab0cde/CAPTURE_TRANSCRIPT.md`
- `captures/ep13-ab0cde/01-ab0cde-full.log`
- `EPISODE13_CAPTURE.md`
