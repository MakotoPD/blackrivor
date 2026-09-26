import { describe, expect, it } from 'vitest'
import { cleanNewsletterHtml, renderNewsletterHtml } from '../server/utils/newsletter.ts'
import { decryptIntegrationSecret, encryptIntegrationSecret } from '../server/utils/notificationCrypto.ts'

describe('newsletter safety and compliance', () => {
  it('removes unsafe markup and always renders an unsubscribe link', () => {
    const clean = cleanNewsletterHtml('<h2>Hello</h2><script>alert(1)</script><a href="javascript:alert(2)">bad link</a>')
    expect(clean).toContain('<h2>Hello</h2>')
    expect(clean).not.toContain('<script')
    expect(clean).not.toContain('javascript:')
    expect(renderNewsletterHtml(clean, 'https://example.com/unsubscribe?t=1', 'https://example.com')).toContain('https://example.com/unsubscribe?t=1')
  })

  it('encrypts integration credentials at rest', () => {
    const encrypted = encryptIntegrationSecret('smtp-password')
    expect(encrypted).not.toContain('smtp-password')
    expect(decryptIntegrationSecret(encrypted)).toBe('smtp-password')
  })
})
