import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Briefcase,
  MapPin,
  Map,
  List,
  Search,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OpportunityMap from '../components/map/OpportunityMap';

export default function Opportunities() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [opportunities, setOpportunities] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [viewMode, setViewMode] = useState('LIST'); // 'LIST' | 'MAP'
  const [selectedType, setSelectedType] = useState('ALL');
  const [maxDistance, setMaxDistance] = useState(30);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/opportunities').then(r => r.json()),
      fetch('/api/opportunities/trainings/list').then(r => r.json())
    ])
      .then(([opps, trains]) => {
        setOpportunities(opps);
        setTrainings(trains);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch opportunities error:', err);
        setLoading(false);
      });
  }, []);

  // Combine items for unified map and list viewing
  const allItems = [
    ...opportunities.map(o => ({ ...o, itemType: 'OPPORTUNITY' })),
    ...trainings.map(t => ({ ...t, itemType: 'TRAINING', stipend: t.fees, organization: t.provider }))
  ];

  const filteredItems = allItems.filter(item => {
    const matchesDistance = (item.distance_km || 15) <= maxDistance;
    const matchesType =
      selectedType === 'ALL' ||
      (selectedType === 'TRAINING' && item.itemType === 'TRAINING') ||
      (selectedType === 'JOB' && item.opportunity_type === 'Job') ||
      (selectedType === 'APPRENTICESHIP' && item.opportunity_type === 'Apprenticeship') ||
      (selectedType === 'ENTREPRENEURSHIP' && item.opportunity_type === 'Entrepreneurship');

    const title = (item.title + ' ' + (item.title_mr || '') + ' ' + (item.organization || '')).toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());

    return matchesDistance && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                Local Cluster Integration
              </span>
              <span className="text-slate-400 text-xs">&bull;</span>
              <span className="text-xs text-slate-500 font-medium">Ahilyanagar & Sangamner Region</span>
            </div>
            <h2 className="text-2xl font-black text-gov-navy mt-1 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              <span>स्थानिक संधी व प्रशिक्षण / Opportunities & Training Near Me</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              तुमच्या गावाजवळ (संगमनेर परिसरात) उपलब्ध असलेले प्रत्यक्ष रोजगार, शिकाऊ उमेदवारी आणि पीएम-अजय प्रशिक्षण केंद्र.
            </p>
          </div>

          {/* Toggle List / Map View */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'LIST' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>यादी (List)</span>
            </button>
            <button
              onClick={() => setViewMode('MAP')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'MAP' ? 'bg-gov-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>नकाशा (Map)</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="संधी, पद किंवा प्रशिक्षण संस्था शोधा... (Search)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
              />
            </div>

            {/* Distance Slider */}
            <div className="flex items-center space-x-3 w-full sm:w-72 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                अंतर: {maxDistance} किमी
              </span>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-gov-navy"
              />
            </div>
          </div>

          {/* Type Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {[
              { id: 'ALL', label: 'सर्व संधी' },
              { id: 'APPRENTICESHIP', label: 'अप्रेंटिसशिप (NAPS)' },
              { id: 'JOB', label: 'थेट नोकऱ्या (Jobs)' },
              { id: 'TRAINING', label: 'प्रशिक्षण (ITI / KVK)' },
              { id: 'ENTREPRENEURSHIP', label: 'सूक्ष्म उद्योग अनुदान' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                  selectedType === type.id
                    ? 'bg-gov-navy text-white font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Switch: MAP vs LIST */}
        {viewMode === 'MAP' ? (
          <OpportunityMap
            items={filteredItems}
            selectedItem={selectedItem}
            onSelectItem={(item) => setSelectedItem(item)}
          />
        ) : (
          /* List View Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.map(item => {
              const itemTitle = lang === 'mr' ? (item.title_mr || item.title) : item.title;
              const isTraining = item.itemType === 'TRAINING';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between space-y-3 hover:border-gov-navy transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isTraining
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {item.opportunity_type || 'Training Batch'}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-gov-navy mt-1">
                          {itemTitle}
                        </h3>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-600 mt-0.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.organization || item.provider}</span>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <span className="inline-block bg-slate-100 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded border border-slate-200">
                          {item.distance_km} किमी
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-700">
                        <span>वेतन / मानधन:</span>
                        <strong className="text-emerald-700">{item.stipend}</strong>
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-slate-600 block">
                        आवश्यक कौशल्ये / Skills:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(item.required_skills || item.skills_gained || []).map((sk, i) => (
                          <span key={i} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200 font-medium">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Why this matches you */}
                    <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 text-[11px] text-blue-900 flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>शिफारस कारण:</strong> तुमच्या अनुभवाशी आणि {user?.preferred_radius_km || 25} किमी प्राधान्य परिघाशी सुसंगत.
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">
                      {item.verified ? '✓ पडताळणीकृत शासकीय भागीदार' : 'Demo Record'}
                    </span>

                    <button
                      onClick={() => navigate(`/apply?type=${isTraining ? 'training' : 'opportunity'}&id=${item.id}`)}
                      className="px-4 py-2 bg-gov-navy hover:bg-gov-navy-light text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center space-x-1"
                    >
                      <span>अर्ज करा / Apply</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gov-saffron" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
