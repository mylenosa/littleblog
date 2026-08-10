alter table public.articles add column if not exists view_count integer not null default 0;

create or replace function public.increment_article_views(article_slug_input text)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.articles
  set view_count = view_count + 1
  where slug = article_slug_input;
end;
$$;

revoke all on function public.increment_article_views(text) from public;
grant execute on function public.increment_article_views(text) to anon, authenticated;
