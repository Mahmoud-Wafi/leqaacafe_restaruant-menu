-- LEQAA menu: customer orders + captain access.
-- Run this AFTER setup.sql. Paste the whole file in Supabase > SQL Editor > New query, then press Run.
--
-- BEFORE YOU RUN IT: change the two captain emails just below.
-- Each email must also exist under Authentication > Users (create the user with a password, tick "Auto Confirm User").

create table if not exists public.captain_emails (email text primary key);
alter table public.captain_emails enable row level security;

insert into public.captain_emails (email) values
  (lower('CAPTAIN-1-EMAIL@example.com')),   -- CHANGE: first captain's email
  (lower('CAPTAIN-2-EMAIL@example.com'))    -- CHANGE: second captain's email
on conflict do nothing;

create or replace function public.is_captain() returns boolean
language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.captain_emails
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  table_no int not null,
  items jsonb not null,
  notes text not null default '',
  total numeric not null default 0,
  status text not null default 'new' check (status in ('new', 'preparing', 'done')),
  device text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders (created_at desc);
alter table public.orders enable row level security;

-- nobody can touch the table directly, except captains who may change the status of recent orders
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;
grant update (status) on public.orders to authenticated;

drop policy if exists "captains see orders from the last 30 minutes" on public.orders;
drop policy if exists "captains change order status" on public.orders;
create policy "captains see orders from the last 30 minutes" on public.orders
  for select to authenticated
  using (public.is_captain() and created_at > now() - interval '30 minutes');
create policy "captains change order status" on public.orders
  for update to authenticated
  using (public.is_captain() and created_at > now() - interval '30 minutes')
  with check (public.is_captain());

-- ---------- phones that receive push notifications ----------
create table if not exists public.push_subscriptions (
  id bigint generated always as identity primary key,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  email text not null default '',
  created_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon, authenticated;
grant select, insert, update, delete on public.push_subscriptions to authenticated;
drop policy if exists "captains manage their phones" on public.push_subscriptions;
create policy "captains manage their phones" on public.push_subscriptions
  for all to authenticated using (public.is_captain()) with check (public.is_captain());

-- ---------- delete orders older than 30 minutes ----------
create or replace function public.purge_old_orders() returns void
language sql security definer set search_path = '' as $$
  delete from public.orders where created_at < now() - interval '30 minutes';
$$;

-- ---------- what the captain screen reads (age is counted by the server clock) ----------
create or replace function public.captain_orders()
returns table (id uuid, code text, table_no int, items jsonb, notes text, total numeric, status text, age_seconds int)
language sql security definer set search_path = '' stable as $$
  select o.id, o.code, o.table_no, o.items, o.notes, o.total, o.status,
         extract(epoch from (now() - o.created_at))::int
  from public.orders o
  where public.is_captain() and o.created_at > now() - interval '30 minutes'
  order by o.created_at desc;
$$;

-- ---------- the only way customers can send an order ----------
-- Every line is checked against the published menu (item exists, is visible and in stock, price and size match),
-- and spam is limited, so nobody can invent items or prices.
create or replace function public.place_order(p_table text, p_items jsonb, p_notes text, p_device text default '')
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  m jsonb;
  s jsonb;
  tcount int;
  tno int;
  n int;
  it jsonb;
  v_item jsonb;
  v_size jsonb;
  v_qty int;
  v_price numeric;
  v_label text;
  v_total numeric := 0;
  clean jsonb := '[]'::jsonb;
  v_code text;
begin
  delete from public.orders where created_at < now() - interval '30 minutes';

  select data into m from public.menu where id = 1;
  if m is null then raise exception 'ordering_paused'; end if;
  s := coalesce(m -> 'settings', '{}'::jsonb);
  if coalesce(s ->> 'ordering', 'true') = 'false' then raise exception 'ordering_paused'; end if;

  if p_table is null or p_table !~ '^[0-9]{1,3}$' then raise exception 'invalid_table'; end if;
  tno := p_table::int;
  tcount := coalesce(nullif(s ->> 'tables', '')::int, 50);
  if tno < 1 or tno > tcount then raise exception 'invalid_table'; end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array'
     or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 40 then
    raise exception 'invalid_items';
  end if;
  p_notes := btrim(coalesce(p_notes, ''));
  if char_length(p_notes) > 300 then raise exception 'notes_too_long'; end if;
  p_device := left(coalesce(p_device, ''), 64);

  -- spam limits
  select count(*) into n from public.orders
    where p_device <> '' and device = p_device and created_at > now() - interval '5 minutes';
  if n >= 3 then raise exception 'rate_limited'; end if;
  select count(*) into n from public.orders
    where table_no = tno and created_at > now() - interval '5 minutes';
  if n >= 6 then raise exception 'rate_limited'; end if;
  select count(*) into n from public.orders where created_at > now() - interval '10 minutes';
  if n >= 120 then raise exception 'busy'; end if;

  for it in select e.value from jsonb_array_elements(p_items) e loop
    if jsonb_typeof(it) <> 'object' then raise exception 'invalid_items'; end if;
    begin
      v_qty := coalesce(nullif(it ->> 'qty', '')::int, 0);
      v_price := nullif(it ->> 'price', '')::numeric;
    exception when others then
      raise exception 'invalid_items';
    end;
    if v_qty < 1 or v_qty > 20 or v_price is null then raise exception 'invalid_items'; end if;
    v_label := coalesce(it ->> 'label', '');

    v_item := null;
    select i.value into v_item
    from jsonb_array_elements(m -> 'categories') c, jsonb_array_elements(c.value -> 'items') i
    where coalesce(c.value ->> 'visible', 'true') <> 'false'
      and i.value ->> 'id' = it ->> 'id'
      and coalesce(i.value ->> 'visible', 'true') <> 'false'
      and coalesce(i.value ->> 'available', 'true') <> 'false'
    limit 1;
    if v_item is null then raise exception 'item_unavailable'; end if;

    v_size := null;
    select p.value into v_size
    from jsonb_array_elements(v_item -> 'prices') p
    where nullif(p.value ->> 'price', '')::numeric = v_price
      and coalesce(p.value #>> '{label,ar}', '') = v_label
    limit 1;
    if v_size is null then raise exception 'item_unavailable'; end if;

    clean := clean || jsonb_build_object(
      'id', v_item ->> 'id',
      'name', coalesce(v_item #>> '{name,ar}', ''),
      'label', coalesce(v_size #>> '{label,ar}', ''),
      'price', v_price, 'qty', v_qty);
    v_total := v_total + v_price * v_qty;
  end loop;

  v_code := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
  insert into public.orders (code, table_no, items, notes, total, device)
    values (v_code, tno, clean, p_notes, v_total, p_device);

  return jsonb_build_object('code', v_code);
end;
$$;

revoke all on function public.place_order(text, jsonb, text, text) from public;
revoke all on function public.purge_old_orders() from public;
revoke all on function public.captain_orders() from public;
grant execute on function public.place_order(text, jsonb, text, text) to anon, authenticated;
grant execute on function public.purge_old_orders() to anon, authenticated;
grant execute on function public.captain_orders() to authenticated;

-- Optional: also clean up every 10 minutes even when nobody orders (enable the pg_cron extension first).
-- select cron.schedule('purge-orders', '*/10 * * * *', 'select public.purge_old_orders()');
