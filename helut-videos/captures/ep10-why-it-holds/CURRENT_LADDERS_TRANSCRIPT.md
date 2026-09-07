# Episode 10 capture transcript — objective-v2-binary control ladders

- Capture: `episode10-current-ladders`
- Role: current target-length ranking-control receipt playback
- Tape: `episode10-current-ladders.tape`
- Durable receipts: `ep10-ostwald-naval-ab-current.log`, `ep10-ostwald-seed-ladder-current.log`, `ep10-enigma-dependent-comparison.md`
- Video: `public/captures/ep10-why-it-holds/episode10-current-ladders.mp4`

This capture runs no experiment. It plays byte-for-byte copies of sealed
normalized tables from `HELUT/logs/enigma-dependent-rerun-20260907T030037Z/`
and prints all three local receipt hashes. The commands were rerun against the
objective-v2 binary as binary-bound negative controls, but their legacy staged
scorers do not consume `EnigmaSearchObjective`. Every raw stdout hash is
byte-identical to the preceding objective-v1 bundle.

## 1/3 — Generic versus leave-one-out naval trigrams

The screen shows both the target-length row and the already-winning long row:

```text
model                         len  ctrls  wins  win%  medMargin  plugs  letters
generic                        72     30     5   17%    -0.2306   1/10       7%
naval leave-one-out            72     30     4   13%    -0.2496   1/10       7%
generic                       252      3     3  100%    +0.9273  10/10     100%
naval leave-one-out           252      3     3  100%    +1.1531  10/10     100%
```

At 72 letters both median margins are negative and naval is slightly worse.
Naval specialization improves only the 252-letter arm, where both models already
win every control.

## 2/3 — Oracle plug-seeding ladder

```text
 seeded ctrls  win    win%  medMargin    medZ  plugs   corr
      0    10    2     20%    -0.1226    0.32   1/10     7%
      2    10    3     30%    -0.1005    0.63   3/10    11%
      4    10    5     50%    +0.3308    4.17   6/10    47%
      6    10    9     90%    +0.6656    5.41   8/10    85%
      8    10   10    100%    +1.0488    7.65  10/10   100%
```

The median sign still flips at four oracle-correct plugs. All five raw stdout
hashes match the preceding v1-binary bundle because this staged scorer does not
consume the corrected search objective. The six- and eight-plug values also
happen to match August, but trigram dominance is not used to explain v1/v2
identity.

## 3/3 — Dependency and claim boundaries

The final screen prints the authoritative dependency statement: the known-shell
self-test consumes `EnigmaSearchObjective`, while the generic/naval and seed
commands do not. It then shows the oracle upper-bound language and closes with:

```text
P1030680: NO KEY, NO PLAINTEXT, NO BREAK
```

These Ostwald rows deliberately retain the historical staged
IC→bigram→trigram ranking benchmark for comparability. They never emit a final
publication verdict. The seed ladder is an oracle upper bound, not a crib-free
break or a way to find a target stop.

## Media receipt

- H.264/yuv420p, 1280×720, encoded at 25 fps
- Duration: 68.60 seconds
- Size: 594,360 bytes
- MP4 SHA-256: `d3a376de251950d978061b67819b3301db5ac938a6e44eb12a8c5e75bd6f6284`
- Tape SHA-256: `5e3de6f93ac53dd87c94f2bdd4708a18f32f69f9dc1c8a2773a248d3407c1c0a`
- Receipt SHA-256 values: recorded in `current-ladders-manifest.json`

## Visual validation

Full-resolution frames were inspected at 8, 23, 42, and 60 seconds. The complete
naval/seed/comparison hashes, full two-line objective-independence disclaimer,
generic/naval target and long rows, all five seed rows plus `EXIT=0`, dependency
statement, oracle boundary, and closing `NO KEY, NO PLAINTEXT, NO BREAK` are
legible. No prompt or command echo overlaps evidence, and hidden setup is not
visible.

## Claim boundary

- Playback of sealed receipts; no benchmark or cracking run occurred during capture.
- All three local receipt files are byte-for-byte copies of their v2 HELUT sources.
- These commands do not consume `EnigmaSearchObjective`; objective v2 did not change their rows.
- The generic/naval table is a ranking A/B, not a publication verdict.
- The seed ladder supplies oracle-correct plugs at truth and random plugs at decoys.
- Four oracle plugs flipping the median sign does not find a true target stop.
- P1030680 remains without a key, plaintext, or break.
