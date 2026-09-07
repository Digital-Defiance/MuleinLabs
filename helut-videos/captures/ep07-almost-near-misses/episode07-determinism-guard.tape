Output "/Volumes/Code/MuleinLabs/helut-videos/public/captures/ep07-almost-near-misses/episode07-determinism-guard.mp4"

Require bash
Require python3

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
Type "cd /Volumes/Code/MuleinLabs/HELUT; export PS1='helut$ '; export LC_ALL=C; clear" Enter
Sleep 1s
Show

Type "echo 'EPISODE 7 / THE BUG THAT COST A CLAIM / LIVE RUN'" Enter
Type "echo 'An encrypted result once depended on Dictionary iteration order.'" Enter
Type "echo 'Swift reseeds hash order per process. Thin margins became coin tosses.'" Enter
Type "echo 'This gate runs the same work in 5 separate processes and compares.'" Enter
Sleep 15s

Type "clear" Enter
Type "echo 'FIVE PROCESSES. ONE FINGERPRINT, OR THE GATE FAILS.'" Enter
Type "python3 Scripts/determinism_cross_process.py --runs 5 --verbose" Enter
Sleep 112s
