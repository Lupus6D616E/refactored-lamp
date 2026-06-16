import React, { useState, useEffect, CSSProperties } from 'react';
import ThemeSwitcherCard from './ThemesSwitcherCard';


// Type definitions para sa Google Translate Window object
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

export default function AccessibilityWidget(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // States na may LocalStorage backup para sa Persistence
  const [fontMultiplier, setFontMultiplier] = useState<number>(() => 
    Number(localStorage.getItem('a11y-font')) || 1
  );
  const [isBigCursor, setIsBigCursor] = useState<boolean>(() => 
    localStorage.getItem('a11y-cursor') === 'true'
  );
  const [isReadingGuide, setIsReadingGuide] = useState<boolean>(() => 
    localStorage.getItem('a11y-guide') === 'true'
  );
  const [isReaderMode, setIsReaderMode] = useState<boolean>(() => 
    localStorage.getItem('a11y-reader') === 'true'
  );

  // Text-To-Speech (Reader) States
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mouseY, setMouseY] = useState<number>(0);

  // 1. Google Translate Initializer Protection
  useEffect(() => {
    if (isOpen && window.google && window.google.translate && !document.querySelector('.goog-te-combo')) {
      try {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      } catch (error) {
        console.error("Google Translate script failed to initialize layout:", error);
      }
    }
  }, [isOpen]);

  // 2. LocalStorage & DOM Effect Updates
  useEffect(() => {
    localStorage.setItem('a11y-font', fontMultiplier.toString());
    localStorage.setItem('a11y-cursor', isBigCursor.toString());
    localStorage.setItem('a11y-guide', isReadingGuide.toString());
    localStorage.setItem('a11y-reader', isReaderMode.toString());

    // Cursor Styling Toggle
    if (isBigCursor) {
      document.body.classList.add('a11y-big-cursor');
    } else {
      document.body.classList.remove('a11y-big-cursor');
    }

    // Reader Mode Classes
    if (isReaderMode) {
      document.body.classList.add('a11y-reader-active');
    } else {
      document.body.classList.remove('a11y-reader-active');
    }
  }, [fontMultiplier, isBigCursor, isReadingGuide, isReaderMode]);

  // 3. Reading Guide Mouse Listener
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => setMouseY(e.clientY);
    if (isReadingGuide) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReadingGuide]);

  // 4. Audio Reader (Text-to-Speech) Logic
  const toggleSpeechReader = (): void => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const mainText = document.querySelector('main')?.innerText || document.body.innerText;
      const cleanText = mainText.replace(/Accessibility[\s\S]*/g, ''); 
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Reset All Settings
  const resetAll = (): void => {
    setFontMultiplier(1);
    setIsBigCursor(false);
    setIsReadingGuide(false);
    setIsReaderMode(false);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <> 
      {/* READING GUIDE LINE */}
      {isReadingGuide && (
        <div 
          style={{
            position: 'fixed',
            top: `${mouseY}px`,
            left: 0,
            width: '100%',
            height: '20px',
            backgroundColor: 'rgba(59, 130, 246, 0.25)', 
            borderTop: '2px dashed #3b82f6',
            borderBottom: '2px dashed #3b82f6',
            pointerEvents: 'none',
            zIndex: 100000,
            transform: 'translateY(-50%)',
            transition: 'top 0.05s ease-out'
          }}
        />
      )}

      {/* FLOATING ACTION TRIGGER BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Accessibility Menu"
        aria-expanded={isOpen}
        style={floatingBtnStyle}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
      </button>

      {/* MODAL / PANEL PANEL */}
      {isOpen && (
        <div role="dialog" aria-label="Accessibility Options" style={panelContainerStyle}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Accessibility</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Customize your view preference</p>
            </div>
            <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>✕</button>
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

            {/* FEATURE 2: TOGGLES (Cursor, Ruler, Reader) */}
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
                  <span>Reader Mode (Sepia) 📖</span>
                  <input type="checkbox" style={checkboxStyle} checked={isReaderMode} onChange={() => setIsReaderMode(!isReaderMode)} />
                </label>
              </div>
            </div>

            {/* FEATURE 3: AUDIO READER & TRANSLATE */}
            <div style={cardStyle}>
              <span style={sectionTitleStyle}>Assistance & Translation</span>
              
              {/* Voice Reader */}
              <button 
                onClick={toggleSpeechReader} 
                style={{
                  ...activeBtnStyle, 
                  backgroundColor: isSpeaking ? '#ef4444' : '#10b981', 
                  marginTop: '10px', width: '100%', justifyContent: 'center'
                }}
              >
                {isSpeaking ? "Stop Audio Reader ⏹️" : "Listen to Screen (Audio) 🔊"}
              </button>

              {/* Language Translate Dropdown */}
              <div style={{ marginTop: '12px' }}>
                <div id="google_translate_element" className="modern-translate-container"></div>
              </div>
            </div>

            {/* RESET BUTTON */}
            <button onClick={resetAll} style={resetBtnStyle}>
              Reset All Defaults
            </button>

          </div>
        </div>
      )}

      {/* FIXED GLOBAL STYLE INJECTOR WITH PX OVERRIDE */}
      <style>{`
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
          cursor: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' style='font-size:40px'><text y='40'>🖱️</text></svg>"), auto !important;
        }
        
        .a11y-reader-active {
          background-color: #fcf8f2 !important;
          color: #1e293b !important;
          line-height: 1.8 !important;
          word-spacing: 0.12em !important;
        }
        
        .goog-te-banner-frame, .goog-te-balloon-frame, #goog-gt-tt, .goog-banner-frame { display: none !important; }
        .goog-te-gadget { font-family: inherit !important; color: transparent !important; }
        .goog-te-gadget .goog-te-combo {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background-color: #f8fafc;
          color: #334155;
          font-size: 14px !important;
        }
        body { top: 0px !important; }
      `}</style>
    </>
  );
}

