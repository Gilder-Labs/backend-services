import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  build: {
    target: 'es2020',
  },
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths(),
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      exportName: 'viteNodeApp',
      tsCompiler: 'swc',
    }),
  ],
  optimizeDeps: {
    // Vite does not work well with optional dependencies, mark them as ignored for now
    exclude: [
      '@nestjs/platform-socket.io',
      '@nestjs/websockets',
      '@nestjs/microservices',
      'amqp-connection-manager',
      'amqplib',
      'nats',
      '@grpc/proto-loader',
      '@grpc/grpc-js',
      'redis',
      'kafkajs',
      'mqtt',
      'cache-manager',
    ],
  },
});
