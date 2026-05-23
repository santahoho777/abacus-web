import { describe, it, expect } from 'vitest'
import { calculateProgressPercent } from '@/lib/progress'

describe('progress utilities', () => {
  it('returns 0 when no lessons completed', () => {
    expect(calculateProgressPercent(0, 9)).toBe(0)
  })

  it('returns 100 when all lessons completed', () => {
    expect(calculateProgressPercent(9, 9)).toBe(100)
  })

  it('rounds to nearest integer', () => {
    expect(calculateProgressPercent(3, 9)).toBe(33)
    expect(calculateProgressPercent(5, 9)).toBe(56)
  })

  it('handles zero total gracefully', () => {
    expect(calculateProgressPercent(0, 0)).toBe(0)
  })
})
