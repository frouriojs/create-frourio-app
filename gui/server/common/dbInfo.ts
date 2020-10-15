export const dbInfo = {
  mysql: { name: 'mysql', ver: '^2.18.1', port: 3306 },
  postgres: { name: 'pg', ver: '^8.3.3', port: 5432 },
  postgresql: { name: '', ver: '', port: 5432 }, // used in prisma only
  mongodb: { name: 'mongodb', ver: '^3.5.9', port: 27017 },
  mssql: { name: 'mssql', ver: '^6.2.0', port: 1433 },
  mariadb: { name: 'mariadb', ver: '^2.4.0', port: 3306 },
  cockroachdb: { name: 'pg', ver: '^8.2.1', port: 26257 }
}
