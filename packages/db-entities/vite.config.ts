import { defineConfig } from 'vite';
import swc from 'rollup-plugin-swc';
import path from 'path';

const isExternal = (id: string) => !id.startsWith('.') && !path.isAbsolute(id);

export default defineConfig({
  esbuild: false,
  build: {
    target: 'esnext',
    lib: {
      entry: 'src/index.ts',
      fileName: () => 'index.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: isExternal,
    },
  },
  plugins: [
    swc({
      jsc: {
        parser: {
          syntax: 'typescript',
          dynamicImport: true,
          decorators: true,
        },
        target: 'es2022',
        transform: {
          decoratorMetadata: true,
        },
      },
    }),
    ,
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
