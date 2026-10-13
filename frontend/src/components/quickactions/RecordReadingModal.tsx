import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useData } from '../../context/DataContext';
import { Gauge, ArrowRight } from 'lucide-react';

interface RecordReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMeter?: string;
}

export const RecordReadingModal: React.FC<RecordReadingModalProps> = ({
  isOpen,
  onClose,
  preselectedMeter,
}) => {
  const { customers, meterReadings, addMeterReading } = useData();

  const [selectedMeter, setSelectedMeter] = useState<string>('');
  const [prevReading, setPrevReading] = useState<number>(0);
  const [currReading, setCurrReading] = useState<number>(0);
  const [readingDate, setReadingDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Auto populate meter and latest previous reading
  useEffect(() => {
    if (preselectedMeter) {
      setSelectedMeter(preselectedMeter);
    } else if (customers.length > 0 && !selectedMeter) {
      setSelectedMeter(customers[0].meterNumber);
    }
  }, [preselectedMeter, customers]);

  useEffect(() => {
    if (selectedMeter) {
      // Find latest reading for this meter
      const previousForMeter = meterReadings.find(r => r.meterNumber === selectedMeter);
      if (previousForMeter) {
        setPrevReading(previousForMeter.currentReading);
        setCurrReading(previousForMeter.currentReading + 150); // reasonable suggested advance
      } else {
        setPrevReading(1000);
        setCurrReading(1200);
      }
    }
  }, [selectedMeter, meterReadings]);

  const unitsConsumed = Math.max(0, currReading - prevReading);
  const isInvalid = currReading < prevReading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInvalid) {
      setError('Current reading cannot be lower than the previous recorded reading.');
      return;
    }

    const customer = customers.find(c => c.meterNumber === selectedMeter);
    if (!customer) {
      setError('Selected meter has no associated customer record.');
      return;
    }

    try {
      addMeterReading({
        meterNumber: selectedMeter,
        customerId: customer.customerId,
        customerName: customer.name,
        previousReading: prevReading,
        currentReading: currReading,
        readingDate,
        status: 'Verified',
        notes: notes.trim() || undefined,
      });
      setError('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record meter reading');
    }
  };

  const selectedCustomer = customers.find(c => c.meterNumber === selectedMeter);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Meter Reading"
      subtitle="Input smart meter units consumption with automated delta computation"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Meter / Customer Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Select Customer / Meter *
          </label>
          <select
            value={selectedMeter}
            onChange={e => setSelectedMeter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {customers.map(c => (
              <option key={c.id} value={c.meterNumber}>
                {c.meterNumber} — {c.name} ({c.customerType})
              </option>
            ))}
          </select>
          {selectedCustomer && (
            <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Account: {selectedCustomer.customerId} • Address: {selectedCustomer.address}
            </div>
          )}
        </div>

        {/* Previous and Current Readings */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Previous Reading (kWh)
            </label>
            <input
              type="number"
              min="0"
              value={prevReading}
              onChange={e => setPrevReading(Number(e.target.value))}
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
              value={currReading}
              onChange={e => {
                setCurrReading(Number(e.target.value));
                setError('');
              }}
              className={`w-full px-3 py-2 text-xs rounded-xl border ${
                isInvalid
                  ? 'border-rose-500 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-800 focus:ring-emerald-500'
              } bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2`}
            />
          </div>
        </div>

        {/* Visual Formula Comparison Banner */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
              <Gauge className="w-4 h-4 text-emerald-500" />
              <span>Calculation (Formula):</span>
            </div>
            <span className="font-mono text-[11px] text-slate-400">
              Units Consumed = Current − Previous
            </span>
          </div>

          <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
            <div className="text-center flex-1">
              <span className="text-[10px] text-slate-400 uppercase">Previous</span>
              <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {prevReading} kWh
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-center flex-1">
              <span className="text-[10px] text-slate-400 uppercase">Current</span>
              <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {currReading} kWh
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <div className="text-center flex-1 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/20">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Net Consumed
              </span>
              <div className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
                {unitsConsumed} kWh
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Date and Notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reading Cycle Date
            </label>
            <input
              type="date"
              value={readingDate}
              onChange={e => setReadingDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Technician Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Verified by telemetry"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

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
            disabled={isInvalid}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm transition-colors"
          >
            Save Meter Reading
          </button>
        </div>
      </form>
    </Modal>
  );
};
