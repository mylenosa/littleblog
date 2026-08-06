insert into storage.buckets (id, name, public)
values ('article-covers', 'article-covers', true)
on conflict (id) do nothing;

create policy "Article covers are publicly readable"
  on storage.objects for select
  using (bucket_id = 'article-covers');

create policy "Editors can upload article covers"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'article-covers'
    and exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );

create policy "Editors can update article covers"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'article-covers'
    and exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );

create policy "Editors can delete article covers"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'article-covers'
    and exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );
