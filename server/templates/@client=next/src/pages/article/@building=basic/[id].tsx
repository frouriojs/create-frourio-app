import { ArticleInfo } from '$/service/article'
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import React from 'react'
import Layout from '~/components/Layout'
import { apiClient } from '~/utils/apiClient'

interface Prop {
  article: ArticleInfo;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params || {}
  if (typeof id !== 'string') return { notFound: true }
  const article = await apiClient.article._articleId(+id).$get()
  if (!article) return { notFound: true }
  return { props: { article } }
}

const Article: NextPage<Prop> = ({ article }) => {
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
