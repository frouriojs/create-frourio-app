<% if (reactHooks === 'none') { %>import { useState, useEffect } from 'react'<% } else if (reactHooks === 'swr') { %>
import useAspidaSWR from '@aspida/swr'<% } else if (reactHooks === 'query') { %>
import { useAspidaQuery } from '@aspida/react-query'<% } %>
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '~/components/Layout'
import { apiClient } from '~/utils/apiClient'
<% if (reactHooks === 'none') { %>import type { ArticleInfo } from '$/service/article'<% } %>

export type Query = {
  id: number
}

const Article: NextPage = () => {
  const router = useRouter()
  <% if (reactHooks === 'none') { %>const [article, setArticle] = useState<ArticleInfo | null>(null)
  useEffect(() => {
    apiClient.article._articleId(Number.parseInt(router.query.id as string, 10)).$get().then((article) => {setArticle(article)})
  }, [router.query.id])<% } else if (reactHooks === 'swr') { %>
  const { data: article } = useAspidaSWR(
    apiClient.article._articleId(Number.parseInt(router.query.id as string, 10))
  )<% } else if (reactHooks === 'query') { %>
  const { data: article } = useAspidaQuery(
    apiClient.article._articleId(Number.parseInt(router.query.id as string, 10))
  )<% } %>
  return (
    <Layout>
      <Head>
        <title>{article?.title ?? 'Loading...'}</title>
      </Head>
      {article ? (
        <>
          <h1>{article.title}</h1>
          <pre>{article.body}</pre>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </Layout>
  )
}

export default Article
