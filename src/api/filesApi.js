const BASE_URL = "/api";

// Получаем заголовки с токеном
const getHeaders = (isJson = true) => {
  const token = localStorage.getItem("access_token");
  console.log("DEBUG: токен из localStorage =", token);

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (isJson) headers["Content-Type"] = "application/json";
  return headers;
};

// Получить список файлов
export const fetchFiles = async (userId = null) => {
  const url = userId ? `${BASE_URL}/files/?user_id=${userId}` : `${BASE_URL}/files/`;
  const res = await fetch(url, { headers: getHeaders() });
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

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
    body: formData,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    console.error("Ошибка парсинга ответа:", e);
  }

  console.log("DEBUG upload response =", res.status, data);
  return { status: res.status, data };
};

// Удалить файл
export const deleteFile = async (fileId) => {
  const res = await fetch(`${BASE_URL}/files/${fileId}/`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return { status: res.status };
};


// Переименовать файл
export const renameFile = async (fileId, newName) => {
  const token = localStorage.getItem("access_token");
  const res = await fetch(`/api/files/${fileId}/rename/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ name: newName }),
  });

  const data = await res.json();
  return { status: res.status, data };
};

// Обновить комментарий
export const updateComment = async (fileId, comment) => {
  const res = await fetch(`${BASE_URL}/files/${fileId}/comment/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ comment }),
  });
  const data = await res.json();
  return { status: res.status, data };
};

// Получить ссылку для шаринга
export const getShareLink = async (fileId) => {
  const res = await fetch(`${BASE_URL}/files/shared/${fileId}/`, {
    method: "POST",
    headers: getHeaders(),
  });
  const data = await res.json();
  return { status: res.status, data };
};

