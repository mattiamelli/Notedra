import {progressBuildGuard} from './scripts/progress-validation';
import {cloudBuildGuard} from './scripts/cloud-validation';
import {examBuildGuard} from './scripts/exam-validation';
import {adaptiveBuildGuard} from './scripts/mistake-adaptive-validation';
import {ipBuildGuard} from './scripts/ip-content';
import {enrichmentGuard} from './scripts/enrichment';
import { rlBuildGuard } from './scripts/rl-content';
import { coBuildGuard } from './scripts/co-content';
import { topicStudyGuard } from './scripts/topic-content';
import { practiceBuildGuard } from './scripts/practice-catalog';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { contentBuildGuard } from './scripts/content/build-guard';
import { studentReferencesGuard } from './scripts/student-references-guard';
import { academicIndexGuard } from './scripts/academic-index-guard';

export default defineConfig({
  plugins: [contentBuildGuard(), academicIndexGuard(), studentReferencesGuard(), practiceBuildGuard(), topicStudyGuard(), coBuildGuard(), rlBuildGuard(), enrichmentGuard(), ipBuildGuard(), adaptiveBuildGuard(), examBuildGuard(), progressBuildGuard(), cloudBuildGuard(), react(), tailwindcss()],
  test: { include: ['tests/**/*.test.{ts,tsx}'], environment: 'node' },
  build: {rollupOptions:{output:{manualChunks(id){if(id.includes('/node_modules/@supabase/')||id.includes('/node_modules/iceberg-js/')||id.includes('/node_modules/tslib/'))return 'supabase';}}}},
});
