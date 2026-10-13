import React from 'react';
import { Modal } from '../ui/Modal';
import { Bill } from '../../types';
import { Badge } from '../ui/Badge';
import { Zap, Printer, Download, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onPayNow?: (bill: Bill) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  bill,
  onPayNow,
}) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Electricity Bill Invoice: ${bill.billId}`}
      subtitle="Official Consumer Utility Statement & Tariff Breakdown"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Printable Area Card */}
        <div className="printable-area bg-white text-slate-900 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                  <Zap className="w-5 h-5 fill-white text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Volt<span className="text-emerald-600">Flow</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Powering smarter energy management.
              </p>
              <p className="text-[11px] text-slate-400">
                Electricity Board License: REG-2026-DISCOM-99
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Tax Invoice
              </div>
              <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                {bill.billId}
              </div>
              <div className="mt-2">
                <Badge variant={bill.paymentStatus} />
              </div>
            </div>
          </div>

          {/* Dates & Billing Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Invoice Date:</span>
              <span className="font-semibold text-slate-900">{bill.billDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Due Date:</span>
              <span className="font-semibold text-rose-600">{bill.dueDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Consumer ID:</span>
              <span className="font-mono font-semibold text-slate-900">{bill.customerId}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Smart Meter No:</span>
              <span className="font-mono font-semibold text-emerald-700">{bill.meterNumber}</span>
            </div>
          </div>

          {/* Customer & Consumer Details */}
          <div className="py-4 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Consumer Details
            </div>
            <div className="flex flex-col sm:flex-row justify-between text-xs">
              <div>
                <div className="text-sm font-bold text-slate-900">{bill.customerName}</div>
                <div className="text-slate-500 mt-0.5">Classification: {bill.customerType} Consumer</div>
              </div>
              <div className="text-slate-500 mt-2 sm:mt-0 sm:text-right text-[11px]">
                <div>Billing Period: 30 Calendar Days</div>
                <div>Tariff Slab: {bill.customerType} Standard Schedule</div>
              </div>
            </div>
          </div>

          {/* Meter Readings Table */}
          <div className="py-4 border-b border-slate-200">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Meter Consumption Metrics
            </div>
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl text-center">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Previous Reading</span>
                <span className="font-mono text-xs font-bold text-slate-800">{bill.previousReading} kWh</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Current Reading</span>
                <span className="font-mono text-xs font-bold text-slate-800">{bill.currentReading} kWh</span>
              </div>
              <div className="bg-emerald-100/60 p-1 rounded-lg">
                <span className="text-[10px] text-emerald-800 block uppercase font-bold">Total Units Consumed</span>
                <span className="font-mono text-sm font-extrabold text-emerald-700">{bill.unitsConsumed} kWh</span>
              </div>
            </div>
          </div>

          {/* Charges Breakdown Table */}
          <div className="py-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Calculation & Charges Breakdown
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-left">
                  <th className="py-2 font-semibold">Description</th>
                  <th className="py-2 text-right font-semibold">Units / Basis</th>
                  <th className="py-2 text-right font-semibold">Rate</th>
                  <th className="py-2 text-right font-semibold">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5">Energy Consumption Charge</td>
                  <td className="py-2.5 text-right font-mono">{bill.unitsConsumed} kWh</td>
                  <td className="py-2.5 text-right font-mono">₹{bill.ratePerUnit.toFixed(2)}/unit</td>
                  <td className="py-2.5 text-right font-mono font-medium">₹{bill.energyCharge.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5">Monthly Fixed Service Charge</td>
                  <td className="py-2.5 text-right text-slate-400">Flat Monthly</td>
                  <td className="py-2.5 text-right font-mono">Standard</td>
                  <td className="py-2.5 text-right font-mono font-medium">₹{bill.fixedCharge.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5">Regulatory Surcharge / Energy Tax</td>
                  <td className="py-2.5 text-right text-slate-400">Statutory Levy</td>
                  <td className="py-2.5 text-right font-mono">Formula %</td>
                  <td className="py-2.5 text-right font-mono font-medium">₹{bill.surchargeAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 text-slate-900 font-bold">
                  <td colSpan={3} className="py-3 text-sm uppercase">Total Payable Amount</td>
                  <td className="py-3 text-right text-base font-mono font-extrabold text-emerald-700">
                    ₹{bill.totalAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Notes */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-slate-500 gap-2">
            <div>
              Payment mode accepted: UPI, NetBanking, Debit/Credit Card, Counter Cash.
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              Generated by VoltFlow Smart Billing Engine
            </div>
          </div>
        </div>

        {/* Modal Controls (Hidden in print mode) */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-600" />
              Print / Save as PDF
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {bill.paymentStatus !== 'Paid' && onPayNow && (
              <button
                onClick={() => {
                  onClose();
                  onPayNow(bill);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Pay This Bill Now
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
