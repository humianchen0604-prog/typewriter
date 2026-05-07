import type { CSSProperties } from 'react';
import Typewriter from './Typewriter';

const TYPEWRITER_TEXTS = [
  'Log in or Sign up for TikTok',
  'Your moment starts here',
];

interface LoginScreenProps {
  typingSpeed: number;
  fontSize:    number;
  headingGap:  number;
  blinking:    boolean;
  blinkSpeed:  number;
}

const ttStyle = (weight: 400 | 600 | 800): CSSProperties => ({
  fontFamily: "'TikTok Sans', system-ui, sans-serif",
  fontStyle: 'normal',
  fontWeight: weight,
});

// ── Social login icons ────────────────────────────────────────────────────
// The user-supplied PNGs are 100% transparent (empty export). Using inline
// SVG instead so the icons are always visible.

function AppleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Apple logo — black silhouette */}
      <path fill="#000" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#1877F2"/>
      <path d="M16.67 15.47l.52-3.47h-3.33v-2.25c0-.95.46-1.87 1.96-1.87h1.51V4.99s-1.37-.23-2.69-.23c-2.74 0-4.53 1.66-4.53 4.67v2.57H7.08v3.47h3.03v8.39a12.1 12.1 0 0 0 3.75 0v-8.39h2.81z" fill="#fff"/>
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5"  cy="12" r="2" fill="#000"/>
      <circle cx="12" cy="12" r="2" fill="#000"/>
      <circle cx="19" cy="12" r="2" fill="#000"/>
    </svg>
  );
}

// Heading container height — computed from the current fontSize so the
// action block stays locked regardless of font size.
// formula: fontSize × lineHeight(1.2) × 2 lines + 6 px buffer
function calcHeadingHeight(fs: number) {
  return Math.ceil(fs * 1.2 * 2) + 6;
}

export default function LoginScreen({ typingSpeed, fontSize, headingGap, blinking, blinkSpeed }: LoginScreenProps) {
  const headingHeight = calcHeadingHeight(fontSize);
  return (
    <div style={{ background: 'white', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>

      {/* White-fade gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0), white)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Status Bar (h=47) ──────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 390, height: 47, overflow: 'hidden', zIndex: 1 }}>
        <p style={{
          ...ttStyle(600),
          position: 'absolute',
          fontSize: 17, lineHeight: 1.3, color: 'black',
          top: '50%', left: 64,
          transform: 'translateX(-50%) translateY(-50%)',
          whiteSpace: 'nowrap',
        }}>
          8:00
        </p>
        <img alt="" src="/assets/signal.png" style={{
          position: 'absolute', right: 84.7,
          top: '50%', transform: 'translateY(calc(-50% + 2.1px))',
          width: 21.3, height: 12.8, display: 'block',
        }} />
        <img alt="" src="/assets/connection.png" style={{
          position: 'absolute', right: 60.32,
          top: '50%', transform: 'translateY(calc(-50% + 2px))',
          width: 17.68, height: 13, display: 'block',
        }} />
        <img alt="" src="/assets/battery.png" style={{
          position: 'absolute', right: 25.57,
          top: '50%', transform: 'translateY(calc(-50% + 2.5px))',
          width: 29.4, height: 14, display: 'block',
        }} />
      </div>

      {/* ── Navigation Bar (h=44, top=47) ─────────────────────── */}
      <div style={{
        position: 'absolute', top: 47, left: 0, width: 390, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        paddingLeft: 6, paddingRight: 6, zIndex: 1,
      }}>
        <div style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img alt="Help" src="/assets/nav-help.png" style={{ width: 24, height: 24, display: 'block' }} />
        </div>
      </div>

      {/* ── Main Content (top=91, h=643) ───────────────────────── */}
      <div style={{
        position: 'absolute', top: 91, left: 0, width: 390, height: 643,
        paddingTop: 72, paddingLeft: 24, paddingRight: 24,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: headingGap,
        zIndex: 1,
      }}>

        {/* Heading — fixed height, text anchored to bottom.
            As typing grows from 1→2 lines, the first line rises upward
            while the action block below stays locked in place. */}
        <div style={{
          width: 310, alignSelf: 'flex-start',
          height: headingHeight,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          overflow: 'visible',
          flexShrink: 0,
        }}>
          <Typewriter
            texts={TYPEWRITER_TEXTS}
            typingSpeed={typingSpeed}
            deletingSpeed={30}
            delayBeforeDelete={2500}
            fontSize={fontSize}
            blinking={blinking}
            blinkSpeed={blinkSpeed}
          />
        </div>

        {/* Action block */}
        <div style={{ width: '100%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Input + Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              background: 'rgba(0,0,0,0.05)',
              border: '0.5px solid rgba(0,0,0,0.05)',
              borderRadius: 999, height: 56,
              display: 'flex', alignItems: 'center',
              paddingLeft: 18, paddingRight: 18,
            }}>
              <span style={{ ...ttStyle(400), fontSize: 17, lineHeight: 1.3, color: 'rgba(0,0,0,0.34)' }}>
                Phone number, email or username
              </span>
            </div>
            <button style={{
              background: 'black', border: 'none', borderRadius: 999,
              height: 56, width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <span style={{ ...ttStyle(600), fontSize: 17, lineHeight: 1.3, color: 'white' }}>
                Continue
              </span>
            </button>
          </div>

          {/* "or" separator */}
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ flex: 1, height: 0, borderTop: '0.5px solid rgba(0,0,0,0.12)' }} />
            <span style={{ ...ttStyle(400), fontSize: 13, lineHeight: 1.3, color: 'rgba(0,0,0,0.48)', padding: '0 16px' }}>
              or
            </span>
            <div style={{ flex: 1, height: 0, borderTop: '0.5px solid rgba(0,0,0,0.12)' }} />
          </div>

          {/* Social login row — inline SVG icons, 24 px each */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
            {([
              { Icon: AppleIcon,    label: 'Continue with Apple'    },
              { Icon: GoogleIcon,   label: 'Continue with Google'   },
              { Icon: FacebookIcon, label: 'Continue with Facebook' },
              { Icon: MoreIcon,     label: 'More options'           },
            ] as const).map(({ Icon, label }) => (
              <button key={label} style={{
                border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: '50%',
                width: 52, height: 52, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', cursor: 'pointer',
              }}>
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Disclaimer (top=734) ───────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 734, left: 0, width: 390, padding: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1,
      }}>
        <p style={{ ...ttStyle(400), fontSize: 11, lineHeight: 1.3, color: 'rgba(0,0,0,0.48)', width: 282 }}>
          {'By signing up, you agree to our '}
          <a href="#" style={{ color: '#2B5DB9', textDecoration: 'none' }}>Terms of Service</a>
          {' and acknowledge that you have read our '}
          <a href="#" style={{ color: '#2B5DB9', textDecoration: 'none' }}>Privacy Policy</a>
          {'.'}
        </p>
      </div>

      {/* ── Home Indicator (top=810, h=34) ─────────────────────── */}
      <div style={{
        position: 'absolute', top: 810, left: 0, width: 390, height: 34,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 9,
        zIndex: 1,
      }}>
        <div style={{ width: 134, height: 5, background: 'black', borderRadius: 100 }} />
      </div>

    </div>
  );
}
