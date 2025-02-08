'use client';

import useAspidaSWR from '@aspida/swr';
import { useSearchParams } from 'next/navigation';
import { apiClient } from 'utils/apiClient';

export type Query = {
  id: number;
};

export default function Article() {
  const searchParams = useSearchParams();
  const { data: article } = useAspidaSWR(
    apiClient.article._articleId(Number.parseInt(searchParams.get('id') as string, 10)),
  );

  return article ? (
    <>
      <h1>{article.title}</h1>
      <pre>{article.body}</pre>
    </>
  ) : (
    <div>Loading...</div>
  );
}
