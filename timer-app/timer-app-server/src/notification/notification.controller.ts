import { Controller, Injectable, Param, Post, Req, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';
import { NotificationService } from './notification.service';

export class NotificationPayload {
  supervisorID: string = "";
  state: string = "";
  remainingTime: string = "";
  mesurementTime: string = "";

  constructor(init?: Partial<NotificationPayload>) {
    Object.assign(this, init);
  }
}

@Controller('/notify')
export class NotificationController {
   constructor(private readonly notificationService: NotificationService) {}

  @Sse('time/:supervisorID')
  sse(@Param("supervisorID") supervisorID: string): Observable<MessageEvent> {
    //切断時にゾンビ化しないか未確認
    return fromEvent(this.notificationService.eventEmitter, supervisorID).pipe(
      map((data) => {
        return new MessageEvent("message", {data: data});
      }),
    );
  }

  @Post('time/:supervisorID/:state/:remainingTime/:mesurementTime')
  emit(@Param("supervisorID") supervisorID: string, @Param("state") state: string, @Param("remainingTime") remainingTime: string, @Param("mesurementTime") mesurementTime: string) {
    this.notificationService.eventEmitter.emit(supervisorID, new NotificationPayload({ supervisorID: supervisorID, state: state, remainingTime: remainingTime, mesurementTime: mesurementTime}));
    return {result: 'ok'};
  }
}