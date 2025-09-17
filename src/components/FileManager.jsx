import React, { useEffect, useState, useCallback } from "react";
import { fetchFiles, uploadFile, deleteFile, renameFile, getShareLink } from "../api/filesApi";

export default function FileManager({ userId = null }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState("");
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetchFiles(userId);
      if (res.status === 200) setFiles(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при загрузке файлов");
    }
  }, [userId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Загрузка файла
  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      const res = await uploadFile(selectedFile, comment, userId);
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
      } else {
        setMessage("Ошибка при удалении файла");
      }
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

  // Получение публичной ссылки
  const handleShare = async (fileId) => {
    try {
      const res = await getShareLink(fileId);
      if (res.status === 200) {
        navigator.clipboard.writeText(res.data.share_url);
        setMessage("Ссылка скопирована в буфер обмена");
      } else {
        setMessage("Ошибка при создании ссылки");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при создании ссылки");
    }
  };

  return (
    <div>
      <h2>Файловое хранилище {userId ? `(Пользователь ID: ${userId})` : ""}</h2>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <div style={{ marginBottom: "20px" }}>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleUpload}>Загрузить</button>
      </div>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Имя файла</th>
            <th>Комментарий</th>
            <th>Размер (B)</th>
            <th>Дата загрузки</th>
            <th>Дата последнего скачивания</th>
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
                <input
                  type="text"
                  placeholder="Новое имя"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={() => handleRename(file.id)}>Переименовать</button>{" "}
                <button onClick={() => handleShare(file.id)}>Ссылка</button>{" "}
                <a href={file.file} target="_blank" rel="noopener noreferrer">Просмотр</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
