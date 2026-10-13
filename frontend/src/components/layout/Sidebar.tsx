import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Users,
  Gauge,
  Receipt,
  CreditCard,
  SlidersHorizontal,
  Code2,
  Settings,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useData } from '../../context/DataContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { bills } = useData();
  const pendingCount = bills.filter(b => b.paymentStatus !== 'Paid').length;

  const navItems = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'Customers', to: '/customers', icon: Users },
    { name: 'Meter Readings', to: '/meter-readings', icon: Gauge },
    { name: 'Bills & Invoices', to: '/bills', icon: Receipt, badge: pendingCount > 0 ? pendingCount : undefined },
    { name: 'Payments', to: '/payments', icon: CreditCard },
    { name: 'Tariff Management', to: '/tariffs', icon: SlidersHorizontal },
    { name: 'Reports & Analytics', to: '/analytics', icon: TrendingUp },
    { name: 'System Architecture', to: '/architecture', icon: Code2, highlightBadge: 'OOP' },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0F172A] text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-glow shrink-0">
            <Zap className="w-5 h-5 fill-white text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                Volt<span className="text-emerald-400">Flow</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Smart Energy OS
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        <div className={`px-2 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase ${collapsed ? 'sr-only' : 'block'}`}>
          Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-150 group relative ${
                  isActive
                    ? 'bg-emerald-600/15 text-emerald-400 font-semibold ring-1 ring-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.name}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                  )}

                  {!collapsed && item.highlightBadge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                      {item.highlightBadge}
                    </span>
                  )}

                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-500 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footprint */}
      {!collapsed ? (
        <div className="p-3 m-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1.5">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </span>
            <span className="font-mono text-[10px] text-slate-400">v2.4.0</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Java OOP College Demonstration Project
          </p>
        </div>
      ) : (
        <div className="p-2 flex justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="Engine Online" />
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 z-30 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="fixed top-0 bottom-0 left-0 w-inherit">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0F172A] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
