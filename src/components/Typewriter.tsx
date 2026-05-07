import { useCallback, useEffect, useRef, useState } from 'react';

// ── TikTok logo path (FontAwesome, viewBox 0 0 448 512) ───────────────────
const TIKTOK_PATH =
  'M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,' +
  '1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.' +
  '18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z';

// Character animation durations.
// CHAR_IN_MS is well under the default typingSpeed (80 ms) so each character
// fully settles before the next one appears — no overlap, no jank.
const CHAR_IN_MS  = 40;   // enter: opacity 0→1, scale 0.88→1
const CHAR_OUT_MS = 20;   // exit:  opacity 1→0, scale 1→0.88

// ── Props ─────────────────────────────────────────────────────────────────
interface TypewriterProps {
  texts:               string[];
  typingSpeed?:        number;   // ms per char typed,   default 80
  deletingSpeed?:      number;   // ms per char deleted, default 40
  delayBeforeDelete?:  number;   // pause after full string, default 2000
  delayBeforeType?:    number;   // pause before next string, default 500
  playSound?:          boolean;
  fontSize?:           number;   // px, default 44
  blinking?:           boolean;  // cursor blink on/off, default true
}

// ── 3-layer TikTok cursor ─────────────────────────────────────────────────
// Matches the original spec exactly:
//   Layer 1 (bottom): cyan #24f6f0, top +2px left -2px, mix-blend-mode screen
//   Layer 2:          red  #fe2c55, top  0px left +2px, mix-blend-mode screen
//   Layer 3 (top):    black,        top  0px left  0px
function TikTokCursor({ blinking }: { blinking: boolean }) {
  // React-driven blink: toggle opacity every 600 ms when blinking is on.
  // This is more reliable than CSS animation toggled via inline style.
  const [dim, setDim] = useState(false);

  useEffect(() => {
    if (!blinking) {
      setDim(false);      // reset to full opacity when toggled off
      return;
    }
    const id = setInterval(() => setDim(d => !d), 400);
    return () => clearInterval(id);
  }, [blinking]);

  // Blink on: alternates 80% → 0% → 80%
  // Blink off: stays at 0.9 (always visible)
  const opacity = blinking ? (dim ? 0 : 0.8) : 0.9;

  const svgLayer = (
    fill: string,
    top: number,
    left: number,
    blend?: React.CSSProperties['mixBlendMode'],
    svgOpacity?: number,
  ) => (
    <svg
      viewBox="0 0 448 512"
      style={{
        position: 'absolute',
        top,
        left,
        width: '100%',
        height: '100%',
        ...(blend      ? { mixBlendMode: blend } : {}),
        ...(svgOpacity !== undefined ? { opacity: svgOpacity } : {}),
      }}
    >
      <path d={TIKTOK_PATH} fill={fill} />
    </svg>
  );

  return (
    <span
      style={{
        display: 'inline-block',
        position: 'relative',
        width: '0.8em',
        height: '0.8em',
        marginLeft: 4,
        verticalAlign: 'middle',
        transform: 'translateY(-0.1em)',
        opacity,
        transition: 'opacity 0.2s ease-in-out',
      }}
    >
      {svgLayer('#24f6f0',  2, -2, 'screen', 0.9)}
      {svgLayer('#fe2c55',  0,  2, 'screen', 0.9)}
      {svgLayer('black',    0,  0)}
    </span>
  );
}

