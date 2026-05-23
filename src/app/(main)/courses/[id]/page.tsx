import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LESSONS, getLessonById } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import YouTubeEmbed from '@/components/YouTubeEmbed'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Tag,
} from 'lucide-react'
import { markLessonComplete } from '@/app/dashboard/actions'

export async function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: String(lesson.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}) {
  const lesson = getLessonById(Number(params.id))
  if (!lesson) return { title: '課程不存在' }
  return { title: lesson.title }
}

export default async function LessonPage({
  params,
}: {
  params: { id: string }
}) {
  const lessonId = Number(params.id)
  const lesson = getLessonById(lessonId)
  if (!lesson) notFound()

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isCompleted = false
  if (user) {
    const { data } = await supabase
      .from('lesson_progress')
      .select('completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()
    isCompleted = data?.completed ?? false
  }

  const prevLesson = getLessonById(lessonId - 1)
  const nextLesson = getLessonById(lessonId + 1)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link
          href="/courses"
          className="hover:text-indigo-600 transition-colors"
        >
          課程列表
        </Link>
        <span>/</span>
        <span className="text-slate-600">{lesson.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
            {lesson.id}
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {lesson.duration}
          </div>
          {isCompleted && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              已完成
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{lesson.title}</h1>
        <p className="text-slate-500 mt-2 leading-relaxed">
          {lesson.description}
        </p>
      </div>

      {/* Video */}
      <YouTubeEmbed videoId={lesson.youtubeId} title={lesson.title} />

      {/* Topics */}
      {lesson.topics.length > 0 && (
        <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
            <Tag className="w-4 h-4 text-indigo-500" />
            本課學習重點
          </div>
          <ul className="space-y-1.5">
            {lesson.topics.map((topic) => (
              <li
                key={topic}
                className="flex items-start gap-2 text-sm text-slate-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practice link */}
      <div className="mt-6 text-center">
        <Link
          href={`/courses/${lessonId}/practice`}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          ✏️ 開始練習
        </Link>
      </div>

      {/* Mark complete / login prompt */}
      <div className="mt-8 p-5 bg-white border border-slate-200 rounded-xl">
        {user ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 text-sm">學完了嗎？</p>
              <p className="text-slate-500 text-xs mt-0.5">記錄你的學習進度</p>
            </div>
            {isCompleted ? (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 px-4 py-2 text-sm">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                已完成
              </Badge>
            ) : (
              <form action={markLessonComplete.bind(null, lessonId)}>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                >
                  標記為已完成
                </Button>
              </form>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 text-sm">追蹤學習進度</p>
              <p className="text-slate-500 text-xs mt-0.5">
                登入後可記錄完成的課程
              </p>
            </div>
            <Link href="/login">
              <Button variant="outline" size="sm" className="cursor-pointer">
                登入帳號
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/courses/${prevLesson.id}`}
            className="flex-1 group bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <ChevronLeft className="w-3.5 h-3.5" />
              上一課
            </div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
              {prevLesson.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {nextLesson ? (
          <Link
            href={`/courses/${nextLesson.id}`}
            className="flex-1 group bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-sm transition-all duration-200 cursor-pointer text-right"
          >
            <div className="flex items-center justify-end gap-2 text-slate-400 text-xs mb-1">
              下一課
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
              {nextLesson.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  )
}
