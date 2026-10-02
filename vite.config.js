import { defineConfig } from 'vite';

// Relative base so the build works from any sub-path (e.g. GitHub Pages).
export default defineConfig({
  base: './',
  // three.js lands in its own lazily-loaded chunk (~600 kB); that's expected.
  build: { chunkSizeWarningLimit: 800 }
});
