// src/screens/LiveAssistScreen.tsx
import { useState } from 'react';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { useSession } from '../store/sessionStore';
import { sessionEngine } from '../engine/sessionEngine';
import { getFieldCounts } from '../data/pdFieldSchema';
import Waveform from '../components/Waveform';
import LiveTranscriptCard from '../components/LiveTranscriptCard';
import NudgesCard from '../components/NudgesCard';
import AlertsCard from '../components/AlertsCard';
import ActionsCard from '../components/ActionsCard';
import FieldSummaryCard from '../components/FieldSummaryCard';
import DemoControls from '../components/DemoControls';
import SessionSummaryModal from '../components/SessionSummaryModal';

interface Props {
  onBack: () => void;
}

function formatTimer(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function LiveAssistScreen({ onBack }: Props) {
  const session = useSession();
  const [showSummary, setShowSummary] = useState(false);

  const isLive = session.status === 'live';
  const isPaused = session.status === 'paused';
  const isActive = isLive || isPaused;
  const isIdle = session.status === 'idle';
  const isEnded = session.status === 'ended';

  const handleEndSession = () => {
    sessionEngine.endSession();
    setShowSummary(true);
  };

  const handleReturnHome = () => {
    sessionEngine.restart();
    setShowSummary(false);
    onBack();
  };

  const handleStartNew = () => {
    sessionEngine.restart();
    setShowSummary(false);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#F0EFF8]">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#F0EFF8] pt-3 pb-2 px-4">
        <div className="flex items-center justify-between">
          {isIdle || isEnded ? (
            <button onClick={onBack} className="p-1">
              <ArrowLeft size={22} className="text-[#5B5BD6]" />
            </button>
          ) : (
            <div className="w-8" />
          )}

          {/* Status pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
            isLive ? 'bg-white text-gray-800 shadow-sm' : 'bg-white text-gray-800 shadow-sm'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {isLive ? 'Live' : isPaused ? 'Paused' : 'Offline'}
          </div>

          <div className="w-8" />
        </div>

        {/* Timer + waveform row */}
        <div className="flex items-center justify-between mt-2 px-1">
          <span className="text-xl font-bold text-gray-900 tabular-nums">
            {formatTimer(session.elapsedMs)}
          </span>
          <Waveform active={isLive} />
        </div>
      </div>

      {/* ── Scrollable content ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-44">
        <div className="flex flex-col gap-3 py-2">

          {/* Field capture progress bar */}
          {(() => {
            const { captured, total, pending } = getFieldCounts(session.fields);
            const pct = Math.round((captured / total) * 100);
            return (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fields Captured</span>
                  <span className="text-xs font-bold text-[#5B5BD6]">{captured}/{total}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5B5BD6] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-emerald-600 font-semibold">{captured} captured</span>
                  <span className="text-[10px] text-gray-400 font-semibold">{pending} pending</span>
                </div>
              </div>
            );
          })()}

          {/* Live Transcript */}
          <LiveTranscriptCard
            messages={session.transcript}
            isLive={isLive}
          />

          {/* Nudges */}
          <NudgesCard
            nudges={session.nudges}
            isLive={isActive}
          />

          {/* Alerts */}
          <AlertsCard
            alerts={session.alerts}
            isLive={isActive}
          />

          {/* Actions Generated */}
          <ActionsCard actions={session.actions} />

          {/* Field Summary */}
          <FieldSummaryCard fields={session.fields} />

          {/* Script complete indicator */}
          {session.scriptComplete && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <p className="text-sm font-semibold text-amber-700">⚡ Scripted Conversation Complete</p>
              <p className="text-xs text-amber-600 mt-1">
                24/40 fields captured · 16 pending · Tap End Session when ready.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Sticky bottom bar ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[400px] bg-[#F0EFF8] border-t border-[#E0E0F0] px-4 pt-3 pb-7 z-30">
        {/* Consent reminder */}
        <div className="flex items-center gap-2 mb-2">
          <Shield size={13} className="text-[#5B5BD6] flex-shrink-0" />
          <p className="text-xs text-gray-500">
            Make sure recording consent has been taken before you begin.
          </p>
        </div>

        {/* Persona indicator (shown when active) */}
        {isActive && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 border border-[#5B5BD6]/30 rounded-full">
              <Lock size={11} className="text-[#5B5BD6]" />
              <span className="text-xs font-semibold text-[#5B5BD6]">Persona: Micro Retailer / Trader</span>
            </div>
          </div>
        )}

        {/* Persona dropdown (shown when idle) */}
        {!isActive && !isEnded && (
          <div className="flex items-center gap-2 mb-3 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
            <div className="w-6 h-6 rounded-full bg-[#5B5BD6]/10 flex items-center justify-center">
              <Lock size={12} className="text-[#5B5BD6]" />
            </div>
            <span className="text-sm text-gray-700 flex-1">Hero Housing PD Form</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}

        {/* Main CTA button */}
        {isIdle ? (
          <button
            onClick={() => sessionEngine.start()}
            className="w-full h-12 rounded-xl bg-[#5B5BD6] text-white font-bold text-base shadow-lg shadow-[#5B5BD6]/30 active:scale-[0.98] transition-transform"
          >
            Start Session
          </button>
        ) : isEnded ? (
          <button
            onClick={handleReturnHome}
            className="w-full h-12 rounded-xl bg-[#5B5BD6] text-white font-bold text-base shadow-lg shadow-[#5B5BD6]/30"
          >
            Return to Home
          </button>
        ) : (
          <button
            onClick={handleEndSession}
            className="w-full h-12 rounded-xl bg-[#5B5BD6] text-white font-bold text-base shadow-lg shadow-[#5B5BD6]/30 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-white" />
            </div>
            End Session
          </button>
        )}
      </div>

      {/* Demo controls floating */}
      <DemoControls
        status={session.status}
        speed={session.speed}
        onEndSession={handleEndSession}
      />

      {/* Session summary modal */}
      {showSummary && (
        <SessionSummaryModal
          sessionState={session}
          onReturnHome={handleReturnHome}
          onStartNew={handleStartNew}
        />
      )}
    </div>
  );
}
