// src/data/pdFieldSchema.ts
// Hero Housing Finance PD Field Definitions Q9–Q18
// Total field count: 40 (24 captured / 16 pending at end of demo)

export type FieldStatus = 'pending' | 'captured' | 'partial' | 'needs_clarification';
export type FieldSource = 'case_prefill' | 'borrower_conversation' | 'calculated';
export type BadgeType = 'C' | 'P'; // C = Captured/Complete, P = Pending

export interface PDField {
  id: string;
  questionGroup: string;
  questionNumber: string; // Q9, Q10, etc.
  label: string;
  value: string | null;
  status: FieldStatus;
  source: FieldSource;
  evidenceEventId?: string;
  evidenceTimestamp?: number;
  evidenceText?: string;
  verificationNote?: string;
}

export function getBadge(status: FieldStatus): BadgeType {
  return status === 'captured' || status === 'partial' ? 'C' : 'P';
}

export function getInitialPDFields(): PDField[] {
  return [
    // ── Q9 — Aadhaar Mobile Linkage (1 field) ─────────────────────────────
    {
      id: 'q9_aadhaar_mobile',
      questionGroup: 'Q9',
      questionNumber: 'Q9',
      label: 'Aadhaar Mobile Linked',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q10 — Repayment Bank Mobile Linkage (1 field — PENDING at end) ────
    {
      id: 'q10_bank_mobile',
      questionGroup: 'Q10',
      questionNumber: 'Q10',
      label: 'Repayment Account Mobile Linkage',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q11 — Family Information (4 fields; 2 captured / 2 pending) ────────
    {
      id: 'q11_spouse',
      questionGroup: 'Q11',
      questionNumber: 'Q11',
      label: 'Spouse Name',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q11_children',
      questionGroup: 'Q11',
      questionNumber: 'Q11',
      label: 'Number of Children',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q11_parents_background',
      questionGroup: 'Q11',
      questionNumber: 'Q11',
      label: 'Parents / Family Background',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q11_siblings',
      questionGroup: 'Q11',
      questionNumber: 'Q11',
      label: 'Siblings',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q12 — Professional Journey (3 fields; 2 captured / 1 pending) ──────
    {
      id: 'q12_prev_work',
      questionGroup: 'Q12',
      questionNumber: 'Q12',
      label: 'Previous Occupation',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q12_prev_experience',
      questionGroup: 'Q12',
      questionNumber: 'Q12',
      label: 'Previous Experience',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q12_complete_journey',
      questionGroup: 'Q12',
      questionNumber: 'Q12',
      label: 'Complete Professional Journey',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q13 — Current Business Profile (5 fields; 4 captured / 1 pending) ──
    {
      id: 'q13_business_name',
      questionGroup: 'Q13',
      questionNumber: 'Q13',
      label: 'Business Name',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q13_nature',
      questionGroup: 'Q13',
      questionNumber: 'Q13',
      label: 'Nature of Business',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q13_employment_type',
      questionGroup: 'Q13',
      questionNumber: 'Q13',
      label: 'Employment Type',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q13_role',
      questionGroup: 'Q13',
      questionNumber: 'Q13',
      label: 'Role / Designation',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q13_business_duration',
      questionGroup: 'Q13',
      questionNumber: 'Q13',
      label: 'Business Operating Duration',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q14 — Major Suppliers (5 fields; 1 captured / 4 pending) ────────────
    {
      id: 'q14_supplier1',
      questionGroup: 'Q14',
      questionNumber: 'Q14',
      label: 'Supplier 1 Name',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q14_supplier1_contact',
      questionGroup: 'Q14',
      questionNumber: 'Q14',
      label: 'Supplier 1 Mobile',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q14_supplier2',
      questionGroup: 'Q14',
      questionNumber: 'Q14',
      label: 'Supplier 2 Name',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q14_supplier2_contact',
      questionGroup: 'Q14',
      questionNumber: 'Q14',
      label: 'Supplier 2 Mobile',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q15 — Monthly Income & Expenditure (12 fields; 8 captured / 4 pending)
    {
      id: 'q15_business_income',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Monthly Business Sales',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q15_other_income',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Other Monthly Income',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q15_total_income',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Total Monthly Income',
      value: null,
      status: 'pending',
      source: 'calculated',
    },
    {
      id: 'q15_cost_of_goods',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Cost of Goods',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q15_staff_salary',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Staff Salary',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q15_shop_rent',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Shop Rent',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q15_electricity',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Electricity',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q15_miscellaneous',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Misc. Expenses',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    // Household expenses — NOT confirmed in this demo → stays pending
    {
      id: 'q15_family_expenses',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Household Expenses',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    // Net appraisal — cannot be calculated without household expenses
    {
      id: 'q15_net_appraisal',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Net Monthly Appraisal Income',
      value: 'Pending Calculation',
      status: 'pending',
      source: 'calculated',
      verificationNote: 'Cannot be calculated — household expenses not yet confirmed',
    },
    // Total expenses — cannot be calculated without household expenses
    {
      id: 'q15_total_expenses',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Total Monthly Expenses',
      value: 'Pending Calculation',
      status: 'pending',
      source: 'calculated',
      verificationNote: 'Cannot be calculated — household expenses not yet confirmed',
    },
    // Net income in hand — cannot be calculated without household expenses
    {
      id: 'q15_net_in_hand',
      questionGroup: 'Q15',
      questionNumber: 'Q15',
      label: 'Net Income in Hand',
      value: 'Pending Calculation',
      status: 'pending',
      source: 'calculated',
      verificationNote: 'Cannot be calculated — household expenses not yet confirmed',
    },

    // ── Q16 — Existing Loans (2 fields; both captured) ────────────────────
    {
      id: 'q16_loan_type',
      questionGroup: 'Q16',
      questionNumber: 'Q16',
      label: 'Existing Loan Type',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q16_monthly_emi',
      questionGroup: 'Q16',
      questionNumber: 'Q16',
      label: 'Monthly EMI',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q17 — EMI Bounce History (4 fields; 1 captured / 3 pending) ─────────
    {
      id: 'q17_bounce_reported',
      questionGroup: 'Q17',
      questionNumber: 'Q17',
      label: 'EMI Bounce Reported',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q17_bounce_count',
      questionGroup: 'Q17',
      questionNumber: 'Q17',
      label: 'Bounce Count / Timing',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q17_bounce_reason',
      questionGroup: 'Q17',
      questionNumber: 'Q17',
      label: 'Bounce Reason',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },

    // ── Q18 — Property Details (5 fields; 3 captured / 2 pending) ────────────
    {
      id: 'q18_purpose',
      questionGroup: 'Q18',
      questionNumber: 'Q18',
      label: 'Property Purpose',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q18_location',
      questionGroup: 'Q18',
      questionNumber: 'Q18',
      label: 'Property Location',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q18_property_value',
      questionGroup: 'Q18',
      questionNumber: 'Q18',
      label: 'Borrower-Reported Value',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
      verificationNote: 'Borrower-estimated — formal valuation pending',
    },
    {
      id: 'q18_property_configuration',
      questionGroup: 'Q18',
      questionNumber: 'Q18',
      label: 'Property Configuration',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
    {
      id: 'q18_own_contribution',
      questionGroup: 'Q18',
      questionNumber: 'Q18',
      label: 'Own Contribution',
      value: null,
      status: 'pending',
      source: 'borrower_conversation',
    },
  ];
}

// Q group status summary
export interface QGroupStatus {
  questionNumber: string;
  label: string;
  status: 'captured' | 'partial' | 'pending';
}

export function getQuestionGroupStatuses(fields: PDField[]): QGroupStatus[] {
  const groups: Record<string, { label: string; fields: PDField[] }> = {
    Q9:  { label: 'Aadhaar Mobile Linkage',      fields: [] },
    Q10: { label: 'Repayment Bank Mobile',        fields: [] },
    Q11: { label: 'Family Information',           fields: [] },
    Q12: { label: 'Professional Journey',         fields: [] },
    Q13: { label: 'Current Business Profile',     fields: [] },
    Q14: { label: 'Major Suppliers',              fields: [] },
    Q15: { label: 'Monthly Income & Expenditure', fields: [] },
    Q16: { label: 'Existing Loans & EMIs',        fields: [] },
    Q17: { label: 'EMI Bounce History',           fields: [] },
    Q18: { label: 'Property Details',             fields: [] },
  };

  for (const field of fields) {
    if (groups[field.questionNumber]) {
      groups[field.questionNumber].fields.push(field);
    }
  }

  return Object.entries(groups).map(([qNum, { label, fields: qFields }]) => {
    const allCaptured = qFields.every(f => f.status === 'captured');
    const anyPartialOrCaptured = qFields.some(
      f => f.status === 'captured' || f.status === 'partial' || f.status === 'needs_clarification'
    );
    const status = allCaptured ? 'captured' : anyPartialOrCaptured ? 'partial' : 'pending';
    return { questionNumber: qNum, label, status };
  });
}

/**
 * Count individual fields captured vs pending.
 * "Pending Calculation" value fields count as PENDING.
 * Case-prefill 'captured' fields count as captured.
 */
export function getFieldCounts(fields: PDField[]): { captured: number; total: number; pending: number } {
  const total = fields.length;
  const captured = fields.filter(
    f =>
      (f.status === 'captured' || f.status === 'partial') &&
      f.value !== null &&
      f.value !== 'Pending' &&
      f.value !== 'Pending Calculation'
  ).length;
  return { captured, total, pending: total - captured };
}
