import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, ShieldCheck, Lock, Smartphone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Login() {
  const { t } = useLanguage();
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('beneficiary'); // 'beneficiary' | 'officer'
  const [mobileOrEmail, setMobileOrEmail] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [password, setPassword] = useState('Officer@2026');
  const [otpSent, setOtpSent] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(mobileOrEmail, activeTab === 'beneficiary' ? otp : null, activeTab === 'officer' ? password : null);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'officer') {
        navigate('/officer');
      } else if (res.user.role === 'admin') {
        navigate('/analytics');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(res.error || 'Login failed. For demonstration, use OTP: 123456');
    }
  };

  const handle1ClickDemo = async (role) => {
    const res = await loginDemo(role);
    if (res.success) {
      if (role === 'officer') navigate('/officer');
      else if (role === 'admin') navigate('/analytics');
      else navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto bg-gov-navy text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-md border-2 border-gov-saffron mb-3">
            <span className="text-gov-saffron">क</span><span>स</span>
          </div>
          <h2 className="text-2xl font-black text-gov-navy">
            कौशल्य सेतू पोर्टलवर लॉगिन
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            PM-AJAY Livelihood Navigator &bull; Citizen & Officer Access
          </p>
        </div>

        {/* 1-Click Evaluator Quick Logins Card */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-300 shadow-xs">
          <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs mb-2">
            <CheckCircle2 className="w-4 h-4 text-amber-700" />
            <span>द्रुत चाचणी लॉगिन / 1-Click Role Access</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handle1ClickDemo('beneficiary')}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Savita Patil (SC)</span>
            </button>
            <button
              onClick={() => handle1ClickDemo('officer')}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold transition flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>District Officer</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('beneficiary');
                setMobileOrEmail('9876543210');
                setError('');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'beneficiary'
                  ? 'border-gov-navy text-gov-navy bg-slate-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone className="w-4 h-4 text-gov-saffron" />
              <span>लाभार्थी (Beneficiary)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('officer');
                setMobileOrEmail('demo.officer@kaushalyasetu.local');
                setError('');
              }}
              className={`flex-1 py-3 text-center border-b-2 transition flex items-center justify-center space-x-1.5 ${
                activeTab === 'officer'
                  ? 'border-gov-navy text-gov-navy bg-slate-50'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>शासकीय अधिकारी (Officer)</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'beneficiary' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    नोंदणीकृत मोबाईल नंबर / Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileOrEmail}
                    onChange={(e) => setMobileOrEmail(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      ओटीपी / One Time Password (OTP)
                    </label>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Demo OTP: 123456
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs tracking-widest text-center font-bold focus:ring-2 focus:ring-gov-navy focus:outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    अधिकारी आयडी / Officer Email
                  </label>
                  <input
                    type="text"
                    required
                    value={mobileOrEmail}
                    onChange={(e) => setMobileOrEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    पासवर्ड / Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'लॉगिन होत आहे...' : 'लॉगिन करा / Sign In'}</span>
              <ArrowRight className="w-4 h-4 text-gov-saffron" />
            </button>

            <div className="pt-2 text-center text-xs text-slate-600">
              नवीन आहात?{' '}
              <Link to="/register" className="text-gov-navy font-bold hover:underline">
                येथे नोंदणी करा / Register Here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
