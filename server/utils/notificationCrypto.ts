import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

function key() {
  return createHash('sha256').update(process.env.INTEGRATION_ENCRYPTION_KEY || 'local-only-change-before-production').digest()
}

export function encryptIntegrationSecret(secret: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()])
  return [iv, cipher.getAuthTag(), encrypted].map(value => value.toString('base64url')).join('.')
}

export function decryptIntegrationSecret(payload: string) {
  const [ivValue, tagValue, encryptedValue] = payload.split('.')
  if (!ivValue || !tagValue || !encryptedValue) throw new Error('Invalid encrypted integration secret')
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivValue, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(encryptedValue, 'base64url')), decipher.final()]).toString('utf8')
}
