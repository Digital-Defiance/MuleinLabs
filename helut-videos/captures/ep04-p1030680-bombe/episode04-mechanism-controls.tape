Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep04-p1030680-bombe/episode04-mechanism-controls.mp4"

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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C; set -o pipefail" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 4 / GRADE THE MACHINE BEFORE THE TARGET'" Enter
Type "echo 'Published-key P1030684 controls. No P1030680 data.'" Enter
Sleep 9s

Type "clear" Enter
Type "echo '1/2  INJECT 0, 1, 2 WRONG LETTERS / HOST VS METAL'" Enter
Type ".build/release/helut-bombe --garble-gpu --garble-tolerance 2 2>&1 | grep -E 'SENSITIVITY|garbled|^[[:space:]]+[0-2][[:space:]]|SPECIFICITY|tol   lanes|0/192|Mismatches must' | fold -s -w 104" Enter
Sleep 18s

Type "clear" Enter
Type "echo '2/2  SYNTHETIC FOUR-LETTER DELETION / SHOW THE LIMIT'" Enter
Type ".build/release/helut-bombe --indel-selftest 2>&1 | grep -E 'SENSITIVITY|ordinary menu|UNDAMAGED|SPLICED|wrong splices|BOARD-SPECIFICITY|distinct spliced|true splice' | fold -s -w 104" Enter
Sleep 18s

Type "echo 'SCOPE: mechanism controls only. P1030680 remains unbroken.'" Enter
Sleep 9s
