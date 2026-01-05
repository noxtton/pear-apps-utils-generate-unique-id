export const generateUniqueId = () => {
  const crypto = globalThis.crypto
  if (typeof crypto === 'undefined') {
    throw new Error('Secure random generator unavailable')
  }
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  // keep hex-only format (no UUID bits)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}
