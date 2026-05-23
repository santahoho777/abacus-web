import { describe, it, expect } from 'vitest'
import { LESSONS, getLessonById } from '@/lib/lessons'

describe('lessons data', () => {
  it('has exactly 9 lessons', () => {
    expect(LESSONS).toHaveLength(9)
  })

  it('each lesson has required fields', () => {
    LESSONS.forEach((lesson) => {
      expect(lesson.id).toBeGreaterThanOrEqual(1)
      expect(lesson.id).toBeLessThanOrEqual(9)
      expect(lesson.title).toBeTruthy()
      expect(lesson.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/)
      expect(lesson.description).toBeTruthy()
      expect(Array.isArray(lesson.topics)).toBe(true)
    })
  })

  it('getLessonById returns correct lesson', () => {
    const lesson = getLessonById(1)
    expect(lesson?.youtubeId).toBe('JG89_aZkvfE')
  })

  it('getLessonById returns undefined for invalid id', () => {
    expect(getLessonById(0)).toBeUndefined()
    expect(getLessonById(10)).toBeUndefined()
  })
})
