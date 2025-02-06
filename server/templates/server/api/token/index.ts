import type { DefineMethods } from 'aspida';

export type Methods = DefineMethods<{
  post: {
    reqBody: {
      id: string;
      pass: string;
    };
    resBody: {
      token: string;
    };
  };
}>;
