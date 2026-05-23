import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LESSONS } from '@/lib/lessons'
import { ACHIEVEMENTS } from '@/lib/achievements'
import LessonCard from '@/components/LessonCard'
import ProgressBar from '@/components/ProgressBar'
import GrowingTree from '@/components/GrowingTree'
import AchievementBadge from '@/components/AchievementBadge'
import { User, Trophy, Flame } from 'lucide-react'

export const metadata = { title: '我的學習進度' }

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [profileResult, progressResult, treeResult, badgeResult] = await Promise.all([
    supabase.from('profiles').select('name').eq('id', user.id).single(),
    supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .eq('completed', true),
    supabase
      .from('tree_progress')
      .select('total_correct')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('achievements')
      .select('badge_id, earned_at')
      .eq('user_id', user.id),
  ])

  const name =
    profileResult.data?.name ?? user.email?.split('@')[0] ?? '同學'
  const completedIds = (progressResult.data ?? []).map((row) => row.lesson_id)
  const completedCount = completedIds.length
  const totalCount = LESSONS.length
  const totalCorrect = treeResult.data?.total_correct ?? 0
  const earnedMap = new Map(
    (badgeResult.data ?? []).map((b) => [b.badge_id, b.earned_at])
  )

  const nextLesson = LESSONS.find((l) => !completedIds.includes(l.id))

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 opacity-80" />
              <span className="text-indigo-100 text-sm">你好，</span>
            </div>
            <h1 className="text-2xl font-bold mb-4">{name} 同學</h1>
            <ProgressBar completed={completedCount} total={totalCount} />
          </div>
          {completedCount === totalCount && totalCount > 0 && (
            <div className="bg-white/20 rounded-xl p-4 text-center ml-6">
              <Trophy className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs font-medium">全部完成！</p>
            </div>
          )}
        </div>
      </div>

      {/* Tree + Achievements */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <GrowingTree totalCorrect={totalCorrect} />
          <p className="text-center text-xs text-slate-400 mt-4">
            累計答對{' '}
            <span className="font-bold text-slate-600">{totalCorrect}</span> 題
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="font-bold text-slate-800 mb-4">
            成就勳章{' '}
            <span className="text-sm text-slate-400 font-normal">
              {earnedMap.size} / {ACHIEVEMENTS.length}
            </span>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                achievement={achievement}
                earned={earnedMap.has(achievement.id)}
                earnedAt={earnedMap.get(achievement.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Next lesson prompt */}
      {nextLesson && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900 text-sm">繼續學習</p>
              <p className="text-amber-700 text-xs mt-0.5">{nextLesson.title}</p>
            </div>
          </div>
          <Link
            href={`/courses/${nextLesson.id}`}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            繼續 →
          </Link>
        </div>
      )}

      {/* All lessons grid */}
      <div>
        <h2 className="font-bold text-slate-800 mb-4">所有課程</h2>
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
    </div>
  )
}
