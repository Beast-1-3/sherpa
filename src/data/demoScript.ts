// src/data/demoScript.ts
// Hinglish PD conversation script — 6 demo stages, 24/40 fields captured

import type { PDField } from './pdFieldSchema';

export type Speaker = 'SM' | 'Borrower';

export type NudgePriority = 'High' | 'Medium' | 'Low';
export type AlertSeverity  = 'info' | 'warning' | 'high';

export interface ScriptNudge {
  id: string;
  title: string;
  text: string;           // Hinglish coaching text
  questionTag: string;    // e.g. "Q10 · Open"
  priority: NudgePriority;
}

export interface ScriptAlert {
  id: string;
  title: string;          // Bold alert heading
  text: string;           // Hinglish body
  severity: AlertSeverity;
  basedOn: string;        // e.g. "Q10 — Repayment Account Linkage"
}

export interface ScriptAction {
  id: string;
  title: string;
  type: string;           // Verification / Data Collection / Financial Clarification / etc.
  priority: NudgePriority;
  owner: string;
  trigger: string;        // e.g. "Q10 — Bank Linkage Unconfirmed"
  description: string;    // Hinglish follow-up description
}

export interface FieldUpdate {
  id: string;
  value: string;
  status: PDField['status'];
  verificationNote?: string;
}

export interface ScriptEvent {
  id: string;
  timeMs: number;
  speaker: Speaker;
  text: string;
  fieldUpdates?: FieldUpdate[];
  nudge?: ScriptNudge;
  alert?: ScriptAlert;
  action?: ScriptAction;
  resolveNudgeId?: string;
  resolveAlertId?: string;
}

