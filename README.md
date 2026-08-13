# MuleinLabs

Lab umbrella for Jessica Mulein’s **media / teaching** packages that sit beside
the science repo — not inside it.

| Package | Role |
|---------|------|
| [`HELUT/`](HELUT/) | **Submodule** → [`Digital-Defiance/HELUT`](https://github.com/Digital-Defiance/HELUT) (pinned corpus) |
| [`site/`](site/) | GitHub Pages — living textbook MD snapshot under MuleinLabs branding |
| [`helut-videos/`](helut-videos/) | Remotion + ElevenLabs YouTube series for HELUT |

**Site:** [muleinlabs.com](https://muleinlabs.com)

## Survivable plan (read this)

Full contract: [`SURVIVABLE.md`](SURVIVABLE.md).

- **Science of record** (claims, TeX textbook source, Swift package, reproduce): HELUT only.
- **Publish surfaces** (site MD, videos): MuleinLabs only.
- After each HELUT corpus tag: `./scripts/pin-helut.sh helut-corpus-C<n>` then `cd site && npm run sync-textbook`.

Day-to-day HELUT work uses a **standalone** clone (`/Volumes/Code/HELUT`), not the submodule working tree.
