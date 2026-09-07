Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep01-metal-compiler/episode01-three-tier-validation.mp4"

Require bash

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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 1 / THREE-TIER VALIDATION / LIVE RUN'" Enter
Type "echo 'One named Enigma fixture. Three independent failure points.'" Enter
Sleep 9s

Type "clear" Enter
Type "echo 'RUN: synthetic lane, historical vector, scoreboard spike'" Enter
Type ".build/release/helut-compile --validate" Enter
Sleep 16s

Type "echo 'SCOPE: one Enigma control; not arbitrary Verilog; not FHE.'" Enter
Sleep 9s
