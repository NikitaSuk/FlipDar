-- Create suggestions table and policies
create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  description text not null,
  priority text not null default 'medium',
  status text not null default 'pending',
  created_at timestamp with time zone default now()
);

alter table public.suggestions enable row level security;

create policy "Users can insert their own suggestions"
  on public.suggestions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can select their own suggestions"
  on public.suggestions
  for select
  using (auth.uid() = user_id);
