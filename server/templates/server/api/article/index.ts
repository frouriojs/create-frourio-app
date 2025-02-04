import type { ArticleInfo } from '$/service/article'
import { DefineMethods } from 'aspida'

export type Methods = DefineMethods<{
  get: {
    query: { search?: string }
    resBody: ArticleInfo[]
  }
}>
