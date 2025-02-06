import type { DefineMethods } from 'aspida';
import type { AuthHeader, UserInfo } from 'common/types';
import type { ReadStream } from 'fs';

export type Methods = DefineMethods<{
  get: {
    reqHeaders: AuthHeader;
    resBody: UserInfo;
  };
  post: {
    reqHeaders: AuthHeader;
    reqFormat: FormData;
    reqBody: { icon: File | ReadStream };
    resBody: UserInfo;
  };
}>;
