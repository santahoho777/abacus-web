# Abacus Mental Arithmetic Teaching Website — Core Platform (Plan A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 14 teaching website for children (6-12) to watch 9 MissAbacus珠心算 lessons on YouTube and track their completion progress with a student account.

**Architecture:** Next.js 14 App Router with route groups `(auth)` and `(main)`. Supabase handles student authentication (email/password) and PostgreSQL for progress storage with Row Level Security. Course pages are publicly accessible; only `/dashboard` requires auth. Static lesson data is hardcoded — no CMS required.

**Tech Stack:** Next.js 14, TypeScript 5 (strict), Tailwind CSS 3, shadcn/ui, Supabase (@supabase/ssr), Vitest + React Testing Library, deployed to Vercel.

---

## File Map

| File | Responsibility |
|------|----------------|
| `package.json` | Dependencies and scripts |
| `.env.local` | Supabase keys (not committed) |
| `supabase/migrations/001_initial.sql` | DB schema + RLS + trigger |
| `src/lib/supabase/server.ts` | Server-side Supabase client (SSR) |
| `src/lib/supabase/client.ts` | Browser Supabase client |
| `src/lib/lessons.ts` | Static lesson data (all 9 lessons) |
| `src/types/index.ts` | TypeScript types (Lesson, Profile, LessonProgress) |
| `middleware.ts` | Route protection (redirect unauthenticated from /dashboard) |
| `src/app/layout.tsx` | Root layout with font + global styles |
| `src/components/Header.tsx` | Nav with logo + auth state |
| `src/components/Footer.tsx` | Simple footer |
| `src/app/(main)/page.tsx` | Homepage / landing |
| `src/app/(main)/courses/page.tsx` | All 9 lessons grid |
| `src/components/LessonCard.tsx` | Card for one lesson in grid |
| `src/app/(main)/courses/[id]/page.tsx` | Single lesson page with YouTube embed |
| `src/components/YouTubeEmbed.tsx` | Responsive YouTube iframe |
| `src/app/(auth)/login/page.tsx` | Login form |
| `src/app/(auth)/register/page.tsx` | Register form |
| `src/app/(auth)/actions.ts` | Server Actions: login, register, logout |
| `src/app/auth/callback/route.ts` | Supabase auth callback handler |
| `src/app/dashboard/page.tsx` | Student dashboard (auth-protected) |
| `src/components/ProgressBar.tsx` | Visual progress bar |
| `src/app/dashboard/actions.ts` | Server Actions: mark lesson complete |
| `src/lib/progress.ts` | Progress query helpers |
| `src/__tests__/lessons.test.ts` | Tests: lesson data shape |
| `src/__tests__/progress.test.ts` | Tests: progress actions |
| `src/__tests__/LessonCard.test.tsx` | Component tests |
| `vitest.config.ts` | Vitest config with jsdom |
| `vitest.setup.ts` | Test setup (RTL cleanup) |

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`

- [ ] **Step 1: Scaffold Next.js 14 project**

Run in `d:\AI_project\Abacus Mental Arithmetic_web\`:
```powershell
npx create-next-app@14 abacus-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```

Expected output: creates `abacus-web/` subdirectory.

- [ ] **Step 2: Move files to project root**

```powershell
Get-ChildItem "d:\AI_project\Abacus Mental Arithmetic_web\abacus-web" -Force | Move-Item -Destination "d:\AI_project\Abacus Mental Arithmetic_web\" -Force
Remove-Item "d:\AI_project\Abacus Mental Arithmetic_web\abacus-web" -Force
```

- [ ] **Step 3: Install additional dependencies**

```powershell
npm install @supabase/supabase-js @supabase/ssr
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
npx shadcn@latest init -y
```

When shadcn asks: choose **Default** style, **Slate** color, **yes** for CSS variables.

Then add required shadcn components:
```powershell
npx shadcn@latest add button card badge progress separator
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Create `vitest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to package.json**

Open `package.json` and add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Verify setup**

```powershell
npm run test:run
```

Expected: 0 tests, no errors. If there are errors from default Next.js test setup, delete any conflicting test files.

- [ ] **Step 7: Initialize git and first commit**

```powershell
git init
git add .
git commit -m "feat: initialize Next.js 14 project with TypeScript, Tailwind, shadcn/ui, Vitest"
```

---

## Task 2: Supabase Setup

**Files:**
- Create: `supabase/migrations/001_initial.sql`, `src/lib/supabase/server.ts`, `src/lib/supabase/client.ts`, `.env.local`, `.env.example`

- [ ] **Step 1: Create .env.local**

Create `.env.local` (never commit this file):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create `.env.example` (commit this):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Add `.env.local` to `.gitignore` if not already there.

- [ ] **Step 2: Create DB migration SQL**

Create `supabase/migrations/001_initial.sql`:
```sql
-- profiles: extends auth.users with display name
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  created_at timestamptz default now() not null
);

