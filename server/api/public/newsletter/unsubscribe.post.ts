export default defineEventHandler(async (event) => {
  rateLimit(event, 'newsletter-unsubscribe', 12)
  const body = await readBody<{ token?: string }>(event)
  const token = String(body.token || '')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)) {
    throw createError({ statusCode: 400, statusMessage: 'This unsubscribe link is invalid' })
  }
  const sql = useDb()
  const [subscriber] = await sql`UPDATE newsletter_subscriber SET status = 'unsubscribed' WHERE unsubscribe_token = ${token} AND status != 'unsubscribed' RETURNING email`
  if (!subscriber) throw createError({ statusCode: 404, statusMessage: 'Subscriber not found' })
  await notifyIntegrations('newsletter_unsubscribe', `${subscriber.email} unsubscribed from the newsletter.`)
  return { ok: true }
})
