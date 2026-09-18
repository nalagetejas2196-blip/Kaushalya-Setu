import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Edit2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SkillDiscovery() {
  const { user, updateUser } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [inputStory, setInputStory] = useState(
    'मी माझ्या वडिलांना शेतातील पाण्याचे पंप, सबमर्सिबल मोटार आणि ट्रॅक्टर दुरुस्त करायला मदत करतो. पाईपलाईन फिटिंग आणि स्टार्टर पॅनेलचे कामही करतो.'
  );
  const [extractedSkills, setExtractedSkills] = useState(user?.skills || []);
  const [loading, setLoading] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [saveFeedback, setSaveFeedback] = useState('');

  const sampleConversations = [
    {
      title: 'Agro-Machinery & Pump Repair',
      text: 'मी शेतातील पाणी उपसण्याचे पंप, मोटार आणि पाईपलाईन दुरुस्त करतो. स्टार्टर पॅनेल आणि पाना-पकड वापरून काम करतो.'
    },
    {
      title: 'Solar & Electrical Wiring',
      text: 'I know household wiring, circuit testers, MCB switches, and I helped install small solar panels on rooftops.'
    },
    {
      title: 'Garment Stitching & Tailoring',
      text: 'मला शिलाई मशीनवर कपडे शिवणे, कटिंग करणे आणि लहान व्यवसाय चालवण्याची आवड आहे.'
    },
    {
      title: 'Computer & Digital Data Entry',
      text: 'मी १२ वी पास आहे, एमएस-सीआयटी पूर्ण केले आहे आणि कॉम्प्युटरवर टायपिंग व शासकीय फॉर्म भरण्याचे काम करतो.'
    }
  ];

  const handleExtract = async () => {
    if (!inputStory.trim()) return;
    setLoading(true);
    setSaveFeedback('');

    try {
      const res = await fetch('/api/skills/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputStory })
      });
      const data = await res.json();
      if (res.ok) {
        setExtractedSkills(data.extractedSkills || []);
      }
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAll = async () => {
    setLoading(true);
    const updated = await updateUser({
      skills: extractedSkills,
      profile_completion: Math.min(95, (user?.profile_completion || 70) + 15)
    });
    setLoading(false);
    setSaveFeedback('तुमची कौशल्ये डिजिटल प्रोफाइलमध्ये यशस्वीरीत्या जतन केली आहेत!');
    setTimeout(() => {
      navigate('/skill-gap');
    }, 1500);
  };

  const handleRemoveSkill = (index) => {
    setExtractedSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCustom = () => {
    if (!newSkillName.trim()) return;
    const newSkill = {
      name: newSkillName.trim(),
      level: 75,
      category: 'General Technical',
      nsqf_pack: 'Level 3 Candidate',
      rationale: 'Manually added by citizen to digital skill twin.',
      confirmed: true
    };
    setExtractedSkills(prev => [...prev, newSkill]);
    setNewSkillName('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-gov-saffron-dark text-[11px] font-bold px-2 py-0.5 rounded border border-amber-200">
              AI-Powered Livelihood Assessment
            </span>
            <span className="text-slate-400 text-xs">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">PM-AJAY / GIA Framework</span>
          </div>

          <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-gov-saffron" />
            <span>संभाषणात्मक कौशल्य शोध / AI Skill Discovery</span>
          </h2>

          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            तांत्रिक व्याख्यांची गरज नाही! तुम्ही घरच्या किंवा शेतीच्या कामात जे करता ते साध्या भाषेत सांगा. आमची AI प्रणाली त्यातून तुमची कौशल्ये ओळखून राष्ट्रीय कौशल्य प्रमाणपत्रांशी (NSQF) जोडेल.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <label className="block text-xs font-bold text-slate-700">
            आपण कोणती कामे किंवा अवजारे हाताळता ते येथे सांगा / Describe your practical experience:
          </label>

          <textarea
            rows={4}
            value={inputStory}
            onChange={(e) => setInputStory(e.target.value)}
            placeholder="उदा. मी शेतातील पाणी उपसण्याचे पंप दुरुस्त करतो, वायर जोडतो आणि अवजारे वापरतो..."
            className="w-full p-3 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-gov-navy focus:outline-none leading-relaxed"
          ></textarea>

          {/* Quick Evaluator Samples */}
          <div>
            <div className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-gov-saffron" />
              <span>द्रुत चाचणीसाठी नमुना वाक्ये निवडा / Quick Demo Prompts:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleConversations.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputStory(sample.text)}
                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-2.5 py-1 rounded-lg border border-slate-200 transition text-left"
                >
                  &bull; {sample.title}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleExtract}
              disabled={loading || !inputStory.trim()}
              className="px-5 py-2.5 rounded-lg bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs shadow transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-gov-saffron" />
              <span>{loading ? 'कौशल्य ओळखत आहे...' : 'कौशल्य ओळखा / Extract Skills'}</span>
            </button>

            <span className="text-[11px] text-slate-500 italic">
              मराठी, हिंदी आणि इंग्रजी भाषेत कार्यक्षम
            </span>
          </div>
        </div>

        {/* Extracted Skills Section */}
        {extractedSkills.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-gov-navy flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>तुमच्या वर्णनातून ओळखलेली कौशल्ये ({extractedSkills.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  खालील कौशल्यांची खात्री करा किंवा गरज असल्यास संपादन करा
                </p>
              </div>

              <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded border border-emerald-200">
                NSQF Level 3/4 Aligned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {extractedSkills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gov-navy">
                          {lang === 'mr' ? (skill.name_mr || skill.name) : skill.name}
                        </h4>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {skill.category || 'Agro-Mechanics'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveSkill(index)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition"
                        title="कौशल्य काढून टाका"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 bg-white/70 p-2 rounded border border-slate-100 leading-snug">
                      <strong>कारण (Why this?):</strong> {skill.rationale || 'व्यावहारिक अनुभवावरून ओळखले.'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>अंदाजित क्षमता:</span>
                      <span className="text-emerald-700 font-bold">{skill.level || 75}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${skill.level || 75}%` }}
                      ></div>
                    </div>
                    <span className="block mt-1 text-[10px] text-slate-500 font-medium">
                      मानक: {skill.nsqf_pack || 'NSQF Level 3'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Skill Row */}
            <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
              <input
                type="text"
                placeholder="इतर कोणते कौशल्य जोडायचे आहे का? (Type custom skill)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
              />
              <button
                onClick={handleAddCustom}
                disabled={!newSkillName.trim()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>जोडा</span>
              </button>
            </div>

            {/* Confirm & Save Button */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium">
                खात्री केल्यानंतर ही कौशल्ये तुमच्या डिजिटल स्किल प्रोफाइलमध्ये साठवली जातील.
              </span>

              <button
                onClick={handleConfirmAll}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>कौशल्ये निश्चित करा आणि अंतर विश्लेषण पहा &rarr;</span>
              </button>
            </div>

            {saveFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-lg text-center">
                {saveFeedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
