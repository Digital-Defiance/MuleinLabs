Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep15-melt-freeze-prove/episode15-freeze-and-roundtrip.mp4"

Require bash
Require xcrun
Require yosys

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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C" Enter
Type "B=.build/arm64-apple-macosx/release/helutPackageTests.xctest" Enter
Type "clear" Enter
Sleep 2s
Show

Type "echo 'EPISODE 15 / FREEZE MASK + HARDWARE ROUND TRIP / LIVE RUN'" Enter
Type "echo 'Two separate gates. Both have to hold, and both have to be breakable.'" Enter
Sleep 11s

Type "clear" Enter
Type "echo '1/2  THE FREEZE MASK: KNOWN TABLES MUST NOT MOVE'" Enter
Type "xcrun xctest -XCTest HELUTTests.TensorFreezeMaskTests $B 2>&1 | grep -E 'passed [(]|Executed 6'" Enter
Sleep 20s

Type "clear" Enter
Type "echo '2/2  EMIT -> YOSYS -> RELOAD -> PROVE, THEN BREAK IT ON PURPOSE'" Enter
Type "xcrun xctest -XCTest HELUTTests.TensorLUTYosysRoundTripTests $B 2>&1 | grep -E '^TENSORLUT' | fold -s -w 116" Enter
Sleep 30s
