// src/components/NudgesCard.tsx
import { useState, useEffect } from 'react';
import { Volume2, Sparkles, CheckCircle, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import type { NudgeItem, NudgePriority } from '../engine/sessionEngine';

interface Props {
  nudges: NudgeItem[];
  isLive: boolean;
}

function PriorityBadge({ priority }: { priority: NudgePriority }) {
  if (priority === 'High') {
    return (
      <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/70">
        High
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
        Medium
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-purple-50 text-[#5B5BD6] border border-purple-200/70">
      Low
    </span>
  );
}

export default function NudgesCard({ nudges, isLive }: Props) {
  const visibleNudges = nudges.filter(n => !n.dismissed);
  const [viewIndex, setViewIndex] = useState<number | null>(null);

  // Auto-track the latest nudge as new ones arrive
  useEffect(() => {
    if (visibleNudges.length > 0) {
      setViewIndex(visibleNudges.length - 1);
    } else {
      setViewIndex(null);
    }
  }, [visibleNudges.length]);

  const currentIndex =
    viewIndex !== null && viewIndex >= 0 && viewIndex < visibleNudges.length
      ? viewIndex
      : visibleNudges.length - 1;

  const currentNudge = visibleNudges[currentIndex];
  const stackCount = visibleNudges.length;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80">
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900">Nudges</h2>
          {stackCount > 0 && (
            <span className="text-[11px] font-semibold text-[#5B5BD6] bg-[#F0EFFE] px-2 py-0.5 rounded-full">
              Stack: {stackCount.toString().padStart(2, '0')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-1 text-[#5B5BD6]">
              <Volume2 size={13} />
              <span className="text-xs font-semibold">
                Active:{stackCount.toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Content / Stack ───────────────────────────────────────────── */}
      {stackCount === 0 ? (
        !isLive ? (
          <p className="text-sm text-gray-400 leading-relaxed py-2">
            Relevant nudges will appear here during the conversation.
          </p>
        ) : (
          <div className="bg-[#FAF9FF] rounded-xl p-4 text-center border border-[#5B5BD6]/10">
            <div className="w-8 h-8 rounded-full bg-[#5B5BD6]/10 flex items-center justify-center mx-auto mb-2 text-[#5B5BD6]">
              <Sparkles size={16} />
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-0.5">Loading live nudges</p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[280px] mx-auto">
              Coaching tips will appear here as soon as analysis is available for this session.
            </p>
          </div>
        )
      ) : (
        /* Stack Container */
        <div className="relative pt-1 pb-3">
          {/* Layer 2 (Deepest card) */}
          {stackCount >= 3 && (
            <div
              className="absolute -bottom-1.5 inset-x-5 h-full bg-gray-50/90 rounded-2xl border border-gray-200/70 shadow-sm pointer-events-none transform scale-[0.96]"
              style={{ zIndex: 1 }}
            />
          )}

          {/* Layer 1 (Middle card) */}
          {stackCount >= 2 && (
            <div
              className="absolute -bottom-0.5 inset-x-2.5 h-full bg-gray-50/95 rounded-2xl border border-[#5B5BD6]/15 shadow-sm pointer-events-none transform scale-[0.98]"
              style={{ zIndex: 2 }}
            />
          )}

          {/* Active Front Card */}
          <div
            className="relative bg-white rounded-2xl p-4 border border-[#5B5BD6]/25 shadow-md transition-all duration-200"
            style={{ zIndex: 3 }}
          >
            {/* Top row: Sherpa branding + Badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#5B5BD6] to-[#7B78FF] flex items-center justify-center text-white shadow-xs flex-shrink-0">
                  <Sparkles size={12} className="fill-white/20" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold tracking-wider text-[#5B5BD6] uppercase">
                    Sherpa AI
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                    {currentNudge.questionTag.split('·')[0].trim()}
                  </span>
                </div>
              </div>

              {currentNudge.resolved ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <CheckCircle size={11} className="text-emerald-500" />
                  Resolved
                </span>
              ) : (
                <PriorityBadge priority={currentNudge.priority} />
              )}
            </div>

            {/* Bold Nudge Title */}
            <h3 className="text-sm font-bold text-gray-900 leading-snug">
              {currentNudge.title}
            </h3>

            {/* Hinglish Actionable Recommendation */}
            <p
              className={`text-xs leading-relaxed mt-1.5 ${
                currentNudge.resolved ? 'text-gray-500' : 'text-gray-700'
              }`}
            >
              "{currentNudge.text}"
            </p>

            {/* If resolved confirmation notice */}
            {currentNudge.resolved && (
              <div className="mt-2.5 pt-2 border-t border-emerald-100 flex items-center gap-1.5 text-emerald-700 text-[11px] font-medium">
                <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                <span>Resolved · Clarification captured from borrower</span>
              </div>
            )}

            {/* Card footer: Stack navigation if multiple nudges */}
            {stackCount > 1 && (
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                  <Layers size={12} className="text-[#5B5BD6]" />
                  <span>
                    Card {currentIndex + 1} of {stackCount}
                  </span>
                  {currentIndex === stackCount - 1 && (
                    <span className="text-[10px] font-semibold text-[#5B5BD6] bg-[#F0EFFE] px-1.5 py-0.2 rounded ml-1">
                      Latest
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Previous nudge"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setViewIndex(Math.min(stackCount - 1, currentIndex + 1))}
                    disabled={currentIndex === stackCount - 1}
                    className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none"
                    aria-label="Next nudge"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
