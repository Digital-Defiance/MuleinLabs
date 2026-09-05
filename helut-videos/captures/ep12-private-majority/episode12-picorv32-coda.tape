Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep12-private-majority/episode12-picorv32-coda.mp4"

Require bash
Require shasum

Set Shell "bash"
Set FontSize 20
Set FontFamily "Menlo"
Set Width 1280
Set Height 720
Set Padding 24
Set Framerate 30
Set Theme {"background":"#091522","foreground":"#e7edf4","black":"#091522","brightBlack":"#66758a","red":"#e0574c","brightRed":"#e0574c","green":"#22a89c","brightGreen":"#22a89c","yellow":"#d4833f","brightYellow":"#d4833f","blue":"#7aa2c8","brightBlue":"#7aa2c8","magenta":"#b58cc7","brightMagenta":"#b58cc7","cyan":"#22a89c","brightCyan":"#22a89c","white":"#e7edf4","brightWhite":"#ffffff"}
Set WindowBar "Rings"
Set WindowBarSize 36
Set TypingSpeed 3ms

Hide
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C; set -o pipefail; mkdir -p build/episode12b/capture-pass; rm -f build/episode12b/capture-pass/*.log; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 12 CODA / A RISC-V CPU RUNNING UNDER ENCRYPTION'" Enter
Sleep 500ms
Type "date '+captured %Y-%m-%d %H:%M:%S %Z'" Enter
Sleep 500ms
Type "swift --version | sed -n '1p'" Enter
Sleep 500ms
Sleep 2s

Type "clear" Enter
Sleep 300ms
Type "echo '1/4  THE PROGRAM THE PROCESSOR WILL EXECUTE'" Enter
Sleep 500ms
Type@1ms "sed -n '3,20p' Sources/HELUTCore/PicoRVHostMem.swift" Enter
Sleep 500ms
Sleep 7s

Type "clear" Enter
Sleep 300ms
Type "echo '2/4  THREE LOOKUP TABLES VERSUS A PROCESSOR'" Enter
Sleep 500ms
Type@1ms ".build/release/helut-bench --bench Generated/Netlists/Examples/private_majority5_netlist.json --degree 16 --compile-only 2>&1 | tee build/episode12b/capture-pass/01-compile-majority.log | grep 'Compiled module'" Enter
Sleep 500ms
Sleep 3s
Type@1ms ".build/release/helut-bench --bench picorv32_netlist.json --degree 8 --compile-only 2>&1 | tee build/episode12b/capture-pass/02-compile-picorv32.log | grep -E 'Compiled module|  cells'" Enter
Sleep 500ms
Sleep 4s

Type "clear" Enter
Sleep 300ms
Type "echo '3/4  EXECUTE IT ENCRYPTED: FETCH, STORE, LOAD BACK'" Enter
Sleep 500ms
Type@1ms ".build/release/helut-bench --bench picorv32_netlist.json --degree 8 --bench-encrypted --cpu-only --sing --ticks 48 --reset-hold 3 --encrypted-mem prog --paths 'blind-rotate public-ms boolean' 2>&1 | tee build/episode12b/capture-pass/03-encrypted-picorv32.log | grep --line-buffered -E '^  (FETCH tick|STORE tick|LOAD  (req|xfer))'" Enter
Sleep 500ms
Sleep 12s

Type "clear" Enter
Sleep 300ms
Type "echo '4/4  WHAT THE ENCRYPTED RUN PROVED'" Enter
Sleep 500ms
Type@1ms "grep -E '^(  poly|  encrypted mem|  FETCH summary|  STORE summary|  LOAD  summary|ENCRYPTED EQUIV|  rows|  wall|  classical bits|  noisy BK|  result)' build/episode12b/capture-pass/03-encrypted-picorv32.log" Enter
Sleep 500ms
Sleep 9s

Type "clear" Enter
Sleep 300ms
Type "echo 'CODA COMPLETE / HASHED RECEIPTS'" Enter
Sleep 500ms
Type@1ms "shasum -a 256 picorv32_netlist.json Sources/HELUTCore/PicoRVHostMem.swift build/episode12b/capture-pass/0*.log" Enter
Sleep 500ms
Sleep 6s
