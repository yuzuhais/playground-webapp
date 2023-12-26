import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { initTRPC } from '@trpc/server';

@Injectable()
export class NotificationService {
  constructor(public eventEmitter: EventEmitter2) {}
    
  trpc = initTRPC.create();
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
}
