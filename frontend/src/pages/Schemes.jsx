import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileText,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Schemes() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Eligibility Evaluation State
  const [evaluatingScheme, setEvaluatingScheme] = useState(null);
  const [evalResult, setEvalResult] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);

  useEffect(() => {
    fetch('/api/schemes')
      .then(res => res.json())
      .then(data => {
        setSchemes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch schemes error:', err);
        setLoading(false);
      });
  }, []);

  const handleCheckEligibility = async (scheme) => {
    setEvaluatingScheme(scheme);
    setEvalLoading(true);
    setEvalResult(null);

    try {
      const res = await fetch(`/api/schemes/${scheme.id}/check-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          user: user || {
            category: "SC",
            age: 22,
            annual_income: 72000,
            education: "12th Pass",
            documents: []
          }
        })
      });
      const data = await res.json();
      setEvalResult(data);
    } catch (err) {
      console.error('Check eligibility error:', err);
    } finally {
      setEvalLoading(false);
    }
  };

  const filteredSchemes = schemes.filter(s => {
    const matchesTag = selectedTag === 'ALL' || (s.tags && s.tags.includes(selectedTag));
    const title = (s.title + ' ' + (s.title_mr || '') + ' ' + (s.title_hi || '') + ' ' + s.department).toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                MoSJE Verified Repository
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">PM-AJAY, GIA & NSFDC Initiatives</span>
            </div>
            <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
              <Award className="w-6 h-6 text-gov-saffron" />
              <span>सरकारी योजना व अनुदान / Government Schemes (PM-AJAY)</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              अनुसूचित जाती समुदायातील नागरिकांसाठी थेट सरकारी अनुदान आणि कौशल्य विकास योजना.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-500 block">सक्रिय योजना</span>
            <span className="text-xl font-black text-gov-navy">{schemes.length} योजना उपलब्ध</span>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="योजनेचे नाव, विभाग किंवा लाभाचा प्रकार शोधा... (Search schemes)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-1 overflow-x-auto w-full sm:w-auto">
            {['ALL', 'Livelihood', 'Subsidy', 'Skill Training', 'Entrepreneurship'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  selectedTag === tag
                    ? 'bg-gov-navy text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tag === 'ALL' ? 'सर्व योजना' : tag}
              </button>
            ))}
          </div>
        </div>

        {/* Schemes List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500">
            योजनांची यादी लोड होत आहे...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSchemes.map(scheme => {
              const schemeTitle = lang === 'mr' ? (scheme.title_mr || scheme.title) : (lang === 'hi' ? (scheme.title_hi || scheme.title) : scheme.title);
              const benefits = lang === 'mr' ? (scheme.benefits_mr || scheme.benefits) : (lang === 'hi' ? (scheme.benefits_hi || scheme.benefits) : scheme.benefits);

              return (
                <div
                  key={scheme.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-gov-navy transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-gov-saffron-dark uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {scheme.department}
                        </span>
                        <h3 className="font-extrabold text-sm sm:text-base text-gov-navy mt-1.5 leading-snug">
                          {schemeTitle}
                        </h3>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {scheme.status}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <strong className="text-slate-900 block mb-1">प्रमुख लाभ / Benefits:</strong>
                      <p className="text-slate-700 leading-relaxed">{benefits}</p>
                    </div>

                    {/* Eligibility Snapshot */}
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>पात्र प्रवर्ग: <strong>{scheme.eligibility.category?.join(', ')}</strong></div>
                      <div>वयोमर्यादा: <strong>{scheme.eligibility.min_age} ते {scheme.eligibility.max_age} वर्षे</strong></div>
                      <div>उत्पन्न मर्यादा: <strong>₹{scheme.eligibility.max_annual_income?.toLocaleString('en-IN') || 'लागू नाही'} पर्यंत</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleCheckEligibility(scheme)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-200" />
                      <span>माझी पात्रता तपासा</span>
                    </button>

                    <button
                      onClick={() => navigate(`/apply?type=scheme&id=${scheme.id}`)}
                      className="px-3.5 py-2 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center space-x-1"
                    >
                      <span>अर्ज करा</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Eligibility Modal */}
        {evaluatingScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border-2 border-gov-navy animate-in fade-in">
              <div className="bg-gov-navy text-white px-5 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">
                    योजना पात्रता तपासणी / Eligibility Report
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    लाभार्थी प्रोफाइल विरुद्ध शासकीय नियम पडताळणी
                  </p>
                </div>
                <button
                  onClick={() => setEvaluatingScheme(null)}
                  className="text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="font-bold text-sm text-gov-navy">
                  {evaluatingScheme.title}
                </div>

                {evalLoading ? (
                  <div className="py-8 text-center text-xs font-semibold text-slate-500">
                    तुमच्या डिजिटल प्रोफाइलची पात्रता तपासत आहे...
                  </div>
                ) : evalResult ? (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className={`p-3 rounded-xl border flex items-center space-x-2 text-xs font-bold ${
                      evalResult.status === 'ELIGIBLE'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : (evalResult.status === 'REQUIRES_VERIFICATION'
                            ? 'bg-amber-50 border-amber-300 text-amber-900'
                            : 'bg-red-50 border-red-300 text-red-900')
                    }`}>
                      {evalResult.status === 'ELIGIBLE' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      )}
                      <div>
                        <div>निकाल: <strong>{evalResult.status}</strong></div>
                        <div className="text-[11px] font-normal mt-0.5">{evalResult.summary}</div>
                      </div>
                    </div>

                    {/* Rule by Rule breakdown */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700">निकष विश्लेषण (Criteria Breakdown):</div>
                      {evalResult.reasons.map((r, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start space-x-2">
                          <span className={r.passed ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
                            {r.passed ? '✓' : '✕'}
                          </span>
                          <div>
                            <span className="font-bold text-slate-800">{r.rule}: </span>
                            <span className="text-slate-600">{r.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button
                        onClick={() => setEvaluatingScheme(null)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        बंद करा
                      </button>
                      <button
                        onClick={() => {
                          const sid = evaluatingScheme.id;
                          setEvaluatingScheme(null);
                          navigate(`/apply?type=scheme&id=${sid}`);
                        }}
                        className="px-4 py-2 bg-gov-navy text-white rounded-lg text-xs font-bold hover:bg-gov-navy-light"
                      >
                        अनुदानासाठी अर्ज करा &rarr;
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
