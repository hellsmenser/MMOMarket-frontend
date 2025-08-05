import React from "react";
import "../styles/components/HeaderBar.css";
import "../styles/components/Footer.css";


const Footer: React.FC = () => (
  <footer className="footer-bar">
    <div className="footer-content">
      {/* Первая строка: 3 колонки */}
      <div className="footer-row footer-row-top">
        {/* 1 колонка: автор */}
        <div className="footer-col footer-author">
          Автор: KaizerTheChangeling
          <span className="footer-links">
            <a href="https://github.com/hellsmenser/MMOMarket-frontend" target="_blank" rel="noopener noreferrer">GitHub</a>
            <span style={{margin: '0 6px'}}>·</span>
            <a href="https://t.me/KaizerTheChangeling" target="_blank" rel="noopener noreferrer">Telegram</a>
          </span>
        </div>
        {/* 2 колонка: пустая */}
        <div className="footer-col"></div>
        {/* 3 колонка: RB bot */}
        <div className="footer-col footer-rb-bot">
          <span>
            Дозорный Герпы, будь в курсе респа РБ на сервере Айрин —
            <a
              href="https://t.me/AirinWolrdBossNotification_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-rb-link"
            >
              @AirinWolrdBossNotification_bot
            </a>
          </span>
        </div>
      </div>
      {/* Вторая строка: дисклеймер на всю ширину */}
      <div className="footer-row footer-row-bottom">
        <div className="footer-disclaimer">
          Этот сайт не связан с NCSoft, её партнёрами или дистрибьюторами, включая 4game (ранее — Innоva).<br/>
          Названия предметов используются исключительно для справки. Данные получены из уведомлений Telegram-бота 4game.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
