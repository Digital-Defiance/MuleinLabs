Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep13-ab0cde/episode13-ab0cde.mp4"

Require bash
Require ffmpeg
Require make
Require yosys
Require shasum

Set Shell "bash"
Set FontSize 19
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
Type "source /Users/jessica/radioconda/etc/profile.d/conda.sh; conda activate gnuradio; cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C; export HELUT_QUIET_METAL_BR_PROGRESS=1; set -o pipefail; mkdir -p build/episode13/capture-pass; rm -f build/episode13/capture-pass/01-ab0cde-full.log; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 13 / AB0CDE CALLSIGN EDGE MATCHER'" Enter
Sleep 500ms
Type "date '+captured %Y-%m-%d %H:%M:%S %Z'" Enter
Sleep 500ms
Type "python -c 'from gnuradio import gr; print(gr.version())' | sed 's/^/GNU Radio /'" Enter
Sleep 500ms
Type "vhs --version; yosys -V; swift --version | sed -n '1p'" Enter
Sleep 500ms
Sleep 3s

Type "clear" Enter
Sleep 300ms
Type "echo '1/4  EXACT SIX-BYTE CIRCUIT OF RECORD'" Enter
Sleep 500ms
Type "sed -n '1,17p' Hardware/RTL/Examples/ab0cde_matcher.v" Enter
Sleep 500ms
Type "shasum -a 256 Hardware/RTL/Examples/ab0cde_matcher.v | sed 's#Hardware/RTL/Examples/##'" Enter
Sleep 500ms
Sleep 6s

Type "clear" Enter
Sleep 300ms
Type "echo '2/4  YOSYS RECEIPT: 48 INPUT BITS / 47 LUT2 CELLS / 1 MATCH BIT'" Enter
Sleep 500ms
Type@1ms "yosys -Q -p 'read_json Generated/Netlists/Examples/ab0cde_netlist.json; hierarchy -check -top ab0cde_matcher; check -assert; stat' 2>&1 | grep -E 'Found and reported 0 problems|=== ab0cde_matcher ===|ports|port bits|cells|[$]lut'" Enter
Sleep 500ms
Type "shasum -a 256 Generated/Netlists/Examples/ab0cde_netlist.json | sed 's#Generated/Netlists/Examples/##'" Enter
Sleep 500ms
Sleep 5s

Type "clear" Enter
Sleep 300ms
Type "echo '3/4  LOCAL IQ -> RECOVERED BYTES -> HELUT CLEAR ORACLE'" Enter
Sleep 500ms
Type@1ms "make radio-edge 2>&1 | tee build/episode13/capture-pass/01-ab0cde-full.log | grep -E '^(HELUT Callsign|  netlist:|  pattern:|  TX payload:|[[]Act I[]]|        recovered=|        .*CALLSIGN MATCH)'" Enter
Sleep 500ms
Sleep 8s

Type "clear" Enter
Sleep 300ms
Type "echo '4/4  BOUNDED RECEIPT: SCALAR CLEAR LOOP + ONE N=8 WINDOW'" Enter
Sleep 500ms
Type "grep -E '^[[]Act II[]]|not native tensor batch|^[[]Act III[]]|N=8 demonstration|blind-rotate demo|^OK  ' build/episode13/capture-pass/01-ab0cde-full.log" Enter
Sleep 500ms
Sleep 5s
Type "echo 'HASHED SOURCE / NETLIST / RUNNER / FULL RAW LOG'" Enter
Sleep 500ms
Type@1ms "shasum -a 256 Hardware/RTL/Examples/ab0cde_matcher.v Generated/Netlists/Examples/ab0cde_netlist.json Apps/gr-helut/examples/helut_edge_matcher.py build/episode13/capture-pass/01-ab0cde-full.log | sed -e 's#Hardware/RTL/Examples/##' -e 's#Generated/Netlists/Examples/##' -e 's#Apps/gr-helut/examples/##' -e 's#build/episode13/capture-pass/##'" Enter
Sleep 500ms
Sleep 8s
