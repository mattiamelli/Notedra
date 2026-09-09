import { build } from 'vite';
import { fileURLToPath } from 'node:url';
// Separate production-mode test artifact. Never an input to the application build.
await build({configFile: false, root: fileURLToPath(new URL('../tests/browser', import.meta.url)), build: {outDir: '../../.verification-dist', emptyOutDir: true}});
