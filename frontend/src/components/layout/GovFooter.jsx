import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, ExternalLink, Globe2, HeartHandshake, FileText, PhoneCall } from 'lucide-react';

export default function GovFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#062338] text-slate-300 text-xs border-t-4 border-[#FF9933] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Initiative Info */}
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-3">
              <span className="text-gov-saffron">कौशल्य</span>
              <span>सेतू</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              An inclusive, multilingual, AI-powered livelihood-navigation solution for Scheduled Caste (SC) communities under the PM-AJAY / GIA context.
            </p>
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700 text-[11px] text-amber-300 font-medium">
              PM-AJAY Special Livelihood Initiative &bull; Livelihood Navigation Cell
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-gov-saffron" />
              Official Portal Links
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="https://socialjustice.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron flex items-center justify-between">
                  <span>Ministry of Social Justice & Empowerment</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://nsfdc.nic.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron flex items-center justify-between">
                  <span>NSFDC (Caste Finance Corp)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://ncs.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron flex items-center justify-between">
                  <span>National Career Service (NCS)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://skillindiadigital.gov.in" target="_blank" rel="noreferrer" className="hover:text-gov-saffron flex items-center justify-between">
                  <span>Skill India Digital Hub (SIDH)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Accessibility & Inclusivity */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
              Inclusivity & Standards
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>&bull; WCAG 2.1 AA Compliance Standard</li>
              <li>&bull; GIGW (Guidelines for Indian Govt Websites)</li>
              <li>&bull; Full Multilingual Support (मराठी, हिंदी, English)</li>
              <li>&bull; Native Voice-First Accessibility (Web Speech)</li>
              <li>&bull; Offline / Rural Connectivity Fallback</li>
            </ul>
          </div>

          {/* Col 4: Demo Support & Redressal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              District Help Desk (Demo)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Ahilyanagar District Social Welfare Office, Collectorate Complex.
            </p>
            <div className="text-[11px] text-slate-300 bg-slate-800/60 p-2 rounded">
              <div>Toll-Free Helpline: <strong>1800-11-2026</strong> (Mock)</div>
              <div>Operating Hours: 9:30 AM - 6:00 PM</div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Strip */}
        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="text-center sm:text-left">
            &copy; 2026 Kaushalya Setu Portal. All rights reserved. Supported under PM-AJAY & Grant-in-Aid (GIA) Framework.
          </p>
          <div className="flex items-center space-x-4">
            <span>Last Updated: <strong>18 Sep 2026</strong></span>
            <span>Total Visitors: <strong>14,820</strong></span>
          </div>
        </div>
      </div>

      {/* Tricolor Bottom Edge */}
      <div className="h-1.5 w-full flex">
        <div className="bg-[#FF9933] flex-1"></div>
        <div className="bg-white flex-1"></div>
        <div className="bg-[#138808] flex-1"></div>
      </div>
    </footer>
  );
}
