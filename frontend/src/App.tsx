import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Shell } from './components/layout/Shell';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { MeterReadings } from './pages/MeterReadings';
import { Bills } from './pages/Bills';
import { Payments } from './pages/Payments';
import { Tariffs } from './pages/Tariffs';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { SystemArchitecture } from './pages/SystemArchitecture';
import { Settings } from './pages/Settings';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { OtpVerificationPage } from './pages/auth/OtpVerificationPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AuthSuccessPage } from './pages/auth/AuthSuccessPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// 404 Fallback
const NotFoundPage = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
    <div className="text-6xl font-black text-emerald-600 mb-2">404</div>
    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Route Not Found</h2>
    <p className="text-xs text-slate-500 mt-1 max-w-sm">
      The requested page does not exist or has been relocated in the VoltFlow management system.
    </p>
    <a
      href="/"
      className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
    >
      Return to Dashboard
    </a>
  </div>
);

export function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Authentication Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify" element={<OtpVerificationPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth-success" element={<AuthSuccessPage />} />

              {/* Protected Management Shell */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Shell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="customers" element={<Customers />} />
                <Route path="meter-readings" element={<MeterReadings />} />
                <Route path="bills" element={<Bills />} />
                <Route path="payments" element={<Payments />} />
                <Route path="tariffs" element={<Tariffs />} />
                <Route path="analytics" element={<ReportsAnalytics />} />
                <Route path="architecture" element={<SystemArchitecture />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
