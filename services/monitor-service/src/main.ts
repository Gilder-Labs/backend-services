import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
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
  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.SERVICE_PORT
    ? Number(process.env.SERVICE_PORT)
    : 8000;
  const app = await setupApp(host, port);
  console.log(`Microservice listening on ${host}:${port}`);
  await app.listen();
}
bootstrap();
