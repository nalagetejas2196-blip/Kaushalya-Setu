import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Award
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SkillGap() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [occupations, setOccupations] = useState([]);
  const [selectedOccId, setSelectedOccId] = useState('occ-solar-tech');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills/occupations')
      .then(res => res.json())
      .then(data => {
        setOccupations(data);
        if (data.length > 0 && !selectedOccId) {
          setSelectedOccId(data[0].id);
        }
      })
      .catch(err => console.error('Fetch occupations error:', err));
  }, []);

  useEffect(() => {
    if (!selectedOccId) return;
    setLoading(true);

    fetch('/api/skills/gap-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        occupationId: selectedOccId,
        userSkills: user?.skills || ['Hand Tool Handling', 'Basic Mechanical Repair']
      })
    })
      .then(res => res.json())
      .then(data => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Gap analysis error:', err);
        setLoading(false);
      });
  }, [selectedOccId, user]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">
                NSQF Qualification Architecture
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">National Occupational Standards (NOS)</span>
            </div>
            <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-600" />
              <span>कौशल्य अंतर विश्लेषण / Skill Gap Analysis</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              तुमची सध्याची क्षमता आणि लक्ष्य नोकरीसाठी आवश्यक कौशल्यांमधील फरक तपासा.
            </p>
          </div>

          <Link
            to="/simulator"
            className="px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold hover:bg-gov-navy-light flex items-center space-x-1 shadow"
          >
            <TrendingUp className="w-3.5 h-3.5 text-gov-saffron" />
            <span>'काय होईल जर?' सिम्युलेटर पहा</span>
          </Link>
        </div>

        {/* Target Occupation Selector */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            लक्ष्य व्यवसाय / Target Livelihood Role निवडा:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {occupations.map(occ => {
              const isSelected = occ.id === selectedOccId;
              const occTitle = lang === 'mr' ? (occ.title_mr || occ.title) : (lang === 'hi' ? (occ.title_hi || occ.title) : occ.title);
              return (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccId(occ.id)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-extrabold text-gov-navy">{occ.nsqf_level}</span>
                      <span className="text-[10px] text-slate-500">{occ.sector}</span>
                    </div>
                    <div className="font-bold text-xs text-slate-900 mt-1">{occTitle}</div>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-2">
                    {occ.estimated_livelihood}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Analysis Results */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500">
            कौशल्य अंतर विश्लेषण गणना होत आहे...
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            {/* Match Percentage Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    कौशल्य जुळणी प्रमाण / Skill Alignment Score
                  </div>
                  <h3 className="text-xl font-extrabold text-gov-navy mt-1">
                    {lang === 'mr' ? (analysis.occupation.title_mr || analysis.occupation.title) : analysis.occupation.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-xl">
                    {lang === 'mr' ? (analysis.occupation.description_mr || analysis.occupation.description) : analysis.occupation.description}
                  </p>
                </div>

                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-emerald-500 bg-emerald-50 flex flex-col items-center justify-center text-center shadow-inner">
                    <span className="text-2xl font-black text-emerald-800">{analysis.matchPercentage}%</span>
                    <span className="text-[10px] font-bold text-emerald-700">जुळणी</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 font-semibold">
                    {analysis.matchedSkills.length} of {analysis.occupation.required_skills.length} skills present
                  </span>
                </div>
              </div>

              {/* Two columns: You Have vs You Need */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                {/* Skills You Have */}
                <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>तुमच्याकडे आधीच असलेली कौशल्ये ({analysis.matchedSkills.length}):</span>
                  </div>
                  {analysis.matchedSkills.length === 0 ? (
                    <p className="text-xs text-slate-500">कोणतेही प्राथमिक कौशल्य आढळले नाही.</p>
                  ) : (
                    analysis.matchedSkills.map((skill, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs font-medium text-emerald-950 bg-white p-2 rounded border border-emerald-100">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{skill}</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Skills You Need */}
                <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>आवश्यक नवीन कौशल्ये (Skill Gaps) ({analysis.missingSkills.length}):</span>
                  </div>
                  {analysis.missingSkills.length === 0 ? (
                    <p className="text-xs text-emerald-800 font-bold">उत्कृष्ट! तुम्ही या भूमिकेसाठी पूर्णपणे तयार आहात.</p>
                  ) : (
                    analysis.missingSkills.map((skill, i) => (
                      <div key={i} className="flex items-center space-x-2 text-xs font-medium text-amber-950 bg-white p-2 rounded border border-amber-100">
                        <span className="text-amber-600 font-bold">○</span>
                        <span>{skill}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Training Center Card */}
            {analysis.recommendedTraining && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-gov-navy" />
                    <div>
                      <h4 className="text-sm font-extrabold text-gov-navy">
                        शिफारस केलेले विनामूल्य प्रशिक्षण / Recommended Sponsored Training
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        हे अंतर भरून काढण्यासाठी PM-AJAY अंतर्गत स्थानिक प्रशिक्षण केंद्र
                      </p>
                    </div>
                  </div>

                  <span className="bg-gov-navy text-white text-[11px] font-bold px-2.5 py-1 rounded">
                    PM-AJAY 100% Sponsored
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900">
                        {lang === 'mr' ? (analysis.recommendedTraining.title_mr || analysis.recommendedTraining.title) : analysis.recommendedTraining.title}
                      </h5>
                      <span className="text-xs text-slate-600 font-medium">
                        {analysis.recommendedTraining.provider} &bull; {analysis.recommendedTraining.location}
                      </span>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded border border-emerald-300">
                      अंतर: {analysis.recommendedTraining.distance_km} किमी
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 bg-white p-2.5 rounded border border-slate-100">
                    <div>कालावधी: <strong>{analysis.recommendedTraining.duration}</strong></div>
                    <div>स्वरुप: <strong>{analysis.recommendedTraining.mode}</strong></div>
                    <div>शुल्क: <strong className="text-emerald-700">विनामूल्य + विद्यावेतन</strong></div>
                    <div>पुढील तुकडी: <strong>{analysis.recommendedTraining.next_batch}</strong></div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-600">
                      प्रमाणपत्र: <strong>{analysis.recommendedTraining.certification}</strong>
                    </span>

                    <button
                      onClick={() => navigate(`/apply?type=training&id=${analysis.recommendedTraining.id}`)}
                      className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-lg shadow transition flex items-center space-x-1"
                    >
                      <span>प्रशिक्षणासाठी अर्ज करा</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
