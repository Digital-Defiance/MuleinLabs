Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep09-application-gallery/episode09-radio-match.mp4"

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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 9 / A SYNTHESIZED CIRCUIT READS A BYTE STREAM / LIVE'" Enter
Type "echo 'Verilog -> Yosys -> LUT netlist -> HELUT. No string search function.'" Enter
Sleep 10s

Type "clear" Enter
Type "echo '1/3  THE CIRCUIT ANNOUNCES ITSELF, THEN CHECKS ITSELF'" Enter
Type ".build/release/helut-radio --selftest" Enter
Sleep 13s

Type "clear" Enter
Type "echo '2/3  FEED IT BYTES. WATCH THE MATCH BIT FIRE.'" Enter
Type@40ms ".build/release/helut-radio --feed --netlist regex_netlist.json --text 'SENDING DEFCON ALERT DEF'" Enter
Sleep 16s

Type "clear" Enter
Type "echo '3/3  IT ONLY KNOWS THREE BYTES. GIVE IT NONE OF THEM.'" Enter
Type@40ms ".build/release/helut-radio --feed --netlist regex_netlist.json --text 'NOTHING TO SEE HERE'" Enter
Sleep 14s
