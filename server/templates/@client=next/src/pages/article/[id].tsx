import { ArticleInfo } from '$/service/article'
import { GetStaticPaths, GetStaticPropsContext } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React from 'react'
import Layout from '~/components/Layout'
import { apiClient } from '~/utils/apiClient'

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await apiClient.article.$get({ query: {} })
  return {
    paths: articles.map((article) => ({
      params: { id: article.id.toString() }
    })),
    fallback: true
  }
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const { id } = context.params || {}
  if (typeof id !== 'string') return { notFound: true }
  const article = await apiClient.article._articleId(+id).$get()
  if (!article) return { notFound: true }
  return { props: { article } }
}

const Article = ({ article }: { article: ArticleInfo }) => {
  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  router.query
  return (
    <Layout>
      <Head>
        <title>{article.title}</title>
      </Head>
      <h1>{article.title}</h1>
      <pre>{article.body}</pre>
    </Layout>
  )
}

export default Article
