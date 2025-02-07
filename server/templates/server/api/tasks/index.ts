import type { DefineMethods } from 'aspida';
import type { Task } from 'common/types';

export type Methods = DefineMethods<{
  get: {
    query?: {
      limit?: number;
      message?: string;
    };
    resBody: Task[];
  };
  post: {
    reqBody: Pick<Task, 'label'>;
    resBody: Task;
  };
}>;
