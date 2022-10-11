import { defineConfig } from 'vite';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import path from 'path';

const isExternal = (id: string) => !id.startsWith('.') && !path.isAbsolute(id);

export default defineConfig({
  optimizeDeps: {
    exclude: ['node-fetch'],
  },
  build: {
    target: 'esnext',
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
    viteCommonjs(),
  ],
});
