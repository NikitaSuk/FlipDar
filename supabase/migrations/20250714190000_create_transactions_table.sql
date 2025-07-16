-- Create transactions table and policies
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('sale', 'purchase')),
  item text not null,
  price decimal(10,2) not null,
  date timestamp with time zone default now(),
  platform text,
  condition text,
  notes text,
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;

create policy "Users can insert their own transactions"
  on public.transactions
  for insert
  with check (auth.uid() = user_id);

create policy "Users can select their own transactions"
  on public.transactions
  for select
  using (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions
  for delete
  using (auth.uid() = user_id); 