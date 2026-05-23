'use client'

import GrowingTree from './GrowingTree'
import { useTree } from '@/contexts/TreeContext'

export default function TreeSidebar() {
  const { totalCorrect, isWatering } = useTree()

  return (
    <aside className="hidden lg:block w-56 shrink-0 py-12 pr-6">
      <div className="sticky top-24">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
          <GrowingTree totalCorrect={totalCorrect} isWatering={isWatering} />
        </div>
      </div>
    </aside>
  )
}
