import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  Zap,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, loginWithDemo } = useAuth();
  const { bills, customers } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ name: 'Dashboard', to: '/' }];
    const segments = path.split('/').filter(Boolean);
    const map: Record<string, string> = {
      customers: 'Customers',
      'meter-readings': 'Meter Readings',
      bills: 'Bills & Invoices',
      payments: 'Payments',
      tariffs: 'Tariff Management',
      analytics: 'Reports & Analytics',
      architecture: 'System Architecture (OOP)',
      settings: 'Settings',
      login: 'Login',
      verify: 'OTP Verification',
      register: 'Register',
    };
    return [
      { name: 'Home', to: '/' },
      ...segments.map((seg, i) => ({
        name: map[seg] || seg,
        to: '/' + segments.slice(0, i + 1).join('/'),
      })),
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  // Search matches across customers and bills
  const filteredResults = searchQuery.trim()
    ? [
        ...customers
          .filter(
            c =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
              c.meterNumber.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 4)
          .map(c => ({
            type: 'Customer',
            title: c.name,
            subtitle: `${c.customerId} • Meter: ${c.meterNumber}`,
            to: '/customers',
          })),
        ...bills
          .filter(
            b =>
              b.billId.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.customerName.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 4)
          .map(b => ({
            type: 'Bill',
            title: b.billId,
            subtitle: `${b.customerName} • ₹${b.totalAmount.toLocaleString('en-IN')}`,
            to: '/bills',
          })),
      ]
    : [];

  const notifications = [
    {
      id: 1,
      title: 'New bill generated',
      time: '10 mins ago',
      desc: 'INV-2026-9903 generated for Apex Logistics Hub.',
      read: false,
    },
    {
      id: 2,
      title: 'Payment Confirmed',
      time: '1 hour ago',
      desc: 'Payment received for INV-2026-8801 via UPI.',
      read: false,
    },
    {
      id: 3,
      title: 'Tariff Update Notice',
      time: 'Yesterday',
      desc: 'Annual residential rate slab updated to ₹5/unit.',
      read: true,
    },
  ];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb path */}
        <nav className="hidden sm:flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.to}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-slate-900 dark:text-white font-semibold truncate">
                  {crumb.name}
                </span>
              ) : (
                <Link to={crumb.to} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center: Global Search Bar */}
      <div className="relative flex-1 max-w-md mx-4 hidden md:block" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers, bills, meters... (Press '/' to search)"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setSearchResultsOpen(true);
            }}
            onFocus={() => setSearchResultsOpen(true)}
            className="w-full bg-slate-100 dark:bg-slate-850 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Popover */}
        {searchResultsOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden z-30">
            <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              Matching Records ({filteredResults.length})
            </div>
            {filteredResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                No customers or bills matching "{searchQuery}"
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                {filteredResults.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(item.to);
                      setSearchResultsOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {item.type}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-30">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Notifications</span>
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                  2 Unread
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                      <span>{n.title}</span>
                      <span className="text-[10px] font-normal text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-2 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-500/20">
              {user ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                {user ? user.name : 'Guest'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {user ? user.role : 'Signed Out'}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-30">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {user ? user.name : 'Demo Guest'}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {user ? user.email : 'guest@voltflow.com'}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Shield className="w-3 h-3" /> {user?.role || 'VIEWER'}
                  </span>
                </div>
              </div>

              {/* Quick role switch for viva review */}
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Role Switch (Demo)
              </div>
              <button
                onClick={() => {
                  loginWithDemo('ADMIN');
                  setProfileOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Switch to Admin</span>
                {user?.role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </button>
              <button
                onClick={() => {
                  loginWithDemo('CUSTOMER');
                  setProfileOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Switch to Customer</span>
                {user?.role === 'CUSTOMER' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </button>

              <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

              <Link
                to="/settings"
                onClick={() => setProfileOpen(false)}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Account & Settings</span>
              </Link>

              <button
                onClick={() => {
                  logout();
                  setProfileOpen(false);
                  navigate('/login');
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors mt-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out (OTP Session)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
