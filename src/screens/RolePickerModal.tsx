import React from 'react';
import { useApp } from '../store/appStore';
import { UserRole } from '../types';
import { HeartHandshake, UtensilsCrossed, Building2, Check, ArrowRight } from 'lucide-react';
import { TricolorBar } from '../components/TricolorBar';

export const RolePickerModal: React.FC = () => {
  const { role, setRole, closeRolePicker, showRolePicker, language, t } = useApp();

  if (!showRolePicker) return null;

  const roles = [
    {
      id: 'donor' as UserRole,
      titleHi: 'मैं खाना बाँटना चाहता हूँ',
      titleEn: 'I have surplus food (Donor)',
      descHi: 'कैंटीन, हॉस्टल मेस, विवाह भवन, व्यक्ति',
      descEn: 'Canteens, hostel messes, banquet halls, individuals',
      icon: HeartHandshake,
      accentColor: 'border-[#FF9933] bg-amber-50/50 hover:bg-amber-50',
      iconBg: 'bg-[#FF9933] text-white',
      badge: 'Canteen / Mess'
    },
    {
      id: 'recipient' as UserRole,
      titleHi: 'मुझे खाना चाहिए',
      titleEn: 'I need food (Recipient)',
      descHi: 'विद्यार्थी, जरूरतमंद नागरिक, समुदाय सदस्य',
      descEn: 'Students, individuals, community members',
      icon: UtensilsCrossed,
      accentColor: 'border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50',
      iconBg: 'bg-[#138808] text-white',
      badge: 'Student / Individual'
    },
    {
      id: 'ngo' as UserRole,
      titleHi: 'हम NGO / आश्रय हैं',
      titleEn: 'We are an NGO or shelter',
      descHi: 'पंजीकृत संगठन, रैन बसेरा, कम्युनिटी किचन',
      descEn: 'Registered charities, night shelters, community kitchens',
      icon: Building2,
      accentColor: 'border-[#000080] bg-blue-50/50 hover:bg-blue-50',
      iconBg: 'bg-[#000080] text-white',
      badge: 'NGO / Trust'
    }
  ];

  const handleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    closeRolePicker();
  };

  return (
    <div className="fixed inset-0 z-80 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-amber-200 animate-in zoom-in-95 duration-200">
        <TricolorBar height="h-2" />

        <div className="p-6">
          <div className="text-center mb-5">
            <h2 className="text-xl font-extrabold text-[#000080]">
              {t.selectRoleTitle}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.selectRoleSubtitle}
            </p>
          </div>

          <div className="space-y-3">
            {roles.map(item => {
              const Icon = item.icon;
              const isSelected = role === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 relative active:scale-[0.98] ${
                    isSelected
                      ? `${item.accentColor} ring-2 ring-[#000080]/20 shadow-sm`
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">
                        {language === 'hi' ? item.titleHi : item.titleEn}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                      {language === 'hi' ? item.descHi : item.descEn}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#138808] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={() => handleSelect('donor')}
              className="text-slate-500 hover:text-slate-800 font-medium"
            >
              {t.skipExplore}
            </button>
            <span className="text-[11px] text-slate-400">
              {language === 'hi' ? 'प्रोफ़ाइल से कभी भी बदलें' : 'Editable anytime in Profile'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
