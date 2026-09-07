Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep06-e256-evolution-audit/episode06-evidence-ladder.mp4"

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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='audit$ '; export LC_ALL=C" Enter
Type "J=captures/ep06-e256-evolution-audit/ep06-e256-fixture-v4-validation.json" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'E256 EVIDENCE LADDER / PRESERVED RECEIPT'" Enter
Type "echo 'FOUR INDEPENDENT IMPLEMENTATIONS, ONE FIXTURE'" Enter
Type "grep -n 'swift_fixture_suite\|direct_rtl\|native_nlff_rtl\|rust_reference' $J" Enter
Type "shasum -a 256 $J | sed 's#.*/##'" Enter
Sleep 14s

Type "clear" Enter
Type "echo '1/3  THE LADDER: BYTES, TABLES, TRACES, ARTIFACTS'" Enter
Type "grep -n 'kat_bytes\|tables\|trace_files\|artifacts\|reciprocal_decrypt\|yosys_parity' $J" Enter
Sleep 16s

Type "clear" Enter
Type "echo '2/3  ONE BOUNDED CERTIFICATE + 49 GUARD CHECKS'" Enter
Type "sed -n '/formal_certificate/,/]/p' $J" Enter
Type "grep -n -A3 'publication_guard_suite' $J" Enter
Sleep 19s

Type "clear" Enter
Type "echo '3/3  THE ROW THIS RECEIPT DOES NOT CLOSE'" Enter
Type "grep -n 'human_review\|finding\|review_boundary\|optimizer_verdict\|interpretation' $J" Enter
Sleep 20s
