import Link from 'next/link'
import { Lesson } from '@/types'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, Play } from 'lucide-react'

interface LessonCardProps {
  lesson: Lesson
  completed: boolean
}

export default function LessonCard({ lesson, completed }: LessonCardProps) {
  return (
    <Link
      href={`/courses/${lesson.id}`}
      className="group block bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-sm font-bold group-hover:bg-indigo-100 transition-colors">
            {lesson.id}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {lesson.duration}
          </div>
        </div>
        {completed ? (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            已完成
          </Badge>
        ) : (
          <div className="w-7 h-7 rounded-full border-2 border-slate-200 group-hover:border-indigo-400 transition-colors flex items-center justify-center">
            <Play className="w-3 h-3 text-slate-300 group-hover:text-indigo-400 transition-colors ml-0.5" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors mb-2">
        {lesson.title}
      </h3>
      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
        {lesson.description}
      </p>

      {lesson.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {lesson.topics.slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="text-xs bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-100"
            >
              {topic}
            </span>
          ))}
          {lesson.topics.length > 2 && (
            <span className="text-xs text-slate-400">
              +{lesson.topics.length - 2}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
