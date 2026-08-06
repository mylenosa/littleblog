create table public.featured_articles (
  article_slug text primary key,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.featured_articles enable row level security;

create policy "Featured articles are viewable by everyone"
  on public.featured_articles for select
  using (true);

create policy "Editors can manage featured articles"
  on public.featured_articles for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_editor = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_editor = true
    )
  );

create trigger set_featured_articles_updated_at
  before update on public.featured_articles
  for each row execute function public.set_updated_at();
