import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Eye,
  Printer,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Payment, PaymentMethod } from '../types';
import { RecordPaymentModal } from '../components/quickactions/RecordPaymentModal';
import { PaymentReceiptModal } from '../components/invoices/PaymentReceiptModal';

export const Payments: React.FC = () => {
  const { payments } = useData();

  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<'All' | PaymentMethod>('All');
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.paymentId.toLowerCase().includes(search.toLowerCase()) ||
      p.billId.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionReference.toLowerCase().includes(search.toLowerCase());

    const matchesMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payments & Collections
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Realized billing transactions, payment gateway records, and printable receipt acknowledgments.
          </p>
        </div>

        <button
          onClick={() => setRecordModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Total Collections Realized
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">{payments.length} verified transactions</span>
        </div>

        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Digital vs Cash Ratio
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            94.2% <span className="text-xs font-normal text-slate-500">Digital</span>
          </div>
          <span className="text-[11px] text-slate-400">UPI, Net Banking & Cards</span>
        </div>

        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Settlement Reliability
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            100% <span className="text-xs font-normal text-slate-500">Success</span>
          </div>
          <span className="text-[11px] text-slate-400">Zero double billing anomalies</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Payment ID, Bill ID, Customer name, Reference..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'UPI', 'Card', 'Bank Transfer', 'Cash'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                methodFilter === m
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Payment TXN #</th>
                <th className="py-3.5 px-4 font-semibold">Associated Bill</th>
                <th className="py-3.5 px-4 font-semibold">Consumer</th>
                <th className="py-3.5 px-4 font-semibold text-right">Settled Amount</th>
                <th className="py-3.5 px-4 font-semibold">Mode</th>
                <th className="py-3.5 px-4 font-semibold">Reference String</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 text-xs">
                    No payment records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {p.paymentId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {p.billId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                      {p.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 truncate max-w-[160px]">
                      {p.transactionReference}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {p.paymentDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 ml-auto transition-colors"
                        title="Print / View Receipt"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        onPaymentSuccess={payment => {
          setSelectedReceipt(payment);
        }}
      />

      {/* Payment Receipt Modal */}
      <PaymentReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </div>
  );
};
