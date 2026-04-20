create extension if not exists pgcrypto;

create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  map_id integer not null check (map_id > 0),
  started_at timestamptz not null,
  ended_at timestamptz not null,
  score integer not null check (score >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.runs enable row level security;

grant usage on schema public to authenticated;
grant select, insert on table public.runs to authenticated;

create index if not exists runs_user_id_created_at_idx
  on public.runs (user_id, created_at desc);

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'runs'
      and policyname = 'Authenticated users can read their own runs'
  ) then
    create policy "Authenticated users can read their own runs"
      on public.runs
      for select
      to authenticated
      using ((select auth.uid()) = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'runs'
      and policyname = 'Authenticated users can insert their own runs'
  ) then
    create policy "Authenticated users can insert their own runs"
      on public.runs
      for insert
      to authenticated
      with check ((select auth.uid()) = user_id);
  end if;
end
$$;
