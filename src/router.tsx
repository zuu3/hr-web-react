import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { WorkLog } from './pages/WorkLog';
import { Expense } from './pages/Expense';
import { Mileage } from './pages/Mileage';
import { useAuthStore } from './store/authStore';
import type { ReactNode } from 'react';

const Guard = ({ children }: { children: ReactNode }) => {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Guard><Layout /></Guard>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'attendance', element: <Attendance /> },
      { path: 'work-log', element: <WorkLog /> },
      { path: 'expense', element: <Expense /> },
      { path: 'mileage', element: <Mileage /> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
