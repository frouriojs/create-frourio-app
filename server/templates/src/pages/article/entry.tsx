import useAspidaSWR from '@aspida/swr'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Layout from '~/components/Layout'
import { apiClient } from '~/utils/apiClient'

export type Query = {
  id: number
}

const Article: NextPage = () => {
  const router = useRouter()
  const { data: article } = useAspidaSWR(
    apiClient.article._articleId(Number.parseInt(router.query.id as string, 10))
  )

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
