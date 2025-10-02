import React, { useEffect, useState } from "react";
import { authFetch } from "../api/auth";

export default function FilePreview({ file, onClose }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Загружаем содержимое только для текстовых файлов
    if (file.type === "text") {
      const loadContent = async () => {
        setLoading(true);
        try {
          const res = await authFetch(`/api/files/${file.id}/content/`);
          if (res.ok) {
            const text = await res.text();
            setContent(text);
          } else {
            setContent("Ошибка загрузки содержимого");
          }
        } catch (err) {
          setContent("Ошибка сети");
        } finally {
          setLoading(false);
        }
      };
      loadContent();
    }
  }, [file]);

  const renderContent = () => {
    switch (file.type) {
      case "text":
        return (
          <pre
            style={{
              textAlign: "left",
              maxHeight: "500px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              padding: "10px",
              backgroundColor: "#f5f5f5",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            {loading ? "Загрузка..." : content}
          </pre>
        );

      case "image":
        return (
          <img
            src={file.url} 
            alt={file.name}
            style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: "5px" }}
          />
        );

      case "pdf":
        return (
          <iframe
            src={file.url}
            title={file.name}
            style={{
              width: "80vw",
              height: "80vh",
              border: "none",
              borderRadius: "5px",
            }}
          />
        );

      default:
        return <p>Предпросмотр для этого файла недоступен.</p>;
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "15px",
          borderRadius: "8px",
          boxShadow: "0 0 15px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>{file.name}</h3>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            width: "100%",
          }}
        >
          {renderContent()}
        </div>
        <div className="modal-actions" style={{ marginTop: "10px" }}>
          <button onClick={onClose} style={{ padding: "5px 15px" }}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

