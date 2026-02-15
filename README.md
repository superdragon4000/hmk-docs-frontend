# HMK Docs Frontend

Frontend на Next.js + Tailwind + Redux Toolkit.

## Стек

- Next.js (App Router)
- Tailwind CSS
- Redux Toolkit + React Redux
- TypeScript

## Запуск

```bash
cp .env.example .env.local
npm install
npm run dev
```

По умолчанию приложение ожидает backend на `http://localhost:3000/api`.

## Переменные окружения

- `NEXT_PUBLIC_API_URL` - URL backend API
- `NEXT_PUBLIC_PARTS_STORE_URL` - ссылка на магазин запчастей HIDROMEK (баннер на сайте)

## Страницы

- `/` - лендинг (русский язык, адаптив)
- `/login` - вход
- `/register` - регистрация
- `/catalogs` - каталоги, подписка и переход к оплате
