// src/data/demoCase.ts
// Static case prefill data for Hero Housing Finance demo

export const DEMO_CASE = {
  applicationId: 'SHB/HL/GZB/26/084217',
  loginDate: '2026-09-24',
  branch: 'Ghaziabad / NCR',
  product: 'Home Purchase',
  applicantName: 'Ramesh Gupta',
  coApplicantName: 'Sunita Gupta',
  requestedLoanAmount: 1850000,
  employmentType: 'Self Employed',
  businessName: 'Gupta General Store',
  persona: 'Micro Retailer / Trader',
  aipProgram: true,
  salesManager: 'Rahul Sharma',
  rmCode: 'GZB-RM-042',
} as const;

export type DemoCase = typeof DEMO_CASE;
