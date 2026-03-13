import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { UserRole } from "./backend";
import Layout from "./components/Layout";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import OrdersPage from "./pages/OrdersPage";
import ServicesPage from "./pages/ServicesPage";
import SupportPage from "./pages/SupportPage";
import WalletPage from "./pages/WalletPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminServicesPage from "./pages/admin/AdminServicesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminWalletPage from "./pages/admin/AdminWalletPage";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing } = useInternetIdentity();
  if (isInitializing)
    return (
      <div className="flex h-screen items-center justify-center bg-[#070d1f]">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          data-ocid="app.loading_state"
        />
      </div>
    );
  if (!identity || identity.getPrincipal().isAnonymous())
    return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { actor } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    if (actor) actor.isCallerAdmin().then(setIsAdmin);
  }, [actor]);
  if (isAdmin === null)
    return (
      <div className="flex h-screen items-center justify-center bg-[#070d1f]">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          data-ocid="admin.loading_state"
        />
      </div>
    );
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboardPage />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminGuard>
                <AdminServicesPage />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminGuard>
                <AdminOrdersPage />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/wallet"
            element={
              <AdminGuard>
                <AdminWalletPage />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminGuard>
                <AdminUsersPage />
              </AdminGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
