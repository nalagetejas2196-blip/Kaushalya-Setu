import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Building,
  User,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function TrackApplication() {
  const { user, loginDemo } = useAuth();
  const { lang, t } = useLanguage();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialId = queryParams.get('id') || 'KAUS-2026-0108';
  const isNew = queryParams.get('new') === 'true';

  const [searchId, setSearchId] = useState(initialId);
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApplication = (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');

    fetch(`/api/applications/track/${id.trim()}`)
      .then(res => {
        if (!res.ok) throw new Error('Application ID not found');
        return res.json();
      })
      .then(data => {
        setAppData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'अर्जाचा क्रमांक आढळला नाही');
        setAppData(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (initialId) {
      fetchApplication(initialId);
    }
  }, [initialId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchApplication(searchId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Under Verification':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Documents Required':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      case 'Rejected':
        return 'bg-red-100 text-red-900 border-red-300';
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-gov-navy text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">
                Live Status Tracker
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">District Verification System</span>
            </div>
            <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-gov-navy" />
              <span>अर्जाचा मागोवा व स्थिती / Track Application Status</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              आपल्या अर्जाची सद्यस्थिती, तपासणी शेरे आणि अधिकारी पडताळणीचा थेट इतिहास तपासा.
            </p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-right">
            <span className="text-[10px] text-slate-500 block">नमुना अर्ज क्रमांक</span>
            <button
              onClick={() => {
                setSearchId('KAUS-2026-0108');
                fetchApplication('KAUS-2026-0108');
              }}
              className="text-xs font-black text-gov-navy hover:underline"
            >
              KAUS-2026-0108
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="अर्ज क्रमांक प्रविष्ट करा (e.g. KAUS-2026-0108)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none font-bold text-gov-navy"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition flex-shrink-0"
          >
            {loading ? 'शोधत आहे...' : 'मागोवा घ्या / Track'}
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Application Details & Timeline */}
        {appData && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    अर्ज क्रमांक:
                  </span>
                  <div className="text-xl font-black text-gov-navy">{appData.id}</div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">
                    {appData.target_title} &bull; {appData.target_org}
                  </div>
                </div>

                <span className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase ${getStatusColor(appData.status)}`}>
                  {appData.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div>अर्जदार: <strong className="text-slate-900 block">{appData.beneficiary_name}</strong></div>
                <div>जिल्हा: <strong className="text-slate-900 block">{appData.district}</strong></div>
                <div>अधिकारी: <strong className="text-slate-900 block">{appData.assigned_officer_name}</strong></div>
                <div>सादर दिनांक: <strong className="text-slate-900 block">{new Date(appData.applied_date).toLocaleDateString()}</strong></div>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950">
                <strong>सध्याचा शेरा (Officer Note):</strong> {appData.status_notes}
              </div>

              {/* Quick Evaluator Action: Switch to Officer */}
              <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-gov-navy block">अधिकारी पडताळणी कृती / Officer Verification Action:</span>
                  <span className="text-slate-600">या अर्जावर थेट निर्णय घेण्यासाठी अधिकारी कक्षावर स्विच करा.</span>
                </div>
                <Link
                  to="/officer"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition whitespace-nowrap flex items-center space-x-1"
                >
                  <span>अधिकारी कक्ष उघडा &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Submitted Documents Scrutiny Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                कागदपत्र पडताळणी स्थिती / Document Scrutiny
              </h3>

              <div className="space-y-2">
                {(appData.documents_submitted || []).map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{doc.fileName}</div>
                      <div className="text-[11px] text-slate-500">
                        शेरा: {doc.officer_note || 'पडताळणी प्रक्रियेत'}
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      doc.verified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}>
                      {doc.verified ? '✓ पडताळणी पूर्ण' : 'प्रलंबित (Pending)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Multi-Stage Audit Timeline */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gov-saffron" />
                अर्जाचा संपूर्ण इतिहास / Activity & Audit Timeline
              </h3>

              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pt-1">
                {(appData.timeline || []).map((entry, index) => (
                  <div key={index} className="relative pl-6">
                    {/* Circle Node */}
                    <div className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-gov-navy border-2 border-white shadow-xs"></div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-gov-navy">{entry.status}</span>
                        <span className="text-[10px] text-slate-400">&bull;</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 font-semibold">
                        कार्यवाही: <span className="text-slate-900">{entry.actor}</span>
                      </div>

                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-snug">
                        {entry.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
