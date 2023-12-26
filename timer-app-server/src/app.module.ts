import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { NotificationController } from './notification/notification.controller'
import { NotificationModule } from './notification/notification.module'
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot(), NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
