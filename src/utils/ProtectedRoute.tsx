import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    if (location.pathname !== '/auth') {
      return <Navigate to="/auth" replace state={{ from: location }} />;
    }
  }
  return <Outlet />;
}