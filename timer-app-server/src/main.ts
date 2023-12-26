import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotificationRouter } from './notification/notification.router'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const trpc = app.get(NotificationRouter);
  trpc.applyMiddleware(app);
  await app.listen(3001);
}
bootstrap();