// ── Typewriter ────────────────────────────────────────────────────────────
export default function Typewriter({
  texts,
  typingSpeed       = 80,
  deletingSpeed     = 40,
  delayBeforeDelete = 2000,
  delayBeforeType   = 500,
  playSound         = false,
  fontSize          = 44,
  blinking          = true,
}: TypewriterProps) {
  // ── Core display state ────────────────────────────────────────────────
  // displayText holds all settled characters; rendered as a plain text node
  // so the browser applies natural kerning across all of them.
  const [displayText, setDisplayText] = useState('');

  // At most ONE character is ever in a <span> at a time — the one currently
  // entering or leaving. All others stay in the natural text run.
  const [animChar, setAnimChar] = useState<{
    char: string;
    phase: 'entering' | 'leaving';
  } | null>(null);

  // Monotonically increasing key — forces a fresh DOM node (and CSS animation
  // restart) for each new animated character, even if the char value repeats.
  const [animKey,   setAnimKey]   = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  // ── Refs for values that never have a UI control ────────────────────
  // typingSpeed is NOT here — it goes in the effect deps so slider
  // changes immediately restart the loop at the new speed.
  const deletingSpeedRef     = useRef(deletingSpeed);
  const delayBeforeDeleteRef = useRef(delayBeforeDelete);
  const delayBeforeTypeRef   = useRef(delayBeforeType);
  const playSoundRef         = useRef(playSound);
  const audioCtxRef          = useRef<AudioContext | null>(null);

  // Keep refs in sync with props every render
  deletingSpeedRef.current     = deletingSpeed;
  delayBeforeDeleteRef.current = delayBeforeDelete;
  delayBeforeTypeRef.current   = delayBeforeType;
  playSoundRef.current         = playSound;

  // ── Sound: sine oscillator 600 → 100 Hz over 30 ms ───────────────────
  const playTypingSound = useCallback(() => {
    if (!playSoundRef.current) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.03);
    } catch { /* audio blocked — silently skip */ }
  }, []); // stable: reads playSound via ref

  // ── Typing loop ───────────────────────────────────────────────────────
  // Restarts only when textIndex or texts changes. All other config is read
  // from refs so the loop picks up new values without interrupting mid-word.
  useEffect(() => {
    let active = true;
    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    async function run() {
      const text = texts[textIndex];

      // ── Type forward, char by char ──────────────────────────────
      for (let i = 0; i < text.length; i++) {
        if (!active) return;
        const ch       = text[i];
        const variance = Math.random() * 30 - 15; // ±15 ms natural jitter

        // Add char to stable string AND trigger its enter animation.
        // stableText = displayText.slice(0,-1) hides it from the text node
        // while the span animates it in.
        setDisplayText(text.slice(0, i + 1));
        setAnimChar({ char: ch, phase: 'entering' });
        setAnimKey(k => k + 1);
        playTypingSound(); // sound only on typing, not deleting

        await sleep(typingSpeed + variance);
      }

      if (!active) return;
      // Let the last character's enter animation finish before settling
      await sleep(CHAR_IN_MS);
      if (!active) return;
      setAnimChar(null); // last char joins the natural text run

      // ── Pause before deleting ───────────────────────────────────
      await sleep(delayBeforeDeleteRef.current);
      if (!active) return;

      // ── Delete backward, char by char ───────────────────────────
      for (let i = text.length; i > 0; i--) {
        if (!active) return;
        const ch = text[i - 1];

        // Pull the char out of stable text and play its exit animation.
        // displayText still has 'ch' as its last character here.
        setAnimChar({ char: ch, phase: 'leaving' });
        setAnimKey(k => k + 1);

        await sleep(CHAR_OUT_MS); // animation plays
        if (!active) return;

        setDisplayText(text.slice(0, i - 1));
        setAnimChar(null);

        // Remaining deletion delay (if deletingSpeed > CHAR_OUT_MS)
        const remaining = deletingSpeedRef.current - CHAR_OUT_MS;
        if (remaining > 0) {
          await sleep(remaining);
          if (!active) return;
        }
      }

      // ── Pause before next string ────────────────────────────────
      await sleep(delayBeforeTypeRef.current);
      if (!active) return;

      setTextIndex(i => (i + 1) % texts.length);
    }

    run();
    return () => { active = false; };
  }, [textIndex, texts, playTypingSound, typingSpeed]);

  // Stable chars render as a plain text node (full kerning).
  // The single animating char lives in a span alongside it.
  const stableText = animChar !== null ? displayText.slice(0, -1) : displayText;

  return (
    <p
      style={{
        fontFamily: "'TikTok Sans', 'Proxima Nova', system-ui, sans-serif",
        fontWeight: 800,
        fontSize: fontSize,
        lineHeight: 1.2,
        color: '#000000',
        margin: 0,
        wordBreak: 'break-word',
      }}
    >
      {/* Natural-kerning text for all settled characters */}
      {stableText}

      {/* Single animated span — only one char leaves the natural flow at a time */}
      {animChar !== null && (
        <span
          key={animKey}
          style={{
            display: 'inline-block',
            transformOrigin: 'center 80%', // scale anchored near the baseline
            // cubic-bezier(0.16, 1, 0.3, 1) → fast start, smooth settle (like iOS spring)
            // cubic-bezier(0.55, 0, 1, 0.45) → slow start, sharp exit
            animation:
              animChar.phase === 'entering'
                ? `char-in  ${CHAR_IN_MS}ms  cubic-bezier(0.16,1,0.3,1) both`
                : `char-out ${CHAR_OUT_MS}ms cubic-bezier(0.55,0,1,0.45) both`,
          }}
        >
          {animChar.char}
        </span>
      )}

      <TikTokCursor blinking={blinking} />
    </p>
  );
}
