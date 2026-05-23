import { LESSONS } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import LessonCard from '@/components/LessonCard'
import { BookOpen } from 'lucide-react'

export const metadata = { title: '課程列表' }

export default async function CoursesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let completedIds: number[] = []
  if (user) {
    const { data } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true)
    completedIds = (data ?? []).map((row) => row.lesson_id)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">珠心算課程</h1>
            <p className="text-slate-500 text-sm">
              共 {LESSONS.length} 堂課 · 適合6-12歲
            </p>
          </div>
        </div>
        {user && completedIds.length > 0 && (
          <p className="text-sm text-emerald-600 font-medium">
            你已完成 {completedIds.length} / {LESSONS.length} 堂課
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LESSONS.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            completed={completedIds.includes(lesson.id)}
          />
        ))}
      </div>
    </div>
  )
}
