import postgres from 'postgres'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error('DATABASE_URL is required')

const sql = postgres(databaseUrl, { max: 1 })

try {
  const [customer] = await sql`
    INSERT INTO customer (name, email, phone, postcode, vehicle_registration, notes, marketing_consent)
    VALUES ('James Wilson', 'james@example.co.uk', '+44 7700 900123', 'SR2 7AA', 'NX22 WRV', 'Prefers WhatsApp updates.', true)
    ON CONFLICT (lower(email)) WHERE email IS NOT NULL DO UPDATE
      SET name = EXCLUDED.name, phone = EXCLUDED.phone, postcode = EXCLUDED.postcode,
          vehicle_registration = EXCLUDED.vehicle_registration, notes = EXCLUDED.notes
    RETURNING id
  `

  await sql`
    INSERT INTO booking (customer_id, title, service, vehicle, registration, starts_at, ends_at, status, deposit_amount, notes)
    SELECT ${customer.id}, 'Satin charcoal colour change', 'Full colour wrap', '2022 BMW M4', 'NX22 WRV', now() + interval '7 days', now() + interval '10 days', 'confirmed', 350, 'Film ordered and deposit received.'
    WHERE NOT EXISTS (SELECT 1 FROM booking WHERE title = 'Satin charcoal colour change' AND registration = 'NX22 WRV')
  `
  await sql`
    INSERT INTO job (customer_id, title, service, vehicle, registration, status, quoted_amount, deposit_amount, due_date, notes)
    SELECT ${customer.id}, 'Satin charcoal colour change', 'Full colour wrap', '2022 BMW M4', 'NX22 WRV', 'scheduled', 980, 350, current_date + 10, 'Full exterior excluding door shuts.'
    WHERE NOT EXISTS (SELECT 1 FROM job WHERE title = 'Satin charcoal colour change' AND registration = 'NX22 WRV')
  `
  await sql`
    INSERT INTO job (customer_id, title, service, vehicle, registration, status, quoted_amount, deposit_amount, due_date, notes, completed_at)
    SELECT ${customer.id}, 'Front-end PPF package', 'Paint protection film', '2021 Audi RS5', 'DE21 MOC', 'complete', 650, 200, current_date - 5, 'Bonnet, bumper, wings and mirrors.', now() - interval '5 days'
    WHERE NOT EXISTS (SELECT 1 FROM job WHERE title = 'Front-end PPF package' AND registration = 'DE21 MOC')
  `

  await sql`
    INSERT INTO enquiry (name, email, phone, postcode, vehicle, registration, service, finish, message)
    SELECT 'Olivia Taylor', 'olivia@example.co.uk', '+44 7700 900456', 'DH4 6AA', '2023 Range Rover Sport', 'OT23 DEM', 'Paint protection film', 'Satin', 'Interested in full-body satin PPF.'
    WHERE NOT EXISTS (SELECT 1 FROM enquiry WHERE lower(email) = 'olivia@example.co.uk')
  `

  await sql`
    INSERT INTO inventory_item (brand, name, colour, finish, sku, remaining_metres, reorder_level, cost_per_metre, location)
    SELECT * FROM (VALUES
      ('3M', '2080', 'Deep Black', 'Gloss', 'G12', 18.5, 8, 24.5, 'Rack A1'),
      ('Avery Dennison', 'Supreme Wrapping Film', 'Satin Dark Grey', 'Satin', 'SWF-SDG', 6.2, 8, 26, 'Rack A2'),
      ('XPEL', 'Ultimate Plus', 'Clear', 'Gloss PPF', 'UPLUS', 12, 6, 42, 'Rack P1')
    ) AS demo(brand, name, colour, finish, sku, remaining_metres, reorder_level, cost_per_metre, location)
    WHERE NOT EXISTS (SELECT 1 FROM inventory_item item WHERE item.sku = demo.sku)
  `

  await sql`
    INSERT INTO newsletter_subscriber (email, name, source)
    VALUES ('demo.subscriber@example.co.uk', 'Jamie Demo', 'admin_demo')
    ON CONFLICT (lower(email)) DO NOTHING
  `
  console.log('Demo data added')
} finally {
  await sql.end()
}
