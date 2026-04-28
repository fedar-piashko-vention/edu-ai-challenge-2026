import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const base =
    env.VITE_BASE ||
    (mode === 'production' && repoName ? `/${repoName}/` : '/');

  return {
    base,
    plugins: [react()],
  };
});
