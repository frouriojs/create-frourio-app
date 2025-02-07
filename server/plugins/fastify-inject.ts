import type { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    dir: string;
  }
}

export interface FastifyInjectOptions {
  dir: string;
}

const fastifyInject: FastifyPluginCallback<FastifyInjectOptions> = fp(
  (fastify: FastifyInstance, options: FastifyInjectOptions, next: () => void) => {
    fastify.decorateRequest('dir', { getter: () => options.dir });
    next();
  },
  { fastify: '>=3', name: 'fastify-winston-logger' },
);

export default fastifyInject;
