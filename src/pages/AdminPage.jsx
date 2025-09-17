import React, { useState } from "react";
import AdminPanel from "../components/AdminPanel";
import StoragePage from "./StoragePage";

export default function AdminPage({ user }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Функция для выбора пользователя из панели администратора
  const handleManageFiles = (userId) => {
    setSelectedUserId(userId);
  };

  return (
    <div>
      <h1>Административная страница</h1>
      
      {!selectedUserId && (
        <AdminPanel onManageFiles={handleManageFiles} />
      )}

      {selectedUserId && (
        <>
          <button onClick={() => setSelectedUserId(null)}>
            Назад к списку пользователей
          </button>
          <StoragePage user={user} userId={selectedUserId} />
        </>
      )}
    </div>
  );
}
