import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Zap,
  Clock,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const OtpVerificationPage: React.FC = () => {
  const {
    pendingEmail,
    verifyOtp,
    resendOtp,
    isLoading,
    demoOtpNotice,
    clearDemoNotice,
  } = useAuth();
  const navigate = useNavigate();

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [attemptsLeft, setAttemptsLeft] = useState<number>(5);

  // 5-minute countdown timer (300 seconds)
  const [expiresInSeconds, setExpiresInSeconds] = useState<number>(300);

  // 60-second resend cooldown timer
  const [resendCooldown, setResendCooldown] = useState<number>(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setExpiresInSeconds(prev => (prev > 0 ? prev - 1 : 0));
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric inputs
    const char = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setError('');

    // Advance focus if character entered
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (char && index === 5 && newOtp.every(d => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled or next empty
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const fullCode = codeToVerify || otp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    if (expiresInSeconds <= 0) {
      setError('This OTP has expired (5-minute limit). Please request a new code.');
      return;
    }

    try {
      const res = await verifyOtp(fullCode);
      if (res.success) {
        navigate('/auth-success');
      } else {
        setAttemptsLeft(prev => Math.max(0, prev - 1));
        setError(res.message);
      }
    } catch (err: any) {
      setAttemptsLeft(prev => Math.max(0, prev - 1));
      setError(err.message || 'OTP verification failed');
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      setError('');
      const res = await resendOtp();
      if (res.success) {
        setExpiresInSeconds(300);
        setResendCooldown(60);
        setAttemptsLeft(5);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-glow mb-4">
            <KeyRound className="w-8 h-8 fill-white text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify Security Code
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Enter the 6-digit code dispatched to{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {pendingEmail || 'your email'}
            </span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
          {/* Demo Mode Code Callout */}
          {demoOtpNotice && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-bold mb-1">
                <span>Demo Code Simulation</span>
                <button
                  onClick={clearDemoNotice}
                  className="text-[10px] text-emerald-600 hover:underline"
                >
                  Dismiss
                </button>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                In demonstration mode, your verified OTP is:{' '}
                <button
                  type="button"
                  onClick={() => {
                    const digits = demoOtpNotice.split('');
                    setOtp(digits);
                    handleVerify(demoOtpNotice);
                  }}
                  className="font-mono text-sm font-extrabold text-emerald-700 dark:text-emerald-300 underline tracking-wider"
                >
                  {demoOtpNotice} (Click to Auto-fill)
                </button>
              </p>
            </div>
          )}

          {/* 6 Digit Input Boxes */}
          <div>
            <div className="flex items-center justify-center gap-2 sm:gap-2.5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-extrabold font-mono rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                />
              ))}
            </div>

            {/* Expiry and attempts status */}
            <div className="flex items-center justify-between text-xs text-slate-500 mt-4 px-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Expires in:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatTime(expiresInSeconds)}
                </span>
              </span>

              <span className="text-[11px] text-slate-400">
                Attempts: {attemptsLeft} of 5 remaining
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={isLoading || otp.some(d => d === '')}
            className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            {isLoading ? <span>Verifying OTP Hash...</span> : <span>Confirm & Authenticate</span>}
          </button>

          {/* Resend Cooldown Section */}
          <div className="text-center pt-2">
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:text-slate-400 disabled:no-underline flex items-center justify-center gap-1.5 mx-auto transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resendCooldown > 0 ? '' : 'hover:rotate-180 transition-transform'}`} />
              <span>
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : 'Didn\'t receive code? Resend OTP'}
              </span>
            </button>
          </div>

          <div className="pt-2 text-center text-xs border-t border-slate-100 dark:border-slate-800">
            <Link to="/login" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              ← Change registered email address
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
