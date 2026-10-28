-- LEQAA menu: sends a phone notification to the captains when a new order arrives.
-- Run AFTER orders.sql, and after you have deployed the "notify-captains" function (see README).
--
-- Change the two values marked CHANGE-ME:
--   1. PROJECT-REF: your project id (the part before .supabase.co in your Project URL)
--   2. PUT-A-LONG-RANDOM-SECRET-HERE: any long random text. Use the SAME text as the
--      WEBHOOK_SECRET value you save in the function's secrets.

create extension if not exists pg_net;

create or replace function public.notify_new_order() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  v_summary text;
begin
  select string_agg(
           (e.value ->> 'qty') || '× ' || (e.value ->> 'name') ||
           case when coalesce(e.value ->> 'label', '') <> '' then ' (' || (e.value ->> 'label') || ')' else '' end,
           '، ')
    into v_summary
    from jsonb_array_elements(new.items) e;

  perform net.http_post(
    url := 'https://PROJECT-REF.supabase.co/functions/v1/notify-captains',          -- CHANGE-ME
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', 'PUT-A-LONG-RANDOM-SECRET-HERE'                            -- CHANGE-ME
    ),
    body := jsonb_build_object(
      'table_no', new.table_no,
      'code', new.code,
      'items', jsonb_array_length(new.items),
      'summary', left(coalesce(v_summary, ''), 160),
      'notes', left(new.notes, 120)
    )
  );
  return new;
exception when others then
  return new;   -- a notification problem must never block the order itself
end;
$$;

drop trigger if exists on_new_order_notify on public.orders;
create trigger on_new_order_notify
  after insert on public.orders
  for each row execute function public.notify_new_order();
