import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Customer, CustomerType, AccountStatus } from '../types';
import { Badge } from '../components/ui/Badge';
import { AddCustomerModal } from '../components/quickactions/AddCustomerModal';
import { Modal } from '../components/ui/Modal';

export const Customers: React.FC = () => {
  const { customers, deleteCustomer, updateCustomer } = useData();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'All' | CustomerType>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | AccountStatus>('All');
  const [sortBy, setSortBy] = useState<'name' | 'customerId' | 'connectionDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Customer | null>(null);

  // Filter and Sort customers
  const filteredCustomers = useMemo(() => {
    return customers
      .filter(c => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.customerId.toLowerCase().includes(search.toLowerCase()) ||
          c.meterNumber.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase());

        const matchesType = typeFilter === 'All' || c.customerType === typeFilter;
        const matchesStatus = statusFilter === 'All' || c.accountStatus === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [customers, search, typeFilter, statusFilter, sortBy, sortOrder]);

  // Pagination slice
  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: 'name' | 'customerId' | 'connectionDate') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCustomer) return;
    updateCustomer(editCustomer.id, {
      name: editCustomer.name,
      email: editCustomer.email,
      phone: editCustomer.phone,
      address: editCustomer.address,
      accountStatus: editCustomer.accountStatus,
      customerType: editCustomer.customerType,
    });
    setEditCustomer(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Customer Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage electricity connections, consumer types, and meter associations.
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, ID, meter number, or email..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={e => {
                setTypeFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none text-xs"
            >
              <option value="All">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-xl text-xs">
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none text-xs"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th
                  onClick={() => handleSort('customerId')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    Consumer ID <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    Customer Name <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Type (OOP Class)</th>
                <th className="py-3.5 px-4 font-semibold">Smart Meter</th>
                <th className="py-3.5 px-4 font-semibold">Contact</th>
                <th
                  onClick={() => handleSort('connectionDate')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    Connected <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {paginatedCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No customers found matching the criteria.
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map(customer => (
                  <tr
                    key={customer.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {customer.customerId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {customer.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {customer.address}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={customer.customerType} />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                      {customer.meterNumber}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      <div>{customer.email}</div>
                      <div className="font-mono text-slate-400">{customer.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {customer.connectionDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={customer.accountStatus} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewCustomer(customer)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Consumer Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditCustomer(customer)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(customer)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove Customer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold">{paginatedCustomers.length}</span> of{' '}
            <span className="font-semibold">{filteredCustomers.length}</span> consumers
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* View Customer Details Modal */}
      {viewCustomer && (
        <Modal
          isOpen={!!viewCustomer}
          onClose={() => setViewCustomer(null)}
          title={`Consumer Profile: ${viewCustomer.name}`}
          subtitle={`Account Reference ${viewCustomer.customerId}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Classification</span>
                <div className="mt-0.5">
                  <Badge variant={viewCustomer.customerType} />
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Meter ID</span>
                <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {viewCustomer.meterNumber}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Status</span>
                <div className="mt-0.5">
                  <Badge variant={viewCustomer.accountStatus} />
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Email Address:</span>
                <span className="font-medium text-slate-900 dark:text-white">{viewCustomer.email}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Phone Contact:</span>
                <span className="font-mono text-slate-900 dark:text-white">{viewCustomer.phone}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Installation Address:</span>
                <span className="text-right text-slate-900 dark:text-white max-w-[220px]">{viewCustomer.address}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Connected Date:</span>
                <span className="font-mono text-slate-900 dark:text-white">{viewCustomer.connectionDate}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-400">Sanctioned Grid Load:</span>
                <span className="font-mono font-bold text-emerald-600">{viewCustomer.sanctionedLoadKw || 5} kW</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewCustomer(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Customer Modal */}
      {editCustomer && (
        <Modal
          isOpen={!!editCustomer}
          onClose={() => setEditCustomer(null)}
          title={`Edit Customer: ${editCustomer.customerId}`}
          subtitle="Update consumer profile and address records"
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={editCustomer.name}
                onChange={e => setEditCustomer({ ...editCustomer, name: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editCustomer.email}
                  onChange={e => setEditCustomer({ ...editCustomer, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={editCustomer.phone}
                  onChange={e => setEditCustomer({ ...editCustomer, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Address
              </label>
              <textarea
                rows={2}
                value={editCustomer.address}
                onChange={e => setEditCustomer({ ...editCustomer, address: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Classification
                </label>
                <select
                  value={editCustomer.customerType}
                  onChange={e => setEditCustomer({ ...editCustomer, customerType: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editCustomer.accountStatus}
                  onChange={e => setEditCustomer({ ...editCustomer, accountStatus: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditCustomer(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirmation Dialog before destructive deletion */}
      {deleteCandidate && (
        <Modal
          isOpen={!!deleteCandidate}
          onClose={() => setDeleteCandidate(null)}
          title="Confirm Customer Deletion"
          subtitle="Are you sure you want to remove this consumer record?"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Removing customer <strong className="text-slate-900 dark:text-white">{deleteCandidate.name}</strong> ({deleteCandidate.customerId}) will detach Meter #{deleteCandidate.meterNumber}. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteCustomer(deleteCandidate.id);
                  setDeleteCandidate(null);
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white"
              >
                Delete Customer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
