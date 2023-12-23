import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationController } from './notification/notification.controller'
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [AppController, NotificationController],
  providers: [AppService],
})
export class AppModule {}
