import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Users,
  Award,
  Globe2,
  Eye,
  CheckCircle2,
  RefreshCw,
  Layers,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminAnalytics() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = () => {
    setLoading(true);
    fetch('/api/analytics/district')
      .then(res => res.json())
      .then(data => {
        setAnalyticsData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch analytics error:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#0B3C5D', '#FF9933', '#138808', '#D97706', '#64748B'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2 py-0.5 rounded border border-purple-200">
                District Administration View
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">Ahilyanagar & Maharashtra State PM-AJAY Cell</span>
            </div>
            <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span>जिल्हा व राज्यस्तरीय विश्लेषण डॅशबोर्ड / District Analytics</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              अनुसूचित जाती लाभार्थ्यांची नोंदणी, कौशल्य मागणी, प्रशिक्षण बॅचेस आणि थेट अर्ज प्रगतीचा सांख्यिकी आढावा.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] px-2.5 py-1 rounded">
              DEMONSTRATION DATA &bull; प्रात्यक्षिक आकडेवारी
            </span>
            <button
              onClick={fetchAnalytics}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {analyticsData && (
          <>
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">एकूण नोंदणीकृत लाभार्थी</span>
                <div className="text-3xl font-black text-gov-navy mt-1">
                  {analyticsData.kpis.totalBeneficiaries}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  +18% मागील महिन्यापेक्षा वाढ
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">सादर केलेले एकूण अर्ज</span>
                <div className="text-3xl font-black text-blue-700 mt-1">
                  {analyticsData.kpis.totalApplications}
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  PM-AJAY अनुदान व नोकऱ्यांसाठी
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">पडताळणी प्रलंबित अर्ज</span>
                <div className="text-3xl font-black text-amber-600 mt-1">
                  {analyticsData.kpis.pendingVerification}
                </div>
                <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                  अधिकारी स्तरावर तपासणी सुरू
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs font-bold text-slate-500 block">मंजूर उपजीविका अनुदान</span>
                <div className="text-3xl font-black text-emerald-700 mt-1">
                  {analyticsData.kpis.approvedLivelihoods}
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                  प्रत्यक्ष बँक खात्यात वर्ग (DBT)
                </span>
              </div>
            </div>

            {/* Main Visualizations: 2 Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Chart 1: Taluka Distribution (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-gov-navy">
                      तालुकानिहाय लाभार्थी व अर्ज / Taluka Distribution
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      अहिल्यानगर जिल्ह्यातील प्रमुख तालुक्यांचा सहभाग
                    </p>
                  </div>
                  <MapPin className="w-4 h-4 text-gov-saffron" />
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.districtDistribution}>
                      <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                      <YAxis stroke="#64748B" fontSize={11} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="beneficiaries" name="लाभार्थी (Beneficiaries)" fill="#0B3C5D" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="applications" name="अर्ज (Applications)" fill="#FF9933" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Top Skills vs Skill Gaps (5 cols) */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-gov-navy">
                      कौशल्य मागणी व अंतर / Skills vs Gaps
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      प्रशिक्षणाची गरज असलेली प्रमुख क्षेत्रे
                    </p>
                  </div>
                  <Layers className="w-4 h-4 text-emerald-600" />
                </div>

                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={analyticsData.skillGapAnalytics}>
                      <XAxis type="number" stroke="#64748B" fontSize={11} />
                      <YAxis type="category" dataKey="skill" stroke="#64748B" fontSize={10} width={90} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="identified" name="उपलब्ध (Identified)" fill="#10B981" />
                      <Bar dataKey="demandGap" name="मागणी अंतर (Gap)" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Inclusive Accessibility & Language Usage Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-600" />
                  <span>भाषा वापर प्रमाण / Multilingual Distribution</span>
                </h4>
                <div className="space-y-2 pt-2">
                  {analyticsData.accessibilityStats.languageDistribution.map((l, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span>{l.name}</span>
                        <span>{l.value}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-gov-navy h-2 rounded-full"
                          style={{ width: `${l.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span>सुलभता वैशिष्ट्ये वापर / Accessibility Engagement</span>
                </h4>
                <div className="space-y-2.5 pt-2 text-xs">
                  {analyticsData.accessibilityStats.featuresUsage.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-800">{f.feature}</span>
                      <span className="font-extrabold text-gov-navy bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                        {f.users} नागरिक
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