-- lesson_progress: one row per student per lesson
create table public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id integer not null check (lesson_id between 1 and 9),
  completed boolean default false not null,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);

-- RLS: enable row level security
alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;

-- profiles: user can only read/update their own row
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- lesson_progress: user can only see/modify their own progress
create policy "progress_select_own" on public.lesson_progress
  for select using (auth.uid() = user_id);

create policy "progress_insert_own" on public.lesson_progress
  for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.lesson_progress
  for update using (auth.uid() = user_id);

-- auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

**To apply migration:** Go to your Supabase dashboard → SQL Editor → paste and run the contents of this file.

- [ ] **Step 3: Create server-side Supabase client**

Create `src/lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component — middleware handles refresh
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: Create browser Supabase client**

Create `src/lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 5: Commit**

```powershell
git add supabase/ src/lib/supabase/ .env.example
git commit -m "feat: add Supabase client utilities and DB migration"
```

---

## Task 3: TypeScript Types + Static Lesson Data

**Files:**
- Create: `src/types/index.ts`, `src/lib/lessons.ts`, `src/__tests__/lessons.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/lessons.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { LESSONS, getLessonById } from '@/lib/lessons'

describe('lessons data', () => {
  it('has exactly 9 lessons', () => {
    expect(LESSONS).toHaveLength(9)
  })

  it('each lesson has required fields', () => {
    LESSONS.forEach((lesson) => {
      expect(lesson.id).toBeGreaterThanOrEqual(1)
      expect(lesson.id).toBeLessThanOrEqual(9)
      expect(lesson.title).toBeTruthy()
      expect(lesson.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/)
      expect(lesson.description).toBeTruthy()
      expect(Array.isArray(lesson.topics)).toBe(true)
    })
  })

  it('getLessonById returns correct lesson', () => {
    const lesson = getLessonById(1)
    expect(lesson?.youtubeId).toBe('JG89_aZkvfE')
  })

  it('getLessonById returns undefined for invalid id', () => {
    expect(getLessonById(0)).toBeUndefined()
    expect(getLessonById(10)).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
npm run test:run -- src/__tests__/lessons.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/lessons'`

- [ ] **Step 3: Create TypeScript types**

Create `src/types/index.ts`:
```typescript
export interface Lesson {
  id: number
  title: string
  youtubeId: string
  description: string
  topics: string[]
  duration: string
}

export interface Profile {
  id: string
  name: string
  created_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: number
  completed: boolean
  completed_at: string | null
}

export interface LessonWithProgress extends Lesson {
  completed: boolean
}
```

- [ ] **Step 4: Create static lesson data**

