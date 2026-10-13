import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useData } from '../../context/DataContext';
import { CustomerType } from '../../types';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose }) => {
  const { addCustomer, customers } = useData();

  const [customerType, setCustomerType] = useState<CustomerType>('Residential');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [sanctionedLoad, setSanctionedLoad] = useState('5');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = '10-digit phone number is required';
    if (!address.trim()) errs.address = 'Service installation address is required';
    if (!meterNumber.trim()) errs.meterNumber = 'Meter serial number is required';
    else if (customers.some(c => c.meterNumber.toLowerCase() === meterNumber.trim().toLowerCase())) {
      errs.meterNumber = 'This meter number is already assigned to another customer';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const nextNumber = 1000 + customers.length + 1;
    const customerId = customerType === 'Residential' ? `VF-RES-${nextNumber}` : `VF-COM-${nextNumber}`;

    addCustomer({
      customerId,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      customerType,
      meterNumber: meterNumber.trim().toUpperCase(),
      connectionDate: new Date().toISOString().split('T')[0],
      accountStatus: 'Active',
      sanctionedLoadKw: Number(sanctionedLoad) || 5,
    });

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setMeterNumber('');
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Customer"
      subtitle="Register a new residential or commercial electricity consumer account"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Type Choice */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
            Customer Classification (OOP Class Type)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCustomerType('Residential')}
              className={`p-3 rounded-xl border text-left transition-all ${
                customerType === 'Residential'
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-bold">ResidentialCustomer</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹5.00/unit base slab</div>
            </button>

            <button
              type="button"
              onClick={() => setCustomerType('Commercial')}
              className={`p-3 rounded-xl border text-left transition-all ${
                customerType === 'Commercial'
                  ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="text-xs font-bold">CommercialCustomer</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹8.00/unit power slab</div>
            </button>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Full Name / Enterprise Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={customerType === 'Residential' ? 'e.g. Rahul Sharma' : 'e.g. Vertex Data Systems'}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="billing@example.com"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Service Address *
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Plot/Flat number, Street, City, State"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
        </div>

        {/* Meter & Load */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Smart Meter Number *
            </label>
            <input
              type="text"
              value={meterNumber}
              onChange={e => setMeterNumber(e.target.value)}
              placeholder="e.g. MTR-8812"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase"
            />
            {errors.meterNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.meterNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sanctioned Load (kW)
            </label>
            <input
              type="number"
              min="1"
              max="200"
              value={sanctionedLoad}
              onChange={e => setSanctionedLoad(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
          >
            Create Customer Account
          </button>
        </div>
      </form>
    </Modal>
  );
};
