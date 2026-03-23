// API client for FastAPI backend integration
// Currently using mock data — replace with real endpoints when openapi.json is provided

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'verified' | 'processing' | 'pending';
  merchant?: string;
  receiptUrl?: string;
}

export interface BudgetCategory {
  category: string;
  budgeted: number;
  spent: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  budget: number;
  savings: number;
}

export interface Insight {
  id: string;
  type: 'subscription_bloat' | 'predictive' | 'anomaly' | 'saving_opportunity';
  title: string;
  description: string;
  impact: number;
  severity: 'low' | 'medium' | 'high';
}

const BASE_URL = '/api/v1';

// Mock data
const mockTransactions: Transaction[] = [
  { id: '1', date: '2026-03-22', description: 'AWS Cloud Services', category: 'Cloud & Infrastructure', amount: 2340.00, type: 'expense', status: 'verified', merchant: 'Amazon Web Services' },
  { id: '2', date: '2026-03-21', description: 'Client Payment - Acme Corp', category: 'Revenue', amount: 15000.00, type: 'income', status: 'verified', merchant: 'Acme Corp' },
  { id: '3', date: '2026-03-20', description: 'Figma Enterprise', category: 'Software & Tools', amount: 75.00, type: 'expense', status: 'verified', merchant: 'Figma' },
  { id: '4', date: '2026-03-19', description: 'Office Lease Payment', category: 'Rent & Utilities', amount: 4500.00, type: 'expense', status: 'verified', merchant: 'WeWork' },
  { id: '5', date: '2026-03-18', description: 'Freelancer Payment', category: 'Payroll', amount: 3200.00, type: 'expense', status: 'processing', merchant: 'Upwork' },
  { id: '6', date: '2026-03-17', description: 'Google Workspace', category: 'Software & Tools', amount: 288.00, type: 'expense', status: 'verified', merchant: 'Google' },
  { id: '7', date: '2026-03-16', description: 'Client Payment - Beta Inc', category: 'Revenue', amount: 8500.00, type: 'income', status: 'verified', merchant: 'Beta Inc' },
  { id: '8', date: '2026-03-15', description: 'Notion Team Plan', category: 'Software & Tools', amount: 96.00, type: 'expense', status: 'verified', merchant: 'Notion' },
  { id: '9', date: '2026-03-14', description: 'Team Lunch', category: 'Meals & Entertainment', amount: 185.00, type: 'expense', status: 'pending', merchant: 'DoorDash' },
  { id: '10', date: '2026-03-13', description: 'Slack Business+', category: 'Software & Tools', amount: 150.00, type: 'expense', status: 'verified', merchant: 'Slack' },
  { id: '11', date: '2026-03-12', description: 'Adobe Creative Cloud', category: 'Software & Tools', amount: 599.00, type: 'expense', status: 'verified', merchant: 'Adobe' },
  { id: '12', date: '2026-03-11', description: 'Client Payment - Gamma LLC', category: 'Revenue', amount: 12000.00, type: 'income', status: 'processing', merchant: 'Gamma LLC' },
  { id: '13', date: '2026-03-10', description: 'Internet & Phone', category: 'Rent & Utilities', amount: 320.00, type: 'expense', status: 'verified', merchant: 'Comcast' },
  { id: '14', date: '2026-03-09', description: 'LinkedIn Premium', category: 'Marketing', amount: 59.99, type: 'expense', status: 'verified', merchant: 'LinkedIn' },
  { id: '15', date: '2026-03-08', description: 'Uber Business Travel', category: 'Travel', amount: 234.50, type: 'expense', status: 'verified', merchant: 'Uber' },
];

const mockMonthlyData: MonthlyData[] = [
  { month: 'Oct', income: 32000, expenses: 24500, budget: 26000, savings: 7500 },
  { month: 'Nov', income: 35000, expenses: 27800, budget: 26000, savings: 7200 },
  { month: 'Dec', income: 38000, expenses: 31200, budget: 28000, savings: 6800 },
  { month: 'Jan', income: 34000, expenses: 25600, budget: 27000, savings: 8400 },
  { month: 'Feb', income: 36000, expenses: 28900, budget: 27000, savings: 7100 },
  { month: 'Mar', income: 35500, expenses: 12047, budget: 27000, savings: 23453 },
];

const mockBudgetCategories: BudgetCategory[] = [
  { category: 'Cloud & Infrastructure', budgeted: 3000, spent: 2340, color: 'hsl(174, 72%, 50%)' },
  { category: 'Software & Tools', budgeted: 1500, spent: 1208, color: 'hsl(152, 69%, 46%)' },
  { category: 'Rent & Utilities', budgeted: 5000, spent: 4820, color: 'hsl(38, 92%, 58%)' },
  { category: 'Payroll', budgeted: 15000, spent: 3200, color: 'hsl(280, 65%, 60%)' },
  { category: 'Marketing', budgeted: 2000, spent: 59.99, color: 'hsl(210, 72%, 55%)' },
  { category: 'Travel', budgeted: 1500, spent: 234.50, color: 'hsl(0, 72%, 62%)' },
  { category: 'Meals & Entertainment', budgeted: 500, spent: 185, color: 'hsl(30, 80%, 55%)' },
];

const mockInsights: Insight[] = [
  { id: '1', type: 'subscription_bloat', title: 'Duplicate Project Management Tools', description: 'You\'re paying for both Notion ($96/mo) and Slack ($150/mo) which have overlapping features. Consider consolidating.', impact: 96, severity: 'medium' },
  { id: '2', type: 'subscription_bloat', title: 'Adobe Creative Cloud Underutilized', description: 'Only 2 of 20+ Adobe apps were used last month. Consider switching to single-app plans saving ~$400/mo.', impact: 400, severity: 'high' },
  { id: '3', type: 'predictive', title: 'End-of-Month Balance Forecast', description: 'Based on current spending patterns, projected end-of-month balance is $18,453. This is 12% higher than last month.', impact: 18453, severity: 'low' },
  { id: '4', type: 'anomaly', title: 'AWS Costs Trending Up', description: 'Cloud infrastructure costs have increased 23% over 3 months. Review usage or consider reserved instances.', impact: 540, severity: 'high' },
  { id: '5', type: 'saving_opportunity', title: 'Annual Billing Discount', description: 'Switching 4 monthly subscriptions to annual billing would save approximately $312/year.', impact: 312, severity: 'medium' },
];

// Simulated API functions
export const api = {
  getTransactions: async (): Promise<Transaction[]> => {
    await new Promise(r => setTimeout(r, 300));
    return mockTransactions;
  },

  getMonthlyData: async (): Promise<MonthlyData[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockMonthlyData;
  },

  getBudgetCategories: async (): Promise<BudgetCategory[]> => {
    await new Promise(r => setTimeout(r, 200));
    return mockBudgetCategories;
  },

  getInsights: async (): Promise<Insight[]> => {
    await new Promise(r => setTimeout(r, 400));
    return mockInsights;
  },

  scanReceipt: async (_file: File): Promise<{ transactionId: string; status: string }> => {
    await new Promise(r => setTimeout(r, 1500));
    return { transactionId: 'new-' + Date.now(), status: 'processing' };
  },

  getDashboardStats: async () => {
    await new Promise(r => setTimeout(r, 200));
    return {
      totalBalance: 47832.50,
      monthlyIncome: 35500,
      monthlyExpenses: 12047.49,
      burnRate: 33.9,
      savingsRate: 66.1,
      transactionCount: 156,
    };
  },
};
