import React from 'react';
import { useApp } from '../store/appStore';
import { AshokaChakraSvg, MapMyMealLogo } from '../components/ChakraLogo';
import { TricolorBar } from '../components/TricolorBar';
import { ArrowRight, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { dismissSplash, language, setLanguage } = useApp();

  return (
    <div
      onClick={dismissSplash}
      className="fixed inset-0 z-100 flex flex-col justify-between bg-[#FFFDF8] cursor-pointer select-none overflow-hidden"
    >
      {/* Top Tricolor Accent Line */}
      <TricolorBar height="h-2" />

      {/* Language Quick Switcher at top right */}
      <div className="absolute top-5 right-5 z-20" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          className="px-3 py-1.5 rounded-full bg-white/90 border border-amber-200 text-xs font-bold text-[#000080] shadow-xs hover:bg-amber-50"
        >
          {language === 'hi' ? 'English' : 'हिन्दी'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Slow Spinning Ashoka Chakra */}
        <div className="relative mb-6">
          <div className="text-[#000080]/80 animate-[spin_24s_linear_infinite]">
            <AshokaChakraSvg size={100} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
        </div>

        {/* Large Animated Namaste Greeting */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#000080] tracking-tight">
            नमस्ते 🙏
          </h1>
          <p className="text-xl sm:text-2xl font-bold text-[#FF9933] mt-2">
            Map My Meal में आपका स्वागत है
          </p>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Welcome to Map My Meal · SIH 2026
          </p>
        </div>

        {/* SIH Problem Statement Card */}
        <div className="mt-8 max-w-sm w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-200/80 text-left animate-in fade-in duration-1000 delay-200">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#FF9933]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Problem Statement SIH26234</span>
          </div>
          <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
            AI-Powered Smart Food Waste Reduction & Sustainable Redistribution Ecosystem for Institutional Kitchens.
          </p>
          <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>Team: Prompt!Please</span>
            <span className="text-[#138808]">100% Offline Prototype</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA / Auto-advance hint */}
      <div className="p-6 text-center pb-8 animate-in fade-in duration-700 delay-300">
        <button
          onClick={dismissSplash}
          className="w-full max-w-xs mx-auto py-3.5 px-6 rounded-2xl bg-[#FF9933] hover:bg-[#e07f20] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span>{language === 'hi' ? 'आरंभ करें' : 'Get Started'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-slate-400 mt-2.5">
          {language === 'hi' ? 'स्वतः आगे बढ़ें अथवा कहीं भी स्पर्श करें' : 'Tap anywhere to enter'}
        </p>
      </div>

      {/* Bottom Tricolor Accent Line */}
      <TricolorBar height="h-1.5" />
    </div>
  );
};
