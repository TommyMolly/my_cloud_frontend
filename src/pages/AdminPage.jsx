import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser, toggleAdmin } from "../api/usersApi";
import StoragePage from "./StoragePage";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastProvider";
import "../styles/admin.css";

export default function AdminPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    else loadUsers();
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetchUsers();
      if (res.status === 200) setUsers(res.data);
      else if (res.status === 401) navigate("/login", { replace: true });
      else showToast(res.data?.error || "Не удалось загрузить пользователей", "error");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при загрузке пользователей", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      setDeletingId(userId);
      const res = await deleteUser(userId);
      if (res.status === 204) {
        showToast("Пользователь удалён", "success");
        loadUsers();
      } else showToast("Ошибка при удалении", "error");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при удалении", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleAdmin = async (u) => {
    try {
      setTogglingId(u.id);
      const res = await toggleAdmin(u.id, u.is_admin);
      if (res.status === 200) {
        showToast("Права администратора изменены", "success");
        loadUsers();
      } else if (res.status === 403) showToast("Нет прав для изменения", "error");
      else showToast("Ошибка при изменении прав администратора", "error");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при изменении прав администратора", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const handleManageFiles = (userId) => setSelectedUserId(userId);

  if (!user) return null;

  return (
    <div className="admin-container">
      <h1>Административная страница</h1>

      {!selectedUserId ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Логин</th>
                <th>Полное имя</th>
                <th>Email</th>
                <th>Админ</th>
                <th>Файловое хранилище</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={u.is_admin}
                      onChange={() => handleToggleAdmin(u)}
                      disabled={togglingId === u.id}
                    />
                  </td>
                  <td>
                    {(u.storage_file_count || 0)} файлов / {(u.storage_total_size || 0)} B{" "}
                    <button onClick={() => handleManageFiles(u.id)}>Управлять</button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={deletingId === u.id}
                    >
                      {deletingId === u.id ? "Удаляю..." : "Удалить"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loadingUsers && <p style={{ textAlign: "center" }}>Загрузка пользователей...</p>}
        </>
      ) : (
        <>
          <button onClick={() => setSelectedUserId(null)}>Назад к списку пользователей</button>
          <StoragePage userId={selectedUserId} />
        </>
      )}
    </div>
  );
}
