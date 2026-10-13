import React, { useState } from 'react';
import {
  Users,
  Receipt,
  CreditCard,
  AlertCircle,
  Plus,
  Gauge,
  FileText,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Download,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';
import { AddCustomerModal } from '../components/quickactions/AddCustomerModal';
import { RecordReadingModal } from '../components/quickactions/RecordReadingModal';
import { GenerateBillModal } from '../components/quickactions/GenerateBillModal';
import { RecordPaymentModal } from '../components/quickactions/RecordPaymentModal';
import { InvoiceModal } from '../components/invoices/InvoiceModal';
import { PaymentReceiptModal } from '../components/invoices/PaymentReceiptModal';
import { Bill, Payment } from '../types';

// Demonstration analytics datasets
const CONSUMPTION_TREND_DATA = [
  { month: 'Apr', consumptionKWh: 42000, solarFeedIn: 3200 },
  { month: 'May', consumptionKWh: 54000, solarFeedIn: 4100 },
  { month: 'Jun', consumptionKWh: 68000, solarFeedIn: 4800 },
  { month: 'Jul', consumptionKWh: 72000, solarFeedIn: 4600 },
  { month: 'Aug', consumptionKWh: 69000, solarFeedIn: 4200 },
  { month: 'Sep', consumptionKWh: 58000, solarFeedIn: 3900 },
  { month: 'Oct', consumptionKWh: 61500, solarFeedIn: 4300 },
];

const REVENUE_TREND_DATA = [
  { month: 'Apr', revenue: 340000, collected: 310000 },
  { month: 'May', revenue: 410000, collected: 395000 },
  { month: 'Jun', revenue: 520000, collected: 490000 },
  { month: 'Jul', revenue: 560000, collected: 530000 },
  { month: 'Aug', revenue: 545000, collected: 512000 },
  { month: 'Sep', revenue: 490000, collected: 472000 },
  { month: 'Oct', revenue: 510000, collected: 482650 },
];

export const Dashboard: React.FC = () => {
  const { stats, bills, payments, customers } = useData();

  // Modals state
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [recordReadingOpen, setRecordReadingOpen] = useState(false);
  const [generateBillOpen, setGenerateBillOpen] = useState(false);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);

  // Preview modals
  const [selectedInvoice, setSelectedInvoice] = useState<Bill | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Compute live breakdown for pie chart
  const residentialCount = customers.filter(c => c.customerType === 'Residential').length;
  const commercialCount = customers.filter(c => c.customerType === 'Commercial').length;

  const customerDistributionData = [
    { name: 'Residential', value: 924 + residentialCount * 5, color: '#16A34A' },
    { name: 'Commercial', value: 360 + commercialCount * 3, color: '#0F172A' },
  ];

  const pendingBills = bills.filter(b => b.paymentStatus !== 'Paid').slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good morning, Admin
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your electricity management today.
          </p>
        </div>

        {/* Action quick buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAddCustomerOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Customer
          </button>
          <button
            onClick={() => setRecordReadingOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-600" />
            Record Reading
          </button>
          <button
            onClick={() => setGenerateBillOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate Bill
          </button>
          <button
            onClick={() => setRecordPaymentOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 transition-all"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Record Payment
          </button>
        </div>
      </div>

      {/* 4 Required KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString('en-IN')}
          icon={Users}
          trend={{ value: '+12.4%', isPositive: true }}
          comparison="vs previous month"
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-950/40"
        />

        <StatCard
          title="Bills Generated"
          value={stats.billsGenerated.toLocaleString('en-IN')}
          icon={Receipt}
          trend={{ value: '+8.1%', isPositive: true }}
          comparison="vs previous month"
          iconColor="text-indigo-600 dark:text-indigo-400"
          iconBg="bg-indigo-50 dark:bg-indigo-950/40"
        />

        <StatCard
          title="Payments Collected"
          value={`₹${stats.paymentsCollected.toLocaleString('en-IN')}`}
          icon={CreditCard}
          trend={{ value: '+18.2%', isPositive: true }}
          comparison="vs previous month"
          iconColor="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/40"
        />

        <StatCard
          title="Pending Payments"
          value={`₹${stats.pendingPayments.toLocaleString('en-IN')}`}
          icon={AlertCircle}
          trend={{ value: '-4.6%', isPositive: true }}
          comparison="vs previous month"
          iconColor="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/40"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Electricity Consumption Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Monthly Electricity Consumption (kWh)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Grid load distribution vs distributed solar feed-in
              </p>
            </div>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-semibold">
              Live Telemetry
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CONSUMPTION_TREND_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
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
                <Line
                  type="monotone"
                  dataKey="consumptionKWh"
                  name="Grid Consumption (kWh)"
                  stroke="#16A34A"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#16A34A' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="solarFeedIn"
                  name="Solar Feed-in (kWh)"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Residential vs Commercial Donut Chart */}
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Customer Classification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Residential vs Commercial ratio (OOP mapping)
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Residential</div>
                <div className="font-bold text-slate-900 dark:text-white">72% (~924)</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 dark:bg-slate-300" />
              <div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">Commercial</div>
                <div className="font-bold text-slate-900 dark:text-white">28% (~360)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue Invoiced vs Collections Realized (₹)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly utility billing realization performance
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
            Fiscal 2026
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.4} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={val => `₹${val / 1000}k`}
              />
              <Tooltip
                formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Total Invoiced (₹)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="collected" name="Realized / Collected (₹)" fill="#16A34A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Recent Transactions & Pending Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions Table */}
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Recent Settlements
              </h3>
              <span className="text-xs text-emerald-600 font-semibold">
                {recentPayments.length} transactions
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-x-auto">
              {recentPayments.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedReceipt(p)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {p.customerName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {p.paymentMethod} • Ref: {p.paymentId} • {p.paymentDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </div>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded font-semibold">
                      Settled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
            <button
              onClick={() => setRecordPaymentOpen(true)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Record New Payment <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pending Invoices List */}
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pending Unpaid Bills
              </h3>
              <span className="text-xs text-amber-600 font-semibold">
                {pendingBills.length} outstanding
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-x-auto">
              {pendingBills.map(b => (
                <div
                  key={b.id}
                  onClick={() => setSelectedInvoice(b)}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{b.customerName}</span>
                      <Badge variant={b.customerType} />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {b.billId} • Due: {b.dueDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <Badge variant={b.paymentStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-right">
            <button
              onClick={() => setGenerateBillOpen(true)}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              Generate New Invoices <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Action Modals */}
      <AddCustomerModal
        isOpen={addCustomerOpen}
        onClose={() => setAddCustomerOpen(false)}
      />

      <RecordReadingModal
        isOpen={recordReadingOpen}
        onClose={() => setRecordReadingOpen(false)}
      />

      <GenerateBillModal
        isOpen={generateBillOpen}
        onClose={() => setGenerateBillOpen(false)}
        onSuccess={billId => {
          const generated = bills.find(b => b.billId === billId);
          if (generated) setSelectedInvoice(generated);
        }}
      />

      <RecordPaymentModal
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        onPaymentSuccess={p => setSelectedReceipt(p)}
      />

      {/* Invoice & Receipt Viewers */}
      <InvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        bill={selectedInvoice}
        onPayNow={b => {
          setSelectedInvoice(null);
          setRecordPaymentOpen(true);
        }}
      />

      <PaymentReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        payment={selectedReceipt}
      />
    </div>
  );
};
