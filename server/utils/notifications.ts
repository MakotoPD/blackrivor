type NotificationRow = {
  id: string
  channel: 'email' | 'whatsapp' | 'telegram' | 'discord' | 'webhook'
  configuration: Record<string, string>
  secret_encrypted: string | null
}

const eventLabels: Record<string, string> = {
  new_enquiry: 'New website enquiry',
  new_booking: 'New booking',
  low_stock: 'Low film stock',
  job_status: 'Job status changed',
  newsletter_unsubscribe: 'Newsletter unsubscribe'
}

export function isDiscordWebhookUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && ['discord.com', 'discordapp.com'].includes(url.hostname) && /^\/api\/webhooks\/\d+\/[^/]+\/?$/.test(url.pathname)
  } catch {
    return false
  }
}

async function sendNotification(row: NotificationRow, eventType: string, message: string) {
  const config = row.configuration || {}
  const secret = row.secret_encrypted ? decryptIntegrationSecret(row.secret_encrypted) : ''
  const title = eventLabels[eventType] || eventType
  const signal = AbortSignal.timeout(8000)

  if (row.channel === 'email') {
    const transporter = createSmtpTransport(config, secret)
    await transporter.sendMail({ from: config.from, to: config.to, subject: `[Black Rivor] ${title}`, text: message })
  } else if (row.channel === 'whatsapp') {
    if (!config.phoneNumberId || !config.to || !config.templateName) throw new Error('WhatsApp configuration is incomplete')
    const response = await fetch(`https://graph.facebook.com/${config.apiVersion || 'v23.0'}/${encodeURIComponent(config.phoneNumberId)}/messages`, {
      method: 'POST', signal,
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: config.to,
        type: 'template',
        template: {
          name: config.templateName,
          language: { code: config.templateLanguage || 'en_GB' },
          components: [{ type: 'body', parameters: [{ type: 'text', text: `${title}: ${message}`.slice(0, 1024) }] }]
        }
      })
    })
    if (!response.ok) throw new Error(`WhatsApp Cloud API returned ${response.status}`)
  } else if (row.channel === 'telegram') {
    if (!config.chatId) throw new Error('Telegram chat ID is missing')
    const response = await fetch(`https://api.telegram.org/bot${secret}/sendMessage`, {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: config.chatId, text: `*${title}*\n${message}`, parse_mode: 'Markdown' })
    })
    if (!response.ok) throw new Error(`Telegram returned ${response.status}`)
  } else if (row.channel === 'discord') {
    if (!isDiscordWebhookUrl(secret)) throw new Error('Discord webhook URL is invalid')
    const response = await fetch(secret, {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Black Rivor',
        embeds: [{ title, description: message.slice(0, 4000), color: 0xc9ff32, timestamp: new Date().toISOString() }]
      })
    })
    if (!response.ok) throw new Error(`Discord returned ${response.status}`)
  } else {
    if (!config.url) throw new Error('Webhook URL is missing')
    const response = await fetch(config.url, {
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json', ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({ event: eventType, title, message, occurredAt: new Date().toISOString() })
    })
    if (!response.ok) throw new Error(`Webhook returned ${response.status}`)
  }
}

async function deliverAndLog(integration: NotificationRow, eventType: string, message: string) {
  const sql = useDb()
  try {
    await sendNotification(integration, eventType, message)
    await sql`INSERT INTO notification_delivery (integration_id, channel, event_type, status, message) VALUES (${integration.id}, ${integration.channel}, ${eventType}, 'sent', ${message})`
    await sql`UPDATE notification_integration SET last_error = NULL WHERE id = ${integration.id}`
    return { ok: true }
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown provider error'
    await sql`INSERT INTO notification_delivery (integration_id, channel, event_type, status, message, error) VALUES (${integration.id}, ${integration.channel}, ${eventType}, 'failed', ${message}, ${detail})`
    await sql`UPDATE notification_integration SET last_error = ${detail} WHERE id = ${integration.id}`
    return { ok: false, error: detail }
  }
}

export async function notifyIntegrations(eventType: string, message: string) {
  const sql = useDb()
  const integrations = await sql<NotificationRow[]>`SELECT id, channel, configuration, secret_encrypted FROM notification_integration WHERE enabled = true AND ${eventType} = ANY(events)`
  await Promise.all(integrations.map(integration => deliverAndLog(integration, eventType, message)))
}

export async function testIntegration(id: string) {
  const sql = useDb()
  const [integration] = await sql<NotificationRow[]>`SELECT id, channel, configuration, secret_encrypted FROM notification_integration WHERE id = ${id}`
  if (!integration) throw createError({ statusCode: 404, statusMessage: 'Integration not found' })
  const result = await deliverAndLog(integration, 'test', 'Your Black Rivor notification integration is connected.')
  await sql`UPDATE notification_integration SET last_test_at = now() WHERE id = ${id}`
  return result
}
