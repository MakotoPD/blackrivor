import postgres from 'postgres'

let client: ReturnType<typeof postgres> | undefined

export function useDb() {
  if (client) return client
  const config = useRuntimeConfig()
  if (!config.databaseUrl) throw createError({ statusCode: 503, statusMessage: 'Database is not configured' })
  client = postgres(config.databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    transform: { undefined: null }
  })
  return client
}

