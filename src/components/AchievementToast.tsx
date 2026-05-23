'use client'

import { useEffect, useState } from 'react'
import { AchievementDef } from '@/types/gamification'

interface AchievementToastProps {
  achievement: AchievementDef | null
  onClose: () => void
}

export default function AchievementToast({
  achievement,
  onClose,
}: AchievementToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onClose, 300)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-gradient-to-r from-amber-400 to-yellow-400 text-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-4 min-w-64">
        <div className="text-4xl">{achievement.emoji}</div>
        <div>
          <p className="text-xs font-medium opacity-80 uppercase tracking-wide">
            獲得成就！
          </p>
          <p className="font-bold text-lg">{achievement.title}</p>
          <p className="text-xs opacity-80">{achievement.description}</p>
        </div>
      </div>
    </div>
  )
}
