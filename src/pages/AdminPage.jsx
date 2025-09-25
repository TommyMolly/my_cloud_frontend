import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser, toggleAdmin } from "../api/usersApi";
import StoragePage from "./StoragePage";

export default function AdminPage({ user }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetchUsers();
      if (res.status === 200) setUsers(res.data);
      else setMessage("Не удалось загрузить пользователей");
    } catch (err) {
      setMessage("Ошибка при загрузке пользователей");
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Удалить пользователя?")) return;
    try {
      const res = await deleteUser(userId);
      if (res.status === 204) {
        setMessage("Пользователь удалён");
        loadUsers();
      } else setMessage("Ошибка при удалении");
    } catch (err) {
      setMessage("Ошибка при удалении");
      console.error(err);
    }
  };

  const handleToggleAdmin = async (user) => {
    try {
      const res = await toggleAdmin(user.id, user.is_admin);
      if (res.status === 200) {
        setMessage("Права администратора изменены");
        loadUsers();
      } else if (res.status === 403) setMessage("Нет прав для изменения");
      else setMessage("Ошибка при изменении прав администратора");
    } catch (err) {
      setMessage("Ошибка при изменении прав администратора");
      console.error(err);
    }
  };

  const handleManageFiles = (userId) => setSelectedUserId(userId);

  return (
    <div>
      <h1>Административная страница</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}

      {!selectedUserId ? (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
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
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.full_name}</td>
                <td>{u.email}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={u.is_admin}
                    onChange={() => handleToggleAdmin(u)}
                  />
                </td>
                <td>
                  {(u.storage_file_count || 0)} файлов / {(u.storage_total_size || 0)} B{" "}
                  <button onClick={() => handleManageFiles(u.id)}>Управлять</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(u.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <button onClick={() => setSelectedUserId(null)}>Назад к списку пользователей</button>
          <StoragePage user={user} userId={selectedUserId} />
        </>
      )}
    </div>
  );
}
