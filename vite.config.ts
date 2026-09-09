import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { contentBuildGuard } from './scripts/content/build-guard';
import { academicIndexGuard } from './scripts/academic-index-guard';

export default defineConfig({
  plugins: [contentBuildGuard(), academicIndexGuard(), react(), tailwindcss()],
  test: { include: ['tests/**/*.test.{ts,tsx}'], environment: 'node' },
});
