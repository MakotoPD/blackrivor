export default defineEventHandler(async (event) => {
  rateLimit(event, 'admin-login', 10, 15 * 60 * 1000)
  const body = await readBody<{ email?: string, password?: string }>(event)
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!email || !password) throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })

  const sql = useDb()
  const [user] = await sql`SELECT id, email, name, password_hash FROM admin_user WHERE lower(email) = ${email}`
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  await sql`DELETE FROM admin_session WHERE expires_at < now()`
  await createAdminSession(event, user.id)
  return { user: { id: user.id, email: user.email, name: user.name } }
})

