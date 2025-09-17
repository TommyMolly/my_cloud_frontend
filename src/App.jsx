import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StoragePage from "./pages/StoragePage";
import AdminPage from "./pages/AdminPage";

function App() {
  const [user, setUser] = useState(null);

  // Загружаем пользователя
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const role = localStorage.getItem("user_role");
    if (token) {
      setUser({
        token,
        isAdmin: role === "admin",
      });
    }
  }, []);

  // Выход
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />

      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Авторизация */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <RegisterPage setUser={setUser} />}
          />

          {/* Хранилище файлов */}
          <Route
            path="/storage"
            element={user ? <StoragePage user={user} /> : <Navigate to="/login" />}
          />

          {/* Админка */}
          <Route
            path="/admin"
            element={
              user && user.isAdmin ? <AdminPage user={user} /> : <Navigate to="/" />
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
