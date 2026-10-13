import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: {
    value: string;
    isPositive: boolean;
  };
  comparison: string;
  iconColor?: string;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  comparison,
  iconColor = 'text-emerald-600 dark:text-emerald-400',
  iconBg = 'bg-emerald-50 dark:bg-emerald-950/40',
}) => {
  return (
    <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle hover:shadow-premium transition-all duration-200 relative group overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">
              {title}
            </span>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono">
              Demo
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            {value}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${iconBg} ${iconColor} ring-1 ring-black/5 dark:ring-white/5`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full ${
            trend.isPositive
              ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400'
              : 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400'
          }`}
        >
          {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend.value}
        </span>
        <span className="text-slate-500 dark:text-slate-400">{comparison}</span>
      </div>
    </div>
  );
};
