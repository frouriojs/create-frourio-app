import useAspidaSWR from '@aspida/swr';
import Layout from 'components/Layout';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { pagesPath } from 'utils/$path';
import { apiClient } from 'utils/apiClient';

export type OptionalQuery = {
  search: string;
};

const ArticleList: NextPage = () => {
  const router = useRouter();
  const query = router.query as Partial<OptionalQuery>;
  const search = query.search ? query.search.trim() : '';
  const { data: articleList } = useAspidaSWR(apiClient.article, {
    query: { search },
  });

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
              {articleList.map((article) => (
                <li key={article.id}>
                  <Link href={pagesPath.article.entry.$url({ query: { id: article.id } })}>
                    {article.title}
                  </Link>
                </li>
              ))}
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
  );
};

export default ArticleList;
