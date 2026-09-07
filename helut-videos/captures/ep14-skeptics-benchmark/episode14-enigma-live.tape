Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep14-skeptics-benchmark/episode14-enigma-live.mp4"

Require bash

Set Shell "bash"
Set FontSize 17
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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C" Enter
Type "E='--bench enigma_netlist.json --degree 1024 --batch 1 --ticks 10 --warmup 1 --reset-hold 3 --bench-equiv'" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 14 / ENIGMA M3 AT N=1024 / LIVE RUN - NOT A REPLAY'" Enter
Type "echo 'A synthesized Enigma rotor machine, evaluated as tensors on Metal.'" Enter
Sleep 10s

Type "clear" Enter
Type "echo '1/2  ONE FULL RUN: COMPILE, TICKS, THEN THE EQUIVALENCE GATE'" Enter
Type ".build/release/helut-bench $E | grep -E 'netlist:|device:|N=1024|batch mode|encoding:|Compiled module|^COMPILE|^  total|^  tick 1 |steady avg|steady Hz|^EQUIV|plaintext|^  clear|^  metal|^  stream|result |RSS final'" Enter
Sleep 32s

Type "clear" Enter
Type "echo '2/2  RUN IT THREE TIMES. THIS IS WHY WE QUOTE A MEDIAN.'" Enter
Type "for i in 1 2 3; do .build/release/helut-bench $E | grep -E 'steady Hz|result '; done" Enter
Sleep 22s
