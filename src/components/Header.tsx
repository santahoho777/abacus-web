import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { LogOut, BookOpen, LayoutDashboard } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

export default async function Header() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-4 z-50 mx-4">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-slate-800 hover:text-indigo-600 transition-colors"
        >
          <BookOpen className="w-5 h-5 text-indigo-500" />
          珠心算學習平台
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/courses"
            className="text-sm text-slate-600 hover:text-indigo-600 transition-colors font-medium"
          >
            課程列表
          </Link>


          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-1 cursor-pointer">
                  <LayoutDashboard className="w-4 h-4" />
                  我的進度
                </Button>
              </Link>
              <form action={logout}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="gap-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  登出
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  登入
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="cursor-pointer bg-indigo-600 hover:bg-indigo-700"
                >
                  免費註冊
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
