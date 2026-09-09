import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { contentBuildGuard } from './scripts/content/build-guard';

export default defineConfig({
  plugins: [contentBuildGuard(), react(), tailwindcss()],
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
});
