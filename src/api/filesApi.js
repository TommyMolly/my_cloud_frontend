import { authFetch } from "./auth";

const BASE_URL = "/api/files";

// Получить список файлов
export const fetchFiles = async (userId = null) => {
  try {
    const url = userId ? `${BASE_URL}/?user_id=${userId}` : `${BASE_URL}/`;
    const res = await authFetch(url);
    const data = await res.json();
    if (!res.ok) throw data;
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

// Загрузить файл
export const uploadFile = async (file, comment = "", userId = null) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("comment", comment);

    
    const url = userId ? `${BASE_URL}/?user_id=${userId}` : `${BASE_URL}/`;

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
    if (!res.ok) throw data;
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

// Удалить файл
export const deleteFile = async (fileId) => {
  try {
    const res = await authFetch(`${BASE_URL}/${fileId}/`, {
      method: "DELETE",
    });
    if (res.status === 204) return { status: res.status };
    const data = await res.json();
    throw data;
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

// Переименовать файл
export const renameFile = async (fileId, newName) => {
  try {
    // Предпочтительно REST: PATCH /files/{id}
    let res = await authFetch(`${BASE_URL}/${fileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.status === 404) {
      // Fallback на legacy
      res = await authFetch(`${BASE_URL}/${fileId}/rename/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
    }
    const data = await res.json();
    if (!res.ok) throw data;
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

// Обновить комментарий
export const updateComment = async (fileId, comment) => {
  try {
    // Предпочтительно REST: PATCH /files/{id}
    let res = await authFetch(`${BASE_URL}/${fileId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment }),
    });
    if (res.status === 404) {
      // Fallback на legacy
      res = await authFetch(`${BASE_URL}/${fileId}/comment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      });
    }
    const data = await res.json();
    if (!res.ok) throw data;
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

// Получить ссылку для шаринга
export const getShareLink = async (fileId) => {
  try {
    const res = await authFetch(`${BASE_URL}/shared/${fileId}/`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

// Получить файл по публичной ссылке
export const fetchSharedFile = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/shared/${token}/`);
    const data = await res.json();
    if (!res.ok) throw data;
    return { status: res.status, data };
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

// Получить содержимое текстового файла (.txt/.csv/.json)
export const fetchFileContent = async (fileId) => {
  try {
    const res = await authFetch(`/api/files/${fileId}/content/`);
    if (!res.ok) throw { error: "Не удалось загрузить содержимое файла" };
    const text = await res.text();
    return { status: res.status, data: { content: text } };
  } catch (err) {
    return { status: 0, data: { error: err.error || "Ошибка сети" } };
  }
};

