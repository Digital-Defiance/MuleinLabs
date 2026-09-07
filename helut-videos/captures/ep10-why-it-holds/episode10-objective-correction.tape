Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep10-why-it-holds/episode10-objective-correction.mp4"

Require bash
Require shasum
Require cut

Set Shell "bash"
Set FontSize 15
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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='correction$ '; export LC_ALL=C.UTF-8" Enter
Type "C=captures/ep10-why-it-holds/ep10-enigma-dependent-comparison.md" Enter
Type "L=captures/ep10-why-it-holds/ep10-exhaust-selftest-current.log" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'CURRENT OBJECTIVE V2 / SEALED RECEIPT PLAYBACK'" Enter
Sleep 500ms
Type "echo 'SAME 72-LETTER CONTROL - FOUR CHECKPOINTS'" Enter
Sleep 500ms
Type "sed -n '11,26p' $C" Enter
Sleep 500ms
Type "echo 'comparison receipt sha256:'" Enter
Sleep 500ms
Type "shasum -a 256 $C | cut -c1-64" Enter
Sleep 14s

Type "clear" Enter
Sleep 500ms
Type "echo '1/3  LEVEL ONE IS THE UNCHANGED INTERNAL CONTROL'" Enter
Sleep 500ms
Type "sed -n '1,6p' $L" Enter
Sleep 500ms
Type "sed -n '/^Level 1/,/^$/p' $L" Enter
Sleep 500ms
Type "echo 'same rank across sparse, dense, objective v1, and objective v2'" Enter
Sleep 12s

Type "clear" Enter
Sleep 500ms
Type "echo '2/3  OBJECTIVE V2 CALIBRATES THE EXACT ATTACK SCORE'" Enter
Sleep 500ms
Type "sed -n '/^Level 2/,/^$/p' $L" Enter
Sleep 500ms
Type "echo 'v1 and v2 recover the same candidate; coordinates are corrected'" Enter
Sleep 16s

Type "clear" Enter
Sleep 500ms
Type "echo '3/3  SEPARATE FAIL-CLOSED FINAL ASSESSMENT'" Enter
Sleep 500ms
Type "sed -n '/^Level 3/,$p' $L" Enter
Sleep 500ms
Type "echo 'current self-test receipt sha256:'" Enter
Sleep 500ms
Type "shasum -a 256 $L | cut -c1-64" Enter
Sleep 17s
