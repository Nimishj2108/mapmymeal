import React, { useState, useEffect } from 'react';
import { useApp } from '../store/appStore';
import { MealItem, NGOEntity } from '../types';
import { DelhiSvgMap } from '../components/DelhiSvgMap';
import { MealDetailSheet } from '../components/MealDetailSheet';
import { Search, Plus, Sparkles, Clock, ShieldCheck, MapPin, ArrowRight, Utensils, AlertCircle } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    role,
    language,
    meals,
    ngos,
    selectedMealForDetail,
    setSelectedMealForDetail,
    setActiveTab,
    routePolylineActive,
    t
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'surplus' | 'ngos' | 'kitchens'>('all');
  const [tickerIndex, setTickerIndex] = useState(0);

  // Simulated live activity ticker items
  const tickerEvents = [
    { hi: 'राहुल ने अटल कैंटीन से 20 थाली राजमा चावल आरक्षित किया · 2 मिनट पूर्व', en: 'Rahul claimed 20 plates of Rajma Chawal from Atal Canteen · 2 min ago' },
    { hi: 'DTU हॉस्टल मेस ने 65 थाली दाल मखनी अधिशेष घोषित किया · 6 मिनट पूर्व', en: 'DTU Hostel Mess posted 65 plates of Dal Makhani surplus · 6 min ago' },
    { hi: 'सेवा फाउंडेशन कमला नगर ने 40 थालियाँ सफलतापूर्वक प्राप्त कीं · 11 मिनट पूर्व', en: 'Sewa Foundation Kamla Nagar received 40 meal plates · 11 min ago' },
    { hi: 'रॉबिन हुड आर्मी वाहन DTU परिसर से रवाना · 15 मिनट पूर्व', en: 'Robin Hood Army EV vehicle en route from DTU campus · 15 min ago' }
  ];

  // Rotate ticker every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerEvents.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [tickerEvents.length]);

  // Filtered meals
  const filteredMeals = meals
    .filter(m => !m.claimed)
    .filter(m => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.dishName.toLowerCase().includes(q) ||
        m.dishNameHi.includes(q) ||
        m.sourceName.toLowerCase().includes(q) ||
        m.locationArea.toLowerCase().includes(q)
      );
    });

  const handleSelectMeal = (meal: MealItem) => {
    setSelectedMealForDetail(meal);
  };

  const handleSelectNgo = (ngo: NGOEntity) => {
    // If an NGO is clicked, find matching meals or highlight it
    const matchingMeal = meals.find(m => !m.claimed && m.bestMatch?.ngoId === ngo.id);
    if (matchingMeal) {
      setSelectedMealForDetail(matchingMeal);
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-24">
      {/* Live Activity Ticker Bar */}
      <div className="bg-amber-100/70 border-b border-amber-200/90 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-amber-900 font-medium">
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-[#138808] animate-ping shrink-0" />
          <span className="font-bold text-[#000080] shrink-0">{t.liveTickerTitle}:</span>
          <span className="truncate">
            {language === 'hi' ? tickerEvents[tickerIndex].hi : tickerEvents[tickerIndex].en}
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">LIVE</span>
      </div>

      {/* Search Input Bar */}
      <div className="px-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#FF9933] shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2.5 pb-0.5">
          {[
            { id: 'all', label: t.filterAll },
            { id: 'surplus', label: t.filterSurplus },
            { id: 'ngos', label: t.filterNgos },
            { id: 'kitchens', label: t.filterKitchens }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                filterType === chip.id
                  ? 'bg-[#000080] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Hand-Drawn Delhi SVG Map */}
      <div className="px-4">
        <DelhiSvgMap
          filterType={filterType}
          onSelectMeal={handleSelectMeal}
          onSelectNgo={handleSelectNgo}
          selectedMealId={selectedMealForDetail?.id}
          activeRouteMeal={routePolylineActive ? (selectedMealForDetail || filteredMeals[0]) : null}
        />
      </div>

      {/* Nearest Surplus Meals Horizontal Feed */}
      <div className="mt-1">
        <div className="px-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#000080]">
              {t.nearestMealsTitle}
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-[#FF9933]">
              {filteredMeals.length}
            </span>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            {language === 'hi' ? 'दूरी अनुसार' : 'Sorted by distance'}
          </span>
        </div>

        {/* Horizontal Card Carousel */}
        <div className="px-4 flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x">
          {filteredMeals.length === 0 ? (
            <div className="w-full p-6 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              {language === 'hi' ? 'कोई भोजन नहीं मिला। फ़िल्टर बदलें।' : 'No meals match search query.'}
            </div>
          ) : (
            filteredMeals.map(meal => {
              const isSelected = selectedMealForDetail?.id === meal.id;

              return (
                <div
                  key={meal.id}
                  onClick={() => handleSelectMeal(meal)}
                  className={`w-72 shrink-0 snap-start bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-md active:scale-[0.99] flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#FF9933] ring-2 ring-[#FF9933]/30 bg-amber-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Top Row: Tag & Expiry */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {t.aiVerifiedBadge}
                      </span>
                      <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.safeFor} {meal.safeForHours}h
                      </span>
                    </div>

                    {/* Food Name & Visual */}
                    <div className="flex items-start gap-2.5 my-1">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-200 flex items-center justify-center text-xl shrink-0">
                        🍛
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 truncate">
                          {language === 'hi' ? meal.dishNameHi : meal.dishName}
                        </h3>
                        <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{meal.sourceName}</span>
                        </p>
                      </div>
                    </div>

                    {/* Metric Row */}
                    <div className="mt-3 py-2 px-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] block">
                          {language === 'hi' ? 'मात्रा' : 'Quantity'}
                        </span>
                        <span className="font-black text-slate-900 tabular-nums">
                          {meal.quantityPlates > 0 ? `${meal.quantityPlates} ${t.plates}` : `${meal.quantityKg} ${t.kg}`}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-500 text-[10px] block">
                          {language === 'hi' ? 'दूरी एवं समय' : 'Distance & ETA'}
                        </span>
                        <span className="font-bold text-[#000080] tabular-nums">
                          {meal.bestMatch ? `${meal.bestMatch.distanceKm} km · ${meal.bestMatch.etaMin} min` : '1.8 km · 6 min'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-600">
                      {meal.classification}
                    </span>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleSelectMeal(meal);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-[#138808] hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center gap-1 transition-all active:scale-95"
                    >
                      <span>{role === 'ngo' ? t.pickupButton : t.claimButton}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating Action Button for Donor */}
      {role === 'donor' && (
        <div className="fixed bottom-20 right-4 z-40">
          <button
            onClick={() => setActiveTab('share')}
            className="flex items-center gap-2 py-3 px-5 rounded-full bg-[#FF9933] hover:bg-[#e07f20] text-white font-extrabold text-sm shadow-xl active:scale-95 transition-all border-2 border-white"
          >
            <Plus className="w-5 h-5" />
            <span>{t.shareSurplusFloating}</span>
          </button>
        </div>
      )}

      {/* Bottom Sheet for Detailed Meal View */}
      <MealDetailSheet
        meal={selectedMealForDetail}
        onClose={() => setSelectedMealForDetail(null)}
      />
    </div>
  );
};
