// src/components/AlertsCard.tsx
import { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, X, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import type { AlertItem } from '../engine/sessionEngine';
import { sessionEngine } from '../engine/sessionEngine';

interface Props {
  alerts: AlertItem[];
  isLive: boolean;
}

export default function AlertsCard({ alerts, isLive }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showResolved, setShowResolved] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // An alert is active if not dismissed (locally or on engine) and not resolved
  const activeAlerts = alerts.filter(
    a => !a.resolved && !a.dismissed && !dismissedIds.has(a.id)
  );

  const resolvedAlerts = alerts.filter(
    a => a.resolved && !a.dismissed && !dismissedIds.has(a.id)
  );

  // High priority count among active alerts
  const highCount = activeAlerts.filter(a => a.severity === 'high').length;

  // Sorting: High priority first, then Warning, then Information. Most recent first within same severity.
  const severityRank: Record<string, number> = {
    high: 0,
    warning: 1,
    info: 2,
  };

  const sortedActive = [...activeAlerts].sort((a, b) => {
    const rankDiff = (severityRank[a.severity] ?? 3) - (severityRank[b.severity] ?? 3);
    if (rankDiff !== 0) return rankDiff;
    return b.timestamp - a.timestamp;
  });

  const displayLimit = 2;
  const visibleAlerts = expanded ? sortedActive : sortedActive.slice(0, displayLimit);
  const hasMore = sortedActive.length > displayLimit;

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
    sessionEngine.dismissAlert(id);
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/80">
      {/* ── Section Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900">Alerts</h2>
          {isLive && activeAlerts.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                Active: {activeAlerts.length.toString().padStart(2, '0')}
              </span>
              {highCount > 0 && (
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200/70 px-2 py-0.5 rounded-full animate-pulse">
                  High: {highCount.toString().padStart(2, '0')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Counter summary */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {activeAlerts.length === 0 && isLive && (
            <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              All Clear
            </span>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      {activeAlerts.length === 0 ? (
        <div className="py-2">
          <p className="text-sm text-gray-400 leading-relaxed">
            {isLive
              ? 'No active alerts at this time.'
              : 'Alerts will appear here when something needs your attention.'}
          </p>

          {/* Show resolved toggle if resolved alerts exist */}
          {resolvedAlerts.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowResolved(!showResolved)}
                className="text-xs font-semibold text-emerald-600 flex items-center gap-1"
              >
                <CheckCircle size={13} />
                <span>Resolved Alerts ({resolvedAlerts.length})</span>
                {showResolved ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {visibleAlerts.map(alert => {
            if (alert.severity === 'high') {
              // High Priority Alert Card (Red accent with vertical red left border)
              return (
                <div
                  key={alert.id}
                  className="relative flex gap-3 p-3.5 rounded-xl bg-[#FEF5F5] border border-red-200/80 border-l-4 border-l-red-500 shadow-xs transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle size={15} />
                  </div>

                  <div className="flex-1 min-w-0 pr-5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold text-red-900 leading-tight">
                        {alert.title || 'High Priority Alert'}
                      </span>
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-red-600 text-white rounded">
                        High
                      </span>
                    </div>

                    <p className="text-xs text-red-800 leading-snug font-normal">
                      {alert.text}
                    </p>

                    {alert.basedOn && (
                      <span className="text-[10px] text-red-600 font-medium mt-1.5 block">
                        Based on: {alert.basedOn}
                      </span>
                    )}
                  </div>

                  {/* Dismiss X button */}
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="absolute top-2.5 right-2.5 p-1 text-red-400 hover:text-red-700 rounded-md transition-colors"
                    aria-label="Dismiss alert"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }

            if (alert.severity === 'warning') {
              // Warning Alert Card (Amber accent)
              return (
                <div
                  key={alert.id}
                  className="relative flex gap-3 p-3.5 rounded-xl bg-[#FFFDF5] border border-amber-200/80 shadow-xs transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle size={15} />
                  </div>

                  <div className="flex-1 min-w-0 pr-5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-bold text-amber-950 leading-tight">
                        {alert.title || 'Warning'}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded">
                        Warning
                      </span>
                    </div>

                    <p className="text-xs text-amber-900 leading-snug font-normal">
                      {alert.text}
                    </p>

                    {alert.basedOn && (
                      <span className="text-[10px] text-amber-700 font-medium mt-1.5 block">
                        Based on: {alert.basedOn}
                      </span>
                    )}
                  </div>

                  {/* Dismiss X button */}
                  <button
                    onClick={() => handleDismiss(alert.id)}
                    className="absolute top-2.5 right-2.5 p-1 text-amber-400 hover:text-amber-700 rounded-md transition-colors"
                    aria-label="Dismiss alert"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            }

            // Information Alert Card (Lavender / Soft Purple accent)
            return (
              <div
                key={alert.id}
                className="relative flex gap-3 p-3.5 rounded-xl bg-[#F9F8FF] border border-[#E9E7FD] shadow-xs transition-all"
              >
                <div className="w-6 h-6 rounded-full bg-[#EBE7FF] text-[#5B5BD6] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info size={15} />
                </div>

                <div className="flex-1 min-w-0 pr-5">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold text-gray-900 leading-tight">
                      {alert.title || 'Information'}
                    </span>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 bg-[#EBE7FF] text-[#5B5BD6] rounded">
                      Info
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-snug font-normal">
                    {alert.text}
                  </p>

                  {alert.basedOn && (
                    <span className="text-[10px] text-gray-500 font-medium mt-1.5 block">
                      Based on: {alert.basedOn}
                    </span>
                  )}
                </div>

                {/* Dismiss X button */}
                <button
                  onClick={() => handleDismiss(alert.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-gray-700 rounded-md transition-colors"
                  aria-label="Dismiss alert"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}

          {/* View All / Show Less button */}
          {hasMore && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1 w-full py-1.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-gray-600 flex items-center justify-center gap-1 transition-colors"
            >
              <span>{expanded ? 'Show Less' : `View All (${sortedActive.length}) Alerts`}</span>
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          {/* Resolved Alerts Accordion */}
          {resolvedAlerts.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setShowResolved(!showResolved)}
                className="text-xs font-semibold text-emerald-600 flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-emerald-500" />
                  <span>Resolved Alerts ({resolvedAlerts.length})</span>
                </div>
                {showResolved ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {showResolved && (
                <div className="flex flex-col gap-2 mt-2">
                  {resolvedAlerts.map(alert => (
                    <div
                      key={alert.id}
                      className="flex gap-2.5 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100"
                    >
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 line-through leading-snug">
                          {alert.title}: {alert.text}
                        </p>
                        <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                          ✓ Resolved automatically at 01:27
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
