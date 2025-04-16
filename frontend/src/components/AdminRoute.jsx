// src/components/AdminRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

export default function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user?.roles?.includes('admin')) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
}