/* ==========================================================================
   INAYOS NA MGA CSS STYLES (May Scrollbar at Solid Background Protection)
   ========================================================================== */

const floatingBtnStyle: CSSProperties = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 99999,
  backgroundColor: '#1e40af',
  color: '#ffffff',
  border: 'none',
  borderRadius: '9999px',
  width: '56px',
  height: '56px',
  boxShadow: '0 10px 25px -5px rgba(30, 64, 175, 0.5)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const panelContainerStyle: CSSProperties = {
  position: 'fixed',
  bottom: '96px',
  right: '24px',
  zIndex: 99999,
  backgroundColor: '#ffffff', // GINAWANG SOLID WHITE para iwas-hidden bug sa Firefox/Safari
  color: '#334155',
  width: '320px',
  
  // INAYOS DITO: Naglagay ng max-height at auto scroll para sa maliliit na screen (Mobile Protection)
  maxHeight: 'calc(100vh - 140px)', 
  overflowY: 'auto', 
  
  borderRadius: '20px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
  padding: '24px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  border: '1px solid #e2e8f0'
};

const cardStyle: CSSProperties = {
  backgroundColor: '#f8fafc',
  padding: '14px',
  borderRadius: '12px',
  border: '1px solid #f1f5f9'
};

const sectionTitleStyle: CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b'
};

const rowToggleStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.95rem',
  fontWeight: 500,
  color: '#334155',
  cursor: 'pointer'
};

const activeBtnStyle: CSSProperties = {
  flex: 1,
  padding: '10px',
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.85rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.2s'
};

const inactiveBtnStyle: CSSProperties = {
  ...activeBtnStyle,
  backgroundColor: '#ffffff',
  color: '#475569',
  border: '1px solid #e2e8f0',
};

const checkboxStyle: CSSProperties = {
  width: '18px',
  height: '18px',
  cursor: 'pointer',
  accentColor: '#2563eb'
};

const closeBtnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  fontSize: '18px',
  cursor: 'pointer',
  padding: '4px'
};

const resetBtnStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#ef4444',
  textDecoration: 'underline',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  alignSelf: 'center',
  marginTop: '5px',
  marginBottom: '5px' // Kaunting padding sa pinakailalim ng scroll list
};