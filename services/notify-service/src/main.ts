import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

const setupApp = async () => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(helmet());
  app.use(compression.default());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  return app;
};

async function bootstrap() {
  const app = await setupApp();
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
