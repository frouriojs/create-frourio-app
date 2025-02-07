import { createTask, getTasks } from 'service/tasks';
import { defineController } from './$relay';

const print = (text: string) => console.log(text);

export default defineController({ getTasks, print }, ({ getTasks, print }) => ({
  get: async ({ query }) => {
    if (query?.message) print(query.message);

    return { status: 200, body: await getTasks(query?.limit) };
  },
  post: async ({ body }) => ({ status: 201, body: await createTask(body.label) }),
}));
