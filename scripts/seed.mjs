import postgres from 'postgres'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required')

const sql = postgres(databaseUrl, { max: 1 })

try {
  const [customer] = await sql`
    INSERT INTO customer (name, email, phone, postcode, vehicle_registration, notes, marketing_consent)
    VALUES ('James Wilson', 'james@example.co.uk', '+44 7700 900123', 'SR2 7AA', 'NX22 WRV', 'Prefers WhatsApp updates.', true)
    ON CONFLICT DO NOTHING
    RETURNING id
  `

  if (customer) {
    await sql`
      INSERT INTO booking (customer_id, title, service, vehicle, registration, starts_at, ends_at, status, deposit_amount, notes)
      VALUES (${customer.id}, 'Satin charcoal colour change', 'Full colour wrap', '2022 BMW M4', 'NX22 WRV', now() + interval '7 days', now() + interval '10 days', 'confirmed', 350, 'Film ordered and deposit received.')
    `
    await sql`
      INSERT INTO job (customer_id, title, service, vehicle, registration, status, quoted_amount, deposit_amount, due_date, notes)
      VALUES (${customer.id}, 'Satin charcoal colour change', 'Full colour wrap', '2022 BMW M4', 'NX22 WRV', 'scheduled', 980, 350, current_date + 10, 'Full exterior excluding door shuts.')
    `
  }

  await sql`
    INSERT INTO inventory_item (brand, name, colour, finish, sku, remaining_metres, reorder_level, cost_per_metre, location)
    VALUES
      ('3M', '2080', 'Deep Black', 'Gloss', 'G12', 18.5, 8, 24.5, 'Rack A1'),
      ('Avery Dennison', 'Supreme Wrapping Film', 'Satin Dark Grey', 'Satin', 'SWF-SDG', 6.2, 8, 26, 'Rack A2'),
      ('XPEL', 'Ultimate Plus', 'Clear', 'Gloss PPF', 'UPLUS', 12, 6, 42, 'Rack P1')
    ON CONFLICT DO NOTHING
  `
  console.log('Demo data added')
} finally {
  await sql.end()
}

