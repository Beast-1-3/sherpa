// src/components/DemoControls.tsx
import { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, ChevronDown, ChevronUp, SkipForward } from 'lucide-react';
import { sessionEngine } from '../engine/sessionEngine';
import { JUMP_POINTS } from '../data/demoScript';
import type { SessionStatus } from '../engine/sessionEngine';

interface Props {
  status: SessionStatus;
  speed: 1 | 2;
  onEndSession: () => void;
}

export default function DemoControls({ status, speed, onEndSession }: Props) {
  const [open, setOpen] = useState(false);

  const isLive = status === 'live';
  const isPaused = status === 'paused';
  const isIdle = status === 'idle';
  const isEnded = status === 'ended';

  return (
    <div className="fixed bottom-32 right-3 z-40 flex flex-col items-end gap-2">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[#5B5BD6] shadow-lg shadow-[#5B5BD6]/40 flex items-center justify-center text-white"
      >
        {open ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      {/* Control panel */}
      {open && (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 w-52 mb-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            🎬 Demo Controls
          </p>

          {/* Primary controls */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {isIdle && (
              <button
                onClick={() => { sessionEngine.start(); setOpen(false); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#5B5BD6] text-white rounded-lg text-xs font-semibold"
              >
                <Play size={12} /> Start
              </button>
            )}
            {isLive && (
              <button
                onClick={() => sessionEngine.pause()}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-semibold"
              >
                <Pause size={12} /> Pause
              </button>
            )}
            {isPaused && (
              <button
                onClick={() => sessionEngine.resume()}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-semibold"
              >
                <Play size={12} /> Resume
              </button>
            )}
            {!isIdle && !isEnded && (
              <button
                onClick={() => sessionEngine.restart()}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                <RotateCcw size={12} /> Restart
              </button>
            )}
            {isIdle && (
              <button
                onClick={() => sessionEngine.restart()}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          {/* Speed controls */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[10px] text-gray-400 font-semibold">Speed:</span>
            {([1, 2] as const).map(s => (
              <button
                key={s}
                onClick={() => sessionEngine.setSpeed(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-0.5 ${speed === s ? 'bg-[#5B5BD6] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {s === 2 && <Zap size={10} />}
                {s}×
              </button>
            ))}
          </div>

          {/* Jump points */}
          <div className="border-t border-gray-100 pt-2 mb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Jump To</p>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => { sessionEngine.jumpTo(JUMP_POINTS.income); setOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 hover:bg-[#F0EFFE] rounded-lg text-xs text-gray-600 font-medium text-left transition-colors"
              >
                <SkipForward size={11} /> Income (1:18)
              </button>
              <button
                onClick={() => { sessionEngine.jumpTo(JUMP_POINTS.expenses); setOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 hover:bg-[#F0EFFE] rounded-lg text-xs text-gray-600 font-medium text-left transition-colors"
              >
                <SkipForward size={11} /> Expenses (1:45)
              </button>
              <button
                onClick={() => { sessionEngine.jumpTo(JUMP_POINTS.property); setOpen(false); }}
                className="flex items-center gap-1.5 px-2 py-1.5 bg-gray-50 hover:bg-[#F0EFFE] rounded-lg text-xs text-gray-600 font-medium text-left transition-colors"
              >
                <SkipForward size={11} /> Property (1:55)
              </button>
            </div>
          </div>

          {/* End session */}
          {!isIdle && !isEnded && (
            <button
              onClick={() => { onEndSession(); setOpen(false); }}
              className="w-full py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold border border-red-100"
            >
              ⏹ End Session
            </button>
          )}
        </div>
      )}
    </div>
  );
}
