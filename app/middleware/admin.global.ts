export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return
  try {
    await $fetch('/api/admin/me', {
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
    })
  } catch {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})

