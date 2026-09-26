export default defineEventHandler(async (event) => {
  const resource = getRouterParam(event, 'resource') || ''
  const id = getRouterParam(event, 'id') || ''
  const config = getResourceConfig(resource)
  const body = cleanResourceBody(resource, await readBody<Record<string, unknown>>(event), true)
  const fields = Object.keys(body)
  if (!fields.length) throw createError({ statusCode: 400, statusMessage: 'No fields to update' })

  const assignments = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')
  const values = fields.map((field) => body[field]) as any[]
  const sql = useDb()
  const [item] = await sql.unsafe(`UPDATE ${config.table} SET ${assignments} WHERE id = $${fields.length + 1} RETURNING *`, [...values, id] as any[])
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Record not found' })

  if (resource === 'jobs' && body.status) {
    await sql`INSERT INTO job_event (job_id, event_type, note) VALUES (${id}, 'status_changed', ${`Status changed to ${body.status}`})`
  }
  await sql`INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES (${event.context.admin.id}, 'update', ${resource}, ${id})`
  return { item }
})
