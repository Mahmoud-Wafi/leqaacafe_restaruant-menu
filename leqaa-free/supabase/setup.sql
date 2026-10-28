-- LEQAA menu: one-time Supabase setup.
-- Paste this whole file in Supabase > SQL Editor > New query, then press Run.
--
-- STEP 1: change PUT-YOUR-EMAIL-HERE below to the manager's email.
-- It must be the same email you create under Authentication > Users.

create table if not exists public.manager_emails (email text primary key);
alter table public.manager_emails enable row level security;
insert into public.manager_emails (email) values (lower('PUT-YOUR-EMAIL-HERE')) on conflict do nothing;

-- Tells the database whether the person signed in is the manager.
create or replace function public.is_manager() returns boolean
language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.manager_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- The menu itself: one row holding the whole menu.
create table if not exists public.menu (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.menu enable row level security;
grant select on public.menu to anon, authenticated;
grant insert, update on public.menu to authenticated;

drop policy if exists "anyone can read the menu" on public.menu;
drop policy if exists "manager can add the menu" on public.menu;
drop policy if exists "manager can change the menu" on public.menu;
create policy "anyone can read the menu" on public.menu
  for select to anon, authenticated using (true);
create policy "manager can add the menu" on public.menu
  for insert to authenticated with check (public.is_manager());
create policy "manager can change the menu" on public.menu
  for update to authenticated using (public.is_manager()) with check (public.is_manager());

-- Photos: a public bucket anyone can view, only the manager can change.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu-photos', 'menu-photos', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "manager can upload photos" on storage.objects;
drop policy if exists "manager can replace photos" on storage.objects;
drop policy if exists "manager can delete photos" on storage.objects;
create policy "manager can upload photos" on storage.objects
  for insert to authenticated with check (bucket_id = 'menu-photos' and public.is_manager());
create policy "manager can replace photos" on storage.objects
  for update to authenticated using (bucket_id = 'menu-photos' and public.is_manager());
create policy "manager can delete photos" on storage.objects
  for delete to authenticated using (bucket_id = 'menu-photos' and public.is_manager());
