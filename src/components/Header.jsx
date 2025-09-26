import React from "react";
import { NavLink } from "react-router-dom";

export default function Header({ user, onLogout }) {
  const linkStyle = {
    margin: "0 10px",
    textDecoration: "none",
    color: "#007bff",
    transition: "color 0.2s",
  };

  const activeLinkStyle = {
    fontWeight: "bold",
    color: "#0056b3",
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    color: "#007bff",
    cursor: "pointer",
    textDecoration: "underline",
    margin: "0 10px",
    transition: "color 0.2s",
  };

  const handleMouseEnter = (e) => e.target.style.color = "#0056b3";
  const handleMouseLeave = (e) => e.target.style.color = "#007bff";

  return (
    <header style={{
      padding: "10px 20px",
      borderBottom: "1px solid #ccc",
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f9f9f9"
    }}>
      <NavLink to="/" style={linkStyle} activeStyle={activeLinkStyle}>Главная</NavLink>

      {user ? (
        <>
          <NavLink to="/storage" style={linkStyle} activeStyle={activeLinkStyle}>Хранилище</NavLink>
          {user.isAdmin && (
            <NavLink to="/admin" style={linkStyle} activeStyle={activeLinkStyle}>Админка</NavLink>
          )}
          <button
            onClick={onLogout}
            style={buttonStyle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Выход
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" style={linkStyle} activeStyle={activeLinkStyle}>Вход</NavLink>
          <NavLink to="/register" style={linkStyle} activeStyle={activeLinkStyle}>Регистрация</NavLink>
        </>
      )}
    </header>
  );
}
