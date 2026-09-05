# Episode 12 literal terminal capture transcript

Capture: `public/captures/ep12-private-majority/episode12-full-run.mp4`  
Tape: `captures/ep12-private-majority/episode12-full-run.tape`  
Captured: 2026-09-04 13:59:20 PDT

This is a transcription of the commands and substantive output visible in the final VHS capture. Terminal line wrapping is normalized for readability; the MP4 remains the literal visual record. Full command output was also written by `tee` to `HELUT/build/episode12/capture-pass/`, and the exact hashes of those files are preserved below and in `capture-manifest.json`.

## Opening

```console
helut$ echo 'EPISODE 12 / ACTUAL TERMINAL CAPTURE'
EPISODE 12 / ACTUAL TERMINAL CAPTURE
helut$ date '+captured %Y-%m-%d %H:%M:%S %Z'
captured 2026-09-04 13:59:20 PDT
helut$ vhs --version; yosys -V; swift --version | sed -n '1p'
vhs version 0.11.0
Yosys 0.68+post (git sha1 c12172fbae8af5e20f6fb52e3d4e92d56ed587b6, Release, AppleClang clang++ 21.0.0.21000101)
swift-driver version: 1.148.6 Apple Swift version 6.3.3 (swiftlang-6.3.3.1.3 clang-2100.1.1.101)
```

## 1/6 — Write the circuit

```console
helut$ echo '1/6  WRITE THE CIRCUIT'
1/6  WRITE THE CIRCUIT
helut$ cat > /tmp/episode12-private_majority5.v
```

The following source is typed into that real pseudo-terminal:

```verilog
// Five-voter private majority, written for the HELUT concept series (Episode 12).
//
// Five ballot bits enter; one decision bit leaves. Under encrypted evaluation,
// the evaluator learns only whether the proposal passed, not the five ballots.
//
// This demonstrates the shape of a private computation. It is not a complete
// multiparty voting protocol: the SING harness owns the key and decrypts the
// result in-process to compare it with the clear golden model.
module private_majority5 (
    input  wire [4:0] votes,
    output wire       proposal_passes
);
    wire [2:0] yes_count;

    assign yes_count = {2'b0, votes[0]} +
                       {2'b0, votes[1]} +
                       {2'b0, votes[2]} +
                       {2'b0, votes[3]} +
                       {2'b0, votes[4]};

    assign proposal_passes = (yes_count >= 3'd3);
endmodule
```

After `Ctrl-D`:

```console
helut$ cmp /tmp/episode12-private_majority5.v Hardware/RTL/Examples/private_majority5.v && echo 'source matches tracked file byte-for-byte'
source matches tracked file byte-for-byte
helut$ shasum -a 256 /tmp/episode12-private_majority5.v
9df86f15425f310bbdb2966e13976202c47fe082c98cf11a70e5f8603764b59b  /tmp/episode12-private_majority5.v
```

## 2/6 — Synthesize to lookup tables

```console
helut$ echo '2/6  SYNTHESIZE TO LOOKUP TABLES'
2/6  SYNTHESIZE TO LOOKUP TABLES
helut$ yosys -Q -p 'read_verilog Hardware/RTL/Examples/private_majority5.v; hierarchy -check -top private_majority5; synth -top private_majority5 -flatten; abc -lut 4; check -assert; stat; write_json build/episode12/capture-pass/private_majority5.json' 2>&1 | tee build/episode12/capture-pass/01-synthesis.log | grep -E '=== private_majority5 ===|Found and reported 0 problems|\$lut|End of script'
Found and reported 0 problems.
Found and reported 0 problems.
=== private_majority5 ===
Found and reported 0 problems.
Found and reported 0 problems.
=== private_majority5 ===
        3   $lut
End of script. Logfile hash: 930cba26ef, time: 0.11s, user: 0.02s, system: 0.01s, MEM: 18.83 MB peak
```

The generated netlist contains three `$lut` cells with widths 4, 3, and 3.

