import * as Crypto from 'expo-crypto'

export const generateUniqueId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  if (Crypto.randomUUID) return Crypto.randomUUID()

  const getRandomValues =
    globalThis.crypto?.getRandomValues || Crypto.getRandomValues
  if (getRandomValues) {
    const bytes = new Uint8Array(16)
    getRandomValues(bytes)
    return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
  }

  throw new Error('Secure random generator unavailable')
}
