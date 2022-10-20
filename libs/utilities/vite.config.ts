import { defineConfig } from 'vite';
import swc from 'unplugin-swc';
import glob from 'glob';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['cjs'],
    },
    rollupOptions: {
      input: glob.sync(path.resolve(__dirname, 'src/**/*.ts')),
      output: {
        entryFileNames: (entry) => {
          const { name, facadeModuleId } = entry;
          const fileName = `${name}.js`;
          if (!facadeModuleId) {
            return fileName;
          }
          const relativeDir = path.relative(
            path.resolve(__dirname, 'src'),
            path.dirname(facadeModuleId),
          );
          return path.join(relativeDir, fileName);
        },
      },
      external: ['@solana/web3.js', /node:.*/],
    },
  },
  plugins: [
    swc.vite({
      jsc: {
        parser: { syntax: 'typescript', decorators: true, dynamicImport: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
        target: 'es2018',
        keepClassNames: true,
        loose: true,
      },
      module: {
        type: 'nodenext',
        strict: true,
        strictMode: true,
        lazy: false,
        noInterop: true,
      },
      sourceMaps: true,
    }),
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
