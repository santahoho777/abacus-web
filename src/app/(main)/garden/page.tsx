import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GrowingTree from '@/components/GrowingTree'
import AchievementBadge from '@/components/AchievementBadge'
import { ACHIEVEMENTS } from '@/lib/achievements'

export const metadata = { title: '我的花園' }

export default async function GardenPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [treeResult, badgeResult] = await Promise.all([
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

  const totalCorrect = treeResult.data?.total_correct ?? 0
  const earnedMap = new Map(
    (badgeResult.data ?? []).map((b) => [b.badge_id, b.earned_at])
  )

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">我的花園</h1>
        <p className="text-slate-500 text-sm">每答對一題就幫小樹澆水！</p>
      </div>

      {/* Tree */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 mb-10">
        <GrowingTree totalCorrect={totalCorrect} />
        <p className="text-center text-xs text-slate-400 mt-4">
          累計答對{' '}
          <span className="font-bold text-slate-600">{totalCorrect}</span> 題
        </p>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="font-bold text-slate-800 mb-4">
          成就勳章{' '}
          <span className="text-sm text-slate-400 font-normal">
            {earnedMap.size} / {ACHIEVEMENTS.length}
          </span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
  )
}
