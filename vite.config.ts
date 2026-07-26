import { defineConfig, loadEnv } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import ReactPlugin from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Reads VITE_-prefixed vars from both .env files and the shell environment.
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [
      RubyPlugin(),
      ReactPlugin(),
      tailwindcss(),
    ],
    resolve: {
      alias: [
        { find: '@frontend', replacement: path.resolve(__dirname, './app/frontend') },
        { find: '@', replacement: path.resolve(__dirname, './app/frontend') },
        // react-datepicker's default `browser` field is a UMD bundle that Vite's
        // optimizer exposes as a namespace object, so `import DatePicker from
        // "react-datepicker"` yields `{ default, ... }` and rendering throws
        // "element type is invalid ... got: object". Pin the bare specifier to
        // the ESM build. Exact-match regex so CSS subpath imports
        // ("react-datepicker/dist/react-datepicker.css") still resolve normally.
        {
          find: /^react-datepicker$/,
          replacement: path.resolve(__dirname, 'node_modules/react-datepicker/dist/es/index.js'),
        },
      ],
    },
    server: {
      host: '0.0.0.0',
      hmr: {
        // Leave `host` undefined by default so the HMR client connects to
        // whatever hostname the page was loaded from — localhost, budget.local,
        // or the LAN IP — instead of being pinned to one address that breaks the
        // others. Set VITE_HMR_HOST (shell or .env.local) to pin it, e.g. when
        // accessing the dev app from another device that can't resolve the host.
        host: env.VITE_HMR_HOST || undefined,
        clientPort: 3736,
        port: 3736,
      },
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    },
  }
})
