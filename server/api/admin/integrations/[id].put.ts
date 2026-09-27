const channels: Record<string, string[]> = {
  email: ['host', 'port', 'secure', 'username', 'from', 'to'],
  whatsapp: ['phoneNumberId', 'to', 'templateName', 'templateLanguage', 'apiVersion'],
  telegram: ['chatId'],
  discord: [],
  webhook: ['url']
}
const allowedEvents = ['new_enquiry', 'new_booking', 'low_stock', 'job_status', 'newsletter_unsubscribe']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') || ''
  const body = await readBody<{ enabled?: boolean, configuration?: Record<string, unknown>, secret?: string, events?: string[] }>(event)
  const sql = useDb()
  const [existing] = await sql`SELECT id, channel, secret_encrypted FROM notification_integration WHERE id = ${id}`
  if (!existing) throw createError({ statusCode: 404, statusMessage: 'Integration not found' })

  const fields = channels[existing.channel]
  if (!fields) throw createError({ statusCode: 400, statusMessage: 'Unsupported integration channel' })
  const configuration = Object.fromEntries(fields.map(key => [key, String(body.configuration?.[key] || '').trim().slice(0, 500)]))
  if (existing.channel === 'webhook' && configuration.url) {
    try {
      const url = new URL(configuration.url)
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error()
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'Enter a valid webhook URL' })
    }
  }
  const events = Array.isArray(body.events) ? body.events.filter(value => allowedEvents.includes(value)) : []
  const secretValue = String(body.secret || '').trim()
  if (existing.channel === 'discord' && secretValue && !isDiscordWebhookUrl(secretValue)) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid Discord webhook URL' })
  }
  const secretEncrypted = secretValue ? encryptIntegrationSecret(secretValue) : existing.secret_encrypted
  if (body.enabled && (!fields.every(key => configuration[key]) || !secretEncrypted && existing.channel !== 'webhook')) {
    throw createError({ statusCode: 400, statusMessage: 'Complete the required connection details before enabling this integration' })
  }

  const [item] = await sql`
    UPDATE notification_integration
    SET enabled = ${body.enabled === true}, configuration = ${sql.json(configuration)}, events = ${events}, secret_encrypted = ${secretEncrypted}
    WHERE id = ${id}
    RETURNING id, channel, enabled, configuration, events, secret_encrypted IS NOT NULL AS secret_configured, last_test_at, last_error, updated_at
  `
  await sql`INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES (${event.context.admin.id}, 'update', 'notification_integration', ${id})`
  return { item }
})
