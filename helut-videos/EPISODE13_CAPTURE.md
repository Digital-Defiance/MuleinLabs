# Episode 13 capture record — AB0CDE callsign edge matcher

## Literal capture

- Tape: `captures/ep13-ab0cde/episode13-ab0cde.tape`
- Video: `public/captures/ep13-ab0cde/episode13-ab0cde.mp4`
- Manifest: `captures/ep13-ab0cde/capture-manifest.json`
- Transcript: `captures/ep13-ab0cde/CAPTURE_TRANSCRIPT.md`
- Durable full log: `captures/ep13-ab0cde/01-ab0cde-full.log`
- Public note: `public/captures/ep13-ab0cde/README.md`
- Captured: 2026-09-04 19:24:32 PDT
- Encoded media: H.264/yuv420p, 1280×720, 25 fps, 48.24 seconds, 932,025 bytes
- MP4 SHA-256: `fd1264ea5fc6386a906a087b87dbbe7f4fc6e961527f7061b3e37065fa959625`
- Tape SHA-256: `2d5a2599c05f08e567f4ada155eb957484903834b58208d282110902b1716e80`

The tape opens a real Bash pseudo-terminal, activates the local `gnuradio`
radioconda environment, displays the complete six-byte RTL circuit, validates
the 47-LUT Yosys netlist, and runs the full helper once. Unfiltered stdout and
stderr go to a `tee` log; each terminal screen projects only the decisive lines
so nothing scrolls away.

The full Episode 13 log is preserved beside the tape and transcript. It is a
byte-for-byte copy of the capture-time ignored
`HELUT/build/episode13/capture-pass/01-ab0cde-full.log`; both hash to
`4c70ca230a5c36730da27132893504c7d06150a7d0b103e411808251c8d4d58d`.

## Result visible in the film

- Authored predicate: six exact, case-sensitive ASCII bytes equal `AB0CDE`.
- Synthesized shape: 48 input bits, 47 two-input `$lut` cells, one match bit.
- Transmitted and recovered payload: `CQ CQ CQ DE AB0CDE AB0CDE K`.
- Channel receipt: 27 transmitted bytes, 27 recovered bytes, zero differences.
- Clear-oracle match completion indices: `[17, 24]`.
- Scalar host loop: 10,000 windows, 22 unique source windows, `908/908` hits;
  filmed wall observation 113.34 ms (88,229 windows/s, 11.3 µs/window).
- Encrypted freeze: one `AB0CDE` window, N=8, result `1`, PASS; filmed evaluation
  observation 1.1 ms with engine/key setup excluded.
- Final verdict: local loopback complete; no antenna used.

## Regenerate locally

From the video repository:

```bash
vhs validate captures/ep13-ab0cde/episode13-ab0cde.tape
vhs captures/ep13-ab0cde/episode13-ab0cde.tape
```

The tape does not upload or publish anything and invokes no CI service.

The scientific command run by the tape, from the HELUT root after activating the
local GNU Radio environment, is:

```bash
HELUT_RADIO_LIB="$PWD/.build/release/libHELUTRadio.dylib" \
PYTHONPATH="$PWD/Apps/gr-helut/python" \
python Apps/gr-helut/examples/helut_edge_matcher.py \
  --batch 10000 --noise 0.0 --encrypted-freeze
```

## Media validation

```bash
ffprobe -v error \
  -show_entries stream=codec_name,pix_fmt,width,height,r_frame_rate:format=duration,size \
  -of json public/captures/ep13-ab0cde/episode13-ab0cde.mp4

ffmpeg -hide_banner -loglevel error \
  -i public/captures/ep13-ab0cde/episode13-ab0cde.mp4 \
  -vf "fps=1/4,scale=640:-2,tile=4x3:padding=8:margin=8" \
  -frames:v 1 /tmp/ep13-ab0cde-contact-sheet.png
```

The contact sheet and full-resolution frames at 3, 12, 19, 30, 39, and 46
seconds were inspected. The environment receipt, source constants, LUT count,
recovered payload, both hit indices, bounded Act II/III labels, no-antenna
verdict, and all final hashes are legible. Hidden environment setup is absent.

## Composition contract

The Remotion asset path is
`captures/ep13-ab0cde/episode13-ab0cde.mp4`. A foreground `capture` scene must
use a 48.24-second duration floor, normal playback speed, and muted terminal
audio. Narration longer than the media must fall through to a static completion
mat rather than looping the evidence.

## Claim boundary

- The signal is generated locally and passes through GNU Radio's simulated
  channel model. This is not OTA reception or interception.
- The captured deterministic run uses `noise_voltage=0.0`; it does not establish
  channel-noise robustness.
- Acts I–II are clear-oracle execution.
- Act II repeats scalar host calls over 22 unique windows; `B=10000` is not a
  native tensor batch or encrypted throughput measurement.
- Act III evaluates one window at N=8. N=8 is a demonstration parameter, not
  production security, and the displayed timer excludes engine/key setup.
- The circuit is a fixed callsign literal matcher, not a general regex engine.
- The displayed timings are single observations on this machine.
