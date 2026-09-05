# Episode 12 coda — encrypted RISC-V CPU capture transcript

Capture: `public/captures/ep12-private-majority/episode12-picorv32-coda.mp4`
Tape: `captures/ep12-private-majority/episode12-picorv32-coda.tape`
Captured: 2026-09-04 15:23:30 PDT

This transcribes the commands and substantive output visible in the coda capture. Terminal line wrapping is normalized for readability; the MP4 remains the literal visual record. Full command output was written by `tee` under `HELUT/build/episode12b/capture-pass/`, which is a gitignored build directory, so `picorv32-coda-manifest.json` and this file are the durable record.

## Opening

```console
helut$ echo 'EPISODE 12 CODA / A RISC-V CPU RUNNING UNDER ENCRYPTION'
EPISODE 12 CODA / A RISC-V CPU RUNNING UNDER ENCRYPTION
helut$ date '+captured %Y-%m-%d %H:%M:%S %Z'
captured 2026-09-04 15:23:30 PDT
helut$ swift --version | sed -n '1p'
swift-driver version: 1.148.6 Apple Swift version 6.3.3 (swiftlang-6.3.3.1.3 clang-2100.1.1.101)
```

## 1/4 — The program the processor will execute

```console
helut$ echo '1/4  THE PROGRAM THE PROCESSOR WILL EXECUTE'
1/4  THE PROGRAM THE PROCESSOR WILL EXECUTE
helut$ sed -n '3,20p' Sources/HELUTCore/PicoRVHostMem.swift
/// Tiny RV32I program for `--encrypted-mem prog`:
/// `addi x1,x0,1`; NOP; `sw x1,0(x0)`; NOP; `lw x2,0(x0)`; NOPs.
/// Instruction fetches always hit ROM (Harvard). Stores/loads overlay host RAM.
package enum PicoRVTinyProgram {
    package static let addiX1Imm1: UInt32 = 0x0010_0093
    package static let swX1At0: UInt32 = 0x0010_2023
    package static let lwX2At0: UInt32 = 0x0000_2103
    package static let nop: UInt32 = 0x0000_0013

    package static func romWord(addr: UInt32) -> UInt32 {
        switch addr & ~UInt32(3) {
        case 0: return addiX1Imm1
        case 8: return swX1At0
        case 0x10: return lwX2At0
        default: return nop
        }
    }
}
```

The program is therefore:

| Address | Word | Instruction |
|---|---|---|
| `0x00` | `0x00100093` | `addi x1, x0, 1` |
| `0x04` | `0x00000013` | `nop` |
| `0x08` | `0x00102023` | `sw x1, 0(x0)` |
| `0x0c` | `0x00000013` | `nop` |
| `0x10` | `0x00002103` | `lw x2, 0(x0)` |
| `0x14`+ | `0x00000013` | `nop` |

Put in words: place one in a register, store it to memory address zero, then read it back. That is three meaningful instructions; `romWord` returns `nop` for every address at or above `0x14`, so the tail is unbounded no-ops rather than a fixed program length.

## 2/4 — Three lookup tables versus a processor

Both circuits are compiled live from tracked netlist files in the same capture, so the contrast is measured rather than asserted. `picorv32_netlist.json` and `Generated/Netlists/Examples/private_majority5_netlist.json` are both committed in HELUT, so this reproduce path resolves from a clean recursive checkout.

```console
helut$ echo '2/4  THREE LOOKUP TABLES VERSUS A PROCESSOR'
2/4  THREE LOOKUP TABLES VERSUS A PROCESSOR
helut$ .build/release/helut-bench --bench Generated/Netlists/Examples/private_majority5_netlist.json --degree 16 --compile-only 2>&1 | tee build/episode12b/capture-pass/01-compile-majority.log | grep 'Compiled module'
Compiled module 'private_majority5': 5 inputs, 3 LUTs, 0 DFFs, 1 outputs
helut$ .build/release/helut-bench --bench picorv32_netlist.json --degree 8 --compile-only 2>&1 | tee build/episode12b/capture-pass/02-compile-picorv32.log | grep -E 'Compiled module|  cells'
Compiled module 'picorv32': 102 inputs, 4785 LUTs, 1565 DFFs, 307 outputs
  cells            4785 LUTs, 1565 DFFs, 102 inputs, 307 outputs
```

The majority circuit is combinational: three lookup tables and no state. The processor is sequential: 4,785 lookup tables and 1,565 flip-flops.

## 3/4 — Execute it encrypted: fetch, store, load back

```console
helut$ echo '3/4  EXECUTE IT ENCRYPTED: FETCH, STORE, LOAD BACK'
3/4  EXECUTE IT ENCRYPTED: FETCH, STORE, LOAD BACK
helut$ .build/release/helut-bench --bench picorv32_netlist.json --degree 8 --bench-encrypted --cpu-only --sing --ticks 48 --reset-hold 3 --encrypted-mem prog --paths 'blind-rotate public-ms boolean' 2>&1 | tee build/episode12b/capture-pass/03-encrypted-picorv32.log | grep --line-buffered -E '^  (FETCH tick|STORE tick|LOAD  (req|xfer))'
  FETCH tick  5  addr=0x00000000  instr=1
  FETCH tick  8  addr=0x00000004  instr=1
  FETCH tick 11  addr=0x00000008  instr=1
  FETCH tick 14  addr=0x0000000c  instr=1
  STORE tick 16  addr=0x00000000  wstrb=0xf  wdata=0x00000001
  FETCH tick 19  addr=0x00000010  instr=1
  FETCH tick 22  addr=0x00000014  instr=1
  LOAD  req  tick 24  addr=0x00000000  bus=0x00000013  (pre-transfer)
  LOAD  xfer tick 25  addr=0x00000000  served=0x00000001  (host RAM -> mem_rdata)
  FETCH tick 27  addr=0x00000018  instr=1
  FETCH tick 30  addr=0x0000001c  instr=1
  FETCH tick 33  addr=0x00000020  instr=1
  FETCH tick 36  addr=0x00000024  instr=1
  FETCH tick 39  addr=0x00000028  instr=1
  FETCH tick 42  addr=0x0000002c  instr=1
  FETCH tick 45  addr=0x00000030  instr=1
  FETCH tick 48  addr=0x00000034  instr=1
```

