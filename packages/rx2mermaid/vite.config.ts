import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const packageDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(packageDir, 'src/index.ts'),
      name: 'RxjsLabsRx2mermaid',
      fileName: 'index',
      formats: ['es']
    },
    rollupOptions: {
      external: ['rxjs']
    }
  },
  test: {
    environment: 'jsdom'
  }
});