Create `src/lib/lessons.ts`:
```typescript
import { Lesson } from '@/types'

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: '第1課：認識算盤與基本指法',
    youtubeId: 'JG89_aZkvfE',
    description: '學習認識數字和位值、認識算盤的結構、四句指法口訣、以及無口訣的基本珠算練習。',
    topics: ['數字與位值', '算盤結構介紹', '指法口訣：加一二三四拇指', '無口訣珠算練習'],
    duration: '約15分鐘',
  },
  {
    id: 2,
    title: '第2課：10的組合加法口訣',
    youtubeId: 'u2P-U71S9d0',
    description: '學習10的組合加法口訣「減補數加10」，以及手指算盤的使用方法。',
    topics: ['補數的概念（1+9, 2+8, 3+7, 4+6, 5+5）', '加法口訣：減補數加10', '手指算盤：右手個位、左手十位'],
    duration: '約15分鐘',
  },
  {
    id: 3,
    title: '第3課：10的組合減法口訣',
    youtubeId: '0Y5v1PVGV0U',
    description: '學習10的組合減法口訣「減10加補數」，與加法口訣對應記憶。',
    topics: ['減法口訣：減10加補數', '加減法口訣對比練習', '手指算盤減法練習'],
    duration: '約12分鐘',
  },
  {
    id: 4,
    title: '第4課：5的組合加減法口訣',
    youtubeId: 'OGIndcgmlLk',
    description: '學習5的組合口訣：加法「減補數加5」、減法「減5加補數」，以及雙指同時撥珠的指法技巧。',
    topics: ['5的補數：1+4, 2+3', '加法口訣：減補數加5', '減法口訣：減5加補數', '雙指同時撥珠技巧'],
    duration: '約18分鐘',
  },
  {
    id: 5,
    title: '第5課：綜合口訣練習',
    youtubeId: 'I9YgRjMQj7U',
    description: '綜合運用10的組合與5的組合口訣，練習較複雜的加減法題目。',
    topics: ['口訣綜合應用', '多位數加減練習', '何時用5的口訣、何時用10的口訣'],
    duration: '約15分鐘',
  },
  {
    id: 6,
    title: '第6課：總複習',
    youtubeId: 'xTb4UUWuLAs',
    description: '複習所有學過的口訣，鞏固基礎，準備進入進階練習。',
    topics: ['所有口訣完整複習', '常見錯誤提醒', '練習速度提升技巧'],
    duration: '約15分鐘',
  },
  {
    id: 7,
    title: '第7課：珠算練習 +1 到 +100',
    youtubeId: 'GjRRs-IJpcQ',
    description: '從+1連加到+100，訓練快速撥珠和口訣反應速度。',
    topics: ['連加練習', '速度訓練', '正確使用各種口訣'],
    duration: '約20分鐘',
  },
  {
    id: 8,
    title: '第8課：從珠算到心算',
    youtubeId: '8A7pWZSO80w',
    description: '學習如何在腦中想像算盤進行心算，不需要實體算盤也能計算。',
    topics: ['心算的基本概念', '在腦中想像算盤', '珠算過渡到心算的練習方法'],
    duration: '約18分鐘',
  },
  {
    id: 9,
    title: '第9課：九九乘法表心算',
    youtubeId: 'uuSooZ0ilYE',
    description: '利用手指算盤快速計算九九乘法表，不需要死背，理解計算方法。',
    topics: ['乘法的概念', '用手指算盤算乘法', '九九乘法表快速計算'],
    duration: '約20分鐘',
  },
]

export function getLessonById(id: number): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id)
}
```

- [ ] **Step 5: Run test to verify it passes**

```powershell
npm run test:run -- src/__tests__/lessons.test.ts
```

Expected: PASS — 4 tests passing.

- [ ] **Step 6: Commit**

```powershell
git add src/types/ src/lib/lessons.ts src/__tests__/lessons.test.ts
git commit -m "feat: add TypeScript types and static lesson data for all 9 lessons"
```

---

## Task 4: Route Protection Middleware

**Files:**
- Create: `middleware.ts`, `src/lib/supabase/middleware.ts`

- [ ] **Step 1: Create Supabase middleware helper**

Create `src/lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /dashboard — redirect to login if not authenticated
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from auth pages
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

- [ ] **Step 2: Create root middleware**

Create `middleware.ts` (at project root, not in src/):
```typescript
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 3: Commit**

```powershell
git add middleware.ts src/lib/supabase/middleware.ts
git commit -m "feat: add route protection middleware for /dashboard"
```

---

