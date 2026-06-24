import React, { useState, useEffect, CSSProperties, useRef } from 'react';
import ThemeSwitcherCard from './ThemesSwitcherCard';

export default function AccessibilityWidget(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  const [fontMultiplier, setFontMultiplier] = useState<number>(() => 
    Number(localStorage.getItem('a11y-font')) || 1
  );
  const [isBigCursor, setIsBigCursor] = useState<boolean>(() => 
    localStorage.getItem('a11y-cursor') === 'true'
  );
  const [isReadingGuide, setIsReadingGuide] = useState<boolean>(() => 
    localStorage.getItem('a11y-guide') === 'true'
  );
  const [isDyslexiaMode, setIsDyslexiaMode] = useState<boolean>(() => 
    localStorage.getItem('a11y-dyslexia') === 'true'
  );
  
  // DYSLEXIA FONT STYLE STATE ('opendyslexic' | 'comicsans' | 'verdana')
  const [dyslexiaFont, setDyslexiaFont] = useState<string>(() => 
    localStorage.getItem('a11y-dyslexia-font') || 'opendyslexic'
  );

  // Dyslexia Friendly Tint Mode ('none' | 'cream' | 'blue')
  const [dyslexiaTint, setDyslexiaTint] = useState<'none' | 'cream' | 'blue'>(() => 
    (localStorage.getItem('a11y-dyslexia-tint') as 'none' | 'cream' | 'blue') || 'none'
  );

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mouseY, setMouseY] = useState<number>(0);

  // 1. CLICK OUTSIDE TO CLOSE ENGINE
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (widgetRef.current && !widgetRef.current.contains(target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // 2. ESCAPE KEY TO CLOSE
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // LocalStorage & DOM Style Updates
  useEffect(() => {
    localStorage.setItem('a11y-font', fontMultiplier.toString());
    localStorage.setItem('a11y-cursor', isBigCursor.toString());
    localStorage.setItem('a11y-guide', isReadingGuide.toString());
    localStorage.setItem('a11y-dyslexia', isDyslexiaMode.toString());
    localStorage.setItem('a11y-dyslexia-font', dyslexiaFont);
    localStorage.setItem('a11y-dyslexia-tint', dyslexiaTint);

    if (isBigCursor) document.body.classList.add('a11y-big-cursor');
    else document.body.classList.remove('a11y-big-cursor');

    // Font Styles Cleanups & Toggle
    document.body.classList.remove('a11y-dyslexia-active', 'font-variant-opendyslexic', 'font-variant-comicsans', 'font-variant-verdana');
    if (isDyslexiaMode) {
      document.body.classList.add('a11y-dyslexia-active');
      document.body.classList.add(`font-variant-${dyslexiaFont}`);
    }

    // Tint Management
    document.body.classList.remove('a11y-tint-cream', 'a11y-tint-blue');
    if (dyslexiaTint === 'cream') document.body.classList.add('a11y-tint-cream');
    if (dyslexiaTint === 'blue') document.body.classList.add('a11y-tint-blue');

  }, [fontMultiplier, isBigCursor, isReadingGuide, isDyslexiaMode, dyslexiaFont, dyslexiaTint]);

  // Reading Guide Mouse Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => setMouseY(e.clientY);
    if (isReadingGuide) window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReadingGuide]);

  // Audio Reader Logic (FIXED)
  const toggleSpeechReader = (): void => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const mainElement = document.querySelector('main');
      let cleanText = mainElement ? mainElement.innerText : document.body.innerText;

      // Kung walang <main> tag, linisin lang ang salitang Accessibility para hindi madamay ang buong page
      if (!mainElement) {
        cleanText = cleanText.replace(/Accessibility[\s\S]*Customize your view preference/g, '');
      }

      if (!cleanText.trim()) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const resetAll = (): void => {
    setFontMultiplier(1);
    setIsBigCursor(false);
    setIsReadingGuide(false);
    setIsDyslexiaMode(false);
    setDyslexiaFont('opendyslexic');
    setDyslexiaTint('none');
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div ref={widgetRef}>
      {/* READING GUIDE LINE */}
      {isReadingGuide && (
        <div style={{ position: 'fixed', top: `${mouseY}px`, left: 0, width: '100%', height: '20px', backgroundColor: 'rgba(59, 130, 246, 0.25)', borderTop: '2px dashed #3b82f6', borderBottom: '2px dashed #3b82f6', pointerEvents: 'none', zIndex: 100000, transform: 'translateY(-50%)', transition: 'top 0.05s ease-out' }} />
      )}

      {/* FLOATING ACTION TRIGGER BUTTON */}
      <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Accessibility Menu" aria-expanded={isOpen} style={floatingBtnStyle}>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      </button>

      {/* MODAL / PANEL */}
      {isOpen && (
        <div role="dialog" aria-label="Accessibility Options" style={panelContainerStyle}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Accessibility</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Customize your view preference</p>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} style={closeBtnStyle}>✕</button>
          </div>

          <div style={{ ...cardStyle, marginBottom: '20px' }}>
            <ThemeSwitcherCard />
          </div>

          {/* CONTROLS HUB */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* FEATURE 1: TEXT SIZE CONTROL */}
            <div style={cardStyle}>
              <span style={sectionTitleStyle}>Font Size Scale</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button style={fontMultiplier === 1 ? activeBtnStyle : inactiveBtnStyle} onClick={() => setFontMultiplier(1)}>100%</button>
                <button style={fontMultiplier === 1.25 ? activeBtnStyle : inactiveBtnStyle} onClick={() => setFontMultiplier(1.25)}>125%</button>
                <button style={fontMultiplier === 1.5 ? activeBtnStyle : inactiveBtnStyle} onClick={() => setFontMultiplier(1.5)}>150%</button>
              </div>
            </div>

            {/* FEATURE 2: SCREEN ENHANCEMENTS & DYSLEXIA TOGGLE */}
            <div style={cardStyle}>
              <span style={sectionTitleStyle}>Screen Enhancements</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                <label style={rowToggleStyle}>
                  <span>Big Pointer 🖱️</span>
                  <input type="checkbox" style={checkboxStyle} checked={isBigCursor} onChange={() => setIsBigCursor(!isBigCursor)} />
                </label>

                <label style={rowToggleStyle}>
                  <span>Reading Ruler 📏</span>
                  <input type="checkbox" style={checkboxStyle} checked={isReadingGuide} onChange={() => setIsReadingGuide(!isReadingGuide)} />
                </label>

                <label style={rowToggleStyle}>
                  <span>Dyslexia Friendly 🧠</span>
                  <input type="checkbox" style={checkboxStyle} checked={isDyslexiaMode} onChange={() => setIsDyslexiaMode(!isDyslexiaMode)} />
                </label>
              </div>

              {/* DYNAMIC DYSLEXIA FONT CHANGER */}
              {isDyslexiaMode && (
                <div style={{ marginTop: '14px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>Select Dyslexia Font Type:</span>
                  <select 
                    value={dyslexiaFont} 
                    onChange={(e) => setDyslexiaFont(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', marginTop: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="opendyslexic">OpenDyslexic (Heavy Bottoms)</option>
                    <option value="comicsans">Comic Sans (Distinct Shapes)</option>
                    <option value="verdana">Verdana (Wide Sans-Serif)</option>
                  </select>
                </div>
              )}
            </div>

            {/* FEATURE 3: VISUAL STRESS OVERLAYS (TINTS) */}
            <div style={cardStyle}>
              <span style={sectionTitleStyle}>Visual Stress Overlays (Tints)</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                <button style={dyslexiaTint === 'none' ? activeBtnStyle : inactiveBtnStyle} onClick={() => setDyslexiaTint('none')}>Default</button>
                <button style={dyslexiaTint === 'cream' ? { ...activeBtnStyle, backgroundColor: '#fdf6e3', color: '#586e75', border: '1px solid #93a1a1' } : inactiveBtnStyle} onClick={() => setDyslexiaTint('cream')}>Cream 🍦</button>
                <button style={dyslexiaTint === 'blue' ? { ...activeBtnStyle, backgroundColor: '#e0f2fe', color: '#0369a1', border: '1px solid #7dd3fc' } : inactiveBtnStyle} onClick={() => setDyslexiaTint('blue')}>Soft Blue 🌊</button>
              </div>
            </div>

            {/* FEATURE 4: AUDIO READER */}
            <div style={cardStyle}>
              <span style={sectionTitleStyle}>Screen Assistance</span>
              <button type="button" onClick={toggleSpeechReader} style={{ ...activeBtnStyle, backgroundColor: isSpeaking ? '#ef4444' : '#10b981', marginTop: '10px', width: '100%', justifyContent: 'center' }}>
                {isSpeaking ? "Stop Audio Reader ⏹️" : "Listen to Screen (Audio) 🔊"}
              </button>
            </div>

            {/* RESET BUTTON */}
            <button type="button" onClick={resetAll} style={resetBtnStyle}>Reset All Defaults</button>
          </div>
        </div>
      )}

      {/* TSX GLOBAL INJECTOR OVERRIDES */}
      <style>{`
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/font/OpenDyslexic-Regular.woff2') format('woff2');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        body {
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        ${fontMultiplier > 1 ? `
          body, body p, body span, body h1, body h2, body h3, body h4, body h5, body h6, body a, body li, body button, body label {
            font-size: calc(100% * ${fontMultiplier}) !important;
          }
        ` : ''}

        div[role="dialog"][aria-label="Accessibility Options"], 
        div[role="dialog"][aria-label="Accessibility Options"] * {
          font-size: initial !important;
        }

        .a11y-big-cursor, .a11y-big-cursor * {
          cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'><path d='M4.5 3V19l4.5-4.5h6.5L4.5 3z' fill='black' stroke='white' stroke-width='2' stroke-linejoin='round'/></svg>"), auto !important;
        }
        
        .a11y-dyslexia-active, .a11y-dyslexia-active * {
          line-height: 2.0 !important;
          letter-spacing: 0.16em !important;
          word-spacing: 0.32em !important;
          text-align: left !important;
          hyphens: none !important;
          word-break: keep-all !important;
          overflow-wrap: break-word !important;
        }

        .font-variant-opendyslexic, .font-variant-opendyslexic * {
          font-family: "OpenDyslexic", sans-serif !important;
        }
        .font-variant-comicsans, .font-variant-comicsans * {
          font-family: "Comic Sans MS", "Chalkboard SE", cursive, sans-serif !important;
        }
        .font-variant-verdana, .font-variant-verdana * {
          font-family: "Verdana", Geneva, sans-serif !important;
        }

        .a11y-dyslexia-active p, .a11y-dyslexia-active li {
          margin-bottom: 2rem !important;
        }

        .a11y-dyslexia-active ::selection {
          background-color: #fef08a !important;
          color: #0f172a !important;
        }

        .a11y-tint-cream, .a11y-tint-cream main, .a11y-tint-cream div:not([role="dialog"]), .a11y-tint-cream section, .a11y-tint-cream article {
          background-color: #fdf6e3 !important;
          color: #334155 !important;
        }

        .a11y-tint-blue, .a11y-tint-blue main, .a11y-tint-blue div:not([role="dialog"]), .a11y-tint-blue section, .a11y-tint-blue article {
          background-color: #e0f2fe !important;
          color: #0f172a !important;
        }
      `}</style>
    </div>
  );
}

// STYLES OBJECTS
const floatingBtnStyle: CSSProperties = { position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, backgroundColor: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '9999px', width: '56px', height: '56px', boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const panelContainerStyle: CSSProperties = { position: 'fixed', bottom: '96px', right: '24px', zIndex: 99999, backgroundColor: '#ffffff', color: '#334155', width: '320px', maxHeight: 'calc(100vh - 140px)', overflowY: 'auto', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif', border: '1px solid #e2e8f0' };
const cardStyle: CSSProperties = { backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #f1f5f9' };
const sectionTitleStyle: CSSProperties = { fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' };
const rowToggleStyle: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', fontWeight: 500, color: '#334155', cursor: 'pointer' };
const activeBtnStyle: CSSProperties = { flex: 1, padding: '10px', border: 'none', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' };
const inactiveBtnStyle: CSSProperties = { ...activeBtnStyle, backgroundColor: '#ffffff', color: '#475569', border: '1px solid #e2e8f0' };
const checkboxStyle: CSSProperties = { width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' };
const closeBtnStyle: CSSProperties = { background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer', padding: '4px' };
const resetBtnStyle: CSSProperties = { background: 'none', border: 'none', color: '#ef4444', textDecoration: 'underline', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', alignSelf: 'center', marginTop: '5px', marginBottom: '5px' };