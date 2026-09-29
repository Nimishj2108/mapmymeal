import React, { useState } from 'react';
import { useApp } from '../store/appStore';
import { X, ShieldCheck, KeyRound, Check } from 'lucide-react';

interface AadhaarKycModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AadhaarKycModal: React.FC<AadhaarKycModalProps> = ({ isOpen, onClose }) => {
  const { language, verifyKycMock } = useApp();
  const [aadhaarInput, setAadhaarInput] = useState('7890 2341 4092');
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStep(true);
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      const digits = aadhaarInput.replace(/\s/g, '').slice(-4) || '4092';
      verifyKycMock(digits);
      setTimeout(() => {
        setIsSuccess(false);
        setOtpStep(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-emerald-400 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-full hover:bg-slate-100 text-slate-400"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#000080]">
              {language === 'hi' ? 'त्वरित पहचान सत्यापन (KYC)' : 'Instant Identity KYC'}
            </h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
              SIH 2026 DEMO MOCK
            </span>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center animate-in zoom-in-90 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-emerald-800">
              {language === 'hi' ? 'सत्यापन पूर्ण! (KYC Verified)' : 'KYC Verified Successfully!'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'hi' ? '+50 अन्नदाता अंक आपकी प्रोफ़ाइल में जुड़ गए।' : '+50 Loyalty Points credited.'}
            </p>
          </div>
        ) : !otpStep ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'hi'
                ? 'संस्थानों एवं NGO के लिए सुरक्षित एवं पारदर्शी खाद्य वितरण नेटवर्क। (डेमो हेतु कोई भी 12 अंक मान्य हैं)'
                : 'Zero-friction trusted verification for institutional donors & volunteers. Any 12 digits accepted in demo.'}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? 'आधार संख्या / Aadhaar Number' : 'Aadhaar / Institutional ID'}
              </label>
              <input
                type="text"
                value={aadhaarInput}
                onChange={e => setAadhaarInput(e.target.value)}
                maxLength={14}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-sm tracking-wider focus:outline-hidden focus:border-[#FF9933]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#000080] hover:bg-navy-900 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? 'Sending OTP...' : (language === 'hi' ? 'OTP प्राप्त करें' : 'Get OTP on Registered Mobile')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800">
              <KeyRound className="w-4 h-4 inline mr-1 text-emerald-600" />
              <span>{language === 'hi' ? 'डेमो OTP भेजा गया: किसी भी 4 अंकों का प्रयोग करें (उदा: 1234)' : 'Demo OTP sent! Enter any 4 digits (e.g., 1234)'}</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'hi' ? '4-अंकीय OTP दर्ज करें' : 'Enter 4-Digit OTP'}
              </label>
              <input
                type="text"
                value={otpValue}
                onChange={e => setOtpValue(e.target.value)}
                maxLength={4}
                placeholder="1234"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-center text-lg tracking-widest focus:outline-hidden focus:border-[#138808]"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#138808] hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              {loading ? 'Verifying OTP...' : (language === 'hi' ? 'सत्यापित करें' : 'Verify & Activate')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
