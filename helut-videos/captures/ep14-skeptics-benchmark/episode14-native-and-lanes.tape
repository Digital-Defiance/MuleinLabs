Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep14-skeptics-benchmark/episode14-native-and-lanes.mp4"

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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='receipt$ '; export LC_ALL=C" Enter
Type "L=captures/ep14-skeptics-benchmark/ep14-native-final-receipt.txt" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 14 / SEALED MATCHED-NATIVE RECEIPT'" Enter
Type "echo 'ARCHIVED EVIDENCE PLAYBACK - NO BENCHMARK RERUN'" Enter
Type "sed -n '1,9p' $L" Enter
Type "shasum -a 256 $L | sed 's#captures/ep14-skeptics-benchmark/##'" Enter
Sleep 10s

Type "clear" Enter
Type "echo '1/3  TWO SCOPES - THE PAIRED ROW IS THE VERDICT'" Enter
Type "sed -n '/^1\/3/,/^2\/3/p' $L | sed '$d'" Enter
Sleep 16s

Type "clear" Enter
Type "echo '2/3  WHERE THE FINAL HELUT TIME GOES'" Enter
Type "sed -n '/^2\/3/,/^3\/3/p' $L | sed '$d'" Enter
Sleep 13s

Type "clear" Enter
Type "echo '3/3  DISTINCT LANES + A NEGATIVE CONTROL WITH TEETH'" Enter
Type "sed -n '/^3\/3/,/^BOUNDARY/p' $L | sed '$d'" Enter
Sleep 10s

Type "clear" Enter
Type "echo 'BOUNDARY + SEALED RECEIPT'" Enter
Type "sed -n '/^BOUNDARY/,$p' $L" Enter
Type "shasum -a 256 $L | sed 's#captures/ep14-skeptics-benchmark/##'" Enter
Sleep 23s
