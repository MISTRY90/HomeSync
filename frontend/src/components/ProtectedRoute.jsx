// src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation , Outlet} from 'react-router-dom';

export default function ProtectedRoute( ) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet/>;
}   