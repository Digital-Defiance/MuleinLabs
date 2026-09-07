# Episode 10 capture transcript — historical sparse-model rehearsal

- Capture: `episode10-rehearsal-ceiling`
- Role: historical August sparse-model known-key receipt playback
- Tape: `episode10-rehearsal-ceiling.tape`
- Durable receipt: `ep10-exhaust-selftest-rehearsal.log`
- Video: `public/captures/ep10-why-it-holds/episode10-rehearsal-ceiling.mp4`

This capture preserves the before state of the scorer. The cracker is pointed at
a message whose key is already published, cut to the same length as the target,
and the August sparse-model pipeline still fails. That failure exposed a real
problem, but its `4/72` and `0/10` values are historical rather than current.
The superseding current receipt is `episode10-objective-correction`.

The durable log remains a byte-for-byte copy of
`HELUT/logs/exhaust-selftest-revalidate-2026-08-15.log`. It has not been rewritten
to resemble the repaired scorer.

## Opening — a control we can grade

```console
rehearsal$ echo 'A CONTROL WE CAN GRADE - NOT THE TARGET MESSAGE'
A CONTROL WE CAN GRADE - NOT THE TARGET MESSAGE
rehearsal$ sed -n '1,8p' $L
HELUT — exhaustive cracker self-test (known key)
Control message: U534 P1030684, Potsdam 1 May 1945 (published key)
Truth: UKW B, gamma, IV-III-VIII, rings AACU, message key VYAA, 10 plugs
Using first 72 letters — same length as P1030680

Reference plaintext (true key, true plugs):
  VVVUUUVIRSOBENNULEINSXXMITUUUVIRSIBENNULZWOYVIRSIBENNULDREIYZWODREISECHS
  bigram=-2.8719 IC=0.0657
```

Every answer is printed before the attempt: wheels, rings, message key, all ten
plugs, and the true plaintext with its historical scores. That makes the receipt
gradeable.

## 1/3 — Level one: can the IC sieve find the true key?

```console
Backend: Metal-ic-sweep

Level 1 — correct wheels/rings, plugs unknown, sieve = IC over 26^4 message keys
  true key IC = 0.0379
  rank = 223118 of 456976
  percentile = top 48.825%
```

This value remains current because the dense and objective repairs did not alter
the IC-only level-one sieve.

## 2/3 — Historical sparse-model phase two

```console
Level 2 — stecker hill-climb from the TRUE rotor setting
  recovered: DUESETHOTUUTKTZEIERTWEITGTVEEYDASMZUMRGUOWUPLDNUGTXXXYZIEAFFJMMENDLASZTT
  letters correct: 4/72 (6%)
  bigram=-3.1270 (true plugs: -2.8719)
  plugs recovered: 0/10 correct, 7 proposed
```

These values are the August baseline. The dense-only probe later reached
`21/72` and `4/10`; the repaired current objective reaches `25/72` and `5/10`.
All three checkpoints remain `NO BREAK`.

## 3/3 — The historical printed verdict

```console
Level 3 — verdict on the recovered text
  likeness=0.80 IC=0.0556 cribs=(none)
  NO BREAK. Candidates are indistinguishable from noise at this message length.

Read this as the ceiling: P1030680 cannot do better than this rehearsal.
```

The screen is preserved literally, including the old `likeness` label and its
then-current ceiling sentence. Current code replaces that label with unbounded
`bigram-position`, separates ranking from publication assessment, and does not
use this receipt as the current numerical ceiling.

## Media receipt

- H.264/yuv420p, 1280×720, 25 fps
- Duration: 71.48 seconds
- Size: 493,953 bytes
- MP4 SHA-256: `0af19c29e23c027e51fb4f0c11dfbabb5e69ee28686c845ec1a52d17bcd74ea0`
- Durable receipt SHA-256: recorded in `rehearsal-ceiling-manifest.json`

## Visual validation

A full-resolution frame was inspected at 60 seconds. The historical Level 3
verdict line, `NO BREAK`, and old ceiling interpretation are legible. The media
manifest binds the preserved receipt hash; the tape's historical hash command
prints only its basename and is not represented as an on-screen hash.

## Claim boundary

- Playback of a preserved receipt; no cracking run occurred during capture.
- The result is a historical sparse-model baseline, not the current scorer result.
- The receipt itself remains byte-for-byte unchanged.
- The current superseding values are `25/72`, `5/10`, seven proposed, `NO BREAK`.
- `likeness=0.80` is preserved historical output, not current confidence.
- One known-key control does not decrypt or break P1030680.