## Task 5: Root Layout + Header + Footer

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/Header.tsx`, `src/components/Footer.tsx`
- Create: `src/app/(main)/layout.tsx`, `src/app/(auth)/layout.tsx`

- [ ] **Step 1: Update root layout**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
})

export const metadata: Metadata = {
  title: {
    default: '珠心算學習平台 | Miss Abacus',
    template: '%s | 珠心算學習平台',
  },
  description: '為6-12歲兒童設計的珠心算線上課程，學習算盤操作與心算技巧。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSansTC.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create Header component**

Create `src/components/Header.tsx`:
```tsx
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
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-800 hover:text-indigo-600 transition-colors">
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
                <Button variant="outline" size="sm" type="submit" className="gap-1 cursor-pointer">
                  <LogOut className="w-4 h-4" />
                  登出
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer">登入</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="cursor-pointer bg-indigo-600 hover:bg-indigo-700">免費註冊</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Create Footer component**

Create `src/components/Footer.tsx`:
```tsx
import Link from 'next/link'
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
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} 珠心算學習平台</p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Create (main) layout with Header + Footer**

Create `src/app/(main)/layout.tsx`:
```tsx
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 5: Create (auth) layout**

Create `src/app/(auth)/layout.tsx`:
```tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {children}
    </div>
  )
}
```

- [ ] **Step 6: Add lucide-react**

```powershell
npm install lucide-react
```

- [ ] **Step 7: Commit**

```powershell
git add src/app/layout.tsx src/components/ src/app/\(main\)/layout.tsx src/app/\(auth\)/layout.tsx
git commit -m "feat: add root layout, Header, Footer, and route group layouts"
```

---

## Task 6: Auth Pages + Server Actions

**Files:**
- Create: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Create: `src/app/(auth)/actions.ts`
- Create: `src/app/auth/callback/route.ts`

- [ ] **Step 1: Create Server Actions for auth**

