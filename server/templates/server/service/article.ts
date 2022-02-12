export type ArticleInfo = {
  id: number
  title: string
  body: string
}

const articleData: ArticleInfo[] = [
  {
    id: 1,
    title: 'First article',
    body: 'Hello from frourio!'
  },
  {
    id: 2,
    title: 'Create Frourio App',
    body: 'From installation\n         To deployment\n\n   In  One  Command'
  },
  {
    id: 3,
    title: 'TypeScript full stack framework',
    body: 'All you need is TypeScript'
  },
  {
    id: 4,
    title: 'What databases are suported?',
    body:
      '- SQLite (prisma only for now)\n- PostgreSQL\n- MySQL\nPlanning to support others... stay tuned!'
  }
]

export const getArticles = (search?: string) => {
  const filtered = articleData.filter(
    (article) =>
      !search ||
      search
        .toLowerCase()
        .split(/\s+/)
        .every(
          (word) =>
            (article.title + article.body)
              .replace(/\s/g, '')
              .toLowerCase()
              .search(word.toLowerCase()) >= 0
        )
  )
  return filtered
}

export const getArticle = (id: number) => {
  return articleData.find((article) => article.id === id)
}
