import React, { useState } from 'react';
import {
  Gauge,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  History,
  ArrowRight,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { RecordReadingModal } from '../components/quickactions/RecordReadingModal';
import { GenerateBillModal } from '../components/quickactions/GenerateBillModal';

export const MeterReadings: React.FC = () => {
  const { meterReadings } = useData();

  const [search, setSearch] = useState('');
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [generateBillForMeter, setGenerateBillForMeter] = useState<string | null>(null);

  // Compute summary metrics
  const totalUnits = meterReadings.reduce((sum, r) => sum + r.unitsConsumed, 0);
  const averageUnits = Math.round(totalUnits / (meterReadings.length || 1));
  const maxReading = Math.max(...meterReadings.map(r => r.unitsConsumed), 0);

  const filteredReadings = meterReadings.filter(
    r =>
      r.meterNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.customerId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Smart Meter Telemetry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated consumption tracking, delta unit calculation, and grid meter readings.
          </p>
        </div>

        <button
          onClick={() => setRecordModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record New Reading
        </button>
      </div>

      {/* Consumption Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Total Units Recorded
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {totalUnits.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Average Cycle Consumption
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {averageUnits.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
              Peak Recorded Load
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {maxReading.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-500">kWh</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
            <Gauge className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Formula Explanation Callout */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">
              Automated OOP Calculation Formula:
            </span>
            <div className="font-mono text-emerald-800 dark:text-emerald-300 mt-0.5">
              Units Consumed = Current Reading (kWh) − Previous Reading (kWh)
            </div>
          </div>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Validation ensures: <code className="font-mono bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-emerald-200">Current &gt;= Previous</code>
        </span>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by meter # or customer name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {filteredReadings.length} readings on record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Meter Serial</th>
                <th className="py-3.5 px-4 font-semibold">Consumer Account</th>
                <th className="py-3.5 px-4 font-semibold text-right">Previous (kWh)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Current (kWh)</th>
                <th className="py-3.5 px-4 font-semibold text-right">Units Consumed</th>
                <th className="py-3.5 px-4 font-semibold">Cycle Date</th>
                <th className="py-3.5 px-4 font-semibold">Telemetry Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredReadings.map(r => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {r.meterNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {r.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {r.customerId}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                    {r.previousReading.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white">
                    {r.currentReading.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg border border-emerald-500/20">
                      {r.unitsConsumed.toLocaleString('en-IN')} kWh
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {r.readingDate}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setGenerateBillForMeter(r.meterNumber)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                    >
                      Bill Cycle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Reading Modal */}
      <RecordReadingModal
        isOpen={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
      />

      {/* Generate Bill Modal preselected */}
      {generateBillForMeter && (
        <GenerateBillModal
          isOpen={!!generateBillForMeter}
          onClose={() => setGenerateBillForMeter(null)}
        />
      )}
    </div>
  );
};
