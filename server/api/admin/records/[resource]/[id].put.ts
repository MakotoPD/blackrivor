export default defineEventHandler(async (event) => {
  const resource = getRouterParam(event, 'resource') || ''
  const id = getRouterParam(event, 'id') || ''
  const config = getResourceConfig(resource)
  const body = cleanResourceBody(resource, await readBody<Record<string, unknown>>(event), true)
  if (resource === 'campaigns' && body.body !== undefined) {
    body.body = cleanNewsletterHtml(body.body)
    if (!String(body.body).replace(/<[^>]+>/g, '').trim()) throw createError({ statusCode: 400, statusMessage: 'Campaign content is required' })
  }
  if (resource === 'campaigns' && body.status === 'scheduled' && !body.scheduled_for) throw createError({ statusCode: 400, statusMessage: 'Choose a delivery date before scheduling' })
  const fields = Object.keys(body)
  if (!fields.length) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')
  const values = fields.map((field) => body[field]) as any[]
  const sql = useDb()
  const [before] = ['inventory', 'jobs', 'campaigns'].includes(resource) ? await sql.unsafe(`SELECT * FROM ${config.table} WHERE id = $1`, [id]) : []
  const [item] = await sql.unsafe(`UPDATE ${config.table} SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`, [...values, id] as any[])
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Record not found' })

  if (resource === 'jobs' && body.status) {
    await sql`INSERT INTO job_event (job_id, event_type, note) VALUES (${id}, 'status_changed', ${`Status changed to ${body.status}`})`
    if (before?.status !== item.status) await notifyIntegrations('job_status', `${item.reference}: ${item.title} changed from ${before?.status || 'unknown'} to ${item.status}.`)
  }
  if (resource === 'campaigns') {
    const eventType = item.status !== before?.status && ['scheduled', 'sent', 'cancelled'].includes(item.status) ? item.status : 'updated'
    await sql`INSERT INTO newsletter_campaign_event (campaign_id, user_id, event_type, note) VALUES (${id}, ${event.context.admin.id}, ${eventType}, ${eventType === 'updated' ? 'Campaign content updated' : `Campaign ${eventType}`})`
  }
  if (resource === 'inventory') {
    const isLow = Number(item.remaining_metres) <= Number(item.reorder_level)
    const crossedThreshold = Number(before?.remaining_metres) > Number(before?.reorder_level)
    const reducedWhileLow = Number(item.remaining_metres) < Number(before?.remaining_metres)
    if (isLow && (crossedThreshold || reducedWhileLow)) await notifyIntegrations('low_stock', `${item.brand} ${item.name} (${item.colour}) has ${item.remaining_metres}m remaining.`)
  }
  await sql`INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES (${event.context.admin.id}, 'update', ${resource}, ${id})`
  return { item }
})
