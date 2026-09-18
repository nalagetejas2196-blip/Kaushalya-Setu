import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Eye, Sun, Volume2 } from 'lucide-react';

export default function GovTopBar() {
  const { lang, setLang, t } = useLanguage();
  const { fontScale, increaseFont, decreaseFont, resetFont, highContrast, toggleContrast } = useAccessibility();

  return (
    <div className="bg-[#0B3C5D] text-white text-xs border-b border-gov-navy-dark">
      {/* Subtle National Tricolor Top Accent Line */}
      <div className="h-1 w-full flex">
        <div className="bg-[#FF9933] flex-1"></div>
        <div className="bg-white flex-1"></div>
        <div className="bg-[#138808] flex-1"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Gov of India Official Tag */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold tracking-wide">भारत सरकार | Government of India</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline text-slate-200">PM-AJAY & GIA Livelihood Mission</span>
        </div>

        {/* Right: Accessibility Controls & Language Selector */}
        <div className="flex items-center space-x-3">
          {/* Font Resize Controls */}
          <div className="flex items-center space-x-1 bg-gov-navy-dark px-2 py-0.5 rounded border border-slate-600" title="Adjust Font Size / फॉन्ट बदला">
            <button
              onClick={decreaseFont}
              className={`px-1 font-bold hover:text-gov-saffron ${fontScale < 1 ? 'text-gov-saffron' : 'text-slate-300'}`}
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={resetFont}
              className={`px-1 font-bold hover:text-gov-saffron ${fontScale === 1 ? 'text-gov-saffron' : 'text-slate-300'}`}
              aria-label="Standard Font Size"
            >
              A
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={increaseFont}
              className={`px-1 font-bold hover:text-gov-saffron ${fontScale > 1 ? 'text-gov-saffron' : 'text-slate-300'}`}
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleContrast}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded border text-xs ${
              highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'bg-gov-navy-dark border-slate-600 text-slate-200 hover:text-white'
            }`}
            title="Toggle High Contrast / उच्च कॉन्ट्रास्ट"
            aria-label="Toggle High Contrast"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{highContrast ? 'Standard' : 'High Contrast'}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 bg-gov-navy-dark px-1.5 py-0.5 rounded border border-slate-600">
            <button
              onClick={() => setLang('mr')}
              className={`px-1.5 py-0.5 rounded text-xs font-medium transition ${
                lang === 'mr' ? 'bg-gov-saffron text-black font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              मराठी
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-1.5 py-0.5 rounded text-xs font-medium transition ${
                lang === 'hi' ? 'bg-gov-saffron text-black font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded text-xs font-medium transition ${
                lang === 'en' ? 'bg-gov-saffron text-black font-bold' : 'text-slate-200 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
