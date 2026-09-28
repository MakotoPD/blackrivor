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
})
