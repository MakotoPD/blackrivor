import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

export const SESSION_COOKIE = 'blackrivor_session'
const scrypt = promisify(scryptCallback)

function tokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function createAdminSession(event: Parameters<typeof setCookie>[0], userId: string) {
  const sql = useDb()
  const token = randomBytes(32).toString('base64url')
  const hash = tokenHash(token)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  await sql`INSERT INTO admin_session (user_id, token_hash, expires_at) VALUES (${userId}, ${hash}, ${expiresAt})`
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt
  })
}

export async function getAdminSession(event: Parameters<typeof getCookie>[0]) {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  const sql = useDb()
  const [user] = await sql`
    SELECT u.id, u.email, u.name
    FROM admin_session s
    JOIN admin_user u ON u.id = s.user_id
    WHERE s.token_hash = ${tokenHash(token)} AND s.expires_at > now()
  `
  return user || null
}

export async function destroyAdminSession(event: Parameters<typeof deleteCookie>[0]) {
  const token = getCookie(event, SESSION_COOKIE)
  if (token) {
    const sql = useDb()
    await sql`DELETE FROM admin_session WHERE token_hash = ${tokenHash(token)}`
  }
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export async function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, hash] = String(stored).split('$')
  if (algorithm !== 'scrypt' || !salt || !hash) return false
  const derived = Buffer.from(await scrypt(password, salt, 64) as ArrayBuffer)
  const expected = Buffer.from(hash, 'hex')
  return derived.length === expected.length && timingSafeEqual(derived, expected)
}
