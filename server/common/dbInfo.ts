export const prismaDBs = {
  mysql: { port: 3306 },
  postgresql: { port: 5432 }
}

export const typeormDBs = {
  mysql: { name: 'mysql', ver: '^2.18.1', port: 3306 },
  postgres: { name: 'pg', ver: '^8.5.1', port: 5432 }
}
