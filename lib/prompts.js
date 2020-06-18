const dbInfo = require('./dbInfo')

module.exports = [
  {
    name: 'name',
    message: 'Project name',
    default: '{outFolder}'
  },
  {
    name: 'front',
    message: 'Choose frontend framework',
    choices: [
      { name: 'Next.js', value: 'next' },
      { name: 'Nuxt.js', value: 'nuxt' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'next'
  },
  {
    name: 'mode',
    message: 'Choose rendering mode',
    type: 'list',
    choices: [
      { name: 'Universal (SSR / Static)', value: 'universal' },
      { name: 'Single Page App', value: 'spa' }
    ],
    default: 'universal',
    when: answers => answers.front === 'nuxt'
  },
  {
    name: 'aspida',
    message: 'Choose HTTP client of aspida',
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
    message: 'Choose the package manager',
    choices: [
      { name: 'Yarn', value: 'yarn' },
      { name: 'Npm', value: 'npm' }
    ],
    type: 'list',
    default: 'yarn'
  },
  {
    name: 'daemon',
    message: 'Choose the daemon process manager',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'PM2', value: 'pm2' }
    ],
    type: 'list',
    default: 'none'
  },
  {
    name: 'dbType',
    message: 'Choose the database type of TypeORM',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'MySQL', value: 'mysql' },
      { name: 'PostgreSQL', value: 'postgres' },
      { name: 'MongoDB', value: 'mongodb' },
      { name: 'Sql Server', value: 'mssql' },
      { name: 'MariaDB', value: 'mariadb' },
      { name: 'CockroachDB', value: 'cockroachdb' }
    ],
    type: 'list',
    default: 'none'
  },
  {
    name: 'dbPort',
    message: '.env TYPEORM_PORT=',
    default: answers => dbInfo[answers.dbType].port,
    when: answers => answers.dbType !== 'none'
  },
  {
    name: 'dbUser',
    message: '.env TYPEORM_USERNAME=',
    when: answers => answers.dbType !== 'none'
  },
  {
    name: 'dbPass',
    message: '.env TYPEORM_PASSWORD=',
    when: answers => answers.dbType !== 'none'
  },
  {
    name: 'dbName',
    message: '.env TYPEORM_DATABASE=',
    when: answers => answers.dbType !== 'none'
  }
]
