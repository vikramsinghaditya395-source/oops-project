export type CustomerType = 'Residential' | 'Commercial';
export type AccountStatus = 'Active' | 'Inactive';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';
export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface Customer {
  id: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  customerType: CustomerType;
  meterNumber: string;
  connectionDate: string;
  accountStatus: AccountStatus;
  sanctionedLoadKw?: number;
}

export interface MeterReading {
  id: string;
  meterNumber: string;
  customerId: string;
  customerName: string;
  previousReading: number; // kWh
  currentReading: number;  // kWh
  unitsConsumed: number;   // Calculated: current - previous
  readingDate: string;
  status: 'Verified' | 'Pending Review' | 'Flagged';
  notes?: string;
}

export interface Tariff {
  id: string;
  customerType: CustomerType;
  ratePerUnit: number; // ₹ per kWh
  fixedMonthlyCharge: number; // ₹
  surchargePercent: number; // % e.g., 5%
  effectiveDate: string;
  description: string;
}

export interface Bill {
  id: string;
  billId: string;
  customerId: string;
  customerName: string;
  customerType: CustomerType;
  meterNumber: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  energyCharge: number;
  fixedCharge: number;
  surchargeAmount: number;
  totalAmount: number;
  billDate: string;
  dueDate: string;
  paymentStatus: PaymentStatus;
}

export interface Payment {
  id: string;
  paymentId: string;
  billId: string;
  customerId: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  paymentStatus: 'Success' | 'Failed' | 'Pending';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  customerType?: CustomerType;
  meterNumber?: string;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
}
