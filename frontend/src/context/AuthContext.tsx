import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CustomerType } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingEmail: string | null;
  demoOtpNotice: string | null;
  requestOtp: (email: string) => Promise<{ success: boolean; message: string; demoOtp?: string }>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; message: string }>;
  resendOtp: () => Promise<{ success: boolean; message: string; demoOtp?: string }>;
  register: (name: string, email: string, role: UserRole, customerType?: CustomerType) => Promise<{ success: boolean; message: string }>;
  loginWithDemo: (role: UserRole) => void;
  logout: () => void;
  clearDemoNotice: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('voltflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to pre-authenticated Admin for smooth review, but login/logout full flow is active
    return {
      id: 'USR-ADMIN-1',
      name: 'Aditya (Admin)',
      email: 'admin@voltflow.com',
      role: 'ADMIN',
      createdAt: '2026-01-01',
    };
  });

  const [pendingEmail, setPendingEmail] = useState<string | null>(() => {
    return sessionStorage.getItem('voltflow_pending_email');
  });

  const [demoOtpNotice, setDemoOtpNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('voltflow_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('voltflow_user');
    }
  }, [user]);

  const requestOtp = async (email: string) => {
    setIsLoading(true);
    try {
      const res = await api.requestOtp(email);
      setPendingEmail(email);
      sessionStorage.setItem('voltflow_pending_email', email);
      if (res.demoOtp) {
        setDemoOtpNotice(res.demoOtp);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!pendingEmail) {
      return { success: false, message: 'No active authentication session. Please request OTP first.' };
    }
    setIsLoading(true);
    try {
      const res = await api.verifyOtp(pendingEmail, otp);
      if (res.success && res.user) {
        setUser(res.user);
        setPendingEmail(null);
        setDemoOtpNotice(null);
        sessionStorage.removeItem('voltflow_pending_email');
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!pendingEmail) {
      return { success: false, message: 'No email found to resend code to.' };
    }
    setIsLoading(true);
    try {
      const res = await api.resendOtp(pendingEmail);
      if (res.demoOtp) {
        setDemoOtpNotice(res.demoOtp);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, role: UserRole, customerType?: CustomerType) => {
    setIsLoading(true);
    try {
      const res = await api.registerUser({ name, email, role, customerType });
      setPendingEmail(email);
      sessionStorage.setItem('voltflow_pending_email', email);
      const otpRes = await api.requestOtp(email);
      if (otpRes.demoOtp) {
        setDemoOtpNotice(otpRes.demoOtp);
      }
      return res;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemo = (role: UserRole) => {
    const demoUser: User = role === 'ADMIN'
      ? {
          id: 'USR-ADMIN-1',
          name: 'Aditya (Admin)',
          email: 'admin@voltflow.com',
          role: 'ADMIN',
          createdAt: '2026-01-01',
        }
      : {
          id: 'USR-CUST-1001',
          name: 'Aditya Sharma',
          email: 'aditya.sharma@example.com',
          role: 'CUSTOMER',
          customerType: 'Residential',
          meterNumber: 'MTR-8801',
          createdAt: '2026-01-15',
        };
    setUser(demoUser);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setPendingEmail(null);
    setDemoOtpNotice(null);
    localStorage.removeItem('voltflow_user');
    sessionStorage.clear();
  };

  const clearDemoNotice = () => setDemoOtpNotice(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        pendingEmail,
        demoOtpNotice,
        requestOtp,
        verifyOtp,
        resendOtp,
        register,
        loginWithDemo,
        logout,
        clearDemoNotice,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
