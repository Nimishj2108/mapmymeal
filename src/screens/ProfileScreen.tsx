import React, { useState } from 'react';
import { useApp } from '../store/appStore';
import { UserRole } from '../types';
import { AadhaarKycModal } from '../components/AadhaarKycModal';
import {
  User,
  ShieldCheck,
  Award,
  Globe,
  Zap,
  RotateCcw,
  Check,
  ChevronRight,
  Sparkles,
  HeartHandshake,
  UtensilsCrossed,
  Building2,
  Gift
} from 'lucide-react';
import { AshokaChakraSvg } from '../components/ChakraLogo';

export const ProfileScreen: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    userProfile,
    resetDemoData,
    toggleDemoSpeed,
    deliveries,
    meals,
    t
  } = useApp();

  const [showKycModal, setShowKycModal] = useState(false);

  const roleOptions: Array<{ id: UserRole; titleHi: string; titleEn: string; icon: any; color: string }> = [
    { id: 'donor', titleHi: 'खाना बाँटने वाला (Donor)', titleEn: 'Surplus Food Donor', icon: HeartHandshake, color: 'text-[#FF9933]' },
    { id: 'recipient', titleHi: 'भोजन प्राप्तकर्ता (Recipient)', titleEn: 'Meal Recipient', icon: UtensilsCrossed, color: 'text-[#138808]' },
    { id: 'ngo', titleHi: 'NGO / आश्रय संस्था (NGO/Shelter)', titleEn: 'NGO & Community Shelter', icon: Building2, color: 'text-[#000080]' }
  ];

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-2 max-w-lg mx-auto w-full">
      {/* Profile Header Card */}
      <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border-2 border-[#FF9933] flex items-center justify-center text-2xl font-bold text-[#FF9933]">
            👨‍🍳
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-slate-900 truncate">
                {userProfile.name}
              </h2>
              {userProfile.kycVerified && (
                <span title="KYC Verified">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {userProfile.organization}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#FF9933]">
                {role.toUpperCase()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Aadhaar: •••• {userProfile.aadhaarLastFour}
              </span>
            </div>
          </div>
        </div>

        {/* Loyalty Points Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-xs font-bold text-slate-900">
                {userProfile.points} {t.points}
              </span>
              <span className="text-[10px] text-slate-500 block">
                {language === 'hi' ? 'अन्नदाता लॉयल्टी पॉइंट्स' : 'Anna Daata Loyalty Points'}
              </span>
            </div>
          </div>

          <button
            onClick={() => alert(language === 'hi' ? 'कैंटीन कूपन रिडीम कोड: MMM-DTU-FREE-COFFEE' : 'Redeemed voucher code: MMM-DTU-FREE-COFFEE')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200"
          >
            <Gift className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'रिडीम करें' : 'Redeem'}</span>
          </button>
        </div>
      </div>

      {/* Role Switcher Section */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
        <span className="text-xs font-bold text-[#000080] block">
          {language === 'hi' ? 'सक्रिय भूमिका बदलें (Role Switcher)' : 'Active User Role Switcher'}
        </span>

        <div className="space-y-1.5">
          {roleOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = role === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => setRole(opt.id)}
                className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-[#000080] bg-blue-50/40 ring-1 ring-[#000080]'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${opt.color}`} />
                  <span className="text-xs font-bold text-slate-800">
                    {language === 'hi' ? opt.titleHi : opt.titleEn}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#000080] stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* KYC Verification Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">
              {t.kycStatus}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-0.5">
            {userProfile.kycVerified ? t.verified : t.notVerified} (UIDAI Demo Sandbox)
          </span>
        </div>

        <button
          onClick={() => setShowKycModal(true)}
          className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs"
        >
          {userProfile.kycVerified ? (language === 'hi' ? 'पुनः जांचें' : 'Re-verify') : t.verifyAadhaar}
        </button>
      </div>

      {/* Language Switcher Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#000080]" />
          <div>
            <span className="text-xs font-bold text-slate-900">
              {language === 'hi' ? 'भाषा (Language)' : 'Language (भाषा)'}
            </span>
            <span className="text-[11px] text-slate-500 block">
              {language === 'hi' ? 'वर्तमान: हिन्दी' : 'Current: English'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          className="px-3.5 py-1.5 rounded-xl bg-[#000080] text-white font-bold text-xs shadow-xs"
        >
          {language === 'hi' ? 'Switch to English' : 'हिन्दी में बदलें'}
        </button>
      </div>

      {/* Demo Controls: Fast Speed & Reset */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-xs font-bold text-[#000080] block">
          {language === 'hi' ? 'डेमो एवं प्रस्तुति सेटिंग्स' : 'Presentation & Demo Controls'}
        </span>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              {t.demoModeLabel}
            </span>
            <span className="text-[10px] text-slate-500">
              {userProfile.demoMode ? 'Accelerated timers active (2.5s intervals)' : 'Standard real-time intervals'}
            </span>
          </div>

          <button
            onClick={toggleDemoSpeed}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              userProfile.demoMode
                ? 'bg-[#138808] text-white shadow-2xs'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {userProfile.demoMode ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={resetDemoData}
            className="w-full py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetData}</span>
          </button>
        </div>
      </div>

      {/* Team & Hackathon Credits */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-200 text-center space-y-1">
        <div className="flex items-center justify-center gap-1 text-[#000080] text-xs font-extrabold">
          <AshokaChakraSvg size={16} />
          <span>Smart India Hackathon 2026</span>
        </div>
        <p className="text-[11px] font-bold text-[#FF9933]">
          Problem SIH26234 · Team Prompt!Please
        </p>
        <p className="text-[10px] text-slate-500 leading-snug">
          100% Deterministic Offline Prototype. Zero external API keys or Gemini runtime dependencies.
        </p>
      </div>

      {/* KYC Modal */}
      <AadhaarKycModal
        isOpen={showKycModal}
        onClose={() => setShowKycModal(false)}
      />
    </div>
  );
};
