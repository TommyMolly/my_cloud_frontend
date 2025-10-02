import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <header className="header">
      {/* Ссылка "Главная" только для гостей */}
      {!user && (
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Главная
        </NavLink>
      )}

      {user ? (
        <>
          <NavLink to="/storage" className={({ isActive }) => (isActive ? "active" : "")}>
            Хранилище
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? "active" : "")}>
              Админка
            </NavLink>
          )}
          <button onClick={logout}>Выход</button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")}>
            Вход
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")}>
            Регистрация
          </NavLink>
        </>
      )}
    </header>
  );
}
