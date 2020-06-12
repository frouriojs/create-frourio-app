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
      { name: 'Nuxt.ts', value: 'nuxt' },
      { name: 'Next.ts', value: 'next' },
      { name: 'None', value: 'none' }
    ],
    type: 'list',
    default: 'nuxt'
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
    message: 'Choose the database type',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'MySQL', value: 'mysql' },
      { name: 'Postgres', value: 'postgres' },
      { name: 'MongoDB', value: 'mongodb' },
      { name: 'Microsoft Sql Server', value: 'mssql' },
      { name: 'MariaDB', value: 'mariadb' },
      { name: 'CockroachDB', value: 'cockroachdb' }
    ],
    type: 'list',
    default: 'none'
  },
  {
    name: 'dbPort',
    message: 'Database port',
    default: answers => dbInfo[answers.dbType].port,
    when: answers => answers.dbType !== 'none'
  },
  {
    name: 'dbUser',
    message: 'Database username',
    when: answers => answers.dbType !== 'none'
  },
  {
    name: 'dbPass',
    message: 'Database password',
    when: answers => answers.dbType !== 'none'
  },
  {
    name: 'dbName',
    message: 'Database name',
    when: answers => answers.dbType !== 'none'
  }
]
