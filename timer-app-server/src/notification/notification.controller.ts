import { Controller, Injectable, Param, Post, Req, Sse } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent, map } from 'rxjs';

class NotificationSignal {
  supervisorID: string;
  remainingTime: string;

  constructor(init?: Partial<NotificationSignal>) {
    Object.assign(this, init);
  }
}

@Injectable()
@Controller('/api/v1/notify')
export class NotificationController {
   constructor(
     private eventEmitter: EventEmitter2,
   ) {}

  @Sse('time/:supervisorID')
  sse(@Param("supervisorID") supervisorID: string): Observable<MessageEvent> {
    //切断時にゾンビ化しないか未確認
    return fromEvent(this.eventEmitter, supervisorID).pipe(
      map((data) => {
        return new MessageEvent(supervisorID, {data: data});
      }),
    );
  }

  @Post('time/:supervisorID/:time')
  emit(@Param("supervisorID") supervisorID: string, @Param("time") time: string) {
    this.eventEmitter.emit(supervisorID, new NotificationSignal({ supervisorID: supervisorID, remainingTime: time }));
    return {result: 'ok'};
  }
}