export default defineEventHandler(async () => {
  const sql = useDb()
  const items = await sql`
    SELECT event.id, event.event_type, event.note, event.created_at, campaign.subject, campaign.status,
           COALESCE(admin_user.name, 'System') AS user_name
    FROM newsletter_campaign_event event
    JOIN newsletter_campaign campaign ON campaign.id = event.campaign_id
    LEFT JOIN admin_user ON admin_user.id = event.user_id
    ORDER BY event.created_at DESC LIMIT 100
  `
  return { items }
})
