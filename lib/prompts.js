const dbInfo = require('./dbInfo')

module.exports = [
  {
    name: 'name',
    message: 'Project name:',
    default: '{outFolder}'
  },
  {
    name: 'server',
    message: 'Core framework of frourio:',
    choices: [
      { name: 'Fastify (5x faster than Express)', value: 'fastify' },
      { name: 'Express', value: 'express' }
    ],
    type: 'list',
    default: 'fastify'
  },
  {
    name: 'front',
    message: 'Frontend framework:',
    choices: [
      { name: 'Next.js', value: 'next' },
      { name: 'Nuxt.js', value: 'nuxt' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'next'
  },
  {
    name: 'building',
    message: 'Building mode:',
    type: 'list',
    choices: [
      { name: 'Basic (next build)', value: 'basic' },
      { name: 'Static (next build && next export)', value: 'static' }
    ],
    default: 'basic',
    when: answers => answers.front === 'next'
  },
  {
    name: 'mode',
    message: 'Rendering mode:',
    type: 'list',
    choices: [
      { name: 'Universal (SSR / SSG)', value: 'universal' },
      { name: 'Single Page App', value: 'spa' }
    ],
    default: 'universal',
    when: answers => answers.front === 'nuxt'
  },
  {
    name: 'target',
    message: 'Deployment target:',
    type: 'list',
    choices: [
      { name: 'Server (Node.js hosting)', value: 'server' },
      { name: 'Static (Static/JAMStack hosting)', value: 'static' }
    ],
    default: 'server',
    when: answers => answers.front === 'nuxt'
  },
  {
    name: 'aspida',
    message: 'HTTP client of aspida:',
    choices: [
      { name: 'axios', value: 'axios' },
      { name: 'fetch', value: 'fetch' }
    ],
    type: 'list',
    default: 'axios',
    when: answers => answers.front !== 'none'
  },
  {
    name: 'pm',
    message: 'Package manager:',
    choices: [
      { name: 'Yarn', value: 'yarn' },
      { name: 'Npm', value: 'npm' }
    ],
    type: 'list',
    default: 'yarn'
  },
  {
    name: 'daemon',
    message: 'Daemon process manager:',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'PM2', value: 'pm2' }
    ],
    type: 'list',
    default: 'none'
  },
  {
    name: 'orm',
    message: 'O/R mapping tool:',
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
    message: answers => `Database type of ${answers.orm === 'prisma' ? 'Prisma' : 'TypeORM'}:`,
    choices: answers =>
      answers.orm === 'prisma'
        ? [
            { name: 'MySQL', value: 'mysql' },
            { name: 'PostgreSQL', value: 'postgresql' },
            { name: 'SQLite', value: 'sqlite' }
          ]
        : [
            { name: 'MySQL', value: 'mysql' },
            { name: 'PostgreSQL', value: 'postgres' },
            { name: 'MongoDB', value: 'mongodb' },
            { name: 'Sql Server', value: 'mssql' },
            { name: 'MariaDB', value: 'mariadb' },
            { name: 'CockroachDB', value: 'cockroachdb' }
          ],
    type: 'list',
    default: 'mysql',
    when: answers => answers.orm !== 'none'
  },
  {
    name: 'dbHost',
    message: 'server/prisma/.env HOST=',
    default: 'localhost',
    when: answers => answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbHost',
    message: 'server/.env TYPEORM_HOST=',
    default: 'localhost',
    when: answers => answers.orm === 'typeorm'
  },
  {
    name: 'dbPort',
    message: 'server/prisma/.env PORT=',
    default: answers => dbInfo[answers.dbType].port,
    when: answers => answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbPort',
    message: 'server/.env TYPEORM_PORT=',
    default: answers => dbInfo[answers.dbType].port,
    when: answers => answers.orm === 'typeorm'
  },
  {
    name: 'dbUser',
    message: 'server/prisma/.env USER=',
    when: answers => answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbUser',
    message: 'server/.env TYPEORM_USERNAME=',
    when: answers => answers.orm === 'typeorm'
  },
  {
    name: 'dbPass',
    message: 'server/prisma/.env PASSWORD=',
    when: answers => answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbPass',
    message: 'server/.env TYPEORM_PASSWORD=',
    when: answers => answers.orm === 'typeorm'
  },
  {
    name: 'dbName',
    message: 'server/prisma/.env DATABASE=',
    when: answers => answers.orm === 'prisma' && answers.dbType !== 'sqlite'
  },
  {
    name: 'dbName',
    message: 'server/.env TYPEORM_DATABASE=',
    when: answers => answers.orm === 'typeorm'
  },
  {
    name: 'dbFile',
    message: 'server/prisma/.env DATABASE_FILE=',
    default: './dev.db',
    when: answers => answers.orm === 'prisma' && answers.dbType === 'sqlite'
  }
]
