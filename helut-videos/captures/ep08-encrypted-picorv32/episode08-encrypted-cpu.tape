Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep08-encrypted-picorv32/episode08-encrypted-cpu.mp4"

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
Type "N=Generated/Netlists/PicoRV32/picorv32_lut6_netlist.json" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 8 / A PROCESSOR EVALUATED UNDER ENCRYPTION / LIVE RUN'" Enter
Type "echo 'PicoRV32: a real RISC-V core, synthesized by Yosys into lookup tables.'" Enter
Sleep 10s

Type "clear" Enter
Type "echo '1/2  THE CIRCUIT IS NOT A TOY'" Enter
Type "ls -lh $N | awk '{print $5, $9}'" Enter
Type "grep -c lut $N" Enter
Sleep 13s

Type "clear" Enter
Type "echo '2/2  RUN IT ENCRYPTED. COMPARE AGAINST THE CLEAR ORACLE.'" Enter
Type ".build/release/helut-bench --bench $N --degree 64 --bench-encrypted --cpu-only --sing --vectors 1 --paths 'blind-rotate public-ms boolean' | sed -n '1,17p'" Enter
Sleep 24s
