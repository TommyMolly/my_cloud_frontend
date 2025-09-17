const BASE_URL = "/api";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  "Content-Type": "application/json",
});

// Регистрация
export const registerUser = async (userData) => {
  console.log("registerUser payload:", userData); // debug
  const res = await fetch(`${BASE_URL}/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  console.log("Ответ сервера:", res);
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
  const res = await fetch(`${BASE_URL}/accounts/users/`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  return { status: res.status, data };
};

// Удалить пользователя (только для админа)
export const deleteUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/accounts/${userId}/delete/`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return { status: res.status };
};

// Изменить роль пользователя (только для админа)
export const toggleAdmin = async (userId, isAdmin) => {
  const res = await fetch(`${BASE_URL}/accounts/${userId}/update_admin/`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ is_admin: !isAdmin }),
  });

  if (!res.ok) throw new Error("Ошибка обновления роли");
  const data = await res.json();
  return { status: res.status, data };
};
