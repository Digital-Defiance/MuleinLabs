# Episode 15 capture transcript — HELUT search versus identical ABC

- Capture: `episode15-abc-comparison`
- Role: sealed structural-versus-ABC receipt playback
- Tape: `episode15-abc-comparison.tape`
- Durable receipt: `ep15-structural-abc-benchmark.log`
- Video: `public/captures/ep15-melt-freeze-prove/episode15-abc-comparison.mp4`

This capture exists to answer one question directly: **how does HELUT's
simplification compare with logic simplification that already exists?** The
answer on screen is a measured null, not a win. Nothing is re-run for the
capture; the tape replays a preserved receipt and prints its SHA-256 twice.

The durable log is a byte-for-byte copy of
`HELUT/logs/helut-structural-abc-20260906T004058Z.log`.

## Opening — provenance

```console
abc$ echo 'HELUT SEARCH vs ABC / PRESERVED RECEIPT'
HELUT SEARCH vs ABC / PRESERVED RECEIPT
abc$ sed -n '1,7p' $L
HELUT structural evolution versus identical ABC receipt
schema=helut.tensorlut.structural-abc-benchmark.v1
timestamp_utc=2026-09-06T00:41:15Z
command=env HELUT_STRUCTURAL_BENCH_ARTIFACT_DIR=... swift test -c release --skip-build --filter TensorLUTStructuralBenchmarkTests
yosys=Yosys 0.68+post (git sha1 c12172fbae8af5e20f6fb52e3d4e92d56ed587b6)
report=logs/helut-structural-abc-20260906T004058Z/report.json
report_sha256=2d22285f2d96b01e5d4659a04ddf37de8e6be1765e45b50863c00e85a1d57e32
abc$ shasum -a 256 $L | sed 's#.*/##'
e2947a75dc6d693e359c7d88b4d4c6088345ac420852916f1c34a52ef79d2e6f  ep15-structural-abc-benchmark.log
```

## 1/4 — One flow, run identically on both sides

```console
FLOW (identical for every baseline and finalist):
  map=read LUT6 model + emitted candidate; hierarchy -check; proc; flatten; opt; techmap; opt; abc -lut 6; opt_clean; check -assert; write_json
  area_proxy=post-ABC $lut cell count
  timing_proxy=maximum post-ABC output-cone LUT levels
  proof=read mapped JSON + independent behavioral RTL; miter -equiv -flatten; sat -prove trigger 0
```

This is the fairness contract. The hand-designed baseline and the evolved
candidate go through the *same* Yosys and ABC recipe, so the mapper cannot be
blamed for either result. Area and depth are post-mapping proxies, and each
finalist is separately proved against independent behavioural RTL.

## 2/4 — Before mapping, the search removes real cells

```console
CIRCUIT                 search rows       pre baseline -> evolved       mapped baseline -> evolved
parity12                4096/4096         7 LUT d3 -> 3 LUT d2          3 LUT d2 -> 3 LUT d2
6-input decision tree   64/64             3 LUT d2 -> 1 LUT d1          1 LUT d1 -> 1 LUT d1
8:1 mux                 2048/2048         15 LUT d4 -> 7 LUT d3         3 LUT d2 -> 3 LUT d2
popcount6               64/64             9 LUT d2 -> 3 LUT d1          3 LUT d1 -> 3 LUT d1
3x3 multiplier          64/64             18 LUT d2 -> 6 LUT d1         6 LUT d1 -> 6 LUT d1
8-bit adder             512/65536         41 LUT d9 -> 16 LUT d8        14 LUT d3 -> 14 LUT d3
```

The third column is the flattering one, and it is real: 41 tables down to 16 on
the adder, 15 down to 7 on the multiplexer, 18 down to 6 on the multiplier. A
project that wanted a headline would stop here. The fourth column is why we do
not.

## 3/4 — After identical `abc -lut 6`: the null

```console
POST_ABC_RESULT:
  mapped_lut_wins=0 mapped_lut_ties=18 mapped_lut_losses=0
  mapped_depth_wins=0 mapped_depth_ties=18 mapped_depth_losses=0
  verdict=honest null: restricted structural evolution removed redundant pre-map cones, but ABC removed the same redundancy and no retained finalist beat or lost to its identically mapped baseline.
```

Six circuits times three seeds is 18 comparisons. Zero wins, 18 ties, zero
losses, on both cell count and depth. The receipt names its own verdict an
honest null.

## 4/4 — Every finalist proved, and the boundary

```console
FORMAL_RESULT:
  baselines=6 proved=6
  unique_retained_finalists=9 proved=9 refuted=0 inconclusive=0
  seed_results=18 retained_and_proved=18
  8-bit-adder search was sampled, but every mapped finalist was SAT-proven against behavioral 8-bit addition over the full Boolean input space.

CLAIM_BOUNDARY:
  LUT6 count and LUT-level depth under this one ABC flow are implementation proxies only.
  This does not establish physical area, delay, frequency, power, or a general advantage over ABC.
```

The null is not a failed experiment. Every discovered circuit was still correct
under SAT over the full input space; it simply was not *smaller* once a real
mapper had its turn.

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 88.84 seconds
- Size: 717,372 bytes
- MP4 SHA-256: `55d9ec7d2744f92c0533713cc8175249bf4b3221a20e7a0e7f3129e2e7c45515`
- Tape SHA-256: computed in `abc-comparison-manifest.json`
- Durable receipt SHA-256: `e2947a75dc6d693e359c7d88b4d4c6088345ac420852916f1c34a52ef79d2e6f`

## Visual validation

Full-resolution frames were inspected at 45 and 62 seconds. The six-circuit
table with both pre-map and mapped columns, and the zero-wins/18-ties/zero-losses
block with its `honest null` verdict, are legible. VHS overlaps the tail of some
typed command echoes at prompt boundaries; that artifact is retained.

## Claim boundary

- Playback of a preserved receipt. No search, synthesis, or proof ran during capture.
- The outcome is a null. HELUT did not beat ABC, and it did not lose to ABC.
- Pre-mapping reductions are genuine but do not survive as a simplification win.
- LUT count and depth under one recipe are proxies, not physical area, delay,
  frequency, or power.
- Six small fixtures on one host. Arbitrary topologies remain open.
- The 8-bit adder search was sampled at 512 of 65,536 rows; the proof was still
  full-domain.
