type ResourceConfig = {
  table: string
  fields: string[]
  required: string[]
  search: string[]
  order: string
}

export const resourceConfigs: Record<string, ResourceConfig> = {
  clients: {
    table: 'customer',
    fields: ['name', 'email', 'phone', 'postcode', 'vehicle_registration', 'notes', 'marketing_consent'],
    required: ['name', 'phone'],
    search: ['name', 'email', 'phone', 'vehicle_registration'],
    order: 'created_at DESC'
  },
  enquiries: {
    table: 'enquiry',
    fields: ['status', 'internal_notes'],
    required: [],
    search: ['name', 'email', 'phone', 'vehicle', 'registration', 'service'],
    order: "CASE status WHEN 'new' THEN 0 ELSE 1 END, created_at DESC"
  },
  bookings: {
    table: 'booking',
    fields: ['customer_id', 'title', 'service', 'vehicle', 'registration', 'starts_at', 'ends_at', 'status', 'deposit_amount', 'notes'],
    required: ['title', 'service', 'vehicle', 'starts_at', 'ends_at'],
    search: ['title', 'service', 'vehicle', 'registration', 'status'],
    order: 'starts_at ASC'
  },
  jobs: {
    table: 'job',
    fields: ['customer_id', 'booking_id', 'title', 'service', 'vehicle', 'registration', 'status', 'quoted_amount', 'deposit_amount', 'due_date', 'notes', 'completed_at'],
    required: ['title', 'service', 'vehicle'],
    search: ['reference', 'title', 'service', 'vehicle', 'registration', 'status'],
    order: 'created_at DESC'
  },
  inventory: {
    table: 'inventory_item',
    fields: ['brand', 'name', 'colour', 'finish', 'sku', 'roll_width_mm', 'remaining_metres', 'reorder_level', 'cost_per_metre', 'location'],
    required: ['brand', 'name', 'colour', 'finish'],
    search: ['brand', 'name', 'colour', 'finish', 'sku', 'location'],
    order: '(remaining_metres <= reorder_level) DESC, updated_at DESC'
  },
  subscribers: {
    table: 'newsletter_subscriber',
    fields: ['email', 'name', 'status', 'source'],
    required: ['email'],
    search: ['email', 'name', 'status', 'source'],
    order: 'created_at DESC'
  },
  campaigns: {
    table: 'newsletter_campaign',
    fields: ['subject', 'preview_text', 'body', 'status', 'scheduled_for'],
    required: ['subject', 'body'],
    search: ['subject', 'status'],
    order: 'created_at DESC'
  }
}

export function getResourceConfig(resource: string) {
  const config = resourceConfigs[resource]
  if (!config) throw createError({ statusCode: 404, statusMessage: 'Unknown resource' })
  return config
}

export function cleanResourceBody(resource: string, body: Record<string, unknown>, partial = false) {
  const config = getResourceConfig(resource)
  if (!partial) {
    for (const field of config.required) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        throw createError({ statusCode: 400, statusMessage: `${field.replaceAll('_', ' ')} is required` })
      }
    }
  }
  return Object.fromEntries(config.fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field] === '' ? null : body[field]]))
}

