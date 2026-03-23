import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Table, Calendar, Check } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const reportTypes = [
  { id: 'expense', label: 'Expense Report', desc: 'Detailed breakdown of all expenses' },
  { id: 'income', label: 'Income Statement', desc: 'Revenue and income analysis' },
  { id: 'budget', label: 'Budget Variance', desc: 'Budget vs actual comparison' },
  { id: 'tax', label: 'Tax Summary', desc: 'Tax-ready categorized expenses' },
];

const Reports = () => {
  const [dateFrom, setDateFrom] = useState('2026-03-01');
  const [dateTo, setDateTo] = useState('2026-03-23');
  const [selectedReport, setSelectedReport] = useState('expense');
  const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerated(false);
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <DashboardLayout title="Reports" subtitle="Generate and export financial reports">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Config */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Type */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTypes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReport(r.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedReport === r.id
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border/50 bg-secondary/20 hover:border-border'
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{r.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Date Range */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Date Range</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1.5 block">From</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-secondary/30 border-border/50 text-foreground" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1.5 block">To</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-secondary/30 border-border/50 text-foreground" />
              </div>
            </div>
          </motion.div>

          {/* Export Format */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Export Format</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat('pdf')}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg border transition-all ${
                  format === 'pdf' ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-secondary/20'
                }`}
              >
                <FileText className="w-5 h-5 text-coral" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">PDF Report</p>
                  <p className="text-xs text-muted-foreground">Formatted document</p>
                </div>
              </button>
              <button
                onClick={() => setFormat('excel')}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg border transition-all ${
                  format === 'excel' ? 'border-primary/50 bg-primary/5' : 'border-border/50 bg-secondary/20'
                }`}
              >
                <Table className="w-5 h-5 text-success" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Excel Spreadsheet</p>
                  <p className="text-xs text-muted-foreground">Editable data</p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Preview / Action */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 h-fit sticky top-24">
          <h3 className="text-sm font-semibold text-foreground mb-4">Report Preview</h3>
          <div className="rounded-lg bg-secondary/30 border border-border/30 p-6 mb-6 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground capitalize">
              {reportTypes.find(r => r.id === selectedReport)?.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{dateFrom} → {dateTo}</p>
            <p className="text-xs text-muted-foreground mt-0.5 uppercase">{format} format</p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {generating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating...
              </div>
            ) : generated ? (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                Download Ready
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Generate Report
              </div>
            )}
          </Button>

          {generated && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-success text-center mt-3">
              Report generated successfully! Click to download.
            </motion.p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
