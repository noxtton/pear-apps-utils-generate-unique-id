import { jest } from '@jest/globals'
import * as Crypto from 'expo-crypto'

import { generateUniqueId } from './generateUniqueId.native'

const originalCrypto = globalThis.crypto

describe('generateUniqueId (native)', () => {
  beforeEach(() => {
    Crypto.randomUUID = jest.fn()
    Crypto.getRandomValues = jest.fn()
  })

  afterEach(() => {
    globalThis.crypto = originalCrypto
    jest.restoreAllMocks()
  })

  it('uses globalThis.crypto.randomUUID when available', () => {
    const randomUUID = jest.fn(() => 'uuid-from-global')
    globalThis.crypto = { randomUUID }

    const id = generateUniqueId()

    expect(id).toBe('uuid-from-global')
    expect(randomUUID).toHaveBeenCalledTimes(1)
    expect(Crypto.randomUUID).not.toHaveBeenCalled()
  })

  it('uses Crypto.randomUUID when global randomUUID is absent', () => {
    globalThis.crypto = {}
    Crypto.randomUUID.mockReturnValue('uuid-from-expo')

    const id = generateUniqueId()

    expect(id).toBe('uuid-from-expo')
    expect(Crypto.randomUUID).toHaveBeenCalledTimes(1)
  })

  it('falls back to getRandomValues when no randomUUID exists', () => {
    globalThis.crypto = {}
    Crypto.randomUUID = undefined
    Crypto.getRandomValues.mockImplementation((bytes) => bytes.fill(0x0a))

    const id = generateUniqueId()

    expect(id).toBe('0a'.repeat(16))
    expect(Crypto.getRandomValues).toHaveBeenCalledTimes(1)
  })

  it('throws when no secure RNG is available', () => {
    globalThis.crypto = undefined
    Crypto.randomUUID = undefined
    Crypto.getRandomValues = undefined

    expect(() => generateUniqueId()).toThrow(
      'Secure random generator unavailable'
    )
  })
})
