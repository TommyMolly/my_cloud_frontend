import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/usersApi";
import { validateUsername, validateEmail, validatePassword } from "../utils/validator";

export default function RegisterPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Валидация
    const usernameError = validateUsername(username);
    if (usernameError) return setError(usernameError);

    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) return setError(passwordError);

    try {
      const data = await registerUser({
        username: username.trim(),
        full_name: fullname.trim(),
        email: email.trim(),
        password,
      });

      alert("Регистрация успешна! Войдите через логин.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.username?.[0] || "Попробуйте снова";
      setError("Ошибка при регистрации: " + serverMsg);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
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
          type="text"
          placeholder="Полное имя"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <small>Пароль должен содержать строчную, заглавную букву и символ (!, @, # и т.д.)</small>
        <br />
        <button type="submit">Зарегистрироваться</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
