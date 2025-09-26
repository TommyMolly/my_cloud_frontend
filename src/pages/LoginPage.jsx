import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/usersApi";

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

      // Сохраняем токены и роль
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_role", isAdmin ? "admin" : "user");

      // Обновляем состояние пользователя
      setUser({
        token: accessToken,
        isAdmin,
      });

      // Переходим на нужную страницу
      navigate(isAdmin ? "/admin" : "/storage");
    } catch (err) {
      console.error("Ошибка при логине:", err);
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">Войти</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
