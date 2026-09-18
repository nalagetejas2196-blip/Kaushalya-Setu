import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Compass,
  FileCheck,
  Briefcase,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Mic,
  MapPin,
  TrendingUp,
  Award,
  Users,
  Search,
  ChevronRight,
  Layers,
  HelpCircle
} from 'lucide-react';

export default function Home({ onOpenVoice }) {
  const { lang, t } = useLanguage();
  const { user, loginDemo, isBeneficiary } = useAuth();
  const navigate = useNavigate();

  const handleQuickBeneficiary = async () => {
    await loginDemo('beneficiary');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Official Hero / Banner Section */}
      <section className="bg-gradient-to-b from-[#0B3C5D] to-[#062338] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-gov-saffron relative overflow-hidden">
        {/* Subtle background national motif */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center space-x-2 bg-gov-saffron/20 border border-gov-saffron/40 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-gov-saffron" />
              <span>{t('hero_badge')}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {t('hero_title')}
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-2xl">
              {t('hero_desc')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleQuickBeneficiary}
                className="px-5 py-3 rounded-lg bg-gov-saffron hover:bg-amber-400 text-slate-900 font-extrabold text-sm shadow-lg transition flex items-center space-x-2 active:scale-95"
              >
                <span>{user ? t('nav_dashboard') : 'प्रवेश करा / Enter as Beneficiary'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenVoice}
                className="px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm transition flex items-center space-x-2"
              >
                <Mic className="w-4 h-4 text-gov-saffron" />
                <span>{t('action_voice_help')}</span>
              </button>

              <Link
                to="/opportunities"
                className="px-4 py-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-600 text-slate-200 text-sm font-semibold transition"
              >
                {t('action_find_opps')}
              </Link>
            </div>

            {/* Key Trust Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Middlemen / थेट लाभ</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>NSQF Level 3/4 Aligned</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>PM-AJAY Capital Subsidy</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>100% Free SC Training</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Official PM-AJAY Framing Card */}
          <div className="lg:col-span-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-xs font-bold text-gov-saffron uppercase tracking-wider">
                  PM-AJAY Livelihood Cell
                </span>
                <span className="bg-emerald-500/30 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-400/40">
                  ACTIVE 2026
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="font-bold text-white text-sm">₹50,000 पर्यंत थेट अनुदान</div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    अनुसूचित जाती प्रवर्गातील ग्रामीण युवकांच्या सूक्ष्म उद्योगांसाठी ५०% किंवा ₹५०,००० पर्यंत भांडवली अनुदान.
                  </p>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                  <div className="font-bold text-white text-sm">₹1,500 दरमहा विद्यावेतन</div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    आयटीआय आणि केव्हीके केंद्रांवर कौशल्य प्रशिक्षणादरम्यान थेट बँक खात्यात (DBT) विद्यावेतन.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/schemes"
                  className="w-full block py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center rounded transition"
                >
                  योजना पात्रता तपासा / Check Eligibility &rarr;
                </Link>
              </div>

              <p className="text-[10px] text-slate-400 text-center italic">
                Ref: Ministry of Social Justice & Empowerment, GoI Guidelines
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 border-r last:border-r-0 border-slate-200">
            <div className="text-2xl sm:text-3xl font-black text-gov-navy">5,200+</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">SC Beneficiaries Mapped</div>
          </div>
          <div className="p-3 border-r last:border-r-0 border-slate-200">
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">₹4.8 Cr</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">PM-AJAY Grants Disbursed</div>
          </div>
          <div className="p-3 border-r last:border-r-0 border-slate-200">
            <div className="text-2xl sm:text-3xl font-black text-gov-saffron-dark">120+</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">NSQF Training Centers</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-black text-blue-600">89%</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">Direct Verification Success</div>
          </div>
        </div>
      </section>

      {/* 3. Core Citizen Service Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h3 className="text-xl sm:text-2xl font-extrabold text-gov-navy">
            प्रमुख नागरिक सेवा / Key Citizen Services
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            नोंदणीपासून स्थानिक रोजगारापर्यंत सर्व सेवा एकाच ठिकाणी उपलब्ध
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Skill Discovery */}
          <Link
            to="/skills"
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-saffron transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-amber-100 text-gov-saffron-dark flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gov-navy mb-1">
                कौशल्य शोध / AI Skill Discovery
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                आपल्या रोजच्या कामाच्या अनुभवातून संभाव्य कौशल्ये ओळखा व डिजिटल स्किल ट्विन तयार करा.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-gov-saffron-dark">
              <span>सुरुवात करा</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 2: Skill Gap Analysis */}
          <Link
            to="/skill-gap"
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-saffron transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gov-navy mb-1">
                कौशल्य अंतर / Gap Analysis
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                सोलर, पंप मेकॅनिक किंवा इलेक्ट्रीशियन पदासाठी कोणती नवीन कौशल्ये आवश्यक आहेत ते तपासा.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
              <span>अंतर तपासा</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 3: What If Simulator */}
          <Link
            to="/simulator"
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-saffron transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gov-navy mb-1">
                'काय होईल जर?' सिम्युलेटर
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                दोन करिअर मार्गांची तुलना करा (उदा. सोलर विरुद्ध ॲग्रो-मेकॅनिक) आणि योग्य पर्याय निवडा.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>तुलना करा</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          {/* Card 4: Schemes & Opportunities */}
          <Link
            to="/opportunities"
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-gov-saffron transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-gov-navy mb-1">
                स्थानिक संधी / Local Jobs & Training
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                तुमच्या गावाजवळ (५ ते २५ किमी अंतरावर) उपलब्ध असलेल्या अप्रेंटिसशिप आणि नोकऱ्या शोधा.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>संधी पहा</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Interactive Beneficiary Journey (The 8-Step Pathway) */}
      <section className="bg-slate-100 py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-gov-saffron-dark uppercase tracking-wider">
              पारदर्शक नागरिक मार्गक्रमण
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gov-navy mt-1">
              कौशल्याकडून उपजीविकेकडे: संपूर्ण प्रवास
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto">
              मध्यस्थांशिवाय, वेळेची बचत आणि थेट शासकीय अधिकारी पडताळणी
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
            {[
              { step: "१", title: "शोध व नोंदणी", desc: "मोबाईल व ओटीपी द्वारे प्रोफाइल", path: "/register" },
              { step: "२", title: "कौशल्य ओळख", desc: "संभाषणात्मक AI द्वारे क्षमता", path: "/skills" },
              { step: "३", title: "अंतर विश्लेषण", desc: "NSQF आवश्यकतांशी तुलना", path: "/skill-gap" },
              { step: "४", title: "मोफत प्रशिक्षण", desc: "आयटीआय / केव्हीके तुकडी", path: "/opportunities" },
              { step: "५", title: "योजना अनुदान", desc: "PM-AJAY थेट भांडवल", path: "/schemes" },
              { step: "६", title: "स्थानिक संधी", desc: "नजीकच्या नोकऱ्या व उद्योग", path: "/opportunities" },
              { step: "७", title: "कागदपत्र पडताळणी", desc: "जिल्हा समाजकल्याण अधिकारी", path: "/officer" },
              { step: "८", title: "शाश्वत उपजीविका", desc: "स्वयंपूर्ण आर्थिक यश", path: "/dashboard" }
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs hover:border-gov-navy transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 mx-auto rounded-full bg-gov-navy text-gov-saffron font-black text-xs flex items-center justify-center mb-2">
                    {item.step}
                  </div>
                  <div className="font-bold text-xs text-slate-800">{item.title}</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Voice-First Accessibility Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-gov-navy to-slate-900 rounded-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-gov-saffron/30">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-amber-500/20 px-3 py-1 rounded-full text-xs text-amber-300 font-semibold">
              <Mic className="w-3.5 h-3.5 text-gov-saffron" />
              <span>डिजिटल साक्षरतेची अडचण नाही</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-extrabold leading-tight">
              फक्त बोला — कौशल्य सहायक तुम्हाला संपूर्ण मार्गदर्शन करेल
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              मराठी, हिंदी किंवा इंग्रजीत बोला: "माझ्यासाठी कोणत्या योजना आहेत?", "माझ्या जवळ नोकरी कुठे आहे?" किंवा "माझ्या अर्जाची स्थिती काय आहे?".
            </p>
          </div>

          <button
            onClick={onOpenVoice}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-gov-saffron to-amber-500 text-slate-950 font-black text-sm shadow-lg hover:shadow-xl hover:scale-105 transition flex items-center space-x-2 flex-shrink-0"
          >
            <Mic className="w-5 h-5 text-black" />
            <span>आता बोलून प्रश्न विचारा</span>
          </button>
        </div>
      </section>
    </div>
  );
}
