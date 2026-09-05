Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep15-melt-freeze-prove/episode15-local-pass.mp4"

Require bash
Require ffmpeg
Require shasum

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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='receipt$ '; export LC_ALL=C; export L=captures/ep15-melt-freeze-prove/ep15-melt-freeze-tests.log; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 15 / PRESERVED MELT-FREEZE TEST RECEIPT'" Enter
Type "echo 'ARCHIVED RECEIPT PLAYBACK - NOT A FRESH TIMING RUN'" Enter
Type "echo 'Original experiment: 2026-09-05 / Apple M4 Max'" Enter
Type "sed -n '1,5p' $L" Enter
Type "shasum -a 256 $L | sed 's#captures/ep15-melt-freeze-prove/##'" Enter
Sleep 9s

Type "clear" Enter
Type "echo '1/3  SIX FREEZE-MASK TESTS'" Enter
Type@1ms "grep -E 'TensorFreezeMaskTests test.*passed' $L" Enter
Sleep 16s

Type "clear" Enter
Type "echo '2/3  TARGETED TWO-BIT MELT + SUITE VERDICT'" Enter
Type@1ms "grep -E 'testTwoBitAdderTargetedMeltDiscovers|Executed 6 tests' $L" Enter
Type "echo 'Observed targeted-melt time: 1.092 s inside the saved run'" Enter
Type "echo 'Elapsed time is an observation, not a deterministic contract.'" Enter
Sleep 14s

Type "clear" Enter
Type "echo '3/3  BOUNDARY AROUND THIS PASS'" Enter
Type "echo 'This proves the freeze-mask suite passed in the archived run.'" Enter
Type "echo 'It does not emit the searched elite or re-prove it through Yosys.'" Enter
Type "echo 'A separate identity round-trip receipt follows in the episode.'" Enter
Type "shasum -a 256 $L | sed 's#captures/ep15-melt-freeze-prove/##'" Enter
Sleep 15s
