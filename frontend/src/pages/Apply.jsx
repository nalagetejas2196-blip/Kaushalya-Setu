import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FileCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  FileText,
  User,
  Building
} from 'lucide-react';

export default function Apply() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const targetType = queryParams.get('type') || 'opportunity';
  const targetId = queryParams.get('id') || 'opp-solar-01';

  const [targetItem, setTargetItem] = useState(null);
  const [documents, setDocuments] = useState([
    { type: 'caste_cert', title: 'SC जात प्रमाणपत्र (Caste Certificate) *', fileName: 'caste_cert_savita_patil.pdf', status: 'READY', size: '420 KB' },
    { type: 'education_cert', title: 'शैक्षणिक गुणपत्रिका (10th / 12th Marksheet) *', fileName: 'hsc_marksheet_2024.pdf', status: 'READY', size: '580 KB' },
    { type: 'income_cert', title: 'उत्पन्न दाखला (Income Certificate / BPL) *', fileName: 'income_cert_ahilyanagar.pdf', status: 'READY', size: '390 KB' },
    { type: 'id_proof', title: 'आधार ओळखपत्र (Aadhaar Card - Masked) *', fileName: 'aadhaar_demo_masked.pdf', status: 'READY', size: '210 KB' }
  ]);

  const [declarationChecked, setDeclarationChecked] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch target details
    const endpoint = targetType === 'scheme'
      ? `/api/schemes/${targetId}`
      : `/api/opportunities/${targetId}`;

    fetch(endpoint)
      .then(res => res.json())
      .then(data => setTargetItem(data))
      .catch(err => {
        // Fallback demo target
        setTargetItem({
          id: targetId,
          title: "Solar Installation Technician Apprentice",
          organization: "Sahyadri Rural Green Energy Solutions Pvt Ltd",
          location: "Sangamner MIDC, Ahilyanagar"
        });
      });
  }, [user, targetId, targetType, navigate]);

  const handleFileUpload = (docIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation: Max 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('कागदपत्राचा आकार २ MB पेक्षा कमी असावा.');
      return;
    }

    setDocuments(prev => {
      const updated = [...prev];
      updated[docIndex] = {
        ...updated[docIndex],
        fileName: file.name,
        status: 'READY',
        size: `${Math.round(file.size / 1024)} KB`
      };
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!declarationChecked) {
      setError('कृपया स्वयंघोषणापत्राची स्वीकृती करा.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/applications/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          schemeOrOppType: targetType.toUpperCase(),
          targetId: targetItem?.id || targetId,
          targetTitle: targetItem?.title || 'Solar Installation Apprentice',
          targetOrg: targetItem?.organization || targetItem?.provider || 'District Welfare Department',
          documentsSubmitted: documents.map(d => ({
            type: d.type,
            fileName: d.fileName,
            verified: false,
            officer_note: 'Submitted by citizen for verification'
          })),
          declarationAccepted: true
        })
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/track?id=${data.id}&new=true`);
      } else {
        setError(data.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('Submission error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-gov-navy text-[11px] font-bold px-2 py-0.5 rounded border border-blue-200">
              PM-AJAY Integrated Workflow
            </span>
            <span className="text-slate-400 text-xs">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">Digital Locker Integration</span>
          </div>

          <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-gov-navy" />
            <span>ऑनलाइन अर्ज व कागदपत्रे सादर करा / Application Submission</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            सरकारी कार्यालयात चकरा मारण्याची गरज नाही. येथे अर्ज सादर करा आणि थेट अर्जाचा मागोवा घ्या.
          </p>
        </div>

        {/* Selected Target Summary Card */}
        {targetItem && (
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-xs space-y-2">
            <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200 px-2 py-0.5 rounded uppercase">
              निवडलेली संधी / Selected Target
            </span>
            <h3 className="text-base font-black text-gov-navy">
              {targetItem.title}
            </h3>
            <p className="text-xs text-slate-700">
              संस्था / विभाग: <strong>{targetItem.organization || targetItem.provider || targetItem.department}</strong> &bull; {targetItem.location || targetItem.district}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Applicant Profile Confirmation */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-gov-saffron" />
              १. अर्जदाराची माहिती / Applicant Confirmation
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div>नाव: <strong className="text-slate-900 block">{user?.name}</strong></div>
              <div>मोबाईल: <strong className="text-slate-900 block">{user?.phone}</strong></div>
              <div>प्रवर्ग: <strong className="text-emerald-700 block">{user?.category} (SC)</strong></div>
              <div>गाव/तालुका: <strong className="text-slate-900 block">{user?.taluka}, {user?.district}</strong></div>
            </div>
          </div>

          {/* Step 2: Document Locker */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  २. डिजिटल लॉकर व आवश्यक कागदपत्रे / Mandatory Documents
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  डेमोसाठी नमुना कागदपत्रे आधीच जोडलेली आहेत. आपण नवीन फाइलही अपलोड करू शकता.
                </p>
              </div>

              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                सुरक्षित एन्क्रिप्शन
              </span>
            </div>

            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div
                  key={doc.type}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{doc.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                      <span className="text-gov-navy font-semibold">{doc.fileName}</span>
                      <span>&bull;</span>
                      <span>{doc.size}</span>
                      <span>&bull;</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> जोडलेले आहे
                      </span>
                    </div>
                  </div>

                  <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg font-bold text-[11px] text-slate-700 flex items-center space-x-1 shadow-2xs">
                    <Upload className="w-3 h-3 text-gov-navy" />
                    <span>फाइल बदला</span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(idx, e)}
                      className="hidden"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Declaration & Self Verification */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gov-saffron" />
              ३. स्वयंघोषणापत्र / Self Declaration
            </h3>

            <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-gov-navy focus:ring-gov-navy"
              />
              <span className="leading-relaxed">
                मी याद्वारे घोषित करतो/करते की मी अनुसूचित जाती (SC) प्रवर्गातील रहिवासी असून वरील सर्व माहिती सत्य व बिनचूक आहे. कागदपत्रांची पडताळणी जिल्हा समाजकल्याण अधिकाऱ्यांकडून होण्यास माझी संमती आहे.
              </span>
            </label>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                अर्ज सादर केल्यावर तत्काळ 'KAUS-2026-XXXX' क्रमांक तयार होईल.
              </span>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gov-navy hover:bg-gov-navy-light text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center space-x-2"
              >
                <span>{submitting ? 'अर्ज सादर होत आहे...' : 'अर्ज सादर करा / Submit Application'}</span>
                <ArrowRight className="w-4 h-4 text-gov-saffron" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
