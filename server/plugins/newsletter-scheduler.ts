export default defineNitroPlugin((nitroApp) => {
  const checkScheduledCampaigns = async () => {
    try {
      const sql = useDb()
      const campaigns = await sql`SELECT id FROM newsletter_campaign WHERE status = 'scheduled' AND scheduled_for <= now() ORDER BY scheduled_for LIMIT 5`
      for (const campaign of campaigns) await sendNewsletterCampaign(campaign.id).catch(error => console.error('Scheduled newsletter failed:', error))
    } catch (error) {
      console.error('Newsletter scheduler could not check the database:', error)
    }
  }
  const timer = setInterval(checkScheduledCampaigns, 60_000)
  timer.unref()
  setTimeout(checkScheduledCampaigns, 5_000).unref()
  nitroApp.hooks.hook('close', () => clearInterval(timer))
})
