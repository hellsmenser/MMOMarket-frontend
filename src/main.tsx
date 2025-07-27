import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider } from 'antd'
import { customTheme } from './styles/theme'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  if (root) {
    ReactDOM.createRoot(root).render(
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ConfigProvider theme={customTheme}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    )
  } else {
    console.error('⚠️ #root not found')
  }
})
