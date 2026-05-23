import { AchievementDef } from '@/types/gamification'

interface AchievementBadgeProps {
  achievement: AchievementDef
  earned: boolean
  earnedAt?: string
}

export default function AchievementBadge({
  achievement,
  earned,
  earnedAt,
}: AchievementBadgeProps) {
  return (
    <div
      className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${
        earned
          ? 'bg-gradient-to-b from-amber-50 to-yellow-50 border-amber-300 shadow-md'
          : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
      }`}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl mb-2 ${
          earned ? 'bg-amber-100 shadow-inner' : 'bg-slate-100'
        }`}
      >
        {achievement.emoji}
      </div>
      <p
        className={`text-sm font-bold text-center ${
          earned ? 'text-amber-800' : 'text-slate-400'
        }`}
      >
        {achievement.title}
      </p>
      <p className="text-xs text-center text-slate-400 mt-0.5 leading-relaxed">
        {achievement.description}
      </p>
      {earned && earnedAt && (
        <p className="text-xs text-amber-500 mt-1">
          {new Date(earnedAt).toLocaleDateString('zh-TW')}
        </p>
      )}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
          <span className="text-2xl opacity-30">🔒</span>
        </div>
      )}
    </div>
  )
}
