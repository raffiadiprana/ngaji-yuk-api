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

function addSslIfNeeded(conn) {
  if (!conn || typeof conn !== 'string') return conn
  const needSsl = ['true', '1', 'yes'].includes(String(process.env.DATABASE_SSL || process.env.PG_SSL || '').toLowerCase())
  if (!needSsl) return conn
  const hasSsl = /[?&]sslmode=/.test(conn)
  const hasPgbouncer = /[?&]pgbouncer=/.test(conn)
  if (hasSsl) return conn
  const sep = conn.includes('?') ? '&' : '?'
  const suffix = `${sep}sslmode=require${hasPgbouncer ? '' : '&pgbouncer=true'}`
  return conn + suffix
}

export default {
  client: db.client || 'pg',
  connection: addSslIfNeeded(db.connection),
  migrations: {
    directory: path.resolve(__dirname, 'migrations')
  }
}
