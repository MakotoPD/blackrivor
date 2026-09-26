export default defineEventHandler(async (event) => {
  return sendNewsletterCampaign(getRouterParam(event, 'id') || '', event.context.admin.id)
})
