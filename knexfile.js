import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function resolveDbConfig() {
  const envUrl = process.env.DATABASE_URL
  if (envUrl) {
    return {
      client: process.env.PG_CLIENT || 'pg',
      connection: envUrl
    }
  }
  const candidates = [
    path.resolve(__dirname, 'config', 'default.json'),
    path.resolve(__dirname, 'config/default.json')
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = JSON.parse(fs.readFileSync(p, 'utf8'))
        const db = raw.postgresql || {}
        if (db.connection) return db
      } catch (e) {
        console.error('Failed to read db config:', e)
      }
    }
  }
  return {
    client: process.env.PG_CLIENT || 'pg',
    connection: ''
  }
}

const db = resolveDbConfig()

export default {
  client: db.client || 'pg',
  connection: db.connection,
  migrations: {
    directory: path.resolve(__dirname, 'migrations')
  }
}
