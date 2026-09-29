import React, { useState } from 'react';
import { useApp } from '../store/appStore';
import { FoodCondition, BinClassification, MealItem } from '../types';
import { classifyFoodItem, AnalysisResult } from '../lib/classifier';
import { findBestMatchesForMeal } from '../lib/matcher';
import {
  Check,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Camera,
  ShieldCheck,
  MapPin,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Send
} from 'lucide-react';

export const ShareScreen: React.FC = () => {
  const { language, publishNewMeal, setActiveTab, t, ngos } = useApp();

  // Wizard Step: 1 = Details, 2 = AI Analysis, 3 = Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedDish, setSelectedDish] = useState('Rajma Chawal + Tawa Roti');
  const [quantity, setQuantity] = useState(40);
  const [unit, setUnit] = useState<'plates' | 'kg'>('plates');
  const [readySinceHours, setReadySinceHours] = useState(1.0);
  const [condition, setCondition] = useState<FoodCondition>('fresh');
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);

  // AI Analysis Animation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [manualOverrideBin, setManualOverrideBin] = useState<BinClassification | null>(null);

  // Sample dishes
  const commonDishes = [
    { name: 'Rajma Chawal + Tawa Roti', nameHi: 'राजमा चावल + तवा रोटी', icon: '🍛' },
    { name: 'Dal Makhani & Jeera Rice', nameHi: 'दाल मखनी व जीरा राइस', icon: '🍲' },
    { name: 'Roti-Sabzi (Seasonal Veg)', nameHi: 'रोटी-सब्जी (मौसमी सब्जी)', icon: '🥘' },
    { name: 'Poha with Roasted Peanuts', nameHi: 'पोहा भुनी मूंगफली', icon: '🥣' },
    { name: 'Vegetable Dum Biryani', nameHi: 'वेज दम बिरयानी', icon: '🍚' },
    { name: 'Idli-Sambar & Chutney', nameHi: 'इडली सांभर व चटनी', icon: '🥟' },
    { name: 'Aloo Paratha with Curd', nameHi: 'आलू पराठा व दही', icon: '🫓' },
    { name: 'Moong Dal Halwa / Sweets', nameHi: 'मूंग दाल हलवा / मिठाई', icon: '🍮' },
    { name: 'Fresh Cut Fruits / Salad', nameHi: 'ताजा कटे फल / सलाद', icon: '🥗' }
  ];

  const samplePhotos = [
    { label: 'Fresh Steam-Tray Batch', emoji: '🍛', color: 'from-amber-400 to-orange-500' },
    { label: 'Insulated Hot Container', emoji: '🍱', color: 'from-emerald-400 to-teal-600' },
    { label: 'Bulk Canteen Tiffin', emoji: '🥘', color: 'from-blue-400 to-indigo-600' }
  ];

  // Run AI analysis
  const runAiAnalysis = () => {
    setIsScanning(true);
    setScanStepIndex(0);
    setCurrentStep(2);

    const stepInterval = setInterval(() => {
      setScanStepIndex(prev => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setIsScanning(false);
          const result = classifyFoodItem(selectedDish, condition, readySinceHours, quantity);
          setAnalysisResult(result);
          setManualOverrideBin(result.classification);
          return 3;
        }
        return prev + 1;
      });
    }, 600);
  };

  const handlePublish = async () => {
    const finalBin = manualOverrideBin || analysisResult?.classification || 'DONATE';
    
    // DTU Atal Canteen Coordinates
    const sourceCoords = { x: 200, y: 160 };

    const matchInfo = findBestMatchesForMeal({
      quantityPlates: unit === 'plates' ? quantity : Math.round(quantity * 3),
      safeForHours: analysisResult?.estimatedShelfLifeHours || 3.5,
      freshnessScore: analysisResult?.freshnessScore || 90,
      coords: sourceCoords
    }, ngos);

    await publishNewMeal({
      dishName: selectedDish,
      dishNameHi: commonDishes.find(d => d.name === selectedDish)?.nameHi || selectedDish,
      category: 'meal',
      quantityPlates: unit === 'plates' ? quantity : Math.round(quantity * 3),
      quantityKg: unit === 'kg' ? quantity : Math.round(quantity * 0.35),
      sourceName: 'Atal Canteen (DTU)',
      sourceNameHi: 'अटल कैंटीन (DTU)',
      locationArea: 'DTU Rohini, Delhi',
      locationAreaHi: 'DTU रोहिणी, दिल्ली',
      coords: sourceCoords,
      readySinceMinutes: Math.round(readySinceHours * 60),
      safeForHours: analysisResult?.estimatedShelfLifeHours || 3.5,
      preparedAt: 'Just Now',
      condition,
      freshnessScore: analysisResult?.freshnessScore || 90,
      classification: finalBin,
      classificationConfidence: analysisResult?.confidence || 95,
      classificationReason: analysisResult?.scientificReason || 'Freshly prepared institutional batch.',
      classificationReasonHi: analysisResult?.scientificReasonHi || 'ताजा तैयार संस्थागत भोजन।',
      allergens: analysisResult?.allergens || ['None'],
      allergensHi: analysisResult?.allergensHi || ['कोई नहीं'],
      isVeg: true,
      bestMatch: matchInfo.bestMatch
    });

    setActiveTab('home');
  };

  // Bin Style Helper
  const getBinCardStyle = (bin: BinClassification, active: boolean) => {
    switch (bin) {
      case 'DONATE':
        return active
          ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300'
          : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100';
      case 'SHELF_LIFE':
        return active
          ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
          : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100';
      case 'RECYCLE':
        return active
          ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
          : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100';
      case 'THROW_AWAY':
        return active
          ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300'
          : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100';
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-2 max-w-lg mx-auto w-full">
      {/* Step Progress Indicators */}
      <div className="flex items-center justify-between px-2 pt-1">
        {[
          { step: 1, label: t.step1Title },
          { step: 2, label: t.step2Title },
          { step: 3, label: t.step3Title }
        ].map((item, index) => (
          <div key={item.step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === item.step
                    ? 'bg-[#FF9933] text-white shadow-xs'
                    : currentStep > item.step
                    ? 'bg-[#138808] text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {currentStep > item.step ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.step}
              </div>
              <span className="text-[10px] font-semibold text-slate-500 mt-1 whitespace-nowrap">
                {item.label.split(' ')[0]}
              </span>
            </div>
            {index < 2 && (
              <div
                className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${
                  currentStep > item.step ? 'bg-[#138808]' : 'bg-slate-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1: Meal Details */}
      {currentStep === 1 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-[#000080]">
              {t.selectDish}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'त्वरित चयन चिप्स से चुनें अथवा कस्टम नाम दें' : 'Tap quick-pick chips or enter custom dish'}
            </p>
          </div>

          {/* Quick Dish Selection Chips */}
          <div className="grid grid-cols-3 gap-2">
            {commonDishes.map(dish => {
              const isSelected = selectedDish === dish.name;
              return (
                <button
                  key={dish.name}
                  onClick={() => setSelectedDish(dish.name)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 active:scale-95 ${
                    isSelected
                      ? 'bg-amber-500/15 border-[#FF9933] ring-2 ring-[#FF9933]/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{dish.icon}</span>
                  <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                    {language === 'hi' ? dish.nameHi : dish.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quantity Stepper */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                {t.quantity}
              </label>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setUnit('plates')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    unit === 'plates' ? 'bg-white text-[#000080] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  {t.plates}
                </button>
                <button
                  onClick={() => setUnit('kg')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    unit === 'kg' ? 'bg-white text-[#000080] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  {t.kg}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              <button
                onClick={() => setQuantity(Math.max(5, quantity - 10))}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-lg flex items-center justify-center active:scale-95"
              >
                -
              </button>
              <div className="text-center">
                <span className="text-3xl font-black text-[#000080] tabular-nums">
                  {quantity}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1.5">
                  {unit === 'plates' ? t.plates : t.kg}
                </span>
              </div>
              <button
                onClick={() => setQuantity(quantity + 10)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-lg flex items-center justify-center active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          {/* Ready Since Time & Condition Slider */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                <span className="text-slate-700">{t.readySince}</span>
                <span className="text-[#FF9933] tabular-nums font-mono">{readySinceHours} hrs ago</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={readySinceHours}
                onChange={e => setReadySinceHours(parseFloat(e.target.value))}
                className="w-full accent-[#FF9933] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>30 mins</span>
                <span>2 hours</span>
                <span>4 hours</span>
                <span>6+ hours</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-700 mb-1.5">
                {t.condition}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'fresh', label: t.conditionFresh },
                  { id: 'stale', label: t.conditionStale },
                  { id: 'spoiled', label: t.conditionSpoiled }
                ].map(cond => (
                  <button
                    key={cond.id}
                    onClick={() => setCondition(cond.id as FoodCondition)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all border text-center ${
                      condition === cond.id
                        ? cond.id === 'fresh'
                          ? 'bg-emerald-500 text-white border-emerald-600'
                          : cond.id === 'stale'
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-rose-500 text-white border-rose-600'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Picker */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.samplePhoto}</span>
            </span>
            <div className="grid grid-cols-3 gap-2">
              {samplePhotos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIdx(idx)}
                  className={`p-3 rounded-2xl border text-center transition-all bg-gradient-to-br ${photo.color} text-white flex flex-col items-center justify-center gap-1 ${
                    selectedPhotoIdx === idx ? 'ring-3 ring-[#000080] scale-102 shadow-md' : 'opacity-85'
                  }`}
                >
                  <span className="text-2xl">{photo.emoji}</span>
                  <span className="text-[10px] font-bold line-clamp-1 leading-tight">{photo.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="pt-2">
            <button
              onClick={runAiAnalysis}
              className="w-full py-3.5 rounded-xl bg-[#FF9933] hover:bg-[#e07f20] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'AI विश्लेषण चलाएं' : 'Run AI Analysis & Classify'}</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI Analysis & 4-Bin Classification */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {isScanning ? (
            /* Animated Scanner */
            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-md text-center">
              <div className="relative w-48 h-36 mx-auto rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center mb-5">
                <span className="text-5xl">{samplePhotos[selectedPhotoIdx].emoji}</span>
                {/* Laser scan line */}
                <div className="absolute inset-x-0 h-1 bg-[#138808] shadow-[0_0_12px_#138808] animate-bounce" />
              </div>

              <h3 className="text-base font-bold text-[#000080] mb-3">
                {t.analyzingFood}
              </h3>

              <div className="space-y-2 text-left max-w-xs mx-auto">
                {[
                  t.aiStepDetecting,
                  t.aiStepFreshness,
                  t.aiStepShelfLife,
                  t.aiStepClassifying
                ].map((stepText, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {idx < scanStepIndex ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : idx === scanStepIndex ? (
                      <span className="w-4 h-4 rounded-full border-2 border-[#FF9933] border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-200 shrink-0" />
                    )}
                    <span className={idx <= scanStepIndex ? 'text-slate-800 font-semibold' : 'text-slate-400'}>
                      {stepText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            analysisResult && (
              <>
                {/* Scan Result Metrics */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Detected Item
                      </span>
                      <h3 className="text-base font-black text-[#000080]">
                        {selectedDish}
                      </h3>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      {analysisResult.confidence}% Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                      <span className="text-[10px] text-slate-500 font-semibold block">{t.freshnessScore}</span>
                      <span className="text-2xl font-black text-[#FF9933] tabular-nums">
                        {analysisResult.freshnessScore}%
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-[10px] text-slate-500 font-semibold block">{t.shelfLifeEstimate}</span>
                      <span className="text-2xl font-black text-[#138808] tabular-nums">
                        {analysisResult.estimatedShelfLifeHours}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4-Bin Allocation Cards */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">
                      {language === 'hi' ? 'AI 4-बिन निर्णय' : 'AI 4-Bin Scientific Allocation'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {language === 'hi' ? 'टैप करके मैन्युअल बदलें' : 'Tap to override'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'DONATE' as BinClassification, title: t.binDonate, desc: t.binDonateDesc },
                      { id: 'SHELF_LIFE' as BinClassification, title: t.binShelfLife, desc: t.binShelfLifeDesc },
                      { id: 'RECYCLE' as BinClassification, title: t.binRecycle, desc: t.binRecycleDesc },
                      { id: 'THROW_AWAY' as BinClassification, title: t.binThrowAway, desc: t.binThrowAwayDesc }
                    ].map(bin => {
                      const isActive = manualOverrideBin === bin.id;
                      return (
                        <button
                          key={bin.id}
                          onClick={() => setManualOverrideBin(bin.id)}
                          className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${getBinCardStyle(
                            bin.id,
                            isActive
                          )}`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-xs">{bin.title}</span>
                              {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <p className="text-[10px] mt-1 leading-snug opacity-90">
                              {bin.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scientific Explanation */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{t.whyClassification}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {language === 'hi' ? analysisResult.scientificReasonHi : analysisResult.scientificReason}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="py-3 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
                  </button>

                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'hi' ? 'आगे बढ़ें (पुष्टि)' : 'Proceed to Confirmation'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )
          )}
        </div>
      )}

      {/* STEP 3: Confirm and Publish to Blockchain */}
      {currentStep === 3 && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <h2 className="text-lg font-bold text-[#000080]">
              {t.step3Title}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'hi' ? 'अंतिम विवरण जांचें और दिल्ली लाइव ग्रिड पर साझा करें' : 'Review batch summary and broadcast to Delhi grid'}
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-white p-4 rounded-2xl border border-amber-300 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Food Batch</span>
                <h3 className="font-extrabold text-base text-slate-900">{selectedDish}</h3>
                <span className="text-xs text-slate-500">Atal Canteen (DTU) · Rohini Sector 16</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#FF9933] tabular-nums">
                  {quantity} {unit === 'plates' ? t.plates : t.kg}
                </span>
                <span className="text-[10px] block font-bold text-emerald-700">
                  {manualOverrideBin || 'DONATE'}
                </span>
              </div>
            </div>

            {/* AI Recipient Match Winner */}
            <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-[#000080] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  {t.bestMatchTitle}
                </span>
                <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                  96% Match
                </span>
              </div>
              <div className="text-xs font-bold text-slate-800">
                Sewa Foundation Kamla Nagar
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                Distance: 1.8 km · 6 min arrival · Lowest loss score L = 0.0875
              </div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF9933] shrink-0" />
              <span>
                {language === 'hi'
                  ? 'यह क्रिया अपरिवर्तनीय SHA-256 ब्लॉकचेन बहीखाते में दर्ज होगी।'
                  : 'Action will append a tamper-proof SHA-256 block to the public decision ledger.'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="py-3 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
            </button>

            <button
              onClick={handlePublish}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{t.publishToMap}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
