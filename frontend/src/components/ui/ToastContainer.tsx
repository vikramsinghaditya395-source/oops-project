import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />,
        };

        const bgStyles = {
          success: 'bg-white dark:bg-slate-900 border-emerald-500/30 dark:border-emerald-500/30',
          error: 'bg-white dark:bg-slate-900 border-rose-500/30 dark:border-rose-500/30',
          warning: 'bg-white dark:bg-slate-900 border-amber-500/30 dark:border-amber-500/30',
          info: 'bg-white dark:bg-slate-900 border-blue-500/30 dark:border-blue-500/30',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-5 ${bgStyles[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              {toast.title && (
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {toast.title}
                </div>
              )}
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
