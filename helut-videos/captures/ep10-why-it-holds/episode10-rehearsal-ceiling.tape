Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep10-why-it-holds/episode10-rehearsal-ceiling.mp4"

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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='rehearsal$ '; export LC_ALL=C" Enter
Type "L=captures/ep10-why-it-holds/ep10-exhaust-selftest-rehearsal.log" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'KNOWN-KEY REHEARSAL / PRESERVED RECEIPT'" Enter
Type "echo 'A CONTROL WE CAN GRADE - NOT THE TARGET MESSAGE'" Enter
Type "sed -n '1,8p' $L" Enter
Type "shasum -a 256 $L | sed 's#.*/##'" Enter
Sleep 15s

Type "clear" Enter
Type "echo '1/3  LEVEL ONE - CAN THE SIEVE FIND THE TRUE KEY'" Enter
Type "sed -n '/^Backend/,/^$/p' $L" Enter
Type "sed -n '/^Level 1/,/^$/p' $L" Enter
Sleep 17s

Type "clear" Enter
Type "echo '2/3  LEVEL TWO - PLUGS FROM THE TRUE ROTOR SETTING'" Enter
Type "sed -n '/^Level 2/,/^$/p' $L" Enter
Sleep 18s

Type "clear" Enter
Type "echo '3/3  THE VERDICT THIS PROJECT PUBLISHES'" Enter
Type "sed -n '/^Level 3/,$p' $L" Enter
Type "shasum -a 256 $L | sed 's#.*/##'" Enter
Sleep 22s
