import { TreeStageInfo } from '@/types/gamification'

export const TREE_STAGES: TreeStageInfo[] = [
  { stage: 'seed',      label: '種子',  minScore: 0,   emoji: '🌰' },
  { stage: 'sprout',    label: '發芽',  minScore: 5,   emoji: '🌱' },
  { stage: 'seedling',  label: '幼苗',  minScore: 15,  emoji: '🪴' },
  { stage: 'sapling',   label: '小樹',  minScore: 30,  emoji: '🌿' },
  { stage: 'tree',      label: '大樹',  minScore: 50,  emoji: '🌳' },
  { stage: 'flowering', label: '開花',  minScore: 75,  emoji: '🌸' },
  { stage: 'fruit',     label: '結果',  minScore: 100, emoji: '🍎' },
]

export function getTreeStage(totalCorrect: number): TreeStageInfo {
  const stage = [...TREE_STAGES]
    .reverse()
    .find((s) => totalCorrect >= s.minScore)
  return stage ?? TREE_STAGES[0]
}

export function getNextStage(totalCorrect: number): TreeStageInfo | null {
  const currentStage = getTreeStage(totalCorrect)
  const currentIndex = TREE_STAGES.findIndex((s) => s.stage === currentStage.stage)
  return TREE_STAGES[currentIndex + 1] ?? null
}

export function getProgressToNextStage(totalCorrect: number): number {
  const currentStage = getTreeStage(totalCorrect)
  const nextStage = getNextStage(totalCorrect)
  if (!nextStage) return 100
  const range = nextStage.minScore - currentStage.minScore
  const progress = totalCorrect - currentStage.minScore
  return Math.round((progress / range) * 100)
}
