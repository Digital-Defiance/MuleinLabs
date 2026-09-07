Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep15-melt-freeze-prove/episode15-abc-comparison.mp4"

Require bash
Require shasum

Set Shell "bash"
Set FontSize 16
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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='abc$ '; export LC_ALL=C" Enter
Type "L=captures/ep15-melt-freeze-prove/ep15-structural-abc-benchmark.log" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'HELUT SEARCH vs ABC / PRESERVED RECEIPT'" Enter
Type "sed -n '1,7p' $L" Enter
Type "shasum -a 256 $L | sed 's#.*/##'" Enter
Sleep 13s

Type "clear" Enter
Type "echo '1/4  ONE FLOW, RUN IDENTICALLY ON BOTH SIDES'" Enter
Type "sed -n '/^FLOW/,/^$/p' $L" Enter
Sleep 17s

Type "clear" Enter
Type "echo '2/4  BEFORE MAPPING: SEARCH REMOVES REAL CELLS'" Enter
Type "sed -n '/^CIRCUIT/,/^$/p' $L" Enter
Sleep 20s

Type "clear" Enter
Type "echo '3/4  AFTER IDENTICAL abc -lut 6: THE NULL'" Enter
Type "sed -n '/^POST_ABC_RESULT/,/^$/p' $L" Enter
Sleep 18s

Type "clear" Enter
Type "echo '4/4  EVERY FINALIST PROVED + CLAIM BOUNDARY'" Enter
Type "sed -n '/^FORMAL_RESULT/,/^$/p' $L" Enter
Type "sed -n '/^CLAIM_BOUNDARY/,$p' $L" Enter
Type "shasum -a 256 $L | sed 's#.*/##'" Enter
Sleep 22s
