import type { DefineMethods } from "aspida";
import type { ArticleInfo } from '$/service/article'

export type Methods = DefineMethods<{
  get: {
    resBody: ArticleInfo
  }
}>
