insert into storage.buckets (id, name, public)
values ('article-media', 'article-media', true)
on conflict (id) do nothing;

create policy "Article media are publicly readable"
  on storage.objects for select
  using (bucket_id = 'article-media');

create policy "Editors can upload article media"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'article-media'
    and exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );

create policy "Editors can delete article media"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'article-media'
    and exists (select 1 from public.profiles where id = auth.uid() and is_editor = true)
  );
