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

export function speakableNumber(n) {
  const num = Number(n);
  if (!Number.isFinite(num) || num < 0 || num > 999) return String(n);
  if (num < 20) return UNDER_20[num];
  if (num < 100) {
    const tens = TENS[Math.floor(num / 10)];
    const ones = num % 10;
    return ones ? `${tens}-${UNDER_20[ones]}` : tens;
  }
  const hundreds = Math.floor(num / 100);
  const rest = num % 100;
  if (rest === 0) return `${UNDER_20[hundreds]} hundred`;
  return `${UNDER_20[hundreds]} hundred ${speakableNumber(rest)}`;
}

/** `helut.digitaldefiance.org` → speakable host. */
export function speakableHelutHost() {
  return 'HELUT dot digital defiance dot O R G';
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

  // $lut / $_DFF — dollar signs confuse TTS.
  out = out.replace(/\$lut\b/gi, 'look-up table');
  out = out.replace(/\$_?DFF\*?/gi, 'D flip-flop');
  out = out.replace(/\$_?SDFF\*?/gi, 'synchronous D flip-flop');

  // Common HELUT symbols / subscripts that leak into prose.
  out = out.replace(/\bN\s*=\s*(\d+)\b/g, (_, n) => `N equals ${speakableNumber(n)}`);
  out = out.replace(/\bB\s*≈\s*(\d+)k\b/gi, (_, n) => `B about ${speakableNumber(n)} thousand`);
  out = out.replace(/\bF\s*[_-]?crypto\b/gi, 'F crypto');
  out = out.replace(/\bF<sub>crypto<\/sub>\s*=\s*0\b/gi, 'F crypto equals zero');
  out = out.replace(/\bε\b/g, 'epsilon');
  out = out.replace(/\bλ\b/g, 'lambda');
  out = out.replace(/\bσ\b/g, 'sigma');

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
