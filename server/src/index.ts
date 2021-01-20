import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import { UserResolver } from './resolvers/user';
import microConfig from './mikro-orm.config';
import { PostResolver } from './resolvers/post';
import { COOKIE_NAME, __prod__ } from './constants';
import { HelloResolver } from './resolvers/hello';
import { MyContext } from './types';
import cors from 'cors';

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  orm.getMigrator().up();

  const app = express();
  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10years
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https
      },
      secret: 'mflkaamflkamflkamflk',
      saveUninitialized: false,
      resave: false,
    }),
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      em: orm.em,
      req,
      res,
    }),
  });

  server.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(process.env.PORT, () =>
    console.log('server started at http://localhost:3001'),
  );
};

main().catch((err) => {
  console.log(err);
});
