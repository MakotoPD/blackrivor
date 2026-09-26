import { describe, expect, it } from 'vitest'
import { hashPassword, verifyPassword } from '../scripts/lib/password.mjs'

describe('admin password hashing', () => {
  it('accepts the original password and rejects another one', async () => {
    const hash = await hashPassword('correct horse battery staple')
    expect(await verifyPassword('correct horse battery staple', hash)).toBe(true)
    expect(await verifyPassword('wrong password', hash)).toBe(false)
  })
})
