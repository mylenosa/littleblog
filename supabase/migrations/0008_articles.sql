create table public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  content text not null,
  tags text[] not null default '{}',
  author_name text not null,
  cover_image_url text,
  featured boolean not null default false,
  featured_position integer not null default 0,
  published_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint slug_format check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

create index idx_articles_published_at on public.articles(published_at desc);
create index idx_articles_tags on public.articles using gin(tags);
create index idx_articles_featured on public.articles(featured, featured_position);

alter table public.articles enable row level security;

create policy "Articles are viewable by everyone"
  on public.articles for select
  using (true);

create policy "Editors can insert articles"
  on public.articles for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );

create policy "Editors can update articles"
  on public.articles for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  )
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );

create policy "Editors can delete articles"
  on public.articles for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );

create trigger set_articles_updated_at
  before update on public.articles
  for each row execute function public.set_updated_at();

grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;

drop table if exists public.featured_articles;
