alter table public.profiles add column if not exists can_comment boolean not null default true;

create or replace function public.protect_is_editor()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if coalesce(current_setting('app.allow_editor_change', true), 'false') <> 'true' then
    if new.is_editor is distinct from old.is_editor then
      new.is_editor := old.is_editor;
    end if;
    if new.can_comment is distinct from old.can_comment then
      new.can_comment := old.can_comment;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.admin_set_can_comment(target_user_id uuid, new_can_comment boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_editor = true
  ) then
    raise exception 'not authorized';
  end if;

  perform set_config('app.allow_editor_change', 'true', true);
  update public.profiles set can_comment = new_can_comment where id = target_user_id;
  perform set_config('app.allow_editor_change', 'false', true);
end;
$$;

revoke all on function public.admin_set_can_comment(uuid, boolean) from public, anon;
grant execute on function public.admin_set_can_comment(uuid, boolean) to authenticated;

drop policy "Authenticated users can insert their own comments" on public.comments;
create policy "Authenticated users can insert their own comments"
  on public.comments for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.can_comment = true
    )
  );

drop function if exists public.admin_list_users();

create function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  is_editor boolean,
  can_comment boolean,
  created_at timestamptz
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.is_editor = true
  ) then
    raise exception 'not authorized';
  end if;

  return query
  select u.id, u.email::text, p.full_name, p.is_editor, p.can_comment, p.created_at
  from auth.users u
  join public.profiles p on p.id = u.id
  order by p.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
