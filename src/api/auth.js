const BASE_URL = "/api";

// Обновление access токена
export const refreshAccessToken = async () => {
  const refresh = localStorage.getItem("refresh_token");
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    localStorage.setItem("access_token", data.access);
    return data.access;
  } catch (err) {
    console.error("Ошибка обновления токена:", err);
    return null;
  }
};

// Обёртка для fetch с автообновлением токена
export const authFetch = async (url, options = {}) => {
  let access = localStorage.getItem("access_token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: access ? `Bearer ${access}` : "",
    },
  });

  
  if (res.status === 401) {
    access = await refreshAccessToken();
    if (!access) return res;

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${access}`,
      },
    });
  }

  return res;
};
