import { DefineMethods } from 'aspida'
import { ArticleInfo } from 'common/types'

export type Methods = DefineMethods<{
  get: {
    query: { search?: string }
    resBody: ArticleInfo[]
  }
}>
