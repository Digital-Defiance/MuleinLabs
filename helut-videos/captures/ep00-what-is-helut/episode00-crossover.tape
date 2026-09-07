Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep00-what-is-helut/episode00-crossover.mp4"

Require bash
Require swift
Require verilator

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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 0 / HELUT vs VERILATOR / LIVE RUN'" Enter
Type "verilator --version" Enter
Type "echo 'Same emitted circuit. Same stimulus. Same digest, or the timings are void.'" Enter
Sleep 9s

Hide
Type "bench() { swift test -c release --filter NativeBaselineComparisonTests 2>&1 | grep -E '^NATIVE_BASELINE' | fold -s -w 104; }" Enter
Show
Type "bench" Enter
Sleep 30s
