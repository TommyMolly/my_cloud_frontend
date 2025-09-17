import React from "react";
import { Link } from "react-router-dom";

export default function Header({ user, onLogout }) {
  return (
    <header style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Главная</Link> |{" "}
      {user ? (
        <>
          <Link to="/storage">Хранилище</Link> |{" "}
          {user.isAdmin && <Link to="/admin">Админка</Link>} |{" "}
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Выход
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Вход</Link> | <Link to="/register">Регистрация</Link>
        </>
      )}
    </header>
  );
}
