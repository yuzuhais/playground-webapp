import { INestApplication, Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { z } from 'zod';
import * as trpcExpress from '@trpc/server/adapters/express';

import { NotificationController, NotificationPayload } from './notification.controller';

@Injectable()
export class NotificationRouter {
  constructor(private readonly trpc: NotificationService) {}

  appRouter = this.trpc.router({
    hello: this.trpc.procedure
      .input(z.object({ 
        supervisorID: z.string(),
        state: z.string(),
        remainingTime: z.string(),
        mesurementTime: z.string(),
      }))
      .query(({ input }) => {
        this.trpc.eventEmitter.emit(
          input.supervisorID, 
          new NotificationPayload({ 
            supervisorID: input.supervisorID, 
            state: input.state, 
            remainingTime: input.remainingTime, 
            mesurementTime: input.mesurementTime}));
        return "ok";
      }),
  });

  async applyMiddleware(app: INestApplication) {
    app.use(
      `/trpc`,
      trpcExpress.createExpressMiddleware({ router: this.appRouter }),
    );
  }
}

export type AppRouter = NotificationRouter['appRouter'];
