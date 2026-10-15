// src/components/SessionSummaryModal.tsx
import { X, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import type { SessionState } from '../engine/sessionEngine';
import { getQuestionGroupStatuses, getFieldCounts } from '../data/pdFieldSchema';

interface Props {
  sessionState: SessionState;
  onReturnHome: () => void;
  onStartNew: () => void;
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${sec}s`;
}

export default function SessionSummaryModal({ sessionState, onReturnHome, onStartNew }: Props) {
  const qStatuses = getQuestionGroupStatuses(sessionState.fields);
  const { captured, total, pending } = getFieldCounts(sessionState.fields);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[400px] p-5 pb-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Session Summary</h2>
            <p className="text-xs text-gray-400">Hero Housing Finance · PD Automation</p>
          </div>
          <button onClick={onReturnHome}>
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{captured}</div>
            <div className="text-[10px] text-emerald-500 font-semibold uppercase tracking-wide">Captured</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">fields</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-gray-500">{pending}</div>
            <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Pending</div>
            <div className="text-[10px] text-gray-300 mt-0.5">fields</div>
          </div>
          <div className="bg-[#F0EFFE] rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-[#5B5BD6]">{total}</div>
            <div className="text-[10px] text-[#5B5BD6] font-semibold uppercase tracking-wide">Total</div>
            <div className="text-[10px] text-[#5B5BD6]/60 mt-0.5">fields</div>
          </div>
        </div>

        {/* Capture rate bar */}
        <div className="mb-5 bg-gray-50 rounded-xl p-3">
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-gray-500 font-semibold">Capture Rate</span>
            <span className="text-xs font-bold text-[#5B5BD6]">{Math.round((captured / total) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#5B5BD6] rounded-full"
              style={{ width: `${Math.round((captured / total) * 100)}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
            System shows {pending} pending fields rather than filling missing data — demonstrating honest incomplete data handling.
          </p>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center gap-2 py-2 border-b border-gray-100">
            <FileText size={14} className="text-[#5B5BD6]" />
            <span className="text-xs text-gray-500 flex-1">Application ID</span>
            <span className="text-xs font-semibold text-gray-800">SHB/HL/GZB/26/084217</span>
          </div>
          <div className="flex items-center gap-2 py-2 border-b border-gray-100">
            <Clock size={14} className="text-[#5B5BD6]" />
            <span className="text-xs text-gray-500 flex-1">Session Duration</span>
            <span className="text-xs font-semibold text-gray-800">{formatDuration(sessionState.elapsedMs)}</span>
          </div>
        </div>

        {/* Q-group status list */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Question Status</p>
        <div className="flex flex-col gap-1 mb-5">
          {qStatuses.map(q => (
            <div key={q.questionNumber} className="flex items-center gap-2 py-1.5">
              {q.status === 'captured' ? (
                <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
              ) : q.status === 'partial' ? (
                <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-600 flex-1">{q.questionNumber} — {q.label}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                q.status === 'captured' ? 'bg-emerald-100 text-emerald-700' :
                q.status === 'partial'  ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-400'
              }`}>
                {q.status === 'captured' ? 'Captured' : q.status === 'partial' ? 'Partial' : 'Pending'}
              </span>
            </div>
          ))}
        </div>

        {/* Follow-up actions */}
        {sessionState.actions.length > 0 && (
          <>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Follow-Up Actions
            </p>
            <div className="flex flex-col gap-1.5 mb-5">
              {sessionState.actions.map(a => (
                <div key={a.id} className="flex gap-2 p-2.5 bg-[#F0EFFE] rounded-xl">
                  <span className="text-[#5B5BD6] text-xs font-bold">→</span>
                  <p className="text-xs text-gray-700">{a.text}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-[10px] text-gray-400 text-center mb-5 leading-relaxed">
          This is a demonstration. No data has been submitted to Salesforce or any external system.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onReturnHome}
            className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold"
          >
            Return Home
          </button>
          <button
            onClick={onStartNew}
            className="flex-1 h-11 rounded-xl bg-[#5B5BD6] text-white text-sm font-semibold shadow-md shadow-[#5B5BD6]/30"
          >
            New Demo
          </button>
        </div>
      </div>
    </div>
  );
}
