import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'node16',
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'index.js',
      formats: ['cjs'],
    },
    rollupOptions: {
      external: ['@solana/web3.js', 'throttled-queue', /node:.*/],
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
