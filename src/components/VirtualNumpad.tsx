'use client'

interface VirtualNumpadProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '⌫', '0', '確認']

export default function VirtualNumpad({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: VirtualNumpadProps) {
  const handleKey = (key: string) => {
    if (disabled) return
    if (key === '⌫') {
      onChange(value.slice(0, -1))
    } else if (key === '確認') {
      if (value.length > 0) onSubmit()
    } else {
      if (value.length >= 4) return
      onChange(value + key)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto select-none">
      {KEYS.map((key) => {
        const isSubmit = key === '確認'
        const isDelete = key === '⌫'
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleKey(key)}
            disabled={disabled || (isSubmit && value.length === 0)}
            className={[
              'h-16 rounded-2xl text-xl font-bold transition-all duration-150 active:scale-95 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              isSubmit
                ? 'bg-indigo-500 hover:bg-indigo-600 text-white focus:ring-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed'
                : isDelete
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-700 focus:ring-slate-400'
                : 'bg-white border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-800 focus:ring-indigo-300 shadow-sm',
              disabled && !isSubmit ? 'opacity-50 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {key}
          </button>
        )
      })}
    </div>
  )
}
