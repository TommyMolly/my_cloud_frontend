import { authFetch } from "./auth";

const BASE_URL = "/api";

// Получить список файлов
export const fetchFiles = async (userId = null) => {
  const url = userId ? `${BASE_URL}/files/?user_id=${userId}` : `${BASE_URL}/files/`;
  const res = await authFetch(url);
  const data = await res.json();
  return { status: res.status, data };
};

// Загрузить файл
export const uploadFile = async (file, comment = "", userId = null) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("comment", comment);

  const url = userId
    ? `${BASE_URL}/files/upload/?user_id=${userId}`
    : `${BASE_URL}/files/upload/`;

  const res = await authFetch(url, {
    method: "POST",
    body: formData,
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  return { status: res.status, data };
};

// Удалить файл
export const deleteFile = async (fileId) => {
  const res = await authFetch(`${BASE_URL}/files/${fileId}/`, {
    method: "DELETE",
  });
  return { status: res.status };
};

// Переименовать файл
export const renameFile = async (fileId, newName) => {
  const res = await authFetch(`${BASE_URL}/files/${fileId}/rename/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName }),
  });
  const data = await res.json();
  return { status: res.status, data };
};

// Обновить комментарий
export const updateComment = async (fileId, comment) => {
  const res = await authFetch(`${BASE_URL}/files/${fileId}/comment/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  const data = await res.json();
  return { status: res.status, data };
};

// Получить ссылку для шаринга
export const getShareLink = async (fileId) => {
  const res = await authFetch(`${BASE_URL}/files/shared/${fileId}/`, {
    method: "POST",
  });
  const data = await res.json();
  return { status: res.status, data };
};
