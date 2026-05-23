'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getNewlyEarned } from '@/lib/achievements'

export interface SubmitAnswerResult {
  correct: boolean
  newBadgeIds: string[]
  totalCorrect: number
}

export async function submitAnswer(
  lessonId: number,
  questionId: string,
  isCorrect: boolean
): Promise<SubmitAnswerResult> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { correct: isCorrect, newBadgeIds: [], totalCorrect: 0 }

  // Record the attempt
  await supabase.from('practice_attempts').insert({
    user_id: user.id,
    lesson_id: lessonId,
    question_id: questionId,
    is_correct: isCorrect,
  })

  if (!isCorrect) {
    return { correct: false, newBadgeIds: [], totalCorrect: 0 }
  }

  // Increment tree counter
  const { data: existing } = await supabase
    .from('tree_progress')
    .select('total_correct')
    .eq('user_id', user.id)
    .single()

  const newTotal = (existing?.total_correct ?? 0) + 1

  await supabase.from('tree_progress').upsert(
    {
      user_id: user.id,
      total_correct: newTotal,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )

  // Check completed lessons count
  const { data: completedData } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('completed', true)

  const completedLessons = completedData?.length ?? 0

  // Fetch existing badges
  const { data: badgeData } = await supabase
    .from('achievements')
    .select('badge_id')
    .eq('user_id', user.id)

  const existingBadgeIds = (badgeData ?? []).map((b) => b.badge_id)

  // Check for newly earned badges
  const newBadgeIds = getNewlyEarned({
    totalCorrect: newTotal,
    completedLessons,
    existingBadgeIds,
  })

  if (newBadgeIds.length > 0) {
    await supabase.from('achievements').insert(
      newBadgeIds.map((badge_id) => ({ user_id: user.id, badge_id }))
    )
  }

  revalidatePath('/', 'layout')
  revalidatePath('/dashboard')

  return { correct: true, newBadgeIds, totalCorrect: newTotal }
}
