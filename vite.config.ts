import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig(({ command, mode }) => {
  return {
    base: mode === 'production' ? '/MMOMarket-frontend/' : '/',
    plugins: [
      react(),
      viteMockServe({
        mockPath: 'mock',
        enable: command === 'serve',
      }),
      {
        name: 'remove-crossorigin',
        transformIndexHtml: {
          enforce: 'post',
          transform(html) {
            return html.replace(/\s+crossorigin\b/g, '')
          },
        },
      },
      {
        name: 'force-entry',
        enforce: 'pre',
        resolveId(id) {
          if (id === 'force-entry') return id
        },
        load(id) {
          if (id === 'force-entry') {
            return `import "/src/main.tsx";`
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          entry: 'force-entry',
        },
      },
    },
  }
})