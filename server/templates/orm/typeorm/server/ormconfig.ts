import { ConnectionOptions } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

const {
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT
} = process.env

const options: ConnectionOptions = {
  type: '<%= typeormDB %>',
  host: TYPEORM_HOST,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  port: Number(TYPEORM_PORT),
  synchronize: false,
  logging: false,
  entities: ['entity/**/*.ts'],
  migrations: ['migration/**/*.ts'],
  cli: {
    migrationsDir: 'migration'
  }
}

export = options
