import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Edit2,
  Check,
  AlertCircle,
  Calculator,
  Zap,
  Info,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Tariff } from '../types';
import { Modal } from '../components/ui/Modal';

export const Tariffs: React.FC = () => {
  const { tariffs, updateTariff } = useData();

  const [editingTariff, setEditingTariff] = useState<Tariff | null>(null);
  const [rateInput, setRateInput] = useState<number>(5);
  const [fixedInput, setFixedInput] = useState<number>(50);
  const [surchargeInput, setSurchargeInput] = useState<number>(4);

  // Live tariff simulation playground state
  const [simType, setSimType] = useState<'Residential' | 'Commercial'>('Residential');
  const [simUnits, setSimUnits] = useState<number>(250);

  const startEdit = (tariff: Tariff) => {
    setEditingTariff(tariff);
    setRateInput(tariff.ratePerUnit);
    setFixedInput(tariff.fixedMonthlyCharge);
    setSurchargeInput(tariff.surchargePercent);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTariff) return;

    updateTariff(editingTariff.id, {
      ratePerUnit: Number(rateInput),
      fixedMonthlyCharge: Number(fixedInput),
      surchargePercent: Number(surchargeInput),
    });

    setEditingTariff(null);
  };

  // Calculator preview for selected sim type
  const activeTariff = tariffs.find(t => t.customerType === simType) || tariffs[0];
  const simEnergy = simUnits * activeTariff.ratePerUnit;
  const simFixed = activeTariff.fixedMonthlyCharge;
  const simSurcharge = Math.round((simEnergy + simFixed) * (activeTariff.surchargePercent / 100));
  const simTotal = simEnergy + simFixed + simSurcharge;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tariff Schedule Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure utility rate schedules, slab pricing, fixed connection charges, and surcharges.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-3 py-1.5 rounded-xl font-medium">
          <Info className="w-4 h-4 shrink-0" />
          <span>Configurable demonstration rates for college OOP project evaluation.</span>
        </div>
      </div>

      {/* Tariff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tariffs.map(t => (
          <div
            key={t.id}
            className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-subtle relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />

            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      t.customerType === 'Residential'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-200'
                    }`}
                  >
                    {t.customerType} Tariff Slab
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                    {t.customerType === 'Residential' ? 'Standard Domestic Household' : 'Commercial & High Power'}
                  </h3>
                </div>

                <button
                  onClick={() => startEdit(t)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 text-xs font-semibold transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Rates
                </button>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {t.description}
              </p>

              {/* Rate Metrics */}
              <div className="grid grid-cols-3 gap-3 my-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Energy Rate</span>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    ₹{t.ratePerUnit.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500">per kWh unit</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Fixed Charge</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                    ₹{t.fixedMonthlyCharge}
                  </div>
                  <span className="text-[10px] text-slate-500">per billing cycle</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Surcharge</span>
                  <div className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                    {t.surchargePercent}%
                  </div>
                  <span className="text-[10px] text-slate-500">statutory tax</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Effective Since: {t.effectiveDate}</span>
              <span className="font-mono text-[10px]">Polymorphic OOP Strategy</span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Interactive Tariff Simulator Sandbox */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-500" />
              Live Bill Simulation Playground
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Test how tariff adjustments affect a sample bill in real time.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Real-time Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Controls */}
          <div className="space-y-4 md:col-span-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consumer Classification
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSimType('Residential')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                    simType === 'Residential'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Residential
                </button>
                <button
                  type="button"
                  onClick={() => setSimType('Commercial')}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                    simType === 'Commercial'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Commercial
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                <span>Units Consumed (Slider)</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{simUnits} kWh</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="25"
                value={simUnits}
                onChange={e => setSimUnits(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>50 kWh</span>
                <span>1250 kWh</span>
                <span>2500 kWh</span>
              </div>
            </div>
          </div>

          {/* Breakdown Preview Display */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Energy Charge</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                  ₹{simEnergy.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-500">{simUnits} × ₹{activeTariff.ratePerUnit}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Fixed Fee</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                  ₹{simFixed.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-500">Monthly</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Surcharge ({activeTariff.surchargePercent}%)</span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                  ₹{simSurcharge.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-slate-500">Tax Levy</span>
              </div>

              <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-glow">
                <span className="text-[10px] uppercase font-bold text-emerald-100">Simulated Total</span>
                <div className="font-mono text-xl font-extrabold mt-0.5">
                  ₹{simTotal.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Formula: Energy Charge + Fixed Charge + Surcharge</span>
              <span className="font-mono">Output verified by Tariff Engine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Tariff Modal */}
      {editingTariff && (
        <Modal
          isOpen={!!editingTariff}
          onClose={() => setEditingTariff(null)}
          title={`Edit ${editingTariff.customerType} Tariff Schedule`}
          subtitle="Configure unit rate, fixed meter levy, and tax percentages"
          maxWidth="md"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rate Per Unit (₹ / kWh) *
              </label>
              <input
                type="number"
                step="0.25"
                min="1"
                max="50"
                value={rateInput}
                onChange={e => setRateInput(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default demo: Residential ₹5, Commercial ₹8</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fixed Monthly Charge (₹) *
              </label>
              <input
                type="number"
                step="5"
                min="0"
                max="1000"
                value={fixedInput}
                onChange={e => setFixedInput(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Standard demo default: ₹50</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Regulatory Surcharge / Tax (%) *
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="30"
                value={surchargeInput}
                onChange={e => setSurchargeInput(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingTariff(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Update Tariff Schedule
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
