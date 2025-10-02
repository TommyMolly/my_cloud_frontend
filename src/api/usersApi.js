import { authFetch } from "./auth";

const BASE_URL = "/api";

// Регистрация
export const registerUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  return { status: res.status, data };
};

// Логин
export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/accounts/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const data = await res.json();
  return { status: res.status, data };
};

// Получить список пользователей (только для админа)
export const fetchUsers = async () => {
  const res = await authFetch(`${BASE_URL}/accounts/users/`);
  const data = await res.json();
  return { status: res.status, data };
};

// Удалить пользователя (только для админа)
export const deleteUser = async (userId) => {
  // REST: DELETE /api/accounts/users/{id}/
  const res = await authFetch(`${BASE_URL}/accounts/users/${userId}/`, {
    method: "DELETE",
  });
  return { status: res.status };
};

// Изменить роль пользователя (только для админа)
export const toggleAdmin = async (userId, isAdmin) => {
  // REST: PATCH /api/accounts/users/{id}/  { is_admin }
  const res = await authFetch(`${BASE_URL}/accounts/users/${userId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_admin: !isAdmin }),
  });
  const data = await res.json();
  return { status: res.status, data };
};
