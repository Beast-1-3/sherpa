// src/components/FieldSummaryCard.tsx
import { useState } from 'react';
import { MoreHorizontal, X, Info } from 'lucide-react';
import type { PDField } from '../data/pdFieldSchema';
import { DEMO_CASE } from '../data/demoCase';

interface Props {
  fields: PDField[];
}

interface CasePrefillRow {
  label: string;
  value: string;
  badge: 'C' | 'P';
  source: 'case_prefill';
  id: string;
}

const CASE_PREFILL_ROWS: CasePrefillRow[] = [
  { id: 'cp_app_id', label: 'Application/Loan ID', value: DEMO_CASE.applicationId, badge: 'C', source: 'case_prefill' },
  { id: 'cp_login_date', label: 'Login Date', value: DEMO_CASE.loginDate, badge: 'C', source: 'case_prefill' },
  { id: 'cp_pd_date', label: 'PD Date/Time', value: '—', badge: 'P', source: 'case_prefill' },
  { id: 'cp_branch', label: 'Branch/Cluster', value: DEMO_CASE.branch, badge: 'C', source: 'case_prefill' },
  { id: 'cp_applicant', label: 'Applicant Name', value: DEMO_CASE.applicantName, badge: 'C', source: 'case_prefill' },
  { id: 'cp_coapplicant', label: 'Co-Applicant', value: DEMO_CASE.coApplicantName, badge: 'C', source: 'case_prefill' },
  { id: 'cp_product', label: 'Product', value: DEMO_CASE.product, badge: 'C', source: 'case_prefill' },
  { id: 'cp_persona', label: 'Persona', value: DEMO_CASE.persona, badge: 'C', source: 'case_prefill' },
  { id: 'cp_aip', label: 'AIP Program', value: 'Yes — Demo Config', badge: 'C', source: 'case_prefill' },
];

const Q_GROUP_LABELS: Record<string, string> = {
  Q9: 'Q9 — Aadhaar Mobile Linkage',
  Q10: 'Q10 — Repayment Bank Mobile',
  Q11: 'Q11 — Family Information',
  Q12: 'Q12 — Professional Journey',
  Q13: 'Q13 — Current Business Profile',
  Q14: 'Q14 — Major Suppliers',
  Q15: 'Q15 — Monthly Income & Expenditure',
  Q16: 'Q16 — Existing Loans & EMIs',
  Q17: 'Q17 — EMI Bounce History',
  Q18: 'Q18 — Property Details',
};

