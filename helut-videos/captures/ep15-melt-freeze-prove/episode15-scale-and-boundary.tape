Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep15-melt-freeze-prove/episode15-scale-and-boundary.mp4"

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

# The prebuilt release xctest bundle is invoked directly. `swift test` would
# re-plan the build on every call, which makes the on-camera duration
# unpredictable; this is the same tests with the build variance removed.
Hide
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C" Enter
Type "B=.build/arm64-apple-macosx/release/helutPackageTests.xctest" Enter
Type "melt() { xcrun xctest -XCTest HELUTTests.TensorLUTMeltScalingTests/$1 $B 2>&1 | grep -E 'MELT_SCALING|bits +LUTs|^ +[0-9]+ +[0-9]+ +[0-9]+ +[0-9]+' | fold -s -w 104; }" Enter
Type "clear" Enter
Sleep 2s
Show

Type "echo 'EPISODE 15 / DOES THE SEARCH SCALE? / LIVE RUN'" Enter
Type "echo '8-bit adder: 65,536 possible inputs.'" Enter
Type "echo 'Train on 64 of them. Prove over all 65,536.'" Enter
Sleep 10s

Type "type melt | tail -n +2" Enter
Sleep 11s

Type "clear" Enter
Type "echo '1/2  TRAIN ON 0.10%. PROVE OVER 100%.'" Enter
Type "melt testSearchConvergesFromSampledStimulusAndStillProves" Enter
Sleep 40s

Type "clear" Enter
Type "echo '2/2  BOUNDARY: ERASE IT ALL, GET BINARY BUT WRONG'" Enter
Type "melt testMeltScalingByMeltRegionSize" Enter
Sleep 24s