The program counter advances by four every fetch. At tick 16 the store writes `0x00000001` to address zero. At tick 24 the load request appears, and at tick 25 the host serves `0x00000001` back from RAM.

### Reading the two LOAD lines

These two lines describe two different moments and both are accurate:

- `LOAD req ... bus=0x00000013 (pre-transfer)` is the value already sitting on `mem_rdata` when the request is first observed. The host is still driving the pending ROM instruction word, and `0x00000013` is the RV32I `nop` encoding.
- `LOAD xfer ... served=0x00000001` is the word the host actually drives in response, read from RAM address zero on the following tick.

Before this capture, only the first line appeared per tick, which made a correct load look as though it had returned a `nop`. The second line was added so the trace shows the served value directly. The change is additive output only; no evaluation, scheduling, metric, or PASS assertion was modified.

## 4/4 — What the encrypted run proved

```console
helut$ echo '4/4  WHAT THE ENCRYPTED RUN PROVED'
4/4  WHAT THE ENCRYPTED RUN PROVED
helut$ grep -E '^(  poly|  encrypted mem|  FETCH summary|  STORE summary|  LOAD  summary|ENCRYPTED EQUIV|  rows|  wall|  classical bits|  noisy BK|  result)' build/episode12b/capture-pass/03-encrypted-picorv32.log
  poly N=8  LUTs=4785  DFFs=1565  sequential  2N=16
  encrypted mem: tiny ROM addi; sw; lw x2,0(x0)  ticks=48  reset-hold=3
  FETCH summary  served=14  unique_addr=14  addrs=0x0,0x4,0x8,0xc,0x10,0x14,0x18,0x1c,0x20,0x24,0x28,0x2c,0x30,0x34
  STORE summary  count=1  wdata1=true  ram0=1
  LOAD  summary  requests=1  xfers=1  served=0x1  rdata1=true
ENCRYPTED EQUIV (blind-rotate public-ms boolean)
  rows            48
  wall            2.4828 s  (51.72 ms/row)
  classical bits  4.0  (≥128? no)
  noisy BK bound  0  (exactNoiselessConstruction; decodable true)
  result          PASS
ENCRYPTED EQUIV (metal)
  result          SKIP (--cpu-only)
```

Forty-eight encrypted ticks matched the clear golden model, including every flip-flop. The run reports 4.0 modeled classical bits, so it is a correctness demonstration at demonstration size, not production security.

## Final receipt hashes

```console
helut$ echo 'CODA COMPLETE / HASHED RECEIPTS'
CODA COMPLETE / HASHED RECEIPTS
helut$ shasum -a 256 picorv32_netlist.json Sources/HELUTCore/PicoRVHostMem.swift build/episode12b/capture-pass/0*.log
1e179f15813dac117ed01a37fa930a9f4ac5a1e2dfabdf8445407d5e2c1aace3  picorv32_netlist.json
3b0e706fad8163b25a69383f35c32d5d7b0b48278b44f5ee4f7eb7dfcf1cae7f  Sources/HELUTCore/PicoRVHostMem.swift
f37b5b1db8ca5d2a45782ac8d14f85a43ffe8e44acd663109463822db8ad72b7  build/episode12b/capture-pass/01-compile-majority.log
55614a965b4650eaa76b3037519b3d065c67042d2277113aa5ad5769d2ce069a  build/episode12b/capture-pass/02-compile-picorv32.log
f71ba221875a7319dc684cbaf93b39065440b387e9e35a58a4411d39c90c41db  build/episode12b/capture-pass/03-encrypted-picorv32.log
```

Every on-screen hash was recomputed after the capture and matched.

## Timing observations

| Observation | Wall | Per row |
|---|---:|---:|
| Archived pre-existing log | 3.7695 s | 78.53 ms |
| Pre-capture verification run | 2.4125 s | 50.26 ms |
| Filmed capture run | 2.4828 s | 51.72 ms |

Three individual observations on one machine. This is not a timing distribution, a stability claim, or a performance benchmark.

## Claim boundary

The encrypted evaluation covers the synthesized `picorv32` netlist. The host implements memory: it drives `mem_ready` and `mem_rdata` and observes `mem_valid`, `mem_addr`, `mem_wstrb`, and `mem_wdata`. Instruction addresses and memory data are therefore visible to the host and appear in the trace in the clear, and the SING harness owns the key and decrypts in-process to compare against a clear golden model.

N=8 is a demonstration parameter reporting 4.0 modeled classical bits. This run used CPU blind rotation with the Metal path skipped. `exactNoiselessConstruction` is not a noisy-key robustness proof. The program is three meaningful instructions in a tiny ROM padded with no-ops: this is not an operating system, not a workload benchmark, and not a production encrypted processor.

The lookup-table counts are a scale contrast, not a normalized area metric: the majority netlist was mapped up to four-input tables, while this PicoRV32 netlist tops out at three-input tables.
