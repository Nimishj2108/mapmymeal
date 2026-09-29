import React, { useState } from 'react';
import { useApp } from '../store/appStore';
import { DeliveryPackage, DeliveryStatus } from '../types';
import { QrStickerModal } from '../components/QrStickerModal';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowRight,
  BatteryCharging,
  ThermometerSnowflake
} from 'lucide-react';

export const TrackScreen: React.FC = () => {
  const {
    role,
    language,
    deliveries,
    advanceDeliveryStatus,
    submitDeliveryRating,
    t
  } = useApp();

  const [selectedDeliveryForQr, setSelectedDeliveryForQr] = useState<DeliveryPackage | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const activeDelivery = deliveries[0]; // Primary active package for tracking demo

  const statusSteps: Array<{ key: DeliveryStatus; label: string; desc: string }> = [
    { key: 'PUBLISHED', label: t.statusPublished, desc: 'Batch registered on DTU Node' },
    { key: 'MATCHED', label: t.statusMatched, desc: 'Routed to Sewa Foundation Kamla Nagar' },
    { key: 'PICKED_UP', label: t.statusPickedUp, desc: 'Volunteer verified thermal seal' },
    { key: 'IN_TRANSIT', label: t.statusInTransit, desc: 'Hero Electric EV moving on Outer Ring Rd' },
    { key: 'DELIVERED', label: t.statusDelivered, desc: 'Delivered & verified by recipient' }
  ];

  const getStepState = (stepKey: DeliveryStatus, currentStatus: DeliveryStatus) => {
    const order: DeliveryStatus[] = ['PUBLISHED', 'MATCHED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
    const curIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(stepKey);
    if (stepIdx < curIdx) return 'completed';
    if (stepIdx === curIdx) return 'current';
    return 'upcoming';
  };

  const donorChips = [
    'Recipient promptness',
    'Flexibility & response',
    'Food temperature maintained',
    'Smooth volunteer handover'
  ];

  const recipientChips = [
    'Timely hot delivery',
    'Food freshness & taste',
    'Clean sanitized container',
    'Courteous volunteer'
  ];

  const currentChipsList = role === 'donor' ? donorChips : recipientChips;

  const toggleChip = (chip: string) => {
    setSelectedChips(prev =>
      prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]
    );
  };

  const handleSubmitRating = () => {
    if (!activeDelivery) return;
    submitDeliveryRating(activeDelivery.id, ratingValue, selectedChips);
    setFeedbackSubmitted(true);
  };

  if (!activeDelivery) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active delivery packages found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-2 max-w-lg mx-auto w-full">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {language === 'hi' ? 'सक्रिय पैकेज लाइव ट्रैकिंग' : 'Active Package Live Tracking'}
          </span>
          <h2 className="text-lg font-bold text-[#000080]">
            {language === 'hi' ? activeDelivery.dishNameHi : activeDelivery.dishName}
          </h2>
        </div>

        <button
          onClick={() => setSelectedDeliveryForQr(activeDelivery)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs hover:bg-amber-100 transition-colors"
        >
          <QrCode className="w-4 h-4 text-[#FF9933]" />
          <span>{language === 'hi' ? 'NFT सील' : 'NFT Seal'}</span>
        </button>
      </div>

      {/* Mini Delhi Route Progress Map */}
      <div className="relative aspect-[16/9] w-full rounded-2xl bg-[#F6F4ED] border border-amber-200 overflow-hidden shadow-xs">
        <svg viewBox="150 120 320 220" className="w-full h-full">
          {/* Subtle base roads */}
          <line x1="200" y1="160" x2="420" y2="320" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round" />
          <line x1="200" y1="160" x2="420" y2="320" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

          {/* Route path completed */}
          <line
            x1={activeDelivery.donorCoords.x}
            y1={activeDelivery.donorCoords.y}
            x2={activeDelivery.currentCoords.x}
            y2={activeDelivery.currentCoords.y}
            stroke="#138808"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Donor Point */}
          <circle cx={activeDelivery.donorCoords.x} cy={activeDelivery.donorCoords.y} r="8" fill="#FF9933" />
          <text x={activeDelivery.donorCoords.x} y={activeDelivery.donorCoords.y - 12} textAnchor="middle" fill="#C2410C" fontSize="9" fontWeight="700">
            DTU
          </text>

          {/* Recipient Point */}
          <circle cx={activeDelivery.recipientCoords.x} cy={activeDelivery.recipientCoords.y} r="8" fill="#000080" />
          <text x={activeDelivery.recipientCoords.x} y={activeDelivery.recipientCoords.y + 16} textAnchor="middle" fill="#000080" fontSize="9" fontWeight="700">
            Sewa NGO
          </text>

          {/* Moving Vehicle Marker */}
          <g transform={`translate(${activeDelivery.currentCoords.x}, ${activeDelivery.currentCoords.y})`}>
            <circle cx="0" cy="0" r="14" fill="#138808" fillOpacity="0.25" className="animate-ping" />
            <circle cx="0" cy="0" r="9" fill="#138808" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="3.5" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold">
              EV
            </text>
          </g>
        </svg>

        {/* Live Status Overlay Pill */}
        <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-800 shadow-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{activeDelivery.status.replace('_', ' ')}</span>
          <span className="text-slate-300">·</span>
          <span className="text-blue-700 font-mono">{activeDelivery.progressPercent}%</span>
        </div>

        <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
          ETA: {activeDelivery.status === 'DELIVERED' ? 'Arrived ✓' : `${activeDelivery.etaMinutes} min (${activeDelivery.distanceKm} km)`}
        </div>
      </div>

      {/* Driver & Courier Card */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xl">
            🛵
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              {activeDelivery.volunteerName}
            </h4>
            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
              <span>{activeDelivery.vehicleInfo}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg text-[10px] font-bold text-blue-700 border border-blue-200">
          <ThermometerSnowflake className="w-3 h-3 text-blue-600" />
          <span>Hot-Hold 62°C</span>
        </div>
      </div>

      {/* Advance Simulation Step Button */}
      {activeDelivery.status !== 'DELIVERED' && (
        <button
          onClick={() => advanceDeliveryStatus(activeDelivery.id)}
          className="w-full py-2.5 rounded-xl bg-[#000080] hover:bg-navy-900 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <span>{language === 'hi' ? 'अगला स्थिति चरण आगे बढ़ाएं (डेमो)' : 'Advance Delivery Stage (Demo Trigger)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {/* Milestone Timeline */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-[#000080] mb-3">
          {language === 'hi' ? 'वितरण मील के पत्थर' : 'Delivery Milestones'}
        </h3>

        <div className="space-y-4">
          {statusSteps.map((step, idx) => {
            const state = getStepState(step.key, activeDelivery.status);

            return (
              <div key={step.key} className="flex items-start gap-3 relative">
                {idx < statusSteps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-6 bottom-0 w-0.5 -mb-4 ${
                      state === 'completed' ? 'bg-[#138808]' : 'bg-slate-200'
                    }`}
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                    state === 'completed'
                      ? 'bg-[#138808] text-white'
                      : state === 'current'
                      ? 'bg-[#FF9933] text-white ring-4 ring-amber-100 animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {state === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                  ) : (
                    idx + 1
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        state === 'current'
                          ? 'text-[#FF9933]'
                          : state === 'completed'
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {state === 'current' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* On Delivery Feedback Section */}
      {activeDelivery.status === 'DELIVERED' && (
        <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-emerald-950">
              {t.feedbackTitle}
            </h3>
          </div>

          {feedbackSubmitted ? (
            <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center text-xs text-emerald-800 font-bold">
              ✓ {language === 'hi' ? 'प्रतिक्रिया दर्ज हुई! +25 अन्नदाता अंक प्राप्त।' : 'Feedback submitted! +25 Loyalty points credited.'}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Star Rating */}
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRatingValue(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= ratingValue ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Quick Feedback Chips */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {currentChipsList.map(chip => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      onClick={() => toggleChip(chip)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#138808] text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleSubmitRating}
                className="w-full py-2.5 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
              >
                {t.submitFeedback}
              </button>
            </div>
          )}
        </div>
      )}

      {/* NFT QR Code Modal */}
      <QrStickerModal
        delivery={selectedDeliveryForQr}
        onClose={() => setSelectedDeliveryForQr(null)}
        onScanAdvance={advanceDeliveryStatus}
      />
    </div>
  );
};
