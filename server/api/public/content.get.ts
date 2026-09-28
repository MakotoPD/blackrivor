export default defineEventHandler(async () => {
  const sql = useDb()
  const rows = await sql`SELECT key, value FROM site_content`
  return Object.fromEntries(rows.map(row => [row.key, row.value])) as Record<string, string>
})
