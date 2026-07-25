import knex from 'knex'

export const postgresql = app => {
  const config = app.get('postgresql')

  if (process.env.PG_SSL === 'true' || process.env.DATABASE_SSL === 'true') {
    config.connection.ssl = { rejectUnauthorized: false }
  }

  const db = knex(config)

  app.set('mysqlClient', db)
}
