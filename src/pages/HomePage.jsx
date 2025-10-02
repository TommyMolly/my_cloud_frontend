import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastProvider";
import "../styles/global.css";

export default function HomePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      showToast(`Вы уже вошли как ${user.isAdmin ? "админ" : "пользователь"}`, "info");
      navigate(user.isAdmin ? "/admin" : "/storage", { replace: true });
    }
  }, [user, navigate, showToast]);

  return (
    <div className="home-container">
      <h1>Добро пожаловать в My Cloud Storage!</h1>
      <p>Здесь вы можете хранить свои файлы, делиться ими и управлять хранилищем.</p>
      {!user && (
        <p>
          <Link to="/register">Регистрация</Link> или <Link to="/login">Вход</Link>
        </p>
      )}
    </div>
  );
}

