import { describe, it, expect } from 'vitest'
import { ACHIEVEMENTS, getNewlyEarned } from '@/lib/achievements'

describe('achievements', () => {
  it('has 6 achievement definitions', () => {
    expect(ACHIEVEMENTS).toHaveLength(6)
  })

  it('getNewlyEarned returns first-answer badge when totalCorrect is 1', () => {
    const earned = getNewlyEarned({
      totalCorrect: 1,
      completedLessons: 1,
      existingBadgeIds: [],
    })
    expect(earned).toContain('first_answer')
  })

  it('does not re-earn already owned badges', () => {
    const earned = getNewlyEarned({
      totalCorrect: 1,
      completedLessons: 1,
      existingBadgeIds: ['first_answer'],
    })
    expect(earned).not.toContain('first_answer')
  })

  it('earns all_lessons badge when 9 lessons completed', () => {
    const earned = getNewlyEarned({
      totalCorrect: 50,
      completedLessons: 9,
      existingBadgeIds: ['first_answer'],
    })
    expect(earned).toContain('all_lessons')
  })
})
