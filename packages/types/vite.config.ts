import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'index.js',
      formats: ['cjs'],
    },
  },
  plugins: [
    {
      name: 'vite-plugin-dts',
      apply: 'build',
      buildEnd(err) {
        this.emitFile({
          type: 'asset',
          fileName: 'index.d.ts',
          source: "export * from '../src/index'",
        });
      },
    },
  ],
});
