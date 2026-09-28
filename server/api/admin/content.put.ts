export default defineEventHandler(async (event) => {
  const rows = siteContentOverrides(await readBody(event))
  const sql = useDb()
  await sql.begin(async (transaction) => {
    await transaction`DELETE FROM site_content`
    if (rows.length) await transaction`INSERT INTO site_content ${transaction(rows)}`
  })
  await sql`INSERT INTO audit_log (user_id, action, entity_type) VALUES (${event.context.admin.id}, 'update', 'site_content')`
  return Object.fromEntries(rows.map(row => [row.key, row.value]))
})
