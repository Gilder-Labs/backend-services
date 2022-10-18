import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

const setupApp = async (host: string, port: number) => {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: host,
        port,
      },
    },
  );
  return app;
};

async function bootstrap() {
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.SERVICE_PORT
    ? Number(process.env.SERVICE_PORT)
    : 12000;
  const app = await setupApp(host, port);
  console.log(`Microservice listening on ${host}:${port}`);
  await app.listen();
}
bootstrap();
