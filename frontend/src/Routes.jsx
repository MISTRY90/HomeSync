// src/Routes.jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
// import Layout from '@components/Layout'
import Login from '@pages/Login'
import Register from '@pages/Register'
import Dashboard from '@pages/Dashboard'
import Devices from '@pages/Devices'
import EnergyAnalytics from '@pages/EnergyAnalytics'
import ErrorPage from '@pages/ErrorPage'

// ===================== Route Guards =====================
const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth)

  return user ? (
    // <Layout>
      <Outlet /> 
    // </Layout>
  ) : (
    <Navigate to="/login" replace />
  )
}

const UnauthenticatedRoute = () => {
  const { user } = useSelector((state) => state.auth)

  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />
}

// ===================== Main Router Configuration =====================
const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate
            replace
            to={useSelector((state) => (state.auth.user ? '/dashboard' : '/login'))}
          />
        }
      />

      {/* Unauthenticated routes */}
      <Route element={<UnauthenticatedRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/energy" element={<EnergyAnalytics />} />
        
        {/* Admin-only routes */}
        <Route path="/admin" element={<AdminRouteGuard />}>
          <Route path="users" element={<UserManagement />} />
          <Route path="roles" element={<RoleManagement />} />
        </Route>
      </Route>

      {/* Error handling */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

// ===================== Additional Guard for Admin Routes =====================
const AdminRouteGuard = () => {
  const { isAdmin } = useSelector((state) => state.auth)
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}

export default AppRoutes