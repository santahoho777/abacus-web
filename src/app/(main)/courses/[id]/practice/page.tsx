import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLessonById } from '@/lib/lessons'
import PracticeClient from './PracticeClient'

export default async function PracticePage({
  params,
}: {
  params: { id: string }
}) {
  const lessonId = Number(params.id)
  const lesson = getLessonById(lessonId)
  if (!lesson) notFound()

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('tree_progress')
    .select('total_correct')
    .eq('user_id', user.id)
    .single()

  return (
    <PracticeClient
      lessonId={lessonId}
      initialTotalCorrect={data?.total_correct ?? 0}
    />
  )
}
