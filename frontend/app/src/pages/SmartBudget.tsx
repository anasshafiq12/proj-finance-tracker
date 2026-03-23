import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, ArrowRight, Check, PieChart, DollarSign,
  ShoppingBag, Home, Sparkles,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BudgetAllocation {
  needs: number;
  wants: number;
  savings: number;
}

const SmartBudget = () => {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState('');
  const [allocation, setAllocation] = useState<BudgetAllocation>({ needs: 50, wants: 30, savings: 20 });
  const [customizing, setCustomizing] = useState(false);

  const incomeNum = parseFloat(income) || 0;
  const needsAmt = (incomeNum * allocation.needs) / 100;
  const wantsAmt = (incomeNum * allocation.wants) / 100;
  const savingsAmt = (incomeNum * allocation.savings) / 100;

  const steps = [
    { title: 'Monthly Income', desc: 'Enter your total monthly income' },
    { title: '50/30/20 Rule', desc: 'AI-suggested budget allocation' },
    { title: 'Your Budget Plan', desc: 'Personalized budget breakdown' },
  ];

  return (
    <DashboardLayout title="Smart Budgeting Wizard" subtitle="AI-powered budget planning based on the 50/30/20 rule">
      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
              i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className="hidden sm:block">
              <p className={`text-xs font-medium ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</p>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-8 max-w-lg mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-2">What's your monthly income?</h2>
            <p className="text-sm text-muted-foreground mb-6">We'll use this to create a personalized budget</p>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="text-center text-2xl font-mono bg-secondary/30 border-border/50 text-foreground h-14 mb-6"
            />
            <Button
              onClick={() => setStep(1)}
              disabled={!incomeNum}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8 mb-4 glow-border text-center">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-3" />
              <h2 className="text-lg font-bold text-foreground mb-2">The 50/30/20 Rule</h2>
              <p className="text-sm text-muted-foreground">
                A proven budgeting framework: 50% for needs, 30% for wants, 20% for savings & investments.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Needs', pct: allocation.needs, amount: needsAmt, icon: Home, color: 'text-primary', desc: 'Rent, bills, groceries' },
                { label: 'Wants', pct: allocation.wants, amount: wantsAmt, icon: ShoppingBag, color: 'text-warning', desc: 'Dining, entertainment' },
                { label: 'Savings', pct: allocation.savings, amount: savingsAmt, icon: PieChart, color: 'text-success', desc: 'Investments, emergency' },
              ].map((cat) => (
                <div key={cat.label} className="glass-card p-5 text-center">
                  <cat.icon className={`w-6 h-6 ${cat.color} mx-auto mb-2`} />
                  <p className="text-xs text-muted-foreground mb-1">{cat.label}</p>
                  <p className="text-2xl font-bold font-mono text-foreground">{cat.pct}%</p>
                  <p className="text-sm font-mono text-muted-foreground mt-1">${cat.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{cat.desc}</p>
                </div>
              ))}
            </div>

            {customizing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-6 mb-4">
                <p className="text-xs text-muted-foreground mb-3">Adjust percentages (must total 100%)</p>
                {['needs', 'wants', 'savings'].map((key) => (
                  <div key={key} className="flex items-center gap-3 mb-3">
                    <span className="text-sm text-foreground capitalize w-16">{key}</span>
                    <input
                      type="range"
                      min={5}
                      max={80}
                      value={allocation[key as keyof BudgetAllocation]}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const others = Object.keys(allocation).filter(k => k !== key) as (keyof BudgetAllocation)[];
                        const remaining = 100 - val;
                        const ratio = allocation[others[0]] / (allocation[others[0]] + allocation[others[1]]);
                        setAllocation({
                          ...allocation,
                          [key]: val,
                          [others[0]]: Math.round(remaining * ratio),
                          [others[1]]: remaining - Math.round(remaining * ratio),
                        });
                      }}
                      className="flex-1 accent-primary"
                    />
                    <span className="text-sm font-mono text-foreground w-10 text-right">
                      {allocation[key as keyof BudgetAllocation]}%
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setCustomizing(!customizing)}>
                {customizing ? 'Done Customizing' : 'Customize Split'}
              </Button>
              <Button onClick={() => setStep(2)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Apply Budget <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass-card p-8 text-center mb-6 glow-border">
              <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-2">Your Budget Plan is Ready!</h2>
              <p className="text-sm text-muted-foreground">
                Based on ${incomeNum.toLocaleString()}/month income with a {allocation.needs}/{allocation.wants}/{allocation.savings} split
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { cat: 'Housing & Rent', pct: 25, group: 'needs' },
                { cat: 'Groceries & Food', pct: 12, group: 'needs' },
                { cat: 'Utilities & Bills', pct: 8, group: 'needs' },
                { cat: 'Transportation', pct: 5, group: 'needs' },
                { cat: 'Dining Out', pct: 10, group: 'wants' },
                { cat: 'Entertainment', pct: 8, group: 'wants' },
                { cat: 'Shopping', pct: 7, group: 'wants' },
                { cat: 'Subscriptions', pct: 5, group: 'wants' },
                { cat: 'Emergency Fund', pct: 10, group: 'savings' },
                { cat: 'Investments', pct: 10, group: 'savings' },
              ].map((item) => {
                const amount = (incomeNum * item.pct) / 100;
                const colorMap = { needs: 'bg-primary', wants: 'bg-warning', savings: 'bg-success' };
                return (
                  <div key={item.cat} className="flex items-center gap-3 glass-card p-4">
                    <div className={`w-2 h-2 rounded-full ${colorMap[item.group as keyof typeof colorMap]}`} />
                    <span className="text-sm text-foreground flex-1">{item.cat}</span>
                    <span className="text-xs text-muted-foreground">{item.pct}%</span>
                    <span className="text-sm font-mono font-medium text-foreground w-24 text-right">${amount.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setStep(0)}>Start Over</Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Wallet className="w-4 h-4 mr-2" />
                Save Budget Plan
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default SmartBudget;
