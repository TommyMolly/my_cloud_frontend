import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/usersApi";
import { validateUsername, validateEmail, validatePassword } from "../utils/validator";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastProvider";
import "../styles/auth.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      setLoading(false);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const { status, data } = await registerUser({
        username: username.trim(),
        full_name: fullname.trim(),
        email: email.trim(),
        password,
      });

      if (status !== 201) {
        const serverMsg =
          data?.username?.[0] || data?.email?.[0] || data?.detail || "Попробуйте снова";
        setError("Ошибка при регистрации: " + serverMsg);
        return;
      }

      showToast("Регистрация успешна! Войдите через логин.", "success");

      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Ошибка при регистрации:", err);
      setError("Ошибка сети. Попробуйте снова");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Полное имя"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <small>Пароль должен содержать строчную, заглавную букву и символ (!, @, # и т.д.)</small>
        <button type="submit" disabled={loading}>
          {loading ? "Регистрируем..." : "Зарегистрироваться"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
