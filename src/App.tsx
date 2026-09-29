import React, { useState } from 'react';
import { AppProvider, useApp } from './store/appStore';
import { MapMyMealLogo, AshokaChakraSvg } from './components/ChakraLogo';
import { TricolorBar } from './components/TricolorBar';
import { SplashScreen } from './screens/SplashScreen';
import { RolePickerModal } from './screens/RolePickerModal';
import { HomeScreen } from './screens/HomeScreen';
import { ShareScreen } from './screens/ShareScreen';
import { TrackScreen } from './screens/TrackScreen';
import { ImpactScreen } from './screens/ImpactScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { DemoTourPanel } from './components/DemoTourPanel';
import {
  Map,
  Plus,
  Truck,
  BarChart3,
  User,
  Bell,
  Award,
  Globe,
  Compass,
  CheckCircle,
  X
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    role,
    language,
    setLanguage,
    showSplash,
    userProfile,
    toastMessage,
    openRolePicker,
    t
  } = useApp();

  const [showMobileTourDrawer, setShowMobileTourDrawer] = useState(false);

  const navItems = [
    { id: 'home' as const, label: t.tabHome, icon: Map },
    { id: 'share' as const, label: t.tabShare, icon: Plus, isCenter: true },
    { id: 'track' as const, label: t.tabTrack, icon: Truck },
    { id: 'impact' as const, label: t.tabImpact, icon: BarChart3 },
    { id: 'profile' as const, label: t.tabProfile, icon: User }
  ];

  return (
    <div className="min-h-screen bg-[#F0EFE9] text-[#1A1A2E] flex justify-center selection:bg-amber-200">
      {/* Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Role Picker Modal */}
      <RolePickerModal />

      {/* Main Container Wrapper */}
      <div className="w-full max-w-7xl mx-auto flex justify-center lg:gap-8 lg:p-6 lg:items-start">
        {/* Left Side Rail for Desktop (Judge Demo Guide) */}
        <aside className="hidden lg:block w-80 shrink-0 sticky top-6">
          <DemoTourPanel />

          <div className="mt-4 p-4 rounded-3xl bg-white/80 border border-slate-200/80 text-xs space-y-2 text-slate-600">
            <div className="font-bold text-[#000080] flex items-center gap-1.5">
              <AshokaChakraSvg size={16} />
              <span>Smart India Hackathon 2026</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Problem SIH26234: AI-Powered Smart Food Waste Reduction & Sustainable Redistribution Ecosystem for Institutional Kitchens.
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
              <span>Team: Prompt!Please</span>
              <span className="text-emerald-700">100% Deterministic</span>
            </div>
          </div>
        </aside>

        {/* Mobile-First Phone Container Frame */}
        <main className="w-full max-w-[430px] min-h-screen lg:min-h-[880px] bg-[#FFFDF8] lg:rounded-[40px] lg:shadow-2xl lg:border-4 lg:border-slate-800 flex flex-col relative overflow-hidden">
          {/* Top Indian Tricolor Stripe */}
          <TricolorBar height="h-1.5" />

          {/* Sticky Top Header */}
          <header className="sticky top-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md px-4 py-2.5 border-b border-amber-200/60 flex items-center justify-between">
            <MapMyMealLogo size="sm" showTagline={false} />

            <div className="flex items-center gap-1.5">
              {/* Language Switcher Button */}
              <button
                onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-bold text-[#000080] shadow-2xs hover:bg-slate-50"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#FF9933]" />
                <span>{language === 'hi' ? 'ENG' : 'हिन्दी'}</span>
              </button>

              {/* Loyalty Points Pill */}
              <div
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-300 text-xs font-black text-amber-900 cursor-pointer"
                title="Your Anna Daata Points"
              >
                <Award className="w-3.5 h-3.5 text-[#FF9933]" />
                <span className="tabular-nums">{userProfile.points}</span>
              </div>

              {/* Role Indicator / Switcher */}
              <button
                onClick={openRolePicker}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-200"
                title="Change Role"
              >
                {role === 'donor' ? '👨‍🍳' : role === 'recipient' ? '🥣' : '🏢'}
              </button>
            </div>
          </header>

          {/* Screen Content Body */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'home' && <HomeScreen />}
            {activeTab === 'share' && <ShareScreen />}
            {activeTab === 'track' && <TrackScreen />}
            {activeTab === 'impact' && <ImpactScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </div>

          {/* Floating Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 animate-in slide-in-from-bottom-5 duration-300">
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="flex-1 font-medium">{toastMessage}</span>
              </div>
            </div>
          )}

          {/* Mobile Guided Tour Trigger Button */}
          <div className="lg:hidden fixed bottom-20 left-4 z-40">
            <button
              onClick={() => setShowMobileTourDrawer(!showMobileTourDrawer)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#000080] text-white font-bold text-xs shadow-lg active:scale-95 border border-white"
            >
              <Compass className="w-3.5 h-3.5 text-[#FF9933]" />
              <span>{language === 'hi' ? 'जज टूर' : 'Judge Tour'}</span>
            </button>
          </div>

          {/* Mobile Tour Drawer */}
          {showMobileTourDrawer && (
            <div className="lg:hidden fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-end">
              <div className="w-full bg-white rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm text-[#000080]">
                    {language === 'hi' ? 'जज डेमो स्क्रिप्ट (5 चरण)' : 'Judge Evaluation Guide'}
                  </h3>
                  <button
                    onClick={() => setShowMobileTourDrawer(false)}
                    className="p-1 rounded-full text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <DemoTourPanel />
              </div>
            </div>
          )}

          {/* Fixed Bottom 5-Tab Navigation Bar */}
          <nav className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center h-16 px-1">
            {navItems.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              if (tab.isCenter) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex flex-col items-center justify-center -mt-5 group"
                    aria-label={tab.label}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#FF9933] text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 active:scale-95 border-2 border-white">
                      <Plus className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#FF9933] mt-1">
                      {tab.label}
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                    isActive ? 'text-[#000080]' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  aria-label={tab.label}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span
                    className={`text-[10px] font-medium tracking-tight mt-1 ${
                      isActive ? 'font-bold text-[#000080]' : ''
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#FF9933] mt-0.5" />
                  )}
                </button>
              );
            })}
          </nav>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
