import { execFile } from 'node:child_process'
import { resolve } from 'node:path'
import { promisify } from 'node:util'

const run = promisify(execFile)

export default defineEventHandler(async (event) => {
  try {
    await run(process.execPath, [resolve(process.cwd(), 'scripts/seed.mjs')], { env: process.env, timeout: 15_000 })
  } catch {
    throw createError({ statusCode: 500, statusMessage: 'Could not add demo data' })
  }

  const sql = useDb()
  await sql`INSERT INTO audit_log (user_id, action, entity_type) VALUES (${event.context.admin.id}, 'seed', 'demo_data')`
  return { ok: true }
})
