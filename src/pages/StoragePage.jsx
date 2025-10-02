import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchFiles,
  uploadFile,
  deleteFile,
  renameFile,
  getShareLink,
  updateComment,
  fetchFileContent,
} from "../api/filesApi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastProvider";
import FilePreview from "../components/FilePreview";
import "../styles/storage.css";

const categories = {
  All: [],
  Documents: ["pdf", "docx", "txt", "doc", "xls", "xlsx", "ppt", "pptx", "csv", "json"],
  Images: ["jpg", "jpeg", "png", "gif"],
  Videos: ["mp4", "avi", "mov"],
  Archives: ["zip", "rar", "7z"],
  Other: [],
};

const ALLOWED_EXTENSIONS = new Set([
  "txt", "pdf", "png", "jpg", "jpeg", "gif",
  "csv", "json",
  "doc", "docx", "xls", "xlsx", "ppt", "pptx",
  "zip", "7z", "tar", "gz",
  "mp3", "wav", "mp4", "mov", "avi",
]);

export default function StoragePage({ userId }) {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewFile, setPreviewFile] = useState(null); 
  const [comment, setComment] = useState("");
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);
  const [modal, setModal] = useState({ type: "", fileId: null, value: "" });

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const targetUserId = user?.isAdmin ? Number(userId ?? params.id) : null;

  // --- загрузка списка файлов ---
  const loadFiles = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingFiles(true);
      const res = await fetchFiles(targetUserId);
      if (res.status === 200) setFiles(res.data);
      else if (res.status === 401) navigate("/login", { replace: true });
      else showToast(res.data?.error || "Ошибка при загрузке файлов", "error");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при загрузке файлов", "error");
    } finally {
      setLoadingFiles(false);
    }
  }, [targetUserId, user, navigate, showToast]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // --- фильтрация ---
  useEffect(() => {
    let filtered = [...files];
    if (category !== "All") {
      filtered = filtered.filter((f) => {
        const ext = f.name.split(".").pop().toLowerCase();
        return (
          categories[category]?.includes(ext) ||
          (category === "Other" &&
            !Object.values(categories).flat().includes(ext))
        );
      });
    }
    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.name.toLowerCase().includes(lower) ||
          (f.comment && f.comment.toLowerCase().includes(lower))
      );
    }
    setFilteredFiles(filtered);
  }, [files, category, search]);

  // --- проверка для предпросмотра ---
  const isPreviewable = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    return ["txt", "png", "jpg", "jpeg", "gif", "pdf"].includes(ext);
  };

  // --- предпросмотр ---
  const loadFileContent = async (file) => {
    const token = localStorage.getItem("access_token");
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "txt") {
      const res = await fetch(`/api/files/${file.id}/content/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка загрузки txt");
      const text = await res.text();
      return { ...file, type: "text", content: text };
    }

    if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
      const res = await fetch(`/api/files/${file.id}/content/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка загрузки image");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      return { ...file, type: "image", url: objectUrl };
    }

    if (ext === "pdf") {
      const res = await fetch(`/api/files/${file.id}/content/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Ошибка загрузки pdf");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      return { ...file, type: "pdf", url: objectUrl };
    }

    return { ...file, type: "other" };
  };

  const handlePreview = async (file) => {
    try {
      const enrichedFile = await loadFileContent(file);
      setPreviewFile(enrichedFile);
    } catch (err) {
      console.error(err);
      showToast("Не удалось загрузить содержимое файла", "error");
    }
  };

  const closePreview = () => {
    if (previewFile?.url) URL.revokeObjectURL(previewFile.url);
    setPreviewFile(null);
  };

  // --- загрузка файлов ---
  const handleUpload = async () => {
    if (!selectedFile) return;

    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      showToast(`Файлы с расширением .${ext} запрещены`, "error");
      return;
    }

    try {
      setUploading(true);
      const res = await uploadFile(selectedFile, comment, targetUserId);
      if (res.status === 201) {
        showToast("Файл загружен", "success");
        setSelectedFile(null);
        setComment("");
        loadFiles();
      } else {
        showToast(res.data?.error || "Ошибка при загрузке файла", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка при загрузке файла", "error");
    } finally {
      setUploading(false);
    }
  };

  // --- удаление ---
  const handleDelete = async (fileId) => {
    if (!window.confirm("Удалить файл?")) return;
    try {
      setDeletingId(fileId);
      const res = await deleteFile(fileId);
      if (res.status === 204) {
        showToast("Файл удалён", "success");
        loadFiles();
      } else showToast("Ошибка при удалении файла", "error");
    } catch (err) {
      console.error(err);
      showToast("Ошибка при удалении файла", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // --- переименование ---
  const handleRename = async (fileId, newName) => {
    if (!newName) return;
    try {
      const res = await renameFile(fileId, newName);
      if (res.status === 200) showToast("Файл переименован", "success");
      else
        showToast(res.data?.error || "Ошибка при переименовании файла", "error");
      loadFiles();
    } catch (err) {
      console.error(err);
      showToast("Ошибка при переименовании файла", "error");
    }
  };

  // --- обновление комментария ---
  const handleUpdateComment = async (fileId, newComment) => {
    if (newComment === undefined) return;
    try {
      const res = await updateComment(fileId, newComment);
      if (res.status === 200) showToast("Комментарий обновлён", "success");
      else showToast(res.data?.error || "Ошибка при обновлении комментария", "error");
      loadFiles();
    } catch (err) {
      console.error(err);
      showToast("Ошибка при обновлении комментария", "error");
    }
  };

  // --- получение ссылки ---
  const handleGetShareLink = async (fileId) => {
    try {
      setSharingId(fileId);
      const res = await getShareLink(fileId);
      if (res.status === 200) {
        const link = res.data.share_url;
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(link);
        else {
          const tempInput = document.createElement("input");
          tempInput.value = link;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }
        showToast("Ссылка скопирована", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Ошибка при получении ссылки", "error");
    } finally {
      setSharingId(null);
    }
  };

  // --- модалки ---
  const openModal = (type, file) => {
    const value = type === "rename" ? file.name : file.comment;
    setModal({ type, fileId: file.id, value });
  };
  const closeModal = () => setModal({ type: "", fileId: null, value: "" });
  const saveModal = async () => {
    if (modal.type === "rename") await handleRename(modal.fileId, modal.value);
    else if (modal.type === "comment") await handleUpdateComment(modal.fileId, modal.value);
    closeModal();
  };

  return (
    <div className="storage-container">
      <h2>Файловое хранилище {targetUserId && `(Пользователь ID: ${targetUserId})`}</h2>

      {/* категории */}
      <div className="folder-list">
        {Object.keys(categories).map((c) => (
          <div
            key={c}
            className={`folder-item ${category === c ? "active" : ""}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </div>
        ))}
      </div>

      {/* поиск */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Поиск по имени или комментарию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* загрузка */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpload();
        }}
        className="upload-section"
      >
        <div className="file-select">
          <label htmlFor="fileInput" className="file-button">
            {selectedFile ? selectedFile.name : "Выберите файл"}
          </label>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
        </div>
        <div className="comment-upload">
          <input
            type="text"
            placeholder="Комментарий"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" disabled={uploading}>
            {uploading ? "Загрузка..." : "Загрузить"}
          </button>
        </div>
      </form>

      {/* таблица файлов */}
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
          {filteredFiles.map((file) => (
            <tr key={file.id}>
              <td>{file.name}</td>
              <td>{file.comment}</td>
              <td>{file.size}</td>
              <td>{new Date(file.uploaded_at).toLocaleString()}</td>
              <td>{file.last_downloaded_at ? new Date(file.last_downloaded_at).toLocaleString() : "-"}</td>
              <td>
                <div className="action-icons">
                  <button className="icon-btn" title="Переименовать" onClick={() => openModal("rename", file)}>✏️</button>
                  <button className="icon-btn" title="Редактировать комментарий" onClick={() => openModal("comment", file)}>💬</button>
                  <button className="icon-btn" title="Удалить" onClick={() => handleDelete(file.id)} disabled={deletingId === file.id}>🗑️</button>
                  <button className="icon-btn" title="Скопировать ссылку" onClick={() => handleGetShareLink(file.id)} disabled={sharingId === file.id}>🔗</button>
                  {isPreviewable(file.name) ? (
                    <button className="icon-btn" title="Предпросмотр" onClick={() => handlePreview(file)}>👁️</button>
                  ) : (
                    <span title="Предпросмотр недоступен" className="icon-btn">❌</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {loadingFiles && <p style={{ textAlign: "center" }}>Загрузка списка файлов...</p>}

      {/* модалки */}
      {modal.fileId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modal.type === "rename" ? "Переименовать файл" : "Редактировать комментарий"}</h3>
            <input type="text" value={modal.value} onChange={(e) => setModal((prev) => ({ ...prev, value: e.target.value }))} />
            <div className="modal-actions">
              <button onClick={saveModal}>Сохранить</button>
              <button onClick={closeModal}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* предпросмотр */}
      {previewFile && <FilePreview file={previewFile} onClose={closePreview} />}
    </div>
  );
}
