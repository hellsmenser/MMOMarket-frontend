import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider } from 'antd'
import { customTheme } from './styles/theme'
import { HashRouter } from 'react-router-dom'
import './styles/global.css'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  if (root) {
    ReactDOM.createRoot(root).render(
      <HashRouter>
        <ConfigProvider theme={customTheme}>
          <App />
        </ConfigProvider>
      </HashRouter >
    )
  } else {
    console.error('⚠️ #root not found')
  }
})
