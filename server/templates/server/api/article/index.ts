import type { DefineMethods } from 'aspida';
import type { ArticleInfo } from 'common/types';

export type Methods = DefineMethods<{
  get: {
    query: { search?: string };
    resBody: ArticleInfo[];
  };
}>;
