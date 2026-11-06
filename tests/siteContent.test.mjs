import { describe, expect, it } from 'vitest'
import { siteContentDefaults, siteContentOverrides } from '../shared/utils/siteContent.ts'

describe('website editor content', () => {
  it('stores only known, changed and trimmed texts', () => {
    expect(siteContentOverrides({
      'hero.title': '  Fresh wrap.  ',
      'hero.intro': siteContentDefaults['hero.intro'],
      'hero.button': 42,
      'admin.password': 'injected'
    })).toEqual([{ key: 'hero.title', value: 'Fresh wrap.' }])
    expect(siteContentOverrides(null)).toEqual([])
    expect(siteContentOverrides({ 'quote.text': 'x'.repeat(5000) })[0].value).toHaveLength(2000)
  })

  it('stores social links only as http(s) URLs', () => {
    expect(siteContentOverrides({
      'social.instagram': 'instagram.com/blackrivor',
      'social.facebook': 'javascript:alert(1)',
      'social.tiktok': 'https://www.tiktok.com/@blackrivor',
      'social.youtube': 'not a link'
    })).toEqual([
      { key: 'social.instagram', value: 'https://instagram.com/blackrivor' },
      { key: 'social.tiktok', value: 'https://www.tiktok.com/@blackrivor' }
    ])
  })

  it('publishes tinting prices alongside existing homepage and shared content', () => {
    const stored = Object.fromEntries(siteContentOverrides({
      ...siteContentDefaults,
      'hero.title': 'A new look.',
      'nav.tinting': 'Tinting prices',
      'tintPricing.2.price': '  From £185  ',
      'tintQuestions.1.answer': 'Updated package coverage.',
      'tintPricing.unknown.price': '£1'
    }).map(({ key, value }) => [key, value]))

    expect(stored).toEqual({
      'hero.title': 'A new look.',
      'nav.tinting': 'Tinting prices',
      'tintPricing.2.price': 'From £185',
      'tintQuestions.1.answer': 'Updated package coverage.'
    })
  })
})
