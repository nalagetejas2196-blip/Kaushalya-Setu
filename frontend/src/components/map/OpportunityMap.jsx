import React, { useState } from 'react';
import { MapPin, Navigation, Compass, ExternalLink, Info, CheckCircle2 } from 'lucide-react';

export default function OpportunityMap({ items = [], selectedItem, onSelectItem }) {
  const [filterType, setFilterType] = useState('ALL');

  const filteredItems = items.filter(item => {
    if (filterType === 'ALL') return true;
    if (filterType === 'TRAINING') return item.id.startsWith('tr-');
    if (filterType === 'OPPORTUNITY') return item.id.startsWith('opp-');
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Map Control Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-gov-saffron" />
          <span className="font-bold">जिल्हा नकाशा | Interactive District Map View (Ahilyanagar)</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              filterType === 'ALL' ? 'bg-gov-saffron text-black font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All Pins ({items.length})
          </button>
          <button
            onClick={() => setFilterType('OPPORTUNITY')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              filterType === 'OPPORTUNITY' ? 'bg-gov-saffron text-black font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Jobs & Apprenticeships
          </button>
          <button
            onClick={() => setFilterType('TRAINING')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              filterType === 'TRAINING' ? 'bg-gov-saffron text-black font-bold' : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Training Institutes
          </button>
        </div>
      </div>

      {/* Map Canvas Simulation with OpenStreetMap-style Visual Grid & Pins */}
      <div className="relative h-80 sm:h-96 bg-[#e8ecf1] overflow-hidden flex items-center justify-center border-b border-slate-200">
        {/* Subtle Map Grid Background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(#94a3b8 1px, transparent 1px), linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)`,
            backgroundSize: '24px 24px, 48px 48px, 48px 48px'
          }}
        ></div>

        {/* Major District Highway & River Lines Simulation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
          <path d="M 0 160 Q 250 140 600 240 T 1200 200" stroke="#38bdf8" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M 120 0 L 300 200 L 520 400" stroke="#fbbf24" strokeWidth="4" fill="none" strokeDasharray="6 4" />
          <path d="M 0 80 Q 400 90 900 350" stroke="#94a3b8" strokeWidth="3" fill="none" />
        </svg>

        {/* Center Point - Savita's Village Nimgaon Jali / Sangamner */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg ring-4 ring-blue-300/60 animate-ping absolute"></div>
          <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-lg relative z-10 flex items-center justify-center text-[9px] text-white font-black">
            🏠
          </div>
          <span className="bg-slate-900 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow mt-1 whitespace-nowrap">
            Your Village: Nimgaon Jali (Sangamner)
          </span>
        </div>

        {/* Plotting Interactive Map Pins */}
        {filteredItems.map((item, index) => {
          // Calculate a realistic relative scatter around the center
          const angle = (index * 68) * (Math.PI / 180);
          const radius = 55 + (item.distance_km || 15) * 4.5;
          const xOffset = Math.cos(angle) * Math.min(radius, 170);
          const yOffset = Math.sin(angle) * Math.min(radius, 110);

          const isTraining = item.id.startsWith('tr-');
          const isSelected = selectedItem?.id === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectItem && onSelectItem(item)}
              style={{
                transform: `translate(${xOffset}px, ${yOffset}px)`
              }}
              className="absolute z-30 cursor-pointer group transition duration-200"
            >
              {/* Pin Icon */}
              <div
                className={`p-1.5 rounded-full shadow-md transition flex items-center justify-center ${
                  isSelected
                    ? 'bg-gov-navy text-gov-saffron ring-4 ring-gov-saffron scale-125'
                    : isTraining
                    ? 'bg-emerald-600 text-white hover:scale-110'
                    : 'bg-amber-600 text-white hover:scale-110'
                }`}
              >
                <MapPin className="w-4 h-4" />
              </div>

              {/* Pin Tooltip */}
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 bg-slate-900 text-white p-2 rounded text-[11px] shadow-xl pointer-events-none z-40">
                <div className="font-bold truncate text-gov-saffron">{item.title}</div>
                <div className="text-slate-300 text-[10px] flex items-center justify-between mt-0.5">
                  <span>{item.provider || item.organization}</span>
                  <span className="font-bold text-emerald-400">{item.distance_km} km</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Map Legend */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs p-2 rounded border border-slate-300 shadow text-[10px] space-y-1 z-30">
          <div className="flex items-center space-x-1.5 font-bold text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Beneficiary Residence</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>Livelihood Opportunity (Job/Apprenticeship)</span>
          </div>
          <div className="flex items-center space-x-1.5 font-medium text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>PM-AJAY Training Institute</span>
          </div>
        </div>

        {/* Demo Disclaimer on Map Canvas */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded pointer-events-none">
          Simulated geographic distribution &bull; No external paid API required
        </div>
      </div>

      {/* Selected Item Detail Drawer if clicked */}
      {selectedItem && (
        <div className="p-4 bg-amber-50 border-t border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gov-navy text-sm">{selectedItem.title}</span>
              <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px]">
                {selectedItem.distance_km} km from your village
              </span>
            </div>
            <p className="text-slate-600 text-xs mt-0.5">
              {selectedItem.provider || selectedItem.organization} &bull; {selectedItem.location || selectedItem.district}
            </p>
          </div>

          <button
            onClick={() => onSelectItem(selectedItem)}
            className="px-4 py-1.5 bg-gov-navy text-white font-bold rounded hover:bg-gov-navy-light text-xs flex items-center space-x-1"
          >
            <span>View Details & Apply</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
