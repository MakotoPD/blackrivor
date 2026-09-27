import { describe, expect, it } from 'vitest'
import { isDiscordWebhookUrl } from '../server/utils/notifications.ts'

describe('Discord webhook validation', () => {
  it('accepts Discord webhooks and rejects arbitrary endpoints', () => {
    expect(isDiscordWebhookUrl('https://discord.com/api/webhooks/123456/token_value')).toBe(true)
    expect(isDiscordWebhookUrl('https://example.com/api/webhooks/123456/token_value')).toBe(false)
    expect(isDiscordWebhookUrl('http://discord.com/api/webhooks/123456/token_value')).toBe(false)
  })
})
