-- Try-on işlemleri tablosu
create table try_ons (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  model_image_path text not null,
  garment_image_path text not null,
  result_image_path text,
  category text not null,
  status text not null default 'pending',
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS politikaları
alter table try_ons enable row level security;

-- Kullanıcılar kendi kayıtlarını görebilir
create policy "Users can view their own try-ons"
  on try_ons for select
  using (auth.uid() = user_id);

-- Kullanıcılar kendi kayıtlarını oluşturabilir
create policy "Users can create their own try-ons"
  on try_ons for insert
  with check (auth.uid() = user_id);

-- Kullanıcılar kendi kayıtlarını güncelleyebilir
create policy "Users can update their own try-ons"
  on try_ons for update
  using (auth.uid() = user_id);

-- Realtime özelliğini aktifleştir
alter publication supabase_realtime add table try_ons; 