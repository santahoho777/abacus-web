import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { TreeProvider } from '@/contexts/TreeContext'
import TreeSidebar from '@/components/TreeSidebar'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let initialTotalCorrect = 0
  if (user) {
    const { data } = await supabase
      .from('tree_progress')
      .select('total_correct')
      .eq('user_id', user.id)
      .single()
    initialTotalCorrect = data?.total_correct ?? 0
  }

  return (
    <TreeProvider initialTotalCorrect={initialTotalCorrect}>
      <Header />
      <div className="flex min-h-screen">
        <main className="flex-1 min-w-0">{children}</main>
        {user && <TreeSidebar />}
      </div>
      <Footer />
    </TreeProvider>
  )
}
