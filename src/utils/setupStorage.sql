-- Storage için RLS politikaları
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (bucket_id in ('model-images', 'garment-images', 'result-images'));

create policy "Authenticated users can update images"
on storage.objects for update
to authenticated
with check (bucket_id in ('model-images', 'garment-images', 'result-images'));

create policy "Authenticated users can delete images"
on storage.objects for delete
to authenticated
using (bucket_id in ('model-images', 'garment-images', 'result-images'));

create policy "Authenticated users can view images"
on storage.objects for select
to authenticated
using (bucket_id in ('model-images', 'garment-images', 'result-images'));

create policy "Public can view result images"
on storage.objects for select
to public
using (bucket_id = 'result-images');

-- Storage trigger to set owner
create or replace function storage_set_owner()
returns trigger as $$
begin
  new.owner = auth.uid();
  return new;
end;
$$ language plpgsql security definer;

create trigger set_storage_owner
before insert on storage.objects
for each row
execute function storage_set_owner(); 