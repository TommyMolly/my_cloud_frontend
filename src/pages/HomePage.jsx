import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>Добро пожаловать в My Cloud Storage!</h1>
      <p>Здесь вы можете хранить свои файлы, делиться ими и управлять хранилищем.</p>
      <p>
        <Link to="/register">Регистрация</Link> или <Link to="/login">Вход</Link>
      </p>
    </div>
  );
}
