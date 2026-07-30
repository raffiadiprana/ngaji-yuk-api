import knex from 'knex'

export const postgresql = app => {
  let config = app.get('postgresql')

  if (process.env.DATABASE_URL) {
    config = {
      client: process.env.PG_CLIENT || 'pg',
      connection: process.env.DATABASE_URL
    }
  }

  if (process.env.PG_SSL === 'true' || process.env.DATABASE_SSL === 'true') {
    if (typeof config.connection === 'string') {
      config.connection = {
        connectionString: config.connection,
        ssl: { rejectUnauthorized: false }
      }
    } else {
      config.connection.ssl = { rejectUnauthorized: false }
    }
  }

  const db = knex(config)

  app.set('postgresql', db)
}
