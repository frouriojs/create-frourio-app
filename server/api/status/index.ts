import type { DefineMethods } from 'aspida';
import type { STATUS } from 'common/types';

export type ServerStatus = {
  status: STATUS;
  serverPort: number;
  clientPort: number;
};

export type Methods = DefineMethods<{
  get: {
    resBody: ServerStatus;
  };
}>;
