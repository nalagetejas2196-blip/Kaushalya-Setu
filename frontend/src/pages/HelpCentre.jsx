import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  HelpCircle,
  PhoneCall,
  MapPin,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Mic,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function HelpCentre({ onOpenVoice }) {
  const { lang, t } = useLanguage();

  const [openFaq, setOpenFaq] = useState(0);
  const [grievanceText, setGrievanceText] = useState('');
  const [ticketId, setTicketId] = useState(null);

  const faqs = [
    {
      q: 'पीएम-अजय (PM-AJAY) अंतर्गत कोणत्या योजना व लाभ मिळतात?',
      q_en: 'What benefits are available under PM-AJAY?',
      a: 'पीएम-अजय अंतर्गत अनुसूचित जाती (SC) प्रवर्गातील ग्रामीण व वंचित नागरिकांसाठी सूक्ष्म उपजीविका प्रकल्पांसाठी ₹५०,००० पर्यंत ५०% थेट भांडवली अनुदान, मोफत एनएसक्यूएफ-संरेखित तांत्रिक कौशल्य प्रशिक्षण आणि दरमहा ₹१,५०० थेट विद्यावेतन (DBT) दिले जाते.'
    },
    {
      q: 'कौशल्य शोध (AI Skill Discovery) कसे काम करते?',
      q_en: 'How does AI Skill Discovery work?',
      a: 'तुम्हाला कोणत्याही तांत्रिक परीक्षा देण्याची गरज नाही. तुम्ही शेतात, घरात किंवा गॅरेजमध्ये जे काम करता (उदा. पाण्याचे पंप दुरुस्त करणे, ट्रॅक्टर सर्व्हिसिंग, शिवणकाम) ते साध्या भाषेत सांगा. आमची प्रणाली त्यातून राष्ट्रीय स्तरावरील कौशल्य घटक (NSQF) आपोआप ओळखते.'
    },
    {
      q: 'माझ्याकडे सर्व कागदपत्रे उपलब्ध नसल्यास काय करावे?',
      q_en: 'What if some documents are currently missing?',
      a: 'तुम्ही प्राथमिक अर्ज सादर करू शकता. डिजिटल लॉकरमध्ये कागदपत्रे प्रलंबित दाखवली जातील. जिल्हा समाजकल्याण अधिकारी तुम्हाला ऑनलाइन कागदपत्र दुरुस्ती किंवा जवळच्या शासकीय केंद्रावर (CSC) साक्षांकनाची संधी देतील.'
    },
    {
      q: 'अर्ज केल्यानंतर मंजुरीसाठी किती दिवस लागतात?',
      q_en: 'How long does application verification take?',
      a: 'अर्ज थेट तुमच्या तालुक्याच्या जिल्हा समाजकल्याण अधिकाऱ्यांकडे जातो. सामान्यतः ३ ते ७ कार्यालयीन दिवसांत कागदपत्र पडताळणी पूर्ण होऊन थेट एसएमएस व पोर्टलवर सूचना पाठवली जाते.'
    }
  ];

  const cscCenters = [
    {
      name: 'आपले सरकार सेवा केंद्र - संगमनेर शहर',
      operator: 'सचिन थोरात',
      location: 'नवीन बसस्थानकाजवळ, संगमनेर, अहिल्यानगर',
      phone: '02425-225010',
      timing: 'सकाळी ९:०० ते संध्याकाळी ६:३०'
    },
    {
      name: 'महा-ई-सेवा केंद्र - निमगाव जाळी',
      operator: 'प्रदीप कांबळे',
      location: 'ग्रामपंचायत संकुल, निमगाव जाळी, ता. संगमनेर',
      phone: '02425-248120',
      timing: 'सकाळी ९:३० ते संध्याकाळी ५:३०'
    },
    {
      name: 'CSC डिजिटल सेवा केंद्र - लोणी',
      operator: 'अशोक गायकवाड',
      location: 'प्रवरा नगर रोड, लोणी, ता. राहाता',
      phone: '02422-273415',
      timing: 'सकाळी ९:०० ते संध्याकाळी ७:००'
    }
  ];

  const handleGrievance = (e) => {
    e.preventDefault();
    if (!grievanceText.trim()) return;
    const generated = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generated);
    setGrievanceText('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-gov-navy text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">
                Citizen Assistance Desk
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">Grievance & FAQ Support</span>
            </div>
            <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-gov-saffron" />
              <span>मदत केंद्र व तक्रार निवारण / Help & Support Centre</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              वारंवार विचारले जाणारे प्रश्न, आपले सरकार सेवा केंद्र सूची आणि थेट आवाज मार्गदर्शन.
            </p>
          </div>

          <button
            onClick={onOpenVoice}
            className="px-4 py-2.5 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-xl shadow flex items-center space-x-2 transition"
          >
            <Mic className="w-4 h-4 text-gov-saffron" />
            <span>कौशल्य सहायक आवाज मदत</span>
          </button>
        </div>

        {/* 2 Columns: FAQs + CSC Locator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Col 1: FAQs (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileQuestion className="w-4 h-4 text-gov-saffron" />
              <span>वारंवार विचारले जाणारे प्रश्न (Frequently Asked Questions)</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left bg-slate-50 hover:bg-slate-100 font-bold text-xs text-gov-navy flex items-center justify-between gap-2"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 text-xs text-slate-700 bg-white border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 2: Nearby CSC Centers (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-4 h-4 text-emerald-600" />
              <span>नजीकचे आपले सरकार सेवा केंद्र (CSC Locator)</span>
            </h3>

            <p className="text-xs text-slate-600 leading-snug">
              अर्ज भरणे, कागदपत्रे स्कॅन करणे किंवा बायोमेट्रिक साक्षांकनासाठी खालील अधिकृत केंद्रांना भेट देऊ शकता:
            </p>

            <div className="space-y-3">
              {cscCenters.map((csc, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{csc.name}</div>
                  <div className="text-[11px] text-slate-600 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>{csc.location}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    चालक: <strong>{csc.operator}</strong> &bull; वेळ: {csc.timing}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Citizen Redressal & Help Ticket Simulation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-gov-saffron" />
            <span>अडचण नोंदवा / Grievance Redressal Ticket</span>
          </h3>

          {ticketId ? (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4" />
                <span>तुमची तक्रार यशस्वीरीत्या नोंदवली गेली आहे!</span>
              </div>
              <p>तक्रार निवारण संदर्भ क्रमांक: <strong>{ticketId}</strong></p>
              <p className="text-[11px] text-slate-600">
                जिल्हा समाजकल्याण कक्ष ४८ तासांच्या आत आपल्या नोंदणीकृत मोबाईलवर संपर्क करेल.
              </p>
            </div>
          ) : (
            <form onSubmit={handleGrievance} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                योजना, प्रशिक्षण किंवा अर्जाबाबत कोणती अडचण आहे?
              </label>
              <textarea
                rows={3}
                required
                value={grievanceText}
                onChange={(e) => setGrievanceText(e.target.value)}
                placeholder="आपली अडचण साध्या भाषेत येथे लिहा..."
                className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
              ></textarea>

              <button
                type="submit"
                className="px-5 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-navy-light transition flex items-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5 text-gov-saffron" />
                <span>तक्रार सादर करा / Submit Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
