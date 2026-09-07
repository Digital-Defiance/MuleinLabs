Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep05-enigma256-architecture/episode05-fixture-receipt.mp4"

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
Type "cd /Volumes/Code/MuleinLabs/helut-videos; export PS1='e256$ '; export LC_ALL=C" Enter
Type "J=captures/ep05-enigma256-architecture/ep05-e256-fixture-v4-validation.json" Enter
Type "clear" Enter
Sleep 1s
Show

Type "echo 'E256 FIXTURE-V4 VALIDATION / PRESERVED RECEIPT'" Enter
Type "echo 'IMPLEMENTATION PARITY EVIDENCE - NOT A SECURITY PROOF'" Enter
Type "grep -n 'schema\|family\|suite_version\|fixture_schema_version\|compatibility_key' $J" Enter
Type "shasum -a 256 $J | sed 's#.*/##'" Enter
Sleep 14s

Type "clear" Enter
Type "echo '1/3  THE STATE RULES THE HARDWARE MUST OBEY'" Enter
Type "grep -n 'center_construction\|center_formula\|absolute_counter\|center_mask_prf' $J" Enter
Type "grep -n 'directed_center_and_counter\|reciprocal_decrypt\|state_transitions' $J" Enter
Sleep 18s

Type "clear" Enter
Type "echo '2/3  ONE BYTE PATH, TWO BUSES, SAME TABLES'" Enter
Type "grep -n -A3 'axi_stream\|axi_lite' $J | grep -v status_file" Enter
Type "grep -n 'kat_bytes\|tables\|trace_files\|artifacts\|yosys_parity' $J" Enter
Sleep 18s

Type "clear" Enter
Type "echo '3/3  WHAT THIS RECEIPT REFUSES TO CLAIM'" Enter
Type "grep -n 'human_review\|finding_state\|review_boundary' $J" Enter
Type "sed -n '/limitations/,$p' $J | head -8" Enter
Sleep 22s
