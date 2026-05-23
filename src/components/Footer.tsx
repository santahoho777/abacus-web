import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-600">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium">珠心算學習平台</span>
        </div>
        <p className="text-sm text-slate-400">
          課程內容來自{' '}
          <a
            href="https://www.youtube.com/@MissAbacus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-600 transition-colors"
          >
            Miss Abacus YouTube 頻道
          </a>
        </p>
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} 珠心算學習平台
        </p>
      </div>
    </footer>
  )
}
