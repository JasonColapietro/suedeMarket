-- Storage bucket for listing images
insert into storage.buckets (id, name, public) values ('listing-images', 'listing-images', true);

-- Allow authenticated users to upload
create policy "Authenticated users can upload listing images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'listing-images');

-- Allow owners to update/delete their images
create policy "Users can update own listing images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own listing images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- Public read
create policy "Anyone can view listing images"
  on storage.objects for select
  using (bucket_id = 'listing-images');
