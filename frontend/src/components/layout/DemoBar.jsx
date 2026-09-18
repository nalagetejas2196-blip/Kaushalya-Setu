import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, ShieldCheck, Settings, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DemoBar() {
  const { user, loginDemo, resetDemoData, isBeneficiary, isOfficer, isAdmin } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  const handleDemoSwitch = async (role) => {
    const res = await loginDemo(role);
    if (res.success) {
      if (role === 'officer') {
        navigate('/officer');
      } else if (role === 'admin') {
        navigate('/analytics');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setFeedback('Resetting demo dataset to baseline...');
    const res = await resetDemoData();
    if (res.success) {
      setFeedback('Baseline data restored!');
      setTimeout(() => setFeedback(''), 3000);
      navigate('/dashboard');
    }
    setResetting(false);
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-700 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="bg-gov-saffron text-black font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
            Quick Role Switch
          </span>
          {user && (
            <span className="text-slate-300 hidden sm:inline flex items-center gap-1">
              Active: <strong className="text-white">{user.name}</strong> ({user.role})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Beneficiary Demo */}
          <button
            onClick={() => handleDemoSwitch('beneficiary')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition border ${
              isBeneficiary
                ? 'bg-blue-600 text-white border-blue-400 font-semibold'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5 text-blue-300" />
            <span>Beneficiary: Savita Patil</span>
          </button>

          {/* District Officer Demo */}
          <button
            onClick={() => handleDemoSwitch('officer')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition border ${
              isOfficer
                ? 'bg-emerald-600 text-white border-emerald-400 font-semibold'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Officer: Rajesh Deshmukh</span>
          </button>

          {/* Admin Demo */}
          <button
            onClick={() => handleDemoSwitch('admin')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded transition border ${
              isAdmin
                ? 'bg-purple-600 text-white border-purple-400 font-semibold'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden md:inline">Admin Analytics</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-amber-700 hover:bg-amber-600 text-white border border-amber-500 transition"
            title="Reset demo dataset to pristine initial state"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">Reset Data</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-emerald-900/80 border border-emerald-600 text-emerald-200 px-3 py-1 text-center font-medium mt-1 rounded flex items-center justify-center space-x-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}
