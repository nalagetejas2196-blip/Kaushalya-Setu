import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout Components
import GovTopBar from './components/layout/GovTopBar';
import GovDisclaimer from './components/layout/GovDisclaimer';
import DemoBar from './components/layout/DemoBar';
import GovHeader from './components/layout/GovHeader';
import GovFooter from './components/layout/GovFooter';
import KaushalyaSahayakVoice from './components/voice/KaushalyaSahayakVoice';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SkillDiscovery from './pages/SkillDiscovery';
import SkillGap from './pages/SkillGap';
import CareerSimulator from './pages/CareerSimulator';
import Schemes from './pages/Schemes';
import Opportunities from './pages/Opportunities';
import Apply from './pages/Apply';
import TrackApplication from './pages/TrackApplication';
import OfficerPortal from './pages/OfficerPortal';
import AdminAnalytics from './pages/AdminAnalytics';
import HelpCentre from './pages/HelpCentre';

import { Mic } from 'lucide-react';

export default function App() {
  const [voiceOpen, setVoiceOpen] = useState(false);

  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AuthProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen">
              {/* Government Header Structure */}
              <GovTopBar />
              <GovDisclaimer />
              <DemoBar />
              <GovHeader onOpenVoice={() => setVoiceOpen(true)} />

              {/* Main Content Area */}
              <main id="main-content" className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home onOpenVoice={() => setVoiceOpen(true)} />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/skills" element={<SkillDiscovery />} />
                  <Route path="/skill-gap" element={<SkillGap />} />
                  <Route path="/simulator" element={<CareerSimulator />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/opportunities" element={<Opportunities />} />
                  <Route path="/apply" element={<Apply />} />
                  <Route path="/track" element={<TrackApplication />} />
                  <Route path="/officer" element={<OfficerPortal />} />
                  <Route path="/analytics" element={<AdminAnalytics />} />
                  <Route path="/help" element={<HelpCentre onOpenVoice={() => setVoiceOpen(true)} />} />
                </Routes>
              </main>

              {/* Government Footer */}
              <GovFooter />

              {/* Persistent Floating "Need Help / Voice Assistant" Button */}
              <button
                onClick={() => setVoiceOpen(true)}
                className="fixed bottom-5 right-5 z-40 bg-gradient-to-r from-gov-saffron to-amber-500 text-slate-950 font-black px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition flex items-center space-x-2 border-2 border-slate-900 group"
                aria-label="Open Kaushalya Sahayak Voice Assistant"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-gov-saffron flex items-center justify-center">
                  <Mic className="w-4 h-4" />
                </div>
                <span className="text-xs tracking-wide">कौशल्य सहायक (Voice)</span>
              </button>

              {/* Kaushalya Sahayak Voice & Chat Assistant Modal */}
              <KaushalyaSahayakVoice
                isOpen={voiceOpen}
                onClose={() => setVoiceOpen(false)}
              />
            </div>
          </NotificationProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
}
