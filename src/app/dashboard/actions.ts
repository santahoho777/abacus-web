'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function markLessonComplete(lessonId: number) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('lesson_progress').upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' }
  )

  revalidatePath(`/courses/${lessonId}`)
  revalidatePath('/dashboard')
  revalidatePath('/courses')
}
