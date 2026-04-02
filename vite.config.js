import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Default to root '/' for standalone sites (Netlify). 
  // Use VITE_SITE_PATH specifically for GitHub Pages sub-folders.
  const base = env.VITE_SITE_PATH || '/';

  return {
    base,
    plugins: [react(), tailwindcss()],
  }
})
