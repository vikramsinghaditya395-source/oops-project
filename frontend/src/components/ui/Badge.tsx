import React from 'react';

type BadgeVariant =
  | 'Residential'
  | 'Commercial'
  | 'Active'
  | 'Inactive'
  | 'Paid'
  | 'Pending'
  | 'Overdue'
  | 'Verified'
  | 'Success'
  | 'ADMIN'
  | 'CUSTOMER';

interface BadgeProps {
  variant: BadgeVariant | string;
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, className = '' }) => {
  const label = children || variant;

  const getVariantStyles = () => {
    switch (variant) {
      case 'Residential':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60';
      case 'Commercial':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
      case 'Active':
      case 'Verified':
      case 'Success':
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
      case 'Inactive':
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
      case 'ADMIN':
        return 'bg-slate-900 text-white border-slate-700 dark:bg-slate-100 dark:text-slate-900';
      case 'CUSTOMER':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/60';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getVariantStyles()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 mr-1.5" />
      {label}
    </span>
  );
};
