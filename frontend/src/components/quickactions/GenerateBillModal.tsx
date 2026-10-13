import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useData } from '../../context/DataContext';
import { Calculator, CheckCircle2 } from 'lucide-react';

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (billId: string) => void;
}

export const GenerateBillModal: React.FC<GenerateBillModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { customers, tariffs, meterReadings, generateCustomBill } = useData();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    customers[0]?.customerId || ''
  );
  const [previousReading, setPreviousReading] = useState<number>(0);
  const [currentReading, setCurrentReading] = useState<number>(0);
  const [dueDateDays, setDueDateDays] = useState<number>(20);
  const [error, setError] = useState<string>('');

  const selectedCustomer = customers.find(c => c.customerId === selectedCustomerId);

  // Automatically update readings when selected customer changes
  React.useEffect(() => {
    if (selectedCustomer) {
      const readings = meterReadings.filter(r => r.meterNumber === selectedCustomer.meterNumber);
      if (readings.length > 0) {
        const latest = readings[0];
        setPreviousReading(latest.previousReading);
        setCurrentReading(latest.currentReading);
      } else {
        setPreviousReading(1200);
        setCurrentReading(1480);
      }
    }
  }, [selectedCustomerId, selectedCustomer, meterReadings]);

  const applicableTariff = tariffs.find(
    t => t.customerType === (selectedCustomer?.customerType || 'Residential')
  ) || tariffs[0];

  const unitsConsumed = Math.max(0, currentReading - previousReading);
  const ratePerUnit = applicableTariff.ratePerUnit;
  const energyCharge = unitsConsumed * ratePerUnit;
  const fixedCharge = applicableTariff.fixedMonthlyCharge;
  const surcharge = Math.round((energyCharge + fixedCharge) * (applicableTariff.surchargePercent / 100));
  const totalAmount = energyCharge + fixedCharge + surcharge;

  const isInvalid = currentReading < previousReading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) {
      setError('Please select a valid customer.');
      return;
    }
    if (isInvalid) {
      setError('Current meter reading cannot be less than the previous reading.');
      return;
    }

    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + dueDateDays);

      const generated = generateCustomBill({
        customerId: selectedCustomer.customerId,
        meterNumber: selectedCustomer.meterNumber,
        previousReading,
        currentReading,
        dueDate: dueDate.toISOString().split('T')[0],
      });

      if (onSuccess) onSuccess(generated.billId);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error generating bill');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Electricity Bill"
      subtitle="Calculate energy charges according to customer type tariffs and consumption delta"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Consumer Account *
          </label>
          <select
            value={selectedCustomerId}
            onChange={e => setSelectedCustomerId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {customers.map(c => (
              <option key={c.id} value={c.customerId}>
                {c.name} ({c.customerId}) — {c.customerType} — Meter: {c.meterNumber}
              </option>
            ))}
          </select>
        </div>

        {/* Readings Input */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Previous Reading (kWh)
            </label>
            <input
              type="number"
              min="0"
              value={previousReading}
              onChange={e => setPreviousReading(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:bg-slate-800/50 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Reading (kWh) *
            </label>
            <input
              type="number"
              min="0"
              value={currentReading}
              onChange={e => setCurrentReading(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Real-time Tariff Formula Breakdown Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/5 via-slate-50 to-slate-100 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-850 border border-emerald-500/20 dark:border-emerald-500/20 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200/80 dark:border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Calculator className="w-4 h-4" />
              Bill Calculation Breakdown
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              Tariff: {selectedCustomer?.customerType} (₹{ratePerUnit}/unit)
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Units Consumed ({currentReading} − {previousReading}):</span>
              <span className="font-mono font-semibold">{unitsConsumed} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Energy Charge ({unitsConsumed} × ₹{ratePerUnit}):</span>
              <span className="font-mono font-semibold">₹{energyCharge.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Fixed Monthly Charge:</span>
              <span className="font-mono font-semibold">₹{fixedCharge.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Applicable Surcharge ({applicableTariff.surchargePercent}%):</span>
              <span className="font-mono font-semibold">₹{surcharge.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-300 dark:border-slate-700 pt-2 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Total Payable Amount
            </span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Due date picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Payment Due Window (Days)
          </label>
          <select
            value={dueDateDays}
            onChange={e => setDueDateDays(Number(e.target.value))}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value={15}>15 Days from billing date</option>
            <option value={20}>20 Days from billing date (Standard)</option>
            <option value={30}>30 Days from billing date</option>
          </select>
        </div>

        {/* Buttons */}
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
            disabled={isInvalid}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Generate Official Bill
          </button>
        </div>
      </form>
    </Modal>
  );
};
