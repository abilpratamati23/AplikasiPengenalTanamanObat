
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Memuat environment variables dari .env file atau system env
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    base: '/AplikasiPengenalTanamanObat/',
    build: {
      outDir: 'dist',
    },
    // Penting: Mengganti process.env.API_KEY dengan nilai string sebenarnya saat build
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
