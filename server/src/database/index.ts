import { knex as setupKnex, Knex } from 'knex'
import { env } from '../env'

export const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  pool: {
    /* eslint-disable-next-line */
    afterCreate: (conn: any, cb: Function) => conn.run('PRAGMA foreign_keys = ON', cb),
  },
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
}

export const knex = setupKnex(config)
