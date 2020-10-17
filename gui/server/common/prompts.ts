import {dbInfo} from './dbInfo'

type PromptName = 'dir' | 'server' | 'front' | 'building' | 'mode' | 'target' | 'aspida' | 'pm' | 'daemon' | 'testing' | 'orm' | 'dbType' | 'dbHost' | 'dbPort' | 'dbUser' | 'dbPass' | 'dbName' | 'dbFile' | 'editor'
export type Answers = Partial<Record<PromptName, string>>

export type Prompt = {
  name: PromptName
  message: string
  default?: string
  when?: boolean
} & ({
  type: 'list'
  choices: {
    name: string
    value: string
  }[]
} | { type: 'input' })

const saoPrompts = (editors: { name: string; value: string }[]): ({
  name: PromptName
  message: string
  default?: ((answers: Answers) => string) | string
  when?: (answers: Answers) => boolean
} & ({
  type: 'list'
  choices: {
    name: string
    value: string
  }[]
} | { type: 'input' }))[] =>[
  {
    name: 'dir',
    message: 'Directory name (create new)',
    type: 'input'
  },
{
  name: 'server',
  message: 'Core framework of frourio',
  type: 'list',
  choices: [
    { name: 'Fastify (5x faster than Express)', value: 'fastify' },
    { name: 'Express', value: 'express' }
  ],
  default: 'fastify'
},
{
  name: 'front',
  message: 'Frontend framework',
  choices: [
    { name: 'Next.js', value: 'next' },
    { name: 'Nuxt.js', value: 'nuxt' }
  ],
  type: 'list',
  default: 'next'
},
{
  name: 'building',
  message: 'Building mode',
  type: 'list',
  choices: [
    { name: 'Basic (next build)', value: 'basic' },
    { name: 'Static (next build && next export)', value: 'static' }
  ],
  default: 'basic',
  when : ans => ans.front === 'next'
},
{
  name: 'mode',
  message: 'Rendering mode',
  type: 'list',
  choices: [
    { name: 'Universal (SSR / SSG)', value: 'universal' },
    { name: 'Single Page App', value: 'spa' }
  ],
  default: 'universal',
  when : ans => ans.front === 'nuxt'
},
{
  name: 'target',
  message: 'Deployment target',
  type: 'list',
  choices: [
    { name: 'Server (Node.js hosting)', value: 'server' },
    { name: 'Static (Static/JAMStack hosting)', value: 'static' }
  ],
  default: 'server',
  when : ans => ans.front === 'nuxt'
},
{
  name: 'aspida',
  message: 'HTTP client of aspida',
  choices: [
    { name: 'axios', value: 'axios' },
    { name: 'fetch', value: 'fetch' }
  ],
  type: 'list',
  default: 'axios'
},
{
  name: 'pm',
  message: 'Package manager',
  choices: [
    { name: 'Yarn', value: 'yarn' },
    { name: 'Npm', value: 'npm' }
  ],
  type: 'list',
  default: 'yarn'
},
{
  name: 'daemon',
  message: 'Daemon process manager',
  choices: [
    { name: 'None', value: 'none' },
    { name: 'PM2', value: 'pm2' }
  ],
  type: 'list',
  default: 'none'
},
{
  name: 'testing',
  message: 'Testing framework',
  choices: [
    { name: 'None', value: 'none' },
    { name: 'Jest', value: 'jest' }
  ],
  type: 'list',
  default: 'none'
},
{
  name: 'orm',
  message: 'O/R mapping tool',
  choices: [
    { name: 'Prisma (recommended)', value: 'prisma' },
    { name: 'TypeORM', value: 'typeorm' },
    { name: 'None', value: 'none' }
  ],
  type: 'list',
  default: 'prisma'
},
{
  name: 'dbType',
  message: 'Database type of Prisma',
  choices: [
    { name: 'MySQL', value: 'mysql' },
    { name: 'PostgreSQL', value: 'postgresql' },
    { name: 'SQLite', value: 'sqlite' }
  ],
  type: 'list',
  default: 'mysql',
  when : ans => ans.orm === 'prisma'
},
{
  name: 'dbType',
  message: 'Database type of TypeORM',
  choices: [
    { name: 'MySQL', value: 'mysql' },
    { name: 'PostgreSQL', value: 'postgres' },
    { name: 'MongoDB', value: 'mongodb' },
    { name: 'Sql Server', value: 'mssql' },
    { name: 'MariaDB', value: 'mariadb' },
    { name: 'CockroachDB', value: 'cockroachdb' }
  ],
  type: 'list',
  default: 'mysql',
  when : ans => ans.orm === 'typeorm'
},
{
  name: 'dbHost',
  message: 'server/prisma/.env HOST=',
  default: 'localhost',
  type: 'input',
  when : ans => ans.orm === 'prisma' && ans.dbType !== 'sqlite'
},
{
  name: 'dbHost',
  message: 'server/.env TYPEORM_HOST=',
  type: 'input',
  default: 'localhost',
  when : ans => ans.orm === 'typeorm'
},
{
  name: 'dbPort',
  message: 'server/prisma/.env PORT=',
  type: 'input',
  default: ans => `${dbInfo[ans.dbType as keyof typeof dbInfo].port}`,
  when : ans => ans.orm === 'prisma' && ans.dbType !== 'sqlite'
},
{
  name: 'dbPort',
  message: 'server/.env TYPEORM_PORT=',
  type: 'input',
  default: ans => `${dbInfo[ans.dbType as keyof typeof dbInfo].port}`,
  when : ans => ans.orm === 'typeorm'
},
{
  name: 'dbUser',
  message: 'server/prisma/.env USER=',
  type: 'input',
  when : ans => ans.orm === 'prisma' && ans.dbType !== 'sqlite'
},
{
  name: 'dbUser',
  message: 'server/.env TYPEORM_USERNAME=',
  type: 'input',
  when : ans => ans.orm === 'typeorm'
},
{
  name: 'dbPass',
  message: 'server/prisma/.env PASSWORD=',
  type: 'input',
  when : ans => ans.orm === 'prisma' && ans.dbType !== 'sqlite'
},
{
  name: 'dbPass',
  message: 'server/.env TYPEORM_PASSWORD=',
  type: 'input',
  when : ans => ans.orm === 'typeorm'
},
{
  name: 'dbName',
  message: 'server/prisma/.env DATABASE=',
  type: 'input',
  when : ans => ans.orm === 'prisma' && ans.dbType !== 'sqlite'
},
{
  name: 'dbName',
  message: 'server/.env TYPEORM_DATABASE=',
  type: 'input',
  when : ans => ans.orm === 'typeorm'
},
{
  name: 'dbFile',
  message: 'server/prisma/.env DATABASE_FILE=',
  type: 'input',
  default: './dev.db',
  when : ans => ans.orm === 'prisma' && ans.dbType === 'sqlite'
},
{
  name: 'editor',
  message: 'Editor for development',
  type: 'list',
  choices: [
    ...editors,
    { name: 'None', value: 'none' }
  ],
  default: 'vscode'
}
]

export const initPrompts = (editors: { name: string; value: string }[]) =>
  (answers: Answers): Prompt[] => {
  const p = saoPrompts(editors)

const copiedAnswers = { ...answers }

p.forEach(prompt => {
  if (prompt.when?.(copiedAnswers) === false) return
  copiedAnswers[prompt.name] = answers[prompt.name] ?? (typeof prompt.default === 'function' ? prompt.default(copiedAnswers) : prompt.default)
})

return p.filter(prompt => prompt.when?.(copiedAnswers) !== false).map(prompt => Object.entries(prompt).reduce((prev, [key, val]) => ({ ...prev, [key]: typeof val === 'function' ? val(copiedAnswers) : val }), {} as Prompt))
}
