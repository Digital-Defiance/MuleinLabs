Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep02-torus-fhe/episode02-revalidation-ledger.mp4"

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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='revalidate$ '; export LC_ALL=C" Enter
Type "L=captures/ep02-torus-fhe/ep02-revalidation-summary.txt" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'ENCRYPTED RE-VALIDATION LEDGER / PRESERVED RECEIPT'" Enter
Type "echo 'RUN AFTER THE DETERMINISM FIX - INCLUDES ITS OWN FAILURE'" Enter
Type "sed -n '1,3p' $L" Enter
Type "shasum -a 256 $L | sed 's#.*/##'" Enter
Sleep 13s

Type "clear" Enter
Type "echo '1/3  NOISE ROWS - COMPLETENESS, NOT THE GATE'" Enter
Type "sed -n '/^-- noise/,/^$/p' $L" Enter
Sleep 17s

Type "clear" Enter
Type "echo '2/3  ROWS THAT ACTUALLY EXERCISE THE FIXED TICK PATH'" Enter
Type "sed -n '/^-- encrypted SING/,/^$/p' $L" Enter
Sleep 18s

Type "clear" Enter
Type "echo '3/3  TOTALS - AND THE WARNING THE FILE PRINTS ITSELF'" Enter
Type "sed -n '/^finished/,$p' $L" Enter
Type "shasum -a 256 $L | sed 's#.*/##'" Enter
Sleep 20s
