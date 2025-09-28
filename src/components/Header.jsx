import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/header.css"; 

export default function Header({ user, onLogout }) {
  return (
    <header className="header">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Главная</NavLink>

      {user ? (
        <>
          <NavLink to="/storage" className={({ isActive }) => isActive ? "active" : ""}>Хранилище</NavLink>
          {user.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? "active" : ""}>Админка</NavLink>
          )}
          <button onClick={onLogout}>Выход</button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Вход</NavLink>
          <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Регистрация</NavLink>
        </>
      )}
    </header>
  );
}
