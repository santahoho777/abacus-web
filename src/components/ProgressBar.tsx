import { calculateProgressPercent } from '@/lib/progress'

interface ProgressBarProps {
  completed: number
  total: number
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = calculateProgressPercent(completed, total)
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-indigo-100 font-medium">學習進度</span>
        <span className="text-white font-bold">
          {completed} / {total} 堂
        </span>
      </div>
      <div className="h-3 bg-indigo-400/40 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`學習進度 ${percent}%`}
        />
      </div>
      <p className="text-xs text-indigo-200 text-right">{percent}% 完成</p>
    </div>
  )
}
