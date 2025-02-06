import { DefineMethods } from 'aspida'
import { ArticleInfo } from 'common/types'

export type Methods = DefineMethods<{
  get: {
    resBody: ArticleInfo
  }
}>
