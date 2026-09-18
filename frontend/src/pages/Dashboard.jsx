import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Compass,
  FileCheck,
  Briefcase,
  BookOpen,
  Award,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetch(`/api/applications/my/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setMyApplications(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch my apps error:', err);
        setLoading(false);
      });
  }, [user, navigate]);

  if (!user) return null;

  const displayName = lang === 'mr' ? (user.name_mr || user.name) : (lang === 'hi' ? (user.name_hi || user.name) : user.name);

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Beneficiary Welcome Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-gov-navy text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">
                SC Beneficiary &bull; PM-AJAY Cell
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">
                {user.village}, {user.taluka}, {user.district}
              </span>
            </div>
            <h2 className="text-2xl font-black text-gov-navy mt-1">
              {t('welcome')}, {displayName}!
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              कौशल्य सेतू उपजीविका डॅशबोर्डवर आपले स्वागत आहे. येथे आपल्या कौशल्य विकासाचा आणि अनुदानाचा मागोवा घ्या.
            </p>
          </div>

          {/* Profile Completion Widget */}
          <div className="w-full md:w-64 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-700">{t('profile_completion')}</span>
              <span className="font-extrabold text-gov-navy">{user.profile_completion || 85}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gov-saffron h-2 rounded-full transition-all duration-500"
                style={{ width: `${user.profile_completion || 85}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
              <span>वर्ग: <strong className="text-slate-800">{user.category}</strong></span>
              <span>शिक्षण: <strong className="text-slate-800">{user.education}</strong></span>
            </div>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/skills"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-saffron transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{t('skills_identified')}</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-gov-saffron-dark flex items-center justify-center font-bold">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-gov-navy mt-2">
              {user.skills?.length || 4}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> NSQF Mapped
            </span>
          </Link>

          <Link
            to="/schemes"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-saffron transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{t('recommended_schemes')}</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-blue-700 mt-2">
              3
            </div>
            <span className="text-[11px] text-blue-700 font-semibold mt-1">
              PM-AJAY & NSFDC
            </span>
          </Link>

          <Link
            to="/opportunities"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-saffron transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{t('nearby_opportunities')}</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2">
              4
            </div>
            <span className="text-[11px] text-slate-500 mt-1">
              Within 25 km of village
            </span>
          </Link>

          <Link
            to="/track"
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-gov-saffron transition flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{t('applications_in_progress')}</span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-purple-700 mt-2">
              {myApplications.length > 0 ? myApplications.length : 1}
            </div>
            <span className="text-[11px] text-amber-700 font-semibold mt-1">
              Under Verification
            </span>
          </Link>
        </div>

        {/* Visual Livelihood Journey Bar */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-gov-navy">
                माझा उपजीविका प्रवास / My Livelihood Roadmap
              </h3>
              <p className="text-[11px] text-slate-500">
                प्रत्येक टप्पा पूर्ण करून थेट रोजगार व अनुदानापर्यंत पोहोचा
              </p>
            </div>
            <Link to="/skills" className="text-xs font-bold text-gov-navy hover:underline flex items-center gap-1">
              <span>कौशल्य अद्ययावत करा</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { label: "1. प्रोफाइल", done: true },
              { label: "2. कौशल्य शोध", done: true },
              { label: "3. अंतर विश्लेषण", done: true },
              { label: "4. प्रशिक्षण निवड", done: true },
              { label: "5. योजना पात्रता", done: true },
              { label: "6. संधी निवड", done: true },
              { label: "7. अर्ज व पडताळणी", current: true },
              { label: "8. उपजीविका यश", upcoming: true }
            ].map((step, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-lg border text-center text-xs font-bold flex flex-col justify-center items-center ${
                  step.done
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : (step.current
                        ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 text-slate-400')
                }`}
              >
                <div className="text-sm mb-0.5">
                  {step.done ? '✓' : (step.current ? '⏳' : '○')}
                </div>
                <div className="text-[11px] leading-tight">{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Col (8 cols): Digital Skill Twin & Application Card */}
          <div className="lg:col-span-8 space-y-6">
            {/* Digital Skill Twin Preview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-amber-100 text-gov-saffron-dark flex items-center justify-center font-bold">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gov-navy">
                      माझे डिजिटल कौशल्य प्रोफाइल / Digital Skill Twin
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      प्रायोगिक कामातून आणि कौटुंबिक अनुभवातून शोधलेली कौशल्ये
                    </p>
                  </div>
                </div>

                <Link
                  to="/skills"
                  className="text-xs font-bold px-3 py-1.5 rounded bg-gov-navy text-white hover:bg-gov-navy-light transition"
                >
                  संभाषणात्मक चाचणी घ्या &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {(user.skills || []).map((skill, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">{skill.name}</span>
                      <span className="text-[11px] font-bold text-gov-navy">{skill.level}% क्षमता</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div
                        className="bg-emerald-600 h-1.5 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                      <span>स्रोत: {skill.source || 'AI संभाषणात्मक शोध'}</span>
                      {skill.verified && (
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> पडताळणीकृत (Verified)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Progress Application Tracker Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gov-navy">
                      सध्याचा अर्ज / Active Application
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      थेट जिल्हा समाजकल्याण अधिकारी पडताळणी कक्षाशी जोडलेला
                    </p>
                  </div>
                </div>

                <Link
                  to="/track"
                  className="text-xs font-bold text-gov-navy hover:underline"
                >
                  तपशीलवार मागोवा &rarr;
                </Link>
              </div>

              {myApplications.length > 0 ? (
                myApplications.map(app => (
                  <div key={app.id} className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-black text-slate-700">अर्ज क्र: {app.id}</span>
                        <h5 className="font-bold text-sm text-gov-navy">{app.target_title}</h5>
                        <span className="text-xs text-slate-600">{app.target_org}</span>
                      </div>
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-2.5 py-1 rounded text-xs">
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded border border-amber-100">
                      <strong>अधिकारी शेरा:</strong> {app.status_notes}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>अधिकारी: <strong>{app.assigned_officer_name}</strong></span>
                      <Link
                        to={`/track?id=${app.id}`}
                        className="text-gov-navy font-bold hover:underline flex items-center gap-1"
                      >
                        <span>मागोवा पहा</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  कोणताही अर्ज आढळला नाही. संधी निवडून त्वरित अर्ज करा.
                </div>
              )}
            </div>
          </div>

          {/* Right Col (4 cols): Quick Navigator Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-gradient-to-br from-gov-navy to-[#062338] rounded-2xl p-5 text-white shadow-sm space-y-4">
              <h4 className="font-extrabold text-sm text-gov-saffron uppercase tracking-wider">
                शिफारस केलेल्या कृती / Recommended Actions
              </h4>

              <div className="space-y-2.5 text-xs">
                <Link
                  to="/skill-gap"
                  className="block p-3 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/10"
                >
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>सोलर पीव्ही अंतर विश्लेषण</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    तुमच्या अनुभवानुसार सोलर तंत्रज्ञ होण्यासाठी १ कौशल्य आवश्यक.
                  </p>
                </Link>

                <Link
                  to="/simulator"
                  className="block p-3 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/10"
                >
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>'काय होईल जर?' सिम्युलेटर</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    सोलर विरुद्ध कृषी पंप तंत्रज्ञ करिअर मार्गांची तुलना करा.
                  </p>
                </Link>

                <Link
                  to="/schemes"
                  className="block p-3 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/10"
                >
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>PM-AJAY योजना पात्रता</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    ₹५०,००० अनुदानासाठी तुमची पात्रता त्वरित तपासा.
                  </p>
                </Link>
              </div>
            </div>

            {/* Nearby PM-AJAY Training Center Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-gov-navy font-bold text-sm">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>नजीकचे प्रशिक्षण केंद्र</span>
              </div>
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 space-y-1">
                <div className="font-bold text-emerald-900 text-xs">
                  शासकीय औद्योगिक प्रशिक्षण संस्था (ITI) संगमनेर
                </div>
                <div className="text-[11px] text-slate-600">
                  अंतर: <strong>१२ किमी</strong> &bull; बॅच: १० ऑक्टोबर २०२६
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold">
                  ✓ PM-AJAY अंतर्गत १००% मोफत + दरमहा ₹१,५०० भत्ता
                </div>
              </div>

              <Link
                to="/opportunities"
                className="w-full block py-2 bg-slate-100 hover:bg-slate-200 text-gov-navy font-bold text-center rounded transition"
              >
                नकाशावर केंद्र पहा &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
