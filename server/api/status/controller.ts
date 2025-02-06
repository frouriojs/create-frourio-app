import { getClientPort, getServerPort } from 'service/getServerPort';
import { getStatus } from 'service/status';
import { defineController } from './$relay';

export default defineController(() => ({
  get: async () => ({
    status: 200,
    body: {
      status: getStatus(),
      serverPort: await getServerPort(),
      clientPort: await getClientPort(),
    },
  }),
}));
