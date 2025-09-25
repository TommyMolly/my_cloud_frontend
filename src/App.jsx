import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StoragePage from "./pages/StoragePage";
import AdminPage from "./pages/AdminPage";
import { refreshAccessToken } from "./api/auth"; 

// Защищённый маршрут для авторизованных пользователей
function ProtectedRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

// Защищённый маршрут для админов
function AdminRoute({ user, children }) {
  return user && user.isAdmin ? children : <Navigate to="/" />;
}

function App() {
  const [user, setUser] = useState(undefined); // undefined = ещё не загружен

  // Загружаем пользователя из localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    if (token) {
      setUser({
        token,
        isAdmin: role === "admin", 
      });
    } else {
      setUser(null);
    }
  }, []);

  // Автообновление токена каждые 4 минуты
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        console.warn("Не удалось обновить токен → разлогиниваем");
        handleLogout();
      }
    }, 4 * 60 * 1000); // каждые 4 минуты

    return () => clearInterval(interval);
  }, [user]);

  // Выход
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    setUser(null);
  };

  // Пока пользователь загружается, ничего не рендерим
  if (user === undefined) return null;

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Авторизация */}
          <Route
            path="/login"
            element={user ? <Navigate to={user.isAdmin ? "/admin" : "/storage"} /> : <LoginPage setUser={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={user.isAdmin ? "/admin" : "/storage"} /> : <RegisterPage setUser={setUser} />}
          />

          {/* Хранилище файлов (только авторизованные) */}
          <Route
            path="/storage"
            element={
              <ProtectedRoute user={user}>
                <StoragePage user={user} />
              </ProtectedRoute>
            }
          />

          {/* Админка (только админ) */}
          <Route
            path="/admin"
            element={
              <AdminRoute user={user}>
                <AdminPage user={user} />
              </AdminRoute>
            }
          />

          {/* Любой несуществующий путь */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
