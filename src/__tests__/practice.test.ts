import { describe, it, expect } from 'vitest'
import { PRACTICE_QUESTIONS, getQuestionsForLesson } from '@/lib/practice'

describe('practice questions', () => {
  it('has questions for all 9 lessons', () => {
    for (let i = 1; i <= 9; i++) {
      const qs = getQuestionsForLesson(i)
      expect(qs.length).toBeGreaterThan(0)
    }
  })

  it('each question has required fields', () => {
    PRACTICE_QUESTIONS.forEach((q) => {
      expect(q.id).toBeTruthy()
      expect(q.lessonId).toBeGreaterThanOrEqual(1)
      expect(q.lessonId).toBeLessThanOrEqual(9)
      expect(Array.isArray(q.numbers)).toBe(true)
      expect(q.numbers.length).toBeGreaterThanOrEqual(3)
      expect(typeof q.answer).toBe('number')
    })
  })

  it('question ids are unique', () => {
    const ids = PRACTICE_QUESTIONS.map((q) => q.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('answer matches sum of numbers', () => {
    PRACTICE_QUESTIONS.forEach((q) => {
      const sum = q.numbers.reduce((acc, n) => acc + n, 0)
      expect(sum).toBe(q.answer)
    })
  })
})
