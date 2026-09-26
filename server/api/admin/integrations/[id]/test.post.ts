export default defineEventHandler(async (event) => {
  const result = await testIntegration(getRouterParam(event, 'id') || '')
  if (!result.ok) throw createError({ statusCode: 502, statusMessage: result.error || 'The provider rejected the test notification' })
  return result
})
