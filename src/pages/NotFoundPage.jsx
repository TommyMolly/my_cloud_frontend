import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";

export default function NotFoundPage() {
  return (
    <div className="home-container">
      <h2>404 — Страница не найдена</h2>
      <p>Похоже, вы перешли по неверному адресу.</p>
      <Link to="/">На главную</Link>
    </div>
  );
}


