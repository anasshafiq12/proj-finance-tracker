import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Activity,
  ArrowUpRight, ArrowDownRight, Flame,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, type MonthlyData, type BudgetCategory } from '@/lib/api';

const StatCard = ({ label, value, change, trend, icon: Icon, delay = 0 }: {
  label: string; value: string; change: string; trend: 'up' | 'down';
  icon: React.ElementType; delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="glass-card-hover p-5"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value mt-2 text-foreground">{value}</p>
        <div className="flex items-center gap-1 mt-2">
          {trend === 'up' ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-success" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-coral" />
          )}
          <span className={`text-xs font-medium font-mono ${trend === 'up' ? 'text-success' : 'text-coral'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-mono">
          {entry.name}: ${entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [budgets, setBudgets] = useState<BudgetCategory[]>([]);

  useEffect(() => {
    api.getDashboardStats().then(setStats);
    api.getMonthlyData().then(setMonthly);
    api.getBudgetCategories().then(setBudgets);
  }, []);

  if (!stats) return (
    <DashboardLayout title="Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Executive Dashboard" subtitle="Real-time financial overview">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Balance" value={`$${stats.totalBalance.toLocaleString()}`} change="+12.5%" trend="up" icon={DollarSign} delay={0} />
        <StatCard label="Monthly Income" value={`$${stats.monthlyIncome.toLocaleString()}`} change="+8.2%" trend="up" icon={TrendingUp} delay={0.1} />
        <StatCard label="Monthly Expenses" value={`$${stats.monthlyExpenses.toLocaleString()}`} change="-4.1%" trend="down" icon={TrendingDown} delay={0.2} />
        <StatCard label="Burn Rate" value={`${stats.burnRate}%`} change="-2.3%" trend="down" icon={Flame} delay={0.3} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Spending vs Budget Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Spending vs Budget</h3>
          <p className="text-xs text-muted-foreground mb-4">6-month trend analysis</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 72%, 62%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(0, 72%, 62%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="hsl(174, 72%, 50%)" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="hsl(0, 72%, 62%)" fill="url(#expenseGrad)" strokeWidth={2} name="Expenses" />
              <Area type="monotone" dataKey="budget" stroke="hsl(38, 92%, 58%)" fill="none" strokeWidth={1.5} strokeDasharray="5 5" name="Budget" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Burn Rate Gauge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-card p-6 flex flex-col"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Cash Flow Health</h3>
          <p className="text-xs text-muted-foreground mb-4">Current period</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(222, 30%, 14%)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="hsl(152, 69%, 46%)"
                  strokeWidth="8"
                  strokeDasharray={`${stats.savingsRate * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-success">{stats.savingsRate}%</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Saved</span>
              </div>
            </div>

            <div className="mt-6 w-full space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Income</span>
                <span className="font-mono text-success">${stats.monthlyIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-mono text-coral">${stats.monthlyExpenses.toLocaleString()}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-foreground">Net</span>
                <span className="font-mono text-primary">${(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Budget by Category</h3>
          <p className="text-xs text-muted-foreground mb-4">Spend vs. allocated</p>
          <div className="space-y-4">
            {budgets.map((b) => {
              const pct = Math.min((b.spent / b.budgeted) * 100, 100);
              const isOver = b.spent > b.budgeted;
              return (
                <div key={b.category}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground font-medium">{b.category}</span>
                    <span className="font-mono text-muted-foreground">
                      ${b.spent.toLocaleString()} / ${b.budgeted.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: isOver ? 'hsl(0, 72%, 62%)' : b.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">Monthly Savings</h3>
          <p className="text-xs text-muted-foreground mb-4">Net savings trend</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" fontSize={11} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="savings" fill="hsl(174, 72%, 50%)" radius={[4, 4, 0, 0]} name="Savings" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Activity indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Activity className="w-3.5 h-3.5 text-success animate-pulse-glow" />
        <span>Live data · Last updated just now · {stats.transactionCount} transactions this month</span>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
