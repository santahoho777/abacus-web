-- tree_progress: one row per user, tracks total correct answers
create table public.tree_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  total_correct integer default 0 not null,
  updated_at timestamptz default now() not null
);

-- practice_attempts: every answer submitted
create table public.practice_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id integer not null check (lesson_id between 1 and 9),
  question_id text not null,
  is_correct boolean not null,
  answered_at timestamptz default now() not null
);

-- achievements: one row per badge earned
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text not null,
  earned_at timestamptz default now() not null,
  unique(user_id, badge_id)
);

-- RLS
alter table public.tree_progress enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.achievements enable row level security;

create policy "tree_select_own" on public.tree_progress
  for select using (auth.uid() = user_id);
create policy "tree_insert_own" on public.tree_progress
  for insert with check (auth.uid() = user_id);
create policy "tree_update_own" on public.tree_progress
  for update using (auth.uid() = user_id);

create policy "attempts_select_own" on public.practice_attempts
  for select using (auth.uid() = user_id);
create policy "attempts_insert_own" on public.practice_attempts
  for insert with check (auth.uid() = user_id);

create policy "achievements_select_own" on public.achievements
  for select using (auth.uid() = user_id);
create policy "achievements_insert_own" on public.achievements
  for insert with check (auth.uid() = user_id);
