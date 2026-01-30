import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import type { UserRole } from '../features/auth/authSlice';

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: Extract<UserRole, 'user' | 'admin'>;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAppSelector((s) => s.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

