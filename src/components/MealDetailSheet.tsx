import React, { useState } from 'react';
import { MealItem } from '../types';
import { useApp } from '../store/appStore';
import { X, Clock, MapPin, ShieldCheck, AlertCircle, ArrowRight, Sparkles, Utensils } from 'lucide-react';

interface MealDetailSheetProps {
  meal: MealItem | null;
  onClose: () => void;
}

export const MealDetailSheet: React.FC<MealDetailSheetProps> = ({ meal, onClose }) => {
  const { role, language, claimMeal, t } = useApp();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  if (!meal) return null;

  const handleClaim = async () => {
    setIsClaiming(true);
    await claimMeal(meal.id);
    setIsClaiming(false);
    setShowConfirmModal(false);
    onClose();
  };

  const binColorMap = {
    DONATE: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', dot: 'bg-emerald-500' },
    SHELF_LIFE: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', dot: 'bg-amber-500' },
    RECYCLE: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', dot: 'bg-blue-500' },
    THROW_AWAY: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300', dot: 'bg-rose-500' }
  };

  const binStyle = binColorMap[meal.classification] || binColorMap.DONATE;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet Drawer */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white rounded-t-3xl z-50 p-5 shadow-2xl border-t border-amber-200 animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${binStyle.bg} ${binStyle.text} ${binStyle.border}`}>
                <span className={`w-2 h-2 rounded-full ${binStyle.dot}`} />
                {meal.classification}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t.aiVerifiedBadge}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#000080]">
              {language === 'hi' ? meal.dishNameHi : meal.dishName}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{meal.sourceName}</span>
              <span>·</span>
              <span>{meal.locationArea}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Food Illustration Hero Banner */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-amber-200 flex items-center justify-center text-2xl">
              🍲
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tabular-nums">
                {meal.quantityPlates > 0 ? `${meal.quantityPlates} ${t.plates}` : `${meal.quantityKg} ${t.kg}`}
              </div>
              <div className="text-xs text-slate-600 font-medium">
                {meal.quantityKg} kg {language === 'hi' ? 'शुद्ध शाकाहारी भोजन' : 'balanced nutritious meal'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
              <Clock className="w-3.5 h-3.5" />
              <span>{t.safeFor} {meal.safeForHours}h</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {language === 'hi' ? 'तैयारी:' : 'Prepped:'} {meal.preparedAt}
            </div>
          </div>
        </div>

        {/* Shortest Route Preview Card */}
        {meal.bestMatch && (
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-[#000080] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {t.shortestRoute} (AI Optimal Match)
              </span>
              <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                {meal.bestMatch.distanceKm} km · {meal.bestMatch.etaMin} min
              </span>
            </div>
            <div className="text-xs text-slate-700">
              <span className="font-semibold">{meal.bestMatch.ngoName}</span>
              <span className="text-slate-500"> ({meal.bestMatch.reasons[0]})</span>
            </div>
          </div>
        )}

        {/* AI Scientific Rationale */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-4">
          <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.whyClassification}</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            {language === 'hi' ? meal.classificationReasonHi : meal.classificationReason}
          </p>

          <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap gap-2 text-[11px]">
            <span className="text-slate-500">{t.allergens}:</span>
            {(language === 'hi' ? meal.allergensHi : meal.allergens).map((alg, i) => (
              <span key={i} className="font-medium text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {alg}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full py-3.5 px-4 rounded-xl bg-[#138808] hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Utensils className="w-4 h-4" />
            <span>{role === 'ngo' ? t.pickupButton : t.claimButton}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

      {/* 1-Tap Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-amber-300 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-[#000080]">
              {t.claimConfirmTitle}
            </h3>

            <p className="text-xs text-slate-600 text-center mt-2 mb-5 leading-relaxed">
              {t.claimConfirmDesc}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-100"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleClaim}
                disabled={isClaiming}
                className="flex-1 py-2.5 rounded-xl bg-[#138808] text-white font-bold text-xs hover:bg-emerald-700 shadow-sm disabled:opacity-50"
              >
                {isClaiming ? 'Processing...' : t.confirmClaim}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
