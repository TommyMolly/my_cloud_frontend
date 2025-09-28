import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/usersApi";
import "../styles/auth.css";

export default function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await loginUser({ username, password });

      const accessToken = response.data?.access;
      const refreshToken = response.data?.refresh;

      if (!accessToken || !refreshToken) {
        setError("Пользователь не найден");
        return;
      }

      const isAdmin = username === "admin" || username === "tommy";

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_role", isAdmin ? "admin" : "user");

      setUser({
        token: accessToken,
        isAdmin,
      });

      navigate(isAdmin ? "/admin" : "/storage");
    } catch (err) {
      console.error("Ошибка при логине:", err);
      setError("Неверный логин или пароль");
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
        <button type="submit">Войти</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
