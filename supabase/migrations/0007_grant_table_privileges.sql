grant usage on schema public to anon, authenticated;

grant select, update on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.comments to anon, authenticated;
grant select, insert, delete on public.favorites to anon, authenticated;
grant select, insert on public.contact_messages to anon, authenticated;
grant select, insert, update, delete on public.featured_articles to anon, authenticated;
