#!/usr/bin/env node
/**
 * Diff episode claimEpoch pins against HELUT \livingepoch / claim-sheet newest C.
 * Exit 1 if any episode lags (or HELUT path missing).
 *
 *   npm run sync:check
 *   HELUT_ROOT=/path/to/HELUT npm run sync:check
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EP_DIR = path.join(ROOT, 'scripts', 'episodes');
const HELUT_ROOT =
  process.env.HELUT_ROOT ?? path.resolve(ROOT, '..', '..', 'HELUT');

function newestClaimId(sheet) {
  const ids = [...sheet.matchAll(/\|\s*\*\*C(\d+)\*\*/g)].map((m) =>
    Number(m[1]),
  );
  if (ids.length === 0) return null;
  return Math.max(...ids);
}

async function main() {
  if (!existsSync(HELUT_ROOT)) {
    console.error(`HELUT_ROOT not found: ${HELUT_ROOT}`);
    process.exit(1);
  }
  const preamble = await readFile(
    path.join(HELUT_ROOT, 'textbook', 'preamble.tex'),
    'utf8',
  );
  const epochMatch = preamble.match(
    /\\newcommand\{\\livingepoch\}\{([^}]+)\}/,
  );
  if (!epochMatch) {
    console.error('Could not parse \\livingepoch from textbook/preamble.tex');
    process.exit(1);
  }
  const livingEpoch = epochMatch[1].trim();
  const sheet = await readFile(
    path.join(HELUT_ROOT, 'directives', 'claim-sheet.md'),
    'utf8',
  );
  const newestC = newestClaimId(sheet);
  const expectedTail = newestC != null ? `C${newestC}` : null;
  if (expectedTail && !livingEpoch.endsWith(expectedTail)) {
    console.warn(
      `warn: \\livingepoch is "${livingEpoch}" but claim-sheet newest is ${expectedTail} (sheet wins — bump textbook)`,
    );
  }

  const files = (await readdir(EP_DIR)).filter((f) => f.endsWith('.json'));
  let bad = 0;
  for (const file of files) {
    const ep = JSON.parse(await readFile(path.join(EP_DIR, file), 'utf8'));
    const pin = ep.claimEpoch?.trim();
    if (!pin) {
      console.error(`${file}: missing claimEpoch`);
      bad++;
      continue;
    }
    if (pin !== livingEpoch) {
      console.error(
        `${file}: claimEpoch "${pin}" ≠ \\livingepoch "${livingEpoch}"`,
      );
      bad++;
    } else {
      console.log(`ok ${ep.id} @ ${pin}`);
    }
  }
  if (bad) {
    console.error(
      `\n${bad} episode(s) out of sync. Patch VO + claimEpoch (HELUT .cursor/rules/helut-videos-sync.mdc).`,
    );
    process.exit(1);
  }
  console.log(`\nall episodes match \\livingepoch ${livingEpoch}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
