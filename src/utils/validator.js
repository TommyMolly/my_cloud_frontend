export const validateUsername = (username) => {
  if (!username) return "Логин обязателен";
  const cleanUsername = username.trim(); 
  const re = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  if (!re.test(cleanUsername)) 
    return "Логин должен содержать 4-20 символов, начинаться с буквы и состоять из латинских букв и цифр";
  return "";
};

export const validateEmail = (email) => {
  if (!email) return "Email обязателен";
  const cleanEmail = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(cleanEmail)) return "Некорректный формат email";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Пароль обязателен";
  if (password.length < 6) return "Пароль должен быть не менее 6 символов";
  if (!/[A-Z]/.test(password)) return "Пароль должен содержать хотя бы одну заглавную букву";
  if (!/[0-9]/.test(password)) return "Пароль должен содержать хотя бы одну цифру";
  if (!/[^A-Za-z0-9]/.test(password)) return "Пароль должен содержать хотя бы один специальный символ";
  return "";
};
