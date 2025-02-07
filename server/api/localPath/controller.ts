import path from 'path';
import { canContinueOnPath, getPathStatus } from 'service/localPath';
import { defineController } from './$relay';

export default defineController(() => ({
  post: async ({ body: { path: relativePath } }) => {
    const absPath = path.resolve(process.cwd(), relativePath);
    const body = { absPath, canContinue: canContinueOnPath(await getPathStatus(absPath)) };

    return { status: 200, body };
  },
}));
