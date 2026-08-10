create table public.comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (comment_id, user_id, emoji)
);

create index idx_comment_reactions_comment_id on public.comment_reactions(comment_id);

alter table public.comment_reactions enable row level security;

create policy "Comment reactions are viewable by everyone"
  on public.comment_reactions for select using (true);

create policy "Users can add their own comment reactions"
  on public.comment_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove their own comment reactions"
  on public.comment_reactions for delete
  using (auth.uid() = user_id);

grant select on public.comment_reactions to anon, authenticated;
grant insert, delete on public.comment_reactions to authenticated;

create table public.article_reactions (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  emoji text not null,
  created_at timestamptz not null default now(),
  unique (article_slug, user_id, emoji)
);

create index idx_article_reactions_slug on public.article_reactions(article_slug);

alter table public.article_reactions enable row level security;

create policy "Article reactions are viewable by everyone"
  on public.article_reactions for select using (true);

create policy "Users can add their own article reactions"
  on public.article_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can remove their own article reactions"
  on public.article_reactions for delete
  using (auth.uid() = user_id);

grant select on public.article_reactions to anon, authenticated;
grant insert, delete on public.article_reactions to authenticated;
