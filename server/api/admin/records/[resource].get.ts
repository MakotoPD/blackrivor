export default defineEventHandler(async (event) => {
  const resource = getRouterParam(event, 'resource') || ''
  const config = getResourceConfig(resource)
  const query = getQuery(event)
  const search = String(query.q || '').trim()
  const sql = useDb()
  const where = search
    ? `WHERE concat_ws(' ', ${config.search.map((column) => `COALESCE(${column}::text, '')`).join(', ')}) ILIKE $1`
    : ''
  const values = search ? [`%${search}%`] : []
  const rows = await sql.unsafe(`SELECT * FROM ${config.table} ${where} ORDER BY ${config.order} LIMIT 250`, values)
  return { items: rows }
})