Create `src/app/(auth)/actions.ts`:
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?error=' + encodeURIComponent('電子郵件或密碼錯誤'))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function register(formData: FormData) {
  const supabase = createClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })

  if (error) {
    redirect('/register?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}
```

- [ ] **Step 2: Create login page**

Create `src/app/(auth)/login/page.tsx`:
```tsx
import Link from 'next/link'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

export const metadata = { title: '登入' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">歡迎回來</h1>
          <p className="text-slate-500 text-sm mt-1">登入繼續學習</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {searchParams.error}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              電子郵件
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
            登入
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          還沒有帳號？{' '}
          <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            免費註冊
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create register page**

Create `src/app/(auth)/register/page.tsx`:
```tsx
import Link from 'next/link'
import { register } from '../actions'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

export const metadata = { title: '註冊' }

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-4">
            <BookOpen className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">建立帳號</h1>
          <p className="text-slate-500 text-sm mt-1">開始你的珠心算學習之旅</p>
        </div>

        {searchParams.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {searchParams.error}
          </div>
        )}

        <form action={register} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
              姓名
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              autoComplete="name"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="你的名字"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              電子郵件
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              密碼
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="至少6個字元"
            />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
            建立帳號
          </Button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          已有帳號？{' '}
          <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            登入
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create auth callback route**

Create `src/app/auth/callback/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('驗證失敗，請重試')}`)
}
```

- [ ] **Step 5: Commit**

```powershell
git add src/app/\(auth\)/ src/app/auth/
git commit -m "feat: add login, register pages and auth server actions"
```

---

## Task 7: Homepage (Landing Page)

**Files:**
- Create: `src/app/(main)/page.tsx`

- [ ] **Step 1: Create homepage**

Create `src/app/(main)/page.tsx`:
```tsx
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
          跟著 Miss Abacus 的專業課程，從認識算盤到心算能力，
          循序漸進，輕鬆學會珠心算！
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/courses">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-8">
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
              title: '專業師資教學',
              desc: 'Miss Abacus 多年珠心算教學經驗',
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
              <h3 className="font-semibold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Course preview */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">課程內容</h2>
            <p className="text-slate-500 text-sm mt-1">共 {LESSONS.length} 堂課，循序漸進</p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" className="cursor-pointer text-indigo-600 hover:text-indigo-700">
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
          <h2 className="text-3xl font-bold text-white mb-4">準備好開始了嗎？</h2>
          <p className="text-indigo-100 mb-8">免費註冊帳號，記錄你的學習進度</p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 cursor-pointer px-8">
              立即免費開始
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/app/\(main\)/page.tsx
git commit -m "feat: add homepage with hero, features, and course preview sections"
```

---

## Task 8: Courses Listing Page + LessonCard Component

**Files:**
- Create: `src/app/(main)/courses/page.tsx`, `src/components/LessonCard.tsx`
- Create: `src/__tests__/LessonCard.test.tsx`

- [ ] **Step 1: Write the failing test for LessonCard**

Create `src/__tests__/LessonCard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import LessonCard from '@/components/LessonCard'
import { LESSONS } from '@/lib/lessons'

describe('LessonCard', () => {
  const lesson = LESSONS[0]

  it('renders lesson title', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    expect(screen.getByText(lesson.title)).toBeInTheDocument()
  })

  it('renders lesson number', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows completed badge when completed', () => {
    render(<LessonCard lesson={lesson} completed={true} />)
    expect(screen.getByText('已完成')).toBeInTheDocument()
  })

  it('does not show completed badge when not completed', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    expect(screen.queryByText('已完成')).not.toBeInTheDocument()
  })

  it('renders link to correct lesson page', () => {
    render(<LessonCard lesson={lesson} completed={false} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/courses/${lesson.id}`)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
npm run test:run -- src/__tests__/LessonCard.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/LessonCard'`

- [ ] **Step 3: Create LessonCard component**

Create `src/components/LessonCard.tsx`:
```tsx
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
            <span className="text-xs text-slate-400">+{lesson.topics.length - 2}</span>
          )}
        </div>
      )}
    </Link>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```powershell
npm run test:run -- src/__tests__/LessonCard.test.tsx
```

Expected: PASS — 5 tests passing.

- [ ] **Step 5: Create courses listing page**

Create `src/app/(main)/courses/page.tsx`:
```tsx
import { LESSONS } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import LessonCard from '@/components/LessonCard'
import { BookOpen } from 'lucide-react'

export const metadata = { title: '課程列表' }

export default async function CoursesPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch progress only if logged in
  let completedIds: number[] = []
  if (user) {
    const { data } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true)
    completedIds = (data ?? []).map((row) => row.lesson_id)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">珠心算課程</h1>
            <p className="text-slate-500 text-sm">共 {LESSONS.length} 堂課 · 適合6-12歲</p>
          </div>
        </div>
        {user && completedIds.length > 0 && (
          <p className="text-sm text-emerald-600 font-medium">
            你已完成 {completedIds.length} / {LESSONS.length} 堂課 🎉
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LESSONS.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            completed={completedIds.includes(lesson.id)}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```powershell
git add src/components/LessonCard.tsx src/app/\(main\)/courses/page.tsx src/__tests__/LessonCard.test.tsx
git commit -m "feat: add LessonCard component and courses listing page"
```

---

## Task 9: Individual Lesson Page + YouTubeEmbed

**Files:**
- Create: `src/app/(main)/courses/[id]/page.tsx`, `src/components/YouTubeEmbed.tsx`

- [ ] **Step 1: Create YouTubeEmbed component**

Create `src/components/YouTubeEmbed.tsx`:
```tsx
interface YouTubeEmbedProps {
  videoId: string
  title: string
}

export default function YouTubeEmbed({ videoId, title }: YouTubeEmbedProps) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
        loading="lazy"
      />
    </div>
  )
}
```

- [ ] **Step 2: Create individual lesson page**

Create `src/app/(main)/courses/[id]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { LESSONS, getLessonById } from '@/lib/lessons'
import { createClient } from '@/lib/supabase/server'
import YouTubeEmbed from '@/components/YouTubeEmbed'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Tag } from 'lucide-react'
import { markLessonComplete } from '@/app/dashboard/actions'

export async function generateStaticParams() {
  return LESSONS.map((lesson) => ({ id: String(lesson.id) }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const lesson = getLessonById(Number(params.id))
  if (!lesson) return { title: '課程不存在' }
  return { title: lesson.title }
}

export default async function LessonPage({ params }: { params: { id: string } }) {
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
        <Link href="/courses" className="hover:text-indigo-600 transition-colors">
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
        <p className="text-slate-500 mt-2 leading-relaxed">{lesson.description}</p>
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
              <li key={topic} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                {topic}
              </li>
            ))}
          </ul>
        </div>
      )}

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
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
                  標記為已完成
                </Button>
              </form>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800 text-sm">追蹤學習進度</p>
              <p className="text-slate-500 text-xs mt-0.5">登入後可記錄完成的課程</p>
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
```

- [ ] **Step 3: Commit**

```powershell
git add src/components/YouTubeEmbed.tsx src/app/\(main\)/courses/
git commit -m "feat: add individual lesson page with YouTube embed and prev/next navigation"
```

---

## Task 10: Progress Server Actions + Tests

**Files:**
- Create: `src/app/dashboard/actions.ts`, `src/lib/progress.ts`
- Create: `src/__tests__/progress.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/progress.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase client
const mockUpsert = vi.fn().mockResolvedValue({ error: null })
const mockSelect = vi.fn().mockReturnValue({
  eq: vi.fn().mockReturnThis(),
  data: [{ lesson_id: 1 }, { lesson_id: 3 }],
  error: null,
})

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
      }),
    },
    from: vi.fn(() => ({
      upsert: mockUpsert,
      select: mockSelect,
    })),
  })),
}))

describe('progress utilities', () => {
  it('calculates completion percentage correctly', async () => {
    const { calculateProgressPercent } = await import('@/lib/progress')
    expect(calculateProgressPercent(0, 9)).toBe(0)
    expect(calculateProgressPercent(9, 9)).toBe(100)
    expect(calculateProgressPercent(3, 9)).toBe(33)
    expect(calculateProgressPercent(5, 9)).toBe(56)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```powershell
npm run test:run -- src/__tests__/progress.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/progress'`

- [ ] **Step 3: Create progress utilities**

Create `src/lib/progress.ts`:
```typescript
export function calculateProgressPercent(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}
```

- [ ] **Step 4: Create dashboard Server Actions**

Create `src/app/dashboard/actions.ts`:
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function markLessonComplete(lessonId: number) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  await supabase.from('lesson_progress').upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,lesson_id' }
  )

  revalidatePath(`/courses/${lessonId}`)
  revalidatePath('/dashboard')
  revalidatePath('/courses')
}
```

- [ ] **Step 5: Run test to verify it passes**

```powershell
npm run test:run -- src/__tests__/progress.test.ts
```

Expected: PASS — 1 test passing.

- [ ] **Step 6: Commit**

```powershell
git add src/app/dashboard/actions.ts src/lib/progress.ts src/__tests__/progress.test.ts
git commit -m "feat: add progress server action and calculation utility"
```

---

## Task 11: Student Dashboard + ProgressBar

**Files:**
- Create: `src/app/dashboard/page.tsx`, `src/components/ProgressBar.tsx`

- [ ] **Step 1: Create ProgressBar component**

Create `src/components/ProgressBar.tsx`:
```tsx
import { calculateProgressPercent } from '@/lib/progress'

interface ProgressBarProps {
  completed: number
  total: number
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percent = calculateProgressPercent(completed, total)
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600 font-medium">學習進度</span>
        <span className="text-indigo-600 font-bold">{completed} / {total} 堂</span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`學習進度 ${percent}%`}
        />
      </div>
      <p className="text-xs text-slate-400 text-right">{percent}% 完成</p>
    </div>
  )
}
```

- [ ] **Step 2: Create dashboard page**

Create `src/app/dashboard/page.tsx`:
```tsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LESSONS } from '@/lib/lessons'
import LessonCard from '@/components/LessonCard'
import ProgressBar from '@/components/ProgressBar'
import { User, Trophy, Flame } from 'lucide-react'

