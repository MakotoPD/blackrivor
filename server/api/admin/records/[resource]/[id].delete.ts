export default defineEventHandler(async (event) => {
  const resource = getRouterParam(event, 'resource') || ''
  const id = getRouterParam(event, 'id') || ''
  const config = getResourceConfig(resource)
  if (resource === 'enquiries') throw createError({ statusCode: 405, statusMessage: 'Archive enquiries by changing their status' })
  if (resource === 'campaigns') throw createError({ statusCode: 405, statusMessage: 'Campaigns are retained for newsletter history' })
  const sql = useDb()
  const [item] = await sql.unsafe(`DELETE FROM ${config.table} WHERE id = $1 RETURNING id`, [id])
  if (!item) throw createError({ statusCode: 404, statusMessage: 'Record not found' })
  await sql`INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES (${event.context.admin.id}, 'delete', ${resource}, ${id})`
  return { ok: true }
})
