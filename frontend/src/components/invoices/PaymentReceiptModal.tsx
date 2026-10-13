import React from 'react';
import { Modal } from '../ui/Modal';
import { Payment } from '../../types';
import { CheckCircle2, Printer, Zap } from 'lucide-react';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Acknowledgment Receipt"
      subtitle="Official verification of settled utility transaction"
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Printable Area Receipt */}
        <div className="printable-area bg-white text-slate-900 border border-slate-200 rounded-2xl p-6 shadow-sm">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-200">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Payment Successful</h4>
            <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
              ₹{payment.amount.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Transaction ID: <span className="font-mono font-bold text-slate-700">{payment.paymentId}</span>
            </p>
          </div>

          {/* Details List */}
          <div className="py-4 space-y-2.5 text-xs border-b border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-500">Consumer Name:</span>
              <span className="font-semibold text-slate-900">{payment.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consumer ID:</span>
              <span className="font-mono text-slate-900">{payment.customerId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Settled Bill Invoice:</span>
              <span className="font-mono text-slate-900">{payment.billId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Date:</span>
              <span className="text-slate-900">{payment.paymentDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode:</span>
              <span className="font-semibold text-slate-900">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction Reference:</span>
              <span className="font-mono text-[11px] text-slate-700 truncate max-w-[200px]">
                {payment.transactionReference}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-600">VoltFlow Smart Billing</span>
            </div>
            <span className="font-mono text-[10px]">VERIFIED TRANSACTION</span>
          </div>
        </div>

        {/* Controls */}
        <div className="no-print flex items-center justify-between gap-3 pt-1">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            Print Receipt
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
