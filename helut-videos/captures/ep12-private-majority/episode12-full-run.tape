Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep12-private-majority/episode12-full-run.mp4"

Require bash
Require ffmpeg
Require yosys
Require shasum

Set Shell "bash"
Set FontSize 22
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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C; export HELUT_QUIET_METAL_BR_PROGRESS=1; set -o pipefail; mkdir -p build/episode12/capture-pass; rm -f build/episode12/capture-pass/0*.log build/episode12/capture-pass/private_majority5.json; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 12 / ACTUAL TERMINAL CAPTURE'" Enter
Sleep 500ms
Type "date '+captured %Y-%m-%d %H:%M:%S %Z'" Enter
Sleep 500ms
Type "vhs --version; yosys -V; swift --version | sed -n '1p'" Enter
Sleep 500ms
Sleep 2s

Type "clear" Enter
Sleep 300ms
Type "echo '1/6  WRITE THE CIRCUIT'" Enter
Sleep 500ms
Type "cat > /tmp/episode12-private_majority5.v" Enter
Type@2ms "// Five-voter private majority, written for the HELUT concept series (Episode 12)." Enter
Type@2ms "//" Enter
Type@2ms "// Five ballot bits enter; one decision bit leaves. Under encrypted evaluation," Enter
Type@2ms "// the evaluator learns only whether the proposal passed, not the five ballots." Enter
Type@2ms "//" Enter
Type@2ms "// This demonstrates the shape of a private computation. It is not a complete" Enter
Type@2ms "// multiparty voting protocol: the SING harness owns the key and decrypts the" Enter
Type@2ms "// result in-process to compare it with the clear golden model." Enter
Type@2ms "module private_majority5 (" Enter
Type@2ms "    input  wire [4:0] votes," Enter
Type@2ms "    output wire       proposal_passes" Enter
Type@2ms ");" Enter
Type@2ms "    wire [2:0] yes_count;" Enter
Enter
Type@2ms "    assign yes_count = {2'b0, votes[0]} +" Enter
Type@2ms "                       {2'b0, votes[1]} +" Enter
Type@2ms "                       {2'b0, votes[2]} +" Enter
Type@2ms "                       {2'b0, votes[3]} +" Enter
Type@2ms "                       {2'b0, votes[4]};" Enter
Enter
Type@2ms "    assign proposal_passes = (yes_count >= 3'd3);" Enter
Type@2ms "endmodule" Enter
Ctrl+D
Sleep 500ms
Type "cmp /tmp/episode12-private_majority5.v Hardware/RTL/Examples/private_majority5.v && echo 'source matches tracked file byte-for-byte'" Enter
Sleep 500ms
Type "shasum -a 256 /tmp/episode12-private_majority5.v" Enter
Sleep 500ms
Sleep 3s

Type "clear" Enter
Sleep 300ms
Type "echo '2/6  SYNTHESIZE TO LOOKUP TABLES'" Enter
Sleep 500ms
Type@1ms "yosys -Q -p 'read_verilog Hardware/RTL/Examples/private_majority5.v; hierarchy -check -top private_majority5; synth -top private_majority5 -flatten; abc -lut 4; check -assert; stat; write_json build/episode12/capture-pass/private_majority5.json' 2>&1 | tee build/episode12/capture-pass/01-synthesis.log | grep -E '=== private_majority5 ===|Found and reported 0 problems|\\$lut|End of script'" Enter
Sleep 500ms
Sleep 3s

Type "clear" Enter
Sleep 300ms
Type "echo '3/6  CHECK THE TWO ENDPOINTS'" Enter
Sleep 500ms
Type@1ms "yosys -Q -p 'read_verilog Hardware/RTL/Examples/private_majority5.v; prep -top private_majority5; eval -set votes 0 -show proposal_passes; eval -set votes 31 -show proposal_passes' 2>&1 | tee build/episode12/capture-pass/02-endpoints.log | grep 'Eval result'" Enter
Sleep 500ms
Sleep 3s

Type "clear" Enter
Sleep 300ms
Type "echo '4/6  COMPILE, THEN EXHAUST ALL 32 CLEAR ROWS'" Enter
Sleep 500ms
Type@1ms ".build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 16 --compile-only 2>&1 | tee build/episode12/capture-pass/03-compile.log" Enter
Sleep 500ms
Sleep 2s
Type@1ms ".build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 16 --bench-equiv 2>&1 | tee build/episode12/capture-pass/04-clear-equiv.log" Enter
Sleep 500ms
Sleep 3s

Type "clear" Enter
Sleep 300ms
Type "echo '5/6  ENCRYPT EVERY ROW AT DEMONSTRATION SIZE'" Enter
Sleep 500ms
Type@1ms ".build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 16 --bench-encrypted --cpu-only --sing --vectors 32 --paths 'blind-rotate public-ms boolean' 2>&1 | tee build/episode12/capture-pass/05-encrypted-n16-cpu.log | grep -E '^(HELUT encrypted|  poly|  stimuli|  starting|ENCRYPTED EQUIV|  rows|  wall|  classical bits|  noisy BK bound|  result)'" Enter
Sleep 500ms
Sleep 4s

Type "clear" Enter
Sleep 300ms
Type "echo '6/6  RUN N=1024 ON METAL'" Enter
Sleep 500ms
Type@1ms ".build/release/helut-bench --bench build/episode12/capture-pass/private_majority5.json --degree 1024 --bench-encrypted --sing --vectors 2 --paths 'blind-rotate-metal public-ms boolean' 2>&1 | tee build/episode12/capture-pass/06-encrypted-n1024-metal.log | grep -E '^(HELUT encrypted|  poly|  stimuli|  Metal BR|  starting|ENCRYPTED EQUIV|  rows|  wall|  classical bits|  ingest|  noisy BK bound|  result)'" Enter
Sleep 500ms
Sleep 12s

Type "clear" Enter
Sleep 300ms
Type "echo 'CAPTURE COMPLETE / HASHED RECEIPTS'" Enter
Sleep 500ms
Type@1ms "shasum -a 256 Hardware/RTL/Examples/private_majority5.v build/episode12/capture-pass/private_majority5.json build/episode12/capture-pass/0*.log" Enter
Sleep 500ms
Sleep 5s
