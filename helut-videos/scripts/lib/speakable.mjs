/**
 * Turn authored voiceover into lines ElevenLabs can speak naturally.
 * Captions may keep symbolic spellings; this is for TTS input only.
 */

const UNDER_20 = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
];

const TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
];

function underThousand(num) {
  if (num < 20) return UNDER_20[num];
  if (num < 100) {
    const tens = TENS[Math.floor(num / 10)];
    const ones = num % 10;
    return ones ? `${tens}-${UNDER_20[ones]}` : tens;
  }
  const hundreds = Math.floor(num / 100);
  const rest = num % 100;
  if (rest === 0) return `${UNDER_20[hundreds]} hundred`;
  return `${UNDER_20[hundreds]} hundred ${underThousand(rest)}`;
}

export function speakableNumber(n) {
  const num = Number(n);
  if (
    !Number.isFinite(num) ||
    !Number.isInteger(num) ||
    num < 0 ||
    num > 999_999_999
  ) {
    return String(n);
  }
  if (num < 1000) return underThousand(num);
  if (num < 1_000_000) {
    const thousands = Math.floor(num / 1000);
    const rest = num % 1000;
    return `${speakableNumber(thousands)} thousand${
      rest ? ` ${underThousand(rest)}` : ''
    }`;
  }
  const millions = Math.floor(num / 1_000_000);
  const rest = num % 1_000_000;
  return `${speakableNumber(millions)} million${
    rest ? ` ${speakableNumber(rest)}` : ''
  }`;
}

/** `helut.digitaldefiance.org` → speakable host. */
export function speakableHelutHost() {
  return 'HELUT dot digital defiance dot O R G';
}

function spellDigits(digits) {
  return [...String(digits)].map((digit) => UNDER_20[Number(digit)]).join(' ');
}

/**
 * @param {string} text
 * @returns {string}
 */
export function speakable(text) {
  if (!text) return '';
  let out = String(text);

  out = out.replace(/\bhelut\.digitaldefiance\.org\b/gi, speakableHelutHost);
  out = out.replace(
    /\bdigitaldefiance\.org\b/gi,
    'digital defiance dot O R G',
  );

  // Campaign and profile identifiers should never be guessed as cardinals.
  out = out.replace(/\bP(\d{7})\b/g, (_, digits) => `P ${spellDigits(digits)}`);
  out = out.replace(/\bU[-‑–]?(\d{3})\b/gi, (_, digits) => `U ${spellDigits(digits)}`);
  out = out.replace(/\bM4\b/g, 'M four');
  out = out.replace(/\bE256\b/g, 'E two fifty-six');
  out = out.replace(/\bfixture-v(\d+)\b/gi, (_, n) => `fixture V ${speakableNumber(n)}`);
  out = out.replace(/\bLUT6\b/gi, 'L U T six');
  out = out.replace(/\bUInt32\b/g, 'unsigned thirty-two-bit integer');
  out = out.replace(/\baddi\b/gi, 'add immediate');
  out = out.replace(/\bRISC[-‑–]?V\b/gi, 'risk five');
  out = out.replace(/\bclaim\s+C(\d+)\b/gi, (_, n) => `claim C ${speakableNumber(n)}`);
  out = out.replace(/\bC(\d+)\b/g, (_, n) => `C ${speakableNumber(n)}`);
  out = out.replace(/\bH(\d+)\b/g, (_, n) => `H ${speakableNumber(n)}`);
  out = out.replace(/(\d+)\.\.<(\d+)/g, (_, start, end) => {
    const inclusiveEnd = Math.max(Number(start), Number(end) - 1);
    return `${speakableNumber(start)} through ${speakableNumber(inclusiveEnd)}`;
  });

  // Critical counts and decimals should have deterministic spoken forms.
  out = out.replace(/\b\d{1,3}(?:,\d{3})+\b/g, (value) =>
    speakableNumber(value.replaceAll(',', '')),
  );
  out = out.replace(/\b(\d+)\.(\d+)\b/g, (_, whole, fraction) =>
    `${speakableNumber(whole)} point ${spellDigits(fraction)}`,
  );

  // $lut / $_DFF — dollar signs confuse TTS.
  out = out.replace(/\$lut\b/gi, 'look-up table');
  out = out.replace(/\$_?DFF\*?/gi, 'D flip-flop');
  out = out.replace(/\$_?SDFF\*?/gi, 'synchronous D flip-flop');

  // Common HELUT symbols / subscripts that leak into prose.
  out = out.replace(/\bN\s*=\s*(\d+)\b/g, (_, n) => `N equals ${speakableNumber(n)}`);
  out = out.replace(/\bB\s*≈\s*(\d+)k\b/gi, (_, n) => `B about ${speakableNumber(n)} thousand`);
  out = out.replace(/\bF\s*[_-]?crypto\b/gi, 'F crypto');
  out = out.replace(/\bF<sub>crypto<\/sub>\s*=\s*0\b/gi, 'F crypto equals zero');
  out = out.replace(/ε/g, 'epsilon');
  out = out.replace(/λ/g, 'lambda');
  out = out.replace(/σ/g, 'sigma');
  out = out.replace(/δ/g, 'delta');
  out = out.replace(/≤/g, ' at most ');
  out = out.replace(/≥/g, ' at least ');
  out = out.replace(/≠/g, ' does not equal ');
  out = out.replace(/≡/g, ' equals ');
  out = out.replace(/≈/g, ' about ');
  out = out.replace(/×/g, ' by ');

  out = out.replace(/\s*→\s*/g, ' to ');
  out = out.replace(/\s*->\s*/g, ' to ');
  out = out.replace(/[—–]/g, ' — ');
  out = out.replace(/\u00a0/g, ' ');
  out = out.replace(/\s+/g, ' ').trim();

  // Homograph: tear (rip) vs tear (cry).
  out = out.replace(/\btear\b/g, 'tare');
  out = out.replace(/\bTear\b/g, 'Tare');

  return out;
}
