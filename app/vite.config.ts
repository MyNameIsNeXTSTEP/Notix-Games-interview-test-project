import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  
  console.log('Loaded environment variables:', {
    VITE_WS_HOST: env.VITE_WS_HOST,
    VITE_WS_PORT: env.VITE_WS_PORT,
  }, '\n');
  
  return {
    plugins: [
      react(),
      tailwindcss(),
      tsconfigPaths({
        skip: (dir) => dir.includes('dist') || dir.includes('build'),
        projects: ['./tsconfig.json'],
      }),
    ],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'components'),
        '@lib': path.resolve(__dirname, 'lib'),
        // '@api': path.resolve(__dirname, '../../shared/api'),
      },
    },
    server: {
      port: 3001,
      host: '0.0.0.0',
      allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0'],
    },
    envDir: './',
    envPrefix: 'VITE_',
    define: {
      'import.meta.env.VITE_API_HOST': JSON.stringify(env.VITE_API_HOST),
      'import.meta.env.VITE_API_PORT': JSON.stringify(env.VITE_API_PORT),
      'import.meta.env.VITE_HTTP_API_URL': JSON.stringify(`http://${env.VITE_API_HOST}:${env.VITE_API_PORT}/api`),
    },
  };
});
