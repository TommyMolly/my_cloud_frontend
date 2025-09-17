import React, { useState } from "react";
import { validateUsername, validateEmail, validatePassword } from "../utils/validator";
import { registerUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // Валидация фронтенд
    const errs = {
      username: validateUsername(username),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(errs);

    if (Object.values(errs).some(Boolean)) return;

    try {
      console.log("Отправка данных на сервер...", { username, full_name: fullName, email, password });
      const res = await registerUser({ username, full_name: fullName, email, password });
      console.log("Ответ registerUser:", res);

      if (res.status === 201) {
        alert("Регистрация успешна!");
        navigate("/login");
      } else {
        const msg = res.data.username
          ? `Логин занят: ${res.data.username.join(", ")}`
          : JSON.stringify(res.data);
        setServerError(msg);
      }
    } catch (err) {
      console.error("Ошибка при регистрации:", err);
      setServerError("Ошибка соединения с сервером");
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин:</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="4–20 латинских символов, первая буква — буква"
          />
          {errors.username && <div style={{ color: "red" }}>{errors.username}</div>}
        </div>

        <div>
          <label>Полное имя:</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="ФИО"
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </div>

        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 6 символов, 1 заглавная, 1 цифра, 1 спецсимвол"
          />
          {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}
        </div>

        <button type="submit">Зарегистрироваться</button>
        {serverError && <div style={{ color: "red", marginTop: "10px" }}>{serverError}</div>}
      </form>
    </div>
  );
}
