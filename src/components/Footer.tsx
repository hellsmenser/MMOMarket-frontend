import React from "react";
import "../styles/components/HeaderBar.css";
import "../styles/components/Footer.css";

const Footer: React.FC = () => (
  <footer className="footer-bar">
    <div className="footer-content">
      <div className="footer-author">
        Автор: KaizerTheChangeling
        <span className="footer-links">
          <a href="https://github.com/hellsmenser/MMOMarket-frontend" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span>·</span>
          <a href="https://t.me/KaizerTheChangeling" target="_blank" rel="noopener noreferrer">Telegram</a>
        </span>
      </div>
      <div className="footer-disclaimer">
        Этот сайт не связан с NCSoft, её партнёрами или дистрибьюторами, включая 4game / Innova.<br/>
        Названия предметов используются исключительно для справки.
      </div>
    </div>
  </footer>
);

export default Footer;
