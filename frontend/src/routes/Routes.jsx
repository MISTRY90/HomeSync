// src/routes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@components/ProtectedRoute";
import AdminRoute from "@components/AdminRoute";
import {
  LandingPage,
  HouseSetupPage,
  Login,
  Register,
  Dashboard,
  Devices,
  EnergyAnalytics,
  RoomsPage,
  AutomationPage,
  AdminPage,
  SettingsPage,
  ErrorPage,
} from "@pages";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/setup-house" element={<HouseSetupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/analytics" element={<EnergyAnalytics />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/automations" element={<AutomationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      {/* Admin-only Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
