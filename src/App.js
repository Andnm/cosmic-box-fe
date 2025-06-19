import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/Home";
import Inbox from "./pages/Inbox";
import Archive from "./pages/Archive";
import WriteLetter from "./pages/WriteLetter";
import Auth from "./pages/Auth";
import ConnectPayment from "./pages/ConnectPayment";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPendingLetters from "./pages/admin/AdminPendingLetters";
import AdminAllLetters from "./pages/admin/AdminAllLetters";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminUsers from "./pages/admin/AdminUsers";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import AdminLayout from "./components/common/AdminLayout";

function App() {
  return (
    <Router>
      <div className="App cosmic-bg">
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/auth"
                element={
                  <Layout>
                    <Auth />
                  </Layout>
                }
              />

              {/* User Routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />

              <Route
                path="/inbox"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Inbox />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              <Route
                path="/archive"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Archive />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              <Route
                path="/write"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <WriteLetter />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              <Route
                path="/connect-payment"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <ConnectPayment />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/pending-letters"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminPendingLetters />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/letters"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminAllLetters />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminPayments />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route
                path="*"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