interface ModalData {
  label: string;
  value: string | null;
  source: string;
  timestamp?: number;
  evidenceText?: string;
  status: PDField['status'] | 'case_prefill';
  verificationNote?: string;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function StatusBadge({ badge, status }: { badge: 'C' | 'P'; status?: PDField['status'] }) {
  if (badge === 'C') {
    const isPartial = status === 'partial';
    const isNeedsClarification = status === 'needs_clarification';
    return (
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold ${
        isNeedsClarification ? 'bg-amber-500 text-white' :
        isPartial ? 'bg-[#5B5BD6]/60 text-white' :
        'bg-[#5B5BD6] text-white'
      }`}>
        {isNeedsClarification ? '!' : 'C'}
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-400 text-white text-[11px] font-bold">
      P
    </div>
  );
}

function DetailModal({ data, onClose }: { data: ModalData; onClose: () => void }) {
  const sourceLabel =
    data.source === 'case_prefill' ? 'Case Prefill' :
    data.source === 'calculated' ? 'Calculated from Conversation' :
    'Borrower Conversation';

  const statusLabel =
    data.status === 'captured' ? 'Captured' :
    data.status === 'partial' ? 'Partially Captured' :
    data.status === 'needs_clarification' ? 'Needs Clarification' :
    data.status === 'case_prefill' ? 'Case Prefill' :
    'Pending';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-t-2xl w-full max-w-[400px] p-5 pb-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-900">{data.label}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">Value</span>
            <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%]">{data.value ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">Source</span>
            <span className="text-sm text-gray-700">{sourceLabel}</span>
          </div>
          {data.timestamp !== undefined && (
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500">Timestamp</span>
              <span className="text-sm text-gray-700">{formatTime(data.timestamp)}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-xs text-gray-500">Status</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              data.status === 'captured' ? 'bg-emerald-100 text-emerald-700' :
              data.status === 'partial' ? 'bg-blue-100 text-blue-700' :
              data.status === 'needs_clarification' ? 'bg-amber-100 text-amber-700' :
              data.status === 'case_prefill' ? 'bg-[#5B5BD6]/10 text-[#5B5BD6]' :
              'bg-gray-100 text-gray-500'
            }`}>{statusLabel}</span>
          </div>
          {data.evidenceText && (
            <div className="py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 block mb-1">Supporting Statement</span>
              <p className="text-sm text-gray-700 italic leading-snug">"{data.evidenceText}"</p>
            </div>
          )}
          {data.verificationNote && (
            <div className="flex gap-2 p-3 bg-amber-50 rounded-xl">
              <Info size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-snug">{data.verificationNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FieldSummaryCard({ fields }: Props) {
  const [modal, setModal] = useState<ModalData | null>(null);

  // Group PD fields by question number
  const grouped: Record<string, PDField[]> = {};
  for (const field of fields) {
    if (!grouped[field.questionNumber]) grouped[field.questionNumber] = [];
    grouped[field.questionNumber].push(field);
  }

  const openCasePrefill = (row: CasePrefillRow) => {
    setModal({
      label: row.label,
      value: row.value,
      source: 'case_prefill',
      status: 'case_prefill',
    });
  };

  const openFieldDetail = (field: PDField) => {
    setModal({
      label: field.label,
      value: field.value,
      source: field.source,
      timestamp: field.evidenceTimestamp,
      evidenceText: field.evidenceText,
      status: field.status,
      verificationNote: field.verificationNote,
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-900">Field Summary</h2>
          <MoreHorizontal size={18} className="text-gray-300" />
        </div>

        {/* Header row */}
        <div className="flex items-center gap-3 px-1 mb-2">
          <div className="w-6" />
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex-1">Field Name</span>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-32 text-right">Current Value</span>
        </div>

        {/* Case prefill rows */}
        <div className="mb-3">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-1 mb-1.5">
            Case Information
          </div>
          {CASE_PREFILL_ROWS.map(row => (
            <button
              key={row.id}
              onClick={() => openCasePrefill(row)}
              className="w-full flex items-center gap-3 py-2.5 px-1 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left"
            >
              <StatusBadge badge={row.badge} />
              <span className="text-sm text-gray-700 flex-1 leading-tight">{row.label}</span>
              <span className="text-sm text-gray-800 font-medium text-right w-32 truncate leading-tight">
                {row.value}
              </span>
            </button>
          ))}
        </div>

        {/* PD Question Groups */}
        {Object.entries(Q_GROUP_LABELS).map(([qNum, groupLabel]) => {
          const groupFields = grouped[qNum] || [];
          if (groupFields.length === 0) return null;

          return (
            <div key={qNum} className="mb-3">
              <div className="text-[10px] font-semibold text-[#5B5BD6] uppercase tracking-widest px-1 mb-1.5">
                {groupLabel}
              </div>
              {groupFields.map(field => {
                const badge: 'C' | 'P' = (field.status === 'captured' || field.status === 'partial' || field.status === 'needs_clarification') ? 'C' : 'P';
                return (
                  <button
                    key={field.id}
                    onClick={() => openFieldDetail(field)}
                    className="w-full flex items-center gap-3 py-2.5 px-1 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left field-row"
                    data-field-id={field.id}
                  >
                    <StatusBadge badge={badge} status={field.status} />
                    <span className="text-sm text-gray-700 flex-1 leading-tight">{field.label}</span>
                    <span className={`text-sm text-right w-32 leading-tight truncate ${
                      field.value ? 'text-gray-800 font-medium' : 'text-gray-300'
                    }`}>
                      {field.value ?? '—'}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {modal && <DetailModal data={modal} onClose={() => setModal(null)} />}
    </>
  );
}
