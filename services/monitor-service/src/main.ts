import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

const setupApp = async () => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
    },
  );
  const logger = app.get(Logger);
  app.useLogger(logger);
  console.trace = (message, ...context) => logger.verbose(message, context);
  console.debug = (message, ...context) => logger.debug(message, context);
  console.log = (message, ...context) => logger.log(message, context);
  console.info = (message, ...context) => logger.log(message, context);
  console.warn = (message, ...context) => logger.warn(message, context);
  console.error = (message, ...context) => logger.error(message, context);
  return app;
};

if (import.meta.env.PROD) {
  async function bootstrap() {
    const app = await setupApp();
    await app.listen();
  }
  bootstrap();
}

export const viteNodeApp = setupApp();
