# Episode 13 literal capture transcript — AB0CDE callsign matcher

- Capture: `episode13-ab0cde-full-run`
- Tape: `episode13-ab0cde.tape`
- Video: `public/captures/ep13-ab0cde/episode13-ab0cde.mp4`
- Captured: 2026-09-04 19:24:32 PDT
- Full raw output: `01-ab0cde-full.log`

Line wrapping below is normalized for readability. The MP4 is the literal visual
record; the durable raw log is a byte-for-byte copy of the unfiltered `tee`
output produced during recording.

## Environment

```console
helut$ echo 'EPISODE 13 / AB0CDE CALLSIGN EDGE MATCHER'
EPISODE 13 / AB0CDE CALLSIGN EDGE MATCHER
helut$ date '+captured %Y-%m-%d %H:%M:%S %Z'
captured 2026-09-04 19:24:32 PDT
helut$ python -c 'from gnuradio import gr; print(gr.version())' | sed 's/^/GNU Radio /'
GNU Radio 3.10.12.0
helut$ vhs --version; yosys -V; swift --version | sed -n '1p'
vhs version 0.11.0
Yosys 0.68+post (git sha1 c12172fbae8af5e20f6fb52e3d4e92d56ed587b6, Release, AppleClang clang++ 21.0.0.21000101)
swift-driver version: 1.148.6 Apple Swift version 6.3.3 (swiftlang-6.3.3.1.3 clang-2100.1.1.101)
```

## 1/4 — Exact six-byte circuit of record

```console
helut$ sed -n '1,17p' Hardware/RTL/Examples/ab0cde_matcher.v
module ab0cde_matcher(
    input [7:0] char0,
    input [7:0] char1,
    input [7:0] char2,
    input [7:0] char3,
    input [7:0] char4,
    input [7:0] char5,
    output match
);
    // Matches the exact, case-sensitive ASCII demonstration callsign "AB0CDE".
    assign match = (char0 == 8'h41) &&
                   (char1 == 8'h42) &&
                   (char2 == 8'h30) &&
                   (char3 == 8'h43) &&
                   (char4 == 8'h44) &&
                   (char5 == 8'h45);
endmodule
helut$ shasum -a 256 Hardware/RTL/Examples/ab0cde_matcher.v | sed 's#Hardware/RTL/Examples/##'
2ad6a707bac6dae62e8d52ce1c51b00a9e8e41c5483ddac8529c6e816a1e5ebf  ab0cde_matcher.v
```

This is fixed logic for six exact, case-sensitive bytes. It is not a runtime-
configurable or general regular-expression engine.

## 2/4 — Yosys receipt

```console
helut$ yosys -Q -p 'read_json Generated/Netlists/Examples/ab0cde_netlist.json; hierarchy -check -top ab0cde_matcher; check -assert; stat' 2>&1 | grep -E 'Found and reported 0 problems|=== ab0cde_matcher ===|ports|port bits|cells|[$]lut'
Found and reported 0 problems.
=== ab0cde_matcher ===
        7 ports
       49 port bits
       47 cells
       47   $lut
helut$ shasum -a 256 Generated/Netlists/Examples/ab0cde_netlist.json | sed 's#Generated/Netlists/Examples/##'
366c65799aa45c20d2502960ffb6bb19d64ca8179b82a9c39099b815012d7462  ab0cde_netlist.json
```

The 49 total port bits are 48 input bits plus the one-bit `match` output.

## 3/4 — Local IQ, recovered bytes, clear oracle

The visible command ran the complete three-act helper once, preserved its full
stdout and stderr with `tee`, and projected only Act I onto this screen.

