export interface PracticeQuestion {
  id: string
  lessonId: number
  numbers: number[]
  answer: number
  hint?: string
}

export type TreeStage =
  | 'seed'
  | 'sprout'
  | 'seedling'
  | 'sapling'
  | 'tree'
  | 'flowering'
  | 'fruit'

export interface TreeStageInfo {
  stage: TreeStage
  label: string
  minScore: number
  emoji: string
}

export interface AchievementDef {
  id: string
  title: string
  description: string
  emoji: string
}

export interface EarnedAchievement {
  badge_id: string
  earned_at: string
}
