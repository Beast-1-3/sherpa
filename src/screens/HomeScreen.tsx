// src/screens/HomeScreen.tsx
import { Phone, CheckCircle, TrendingUp, ArrowRight, ChevronRight } from 'lucide-react';

interface Props {
  onStartLiveAssist: () => void;
}

// Simple SVG line chart for score trend
function ScoreTrend() {
  const points = "0,30 20,28 40,35 60,32 80,30 100,28 120,32 140,30 160,26 180,25";
  return (
    <svg viewBox="0 0 180 45" className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#5B5BD6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="180" cy="25" r="3" fill="#5B5BD6" />
    </svg>
  );
}

// AI Score donut
function AIScoreDonut({ score }: { score: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const fraction = score / 100;
  const dashArray = fraction * circumference;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={radius} fill="none" stroke="#E8E8F8" strokeWidth="7" />
        <circle
          cx="44" cy="44" r={radius}
          fill="none"
          stroke="#5B5BD6"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${dashArray} ${circumference}`}
        />
      </svg>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-800 leading-none">{score}</div>
        <div className="text-[9px] text-gray-400 mt-0.5 uppercase tracking-wide">AI Score</div>
      </div>
    </div>
  );
}

export default function HomeScreen({ onStartLiveAssist }: Props) {
  return (
    <div className="min-h-full bg-[#F0EFF8] relative overflow-hidden">
      {/* Background blobs */}
      <div className="blob1" />
      <div className="blob2" />

      <div className="relative z-10 px-4 pt-10 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 font-normal">Good evening,</p>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">HERO User</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#5B5BD6] flex items-center justify-center">
            <span className="text-white font-semibold text-base">A</span>
          </div>
        </div>

        {/* AI Performance Card */}
        <div className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
          <div className="flex items-start gap-4">
            <AIScoreDonut score={10} />
            <div className="flex-1 pt-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Weekly AI Performance
              </p>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[#EF4444] text-sm font-semibold flex items-center gap-0.5">
                  <span className="text-xs">↓</span> 100%
                </span>
              </div>
              <p className="text-xs text-gray-400">vs. last week</p>
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Score Trend</p>
            </div>
          </div>
          <div className="mt-3">
            <ScoreTrend />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { icon: Phone, value: '2', label: 'Today Sessions', iconColor: 'text-[#5B5BD6]' },
            { icon: CheckCircle, value: '30', label: 'Sessions Completed', iconColor: 'text-[#5B5BD6]' },
            { icon: TrendingUp, value: '9.1%', label: 'Win Rate', iconColor: 'text-[#5B5BD6]' },
          ].map(({ icon: Icon, value, label, iconColor }) => (
            <div key={label} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col items-start gap-1">
              <Icon size={16} className={iconColor} />
              <div className="text-xl font-bold text-gray-900">{value}</div>
              <div className="text-[9px] text-gray-400 uppercase tracking-wide leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* Start Live Assist Banner */}
        <button
          onClick={onStartLiveAssist}
          className="w-full bg-gradient-to-r from-[#5B5BD6] to-[#7C7CE0] rounded-2xl p-5 mb-6 text-left shadow-lg shadow-[#5B5BD6]/30 active:scale-[0.98] transition-transform"
        >
          <p className="text-[10px] font-semibold text-white/70 uppercase tracking-widest mb-1">
            Ready when you are
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Start Live Assist</h2>
              <p className="text-sm text-white/80">
                Pair your Sherpa Core and let AI co-pilot your next call.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center ml-4 flex-shrink-0">
              <ArrowRight size={20} className="text-white" />
            </div>
          </div>
        </button>

        {/* Coaching Insights */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Coaching insights</h3>
          <span className="text-sm text-gray-400">This week</span>
        </div>

        <div className="flex flex-col gap-2">
          {[
            {
              icon: '↗',
              text: 'Focus on Pitch Content Accuracy (0% — room to improve)',
              bg: 'bg-emerald-50',
              iconColor: 'text-emerald-600',
            },
            {
              icon: '↗',
              text: 'Focus on Objection Handling (0% — room to improve)',
              bg: 'bg-emerald-50',
              iconColor: 'text-emerald-500',
            },
            {
              icon: '✓',
              text: 'Strong in Conversation Quality (50%)',
              bg: 'bg-emerald-50',
              iconColor: 'text-emerald-600',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-sm font-bold ${item.iconColor}`}>{item.icon}</span>
              </div>
              <p className="text-sm text-gray-700 font-medium leading-snug">{item.text}</p>
              <ChevronRight size={16} className="text-gray-300 ml-auto flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Recent Sessions */}
        <div className="flex items-center justify-between mt-5 mb-3">
          <h3 className="text-lg font-bold text-gray-900">Recent Sessions</h3>
          <span className="text-sm text-[#5B5BD6]">View all</span>
        </div>
        {[
          { name: 'Mohan Kumar', time: 'Today, 3:45 PM', duration: '8 min', score: 82 },
          { name: 'Priya Singh', time: 'Today, 11:20 AM', duration: '12 min', score: 91 },
        ].map((s) => (
          <div key={s.name} className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5B5BD6]/10 flex items-center justify-center">
                <span className="text-[#5B5BD6] font-semibold text-sm">{s.name[0]}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{s.name}</p>
                <p className="text-xs text-gray-400">{s.time} · {s.duration}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#5B5BD6]">{s.score}</span>
              <p className="text-[10px] text-gray-400">AI Score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
