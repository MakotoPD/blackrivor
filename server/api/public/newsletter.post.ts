export default defineEventHandler(async (event) => {
  rateLimit(event, 'newsletter', 6)
  const body = await readBody<{ email?: string, consent?: boolean }>(event)
  const email = String(body.email || '').trim().toLowerCase()
  if (!/^\S+@\S+\.\S+$/.test(email)) throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address' })
  if (body.consent !== true) throw createError({ statusCode: 400, statusMessage: 'Consent is required' })

  const sql = useDb()
  const [existing] = await sql`SELECT id FROM newsletter_subscriber WHERE lower(email) = ${email}`
  if (existing) {
    await sql`UPDATE newsletter_subscriber SET status = 'active', consent_at = now(), source = 'website' WHERE id = ${existing.id}`
  } else {
    await sql`INSERT INTO newsletter_subscriber (email, source) VALUES (${email}, 'website')`
  }
  setResponseStatus(event, 201)
  return { ok: true }
})

