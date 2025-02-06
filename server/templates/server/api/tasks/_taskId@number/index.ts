import type { DefineMethods } from 'aspida';
import type { Task } from 'common/types';

export type Methods = DefineMethods<{
  patch: {
    reqBody: Partial<Pick<Task, 'label' | 'done'>>;
    status: 204;
  };
  delete: {
    status: 204;
  };
}>;
