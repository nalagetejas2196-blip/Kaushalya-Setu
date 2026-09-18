import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontScale, setFontScale] = useState(() => {
    return Number(localStorage.getItem('kaushalya_font_scale')) || 1.0;
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('kaushalya_contrast') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('kaushalya_motion') === 'true';
  });

  const [isVoiceActive, setIsVoiceActive] = useState(false);

  useEffect(() => {
    localStorage.setItem('kaushalya_font_scale', fontScale);
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('kaushalya_contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('kaushalya_motion', reducedMotion);
  }, [reducedMotion]);

  const increaseFont = () => setFontScale(prev => Math.min(prev + 0.15, 1.35));
  const decreaseFont = () => setFontScale(prev => Math.max(prev - 0.15, 0.85));
  const resetFont = () => setFontScale(1.0);
  const toggleContrast = () => setHighContrast(prev => !prev);
  const toggleMotion = () => setReducedMotion(prev => !prev);

  return (
    <AccessibilityContext.Provider value={{
      fontScale,
      increaseFont,
      decreaseFont,
      resetFont,
      highContrast,
      toggleContrast,
      reducedMotion,
      toggleMotion,
      isVoiceActive,
      setIsVoiceActive
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
