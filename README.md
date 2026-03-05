# nosql_template


## Предварительная проверка заданий

<a href=" ./../../../actions/workflows/1_helloworld.yml" >![1. Согласована и сформулирована тема курсовой]( ./../../actions/workflows/1_helloworld.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/2_usecase.yml" >![2. Usecase]( ./../../actions/workflows/2_usecase.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/3_data_model.yml" >![3. Модель данных]( ./../../actions/workflows/3_data_model.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/4_prototype_store_and_view.yml" >![4. Прототип хранение и представление]( ./../../actions/workflows/4_prototype_store_and_view.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/5_prototype_analysis.yml" >![5. Прототип анализ]( ./../../actions/workflows/5_prototype_analysis.yml/badge.svg)</a> 

<a href=" ./../../../actions/workflows/6_report.yml" >![6. Пояснительная записка]( ./../../actions/workflows/6_report.yml/badge.svg)</a>

<a href=" ./../../../actions/workflows/7_app_is_ready.yml" >![7. App is ready]( ./../../actions/workflows/7_app_is_ready.yml/badge.svg)</a>

---

## Mushrooms Maps

Веб-приложение для работы с картами грибных мест. Позволяет создавать, просматривать, обновлять и удалять карты.

### Структура проекта

```
├── docker-compose.yaml      # Конфигурация Docker Compose
├── nginx.conf               # Конфигурация Nginx (reverse proxy)
├── backend/                 # NestJS приложение
│   ├── Dockerfile
│   ├── .env                 # Переменные окружения бэкенда
│   ├── init-mongo.sh        # Скрипт инициализации MongoDB
│   └── src/
│       ├── main.ts          # Точка входа + настройка Swagger
│       ├── app.module.ts    # Корневой модуль
│       └── maps/            # Модуль карт (controller, service, schema, dto)
└── frontend/                # React приложение
    ├── Dockerfile
    ├── .env                 # Переменные окружения фронтенда
    └── src/
        ├── App.tsx          # Корневой компонент
        ├── api/             # API-клиент и хуки
        ├── models/          # Типы данных
        └── stores/          # Zustand-сторы
```

### Переменные окружения

В проекте есть файлы-шаблоны `.env.example`. Для начала работы скопируйте их:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Затем при необходимости отредактируйте значения в `.env` файлах.

### Запуск

1. Убедитесь, что Docker и Docker Compose установлены
2. Создайте `.env` файлы из шаблонов (см. раздел выше)
3. Запустите проект:

```bash
docker-compose up --build
```

Приложение будет доступно:

| Сервис | URL |
|--------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost/api |
| Swagger UI | http://localhost/api/docs |

### Запуск без Docker (для разработки)

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### API эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| POST | `/api/maps` | Создать карту |
| GET | `/api/maps` | Получить все карты |
| GET | `/api/maps/:id` | Получить карту по ID |
| POST | `/api/maps/:id` | Обновить карту по ID |
| DELETE | `/api/maps/:id` | Удалить карту по ID |

Полная документация API доступна в Swagger UI по адресу `/api/docs` после запуска бэкенда.
