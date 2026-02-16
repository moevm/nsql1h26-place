# Test React TypeScript Frontend + Nginx

Тестовый React + TypeScript фронтенд для чтения/записи данных в backend через `GET` и `POST`.

## Запуск

1. Установить зависимости:
   npm install
2. Запустить dev сервер:
   npm run dev

По умолчанию фронт смотрит в `/api`, а Vite в dev-режиме проксирует это на `http://backend:8080`.

Если запускаешь бэкенд не в Docker, задай переменную окружения:

- `VITE_DEV_PROXY_TARGET=http://<your-backend-host>:<port>`

## Технологии

- React
- TypeScript
- Vite

## Ручка

В интерфейсе можно указать путь ручки (например, `/items`) и:
- Нажать **GET** для чтения данных
- Нажать **POST** для отправки JSON

## Конфиг Nginx

Файл конфига: `nginx/default.conf`

- Статика React обслуживается из `/usr/share/nginx/html`
- Запросы `/api/*` проксируются на backend `http://backend:8080`

При необходимости поменяй upstream backend в nginx-конфиге под свой сервис.
