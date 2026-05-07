import { useState } from 'react';
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [speed,      setSpeed]      = useState(70);    // ms per char
  const [fontSize,   setFontSize]   = useState(44);    // px
  const [headingGap, setHeadingGap] = useState(48);    // px
  const [blinking,   setBlinking]   = useState(false); // cursor blink
  const [blinkSpeed, setBlinkSpeed] = useState(400);  // ms per blink cycle

  return (
    <>
      {/* ── Phone frame — centered by body flex ─────────────── */}
      <div
        style={{
          width: 390,
          height: 844,
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
        }}
      >
        <LoginScreen
          typingSpeed={speed}
          fontSize={fontSize}
          headingGap={headingGap}
          blinking={blinking}
          blinkSpeed={blinkSpeed}
        />
      </div>

      {/* ── Controls panel — small floating popup to the right ── */}
      {/* fixed so it doesn't shift the phone's centering         */}
      <div
        style={{
          position: 'fixed',
          left: 'calc(50% + 355px)',   /* right edge of phone (195px) + 160px gap */
          top: '50%',
          transform: 'translateY(-50%)',
          width: 220,
          background: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          padding: '24px 20px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          color: '#aaa',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Controls
        </p>

        {/* ── Typing speed ──────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>Typing Speed</span>
            <span style={{ fontSize: 11, color: '#999' }}>{speed} ms</span>
          </div>
          <input
            type="range"
            min={20}
            max={200}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#fe2c55', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#bbb' }}>Fast</span>
            <span style={{ fontSize: 10, color: '#bbb' }}>Slow</span>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

        {/* ── Font size ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>Font Size</span>
            <span style={{ fontSize: 11, color: '#999' }}>{fontSize} px</span>
          </div>
          <input
            type="range"
            min={24}
            max={64}
            value={fontSize}
            onChange={e => setFontSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#fe2c55', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#bbb' }}>Small</span>
            <span style={{ fontSize: 10, color: '#bbb' }}>Large</span>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

        {/* ── Text → button gap ─────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>Text Gap</span>
            <span style={{ fontSize: 11, color: '#999' }}>{headingGap} px</span>
          </div>
          <input
            type="range"
            min={8}
            max={120}
            step={4}
            value={headingGap}
            onChange={e => setHeadingGap(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#fe2c55', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#bbb' }}>Tight</span>
            <span style={{ fontSize: 10, color: '#bbb' }}>Spacious</span>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(0,0,0,0.06)' }} />

        {/* ── Cursor blink toggle ───────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>Cursor Blink</span>
          <button
            role="switch"
            aria-checked={blinking}
            onClick={() => setBlinking(b => !b)}
            style={{
              width: 44, height: 26, borderRadius: 13, border: 'none',
              background: blinking ? '#fe2c55' : '#ddd',
              cursor: 'pointer', position: 'relative', flexShrink: 0,
              transition: 'background 0.2s ease',
            }}
          >
            <span style={{
              position: 'absolute', top: 2, left: blinking ? 20 : 2,
              width: 22, height: 22, borderRadius: '50%', background: '#fff',
              transition: 'left 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
            }} />
          </button>
        </div>

        {/* ── Blink speed ───────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#222' }}>Blink Speed</span>
            <span style={{ fontSize: 11, color: '#999' }}>{blinkSpeed} ms</span>
          </div>
          <input
            type="range"
            min={100}
            max={1000}
            step={50}
            value={blinkSpeed}
            onChange={e => setBlinkSpeed(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#fe2c55', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, color: '#bbb' }}>Fast</span>
            <span style={{ fontSize: 10, color: '#bbb' }}>Slow</span>
          </div>
        </div>

      </div>
    </>
  );
}
