const services = ['Full colour wrap', 'Paint protection film', 'Window tinting', 'Commercial graphics']

export default defineEventHandler(async (event) => {
  rateLimit(event, 'enquiry', 6)
  const body = await readBody<Record<string, unknown>>(event)
  const required = ['name', 'email', 'phone', 'vehicle', 'service']
  for (const field of required) {
    if (typeof body[field] !== 'string' || !String(body[field]).trim()) {
      throw createError({ statusCode: 400, statusMessage: `${field} is required` })
    }
  }
  if (!/^\S+@\S+\.\S+$/.test(String(body.email))) throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address' })
  if (!services.includes(String(body.service))) throw createError({ statusCode: 400, statusMessage: 'Choose a valid service' })
  if (body.consent !== true) throw createError({ statusCode: 400, statusMessage: 'Consent is required' })

  const payload = {
    name: String(body.name).trim().slice(0, 120),
    email: String(body.email).trim().toLowerCase().slice(0, 254),
    phone: String(body.phone).trim().slice(0, 40),
    postcode: String(body.postcode || '').trim().toUpperCase().slice(0, 12) || null,
    vehicle: String(body.vehicle).trim().slice(0, 160),
    registration: String(body.registration || '').trim().toUpperCase().slice(0, 16) || null,
    service: String(body.service),
    finish: String(body.finish || '').trim().slice(0, 160) || null,
    message: String(body.message || '').trim().slice(0, 3000) || null
  }

  const sql = useDb()
  const result = await sql.begin(async (transaction) => {
    const [existing] = await transaction`SELECT id FROM customer WHERE lower(email) = ${payload.email} LIMIT 1`
    const [customer] = existing
      ? await transaction`UPDATE customer SET name = ${payload.name}, phone = ${payload.phone}, postcode = COALESCE(${payload.postcode}, postcode), vehicle_registration = COALESCE(${payload.registration}, vehicle_registration) WHERE id = ${existing.id} RETURNING id`
      : await transaction`INSERT INTO customer (name, email, phone, postcode, vehicle_registration) VALUES (${payload.name}, ${payload.email}, ${payload.phone}, ${payload.postcode}, ${payload.registration}) RETURNING id`
    if (!customer) throw createError({ statusCode: 500, statusMessage: 'Could not save customer' })

    const [enquiry] = await transaction`
      INSERT INTO enquiry (customer_id, name, email, phone, postcode, vehicle, registration, service, finish, message)
      VALUES (${customer.id}, ${payload.name}, ${payload.email}, ${payload.phone}, ${payload.postcode}, ${payload.vehicle}, ${payload.registration}, ${payload.service}, ${payload.finish}, ${payload.message})
      RETURNING id, created_at
    `
    return enquiry
  })
  if (!result) throw createError({ statusCode: 500, statusMessage: 'Could not save enquiry' })

  setResponseStatus(event, 201)
  return { ok: true, id: result.id }
})
