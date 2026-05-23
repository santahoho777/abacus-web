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
