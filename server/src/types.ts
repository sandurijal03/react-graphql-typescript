import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';

export type MyContext = {
  req: Request & { session?: Session & { userId?: number } };
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  res: Response;
};
