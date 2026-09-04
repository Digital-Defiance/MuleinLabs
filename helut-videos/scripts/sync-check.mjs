#!/usr/bin/env node
/**
 * Diff episode claimEpoch pins and description labels against HELUT's
 * \livingepoch / claim-sheet newest C. Exit 1 when any public episode lags.
 *
 *   npm run sync:check
 *   HELUT_ROOT=/path/to/HELUT npm run sync:check
 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EP_DIR = path.join(ROOT, 'scripts', 'episodes');

function resolveHelutRoot() {
  const override = process.env.HELUT_ROOT?.trim();
  if (override) return path.resolve(override);

  const candidates = [
    path.resolve(ROOT, '..', 'HELUT'),
    path.resolve(ROOT, '..', '..', 'HELUT'),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

const HELUT_ROOT = resolveHelutRoot();

function newestClaimId(sheet) {
  const ids = [...sheet.matchAll(/\|\s*\*\*C(\d+)\*\*/g)].map((match) =>
    Number(match[1]),
  );
  if (ids.length === 0) return null;
  return Math.max(...ids);
}

function descriptionEpochs(description) {
  return [...String(description ?? '').matchAll(/\bEpoch\s+C(\d+)\b/gi)].map(
    (match) => Number(match[1]),
  );
}

async function main() {
  if (!HELUT_ROOT || !existsSync(HELUT_ROOT)) {
    console.error(`HELUT_ROOT not found: ${HELUT_ROOT ?? '(none)'}`);
    process.exit(1);
  }
  console.log(`HELUT source: ${HELUT_ROOT}`);

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

  const files = (await readdir(EP_DIR))
    .filter((file) => file.endsWith('.json'))
    .sort();
  let bad = 0;
  for (const file of files) {
    const episode = JSON.parse(await readFile(path.join(EP_DIR, file), 'utf8'));
    const pin = episode.claimEpoch?.trim();
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
    }

    const labels = descriptionEpochs(episode.description);
    if (labels.length === 0) {
      console.error(`${file}: description is missing an "Epoch C…" label`);
      bad++;
    } else if (newestC != null && labels.some((label) => label !== newestC)) {
      console.error(
        `${file}: stale description epoch ${labels.map((n) => `C${n}`).join(', ')}; expected C${newestC}`,
      );
      bad++;
    }

    if (pin === livingEpoch && labels.every((label) => label === newestC)) {
      console.log(`ok ${episode.id} @ ${pin}`);
    }
  }
  if (bad) {
    console.error(
      `\n${bad} episode sync error(s). Patch claims, publication copy, and claimEpoch before TTS.`,
    );
    process.exit(1);
  }
  console.log(`\nall episodes match \\livingepoch ${livingEpoch}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
