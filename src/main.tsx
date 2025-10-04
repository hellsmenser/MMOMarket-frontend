import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider } from 'antd'
import { customTheme } from './styles/theme'
import { HashRouter } from 'react-router-dom'
import './styles/global.css'
import { AuthProvider } from './contexts/AuthContext'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  if (root) {
    ReactDOM.createRoot(root).render(
      <HashRouter>
        <AuthProvider>
          <ConfigProvider theme={customTheme}>
            <App />
          </ConfigProvider>
        </AuthProvider>
      </HashRouter>
    )
  } else {
    console.error('⚠️ #root not found')
  }
})
