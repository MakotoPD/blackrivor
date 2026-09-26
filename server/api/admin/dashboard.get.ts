export default defineEventHandler(async () => {
  const sql = useDb()
  const [[counts], revenue, upcoming, lowStock, enquiries] = await Promise.all([
    sql`
      SELECT
        (SELECT count(*)::int FROM customer) AS clients,
        (SELECT count(*)::int FROM enquiry WHERE status = 'new') AS new_enquiries,
        (SELECT count(*)::int FROM booking WHERE starts_at >= now() AND status NOT IN ('completed', 'cancelled')) AS upcoming_bookings,
        (SELECT count(*)::int FROM inventory_item WHERE remaining_metres <= reorder_level) AS low_stock
    `,
    sql`SELECT COALESCE(sum(quoted_amount), 0)::float AS total FROM job WHERE status = 'complete' AND completed_at >= date_trunc('month', now())`,
    sql`SELECT id, title, vehicle, registration, starts_at, ends_at, status FROM booking WHERE starts_at >= now() AND status != 'cancelled' ORDER BY starts_at LIMIT 5`,
    sql`SELECT id, brand, name, colour, finish, remaining_metres, reorder_level FROM inventory_item WHERE remaining_metres <= reorder_level ORDER BY remaining_metres LIMIT 5`,
    sql`SELECT id, name, vehicle, service, status, created_at FROM enquiry ORDER BY created_at DESC LIMIT 5`
  ])
  return { counts: { ...counts, month_revenue: revenue[0]?.total || 0 }, upcoming, lowStock, enquiries }
})