```console
helut$ make radio-edge 2>&1 | tee build/episode13/capture-pass/01-ab0cde-full.log | grep -E '^(HELUT Callsign|  netlist:|  pattern:|  TX payload:|[[]Act I[]]|        recovered=|        .*CALLSIGN MATCH)'
HELUT Callsign Edge Matcher  (closed-loop, no OTA / no antenna)
  netlist:   /Volumes/Code/MuleinLabs/HELUT/Generated/Netlists/Examples/ab0cde_netlist.json
  pattern:   b'AB0CDE'  (6 exact ASCII bytes)
  TX payload:b'CQ CQ CQ DE AB0CDE AB0CDE K'
[Act I] GNU Radio local IQ  noise=0.0  sps=4  iq_samps=1112  dsp=4.63 ms
[Act I] channel receipt  tx_bytes=27  rx_bytes=27  byte_differences=0
[Act I] HELUT Yosys netlist  module=ab0cde_matcher  mode=clear  input_bits=48
        recovered=b'CQ CQ CQ DE AB0CDE AB0CDE K'
        ★ CALLSIGN MATCH completes at payload byte 17
        ★ CALLSIGN MATCH completes at payload byte 24
[Act I] clear feed  0.28 ms  (94876 bytes/s)  hits=[17, 24]
[Act I] PASS  HELUT agrees with recovered bytes; transmitted callsign windows survived at [17, 24]
```

The `AA55` preamble is used only for alignment and is stripped before HELUT sees
the payload, so indices 17 and 24 are zero-based payload completion positions.

## 4/4 — Bounded clear repetition and one encrypted window

```console
helut$ grep -E '^[[]Act II[]]|not native tensor batch|^[[]Act III[]]|N=8 demonstration|blind-rotate demo|^OK  ' build/episode13/capture-pass/01-ab0cde-full.log
[Act II] clear scalar host-loop  B=10000  source_windows=22  hits=908/908  verdict=PASS
         wall=113.34 ms  (88229 win/s)  ~11.3 µs/window  (not native tensor batch)
[Act III] encrypted-demo freeze  window[12:18]=b'AB0CDE'
          N=8 demonstration parameter; one window; not production security
[Act III] result=1 expected=1  verdict=PASS  eval_wall=1.1 ms
          blind-rotate demo path; engine/key setup excluded from timer
OK  — callsign envelope demo complete (local loopback; no antenna used)
```

Act II is 10,000 scalar clear-oracle evaluations built by wrapping 22 distinct
recovered-payload windows. Act III evaluates exactly one six-byte window at N=8.

## Final visible hashes

```console
2ad6a707bac6dae62e8d52ce1c51b00a9e8e41c5483ddac8529c6e816a1e5ebf  ab0cde_matcher.v
366c65799aa45c20d2502960ffb6bb19d64ca8179b82a9c39099b815012d7462  ab0cde_netlist.json
b9e31702bdfb56c89ef89c8173940b4cc455c2e49f8dbd0688a4e8a05ce5e2c3  helut_edge_matcher.py
4c70ca230a5c36730da27132893504c7d06150a7d0b103e411808251c8d4d58d  01-ab0cde-full.log
```

The capture-time log under `HELUT/build/` is ignored by Git. Its bytes are
preserved in this capture directory and verified with `cmp`; both copies have
the same final hash above.

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 48.24 seconds
- Size: 932,025 bytes
- MP4 SHA-256: `fd1264ea5fc6386a906a087b87dbbe7f4fc6e961527f7061b3e37065fa959625`
- Tape SHA-256: `2d5a2599c05f08e567f4ada155eb957484903834b58208d282110902b1716e80`

## Visual validation

A contact sheet and full-resolution frames at 3, 12, 19, 30, 39, and 46 seconds
were inspected. The environment receipt, complete source constants, LUT count,
recovered payload, both hit indices, bounded Act II/III labels, no-antenna
verdict, and final hashes are legible. Hidden setup is absent.

## Claim boundary

- This is a finite local GNU Radio vector-source loop through a simulated channel.
  No antenna, OTA signal, reception, or interception occurred.
- `noise_voltage=0.0` was selected for deterministic capture; this does not prove
  recovery robustness under noise.
- Acts I–II are clear Boolean-oracle execution.
- The 10,000-window figure is scalar host-loop repetition over 22 unique windows,
  not a native tensor batch and not encrypted throughput.
- Act III is one window at demonstration parameter N=8, not production security;
  its timer excludes engine and key setup.
- Timings are individual local observations, not benchmark distributions.
