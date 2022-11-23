import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const setupApp = async () => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  return app;
};

async function bootstrap() {
  const app = await setupApp();
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
