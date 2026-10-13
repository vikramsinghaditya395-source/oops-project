import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Plus,
  Eye,
  Printer,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Download,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Bill, PaymentStatus } from '../types';
import { Badge } from '../components/ui/Badge';
import { GenerateBillModal } from '../components/quickactions/GenerateBillModal';
import { RecordPaymentModal } from '../components/quickactions/RecordPaymentModal';
import { InvoiceModal } from '../components/invoices/InvoiceModal';
import { PaymentReceiptModal } from '../components/invoices/PaymentReceiptModal';

export const Bills: React.FC = () => {
  const { bills } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | PaymentStatus>('All');
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Bill | null>(null);
  const [payBillTarget, setPayBillTarget] = useState<string | null>(null);
  const [lastPaymentReceipt, setLastPaymentReceipt] = useState<any | null>(null);

  const filteredBills = bills.filter(b => {
    const matchesSearch =
      b.billId.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.meterNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customerId.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPaid = bills
    .filter(b => b.paymentStatus === 'Paid')
    .reduce((acc, b) => acc + b.totalAmount, 0);
  const totalPending = bills
    .filter(b => b.paymentStatus !== 'Paid')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Bills & Utility Invoices
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic billing statements computed from smart meter delta units and customer tariffs.
          </p>
        </div>

        <button
          onClick={() => setGenerateModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Generate New Bill
        </button>
      </div>

      {/* Overview Totals Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Total Invoiced Amount
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            ₹{totalInvoiced.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">{bills.length} issued invoices</span>
        </div>

        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            Settled / Paid Amount
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">
            {bills.filter(b => b.paymentStatus === 'Paid').length} cleared accounts
          </span>
        </div>

        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
            Outstanding / Due
          </span>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-1">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-slate-400">
            {bills.filter(b => b.paymentStatus !== 'Paid').length} awaiting settlement
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Bill ID, Customer name, Meter number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Pending', 'Paid', 'Overdue'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bills Invoices Table */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Bill / Invoice #</th>
                <th className="py-3.5 px-4 font-semibold">Customer Details</th>
                <th className="py-3.5 px-4 font-semibold">Smart Meter</th>
                <th className="py-3.5 px-4 font-semibold text-right">Units (kWh)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Rate / Unit</th>
                <th className="py-3.5 px-4 font-semibold text-right">Total Amount</th>
                <th className="py-3.5 px-4 font-semibold">Billing Date</th>
                <th className="py-3.5 px-4 font-semibold">Due Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 text-xs">
                    No bills found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {bill.billId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {bill.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span>{bill.customerId}</span>
                        <span>•</span>
                        <Badge variant={bill.customerType} />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {bill.meterNumber}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                      {bill.unitsConsumed}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                      ₹{bill.ratePerUnit.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                      ₹{bill.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {bill.billDate}
                    </td>
                    <td className="py-3.5 px-4 text-rose-600 dark:text-rose-400 font-mono text-[11px] font-semibold">
                      {bill.dueDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={bill.paymentStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewInvoice(bill)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-750 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                          title="View Official Invoice"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View</span>
                        </button>
                        {bill.paymentStatus !== 'Paid' && (
                          <button
                            onClick={() => setPayBillTarget(bill.billId)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-sm transition-colors"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <GenerateBillModal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSuccess={billId => {
          const generated = bills.find(b => b.billId === billId);
          if (generated) setViewInvoice(generated);
        }}
      />

      <RecordPaymentModal
        isOpen={!!payBillTarget}
        onClose={() => setPayBillTarget(null)}
        targetBillId={payBillTarget || undefined}
        onPaymentSuccess={payment => {
          setLastPaymentReceipt(payment);
        }}
      />

      <InvoiceModal
        isOpen={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        bill={viewInvoice}
        onPayNow={bill => {
          setViewInvoice(null);
          setPayBillTarget(bill.billId);
        }}
      />

      <PaymentReceiptModal
        isOpen={!!lastPaymentReceipt}
        onClose={() => setLastPaymentReceipt(null)}
        payment={lastPaymentReceipt}
      />
    </div>
  );
};
