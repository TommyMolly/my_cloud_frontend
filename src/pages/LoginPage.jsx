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
    try {
      const response = await loginUser({ username, password });

      console.log("DEBUG login response =", response);

      // Проверяем структуру ответа
      const accessToken = response.data?.access;
      const refreshToken = response.data?.refresh;

      if (!accessToken || !refreshToken) {
        setError("Сервер не вернул токены");
        console.error("Ответ сервера не содержит access или refresh:", response.data);
        return;
      }

      // Сохраняем токены в localStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      console.log("DEBUG: токены сохранены в localStorage");
      console.log("access_token =", localStorage.getItem("access_token"));
      console.log("refresh_token =", localStorage.getItem("refresh_token"));

      // Получаем роль с бэка
      const role = response.data.is_admin ? "admin" : "user";
      localStorage.setItem("user_role", role);

      setUser({
        token: accessToken,
        isAdmin: response.data.is_admin,
      });

      navigate(role === "admin" ? "/admin" : "/storage");
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

