import aspida from '@aspida/<%= aspida === "axios" ? "axios" : "node-fetch" %>';
import cors from '@fastify/cors';
import api from 'api/$api';
import dotenv from 'dotenv';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';
import Home from 'pages/index';
import { fireEvent, render, waitFor } from 'test/testUtils';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { z } from 'zod';

dotenv.config({ path: '../server/.env' });
// eslint-disable-next-line @typescript-eslint/no-require-imports
vi.mock('next/router', () => require('next-router-mock'));

const apiClient = api(aspida(undefined, { baseURL: process.env.API_BASE_PATH }));
const res = function <T extends () => unknown>(
  data: ReturnType<T> extends Promise<infer S> ? S : never,
) {
  return data;
};

let fastify: FastifyInstance;

beforeAll(async () => {
  fastify = Fastify({ forceCloseConnections: true });
  fastify.register(cors);
  fastify.get(apiClient.tasks.$path(), (_, reply) => {
    reply.send(
      res<typeof apiClient.tasks.$get>([
        { id: 1, label: 'foo task', done: false },
        { id: 2, label: 'bar task', done: true },
      ]),
    );
  });

  await fastify.listen({ port: +z.string().parse(process.env.API_SERVER_PORT) });
});

afterAll(() => fastify.close());

describe('Home page', () => {
  test('showing tasks', async () => {
    const { findByText } = render(<Home />);

    await waitFor(async () => {
      await expect(findByText('foo task')).resolves.toBeTruthy();
      await expect(findByText('bar task')).resolves.toBeTruthy();
    });
  });

  test('clicking button triggers prompt', async () => {
    const { findByText } = render(<Home />);

    window.prompt = vi.fn(() => null);
    window.alert = vi.fn();

    await waitFor(async () => {
      await findByText('LOGIN').then(fireEvent.click);

      expect(window.prompt).toHaveBeenCalledWith('Enter the user id (See server/.env)');
      expect(window.alert).toHaveBeenCalledWith('Login failed');
    });
  });
});
