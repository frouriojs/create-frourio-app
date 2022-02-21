<% if (reactHooks !== 'query') { %>import { useCallback, <% if (reactHooks === 'none') { %>useEffect, <% } %>useState } from 'react'<% } %><% if (reactHooks === 'swr') { %>
import useAspidaSWR from '@aspida/swr'<% } else if (reactHooks === 'query') { %>
import { useAspidaQuery } from '@aspida/react-query'<% } else if (reactHooks === 'none') { %>
import type { ArticleInfo } from '$/service/article'<% } %>
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '~/components/Layout'
import { pagesPath } from '~/utils/$path'
import { apiClient } from '~/utils/apiClient'

export type OptionalQuery = {
  search: string
}

const ArticleList: NextPage = () => {
  const router = useRouter()
  const query = router.query as Partial<OptionalQuery>
  const search = query.search ? query.search.trim() : ''
  <% if (reactHooks === 'swr') { %>const { data: articleList } = useAspidaSWR(apiClient.article, {
    query: { search }
  })<% } else if (reactHooks === 'query') { %>
  const { data: articleList } = useAspidaQuery(apiClient.article, {
    query: { search }
  })<% } if (reactHooks === 'none') { %>const [articleList, setArticleList] = useState<ArticleInfo[] | undefined>(undefined)

  useEffect(() => {
    let canceled = false
    apiClient.article.$get({ query: { search } }).then((articleList) => {
      if (!canceled) setArticleList(articleList)
    })
    return () => {
      canceled = true
    }
  }, [search])
<% } %>
  return (
    <Layout>
      <Head>
        <title>Articles</title>
      </Head>
      <h1>Articles</h1>
      {articleList ? (
        articleList.length ? (
          <>
            {search && (
              <span>
                Results for <code>{search}</code>.
              </span>
            )}
            <ul>
              <% if (building === 'basic') { %>{articleList.map((article) => (
                <li key={article.id}>
                  <Link href={pagesPath.article._id(article.id).$url()}>
                    {article.title}
                  </Link>
                </li>
              ))}<% } else if (building === 'static') { %>
              {articleList.map((article) => (
                <li key={article.id}>
                  <Link
                    href={pagesPath.article.entry.$url({
                      query: { id: article.id }
                    })}
                  >
                    {article.title}
                  </Link>
                </li>
              ))}<% } %>
            </ul>
          </>
        ) : (
          search && (
            <span>
              Not found for <code>{search}</code>.
            </span>
          )
        )
      ) : (
        <span>Loading...</span>
      )}
    </Layout>
  )
}

export default ArticleList