export const DEMO_SCRIPT: ScriptEvent[] = [

  // ── 00:04  SM opens ───────────────────────────────────────────────────────
  {
    id: 'evt_004',
    timeMs: 4000,
    speaker: 'SM',
    text: 'Namaste Ramesh ji. Aaj aapke home loan ke liye personal discussion kar lete hain. Theek hai?',
  },

  // ── 00:07  Borrower agrees ────────────────────────────────────────────────
  {
    id: 'evt_007',
    timeMs: 7000,
    speaker: 'Borrower',
    text: 'Ji sir, bilkul.',
  },

  // ── 00:10  SM asks Aadhaar linkage ────────────────────────────────────────
  {
    id: 'evt_010',
    timeMs: 10000,
    speaker: 'SM',
    text: 'Aapka mobile number Aadhaar se linked hai na?',
  },

  // ── 00:15  Aadhaar confirmed but bank mobile unclear → Nudge 1 + Alert 1 + Action 1
  {
    id: 'evt_015',
    timeMs: 15000,
    speaker: 'Borrower',
    text: 'Haan sir, Aadhaar mein yahi number linked hai. Lekin EMI wale bank account mein kaunsa number hai, woh abhi pakka nahi pata.',
    fieldUpdates: [
      {
        id: 'q9_aadhaar_mobile',
        value: 'Yes (Borrower Reported)',
        status: 'captured',
        verificationNote: 'Borrower-stated; not independently verified',
      },
    ],
    nudge: {
      id: 'nudge_bank_mobile',
      title: 'Bank Account Verification',
      text: 'Borrower ko repayment bank account mein linked mobile number confirm karne ke liye guide karein. Yeh detail abhi pending hai.',
      questionTag: 'Q10 · Open',
      priority: 'High',
    },
    alert: {
      id: 'alert_bank_linkage',
      title: 'Bank Linkage Unconfirmed',
      text: 'Repayment bank account ka registered mobile number confirm nahi hua hai. Isko verify karna pending hai.',
      severity: 'warning',
      basedOn: 'Q10 — Repayment Account Linkage',
    },
    action: {
      id: 'action_bank_mobile',
      title: 'Verify Bank Mobile Linkage',
      type: 'Verification',
      priority: 'High',
      owner: 'Hero Housing Sales Manager',
      trigger: 'Q10 — Bank Linkage Unconfirmed',
      description: 'Borrower se EMI repayment bank account ka registered mobile number confirm karein.',
    },
  },

  // ── 00:22  SM asks family details ─────────────────────────────────────────
  {
    id: 'evt_022',
    timeMs: 22000,
    speaker: 'SM',
    text: 'Achha, ghar mein kaun-kaun rehta hai?',
  },

  // ── 00:28  Partial family info → Nudge 2
  {
    id: 'evt_028',
    timeMs: 28000,
    speaker: 'Borrower',
    text: 'Meri wife Sunita hai aur do bachche hain.',
    fieldUpdates: [
      { id: 'q11_spouse',   value: 'Sunita Gupta', status: 'captured' },
      { id: 'q11_children', value: '2',            status: 'captured' },
    ],
    nudge: {
      id: 'nudge_family_details',
      title: 'Family Background',
      text: 'Family details mein parents aur siblings ki information missing hai. Inke baare mein bhi poochhein.',
      questionTag: 'Q11 · Open',
      priority: 'Medium',
    },
  },

  // ── 00:35  SM asks previous work ──────────────────────────────────────────
  {
    id: 'evt_035',
    timeMs: 35000,
    speaker: 'SM',
    text: 'Isse pehle aap kya kaam karte the?',
  },

  // ── 00:43  Previous job captured → Nudge 3
  {
    id: 'evt_043',
    timeMs: 43000,
    speaker: 'Borrower',
    text: 'Pehle main wholesale ki dukaan par teen saal job karta tha.',
    fieldUpdates: [
      { id: 'q12_prev_work',       value: 'Wholesale Shop Employee', status: 'captured' },
      { id: 'q12_prev_experience', value: '3 Years',                status: 'captured' },
    ],
    nudge: {
      id: 'nudge_work_history',
      title: 'Professional History',
      text: 'Customer ne previous job batayi hai. Education se lekar current business tak ka complete work journey confirm karein.',
      questionTag: 'Q12 · Open',
      priority: 'Medium',
    },
  },

  // ── 00:49  SM asks current business ──────────────────────────────────────
  {
    id: 'evt_049',
    timeMs: 49000,
    speaker: 'SM',
    text: 'Aur abhi aapka current business kya hai?',
  },

  // ── 00:56  Business profile captured → Nudge 4
  {
    id: 'evt_056',
    timeMs: 56000,
    speaker: 'Borrower',
    text: 'Gupta General Store naam ki meri kirane ki shop hai. Main khud owner hoon.',
    fieldUpdates: [
      { id: 'q13_business_name',   value: 'Gupta General Store',     status: 'captured' },
      { id: 'q13_nature',          value: 'Grocery / Kirana Retail', status: 'captured' },
      { id: 'q13_employment_type', value: 'Self Employed',           status: 'captured' },
      { id: 'q13_role',            value: 'Proprietor',              status: 'captured' },
    ],
    nudge: {
      id: 'nudge_business_duration',
      title: 'Business Experience',
      text: 'Customer ki current shop kitne saal se chal rahi hai, yeh confirm karein.',
      questionTag: 'Q13 · Open',
      priority: 'Medium',
    },
  },

  // ── 01:02  SM asks suppliers ──────────────────────────────────────────────
  {
    id: 'evt_062',
    timeMs: 62000,
    speaker: 'SM',
    text: 'Do main suppliers kaun hain? Unke contact numbers bhi chahiye.',
  },

  // ── 01:09  Partial supplier info → Nudge 5 + Alert 2 + Action 2
  {
    id: 'evt_069',
    timeMs: 69000,
    speaker: 'Borrower',
    text: 'Sharma Distributors se maal leta hoon. Doosre supplier ka naam aur dono ke numbers baad mein share karunga.',
    fieldUpdates: [
      { id: 'q14_supplier1',         value: 'Sharma Distributors', status: 'captured' },
      { id: 'q14_supplier1_contact', value: 'Pending',             status: 'partial'  },
    ],
    nudge: {
      id: 'nudge_supplier_contacts',
      title: 'Supplier Information',
      text: 'Second supplier ka naam aur dono suppliers ke mobile numbers pending hain. Customer se details collect karein.',
      questionTag: 'Q14 · Open',
      priority: 'High',
    },
    alert: {
      id: 'alert_supplier_incomplete',
      title: 'Supplier Details Incomplete',
      text: '3 supplier details missing hain: second supplier name aur dono suppliers ke mobile numbers.',
      severity: 'warning',
      basedOn: 'Q14 — Customer/Supplier Details',
    },
    action: {
      id: 'action_supplier_contacts',
      title: 'Collect Supplier Contact Details',
      type: 'Data Collection',
      priority: 'High',
      owner: 'Hero Housing Sales Manager',
      trigger: 'Q14 — Incomplete Supplier Information',
      description: 'Second supplier ka name aur dono suppliers ke mobile numbers collect karein.',
    },
  },

  // ── 01:14  SM asks monthly income ─────────────────────────────────────────
  {
    id: 'evt_074',
    timeMs: 74000,
    speaker: 'SM',
    text: 'Mahine ka dukaan ka income roughly kitna hota hai?',
  },

  // ── 01:18  Ambiguous "teen bees" → Nudge 6 + Alert 3
  {
    id: 'evt_078',
    timeMs: 78000,
    speaker: 'Borrower',
    text: 'Sir, lagbhag teen bees ka kaam ho jata hai.',
    nudge: {
      id: 'nudge_income_ambiguous',
      title: 'Income Clarification',
      text: 'Customer ne "teen bees" bola hai. Confirm karein ki ₹3.20 lakh monthly sales hai ya net profit.',
      questionTag: 'Q15 · Ambiguous',
      priority: 'High',
    },
    alert: {
      id: 'alert_income_ambiguous',
      title: 'Income Clarification Required',
      text: 'Customer ka stated income amount unclear hai. Monthly sales aur net profit mein clarification required hai.',
      severity: 'warning',
      basedOn: 'Q15 — Monthly Income',
    },
  },

  // ── 01:21  SM clarifies ────────────────────────────────────────────────────
  {
    id: 'evt_081',
    timeMs: 81000,
    speaker: 'SM',
    text: 'Teen lakh bees hazaar monthly sale hai, ya net profit?',
  },

  // ── 01:27  Borrower clarifies → resolve Nudge 6 + Alert 3
  {
    id: 'evt_087',
    timeMs: 87000,
    speaker: 'Borrower',
    text: 'Sir, sale hai. Mahine ki teen lakh bees hazaar. Ek room ka rent bhi bees hazaar milta hai.',
    fieldUpdates: [
      { id: 'q15_business_income', value: '₹3,20,000 (Monthly Sales)', status: 'captured' },
      { id: 'q15_other_income',    value: '₹20,000 (Rental)',          status: 'captured' },
      { id: 'q15_total_income',    value: '₹3,40,000',                 status: 'captured' },
    ],
    resolveNudgeId: 'nudge_income_ambiguous',
    resolveAlertId: 'alert_income_ambiguous',
  },

  // ── 01:30  SM asks expenses ────────────────────────────────────────────────
  {
    id: 'evt_090',
    timeMs: 90000,
    speaker: 'SM',
    text: 'Maal, staff aur dukaan ke regular kharche kitne hote hain?',
  },

  // ── 01:41  Business expenses captured ─────────────────────────────────────
  {
    id: 'evt_101',
    timeMs: 101000,
    speaker: 'Borrower',
    text: 'Maal mein ek lakh assi hazaar, staff ki salary tees hazaar, shop rent pandrah hazaar, bijli paanch hazaar aur baaki kharcha dus hazaar.',
    fieldUpdates: [
      { id: 'q15_cost_of_goods', value: '₹1,80,000', status: 'captured' },
      { id: 'q15_staff_salary',  value: '₹30,000',   status: 'captured' },
      { id: 'q15_shop_rent',     value: '₹15,000',   status: 'captured' },
      { id: 'q15_electricity',   value: '₹5,000',    status: 'captured' },
      { id: 'q15_miscellaneous', value: '₹10,000',   status: 'captured' },
    ],
  },

  // ── 01:45  SM asks household expenses + EMI ───────────────────────────────
  {
    id: 'evt_105',
    timeMs: 105000,
    speaker: 'SM',
    text: 'Ghar ka monthly kharcha aur koi loan ki EMI bhi bata dijiye.',
  },

  // ── 01:49  Household unclear, EMI confirmed → Nudge 7 + Alert 4 + Alert 5 + Action 3
  {
    id: 'evt_109',
    timeMs: 109000,
    speaker: 'Borrower',
    text: 'Ghar ka exact monthly kharcha abhi confirm nahi hai sir. Gaadi ke loan ki pandrah hazaar EMI jaati hai.',
    fieldUpdates: [
      { id: 'q16_loan_type',   value: 'Vehicle Loan', status: 'captured' },
      { id: 'q16_monthly_emi', value: '₹15,000',      status: 'captured' },
    ],
    nudge: {
      id: 'nudge_household_expenses',
      title: 'Household Expenses',
      text: 'Monthly household expenses abhi clear nahi hain. Exact amount confirm karein taaki net income calculate ho sake.',
      questionTag: 'Q15 · Open',
      priority: 'High',
    },
    alert: {
      id: 'alert_household_missing',
      title: 'Net Income Calculation Pending',
      text: 'Monthly income ₹3,40,000 capture hua hai, lekin household expenses missing hain. Final net income calculate nahi ho sakta.',
      severity: 'warning',
      basedOn: 'Q15 — Financial Assessment',
    },
    action: {
      id: 'action_household_expenses',
      title: 'Confirm Household Expenses',
      type: 'Financial Clarification',
      priority: 'High',
      owner: 'Hero Housing Sales Manager',
      trigger: 'Q15 — Missing Household Expenses',
      description: 'Borrower ke monthly household expenses confirm karein, phir net appraisal income aur net income in hand calculate karein.',
    },
  },

  // ── 01:49b  EMI exposure info alert (separate event, same timestamp offset)
  {
    id: 'evt_109b',
    timeMs: 109500,
    speaker: 'SM',
    text: '₹15,000 EMI note kar li gayi hai.',
    alert: {
      id: 'alert_emi_exposure',
      title: 'Existing EMI Exposure',
      text: 'Customer ki existing EMI ₹15,000/month hai aur requested loan ₹18,50,000 hai. Complete expense details ke baad repayment capacity review karein.',
      severity: 'info',
      basedOn: 'Q16 — Existing Loan EMI',
    },
  },

  // ── 01:51  SM asks EMI bounce ─────────────────────────────────────────────
  {
    id: 'evt_111',
    timeMs: 111000,
    speaker: 'SM',
    text: 'Kabhi EMI bounce hui thi? Kab aur kis wajah se?',
  },

  // ── 01:53  Bounce admitted, details unclear → Nudge 8 + Alert 6 + Action 4
  {
    id: 'evt_113',
    timeMs: 113000,
    speaker: 'Borrower',
    text: 'Haan sir, kabhi EMI ruki thi. Kitni baar, kab aur kis wajah se, woh abhi clear nahi hai.',
    fieldUpdates: [
      {
        id: 'q17_bounce_reported',
        value: 'Yes (Borrower Reported)',
        status: 'captured',
        verificationNote: 'Borrower-stated; not bureau-verified',
      },
    ],
    nudge: {
      id: 'nudge_emi_bounce',
      title: 'EMI Bounce History',
      text: 'EMI bounce kitni baar hua, kab hua aur kya reason tha, yeh detail confirm karein.',
      questionTag: 'Q17 · Open',
      priority: 'High',
    },
    alert: {
      id: 'alert_emi_bounce',
      title: 'EMI Bounce Details Missing',
      text: 'Customer ne previous EMI bounce mention kiya hai. Bounce count, timing aur reason confirm nahi hua.',
      severity: 'warning',
      basedOn: 'Q17 — EMI Bounce History',
    },
    action: {
      id: 'action_emi_bounce',
      title: 'Review EMI Bounce History',
      type: 'Credit Verification',
      priority: 'High',
      owner: 'Hero Housing Sales Manager',
      trigger: 'Q17 — EMI Bounce Details Missing',
      description: 'Previous EMI bounce ki count, date aur reason collect karein. Available credit records se cross-check karein.',
    },
  },

  // ── 01:55  SM asks property ───────────────────────────────────────────────
  {
    id: 'evt_115',
    timeMs: 115000,
    speaker: 'SM',
    text: 'Property kahaan hai, value kitni hai? Aur apna contribution kitna hoga?',
  },

  // ── 01:58  Partial property info → Nudge 9 + Alert 7 + Action 5
  {
    id: 'evt_118',
    timeMs: 118000,
    speaker: 'Borrower',
    text: 'Ghaziabad mein hai sir, price ikattis lakh bataya hai. Property ke exact details aur apna contribution abhi final nahi hai.',
    fieldUpdates: [
      { id: 'q18_purpose',  value: 'Purchase',  status: 'captured' },
      { id: 'q18_location', value: 'Ghaziabad', status: 'captured' },
      {
        id: 'q18_property_value',
        value: '₹31,00,000 (Borrower Estimate)',
        status: 'captured',
        verificationNote: 'Borrower-estimated — formal valuation pending',
      },
    ],
    nudge: {
      id: 'nudge_property_details',
      title: 'Property Contribution',
      text: 'Property ki value mil gayi hai, lekin customer ka own contribution aur property configuration confirm karna baaki hai.',
      questionTag: 'Q18 · Open',
      priority: 'High',
    },
    alert: {
      id: 'alert_property_contribution',
      title: 'Own Contribution Unconfirmed',
      text: 'Property value ₹31,00,000 aur requested loan ₹18,50,000 hai. Indicative contribution ₹12,50,000 banta hai, lekin customer\'s actual contribution confirm nahi hua.',
      severity: 'warning',
      basedOn: 'Q18 — Property Information',
    },
    action: {
      id: 'action_property_details',
      title: 'Verify Property Contribution',
      type: 'Property Verification',
      priority: 'High',
      owner: 'Hero Housing Sales Manager',
      trigger: 'Q18 — Own Contribution Unconfirmed',
      description: 'Property configuration aur applicant ke actual own contribution ko relevant documents se confirm karein.',
    },
  },

  // ── 02:00  Script complete ────────────────────────────────────────────────
  {
    id: 'evt_120',
    timeMs: 120000,
    speaker: 'SM',
    text: '[Scripted conversation complete. Screen remains open — use End Session when ready.]',
    alert: {
      id: 'alert_pd_closure',
      title: 'PD Closure With Pending Fields',
      text: 'PD complete ho gayi hai. 40 mein se 24 fields captured hain aur 16 fields pending hain. Final review se pehle missing information collect karein.',
      severity: 'high',
      basedOn: 'PD Completion Status',
    },
  },
];

export const JUMP_POINTS = {
  income:   78000,   // Income ambiguity (01:18)
  expenses: 105000,  // Household expenses (01:45)
  property: 115000,  // Property details (01:55)
} as const;
