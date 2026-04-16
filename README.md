# Just Shop — demo e‑commerce (Vue + Vite + Supabase) (indev)

Простой SPA‑каталог с админ‑панелью для управления продуктами. Проект демонстрирует интеграцию фронтенда на Vue 3 с Supabase (Postgres + Storage).

## 🚀 Что внутри

- Vue 3 + Vite + TypeScript + Pinia
- Supabase: таблицы `products` и `categories`, Storage bucket `images`
- Админ: CRUD продуктов, загрузка изображений в Supabase Storage

<img width="1683" height="887" alt="image" src="https://github.com/user-attachments/assets/61aec317-6bb0-4169-9b22-af04eebf93b8" />



## ⚙️ Быстрый старт

Требования: Node 18+, npm

```bash
npm install
npm run dev
```

Сборка продакшн:

```bash
npm run build
npm run preview
```

## 🔑 Переменные окружения

Добавьте в `.env` / CI:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-or-service-key>
```

Клиент Supabase в проекте: `src/lib/supabase.ts`.

## 🗄️ Supabase — схема и storage

Пример SQL (products + categories):

```sql
CREATE TABLE public.categories (
  id serial PRIMARY KEY,
  name text UNIQUE NOT NULL
);

CREATE TABLE public.products (
  id serial PRIMARY KEY,
  title text NOT NULL,
  price numeric(10,2) NOT NULL,
  description text,
  category text,
  category_id integer REFERENCES public.categories(id),
  image text,
  rating jsonb,
  created_at timestamptz DEFAULT now()
);
```

Storage: создайте bucket `images`. В приложении файлы загружаются в `images/products/...` и сохраняются public URL в `products.image`.

> Важно: если хотите прямой доступ по URL — bucket должен быть public (или используйте signed URLs).

## 🔎 Где находится логика в проекте

- API / Supabase — `src/api/index.ts` (fetch/create/update/delete + uploadImage)
- Стор продуктов — `src/stores/products.ts`
- Форма админа (загрузка изображения) — `src/views/AdminProductFormView.vue`
- Типы модели — `src/types/index.ts`

## 🧩 Основные возможности

- Загрузка изображений в Supabase Storage (`uploadImage`) и сохранение публичного URL в БД
- Автоматическое создание/поиск категории по имени (запись `category_id`)
- Категории загружаются из таблицы `categories`

## ✅ Тестирование загрузки изображения (ручной тест)

1. Запустите `npm run dev`.
2. Откройте Admin → Add Product.
3. Выберите файл изображения и нажмите Create.
4. Проверьте, что в Storage появился файл (`images/products/...`), а в БД поле `image` содержит public URL.

tbc

- Удалять старые изображения при обновлении/удалении продукта (в `src/api/index.ts` есть `deleteImage` — можно подключить).
- Добавить аутентификацию + RLS для админ-панели.
- Написать миграции и seed‑скрипт для категорий.

---

//добавить автоматические миграции/seed‑скрипт или включить удаление старых изображений при update/delete.
