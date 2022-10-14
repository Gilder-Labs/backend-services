import { defineConfig } from 'vite';
import path from 'path';
import swc from 'unplugin-swc';
import glob from 'glob';

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
          console.log(path.join(relativeDir, fileName));
          return path.join(relativeDir, fileName);
        },
      },
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
        type: 'commonjs',
        strict: true,
        strictMode: true,
        lazy: false,
        noInterop: true,
      },
      sourceMaps: 'inline',
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
