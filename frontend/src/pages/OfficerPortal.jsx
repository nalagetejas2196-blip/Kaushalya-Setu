import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  User,
  ArrowRight,
  Filter,
  Check,
  X,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function OfficerPortal() {
  const { user, loginDemo } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Officer Action Form State
  const [newStatus, setNewStatus] = useState('Approved');
  const [officerRemark, setOfficerRemark] = useState('All mandatory documents verified against Tehsildar ledger. Recommended for PM-AJAY stipend.');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const fetchQueue = () => {
    setLoading(true);
    fetch('/api/applications/officer-queue')
      .then(res => res.json())
      .then(data => {
        setApplications(data);
        if (data.length > 0 && !selectedApp) {
          setSelectedApp(data[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Queue fetch error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleVerifyDoc = async (docType, verified, note) => {
    if (!selectedApp) return;

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/verify-doc`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          verified,
          officerNote: note || (verified ? 'Verified by District Welfare Officer' : 'Requires legible re-upload'),
          officerName: user?.name || 'Rajesh Deshmukh (DWO)'
        })
      });

      const updated = await res.json();
      setSelectedApp(updated);
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (err) {
      console.error('Doc verify error:', err);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setActionLoading(true);
    setFeedback('');

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          statusNotes: officerRemark,
          officerName: user?.name || 'Rajesh Deshmukh (District Welfare Officer)'
        })
      });

      const updated = await res.json();
      setSelectedApp(updated);
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
      setFeedback(`Application ${updated.id} updated to '${newStatus}' and citizen notified.`);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      setFeedback('Error updating status: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApps = applications.filter(a => {
    const matchesStatus = filterStatus === 'ALL' || a.status.toLowerCase() === filterStatus.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      a.id.toLowerCase().includes(query) ||
      a.beneficiary_name.toLowerCase().includes(query) ||
      a.target_title.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Officer Header */}
        <div className="bg-[#062338] text-white rounded-2xl p-6 border-b-4 border-gov-saffron shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                शासकीय अधिकारी कक्ष / Officer Portal
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-300">
                Department of Social Justice & Special Assistance &bull; Ahilyanagar
              </span>
            </div>
            <h2 className="text-2xl font-black mt-1 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-gov-saffron" />
              <span>जिल्हा समाजकल्याण अधिकारी पडताळणी डेस्क</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              अधिकारी: <strong>राजेश देशमुख (District Welfare Officer)</strong> &bull; कार्यक्षेत्र: संगमनेर, राहाता, कोपरगाव, श्रीरामपूर
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/dashboard"
              onClick={() => loginDemo('beneficiary')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow flex items-center space-x-1.5"
              title="Return to Beneficiary Dashboard to verify notification"
            >
              <User className="w-4 h-4" />
              <span>लाभार्थी दृश्याकडे परत जा (Savita)</span>
            </Link>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold rounded-xl flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{feedback}</span>
          </div>
        )}

        {/* 2-Column Layout: Queue List + Detailed Verification Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Application Queue (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-gov-navy flex items-center gap-1.5">
                <span>अर्जांची रांग / Verification Queue</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                  {filteredApps.length}
                </span>
              </h3>

              <button
                onClick={fetchQueue}
                className="p-1 text-slate-500 hover:text-gov-navy transition"
                title="Refresh queue"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Filter Search */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="नाव किंवा अर्ज क्रमांक शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
              />

              <div className="flex items-center space-x-1 overflow-x-auto text-[11px]">
                {['ALL', 'Submitted', 'Under Verification', 'Approved'].map(st => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2 py-1 rounded transition whitespace-nowrap font-medium ${
                      filterStatus === st
                        ? 'bg-gov-navy text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue Cards */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredApps.map(app => {
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-400'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500">{app.id}</span>
                        <div className="font-bold text-xs text-slate-900">{app.beneficiary_name}</div>
                        <div className="text-[11px] text-slate-600">{app.target_title}</div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>तालुका: {app.taluka}</span>
                      <span>{new Date(app.applied_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Applicant Workspace (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedApp ? (
              <>
                {/* Applicant Summary */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        अर्जदार पडताळणी / Applicant Profile
                      </span>
                      <h3 className="text-xl font-black text-gov-navy mt-0.5">
                        {selectedApp.beneficiary_name}
                      </h3>
                      <p className="text-xs text-slate-600">
                        अर्ज क्रमांक: <strong>{selectedApp.id}</strong> &bull; {selectedApp.taluka}, {selectedApp.district}
                      </p>
                    </div>

                    <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-300">
                      SC Category (Mahar)
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div>संधी / योजना: <strong className="text-gov-navy">{selectedApp.target_title}</strong></div>
                    <div>संस्था / विभाग: <strong>{selectedApp.target_org}</strong></div>
                    <div>सध्याची स्थिती: <strong className="text-amber-700">{selectedApp.status}</strong></div>
                  </div>

                  {/* Document Verification Controls */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      कागदपत्रांची तपासणी व शेरा / Document Scrutiny:
                    </h4>

                    <div className="space-y-2">
                      {(selectedApp.documents_submitted || []).map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-800">{doc.fileName}</div>
                            <div className="text-[11px] text-slate-500">
                              शेरा: {doc.officer_note || 'Awaiting review'}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleVerifyDoc(doc.type, true, 'Verified online against Tehsildar portal')}
                              className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                                doc.verified
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 hover:bg-emerald-100 text-slate-700'
                              }`}
                            >
                              <Check className="w-3 h-3" />
                              <span>{doc.verified ? 'प्रमाणित' : 'प्रमाणित करा'}</span>
                            </button>

                            <button
                              onClick={() => handleVerifyDoc(doc.type, false, 'Document seal unclear. Please re-upload clearer copy')}
                              className="px-2.5 py-1 rounded text-[11px] font-bold bg-slate-100 hover:bg-amber-100 text-slate-700 flex items-center space-x-1"
                              title="Request correction"
                            >
                              <X className="w-3 h-3" />
                              <span>दुरुस्ती मागवा</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Officer Decision Form */}
                  <form onSubmit={handleUpdateStatus} className="pt-4 border-t border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-gov-navy uppercase tracking-wider">
                      अधिकारी निर्णय व स्थिती बदल / Officer Status Update:
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          नवीन स्थिती निवडा / Status *
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-gov-navy focus:outline-none"
                        >
                          <option value="Approved">मंजूर करा (Approved)</option>
                          <option value="Under Verification">पडताळणी अंतर्गत ठेवा (Under Verification)</option>
                          <option value="Documents Required">अतिरिक्त कागदपत्रे मागवा (Documents Required)</option>
                          <option value="Rejected">नाकारा (Rejected with Reason)</option>
                          <option value="Completed">प्रक्रिया पूर्ण (Completed)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          अधिकारी शेरा / Official Note *
                        </label>
                        <input
                          type="text"
                          required
                          value={officerRemark}
                          onChange={(e) => setOfficerRemark(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full py-2.5 bg-gov-navy hover:bg-gov-navy-light text-white font-bold text-xs rounded-lg shadow transition flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gov-saffron" />
                      <span>{actionLoading ? 'अद्ययावत होत आहे...' : 'निर्णय जतन करा व नागरिकाला सूचित करा'}</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center text-slate-500 text-xs border border-slate-200">
                पडताळणीसाठी डावीकडील यादीतून अर्ज निवडा.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
