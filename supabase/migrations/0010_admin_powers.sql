-- Prevent any direct UPDATE (including self-updates) from changing is_editor.
create or replace function public.protect_is_editor()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.is_editor is distinct from old.is_editor
     and coalesce(current_setting('app.allow_editor_change', true), 'false') <> 'true' then
    new.is_editor := old.is_editor;
  end if;
  return new;
end;
$$;

create trigger protect_is_editor_column
  before update on public.profiles
  for each row execute function public.protect_is_editor();

-- The only sanctioned way to change is_editor: caller must already be an editor.
create or replace function public.admin_set_editor(target_user_id uuid, new_is_editor boolean)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_editor = true) then
    raise exception 'not authorized';
  end if;

  perform set_config('app.allow_editor_change', 'true', true);
  update public.profiles set is_editor = new_is_editor where id = target_user_id;
  perform set_config('app.allow_editor_change', 'false', true);
end;
$$;

revoke all on function public.admin_set_editor(uuid, boolean) from public, anon;
grant execute on function public.admin_set_editor(uuid, boolean) to authenticated;

-- Editors need to see who they can promote/demote (email isn't in profiles).
create or replace function public.admin_list_users()
returns table (
  id uuid,
  email text,
  full_name text,
  is_editor boolean,
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
  select u.id, u.email::text, p.full_name, p.is_editor, p.created_at
  from auth.users u
  join public.profiles p on p.id = u.id
  order by p.created_at desc;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;

-- Editors can moderate (delete) any comment, not just their own.
create policy "Editors can delete any comment"
  on public.comments for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );

-- Editors can read contact messages (previously write-only for everyone).
create policy "Editors can view contact messages"
  on public.contact_messages for select
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );
