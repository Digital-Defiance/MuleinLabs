# MuleinLabs site

React + Vite site for [muleinlabs.com](https://muleinlabs.com).

Primary content today: the HELUT **living textbook**, rendered under MuleinLabs branding (not HELUT site theming).

```bash
cd site
npm install
npm run sync-textbook   # copies ../HELUT/textbook when available
npm run dev
npm run build
npm run preview
```

## Deploy

Push to `main` (paths under `site/`) or run **Deploy GitHub Pages**. Then in the repo:

1. **Settings → Pages → Source:** GitHub Actions  
2. **Settings → Pages → Custom domain:** `muleinlabs.com` (Enforce HTTPS once DNS propagates)

DNS at your registrar:

| Type | Name | Value |
|------|------|--------|
| `A` | `@` | `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153` |
| `AAAA` | `@` | `2606:50c0:8000::153` / `…:8001::153` / `…:8002::153` / `…:8003::153` |
| `CNAME` | `www` | `jessicamulein.github.io` |

`public/CNAME` is copied into the build so Pages keeps the domain on each deploy.

## Textbook sync

`scripts/sync-textbook.mjs` pulls `helut-living-textbook.md` from a sibling `HELUT` checkout when present, light-cleans Pandoc quirks, and writes:

- `content/living-textbook.md` — site copy
- `content/living-textbook.source.md` — raw fallback for CI
- `content/textbook-meta.json` — edition / epoch

Canonical TeX remains in the HELUT repo; do not hand-edit the generated Markdown upstream.
