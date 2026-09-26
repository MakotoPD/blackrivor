type Bucket = { count: number, resetAt: number }
const buckets = new Map<string, Bucket>()

// ponytail: in-process limits cover this single-container deploy; use Redis when scaling horizontally.
export function rateLimit(event: Parameters<typeof getRequestIP>[0], key: string, limit = 8, windowMs = 60 * 60 * 1000) {
  const id = `${key}:${getRequestIP(event, { xForwardedFor: true }) || 'unknown'}`
  const now = Date.now()
  const bucket = buckets.get(id)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs })
    return
  }
  if (bucket.count >= limit) throw createError({ statusCode: 429, statusMessage: 'Too many requests. Please try again later.' })
  bucket.count += 1
}

