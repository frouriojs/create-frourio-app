import type { ArticleInfo } from '$/service/article'

export type Methods = {
  get: {
    query: { search?: string }
    resBody: ArticleInfo[]
  }
}
