import React, { useEffect, useState, useCallback } from "react";
import { fetchFiles, uploadFile, deleteFile, renameFile, getShareLink } from "../api/filesApi";

export default function StoragePage({ user, userId }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState("");
  const [newName, setNewName] = useState("");

  const targetUserId = user?.isAdmin && userId ? userId : null;

  const loadFiles = useCallback(async () => {
    if (!localStorage.getItem("access_token")) return; // не грузим без токена
    try {
      const res = await fetchFiles(targetUserId);
      console.log("DEBUG fetchFiles response data =", res.data);
      if (res.status === 200) setFiles(res.data);
      else setMessage("Ошибка при загрузке файлов");
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при загрузке файлов");
    }
  }, [targetUserId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Загрузка файла
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      const res = await uploadFile(selectedFile, comment, targetUserId);
      if (res.status === 201) {
        setMessage("Файл загружен");
        setSelectedFile(null);
        setComment("");
        loadFiles();
      } else {
        setMessage(res.data.error || "Ошибка при загрузке файла");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при загрузке файла");
    }
  };

  // Удаление файла
  const handleDelete = async (fileId) => {
    if (!window.confirm("Удалить файл?")) return;
    try {
      const res = await deleteFile(fileId);
      if (res.status === 204) {
        setMessage("Файл удалён");
        loadFiles();
      } else setMessage("Ошибка при удалении файла");
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при удалении файла");
    }
  };

  // Переименование файла
  const handleRename = async (fileId) => {
    if (!newName) return;
    try {
      const res = await renameFile(fileId, newName);
      if (res.status === 200) {
        setMessage("Файл переименован");
        setNewName("");
        loadFiles();
      } else {
        setMessage(res.data.error || "Ошибка при переименовании файла");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при переименовании файла");
    }
  };

  // Получение ссылки для шаринга
  const handleGetShareLink = async (fileId) => {
  try {
    const res = await getShareLink(fileId);
    if (res.status === 200) {
      navigator.clipboard.writeText(res.data.share_url);
      setMessage("Ссылка скопирована в буфер обмена");
    }
  } catch (err) {
    console.error(err);
    setMessage("Ошибка при получении ссылки");
  }
};

  return (
    <div>
      <h2>Файловое хранилище {targetUserId && `(Пользователь ID: ${targetUserId})`}</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <form onSubmit={handleUpload} style={{ marginBottom: "20px" }}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Загрузить</button>
      </form>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Комментарий</th>
            <th>Размер (B)</th>
            <th>Загружен</th>
            <th>Последнее скачивание</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>{file.comment}</td>
              <td>{file.size}</td>
              <td>{new Date(file.uploaded_at).toLocaleString()}</td>
              <td>{file.last_downloaded_at ? new Date(file.last_downloaded_at).toLocaleString() : "-"}</td>
              <td>
                <button onClick={() => handleDelete(file.id)}>Удалить</button>{" "}
                <button onClick={() => handleRename(file.id)}>Переименовать</button>{" "}
                <input
                  type="text"
                  placeholder="Новое имя"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />{" "}
                <button onClick={() => handleGetShareLink(file.id)}>Скопировать ссылку</button>{" "}
                <a href={file.file} target="_blank" rel="noopener noreferrer">
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}