export const metadata = { title: '我的學習進度' }

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch profile + progress in parallel
  const [profileResult, progressResult] = await Promise.all([
    supabase.from('profiles').select('name').eq('id', user.id).single(),
    supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id)
      .eq('completed', true),
  ])

  const name = profileResult.data?.name ?? user.email?.split('@')[0] ?? '同學'
  const completedIds = (progressResult.data ?? []).map((row) => row.lesson_id)
  const completedCount = completedIds.length
  const totalCount = LESSONS.length

  // Find next incomplete lesson
  const nextLesson = LESSONS.find((l) => !completedIds.includes(l.id))

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 opacity-80" />
              <span className="text-indigo-100 text-sm">你好，</span>
            </div>
            <h1 className="text-2xl font-bold mb-4">{name} 同學</h1>
            <ProgressBar completed={completedCount} total={totalCount} />
          </div>
          {completedCount === totalCount && (
            <div className="bg-white/20 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 mx-auto mb-1" />
              <p className="text-xs font-medium">全部完成！</p>
            </div>
          )}
        </div>
      </div>

      {/* Next lesson prompt */}
      {nextLesson && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900 text-sm">繼續學習</p>
              <p className="text-amber-700 text-xs mt-0.5">{nextLesson.title}</p>
            </div>
          </div>
          <Link
            href={`/courses/${nextLesson.id}`}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            繼續 →
          </Link>
        </div>
      )}

      {/* All lessons grid */}
      <div>
        <h2 className="font-bold text-slate-800 mb-4">所有課程</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LESSONS.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              completed={completedIds.includes(lesson.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```powershell
git add src/components/ProgressBar.tsx src/app/dashboard/page.tsx
git commit -m "feat: add student dashboard with progress bar and lesson grid"
```

---

## Task 12: Final Integration Check

- [ ] **Step 1: Run all tests**

```powershell
npm run test:run
```

Expected: all tests pass with no errors.

- [ ] **Step 2: Build the project**

```powershell
npm run build
```

Expected: successful build with no TypeScript errors.

- [ ] **Step 3: Verify Supabase migration is applied**

Go to your Supabase project dashboard → SQL Editor → run this verification query:
```sql
select table_name from information_schema.tables
where table_schema = 'public'
order by table_name;
```

Expected output includes: `lesson_progress`, `profiles`

- [ ] **Step 4: Start dev server and test manually**

```powershell
npm run dev
```

Manual test checklist:
- [ ] Homepage loads at `http://localhost:3000` with hero, features, course preview
- [ ] Courses page shows all 9 lessons at `/courses`
- [ ] Each lesson page opens correctly (e.g., `/courses/1`) with YouTube embed
- [ ] Prev/next navigation works between lesson pages
- [ ] Register page at `/register` accepts form submission
- [ ] Login page at `/login` works with registered credentials
- [ ] Dashboard at `/dashboard` shows progress bar and lesson grid
- [ ] "標記為已完成" button updates lesson status on the lesson page
- [ ] Completed lessons show green badge in courses grid and dashboard
- [ ] Logging out redirects to homepage
- [ ] Unauthenticated access to `/dashboard` redirects to `/login`

- [ ] **Step 5: Final commit**

```powershell
git add .
git commit -m "feat: Plan A complete — abacus teaching platform with 9 lessons, auth, and progress tracking"
```

---

## Environment Setup Notes

Before starting implementation, you need:

1. **Node.js** v18+ — check with `node --version`
2. **A Supabase project** — create one free at [supabase.com](https://supabase.com), copy the Project URL and anon key into `.env.local`
3. **Supabase Email Confirmation** — for development, go to Supabase dashboard → Authentication → Email → disable "Confirm email" so you can register without email confirmation
4. **Vercel deployment** (optional for development) — connect GitHub repo to Vercel, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables

---

## Post-Plan A: Plan B Features (Deferred)

These features were intentionally excluded from Plan A to keep scope manageable:

- Interactive visual abacus component (drag beads, animate calculations)
- Gamified practice exercises with scoring
- Achievement badges and streak tracking
- Lesson difficulty levels (初級/中級/高級)
- Parent/teacher admin panel
- Practice worksheets (fill the gap left by abacusclassroom.com being offline)
