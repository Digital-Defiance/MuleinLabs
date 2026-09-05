Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep14-skeptics-benchmark/episode14-current-receipt.mp4"

Require bash
Require ffmpeg
Require shasum

Set Shell "bash"
Set FontSize 18
Set FontFamily "Menlo"
Set Width 1280
Set Height 720
Set Padding 24
Set Framerate 30
Set Theme {"background":"#091522","foreground":"#e7edf4","black":"#091522","brightBlack":"#66758a","red":"#e0574c","brightRed":"#e0574c","green":"#22a89c","brightGreen":"#22a89c","yellow":"#d4833f","brightYellow":"#d4833f","blue":"#7aa2c8","brightBlue":"#7aa2c8","magenta":"#b58cc7","brightMagenta":"#b58cc7","cyan":"#22a89c","brightCyan":"#22a89c","white":"#e7edf4","brightWhite":"#ffffff"}
Set WindowBar "Rings"
Set WindowBarSize 36
Set TypingSpeed 2ms

Hide
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='receipt$ '; export LC_ALL=C; export L=captures/ep14-skeptics-benchmark/ep14-enigma-m3-n1024-b1-x3.log; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 14 / PRESERVED ENIGMA M3 RECEIPT'" Enter
Type "echo 'ARCHIVED RECEIPT PLAYBACK - NOT A FRESH TIMING RUN'" Enter
Type "echo 'Original experiment: 2026-09-05 / Apple M4 Max'" Enter
Sleep 1s
Type "sed -n '1,5p' $L" Enter
Type "shasum -a 256 $L | sed 's#captures/ep14-skeptics-benchmark/##'" Enter
Sleep 10s

Type "clear" Enter
Type "echo '1/4  GRAPH + ENCODING BOUNDARY'" Enter
Type "grep -m 1 -E 'Compiled module' $L" Enter
Type "grep -m 3 -E 'N=1024|encoding:|LUT backend' $L" Enter
Type "echo 'Scope: constant-fill / trivial / noise-free / not encrypted'" Enter
Sleep 13s

Type "clear" Enter
Type "echo '2/4  THREE RUNS - SETUP, STEADY TICKS, MEMORY'" Enter
Type@1ms "grep -E '^######## run|^  total            |^  tick 1 [(]JIT[)]|^  steady avg|^  steady Hz|^RSS final' $L" Enter
Sleep 14s

Type "clear" Enter
Type "echo '3/4  EQUIVALENCE GATE - CLEAR ORACLE = METAL'" Enter
Type@1ms "grep -E '^######## run|^  plaintext|^  clear          |^  metal          |^  result          PASS' $L" Enter
Sleep 14s

Type "clear" Enter
Type "echo '4/4  MEDIAN + SPREAD QUOTED IN THE EPISODE'" Enter
Type@1ms "sed -n '/^######## provenance/,/^# Cold-pass/p' $L" Enter
Type "echo 'BOUNDARY: B=1; no native baseline; no batch-throughput claim'" Enter
Type "shasum -a 256 $L | sed 's#captures/ep14-skeptics-benchmark/##'" Enter
Sleep 31s
