export default defineEventHandler(async (event) => {
  const resource = getRouterParam(event, 'resource') || ''
  const config = getResourceConfig(resource)
  const body = cleanResourceBody(resource, await readBody<Record<string, unknown>>(event))

  if (resource === 'bookings') {
    const startsAt = new Date(String(body.starts_at))
    const endsAt = new Date(String(body.ends_at))
    if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) {
      throw createError({ statusCode: 400, statusMessage: 'Enter a valid start and end time' })
    }
    const sql = useDb()
    const [conflict] = await sql`SELECT id FROM booking WHERE status != 'cancelled' AND starts_at < ${endsAt} AND ends_at > ${startsAt} LIMIT 1`
    if (conflict) throw createError({ statusCode: 409, statusMessage: 'This booking overlaps another active booking' })
  }

  const fields = Object.keys(body)
  if (!fields.length) throw createError({ statusCode: 400, statusMessage: 'No fields to save' })
  const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ')
  const sql = useDb()
  const [item] = await sql.unsafe(
    `INSERT INTO ${config.table} (${fields.join(', ')}) VALUES (${placeholders}) RETURNING *`,
    fields.map((field) => body[field]) as any[]
  )
  if (!item) throw createError({ statusCode: 500, statusMessage: 'Record was not created' })
  await sql`INSERT INTO audit_log (user_id, action, entity_type, entity_id) VALUES (${event.context.admin.id}, 'create', ${resource}, ${item.id})`
  setResponseStatus(event, 201)
  return { item }
})
