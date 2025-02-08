'use client';

import useAspidaSWR from '@aspida/swr';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { pagesPath } from 'utils/$path';
import { apiClient } from 'utils/apiClient';

export type OptionalQuery = {
  search: string;
};

export default function Articles() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search')?.trim();
  const { data: articleList } = useAspidaSWR(apiClient.article, {
    query: { search },
  });

  return (
    <>
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
    </>
  );
}
