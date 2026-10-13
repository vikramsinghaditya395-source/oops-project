import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const AuthSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });

    const timer = setTimeout(() => {
      navigate('/');
    }, 2400);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 sm:p-10 shadow-premium animate-in zoom-in-95 duration-200">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-6 ring-8 ring-emerald-50 dark:ring-emerald-950/30">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Authentication Successful!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Your single-use OTP has been verified and an authenticated session has been established.
        </p>

        {user && (
          <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-left">
            <div className="flex justify-between items-center text-slate-500 mb-1">
              <span>Authenticated Profile:</span>
              <span className="font-semibold text-emerald-600 uppercase font-mono text-[10px]">
                {user.role}
              </span>
            </div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</div>
            <div className="text-slate-400 text-[11px] truncate">{user.email}</div>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span>Redirecting to your dashboard...</span>
          <ArrowRight className="w-4 h-4 animate-bounce-x" />
        </div>
      </div>
    </div>
  );
};
