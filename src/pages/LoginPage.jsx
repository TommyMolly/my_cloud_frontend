import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/usersApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastProvider";
import "../styles/auth.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuth(); 
  const { showToast } = useToast(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { status, data } = await loginUser({ username, password });
      const accessToken = data?.access;
      const refreshToken = data?.refresh;
      const isAdmin = !!data?.is_admin;

      if (status !== 200 || !accessToken || !refreshToken) {
        showToast(data?.detail || "Неверный логин или пароль", "error");
        return;
      }

      
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("is_admin", isAdmin);

      
      setUser({ token: accessToken, isAdmin });

      showToast("Вход успешен!", "success");

      
      navigate(isAdmin ? "/admin" : "/storage", { replace: true });
    } catch (err) {
      console.error("Ошибка при логине:", err);
      showToast("Ошибка сети. Попробуйте снова", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
