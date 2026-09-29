import React, { useState } from 'react';
import { MealItem, NGOEntity } from '../types';
import { useApp } from '../store/appStore';
import { Navigation, ZoomIn, ZoomOut, Compass, Layers } from 'lucide-react';

interface DelhiSvgMapProps {
  filterType: 'all' | 'surplus' | 'ngos' | 'kitchens';
  onSelectMeal: (meal: MealItem) => void;
  onSelectNgo?: (ngo: NGOEntity) => void;
  selectedMealId?: string | null;
  activeRouteMeal?: MealItem | null;
}

export const DelhiSvgMap: React.FC<DelhiSvgMapProps> = ({
  filterType,
  onSelectMeal,
  onSelectNgo,
  selectedMealId,
  activeRouteMeal
}) => {
  const { meals, ngos, language } = useApp();
  const [isDtuZoomed, setIsDtuZoomed] = useState(false);

  // Filter meals & ngos based on selected chip
  const visibleMeals = meals.filter(m => !m.claimed && (filterType === 'all' || filterType === 'surplus'));
  
  const visibleNgos = ngos.filter(n => {
    if (filterType === 'all') return true;
    if (filterType === 'ngos') return n.type === 'ngo' || n.type === 'shelter';
    if (filterType === 'kitchens') return n.type === 'kitchen';
    return false;
  });

  // Target route points
  const activeRoute = activeRouteMeal || (selectedMealId ? meals.find(m => m.id === selectedMealId) : null);
  const routeTargetNgo = activeRoute?.bestMatch
    ? ngos.find(n => n.id === activeRoute.bestMatch?.ngoId) || ngos[0]
    : null;

  // ViewBox: default Delhi view vs Zoomed DTU campus view
  const viewBox = isDtuZoomed ? '140 100 240 180' : '100 40 680 480';

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#F7F5EE] rounded-2xl overflow-hidden border border-amber-200/60 shadow-sm select-none">
      {/* Map Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setIsDtuZoomed(!isDtuZoomed)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 ${
            isDtuZoomed
              ? 'bg-[#FF9933] text-white'
              : 'bg-white/95 text-[#000080] hover:bg-white border border-slate-200'
          }`}
          title={isDtuZoomed ? 'Switch to Delhi Overview' : 'Zoom into DTU Campus'}
        >
          {isDtuZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
          <span>{isDtuZoomed ? (language === 'hi' ? 'दिल्ली' : 'Delhi') : (language === 'hi' ? 'DTU परिसर' : 'DTU Focus')}</span>
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200/80 text-[11px] font-medium text-slate-700 shadow-xs">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933] inline-block animate-pulse" />
          <span>{language === 'hi' ? 'अतिरिक्त भोजन' : 'Surplus'}</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#000080] inline-block" />
          <span>NGO</span>
        </span>
        <span className="text-slate-300">|</span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#138808] inline-block" />
          <span>{language === 'hi' ? 'रसोई' : 'Kitchen'}</span>
        </span>
      </div>

      {/* Hand-Drawn Delhi SVG Canvas */}
      <svg
        viewBox={viewBox}
        className="w-full h-full transition-all duration-700 ease-in-out cursor-grab active:cursor-grabbing"
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="delhiGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#EAE6DA" strokeWidth="0.8" />
          </pattern>

          {/* Pulse animation keyframes for pins */}
          <radialGradient id="saffronGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9933" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF9933" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Map Grid & Terrain */}
        <rect x="0" y="0" width="1000" height="700" fill="#FBF9F3" />
        <rect x="0" y="0" width="1000" height="700" fill="url(#delhiGrid)" />

        {/* Northern Ridge & Green Belt (Delhi Aravali Ridge) */}
        <path
          d="M 390 260 Q 420 220 460 210 Q 510 240 480 320 Q 430 360 380 310 Z"
          fill="#E7EFE0"
          stroke="#D3E2C6"
          strokeWidth="1.2"
        />
        <text x="440" y="270" fill="#759365" fontSize="9" fontWeight="600" opacity="0.7">
          Northern Ridge
        </text>

        {/* Rohini Eco Park Area */}
        <path
          d="M 170 120 Q 240 100 270 150 Q 230 200 160 170 Z"
          fill="#E7EFE0"
          stroke="#D3E2C6"
          strokeWidth="1"
        />

        {/* The Yamuna River Flowing through Delhi */}
        <path
          d="M 720 10 Q 660 110 630 190 Q 600 270 635 340 Q 660 410 690 490 Q 720 560 740 650"
          fill="none"
          stroke="#CBE2F8"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 720 10 Q 660 110 630 190 Q 600 270 635 340 Q 660 410 690 490 Q 720 560 740 650"
          fill="none"
          stroke="#93C5FD"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text x="645" y="160" fill="#3B82F6" fontSize="10" fontWeight="700" opacity="0.8" transform="rotate(72 645 160)">
          ~ Yamuna River (यमुना) ~
        </text>

        {/* Delhi Major Corridors & Road Network */}
        {/* GT Karnal Road / NH44 */}
        <path
          d="M 210 60 L 320 180 L 440 250 L 510 320 L 580 430"
          fill="none"
          stroke="#E2E2E8"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 210 60 L 320 180 L 440 250 L 510 320 L 580 430"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Outer Ring Road Corridor */}
        <path
          d="M 120 180 Q 280 130 460 190 Q 590 220 670 290"
          fill="none"
          stroke="#E2E2E8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="M 120 180 Q 280 130 460 190 Q 590 220 670 290"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.8"
        />

        {/* Inner Ring Road */}
        <path
          d="M 280 340 Q 380 290 530 330 Q 610 360 640 430"
          fill="none"
          stroke="#E2E2E8"
          strokeWidth="5"
        />

        {/* Secondary connecting avenues */}
        <line x1="420" y1="320" x2="480" y2="290" stroke="#EAEAEF" strokeWidth="3" />
        <line x1="480" y1="290" x2="460" y2="220" stroke="#EAEAEF" strokeWidth="3" />
        <line x1="310" y1="280" x2="420" y2="320" stroke="#EAEAEF" strokeWidth="3" />
        <line x1="340" y1="400" x2="420" y2="320" stroke="#EAEAEF" strokeWidth="3" />
        <line x1="200" y1="160" x2="310" y2="280" stroke="#EAEAEF" strokeWidth="3" />
        <line x1="200" y1="160" x2="420" y2="320" stroke="#EAEAEF" strokeWidth="3.5" />

        {/* Road Label */}
        <text x="270" y="145" fill="#9CA3AF" fontSize="8" fontWeight="600">
          GT Karnal Rd (NH44)
        </text>
        <text x="500" y="210" fill="#9CA3AF" fontSize="8" fontWeight="600">
          Outer Ring Rd
        </text>

        {/* Area District Labels */}
        <g className="district-labels pointer-events-none select-none">
          <text x="420" y="342" textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="700">
            Kamla Nagar
          </text>
          <text x="560" y="372" textAnchor="middle" fill="#4B5563" fontSize="10" fontWeight="700">
            Civil Lines
          </text>
          <text x="480" y="306" textAnchor="middle" fill="#1E3A8A" fontSize="10" fontWeight="700">
            Univ. of Delhi
          </text>
          <text x="460" y="208" textAnchor="middle" fill="#4B5563" fontSize="9" fontWeight="600">
            GTB Nagar
          </text>
          <text x="615" y="228" textAnchor="middle" fill="#4B5563" fontSize="9" fontWeight="600">
            Majnu Ka Tila
          </text>
          <text x="340" y="420" textAnchor="middle" fill="#4B5563" fontSize="9" fontWeight="600">
            Shastri Nagar
          </text>
          <text x="320" y="348" textAnchor="middle" fill="#4B5563" fontSize="9" fontWeight="600">
            Vivekanand Puri
          </text>
          <text x="300" y="270" textAnchor="middle" fill="#4B5563" fontSize="9" fontWeight="600">
            Ashok Vihar
          </text>
          <text x="580" y="118" textAnchor="middle" fill="#4B5563" fontSize="9" fontWeight="600">
            Wazirabad
          </text>
        </g>

        {/* DTU Campus Zone Callout Boundary */}
        <g>
          <rect
            x="175"
            y="125"
            width="85"
            height="85"
            rx="12"
            fill="#FEF3C7"
            fillOpacity="0.45"
            stroke="#F59E0B"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <text x="217" y="122" textAnchor="middle" fill="#B45309" fontSize="9" fontWeight="800">
            DTU CAMPUS (रोहिणी)
          </text>

          {isDtuZoomed && (
            <>
              {/* Internal DTU Campus Buildings */}
              <rect x="186" y="148" width="26" height="18" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
              <text x="199" y="160" textAnchor="middle" fill="#92400E" fontSize="6.5" fontWeight="700">Atal Canteen</text>

              <rect x="218" y="136" width="28" height="16" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
              <text x="232" y="147" textAnchor="middle" fill="#92400E" fontSize="6.5" fontWeight="700">Main Canteen</text>

              <rect x="202" y="174" width="36" height="20" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="1" />
              <text x="220" y="186" textAnchor="middle" fill="#92400E" fontSize="6" fontWeight="700">Mess (Hostel 7-13)</text>

              <circle cx="198" cy="198" r="8" fill="#DCFCE7" stroke="#16A34A" strokeWidth="1" />
              <text x="198" y="200" textAnchor="middle" fill="#15803D" fontSize="5.5" fontWeight="700">BioGas</text>
            </>
          )}
        </g>

        {/* Shortest Route Polyline if Meal Selected or Route Active */}
        {activeRoute && routeTargetNgo && (
          <g className="route-layer">
            {/* Alternative Route (Dashed Slate) */}
            <path
              d={`M ${activeRoute.coords.x} ${activeRoute.coords.y} Q ${activeRoute.coords.x + 30} ${activeRoute.coords.y + 110} ${routeTargetNgo.coords.x} ${routeTargetNgo.coords.y}`}
              fill="none"
              stroke="#94A3B8"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* Shortest Route (Primary Bold Electric Blue with pulsing glow) */}
            <path
              d={`M ${activeRoute.coords.x} ${activeRoute.coords.y} L ${Math.round((activeRoute.coords.x + routeTargetNgo.coords.x) / 2 - 15)} ${Math.round((activeRoute.coords.y + routeTargetNgo.coords.y) / 2)} L ${routeTargetNgo.coords.x} ${routeTargetNgo.coords.y}`}
              fill="none"
              stroke="#2563EB"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Animated dashed overlay on the route */}
            <path
              d={`M ${activeRoute.coords.x} ${activeRoute.coords.y} L ${Math.round((activeRoute.coords.x + routeTargetNgo.coords.x) / 2 - 15)} ${Math.round((activeRoute.coords.y + routeTargetNgo.coords.y) / 2)} L ${routeTargetNgo.coords.x} ${routeTargetNgo.coords.y}`}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="8 6"
              className="animate-pulse"
            />

            {/* Route Distance ETA Pill on Map */}
            <g transform={`translate(${Math.round((activeRoute.coords.x + routeTargetNgo.coords.x) / 2 - 35)}, ${Math.round((activeRoute.coords.y + routeTargetNgo.coords.y) / 2 - 14)})`}>
              <rect x="0" y="0" width="70" height="20" rx="10" fill="#000080" />
              <text x="35" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="700">
                1.8 km · 6 min
              </text>
            </g>
          </g>
        )}

        {/* You Are Here Blue Pulsing Dot */}
        <g transform="translate(195, 145)">
          <circle cx="0" cy="0" r="14" fill="#3B82F6" fillOpacity="0.25" className="animate-ping" />
          <circle cx="0" cy="0" r="6" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
          <text x="9" y="3" fill="#1D4ED8" fontSize="8" fontWeight="800">
            You
          </text>
        </g>

        {/* NGO / Community Kitchen Pins (Navy and Green) */}
        {visibleNgos.map(ngo => {
          const isKitchen = ngo.type === 'kitchen';
          const pinColor = isKitchen ? '#138808' : '#000080';

          return (
            <g
              key={ngo.id}
              transform={`translate(${ngo.coords.x}, ${ngo.coords.y})`}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => onSelectNgo && onSelectNgo(ngo)}
              tabIndex={0}
              role="button"
              aria-label={`${ngo.name} (${ngo.type})`}
            >
              <circle cx="0" cy="0" r="11" fill="#FFFFFF" stroke={pinColor} strokeWidth="2.5" />
              <circle cx="0" cy="0" r="5" fill={pinColor} />
              <text
                x="0"
                y="-14"
                textAnchor="middle"
                fill={pinColor}
                fontSize="8"
                fontWeight="700"
                className="pointer-events-none drop-shadow-xs"
              >
                {ngo.name.split(' ')[0]}
              </text>
            </g>
          );
        })}

        {/* Surplus Meal Pins (Saffron with Animated Pulsing Rings) */}
        {visibleMeals.map(meal => {
          const isSelected = selectedMealId === meal.id;

          return (
            <g
              key={meal.id}
              transform={`translate(${meal.coords.x}, ${meal.coords.y})`}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => onSelectMeal(meal)}
              tabIndex={0}
              role="button"
              aria-label={`Surplus meal: ${meal.dishName}`}
            >
              {/* Pulsing Concentric Outer Ring */}
              <circle
                cx="0"
                cy="0"
                r={isSelected ? 22 : 16}
                fill="#FF9933"
                fillOpacity="0.35"
                className="animate-ping"
              />
              
              {/* Pin Base Circle */}
              <circle
                cx="0"
                cy="0"
                r={isSelected ? 13 : 10}
                fill="#FF9933"
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 3 : 2}
                className="shadow-md"
              />

              {/* Inner White Bowl Dot */}
              <circle cx="0" cy="0" r={isSelected ? 5 : 4} fill="#FFFFFF" />

              {/* Quantity Tag */}
              <g transform="translate(12, -8)">
                <rect
                  x="-2"
                  y="-10"
                  width={meal.quantityPlates > 0 ? "34" : "32"}
                  height="16"
                  rx="8"
                  fill="#FFFFFF"
                  stroke="#FF9933"
                  strokeWidth="1.2"
                />
                <text
                  x="14"
                  y="2"
                  textAnchor="middle"
                  fill="#C2410C"
                  fontSize="8"
                  fontWeight="800"
                >
                  {meal.quantityPlates > 0 ? `${meal.quantityPlates}p` : `${meal.quantityKg}k`}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      {/* Bottom Map Bar with Location Pill */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-amber-200 shadow-xs flex items-center gap-1.5 text-xs text-slate-700 pointer-events-auto">
          <Navigation className="w-3.5 h-3.5 text-[#000080]" />
          <span className="font-semibold text-[#000080]">
            {isDtuZoomed ? 'DTU Campus Zone' : 'North-Central Delhi Hub'}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-emerald-700 font-medium">
            {visibleMeals.length} {language === 'hi' ? 'भोजन उपलब्ध' : 'batches live'}
          </span>
        </div>
      </div>
    </div>
  );
};
