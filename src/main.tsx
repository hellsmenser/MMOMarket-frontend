import ReactDOM from 'react-dom/client';
import App from './App';
import { ConfigProvider } from 'antd';
import { customTheme } from './styles/theme'; // 👈
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider theme={customTheme}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);