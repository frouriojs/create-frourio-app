import type { DefineMethods } from 'aspida';
import type { Answers } from 'common/prompts';

export type Methods = DefineMethods<{
  patch: {
    reqBody: Answers;
    status: 204;
  };
}>;
