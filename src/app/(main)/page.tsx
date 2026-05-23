import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LESSONS } from '@/lib/lessons'
import { BookOpen, Star, Target, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Star className="w-3.5 h-3.5" />
          適合6-12歲兒童
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 leading-tight mb-6">
          讓孩子愛上
          <span className="text-indigo-600"> 珠心算</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          從認識算盤到心算能力，循序漸進，輕鬆學會珠心算！
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/courses">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-8"
            >
              開始學習
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="cursor-pointer px-8">
              免費註冊帳號
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: <BookOpen className="w-6 h-6 text-indigo-500" />,
              title: `${LESSONS.length} 堂完整課程`,
              desc: '從零基礎到心算，完整學習路徑',
            },
            {
              icon: <Target className="w-6 h-6 text-purple-500" />,
              title: '系統化課程',
              desc: '從基礎到進階，按部就班循序學習',
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-emerald-500" />,
              title: '追蹤學習進度',
              desc: '記錄每堂課完成狀況，隨時掌握進度',
            },
          ].map((feature) => (
            <div key={feature.title} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-50 rounded-xl mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Course preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">課程內容</h2>
            <p className="text-slate-500 text-sm mt-1">
              共 {LESSONS.length} 堂課，循序漸進
            </p>
          </div>
          <Link href="/courses">
            <Button
              variant="ghost"
              className="cursor-pointer text-indigo-600 hover:text-indigo-700"
            >
              查看全部 →
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.slice(0, 6).map((lesson) => (
            <Link
              key={lesson.id}
              href={`/courses/${lesson.id}`}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="flex-shrink-0 w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold">
                  {lesson.id}
                </span>
                <span className="text-xs text-slate-400">{lesson.duration}</span>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                {lesson.title}
              </h3>
              <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                {lesson.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            準備好開始了嗎？
          </h2>
          <p className="text-indigo-100 mb-8">免費註冊帳號，記錄你的學習進度</p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 cursor-pointer px-8"
            >
              立即免費開始
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
