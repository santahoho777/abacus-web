import { TreeStage } from '@/types/gamification'
import {
  getTreeStage,
  getNextStage,
  getProgressToNextStage,
  TREE_STAGES,
} from '@/lib/tree'

interface GrowingTreeProps {
  totalCorrect: number
  compact?: boolean
  isWatering?: boolean
}

const TREE_VISUALS: Record<
  TreeStage,
  { svg: string; bg: string; description: string }
> = {
  seed: {
    bg: 'from-amber-50 to-orange-50',
    description: '種子正在等待發芽...',
    svg: `<ellipse cx="60" cy="85" rx="18" ry="10" fill="#92400e" opacity="0.6"/>
          <ellipse cx="60" cy="80" rx="12" ry="8" fill="#a16207"/>`,
  },
  sprout: {
    bg: 'from-green-50 to-emerald-50',
    description: '小芽冒出來了！',
    svg: `<ellipse cx="60" cy="88" rx="18" ry="8" fill="#92400e" opacity="0.5"/>
          <rect x="58" y="65" width="4" height="25" rx="2" fill="#65a30d"/>
          <ellipse cx="60" cy="60" rx="12" ry="8" fill="#84cc16"/>`,
  },
  seedling: {
    bg: 'from-green-50 to-lime-50',
    description: '幼苗在茁壯成長！',
    svg: `<ellipse cx="60" cy="90" rx="20" ry="8" fill="#92400e" opacity="0.5"/>
          <rect x="58" y="55" width="5" height="38" rx="2" fill="#65a30d"/>
          <ellipse cx="60" cy="48" rx="18" ry="12" fill="#84cc16"/>
          <ellipse cx="42" cy="62" rx="10" ry="7" fill="#a3e635" transform="rotate(-20 42 62)"/>
          <ellipse cx="78" cy="62" rx="10" ry="7" fill="#a3e635" transform="rotate(20 78 62)"/>`,
  },
  sapling: {
    bg: 'from-emerald-50 to-green-100',
    description: '小樹越來越高了！',
    svg: `<ellipse cx="60" cy="92" rx="22" ry="9" fill="#78350f" opacity="0.6"/>
          <rect x="57" y="45" width="7" height="50" rx="3" fill="#78350f"/>
          <ellipse cx="60" cy="38" rx="25" ry="18" fill="#22c55e"/>
          <ellipse cx="38" cy="52" rx="14" ry="10" fill="#16a34a" transform="rotate(-15 38 52)"/>
          <ellipse cx="82" cy="52" rx="14" ry="10" fill="#16a34a" transform="rotate(15 82 52)"/>`,
  },
  tree: {
    bg: 'from-green-100 to-emerald-100',
    description: '大樹枝葉茂盛！',
    svg: `<ellipse cx="60" cy="94" rx="25" ry="10" fill="#78350f" opacity="0.7"/>
          <rect x="56" y="42" width="9" height="55" rx="4" fill="#92400e"/>
          <ellipse cx="60" cy="30" rx="32" ry="22" fill="#15803d"/>
          <ellipse cx="32" cy="45" rx="18" ry="13" fill="#16a34a" transform="rotate(-20 32 45)"/>
          <ellipse cx="88" cy="45" rx="18" ry="13" fill="#16a34a" transform="rotate(20 88 45)"/>
          <ellipse cx="60" cy="22" rx="22" ry="15" fill="#22c55e"/>`,
  },
  flowering: {
    bg: 'from-pink-50 to-rose-50',
    description: '開花了！好漂亮！',
    svg: `<ellipse cx="60" cy="94" rx="25" ry="10" fill="#78350f" opacity="0.7"/>
          <rect x="56" y="42" width="9" height="55" rx="4" fill="#92400e"/>
          <ellipse cx="60" cy="30" rx="32" ry="22" fill="#15803d"/>
          <ellipse cx="32" cy="45" rx="18" ry="13" fill="#16a34a" transform="rotate(-20 32 45)"/>
          <ellipse cx="88" cy="45" rx="18" ry="13" fill="#16a34a" transform="rotate(20 88 45)"/>
          <ellipse cx="60" cy="22" rx="22" ry="15" fill="#22c55e"/>
          <circle cx="40" cy="28" r="6" fill="#f9a8d4"/>
          <circle cx="75" cy="20" r="5" fill="#fda4af"/>
          <circle cx="55" cy="15" r="4" fill="#fbcfe8"/>
          <circle cx="80" cy="38" r="5" fill="#f9a8d4"/>
          <circle cx="32" cy="40" r="4" fill="#fecdd3"/>`,
  },
  fruit: {
    bg: 'from-red-50 to-orange-50',
    description: '結果了！你太棒了！',
    svg: `<ellipse cx="60" cy="94" rx="25" ry="10" fill="#78350f" opacity="0.7"/>
          <rect x="56" y="42" width="9" height="55" rx="4" fill="#92400e"/>
          <ellipse cx="60" cy="30" rx="32" ry="22" fill="#15803d"/>
          <ellipse cx="32" cy="45" rx="18" ry="13" fill="#16a34a" transform="rotate(-20 32 45)"/>
          <ellipse cx="88" cy="45" rx="18" ry="13" fill="#16a34a" transform="rotate(20 88 45)"/>
          <ellipse cx="60" cy="22" rx="22" ry="15" fill="#22c55e"/>
          <circle cx="42" cy="30" r="7" fill="#dc2626"/>
          <circle cx="73" cy="25" r="6" fill="#ef4444"/>
          <circle cx="55" cy="18" r="5" fill="#dc2626"/>
          <circle cx="78" cy="40" r="6" fill="#ef4444"/>
          <circle cx="35" cy="42" r="5" fill="#dc2626"/>
          <circle cx="62" cy="38" r="7" fill="#ef4444"/>`,
  },
}

