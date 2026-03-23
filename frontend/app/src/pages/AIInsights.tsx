import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import {
  Brain, TrendingUp, AlertTriangle, Lightbulb, DollarSign,
  ArrowRight, Zap, ShieldAlert,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { api, type Insight } from '@/lib/api';

const severityColors = {
  low: 'text-success border-success/20 bg-success/10',
  medium: 'text-warning border-warning/20 bg-warning/10',
  high: 'text-coral border-coral/20 bg-coral/10',
};

const typeIcons = {
  subscription_bloat: ShieldAlert,
  predictive: TrendingUp,
  anomaly: AlertTriangle,
  saving_opportunity: Lightbulb,
};

const forecastData = [
  { day: '1', actual: 47832, predicted: null },
  { day: '5', actual: 45200, predicted: null },
  { day: '10', actual: 42100, predicted: null },
  { day: '15', actual: 39800, predicted: null },
  { day: '20', actual: 38200, predicted: null },
  { day: '23', actual: 37500, predicted: 37500 },
  { day: '25', actual: null, predicted: 36200 },
  { day: '28', actual: null, predicted: 34800 },
  { day: '31', actual: null, predicted: 33900 },
];

const subscriptionData = [
  { name: 'AWS', current: 2340, previous: 1900, trend: 'up' },
  { name: 'Adobe CC', current: 599, previous: 599, trend: 'flat' },
  { name: 'Google Workspace', current: 288, previous: 264, trend: 'up' },
  { name: 'Slack', current: 150, previous: 150, trend: 'flat' },
  { name: 'Figma', current: 75, previous: 45, trend: 'up' },
  { name: 'Notion', current: 96, previous: 80, trend: 'up' },
];

const AIInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    api.getInsights().then(setInsights);
  }, []);

  return (
    <DashboardLayout title="AI Insights" subtitle="Smart analysis powered by machine learning">
      {/* AI Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-6 glow-border"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Monthly Intelligence Brief</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your spending efficiency improved by <span className="text-success font-medium">12%</span> this month. 
              We detected <span className="text-warning font-medium">2 subscription overlaps</span> and 
              <span className="text-coral font-medium"> 1 cost anomaly</span> worth investigating. 
              Potential monthly savings: <span className="text-primary font-mono font-semibold">$808</span>.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Predictive Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Predictive Balance</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">End-of-month forecast based on spending patterns</p>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold font-mono text-foreground">$33,900</span>
            <span className="text-xs text-success font-medium">Projected EOM balance</span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(174, 72%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis dataKey="day" stroke="hsl(215, 20%, 55%)" fontSize={10} tickFormatter={(v) => `Day ${v}`} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={10} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Area type="monotone" dataKey="actual" stroke="hsl(174, 72%, 50%)" fill="url(#actualGrad)" strokeWidth={2} connectNulls={false} />
              <Line type="monotone" dataKey="predicted" stroke="hsl(38, 92%, 58%)" strokeWidth={2} strokeDasharray="5 5" connectNulls={false} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subscription Bloat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Subscription Bloat Detector</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Tracking cost trends across all subscriptions</p>

          <div className="space-y-3">
            {subscriptionData.map((sub) => {
              const change = ((sub.current - sub.previous) / sub.previous * 100).toFixed(0);
              const isUp = sub.current > sub.previous;
              return (
                <div key={sub.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">${sub.current}/mo</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-medium ${isUp ? 'text-coral' : 'text-muted-foreground'}`}>
                    {isUp ? `+${change}%` : 'No change'}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Insight Cards */}
      <h3 className="text-sm font-semibold text-foreground mb-4">Actionable Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const Icon = typeIcons[insight.type];
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass-card-hover p-5"
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${severityColors[insight.severity]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-foreground mb-1">{insight.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs font-mono font-medium text-primary">
                      ${insight.impact.toLocaleString()} impact
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default AIInsights;
