import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Upload, Filter, CheckCircle2, Clock, AlertCircle,
  FileImage, X,
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api, type Transaction } from '@/lib/api';

const statusConfig = {
  verified: { label: 'Verified', icon: CheckCircle2, className: 'badge-verified' },
  processing: { label: 'Processing', icon: Clock, className: 'badge-processing' },
  pending: { label: 'Pending', icon: AlertCircle, className: 'badge-pending' },
};

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    api.getTransactions().then(setTransactions);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setUploadStatus('processing');
    await api.scanReceipt(file);
    setUploadStatus('done');
    setTimeout(() => setUploadStatus(null), 3000);
  }, []);

  const filtered = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.merchant?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || t.status === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(transactions.map(t => t.category))];

  return (
    <DashboardLayout title="Transaction Hub" subtitle="Manage and track all transactions">
      {/* Receipt Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass-card p-8 mb-6 border-2 border-dashed transition-all duration-300 text-center ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border/50'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {uploadStatus === 'processing' ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-primary font-medium">Scanning receipt with OCR...</span>
          </div>
        ) : uploadStatus === 'done' ? (
          <div className="flex items-center justify-center gap-2 text-success">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Receipt scanned successfully!</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-1">
              <FileImage className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">Drop receipt images here to scan</p>
            <p className="text-xs text-muted-foreground">Supports JPG, PNG, PDF · OCR-powered extraction</p>
          </div>
        )}
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'verified', 'processing', 'pending'].map((s) => (
            <Button
              key={s}
              variant={filter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(s)}
              className="text-xs capitalize"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Date</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Description</th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Category</th>
                <th className="text-right px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Amount</th>
                <th className="text-center px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const status = statusConfig[t.status];
                const StatusIcon = status.icon;
                return (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/30 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-muted-foreground">{t.date}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-foreground">{t.description}</p>
                      {t.merchant && <p className="text-xs text-muted-foreground">{t.merchant}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{t.category}</td>
                    <td className={`px-5 py-3.5 text-sm font-mono text-right font-medium ${t.type === 'income' ? 'text-success' : 'text-foreground'}`}>
                      {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={status.className}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Transactions;
