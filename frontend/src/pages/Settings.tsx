import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Sun,
  Moon,
  Server,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Terminal,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { checkBackendHealth } from '../services/api';
import { Modal } from '../components/ui/Modal';

export const Settings: React.FC = () => {
  const { resetDemoData } = useData();
  const { theme, toggleTheme, setTheme } = useTheme();
  const { user } = useAuth();

  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  const testConnection = async () => {
    setCheckingBackend(true);
    const isUp = await checkBackendHealth();
    setBackendOnline(isUp);
    setCheckingBackend(false);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System & Demonstration Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure application preferences, test Spring Boot backend connectivity, and manage demonstration state.
        </p>
      </div>

      {/* Backend Integration Card */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Spring Boot Java Backend Connectivity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Endpoint: <code className="font-mono text-emerald-600">http://localhost:8080/api</code>
              </p>
            </div>
          </div>

          <button
            onClick={testConnection}
            disabled={checkingBackend}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingBackend ? 'animate-spin' : ''}`} />
            <span>Test Connection</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                backendOnline === true
                  ? 'bg-emerald-500 animate-pulse'
                  : backendOnline === false
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {backendOnline === true
                ? 'Java Spring Boot Backend is Online & Connected!'
                : backendOnline === false
                ? 'Backend Offline — Running in Standalone Browser Simulator Mode'
                : 'Probing backend connection...'}
            </span>
          </div>

          <span className="font-mono text-[11px] text-slate-400">
            {backendOnline === true ? 'HTTP 200 OK' : 'Local Persistence Active'}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          VoltFlow includes both a complete standalone browser state engine (with full localStorage persistence) and an optional production Java Spring Boot REST backend with OTP email dispatch. The frontend operates seamlessly in both modes.
        </p>
      </div>

      {/* Theme Preferences */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-subtle space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          Display Appearance & Theme
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your visual preference. VoltFlow supports seamless light and dark high-contrast themes.
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            onClick={() => setTheme('light')}
            className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </div>
            {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Navy Mode</span>
            </div>
            {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
          </button>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-white dark:bg-[#131B2E] border border-rose-200/80 dark:border-rose-950/80 rounded-2xl p-6 shadow-subtle space-y-4">
        <div>
          <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Demo Data to Initial Baseline
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Restores all customers, meter readings, sample tariffs, generated bills, and settled payments back to clean college viva demonstration values.
          </p>
        </div>

        <button
          onClick={() => setConfirmResetOpen(true)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Demonstration Data
        </button>
      </div>

      {/* Confirmation Dialog */}
      {confirmResetOpen && (
        <Modal
          isOpen={confirmResetOpen}
          onClose={() => setConfirmResetOpen(false)}
          title="Confirm Demo Data Reset"
          subtitle="All modified customers, readings, and payments will revert to initial factory state."
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to reset all data? This will clear custom records created in this session and restore the initial demonstration customers and bills.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setConfirmResetOpen(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setConfirmResetOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
