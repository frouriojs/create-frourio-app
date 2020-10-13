import {dbInfo} from './dbInfo'

type Name = 'dir' | 'name' | 'server' | 'front' | 'building' | 'mode' | 'target' | 'aspida' | 'pm' | 'daemon' | 'testing' | 'orm' | 'dbType' | 'dbHost' | 'dbPort' | 'dbUser' | 'dbPass' | 'dbName' | 'dbFile'

export type Prompt = {
  name: Name
  message: string
  default?: string
  required ?: boolean
} & ({
  type: 'list'
  choices: {
    label: string
    value: string
  }[]
} | { type: 'input' })

export const prompts = (dirname: string, answers: Record<Name, string>) => {
  const p: Prompt[] = [
    {
      name: 'dir',
      message: 'Directory name:',
      default: dirname,
      type: 'input'
    },
    {
      name: 'name',
      message: 'Project name:',
      default: dirname,
      type: 'input'
    },
  {
    name: 'server',
    message: 'Core framework of frourio:',
    type: 'list',
    choices: [
      { label: 'Fastify (5x faster than Express)', value: 'fastify' },
      { label: 'Express', value: 'express' }
    ],
    default: 'fastify'
  },
  {
    name: 'front',
    message: 'Frontend framework:',
    choices: [
      { label: 'Next.js', value: 'next' },
      { label: 'Nuxt.js', value: 'nuxt' }
    ],
    type: 'list',
    default: 'next'
  },
  {
    name: 'building',
    message: 'Building mode:',
    type: 'list',
    choices: [
      { label: 'Basic (next build)', value: 'basic' },
      { label: 'Static (next build && next export)', value: 'static' }
    ],
    default: 'basic',
    required : answers.front === 'next'
  },
  {
    name: 'mode',
    message: 'Rendering mode:',
    type: 'list',
    choices: [
      { label: 'Universal (SSR / SSG)', value: 'universal' },
      { label: 'Single Page App', value: 'spa' }
    ],
    default: 'universal',
    required : answers.front === 'nuxt'
  },
  {
    name: 'target',
    message: 'Deployment target:',
    type: 'list',
    choices: [
      { label: 'Server (Node.js hosting)', value: 'server' },
      { label: 'Static (Static/JAMStack hosting)', value: 'static' }
    ],
    default: 'server',
    required : answers.front === 'nuxt'
  },
  {
    name: 'aspida',
    message: 'HTTP client of aspida:',
    choices: [
      { label: 'axios', value: 'axios' },
      { label: 'fetch', value: 'fetch' }
    ],
    type: 'list',
    default: 'axios'
  },
  {
    name: 'pm',
    message: 'Package manager:',
    choices: [
      { label: 'Yarn', value: 'yarn' },
      { label: 'Npm', value: 'npm' }
    ],
    type: 'list',
    default: 'yarn'
  },
  {
    name: 'daemon',
    message: 'Daemon process manager:',
    choices: [
      { label: 'None', value: 'none' },
      { label: 'PM2', value: 'pm2' }
    ],
    type: 'list',
    default: 'none'
  },
  {
    name: 'testing',
    message: 'Testing framework:',
    choices: [
      { label: 'None', value: 'none' },
      { label: 'Jest', value: 'jest' }
    ],
    type: 'list',
    default: 'none'
  },
  {
    name: 'orm',
    message: 'O/R mapping tool:',
    choices: [
      { label: 'Prisma (recommended)', value: 'prisma' },
      { label: 'TypeORM', value: 'typeorm' },
      { label: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'prisma'
  },
  {
    name: 'dbType',
    message: `Database type of ${answers.orm === 'prisma' ? 'Prisma' : 'TypeORM'}:`,
    choices: 
      answers.orm === 'prisma'
        ? [
            { label: 'MySQL', value: 'mysql' },
            { label: 'PostgreSQL', value: 'postgresql' },
            { label: 'SQLite', value: 'sqlite' }
          ]
        : [
            { label: 'MySQL', value: 'mysql' },
            { label: 'PostgreSQL', value: 'postgres' },
            { label: 'MongoDB', value: 'mongodb' },
            { label: 'Sql Server', value: 'mssql' },
            { label: 'MariaDB', value: 'mariadb' },
            { label: 'CockroachDB', value: 'cockroachdb' }
          ],
    type: 'list',
    default: 'mysql',
    required : answers.orm !== 'none'
  },
  {
    name: 'dbHost',
    message: 'server/prisma/.env HOST=',
    default: 'localhost',
    type: 'input',
    required : answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbHost',
    message: 'server/.env TYPEORM_HOST=',
    type: 'input',
    default: 'localhost',
    required : answers.orm === 'typeorm'
  },
  {
    name: 'dbPort',
    message: 'server/prisma/.env PORT=',
    type: 'input',
    default: `${dbInfo[(answers.dbType ?? 'mysql') as keyof typeof dbInfo].port}`,
    required : answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbPort',
    message: 'server/.env TYPEORM_PORT=',
    type: 'input',
    default: `${dbInfo[(answers.dbType ?? 'mysql') as keyof typeof dbInfo].port}`,
    required : answers.orm === 'typeorm'
  },
  {
    name: 'dbUser',
    message: 'server/prisma/.env USER=',
    type: 'input',
    required : answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbUser',
    message: 'server/.env TYPEORM_USERNAME=',
    type: 'input',
    required : answers.orm === 'typeorm'
  },
  {
    name: 'dbPass',
    message: 'server/prisma/.env PASSWORD=',
    type: 'input',
    required : answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbPass',
    message: 'server/.env TYPEORM_PASSWORD=',
    type: 'input',
    required : answers.orm === 'typeorm'
  },
  {
    name: 'dbName',
    message: 'server/prisma/.env DATABASE=',
    type: 'input',
    required : answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbName',
    message: 'server/.env TYPEORM_DATABASE=',
    type: 'input',
    required : answers.orm === 'typeorm'
  },
  {
    name: 'dbFile',
    message: 'server/prisma/.env DATABASE_FILE=',
    type: 'input',
    default: './dev.db',
    required : answers.orm === 'prisma' && answers.dbType === 'sqlite'
  }
]

return p.filter(prompt => prompt.required !== false)
}
