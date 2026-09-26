type Campaign = { id: string, subject: string, preview_text: string | null, body: string, status: string }
type Subscriber = { id: string, email: string, unsubscribe_token: string }

export async function sendNewsletterCampaign(id: string, userId?: string) {
  const sql = useDb()
  const [campaign] = await sql<Campaign[]>`
    UPDATE newsletter_campaign SET status = 'sending'
    WHERE id = ${id} AND status IN ('draft', 'scheduled')
    RETURNING id, subject, preview_text, body, status
  `
  if (!campaign) throw createError({ statusCode: 409, statusMessage: 'This campaign is already sending, sent or cancelled' })

  const [integration] = await sql`SELECT configuration, secret_encrypted FROM notification_integration WHERE channel = 'email' AND enabled = true`
  if (!integration?.secret_encrypted) {
    await sql`UPDATE newsletter_campaign SET status = 'draft' WHERE id = ${id}`
    throw createError({ statusCode: 400, statusMessage: 'Enable and configure the SMTP email integration first' })
  }
  const subscribers = await sql<Subscriber[]>`SELECT id, email, unsubscribe_token FROM newsletter_subscriber WHERE status = 'active' ORDER BY created_at`
  if (!subscribers.length) {
    await sql`UPDATE newsletter_campaign SET status = 'draft' WHERE id = ${id}`
    throw createError({ statusCode: 400, statusMessage: 'There are no active newsletter subscribers' })
  }

  const config = integration.configuration as Record<string, string>
  const transporter = createSmtpTransport(config, decryptIntegrationSecret(integration.secret_encrypted))
  const runtime = useRuntimeConfig()
  const siteUrl = String(runtime.public.siteUrl || 'http://localhost:3000').replace(/\/$/, '')
  let sent = 0

  // ponytail: sequential delivery is SMTP-friendly for a studio-sized list; move to a queue when volume warrants it.
  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${siteUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`
    try {
      await transporter.sendMail({
        from: config.from,
        to: subscriber.email,
        subject: campaign.subject,
        text: newsletterPlainText(campaign.body, unsubscribeUrl),
        html: renderNewsletterHtml(campaign.body, unsubscribeUrl, siteUrl),
        headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
      })
      sent++
      await sql`INSERT INTO newsletter_delivery (campaign_id, subscriber_id, email, status) VALUES (${id}, ${subscriber.id}, ${subscriber.email}, 'sent')`
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'Unknown SMTP error'
      await sql`INSERT INTO newsletter_delivery (campaign_id, subscriber_id, email, status, error) VALUES (${id}, ${subscriber.id}, ${subscriber.email}, 'failed', ${detail})`
    }
  }

  const status = sent ? 'sent' : 'draft'
  await sql`UPDATE newsletter_campaign SET status = ${status}, sent_at = ${sent ? new Date() : null}, recipient_count = ${sent} WHERE id = ${id}`
  await sql`INSERT INTO newsletter_campaign_event (campaign_id, user_id, event_type, note) VALUES (${id}, ${userId || null}, ${sent ? 'sent' : 'updated'}, ${sent ? `Delivered to ${sent} of ${subscribers.length} active subscribers` : 'SMTP delivery failed for every subscriber'})`
  if (!sent) throw createError({ statusCode: 502, statusMessage: 'SMTP rejected every newsletter delivery' })
  return { sent, failed: subscribers.length - sent }
}
