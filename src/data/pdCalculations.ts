// src/data/pdCalculations.ts
// Deterministic financial calculations for Hero Housing Q15

export interface IncomeData {
  businessIncome?: number;      // Monthly business sales/receipts
  otherIncome?: number;         // Other monthly income
}

export interface ExpenseData {
  costOfGoods?: number;
  staffSalary?: number;
  shopRent?: number;
  electricity?: number;
  miscellaneous?: number;
  familyExpenses?: number;
}

export interface EMIData {
  existingEMI?: number;
}

export interface FinancialSummary {
  totalIncome?: number;
  totalExpenses?: number;
  netAppraisalIncome?: number;
  netIncomeInHand?: number;
}

export function calculateFinancials(
  income: IncomeData,
  expenses: ExpenseData,
  emi: EMIData
): FinancialSummary {
  const result: FinancialSummary = {};

  // Total Income = A + B
  if (income.businessIncome !== undefined || income.otherIncome !== undefined) {
    const a = income.businessIncome ?? 0;
    const b = income.otherIncome ?? 0;
    if (income.businessIncome !== undefined) {
      result.totalIncome = a + b;
    }
  }

  // Total Expenses = sum of all expense items
  const hasAnyExpense = Object.values(expenses).some(v => v !== undefined);
  if (hasAnyExpense) {
    result.totalExpenses =
      (expenses.costOfGoods ?? 0) +
      (expenses.staffSalary ?? 0) +
      (expenses.shopRent ?? 0) +
      (expenses.electricity ?? 0) +
      (expenses.miscellaneous ?? 0) +
      (expenses.familyExpenses ?? 0);
  }

  // Net Monthly Appraisal Income = Total Income - Total Expenses
  if (result.totalIncome !== undefined && result.totalExpenses !== undefined) {
    result.netAppraisalIncome = result.totalIncome - result.totalExpenses;
  }

  // Net Income in Hand = Net Appraisal Income - Existing EMI
  if (result.netAppraisalIncome !== undefined && emi.existingEMI !== undefined) {
    result.netIncomeInHand = result.netAppraisalIncome - emi.existingEMI;
  }

  return result;
}

export function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatCurrencyFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
