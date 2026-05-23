import { AchievementDef } from '@/types/gamification'

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: 'first_answer',
    title: '第一步',
    description: '完成第一道練習題',
    emoji: '🌟',
  },
  {
    id: 'ten_correct',
    title: '練習新手',
    description: '累計答對10題',
    emoji: '✨',
  },
  {
    id: 'fifty_correct',
    title: '練習達人',
    description: '累計答對50題',
    emoji: '🔥',
  },
  {
    id: 'three_lessons',
    title: '認真學生',
    description: '完成3堂課',
    emoji: '📚',
  },
  {
    id: 'all_lessons',
    title: '課程完成',
    description: '完成全部9堂課',
    emoji: '🏆',
  },
  {
    id: 'full_tree',
    title: '大樹成林',
    description: '讓樹成長到結果階段',
    emoji: '🍎',
  },
]

interface CheckParams {
  totalCorrect: number
  completedLessons: number
  existingBadgeIds: string[]
}

export function getNewlyEarned(params: CheckParams): string[] {
  const { totalCorrect, completedLessons, existingBadgeIds } = params
  const newBadges: string[] = []

  const check = (id: string, condition: boolean) => {
    if (condition && !existingBadgeIds.includes(id)) {
      newBadges.push(id)
    }
  }

  check('first_answer', totalCorrect >= 1)
  check('ten_correct', totalCorrect >= 10)
  check('fifty_correct', totalCorrect >= 50)
  check('three_lessons', completedLessons >= 3)
  check('all_lessons', completedLessons >= 9)
  check('full_tree', totalCorrect >= 100)

  return newBadges
}
