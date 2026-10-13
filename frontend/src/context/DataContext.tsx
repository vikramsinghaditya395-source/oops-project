import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, MeterReading, Tariff, Bill, Payment, ToastMessage } from '../types';
import {
  INITIAL_CUSTOMERS,
  INITIAL_TARIFFS,
  INITIAL_READINGS,
  INITIAL_BILLS,
  INITIAL_PAYMENTS,
} from '../data/initialData';

interface DataContextType {
  customers: Customer[];
  meterReadings: MeterReading[];
  tariffs: Tariff[];
  bills: Bill[];
  payments: Payment[];
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], message: string, title?: string) => void;
  removeToast: (id: string) => void;
  // Customer CRUD
  addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => boolean;
  // Meter Readings
  addMeterReading: (reading: Omit<MeterReading, 'id' | 'unitsConsumed'>) => MeterReading;
  // Tariffs
  updateTariff: (id: string, updated: Partial<Tariff>) => void;
  // Bills
  generateBill: (readingId: string, dueDateDays?: number) => Bill;
  generateCustomBill: (billData: {
    customerId: string;
    meterNumber: string;
    previousReading: number;
    currentReading: number;
    billDate?: string;
    dueDate?: string;
  }) => Bill;
  // Payments
  recordPayment: (paymentData: {
    billId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    transactionReference?: string;
  }) => Payment;
  // Reset demo data
  resetDemoData: () => void;
  // KPI calculated values
  stats: {
    totalCustomers: number;
    billsGenerated: number;
    paymentsCollected: number;
    pendingPayments: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('voltflow_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [meterReadings, setMeterReadings] = useState<MeterReading[]>(() => {
    const saved = localStorage.getItem('voltflow_readings');
    return saved ? JSON.parse(saved) : INITIAL_READINGS;
  });

  const [tariffs, setTariffs] = useState<Tariff[]>(() => {
    const saved = localStorage.getItem('voltflow_tariffs');
    return saved ? JSON.parse(saved) : INITIAL_TARIFFS;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('voltflow_bills');
    return saved ? JSON.parse(saved) : INITIAL_BILLS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem('voltflow_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('voltflow_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('voltflow_readings', JSON.stringify(meterReadings));
  }, [meterReadings]);

  useEffect(() => {
    localStorage.setItem('voltflow_tariffs', JSON.stringify(tariffs));
  }, [tariffs]);

  useEffect(() => {
    localStorage.setItem('voltflow_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('voltflow_payments', JSON.stringify(payments));
  }, [payments]);

  const addToast = (type: ToastMessage['type'], message: string, title?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Customer Management
  const addCustomer = (customerData: Omit<Customer, 'id'>) => {
    const newId = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomer: Customer = {
      ...customerData,
      id: newId,
    };
    setCustomers(prev => [newCustomer, ...prev]);
    addToast('success', `Customer ${newCustomer.name} added successfully.`);
    return newCustomer;
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updated } : c))
    );
    addToast('success', 'Customer record updated.');
  };

  const deleteCustomer = (id: string) => {
    const customer = customers.find(c => c.id === id);
    if (!customer) return false;
    setCustomers(prev => prev.filter(c => c.id !== id));
    addToast('info', `Customer ${customer.name} removed.`);
    return true;
  };

  // Meter Readings
  const addMeterReading = (readingData: Omit<MeterReading, 'id' | 'unitsConsumed'>) => {
    if (readingData.currentReading < readingData.previousReading) {
      addToast('error', 'Current reading cannot be lower than previous reading!');
      throw new Error('Current reading cannot be lower than previous reading');
    }

    const unitsConsumed = readingData.currentReading - readingData.previousReading;
    const newReading: MeterReading = {
      ...readingData,
      id: `RDG-${Date.now().toString().slice(-4)}`,
      unitsConsumed,
    };

    setMeterReadings(prev => [newReading, ...prev]);
    addToast('success', `Reading recorded for Meter #${newReading.meterNumber}: ${unitsConsumed} kWh consumed.`);
    return newReading;
  };

  // Tariff Management
  const updateTariff = (id: string, updated: Partial<Tariff>) => {
    setTariffs(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updated } : t))
    );
    addToast('success', 'Tariff schedule configuration updated.');
  };

  // Bill Generation
  const generateBill = (readingId: string, dueDateDays: number = 20) => {
    const reading = meterReadings.find(r => r.id === readingId);
    if (!reading) throw new Error('Meter reading not found');

    const customer = customers.find(c => c.customerId === reading.customerId || c.meterNumber === reading.meterNumber);
    if (!customer) throw new Error('Customer associated with this reading not found');

    const tariff = tariffs.find(t => t.customerType === customer.customerType) || tariffs[0];

    const unitsConsumed = reading.unitsConsumed;
    const ratePerUnit = tariff.ratePerUnit;
    const energyCharge = unitsConsumed * ratePerUnit;
    const fixedCharge = tariff.fixedMonthlyCharge;
    const surchargeAmount = Math.round((energyCharge + fixedCharge) * (tariff.surchargePercent / 100));
    const totalAmount = energyCharge + fixedCharge + surchargeAmount;

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + dueDateDays);

    const billId = `INV-${today.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBill: Bill = {
      id: `BILL-${Date.now().toString().slice(-5)}`,
      billId,
      customerId: customer.customerId,
      customerName: customer.name,
      customerType: customer.customerType,
      meterNumber: reading.meterNumber,
      previousReading: reading.previousReading,
      currentReading: reading.currentReading,
      unitsConsumed,
      ratePerUnit,
      energyCharge,
      fixedCharge,
      surchargeAmount,
      totalAmount,
      billDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      paymentStatus: 'Pending',
    };

    setBills(prev => [newBill, ...prev]);
    addToast('success', `Bill ${billId} generated for ₹${totalAmount.toLocaleString('en-IN')}`);
    return newBill;
  };

  const generateCustomBill = (data: {
    customerId: string;
    meterNumber: string;
    previousReading: number;
    currentReading: number;
    billDate?: string;
    dueDate?: string;
  }) => {
    if (data.currentReading < data.previousReading) {
      throw new Error('Current reading cannot be lower than previous reading');
    }

    const customer = customers.find(c => c.customerId === data.customerId || c.meterNumber === data.meterNumber);
    if (!customer) throw new Error('Customer not found');

    const tariff = tariffs.find(t => t.customerType === customer.customerType) || tariffs[0];
    const unitsConsumed = data.currentReading - data.previousReading;
    const ratePerUnit = tariff.ratePerUnit;
    const energyCharge = unitsConsumed * ratePerUnit;
    const fixedCharge = tariff.fixedMonthlyCharge;
    const surchargeAmount = Math.round((energyCharge + fixedCharge) * (tariff.surchargePercent / 100));
    const totalAmount = energyCharge + fixedCharge + surchargeAmount;

    const todayStr = data.billDate || new Date().toISOString().split('T')[0];
    const dueDateStr = data.dueDate || (() => {
      const d = new Date();
      d.setDate(d.getDate() + 20);
      return d.toISOString().split('T')[0];
    })();

    const billId = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBill: Bill = {
      id: `BILL-${Date.now().toString().slice(-5)}`,
      billId,
      customerId: customer.customerId,
      customerName: customer.name,
      customerType: customer.customerType,
      meterNumber: data.meterNumber,
      previousReading: data.previousReading,
      currentReading: data.currentReading,
      unitsConsumed,
      ratePerUnit,
      energyCharge,
      fixedCharge,
      surchargeAmount,
      totalAmount,
      billDate: todayStr,
      dueDate: dueDateStr,
      paymentStatus: 'Pending',
    };

    setBills(prev => [newBill, ...prev]);
    addToast('success', `Bill ${billId} generated successfully.`);
    return newBill;
  };

  // Payment Recording
  const recordPayment = (paymentData: {
    billId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    transactionReference?: string;
  }) => {
    if (paymentData.amount <= 0) {
      addToast('error', 'Payment amount must be greater than zero.');
      throw new Error('Payment amount must be greater than zero');
    }

    const targetBill = bills.find(b => b.billId === paymentData.billId || b.id === paymentData.billId);
    if (!targetBill) {
      addToast('error', 'Associated bill not found.');
      throw new Error('Bill not found');
    }

    if (targetBill.paymentStatus === 'Paid') {
      addToast('warning', 'This bill has already been marked as Paid.');
      throw new Error('This bill has already been paid');
    }

    const paymentId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;
    const txRef = paymentData.transactionReference || `${paymentData.paymentMethod}/TXN-${Date.now().toString().slice(-6)}`;

    const newPayment: Payment = {
      id: `PAY-${Date.now().toString().slice(-5)}`,
      paymentId,
      billId: targetBill.billId,
      customerId: targetBill.customerId,
      customerName: targetBill.customerName,
      amount: paymentData.amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentData.paymentMethod,
      transactionReference: txRef,
      paymentStatus: 'Success',
    };

    // Update bill status to Paid
    setBills(prev =>
      prev.map(b => (b.id === targetBill.id ? { ...b, paymentStatus: 'Paid' } : b))
    );

    // Append to payments list
    setPayments(prev => [newPayment, ...prev]);

    addToast('success', `Payment of ₹${paymentData.amount.toLocaleString('en-IN')} recorded against Bill ${targetBill.billId}.`);
    return newPayment;
  };

  const resetDemoData = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setMeterReadings(INITIAL_READINGS);
    setTariffs(INITIAL_TARIFFS);
    setBills(INITIAL_BILLS);
    setPayments(INITIAL_PAYMENTS);
    localStorage.removeItem('voltflow_customers');
    localStorage.removeItem('voltflow_readings');
    localStorage.removeItem('voltflow_tariffs');
    localStorage.removeItem('voltflow_bills');
    localStorage.removeItem('voltflow_payments');
    addToast('info', 'All demo data has been reset to defaults.');
  };

  // Aggregate stats matching dashboard requirements
  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = bills
    .filter(b => b.paymentStatus !== 'Paid')
    .reduce((acc, b) => acc + b.totalAmount, 0);

  // Blend with sample numbers for large demonstration metrics
  const stats = {
    totalCustomers: 1284 + (customers.length - INITIAL_CUSTOMERS.length),
    billsGenerated: 856 + (bills.length - INITIAL_BILLS.length),
    paymentsCollected: 482650 + (totalPaid - INITIAL_PAYMENTS.reduce((a, b) => a + b.amount, 0)),
    pendingPayments: 76400 + (pendingAmount - 82000),
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        meterReadings,
        tariffs,
        bills,
        payments,
        toasts,
        addToast,
        removeToast,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addMeterReading,
        updateTariff,
        generateBill,
        generateCustomBill,
        recordPayment,
        resetDemoData,
        stats,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
