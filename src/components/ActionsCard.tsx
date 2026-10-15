// src/components/ActionsCard.tsx
import { useState } from 'react';
import { User, ChevronDown, ChevronUp, CheckSquare, Clock } from 'lucide-react';
import type { ActionItem, NudgePriority } from '../engine/sessionEngine';

interface Props {
  actions: ActionItem[];
}

function PriorityPill({ priority }: { priority: NudgePriority }) {
  if (priority === 'High') {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/70">
        High
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
        Medium
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-[#5B5BD6] border border-purple-200/70">
      Low
    </span>
  );
}

function CategoryBadge({ type }: { type: string }) {
  const getStyle = () => {
    switch (type) {
      case 'Verification':
        return 'bg-blue-50 text-blue-700 border-blue-200/70';
      case 'Data Collection':
        return 'bg-purple-50 text-[#5B5BD6] border-purple-200/70';
      case 'Financial Clarification':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
      case 'Credit Verification':
        return 'bg-amber-50 text-amber-800 border-amber-200/70';
      case 'Property Verification':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${getStyle()}`}>
      {type}
    </span>
  );
}

export default function ActionsCard({ actions }: Props) {
  const [expanded, setExpanded] = useState(false);
  const activeCount = actions.filter(a => !a.completed).length;

  const displayLimit = 2;
  const visibleActions = expanded ? actions : actions.slice(0, displayLimit);
  const hasMore = actions.length > displayLimit;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80">
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">Actions Generated</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#5B5BD6] bg-[#F0EFFE] px-2.5 py-0.5 rounded-full">
            Active: {activeCount.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      {actions.length === 0 ? (
        /* Waiting State from design */
        <div className="bg-gray-50/80 rounded-xl p-5 text-center border border-gray-100">
          {/* Animated/waveform bars */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {[4, 10, 16, 11, 20, 11, 16, 10, 4].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-full bg-[#5B5BD6]"
                style={{ height: `${h}px`, opacity: 0.7 }}
              />
            ))}
          </div>
          <div className="w-16 h-px bg-[#5B5BD6]/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-700 mb-1">Waiting for action items</p>
          <p className="text-xs text-gray-400 leading-relaxed max-w-[280px] mx-auto">
            Actions appear when the live stream detects follow-up work from the conversation.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibleActions.map(action => (
            <div
              key={action.id}
              className={`rounded-2xl border p-3.5 transition-all shadow-xs ${
                action.completed
                  ? 'bg-gray-50 border-gray-200/80 opacity-60'
                  : 'bg-white border-gray-200/90 hover:border-[#5B5BD6]/40'
              }`}
            >
              {/* Card Header: Type badge + Priority + Status */}
              <div className="flex items-center justify-between gap-1.5 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <CategoryBadge type={action.type || 'Follow-up'} />
                  <PriorityPill priority={action.priority || 'High'} />
                </div>

                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700">Open</span>
                </div>
              </div>

              {/* Action Title */}
              <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2">
                {action.title || action.text}
              </h3>

              {/* Structured Action Detail Box */}
              <div className="bg-[#FAF9FF] rounded-xl p-2.5 border border-[#5B5BD6]/15 flex flex-col gap-1.5">
                {/* Description */}
                <p className="text-xs text-gray-700 leading-relaxed">
                  "{action.description || action.text}"
                </p>

                {/* Metadata row: Trigger & Owner */}
                <div className="pt-1.5 border-t border-[#5B5BD6]/10 flex flex-col gap-1">
                  {action.trigger && (
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <span className="font-semibold text-gray-600">Trigger:</span>
                      <span className="text-[#5B5BD6] font-medium">{action.trigger}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <User size={11} className="text-[#5B5BD6] flex-shrink-0" />
                    <span className="font-semibold text-gray-600">Owner:</span>
                    <span className="text-gray-700 font-medium">
                      {action.owner || 'Hero Housing Sales Manager'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View All / Show Less button */}
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-0.5 w-full py-1.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 flex items-center justify-center gap-1 transition-colors"
            >
              <span>{expanded ? 'Show Less' : `View All (${actions.length}) Actions`}</span>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
