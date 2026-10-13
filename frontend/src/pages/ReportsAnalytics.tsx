import React from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Zap,
  BarChart3,
  PieChart as PieIcon,
  Filter,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useData } from '../context/DataContext';

const LOAD_HOURLY_DATA = [
  { hour: '00:00', residentialKW: 120, commercialKW: 40 },
  { hour: '04:00', residentialKW: 90, commercialKW: 30 },
  { hour: '08:00', residentialKW: 280, commercialKW: 340 },
  { hour: '12:00', residentialKW: 210, commercialKW: 490 },
  { hour: '16:00', residentialKW: 240, commercialKW: 510 },
  { hour: '20:00', residentialKW: 460, commercialKW: 280 },
  { hour: '23:00', residentialKW: 290, commercialKW: 110 },
];

const ZONE_CONSUMPTION = [
  { zone: 'Sector 14 (Res)', consumption: 84000, revenue: 420000 },
  { zone: 'Cyber City (Com)', consumption: 162000, revenue: 1296000 },
  { zone: 'Brigade Rd (Com)', consumption: 114000, revenue: 912000 },
  { zone: 'Meadows (Res)', consumption: 68000, revenue: 340000 },
  { zone: 'Logistics Hub (Com)', consumption: 210000, revenue: 1680000 },
];

export const ReportsAnalytics: React.FC = () => {
  const { stats, bills, payments } = useData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Reports & Utility Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Grid telemetry distributions, zone-wise consumption, and collection realization insights.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          Export Report Summary
        </button>
      </div>

      {/* Hourly Grid Load Area Chart */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Diurnal Grid Load Curve (kW by Hour)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative 24-hour demand telemetry showing residential evening vs commercial midday peaks
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-semibold">
            Grid Telemetry
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={LOAD_HOURLY_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="residentialKW"
                name="Residential Load (kW)"
                stroke="#16A34A"
                fillOpacity={1}
                fill="url(#resGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="commercialKW"
                name="Commercial Load (kW)"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#comGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone Wise Consumption Bar Chart */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Distribution Feeder Zones: Consumption vs Revenue Realization
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated energy consumption (kWh) against gross realized revenue (₹)
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Discom Region North</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ZONE_CONSUMPTION} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="zone" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `${v / 1000}k`}
              />
              <Tooltip
                formatter={(val: any) => [Number(val).toLocaleString('en-IN'), '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="consumption" name="Units Consumed (kWh)" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Billed Revenue (₹)" fill="#0F172A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
