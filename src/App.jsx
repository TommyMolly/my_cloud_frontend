import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import Header from "./components/Header";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ToastProvider from "./context/ToastProvider"; 

// Lazy-load страниц
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const StoragePage = lazy(() => import("./pages/StoragePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Защищённые маршруты
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/" replace />;
}

// Маршрут для просмотра файлов конкретного пользователя (админ)
function AdminUserFilesRoute() {
  const { id } = useParams();
  const userId = Number(id);
  return <StoragePage userId={Number.isFinite(userId) ? userId : null} />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main style={{ padding: "20px" }}>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/login"
              element={
                user ? <Navigate to={user.isAdmin ? "/admin" : "/storage"} replace /> : <LoginPage />
              }
            />
            <Route
              path="/register"
              element={
                user ? <Navigate to={user.isAdmin ? "/admin" : "/storage"} replace /> : <RegisterPage />
              }
            />

            <Route
              path="/storage"
              element={
                <ProtectedRoute>
                  <StoragePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/users/:id/files"
              element={
                <AdminRoute>
                  <AdminUserFilesRoute />
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}
