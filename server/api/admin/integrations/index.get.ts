export default defineEventHandler(async () => {
  const sql = useDb()
  const integrations = await sql`
    SELECT id, channel, enabled, configuration, events, secret_encrypted IS NOT NULL AS secret_configured,
           last_test_at, last_error, updated_at
    FROM notification_integration
    ORDER BY CASE channel WHEN 'email' THEN 1 WHEN 'whatsapp' THEN 2 WHEN 'telegram' THEN 3 WHEN 'discord' THEN 4 ELSE 5 END
  `
  const deliveries = await sql`
    SELECT id, channel, event_type, status, message, error, created_at
    FROM notification_delivery ORDER BY created_at DESC LIMIT 50
  `
  return { integrations, deliveries }
})