## 3/6 — Check the two endpoints

```console
helut$ echo '3/6  CHECK THE TWO ENDPOINTS'
3/6  CHECK THE TWO ENDPOINTS
helut$ yosys -Q -p 'read_verilog Hardware/RTL/Examples/private_majority5.v; prep -top private_majority5; eval -set votes 0 -show proposal_passes; eval -set votes 31 -show proposal_passes' 2>&1 | tee build/episode12/capture-pass/02-endpoints.log | grep 'Eval result'
Eval result: \proposal_passes = 1'0.
Eval result: \proposal_passes = 1'1.
```

Thus `00000 → 0` and `11111 → 1`.

## 4/6 — Compile, then exhaust all 32 clear rows

```console
helut$ echo '4/6  COMPILE, THEN EXHAUST ALL 32 CLEAR ROWS'
4/6  COMPILE, THEN EXHAUST ALL 32 CLEAR ROWS
helut$ .build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 16 --compile-only 2>&1 | tee build/episode12/capture-pass/03-compile.log
HELUT boolean-path bench
  netlist: build/episode12/capture-pass/private_majority5.json
  N=16  B=1  ticks=10  warmup=1  reset_hold=3
  encoding: constant-fill (trivial, noise-free)
  LUT backend: multilinear

Compiled module 'private_majority5': 5 inputs, 3 LUTs, 0 DFFs, 1 outputs
Compile breakdown: boolean-safe LUT lower 0.00 s, graph build 0.00 s (total 0.00 s)
COMPILE
  total            0.0004 s
  LUT lower        0.0003 s
  graph build      0.0001 s
  cells            3 LUTs, 0 DFFs, 5 inputs, 1 outputs
  RSS delta        +1.3 MiB (after=14.5 MiB)

Stopping after compile (--compile-only).

helut$ .build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 16 --bench-equiv 2>&1 | tee build/episode12/capture-pass/04-clear-equiv.log
HELUT boolean-path bench
  netlist: build/episode12/capture-pass/private_majority5.json
  N=16  B=1  ticks=10  warmup=1  reset_hold=3
  encoding: constant-fill (trivial, noise-free)
  LUT backend: multilinear

Compiled module 'private_majority5': 5 inputs, 3 LUTs, 0 DFFs, 1 outputs
Compile breakdown: boolean-safe LUT lower 0.00 s, graph build 0.00 s (total 0.00 s)
COMPILE
  total            0.0004 s
  LUT lower        0.0002 s
  graph build      0.0001 s
  cells            3 LUTs, 0 DFFs, 5 inputs, 1 outputs
  RSS delta        +1.3 MiB (after=14.5 MiB)

Combinational netlist — no clock loop.
EQUIV (Metal PBS/multilinear ≡ CleartextNetlistSim, combinational)
  encoding: constant-fill
  LUT backend: multilinear
  rows            32
  result          PASS

RSS final 23.4 MiB (delta from start +10.2 MiB)
```

## 5/6 — Encrypt every row at demonstration size

```console
helut$ echo '5/6  ENCRYPT EVERY ROW AT DEMONSTRATION SIZE'
5/6  ENCRYPT EVERY ROW AT DEMONSTRATION SIZE
helut$ .build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 16 --bench-encrypted --cpu-only --sing --vectors 32 --paths 'blind-rotate public-ms boolean' 2>&1 | tee build/episode12/capture-pass/05-encrypted-n16-cpu.log | grep -E '^(HELUT encrypted|  poly|  stimuli|  starting|ENCRYPTED EQUIV|  rows|  wall|  classical bits|  noisy BK bound|  result)'
HELUT encrypted-netlist bench · SING
  poly N=16  LUTs=3  DFFs=0  2N=32
  stimuli=32 (max --vectors 32)  cpu-only=true  metal-netlist-only=false
  starting blind-rotate public-ms boolean
ENCRYPTED EQUIV (blind-rotate public-ms boolean)
  rows            32
  wall            0.0095 s  (0.30 ms/row)
  classical bits  8.0  (≥128? no)
  noisy BK bound  0  (exactNoiselessConstruction; decodable true)
  result          PASS
ENCRYPTED EQUIV (metal)
  result          SKIP (--cpu-only)
```

