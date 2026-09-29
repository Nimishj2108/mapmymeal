import React from 'react';
import { useApp } from '../store/appStore';
import { Compass, Sparkles, ShieldCheck, Map, Truck, BarChart3, RotateCcw } from 'lucide-react';

export const DemoTourPanel: React.FC = () => {
  const {
    language,
    setActiveTab,
    openRolePicker,
    meals,
    setSelectedMealForDetail,
    setRoutePolylineActive,
    resetDemoData
  } = useApp();

  const tourSteps = [
    {
      step: 1,
      title: language === 'hi' ? '1. नमस्ते & भूमिका चयन' : '1. Namaste & Instant Role Switch',
      desc: language === 'hi' ? 'बिना पासवर्ड 1-टैप भूमिका चयन (दाता, प्राप्तकर्ता, NGO)' : 'Zero-signup role selection (Donor, Recipient, NGO)',
      icon: Compass,
      action: () => {
        openRolePicker();
      }
    },
    {
      step: 2,
      title: language === 'hi' ? '2. दिल्ली लाइव SVG नक्शा' : '2. Live Delhi SVG Map & Meals',
      desc: language === 'hi' ? 'DTU परिसर व उत्तर दिल्ली के निकटतम अधिशेष भोजन पिन' : 'Tappable pulsating pins, nearest meals list, route preview',
      icon: Map,
      action: () => {
        setActiveTab('home');
        setRoutePolylineActive(true);
        if (meals.length > 0) {
          setSelectedMealForDetail(meals[0]);
        }
      }
    },
    {
      step: 3,
      title: language === 'hi' ? '3. 3-टैप AI शेयर & 4-बिन' : '3. 3-Tap AI Food Scan & 4-Bins',
      desc: language === 'hi' ? 'DONATE, SHELF LIFE, RECYCLE, THROW AWAY वैज्ञानिक वर्गीकरण' : 'Instant multi-modal scan, freshness index, explainable rationale',
      icon: Sparkles,
      action: () => {
        setActiveTab('share');
      }
    },
    {
      step: 4,
      title: language === 'hi' ? '4. अपरिवर्तनीय SHA-256 ब्लॉकचेन' : '4. SHA-256 Immutable Ledger',
      desc: language === 'hi' ? 'छेड़छाड़ का अनुकरण एवं गणितीय अखंडता सत्यापन' : 'Real browser WebCrypto SHA-256, tamper simulation & restore',
      icon: ShieldCheck,
      action: () => {
        setActiveTab('impact');
      }
    },
    {
      step: 5,
      title: language === 'hi' ? '5. लाइव डिलीवरी & हानि फलन' : '5. Live Track & Loss Function',
      desc: language === 'hi' ? 'NFT पैकेज सील, मार्ग में चलता वाहन, और L = αW + βE... मॉडल' : 'NFT QR seal, vehicle transit animation, Loss function formula',
      icon: Truck,
      action: () => {
        setActiveTab('track');
      }
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-md">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-amber-100">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#138808] animate-pulse" />
            <h3 className="font-bold text-sm text-[#000080]">
              {language === 'hi' ? 'SIH 2026 जज डेमो गाइड' : 'Judge Guided Script (SIH26234)'}
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Team Prompt!Please · 5-Step Evaluation Path
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[11px] flex items-center gap-1"
          title="Reset to fresh demo state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-2.5">
        {tourSteps.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.step}
              onClick={item.action}
              className="w-full text-left p-3 rounded-2xl hover:bg-amber-50/70 border border-slate-100 hover:border-amber-300 transition-all flex items-start gap-3 group active:scale-[0.98]"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#FF9933] group-hover:bg-[#FF9933] group-hover:text-white transition-colors flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 group-hover:text-[#000080] truncate">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
        100% Deterministic · Offline-Ready · Pure Client-Side State
      </div>
    </div>
  );
};
