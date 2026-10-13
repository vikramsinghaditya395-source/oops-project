import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useData } from '../../context/DataContext';
import { PaymentMethod, Payment } from '../../types';
import { CreditCard, QrCode, CheckCircle2, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetBillId?: string;
  onPaymentSuccess?: (payment: Payment) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  targetBillId,
  onPaymentSuccess,
}) => {
  const { bills, recordPayment } = useData();

  const unpaidBills = bills.filter(b => b.paymentStatus !== 'Paid');
  const [selectedBillId, setSelectedBillId] = useState<string>('');
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [reference, setReference] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (targetBillId) {
      setSelectedBillId(targetBillId);
    } else if (unpaidBills.length > 0 && !selectedBillId) {
      setSelectedBillId(unpaidBills[0].billId);
    }
  }, [targetBillId, unpaidBills]);

  const activeBill = bills.find(b => b.billId === selectedBillId || b.id === selectedBillId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBill) {
      setError('Please select an active unpaid bill.');
      return;
    }
    if (activeBill.paymentStatus === 'Paid') {
      setError('This bill has already been settled.');
      return;
    }

    try {
      const recorded = recordPayment({
        billId: activeBill.billId,
        amount: activeBill.totalAmount,
        paymentMethod: method,
        transactionReference: reference.trim() || undefined,
      });

      // Confetti celebration effect!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });

      setError('');
      if (onPaymentSuccess) {
        onPaymentSuccess(recorded);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Payment processing error');
    }
  };

  const paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
    { id: 'UPI', label: 'UPI / QR', icon: '📱' },
    { id: 'Card', label: 'Debit / Credit Card', icon: '💳' },
    { id: 'Bank Transfer', label: 'Net Banking / NEFT', icon: '🏦' },
    { id: 'Cash', label: 'Cash at Counter', icon: '💵' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Bill Payment"
      subtitle="Simulate settlement of electricity utility charges with receipt generation"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bill Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Select Pending Bill *
          </label>
          {unpaidBills.length === 0 ? (
            <div className="p-3 text-center text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200">
              All outstanding bills are currently fully paid!
            </div>
          ) : (
            <select
              value={selectedBillId}
              onChange={e => setSelectedBillId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {unpaidBills.map(b => (
                <option key={b.id} value={b.billId}>
                  {b.billId} — {b.customerName} (₹{b.totalAmount.toLocaleString('en-IN')}) • Due {b.dueDate}
                </option>
              ))}
            </select>
          )}
        </div>

        {activeBill && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-500">Payable Balance:</span>
              <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{activeBill.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Customer: {activeBill.customerName}</span>
              <span>Meter: {activeBill.meterNumber}</span>
            </div>
          </div>
        )}

        {/* Payment Method Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Payment Mode *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {paymentMethods.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-medium ${
                  method === m.id
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className="text-base">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Gateway simulation placeholder info */}
        {method === 'UPI' && (
          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-500/20 text-xs flex items-center gap-3">
            <QrCode className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Simulated UPI Gateway</div>
              <div className="text-[11px] text-slate-500">UPI ID: voltflow.utility@demo</div>
            </div>
          </div>
        )}

        {/* Transaction Reference input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Bank Transaction / Cheque / Ref ID (Optional)
          </label>
          <input
            type="text"
            value={reference}
            onChange={e => setReference(e.target.value)}
            placeholder={`e.g. ${method}-REF-${Math.floor(100000 + Math.random() * 900000)}`}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* College Demo disclaimer notice */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 p-2.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>College project test simulation: No real banking credentials collected.</span>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!activeBill || unpaidBills.length === 0}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm Payment Settlement
          </button>
        </div>
      </form>
    </Modal>
  );
};
