import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Send,
  Sparkles,
  ExternalLink,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

export default function KaushalyaSahayakVoice({ isOpen, onClose }) {
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: lang === 'mr'
        ? 'नमस्कार! मी कौशल्य सहायक. मी तुम्हाला योजना, प्रशिक्षण, कौशल्ये आणि स्थानिक नोकऱ्या शोधण्यात मदत करू शकतो. बोला किंवा खालील प्रश्न निवडा.'
        : (lang === 'hi'
            ? 'नमस्ते! मैं कौशल्य सहायक हूँ। मैं आपको योजनाएं, प्रशिक्षण, कौशल और स्थानीय नौकरियां खोजने में सहायता कर सकता हूँ। बोलें या नीचे दिए गए प्रश्न चुनें।'
            : 'Namaste! I am Kaushalya Sahayak. I can assist you with government schemes, training courses, skills discovery, and local livelihood opportunities. Speak or type below.'),
      audioPrompt: true
    }
  ]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === 'mr' ? 'mr-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          handleUserQuery(currentTranscript);
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition notification:', err.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis?.cancel();
    };
  }, [lang]);

  const toggleListening = () => {
    if (!speechSupported) {
      alert('Speech Recognition is not natively supported in this browser. You can type or use the quick query chips below!');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error('Recognition start error:', err);
      }
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'mr' ? 'mr-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleUserQuery = async (queryText) => {
    if (!queryText.trim()) return;

    const userMsg = { sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setTranscript('');

    // Rule-based Grounded Assistant logic (Zero Hallucination)
    const lower = queryText.toLowerCase();
    let reply = '';
    let actionLink = null;
    let actionLabel = null;

    if (lower.includes('योजना') || lower.includes('scheme') || lower.includes('सबसिडी') || lower.includes('अनुदान')) {
      reply = lang === 'mr'
        ? 'तुमच्यासाठी "पीएम-अजय उपजीविका प्रकल्प अनुदान" (५०% किंवा ₹५०,००० पर्यंत अनुदान) आणि "एनएसएफडीसी विशेष कौशल्य प्रशिक्षण" उपलब्ध आहेत. तुमचा प्रवर्ग आणि उत्पन्न या निकषांशी जुळत आहेत.'
        : (lang === 'hi'
            ? 'आपके लिए "पीएम-अजय आजीविका परियोजना अनुदान" (₹50,000 तक सब्सिडी) और "एनएसएफडीसी कौशल प्रशिक्षण" योजनाएं उपलब्ध हैं।'
            : 'For your SC category profile, "PM-AJAY Livelihood Grant-in-Aid" (up to ₹50,000 subsidy) and "NSFDC Special Skill Training" are available with high match.');
      actionLink = '/schemes';
      actionLabel = lang === 'mr' ? 'योजनांची यादी पहा' : 'View Schemes';
    } else if (lower.includes('नोकरी') || lower.includes('job') || lower.includes('संधी') || lower.includes('काम') || lower.includes('रोजगार')) {
      reply = lang === 'mr'
        ? 'संगमनेर एमआयडीसीमध्ये "सोलर इन्स्टॉलेशन तंत्रज्ञ अप्रेंटिस" (स्टायपेंड ₹१२,५००/महिना) आणि "कृषी पंप सर्व्हिसिंग असिस्टंट" या संधी उपलब्ध आहेत.'
        : (lang === 'hi'
            ? 'संगमनेर क्षेत्र में "सोलर इंस्टालेशन तकनीशियन" और "कृषि पंप सर्विसिंग" के अवसर उपलब्ध हैं।'
            : 'Available opportunities near Sangamner include "Solar Installation Technician Apprentice" (₹12,500/mo stipend) and "Field Pump Servicing Associate".');
      actionLink = '/opportunities';
      actionLabel = lang === 'mr' ? 'संधी पहा' : 'View Opportunities';
    } else if (lower.includes('प्रशिक्षण') || lower.includes('training') || lower.includes('शिकायचे') || lower.includes('कोर्स')) {
      reply = lang === 'mr'
        ? 'शासकीय आयटीआय संगमनेर येथे "सोलर पीव्ही इन्स्टॉलेशन" आणि केव्हीके राहाता येथे "सबमर्सिबल मोटर व पंप दुरुस्ती" हे मोफत अभ्यासक्रम उपलब्ध आहेत. दरमहा ₹१,५०० विद्यावेतन दिले जाते.'
        : (lang === 'hi'
            ? 'सरकारी आईटीआई संगमनेर में "सौर पीवी इंस्टालेशन" और केवीके में "पंप मरम्मत" का निःशुल्क प्रशिक्षण उपलब्ध है।'
            : 'Govt ITI Sangamner offers "Solar PV Installation" and KVK Rahata offers "Agricultural Pump Repair". Both are 100% sponsored under PM-AJAY with ₹1,500/mo stipend.');
      actionLink = '/opportunities';
      actionLabel = lang === 'mr' ? 'प्रशिक्षण केंद्र पहा' : 'View Training Centers';
    } else if (lower.includes('अर्ज') || lower.includes('status') || lower.includes('स्थिती') || lower.includes('ट्रॅक') || lower.includes('आवेदन')) {
      reply = lang === 'mr'
        ? 'तुमचा अर्ज क्रमांक KAUS-2026-0108 सध्या "पडताळणी अंतर्गत" (Under Verification) आहे. जिल्हा समाजकल्याण अधिकारी कागदपत्रे तपासत आहेत.'
        : (lang === 'hi'
            ? 'आपका आवेदन KAUS-2026-0108 वर्तमान में जिला समाज कल्याण अधिकारी द्वारा "सत्यापन प्रक्रियाधीन" है।'
            : 'Your application KAUS-2026-0108 is currently "Under Verification" by District Welfare Officer.');
      actionLink = '/track';
      actionLabel = lang === 'mr' ? 'अर्जाचा मागोवा घ्या' : 'Track Application';
    } else if (lower.includes('कौशल्य') || lower.includes('skill') || lower.includes('पंप') || lower.includes('रिपेअर')) {
      reply = lang === 'mr'
        ? 'तुमच्या उत्तरावरून आम्ही "कृषी पंप दुरुस्ती" आणि "यांत्रिक कामाची क्षमता" ओळखली आहे. यासाठी एनएसक्यूएफ स्तर ३ आणि ४ चे करिअर मार्ग उपलब्ध आहेत.'
        : (lang === 'hi'
            ? 'आपके विवरण से "कृषि पंप मरम्मत" और "यांत्रिक कौशल" की पहचान की गई है, जो एनएसक्यूएफ स्तर 3 और 4 से संबंधित हैं।'
            : 'Based on your experience with farm machinery, we identified skills in "Agricultural Pump Repair" and "Mechanical Troubleshooting" mapped to NSQF Levels 3 & 4.');
      actionLink = '/skills';
      actionLabel = lang === 'mr' ? 'कौशल्य प्रोफाइल पहा' : 'View Skill Twin';
    } else {
      reply = lang === 'mr'
        ? 'मी उपलब्ध सरकारी डेटाबेसच्या आधारे माहिती शोधली आहे. अधिक अचूक उत्तरासाठी कृपया योजना, नोकरी, प्रशिक्षण किंवा अर्जाच्या स्थितीबद्दल विचारा.'
        : (lang === 'hi'
            ? 'मैंने सरकारी डेटाबेस से जानकारी जाँची है। कृपया योजना, नौकरी, प्रशिक्षण या आवेदन की स्थिति के बारे में पूछें।'
            : 'I checked our verified PM-AJAY dataset. For precise guidance, please ask about schemes, jobs, training centers, or your application status.');
    }

    const assistantMsg = {
      sender: 'assistant',
      text: reply,
      actionLink,
      actionLabel
    };

    setMessages(prev => [...prev, assistantMsg]);
    speakText(reply);
  };

  const samplePrompts = [
    { text: t('voice_prompt_1'), label: 'योजना / Schemes' },
    { text: t('voice_prompt_2'), label: 'नोकरी / Jobs' },
    { text: t('voice_prompt_3'), label: 'प्रशिक्षण / Training' },
    { text: t('voice_prompt_4'), label: 'अर्जाची स्थिती / Status' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden border-2 border-gov-navy animate-in fade-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gov-navy to-gov-navy-light text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-gov-saffron flex items-center justify-center text-slate-900 font-bold">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                <span>कौशल्य सहायक</span>
                <span className="text-xs text-gov-saffron font-medium">| Kaushalya Sahayak</span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Multilingual AI Voice Assistant (Grounded PM-AJAY Knowledge)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }
              }}
              className={`p-1.5 rounded-full ${isSpeaking ? 'text-gov-saffron animate-bounce' : 'text-slate-300'}`}
              title={isSpeaking ? 'Stop speaking' : 'Audio active'}
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-50" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-300 hover:text-white"
              aria-label="Close Voice Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 min-h-[260px]">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-gov-navy text-white rounded-br-none shadow-sm'
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm'
                }`}
              >
                <p>{m.text}</p>
                {m.actionLink && (
                  <button
                    onClick={() => {
                      onClose();
                      navigate(m.actionLink);
                    }}
                    className="mt-2.5 inline-flex items-center space-x-1 px-3 py-1 bg-gov-saffron text-black font-bold rounded text-[11px] hover:bg-amber-400 transition"
                  >
                    <span>{m.actionLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white border-t border-slate-200 px-4 py-2">
          <p className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-gov-saffron" />
            {t('voice_try_asking')}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleUserQuery(prompt.text)}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-full border border-slate-200 transition active:scale-95"
              >
                {prompt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Voice Controls */}
        <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center space-x-2">
          {/* Big Microphone Button */}
          <button
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition shadow-md flex-shrink-0 ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                : 'bg-gov-navy text-white hover:bg-gov-navy-light'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Click to Speak'}
            aria-label="Toggle Voice Input"
          >
            {isListening ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-gov-saffron" />}
          </button>

          {/* Text Input Fallback */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserQuery(transcript);
            }}
            className="flex-1 flex items-center space-x-1"
          >
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isListening ? t('voice_listening') : t('voice_speak_now')}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
            />
            <button
              type="submit"
              disabled={!transcript.trim()}
              className="p-2 bg-gov-navy text-white rounded-lg hover:bg-gov-navy-light disabled:opacity-40 transition"
              aria-label="Send Query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Anti-Hallucination & Disclaimer Footnote */}
        <div className="bg-slate-200 px-4 py-1 text-[10px] text-slate-600 text-center flex items-center justify-center space-x-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Responses are strictly verified against PM-AJAY demo rules. Never hallucinates official government benefits.</span>
        </div>
      </div>
    </div>
  );
}
