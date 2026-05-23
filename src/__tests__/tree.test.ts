import { describe, it, expect } from 'vitest'
import { getTreeStage, TREE_STAGES } from '@/lib/tree'

describe('tree stage logic', () => {
  it('has 7 stages', () => {
    expect(TREE_STAGES).toHaveLength(7)
  })

  it('score 0 = seed', () => {
    expect(getTreeStage(0).stage).toBe('seed')
  })

  it('score 5 = sprout', () => {
    expect(getTreeStage(5).stage).toBe('sprout')
  })

  it('score 15 = seedling', () => {
    expect(getTreeStage(15).stage).toBe('seedling')
  })

  it('score 30 = sapling', () => {
    expect(getTreeStage(30).stage).toBe('sapling')
  })

  it('score 50 = tree', () => {
    expect(getTreeStage(50).stage).toBe('tree')
  })

  it('score 75 = flowering', () => {
    expect(getTreeStage(75).stage).toBe('flowering')
  })

  it('score 100 = fruit', () => {
    expect(getTreeStage(100).stage).toBe('fruit')
  })

  it('score 200 still = fruit', () => {
    expect(getTreeStage(200).stage).toBe('fruit')
  })
})
