# 1. Собираем фронтенд
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Отдаём собранный фронт через nginx
FROM nginx:1.25

# Копируем билд в nginx
COPY --from=build /app/build /usr/share/nginx/html

# Копируем дефолтный конфиг nginx (если нужно кастомизировать — делаем отдельно)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
