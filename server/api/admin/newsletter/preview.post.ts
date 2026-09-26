export default defineEventHandler(async (event) => {
  const body = await readBody<{ content?: string }>(event)
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'
  return { html: renderNewsletterHtml(cleanNewsletterHtml(body.content), `${siteUrl}/unsubscribe?token=preview`, siteUrl) }
})
