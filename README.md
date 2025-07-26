<div align="center">
  <img src="public/logo.svg"/>
  <h1>MMO Market Front</h1>
  <p>Веб-приложение для мониторинга цен игровых предметов и валюты Lineage 2</p>
  <a href="https://hellsmenser.github.io/MMOMarket-frontend/" target="_blank" style="font-size:18px;font-weight:600;color:#00ff8f;">🌐 Открыть демо на GitHub Pages</a>
</div>

---

## 🚀 О проекте

MMO Market Front — это современный интерфейс для отслеживания истории цен предметов и монеты в Lineage 2. Проект позволяет искать предметы, просматривать их модификации, анализировать динамику цен в адене и монетах, а также получать актуальную стоимость монеты.

Бэкенд проекта: [MMO Market API](https://github.com/your-org/L2MarketBack)

### Основные возможности
- Поиск предметов с автодополнением
- Просмотр истории цен по дням и модификациям
- Графики цен в адене и монетах
- Выбор периода и типа агрегации (среднее/минимальное)
- Дисклеймеры для предметов с несколькими модификациями
- Отображение актуальной цены монеты
- Обработка ошибок (404, отсутствие истории)

## 🛠️ Технологии
- React + TypeScript
- Vite
- Ant Design
- Recharts

## ⚡ Быстрый старт

1. Клонируйте репозиторий:
   ```sh
   git clone https://github.com/hellsmenser/L2MarketFront.git
   cd L2MarketFront
   ```
2. Установите зависимости:
   ```sh
   npm install
   ```
3. Запустите приложение:
   ```sh
   npm run dev
   ```
4. Откройте [http://localhost:5173](http://localhost:5173) в браузере

## 📁 Структура проекта

```
src/
  components/      # UI компоненты (HeaderBar, PriceChart, ItemTable)
  layouts/         # Основные шаблоны страниц
  pages/           # Страницы (Home, ItemPage)
  services/        # API-запросы
  styles/          # Стили
  types/           # Типы данных
  utils/           # Вспомогательные функции
mock/              # Моковые данные для разработки
public/            # Статические файлы
```

## 📝 API

- `/items/:id` — информация о предмете
- `/items/:id/history` — история цен
- `/prices/coin` — текущая цена монеты


## 💡 Контакты и поддержка

- 🌐 Попробовать: [https://hellsmenser.github.io/MMOMarket-frontend/](https://hellsmenser.github.io/MMOMarket-frontend/)
- Telegram: [@hellsmenser](https://t.me/hellsmenser)
- Issues: [GitHub Issues](https://github.com/hellsmenser/MMOMarket-frontend/issues)
- Backend: [MMO Market API](https://github.com/hellsmenser/MMOmarket)

---

<div align="center">
  <sub>Made with ❤️ for Lineage 2 Community</sub>
</div>
