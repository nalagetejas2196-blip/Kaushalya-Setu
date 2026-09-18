import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  BookOpen,
  Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CareerSimulator() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [occupations, setOccupations] = useState([]);
  const [occAId, setOccAId] = useState('occ-solar-tech');
  const [occBId, setOccBId] = useState('occ-pump-tech');
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skills/occupations')
      .then(res => res.json())
      .then(data => {
        setOccupations(data);
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  const runSimulation = () => {
    setLoading(true);
    fetch('/api/skills/simulate-pathway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        occupationAId: occAId,
        occupationBId: occBId,
        userSkills: user?.skills || ['Hand Tool Handling', 'Basic Mechanical Repair']
      })
    })
      .then(res => res.json())
      .then(data => {
        setSimulation(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Simulation error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    runSimulation();
  }, [occAId, occBId, user]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded border border-purple-200">
              Interactive Decision Support
            </span>
            <span className="text-slate-400 text-xs">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">PM-AJAY Predictive Navigation</span>
          </div>

          <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
            <Scale className="w-6 h-6 text-purple-600" />
            <span>'काय होईल जर?' करिअर सिम्युलेटर / "What If?" Career Simulator</span>
          </h2>

          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            दोन भिन्न कौशल्य मार्गांची तुलना करा: कोणत्या मार्गात कमी वेळेत प्रशिक्षण पूर्ण होते आणि तुमच्या तालुक्यात जास्त स्थानिक संधी उपलब्ध आहेत?
          </p>
        </div>

        {/* Selection Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gov-navy mb-1.5">
              करिअर मार्ग अ (Pathway A):
            </label>
            <select
              value={occAId}
              onChange={(e) => setOccAId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:outline-none"
            >
              {occupations.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gov-navy mb-1.5">
              करिअर मार्ग ब (Pathway B):
            </label>
            <select
              value={occBId}
              onChange={(e) => setOccBId(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:outline-none"
            >
              {occupations.map(o => (
                <option key={o.id} value={o.id}>{o.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Simulation Comparison Results */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500">
            सिम्युलेशन डेटाची तुलना केली जात आहे...
          </div>
        ) : simulation ? (
          <div className="space-y-6">
            {/* AI Recommendation Banner */}
            <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white p-4 rounded-xl border border-purple-500/40 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gov-saffron flex items-center justify-center font-bold text-black flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gov-saffron uppercase tracking-wider">
                    AI विश्लेषण शिफारस / Recommendation Insight
                  </span>
                  <p className="text-xs sm:text-sm font-semibold mt-0.5">
                    {simulation.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* Side by Side Comparative Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pathway A */}
              <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      PATHWAY A &bull; {simulation.pathwayA.occupation.nsqf_level}
                    </span>
                    <h3 className="font-extrabold text-base text-gov-navy mt-1">
                      {simulation.pathwayA.occupation.title}
                    </h3>
                    <span className="text-xs text-slate-500">{simulation.pathwayA.occupation.sector}</span>
                  </div>

                  <div className="text-center bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                    <span className="text-xl font-black text-blue-800">{simulation.pathwayA.matchPercentage}%</span>
                    <div className="text-[10px] font-bold text-slate-600">सध्याची जुळणी</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-600">अपेक्षित उपजीविका:</span>
                    <strong className="text-slate-900">{simulation.pathwayA.occupation.estimated_livelihood}</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-600">स्थानिक उपलब्ध संधी:</span>
                    <strong className="text-emerald-700">{simulation.pathwayA.nearbyOpportunitiesCount} सक्रिय संधी</strong>
                  </div>
                </div>

                {/* Skills possessed vs needed */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      उपलब्ध कौशल्ये ({simulation.pathwayA.matchedSkills.length}):
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {simulation.pathwayA.matchedSkills.join(', ') || 'प्राथमिक पायाभूत स्तर'}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      नवीन आवश्यक कौशल्ये ({simulation.pathwayA.missingSkills.length}):
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {simulation.pathwayA.missingSkills.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Training Link */}
                {simulation.pathwayA.training && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800">
                      {simulation.pathwayA.training.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {simulation.pathwayA.training.provider} ({simulation.pathwayA.training.duration})
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/opportunities')}
                  className="w-full py-2 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition"
                >
                  मार्ग अ च्या संधी पहा &rarr;
                </button>
              </div>

              {/* Pathway B */}
              <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      PATHWAY B &bull; {simulation.pathwayB.occupation.nsqf_level}
                    </span>
                    <h3 className="font-extrabold text-base text-gov-navy mt-1">
                      {simulation.pathwayB.occupation.title}
                    </h3>
                    <span className="text-xs text-slate-500">{simulation.pathwayB.occupation.sector}</span>
                  </div>

                  <div className="text-center bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    <span className="text-xl font-black text-emerald-800">{simulation.pathwayB.matchPercentage}%</span>
                    <div className="text-[10px] font-bold text-slate-600">सध्याची जुळणी</div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-600">अपेक्षित उपजीविका:</span>
                    <strong className="text-slate-900">{simulation.pathwayB.occupation.estimated_livelihood}</strong>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                    <span className="text-slate-600">स्थानिक उपलब्ध संधी:</span>
                    <strong className="text-emerald-700">{simulation.pathwayB.nearbyOpportunitiesCount} सक्रिय संधी</strong>
                  </div>
                </div>

                {/* Skills possessed vs needed */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      उपलब्ध कौशल्ये ({simulation.pathwayB.matchedSkills.length}):
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {simulation.pathwayB.matchedSkills.join(', ') || 'प्राथमिक पायाभूत स्तर'}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      नवीन आवश्यक कौशल्ये ({simulation.pathwayB.missingSkills.length}):
                    </span>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {simulation.pathwayB.missingSkills.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Training Link */}
                {simulation.pathwayB.training && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800">
                      {simulation.pathwayB.training.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {simulation.pathwayB.training.provider} ({simulation.pathwayB.training.duration})
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/opportunities')}
                  className="w-full py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg hover:bg-emerald-800 transition"
                >
                  मार्ग ब च्या संधी पहा &rarr;
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-center text-[10px] text-slate-500">
              * प्रात्यक्षिक सिम्युलेशन: उत्पन्न व संधींची संख्या स्थानिक क्लस्टर डेटावर आधारित अंदाजित आहे. नोकरीची कायदेशीर हमी दिली जात नाही.
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
