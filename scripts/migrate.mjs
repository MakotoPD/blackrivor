import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import postgres from 'postgres'
import { hashPassword } from './lib/password.mjs'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required')

const sql = postgres(databaseUrl, { max: 1 })
const migrationsDir = resolve(process.cwd(), 'db/migrations')

try {
  await sql`SELECT pg_advisory_lock(86190422)`
  await sql`
    CREATE TABLE IF NOT EXISTS schema_migration (
      filename text PRIMARY KEY,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `

  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort()
  for (const filename of files) {
    const source = await readFile(resolve(migrationsDir, filename), 'utf8')
    const checksum = createHash('sha256').update(source).digest('hex')
    const [existing] = await sql`SELECT checksum FROM schema_migration WHERE filename = ${filename}`

    if (existing) {
      if (existing.checksum !== checksum) throw new Error(`Migration changed after apply: ${filename}`)
      continue
    }

    await sql.begin(async (transaction) => {
      await transaction.unsafe(source)
      await transaction`INSERT INTO schema_migration (filename, checksum) VALUES (${filename}, ${checksum})`
    })
    console.log(`Applied ${filename}`)
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@blackrivor.co.uk').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'change-me-now'
  const passwordHash = await hashPassword(password)
  await sql`
    INSERT INTO admin_user (email, password_hash)
    VALUES (${email}, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `
  console.log(`Admin ready: ${email}`)
} finally {
  await sql`SELECT pg_advisory_unlock(86190422)`.catch(() => {})
  await sql.end()
}

