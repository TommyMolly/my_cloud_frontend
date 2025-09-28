import React, { useEffect, useState, useCallback } from "react";
import {
  fetchFiles,
  uploadFile,
  deleteFile,
  renameFile,
  getShareLink,
  updateComment,
} from "../api/filesApi";
import "../styles/storage.css";

export default function StoragePage({ user, userId }) {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState("");
  const [newNames, setNewNames] = useState({});
  const [editingComments, setEditingComments] = useState({});

  const targetUserId = user?.isAdmin && userId ? userId : null;

  const loadFiles = useCallback(async () => {
    if (!localStorage.getItem("access_token")) return;
    try {
      const res = await fetchFiles(targetUserId);
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

  const handleRename = async (fileId) => {
    const newName = newNames[fileId];
    if (!newName) return;

    try {
      const res = await renameFile(fileId, newName);
      if (res.status === 200) {
        setMessage("Файл переименован");
        setNewNames((prev) => ({ ...prev, [fileId]: "" }));
        loadFiles();
      } else {
        setMessage(res.data.error || "Ошибка при переименовании файла");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при переименовании файла");
    }
  };

  const handleUpdateComment = async (fileId) => {
    const newComment = editingComments[fileId];
    if (newComment === undefined) return;

    try {
      const res = await updateComment(fileId, newComment);
      if (res.status === 200) {
        setMessage("Комментарий обновлён");
        setEditingComments((prev) => ({ ...prev, [fileId]: "" }));
        loadFiles();
      } else {
        setMessage(res.data.error || "Ошибка при обновлении комментария");
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при обновлении комментария");
    }
  };

  const handleGetShareLink = async (fileId) => {
    try {
      const res = await getShareLink(fileId);
      if (res.status === 200) {
        const link = res.data.share_url;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(link);
          setMessage("Ссылка скопирована в буфер обмена");
        } else {
          const tempInput = document.createElement("input");
          tempInput.value = link;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
          setMessage("Ссылка скопирована (fallback)");
        }
      }
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при получении ссылки");
    }
  };

  const isPreviewable = (filename) => {
    const previewExt = ["pdf", "png", "jpg", "jpeg", "gif", "txt"];
    const ext = filename.split(".").pop().toLowerCase();
    return previewExt.includes(ext);
  };

  return (
  <div className="storage-container">
    <h2>Файловое хранилище {targetUserId && `(Пользователь ID: ${targetUserId})`}</h2>

    {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}

    {/* Блок загрузки файла */}
    <form onSubmit={handleUpload} className="upload-section">
      <div className="file-select">
        <label>
          <button type="button">Выберите файл</button>
          <input
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </label>
        <span className="file-info">
          {selectedFile ? selectedFile.name : "Файл не выбран"}
        </span>
      </div>

      <div className="comment-upload">
        <input
          type="text"
          placeholder="Комментарий"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Загрузить</button>
      </div>
    </form>

    {/* Таблица файлов */}
    <table>
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
              <button className="small-btn" onClick={() => handleDelete(file.id)}>Удалить</button>
              {/* Переименовать */}
              <div className="action-group">
                <input
                  type="text"
                  placeholder="Новое имя"
                  value={newNames[file.id] ?? ""}
                  onChange={(e) =>
                    setNewNames((prev) => ({ ...prev, [file.id]: e.target.value }))
              }
            />
            <button className="small-btn" onClick={() => handleRename(file.id)}>Переименовать</button>
          </div>

          {/* Сохранить комментарий */}
          <div className="action-group">
            <input
              type="text"
              placeholder="Редактировать комментарий"
              value={editingComments[file.id] ?? file.comment}
              onChange={(e) =>
                setEditingComments((prev) => ({ ...prev, [file.id]: e.target.value }))
              }
            />
            <button className="small-btn" onClick={() => handleUpdateComment(file.id)}>Сохранить комментарий</button>
          </div>

          {/* Скопировать ссылку */}
          <button className="small-btn" onClick={() => handleGetShareLink(file.id)}>Скопировать ссылку</button>

          {/* Просмотр */}
          {isPreviewable(file.name) ? (
            <a href={file.file} target="_blank" rel="noopener noreferrer">Просмотр</a>
          ) : (
            <span>Предпросмотр недоступен</span>
          )}
        </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}