export default function GrowingTree({
  totalCorrect,
  compact = false,
  isWatering = false,
}: GrowingTreeProps) {
  const stageInfo = getTreeStage(totalCorrect)
  const nextStage = getNextStage(totalCorrect)
  const progress = getProgressToNextStage(totalCorrect)
  const visual = TREE_VISUALS[stageInfo.stage]

  if (compact) {
    return (
      <div
        className={`relative flex items-center gap-3 bg-gradient-to-r ${visual.bg} border border-slate-200 rounded-2xl px-4 py-3 overflow-hidden`}
      >
        <span className={`text-3xl ${isWatering ? 'animate-bounce' : ''}`}>
          {stageInfo.emoji}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400">我的樹</p>
          <p className="text-sm font-bold text-slate-700">{stageInfo.label}</p>
          {nextStage && (
            <div className="flex items-center gap-2 mt-1">
              <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 flex-shrink-0">
                {nextStage.emoji}
              </span>
            </div>
          )}
        </div>
        {isWatering && (
          <div className="flex flex-col items-center gap-0.5 animate-bounce text-blue-400">
            <span className="text-base">💧</span>
            <span className="text-xs">💧</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="text-center">
      {/* Tree container */}
      <div
        className={`relative mx-auto w-48 h-48 rounded-3xl bg-gradient-to-b ${visual.bg} border-2 border-white shadow-lg flex items-center justify-center mb-4 overflow-hidden`}
      >
        {isWatering && (
          <div className="absolute inset-0 z-10 pointer-events-none flex justify-around items-start pt-2 px-6">
            <span className="animate-bounce text-lg">💧</span>
            <span className="animate-bounce text-sm" style={{ animationDelay: '0.15s' }}>💧</span>
            <span className="animate-bounce text-lg" style={{ animationDelay: '0.3s' }}>💧</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-amber-100 to-transparent" />
        <svg
          viewBox="0 0 120 100"
          className="w-36 h-36 transition-all duration-1000"
          dangerouslySetInnerHTML={{ __html: visual.svg }}
        />
      </div>

      {/* Stage label */}
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-2xl">{stageInfo.emoji}</span>
        <h3 className="text-lg font-bold text-slate-800">{stageInfo.label}</h3>
      </div>
      <p className="text-sm text-slate-500 mb-3">{visual.description}</p>

      {/* Progress to next stage */}
      {nextStage ? (
        <div className="max-w-xs mx-auto">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{stageInfo.label}</span>
            <span>
              下一階段：{nextStage.label} {nextStage.emoji}
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1 text-right">
            還需 {nextStage.minScore - totalCorrect} 題答對
          </p>
        </div>
      ) : (
        <p className="text-sm font-medium text-emerald-600">
          🎉 已達到最高階段！
        </p>
      )}

      {/* Stage dots */}
      <div className="flex justify-center gap-1 mt-4">
        {TREE_STAGES.map((s) => {
          const reached = totalCorrect >= s.minScore
          return (
            <div
              key={s.stage}
              title={s.label}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                reached
                  ? 'bg-emerald-100 border-2 border-emerald-400 shadow-sm'
                  : 'bg-slate-100 border-2 border-slate-200 opacity-40'
              }`}
            >
              {s.emoji}
            </div>
          )
        })}
      </div>
    </div>
  )
}
