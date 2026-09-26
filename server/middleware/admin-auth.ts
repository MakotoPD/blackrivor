export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/admin') || path === '/api/admin/login') return
  const user = await getAdminSession(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  event.context.admin = user
})

