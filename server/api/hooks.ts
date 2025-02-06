import type { FastifyRequest } from 'fastify';
import { defineHooks } from './$relay';

export type AdditionalRequest = Pick<FastifyRequest, 'dir'>;

export default defineHooks(() => ({}));
