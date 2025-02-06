import server from '$server';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fastifyJwt from '@fastify/jwt';
import fastifyStatic from '@fastify/static';
import type { FastifyServerFactory } from 'fastify';
import Fastify from 'fastify';
import path from 'path';
import { API_BASE_PATH, API_JWT_SECRET, API_UPLOAD_DIR } from 'service/envValues';

export const init = (serverFactory?: FastifyServerFactory) => {
  const app = Fastify({ serverFactory });
  app.register(helmet, { crossOriginResourcePolicy: false });
  app.register(cors);
  app.register(fastifyStatic, { root: path.join(__dirname, 'static'), prefix: '/static/' });

  if (API_UPLOAD_DIR) {
    app.after(() => {
      app.register(fastifyStatic, {
        root: path.resolve(__dirname, API_UPLOAD_DIR),
        prefix: '/upload/',
        decorateReply: false,
      });
    });
  }

  app.register(fastifyJwt, { secret: API_JWT_SECRET });
  server(app, { basePath: API_BASE_PATH });

  return app;
};
