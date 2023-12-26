import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import {NotificationService} from './notification.service';
import {NotificationRouter} from './notification.router';

@Module({
    imports: [],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationRouter],
  })
export class NotificationModule {}
