# 📦 Frontend — My_Cloud

Это клиентская часть веб-приложения для управления файлами: загрузка, удаление, переименование, редактирование и генерация ссылок для шаринга.  
Фронтенд написан на **React**.

---

## ✨ Возможности

- 🔑 Авторизация через токен (JWT хранится в `localStorage`).
- 📤 Загрузка файлов с комментариями.
- 🗑 Удаление файлов.
- ✏️ Переименование файлов.
- 💬 Добавление и редактирование комментариев.
- 🔗 Получение ссылки для шаринга файла и копирование её в буфер обмена.
- 👩‍💻 Поддержка работы администраторов: можно просматривать файлы другого пользователя.

---

## ⚙️ Технологии

- [React](https://react.dev/) — библиотека для построения интерфейса
- [React Router](https://reactrouter.com/) — маршрутизация между страницами
- [JavaScript (ES6+)](https://developer.mozilla.org/docs/Web/JavaScript) — основной язык разработки
- [fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API) — для работы с REST API бэкенда
- [JWT (JSON Web Token)](https://jwt.io/) — механизм аутентификации и авторизации
- [CSS / inline-стили] — базовое оформление интерфейса (без UI-фреймворков)
- [npm](https://www.npmjs.com/) — менеджер пакетов

---

## 📂 Структура проекта

```
my_cloud_frontend/
├── src/
│ ├── api/
│ │ └── filesApi.js 
│ │ └── usersApi.js
│ │ └── auth.js
│ │
│ ├── components
│ │ └── Headers.jsx
│ │
│ ├── pages/
│ │ └── AdminPage.jsx
│ │ └── HomePage.jsx
│ │ └── LoginPage.jsx
│ │ └── RegisterPage.jsx
│ │ └── StoragePage.jsx 
│ │
│ ├── utils
│ │ └── validator.js
│ │
│ ├── App.jsx 
│ └── index.js 
│
├── public/ 
├── package.json 
└── README.md 
```

---

## 🚀 Установка и запуск

### 1. Клонирование репозитория
```
git clone https://github.com/tommymolly/my_cloud_frontend.git
```
### 2. Установка зависимостей
```
npm install
```
### 3. Запуск приложения
```
npm start
```
### После этого приложение будет доступно по адресу:
```
👉 http://localhost:3000
```