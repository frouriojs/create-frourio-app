import axios from 'axios';
import open from 'open';
import { updateAnswers } from 'service/answers';
import { getClientPort, getServerPort } from 'service/getServerPort';
import { getStatus } from 'service/status';
import { defineController } from './$relay';

export default defineController(() => ({
  patch: ({ body }) => {
    if (getStatus() !== 'waiting') return { status: 204 };

    updateAnswers(body).then(async () => {
      const clientPort = await getClientPort();
      const serverPort = await getServerPort();
      for (let i = 0; i < 600; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        try {
          const client = axios.create({ baseURL: `http://localhost:${serverPort}/api` });
          const res = await client.get('tasks');
          if (res.status === 200) {
            const subprocess = await open(`http://localhost:${clientPort}`);
            subprocess.on('error', () => {
              console.log(`open http://localhost:${clientPort} in the browser`);
            });
            subprocess.on('close', () => {
              console.log(`open http://localhost:${clientPort} in the browser`);
            });
            break;
          }
        } catch (_: unknown) {
          // ignore
        }
      }
    });

    return { status: 204 };
  },
}));
