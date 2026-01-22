import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Memuat environment variables dari .env file atau system env
  const env = loadEnv(mode, process.cwd(), '');
  
  // Menggunakan API Key dari environment variable, atau menggunakan key yang Anda berikan sebagai fallback
  // PENTING: Key ini sekarang tertanam dalam build.
  const apiKey = env.API_KEY || "AIzaSyCHQbFB-p_jDLB71jOia8NRHmxuAdb3t24";

  return {
    plugins: [react()],
    // Base harus sama dengan nama repository GitHub Anda (case-sensitive)
    base: '/AplikasiPengenalTanamanObat/',
    build: {
      outDir: 'dist',
    },
    // Penting: Mengganti process.env.API_KEY dengan nilai string sebenarnya saat build
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});