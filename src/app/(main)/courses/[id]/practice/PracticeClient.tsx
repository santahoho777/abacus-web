'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { getQuestionsForLesson } from '@/lib/practice'
import { ACHIEVEMENTS } from '@/lib/achievements'
import { getLessonById } from '@/lib/lessons'
import VirtualNumpad from '@/components/VirtualNumpad'
import AchievementToast from '@/components/AchievementToast'
import { submitAnswer } from '@/app/practice/actions'
import { useTree } from '@/contexts/TreeContext'
import { AchievementDef } from '@/types/gamification'
import { CheckCircle2, XCircle, Lightbulb, ArrowLeft, Trophy } from 'lucide-react'

export default function PracticeClient({ lessonId }: { lessonId: number }) {
  const lesson = getLessonById(lessonId)
  const questions = getQuestionsForLesson(lessonId)
  const { water } = useTree()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [toastAchievement, setToastAchievement] = useState<AchievementDef | null>(null)
  const [finished, setFinished] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQ = questions[currentIndex]

  const advanceQuestion = useCallback(() => {
    setFeedback(null)
    setInputValue('')
    setShowHint(false)
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions.length])

  const handleSubmit = useCallback(async () => {
    if (!currentQ || isSubmitting || feedback !== null) return
    const userAnswer = parseInt(inputValue, 10)
    const isCorrect = userAnswer === currentQ.answer
    setFeedback(isCorrect ? 'correct' : 'wrong')
    setIsSubmitting(true)
    if (!isCorrect) setShowHint(true)

    const result = await submitAnswer(lessonId, currentQ.id, isCorrect)
    setIsSubmitting(false)

    if (isCorrect) {
      setScore((s) => s + 1)
      water(result.totalCorrect)
      if (result.newBadgeIds.length > 0) {
        const def = ACHIEVEMENTS.find((a) => a.id === result.newBadgeIds[0])
        if (def) setToastAchievement(def)
      }
      setTimeout(advanceQuestion, 1500)
    }
  }, [currentQ, inputValue, isSubmitting, feedback, lessonId, advanceQuestion, water])

  if (!lesson) {
    return <div className="p-8 text-center text-slate-500">課程不存在</div>
  }

  if (finished) {
    return (
      <div className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">練習完成！</h1>
        <p className="text-slate-500 mb-4">{lesson.title}</p>
        <p className="text-5xl font-bold text-indigo-600 mb-1">
          {score} / {questions.length}
        </p>
        <p className="text-slate-400 text-sm mb-10">答對題數</p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Link
            href={`/courses/${lessonId}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-colors text-center"
          >
            回到課程
          </Link>
          <Link
            href="/dashboard"
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            查看我的進度
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <AchievementToast
        achievement={toastAchievement}
        onClose={() => setToastAchievement(null)}
      />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/courses/${lessonId}`}
          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-1">{lesson.title}</p>
          <div className="flex items-center gap-1">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  i < currentIndex
                    ? 'bg-indigo-400'
                    : i === currentIndex
                    ? 'bg-indigo-200'
                    : 'bg-slate-100'
                }`}
              />
            ))}
          </div>
        </div>
        <span className="text-sm font-medium text-slate-500 flex-shrink-0">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Question card */}
      <div
        className={`rounded-2xl p-8 mb-6 text-center transition-all duration-300 ${
          feedback === 'correct'
            ? 'bg-emerald-50 border-2 border-emerald-300'
            : feedback === 'wrong'
            ? 'bg-orange-50 border-2 border-orange-300'
            : 'bg-white border-2 border-slate-200 shadow-sm'
        }`}
      >
        {feedback === 'correct' && (
          <div className="flex items-center justify-center gap-2 text-emerald-600 mb-3">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold text-lg">答對了！太棒了！</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="flex items-center justify-center gap-2 text-orange-600 mb-3">
            <XCircle className="w-6 h-6" />
            <span className="font-bold text-lg">再想想看！</span>
          </div>
        )}

        <p className="text-3xl font-bold text-slate-800 mb-6">
          {currentQ.question}
        </p>

        {/* Answer display */}
        <div className="inline-flex items-center justify-center bg-slate-50 border-2 border-slate-200 rounded-xl px-8 py-3 min-w-36 mb-4">
          <span className="text-3xl font-mono font-bold text-slate-700 min-h-9">
            {inputValue || <span className="text-slate-300">?</span>}
          </span>
        </div>

        {/* Hint before submission */}
        {currentQ.hint && !feedback && (
          <div className="mt-2">
            {showHint ? (
              <div className="flex items-center justify-center gap-2 text-amber-600 text-sm bg-amber-50 rounded-xl px-4 py-2">
                <Lightbulb className="w-4 h-4 flex-shrink-0" />
                {currentQ.hint}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="text-xs text-slate-400 hover:text-amber-500 transition-colors cursor-pointer flex items-center gap-1 mx-auto"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                需要提示嗎？
              </button>
            )}
          </div>
        )}

        {/* Hint shown immediately when wrong */}
        {feedback === 'wrong' && currentQ.hint && (
          <div className="mt-3 flex items-center justify-center gap-2 text-amber-600 text-sm bg-amber-50 rounded-xl px-4 py-2">
            <Lightbulb className="w-4 h-4 flex-shrink-0" />
            {currentQ.hint}
          </div>
        )}

        {/* Continue button after wrong answer */}
        {feedback === 'wrong' && !isSubmitting && (
          <button
            type="button"
            onClick={advanceQuestion}
            className="mt-4 bg-slate-700 hover:bg-slate-800 text-white font-medium px-6 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            {currentIndex + 1 >= questions.length ? '完成練習' : '繼續下一題 →'}
          </button>
        )}
      </div>

      {/* Virtual Numpad */}
      <VirtualNumpad
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        disabled={feedback !== null || isSubmitting}
      />

      {/* Score */}
      <p className="text-center text-sm text-slate-400 mt-6">
        已答對{' '}
        <span className="text-indigo-600 font-bold">{score}</span> 題
      </p>
    </div>
  )
}
