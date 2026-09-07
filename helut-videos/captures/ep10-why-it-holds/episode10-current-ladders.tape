Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep10-why-it-holds/episode10-current-ladders.mp4"

Require bash
Require shasum
Require cut

Set Shell "bash"
Set FontSize 14
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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='ladders$ '; export LC_ALL=C.UTF-8" Enter
Type "N=captures/ep10-why-it-holds/ep10-ostwald-naval-ab-current.log" Enter
Type "S=captures/ep10-why-it-holds/ep10-ostwald-seed-ladder-current.log" Enter
Type "C=captures/ep10-why-it-holds/ep10-enigma-dependent-comparison.md" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'CURRENT OBJECTIVE-V2-BINARY CONTROL RECEIPTS'" Enter
Sleep 500ms
Type "echo 'SEALED PLAYBACK - NO EXPERIMENT RUNS DURING CAPTURE'" Enter
Sleep 500ms
Type "echo 'naval / seed / comparison sha256 (in order):'" Enter
Sleep 500ms
Type "shasum -a 256 $N $S $C | cut -c1-64" Enter
Sleep 500ms
Type "sed -n '1,6p' $N" Enter
Sleep 11s

Type "clear" Enter
Sleep 500ms
Type "echo '1/3  GENERIC VS LEAVE-ONE-OUT NAVAL TRIGRAMS'" Enter
Sleep 500ms
Type "grep -E '^########|^trigram model|^scorer|^ +72|^ +252' $N" Enter
Sleep 17s

Type "clear" Enter
Sleep 500ms
Type "echo '2/3  ORACLE PLUG-SEEDING LADDER AT 72 LETTERS'" Enter
Sleep 500ms
Type "sed -n '1,17p' $S" Enter
Sleep 18s

Type "clear" Enter
Sleep 500ms
Type "echo '3/3  DEPENDENCY AND CLAIM BOUNDARIES'" Enter
Sleep 500ms
Type "sed -n '3,7p' $C" Enter
Sleep 500ms
Type "sed -n '61,64p' $C" Enter
Sleep 500ms
Type "echo 'P1030680: NO KEY, NO PLAINTEXT, NO BREAK'" Enter
Sleep 17s
