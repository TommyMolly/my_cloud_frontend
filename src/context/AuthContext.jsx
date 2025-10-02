import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { refreshAccessToken } from "../api/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); 

  // Инициализация из localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const isAdminStored = localStorage.getItem("is_admin") === "true";
    if (token) setUser({ token, isAdmin: isAdminStored });
    else setUser(null);
  }, []);

  // Автообновление токена каждые 4 минуты
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      const newToken = await refreshAccessToken();
      if (newToken) {
        localStorage.setItem("access_token", newToken);
        setUser(prev => (prev ? { ...prev, token: newToken } : prev));
      } else {
        handleLogout();
      }
    }, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogin = ({ token, isAdmin }) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("is_admin", isAdmin);
    setUser({ token, isAdmin });
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("is_admin");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
