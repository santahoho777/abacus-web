'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TreeContextValue {
  totalCorrect: number
  isWatering: boolean
  water: (newTotal: number) => void
}

const TreeContext = createContext<TreeContextValue | null>(null)

export function TreeProvider({
  children,
  initialTotalCorrect,
}: {
  children: ReactNode
  initialTotalCorrect: number
}) {
  const [totalCorrect, setTotalCorrect] = useState(initialTotalCorrect)
  const [isWatering, setIsWatering] = useState(false)

  const water = (newTotal: number) => {
    setTotalCorrect(newTotal)
    setIsWatering(true)
    setTimeout(() => setIsWatering(false), 2000)
  }

  return (
    <TreeContext.Provider value={{ totalCorrect, isWatering, water }}>
      {children}
    </TreeContext.Provider>
  )
}

export function useTree() {
  const ctx = useContext(TreeContext)
  if (!ctx) throw new Error('useTree must be used within TreeProvider')
  return ctx
}
