Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep03-tensorlut/episode03-proof-ladder.mp4"

Require bash
Require xcrun
Require yosys

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
Type "B=.build/arm64-apple-macosx/release/helutPackageTests.xctest" Enter
Type "melt() { xcrun xctest -XCTest HELUTTests.TensorLUTMeltScalingTests/$1 $B 2>&1 | grep -E 'MELT_SCALING|bits +LUTs|^ +4 +8' | fold -s -w 104; }" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 3 / HOW FAR DOES THE PROOF LADDER GO?'" Enter
Type "echo 'Analytic certificate first. Bounded search evidence second.'" Enter
Sleep 9s

Type "clear" Enter
Type "echo '1/3  SIX IMPLEMENTATION-LEVEL CERTIFICATE CHECKS'" Enter
Type "xcrun xctest -XCTest HELUTTests.TFHESeamTests/testTensorLUTFormalCertificate $B 2>&1 | grep -E 'Test Case|Executed 1 test'" Enter
Sleep 8s

Type "clear" Enter
Type "echo '2/3  SAME ADDER, MELT 2 / 4 / 6 / ALL 8 TABLES'" Enter
Type "melt testMeltScalingByMeltRegionSize" Enter
Sleep 18s

Type "clear" Enter
Type "echo '3/3  SAME 8/8 COLD START, MORE SEARCH BUDGET'" Enter
Type "melt testColdStartMeltIsBudgetLeverOrBoundary" Enter
Sleep 20s

Type "echo 'BOUNDARY: bounded fixtures; not arbitrary-topology completeness.'" Enter
Sleep 9s
