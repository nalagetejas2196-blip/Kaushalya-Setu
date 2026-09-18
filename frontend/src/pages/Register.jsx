import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { User, MapPin, Award, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Register() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Rahul Kamble',
    phone: '9822114455',
    gender: 'Male',
    age: 23,
    category: 'SC',
    state: 'Maharashtra',
    district: 'Ahilyanagar',
    taluka: 'Sangamner',
    village: 'Ashwi Khurd',
    education: '10th Pass',
    employment_status: 'Seeking Skill Training / Livelihood',
    annual_income: 68000,
    preferred_language: 'mr',
    preferred_radius_km: 25
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/skills');
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gov-navy text-white px-6 py-5 border-b-4 border-gov-saffron">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-gov-saffron" />
            <span>लाभार्थी नोंदणी / Beneficiary Registration</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            PM-AJAY कौशल्य व उपजीविका मार्गदर्शन प्रणाली अंतर्गत थेट नोंदणी
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
              {error}
            </div>
          )}

          {/* Section 1: Basic Details */}
          <div>
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gov-saffron" />
              १. वैयक्तिक माहिती / Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">पूर्ण नाव / Full Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">मोबाईल नंबर / Mobile Number *</label>
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">वय / Age (Years) *</label>
                <input
                  type="number"
                  required
                  min="16"
                  max="55"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">लिंग / Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                >
                  <option value="Male">पुरुष / Male</option>
                  <option value="Female">महिला / Female</option>
                  <option value="Other">इतर / Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Eligibility & Category */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              २. प्रवर्ग व पात्रता / Category & Eligibility (PM-AJAY)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">सामाजिक प्रवर्ग / Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold text-gov-navy focus:ring-2 focus:ring-gov-navy focus:outline-none"
                >
                  <option value="SC">अनुसूचित जाती (SC - PM-AJAY Priority)</option>
                  <option value="ST">अनुसूचित जमाती (ST)</option>
                  <option value="OBC">इतर मागासवर्गीय (OBC)</option>
                  <option value="General">सर्वसाधारण (General)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">वार्षिक कौटुंबिक उत्पन्न / Annual Household Income (₹)</label>
                <input
                  type="number"
                  name="annual_income"
                  value={formData.annual_income}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">शिक्षण / Education *</label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                >
                  <option value="Below 8th">८ वी पेक्षा कमी</option>
                  <option value="8th Pass">८ वी उत्तीर्ण (8th Pass)</option>
                  <option value="10th Pass">१० वी उत्तीर्ण (10th Pass)</option>
                  <option value="12th Pass">१२ वी उत्तीर्ण (12th Pass)</option>
                  <option value="ITI">आयटीआय (ITI)</option>
                  <option value="Diploma">डिप्लोमा (Diploma)</option>
                  <option value="Graduate">पदवीधर (Graduate)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">कामाचे प्राधान्य अंतर / Work Radius</label>
                <select
                  name="preferred_radius_km"
                  value={formData.preferred_radius_km}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                >
                  <option value="10">१० किमी आत (गावाजवळ)</option>
                  <option value="25">२५ किमी आत (तालुका परिसर)</option>
                  <option value="50">५० किमी आत (जिल्हा परिसर)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600" />
              ३. पत्ता व स्थान / Location Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">जिल्हा / District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">तालुका / Taluka</label>
                <input
                  type="text"
                  name="taluka"
                  value={formData.taluka}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">गाव / Village</label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gov-navy hover:bg-gov-navy-light text-white font-extrabold text-sm rounded-lg shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'नोंदणी होत आहे...' : 'नोंदणी पूर्ण करा व कौशल्य ओळखा'}</span>
              <ArrowRight className="w-4 h-4 text-gov-saffron" />
            </button>

            <p className="text-[11px] text-slate-500 text-center mt-3">
              नोंदणी केल्यानंतर तुम्हाला संभाषणात्मक AI द्वारे कौशल्य ओळखण्याच्या पृष्ठावर नेले जाईल.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
