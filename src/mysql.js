import knex from 'knex'

export const mysql = app => {
  const config = app.get('mysql')

  if (process.env.MYSQL_SSL === 'true') {
    config.connection.ssl = { rejectUnauthorized: false }
  }

  const db = knex(config)

  app.set('mysqlClient', db)
}
