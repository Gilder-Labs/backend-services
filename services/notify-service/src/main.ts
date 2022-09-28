import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { VersioningType } from '@nestjs/common';

const setupApp = async () => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
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

async function bootstrap() {
  const app = await setupApp();
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
