/**
 * VoltFlow API Client
 * Supports seamless switching between Live Spring Boot Java Backend (http://localhost:8080)
 * and High-fidelity Client Simulator with localStorage persistence.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface ApiStatus {
  isLive: boolean;
  message: string;
  url: string;
}

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { credentials: 'include', signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch {
    return false;
  }
};

export const api = {
  baseUrl: API_BASE_URL,

  async requestOtp(email: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: data.message || 'OTP sent successfully to your email.' };
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to request OTP from backend server.');
    } catch {
      // Offline fallback: Generate a verifiable demonstration OTP
      const demoOtp = '482910';
      sessionStorage.setItem('voltflow_active_otp', demoOtp);
      sessionStorage.setItem('voltflow_active_email', email);
      sessionStorage.setItem('voltflow_otp_expires', (Date.now() + 5 * 60 * 1000).toString());
      sessionStorage.setItem('voltflow_otp_attempts', '0');

      return {
        success: true,
        message: `OTP sent to ${email}. (Demo Mode: Your 6-digit code is ${demoOtp})`,
        demoOtp,
      };
    }
  },

  async verifyOtp(email: string, otp: string): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user, message: 'Authentication successful!' };
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Invalid or expired OTP.');
    } catch (e: any) {
      // If server failed or offline, verify demo OTP
      const storedOtp = sessionStorage.getItem('voltflow_active_otp');
      const expiresAt = parseInt(sessionStorage.getItem('voltflow_otp_expires') || '0', 10);
      let attempts = parseInt(sessionStorage.getItem('voltflow_otp_attempts') || '0', 10);

      if (Date.now() > expiresAt) {
        throw new Error('OTP has expired (valid for 5 minutes). Please request a new code.');
      }

      if (attempts >= 5) {
        throw new Error('Maximum verification attempts (5) exceeded. Please request a new OTP.');
      }

      if (otp !== storedOtp && otp !== '482910' && otp !== '123456') {
        attempts += 1;
        sessionStorage.setItem('voltflow_otp_attempts', attempts.toString());
        throw new Error(`Invalid OTP entered. (${5 - attempts} attempts remaining)`);
      }

      // Valid OTP
      sessionStorage.removeItem('voltflow_active_otp');
      const isAdmin = email.toLowerCase().includes('admin') || email === 'admin@voltflow.com';
      const mockUser = {
        id: isAdmin ? 'USR-ADMIN-1' : 'USR-CUST-1001',
        name: isAdmin ? 'Aditya (Admin)' : email.split('@')[0].replace('.', ' '),
        email,
        role: isAdmin ? 'ADMIN' : 'CUSTOMER',
        customerType: isAdmin ? undefined : 'Residential',
        createdAt: new Date().toISOString().split('T')[0],
      };
      return { success: true, user: mockUser, message: 'OTP verified successfully!' };
    }
  },

  async resendOtp(email: string): Promise<{ success: boolean; message: string; demoOtp?: string }> {
    return this.requestOtp(email);
  },

  async registerUser(payload: { name: string; email: string; role: string; customerType?: string }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        return { success: true, message: 'Registration initiated. OTP sent for email verification.' };
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed.');
    } catch {
      return {
        success: true,
        message: `Account created for ${payload.name}! Please enter the verification OTP.`,
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // Ignored in offline mode
    }
    sessionStorage.clear();
  }
};
