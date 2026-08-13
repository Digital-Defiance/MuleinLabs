import { continueRender, delayRender, staticFile } from 'remotion';
import { loadFont as loadOutfit } from '@remotion/google-fonts/Outfit';

/** Display / brand — same variable Fraunces as helut.digitaldefiance.org. */
export const FONT_DISPLAY = 'Fraunces';

/** Body / captions — Outfit, matching the site sans. */
export const FONT_BODY = 'Outfit';

const FRAUNCES_URL = staticFile(
  'fonts/Fraunces-VariableFont_SOFT,WONK,opsz,wght.woff2',
);

let loaded = false;
let loading: Promise<void> | null = null;

/**
 * Load HELUT brand fonts once per Remotion process (Studio + render).
 * Call from Root so compositions never paint with fallbacks.
 */
export function ensureHelutFonts(): Promise<void> {
  if (loaded) return Promise.resolve();
  if (loading) return loading;

  const handle = delayRender('helut-fonts');
  loading = (async () => {
    loadOutfit('normal', {
      weights: ['300', '400', '500', '600', '700'],
      subsets: ['latin'],
    });

    const face = new FontFace(FONT_DISPLAY, `url(${FRAUNCES_URL})`, {
      weight: '100 900',
      style: 'normal',
      display: 'swap',
    });
    const loadedFace = await face.load();
    document.fonts.add(loadedFace);
    await document.fonts.ready;

    loaded = true;
    continueRender(handle);
  })().catch((err) => {
    continueRender(handle);
    throw err;
  });

  return loading;
}