N=16 is explicitly a demonstration parameter; the output itself reports only 8.0 modeled classical bits.

## 6/6 — Run N=1024 on Metal

```console
helut$ echo '6/6  RUN N=1024 ON METAL'
6/6  RUN N=1024 ON METAL
helut$ .build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 1024 --bench-encrypted --sing --vectors 2 --paths 'blind-rotate-metal public-ms boolean' 2>&1 | tee build/episode12/capture-pass/06-encrypted-n1024-metal.log | grep -E '^(HELUT encrypted|  poly|  stimuli|  Metal BR|  starting|ENCRYPTED EQUIV|  rows|  wall|  classical bits|  ingest|  noisy BK bound|  result)'
HELUT encrypted-netlist bench · SING
  poly N=1024  LUTs=3  DFFs=0  2N=2048
  stimuli=2 (max --vectors 2)  cpu-only=false  metal-netlist-only=false
  Metal BR tile progress: quiet
  starting blind-rotate-metal public-ms boolean
ENCRYPTED EQUIV (blind-rotate-metal public-ms boolean)
  rows            2
  wall            2.5320 s  (1265.99 ms/row)
  classical bits  175.7  (≥128? yes)
  ingest ε log2   -inf  (target -64)
  noisy BK bound  0  (exactNoiselessConstruction; decodable true)
  result          PASS
```

This production-size run checks two deterministic rows. The 175.7-bit value is modeled, not independently audited; `exactNoiselessConstruction` is not a noisy-bootstrapping proof.

## Final receipt hashes

```console
helut$ echo 'CAPTURE COMPLETE / HASHED RECEIPTS'
CAPTURE COMPLETE / HASHED RECEIPTS
helut$ shasum -a 256 Hardware/RTL/Examples/private_majority5.v build/episode12/capture-pass/private_majority5.json build/episode12/capture-pass/0*.log
9df86f15425f310bbdb2966e13976202c47fe082c98cf11a70e5f8603764b59b  Hardware/RTL/Examples/private_majority5.v
b0e15e06dbeca6012019c47a354045348b8852fcdc231f2a6ef8a404a2fb56a7  build/episode12/capture-pass/private_majority5.json
a465d6c942cd378a70e02e013e94fd910e55ea1273f716d7aabd48407eae13ca  build/episode12/capture-pass/01-synthesis.log
d4157c9f335a05df3012f13ee30bbcfeea7e6f2c8efbff3622439b3e7d7a2e25  build/episode12/capture-pass/02-endpoints.log
98247deb004fad96430248b86ae18d84d4a4ff8ca18b3880021cf2b9bc33ed48  build/episode12/capture-pass/03-compile.log
0da5018a4e070f10e0708e129f05a384346340263952b8bf4aa0f01acb64eee3  build/episode12/capture-pass/04-clear-equiv.log
b5700e2789a16476cafa0e8e1953330fbcb34f2e94c8144d989db4df939e81a1  build/episode12/capture-pass/05-encrypted-n16-cpu.log
2ed3408dacc977826eca99ddc8dddef92f2ccb66e230c3f8b22af7983d3431dc  build/episode12/capture-pass/06-encrypted-n1024-metal.log
```

## Provenance and claim boundary

The earlier pre-script receipt at `HELUT/logs/helut-episode12-private-majority-20260904.log` recorded 0.0089 s for N=16 CPU and 2.7189 s for N=1024 Metal. The filmed rerun recorded 0.0095 s and 2.5320 s. These are two observations only, not a timing distribution or evidence of benchmark stability.

The experiment demonstrates encrypted evaluation in the current SING harness. That harness owns the key and decrypts the result in-process for comparison with a clear golden model. It is not a deployed multiparty voting protocol and does not establish host privacy.
