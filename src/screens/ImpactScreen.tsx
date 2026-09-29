import React, { useState } from 'react';
import { useApp } from '../store/appStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { computeLossScore, PAPER_PRESET, DEFAULT_LOSS_WEIGHTS } from '../lib/lossFunction';
import { LossParams } from '../types';
import { CANTEEN_PREDICTIONS } from '../lib/seedData';
import { AshokaChakraSvg } from '../components/ChakraLogo';
import {
  BarChart3,
  ShieldCheck,
  Network,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Cpu,
  TrendingDown,
  Layers,
  Sparkles,
  Link as LinkIcon,
  Flame,
  Award
} from 'lucide-react';

export const ImpactScreen: React.FC = () => {
  const {
    language,
    chain,
    inventory,
    gossipNodes,
    verifyChain,
    simulateTampering,
    restoreChain,
    tamperedState,
    updateInventoryQuantity,
    t
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'ledger' | 'gossip'>('analytics');

  // Loss function playground state
  const [lossParams, setLossParams] = useState<LossParams>(PAPER_PRESET);
  const lossBreakdown = computeLossScore(lossParams);

  // Blockchain verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    failedIndex: number | null;
    errorReason: string | null;
  } | null>(null);

  // Expanded block in ledger
  const [expandedBlockIndex, setExpandedBlockIndex] = useState<number | null>(null);

  // Inventory edit state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newQtyInput, setNewQtyInput] = useState<number>(100);

  // Chart Data: Weekly Food Waste vs Redistribution
  const weeklyTrendData = [
    { day: 'Mon', waste: 140, redistributed: 95 },
    { day: 'Tue', waste: 130, redistributed: 110 },
    { day: 'Wed', waste: 155, redistributed: 125 },
    { day: 'Thu', waste: 120, redistributed: 115 },
    { day: 'Fri', waste: 165, redistributed: 145 },
    { day: 'Sat', waste: 190, redistributed: 160 },
    { day: 'Sun', waste: 180, redistributed: 155 }
  ];

  // Chart Data: 4-Bin Allocation Breakdown
  const binPieData = [
    { name: 'DONATE', value: 62, color: '#138808' },
    { name: 'SHELF LIFE', value: 21, color: '#FF9933' },
    { name: 'RECYCLE', value: 12, color: '#2563EB' },
    { name: 'THROW AWAY', value: 5, color: '#E11D48' }
  ];

  // Chart Data: Before vs With Map My Meal
  const beforeAfterData = [
    { category: 'Atal Canteen', before: 85, withMMM: 42 },
    { category: 'Hostel Mess', before: 210, withMMM: 95 },
    { category: 'Faculty Club', before: 45, withMMM: 18 },
    { category: 'Banquet Hall', before: 160, withMMM: 60 }
  ];

  const handleVerifyLedger = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    setTimeout(async () => {
      const res = await verifyChain();
      setVerificationResult(res);
      setIsVerifying(false);
    }, 800);
  };

  const handleSaveInventory = async (id: string) => {
    await updateInventoryQuantity(id, newQtyInput);
    setEditingItemId(null);
  };

  return (
    <div className="flex flex-col gap-4 px-4 pb-28 pt-2 max-w-lg mx-auto w-full">
      {/* Sub-Tab Navigation Header */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'analytics'
              ? 'bg-white text-[#000080] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-[#FF9933]" />
          <span>{language === 'hi' ? 'प्रभाव व सूत्र' : 'Analytics & Math'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ledger')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'ledger'
              ? 'bg-white text-[#000080] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#138808]" />
          <span>{language === 'hi' ? 'ब्लॉकचेन बहीखाता' : 'SHA-256 Ledger'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('gossip')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'gossip'
              ? 'bg-white text-[#000080] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Network className="w-3.5 h-3.5 text-blue-600" />
          <span>{language === 'hi' ? 'गोसिप व स्टॉक' : 'Gossip & Stock'}</span>
        </button>
      </div>

      {/* SUB-TAB 1: Impact Counters, Charts & Loss Function */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Hero Impact Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-white border border-amber-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t.impactHeroMeals}
              </span>
              <div className="text-2xl font-black text-[#FF9933] tabular-nums mt-0.5">
                1,485 <span className="text-xs font-semibold text-slate-400">plates</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                ↑ +120 today (DTU Pilot)
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t.impactHeroKg}
              </span>
              <div className="text-2xl font-black text-[#138808] tabular-nums mt-0.5">
                519 <span className="text-xs font-semibold text-slate-400">kg</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Zero organic waste landfill
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-blue-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t.impactHeroCo2}
              </span>
              <div className="text-2xl font-black text-[#000080] tabular-nums mt-0.5">
                1,298 <span className="text-xs font-semibold text-slate-400">kg CO₂e</span>
              </div>
              <span className="text-[10px] text-blue-700 font-medium block mt-1">
                2.5 kg CO₂e / kg saved
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {t.impactHeroValue}
              </span>
              <div className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                ₹88,230
              </div>
              <span className="text-[10px] text-slate-500 font-medium block mt-1">
                Institutional cost saved
              </span>
            </div>
          </div>

          {/* Waste Minimization Loss Function Interactive Playground */}
          <div className="bg-white p-4 rounded-3xl border-2 border-blue-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  SIH26234 Mathematical Core
                </span>
                <h3 className="font-extrabold text-sm text-[#000080]">
                  {t.lossFunctionTitle}
                </h3>
              </div>

              <button
                onClick={() => setLossParams(PAPER_PRESET)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200"
              >
                Reset to Paper
              </button>
            </div>

            {/* Formula Banner */}
            <div className="p-3 bg-slate-900 text-white rounded-2xl font-mono text-center text-xs tracking-wider">
              <div className="text-amber-400 font-bold text-sm">
                L = αW + βE + γM + δT − ηQ − λR
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                α=0.30, β=0.25, γ=0.20, δ=0.15, η=0.10, λ=0.05
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-2.5 pt-1">
              {[
                { key: 'W', label: 'W (Waste Quantity Factor)', val: lossParams.W, step: 0.05, max: 1 },
                { key: 'E', label: 'E (Expiration Urgency)', val: lossParams.E, step: 0.05, max: 1 },
                { key: 'M', label: 'M (Distance / Mileage)', val: lossParams.M, step: 0.05, max: 1 },
                { key: 'T', label: 'T (Transit Time Factor)', val: lossParams.T, step: 0.05, max: 1 },
                { key: 'Q', label: 'Q (Quality / Freshness Benefit)', val: lossParams.Q, step: 0.05, max: 1 },
                { key: 'R', label: 'R (Recipient Capacity Benefit)', val: lossParams.R, step: 0.05, max: 1 }
              ].map(param => (
                <div key={param.key} className="text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                    <span className="text-[11px]">{param.label}</span>
                    <span className="font-mono text-blue-700 font-bold tabular-nums">
                      {param.val.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={param.max}
                    step={param.step}
                    value={param.val}
                    onChange={e =>
                      setLossParams({
                        ...lossParams,
                        [param.key]: parseFloat(e.target.value)
                      })
                    }
                    className="w-full accent-[#000080] cursor-pointer"
                  />
                </div>
              ))}
            </div>

            {/* Calculated Result Display */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  {t.calculatedLossScore}:
                </span>
                <span className="text-2xl font-black text-emerald-800 font-mono tabular-nums">
                  L = {lossBreakdown.lossScore}
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 mt-1 leading-snug">
                {lossBreakdown.explanation}
              </p>
            </div>
          </div>

          {/* Tricolor Charts Section */}
          <div className="space-y-4">
            {/* Weekly Flow Chart */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-[#000080] mb-3">
                {t.weeklyWasteVsRedistribution}
              </h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrendData}>
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="waste"
                      stroke="#FF9933"
                      fill="#FFEDD5"
                      name="Surplus Generated (kg)"
                    />
                    <Area
                      type="monotone"
                      dataKey="redistributed"
                      stroke="#138808"
                      fill="#DCFCE7"
                      name="Redistributed Safe (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 4-Bin Pie Donut */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-[#000080] mb-2">
                {language === 'hi' ? '4-बिन वर्गीकरण अनुपात' : '4-Bin Classification Ratio'}
              </h4>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={binPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                    >
                      {binPieData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] pt-1 font-semibold">
                {binPieData.map(b => (
                  <span key={b.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: b.color }} />
                    <span className="text-slate-700">{b.name} ({b.value}%)</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Before vs With Map My Meal Bar Chart */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold text-[#000080] mb-3">
                {t.beforeVsAfter}
              </h4>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={beforeAfterData}>
                    <XAxis dataKey="category" stroke="#94A3B8" fontSize={10} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="before" fill="#CBD5E1" name="Before (kg waste/day)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="withMMM" fill="#138808" name="With Map My Meal" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Tonight's Surplus Forecast */}
          <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#FF9933]" />
              <h4 className="text-xs font-bold text-[#000080]">
                {t.canteenForecastTitle}
              </h4>
            </div>

            <div className="space-y-2.5">
              {CANTEEN_PREDICTIONS.map((item, idx) => (
                <div key={idx} className="p-3 bg-amber-50/50 rounded-2xl border border-amber-200/80">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-900">{language === 'hi' ? item.canteenHi : item.canteen}</span>
                    <span className="text-[#FF9933] tabular-nums">~{item.predictedSurplusPlates} plates expected</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>Dish: {item.dish}</span>
                    <span className="text-emerald-700 font-medium">{item.confidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Blockchain Ledger & Verification */}
      {activeSubTab === 'ledger' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <h3 className="text-base font-extrabold text-[#000080]">
              {t.blockchainTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-snug mt-0.5">
              {t.blockchainDesc}
            </p>
          </div>

          {/* Chain Verification Control Panel */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={handleVerifyLedger}
                disabled={isVerifying}
                className="py-2.5 px-4 rounded-xl bg-[#000080] hover:bg-navy-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isVerifying ? (
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                )}
                <span>{isVerifying ? 'Recomputing Hashes...' : t.verifyChain}</span>
              </button>

              <div className="flex items-center gap-2">
                {!tamperedState ? (
                  <button
                    onClick={simulateTampering}
                    className="py-2 px-3 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 font-bold text-xs"
                  >
                    {t.simulateTamper}
                  </button>
                ) : (
                  <button
                    onClick={restoreChain}
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    {t.restoreChain}
                  </button>
                )}
              </div>
            </div>

            {/* Verification Alert Result */}
            {verificationResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-semibold ${
                  verificationResult.isValid
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : 'bg-rose-50 text-rose-900 border-rose-300'
                }`}
              >
                {verificationResult.isValid ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{t.chainValid}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-rose-800 font-bold mb-1">
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      <span>{t.chainTampered}</span>
                    </div>
                    <p className="text-[11px] text-rose-700 font-mono">
                      {verificationResult.errorReason}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vertical Blockchain Block Cards */}
          <div className="space-y-3">
            {chain.map((block, idx) => {
              const isTamperedBlock = tamperedState && idx === 2;
              const isExpanded = expandedBlockIndex === block.index;

              return (
                <div key={block.index} className="relative">
                  {/* Visual Chain Link Connector */}
                  {idx > 0 && (
                    <div className="flex justify-center -my-2.5 z-10 relative">
                      <div className="bg-white p-1 rounded-full border border-slate-300 text-slate-400">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}

                  <div
                    onClick={() => setExpandedBlockIndex(isExpanded ? null : block.index)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs ${
                      isTamperedBlock
                        ? 'border-rose-500 ring-2 ring-rose-400/50 bg-rose-50/20'
                        : 'border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#000080] text-white flex items-center justify-center text-xs font-mono font-bold">
                          #{block.index}
                        </span>
                        <span className="text-xs font-bold text-slate-800">
                          {block.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Nonce: {block.nonce}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isTamperedBlock
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {isTamperedBlock ? 'TAMPERED' : 'VERIFIED'}
                        </span>
                      </div>
                    </div>

                    {/* Hash & PrevHash */}
                    <div className="space-y-1 font-mono text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="truncate text-slate-600">
                        <span className="text-slate-400 font-bold">Hash: </span>
                        <span className="text-[#000080] font-semibold">{block.hash}</span>
                      </div>
                      <div className="truncate text-slate-500">
                        <span className="text-slate-400 font-bold">Prev: </span>
                        <span>{block.prevHash}</span>
                      </div>
                    </div>

                    {/* Expandable Payload View */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Decoded Payload
                        </span>
                        <pre className="text-[11px] font-mono bg-slate-900 text-emerald-400 p-2.5 rounded-xl overflow-x-auto">
                          {JSON.stringify(block.payload, null, 2)}
                        </pre>
                        <div className="mt-1 text-[10px] text-slate-400">
                          Node: {block.nodeId} · Time: {new Date(block.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Gossip Network & Inventory SHA-256 Audit */}
      {activeSubTab === 'gossip' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div>
            <h3 className="text-base font-extrabold text-[#000080]">
              {t.gossipTitle}
            </h3>
            <p className="text-xs text-slate-500 leading-snug mt-0.5">
              Decentralized consensus across institutional canteens, NGOs, and food banks.
            </p>
          </div>

          {/* Gossip Visualizer Graph Canvas */}
          <div className="aspect-[4/3] w-full rounded-3xl bg-[#0F172A] border border-slate-800 p-4 relative overflow-hidden shadow-md">
            <svg viewBox="100 80 520 380" className="w-full h-full">
              {/* Radial Pulse Grid */}
              <circle cx="360" cy="270" r="160" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />
              <circle cx="360" cy="270" r="100" fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" />

              {/* Connecting lines between central node and peers */}
              {gossipNodes.map(node => (
                <line
                  key={`line-${node.id}`}
                  x1="360"
                  y1="270"
                  x2={node.coords.x}
                  y2={node.coords.y}
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="animate-pulse"
                />
              ))}

              {/* Central Hub Node */}
              <g transform="translate(360, 270)">
                <circle cx="0" cy="0" r="24" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="8" fill="#38BDF8" />
                <text x="0" y="38" textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                  SIH Consensus Hub
                </text>
              </g>

              {/* Gossip Peer Nodes */}
              {gossipNodes.map(node => (
                <g key={node.id} transform={`translate(${node.coords.x}, ${node.coords.y})`}>
                  {node.isPulsing && (
                    <circle cx="0" cy="0" r="18" fill="#38BDF8" fillOpacity="0.25" className="animate-ping" />
                  )}
                  <circle
                    cx="0"
                    cy="0"
                    r="12"
                    fill="#1E293B"
                    stroke={node.type === 'canteen' ? '#FF9933' : node.type === 'ngo' ? '#10B981' : '#38BDF8'}
                    strokeWidth="2"
                  />
                  <text x="0" y="-16" textAnchor="middle" fill="#F8FAFC" fontSize="9" fontWeight="600">
                    {node.name.split(' ')[0]}
                  </text>
                  <text x="0" y="24" textAnchor="middle" fill="#94A3B8" fontSize="7.5">
                    {node.lastSynced}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Kitchen Stock SHA-256 Audit Trail */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#000080]" />
                <h4 className="font-extrabold text-xs text-[#000080]">
                  {t.inventoryAuditTitle}
                </h4>
              </div>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                SHA-256 Verifiable
              </span>
            </div>

            <div className="space-y-2.5">
              {inventory.map(item => (
                <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="font-bold text-slate-900">{item.name}</span>
                      <span className="text-[10px] text-slate-500 block">{item.kitchenName}</span>
                    </div>

                    {editingItemId === item.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={newQtyInput}
                          onChange={e => setNewQtyInput(parseInt(e.target.value) || 0)}
                          className="w-16 px-1.5 py-0.5 border rounded text-right font-mono"
                        />
                        <button
                          onClick={() => handleSaveInventory(item.id)}
                          className="px-2 py-0.5 bg-[#138808] text-white rounded font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-800 font-mono tabular-nums">
                          {item.quantity} {item.unit}
                        </span>
                        <button
                          onClick={() => {
                            setEditingItemId(item.id);
                            setNewQtyInput(item.quantity);
                          }}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-200">
                    <span className="truncate max-w-[200px]">SHA-256: {item.sha256Hash}</span>
                    <span>{item.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
